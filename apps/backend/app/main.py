from fastapi import FastAPI, File, Form, UploadFile, APIRouter
from utils.s3 import upload_to_s3
from utils.db import save_contract
from app.schemas import ContractUploadResponse

app = FastAPI()
router = APIRouter(prefix="/api")


@router.post("/contracts/upload", response_model=ContractUploadResponse)
async def upload_contract(
    file: UploadFile = File(...),
    metadata: str = Form(...),  # JSON string
    user: str = Form(...),
):
    """
    Uploads a contract file to S3 and saves metadata to MongoDB.
    """
    import json

    metadata_dict = json.loads(metadata)
    file_url = await upload_to_s3(file, user)
    contract_id = await save_contract(user, metadata_dict, file_url)
    return ContractUploadResponse(
        file_url=file_url, contract_id=contract_id, status="processing"
    )


app.include_router(router)
