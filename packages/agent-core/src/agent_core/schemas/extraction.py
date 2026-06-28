from typing import Literal

from pydantic import BaseModel, Field


ExtractedItemKind = Literal["decision", "action_item", "risk", "follow_up"]


class ExtractedItem(BaseModel):
    kind: ExtractedItemKind
    text: str = Field(min_length=1)
    owner: str | None = None
    deadline: str | None = None
    confidence: float = Field(ge=0, le=1)


class ExtractionResult(BaseModel):
    meeting_title: str
    items: list[ExtractedItem]

