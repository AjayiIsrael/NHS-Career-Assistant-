from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from sentence_transformers import SentenceTransformer
import uuid

# Connect to Qdrant
client = QdrantClient(host="localhost", port=6333)

# Load embedding model
model = SentenceTransformer("all-MiniLM-L6-v2")

COLLECTION_NAME = "nhs_jobs"
VECTOR_SIZE = 384

def create_collection():
    existing = [c.name for c in client.get_collections().collections]
    if COLLECTION_NAME not in existing:
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE
            )
        )
        print(f"Collection '{COLLECTION_NAME}' created.")
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

def add_job(title: str, description: str, requirements: str):
    text = f"{title}. {description}. {requirements}"
    vector = model.encode(text).tolist()
    point = PointStruct(
        id=str(uuid.uuid4()),
        vector=vector,
        payload={
            "title": title,
            "description": description,
            "requirements": requirements
        }
    )
    client.upsert(collection_name=COLLECTION_NAME, points=[point])
    return point.id

def match_cv_to_jobs(cv_text: str, top_k: int = 5):
    vector = model.encode(cv_text).tolist()
    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector,
        limit=top_k
    ).points
    return [
        {
            "title": r.payload["title"],
            "description": r.payload["description"],
            "requirements": r.payload["requirements"],
            "score": round(r.score, 4)
        }
        for r in results
    ]