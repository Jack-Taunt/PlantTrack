from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Table
from sqlalchemy.orm import relationship

class Garden(Base):
    __tablename__ = "gardens"

    id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(30), nullable=False)
    is_public = Column(Boolean, nullable=False, default=False)
    
    user = relationship('User', secondary='user_gardens', back_populates='gardens')
    plants = relationship('Plant', secondary='garden_plants', back_populates='gardens')


garden_plants = Table(
    'garden_plants',
    Base.metadata,
    Column('garden_id', Integer, ForeignKey('gardens.id'), primary_key=True),
    Column('plant_id', Integer, ForeignKey('plants.id'), primary_key=True)
)