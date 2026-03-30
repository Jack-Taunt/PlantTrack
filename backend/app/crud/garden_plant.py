from app.models.Garden import GardenPlant
from datetime import date
from sqlalchemy.orm import Session, joinedload

def create_garden_plant_db(garden_id: int, plant: int, planted_date: date, section_id: int, db: Session):
    garden_plant = GardenPlant(garden_id=garden_id, plant_id=plant, planted_date=planted_date, section_id=section_id)
    db.add(garden_plant)


def get_garden_plants_db(garden_id: int, db: Session):
    garden_plants_dict = (
        db.query(GardenPlant)
        .filter(GardenPlant.garden_id == garden_id)
        .options(joinedload(GardenPlant.plant))
        .all()
    )
    return garden_plants_dict


def get_garden_plant_db(plant_id: int, db: Session):
    garden_plant_dict = (
        db.query(GardenPlant)
        .filter(GardenPlant.id == plant_id)
        .options(joinedload(GardenPlant.plant))
        .first()
    )
    return garden_plant_dict