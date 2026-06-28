import json
import os
import threading
from pathlib import Path

from app.models import AgentRunRecord


class RunNotFoundError(LookupError):
    pass


class JsonRunStore:
    def __init__(self, path: Path | None = None) -> None:
        data_dir = Path(os.getenv("MEA_DATA_DIR", ".data/agent-api"))
        self.path = path or data_dir / "runs.json"
        self._lock = threading.Lock()

    def list_runs(self) -> list[AgentRunRecord]:
        with self._lock:
            runs = self._read_runs()
        return sorted(runs.values(), key=lambda run: run.updated_at, reverse=True)

    def get_run(self, run_id: str) -> AgentRunRecord:
        with self._lock:
            runs = self._read_runs()
        try:
            return runs[run_id]
        except KeyError as exc:
            raise RunNotFoundError(run_id) from exc

    def save_run(self, run: AgentRunRecord) -> AgentRunRecord:
        with self._lock:
            runs = self._read_runs()
            runs[run.run_id] = run
            self._write_runs(runs)
        return run

    def _read_runs(self) -> dict[str, AgentRunRecord]:
        if not self.path.exists():
            return {}

        payload = json.loads(self.path.read_text())
        raw_runs = payload.get("runs", {})
        return {
            run_id: AgentRunRecord.model_validate(raw_run)
            for run_id, raw_run in raw_runs.items()
        }

    def _write_runs(self, runs: dict[str, AgentRunRecord]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {
            "runs": {
                run_id: run.model_dump(mode="json")
                for run_id, run in runs.items()
            }
        }
        self.path.write_text(json.dumps(payload, indent=2, sort_keys=True))

