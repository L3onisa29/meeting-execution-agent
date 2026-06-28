from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field


ActionKind = Literal["mock_task", "mock_issue", "mock_notification"]
ActionStatus = Literal["proposed", "approved", "rejected", "executed", "failed"]


class ProposedAction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    kind: ActionKind
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)
    source_item_id: str | None = None
    requires_approval: bool = True
    status: ActionStatus = "proposed"
