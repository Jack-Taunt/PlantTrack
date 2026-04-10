from sqlalchemy.orm import Session
from app.models.Garden import Garden, GardenPlant
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.Image import GardenImage, GardenPlantImage

def create_garden_image_db(file_dir: Path, garden_id: int, db: Session):
    new_image = GardenImage(
        path_name=str(file_dir),
        garden_id=garden_id,
    )

    garden = db.query(Garden).filter(Garden.id == garden_id).first()
    garden.garden_images.append(new_image)

    db.add(new_image)
    return new_image


def get_garden_image_from_db(image_id: int, db: Session):
    image = db.query(GardenImage).filter(GardenImage.id == image_id).first()
    return image


def delete_garden_image_db(image_id: int, db: Session):
    db.query(GardenImage).filter(GardenImage.id == image_id).delete()


def create_garden_plant_image_db(file_dir: Path, garden_plant_id: int, db: Session):
    new_image = GardenPlantImage(
        path_name=str(file_dir),
        garden_plant_id=garden_plant_id,
    )

    garden = db.query(GardenPlant).filter(GardenPlant.id == garden_plant_id).first()
    garden.garden_plant_images.append(new_image)

    db.add(new_image)
    return new_image


def get_garden_plant_image_from_db(image_id: int, db: Session):
    image = db.query(GardenPlantImage).filter(GardenPlantImage.id == image_id).first()
    return image


def delete_garden_plant_image_db(image_id: int, db: Session):
    db.query(GardenPlantImage).filter(GardenPlantImage.id == image_id).delete()