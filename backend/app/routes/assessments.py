from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database import get_db
from app.models import User, StudentProfile, Assessment, PredictionDetail
from app.schemas import AssessmentSubmitRequest, AssessmentResponse
from app.core.security import get_current_user
from app.services.ml_service import ml_service
from app.services.career_data import CAREER_KNOWLEDGE_BASE

router = APIRouter(prefix="/assessments", tags=["Career Assessments"])


@router.post("", response_model=Dict[str, Any])
@router.post("/", response_model=Dict[str, Any])
def submit_assessment(
    request_data: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile_dict = request_data.model_dump(exclude={"save_to_profile"})
    if not profile_dict.get("full_name") or profile_dict["full_name"] == "Student":
        profile_dict["full_name"] = current_user.full_name or "Student"

    # 1. Run Machine Learning Career Prediction
    try:
        predictions = ml_service.predict_career(profile_dict, top_n=5)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Machine Learning model prediction failed: {str(e)}"
        )

    top_prediction = predictions[0]

    # 2. Save Assessment record to database
    assessment = Assessment(
        user_id=current_user.id,
        input_snapshot=profile_dict,
        top_career=top_prediction["career"],
        top_score=top_prediction["prediction_score"]
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # 3. Save prediction details
    for item in predictions:
        pred_detail = PredictionDetail(
            assessment_id=assessment.id,
            career=item["career"],
            score=item["prediction_score"],
            rank=item["rank"],
            match_explanation=item.get("match_explanation")
        )
        db.add(pred_detail)

    # 4. Update profile if requested
    if request_data.save_to_profile:
        profile_cols = {c.name for c in StudentProfile.__table__.columns}
        safe_profile_data = {k: v for k, v in profile_dict.items() if k in profile_cols}
        profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if not profile:
            profile = StudentProfile(user_id=current_user.id, **safe_profile_data)
            db.add(profile)
        else:
            for k, v in safe_profile_data.items():
                setattr(profile, k, v)

    db.commit()

    return {
        "id": assessment.id,
        "assessment_id": assessment.id,
        "created_at": assessment.created_at.isoformat(),
        "top_prediction": assessment.top_career,
        "top_career": assessment.top_career,
        "top_score": assessment.top_score,
        "predictions": predictions,
        "profile_snapshot": profile_dict
    }


@router.get("", response_model=List[Dict[str, Any]])
@router.get("/", response_model=List[Dict[str, Any]])
@router.get("/history", response_model=List[Dict[str, Any]])
def get_assessment_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    assessments = (
        db.query(Assessment)
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
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
                    "match_explanation": p.match_explanation
                }
                for p in preds
            ]
        })

    return results


@router.get("/latest", response_model=Dict[str, Any])
def get_latest_assessment(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
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
            "match_explanation": p.match_explanation or "Solid alignment with student credentials."
        })

    return {
        "has_assessment": True,
        "id": latest.id,
        "created_at": latest.created_at.isoformat(),
        "top_prediction": latest.top_career,
        "top_career": latest.top_career,
        "top_score": latest.top_score,
        "predictions": predictions_list,
        "profile_snapshot": latest.input_snapshot
    }

