from agent_core.schemas.actions import ProposedAction
from agent_core.schemas.extraction import ExtractedItem, ExtractionResult
from agent_core.schemas.meeting import MeetingInput


def run_mock_meeting_execution(meeting: MeetingInput) -> dict:
    extraction = ExtractionResult(
        meeting_title=meeting.title,
        items=[
            ExtractedItem(
                kind="action_item",
                text="Review extracted meeting follow-ups",
                owner="Unassigned",
                confidence=0.72,
            )
        ],
    )
    actions = [
        ProposedAction(
            kind="mock_task",
            title="Create follow-up task",
            description="Create a task from the extracted action item after approval.",
            requires_approval=True,
        )
    ]

    return {
        "extraction": extraction.model_dump(),
        "proposed_actions": [action.model_dump() for action in actions],
    }

