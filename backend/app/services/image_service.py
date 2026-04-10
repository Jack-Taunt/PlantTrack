from fastapi import UploadFile
from pathlib import Path
from app.schemas.User import UserOut
from sqlalchemy.orm import Session
import os
from app.crud.image import (create_garden_image_db, 
                            get_garden_image_from_db, 
                            delete_garden_image_db, 
                            create_garden_plant_image_db,
                            get_garden_plant_image_from_db,
                            delete_garden_plant_image_db)
from app.crud.garden import get_garden_db
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from datetime import datetime
from app.crud.garden_plant import get_garden_plant_db

UPLOAD_DIR = Path("uploads")

async def upload_file_service(file_path: Path, file: UploadFile):

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)


def generate_file_path(user_id: int, filename: str):
    user_path = "user_" + str(user_id)
    base_dir = UPLOAD_DIR / user_path

    if not os.path.isdir(base_dir):
        os.mkdir(base_dir)

    time_stamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    file_path = UPLOAD_DIR / user_path / (time_stamp + "_" + filename)

    return file_path


async def upload_garden_image_service(garden_id: int, file: UploadFile, user: UserOut, db: Session):
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

    file_path = generate_file_path(user.id, file.filename)

    await upload_file_service(file_path, file)
    image = create_garden_image_db(file_path, garden_id, db)
    db.commit()

    return image


def get_garden_image_service(garden_id: int, image_id: str, user: UserOut, db: Session):
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
    
    image = get_garden_image_from_db(image_id, db)
    if image == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This image doesn't exist!",
        )
    
    return image


def delete_garden_image_service(garden_id: int, image_id: int, user: UserOut, db: Session):
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
    
    if not any([image.id == image_id for image in garden.garden_images]):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This image doesn't exist!",
        )
    
    image = get_garden_image_from_db(image_id, db)
    delete_garden_image_db(image_id, db)

    if os.path.exists(image.path_name):
        os.remove(image.path_name)

    db.commit()
    
    json_response = JSONResponse(content={"message": "Deletion Successful"})
    return json_response


async def upload_garden_plant_image_service(garden_id: int, garden_plant_id: int, file: UploadFile, user: UserOut, db: Session):
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
    
    garden_plant = get_garden_plant_db(garden_plant_id, db)
    if (garden_plant == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden plant doesn't exist!",
        )

    file_path = generate_file_path(user.id, file.filename)

    await upload_file_service(file_path, file)
    image = create_garden_plant_image_db(file_path, garden_plant_id, db)
    db.commit()

    return image


def get_garden_plant_image_service(garden_id: int, garden_plant_id: int, image_id: str, user: UserOut, db: Session):
    
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
    
    garden_plant = get_garden_plant_db(garden_plant_id, db)
    if (garden_plant == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden plant doesn't exist!",
        )
    
    image = get_garden_plant_image_from_db(image_id, db)
    if image == None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This image doesn't exist!",
        )
    
    return image


def delete_garden_plant_image_service(garden_id: int, garden_plant_id: int, image_id: int, user: UserOut, db: Session):
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
    
    garden_plant = get_garden_plant_db(garden_plant_id, db)
    if (garden_plant == None):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This garden plant doesn't exist!",
        )
    
    if not any([image.id == image_id for image in garden_plant.garden_plant_images]):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="This image doesn't exist!",
        )
    
    image = get_garden_plant_image_from_db(image_id, db)
    delete_garden_plant_image_db(image_id, db)

    if os.path.exists(image.path_name):
        os.remove(image.path_name)

    db.commit()
    
    json_response = JSONResponse(content={"message": "Deletion Successful"})
    return json_response