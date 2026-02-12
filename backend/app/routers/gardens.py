from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.Garden import Garden
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User
from app.crud.garden import create_garden as create_garden_db

router = APIRouter(
    prefix="/gardens",
    tags=["gardens"]
)


@router.post("/", response_model=Garden)
async def create_garden(
    garden: Garden, 
    db: Annotated[Session, Depends(get_db)], 
    _: Annotated[User, Depends(get_current_user)]
): 

    new_garden = create_garden_db(garden.name, garden.description, garden.is_public, db)
    return new_garden