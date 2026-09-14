# backend/app/rag/pipeline.py

class RAGPipeline:
    def __init__(self, vectorstore, llm_client):
        """
        vectorstore  → passed in by your teammates (FAISS search)
        llm_client   → passed in by your teammates (Ollama/Mistral)
        """
        self.vectorstore = vectorstore
        self.llm_client = llm_client

    def format_context(self, retrieved_docs: list[dict]) -> str:
        """
        Takes the list of documents returned by FAISS search
        and formats them into a readable block of text for the LLM prompt.
        
        Each doc is expected to be a dict like:
        {"content": "...text...", "source": "filename or URL"}
        """
        context_parts = []
        for i, doc in enumerate(retrieved_docs, 1):
            source = doc.get("source", "Unknown Source")
            content = doc.get("content", "")
            context_parts.append(f"[Document {i} - Source: {source}]\n{content}\n")

        return "\n".join(context_parts)

    async def process_query(self, user_query: str) -> dict:
        """
        Main function. This is what gets called when a user sends a message.
        
        Steps:
        1. Search FAISS for relevant BIS document chunks
        2. Format those chunks into a context string
        3. Pass the query + context to the LLM
        4. Return the answer + sources
        """

        # Step 1: Retrieve top 5 relevant chunks from FAISS
        retrieved_docs = self.vectorstore.search(user_query, top_k=5)

        # Step 2: Format the retrieved docs into a context block
        context_str = self.format_context(retrieved_docs)

        # Step 3: Send to LLM (your other teammate handles this)
        llm_response = await self.llm_client.generate_response(
            query=user_query,
            context=context_str
        )

        # Step 4: Return structured result to the API
        return {
            "query": user_query,
            "answer": llm_response,
            "sources": [doc.get("source", "Unknown") for doc in retrieved_docs]
        }