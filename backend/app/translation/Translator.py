"""
Translates text to/from English.

Translation fallback order:

    1. GoogleTranslator
       Best quality, but may be rate-limited.

    2. MyMemoryTranslator
       Different external service. Long text is automatically split into
       chunks because MyMemory has a 500-character limit per request.

    3. Local Ollama LLM
       Used only when both external translation services fail.

The backend internally works in English. User queries are translated to
English before RAG/intent processing, and generated answers are translated
back to the user's selected/detected language.
"""

from __future__ import annotations

import logging
import re

from app.translation.Detector import language_name

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# MyMemory language mapping
# ---------------------------------------------------------------------------
#
# MyMemory expects locale-style language codes such as "hi-IN".
# GoogleTranslator accepts the normal ISO 639-1 codes such as "hi".
#
_MYMEMORY_LANG_MAP = {
    "en": "en-IN",
    "hi": "hi-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "bn": "bn-IN",
    "mr": "mr-IN",
    "gu": "gu-IN",
    "pa": "pa-IN",
    "ur": "ur-PK",
}


# MyMemory's documented/observed maximum text length is 500 characters.
# Keep a little safety margin.
_MYMEMORY_MAX_CHARS = 480


def _to_mymemory_code(code: str) -> str:
    """
    Convert an ISO 639-1 language code into the locale-style code expected
    by MyMemoryTranslator.
    """
    return _MYMEMORY_LANG_MAP.get(code, code)


# ---------------------------------------------------------------------------
# Google translation
# ---------------------------------------------------------------------------

def _translate_via_google(
    text: str,
    source: str,
    target: str,
) -> str:
    from deep_translator import GoogleTranslator

    return GoogleTranslator(
        source=source,
        target=target,
    ).translate(text)


# ---------------------------------------------------------------------------
# MyMemory translation
# ---------------------------------------------------------------------------

def _translate_via_mymemory(
    text: str,
    source: str,
    target: str,
) -> str:
    """
    Translate text using MyMemory.

    MyMemory rejects requests longer than approximately 500 characters.
    Therefore long answers are split into smaller chunks and translated
    independently.
    """

    from deep_translator import MyMemoryTranslator

    source_code = _to_mymemory_code(source)
    target_code = _to_mymemory_code(target)

    translator = MyMemoryTranslator(
        source=source_code,
        target=target_code,
    )

    # Short text can be translated directly.
    if len(text) <= _MYMEMORY_MAX_CHARS:
        return translator.translate(text)

    chunks = _split_text_for_translation(
        text,
        max_chars=_MYMEMORY_MAX_CHARS,
    )

    translated_chunks = []

    for index, chunk in enumerate(chunks, start=1):
        logger.info(
            "MyMemory translating chunk %d/%d (%d characters)",
            index,
            len(chunks),
            len(chunk),
        )

        translated = translator.translate(chunk)

        if translated:
            translated_chunks.append(translated)

    return "\n".join(translated_chunks)


# ---------------------------------------------------------------------------
# Text chunking
# ---------------------------------------------------------------------------

def _split_text_for_translation(
    text: str,
    max_chars: int = _MYMEMORY_MAX_CHARS,
) -> list[str]:
    """
    Split text into chunks no longer than max_chars.

    The function tries to split at:

        1. paragraph boundaries
        2. newline boundaries
        3. sentence boundaries
        4. word boundaries
        5. hard character boundaries as a last resort

    This helps preserve readability while staying below MyMemory's limit.
    """

    text = text.strip()

    if not text:
        return []

    if len(text) <= max_chars:
        return [text]

    # First try paragraphs.
    paragraphs = re.split(r"\n\s*\n", text)

    chunks: list[str] = []
    current = ""

    for paragraph in paragraphs:

        paragraph = paragraph.strip()

        if not paragraph:
            continue

        # If the paragraph itself fits, add it normally.
        candidate = (
            paragraph
            if not current
            else current + "\n\n" + paragraph
        )

        if len(candidate) <= max_chars:
            current = candidate
            continue

        # Current chunk is full.
        if current:
            chunks.append(current)
            current = ""

        # Paragraph itself is too large.
        if len(paragraph) > max_chars:
            paragraph_chunks = _split_large_block(
                paragraph,
                max_chars,
            )
            chunks.extend(paragraph_chunks)
        else:
            current = paragraph

    if current:
        chunks.append(current)

    return chunks


def _split_large_block(
    text: str,
    max_chars: int,
) -> list[str]:
    """
    Split a large block while trying to preserve sentence and word
    boundaries.
    """

    text = text.strip()

    if len(text) <= max_chars:
        return [text]

    chunks: list[str] = []
    remaining = text

    while len(remaining) > max_chars:

        candidate = remaining[:max_chars]

        # Prefer a newline.
        split_at = candidate.rfind("\n")

        # Otherwise prefer sentence-ending punctuation.
        if split_at < max_chars // 2:
            sentence_positions = [
                candidate.rfind(". "),
                candidate.rfind("? "),
                candidate.rfind("! "),
                candidate.rfind("। "),
            ]

            best_sentence = max(sentence_positions)

            if best_sentence >= max_chars // 2:
                split_at = best_sentence + 1

        # Otherwise prefer a space.
        if split_at < max_chars // 2:
            split_at = candidate.rfind(" ")

        # Absolute fallback: hard split.
        if split_at <= 0:
            split_at = max_chars

        chunk = remaining[:split_at].strip()

        if chunk:
            chunks.append(chunk)

        remaining = remaining[split_at:].strip()

    if remaining:
        chunks.append(remaining)

    return chunks


# ---------------------------------------------------------------------------
# Local Ollama translation
# ---------------------------------------------------------------------------

def _translate_via_ollama(
    text: str,
    instruction: str,
) -> str:
    from app.llm.ollama_client import OllamaClient

    client = OllamaClient()

    prompt = (
        f"{instruction}\n\n"
        "Only output the translation itself — no explanation, "
        "no notes, and no quotation marks around it.\n\n"
        f"Text:\n{text.strip()}"
    )

    return client.generate(prompt).strip()


# ---------------------------------------------------------------------------
# Main translation function
# ---------------------------------------------------------------------------

def _translate(
    text: str,
    source: str,
    target: str,
    ollama_instruction: str,
) -> str:

    if not text or not text.strip():
        return text

    # ---------------------------------------------------------------
    # Tier 1: Google
    # ---------------------------------------------------------------

    try:
        translated = _translate_via_google(
            text,
            source,
            target,
        )

        if translated:
            return translated

    except Exception as exc:
        logger.warning(
            "GoogleTranslator failed (%s), trying MyMemoryTranslator",
            exc,
        )

    # ---------------------------------------------------------------
    # Tier 2: MyMemory
    # ---------------------------------------------------------------

    try:
        translated = _translate_via_mymemory(
            text,
            source,
            target,
        )

        if translated:
            return translated

    except Exception as exc:
        logger.warning(
            "MyMemoryTranslator also failed (%s), "
            "falling back to local LLM.",
            exc,
        )

    # ---------------------------------------------------------------
    # Tier 3: Local Ollama
    # ---------------------------------------------------------------

    try:
        translated = _translate_via_ollama(
            text,
            ollama_instruction,
        )

        if translated:
            return translated

    except Exception as exc:
        logger.error(
            "Local Ollama translation also failed: %s",
            exc,
        )

    # If absolutely everything fails, return the original text rather
    # than crashing the entire /ask request.
    logger.error(
        "All translation methods failed. Returning original text."
    )

    return text


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def translate_to_english(
    text: str,
    source_lang: str,
) -> str:
    """
    Translate user input into English.

    source_lang is an ISO 639-1 code such as:
        hi
        ta
        te
        kn
        ml
        bn
    """

    if not text or not text.strip():
        return text

    source_lang = (source_lang or "en").strip().lower()

    if source_lang == "en":
        return text

    name = language_name(source_lang)

    return _translate(
        text,
        source=source_lang,
        target="en",
        ollama_instruction=(
            f"Translate the following {name} text to English."
        ),
    )


def translate_from_english(
    text: str,
    target_lang: str,
) -> str:
    """
    Translate an English answer back into the user's language.

    target_lang is an ISO 639-1 code.
    """

    if not text or not text.strip():
        return text

    target_lang = (target_lang or "en").strip().lower()

    if target_lang == "en":
        return text

    name = language_name(target_lang)

    return _translate(
        text,
        source="en",
        target=target_lang,
        ollama_instruction=(
            f"Translate the following English text to {name}."
        ),
    )