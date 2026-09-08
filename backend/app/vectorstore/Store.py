"""
Persists the FAISS index and its parallel chunk-metadata mapping to disk,
and loads them back.

WHY TWO FILES: FAISS only stores vectors and their integer positions
(0, 1, 2, ...) — it has no idea a vector corresponds to a specific BIS
standard, URL, or piece of text. CHUNKS_PATH stores a plain list of the
original chunk dicts in the SAME ORDER they were added to the index, so
position i in FAISS always maps to chunk_map[i]. Losing that ordering
guarantee (e.g. adding vectors out of order, or filtering chunks after
the fact without rebuilding both together) silently breaks every
search result. build_index() and save_chunk_map() must always be
called on the exact same list, in the exact same order — see
build.py, which does this correctly by construction.
"""

from __future__ import annotations

import logging
import pickle
from pathlib import Path

import faiss

from app.config.Config import FAISS_INDEX_PATH, CHUNKS_PATH

logger = logging.getLogger(__name__)


def save_index(index: faiss.Index, path: Path | None = None) -> None:
    path = path or FAISS_INDEX_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    faiss.write_index(index, str(path))
    logger.info("Saved FAISS index (%d vectors) to %s", index.ntotal, path)


def load_index(path: Path | None = None) -> faiss.Index:
    path = path or FAISS_INDEX_PATH
    if not path.exists():
        raise FileNotFoundError(
            f"No FAISS index at {path} — run backend/Run_indexer.py first."
        )
    return faiss.read_index(str(path))


def save_chunk_map(chunks: list[dict], path: Path | None = None) -> None:
    """chunks must be the exact same list, same order, passed to build_index()."""
    path = path or CHUNKS_PATH
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("wb") as f:
        pickle.dump(chunks, f)
    logger.info("Saved chunk map (%d entries) to %s", len(chunks), path)


def load_chunk_map(path: Path | None = None) -> list[dict]:
    path = path or CHUNKS_PATH
    if not path.exists():
        raise FileNotFoundError(
            f"No chunk map at {path} — run backend/Run_indexer.py first."
        )
    with path.open("rb") as f:
        return pickle.load(f)