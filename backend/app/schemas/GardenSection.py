from pydantic import BaseModel

class GardenSectionCreate(BaseModel):
    name: str


class GardenSectionUpdate(BaseModel):
    name: str
    description: str | None


class SectionOut(BaseModel):
    id: int
    name: str
    description: str | None