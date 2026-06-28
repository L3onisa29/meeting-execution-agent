from agent_core.graphs.meeting_execution import run_mock_meeting_execution
from agent_core.schemas.meeting import MeetingInput
from app.models import (
    AgentRunRecord,
    AuditLogEntry,
    MeetingRecord,
    MockExternalAction,
    RunCreate,
    RunDecisionRequest,
)
from app.store import JsonRunStore, RunNotFoundError
from fastapi import FastAPI, HTTPException


def create_app(store: JsonRunStore | None = None) -> FastAPI:
    app = FastAPI(
        title="Meeting Execution Agent API",
        version="0.1.0",
    )
    app.state.store = store or JsonRunStore()

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "service": "agent-api"}

    @app.get("/runs", response_model=list[AgentRunRecord])
    def list_runs() -> list[AgentRunRecord]:
        return app.state.store.list_runs()

    @app.post("/runs", response_model=AgentRunRecord, status_code=201)
    def create_run(payload: RunCreate) -> AgentRunRecord:
        meeting = MeetingRecord(
            title=payload.title,
            transcript=payload.transcript,
            workspace_id=payload.workspace_id or "demo-workspace",
        )
        run = AgentRunRecord(
            meeting=meeting,
            status="running",
            audit_logs=[
                AuditLogEntry(
                    actor="system",
                    event="run.created",
                    message="Run queued from transcript input.",
                )
            ],
        )

        result = run_mock_meeting_execution(
            MeetingInput(
                title=meeting.title,
                transcript=meeting.transcript,
                workspace_id=meeting.workspace_id,
            )
        )
        run.extraction = result["extraction"]
        run.proposed_actions = result["proposed_actions"]
        run.status = "needs_approval"
        run.audit_logs.append(
            AuditLogEntry(
                actor="agent",
                event="run.needs_approval",
                message=f"Proposed {len(run.proposed_actions)} action(s) for review.",
            )
        )
        run.touch()
        return app.state.store.save_run(run)

    @app.get("/runs/{run_id}", response_model=AgentRunRecord)
    def get_run(run_id: str) -> AgentRunRecord:
        return _get_run_or_404(app.state.store, run_id)

    @app.post("/runs/{run_id}/approve", response_model=AgentRunRecord)
    def approve_run(run_id: str, payload: RunDecisionRequest) -> AgentRunRecord:
        run = _get_run_or_404(app.state.store, run_id)
        selected_ids = set(payload.action_ids or _all_proposed_action_ids(run))

        if run.status not in {"needs_approval", "approved"}:
            raise HTTPException(status_code=409, detail=f"Run is already {run.status}")

        run.status = "executing"
        executed_count = 0

        for action in run.proposed_actions:
            if action.get("id") not in selected_ids:
                continue

            action["status"] = "executed"
            run.mock_external_actions.append(
                MockExternalAction(
                    provider=action["kind"],
                    title=action["title"],
                    status="executed",
                )
            )
            executed_count += 1

        if executed_count == 0:
            raise HTTPException(status_code=400, detail="No proposed actions selected")

        run.status = "completed"
        run.audit_logs.append(
            AuditLogEntry(
                actor=payload.actor,
                event="run.approved",
                message=f"Approved and executed {executed_count} mock action(s).",
            )
        )
        run.touch()
        return app.state.store.save_run(run)

    @app.post("/runs/{run_id}/reject", response_model=AgentRunRecord)
    def reject_run(run_id: str, payload: RunDecisionRequest) -> AgentRunRecord:
        run = _get_run_or_404(app.state.store, run_id)
        selected_ids = set(payload.action_ids or _all_proposed_action_ids(run))

        if run.status not in {"needs_approval", "approved"}:
            raise HTTPException(status_code=409, detail=f"Run is already {run.status}")

        rejected_count = 0
        for action in run.proposed_actions:
            if action.get("id") in selected_ids:
                action["status"] = "rejected"
                rejected_count += 1

        if rejected_count == 0:
            raise HTTPException(status_code=400, detail="No proposed actions selected")

        run.status = "cancelled"
        run.audit_logs.append(
            AuditLogEntry(
                actor=payload.actor,
                event="run.rejected",
                message=f"Rejected {rejected_count} proposed action(s).",
            )
        )
        run.touch()
        return app.state.store.save_run(run)

    return app


def _get_run_or_404(store: JsonRunStore, run_id: str) -> AgentRunRecord:
    try:
        return store.get_run(run_id)
    except RunNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Run not found") from exc


def _all_proposed_action_ids(run: AgentRunRecord) -> list[str]:
    return [action["id"] for action in run.proposed_actions if action.get("status") == "proposed"]


app = create_app()
