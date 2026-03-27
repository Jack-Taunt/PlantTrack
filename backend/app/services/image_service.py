from fastapi import UploadFile
from pathlib import Path
from app.schemas.User import UserOut
from sqlalchemy.orm import Session
import os
from app.crud.image import create_garden_image_db, get_garden_image_from_db, delete_garden_image_db
from app.crud.garden import get_garden_db
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from datetime import datetime

UPLOAD_DIR = Path("uploads")

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

    user_path = "user_" + str(user.id)
    base_dir = UPLOAD_DIR / user_path

    if not os.path.isdir(base_dir):
        os.mkdir(base_dir)

    time_stamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')

    file_path = UPLOAD_DIR / user_path / (time_stamp + "_" + file.filename)

    await upload_file_service(file_path, file)
    image = create_garden_image_db(file_path, garden_id, db)
    db.commit()

    return image

        
async def upload_file_service(file_path: Path, file: UploadFile):

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)


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