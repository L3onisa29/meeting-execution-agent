import type {
  AgentRun,
  CreateRunInput,
  RunDecisionInput,
} from '@meeting-execution-agent/contracts'

const DEFAULT_AGENT_API_BASE_URL = 'http://localhost:8000'

function getAgentApiBaseUrl() {
  return process.env.AGENT_API_BASE_URL ?? DEFAULT_AGENT_API_BASE_URL
}

export async function listRuns(): Promise<AgentRun[]> {
  return agentApiFetch('/runs')
}

export async function getRun(runId: string): Promise<AgentRun> {
  return agentApiFetch(`/runs/${runId}`)
}

export async function getMeetingRun(meetingId: string): Promise<AgentRun | null> {
  const runs = await listRuns()
  return runs.find((run) => run.meeting.id === meetingId) ?? null
}

export async function createRun(input: CreateRunInput): Promise<AgentRun> {
  return agentApiFetch('/runs', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function approveRun(input: RunDecisionInput): Promise<AgentRun> {
  return agentApiFetch(`/runs/${input.runId}/approve`, {
    method: 'POST',
    body: JSON.stringify({
      action_ids: input.actionIds,
      actor: input.actor ?? 'demo-user',
    }),
  })
}

export async function rejectRun(input: RunDecisionInput): Promise<AgentRun> {
  return agentApiFetch(`/runs/${input.runId}/reject`, {
    method: 'POST',
    body: JSON.stringify({
      action_ids: input.actionIds,
      actor: input.actor ?? 'demo-user',
    }),
  })
}

async function agentApiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${getAgentApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Agent API ${response.status}: ${detail}`)
  }

  return response.json() as Promise<T>
}

