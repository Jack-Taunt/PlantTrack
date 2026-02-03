from sqlalchemy.orm import Session
from app.models.User import User

def get_user_by_email(email: str, db: Session):
    user_dict = db.query(User).filter(User.email == email).first()
    return user_dict

def create_user(email: str, username: str, hashed_password: str, db: Session):
    new_user = User(
        email=email,
        username=username,
        password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user