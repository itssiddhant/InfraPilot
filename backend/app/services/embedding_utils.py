import numpy as np
import requests
from sentence_transformers import SentenceTransformer

USE_OLLAMA = True  # Set to False to use sentence-transformers

if not USE_OLLAMA:
    model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> np.ndarray:
    if USE_OLLAMA:
        response = requests.post(
            "http://localhost:11434/api/embeddings",
            json={"model": "mistral", "prompt": text}
        )
        return np.array(response.json()["embedding"], dtype=np.float32)
    else:
        return model.encode(text).astype(np.float32) 