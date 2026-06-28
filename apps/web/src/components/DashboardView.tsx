import type { DashboardData } from '../lib/runs.functions'
import { MeetingList } from './MeetingList'

export function DashboardView({ data }: Readonly<{ data: DashboardData }>) {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Demo workspace</p>
          <h1>Execution desk</h1>
        </div>
      </header>

      <section className="metrics" aria-label="Workspace snapshot">
        <article>
          <span>Meetings</span>
          <strong>{data.meetings}</strong>
        </article>
        <article>
          <span>Pending approval</span>
          <strong>{data.pendingApprovals}</strong>
        </article>
        <article>
          <span>Completed runs</span>
          <strong>{data.completedRuns}</strong>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Recent runs</h2>
        </div>
        <MeetingList runs={data.runs} emptyLabel="No runs yet." />
      </section>
    </main>
  )
}

