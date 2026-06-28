import type { AgentRun } from '@meeting-execution-agent/contracts'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { approveMeetingRun, rejectMeetingRun } from '../lib/runs.functions'
import { StatusBadge } from './StatusBadge'

export function RunDetail({ run }: Readonly<{ run: AgentRun }>) {
  const router = useRouter()
  const approveRun = useServerFn(approveMeetingRun)
  const rejectRun = useServerFn(rejectMeetingRun)
  const [error, setError] = useState<string | null>(null)
  const [isMutating, setIsMutating] = useState(false)
  const canDecide = run.status === 'needs_approval'

  async function decide(kind: 'approve' | 'reject') {
    setError(null)
    setIsMutating(true)
    try {
      const input = { runId: run.run_id, actor: 'demo-user' }
      if (kind === 'approve') {
        await approveRun({ data: input })
      } else {
        await rejectRun({ data: input })
      }
      await router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Run update failed')
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Run detail</p>
          <h1>{run.meeting.title}</h1>
        </div>
        <StatusBadge status={run.status} />
      </header>

      <section className="run-grid">
        <article className="section">
          <div className="section-heading">
            <h2>Extracted items</h2>
          </div>
          <div className="item-stack">
            {run.extraction.items.map((item) => (
              <div key={item.id} className="extract-card">
                <span>{item.kind.replace('_', ' ')}</span>
                <p>{item.text}</p>
                <small>
                  {item.owner ?? 'No owner'} {item.deadline ? `- ${item.deadline}` : ''}
                </small>
              </div>
            ))}
          </div>
        </article>

        <article className="section">
          <div className="section-heading">
            <h2>Proposed actions</h2>
          </div>
          <div className="item-stack">
            {run.proposed_actions.map((action) => (
              <div key={action.id} className="action-card">
                <div>
                  <strong>{action.title}</strong>
                  <p>{action.description}</p>
                </div>
                <StatusBadge status={action.status} />
              </div>
            ))}
          </div>

          {canDecide ? (
            <div className="button-row">
              <button onClick={() => decide('approve')} disabled={isMutating}>
                Approve all
              </button>
              <button
                className="secondary-button"
                onClick={() => decide('reject')}
                disabled={isMutating}
              >
                Reject all
              </button>
            </div>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Audit trail</h2>
        </div>
        <div className="timeline">
          {run.audit_logs.map((entry) => (
            <article key={entry.id}>
              <span>{entry.event}</span>
              <p>{entry.message}</p>
              <small>
                {entry.actor} - {new Date(entry.created_at).toLocaleString()}
              </small>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

