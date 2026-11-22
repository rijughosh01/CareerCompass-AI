from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, StudentProfile, Assessment
from app.schemas import ResumeGenerateRequest, ResumeDataResponse
from app.core.security import get_current_user
from app.core.sanitizer import sanitize_text
from app.services.resume_builder_service import generate_ats_resume_data

router = APIRouter(prefix="/resumes/builder", tags=["1-Click AI Resume Builder"])


@router.post("/generate", response_model=ResumeDataResponse)
def generate_resume(
    req: ResumeGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    1-Click AI Resume Builder:
    Pulls verified student profile, skills, and predicted career.
    Uses Gemini to synthesize recruiter-grade bullet points following the
    Action Verb + Scope + Quantified Result formula, returning a clean ATS structure.
    """
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    latest_assessment = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .first()
    )

    # Determine target career
    target_career = req.target_career
    if not target_career:
        if latest_assessment and latest_assessment.top_career:
            target_career = latest_assessment.top_career
        elif profile and profile.fields_of_interest:
            target_career = profile.fields_of_interest
        else:
            target_career = "Machine Learning Engineer"

    # Merge profile defaults with any custom overrides
    profile_data = {
        "full_name": req.full_name or (profile.full_name if profile else current_user.full_name),
        "email": req.email or current_user.email,
        "phone": req.phone or "+1 (555) 234-5678",
        "location": req.location or (profile.location if profile else "San Francisco, CA"),
        "linkedin": req.linkedin or f"linkedin.com/in/{(req.full_name or current_user.full_name).lower().replace(' ', '-')}",
        "github": req.github or f"github.com/{(req.full_name or current_user.full_name).lower().replace(' ', '')}",
        "portfolio": req.portfolio or f"{(req.full_name or current_user.full_name).lower().replace(' ', '')}.dev",
        "highest_qualification": profile.highest_qualification if profile else "B.Tech",
        "stream": profile.stream if profile else "Computer Science",
        "grade_cgpa_percentage": profile.grade_cgpa_percentage if profile else 85.0,
        "technical_skills": profile.technical_skills if profile else "Python, SQL, Machine Learning",
        "soft_skills": profile.soft_skills if profile else "Problem Solving, Collaboration",
        "certifications": profile.certifications if profile else "",
        "achievements": profile.achievements if profile else "",
        "past_jobs_internships": profile.past_jobs_internships if profile else "",
        "skills_gained": profile.skills_gained if profile else ""
    }

    # Sanitize string fields
    sanitized_profile = {
        k: sanitize_text(str(v)) if isinstance(v, str) else v
        for k, v in profile_data.items()
    }
    sanitized_career = sanitize_text(target_career)

    resume_data = generate_ats_resume_data(
        profile=sanitized_profile,
        target_career=sanitized_career,
        raw_experience=req.raw_experience,
        raw_projects=req.raw_projects
    )

    return resume_data
