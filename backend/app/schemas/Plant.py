from pydantic import BaseModel, Field
from typing import Annotated, List

class PlantOut(BaseModel):
    id: int
    common_name: str | None
    scientific_name: str
    family: str | None
    genus: str | None
    order: str | None
    class_: str | None
    phylum: str | None
    variety: str | None

    toxicity: Toxicity | None
    edibility: Edibility | None
    environment: Environment | None
    care_requirements: CareRequirements | None
    growth: Growth | None
    planting: Planting | None




class Toxicity(BaseModel):
    toxic_to_cats: bool | None
    toxic_to_dogs: bool | None
    toxic_to_humans: bool | None
    toxicity: str | None


class Edibility(BaseModel):
    edible_fruit: bool | None
    edible_leaves: bool | None
    edible_flowers: bool | None
    edible_roots: bool | None


class Environment(BaseModel):
    light_type: str | None
    min_temp: float | None
    max_temp: float | None
    min_humidity: float | None
    max_humidity: float | None
    min_usda_zone: str | None
    max_usda_zone: str | None


class CareRequirements(BaseModel):
    min_water_frequency: int | None
    max_water_frequency: int | None
    soil_moisture: str | None
    drought_tolerant: bool | None
    soil_type: str | None
    min_soil_ph: float | None
    max_soil_ph: float | None
    fertilizer_frequency: int | None
    fertilizer_nitrogen: int | None
    fertilizer_phosphorus: int | None
    fertilizer_potassium: int | None


class Growth(BaseModel):
    annual: bool | None
    biennial: bool | None
    perennial: bool | None
    max_height: float | None
    max_width: float | None
    growth_rate: str | None
    min_days_to_harvest: int | None
    max_days_to_harvest: int | None


class Planting(BaseModel):
    spacing: float | None
    seed_depth: float | None
    direct_sow: bool | None
    transplant: bool | None
    propagation: bool | None