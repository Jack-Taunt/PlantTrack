from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship

class Garden(Base):
    __tablename__ = "gardens"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(30), nullable=False)
    description = Column(String(256), nullable=False)
    is_public = Column(Boolean, nullable=False, default=False)
    
    user = relationship('User', back_populates='gardens')
    user_id = Column(ForeignKey("users.id"))
    sections = relationship('Section', secondary='garden_sections', back_populates='garden')
    tags = relationship("Tag", secondary='garden_tags', back_populates='gardens')


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


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(20), nullable=False)

    gardens = relationship('Garden', secondary="garden_tags", back_populates='tags')


garden_tags = Table(
    'garden_tags',
    Base.metadata,
    Column('garden_id', Integer, ForeignKey('gardens.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True)
)