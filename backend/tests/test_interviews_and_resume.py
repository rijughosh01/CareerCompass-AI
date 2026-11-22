"""
Tests for AI Mock Interviewer, 1-Click Resume Builder, and Roadmap Progress Tracker.
"""
import pytest
from fastapi.testclient import TestClient


def test_start_interview_creates_session_and_first_question(client: TestClient, auth_headers: dict):
    payload = {
        "career": "Machine Learning Engineer",
        "difficulty": "Mid-Level"
    }
    response = client.post("/api/interviews/start", json=payload, headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["career"] == "Machine Learning Engineer"
    assert data["difficulty"] == "Mid-Level"
    assert data["status"] == "active"
    assert len(data["exchanges"]) >= 1
    assert len(data["exchanges"][0]["question"]) > 10


def test_evaluate_interview_answer_scores_response(client: TestClient, auth_headers: dict):
    # 1. Start session
    start_res = client.post(
        "/api/interviews/start",
        json={"career": "Frontend Developer", "difficulty": "Junior"},
        headers=auth_headers
    )
    assert start_res.status_code == 200
    session_data = start_res.json()
    session_id = session_data["id"]
    exchange_id = session_data["exchanges"][0]["id"]

    # 2. Submit answer
    answer_payload = {
        "session_id": session_id,
        "exchange_id": exchange_id,
        "answer": "Props are passed down to child components as immutable inputs, while state is mutable and managed inside the component with useState."
    }
    eval_res = client.post("/api/interviews/evaluate", json=answer_payload, headers=auth_headers)
    assert eval_res.status_code == 200
    eval_data = eval_res.json()
    assert "evaluation" in eval_data
    assert eval_data["evaluation"]["score"] >= 1.0
    assert eval_data["evaluation"]["feedback"] is not None
    assert eval_data["evaluation"]["model_answer"] is not None
    assert eval_data["session"]["questions_answered"] >= 1


def test_interview_history_lists_sessions(client: TestClient, auth_headers: dict):
    response = client.get("/api/interviews/history", headers=auth_headers)
    assert response.status_code == 200
    history = response.json()
    assert isinstance(history, list)
    assert len(history) >= 1


def test_generate_ats_resume_returns_structure(client: TestClient, auth_headers: dict):
    payload = {
        "target_career": "Machine Learning Engineer",
        "full_name": "Alex Morgan",
        "raw_experience": "Worked on customer churn prediction models using Scikit-Learn and FastAPI.",
        "raw_projects": "Built deep learning vision classifier and automated MLOps tracking pipeline."
    }
    response = client.post("/api/resumes/builder/generate", json=payload, headers=auth_headers)
    assert response.status_code == 200
    resume = response.json()
    assert resume["full_name"] == "Alex Morgan"
    assert resume["target_career"] == "Machine Learning Engineer"
    assert len(resume["summary"]) > 20
    assert "skills_grouped" in resume
    assert len(resume["experience"]) >= 1
    assert len(resume["projects"]) >= 1
    assert len(resume["experience"][0]["bullets"]) >= 1


def test_roadmap_progress_toggle_and_get(client: TestClient, auth_headers: dict):
    career = "Machine Learning Engineer"

    # Toggle a progress item
    toggle_payload = {
        "career": career,
        "stage": "Beginner",
        "item_type": "skill",
        "item_title": "Python",
        "completed": True
    }
    res_toggle = client.post("/api/roadmaps/progress/toggle", json=toggle_payload, headers=auth_headers)
    assert res_toggle.status_code == 200
    toggle_data = res_toggle.json()
    assert toggle_data["career"] == career
    assert toggle_data["completed_count"] >= 1
    assert toggle_data["readiness_percentage"] >= 0.0

    # Get roadmap progress
    res_get = client.get(f"/api/roadmaps/progress?career={career}", headers=auth_headers)
    assert res_get.status_code == 200
    prog_data = res_get.json()
    assert prog_data["career"] == career
    assert "Beginner:skill:Python" in prog_data["completed_items"]

