"""
Upgraded careers route with:
- In-memory caching (1-hour TTL) for the catalog endpoint
- Cache invalidation support
- Structured logging
"""
import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from app.schemas import StudentProfileBase
from app.services.ml_service import ml_service
from app.services.career_data import CAREER_KNOWLEDGE_BASE
from app.services.cache_service import get_cached, set_cached

logger = structlog.get_logger("careercompass.careers")
router = APIRouter(prefix="/careers", tags=["Career Predictions & Recommendations"])

CAREERS_CATALOG_CACHE_KEY = "careers:catalog"
CACHE_TTL = 3600  # 1 hour


@router.post("/predict", response_model=List[Dict[str, Any]])
def predict_adhoc_career(profile_data: StudentProfileBase):
    """
    Returns ML predictions without requiring database persistence.
    Useful for quick live-preview career affinity scoring.
    """
    try:
        return ml_service.predict_career(profile_data.dict(), top_n=5)
    except Exception as e:
        logger.error("adhoc_prediction_failed", error=str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Model prediction failed: {str(e)}",
        )


@router.get("", response_model=List[Dict[str, Any]])
@router.get("/", response_model=List[Dict[str, Any]])
@router.get("/recommendations", response_model=List[Dict[str, Any]])
def get_all_career_profiles():
    """
    Returns the catalog of all 22 career categories.
    Cached in memory for 1 hour to avoid rebuilding on every request.
    """
    cached = get_cached(CAREERS_CATALOG_CACHE_KEY)
    if cached:
        logger.debug("careers_catalog_cache_hit")
        return cached

    catalog = []
    for name, data in CAREER_KNOWLEDGE_BASE.items():
        catalog.append({
            "name": name,
            "category": data.get("category", "General"),
            "description": data.get("description", ""),
            "market_outlook": data.get("market_outlook", "High Demand"),
            "required_technical_skills": data.get("required_technical_skills", []),
            "required_soft_skills": data.get("required_soft_skills", []),
            "opportunities": data.get("opportunities", []),
        })

    set_cached(CAREERS_CATALOG_CACHE_KEY, catalog, ttl_seconds=CACHE_TTL)
    logger.info("careers_catalog_refreshed", count=len(catalog))
    return catalog


@router.get("/{career_name}", response_model=Dict[str, Any])
def get_career_details(career_name: str):
    """Return details for a single career from the knowledge base."""
    # Try URL-decoded name and spaces-for-hyphens variant
    data = CAREER_KNOWLEDGE_BASE.get(career_name) or CAREER_KNOWLEDGE_BASE.get(
        career_name.replace("-", " ")
    )
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Career '{career_name}' not found in knowledge base.",
        )
    return {"name": career_name, **data}
