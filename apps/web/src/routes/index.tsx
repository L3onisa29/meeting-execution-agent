import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

const getDashboardSeed = createServerFn({ method: 'GET' }).handler(async () => {
  return {
    meetings: 0,
    pendingApprovals: 0,
    integrations: ['GitHub', 'Linear', 'Notion', 'Slack'],
  }
})

export const Route = createFileRoute('/')({
  loader: () => getDashboardSeed(),
  component: HomePage,
})

function HomePage() {
  const data = Route.useLoaderData()

  return (
    <main className="shell">
      <section className="hero">
        <p className="eyebrow">Portfolio MVP foundation</p>
        <h1>Meeting Execution Agent</h1>
        <p className="lede">
          Transform transcripts into structured decisions, action items, risks,
          and human-approved follow-up actions.
        </p>
      </section>

      <section className="metrics" aria-label="Workspace snapshot">
        <article>
          <span>Meetings</span>
          <strong>{data.meetings}</strong>
        </article>
        <article>
          <span>Pending approvals</span>
          <strong>{data.pendingApprovals}</strong>
        </article>
        <article>
          <span>Planned integrations</span>
          <strong>{data.integrations.length}</strong>
        </article>
      </section>

      <section className="panel">
        <h2>Execution Flow</h2>
        <ol>
          <li>Paste or upload meeting notes.</li>
          <li>Extract decisions, owners, deadlines, and risks.</li>
          <li>Review proposed actions before anything is executed.</li>
          <li>Write an audit trail for every approved outcome.</li>
        </ol>
      </section>
    </main>
  )
}

