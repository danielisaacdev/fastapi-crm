from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.client import Client
from app.schemas.client import ClientRead

router = APIRouter()

from app.api.deps import get_db, get_current_user

@router.get("/clients", response_model=List[ClientRead])
def list_clients(db: Session = Depends(get_db), user: str = Depends(get_current_user)):
    return db.query(Client).all()