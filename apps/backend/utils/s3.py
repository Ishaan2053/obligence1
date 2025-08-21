import boto3
import os
from fastapi import UploadFile

S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
S3_REGION = os.getenv("S3_REGION")
S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY_ID")
S3_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_ACCESS_KEY")

s3_client = boto3.client(
    "s3",
    region_name=S3_REGION,
    aws_access_key_id=S3_ACCESS_KEY_ID,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY,
)


async def upload_to_s3(file: UploadFile, user: str) -> str:
    """Uploads file to S3 and returns the file URL"""
    key = f"{user}/{file.filename}"
    s3_client.upload_fileobj(file.file, S3_BUCKET_NAME, key)
    file_url = f"https://{S3_BUCKET_NAME}.s3.{S3_REGION}.amazonaws.com/{key}"
    return file_url
