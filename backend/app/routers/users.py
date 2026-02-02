from fastapi import APIRouter, Depends, HTTPException, status, Cookie
from fastapi.responses import JSONResponse
from app import models, schemas
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

load_dotenv()

ACCESS_TOKEN_EXPIRE_MINUTES = 30

password_hash = PasswordHash.recommended()

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    return encoded_jwt


def verify_password(plaintext_password, hashed_password):
    return password_hash.verify(plaintext_password, hashed_password)


def hash_password(password):
    return password_hash.hash(password)


def get_user_from_db(username, db: Session):
    user_dict = db.query(models.User).filter(models.User.username == username).first()
    return user_dict



def authenticate_user(username: str, password: str, db: Session):
    user_dict = get_user_from_db(username, db)
    if not user_dict:
        return False
    if not verify_password(password, user_dict.password):
        return False
    return user_dict


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db: Annotated[Session, Depends(get_db)],
):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.username}, expires_delta=access_token_expires)
    json_response = JSONResponse(content={"message": "login successful"})
    json_response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )
    return json_response


@router.post("/logout")
async def logout():
    json_response = JSONResponse(content={"message": "logout successful"})
    json_response.set_cookie(
        key="access_token",
        value="",
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=0,
    )
    return json_response


@router.post("/register", response_model=schemas.User)
async def register(user: schemas.User, db: Annotated[Session, Depends(get_db)]):
    new_user = models.User(username=user.username, password=hash_password(user.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


async def get_token_from_cookie(access_token: str | None = Cookie(default=None)):
    if access_token == None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return access_token


async def get_current_user(token: Annotated[str, Depends(get_token_from_cookie)], db: Annotated[Session, Depends(get_db)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user_from_db(username, db)
    if user is None:
        raise credentials_exception
    return user


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: Annotated[schemas.User, Depends(get_current_user)]):
    return current_user