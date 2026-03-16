from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from app.auth.utils import authenticate_user, create_access_token, hash_password
from datetime import timedelta
from fastapi import HTTPException, status
from app.schemas.User import User, UserOut
from app.crud.user import create_user, get_user_by_email

ACCESS_TOKEN_EXPIRE_MINUTES = 240


def login_service(form_data: OAuth2PasswordRequestForm, db: Session):
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    user_out = UserOut.model_validate(user)
    user_json = jsonable_encoder(user_out)

    return access_token, user_json


def register_service(user: User, db: Session):
    if get_user_by_email(user.email, db):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Email Already in use",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    hashed_password = hash_password(user.password)
    new_user = create_user(user.email, user.username, hashed_password, db)
    db.commit()
    db.refresh(new_user)
    return new_user