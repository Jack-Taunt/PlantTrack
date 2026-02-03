from pydantic import BaseModel

class User(BaseModel):
    email: str
    username: str
    password: str

class UserOut(BaseModel):
    email: str
    username: str