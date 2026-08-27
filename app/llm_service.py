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

def analyse_career_gap(cv_text: str, job_description: str) -> dict:
    prompt = f"""You are an expert NHS career coach. Analyse the CV against the job description below.

CV:
{cv_text}

Job Description:
{job_description}

Identify:
1. STRENGTHS: Skills and experience the candidate already has that match the role
2. GAPS: Skills or experience the candidate is missing
3. RECOMMENDATIONS: Specific actions the candidate can take to close each gap

Format your response exactly like this:
STRENGTHS:
[list each strength on a new line starting with -]

GAPS:
[list each gap on a new line starting with -]

RECOMMENDATIONS:
[list each recommendation on a new line starting with -]
"""
    response = generate_with_ollama(prompt)
    strengths = ""
    gaps = ""
    recommendations = ""
    if "STRENGTHS:" in response:
        parts = response.split("GAPS:")
        strengths = parts[0].replace("STRENGTHS:", "").strip()
        if len(parts) > 1:
            parts2 = parts[1].split("RECOMMENDATIONS:")
            gaps = parts2[0].strip()
            if len(parts2) > 1:
                recommendations = parts2[1].strip()
    return {
        "strengths": strengths,
        "gaps": gaps,
        "recommendations": recommendations
    }

def match_person_spec(cv_text: str, person_spec: str) -> dict:
    prompt = f"""You are an expert NHS recruitment specialist. Compare the CV against the person specification below.

CV:
{cv_text}

Person Specification:
{person_spec}

For each criterion in the person specification, assess whether the CV shows:
- COVERED: Clear evidence in the CV
- PARTIALLY MET: Some evidence but not complete
- NOT FOUND: No evidence in the CV

Format your response exactly like this:
CRITERION: [criterion name]
STATUS: [COVERED / PARTIALLY MET / NOT FOUND]
EVIDENCE: [brief explanation]

Repeat this format for every criterion. Then at the end add:
OVERALL MATCH: [percentage]%
"""
    response = generate_with_ollama(prompt)
    return {"assessment": response}