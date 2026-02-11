from app.database import Base
from sqlalchemy import Column, Integer, String, Boolean, Enum as SqlEnum, ForeignKey, Float
from sqlalchemy.orm import relationship
from enum import Enum

class Plant(Base):
    __tablename__ = "plants"
    id = Column(Integer, primary_key=True, nullable=False)

    common_name = Column(String(50), nullable=True)
    scientific_name = Column(String(50), nullable=False)
    family = Column(String(50), nullable=True)
    genus = Column(String(50), nullable=True)
    order = Column(String(50), nullable=True)
    class_ = Column(String(50), nullable=True)
    phylum = Column(String(50), nullable=True)
    variety = Column(String(50), nullable=True)

    gardens = relationship('Garden', secondary='garden_plants', back_populates='plants')
    
    
    toxicity_id = Column(Integer, ForeignKey("toxicity.id"))
    toxicity = relationship("Toxicity", back_populates="plants")
    edibility_id = Column(ForeignKey("edibility.id"))
    edibility = relationship("Edibility", back_populates="plants")
    environment_id = Column(ForeignKey("environment.id"))
    environment = relationship("Environment", back_populates="plants")
    care_requirements_id = Column(ForeignKey("care_requirements.id"))
    care_requirements = relationship("CareRequirements", back_populates="plants")
    growth_id = Column(ForeignKey("growth.id"))
    growth = relationship("Growth", back_populates="plants")
    planting_id = Column(ForeignKey("planting.id"))
    planting = relationship("Planting", back_populates="plants")


class ToxicityEnum(Enum):
    non_toxic = 1
    mildly_toxic = 2
    moderately_toxic = 3
    highly_toxic = 4


class Toxicity(Base):
    __tablename__ = "toxicity"
    id = Column(Integer, primary_key=True, nullable=False)
    
    toxic_to_cats = Column(Boolean, nullable=True)
    toxic_to_dogs = Column(Boolean, nullable=True)
    toxic_to_humans = Column(Boolean, nullable=True)
    toxicity = Column(SqlEnum(ToxicityEnum), nullable=True)

    plants = relationship('Plant', back_populates='toxicity')


class Edibility(Base):
    __tablename__ = "edibility"
    id = Column(Integer, primary_key=True, nullable=False)
    
    edible_fruit = Column(Boolean, nullable=True)
    edible_leaves = Column(Boolean, nullable=True)
    edible_flowers = Column(Boolean, nullable=True)
    edible_roots = Column(Boolean, nullable=True)

    plants = relationship('Plant', back_populates='edibility')


class LightEnum(Enum):
    direct_light = 1
    bright_indirect_light = 2
    shade = 3


class Environment(Base):
    __tablename__ = "environment"
    id = Column(Integer, primary_key=True, nullable=False)

    light_type = Column(SqlEnum(LightEnum), nullable=True)
    min_temp = Column(Float, nullable=True)
    max_temp = Column(Float, nullable=True)
    min_humidity = Column(Float, nullable=True)
    max_humidity = Column(Float, nullable=True)
    min_usda_zone = Column(String, nullable=True)
    max_usda_zone = Column(String, nullable=True)

    plants = relationship('Plant', back_populates='environment')


class MoistureEnum(Enum):
    dry = 1
    moderate = 2
    wet = 3


class SoilEnum(Enum):
    loamy = 1
    sandy = 2
    peaty = 3


class CareRequirements(Base):
    __tablename__ = "care_requirements"
    id = Column(Integer, primary_key=True, nullable=False)

    min_water_frequency = Column(Integer, nullable=True)
    max_water_frequency = Column(Integer, nullable=True)
    soil_moisture = Column(SqlEnum(MoistureEnum), nullable=True)
    drought_tolerant = Column(Boolean, nullable=True)
    soil_type = Column(SqlEnum(SoilEnum), nullable=True)
    min_soil_ph = Column(Float, nullable=True)
    max_soil_ph = Column(Float, nullable=True)
    fertilizer_frequency = Column(Integer, nullable=True)
    fertilizer_nitrogen = Column(Integer, nullable=True)
    fertilizer_phosphorus = Column(Integer, nullable=True)
    fertilizer_potassium = Column(Integer, nullable=True)

    plants = relationship('Plant', back_populates='care_requirements')


class GrowthRateEnum(Enum):
    fast = 1
    moderate = 2
    slow = 3


class Growth(Base):
    __tablename__ = "growth"
    id = Column(Integer, primary_key=True, nullable=False)

    annual = Column(Boolean, nullable=True)
    biennial = Column(Boolean, nullable=True)
    perennial = Column(Boolean, nullable=True)
    max_height = Column(Float, nullable=True)
    max_width = Column(Float, nullable=True)
    growth_rate = Column(SqlEnum(GrowthRateEnum), nullable=True)
    min_days_to_harvest = Column(Integer, nullable=True)
    max_days_to_harvest = Column(Integer, nullable=True)

    plants = relationship('Plant', back_populates='growth')


class Planting(Base):
    __tablename__ = "planting"
    id = Column(Integer, primary_key=True, nullable=False)

    spacing = Column(Float, nullable=True)
    seed_depth = Column(Float, nullable=True)
    direct_sow = Column(Boolean, nullable=True)
    transplant = Column(Boolean, nullable=True)
    propagation = Column(Boolean, nullable=True)

    plants = relationship('Plant', back_populates='planting')
