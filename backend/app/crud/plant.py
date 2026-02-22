from app.models.Plant import Plant
from sqlalchemy.orm import Session

def get_public_plants_db(db: Session):
    garden_dict = (
        db.query(Plant)
        .all()
    )
    return garden_dict