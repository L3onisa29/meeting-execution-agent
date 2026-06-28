import { createFileRoute } from '@tanstack/react-router'
import { MeetingForm } from '../components/MeetingForm'
import { MeetingList } from '../components/MeetingList'
import { getRuns } from '../lib/runs.functions'

export const Route = createFileRoute('/meetings')({
  loader: () => getRuns(),
  component: MeetingsPage,
})

function MeetingsPage() {
  const runs = Route.useLoaderData()

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Meetings</p>
          <h1>Transcript intake</h1>
        </div>
      </header>

      <section className="split-layout">
        <MeetingForm />
        <section className="section">
          <div className="section-heading">
            <h2>Meeting runs</h2>
          </div>
          <MeetingList runs={runs} emptyLabel="No transcript runs yet." />
        </section>
      </section>
    </main>
  )
}

