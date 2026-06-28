from pathlib import Path

from app.main import create_app
from app.store import JsonRunStore
from fastapi.testclient import TestClient


def test_run_lifecycle_create_read_approve(tmp_path: Path) -> None:
    app = create_app(JsonRunStore(tmp_path / "runs.json"))
    client = TestClient(app)

    create_response = client.post(
        "/runs",
        json={
            "title": "Pilot launch",
            "transcript": "Marta will send the launch checklist by Friday. Risk of delay.",
        },
    )

    assert create_response.status_code == 201
    created = create_response.json()
    assert created["status"] == "needs_approval"
    assert created["proposed_actions"]

    run_response = client.get(f"/runs/{created['run_id']}")
    assert run_response.status_code == 200
    assert run_response.json()["meeting"]["title"] == "Pilot launch"

    approve_response = client.post(
        f"/runs/{created['run_id']}/approve",
        json={"actor": "test-user"},
    )

    assert approve_response.status_code == 200
    approved = approve_response.json()
    assert approved["status"] == "completed"
    assert approved["mock_external_actions"]
    assert approved["audit_logs"][-1]["event"] == "run.approved"
