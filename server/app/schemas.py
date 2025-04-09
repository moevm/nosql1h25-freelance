from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import List, Optional


class Review(BaseModel):
    score: float
    commentary: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Solution(BaseModel):
    freelancerId: str
    description: str
    status: int = 1
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
    type: int
    status: int = 1
    winnerId: Optional[str] = None
    solutions: List[Solution] = []


class User(BaseModel):
    email: str
    login: str
    password: str
    role: int
    status: int = 1
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


def validate_contest(data: dict) -> dict:
    return Contest(**data).dict()

def validate_user(data: dict) -> dict:
    return User(**data).dict()
