from fastapi import APIRouter, Depends, HTTPException, status
from app.database import get_db
from typing import Annotated
from sqlalchemy.orm import Session
from app.crud.plant import get_public_plants_db
from app.schemas.Plant import PlantOut

router = APIRouter(
    prefix="/plants",
    tags=["plants"]
)


@router.get("/public", response_model=list[PlantOut])
async def get_public_plants(
    db: Annotated[Session, Depends(get_db)]
):
    plants = get_public_plants_db(db)
    return plants