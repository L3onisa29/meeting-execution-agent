import type {
  AgentRun,
  CreateRunInput,
  RunDecisionInput,
} from '@meeting-execution-agent/contracts'
import { createServerFn } from '@tanstack/react-start'
import {
  approveRun,
  createRun,
  getMeetingRun,
  getRun,
  listRuns,
  rejectRun,
} from './agent-api'

export interface DashboardData {
  runs: AgentRun[]
  meetings: number
  pendingApprovals: number
  completedRuns: number
}

export const getDashboard = createServerFn({ method: 'GET' }).handler(async () => {
  const runs = await listRuns()
  return {
    runs: runs.slice(0, 5),
    meetings: runs.length,
    pendingApprovals: runs.filter((run) => run.status === 'needs_approval').length,
    completedRuns: runs.filter((run) => run.status === 'completed').length,
  } satisfies DashboardData
})

export const getRuns = createServerFn({ method: 'GET' }).handler(async () => {
  return listRuns()
})

export const getRunById = createServerFn({ method: 'GET' })
  .validator(parseRunIdInput)
  .handler(async ({ data }) => {
    return getRun(data.runId)
  })

export const getRunByMeetingId = createServerFn({ method: 'GET' })
  .validator(parseMeetingIdInput)
  .handler(async ({ data }) => {
    return getMeetingRun(data.meetingId)
  })

export const createMeetingRun = createServerFn({ method: 'POST' })
  .validator(parseCreateRunInput)
  .handler(async ({ data }) => {
    return createRun(data)
  })

export const approveMeetingRun = createServerFn({ method: 'POST' })
  .validator(parseDecisionInput)
  .handler(async ({ data }) => {
    return approveRun(data)
  })

export const rejectMeetingRun = createServerFn({ method: 'POST' })
  .validator(parseDecisionInput)
  .handler(async ({ data }) => {
    return rejectRun(data)
  })

function parseCreateRunInput(data: unknown): CreateRunInput {
  const value = asRecord(data)
  const title = asNonEmptyString(value.title, 'title')
  const transcript = asNonEmptyString(value.transcript, 'transcript')
  const workspaceId =
    typeof value.workspace_id === 'string' && value.workspace_id.trim()
      ? value.workspace_id.trim()
      : undefined

  return { title, transcript, workspace_id: workspaceId }
}

function parseRunIdInput(data: unknown): { runId: string } {
  const value = asRecord(data)
  return { runId: asNonEmptyString(value.runId, 'runId') }
}

function parseMeetingIdInput(data: unknown): { meetingId: string } {
  const value = asRecord(data)
  return { meetingId: asNonEmptyString(value.meetingId, 'meetingId') }
}

function parseDecisionInput(data: unknown): RunDecisionInput {
  const value = asRecord(data)
  const actionIds = Array.isArray(value.actionIds)
    ? value.actionIds.filter((id): id is string => typeof id === 'string')
    : undefined

  return {
    runId: asNonEmptyString(value.runId, 'runId'),
    actionIds,
    actor: typeof value.actor === 'string' ? value.actor : undefined,
  }
}

function asRecord(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') {
    throw new Error('Expected object input')
  }
  return data as Record<string, unknown>
}

function asNonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`${field} is required`)
  }
  return value.trim()
}
