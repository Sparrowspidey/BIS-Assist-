"""
Entry point for building the FAISS vector index from crawled chunks.

Usage:
    uv run python backend/Run_indexer.py

Requires:
    - data/processed/*.jsonl to exist (run backend/Run_crawler.py first)
    - The embeddings module (app/embeddings/embedder.py) to be merged
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.vectorstore.Build import run_indexing

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


if __name__ == "__main__":
    run_indexing()