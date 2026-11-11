from typing import Dict, Any, List
from app.services.career_data import CAREER_KNOWLEDGE_BASE


def analyze_skill_gap(career_name: str, student_skills_text: str) -> Dict[str, Any]:
    """
    Compares student's comma-separated skills with required skills for a target career.
    Computes exact coverage percentage, missing skills, and prioritized recommendations.
    """
    kb = CAREER_KNOWLEDGE_BASE.get(career_name, {})
    required_tech = kb.get("required_technical_skills", ["Problem Solving", "Communication"])
    required_soft = kb.get("required_soft_skills", ["Teamwork", "Adaptability"])

    # Parse and normalize student skills
    student_tokens = set([
        s.strip().lower()
        for s in student_skills_text.split(",")
        if s.strip()
    ])

    existing_skills = []
    missing_skills = []
    breakdown = []

    # Check Technical Skills
    for skill in required_tech:
        is_acquired = any(
            student_token in skill.lower() or skill.lower() in student_token
            for student_token in student_tokens
        )
        if is_acquired:
            existing_skills.append(skill)
            breakdown.append({
                "skill": skill,
                "status": "acquired",
                "importance": "critical",
                "category": "technical"
            })
        else:
            missing_skills.append(skill)
            breakdown.append({
                "skill": skill,
                "status": "missing",
                "importance": "critical",
                "category": "technical"
            })

    # Check Soft Skills
    for skill in required_soft:
        is_acquired = any(
            student_token in skill.lower() or skill.lower() in student_token
            for student_token in student_tokens
        )
        if is_acquired:
            existing_skills.append(skill)
            breakdown.append({
                "skill": skill,
                "status": "acquired",
                "importance": "recommended",
                "category": "soft"
            })
        else:
            missing_skills.append(skill)
            breakdown.append({
                "skill": skill,
                "status": "missing",
                "importance": "recommended",
                "category": "soft"
            })

    total_required = len(required_tech) + len(required_soft)
    acquired_count = len(existing_skills)
    coverage_percentage = round((acquired_count / max(total_required, 1)) * 100, 1)

    # Top recommended skills to acquire
    recommended_skills = missing_skills[:4] if missing_skills else ["Advanced System Architecture", "Cloud Certifications"]

    return {
        "career": career_name,
        "coverage_percentage": coverage_percentage,
        "existing_skills": existing_skills,
        "missing_skills": missing_skills,
        "recommended_skills": recommended_skills,
        "breakdown": breakdown
    }

