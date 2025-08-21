import os
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        load_dotenv(".env.local")
        self.MONGO_DB_URI = os.getenv("MONGO_DB_URI")
        self.S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")
        self.S3_REGION = os.getenv("S3_REGION")
        self.S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY_ID")
        self.S3_SECRET_ACCESS_KEY = os.getenv("S3_SECRET_ACCESS_KEY")

settings = Settings()
