from fastapi import APIRouter

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me")
async def read_user_me():
    return {"username": "user1"}