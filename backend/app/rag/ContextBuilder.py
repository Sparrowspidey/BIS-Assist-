class ContextBuilder:
    """
    Takes a list of retrieved document chunks and assembles them
    into a single formatted context string that gets injected
    into the LLM prompt by the llm/ layer.
    """

    @staticmethod
    def build(chunks: list[dict], max_tokens: int = 3000) -> str:
        """
        Concatenates retrieved chunks into a structured context block.
        Stops adding chunks once the approximate token limit is reached
        to avoid overflowing the LLM's context window.
        """
        context_parts = []
        total_chars = 0
        # Rough approximation: 1 token ≈ 4 characters
        max_chars = max_tokens * 4

        for chunk in chunks:
            # Build a source label for each chunk
            source_label = f"[Source: {chunk['source']}"
            if chunk.get("page"):
                source_label += f", Page {chunk['page']}"
            source_label += "]"

            chunk_text = f"{source_label}\n{chunk['text']}"

            # Stop if adding this chunk would exceed the token budget
            if total_chars + len(chunk_text) > max_chars:
                break

            context_parts.append(chunk_text)
            total_chars += len(chunk_text)

        # Separate each chunk with a clear divider
        return "\n\n---\n\n".join(context_parts)

    @staticmethod
    def format_sources(chunks: list[dict]) -> list[dict]:
        """
        Returns a deduplicated list of source citations.
        The router passes this back to the frontend so it can
        display references under the LLM's answer.
        """
        seen = set()
        sources = []
        for chunk in chunks:
            key = (chunk["source"], chunk.get("page"))
            if key not in seen:
                seen.add(key)
                sources.append({
                    "source": chunk["source"],
                    "page":   chunk.get("page"),
                    "score":  round(chunk["score"], 4),
                })
        return sources