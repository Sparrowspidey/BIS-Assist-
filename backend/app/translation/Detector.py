"""
Language detection for BIS Assist.

Detects the language of user input and returns an ISO 639-1 language code.

This module is intentionally separate from intent detection.

Example:
    "What is BIS certification?" -> "en"
    "BIS प्रमाणन क्या है?"       -> "hi"
    "BIS சான்றிதழ் என்றால் என்ன?" -> "ta"

Language detection is used by the multilingual wrapper:
    detect language
        -> translate query to English if needed
        -> classify intent
        -> process request
        -> translate answer back to user's language
"""


from __future__ import annotations

import logging
import re

logger = logging.getLogger(__name__)


# Languages supported/expected by BIS Assist.
#
# langdetect returns ISO 639-1 language codes.
# The names are used when building translation prompts.
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


# ---------------------------------------------------------------------------
# Script-based detection
# ---------------------------------------------------------------------------
#
# langdetect can sometimes misidentify short Indian-language queries.
# For example, a Hindi sentence written in Devanagari may occasionally be
# classified incorrectly as German ("de").
#
# Script detection gives us a reliable first signal for Indian languages
# that use their own writing systems.
#
# This is only a fallback/override for clearly identifiable scripts.
# English and other Latin-script languages are still handled by langdetect.
#

_SCRIPT_LANGUAGE_PATTERNS = {
    "hi": re.compile(r"[\u0900-\u097F]"),  # Devanagari
    "bn": re.compile(r"[\u0980-\u09FF]"),  # Bengali
    "pa": re.compile(r"[\u0A00-\u0A7F]"),  # Gurmukhi
    "gu": re.compile(r"[\u0A80-\u0AFF]"),  # Gujarati
    "ta": re.compile(r"[\u0B80-\u0BFF]"),  # Tamil
    "te": re.compile(r"[\u0C00-\u0C7F]"),  # Telugu
    "kn": re.compile(r"[\u0C80-\u0CFF]"),  # Kannada
    "ml": re.compile(r"[\u0D00-\u0D7F]"),  # Malayalam
    "ur": re.compile(r"[\u0600-\u06FF]"),  # Arabic script (Urdu/others)
}


def _detect_by_script(text: str) -> str | None:
    """
    Detect Indian languages from their writing script.

    Returns:
        ISO 639-1 language code, or None when no supported script
        can be confidently identified.
    """

    for language_code, pattern in _SCRIPT_LANGUAGE_PATTERNS.items():
        if pattern.search(text):
            return language_code

    return None


def detect_language(text: str) -> str:
    """
    Detect the language of a piece of text.

    Returns:
        ISO 639-1 language code such as:
        "en", "hi", "ta", "te", "kn", "ml", etc.

    Behaviour:
        1. Empty input -> English.
        2. Clearly identifiable Indian script -> corresponding language.
        3. Otherwise use langdetect.
        4. If langdetect fails -> English.

    Script detection is intentionally checked before langdetect because
    langdetect can occasionally misclassify short Indian-language text.
    """

    text = (text or "").strip()

    if not text:
        return "en"

    # ---------------------------------------------------------------
    # First: reliable script-based detection
    # ---------------------------------------------------------------
    script_language = _detect_by_script(text)

    if script_language:
        logger.debug(
            "Detected language %s using script detection",
            script_language,
        )
        return script_language

    # ---------------------------------------------------------------
    # Second: langdetect for Latin-script languages
    # ---------------------------------------------------------------
    try:
        from langdetect import detect, LangDetectException
    except ImportError:
        # Keep the application working even if langdetect is not installed.
        logger.warning(
            "langdetect is not installed; defaulting language detection to English"
        )
        return "en"

    try:
        detected = detect(text)

        logger.debug(
            "langdetect detected language %s for text %r",
            detected,
            text[:50],
        )

        return detected

    except LangDetectException:
        logger.info(
            "Language detection failed for %r, defaulting to English",
            text[:50],
        )
        return "en"

    except Exception as exc:
        logger.warning(
            "Unexpected language detection error (%s), "
            "defaulting to English",
            exc,
        )
        return "en"


def language_name(code: str) -> str:
    """
    Return the human-readable language name for an ISO 639-1 code.

    Examples:
        language_name("en") -> "English"
        language_name("hi") -> "Hindi"
        language_name("ml") -> "Malayalam"

    Unknown codes are returned unchanged rather than raising an error.
    """

    code = (code or "").strip().lower()

    if not code:
        return "English"

    return LANGUAGE_NAMES.get(code, code)


__all__ = [
    "LANGUAGE_NAMES",
    "detect_language",
    "language_name",
]