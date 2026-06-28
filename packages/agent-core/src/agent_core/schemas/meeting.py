from pydantic import BaseModel, Field


class MeetingInput(BaseModel):
    title: str = Field(min_length=1)
    transcript: str = Field(min_length=1)
    workspace_id: str | None = None

