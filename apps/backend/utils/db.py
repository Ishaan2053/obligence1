from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from bson import ObjectId
from datetime import datetime

client = AsyncIOMotorClient(settings.MONGO_DB_URI)
db = client["Obligence"]
contracts_collection = db["contracts"]
analysis_jobs_collection = db["contract_analysis_jobs"]
analysis_results_collection = db["contract_analysis_results"]
clarifications_collection = db["clarifications"]


def serialize_document(doc):
    """Convert ObjectId fields to strings for JSON serialization."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_document(item) for item in doc]
    if isinstance(doc, dict):
        serialized = {}
        for key, value in doc.items():
            if isinstance(value, ObjectId):
                serialized[key] = str(value)
            elif isinstance(value, dict):
                serialized[key] = serialize_document(value)
            elif isinstance(value, list):
                serialized[key] = serialize_document(value)
            else:
                serialized[key] = value
        return serialized
    return doc


async def save_contract(user: str, metadata: dict, file_url: str) -> str:
    user_id = ObjectId(user)
    now = datetime.now()
    contract = {
        "user": user_id,
        "metadata": metadata,
        "file_url": file_url,
        "status": "processing",
        "created_at": now,
        "updated_at": now,
    }
    result = await contracts_collection.insert_one(contract)
    return str(result.inserted_id)


async def create_analysis_job(contract_id: str, user: str) -> str:
    job = {
        "contract_id": ObjectId(contract_id),
        "user": ObjectId(user),
        "status": "pending",
        "error": None,
        "created_at": datetime.now(),
        "updated_at": None,
    }
    result = await analysis_jobs_collection.insert_one(job)
    return str(result.inserted_id)


async def update_analysis_job_status(contract_id: str, status: str, error: str = None):
    update = {"status": status, "updated_at": datetime.now()}
    if error:
        update["error"] = error
    await analysis_jobs_collection.update_one(
        {"contract_id": ObjectId(contract_id)}, {"$set": update}
    )


async def update_contract_status(contract_id: str, status: str):
    await contracts_collection.update_one(
        {"_id": ObjectId(contract_id)},
        {"$set": {"status": status, "updated_at": datetime.now()}},
    )


async def get_analysis_job_status(contract_id: str):
    result = await analysis_jobs_collection.find_one(
        {"contract_id": ObjectId(contract_id)}
    )
    return serialize_document(result)


async def save_analysis_result(contract_id: str, user: str, result: dict):
    doc = {
        "contract_id": ObjectId(contract_id),
        "user": ObjectId(user),
        "result": result,
        "created_at": datetime.now(),
    }
    await analysis_results_collection.insert_one(doc)


async def get_analysis_result(contract_id: str, userid: str):
    result = await analysis_results_collection.find_one(
        {"contract_id": ObjectId(contract_id), "user": ObjectId(userid)}
    )
    return serialize_document(result)


async def get_all_analysis_results(
    userid: str, skip: int = 0, limit: int = 100, sort: str = "asc"
) -> list:
    cursor = (
        analysis_results_collection.find({"user": ObjectId(userid)})
        .skip(skip)
        .limit(limit)
        .sort("created_at", 1 if sort == "asc" else -1)
    )
    results = await cursor.to_list(length=limit)
    # Then populate the contract with the contract_id
    for item in results:
        contract_id = item["contract_id"]
        item["contract_id"] = str(contract_id)
        
        # Fetch the contract information
        contract = await contracts_collection.find_one({"_id": contract_id})
        if contract:
            item["contract"] = serialize_document(contract)
        else:
            item["contract"] = None
    return serialize_document(results)


async def create_clarification(
    contract_id: str, question: str, priority: str = "medium"
) -> str:
    clarification = {
        "contract_id": ObjectId(contract_id),
        "question": question,
        "priority": priority,
        "status": "open",
        "created_at": datetime.now(),
        "resolved_at": None,
        "response": None,
    }
    result = await clarifications_collection.insert_one(clarification)
    return str(result.inserted_id)


async def resolve_clarification(clarification_id: str, response: str):
    await clarifications_collection.update_one(
        {"_id": ObjectId(clarification_id)},
        {
            "$set": {
                "response": response,
                "status": "resolved",
                "resolved_at": datetime.now(),
            }
        },
    )


async def get_clarifications(contract_id: str) -> list:
    """
    Get all clarifications for a given contract_id.
    """
    cursor = clarifications_collection.find({"contract_id": ObjectId(contract_id)})
    results = await cursor.to_list(length=100)
    return serialize_document(results)


async def get_clarification(clarification_id: str) -> dict:
    """
    Get a single clarification by its ID.
    """
    result = await clarifications_collection.find_one(
        {"_id": ObjectId(clarification_id)}
    )
    return serialize_document(result)


async def star_analysis_result(contract_id: str, user: str):
    await analysis_results_collection.update_one(
        {"contract_id": ObjectId(contract_id), "user": ObjectId(user)},
        {"$set": {"starred": True}},
    )


async def unstar_analysis_result(contract_id: str, user: str):
    await analysis_results_collection.update_one(
        {"contract_id": ObjectId(contract_id), "user": ObjectId(user)},
        {"$set": {"starred": False}},
    )


async def get_starred_analysis_results(user: str) -> list:
    cursor = analysis_results_collection.find({"user": ObjectId(user), "starred": True})
    results = await cursor.to_list(length=100)
    return serialize_document(results)


async def delete_report(contract_id: str, user: str):
    await analysis_results_collection.delete_one(
        {"contract_id": ObjectId(contract_id), "user": ObjectId(user)}
    )


async def fetch_report(report_id: str, user: str) -> dict:
    result = await analysis_results_collection.find_one(
        {"_id": ObjectId(report_id), "user": ObjectId(user)}
    )
    return serialize_document(result)
