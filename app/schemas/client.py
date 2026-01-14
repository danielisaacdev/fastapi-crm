from pydantic import BaseModel, EmailStr

class ClientCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None

class ClientRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None = None

    class Config:
        from_attributes = True