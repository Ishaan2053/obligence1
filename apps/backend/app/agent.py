from typing import Dict, List, Any
from app.config import settings
from portia import (
    Portia,
    Config,
    StorageClass,
    LogLevel,
    LLMProvider,
    tool,
    Clarification,
)
from portia.open_source_tools.pdf_reader_tool import PDFReaderTool


def create_portia_config():
    google_api_key = settings.GOOGLE_API_KEY
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is required")
    return Config.from_default(
        storage_class=StorageClass.LOCAL,
        default_log_level=LogLevel.INFO,
        llm_provider=LLMProvider.GOOGLE,
        default_model="google/gemini-2.5-flash-preview-04-17",
        google_api_key=google_api_key,
    )


@tool
def comprehensive_contract_analyzer(pdf_text: str, filename: str) -> Dict[str, Any]:
    analysis_prompt = f"""
    You are an expert legal contract analyst. Analyze the following contract text and provide a comprehensive structured analysis.
    IMPORTANT: Respond with a valid JSON object containing the following structure:
    {{
        "summary": "2-3 sentence summary in simple, non-legal language",
        "parties": [{{"name": "Party Name", "role": "Buyer/Seller/Licensor/etc", "contact_info": "email or address if available"}}],
        "dates": {{
            "effective_date": "YYYY-MM-DD or null",
            "termination_date": "YYYY-MM-DD or null", 
            "renewal_date": "YYYY-MM-DD or null",
            "signature_date": "YYYY-MM-DD or null"
        }},
        "obligations": [{{"party": "Party Name", "text": "Obligation description", "deadline": "date if any", "category": "payment/delivery/maintenance/etc"}}],
        "financial_terms": [{{"amount": "dollar amount", "currency": "USD/EUR/etc", "frequency": "monthly/annual/one-time", "description": "what the payment is for"}}],
        "risk_assessment": {{
            "risk_level": "Low/Medium/High",
            "risk_factors": ["list of potential risks or concerning clauses"],
            "recommendations": ["list of recommendations for review or action"]
        }},
        "confidence_score": 0.0-1.0,
        "unclear_sections": [{{"section": "section name", "issue": "what needs clarification", "priority": "high/medium/low"}}]
    }}
    Contract filename: {filename}
    Contract text:
    {pdf_text}
    Focus on:
    1. Clear identification of all parties and their roles
    2. All important dates (effective, termination, renewal, signatures)
    3. Financial obligations and payment terms
    4. Key responsibilities for each party
    5. Potential risks or concerning clauses
    6. Any ambiguous language that needs clarification
    Provide your analysis as a valid JSON object only, no additional text.
    """
    return {
        "analysis_prompt": analysis_prompt,
        "filename": filename,
        "text_length": len(pdf_text),
        "analysis_type": "comprehensive",
    }


@tool
def risk_analyzer(contract_text: str, parties: List[str]) -> Dict[str, Any]:
    risk_prompt = f"""
    As a legal risk analyst, analyze this contract for potential risks, issues, and red flags.
    Parties involved: {", ".join(parties)}
    Identify:
    1. Legal risks (unclear terms, missing clauses, unfavorable conditions)
    2. Financial risks (payment terms, penalties, hidden costs)
    3. Operational risks (unrealistic deadlines, unclear deliverables)
    4. Compliance risks (regulatory issues, missing requirements)
    Contract text:
    {contract_text[:3000]}...  # Truncate for token limits
    Provide risk level (Low/Medium/High) and specific recommendations.
    """
    return {
        "risk_analysis_prompt": risk_prompt,
        "parties": parties,
        "analysis_type": "risk_assessment",
    }


@tool
def raise_priority_clarification(
    question: str, context: str, priority: str = "medium"
) -> Clarification:
    # This is a stub for Portia's clarification tool
    return Clarification(
        request={"question": question, "context": context, "priority": priority}
    )

pdf_reader = PDFReaderTool()

enhanced_tools = [
    pdf_reader,
    comprehensive_contract_analyzer,
    risk_analyzer,
    raise_priority_clarification,
]


try:
    portia_config = create_portia_config()
    portia_client = Portia(config=portia_config, tools=enhanced_tools)
except Exception:
    portia_client = None
