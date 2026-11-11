from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, StudentProfile, Assessment
from app.schemas import SkillGapResponse
from app.core.security import get_current_user
from app.services.skill_service import analyze_skill_gap

router = APIRouter(prefix="/skills", tags=["Skill Gap Analysis"])


@router.get("", response_model=SkillGapResponse)
@router.get("/", response_model=SkillGapResponse)
@router.get("/gap", response_model=SkillGapResponse)
@router.get("/gap-analysis", response_model=SkillGapResponse)
def get_skill_gap_analysis(
    career: str = Query(None, description="Target career to analyze. If empty, uses latest top prediction."),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    student_skills = profile.technical_skills if profile else "Python, SQL"

    # If career not specified, default to latest assessment top career, or Machine Learning Engineer
    target_career = career
    if not target_career:
        latest = (
            db.query(Assessment)
            .filter(Assessment.user_id == current_user.id)
            .order_by(Assessment.created_at.desc())
            .first()
        )
        if latest and latest.top_career:
            target_career = latest.top_career
        else:
            target_career = "Machine Learning Engineer"

    result = analyze_skill_gap(target_career, student_skills)
    return result

