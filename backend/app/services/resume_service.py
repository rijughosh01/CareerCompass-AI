import os
import re
from typing import Dict, Any, List
import io

try:
    import pypdf
except ImportError:
    try:
        import PyPDF2 as pypdf
    except ImportError:
        pypdf = None

try:
    import docx
except ImportError:
    docx = None

from app.services.career_data import CAREER_KNOWLEDGE_BASE


KNOWN_SKILLS_DICTIONARY = [
    # Programming & Tech
    "python", "javascript", "typescript", "c++", "java", "html", "css", "sql", "react", "node.js",
    "docker", "kubernetes", "aws", "azure", "gcp", "git", "linux", "rest api", "graphql", "redis",
    "postgresql", "mongodb", "mysql", "machine learning", "deep learning", "nlp", "computer vision",
    "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "powerbi", "tableau", "excel",
    "figma", "photoshop", "illustrator", "wireframing", "agile", "scrum", "jira", "burp suite",
    "metasploit", "wireshark", "cryptography", "ci/cd", "microservices", "unit testing",
    # Soft skills
    "leadership", "communication", "problem solving", "time management", "teamwork", "adaptability",
    "critical thinking", "project management", "negotiation", "conflict resolution"
]


def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    """Extracts raw text from PDF, DOCX, or plain text formats with resilient fallbacks."""
    ext = os.path.splitext(filename)[1].lower()
    text = ""

    if ext == ".pdf":
        # 1. Try pypdf
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        except Exception:
            pass

        # 2. Try PyPDF2 if pypdf was empty or failed
        if not text.strip():
            try:
                import PyPDF2
                reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            except Exception:
                pass

        # 3. Fallback: extract readable ASCII / UTF-8 strings from binary stream
        if not text.strip():
            try:
                tokens = re.findall(rb"[\x20-\x7E]{4,}", file_bytes)
                ascii_parts = [
                    t.decode("latin1", errors="ignore")
                    for t in tokens
                    if not t.startswith(rb"/") and not t.startswith(rb"end") and len(t) < 80
                ]
                text = " ".join(ascii_parts)
            except Exception:
                pass

    elif ext in [".docx", ".doc"]:
        if docx:
            try:
                doc = docx.Document(io.BytesIO(file_bytes))
                for para in doc.paragraphs:
                    text += para.text + "\n"
            except Exception:
                pass
        
        # Fallback for docx/doc if empty
        if not text.strip():
            try:
                tokens = re.findall(rb"[\x20-\x7E]{4,}", file_bytes)
                text = " ".join(t.decode("latin1", errors="ignore") for t in tokens)
            except Exception:
                pass

    else:
        # Default text decode
        try:
            text = file_bytes.decode("utf-8", errors="ignore")
        except Exception:
            text = str(file_bytes)

    return text.strip()


def analyze_resume_text(text: str, target_career: str = "Machine Learning Engineer") -> Dict[str, Any]:
    """
    Performs keyword, skill, and structure extraction on resume text.
    Computes an ATS-readability score (0-100) and produces actionable feedback.
    """
    lower_text = text.lower()
    words = re.findall(r"\b[a-zA-Z0-9+#.-]+\b", lower_text)
    word_count = len(words)

    # 1. Identify extracted skills
    extracted_skills = []
    for skill in KNOWN_SKILLS_DICTIONARY:
        if re.search(r"\b" + re.escape(skill) + r"\b", lower_text):
            extracted_skills.append(skill.title())

    # 2. Identify target career match
    kb = CAREER_KNOWLEDGE_BASE.get(target_career, {})
    required_skills = kb.get("required_technical_skills", []) + kb.get("required_soft_skills", [])
    
    keywords_found = []
    missing_keywords = []
    for req in required_skills:
        if re.search(r"\b" + re.escape(req.lower()) + r"\b", lower_text):
            keywords_found.append(req)
        else:
            missing_keywords.append(req)

    # Calculate ATS score
    score = 50  # Base
    if word_count > 150:
        score += 10
    if len(extracted_skills) >= 5:
        score += 15
    if len(extracted_skills) >= 10:
        score += 10
    if len(keywords_found) >= 3:
        score += 10
    if any(keyword in lower_text for keyword in ["education", "degree", "university", "bachelor", "master"]):
        score += 5

    score = min(max(score, 30), 96)

    # Strengths and Weaknesses
    strengths = []
    if len(extracted_skills) >= 6:
        strengths.append(f"Strong skill presence: Identified {len(extracted_skills)} relevant technical/soft competencies.")
    if len(keywords_found) >= 2:
        strengths.append(f"Found {len(keywords_found)} target keywords matching {target_career}.")
    if word_count >= 200:
        strengths.append("Adequate detail and professional scope.")

    if not strengths:
        strengths.append("Clear foundational formatting detected.")

    weaknesses = []
    if missing_keywords:
        weaknesses.append(f"Missing key terms expected for {target_career}: {', '.join(missing_keywords[:3])}.")
    if word_count < 150:
        weaknesses.append("Resume content appears brief. Consider expanding on project results and quantifiable impact.")
    if len(extracted_skills) < 5:
        weaknesses.append("Low density of explicit technical tool names or frameworks.")

    recommendations = [
        f"Incorporate target keywords such as '{missing_keywords[0]}'" if missing_keywords else "Highlight quantitative metrics (e.g. % improvements, latency reductions).",
        "Structure bullet points using the Action Verb + Context + Quantified Result format.",
        "Ensure certifications and education dates are formatted consistently for ATS parsers."
    ]

    # Find matching careers
    matching_careers = []
    for career_name, data in CAREER_KNOWLEDGE_BASE.items():
        career_reqs = [r.lower() for r in data.get("required_technical_skills", [])]
        overlap = sum(1 for req in career_reqs if req in lower_text)
        if overlap >= 2:
            matching_careers.append(career_name)

    if not matching_careers:
        matching_careers = [target_career]

    return {
        "overall_score": score,
        "extracted_skills": extracted_skills,
        "matching_careers": matching_careers[:4],
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations,
        "keywords_found": keywords_found,
        "missing_keywords": missing_keywords
    }

