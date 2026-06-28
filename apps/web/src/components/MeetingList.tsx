import type { AgentRun } from '@meeting-execution-agent/contracts'
import { Link } from '@tanstack/react-router'
import { StatusBadge } from './StatusBadge'

export function MeetingList({
  runs,
  emptyLabel,
}: Readonly<{ runs: AgentRun[]; emptyLabel: string }>) {
  if (runs.length === 0) {
    return <p className="empty-state">{emptyLabel}</p>
  }

  return (
    <div className="table-list">
      {runs.map((run) => (
        <article key={run.run_id} className="table-row">
          <div>
            <Link to="/meetings/$meetingId" params={{ meetingId: run.meeting.id }}>
              {run.meeting.title}
            </Link>
            <p>{run.extraction.summary}</p>
          </div>
          <StatusBadge status={run.status} />
          <Link to="/runs/$runId" params={{ runId: run.run_id }} className="row-action">
            Review
          </Link>
        </article>
      ))}
    </div>
  )
}

