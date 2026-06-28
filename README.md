# Meeting Execution Agent

Production-ready portfolio project for turning meeting transcripts into structured decisions, action items, risks, and approvable follow-up actions.

The first version uses mocked external integrations while keeping the architecture ready for GitHub, Linear, Notion, Slack, or similar systems.

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
pnpm check
uv run --package agent-core pytest packages/agent-core/tests
```

Start local data services when needed:

```bash
docker compose -f infra/compose.db.yml up -d
```

## Service Commands

```bash
pnpm web:dev
pnpm api:dev
pnpm worker:dev
```

## Documentation

- [Implementation plan](docs/implementation-plan.md)
- [Architecture](docs/architecture.md)
- [ADR 001: Monorepo multi-service architecture](docs/adr/001-monorepo-multiservice.md)
- [ADR 002: Web-owned auth boundary](docs/adr/002-web-owned-auth.md)
- [ADR 003: FastAPI agent service](docs/adr/003-fastapi-agent-service.md)
- [ADR 004: LangGraph and OpenRouter boundary](docs/adr/004-langgraph-openrouter.md)
- [ADR 005: Railway multi-service deployment](docs/adr/005-railway-multiservice-deploy.md)

