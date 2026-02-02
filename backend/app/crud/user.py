from sqlalchemy.orm import Session
from app.models.User import User

def get_user_by_username(username: str, db: Session):
    user_dict = db.query(User).filter(User.username == username).first()
    return user_dict

def create_user(username: str, hashed_password: str, db: Session):
    new_user = User(
        username=username,
        password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user