"""
Builds a FAISS index from a matrix of embedding vectors.

Deliberately knows nothing about HOW the vectors were produced — it
just takes a (n, dim) float32 array. This keeps the embeddings module
(Reshmitha's QwenEmbedder) and the vectorstore module independent: if
the embedding model ever changes, nothing here needs to change, as
long as the output is still normalized vectors.

Uses IndexFlatIP (inner product), not the more commonly-seen
IndexFlatL2. This matters: QwenEmbedder L2-normalizes its output
(per PR #6's description), and for normalized vectors, inner product
IS cosine similarity — that's the actual similarity measure you want
for semantic retrieval. Using L2 (Euclidean distance) instead would
still "work" but ranks results slightly differently and is the wrong
match for a normalized-embedding setup.
"""

from __future__ import annotations

import logging

import faiss
import numpy as np

logger = logging.getLogger(__name__)


def build_index(vectors: np.ndarray) -> faiss.Index:
    """
    vectors: shape (n_chunks, embedding_dim), expected to already be
    L2-normalized (QwenEmbedder does this per its PR description).
    If you swap in an embedder that does NOT normalize, normalize here
    first or switch to IndexFlatL2 — mixing unnormalized vectors with
    IndexFlatIP silently gives meaningless similarity scores.
    """
    if vectors.ndim != 2:
        raise ValueError(f"Expected a 2D array (n_chunks, dim), got shape {vectors.shape}")

    if vectors.dtype != np.float32:
        vectors = vectors.astype(np.float32)

    n, dim = vectors.shape
    index = faiss.IndexFlatIP(dim)
    index.add(vectors)

    logger.info("Built FAISS index: %d vectors, dim %d", n, dim)
    return index