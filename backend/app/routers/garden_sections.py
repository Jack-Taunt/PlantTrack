from fastapi import APIRouter, Depends
from app.schemas.GardenSection import GardenSectionCreate, GardenSectionUpdate, SectionOut
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User
from app.services.garden_section_service import create_garden_section_service, edit_garden_section_service, delete_garden_section_service

router = APIRouter(
    prefix="/gardens",
    tags=["gardens"]
)


@router.post("/{garden_id}/section", response_model=SectionOut)
async def create_garden_section(
    garden_id: int,
    garden_section: GardenSectionCreate,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    return create_garden_section_service(garden_id, garden_section, user, db)
    

@router.put("/{garden_id}/section/{section_id}")
async def edit_garden_section(
    garden_id: int,
    section_id: int,
    garden_section: GardenSectionUpdate,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    return edit_garden_section_service(garden_id, section_id, garden_section, user, db)


@router.delete("/{garden_id}/section/{section_id}")
async def delete_garden_section(
    garden_id: int,
    section_id: int,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    return delete_garden_section_service(garden_id, section_id, user, db)