FROM python:3.12-slim

WORKDIR /app
RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY packages/agent-core packages/agent-core
COPY services/agent-api services/agent-api

RUN uv sync --frozen --package agent-api --no-dev

WORKDIR /app
ENV PYTHONUNBUFFERED=1
CMD ["uv", "run", "--frozen", "--directory", "/app/services/agent-api", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
