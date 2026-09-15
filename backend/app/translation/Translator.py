"""
Translates text to/from English.

UPDATED again after live testing: GoogleTranslator (via deep-translator)
hit a real rate limit during testing — "You made too many requests to
the server" — a known risk of the free, unofficial endpoint deep-
translator uses (not an official paid API). This is a genuine concern
for a live demo on shared venue wifi, not a hypothetical.

THREE-TIER FALLBACK now, in order:
  1. GoogleTranslator  — best quality, but can rate-limit under load
  2. MyMemoryTranslator — different free service/endpoint entirely, so
                           a Google rate-limit doesn't affect it; lower
                           daily quota (5000 words/day anonymous) but
                           that's plenty for a demo
  3. Local Ollama LLM   — last resort, works with zero internet, but
                           CONFIRMED POOR QUALITY via real testing
                           (mistranslated meaning, mixed scripts) —
                           only reached if BOTH external services fail

Each tier is tried in order; failure at any tier logs a warning and
falls through to the next, rather than crashing the request.
"""

from __future__ import annotations

import logging

from app.translation.Detector import language_name

logger = logging.getLogger(__name__)

# MyMemoryTranslator requires locale-style codes ("hi-IN"), NOT plain
# ISO 639-1 codes ("hi") — confirmed from its own error message during
# testing, which listed every language it accepts in this exact format.
# GoogleTranslator accepts plain "hi"/"ta"/etc. fine, so this mapping is
# only needed for the MyMemory tier.
_MYMEMORY_LANG_MAP = {
    "en": "en-IN",  # English (India) — more contextually apt for a BIS tool
                     # than en-GB/en-US, and MyMemory does list it
    "hi": "hi-IN",
    "ta": "ta-IN",
    "te": "te-IN",
    "kn": "kn-IN",
    "ml": "ml-IN",
    "bn": "bn-IN",
    "mr": "mr-IN",
    "gu": "gu-IN",
    "pa": "pa-IN",
    "ur": "ur-PK",  # MyMemory only lists Urdu under Pakistan's locale
}


def _to_mymemory_code(code: str) -> str:
    return _MYMEMORY_LANG_MAP.get(code, code)


def _translate_via_google(text: str, source: str, target: str) -> str:
    from deep_translator import GoogleTranslator

    return GoogleTranslator(source=source, target=target).translate(text)


def _translate_via_mymemory(text: str, source: str, target: str) -> str:
    from deep_translator import MyMemoryTranslator

    return MyMemoryTranslator(
        source=_to_mymemory_code(source),
        target=_to_mymemory_code(target),
    ).translate(text)


def _translate_via_ollama(text: str, instruction: str) -> str:
    from app.llm.ollama_client import OllamaClient  # local import, same
                                                       # pattern used elsewhere
                                                       # in this project

    client = OllamaClient()
    prompt = (
        f"{instruction}\n\n"
        f"Only output the translation itself — no explanation, no notes, "
        f"no quotation marks around it.\n\n"
        f"Text:\n{text.strip()}"
    )
    return client.generate(prompt).strip()


def _translate(text: str, source: str, target: str, ollama_instruction: str) -> str:
    try:
        return _translate_via_google(text, source, target)
    except Exception as exc:  # noqa: BLE001
        logger.warning("GoogleTranslator failed (%s), trying MyMemoryTranslator", exc)

    try:
        return _translate_via_mymemory(text, source, target)
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "MyMemoryTranslator also failed (%s), falling back to local LLM. "
            "Quality will be noticeably worse — see this file's module docstring.",
            exc,
        )

    return _translate_via_ollama(text, ollama_instruction)


def translate_to_english(text: str, source_lang: str) -> str:
    """source_lang is an ISO 639-1 code, e.g. "hi" — from detector.detect_language()."""
    if source_lang == "en" or not text.strip():
        return text

    name = language_name(source_lang)
    return _translate(
        text, source=source_lang, target="en",
        ollama_instruction=f"Translate the following {name} text to English.",
    )


def translate_from_english(text: str, target_lang: str) -> str:
    """target_lang is an ISO 639-1 code — translate an English answer back
    into the user's original language."""
    if target_lang == "en" or not text.strip():
        return text

    name = language_name(target_lang)
    return _translate(
        text, source="en", target=target_lang,
        ollama_instruction=f"Translate the following English text to {name}.",
    )