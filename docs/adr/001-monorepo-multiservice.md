# ADR 001: Monorepo Multi-Service Architecture

Status: Accepted

## Context

The project combines a TypeScript web app, Python agent services, shared contracts, local infrastructure, and deployment configuration.

## Decision

Use a monorepo with pnpm for TypeScript packages and uv workspaces for Python packages/services.

## Consequences

- Cross-service changes stay visible in one repository.
- Lockfiles make TS and Python environments reproducible.
- CI must run both pnpm and uv verification paths.

