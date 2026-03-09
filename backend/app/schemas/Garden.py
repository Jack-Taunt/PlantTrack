from pydantic import BaseModel, Field, field_validator
from typing import Annotated, List
from app.schemas.User import UserPublic
from app.schemas.Plant import PlantOut
from datetime import date

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
    planted_date: date | None
    notes: str | None
    garden_id: int
    plant: PlantOut


class GardenPlantsCreate(BaseModel):
    plants: List[int]
    planted_date: date | None
    
    @field_validator("planted_date")
    def check_date_past(cls, planted_date: date):
        if planted_date and planted_date > date.today():
            raise ValueError("Planted date cannot be in the future!")
        return planted_date


class Tag(BaseModel):
    id: int
    name: str