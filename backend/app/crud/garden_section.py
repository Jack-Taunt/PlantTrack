from sqlalchemy.orm import Session
from app.models.Garden import Section, Garden


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