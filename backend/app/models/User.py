from app.database import Base
from sqlalchemy import Column, Integer, String, Table, ForeignKey
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, nullable=False)
    email = Column(String, nullable=False)
    username = Column(String(20), nullable=False)
    password = Column(String, nullable=False)

    gardens = relationship('Garden', secondary='user_gardens', back_populates='user')

user_gardens = Table(
    'user_gardens',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('garden_id', Integer, ForeignKey('gardens.id'), primary_key=True)
)