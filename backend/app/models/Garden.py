from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship

class Garden(Base):
    __tablename__ = "gardens"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(30), nullable=False)
    description = Column(String(256), nullable=False)
    is_public = Column(Boolean, nullable=False, default=False)
    
    user = relationship('User', secondary='user_gardens', back_populates='gardens')
    sections = relationship('Section', secondary='garden_sections', back_populates='garden')


garden_sections = Table(
    'garden_sections',
    Base.metadata,
    Column('garden_id', Integer, ForeignKey('gardens.id'), primary_key=True),
    Column('section_id', Integer, ForeignKey('sections.id'), primary_key=True)
)


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(30), nullable=False)
    description = Column(String(256), nullable=False)

    garden = relationship('Garden', secondary='garden_sections', back_populates='sections')
    plants = relationship('Plant', secondary='section_plants', back_populates='sections')


section_plants = Table(
    'section_plants',
    Base.metadata,
    Column('section_id', Integer, ForeignKey('sections.id'), primary_key=True),
    Column('plant_id', Integer, ForeignKey('plants.id'), primary_key=True)
)