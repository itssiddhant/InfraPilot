from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class RCAOut(BaseModel):
    id: int
    summary: str
    logs: str
    created_at: datetime
    alert_id: Optional[int]=None
    suggested_fix: Optional[str]=None
    incident_start_time: Optional[datetime] = None
    incident_resolved_time: Optional[datetime] = None

    class Config:
        orm_mode = True

