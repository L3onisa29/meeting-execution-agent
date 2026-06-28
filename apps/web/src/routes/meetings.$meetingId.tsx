import { Link, createFileRoute } from '@tanstack/react-router'
import { StatusBadge } from '../components/StatusBadge'
import { getRunByMeetingId } from '../lib/runs.functions'

export const Route = createFileRoute('/meetings/$meetingId')({
  loader: ({ params }) => getRunByMeetingId({ data: { meetingId: params.meetingId } }),
  component: MeetingDetailPage,
})

function MeetingDetailPage() {
  const run = Route.useLoaderData()

  if (!run) {
    return (
      <main className="page">
        <p className="empty-state">Meeting not found.</p>
      </main>
    )
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Meeting</p>
          <h1>{run.meeting.title}</h1>
        </div>
        <StatusBadge status={run.status} />
      </header>

      <section className="split-layout">
        <article className="section">
          <div className="section-heading">
            <h2>Transcript</h2>
          </div>
          <pre className="transcript">{run.meeting.transcript}</pre>
        </article>
        <article className="section">
          <div className="section-heading">
            <h2>Run</h2>
          </div>
          <p className="summary">{run.extraction.summary}</p>
          <Link to="/runs/$runId" params={{ runId: run.run_id }} className="button-link">
            Open review
          </Link>
        </article>
      </section>
    </main>
  )
}

