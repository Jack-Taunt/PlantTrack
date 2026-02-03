from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.auth.utils import authenticate_user, create_access_token, hash_password
from app.auth.dependencies import get_current_user
from app.schemas.User import User
from app.crud.user import create_user

ACCESS_TOKEN_EXPIRE_MINUTES = 30


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


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
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
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


@router.post("/register", response_model=User)
async def register(user: User, db: Annotated[Session, Depends(get_db)]):
    hashed_password = hash_password(user.password)
    new_user = create_user(user.email, user.username, hashed_password, db)

    return new_user


@router.get("/me", response_model=User)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user