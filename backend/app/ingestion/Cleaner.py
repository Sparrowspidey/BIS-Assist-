"""
Turns raw HTML into clean, readable text.

Strips navigation, scripts, styles, and other boilerplate that would
otherwise pollute embeddings and waste context window space in the
RAG prompt.
"""

from __future__ import annotations

import logging
import re

from bs4 import BeautifulSoup

from app.ingestion.Schema import RawPage, CleanedDocument

logger = logging.getLogger(__name__)

# Tags that never contain meaningful page content
STRIP_TAGS = ["script", "style", "nav", "footer", "header", "noscript", "svg", "form"]


def _extract_title(soup: BeautifulSoup) -> str:
    if soup.title and soup.title.string:
        return soup.title.string.strip()
    h1 = soup.find("h1")
    if h1:
        return h1.get_text(strip=True)
    return "Untitled"


def _extract_text(soup: BeautifulSoup) -> str:
    for tag in soup(STRIP_TAGS):
        tag.decompose()

    # Prefer a <main> region if the page has one — usually where the
    # actual content lives, skipping repeated sidebars/menus.
    main = soup.find("main") or soup.find(attrs={"role": "main"}) or soup

    text = main.get_text(separator="\n")
    # Collapse excessive blank lines/whitespace left behind by stripped tags
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


def clean_page(raw: RawPage) -> CleanedDocument | None:
    """Clean one RawPage. Returns None if the page has no usable content."""
    soup = BeautifulSoup(raw.html, "html.parser")

    title = _extract_title(soup)
    text = _extract_text(soup)

    if len(text) < 100:  # heuristic: too short to be real content
        logger.warning("Discarding near-empty page: %s", raw.url)
        return None

    return CleanedDocument(
        page_id=raw.page_id(),
        url=raw.url,
        category=raw.category,
        title=title,
        text=text,
        fetched_at=raw.fetched_at,
    )


def clean_all(raw_pages: list[RawPage]) -> list[CleanedDocument]:
    cleaned = []
    for raw in raw_pages:
        doc = clean_page(raw)
        if doc is not None:
            cleaned.append(doc)
    return cleaned