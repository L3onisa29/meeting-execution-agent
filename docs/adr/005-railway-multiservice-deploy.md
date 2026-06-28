# ADR 005: Railway Multi-Service Deployment

Status: Proposed

## Context

The app will deploy as separate web, API, worker, Postgres, and Redis services.

## Decision

Prepare Dockerfiles and Railway config per deployable service.

## Consequences

- Each service can build independently.
- Railway watch patterns and env scoping can be added in a later deployment phase.
- Local Docker verification remains useful before Railway deployment.

