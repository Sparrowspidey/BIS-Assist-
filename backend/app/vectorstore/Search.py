"""
Searches the FAISS index for the chunks most similar to a query vector.

This is the function the RAG/retrieval layer (app/rag/ — not built yet)
will call: embed the user's question with the SAME embedder used to
build the index, then pass that vector here.
"""

from __future__ import annotations

import faiss
import numpy as np


def search(
    index: faiss.Index,
    chunk_map: list[dict],
    query_vector: np.ndarray,
    top_k: int = 5,
) -> list[dict]:
    """
    Returns up to top_k chunks, each as the original chunk dict plus a
    "score" field (cosine similarity, since the index is IndexFlatIP
    over normalized vectors — higher score = more similar, roughly in
    [-1, 1], with real matches usually well above 0).

    query_vector must come from the SAME embedding model/dimension used
    to build the index (QwenEmbedder's query-embedding function, not its
    document-embedding function — Qwen uses a different prompt for
    queries vs documents, per PR #6's description; using the wrong one
    will still run without error but silently degrades match quality).
    """
    query_vector = np.asarray(query_vector, dtype=np.float32)
    if query_vector.ndim == 1:
        query_vector = query_vector.reshape(1, -1)

    scores, indices = index.search(query_vector, top_k)

    results = []
    for score, idx in zip(scores[0], indices[0]):
        if idx == -1:  # FAISS pads with -1 if fewer than top_k results exist
            continue
        chunk = dict(chunk_map[idx])  # copy — don't mutate the stored chunk
        chunk["score"] = float(score)
        results.append(chunk)

    return results