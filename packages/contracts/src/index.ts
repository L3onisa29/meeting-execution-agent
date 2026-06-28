export type RunStatus =
  | 'queued'
  | 'running'
  | 'needs_approval'
  | 'approved'
  | 'executing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type ProposedActionKind = 'mock_task' | 'mock_issue' | 'mock_notification'

export interface ProposedAction {
  kind: ProposedActionKind
  title: string
  description: string
  requiresApproval: boolean
  status: 'proposed' | 'approved' | 'rejected' | 'executed' | 'failed'
}

