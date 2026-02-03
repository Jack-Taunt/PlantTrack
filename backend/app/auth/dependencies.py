from fastapi import Depends, HTTPException, status, Cookie
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.utils import get_user_by_email
import jwt, os
from jwt.exceptions import InvalidTokenError
from typing import Annotated
from app.schemas.Token import TokenData

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
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user_by_email(email, db)
    if user is None:
        raise credentials_exception
    return user