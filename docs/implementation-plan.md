# Implementation Plan

## Phase 1: Repository Foundations

Deliverables:

- pnpm workspace
- uv workspace
- TanStack Start app shell
- FastAPI service shell
- worker shell
- agent-core package with typed mock workflow
- contracts package
- local data compose file
- README, architecture document, and initial ADRs

Done when:

- `pnpm install` succeeds.
- `uv sync --all-packages` succeeds.
- Each service has a documented base command.
- Static verification can run without starting long-lived servers.

## Phase 2: Local Infrastructure

Deliverables:

- Postgres with pgvector
- Redis
- documented local env
- health checks for local services

Done when:

- Postgres and Redis are reachable through `infra/compose.db.yml`.
- The API can read required connection settings from env.

## Phase 3: Web App

Deliverables:

- login/logout shell with Better Auth
- workspace model
- meeting dashboard
- transcript paste/upload flow
- run detail page
- review and approval UI
- visible audit log

Done when:

- A user can create a mock meeting.
- The UI can navigate through meeting, run, approval, and audit views.

## Phase 4: Auth and Security

Deliverables:

- Better Auth session in the web app
- short-lived internal JWT from web to FastAPI
- FastAPI verification for signature, issuer, audience, and expiry
- rejected unauthenticated API calls

Done when:

- The browser never calls FastAPI directly.
- FastAPI accepts only valid internal service tokens.

## Phase 5: Backend API

Initial endpoints:

- `GET /health`
- `POST /runs`
- `GET /runs/{run_id}`
- `POST /runs/{run_id}/approve`
- `POST /runs/{run_id}/reject`

Done when:

- OpenAPI is generated.
- Run lifecycle state is persisted.
- Web calls are integrated through the internal auth boundary.

## Phase 6: Agent Core

Workflow:

```txt
ingest transcript
  -> normalize text
  -> extract decisions/action items/risks
  -> validate structured output
  -> propose mock actions
  -> wait for human approval
  -> execute approved mock actions
  -> write audit log
```

Done when:

- LangGraph workflow is executable from tests.
- Outputs are typed with Pydantic.
- LLM failure paths have retry and fallback behavior.

## Phase 7: OpenRouter Adapter

Done when:

- OpenRouter is isolated behind an adapter.
- The model is configurable through env.
- Token/cost metadata is logged when provider data is available.

## Phase 8: Worker

Run states:

```txt
queued
running
needs_approval
approved
executing
completed
failed
cancelled
```

Done when:

- Jobs are consumed from Redis.
- Run status is updated in Postgres.
- The UI can observe run progress.

## Phase 9: Database

Initial tables:

- users
- workspaces
- workspace_members
- meetings
- agent_runs
- extracted_items
- proposed_actions
- mock_external_actions
- audit_logs

Done when:

- Migrations are versioned.
- Demo seed data exists.
- Workspace/user authorization is represented in the schema.

## Phase 10: Review UI

Done when:

- A transcript can be entered from the UI.
- The agent generates proposals.
- A user can approve or reject proposals.
- Mock execution is visible in the audit trail.

## Phase 11: Eval and Testing

Metrics:

- action item recall
- owner accuracy
- deadline accuracy
- decision accuracy
- false positive rate

Done when:

- At least five transcript fixtures exist.
- A reproducible eval report can be generated.

## Phase 12: Docker and Railway

Done when:

- Each service has a Dockerfile.
- Railway config exists per service.
- README covers self-host and Railway deployment.

## Phase 13: Portfolio Documentation

Done when:

- Architecture, ADRs, tradeoffs, setup, demo flow, and future work are documented.
- The repository can be shown as a coherent production-style project.

