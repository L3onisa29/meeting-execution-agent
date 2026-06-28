import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Settings</p>
          <h1>Workspace boundary</h1>
        </div>
      </header>

      <section className="section settings-grid">
        <article>
          <span>Agent API</span>
          <strong>http://localhost:8000</strong>
        </article>
        <article>
          <span>External integrations</span>
          <strong>Mock mode</strong>
        </article>
        <article>
          <span>Auth</span>
          <strong>Demo user</strong>
        </article>
      </section>
    </main>
  )
}

