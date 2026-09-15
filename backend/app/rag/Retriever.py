"""
Turns a user question into (context_text, sources) ready for the LLM
generator — embeds the question, searches the FAISS index, filters out
weak matches, and formats what's left into a single context block.

EMBEDDER INTEGRATION NOTE: uses embedder.embed_query(question) — a
QUERY embedding, not embed_documents() (which is for indexing chunks).
Qwen uses different prompt formatting for queries vs documents per
Reshmitha's PR #6 description; using embed_documents() here would still
run without error but would silently produce worse retrieval quality.
The exact method name is a best guess pending confirmation against her
actual embedder.py — same caveat pattern as build.py's original
integration note.
"""

from __future__ import annotations

import logging

import numpy as np

from app.config.Config import TOP_K_RESULTS, SIMILARITY_THRESHOLD, FAISS_INDEX_PATH, CHUNKS_PATH
from app.vectorstore.Store import load_index, load_chunk_map
from app.vectorstore.Search import search

logger = logging.getLogger(__name__)

# Loaded once per process, not on every request — a FAISS index and the
# chunk map are read-only after indexing finishes, no reason to hit disk
# every single query.
_index = None
_chunk_map = None


def _get_index_and_chunks():
    global _index, _chunk_map
    if _index is None or _chunk_map is None:
        logger.info("Loading FAISS index and chunk map (first use this process)...")
        _index = load_index(FAISS_INDEX_PATH)
        _chunk_map = load_chunk_map(CHUNKS_PATH)
    return _index, _chunk_map


def build_context(
    question: str,
    top_k: int = TOP_K_RESULTS,
    min_score: float = SIMILARITY_THRESHOLD,
) -> tuple[str, list[dict]]:
    """
    Returns (context_text, sources).

    context_text: chunks joined into one block, each labeled with its
    title/URL so the LLM can naturally reference them per prompt_builder's
    rule 7 ("mention the relevant source and clause").

    sources: the raw chunk dicts that passed the similarity threshold,
    for the caller to build citation objects from (the LLM module has
    no concept of citations — that's assembled here, one layer up).

    Returns ("", []) if nothing meets min_score — the caller should
    treat this as "no relevant information found" and skip calling the
    LLM entirely (calling generate_answer() with empty context would
    raise, per prompt_builder.py's validation — and even if it didn't,
    there's nothing worth generating from).
    """
    from app.embeddings.embedder import QwenEmbedder  # local import — see note below

    embedder = QwenEmbedder()
    query_vector = embedder.embed_query(question)
    query_vector = np.asarray(query_vector, dtype=np.float32)

    index, chunk_map = _get_index_and_chunks()
    results = search(index, chunk_map, query_vector, top_k=top_k)

    relevant = [r for r in results if r.get("score", 0) >= min_score]

    if not relevant:
        logger.info(
            "No chunks met similarity threshold %.2f for question: %r",
            min_score, question,
        )
        return "", []

    context_parts = []
    for r in relevant:
        title = r.get("title", "Untitled")
        url = r.get("url", "")
        text = r.get("text", "")
        context_parts.append(f"[Source: {title} — {url}]\n{text}")

    context_text = "\n\n---\n\n".join(context_parts)
    return context_text, relevant