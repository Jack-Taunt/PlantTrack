from sqlalchemy.orm import Session
from app.models.Garden import Garden
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.Image import GardenImage

def create_garden_image_db(file_dir: Path, garden_id: int, db: Session):
    new_image = GardenImage(
        path_name=str(file_dir),
        garden_id=garden_id,
    )

    garden = db.query(Garden).filter(Garden.id == garden_id).first()
    garden.garden_images.append(new_image)

    db.add(new_image)
    return new_image