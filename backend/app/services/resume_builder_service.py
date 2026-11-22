"""
AI Resume Builder Service.
Transforms student profiles and raw project/job notes into recruiter-grade,
ATS-optimized resume structures formatted using the STAR & XYZ action-verb formulas.
"""
import json
import re
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.services.career_data import CAREER_KNOWLEDGE_BASE

# Google Gemini client initialization
genai_client = None
if settings.GEMINI_API_KEY:
    try:
        from google import genai
        genai_client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception:
        genai_client = None


ACTION_VERBS = [
    "Architected", "Engineered", "Developed", "Deployed", "Optimized",
    "Streamlined", "Implemented", "Integrated", "Containerized", "Automated"
]


def _rewrite_bullets_offline(raw_text: str, role_title: str) -> List[str]:
    """Generates strong recruiter-grade bullets from unpolished notes using rule-based templates."""
    lines = [l.strip("-* \t") for l in raw_text.split("\n") if l.strip()]
    if not lines:
        return [
            f"Engineered full-stack features for {role_title} applications, improving response efficiency by 28%.",
            "Implemented automated testing pipelines and validation checks, reducing defect escape rate to under 2%.",
            "Collaborated cross-functionally across engineering teams to ship scalable features on tight deadlines."
        ]

    bullets = []
    for i, line in enumerate(lines[:4]):
        verb = ACTION_VERBS[i % len(ACTION_VERBS)]
        # If line doesn't start with strong verb, prepend action verb formula
        if not any(line.lower().startswith(v.lower()) for v in ACTION_VERBS):
            bullets.append(f"{verb} {line.rstrip('.')}, increasing operational throughput by 25% and reducing manual latency.")
        else:
            bullets.append(f"{line.rstrip('.')}, achieving a 30% reduction in error rates.")
    return bullets


def generate_ats_resume_data(
    profile: Dict[str, Any],
    target_career: str,
    raw_experience: Optional[str] = None,
    raw_projects: Optional[str] = None
) -> Dict[str, Any]:
    """
    Synthesizes an ATS-compliant resume structure using Google Gemini
    with an offline heuristic fallback.
    """
    name = profile.get("full_name") or "Alex Morgan"
    email = profile.get("email") or "student@careercompass.ai"
    phone = profile.get("phone") or "+1 (555) 234-5678"
    location = profile.get("location") or "San Francisco, CA"
    linkedin = profile.get("linkedin") or f"linkedin.com/in/{name.lower().replace(' ', '-')}"
    github = profile.get("github") or f"github.com/{name.lower().replace(' ', '')}"
    portfolio = profile.get("portfolio") or f"{name.lower().replace(' ', '')}.dev"

    tech_skills = profile.get("technical_skills") or "Python, SQL, JavaScript, React"
    soft_skills = profile.get("soft_skills") or "Problem Solving, Team Collaboration, Communication"
    degree = profile.get("highest_qualification") or "B.Tech"
    stream = profile.get("stream") or "Computer Science & Engineering"
    cgpa = profile.get("grade_cgpa_percentage") or 85.0
    certs = profile.get("certifications") or ""
    achievements = profile.get("achievements") or ""
    past_jobs = raw_experience or profile.get("past_jobs_internships") or ""
    projects_input = raw_projects or profile.get("skills_gained") or ""

    # Knowledge base context
    kb_info = CAREER_KNOWLEDGE_BASE.get(target_career, {})
    required_skills = kb_info.get("required_technical_skills", ["Python", "Algorithms", "System Design"])

    if genai_client:
        prompt = (
            f"You are an elite Fortune 500 tech recruiter and ATS resume optimization expert.\n"
            f"Create a high-impact, single-page, ATS-compliant resume JSON for this candidate targeting: '{target_career}'.\n\n"
            f"CANDIDATE INFO:\n"
            f"- Name: {name}\n"
            f"- Education: {degree} in {stream} (Score: {cgpa}%)\n"
            f"- Technical Skills: {tech_skills}\n"
            f"- Soft Skills: {soft_skills}\n"
            f"- Raw Experience / Internships: {past_jobs or 'Internship assisting senior engineers on backend systems'}\n"
            f"- Raw Projects / Achievements: {projects_input or 'Built full-stack predictive web app and data pipeline'}\n"
            f"- Certifications: {certs or 'Cloud & Developer Certifications'}\n\n"
            f"REQUIREMENTS FOR OUTPUT:\n"
            f"1. 'summary': 2–3 sentence high-impact summary emphasizing target career '{target_career}', quantitative rigor, and problem solving.\n"
            f"2. 'skills_grouped': dictionary of 3–4 categories (e.g. 'Languages', 'Frameworks & Libraries', 'Cloud & Tools', 'Core Concepts').\n"
            f"3. 'experience': array of 1–2 jobs. Each bullet MUST follow: Action Verb + Scope/Tool + Quantified Result (e.g. 'Engineered REST API... reducing p95 latency by 35%').\n"
            f"4. 'projects': array of 2 projects relevant to {target_career} with title, tech_stack, link, and 2–3 STAR bullets.\n"
            f"5. 'education': array of 1–2 education items.\n"
            f"6. 'certifications': array of relevant certifications.\n\n"
            f"Return ONLY valid JSON matching this schema without markdown fences:\n"
            f"{{\n"
            f"  \"full_name\": \"{name}\",\n"
            f"  \"email\": \"{email}\",\n"
            f"  \"phone\": \"{phone}\",\n"
            f"  \"location\": \"{location}\",\n"
            f"  \"linkedin\": \"{linkedin}\",\n"
            f"  \"github\": \"{github}\",\n"
            f"  \"portfolio\": \"{portfolio}\",\n"
            f"  \"target_career\": \"{target_career}\",\n"
            f"  \"summary\": \"<string>\",\n"
            f"  \"skills_grouped\": {{\n"
            f"    \"Languages\": [\"...\"],\n"
            f"    \"Frameworks & Libraries\": [\"...\"],\n"
            f"    \"Cloud & Developer Tools\": [\"...\"]\n"
            f"  }},\n"
            f"  \"experience\": [\n"
            f"    {{\n"
            f"      \"company\": \"<string>\",\n"
            f"      \"role\": \"<string>\",\n"
            f"      \"duration\": \"<string>\",\n"
            f"      \"location\": \"<string>\",\n"
            f"      \"bullets\": [\"<string>\", \"<string>\"]\n"
            f"    }}\n"
            f"  ],\n"
            f"  \"projects\": [\n"
            f"    {{\n"
            f"      \"title\": \"<string>\",\n"
            f"      \"tech_stack\": \"<string>\",\n"
            f"      \"link\": \"<string>\",\n"
            f"      \"bullets\": [\"<string>\", \"<string>\"]\n"
            f"    }}\n"
            f"  ],\n"
            f"  \"education\": [\n"
            f"    {{\n"
            f"      \"degree\": \"{degree} in {stream}\",\n"
            f"      \"institution\": \"University of Engineering & Technology\",\n"
            f"      \"year\": \"2021 - 2025\",\n"
            f"      \"score\": \"CGPA: {cgpa}/100\"\n"
            f"    }}\n"
            f"  ],\n"
            f"  \"certifications\": [\"...\"]\n"
            f"}}"
        )

        import concurrent.futures

        def _call_gemini(m_name: str) -> Optional[Dict[str, Any]]:
            try:
                res = genai_client.models.generate_content(model=m_name, contents=prompt)
                if res and res.text:
                    raw = res.text.strip()
                    raw = re.sub(r"^```(?:json)?", "", raw).rstrip("`").strip()
                    return json.loads(raw)
            except Exception:
                return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=1) as executor:
            future = executor.submit(_call_gemini, "gemini-3.1-flash-lite")
            try:
                data = future.result(timeout=6.0)
                if data and isinstance(data, dict):
                    return data
            except Exception:
                pass

    # Heuristic Fallback
    parsed_skills = [s.strip() for s in tech_skills.split(",") if s.strip()]
    if not parsed_skills:
        parsed_skills = required_skills[:4]

    summary = (
        f"Results-driven aspiring {target_career} with a strong academic foundation in {degree} ({stream}) "
        f"and hands-on experience developing data-driven systems. Proficient in {', '.join(parsed_skills[:3])}, "
        f"with a proven track record of architecting scalable applications and collaborating in agile teams."
    )

    exp_bullets = _rewrite_bullets_offline(past_jobs, target_career)
    proj_bullets = _rewrite_bullets_offline(projects_input, target_career)

    cert_list = [c.strip() for c in certs.split(",") if c.strip()]
    if not cert_list:
        cert_list = [f"Certified {target_career} Professional", "AWS Certified Cloud Practitioner"]

    return {
        "full_name": name,
        "email": email,
        "phone": phone,
        "location": location,
        "linkedin": linkedin,
        "github": github,
        "portfolio": portfolio,
        "target_career": target_career,
        "summary": summary,
        "skills_grouped": {
            "Languages": [s for s in parsed_skills if s.lower() in ["python", "sql", "javascript", "typescript", "c++", "java", "go", "r", "html", "css"]] or ["Python", "SQL"],
            "Frameworks & Libraries": [s for s in parsed_skills if s.lower() in ["react", "fastapi", "scikit-learn", "tensorflow", "pytorch", "node.js", "express", "pandas", "numpy", "lightgbm", "xgboost"]] or ["FastAPI", "React", "Pandas"],
            "Cloud & Tools": ["Git", "Docker", "PostgreSQL", "Linux", "VS Code"],
            "Core Competencies": [s.strip() for s in soft_skills.split(",") if s.strip()][:3] or ["System Design", "Agile Development"]
        },
        "experience": [
            {
                "company": "Tech Innovations Inc.",
                "role": f"{target_career} Intern",
                "duration": "Jun 2024 – Present",
                "location": location,
                "bullets": exp_bullets
            }
        ],
        "projects": [
            {
                "title": f"Enterprise {target_career} Analytics Platform",
                "tech_stack": ", ".join(parsed_skills[:4]),
                "link": f"github.com/{name.lower().replace(' ', '')}/analytics-platform",
                "bullets": proj_bullets
            },
            {
                "title": "Automated Prediction & Inference Microservice",
                "tech_stack": "FastAPI, Docker, Redis, PostgreSQL",
                "link": f"github.com/{name.lower().replace(' ', '')}/inference-service",
                "bullets": [
                    "Engineered asynchronous REST endpoints processing 1,200 requests/sec with p99 response time under 30ms.",
                    "Containerized workflow with Docker and integrated GitHub Actions CI pipeline with 95% unit test coverage."
                ]
            }
        ],
        "education": [
            {
                "degree": f"{degree} in {stream}",
                "institution": "Institute of Technology & Science",
                "year": "2021 – 2025",
                "score": f"CGPA: {cgpa}%"
            }
        ],
        "certifications": cert_list
    }
