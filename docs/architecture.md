# Architecture

Meeting Execution Agent is split into a web-owned auth boundary and a Python-owned agent execution boundary.

```txt
Browser
  -> TanStack Start web app
  -> short-lived internal JWT
  -> FastAPI agent-api
  -> Redis job queue
  -> worker
  -> LangGraph agent-core
  -> Postgres + pgvector
```

## Boundaries

- The browser authenticates only with the web app.
- The web app owns Better Auth sessions and workspace authorization.
- FastAPI accepts only internal JWTs issued by the web app.
- The worker executes asynchronous graph jobs and writes durable run state.
- External integrations start as mocks, then graduate behind tool interfaces.

## Initial Data Services

- Postgres stores users, workspaces, meetings, runs, extracted items, proposed actions, and audit logs.
- pgvector is available for later transcript and retrieval features.
- Redis is the queue/cache layer for agent run dispatch.

## Near-Term Risks

- Keeping TS and Python contracts aligned needs an explicit schema generation step.
- Auth should be implemented before any real integration writes are enabled.
- LangGraph retries and structured output validation must be tested with fixtures before demo use.

