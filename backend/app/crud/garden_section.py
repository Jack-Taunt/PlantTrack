from sqlalchemy.orm import Session
from app.models.Garden import Section, Garden


def create_garden_section_db(name: str, order: int, garden_id: int, db: Session):
    new_section = Section(
        name=name,
        order=order,
    )

    garden = db.query(Garden).filter(Garden.id == garden_id).first()
    garden.sections.append(new_section)

    db.add(new_section)
    return new_section


def edit_garden_section_db(section_id: int, name: str, description: str, order: int, db: Session):
    section = (
        db.query(Section)
        .filter(Section.id == section_id)
        .first()
    )

    if name != None:
        section.name = name

    if description != None:
        section.description = description

    if order != None:
        section.order = order

    return section


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