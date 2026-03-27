from sqlalchemy.orm import Session
from app.schemas.User import User
from app.crud.garden import get_garden_db
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from app.schemas.GardenSection import GardenSectionCreate, GardenSectionUpdate
from app.crud.garden_section import edit_garden_section_db, delete_section_db, create_garden_section_db


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
    order = max(section.order for section in garden.sections) + 1
    new_garden_section = create_garden_section_db(garden_section.name, order, garden_id, db)
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
    
    new_garden_section = edit_garden_section_db(section_id, garden_section.name, garden_section.description, garden_section.order, db)
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