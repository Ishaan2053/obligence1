from fastapi import (
    FastAPI,
    File,
    Form,
    UploadFile,
    APIRouter,
    BackgroundTasks,
    HTTPException,
)
from fastapi.middleware.cors import CORSMiddleware
from utils.s3 import upload_to_s3
from utils.db import (
    save_contract,
    create_analysis_job,
    update_analysis_job_status,
    get_analysis_job_status,
    save_analysis_result,
    get_analysis_result,
    resolve_clarification,
    get_clarification,
)
from app.schemas import (
    ContractUploadResponse,
    ContractAnalysisStatusResponse,
    ContractAnalysisResultResponse,
    ClarificationResponse,
    ClarificationListResponse,
    ClarificationListItem,
)
from app.agent import portia_client
import json

app = FastAPI(
    title="Enhanced Contract Analysis Agent",
    version="2.0.0",
    description="AI-powered contract analysis using Portia AI and Google Gemini",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://obligence.kyrexi.tech",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter(prefix="/api")


@router.post("/contracts/upload", response_model=ContractUploadResponse)
async def upload_contract(
    file: UploadFile = File(...),
    metadata: str = Form(...),
    user: str = Form(...),
    background_tasks: BackgroundTasks = None,
):
    metadata_dict = json.loads(metadata)
    file_url = await upload_to_s3(file, user)
    contract_id = await save_contract(user, metadata_dict, file_url)
    await create_analysis_job(contract_id, user)
    if background_tasks:
        background_tasks.add_task(
            analyze_contract_background, contract_id, user, file, file_url
        )
    return ContractUploadResponse(
        file_url=file_url, contract_id=contract_id, status="processing"
    )


async def analyze_contract_background(contract_id, user, file, file_url):
    try:
        await update_analysis_job_status(contract_id, "extracting")
        file_bytes = await file.read()
        pdf_result = portia_client.run_tool(
            "pdf_reader", file_content=file_bytes, filename=file.filename
        )
        if not pdf_result or not pdf_result.get("success"):
            await update_analysis_job_status(
                contract_id, "failed", error="PDF extraction failed"
            )
            return
        await update_analysis_job_status(contract_id, "analyzing")
        analysis_result = portia_client.run_tool(
            "comprehensive_contract_analyzer",
            pdf_text=pdf_result["text"],
            filename=file.filename,
        )
        await save_analysis_result(contract_id, user, analysis_result)
        await update_analysis_job_status(contract_id, "done")
    except Exception as e:
        await update_analysis_job_status(contract_id, "failed", error=str(e))


@router.get(
    "/contracts/status/{contract_id}", response_model=ContractAnalysisStatusResponse
)
async def get_contract_status(contract_id: str):
    job = await get_analysis_job_status(contract_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return ContractAnalysisStatusResponse(
        contract_id=contract_id,
        status=job.get("status", "unknown"),
        error=job.get("error"),
        updated_at=job.get("updated_at"),
    )


@router.get(
    "/contracts/result/{contract_id}", response_model=ContractAnalysisResultResponse
)
async def get_contract_result(contract_id: str):
    result = await get_analysis_result(contract_id)
    if not result:
        raise HTTPException(status_code=404, detail="Result not found")
    return ContractAnalysisResultResponse(
        contract_id=contract_id,
        result=result.get("result", {}),
        created_at=result.get("created_at"),
    )


# Clarification endpoints
@router.get(
    "/contracts/clarification/{contract_id}", response_model=ClarificationListResponse
)
async def get_clarifications_for_contract(contract_id: str):
    """
    Returns all clarifications raised by the Portia agent for a contract.
    """
    from utils.db import get_clarifications_for_contract

    clarifications = await get_clarifications_for_contract(contract_id)
    result = []
    for clar in clarifications:
        result.append(
            ClarificationListItem(
                id=str(clar.get("_id")),
                question=clar.get("question"),
                options=clar.get("options", []),
                status=clar.get("status", "pending"),
                priority=clar.get("priority", "medium"),
                created_at=clar.get("created_at"),
                resolved_at=clar.get("resolved_at"),
            )
        )
    return ClarificationListResponse(clarifications=result)


@router.post(
    "/contracts/clarification/resolve/{clarification_id}",
    response_model=ClarificationResponse,
)
async def resolve_clarification_endpoint(clarification_id: str, response: str):
    await resolve_clarification(clarification_id, response)
    clarification = await get_clarification(clarification_id)
    return ClarificationResponse(
        id=str(clarification["_id"]),
        contract_id=clarification["contract_id"],
        question=clarification["question"],
        response=clarification.get("response"),
        status=clarification["status"],
        priority=clarification["priority"],
        created_at=clarification.get("created_at"),
        resolved_at=clarification.get("resolved_at"),
    )


app.include_router(router)
