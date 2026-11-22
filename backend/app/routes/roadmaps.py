from typing import Dict, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Assessment, RoadmapProgress
from app.schemas import (
    RoadmapResponse,
    RoadmapProgressToggleRequest,
    RoadmapProgressSummaryResponse,
)
from app.core.security import get_current_user
from app.core.sanitizer import sanitize_text
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


def _compute_career_progress(user_id: int, career_name: str, db: Session) -> RoadmapProgressSummaryResponse:
    roadmap = generate_career_roadmap(career_name)
    milestones = roadmap.get("milestones", [])

    stage_items: Dict[str, List[str]] = {}
    all_item_keys: List[str] = []

    for m in milestones:
        stage = m.get("stage", "General")
        items = []
        for s in m.get("skills", []):
            k = f"{stage}:skill:{s}"
            items.append(k)
            all_item_keys.append(k)
        for p in m.get("suggested_projects", []):
            k = f"{stage}:project:{p}"
            items.append(k)
            all_item_keys.append(k)
        for c in m.get("recommended_courses", []):
            title = c.get("title", "") if isinstance(c, dict) else str(c)
            k = f"{stage}:course:{title}"
            items.append(k)
            all_item_keys.append(k)
        stage_items[stage] = items

    total_count = max(len(all_item_keys), 1)

    completed_records = (
        db.query(RoadmapProgress)
        .filter(
            RoadmapProgress.user_id == user_id,
            RoadmapProgress.career == career_name,
            RoadmapProgress.completed == True
        )
        .all()
    )
    completed_keys = [
        f"{r.stage}:{r.item_type}:{r.item_title}" for r in completed_records
    ]
    matched_count = len([k for k in completed_keys if k in all_item_keys])
    completed_count = matched_count if matched_count > 0 else len(completed_records)

    readiness_percentage = round((completed_count / total_count) * 100, 1)

    stage_readiness = {}
    for stg, items in stage_items.items():
        if items:
            stg_done = len([k for k in items if k in completed_keys])
            stage_readiness[stg] = round((stg_done / len(items)) * 100, 1)
        else:
            stage_readiness[stg] = 0.0

    return RoadmapProgressSummaryResponse(
        career=career_name,
        completed_items=completed_keys,
        total_items=total_count,
        completed_count=completed_count,
        readiness_percentage=readiness_percentage,
        stage_readiness=stage_readiness,
        is_career_ready=readiness_percentage >= 70.0
    )


@router.get("/progress", response_model=RoadmapProgressSummaryResponse)
def get_roadmap_progress(
    career: str = Query(..., description="Career name to check progress for"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves checklist progress and real-time career readiness percentage for the user."""
    return _compute_career_progress(current_user.id, career, db)


@router.post("/progress/toggle", response_model=RoadmapProgressSummaryResponse)
def toggle_roadmap_progress(
    req: RoadmapProgressToggleRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Toggles completion of a skill, project, or course within a career milestone roadmap.
    Persists progress to database and computes updated readiness score.
    """
    clean_career = sanitize_text(req.career)
    clean_stage = sanitize_text(req.stage)
    clean_type = sanitize_text(req.item_type)
    clean_title = sanitize_text(req.item_title)

    record = (
        db.query(RoadmapProgress)
        .filter(
            RoadmapProgress.user_id == current_user.id,
            RoadmapProgress.career == clean_career,
            RoadmapProgress.stage == clean_stage,
            RoadmapProgress.item_type == clean_type,
            RoadmapProgress.item_title == clean_title
        )
        .first()
    )

    if record:
        record.completed = req.completed
    else:
        record = RoadmapProgress(
            user_id=current_user.id,
            career=clean_career,
            stage=clean_stage,
            item_type=clean_type,
            item_title=clean_title,
            completed=req.completed
        )
        db.add(record)

    db.commit()
    return _compute_career_progress(current_user.id, clean_career, db)
