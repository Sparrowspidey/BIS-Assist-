"""
Orchestrates: load pre-computed embeddings + their paired metadata ->
build FAISS index -> save index + chunk map.

Run via backend/Run_indexer.py.

CONFIRMED against Reshmitha's actual merged code (backend/Run_Embeddings.py,
Sept 2026) — this is no longer a guess:

  - Her embedder writes TWO files per category into EMBEDDINGS_DIR
    (imported from app.config.Config, same as her script):
        <category>_embeddings.npy   -- shape (n_chunks, EMBEDDING_DIMENSION)
        <category>_metadata.jsonl   -- the n_chunks source records, written
                                        in the SAME iteration as the
                                        embeddings, so they are guaranteed
                                        aligned by construction.

We deliberately read chunks from the *_metadata.jsonl files here, NOT
from data/processed/*.jsonl directly — her metadata copy is the one
that's provably in the exact order used to generate the embeddings.
Reading the original chunk files separately and hoping the order still
matches would reintroduce the exact alignment risk this design avoids.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

import numpy as np

from app.config.Config import EMBEDDINGS_DIR
from app.vectorstore.Index_builder import build_index
from app.vectorstore.Store import save_index, save_chunk_map

logger = logging.getLogger(__name__)


def _find_embedding_files() -> list[Path]:
    return sorted(EMBEDDINGS_DIR.glob("*_embeddings.npy"))


def _metadata_path_for(embedding_path: Path) -> Path:
    # "standards_embeddings.npy" -> "standards_metadata.jsonl"
    category = embedding_path.name.removesuffix("_embeddings.npy")
    return embedding_path.parent / f"{category}_metadata.jsonl"


def _load_metadata(path: Path) -> list[dict]:
    records = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def run_indexing() -> None:
    embedding_files = _find_embedding_files()

    if not embedding_files:
        logger.warning(
            "No *_embeddings.npy files found in %s. Run "
            "backend/Run_Embeddings.py first.",
            EMBEDDINGS_DIR,
        )
        return

    all_chunks: list[dict] = []
    all_vectors: list[np.ndarray] = []

    for embedding_path in embedding_files:
        metadata_path = _metadata_path_for(embedding_path)
        category = embedding_path.name.removesuffix("_embeddings.npy")

        if not metadata_path.exists():
            raise FileNotFoundError(
                f"Found {embedding_path.name} but no matching "
                f"{metadata_path.name} — these must be generated together "
                f"by Run_Embeddings.py, one is missing."
            )

        vectors = np.load(embedding_path)
        chunks = _load_metadata(metadata_path)

        if vectors.shape[0] != len(chunks):
            raise RuntimeError(
                f"Category '{category}': {vectors.shape[0]} vectors but "
                f"{len(chunks)} metadata records — these were supposed to "
                f"be written together and should never mismatch. Re-run "
                f"Run_Embeddings.py for this category."
            )

        logger.info("Category '%s': %d chunks, %d vectors — aligned OK", category, len(chunks), vectors.shape[0])

        all_chunks.extend(chunks)
        all_vectors.append(vectors)

    vectors_combined = np.concatenate(all_vectors, axis=0).astype(np.float32)
    logger.info(
        "Combined embeddings: shape %s across %d categories",
        vectors_combined.shape, len(embedding_files),
    )

    index = build_index(vectors_combined)
    save_index(index)
    save_chunk_map(all_chunks)  # same order as vectors_combined — required

    logger.info("Indexing complete: %d chunks searchable.", len(all_chunks))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    run_indexing()