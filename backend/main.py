from fastapi import FastAPI
from app.routers import logs,rca
from app.db import engine
from app.models import models
from app.routers import graph

app = FastAPI(title="InfraPilot")
models.Base.metadata.create_all(bind=engine)

app.include_router(logs.router, prefix="/api")
app.include_router(rca.router, prefix="/api")
app.include_router(graph.router, prefix="/api") 