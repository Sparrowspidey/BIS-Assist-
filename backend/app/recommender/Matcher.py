"""
Matches a free-text product description to applicable Indian Standards.

This is DELIBERATELY not semantic search / RAG — see app/vectorstore/'s
docstrings for why. A manufacturer describing "LED bulbs for home use"
needs the EXACT applicable IS number and scheme, not a probabilistically
similar document chunk. This does simple, transparent keyword matching
against a small, hand-curated, VERIFIED dataset (see
data/processed/product_standard_map.json — every IS number in that file
was checked against real sources before being added, not guessed).

LIMITATION, worth being upfront about: this only covers a small number
of common product categories (~7 as of this writing) — a real production
system would need this dataset built out much further, or a proper
product-classification model. For a hackathon demo, covering a handful
of common/recognizable products correctly beats covering everything
badly.
"""

from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass
from pathlib import Path

from app.config.Config import PRODUCT_STANDARD_MAP_PATH

logger = logging.getLogger(__name__)


def _keyword_pattern(keyword: str) -> re.Pattern:
    """
    Word-boundary regex for a keyword, so "led" matches "LED bulb" but
    NOT "bottled" (naive substring matching would wrongly match both —
    caught this exact false positive during testing: "bottled mineral
    water" was matching the LED category because "led" sits inside
    "bott-LED"). \\b works on word characters, so multi-word keywords
    like "pressure cooker" still match correctly across the space.

    Each word in the keyword optionally allows a trailing "s" so plural
    forms in the input still match a singular keyword (e.g. keyword
    "led bulb" matching input "LED bulbs") — without this, requiring an
    exact trailing \\b immediately after the keyword's last letter would
    reject any plural continuation and silently under-score real matches.
    """
    words = keyword.lower().split()
    word_patterns = [re.escape(w) + r"s?" for w in words]
    return re.compile(r"\b" + r"\s+".join(word_patterns) + r"\b")


@dataclass
class MatchResult:
    category: str
    display_name: str
    standards: list[dict]
    score: int
    matched_keywords: list[str]

    def to_dict(self) -> dict:
        return {
            "category": self.category,
            "display_name": self.display_name,
            "standards": self.standards,
            "score": self.score,
            "matched_keywords": self.matched_keywords,
        }


def load_product_standard_map(path: Path | None = None) -> list[dict]:
    path = path or PRODUCT_STANDARD_MAP_PATH
    if not path.exists():
        logger.warning("No product-standard map found at %s", path)
        return []
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def match_product(
    description: str,
    top_k: int = 3,
    entries: list[dict] | None = None,
) -> list[MatchResult]:
    """
    Score every entry in the product-standard map against the description
    by keyword overlap, longer/more specific keyword phrases scoring
    higher than generic single-word matches (so "led bulb" outranks a
    bare "led" match, for instance).

    Returns entries with score > 0, sorted highest first, capped at top_k.
    Empty list means no known category matched — the caller should decide
    the fallback (e.g. tell the user no exact match was found, or hand
    off to the general RAG search over standards content as a softer,
    lower-confidence alternative).
    """
    entries = entries if entries is not None else load_product_standard_map()
    if not entries:
        return []

    text = description.lower()
    results: list[MatchResult] = []

    for entry in entries:
        matched: list[str] = []
        score = 0

        for keyword in entry.get("keywords", []):
            if _keyword_pattern(keyword).search(text):
                matched.append(keyword)
                # multi-word keywords are more specific -> weight higher
                score += len(keyword.split())

        if score > 0:
            results.append(
                MatchResult(
                    category=entry["category"],
                    display_name=entry["display_name"],
                    standards=entry["standards"],
                    score=score,
                    matched_keywords=matched,
                )
            )

    results.sort(key=lambda r: r.score, reverse=True)
    return results[:top_k]