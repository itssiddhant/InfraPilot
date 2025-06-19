from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List,Optional
from app.services.rca_engine import generate_rca
from app.db import SessionLocal
from app.models.models import RCARecord
from app.services.fix_engine import suggest_fix
from app.schemas import RCAOut 
import requests
from datetime import datetime  # Add this import

router = APIRouter()

class RCARequest(BaseModel):
    logs: List[str]
    alert_id: int | None = None

class RCAResponse(BaseModel):
    id: int
    summary: str
    created_at: datetime   # ✅ This must match DB type
    logs: str
    alert_id: int | None = None
    suggested_fix: Optional[str] = None

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/rca", response_model=RCAResponse)
def get_rca(req: RCARequest, db: Session = Depends(get_db)):
    rca_summary = generate_rca(req.logs)  # your existing summary logic
    fix = suggest_fix(rca_summary)
    record = RCARecord(
        summary=rca_summary,
        logs="\n".join(req.logs),
        alert_id=req.alert_id,
        suggested_fix=fix
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

@router.get("/rca/history", response_model=List[RCAOut])
def get_rca_history(alert_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(RCARecord)
    if alert_id:
        query = query.filter(RCARecord.alert_id == alert_id)
    return query.order_by(RCARecord.created_at.desc()).all()