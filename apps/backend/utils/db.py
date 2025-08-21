from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_DB_URI)
db = client["obligence"]
contracts_collection = db["contracts"]

async def save_contract(user: str, metadata: dict, file_url: str) -> str:
    """Saves contract metadata to MongoDB and returns inserted ID"""
    contract = {
        "user": user,
        "metadata": metadata,
        "file_url": file_url,
        "status": "processing",
    }
    result = await contracts_collection.insert_one(contract)
    return str(result.inserted_id)
