from agent_core.graphs.meeting_execution import run_mock_meeting_execution
from agent_core.schemas.meeting import MeetingInput


def test_mock_meeting_execution_returns_extraction_and_actions() -> None:
    result = run_mock_meeting_execution(
        MeetingInput(
            title="Weekly planning",
            transcript=(
                "We decided to launch the pilot. "
                "Alice will prepare the launch checklist by Friday. "
                "Risk: the vendor delay can block onboarding."
            ),
        )
    )

    assert result["extraction"]["meeting_title"] == "Weekly planning"
    assert result["extraction"]["items"][0]["kind"] == "decision"
    assert any(item["owner"] == "Alice" for item in result["extraction"]["items"])
    assert any(item["deadline"] == "Friday" for item in result["extraction"]["items"])
    assert result["proposed_actions"][0]["requires_approval"] is True
    assert len(result["proposed_actions"]) >= 2
