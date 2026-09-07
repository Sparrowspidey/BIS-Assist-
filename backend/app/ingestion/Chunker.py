"""
Splits a CleanedDocument's text into overlapping chunks sized for embedding.

Word-count based chunking with overlap — simple, and good enough to start
with. The embeddings/retrieval owner can swap this for a smarter
(sentence-aware or token-aware) strategy later without touching the
rest of the pipeline, as long as the Chunk schema stays the same.
"""

from __future__ import annotations

from app.ingestion.Schema import CleanedDocument, Chunk

DEFAULT_CHUNK_SIZE_WORDS = 250
DEFAULT_OVERLAP_WORDS = 40


def chunk_document(
    doc: CleanedDocument,
    chunk_size: int = DEFAULT_CHUNK_SIZE_WORDS,
    overlap: int = DEFAULT_OVERLAP_WORDS,
) -> list[Chunk]:
    words = doc.text.split()
    if not words:
        return []

    chunks: list[Chunk] = []
    start = 0
    index = 0

    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk_text = " ".join(words[start:end])

        chunks.append(
            Chunk(
                chunk_id=f"{doc.page_id}_{index}",
                page_id=doc.page_id,
                url=doc.url,
                category=doc.category,
                title=doc.title,
                text=chunk_text,
                chunk_index=index,
                fetched_at=doc.fetched_at,
            )
        )

        index += 1
        if end == len(words):
            break
        start = end - overlap  # step back for overlap

    return chunks


def chunk_all(docs: list[CleanedDocument]) -> list[Chunk]:
    all_chunks: list[Chunk] = []
    for doc in docs:
        all_chunks.extend(chunk_document(doc))
    return all_chunks