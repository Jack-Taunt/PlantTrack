from app.models.Plant import Plant
from sqlalchemy.orm import Session, joinedload

def get_public_plants_db(db: Session):
    garden_dict = (
        db.query(Plant)
        .options(joinedload(Plant.toxicity))
        .options(joinedload(Plant.edibility))
        .options(joinedload(Plant.environment))
        .options(joinedload(Plant.care_requirements))
        .options(joinedload(Plant.growth))
        .options(joinedload(Plant.planting))
        .all()
    )
    return garden_dict