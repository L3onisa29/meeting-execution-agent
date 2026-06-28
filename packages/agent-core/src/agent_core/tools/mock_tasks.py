from agent_core.schemas.actions import ProposedAction


def create_mock_task(action: ProposedAction) -> dict[str, str]:
    return {"provider": "mock_task", "title": action.title, "status": "created"}

