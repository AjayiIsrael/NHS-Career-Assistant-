# NHS Career Assistant 🏥

An AI-powered web application designed to help NHS job applicants succeed — from finding the right role to writing a winning application.

Built with FastAPI, Qdrant, Ollama (Llama 3.1), and SQLite.

---

## Features

### ✅ Authentication
- User registration and login
- Secure password hashing with bcrypt
- JWT token-based authentication

### ✅ Semantic Job Matching
- Upload NHS job postings to a Qdrant vector database
- Match your CV against all stored jobs using cosine similarity
- Returns ranked results with similarity scores

### ✅ Supporting Statement Generator
- Input your CV and a job description
- AI generates two tailored supporting statement styles:
  - **Values-led** — opens with NHS values and compassion
  - **Evidence-led** — opens with your strongest achievement

### ✅ Career Gap Analyser
- Compares your CV against a job description
- Identifies your strengths, skill gaps, and actionable recommendations

### ✅ Person Specification Matcher
- Scores each criterion in a person specification as:
  - **COVERED** — clear evidence in your CV
  - **PARTIALLY MET** — some evidence but incomplete
  - **NOT FOUND** — no evidence found
- Returns an overall match percentage

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Python 3.13 | Core language |
| FastAPI | REST API framework |
| SQLite + SQLAlchemy | Database and ORM |
| Qdrant | Vector database for semantic job matching |
| sentence-transformers | Text embeddings (all-MiniLM-L6-v2) |
| Ollama + Llama 3.1 | Local LLM for AI generation |
| bcrypt | Password hashing |
| JWT (python-jose) | Authentication tokens |
| Docker | Qdrant containerisation |

---

## Project Structure

```
NHS-Career-Assistant/
├── app/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # SQLAlchemy database setup
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT and password hashing
│   ├── llm_service.py       # LLM abstraction layer (Ollama)
│   ├── qdrant_service.py    # Qdrant vector DB service
│   └── routers/
│       ├── users.py         # Auth endpoints
│       └── jobs.py          # Job matching and AI endpoints
├── requirements.txt
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Docker Desktop
- Ollama

### 1. Clone the repository
```bash
git clone https://github.com/AjayiIsrael/NHS-Career-Assistant-.git
cd NHS-Career-Assistant-
```

### 2. Create and activate virtual environment
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Start Qdrant
```bash
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant
```

### 5. Start Ollama with Llama 3.1
```bash
ollama pull llama3.1
ollama serve
```

### 6. Run the application
```bash
uvicorn app.main:app --reload
```

### 7. Open Swagger UI
```
http://127.0.0.1:8000/docs
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /users/register | Register a new user |
| POST | /users/login | Login and get JWT token |
| POST | /jobs/add | Add an NHS job posting |
| POST | /jobs/match | Match CV to jobs semantically |
| POST | /jobs/generate-statement | Generate supporting statement |
| POST | /jobs/career-gap | Analyse career gaps |
| POST | /jobs/person-spec | Match against person specification |

---

## Internship Context

This project was built as part of a virtual internship programme, developed across 6 sprints over 6 weeks.

**Intern:** Israel Ajayi
**University:** University of Hertfordshire
**Programme:** MSc Data Science

---

## Roadmap

- [ ] Interview Preparation Suite
- [ ] CV Builder
- [ ] Location and sponsorship filters
- [ ] Saved jobs feature
- [ ] Frontend UI
- [ ] Docker Compose full deployment

---

## License

MIT License
