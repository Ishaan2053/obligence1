import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_DB_URI = os.getenv("MONGO_DB_URI")

client = AsyncIOMotorClient(MONGO_DB_URI)
db = client["obligence"]
contracts_collection = db["contracts"]


async def save_to_db(user: str, metadata: dict, file_url: str) -> str:
    """Saves contract metadata to MongoDB and returns inserted ID"""
    contract = {
        "user": user,
        "metadata": metadata,
        "file_url": file_url,
        "status": "processing",
    }
    result = await contracts_collection.insert_one(contract)
    return str(result.inserted_id)
