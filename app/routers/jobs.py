from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.qdrant_service import create_collection, add_job, match_cv_to_jobs
from app.llm_service import generate_supporting_statement, analyse_career_gap, match_person_spec

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

class StatementRequest(BaseModel):
    cv_text: str
    job_description: str
    word_count: int = 1000

class CareerGapRequest(BaseModel):
    cv_text: str
    job_description: str

class PersonSpecRequest(BaseModel):
    cv_text: str
    person_spec: str

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

@router.post("/generate-statement")
def generate_statement(request: StatementRequest):
    result = generate_supporting_statement(
        cv_text=request.cv_text,
        job_description=request.job_description,
        word_count=request.word_count
    )
    return {
        "values_led": result["values_led"],
        "evidence_led": result["evidence_led"]
    }

@router.post("/career-gap")
def career_gap_analyser(request: CareerGapRequest):
    result = analyse_career_gap(
        cv_text=request.cv_text,
        job_description=request.job_description
    )
    return result

@router.post("/person-spec")
def person_spec_matcher(request: PersonSpecRequest):
    result = match_person_spec(
        cv_text=request.cv_text,
        person_spec=request.person_spec
    )
    return result