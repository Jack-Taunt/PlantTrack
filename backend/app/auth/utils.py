from datetime import datetime, timedelta, timezone
import jwt, os
from pwdlib import PasswordHash
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from app.crud.user import get_user_by_email

load_dotenv()

password_hash = PasswordHash.recommended()

def verify_password(plaintext_password, hashed_password):
    return password_hash.verify(plaintext_password, hashed_password)


def hash_password(password):
    return password_hash.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt


def authenticate_user(email: str, password: str, db: Session):
    user_dict = get_user_by_email(email, db)
    if not user_dict:
        return False
    if not verify_password(password, user_dict.password):
        return False
    return user_dict