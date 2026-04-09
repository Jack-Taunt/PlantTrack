from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class GardenImage(Base):
    __tablename__ = "garden_images"

    id = Column(Integer, primary_key=True, nullable=False)
    path_name = Column(String, nullable=False)
    
    garden = relationship('Garden', back_populates='garden_images')
    garden_id = Column(ForeignKey("gardens.id"))


class GardenPlantImage(Base):
    __tablename__ = "garden_plant_images"

    id = Column(Integer, primary_key=True, nullable=False)
    path_name = Column(String, nullable=False)
    
    garden_plant = relationship('GardenPlant', back_populates='garden_plant_images')
    garden_plant_id = Column(ForeignKey("garden_plants.id"))