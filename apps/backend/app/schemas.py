# Request/Response schemas for API endpoints
from fastapi import UploadFile
from pydantic import BaseModel
from typing import Dict


class ContractUploadRequest(BaseModel):
    file: UploadFile
    user: str
    metadata: Dict[str, str]


class ContractUploadResponse(BaseModel):
    file_url: str
    contract_id: str
    status: str
