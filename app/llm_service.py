import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1"

def generate_with_ollama(prompt: str) -> str:
    response = requests.post(OLLAMA_URL, json={
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    })
    return response.json()["response"]

def generate_supporting_statement(cv_text: str, job_description: str, word_count: int = 1000) -> dict:
    prompt = f"""You are an expert NHS career coach. Using the CV and job description below, write two versions of a supporting statement.

CV:
{cv_text}

Job Description:
{job_description}

Write exactly two versions:
1. VALUES-LED: Opens with NHS values and why the candidate cares about the role
2. EVIDENCE-LED: Opens with strongest achievement and builds evidence throughout

Each version should be approximately {word_count} words.

Format your response exactly like this:
VERSION 1 - VALUES-LED:
[statement here]

VERSION 2 - EVIDENCE-LED:
[statement here]
"""
    response = generate_with_ollama(prompt)

    parts = response.split("VERSION 2 - EVIDENCE-LED:")
    values_led = parts[0].replace("VERSION 1 - VALUES-LED:", "").strip()
    evidence_led = parts[1].strip() if len(parts) > 1 else ""

    return {
        "values_led": values_led,
        "evidence_led": evidence_led
    }