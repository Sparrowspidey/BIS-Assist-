from __future__ import annotations

from typing import Sequence

import numpy as np
from sentence_transformers import SentenceTransformer
from ..config.Config import (
    EMBEDDING_MODEL,
    EMBEDDING_DIMENSION as CONFIG_EMBEDDING_DIMENSION,
)

class QwenEmbedder:
    """
    Embedding wrapper for Qwen3-Embedding-0.6B.

    This class provides separate methods for:
    - document embeddings
    - query embeddings

    Document embeddings are generated without an instruction.
    Query embeddings use Qwen's built-in "query" prompt.
    """

    MODEL_NAME = EMBEDDING_MODEL
    EMBEDDING_DIMENSION = CONFIG_EMBEDDING_DIMENSION

    def __init__(self) -> None:
        self.model = SentenceTransformer(self.MODEL_NAME)

        actual_dimension = self.model.get_embedding_dimension()

        if actual_dimension != self.EMBEDDING_DIMENSION:
            raise RuntimeError(
                f"Unexpected embedding dimension: "
                f"expected {self.EMBEDDING_DIMENSION}, "
                f"got {actual_dimension}"
            )

    def embed_documents(
        self,
        documents: Sequence[str],
        batch_size: int = 16,
    ) -> np.ndarray:
        """
        Generate normalized embeddings for document chunks.

        Args:
            documents: Text chunks from BIS documents.
            batch_size: Number of texts processed at once.

        Returns:
            NumPy array with shape (number_of_documents, 1024).
        """
        if not documents:
            return np.empty(
                (0, self.EMBEDDING_DIMENSION),
                dtype=np.float32,
            )

        embeddings = self.model.encode(
            list(documents),
            batch_size=batch_size,
            normalize_embeddings=True,
            convert_to_numpy=True,
            show_progress_bar=False,
        )

        return np.asarray(embeddings, dtype=np.float32)

    def embed_query(self, query: str) -> np.ndarray:
        """
        Generate a normalized embedding for a user query.

        Qwen3's built-in "query" prompt is used because
        query embeddings benefit from task-specific instructions.

        Returns:
            NumPy array with shape (1024,).
        """
        if not query or not query.strip():
            raise ValueError("Query cannot be empty.")

        embedding = self.model.encode(
            query,
            prompt_name="query",
            normalize_embeddings=True,
            convert_to_numpy=True,
            show_progress_bar=False,
        )

        return np.asarray(embedding, dtype=np.float32)