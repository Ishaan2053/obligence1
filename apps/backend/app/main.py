import json
from fastapi import FastAPI, File, Form, UploadFile, APIRouter
from dotenv import load_dotenv

from utils.s3 import upload_to_s3
from utils.db import save_to_db

load_dotenv(".env.local")  # Load .env.local file

app = FastAPI()

router = APIRouter(prefix="/api")


@router.post("/contracts/upload")
async def upload_contract(
    file: UploadFile = File(...),
    metadata: str = Form(...),  # JSON string
    user: str = Form(...),
):
    """
    Uploads a contract file to S3 and saves metadata to MongoDB.

    **Request Body**
    - `file`: The contract file to upload (multipart/form-data)
    - `metadata`: JSON string containing contract metadata
    - `user`: The user uploading the contract

    **Response**
    - `contract_id`: The ID of the uploaded contract
    - `status`: The status of the upload (e.g., "processing/extracted/failed")
    """
    # Parse metadata JSON
    metadata_dict = json.loads(metadata)

    # Upload file to S3
    file_url = await upload_to_s3(file, user)

    # Save to MongoDB
    contract_id = await save_to_db(user, metadata_dict, file_url)

    return {"contract_id": contract_id, "status": "processing"}


app.include_router(router)
