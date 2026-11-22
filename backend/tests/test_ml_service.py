"""
Unit tests for the ML prediction service.
Tests the core predict_career() method in isolation.
"""
import pytest
from app.services.ml_service import ml_service


# Minimal feature dict matching the model's expected inputs
MOCK_PROFILE = {
    "Age": 23,
    "Gender": "Male",
    "Highest_Qualification": "B.Tech",
    "Stream": "CSE",
    "Grade_CGPA_Percentage": 85.0,
    "Technical_Skills": "Python, Machine Learning, SQL, TensorFlow",
    "Soft_Skills": "Problem Solving, Communication",
    "Fields_of_Interest": "AI/ML",
    "Certifications": "AWS Cloud Practitioner",
    "Languages_Known": "English",
    "Preferred_Work_Style": "Remote",
    "Work_Type_Interest": "Full-time",
    "Willing_to_Relocate": "Yes",
    "Current_Academic_Level": "Student",
    "Past_Jobs_Internships": "",
    "Achievements": "",
    "Skills_Gained": "",
}


def test_ml_service_model_loaded():
    """The ML model bundle must be loaded at startup."""
    assert ml_service.model_loaded, "ML model is not loaded!"


def test_ml_service_has_classes():
    """The ML service must expose at least 10 career classes."""
    assert len(ml_service.classes) >= 10, (
        f"Expected ≥10 classes, got {len(ml_service.classes)}"
    )


def test_predict_career_returns_list(auth_headers=None):
    """predict_career() should return a non-empty list."""
    result = ml_service.predict_career(MOCK_PROFILE)
    assert isinstance(result, list), "Result must be a list"
    assert len(result) > 0, "Result list must not be empty"


def test_predict_career_returns_at_least_5():
    """predict_career() must return at least 5 candidates."""
    result = ml_service.predict_career(MOCK_PROFILE)
    assert len(result) >= 5, f"Expected ≥5 predictions, got {len(result)}"


def test_predict_career_structure():
    """Each prediction item must have 'career' and 'prediction_score'."""
    result = ml_service.predict_career(MOCK_PROFILE)
    for item in result:
        assert "career" in item, f"Missing 'career' in: {item}"
        assert "prediction_score" in item, f"Missing 'prediction_score' in: {item}"
        assert isinstance(item["career"], str)
        assert 0 <= item["prediction_score"] <= 100


def test_predict_career_scores_descending():
    """Predictions must be sorted by score (highest first)."""
    result = ml_service.predict_career(MOCK_PROFILE)
    scores = [item["prediction_score"] for item in result]
    assert scores == sorted(scores, reverse=True), "Predictions not sorted descending"


def test_predict_career_top_match_flag():
    """The first prediction must have is_top_match=True."""
    result = ml_service.predict_career(MOCK_PROFILE)
    assert result[0].get("is_top_match") is True


def test_predict_career_rank_sequence():
    """Rank field must start from 1 and be sequential."""
    result = ml_service.predict_career(MOCK_PROFILE)
    for i, item in enumerate(result):
        expected_rank = i + 1
        assert item.get("rank") == expected_rank, (
            f"Expected rank {expected_rank}, got {item.get('rank')}"
        )


def test_predict_career_different_profiles():
    """Two different profiles should potentially produce different top careers."""
    tech_profile = {**MOCK_PROFILE, "Technical_Skills": "React, JavaScript, CSS, HTML", "Fields_of_Interest": "Web Development"}
    result1 = ml_service.predict_career(MOCK_PROFILE)
    result2 = ml_service.predict_career(tech_profile)
    # Both must return valid predictions (even if same career, they won't crash)
    assert len(result1) >= 5
    assert len(result2) >= 5
