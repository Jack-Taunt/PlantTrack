from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.schemas.Garden import GardenCreate, GardenOut
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User
from app.crud.garden import create_garden_db, get_user_gardens_db, get_public_gardens_db, get_garden_tags_db, delete_garden_db, get_garden_db

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
    new_garden = create_garden_db(garden.name, garden.description, garden.is_public, garden.tags, user.id, db)
    return new_garden


@router.get("/me")
async def get_user_gardens(
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)],
):
    gardens = get_user_gardens_db(user.id, db)
    return gardens


@router.get("/public", response_model=list[GardenOut])
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


@router.delete("/{garden_id}")
async def delete_garden(
    garden_id: int,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    garden = get_garden_db(garden_id, db)
    if (garden.user.id == user.id):
        delete_garden_db(garden_id, db)
        json_response = JSONResponse(content={"message": "Deletion Successful"})
        return json_response

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
    

@router.get("/{garden_id}")
async def get_garden(
    garden_id: int,
    user: Annotated[User, Depends(get_current_user(False))],
    db: Annotated[Session, Depends(get_db)]
):
    garden = get_garden_db(garden_id, db)
    if garden != None:
        if not garden.is_public:
            if (not user or garden.user_id != user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail="You do not own this garden!",
                )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )

    return garden
