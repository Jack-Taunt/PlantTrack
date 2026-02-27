from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Annotated

SPECIAL_CHARS: set[str] = {"$", "@", "#", "%", "!", "^", "&", "*", "(", ")", "-", "_", "+", "=", "{", "}", "[", "]",}

class User(BaseModel):
    email: EmailStr
    username: Annotated[str, Field(min_length=3, max_length=20)]
    password: Annotated[str, Field(min_length=8)]

    @field_validator("password")
    def check_password_strength(cls, password: str):
        if not any(char.isupper() for char in password):
            raise ValueError("Password must have an uppercase, lowercase, digit and special character")
        if not any(char.islower() for char in password):
            raise ValueError("Password must have an uppercase, lowercase, digit and special character")
        if not any(char.isdigit() for char in password):
            raise ValueError("Password must have an uppercase, lowercase, digit and special character")
        if not any(char in SPECIAL_CHARS for char in password):
            raise ValueError("Password must have an uppercase, lowercase, digit and special character")
        return password

class UserOut(BaseModel):
    id: int
    username: str

    model_config = {
        "from_attributes": True
    }


class UserPublic(BaseModel):
    username: str