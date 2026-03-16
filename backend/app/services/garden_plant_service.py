from sqlalchemy.orm import Session
from app.schemas.User import User
from app.crud.garden import get_garden_db
from app.crud.garden_section import get_section_db
from app.crud.garden_plant import (create_garden_plant_db, get_garden_plants_db)
from fastapi import HTTPException, status
from app.crud.plant import get_plant_db
from app.schemas.GardenPlant import GardenPlantsCreate


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