from pydantic import BaseModel, Field
from typing import Annotated, List
from app.schemas.User import UserPublic
from app.schemas.GardenPlant import GardenPlant
from app.schemas.GardenSection import SectionOut

class GardenCreate(BaseModel):
    name: Annotated[str, Field(max_length=30)]
    description: Annotated[str, Field(max_length=256)]
    is_public: bool
    tags: Annotated[list[int], Field(max_length=5)]


class GardenOut(BaseModel):
    id: int
    name: str
    description: str
    is_public: bool
    tags: List[Tag]
    user: UserPublic
    sections: List[SectionOut]
    garden_plants: List[GardenPlant]


class Tag(BaseModel):
    id: int
    name: str