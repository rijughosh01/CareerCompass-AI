from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any
from app.schemas import StudentProfileBase
from app.services.ml_service import ml_service
from app.services.career_data import CAREER_KNOWLEDGE_BASE

router = APIRouter(prefix="/careers", tags=["Career Predictions & Recommendations"])


@router.post("/predict", response_model=List[Dict[str, Any]])
def predict_adhoc_career(profile_data: StudentProfileBase):
    """
    Returns ML predictions without requiring database persistence.
    """
    try:
        return ml_service.predict_career(profile_data.dict(), top_n=5)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model prediction failed: {str(e)}"
        )


@router.get("", response_model=List[Dict[str, Any]])
@router.get("/", response_model=List[Dict[str, Any]])
@router.get("/recommendations", response_model=List[Dict[str, Any]])
def get_all_career_profiles():
    """
    Returns catalog of all 22 career categories with market outlook and competencies.
    """
    catalog = []
    for name, data in CAREER_KNOWLEDGE_BASE.items():
        catalog.append({
            "name": name,
            "category": data.get("category", "General"),
            "description": data.get("description", ""),
            "market_outlook": data.get("market_outlook", "High Demand"),
            "required_technical_skills": data.get("required_technical_skills", []),
            "required_soft_skills": data.get("required_soft_skills", []),
            "opportunities": data.get("opportunities", [])
        })
    return catalog


@router.get("/{career_name}", response_model=Dict[str, Any])
def get_career_details(career_name: str):
    data = CAREER_KNOWLEDGE_BASE.get(career_name)
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career '{career_name}' not found in knowledge base."
        )
    return {
        "name": career_name,
        **data
    }

