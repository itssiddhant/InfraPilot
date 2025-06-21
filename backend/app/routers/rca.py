from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.services.rca_engine import generate_rca
from app.db import get_db
from app.models.models import RCARecord
from app.services.fix_engine import suggest_fix
from app.schemas import RCAOut 
import requests
from datetime import datetime  # Add this import
from fastapi import HTTPException
from app.services.faiss_index import RCAFaissIndex
from fastapi.responses import PlainTextResponse
import re

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
    incident_start_time: Optional[datetime] = None
    incident_resolved_time: Optional[datetime] = None

    class Config:
        orm_mode = True

faiss_index = RCAFaissIndex()

def parse_timestamps_from_logs(logs: List[str]) -> (Optional[datetime], Optional[datetime]):
    """Parses logs to find the earliest and latest timestamps."""
    timestamps = []
    # This regex is designed to be flexible, matching formats like 'YYYY-MM-DD HH:MM:SS,ms' or 'YYYY-MM-DD HH:MM:SS'
    timestamp_regex = re.compile(r'^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}')
    
    for line in logs:
        match = timestamp_regex.search(line)
        if match:
            try:
                # Handle potential format variations, like ' ' vs 'T' separator and extra chars
                ts_str = match.group(0).replace('T', ' ')
                timestamps.append(datetime.fromisoformat(ts_str))
            except ValueError:
                # Ignore lines where the matched string isn't a valid timestamp
                continue

    if not timestamps:
        return None, None
        
    return min(timestamps), max(timestamps)

@router.post("/rca", response_model=RCAResponse)
def get_rca(req: RCARequest, db: Session = Depends(get_db)):
    rca_summary = generate_rca(req.logs)
    fix = suggest_fix(rca_summary)
    
    start_time, end_time = parse_timestamps_from_logs(req.logs)

    record = RCARecord(
        summary=rca_summary,
        logs="\n".join(req.logs),
        alert_id=req.alert_id,
        suggested_fix=fix,
        incident_start_time=start_time,
        incident_resolved_time=end_time
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    # Rebuild FAISS index after new RCA
    faiss_index.build(db)
    return record

@router.get("/rca/history", response_model=List[RCAOut])
def get_rca_history(alert_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(RCARecord)
    if alert_id:
        query = query.filter(RCARecord.alert_id == alert_id)
    return query.order_by(RCARecord.created_at.desc()).all()

@router.get("/rca/search", response_model=List[RCAResponse])
def search_rca_memory(
    keyword: str = Query(..., description="Search keyword in summary or logs"),
    db: Session = Depends(get_db)
):
    keyword_like = f"%{keyword.lower()}%"
    results = db.query(RCARecord).filter(
        (RCARecord.summary.ilike(keyword_like)) |
        (RCARecord.logs.ilike(keyword_like))
    ).order_by(RCARecord.created_at.desc()).all()
    return results

@router.get("/rca/similarity", response_model=List[RCAOut])
def rca_similarity(query: str = Query(..., description="Query for semantic similarity search"), db: Session = Depends(get_db)):
    # Use FAISS for semantic search
    if not faiss_index.index:
        faiss_index.build(db)
    results = faiss_index.search(query, db, top_k=5)
    return results

@router.get("/rca/{rca_id}/export", response_class=PlainTextResponse)
def export_rca_markdown(rca_id: int, db: Session = Depends(get_db)):
    rca = db.query(RCARecord).filter(RCARecord.id == rca_id).first()
    if not rca:
        raise HTTPException(status_code=404, detail="RCA record not found")

    # Format dates safely
    created_date = rca.created_at.strftime("%Y-%m-%d %H:%M:%S") if rca.created_at else "N/A"
    start_date = rca.incident_start_time.strftime("%Y-%m-%d %H:%M:%S") if rca.incident_start_time else "N/A"
    end_date = rca.incident_resolved_time.strftime("%Y-%m-%d %H:%M:%S") if rca.incident_resolved_time else "N/A"

    markdown_content = f"""
# RCA Report: ID {rca.id}

- **Created On:** {created_date}
- **Incident Start:** {start_date}
- **Incident Resolved:** {end_date}

## Summary
{rca.summary}

## Suggested Fix
```
{rca.suggested_fix or "No fix suggested."}
```

## Raw Logs
<details>
<summary>Click to view logs</summary>

```
{rca.logs}
```

</details>
"""
    return PlainTextResponse(content=markdown_content.strip())