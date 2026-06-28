from agent_core.graphs.meeting_execution import run_mock_meeting_execution
from agent_core.schemas.meeting import MeetingInput


def test_mock_meeting_execution_returns_extraction_and_actions() -> None:
    result = run_mock_meeting_execution(
        MeetingInput(
            title="Weekly planning",
            transcript="Alice will prepare the launch checklist by Friday.",
        )
    )

    assert result["extraction"]["meeting_title"] == "Weekly planning"
    assert result["proposed_actions"][0]["requires_approval"] is True

