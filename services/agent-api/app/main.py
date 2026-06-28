from typing import Literal
from uuid import uuid4

from agent_core.graphs.meeting_execution import run_mock_meeting_execution
from agent_core.schemas.meeting import MeetingInput
from fastapi import FastAPI
from pydantic import BaseModel, Field


class RunCreate(BaseModel):
    title: str = Field(min_length=1)
    transcript: str = Field(min_length=1)
    workspace_id: str | None = None


class RunResponse(BaseModel):
    run_id: str
    status: Literal["needs_approval"]
    result: dict


app = FastAPI(
    title="Meeting Execution Agent API",
    version="0.1.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "agent-api"}


@app.post("/runs", response_model=RunResponse)
def create_run(payload: RunCreate) -> RunResponse:
    meeting = MeetingInput(
        title=payload.title,
        transcript=payload.transcript,
        workspace_id=payload.workspace_id,
    )
    result = run_mock_meeting_execution(meeting)
    return RunResponse(
        run_id=str(uuid4()),
        status="needs_approval",
        result=result,
    )

