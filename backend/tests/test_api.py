import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_search_empty():
    response = client.get("/api/v1/search")
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert "total" in data
    assert data["total"] > 0


def test_search_exam():
    response = client.get("/api/v1/search?q=exam")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] > 0
    # Ensure examination portal or notice appears in results
    titles = [r["title"].lower() for r in data["results"]]
    assert any("examination" in t or "exam" in t for t in titles)


def test_portals_list():
    response = client.get("/api/v1/portals")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5
    slugs = [p["slug"] for p in data]
    assert "examination" in slugs
    assert "lms" in slugs


def test_portal_detail():
    response = client.get("/api/v1/portals/examination")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "examination"
    assert "srmap.edu.in" in data["url"]


def test_events_list():
    response = client.get("/api/v1/events")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_notices_list():
    response = client.get("/api/v1/notices")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    # Verify priority field
    assert data[0]["priority"] in ["NORMAL", "IMPORTANT", "URGENT"]


def test_projects_list():
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2


def test_organizations_list():
    response = client.get("/api/v1/organizations")
    assert response.status_code == 200
    data = response.json()
    names = [o["name"] for o in data]
    assert "Next Tech Lab" in names


def test_pulse_endpoint():
    response = client.get("/api/v1/pulse")
    assert response.status_code == 200
    data = response.json()
    assert "new_notices" in data
    assert "today_events" in data
    assert "upcoming_events" in data
    assert "counts" in data
    assert data["counts"]["portals"] > 0


def test_ai_chat_portal():
    response = client.post("/api/v1/ai/chat", json={"message": "Where is the examination portal?"})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "PORTAL_LOOKUP"
    assert "examination" in data["answer"].lower()
    assert len(data["sources"]) > 0
    assert any("examination" in s["url"].lower() or "exam" in s["title"].lower() for s in data["sources"])


def test_ai_chat_attendance():
    response = client.post("/api/v1/ai/chat", json={"message": "What is the minimum attendance rule?"})
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "DOCUMENT_RAG"
    assert "75%" in data["answer"]
    assert len(data["sources"]) > 0


def test_user_submission_review_queue():
    submission_payload = {
        "entity_type": "project",
        "title": "Autonomous Solar Quadcopter",
        "raw_data": {
            "department": "ECE",
            "year": "2026",
            "description": "Solar powered quadcopter research project",
            "technologies": ["ROS", "C++"],
        },
        "submitted_by": "Ravi K.",
        "source_url": "https://github.com/ravik/solar-quad",
    }
    response = client.post("/api/v1/submit", json=submission_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "PENDING"
    assert data["title"] == "Autonomous Solar Quadcopter"


def test_admin_auth_and_dashboard():
    # Unauthorized
    unauth_resp = client.get("/api/v1/admin/dashboard")
    assert unauth_resp.status_code == 401

    # Authorized
    auth_resp = client.get(
        "/api/v1/admin/dashboard",
        headers={"X-Admin-Token": "srmwiki-admin-secret-token-2026"},
    )
    assert auth_resp.status_code == 200
    dash = auth_resp.json()
    assert "content_counts" in dash
    assert dash["content_counts"]["portals"] > 0
    assert dash["review_queue"]["pending"] > 0
