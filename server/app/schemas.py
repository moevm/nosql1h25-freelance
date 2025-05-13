from pydantic import BaseModel, Field, validator
from datetime import datetime, timezone
from typing import List, Optional


class User(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    email: str
    login: str
    password: str
    role: int    # 1 -  Фрилансер, 2 - Заказчик 3 - Админ
    status: int = 1    # 1 - Активный, 2 - Заблокированный
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Review(BaseModel):
    number: Optional[int] = None    # Порядковый номер для url страницы отзыва
    reviewerId: Optional[str] = None
    id: Optional[str] = Field(default=None, alias="_id")
    score: float
    commentary: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Solution(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    contestId: str
    freelancerId: str
    number: Optional[int] = None
    title: str
    annotation: str
    description: str
    files: List[str] = []
    status: int = 1
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviews: List[Review] = []


class Contest(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    employerId: str    # ObjectId(User._id)
    number: Optional[int] = None    # Порядковый номер для url страницы конкурса
    title: str
    annotation: str
    prizepool: int
    description: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    endBy: datetime
    type: str
    status: int = 1    # 1 - Активный, 2 - На проверке, 3 - Завершённый, 4 - Отменённый
    files: List[str] = []
    winnerId: Optional[str] = None


class ContestType(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    name: str


def validate_user(data: dict) -> dict:
    return User(**data).dict(by_alias=True, exclude_none=True)

def validate_review(data: dict) -> dict:
    return Review(**data).dict(by_alias=True, exclude_none=True)

def validate_solution(data: dict) -> dict:
    return Solution(**data).dict(by_alias=True, exclude_none=True)

def validate_contest(data: dict) -> dict:
    return Contest(**data).dict(by_alias=True, exclude_none=True)

def validate_contest_type(data: dict) -> dict:
    return ContestType(**data).dict(by_alias=True, exclude_none=True)

