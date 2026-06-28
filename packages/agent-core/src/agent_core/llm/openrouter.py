import os

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential


class OpenRouterClient:
    def __init__(self) -> None:
        self.api_key = os.getenv("OPENROUTER_API_KEY", "")
        self.base_url = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1")
        self.model = os.getenv("OPENROUTER_MODEL", "openrouter/free")

    @retry(wait=wait_exponential(multiplier=1, min=1, max=8), stop=stop_after_attempt(3))
    async def complete(self, prompt: str) -> str:
        if not self.api_key:
            raise RuntimeError("OPENROUTER_API_KEY is required")

        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            response.raise_for_status()

        payload = response.json()
        return payload["choices"][0]["message"]["content"]

