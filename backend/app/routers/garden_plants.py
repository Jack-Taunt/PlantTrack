from fastapi import APIRouter, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User
from app.schemas.GardenPlant import GardenPlantsCreate
from app.services.garden_plant_service import create_garden_plant_service, get_garden_plant_service


router = APIRouter(
    prefix="/gardens",
    tags=["gardens"]
)


@router.post("/{garden_id}/plants")
async def create_garden_plant(
    garden_id: int,
    garden_plants: GardenPlantsCreate,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    return create_garden_plant_service(garden_id, garden_plants, user, db)
    

@router.get("/{garden_id}/plants")
async def get_garden_plant(
    garden_id: int,
    user: Annotated[User, Depends(get_current_user(False))],
    db: Annotated[Session, Depends(get_db)]
):
    return get_garden_plant_service(garden_id, user, db)