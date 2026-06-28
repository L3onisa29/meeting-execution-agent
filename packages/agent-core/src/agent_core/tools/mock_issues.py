from agent_core.schemas.actions import ProposedAction


def create_mock_issue(action: ProposedAction) -> dict[str, str]:
    return {"provider": "mock_issue", "title": action.title, "status": "created"}

