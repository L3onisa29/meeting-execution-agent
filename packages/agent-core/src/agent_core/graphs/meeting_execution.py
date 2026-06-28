import re

from agent_core.schemas.actions import ActionKind, ProposedAction
from agent_core.schemas.extraction import ExtractedItem, ExtractionResult
from agent_core.schemas.meeting import MeetingInput


def run_mock_meeting_execution(meeting: MeetingInput) -> dict:
    items = extract_mock_items(meeting.transcript)
    extraction = ExtractionResult(
        meeting_title=meeting.title,
        summary=summarize_transcript(meeting.transcript),
        items=items,
    )
    actions = propose_mock_actions(items)

    return {
        "extraction": extraction.model_dump(),
        "proposed_actions": [action.model_dump() for action in actions],
    }


def summarize_transcript(transcript: str) -> str:
    normalized = " ".join(transcript.split())
    if len(normalized) <= 180:
        return normalized
    return f"{normalized[:177].rstrip()}..."


def extract_mock_items(transcript: str) -> list[ExtractedItem]:
    sentences = _split_sentences(transcript)
    items: list[ExtractedItem] = []

    for sentence in sentences:
        lowered = sentence.lower()

        if _looks_like_decision(lowered):
            items.append(
                ExtractedItem(
                    kind="decision",
                    text=sentence,
                    confidence=0.8,
                )
            )

        if _looks_like_risk(lowered):
            items.append(
                ExtractedItem(
                    kind="risk",
                    text=sentence,
                    owner=_extract_owner(sentence),
                    confidence=0.76,
                )
            )

        if _looks_like_action(lowered):
            items.append(
                ExtractedItem(
                    kind="action_item",
                    text=sentence,
                    owner=_extract_owner(sentence),
                    deadline=_extract_deadline(sentence),
                    confidence=0.82,
                )
            )

        if _looks_like_follow_up(lowered):
            items.append(
                ExtractedItem(
                    kind="follow_up",
                    text=sentence,
                    owner=_extract_owner(sentence),
                    confidence=0.7,
                )
            )

        if len(items) >= 10:
            break

    if items:
        return items

    return [
        ExtractedItem(
            kind="follow_up",
            text="Review transcript and confirm follow-up actions.",
            owner="Unassigned",
            confidence=0.55,
        )
    ]


def propose_mock_actions(items: list[ExtractedItem]) -> list[ProposedAction]:
    actions: list[ProposedAction] = []

    for item in items:
        if item.kind == "action_item":
            actions.append(_action_for_item("mock_task", "Create task", item))
        elif item.kind == "risk":
            actions.append(_action_for_item("mock_notification", "Notify risk owner", item))
        elif item.kind == "decision":
            actions.append(_action_for_item("mock_issue", "Record decision", item))

        if len(actions) >= 6:
            break

    if actions:
        return actions

    return [
        ProposedAction(
            kind="mock_task",
            title="Review meeting follow-up",
            description="Create a task to manually review the transcript.",
            source_item_id=items[0].id if items else None,
        )
    ]


def _action_for_item(kind: ActionKind, title: str, item: ExtractedItem) -> ProposedAction:
    suffix = f" for {item.owner}" if item.owner else ""
    return ProposedAction(
        kind=kind,
        title=f"{title}{suffix}",
        description=item.text,
        source_item_id=item.id,
    )


def _split_sentences(transcript: str) -> list[str]:
    chunks = re.split(r"[\n.!?]+", transcript)
    return [chunk.strip(" -\t") for chunk in chunks if chunk.strip(" -\t")]


def _looks_like_decision(sentence: str) -> bool:
    return any(
        marker in sentence
        for marker in (
            "decided",
            "decision",
            "we will go with",
            "approved",
            "agreed to",
            "scelto",
            "deciso",
        )
    )


def _looks_like_risk(sentence: str) -> bool:
    return any(
        marker in sentence
        for marker in (
            "risk",
            "blocked",
            "blocker",
            "concern",
            "delay",
            "rischio",
            "blocco",
            "ritardo",
        )
    )


def _looks_like_action(sentence: str) -> bool:
    return any(
        marker in sentence
        for marker in (
            " will ",
            " needs to ",
            " need to ",
            " must ",
            " should ",
            " to prepare ",
            " to send ",
            " to review ",
            "entro",
            "deve",
            "preparera",
            "preparare",
        )
    )


def _looks_like_follow_up(sentence: str) -> bool:
    return any(
        marker in sentence
        for marker in (
            "follow up",
            "follow-up",
            "next step",
            "check back",
            "sync",
            "aggiornamento",
            "prossimo step",
        )
    )


def _extract_owner(sentence: str) -> str | None:
    patterns = (
        r"\b([A-Z][a-z]+)\s+(?:will|must|should|needs to|deve|preparera)\b",
        r"\bowner[:\s]+([A-Z][A-Za-z]+)\b",
        r"\b([A-Z][a-z]+)\s+to\s+(?:prepare|send|review|check)\b",
    )
    for pattern in patterns:
        match = re.search(pattern, sentence)
        if match:
            return match.group(1)
    return None


def _extract_deadline(sentence: str) -> str | None:
    match = re.search(
        r"\b(?:by|before|entro)\s+([A-Za-z]+day|tomorrow|today|next week|\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?)\b",
        sentence,
        re.IGNORECASE,
    )
    if match:
        return match.group(1)
    return None
