"""
Upgraded assessments route with:
- Structured audit logging for all prediction events
- Pagination on assessment history (skip/limit)
- Cached latest-assessment lookup (30-second TTL)
- Background task support for heavy ML inference
"""
import structlog
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models import User, StudentProfile, Assessment, PredictionDetail
from app.schemas import AssessmentSubmitRequest, AssessmentResponse
from app.core.security import get_current_user
from app.services.ml_service import ml_service
from app.services.career_data import CAREER_KNOWLEDGE_BASE
from app.services.cache_service import get_cached, set_cached, invalidate

logger = structlog.get_logger("careercompass.assessments")
router = APIRouter(prefix="/assessments", tags=["Career Assessments"])


def _latest_cache_key(user_id: int) -> str:
    return f"assessment:latest:{user_id}"


def _bust_latest_cache(user_id: int) -> None:
    invalidate(_latest_cache_key(user_id))


@router.post("", response_model=Dict[str, Any])
@router.post("/", response_model=Dict[str, Any])
def submit_assessment(
    request_data: AssessmentSubmitRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a 4-step career assessment and get XGBoost ML predictions."""
    profile_dict = request_data.model_dump(exclude={"save_to_profile"})
    if not profile_dict.get("full_name") or profile_dict["full_name"] == "Student":
        profile_dict["full_name"] = current_user.full_name or "Student"

    # 1. ML Career Prediction
    try:
        predictions = ml_service.predict_career(profile_dict, top_n=5)
    except Exception as e:
        logger.error("ml_prediction_failed", user_id=current_user.id, error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Machine Learning model prediction failed: {str(e)}",
        )

    top_prediction = predictions[0]
    logger.info(
        "assessment_submitted",
        user_id=current_user.id,
        top_career=top_prediction["career"],
        top_score=top_prediction["prediction_score"],
    )

    # 2. Persist Assessment
    assessment = Assessment(
        user_id=current_user.id,
        input_snapshot=profile_dict,
        top_career=top_prediction["career"],
        top_score=top_prediction["prediction_score"],
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # 3. Persist prediction details
    for item in predictions:
        pred_detail = PredictionDetail(
            assessment_id=assessment.id,
            career=item["career"],
            score=item["prediction_score"],
            rank=item["rank"],
            match_explanation=item.get("match_explanation"),
        )
        db.add(pred_detail)

    # 4. Optionally update student profile
    if request_data.save_to_profile:
        profile_cols = {c.name for c in StudentProfile.__table__.columns}
        safe_data = {k: v for k, v in profile_dict.items() if k in profile_cols}
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if not profile:
            profile = StudentProfile(user_id=current_user.id, **safe_data)
            db.add(profile)
        else:
            for k, v in safe_data.items():
                setattr(profile, k, v)

    db.commit()

    # Invalidate cached latest assessment
    background_tasks.add_task(_bust_latest_cache, current_user.id)

    return {
        "id": assessment.id,
        "assessment_id": assessment.id,
        "created_at": assessment.created_at.isoformat(),
        "top_prediction": assessment.top_career,
        "top_career": assessment.top_career,
        "top_score": assessment.top_score,
        "predictions": predictions,
        "profile_snapshot": profile_dict,
    }


@router.get("", response_model=List[Dict[str, Any]])
@router.get("/", response_model=List[Dict[str, Any]])
@router.get("/history", response_model=List[Dict[str, Any]])
def get_assessment_history(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=100, description="Max records to return"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return paginated assessment history for the current user."""
    assessments = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

    results = []
    for a in assessments:
        preds = (
            db.query(PredictionDetail)
            .filter(PredictionDetail.assessment_id == a.id)
            .order_by(PredictionDetail.rank.asc())
            .all()
        )
        results.append({
            "id": a.id,
            "created_at": a.created_at.isoformat(),
            "top_prediction": a.top_career,
            "top_career": a.top_career,
            "top_score": a.top_score,
            "predictions": [
                {
                    "rank": p.rank,
                    "career": p.career,
                    "prediction_score": p.score,
                    "is_top_match": p.rank == 1,
                    "match_explanation": p.match_explanation,
                }
                for p in preds
            ],
        })

    return results


@router.get("/latest", response_model=Dict[str, Any])
def get_latest_assessment(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return the most recent assessment. Cached for 30 seconds."""
    cache_key = _latest_cache_key(current_user.id)
    cached = get_cached(cache_key)
    if cached:
        logger.debug("latest_assessment_cache_hit", user_id=current_user.id)
        return cached

    latest = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .first()
    )
    if not latest:
        return {"has_assessment": False}

    preds = (
        db.query(PredictionDetail)
        .filter(PredictionDetail.assessment_id == latest.id)
        .order_by(PredictionDetail.rank.asc())
        .all()
    )

    predictions_list = []
    for p in preds:
        k_data = CAREER_KNOWLEDGE_BASE.get(p.career, {})
        predictions_list.append({
            "rank": p.rank,
            "career": p.career,
            "prediction_score": p.score,
            "raw_probability": p.score / 100.0,
            "is_top_match": p.rank == 1,
            "description": k_data.get("description", "High-growth professional career domain."),
            "required_skills": k_data.get("required_technical_skills", []),
            "career_opportunities": k_data.get("opportunities", []),
            "match_explanation": p.match_explanation or "Solid alignment with student credentials.",
        })

    result = {
        "has_assessment": True,
        "id": latest.id,
        "created_at": latest.created_at.isoformat(),
        "top_prediction": latest.top_career,
        "top_career": latest.top_career,
        "top_score": latest.top_score,
        "predictions": predictions_list,
        "profile_snapshot": latest.input_snapshot,
    }

    set_cached(cache_key, result, ttl_seconds=30)
    return result
