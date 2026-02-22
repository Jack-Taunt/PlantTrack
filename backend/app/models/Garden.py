from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table, Date
from sqlalchemy.orm import relationship

class Garden(Base):
    __tablename__ = "gardens"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(30), nullable=False)
    description = Column(String(256), nullable=False)
    is_public = Column(Boolean, nullable=False, default=False)
    
    user = relationship('User', back_populates='gardens')
    user_id = Column(ForeignKey("users.id"))
    sections = relationship('Section', back_populates='garden')
    tags = relationship("Tag", secondary='garden_tags', back_populates='gardens')


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(30), nullable=False)
    description = Column(String(256), nullable=True)

    garden_id = Column(ForeignKey("gardens.id"))
    garden = relationship('Garden', back_populates='sections')

    section_plants = relationship('SectionPlant', back_populates='section')


class SectionPlant(Base):
    __tablename__ = "section_plants"
    id = Column(Integer, primary_key=True, nullable=False)
    planted_date = Column(Date, nullable=True)
    notes = Column(String(256), nullable=True)

    section_id = Column(ForeignKey("sections.id"))
    section = relationship('Section', back_populates='section_plants')
    plant_id = Column(ForeignKey("plants.id"))
    plant = relationship('Plant', back_populates='section_plants')



class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(20), nullable=False)

    gardens = relationship('Garden', secondary="garden_tags", back_populates='tags')


garden_tags = Table(
    'garden_tags',
    Base.metadata,
    Column('garden_id', Integer, ForeignKey('gardens.id', ondelete="CASCADE"), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id', ondelete="CASCADE"), primary_key=True)
)