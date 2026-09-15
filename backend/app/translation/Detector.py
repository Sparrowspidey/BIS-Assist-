"""
Detects the language of user input.

Uses langdetect (lightweight, pure-Python, offline — no API call, no
model download, consistent with the project's local-first approach).
Falls back to "en" on any detection failure rather than raising —
detection is a best-effort signal feeding into translation, not
something that should ever crash a request. A wrong guess on a very
short/ambiguous query ("hi", "ok") just means it's treated as English,
which is a safe default, not a dangerous one.
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)

# Common languages this project is likely to see, per FR8's "multiple
# Indian languages" requirement. langdetect returns ISO 639-1 codes;
# any code not in this map still gets detected/translated correctly,
# this dict is only used for building readable LLM prompts (see
# translator.py) — an unmapped code just falls back to the code itself.
LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "ta": "Tamil",
    "te": "Telugu",
    "kn": "Kannada",
    "ml": "Malayalam",
    "bn": "Bengali",
    "mr": "Marathi",
    "gu": "Gujarati",
    "pa": "Punjabi",
    "ur": "Urdu",
}


def detect_language(text: str) -> str:
    """
    Returns an ISO 639-1 language code, e.g. "en", "hi", "ta".
    Defaults to "en" if detection fails or input is empty/too short
    to detect reliably.
    """
    text = (text or "").strip()
    if not text:
        return "en"

    from langdetect import detect, LangDetectException  # local import — keeps
                                                          # this module importable
                                                          # even before the
                                                          # dependency is installed

    try:
        return detect(text)
    except LangDetectException:
        logger.info("Language detection failed for %r, defaulting to English", text[:50])
        return "en"


def language_name(code: str) -> str:
    """Human-readable name for a language code, for building LLM prompts."""
    return LANGUAGE_NAMES.get(code, code)