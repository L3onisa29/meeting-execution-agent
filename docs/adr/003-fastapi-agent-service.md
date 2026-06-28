# ADR 003: FastAPI Agent Service

Status: Accepted

## Context

Agent execution needs a typed HTTP boundary that can validate inputs, expose OpenAPI, enqueue work, and report run state.

## Decision

Use FastAPI as the agent API service.

## Consequences

- Python agent code can be integrated without a separate language bridge.
- OpenAPI remains available for debugging and future clients.
- Internal auth must be added before non-health endpoints are production-ready.

