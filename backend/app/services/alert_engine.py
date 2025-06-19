from app.db import SessionLocal
from app.models.models import Log, Alert
from datetime import datetime

def process_log(log):
    db = SessionLocal()
    try:
        db_log = Log(service=log.service, timestamp=log.timestamp, message=log.message)
        db.add(db_log)
        db.commit()

        if any(word in log.message.upper() for word in ["ERROR", "CRITICAL"]):
            db_alert = Alert(service=log.service, message=log.message, severity="HIGH")
            db.add(db_alert)
            db.commit()
            print("Alert triggered")
    finally:
        db.close()