from app.models.Plant import Plant
from sqlalchemy.orm import Session, joinedload

def get_public_plants_db(db: Session):
    plants_dict = (
        db.query(Plant)
        .options(joinedload(Plant.toxicity))
        .options(joinedload(Plant.edibility))
        .options(joinedload(Plant.environment))
        .options(joinedload(Plant.care_requirements))
        .options(joinedload(Plant.growth))
        .options(joinedload(Plant.planting))
        .all()
    )
    return plants_dict


def get_plant_db(plant_id: int, db: Session):
    plant_dict = (
        db.query(Plant)
        .filter(Plant.id == plant_id)
        .options(joinedload(Plant.toxicity))
        .options(joinedload(Plant.edibility))
        .options(joinedload(Plant.environment))
        .options(joinedload(Plant.care_requirements))
        .options(joinedload(Plant.growth))
        .options(joinedload(Plant.planting))
        .first()
    )
    return plant_dict