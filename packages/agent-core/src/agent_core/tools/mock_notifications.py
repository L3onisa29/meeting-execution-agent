from agent_core.schemas.actions import ProposedAction


def send_mock_notification(action: ProposedAction) -> dict[str, str]:
    return {"provider": "mock_notification", "title": action.title, "status": "sent"}

