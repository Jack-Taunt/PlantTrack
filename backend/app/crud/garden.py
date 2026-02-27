from sqlalchemy.orm import Session, joinedload
from app.models.Garden import Garden, Tag
from app.models.User import User
from sqlalchemy.inspection import inspect


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