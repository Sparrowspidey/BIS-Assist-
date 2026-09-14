from app.rag.Retriever import Retriever
from app.rag.ContextBuilder import ContextBuilder


class RAGPipeline:
    """
    Single entry point for the RAG subsystem.
    The router calls Pipeline.run(query) and receives back
    the assembled context + sources to hand off to the LLM layer.
    """

    def __init__(self):
        self.retriever = Retriever()
        self.context_builder = ContextBuilder()

    def run(self, query: str, top_k: int = 5) -> dict:
        """
        Executes the full retrieval pipeline for a given user query.

        Returns:
            {
                "context": str,       # Formatted text to inject into LLM prompt
                "sources": list[dict] # Citations to return to the frontend
            }
        """
        # Step 1: Retrieve most relevant chunks from the vector DB
        chunks = self.retriever.retrieve(query=query, top_k=top_k)

        # If nothing was retrieved, return empty — LLM layer handles fallback
        if not chunks:
            return {"context": "", "sources": []}

        # Step 2: Assemble chunks into one context string
        context = self.context_builder.build(chunks)

        # Step 3: Extract deduplicated source citations
        sources = self.context_builder.format_sources(chunks)

        return {
            "context": context,
            "sources": sources,
        }