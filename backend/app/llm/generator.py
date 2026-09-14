from __future__ import annotations

from .ollama_client import OllamaClient
from .prompt_builder import BISPromptBuilder


class BISLLMGenerator:
    """
    Coordinates prompt construction and LLM generation
    for BIS Assist.
    """

    def __init__(
        self,
        ollama_client: OllamaClient | None = None,
        prompt_builder: BISPromptBuilder | None = None,
    ) -> None:
        self.ollama_client = ollama_client or OllamaClient()
        self.prompt_builder = prompt_builder or BISPromptBuilder()

    def generate_answer(
        self,
        question: str,
        context: str,
    ) -> str:
        """
        Generate a grounded answer using the supplied BIS context.
        """

        prompt = self.prompt_builder.build_prompt(
            question=question,
            context=context,
        )

        return self.ollama_client.generate(prompt)