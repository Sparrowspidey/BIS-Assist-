from __future__ import annotations

import json
import time
from pathlib import Path

import numpy as np

from app.config.Config import EMBEDDINGS_DIR, PROCESSED_DIR
from app.embeddings.embedder import QwenEmbedder


BATCH_SIZE = 16


def load_jsonl(file_path: Path) -> list[dict]:
    """Load records from a JSONL chunk file."""
    records = []

    with file_path.open("r", encoding="utf-8") as file:
        for line_number, line in enumerate(file, start=1):
            line = line.strip()

            if not line:
                continue

            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(
                    f"Invalid JSON on line {line_number}: {file_path}"
                ) from exc

            if not isinstance(record, dict):
                raise ValueError(
                    f"Expected JSON object on line {line_number}: {file_path}"
                )

            records.append(record)

    return records


def get_texts(records: list[dict], file_path: Path) -> list[str]:
    """Extract and validate the text field from every chunk."""
    texts = []

    for index, record in enumerate(records):
        text = record.get("text")

        if not isinstance(text, str) or not text.strip():
            raise ValueError(
                f"Missing or empty 'text' field in "
                f"{file_path.name}, record {index}"
            )

        texts.append(text)

    return texts


def get_output_paths(file_path: Path) -> tuple[Path, Path]:
    """Create output paths based on the input filename."""
    name = file_path.stem

    embedding_path = EMBEDDINGS_DIR / f"{name}_embeddings.npy"
    metadata_path = EMBEDDINGS_DIR / f"{name}_metadata.jsonl"

    return embedding_path, metadata_path


def generate_file_embeddings(
    file_path: Path,
    embedder: QwenEmbedder,
) -> None:
    """Generate embeddings for one chunked JSONL file."""

    print()
    print("=" * 70)
    print(f"EMBEDDING GENERATION: {file_path.name}")
    print("=" * 70)

    records = load_jsonl(file_path)
    texts = get_texts(records, file_path)

    embedding_path, metadata_path = get_output_paths(file_path)

    print(f"Input file: {file_path}")
    print(f"Total chunks: {len(records)}")
    print(f"Batch size: {BATCH_SIZE}")
    print()

    all_embeddings = []

    total_batches = (
        len(texts) + BATCH_SIZE - 1
    ) // BATCH_SIZE

    start_time = time.time()

    for batch_number, start_index in enumerate(
        range(0, len(texts), BATCH_SIZE),
        start=1,
    ):
        end_index = min(
            start_index + BATCH_SIZE,
            len(texts),
        )

        print(
            f"Batch {batch_number}/{total_batches} "
            f"({start_index + 1}-{end_index})..."
        )

        batch_embeddings = embedder.embed_documents(
            texts[start_index:end_index],
            batch_size=BATCH_SIZE,
        )

        all_embeddings.append(batch_embeddings)

        elapsed = time.time() - start_time

        print(
            f"  Completed: {end_index}/{len(texts)} "
            f"| Elapsed: {elapsed / 60:.1f} min"
        )

    embeddings = np.vstack(all_embeddings)

    expected_shape = (
        len(records),
        embedder.EMBEDDING_DIMENSION,
    )

    if embeddings.shape != expected_shape:
        raise RuntimeError(
            f"Unexpected embedding shape. "
            f"Expected {expected_shape}, "
            f"got {embeddings.shape}"
        )

    if np.isnan(embeddings).any():
        raise RuntimeError(
            f"NaN values detected in {file_path.name}"
        )

    EMBEDDINGS_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    np.save(
        embedding_path,
        embeddings,
    )

    with metadata_path.open(
        "w",
        encoding="utf-8",
    ) as file:
        for record in records:
            file.write(
                json.dumps(
                    record,
                    ensure_ascii=False,
                )
                + "\n"
            )

    total_time = time.time() - start_time

    print()
    print("=" * 70)
    print(f"COMPLETED: {file_path.name}")
    print("=" * 70)
    print(f"Chunks: {len(records)}")
    print(f"Embedding shape: {embeddings.shape}")
    print(f"Embeddings: {embedding_path}")
    print(f"Metadata: {metadata_path}")
    print(f"Total time: {total_time / 60:.1f} minutes")
    print("=" * 70)


def find_chunk_files() -> list[Path]:
    """Find all chunked JSONL files in data/processed."""
    return sorted(PROCESSED_DIR.glob("*.jsonl"))


def run_all() -> None:
    """Automatically process all available chunked JSONL files."""

    chunk_files = find_chunk_files()

    if not chunk_files:
        print("No JSONL chunk files found.")
        return

    print("=" * 70)
    print("BIS EMBEDDING PIPELINE")
    print("=" * 70)

    print(f"Found {len(chunk_files)} JSONL chunk file(s):")

    for file_path in chunk_files:
        print(f"  - {file_path.name}")

    embedder = QwenEmbedder()

    for file_path in chunk_files:

        embedding_path, metadata_path = get_output_paths(file_path)

        if embedding_path.exists() and metadata_path.exists():
            print()
            print(
                f"Skipping {file_path.name} "
                f"— embeddings already exist."
            )
            continue

        generate_file_embeddings(
            file_path,
            embedder,
        )


if __name__ == "__main__":
    run_all()