import { useNavigate } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { createMeetingRun } from '../lib/runs.functions'

const SAMPLE_TRANSCRIPT = `We decided to launch the partner pilot next month.
Alice will prepare the onboarding checklist by Friday.
Risk: the vendor contract delay can block the first customer rollout.
Marco should follow up with finance next week.`

export function MeetingForm() {
  const navigate = useNavigate()
  const createRun = useServerFn(createMeetingRun)
  const [title, setTitle] = useState('Partner pilot planning')
  const [transcript, setTranscript] = useState(SAMPLE_TRANSCRIPT)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <form
      className="form-panel"
      onSubmit={async (event) => {
        event.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
          const run = await createRun({ data: { title, transcript } })
          await navigate({ to: '/runs/$runId', params: { runId: run.run_id } })
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Run creation failed')
        } finally {
          setIsSubmitting(false)
        }
      }}
    >
      <label>
        <span>Meeting title</span>
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>

      <label>
        <span>Transcript</span>
        <textarea
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          rows={10}
        />
      </label>

      {error ? <p className="form-error">{error}</p> : null}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating run...' : 'Create run'}
      </button>
    </form>
  )
}

