from app.database import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False)
    username = Column(String(20), nullable=False)
    password = Column(String, nullable=False)

    gardens = relationship('Garden', back_populates='user')