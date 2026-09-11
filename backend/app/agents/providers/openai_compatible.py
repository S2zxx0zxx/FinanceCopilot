from __future__ import annotations

from typing import Optional

from app.agents.providers.openai import OpenAIProvider


class OpenAICompatibleProvider(OpenAIProvider):
    """Talks to any OpenAI-compatible /v1/chat/completions endpoint:
    Groq, Together, OpenRouter, LM Studio, vLLM, Mistral La Plateforme, etc.

    Caller supplies base_url (required) and api_key. Same wire format as
    OpenAIProvider, so we just swap the URL.
    """

    name = "openai_compatible"

    def __init__(self, *, base_url: str, api_key: str = "", model: Optional[str] = None):
        if not base_url:
            raise ValueError("openai_compatible provider requires base_url")
        super().__init__(api_key=api_key, base_url=base_url, model=model)
