import os
from pymongo import MongoClient
from bson import ObjectId

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("DB_NAME", "freelance_db")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
contests_collection = db["contests"]
solutions_collection = db["solutions"]
contest_types_collection = db["contest_types"]

def initialize_data():
    if contest_types_collection.count_documents({}) == 0:
        contest_types_collection.insert_many([
            {'name': 'Программирование'},
            {'name': 'Дизайн'},
            {'name': 'Искусственный интеллект'},
        ])
    
    if users_collection.count_documents({}) == 0:
        users_collection.insert_many([
            {
                'email': 'admin@rambler.ru',
                'login': 'admin',
                'password': 'admin',
                'role': 3,
                'status': 1,
            },
            {
                'email': 'freelancer@mail.ru',
                'login': 'freelancer',
                'password': 'freelancer',
                'role': 1,
                'status': 1,
            },
            {
                'email': 'employer@yandex.ru',
                'login': 'employer',
                'password': 'employer',
                'role': 2,
                'status': 1,
            },
        ])

initialize_data()