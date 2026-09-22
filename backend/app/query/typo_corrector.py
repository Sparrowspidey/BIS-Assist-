"""
Local typo correction for BIS Assist.

This module provides lightweight typo correction for English queries
after multilingual input has been translated into English.

It uses RapidFuzz locally and does not require an external API.

The correction is intentionally conservative:
- Only known BIS-related vocabulary is considered.
- Very short words are ignored.
- A reasonably high similarity threshold is required.
- Words that are already known are left unchanged.
"""

from __future__ import annotations

import logging
import re

from rapidfuzz import fuzz, process

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# BIS vocabulary
# ---------------------------------------------------------------------------
#
# These are common words that are likely to appear in BIS Assist queries.
#
# IMPORTANT:
# This is intentionally a controlled vocabulary rather than a general
# English spell-check dictionary. This reduces the chance of changing
# legitimate technical/product names.
#

BIS_VOCABULARY = {
    # BIS terminology
    "bis",
    "bureau",
    "standard",
    "standards",
    "certification",
    "certified",
    "certificate",
    "certificates",
    "conformity",
    "compliance",
    "registration",
    "registered",
    "licence",
    "license",
    "manufacturer",
    "manufacturers",
    "product",
    "products",
    "scheme",
    "schemes",
    "mark",
    "isi",
    "hallmark",
    "quality",
    "safety",
    "testing",
    "test",
    "laboratory",
    "laboratories",
    "lab",
    "inspection",
    "assessment",
    "requirement",
    "requirements",
    "guideline",
    "guidelines",
    "regulation",
    "regulations",
    "approval",
    "approved",
    "application",
    "applications",
    "renewal",
    "renew",
    "validity",
    "process",
    "procedure",
    "procedures",
    "fee",
    "fees",
    "registration",
    "licensing",
    "licensing",
    "marking",
    "surveillance",
    "audit",
    "auditor",
    "auditors",
    "clause",
    "clauses",
    "specification",
    "specifications",
    "technical",
    "technicality",
    "import",
    "export",
    "supplier",
    "suppliers",
    "factory",
    "factories",
    "inspection",
    "inspection",
    "sample",
    "samples",
    "testing",
    "scheme",
    "scheme-i",
    "scheme-ii",
    "scheme-iv",
    "scheme-v",
    "scheme-vi",
    "scheme-vii",
    "scheme-viii",
    "scheme-ix",
    "scheme-x",
    # Common product terminology
    "led",
    "light",
    "lights",
    "lamp",
    "lamps",
    "electrical",
    "electronic",
    "electronics",
    "appliance",
    "appliances",
    "cable",
    "cables",
    "wire",
    "wires",
    "switch",
    "switches",
    "socket",
    "sockets",
    "fan",
    "fans",
    "motor",
    "motors",
    "battery",
    "batteries",
    "charger",
    "chargers",
    "transformer",
    "transformers",
    "adapter",
    "adapters",
    # Common user query words
    "what",
    "which",
    "where",
    "when",
    "how",
    "why",
    "who",
    "can",
    "does",
    "do",
    "is",
    "are",
    "for",
    "the",
    "this",
    "that",
    "my",
    "a",
    "an",
    "about",
    "need",
    "needed",
    "required",
    "required",
    "cost",
    "price",
    "documents",
    "document",
    "information",
    "details",
    "procedure",
    "steps",
}


# Convert to a sorted list once at module load time.
_VOCABULARY_LIST = sorted(BIS_VOCABULARY)


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

# Minimum number of characters before attempting fuzzy matching.
MIN_WORD_LENGTH = 4

# High threshold to avoid aggressive corrections.
SIMILARITY_THRESHOLD = 88

# Difference between the best and second-best match.
#
# Example:
#   certification = 96
#   certificate   = 90
#
# We do not want to automatically choose when the candidates are too close.
MIN_SCORE_MARGIN = 4


# ---------------------------------------------------------------------------
# Protected tokens
# ---------------------------------------------------------------------------

# Technical identifiers, URLs, emails, numbers, etc. should not be passed
# through fuzzy correction.
_SPECIAL_TOKEN_PATTERN = re.compile(
    r"""
    (
        https?://\S+
        |
        www\.\S+
        |
        \S+@\S+
        |
        [A-Za-z]*\d+[A-Za-z0-9._/-]*
        |
        [A-Z]{2,}
    )
    """,
    re.VERBOSE,
)


def _is_protected_token(token: str) -> bool:
    """
    Return True when a token should not be fuzzy-corrected.
    """

    if not token:
        return True

    # Preserve URLs, emails, IDs, numbers, etc.
    if _SPECIAL_TOKEN_PATTERN.fullmatch(token):
        return True

    return False


def _find_best_match(word: str) -> str | None:
    """
    Find a safe BIS vocabulary correction for a word.

    Returns:
        Corrected vocabulary word, or None when no sufficiently confident
        correction exists.
    """

    normalized = word.lower()

    if normalized in BIS_VOCABULARY:
        return None

    if len(normalized) < MIN_WORD_LENGTH:
        return None

    matches = process.extract(
        normalized,
        _VOCABULARY_LIST,
        scorer=fuzz.ratio,
        limit=2,
    )

    if not matches:
        return None

    best_word, best_score, _ = matches[0]

    if best_score < SIMILARITY_THRESHOLD:
        return None

    # If there is a second candidate, make sure the best candidate is
    # sufficiently better than it.
    if len(matches) > 1:
        _, second_score, _ = matches[1]

        if best_score - second_score < MIN_SCORE_MARGIN:
            return None

    return best_word


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def correct_query_typos(query: str) -> str:
    """
    Correct obvious BIS-related spelling mistakes locally.

    Examples:

        certifcation
            -> certification

        manufaturer
            -> manufacturer

        requrement
            -> requirement

        BIS certification
            -> BIS certification

    The function is intentionally conservative and returns the original
    query whenever no safe correction is found.
    """

    if not query or not query.strip():
        return query

    original_query = query.strip()

    corrected_words: list[str] = []

    # Preserve whitespace and punctuation by processing word-like pieces.
    parts = re.split(r"(\s+)", original_query)

    corrections: list[tuple[str, str]] = []

    for part in parts:

        # Preserve whitespace exactly.
        if part.isspace():
            corrected_words.append(part)
            continue

        # Separate punctuation around the word.
        match = re.fullmatch(
            r"(?P<prefix>[^\w]*)(?P<word>[\w'-]+)(?P<suffix>[^\w]*)",
            part,
        )

        if not match:
            corrected_words.append(part)
            continue

        prefix = match.group("prefix")
        word = match.group("word")
        suffix = match.group("suffix")

        if _is_protected_token(word):
            corrected_words.append(part)
            continue

        correction = _find_best_match(word)

        if correction is None:
            corrected_words.append(part)
            continue

        # Preserve capitalization style where practical.
        if word.isupper():
            replacement = correction.upper()
        elif word[:1].isupper():
            replacement = correction.capitalize()
        else:
            replacement = correction

        corrected_part = f"{prefix}{replacement}{suffix}"

        corrected_words.append(corrected_part)
        corrections.append((word, replacement))

    corrected_query = "".join(corrected_words)

    if corrections:
        logger.info(
            "Query typo correction: %r -> %r | corrections=%s",
            original_query,
            corrected_query,
            corrections,
        )

    return corrected_query


__all__ = ["correct_query_typos"]