from typing import Literal

from pydantic import BaseModel, Field


ActionKind = Literal["mock_task", "mock_issue", "mock_notification"]
ActionStatus = Literal["proposed", "approved", "rejected", "executed", "failed"]


class ProposedAction(BaseModel):
    kind: ActionKind
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    requires_approval: bool = True
    status: ActionStatus = "proposed"

