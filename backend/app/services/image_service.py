from fastapi import UploadFile
from pathlib import Path
from app.schemas.User import User
from sqlalchemy.orm import Session
import os
from app.crud.image import create_garden_image_db
from app.crud.garden import get_garden_db
from fastapi import HTTPException, status

UPLOAD_DIR = Path("uploads")

async def upload_garden_file(garden_id: int, file: UploadFile, user: User, db: Session):
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

    file_path = UPLOAD_DIR / user_path / file.filename

    await upload_file(file_path, file)
    create_garden_image_db(file_path, garden_id, db)
    db.commit()

    return file_path

        
async def upload_file(file_path: Path, file: UploadFile):

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)