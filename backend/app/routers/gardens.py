from fastapi import APIRouter, Depends
from app.schemas.Garden import GardenCreate, GardenOut, SectionOut
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User
from app.crud.garden import (get_user_gardens_db, 
                             get_public_gardens_db, 
                             get_garden_tags_db)
from app.services.garden_service import (delete_garden_service, 
                                         create_garden_service,
                                         get_garden_service)

router = APIRouter(
    prefix="/gardens",
    tags=["gardens"]
)


@router.post("/", response_model=GardenOut)
async def create_garden(
    garden: GardenCreate, 
    db: Annotated[Session, Depends(get_db)], 
    user: Annotated[User, Depends(get_current_user())]
): 
    return create_garden_service(garden, user, db)


@router.get("/me")
async def get_user_gardens(
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)],
):
    return get_user_gardens_db(user.id, db)
    


@router.get("/public", response_model=list[GardenOut])
async def get_public_gardens(
    db: Annotated[Session, Depends(get_db)]
):
    return get_public_gardens_db(db)


@router.get("/tags")
async def get_garden_tags(
    db: Annotated[Session, Depends(get_db)]
):
    return get_garden_tags_db(db)


@router.delete("/{garden_id}")
async def delete_garden(
    garden_id: int,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    return delete_garden_service(garden_id, user, db)
    

@router.get("/{garden_id}")
async def get_garden(
    garden_id: int,
    user: Annotated[User, Depends(get_current_user(False))],
    db: Annotated[Session, Depends(get_db)]
):
    return get_garden_service(garden_id, user, db)