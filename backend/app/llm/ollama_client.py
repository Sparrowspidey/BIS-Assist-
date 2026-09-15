from __future__ import annotations

import requests

from ..config.Config import (
    LLM_MODEL,
    OLLAMA_TIMEOUT,
    OLLAMA_URL,
)


class OllamaClient:
    """
    Client for communicating with the local Ollama server.

    This class is responsible only for sending prompts to Ollama
    and returning the generated response.
    """

    def __init__(
        self,
        url: str = OLLAMA_URL,
        model: str = LLM_MODEL,
        timeout: int = OLLAMA_TIMEOUT,
    ) -> None:
        self.url = url
        self.model = model
        self.timeout = timeout

    def generate(self, prompt: str) -> str:
        """
        Send a prompt to Ollama and return the generated text.
        """

        if not prompt or not prompt.strip():
            raise ValueError("Prompt cannot be empty.")

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
        }

        try:
            response = requests.post(
                self.url,
                json=payload,
                timeout=self.timeout,
            )

            response.raise_for_status()

        except requests.RequestException as exc:
            raise RuntimeError(
                f"Failed to communicate with Ollama: {exc}"
            ) from exc

        try:
            data = response.json()
        except ValueError as exc:
            raise RuntimeError(
                "Ollama returned an invalid JSON response."
            ) from exc

        generated_text = data.get("response")

        if not isinstance(generated_text, str):
            raise RuntimeError(
                "Ollama response does not contain generated text."
            )

        return generated_text.strip()