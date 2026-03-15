from sqlalchemy.orm import Session
from app.schemas.User import User
from app.crud.garden import (create_garden_db, 
                             delete_garden_db, 
                             get_garden_db, 
                             create_garden_plant_db,
                             get_garden_plants_db,
                             create_garden_section_db,
                             edit_garden_section_db,
                             get_section_db,
                             delete_section_db)
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from app.schemas.Garden import (GardenCreate,
                                GardenPlantsCreate,
                                GardenSectionCreate,
                                GardenSectionUpdate)
from app.crud.plant import get_plant_db



def create_garden_service(garden: GardenCreate, user: User, db: Session):
    new_garden = create_garden_db(garden.name, garden.description, garden.is_public, garden.tags, user.id, db)
    db.flush()

    create_garden_section_db("Section 1", new_garden.id, db)
    db.commit()

    return new_garden


def delete_garden_service(garden_id: int, user: User, db: Session):
    garden = get_garden_db(garden_id, db)

    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )
    
    if (garden.user.id != user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
        
    delete_garden_db(garden_id, db)
    db.commit()
    json_response = JSONResponse(content={"message": "Deletion Successful"})
    return json_response


def get_garden_service(garden_id: int, user: User, db: Session):
    garden = get_garden_db(garden_id, db)

    if garden == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )

    if (garden.is_public == False) and (user == None or garden.user_id != user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
    
    return garden


def create_garden_plant_service(garden_id: int, garden_plants: GardenPlantsCreate, user: User, db: Session):
    garden = get_garden_db(garden_id, db)

    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )
    
    if (garden.user.id != user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
    
    for plant_amount in garden_plants.plants:
        plant = get_plant_db(plant_amount.plant_id, db)
        if plant == None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="This plant doesn't exist!",
            )
        
    section = get_section_db(garden_plants.section_id, db)
    if (section == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This section doesn't exist!",
        )
    
    if (section.garden_id != garden_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="This garden doesn't own this section!",
        )
    
    for plant_amount in garden_plants.plants:
        for _ in range(plant_amount.amount):
    
            create_garden_plant_db(garden_id, plant_amount.plant_id, garden_plants.planted_date, garden_plants.section_id, db)
    db.commit()
    

def get_garden_plant_service(garden_id: int, user: User, db: Session):
    garden = get_garden_db(garden_id, db)

    if garden == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )
    
    if (garden.is_public == False) and (user == None or garden.user_id != user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
        
    return get_garden_plants_db(garden_id, db)


def create_garden_section_service(garden_id: int, garden_section: GardenSectionCreate, user: User, db: Session):
    garden = get_garden_db(garden_id, db)

    if (garden == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden doesn't exist!",
        )

    if (garden.user.id != user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
    
    new_garden_section = create_garden_section_db(garden_section.name, garden_id, db)
    db.commit()
    return new_garden_section


def edit_garden_section_service(garden_id: int, section_id: int, garden_section: GardenSectionUpdate, user: User, db: Session):
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

    if (garden.user.id != user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
    
    new_garden_section = edit_garden_section_db(section_id, garden_section.name, garden_section.description, db)
    db.commit()
    db.refresh(new_garden_section)
    return new_garden_section


def delete_garden_section_service(garden_id: int, section_id: int, user: User, db: Session):
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
    
    if (garden.user.id != user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="You do not own this garden!",
        )
        
    delete_section_db(section_id, db)
    db.commit()
    return JSONResponse(content={"message": "Deletion Successful"})