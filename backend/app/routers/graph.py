from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter()

# Example node and edge schemas
class GraphNode(BaseModel):
    id: str
    label: str
    position: Dict[str, float] = {"x": 0, "y": 0}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str

@router.get("/graph")
def get_graph():
    # Example static graph, replace with real dependency graph logic
    nodes = [
        {"id": "service-a", "label": "Service A", "position": {"x": 100, "y": 100}},
        {"id": "service-b", "label": "Service B", "position": {"x": 400, "y": 100}},
        {"id": "service-c", "label": "Service C", "position": {"x": 250, "y": 300}},
    ]
    edges = [
        {"id": "a-b", "source": "service-a", "target": "service-b"},
        {"id": "b-c", "source": "service-b", "target": "service-c"},
        {"id": "a-c", "source": "service-a", "target": "service-c"},
    ]
    return {"nodes": nodes, "edges": edges} 