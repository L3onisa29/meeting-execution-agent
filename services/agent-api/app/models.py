from datetime import UTC, datetime
from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field


RunStatus = Literal[
    "queued",
    "running",
    "needs_approval",
    "approved",
    "executing",
    "completed",
    "failed",
    "cancelled",
]


class MeetingRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    title: str = Field(min_length=1)
    transcript: str = Field(min_length=1)
    workspace_id: str = "demo-workspace"
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class MockExternalAction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    provider: Literal["mock_task", "mock_issue", "mock_notification"]
    title: str
    status: Literal["executed", "failed"] = "executed"
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class AuditLogEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    actor: str
    event: str
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class AgentRunRecord(BaseModel):
    run_id: str = Field(default_factory=lambda: str(uuid4()))
    meeting: MeetingRecord
    status: RunStatus = "queued"
    extraction: dict = Field(default_factory=dict)
    proposed_actions: list[dict] = Field(default_factory=list)
    mock_external_actions: list[MockExternalAction] = Field(default_factory=list)
    audit_logs: list[AuditLogEntry] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    def touch(self) -> None:
        self.updated_at = datetime.now(UTC)


class RunCreate(BaseModel):
    title: str = Field(min_length=1)
    transcript: str = Field(min_length=1)
    workspace_id: str | None = None


class RunDecisionRequest(BaseModel):
    action_ids: list[str] | None = None
    actor: str = "demo-user"

