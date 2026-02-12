from pydantic import BaseModel, Field
from typing import Annotated

class Garden(BaseModel):
    name: Annotated[str, Field(max_length=20)]
    description: Annotated[str, Field(max_length=256)]
    is_public: bool