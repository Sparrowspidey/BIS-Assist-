"""
Orchestrates: load chunks -> embed -> build FAISS index -> save index + chunk map.

Run via backend/Run_indexer.py.

EMBEDDER INTEGRATION NOTE:
The import and method calls below are written to match Reshmitha's
embeddings module PR (#6) AS DESCRIBED — QwenEmbedder class in
app/embeddings/embedder.py, separate document/query embedding
functions. The exact method names (embed_documents / embed_query
below) are a best guess from the PR description, not confirmed
against the actual merged code. If the real method names differ,
this is the ONE place that needs updating — everything else in
vectorstore/ only deals with plain numpy arrays and doesn't care
which embedder produced them.
"""

from __future__ import annotations

import logging

import numpy as np

from app.vectorstore.Loader import load_processed_chunks
from app.vectorstore.Index_builder import build_index
from app.vectorstore.Store import save_index, save_chunk_map

logger = logging.getLogger(__name__)


def run_indexing() -> None:
    chunks = load_processed_chunks()
    if not chunks:
        logger.warning(
            "No chunks to index. Run backend/Run_crawler.py first to "
            "produce data/processed/*.jsonl."
        )
        return

    logger.info("Loaded %d chunks total, generating embeddings...", len(chunks))

    # --- EMBEDDER INTEGRATION --- see module docstring above
    from app.embeddings.embedder import QwenEmbedder

    embedder = QwenEmbedder()
    texts = [chunk["text"] for chunk in chunks]
    vectors = embedder.embed_documents(texts)
    vectors = np.asarray(vectors, dtype=np.float32)

    if vectors.shape[0] != len(chunks):
        raise RuntimeError(
            f"Embedding count ({vectors.shape[0]}) doesn't match chunk count "
            f"({len(chunks)}) — the embedder must return exactly one vector "
            f"per input text, in the same order."
        )

    logger.info("Generated embeddings: shape %s", vectors.shape)

    index = build_index(vectors)
    save_index(index)
    save_chunk_map(chunks)  # same list/order as `chunks` used to build vectors — required

    logger.info("Indexing complete: %d chunks searchable.", len(chunks))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
    run_indexing()