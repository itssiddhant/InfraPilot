from app.db import Base
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, LargeBinary
from sqlalchemy.orm import relationship

class RCARecord(Base):
    __tablename__ = "rca_records"
    id = Column(Integer, primary_key=True, index=True)
    summary = Column(Text)
    suggested_fix = Column(Text,nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    logs = Column(Text)
    incident_start_time = Column(DateTime, nullable=True)
    incident_resolved_time = Column(DateTime, nullable=True)

    alert_id = Column(Integer, ForeignKey("alerts.id"), nullable=True)
    alert = relationship("Alert", backref="rca")
    embedding = Column(LargeBinary, nullable=True)

class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String)
    timestamp = Column(String)
    message = Column(String)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String)
    message = Column(String)
    severity = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
