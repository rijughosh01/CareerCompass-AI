"""
Test suite for /api/auth endpoints.
Covers: register, login, duplicate email, wrong password, token validity.
"""
import pytest
from fastapi.testclient import TestClient


def test_register_success(client: TestClient):
    """A new user can register with valid credentials."""
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Fresh User",
            "email": "fresh_unique_123@example.com",
            "password": "FreshPass99!",
            "role": "student",
        },
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "fresh_unique_123@example.com"
    assert data["user"]["role"] == "student"


def test_register_duplicate_email(client: TestClient, registered_user):
    """Registering with an already-used email returns 400."""
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Duplicate",
            "email": registered_user["email"],
            "password": "AnotherPass123!",
            "role": "student",
        },
    )
    assert res.status_code == 400


def test_register_weak_password(client: TestClient):
    """Password shorter than 8 chars is rejected by schema validation."""
    res = client.post(
        "/api/auth/register",
        json={
            "full_name": "Weak Pass",
            "email": "weakpass@example.com",
            "password": "abc",          # < 8 chars
            "role": "student",
        },
    )
    assert res.status_code == 422  # Pydantic validation error


def test_login_success(client: TestClient, registered_user):
    """Login with correct credentials returns a JWT."""
    res = client.post("/api/auth/login", json=registered_user)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient, registered_user):
    """Login with wrong password returns 401."""
    res = client.post(
        "/api/auth/login",
        json={"email": registered_user["email"], "password": "WrongPassword!"},
    )
    assert res.status_code == 401


def test_login_nonexistent_user(client: TestClient):
    """Login with an email that doesn't exist returns 401."""
    res = client.post(
        "/api/auth/login",
        json={"email": "nobody@nowhere.com", "password": "SomePass123!"},
    )
    assert res.status_code == 401


def test_protected_route_without_token(client: TestClient):
    """Accessing a protected route without a token returns 401 or 403."""
    res = client.get("/api/students/profile")
    assert res.status_code in (401, 403)


def test_protected_route_with_token(client: TestClient, auth_headers):
    """Accessing profile with a valid token succeeds (200 or 404 if no profile yet)."""
    res = client.get("/api/students/profile", headers=auth_headers)
    assert res.status_code in (200, 404)
