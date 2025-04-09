from fastapi import APIRouter
from app.database import contests_collection
from app.models import Contest

router = APIRouter()

@router.post("/contests")
def create_contest(contest: Contest):
    contest_dict = contest.dict()
    res = contests_collection.insert_one(contest_dict)
    return {"id": str(res.inserted_id)}

@router.get("/contests")
def get_contests():
    contests = []
    for contest in contests_collection.find({}):
        contest['_id'] = str(contest['_id'])  # 👈 сериализация ObjectId
        contests.append(contest)
    return contests
