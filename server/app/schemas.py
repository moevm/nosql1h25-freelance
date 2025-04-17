from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import List, Optional


class User(BaseModel):
    email: str
    login: str
    password: str
    role: int    # 1 -  Фрилансер, 2 - Заказчик 3 - Админ
    status: int = 1    # 1 - Активный, 2 - Заблокированный
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Review(BaseModel):
    score: float
    commentary: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Solution(BaseModel):
    contestId: str
    freelancerId: str
    description: str
    status: int = 1    # 1 - Новое, 2 - Просмотрено, 3 - Победитель, 4 - Необходимы правки, 5 - Правки внесены
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviews: List[Review] = []


class Contest(BaseModel):
    employerId: str
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
    name: str


def validate_user(data: dict) -> dict:
    return User(**data).dict()


def validate_review(data: dict) -> dict:
    return Review(**data).dict()


def validate_solution(data: dict) -> dict:
    return Solution(**data).dict()


def validate_contest(data: dict) -> dict:
    return Contest(**data).dict()


def validate_contest_type(data: dict) -> dict:
    return Contest(**data).dict()
