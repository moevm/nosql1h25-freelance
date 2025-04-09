from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel, Field

class Review(BaseModel):
    id: Optional[str]
    score: float
    commentary: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Solution(BaseModel):
    id: Optional[str]
    freelancerId: str
    description: str
    status: int
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updatedAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    reviews: List[Review] = []

class Contest(BaseModel):
    id: Optional[str] = Field(default=None)
    employerId: str
    title: str
    annotation: str
    prizepool: int
    description: str
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    endBy: datetime
    type: int
    status: int
    winnerId: Optional[str] = None
    solutions: List[Solution] = []

class User(BaseModel):
    id: Optional[str]
    email: str
    login: str
    password: str
    role: int
    status: int
    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
