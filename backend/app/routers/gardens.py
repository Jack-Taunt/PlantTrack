from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from app.schemas.Garden import GardenCreate, GardenOut, GardenPlantsCreate, GardenSectionCreate, GardenSectionUpdate, SectionOut
from typing import Annotated
from sqlalchemy.orm import Session
from app.auth.dependencies import get_current_user
from app.database import get_db
from app.schemas.User import User
from app.crud.garden import (create_garden_db, 
                             get_user_gardens_db, 
                             get_public_gardens_db, 
                             get_garden_tags_db, 
                             delete_garden_db, 
                             get_garden_db, 
                             create_garden_plants_db,
                             get_garden_plants_db,
                             create_garden_section_db,
                             edit_garden_section_db,
                             get_section_db,
                             delete_section_db)
from app.crud.plant import get_plant_db

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
    create_garden_section_db("Section 1", new_garden.id, db)
    
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
    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )
    
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


@router.post("/{garden_id}/plants")
async def create_garden_plant(
    garden_id: int,
    gardenPlants: GardenPlantsCreate,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    garden = get_garden_db(garden_id, db)

    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )

    if (garden.user.id == user.id):
        for plant_amount in gardenPlants.plants:
            plant = get_plant_db(plant_amount.plant_id, db)
            if plant == None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, 
                    detail="This plant doesn't exist!",
                )
            
        section = get_section_db(gardenPlants.section_id, db)
        if (section):
            if (section.garden_id != garden_id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN, 
                    detail="This garden doesn't own this section!",
                )
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="This section doesn't exist!",
            )
        
        create_garden_plants_db(garden_id, gardenPlants.plants, gardenPlants.planted_date, gardenPlants.section_id, db)

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
    

@router.get("/{garden_id}/plants")
async def get_garden_plant(
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
    
    garden_plants = get_garden_plants_db(garden_id, db)
    return garden_plants



@router.post("/{garden_id}/section", response_model=SectionOut)
async def create_garden_section(
    garden_id: int,
    garden_section: GardenSectionCreate,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    garden = get_garden_db(garden_id, db)

    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )

    if (garden.user.id == user.id):

        section = create_garden_section_db(garden_section.name, garden_id, db)
        return section
    
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
    

@router.put("/{garden_id}/section/{section_id}")
async def create_garden_section(
    garden_id: int,
    section_id: int,
    garden_section: GardenSectionUpdate,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    garden = get_garden_db(garden_id, db)
    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )
    
    if not any([section.id == section_id for section in garden.sections]):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This section doesn't exist!",
        )

    if (garden.user.id == user.id):

        section = edit_garden_section_db(section_id, garden_section.name, garden_section.description, db)
        return section
    
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )


@router.delete("/{garden_id}/section/{section_id}")
async def delete_section(
    garden_id: int,
    section_id: int,
    user: Annotated[User, Depends(get_current_user())],
    db: Annotated[Session, Depends(get_db)]
):
    garden = get_garden_db(garden_id, db)
    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )
    
    if not any([section.id == section_id for section in garden.sections]):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This section doesn't exist!",
        )
    
    if (garden.user.id == user.id):
        delete_section_db(section_id, db)
        json_response = JSONResponse(content={"message": "Deletion Successful"})
        return json_response

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )