# ADR 002: Web-Owned Auth Boundary

Status: Accepted

## Context

The browser-facing product needs login, workspace membership, and role checks, while the Python API should focus on agent execution.

## Decision

The web app owns Better Auth sessions and issues short-lived internal JWTs for FastAPI calls.

## Consequences

- FastAPI does not implement browser login.
- The browser does not call FastAPI directly.
- API authorization depends on strict JWT verification and web-side permission checks.

