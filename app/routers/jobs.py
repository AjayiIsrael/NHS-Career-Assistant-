from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.qdrant_service import create_collection, add_job, match_cv_to_jobs

router = APIRouter(
    prefix="/jobs",
    tags=["jobs"]
)

# Create collection on startup
create_collection()

class JobCreate(BaseModel):
    title: str
    description: str
    requirements: str

class CVMatch(BaseModel):
    cv_text: str
    top_k: int = 5

@router.post("/add")
def add_job_endpoint(job: JobCreate):
    job_id = add_job(job.title, job.description, job.requirements)
    return {"message": "Job added successfully", "job_id": job_id}

@router.post("/match")
def match_jobs(cv: CVMatch):
    results = match_cv_to_jobs(cv.cv_text, cv.top_k)
    if not results:
        raise HTTPException(status_code=404, detail="No matching jobs found")
    return {"matches": results}