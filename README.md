# Meeting Execution Agent

Production-ready portfolio project for turning meeting transcripts into structured decisions, action items, risks, and approvable follow-up actions.

The first version uses mocked external integrations while keeping the architecture ready for GitHub, Linear, Notion, Slack, or similar systems.

## Current MVP

The first working version supports:

- transcript intake from the web app
- synchronous FastAPI run creation
- deterministic extraction of decisions, action items, risks, and follow-ups
- proposed mock actions
- approve/reject flow
- mock external execution records
- audit trail per run

For local development, run state is stored in `.data/agent-api/runs.json`. Postgres and Redis are already scaffolded for the next persistence/queue phase.

## Stack

- Frontend: React, TanStack Start, pnpm
- Auth: Better Auth planned for the web app
- Agent API: FastAPI, uv
- Agent workflow: LangGraph
- LLM provider: OpenRouter
- Data: Postgres with pgvector, Redis
- Deploy target: Docker per service, Railway multi-service

## Repository Layout

```txt
apps/web              TanStack Start web app
services/agent-api   FastAPI API for agent runs
services/worker      Background worker bootstrap
packages/agent-core  Python agent domain logic
packages/contracts   Shared TypeScript contracts
packages/prompts     Prompt assets
infra                Local data infrastructure
docs                 Architecture, ADRs, implementation plan
```

## Local Setup

Install JavaScript dependencies:

```bash
pnpm install
```

Install Python workspace dependencies:

```bash
uv sync --all-packages
```

Run static verification:

```bash
pnpm verify
```

Start local data services when needed:

```bash
pnpm infra:local:up
```

## Service Commands

```bash
pnpm web:dev
pnpm api:dev
pnpm worker:dev
```

For the MVP flow, run the API and web app in separate terminals, then open the web app and create a run from `/meetings`.

## Infrastructure Commands

Local containers:

```bash
pnpm infra:local:up       # start Postgres + Redis
pnpm infra:local:stop     # stop containers, keep them created
pnpm infra:local:down     # stop and remove containers, keep volumes
pnpm infra:local:refresh  # pull images and recreate containers
pnpm infra:local:reset    # remove containers and volumes
pnpm infra:local:ps
pnpm infra:local:logs
```

VPS containers use the same compose file, but read `.env.vps` and use a fixed compose project name:

```bash
cp .env.vps.example .env.vps
pnpm infra:vps:up
pnpm infra:vps:stop
pnpm infra:vps:down
pnpm infra:vps:refresh
pnpm infra:vps:reset
pnpm infra:vps:ps
pnpm infra:vps:logs
```

By default, Postgres and Redis bind to `127.0.0.1` through `POSTGRES_PORT_BIND` and `REDIS_PORT_BIND`, which is the expected VPS posture unless a private network or firewall rule is configured.

## Documentation

- [Implementation plan](docs/implementation-plan.md)
- [Architecture](docs/architecture.md)
- [ADR 001: Monorepo multi-service architecture](docs/adr/001-monorepo-multiservice.md)
- [ADR 002: Web-owned auth boundary](docs/adr/002-web-owned-auth.md)
- [ADR 003: FastAPI agent service](docs/adr/003-fastapi-agent-service.md)
- [ADR 004: LangGraph and OpenRouter boundary](docs/adr/004-langgraph-openrouter.md)
- [ADR 005: Railway multi-service deployment](docs/adr/005-railway-multiservice-deploy.md)
