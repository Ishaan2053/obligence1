import json
import logging
import re
from portia import PlanRunState, Portia
from portia.end_user import EndUser
from app.tools.plan_builder import plan
from utils.db import (
    update_analysis_job_status,
    save_analysis_result,
    update_contract_status,
    create_clarification,
    set_analysis_job_plan_run_id,
)
from app.agent import portia_config, complete_tool_registry
from pydantic import BaseModel
from app.tools.pdf_file import download_pdf_to_temp, remove_temp_files

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ContractAnalysisSchema(BaseModel):
    summary: str
    parties: list[dict]
    dates: dict[str, str | None]
    obligations: list[dict]
    financial_terms: list[dict]
    risk_assessment: dict
    confidence_score: float
    unclear_sections: list[dict]


async def analyze_contract_background(contract_id, user, file_url):
    temp_file_path = None
    try:
        portia = Portia(tools=complete_tool_registry, config=portia_config)
        temp_file_path = download_pdf_to_temp(file_url)
        end_user = EndUser(
            external_id="portia::873",
            name="Pranav Kumar",
            email="prnvtripathi14@gmail.com",
        )

        run = await portia.run_builder_plan(
            plan, plan_run_inputs={"pdf_file": temp_file_path}, end_user=end_user
        )

        # Persist plan_run_id on the job for potential resume
        try:
            await set_analysis_job_plan_run_id(contract_id, getattr(run, "id", None))
        except Exception:
            pass

        # Handle Portia clarifications if any were raised
        if run.state == PlanRunState.NEED_CLARIFICATION:
            logger.info("Plan run requires clarification(s). Persisting and pausing job.")
            try:
                # Collect and persist all outstanding clarifications
                outstanding = run.get_outstanding_clarifications()
                for c in outstanding:
                    try:
                        question = getattr(c, "user_guidance", None) or "Additional input required"
                        options = getattr(c, "options", None) or []
                        category = getattr(c, "category", None) or c.__class__.__name__
                        step = getattr(c, "step", None)
                        argument_name = (
                            getattr(c, "argument_name", None)
                            if hasattr(c, "argument_name")
                            else getattr(c, "argument", None)
                        )
                        clar_uuid = getattr(c, "uuid", None) or getattr(c, "id", None)
                        plan_run_id = getattr(run, "id", None)
                        await create_clarification(
                            contract_id,
                            question=question,
                            priority="high",
                            options=options,
                            category=category,
                            portia_plan_run_id=plan_run_id,
                            portia_clarification_id=clar_uuid,
                            step=step,
                            argument_name=argument_name,
                        )
                    except Exception as ce:
                        logger.error(f"Failed to persist clarification: {ce}")
                # Mark job/contract as awaiting clarification and return
                await update_analysis_job_status(contract_id, "needs_clarification")
                await update_contract_status(contract_id, "needs_clarification")
                return
            except Exception as e:
                # If persisting fails, mark as failed
                await update_analysis_job_status(contract_id, "failed", error=str(e))
                await update_contract_status(contract_id, "failed")
                logger.error(f"Error handling clarifications: {e}")
                return

        if run.state != PlanRunState.COMPLETE:
            raise Exception(
                f"Plan run failed with state {run.state}. Check logs for details."
            )

        # Extract the final output from the completed plan run in a robust way
        def _strip_code_fence(s: str) -> str:
            if not isinstance(s, str):
                return s
            s = s.strip()
            if s.startswith("```") and s.endswith("```"):
                # Remove the leading ```lang and trailing ```
                m = re.match(r"```[a-zA-Z0-9_-]*\s*(.*)```\s*\Z", s, flags=re.DOTALL)
                if m:
                    return m.group(1).strip()
            return s

        def _to_dict(obj):
            if obj is None:
                return None
            if isinstance(obj, dict):
                return obj
            if hasattr(obj, "model_dump"):
                return obj.model_dump()
            if hasattr(obj, "dict"):
                return obj.dict()
            if isinstance(obj, str):
                try:
                    return json.loads(_strip_code_fence(obj))
                except Exception:
                    return None
            try:
                # Last resort: try json on str(obj)
                return json.loads(str(obj))
            except Exception:
                return None

        analysis_result_raw = None
        # Prefer explicit final_output if available
        try:
            analysis_result_raw = run.outputs.final_output.value
        except Exception:
            analysis_result_raw = None

        if analysis_result_raw is None:
            raise Exception("No final output found from Portia run.")

        logger.debug(
            f"Raw Analysis Result: {analysis_result_raw}, type of: {type(analysis_result_raw)}"
        )
        analysis_result = _to_dict(analysis_result_raw)
        if not isinstance(analysis_result, dict):
            raise Exception("Final output could not be parsed into a dict.")

        # Normalize nested fields that may come as JSON strings
        for nested_key in ("dates", "risk_assessment"):
            if nested_key in analysis_result and isinstance(
                analysis_result[nested_key], str
            ):
                try:
                    analysis_result[nested_key] = json.loads(
                        _strip_code_fence(analysis_result[nested_key])
                    )
                except Exception:
                    pass

        logger.debug(f"Analysis Result (normalized): {analysis_result}")

        # Save the analysis result to the database
        await save_analysis_result(contract_id, user, analysis_result)

        # Update job and contract status to completed
        await update_analysis_job_status(contract_id, "completed")
        await update_contract_status(contract_id, "completed")

        logger.info(f"Analysis completed successfully for contract {contract_id}")

    except Exception as e:
        await update_analysis_job_status(contract_id, "failed", error=str(e))
        await update_contract_status(contract_id, "failed")
        logger.error(f"Analysis failed for contract {contract_id}: {e}")
    finally:
        if temp_file_path:
            remove_temp_files(temp_file_path)
