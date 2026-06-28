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
pnpm infra:up
```

## Service Commands

```bash
pnpm web:dev
pnpm api:dev
pnpm worker:dev
```

For the MVP flow, run the API and web app in separate terminals, then open the web app and create a run from `/meetings`.

## Infrastructure Commands

Default local containers:

```bash
pnpm infra:up       # start Postgres + Redis
pnpm infra:stop     # stop containers, keep them created
pnpm infra:down     # stop and remove containers, keep volumes
pnpm infra:refresh  # pull images and recreate containers
pnpm infra:reset    # remove containers and volumes
pnpm infra:ps
pnpm infra:logs
```

The same commands run on a VPS. Set the target through env vars instead of using duplicated script names:

```bash
cp .env.vps.example .env.vps
MEA_INFRA_TARGET=vps pnpm infra:up
MEA_INFRA_TARGET=vps pnpm infra:stop
MEA_INFRA_TARGET=vps pnpm infra:down
MEA_INFRA_TARGET=vps pnpm infra:refresh
MEA_INFRA_TARGET=vps pnpm infra:reset
MEA_INFRA_TARGET=vps pnpm infra:ps
MEA_INFRA_TARGET=vps pnpm infra:logs
```

Defaults:

- local target: project name `meeting-execution-agent-local`, no forced env file
- VPS target: project name `meeting-execution-agent-vps`, env file `.env.vps`

Override when needed:

```bash
MEA_INFRA_PROJECT=my-project MEA_INFRA_ENV_FILE=.env.production pnpm infra:up
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
