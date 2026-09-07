"""
Orchestrates the full ingestion pipeline: crawl -> clean -> chunk -> save.

Run via backend/Run_crawler.py, not directly — that script sets up
logging and argument parsing.
"""

from __future__ import annotations

import json
import logging

from app.config.Config import WEBSITE_DIR, PROCESSED_DIR
from app.ingestion.Config import SOURCES, MAX_CRAWL_DEPTH, MAX_PAGES_PER_DOMAIN
from app.ingestion.Crawler import crawl_recursive, fetch_all
from app.ingestion.Cleaner import clean_all
from app.ingestion.Chunker import chunk_all
from app.ingestion.Labs_extractor import process_pdf_directory
from app.ingestion.Schema import SourceCategory

logger = logging.getLogger(__name__)


def _save_raw_html(raw_pages) -> None:
    WEBSITE_DIR.mkdir(parents=True, exist_ok=True)
    for raw in raw_pages:
        path = WEBSITE_DIR / f"{raw.category.value}_{raw.page_id()}.html"
        path.write_text(raw.html, encoding="utf-8")


def _save_chunks(chunks) -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    # One JSONL file per category keeps downstream loading simple and
    # lets each category be re-indexed independently later.
    by_category: dict[str, list] = {}
    for chunk in chunks:
        by_category.setdefault(chunk.category.value, []).append(chunk.to_dict())

    for category, items in by_category.items():
        path = PROCESSED_DIR / f"{category}.jsonl"
        with path.open("w", encoding="utf-8") as f:
            for item in items:
                f.write(json.dumps(item, ensure_ascii=False) + "\n")
        logger.info("Wrote %d chunks to %s", len(items), path)


async def run_pipeline(
    categories: list[SourceCategory] | None = None,
    recursive: bool = True,
    max_depth: int = MAX_CRAWL_DEPTH,
) -> None:
    sources = SOURCES if categories is None else {c: SOURCES[c] for c in categories}

    total_urls = sum(len(urls) for urls in sources.values())
    if total_urls == 0:
        logger.warning(
            "No seed URLs configured in app/ingestion/config.py — nothing to crawl from. "
            "Add at least one seed URL per category before running."
        )
        return

    if recursive:
        logger.info(
            "Starting RECURSIVE crawl from %d seed URLs across %d categories "
            "(max depth %d, max %d pages/domain)",
            total_urls, len(sources), max_depth, MAX_PAGES_PER_DOMAIN,
        )
        raw_pages = await crawl_recursive(sources, max_depth=max_depth)
    else:
        logger.info("Starting FLAT crawl: %d URLs across %d categories (no link-following)", total_urls, len(sources))
        raw_pages = await fetch_all(sources)

    logger.info("Fetched %d pages", len(raw_pages))
    _save_raw_html(raw_pages)

    cleaned_docs = clean_all(raw_pages)
    logger.info("Cleaned down to %d usable documents", len(cleaned_docs))

    chunks = chunk_all(cleaned_docs)
    logger.info("Produced %d chunks", len(chunks))
    _save_chunks(chunks)

    # Any PDFs the crawl downloaded (e.g. BIS's lab directory) get
    # processed automatically here — no manual Run_labs_extractor.py
    # step needed for the common case. If DEFAULT_COLUMN_MAP doesn't
    # match what actually got downloaded, this logs a warning rather
    # than failing silently — check the log if testing_labs.json looks
    # empty or wrong.
    labs = process_pdf_directory()
    if labs:
        logger.info("Auto-processed %d lab records from downloaded PDFs", len(labs))

    logger.info("Done. Raw HTML -> %s, chunks -> %s", WEBSITE_DIR, PROCESSED_DIR)