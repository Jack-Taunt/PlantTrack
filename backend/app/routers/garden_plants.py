from fastapi import APIRouter, Depends, UploadFile
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User, UserOut
from app.schemas.GardenPlant import GardenPlantsCreate
from app.services.garden_plant_service import create_garden_plant_service, get_garden_plants_service, get_garden_plant_service
from app.schemas.GardenPlant import GardenPlant
from fastapi.responses import FileResponse
from app.schemas.Image import ImageOut
from app.services.image_service import upload_garden_plant_image_service, get_garden_plant_image_service, delete_garden_plant_image_service

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
async def get_garden_plants(
    garden_id: int,
    user: Annotated[User, Depends(get_current_user(False))],
    db: Annotated[Session, Depends(get_db)]
):
    return get_garden_plants_service(garden_id, user, db)


@router.get("/{garden_id}/plant/{plant_id}", response_model=GardenPlant)
async def get_garden_plant(
    garden_id: int,
    plant_id: int,
    user: Annotated[User, Depends(get_current_user(False))],
    db: Annotated[Session, Depends(get_db)]
):
    return get_garden_plant_service(garden_id, plant_id, user, db)


@router.post("/{garden_id}/plant/{plant_id}/uploadimage", response_model=ImageOut)
async def create_garden_image(
    garden_id: int,
    plant_id: int,
    file: UploadFile,
    user: Annotated[UserOut, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    image = await upload_garden_plant_image_service(garden_id, plant_id, file, user, db)
    return image


@router.get("/{garden_id}/plant/{plant_id}/image/{image_id}")
async def get_garden_image(
    garden_id: int,
    plant_id: int,
    image_id: int,
    user: Annotated[UserOut, Depends(get_current_user(False))],
    db: Annotated[Session, Depends(get_db)]
):
    image = get_garden_plant_image_service(garden_id, plant_id, image_id, user, db)
    return FileResponse(image.path_name)


@router.delete("/{garden_id}/plant/{plant_id}/image/{image_id}")
async def delete_garden_image(
    garden_id: int,
    plant_id: int,
    image_id: int,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    return delete_garden_plant_image_service(garden_id, plant_id, image_id, user, db)