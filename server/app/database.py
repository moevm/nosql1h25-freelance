import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "freelance_db")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
contests_collection = db["contests"]
solutions_collection = db["solutions"]
contest_types_collection = db["contest_types"]

def isClear() -> bool:
    if contest_types_collection.count_documents({}) == 0 and \
        users_collection.count_documents({}) == 0 and \
        solutions_collection.count_documents({}) == 0 and \
        contests_collection.count_documents({}) == 0: return True
    return False
