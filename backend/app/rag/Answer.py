from __future__ import annotations

import logging
from dataclasses import dataclass, field

from app.rag.Retriever import build_context
from app.llm.generator import BISLLMGenerator

logger = logging.getLogger(__name__)

_NO_INFO_MESSAGE = (
    "I couldn't find sufficient information in the available BIS sources "
    "to answer that confidently. Could you rephrase, or ask about a "
    "specific standard, certification scheme, or BIS service?"
)


@dataclass
class RagAnswer:
    answer: str
    sources: list[dict] = field(default_factory=list)


def answer_from_documents(question: str) -> RagAnswer:
    context, sources = build_context(question)

    if not context:
        return RagAnswer(
            answer=_NO_INFO_MESSAGE,
            sources=[],
        )

    generator = BISLLMGenerator()

    try:
        answer_text = generator.generate_answer(
            question=question,
            context=context,
        )

    except (ValueError, RuntimeError) as exc:
        logger.error(
            "LLM generation failed for question %r: %s",
            question,
            exc,
        )

        return RagAnswer(
            answer="Something went wrong generating an answer. Please try again.",
            sources=[],
        )

    formatted_sources = []

    for source in sources:
        metadata = source.get("metadata", {})

        formatted_sources.append(
            {
                "standard_id": (
                    source.get("standard_id")
                    or metadata.get("standard_id")
                ),
                "clause": (
                    source.get("clause")
                    or metadata.get("clause")
                ),
                "document_title": (
                    source.get("title")
                    or source.get("document_title")
                    or metadata.get("title")
                    or metadata.get("document_title")
                ),
                "snippet": (
                    source.get("text")
                    or source.get("snippet")
                    or metadata.get("text")
                    or metadata.get("snippet")
                ),
            }
        )

    return RagAnswer(
        answer=answer_text,
        sources=formatted_sources,
    )