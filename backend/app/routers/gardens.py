from fastapi import APIRouter, Depends
from app.schemas.Garden import GardenCreate, GardenOut
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User
from app.crud.garden import create_garden_db, get_user_gardens_db, get_public_gardens_db, get_garden_tags_db

router = APIRouter(
    prefix="/gardens",
    tags=["gardens"]
)


@router.post("/", response_model=GardenOut)
async def create_garden(
    garden: GardenCreate, 
    db: Annotated[Session, Depends(get_db)], 
    user: Annotated[User, Depends(get_current_user)]
): 
    new_garden = create_garden_db(garden.name, garden.description, garden.is_public, garden.tags, user.id, db)
    return new_garden


@router.get("/me")
async def get_user_gardens(
    user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    gardens = get_user_gardens_db(user.id, db)
    return gardens


@router.get("/public")
async def get_public_gardens(
    db: Annotated[Session, Depends(get_db)]
):
    gardens = get_public_gardens_db(db)
    return gardens


@router.get("/tags")
async def get_garden_tags(
    db: Annotated[Session, Depends(get_db)]
):
    tags = get_garden_tags_db(db)
    return tags