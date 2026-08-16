from fastapi import FastAPI
from app.database import engine, Base
from app.routers import users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NHS Career Assistant",
    description="AI-powered tool to help NHS job applicants succeed",
    version="1.0.0"
)

app.include_router(users.router)

@app.get("/")
def root():
    return {
        "message": "Welcome to NHS Career Assistant API",
        "status": "running",
        "docs": "/docs"
    }
