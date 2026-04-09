from pydantic import BaseModel, Field, field_validator
from app.schemas.Plant import PlantOut
from datetime import date
from typing import Annotated, List
from app.schemas.Image import ImageOut


class GardenPlant(BaseModel):
    id: int
    planted_date: date | None
    notes: Annotated[str, Field(max_length=256)] | None
    garden_id: int
    plant: PlantOut
    garden_plant_images: List[ImageOut]


class GardenPlantAmount(BaseModel):
    plant_id: int
    amount: int


class GardenPlantsCreate(BaseModel):
    plants: List[GardenPlantAmount]
    planted_date: date | None
    section_id: int
    
    @field_validator("planted_date")
    def check_date_past(cls, planted_date: date):
        if planted_date and planted_date > date.today():
            raise ValueError("Planted date cannot be in the future!")
        return planted_date