from sqlalchemy.orm import Session, joinedload
from app.models.Garden import Garden, Tag
from app.models.User import User
from app.models.Garden import GardenPlant
from datetime import date

def get_garden_db(garden_id: int, db: Session):
    garden_dict = (
        db.query(Garden)
        .filter(Garden.id == garden_id)
        .options(joinedload(Garden.tags))
        .first()

    )
    return garden_dict


def get_user_gardens_db(user_id: int, db: Session):
    garden_dict = (
        db.query(Garden)
        .options(joinedload(Garden.user))
        .filter(Garden.user_id == user_id)
        .options(joinedload(Garden.tags))
        .all()
    )
    return garden_dict


def get_public_gardens_db(db: Session):
    garden_dict = (
        db.query(Garden)
        .options(joinedload(Garden.user))
        .filter(Garden.is_public == True)
        .options(joinedload(Garden.tags))
        .all()
    )
    return garden_dict


def create_garden_db(name: str, description: str, is_public: bool, tags: list[int], user_id: int, db: Session):
    new_garden = Garden(
        name=name,
        description=description,
        is_public=is_public,
    )

    user = db.query(User).filter(User.id == user_id).first()
    user.gardens.append(new_garden)

    if tags:
        tags_db = db.query(Tag).filter(Tag.id.in_(tags)).all()
        new_garden.tags.extend(tags_db)

    db.add(new_garden)
    db.commit()
    db.refresh(new_garden)
    return new_garden


def get_garden_tags_db(db: Session):
    tag_dict = db.query(Tag).all()
    return tag_dict


def delete_garden_db(garden_id: int, db: Session):
    garden = db.query(Garden).filter(Garden.id == garden_id).first()
    db.delete(garden)
    db.commit()


def create_garden_plants_db(garden_id: int, plants: list[int], planted_date: date, db: Session):
    for plant in plants:
        create_garden_plant_db(garden_id, plant, planted_date, db)
    db.commit()


def create_garden_plant_db(garden_id: int, plant: int, planted_date: date, db: Session):
    garden_plant = GardenPlant(garden_id=garden_id, plant_id=plant, planted_date=planted_date)
    db.add(garden_plant)


def get_garden_plants_db(garden_id: int, db: Session):
    garden_plants_dict = (
        db.query(GardenPlant)
        .filter(GardenPlant.garden_id == garden_id)
        .options(joinedload(GardenPlant.plant))
        .all()
    )
    return garden_plants_dict