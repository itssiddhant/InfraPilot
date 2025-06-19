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

    class Config:
        orm_mode = True

