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
    garden_plants = relationship('GardenPlant', back_populates='garden')


class Section(Base):
    __tablename__ = "sections"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(30), nullable=False)
    description = Column(String(256), nullable=True)

    garden_id = Column(ForeignKey("gardens.id"))
    garden = relationship('Garden', back_populates='sections')


class GardenPlant(Base):
    __tablename__ = "garden_plants"
    id = Column(Integer, primary_key=True, nullable=False)
    planted_date = Column(Date, nullable=True)
    notes = Column(String(256), nullable=True)

    garden_id = Column(ForeignKey("gardens.id"), nullable=False)
    garden = relationship('Garden', back_populates='garden_plants')
    section_id = Column(ForeignKey("sections.id"), nullable=True)
    plant_id = Column(ForeignKey("plants.id"), nullable=False)
    plant = relationship('Plant', back_populates='garden_plants')



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