"""
Handles GENERAL_CHAT intent (greetings, "what can you do") WITHOUT going
through BISPromptBuilder — that prompt requires non-empty BIS context and
is built for compliance-sensitive grounded answers, neither of which
applies to "hello". Forcing greetings through that path would either
crash (build_prompt rejects empty context) or waste an LLM call
producing an overly formal, out-of-place response to small talk.
"""

from __future__ import annotations

from app.llm.ollama_client import OllamaClient

_SIMPLE_SYSTEM_PREFIX = (
    "You are BIS Assist, a friendly assistant for Indian Standards and "
    "BIS services. Respond briefly and naturally to this message. If "
    "asked what you can do, mention: answering questions about Indian "
    "Standards, BIS certification and hallmarking, finding testing "
    "laboratories, and recommending applicable standards for products."
)


def handle_general_chat(message: str) -> str:
    client = OllamaClient()
    prompt = f"{_SIMPLE_SYSTEM_PREFIX}\n\nUser: {message.strip()}\nBIS Assist:"
    return client.generate(prompt)