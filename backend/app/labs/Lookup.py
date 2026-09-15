# backend/app/labs/lookup.py

from __future__ import annotations

import json
import re

from app.config.Config import PROCESSED_DIR


STATE_ALIASES = {
    "kerala": ["kerala", "kl"],
    "karnataka": ["karnataka", "ka"],
    "tamilnadu": ["tamilnadu", "tamil nadu", "tn"],
    "maharashtra": ["maharashtra", "mh"],
    "gujarat": ["gujarat", "gj"],
    "rajasthan": ["rajasthan", "rj"],
    "delhi": ["delhi", "new delhi", "dl"],
    "west bengal": ["west bengal", "w.b.", "wb"],
    "uttar pradesh": ["uttar pradesh", "u.p.", "up"],
    "madhya pradesh": ["madhya pradesh", "m.p.", "mp"],
    "telangana": ["telangana", "ts", "tg"],
    "andhra pradesh": ["andhra pradesh", "a.p.", "ap"],
    "odisha": ["odisha", "orissa", "od"],
    "punjab": ["punjab", "pb"],
    "haryana": ["haryana", "hr"],
    "bihar": ["bihar", "br"],
    "jharkhand": ["jharkhand", "jh"],
    "chhattisgarh": ["chhattisgarh", "cg"],
    "assam": ["assam", "as"],
    "goa": ["goa", "ga"],
    "uttarakhand": ["uttarakhand", "uk"],
    "himachal pradesh": ["himachal pradesh", "hp"],
    "jammu and kashmir": [
        "jammu and kashmir",
        "jammu & kashmir",
        "j&k",
        "jk",
    ],
}


def _normalize(text: str) -> str:
    """Normalize text for loose matching."""
    text = text.lower().replace("&", " and ")
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def _find_state(query: str) -> str | None:
    """Return the canonical state name detected in the query."""
    normalized_query = _normalize(query)

    for canonical_state, aliases in STATE_ALIASES.items():
        for alias in aliases:
            normalized_alias = _normalize(alias)

            if re.search(
                rf"\b{re.escape(normalized_alias)}\b",
                normalized_query,
            ):
                return canonical_state

    return None


def _lab_search_text(lab: dict) -> str:
    """Build searchable text from the fields available in the dataset."""
    return _normalize(
        " ".join(
            [
                str(lab.get("name", "")),
                str(lab.get("state", "")),
                str(lab.get("status", "")),
                str(lab.get("remarks", "")),
            ]
        )
    )


def search_labs(query: str, top_k: int = 5) -> list[dict]:
    """
    Search BIS testing laboratories using the structured laboratory dataset.

    The dataset supports matching by:
    - state / state abbreviation
    - laboratory name
    - government/private status
    - remarks

    NABL accreditation is only considered if the dataset itself contains
    NABL information in the searchable fields. We do not invent accreditation
    status when the source data does not provide it.
    """

    path = PROCESSED_DIR / "testing_labs.json"

    with open(path, "r", encoding="utf-8") as f:
        labs = json.load(f)

    query_normalized = _normalize(query)
    requested_state = _find_state(query)

    # Common generic words that should not be used as laboratory-name matches.
    stop_words = {
        "find",
        "show",
        "give",
        "list",
        "search",
        "laboratory",
        "laboratories",
        "lab",
        "labs",
        "testing",
        "test",
        "facility",
        "facilities",
        "bis",
        "recognized",
        "recognised",
        "recognition",
        "accredited",
        "accreditation",
        "nabl",
        "for",
        "in",
        "the",
        "and",
        "of",
        "to",
        "a",
        "an",
        "is",
        "are",
        "please",
    }

    query_terms = [
        word
        for word in query_normalized.split()
        if word not in stop_words and len(word) > 2
    ]

    scored_matches = []

    for lab in labs:
        lab_state = _normalize(str(lab.get("state", "")))
        lab_name = _normalize(str(lab.get("name", "")))
        lab_status = _normalize(str(lab.get("status", "")))
        lab_remarks = _normalize(str(lab.get("remarks", "")))

        searchable_text = _lab_search_text(lab)

        score = 0

        # Strong match when the user explicitly asks for a state.
        if requested_state:
            state_aliases = STATE_ALIASES.get(requested_state, [])

            if any(
                _normalize(alias) in lab_state
                for alias in state_aliases
            ):
                score += 100
            else:
                # If a state was explicitly requested, do not return labs
                # from other states.
                continue

        # Match meaningful query terms against the laboratory record.
        for term in query_terms:
            if term in lab_name:
                score += 10
            elif term in searchable_text:
                score += 3

        # Prefer labs that actually have an OSL code.
        if lab.get("osl_code"):
            score += 1

        if score > 0:
            scored_matches.append((score, lab))

    # Highest relevance first.
    scored_matches.sort(
        key=lambda item: (
            -item[0],
            str(item[1].get("name", "")).lower(),
        )
    )

    return [lab for _, lab in scored_matches[:top_k]]