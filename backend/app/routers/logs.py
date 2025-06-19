from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from app.services.alert_engine import process_log
from app.db import SessionLocal
from app.models.models import Alert, Log

router = APIRouter()

class LogEntry(BaseModel):
    service: str
    timestamp: str
    message: str

class AlertOut(BaseModel):
    id: int
    service: str
    message: str
    severity: str
    created_at: str

    class Config:
        orm_mode = True

class LogOut(BaseModel):
    id: int
    service: str
    timestamp: str
    message: str

    class Config:
        orm_mode = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/ingest")
def ingest_log(log: LogEntry):
    process_log(log)
    return {"status": "received"}

@router.get("/alerts", response_model=List[AlertOut])
def get_alerts(service: str = None, severity: str = None, db: Session = Depends(get_db)):
    query = db.query(Alert)
    if service:
        query = query.filter(Alert.service == service)
    if severity:
        query = query.filter(Alert.severity == severity)
    return query.order_by(Alert.created_at.desc()).all()

@router.get("/logs", response_model=List[LogOut])
def get_logs(service: str = None, db: Session = Depends(get_db)):
    query = db.query(Log)
    if service:
        query = query.filter(Log.service == service)
    return query.order_by(Log.id.desc()).all()
