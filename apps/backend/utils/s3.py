import boto3
from fastapi import UploadFile
from app.config import settings

s3_client = boto3.client(
    "s3",
    region_name=settings.S3_REGION,
    aws_access_key_id=settings.S3_ACCESS_KEY_ID,
    aws_secret_access_key=settings.S3_SECRET_ACCESS_KEY,
)

async def upload_to_s3(file: UploadFile, user: str) -> str:
    """Uploads file to S3 and returns the file URL"""
    key = f"{user}/{file.filename}"
    s3_client.upload_fileobj(file.file, settings.S3_BUCKET_NAME, key)
    file_url = f"https://{settings.S3_BUCKET_NAME}.s3.{settings.S3_REGION}.amazonaws.com/{key}"
    return file_url
