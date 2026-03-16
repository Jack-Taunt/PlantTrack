from sqlalchemy.orm import Session, joinedload
from app.models.Garden import Garden, Tag, Section
from app.models.User import User

def get_garden_db(garden_id: int, db: Session):
    garden_dict = (
        db.query(Garden)
        .filter(Garden.id == garden_id)
        .options(joinedload(Garden.tags))
        .options(joinedload(Garden.sections))
        .first()

    )
    return garden_dict


def get_user_gardens_db(user_id: int, db: Session):
    garden_dict = (
        db.query(Garden)
        .options(joinedload(Garden.user))
        .filter(Garden.user_id == user_id)
        .options(joinedload(Garden.tags))
        .options(joinedload(Garden.sections))
        .all()
    )
    return garden_dict


def get_public_gardens_db(db: Session):
    garden_dict = (
        db.query(Garden)
        .options(joinedload(Garden.user))
        .filter(Garden.is_public == True)
        .options(joinedload(Garden.tags))
        .options(joinedload(Garden.sections))
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
    return new_garden


def create_garden_section_db(name: str, garden_id: int, db: Session):
    new_section = Section(
        name=name,
    )

    garden = db.query(Garden).filter(Garden.id == garden_id).first()
    garden.sections.append(new_section)

    db.add(new_section)
    return new_section


def edit_garden_section_db(section_id: int, name: str, description: str, db: Session):
    section = (
        db.query(Section)
        .filter(Section.id == section_id)
        .first()
    )

    section.name = name
    section.description = description

    return section


def get_garden_tags_db(db: Session):
    tag_dict = db.query(Tag).all()
    return tag_dict


def delete_garden_db(garden_id: int, db: Session):
    garden = db.query(Garden).filter(Garden.id == garden_id).first()
    db.delete(garden)


def get_section_db(section_id: int, db: Session):
    section_dict = (
        db.query(Section)
        .filter(Section.id == section_id)
        .first()
    )
    return section_dict


def delete_section_db(section_id: int, db: Session):
    section = db.query(Section).filter(Section.id == section_id).first()
    db.delete(section)