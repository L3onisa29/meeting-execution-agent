# ADR 004: LangGraph and OpenRouter Boundary

Status: Accepted

## Context

The agent workflow needs explicit state transitions, structured output validation, and a replaceable LLM provider.

## Decision

Use LangGraph for workflow orchestration and isolate OpenRouter behind an adapter.

## Consequences

- The graph can be tested independently of the provider.
- OpenRouter settings stay environment-driven.
- Provider errors need retry, timeout, and fallback handling.

