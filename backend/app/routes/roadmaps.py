from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Assessment
from app.schemas import RoadmapResponse
from app.core.security import get_current_user
from app.services.roadmap_service import generate_career_roadmap

router = APIRouter(prefix="/roadmaps", tags=["Learning Roadmaps"])


@router.get("", response_model=RoadmapResponse)
@router.get("/", response_model=RoadmapResponse)
@router.get("/generate", response_model=RoadmapResponse)
@router.post("/generate", response_model=RoadmapResponse)
def get_roadmap(
    career: str = Query(None, description="Career name to generate roadmap for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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

    roadmap_data = generate_career_roadmap(target_career)
    return roadmap_data

