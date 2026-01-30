from fastapi import APIRouter, Depends
from app import models, schemas
from sqlalchemy.orm import Session
from app.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me")
async def read_user_me():
    return {"username": "user1"}

@router.post("/", response_model=schemas.UserOut)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(username=user.username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

