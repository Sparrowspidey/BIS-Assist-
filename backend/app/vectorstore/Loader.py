"""
Loads the chunk JSONL files the ingestion pipeline produces
(data/processed/standards.jsonl, certification.jsonl, hallmarking.jsonl,
consumer_affairs.jsonl) into plain dicts ready for embedding.

Deliberately does NOT load testing_labs.json — that's structured lookup
data (see app/ingestion/schema.py's LabRecord), not RAG text, and has no
business being embedded into the FAISS index.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

from app.config.Config import PROCESSED_DIR

logger = logging.getLogger(__name__)

# testing_labs.json lives in the same folder as the RAG chunk files but
# must never be embedded — explicitly excluded by filename.
_EXCLUDED_FILES = {"testing_labs.json"}


def load_processed_chunks(processed_dir: Path | None = None) -> list[dict]:
    """
    Read every *.jsonl file in data/processed/ (skipping non-jsonl files
    like testing_labs.json) and return all chunks as a flat list of dicts.

    Each dict matches app/ingestion/schema.py's Chunk.to_dict() shape:
    chunk_id, page_id, url, category, title, text, chunk_index, fetched_at.
    """
    processed_dir = processed_dir or PROCESSED_DIR

    if not processed_dir.exists():
        logger.warning("No processed data directory at %s — run the crawler first.", processed_dir)
        return []

    chunks: list[dict] = []
    jsonl_files = sorted(processed_dir.glob("*.jsonl"))

    if not jsonl_files:
        logger.warning("No .jsonl chunk files found in %s.", processed_dir)
        return []

    for path in jsonl_files:
        if path.name in _EXCLUDED_FILES:
            continue

        count = 0
        with path.open("r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                chunks.append(json.loads(line))
                count += 1

        logger.info("Loaded %d chunks from %s", count, path.name)

    return chunks