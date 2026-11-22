"""
Pytest fixtures: in-memory test DB, TestClient, and auth helpers.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db

# ------------------------------------------------------------------
# In-memory SQLite for tests (isolated from dev DB)
# ------------------------------------------------------------------
TEST_DB_URL = "sqlite:///./test_careercompass.db"
test_engine = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session", autouse=True)
def setup_db():
    """Create all tables before tests; drop after session."""
    Base.metadata.create_all(bind=test_engine)
    yield
    # Dispose engine connections before removing test DB (Windows file-lock fix)
    test_engine.dispose()
    Base.metadata.drop_all(bind=test_engine)
    import os, time
    time.sleep(0.3)  # brief wait for Windows to release the file handle
    try:
        if os.path.exists("test_careercompass.db"):
            os.remove("test_careercompass.db")
    except PermissionError:
        pass  # Windows may still hold the file; ignore on teardown


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture(scope="session")
def registered_user(client):
    """Register a test student once per session."""
    client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": "testuser@example.com",
            "password": "TestPass123!",
            "role": "student",
        },
    )
    return {"email": "testuser@example.com", "password": "TestPass123!"}


@pytest.fixture(scope="session")
def auth_token(client, registered_user):
    """Login and return a valid JWT access token."""
    res = client.post("/api/auth/login", json=registered_user)
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}


# Sample profile payload matching the ML feature columns
SAMPLE_PROFILE = {
    "full_name": "Test User",
    "age": 23,
    "gender": "Male",
    "highest_qualification": "B.Tech",
    "stream": "CSE",
    "current_academic_level": "Student",
    "grade_cgpa_percentage": 85.0,
    "technical_skills": "Python, Machine Learning, SQL, TensorFlow",
    "soft_skills": "Problem Solving, Communication, Teamwork",
    "languages_known": "English",
    "certifications": "AWS Cloud Practitioner",
    "fields_of_interest": "AI/ML",
    "preferred_work_style": "Remote",
    "work_type_interest": "Full-time",
    "willing_to_relocate": "Yes",
}
