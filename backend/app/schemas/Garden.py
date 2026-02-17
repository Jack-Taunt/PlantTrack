from pydantic import BaseModel, Field
from typing import Annotated, List
from app.schemas.User import UserPublic

class GardenCreate(BaseModel):
    name: Annotated[str, Field(max_length=20)]
    description: Annotated[str, Field(max_length=256)]
    is_public: bool
    tags: List[int]


class GardenOut(BaseModel):
    id: int
    name: str
    description: str
    is_public: bool
    tags: List[Tag]
    user: UserPublic


class Tag(BaseModel):
    id: int
    name: str