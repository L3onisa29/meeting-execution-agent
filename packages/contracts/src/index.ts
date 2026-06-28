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
  id: string
  kind: ProposedActionKind
  title: string
  description: string
  source_item_id: string | null
  requires_approval: boolean
  status: 'proposed' | 'approved' | 'rejected' | 'executed' | 'failed'
}

export interface ExtractedItem {
  id: string
  kind: 'decision' | 'action_item' | 'risk' | 'follow_up'
  text: string
  owner: string | null
  deadline: string | null
  confidence: number
}

export interface ExtractionResult {
  meeting_title: string
  summary: string
  items: ExtractedItem[]
}

export interface MeetingRecord {
  id: string
  title: string
  transcript: string
  workspace_id: string
  created_at: string
}

export interface MockExternalAction {
  id: string
  provider: ProposedActionKind
  title: string
  status: 'executed' | 'failed'
  created_at: string
}

export interface AuditLogEntry {
  id: string
  actor: string
  event: string
  message: string
  created_at: string
}

export interface AgentRun {
  run_id: string
  meeting: MeetingRecord
  status: RunStatus
  extraction: ExtractionResult
  proposed_actions: ProposedAction[]
  mock_external_actions: MockExternalAction[]
  audit_logs: AuditLogEntry[]
  created_at: string
  updated_at: string
}

export interface CreateRunInput {
  title: string
  transcript: string
  workspace_id?: string
}

export interface RunDecisionInput {
  runId: string
  actionIds?: string[]
  actor?: string
}
