import faiss
import numpy as np
from app.models.models import RCARecord
from app.services.embedding_utils import get_embedding

class RCAFaissIndex:
    def __init__(self):
        self.index = None
        self.ids = []

    def build(self, db):
        rcas = db.query(RCARecord).all()
        embeddings = []
        self.ids = []
        for rca in rcas:
            if rca.embedding:
                emb = np.frombuffer(rca.embedding, dtype=np.float32)
            else:
                emb = get_embedding(rca.summary)
                rca.embedding = emb.astype(np.float32).tobytes()
                db.add(rca)
            embeddings.append(emb)
            self.ids.append(rca.id)
        db.commit()
        if embeddings:
            dim = len(embeddings[0])
            self.index = faiss.IndexFlatL2(dim)
            self.index.add(np.stack(embeddings))
        else:
            self.index = None

    def search(self, query, db, top_k=5):
        if not self.index:
            self.build(db)
        query_emb = get_embedding(query)
        D, I = self.index.search(np.expand_dims(query_emb, axis=0), top_k)
        similar_ids = [self.ids[i] for i in I[0] if i < len(self.ids)]
        return db.query(RCARecord).filter(RCARecord.id.in_(similar_ids)).all() 