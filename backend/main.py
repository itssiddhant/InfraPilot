from fastapi import FastAPI
from app.routers import logs, rca, graph
from app.db import engine
from app.models import models

app = FastAPI(title="InfraPilot")
models.Base.metadata.create_all(bind=engine)

app.include_router(logs.router, prefix="/api")
app.include_router(rca.router, prefix="/api")
app.include_router(graph.router, prefix="/api")

# NOTE: The StaticFiles mount was removed when you reverted.
# You will need to build the UI and add it back to see the frontend. 