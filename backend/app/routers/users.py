from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.auth.utils import authenticate_user, create_access_token, hash_password
from app.auth.dependencies import get_current_user
from app.schemas.User import User, UserOut
from app.crud.user import create_user, get_user_by_email
from fastapi.encoders import jsonable_encoder
from app.services.auth_service import login_service, register_service

ACCESS_TOKEN_EXPIRE_MINUTES = 240


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], 
    db: Annotated[Session, Depends(get_db)],
):
    access_token, user_json = login_service(form_data, db)

    json_response = JSONResponse(content={"message": "login successful", "user": user_json})
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


@router.post("/register", response_model=UserOut)
async def register(
    user: User, 
    db: Annotated[Session, Depends(get_db)]
):
    return register_service(user, db)


@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: Annotated[User, Depends(get_current_user())]):
    return current_user