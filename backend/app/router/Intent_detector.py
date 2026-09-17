"""
Intent classification: given a raw user query, decide which downstream
path should handle it.

INTENT SET, matched 1:1 to actual distinct downstream actions (not to
BIS terminology categories) — this matters: standards, certification,
hallmarking, and consumer_affairs are all searched via the SAME unified
FAISS index (see app/vectorstore/), so classifying them into three
separate intents (as an earlier draft did: bis_information,
standard_information, product_information) added classification
ambiguity for zero downstream benefit — a question like "BIS
certification for my product" could plausibly match two of those three
buckets. Collapsed here into one RAG_QUERY intent instead.

  RAG_QUERY       -> search the unified FAISS index, generate an
                     answer with citations (app/rag/)
  LABS_LOOKUP     -> filter data/processed/testing_labs.json directly
                     (structured lookup, NOT semantic search — see
                     app/recommender/matcher.py's docstring for the
                     same reasoning applied to product-standard matching)
  RECOMMENDATION  -> match against data/processed/product_standard_map.json
                     (app/recommender/matcher.py)
  TRANSLATE_TEXT  -> an explicit one-off "translate X to Hindi" request —
                     NOT the same thing as general multilingual support.
                     See note at the bottom of this file.
  GENERAL_CHAT    -> greetings / meta questions, no retrieval needed
  UNKNOWN         -> couldn't confidently classify; caller decides the
                     fallback (e.g. try RAG anyway, or ask for clarification)

NOTE ON MULTILINGUAL SUPPORT (FR8): detecting a query is asking to
translate a specific piece of text ("translate this to Hindi") is a
genuine, distinct intent — but a user simply ASKING THEIR QUESTION in
Hindi is not a "translation intent" at all, it's e.g. a RAG_QUERY that
happens to be in Hindi. That case should be handled by a language-
detection step that wraps the ENTIRE flow (detect language -> translate
query to English if needed -> classify intent normally using the
translated text -> answer -> translate answer back), not by adding
more keyword buckets here. That wrapper belongs in app/translation/,
called by whatever orchestrates this router — NOT inside intent
detection itself. Don't try to detect "is this Hindi" via keyword
matching here; it won't work for arbitrary non-English input.
"""

from __future__ import annotations

import re
from enum import Enum


def _contains_phrase(text: str, phrase: str) -> bool:
    """
    Word-boundary phrase matching, not naive substring matching.

    Naive `phrase in text` is genuinely broken for short keywords: "hi"
    is a substring of "this" (t-HI-s), so a query like "this is a test"
    would incorrectly match the GENERAL_CHAT keyword "hi". Caught this
    exact case during testing — the same class of bug as "bottled"
    containing "led" in the recommender module's matcher (see
    app/recommender/matcher.py for the original fix this mirrors).
    """
    return re.search(r"\b" + re.escape(phrase) + r"\b", text) is not None


class Intent(str, Enum):
    RAG_QUERY = "rag_query"
    LABS_LOOKUP = "labs_lookup"
    RECOMMENDATION = "recommendation"
    TRANSLATE_TEXT = "translate_text"
    GENERAL_CHAT = "general_chat"
    UNKNOWN = "unknown"


_TRANSLATE_TEXT_KEYWORDS = [
    "translate this",
    "translate to hindi",
    "translate to malayalam",
    "translate to tamil",
    "translate to kannada",
    "meaning in hindi",
    "meaning in tamil",
]

_LABS_LOOKUP_KEYWORDS = [
    "testing lab",
    "testing laboratory",
    "testing laboratories",
    "recognized lab",
    "recognized laboratory",
    "recognized laboratories",
    "recognised lab",
    "recognised laboratory",
    "recognised laboratories",
    "laboratory",
    "laboratories",
    "find a lab",
    "labs in",
    "laboratory in",
    "nearest lab",
]

_RECOMMENDATION_KEYWORDS = [
    "recommend",
    "recommendation",
    "suggest",
    "which standard",
    "what standard",
    "applicable standard",
    "best product",
    "what should i buy",
]

_RAG_QUERY_KEYWORDS = [
    "bis",
    "bureau of indian standards",
    "bis registration",
    "bis certification",
    "bis license",
    "bis mark",
    "how can i get bis",
    "how to get bis",
    "standard",
    "is code",
    "is number",
    "specification",
    "hallmark",
    "hallmarking",
    "huid",
    "huid verification",
    "hallmark verification",
    "hallmark jewellery",
    "hallmarked jewellery",
    "gold hallmark",
    "silver hallmark",
    "gold purity",
    "silver purity",
    "fineness",
    "assaying",
    "assaying and hallmarking",
    "ahc",
    "jeweller",
    "jewellery",
    "jewelry",
    "isi mark",
    "certified product",
    "consumer complaint",
    "consumer protection",
    "certified",
"certify",
"certification process",
"get certified",
"product certified",
"certify my product",
"apply for certification",
"how to get certified",
"how to certify",
"product certification",
"bis certification",
]

_GENERAL_CHAT_KEYWORDS = [
    "hello",
    "hi",
    "hey",
    "who are you",
    "what can you do",
]

# Matches an actual IS standard number reference: "IS 4151", "IS 302:2024",
# "IS 9873(1)". Plain keyword matching misses this entirely — "What is
# IS 4151?" contains none of the RAG_QUERY phrase keywords above, but is
# obviously a real standards question. Caught this gap during testing.
_IS_NUMBER_PATTERN = re.compile(r"\bis[\s\-]?\d{2,6}\b", re.IGNORECASE)


def detect_intent(query: str) -> Intent:
    """
    Keyword-based classification. Order matters: more specific intents
    are checked before more general ones (e.g. LABS_LOOKUP before the
    broad RAG_QUERY bucket, since "testing lab" would otherwise never
    be reached — nothing in _RAG_QUERY_KEYWORDS should overlap with it,
    but checking order defensively here costs nothing).
    """
    text = query.lower().strip()

    if not text:
        return Intent.UNKNOWN

    if any(_contains_phrase(text, kw) for kw in _TRANSLATE_TEXT_KEYWORDS):
        return Intent.TRANSLATE_TEXT

    if any(_contains_phrase(text, kw) for kw in _LABS_LOOKUP_KEYWORDS):
        return Intent.LABS_LOOKUP

    if any(_contains_phrase(text, kw) for kw in _RECOMMENDATION_KEYWORDS):
        return Intent.RECOMMENDATION

    if _IS_NUMBER_PATTERN.search(text) or any(_contains_phrase(text, kw) for kw in _RAG_QUERY_KEYWORDS):
        return Intent.RAG_QUERY

    if any(_contains_phrase(text, kw) for kw in _GENERAL_CHAT_KEYWORDS):
        return Intent.GENERAL_CHAT

    return Intent.UNKNOWN