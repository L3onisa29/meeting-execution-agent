FROM python:3.12-slim

WORKDIR /app
RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock ./
COPY packages/agent-core packages/agent-core
COPY services/worker services/worker

RUN uv sync --frozen --package agent-worker --no-dev

WORKDIR /app
ENV PYTHONUNBUFFERED=1
CMD ["uv", "run", "--frozen", "--directory", "/app/services/worker", "python", "-m", "app.main"]
