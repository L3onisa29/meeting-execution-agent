import type { RunStatus } from '@meeting-execution-agent/contracts'

export function StatusBadge({
  status,
}: Readonly<{ status: RunStatus | 'proposed' | 'rejected' | 'executed' }>) {
  return <span className={`status status-${status}`}>{status.replace('_', ' ')}</span>
}
