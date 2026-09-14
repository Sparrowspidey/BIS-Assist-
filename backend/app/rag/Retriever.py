from app.embeddings.Embedder import Embedder
from app.vectorstore.VectorStore import VectorStore
from app.config.Config import settings


class Retriever:
    """
    Bridges the Embedder and the VectorStore.
    Takes a raw text query, converts it to a vector,
    then fetches the most semantically relevant chunks from the DB.
    """

    def __init__(self):
        self.embedder = Embedder()
        self.vectorstore = VectorStore()

    def retrieve(self, query: str, top_k: int = 5) -> list[dict]:
        """
        1. Embeds the user's query text into a vector.
        2. Searches the vector DB for the most similar document chunks.
        3. Returns a clean list of chunks with their metadata.
        """
        # Step 1: Convert query text → vector
        query_vector = self.embedder.embed_query(query)

        # Step 2: Search vector DB for nearest neighbours
        results = self.vectorstore.similarity_search(
            query_vector=query_vector,
            top_k=top_k,
            score_threshold=settings.RETRIEVAL_SCORE_THRESHOLD,
        )

        # Step 3: Parse raw Qdrant results into clean dicts
        chunks = []
        for result in results:
            chunks.append({
                "text":   result.payload.get("text", ""),
                "source": result.payload.get("source", ""),
                "page":   result.payload.get("page", None),
                "score":  result.score,
            })

        return chunks