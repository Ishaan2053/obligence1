from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.MONGO_DB_URI)
db = client["obligence"]
contracts_collection = db["contracts"]
analysis_jobs_collection = db["contract_analysis_jobs"]
analysis_results_collection = db["contract_analysis_results"]
clarifications_collection = db["clarifications"]


async def save_contract(user: str, metadata: dict, file_url: str) -> str:
    contract = {
        "user": user,
        "metadata": metadata,
        "file_url": file_url,
        "status": "processing",
    }
    result = await contracts_collection.insert_one(contract)
    return str(result.inserted_id)


async def create_analysis_job(contract_id: str, user: str) -> str:
    job = {
        "contract_id": contract_id,
        "user": user,
        "status": "pending",
    }
    result = await analysis_jobs_collection.insert_one(job)
    return str(result.inserted_id)


async def update_analysis_job_status(contract_id: str, status: str, error: str = None):
    update = {"status": status}
    if error:
        update["error"] = error
    await analysis_jobs_collection.update_one(
        {"contract_id": contract_id}, {"$set": update}
    )


async def get_analysis_job_status(contract_id: str):
    return await analysis_jobs_collection.find_one({"contract_id": contract_id})


async def save_analysis_result(contract_id: str, user: str, result: dict):
    doc = {
        "contract_id": contract_id,
        "user": user,
        "result": result,
    }
    await analysis_results_collection.insert_one(doc)


async def get_analysis_result(contract_id: str):
    return await analysis_results_collection.find_one({"contract_id": contract_id})


async def create_clarification(
    contract_id: str, question: str, priority: str = "medium"
) -> str:
    clarification = {
        "contract_id": contract_id,
        "question": question,
        "priority": priority,
        "status": "open",
    }
    result = await clarifications_collection.insert_one(clarification)
    return str(result.inserted_id)


async def resolve_clarification(clarification_id: str, response: str):
    await clarifications_collection.update_one(
        {"_id": clarification_id},
        {"$set": {"response": response, "status": "resolved"}},
    )

async def get_clarifications_for_contract(contract_id: str) -> list:
    """
    Get all clarifications for a given contract_id.
    """
    cursor = clarifications_collection.find({"contract_id": contract_id})
    return await cursor.to_list(length=100)
