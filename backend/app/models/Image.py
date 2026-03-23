from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

class GardenImage(Base):
    __tablename__ = "garden_images"

    id = Column(Integer, primary_key=True, nullable=False)
    path_name = Column(String, nullable=False)
    
    garden = relationship('Garden', back_populates='garden_images')
    garden_id = Column(ForeignKey("gardens.id"))

