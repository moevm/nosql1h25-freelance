from fastapi import APIRouter
from app.database import users_collection
from app.models import User

router = APIRouter()

@router.post("/users")
def create_user(user: User):
    user_dict = user.dict()
    res = users_collection.insert_one(user_dict)
    return {"id": str(res.inserted_id)}

@router.get("/users")
def get_users():
    return list(users_collection.find({}, {"password": 0}))