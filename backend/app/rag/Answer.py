"""
The RAG_QUERY path's entry point: question in, grounded answer + citations out.

This is what app/api/routes.py's RAG_QUERY branch should call, replacing
its current placeholder text.
"""

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
    """
    Retrieves relevant BIS content and generates a grounded answer.

    Deliberately does NOT call the LLM at all when nothing relevant was
    found (build_context returns empty) — both because
    BISPromptBuilder.build_prompt() rejects empty context by design
    (correctly — there'd be nothing to ground an answer in), and because
    calling an LLM to generate from no context risks it filling the gap
    with unsupported claims, exactly what prompt_builder.py's grounding
    rules exist to prevent. A clear "not found" message is safer and
    faster than a wasted, ungrounded generation call.
    """
    context, sources = build_context(question)

    if not context:
        return RagAnswer(answer=_NO_INFO_MESSAGE, sources=[])

    generator = BISLLMGenerator()
    try:
        answer_text = generator.generate_answer(question=question, context=context)
    except (ValueError, RuntimeError) as exc:
        logger.error("LLM generation failed for question %r: %s", question, exc)
        return RagAnswer(
            answer="Something went wrong generating an answer. Please try again.",
            sources=[],
        )

    return RagAnswer(answer=answer_text, sources=sources)