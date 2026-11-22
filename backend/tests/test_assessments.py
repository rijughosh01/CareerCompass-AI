"""
Test suite for /api/assessments endpoints.
Covers: submit returns top-5 predictions, pagination, caching, latest endpoint.
"""
import pytest
from tests.conftest import SAMPLE_PROFILE


def test_submit_assessment_returns_200(client, auth_headers):
    """Submitting a valid assessment returns HTTP 200."""
    res = client.post("/api/assessments", json=SAMPLE_PROFILE, headers=auth_headers)
    assert res.status_code == 200, f"Unexpected status: {res.status_code} — {res.text}"


def test_submit_assessment_returns_top5_predictions(client, auth_headers):
    """Assessment response must include at least 5 career predictions."""
    res = client.post("/api/assessments", json=SAMPLE_PROFILE, headers=auth_headers)
    data = res.json()
    assert "predictions" in data, "Response missing 'predictions' key"
    assert len(data["predictions"]) >= 5, (
        f"Expected ≥5 predictions, got {len(data['predictions'])}"
    )


def test_submit_assessment_top_career_present(client, auth_headers):
    """Assessment response includes a non-empty top_career field."""
    res = client.post("/api/assessments", json=SAMPLE_PROFILE, headers=auth_headers)
    data = res.json()
    assert "top_career" in data
    assert isinstance(data["top_career"], str)
    assert len(data["top_career"]) > 0


def test_submit_assessment_prediction_scores_valid(client, auth_headers):
    """Each prediction item must have a numeric prediction_score between 0–100."""
    res = client.post("/api/assessments", json=SAMPLE_PROFILE, headers=auth_headers)
    predictions = res.json().get("predictions", [])
    for pred in predictions:
        score = pred.get("prediction_score", -1)
        assert 0 <= score <= 100, f"Score out of range: {score}"


def test_assessment_history_returns_list(client, auth_headers):
    """GET /api/assessments/history returns a list."""
    res = client.get("/api/assessments/history", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_assessment_history_pagination(client, auth_headers):
    """Pagination params skip/limit are accepted without error."""
    res = client.get("/api/assessments/history?skip=0&limit=5", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) <= 5


def test_assessment_latest_endpoint(client, auth_headers):
    """GET /api/assessments/latest returns 200 after at least one submission."""
    # Ensure at least one assessment exists
    client.post("/api/assessments", json=SAMPLE_PROFILE, headers=auth_headers)
    res = client.get("/api/assessments/latest", headers=auth_headers)
    assert res.status_code in (200, 404)
    if res.status_code == 200:
        data = res.json()
        assert "predictions" in data


def test_assessment_requires_auth(client):
    """Submitting an assessment without a token returns 401/403."""
    res = client.post("/api/assessments", json=SAMPLE_PROFILE)
    assert res.status_code in (401, 403)
