from sqlalchemy.orm import Session
from app.models.Garden import Garden

def get_user_gardens(user_id: int, db: Session):
    garden_dict = db.query(Garden)
    print(garden_dict)


def create_garden(name: str, description: str, is_public: bool, db: Session):
    new_garden = Garden(
        name=name,
        description=description,
        is_public=is_public,
    )
    db.add(new_garden)
    db.commit()
    db.refresh(new_garden)
    return new_garden