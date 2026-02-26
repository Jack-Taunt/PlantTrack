from pydantic import BaseModel, Field, PastDate
from typing import Annotated, List
from app.schemas.User import UserPublic
from app.schemas.Plant import PlantOut

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
    sections: List[Section]
    garden_plants: List[GardenPlant]


class Section(BaseModel):
    id: int
    name: str
    description: str


class GardenPlant(BaseModel):
    id: int
    planted_date: PastDate
    notes: str
    section_id: int
    plant: PlantOut


class Tag(BaseModel):
    id: int
    name: str