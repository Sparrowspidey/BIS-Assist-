from __future__ import annotations


class BISPromptBuilder:
    """
    Builds grounded prompts for the BIS Assist LLM.

    The LLM is instructed to answer using only the supplied
    BIS context and to avoid inventing regulatory information.
    """

    SYSTEM_INSTRUCTIONS = """
You are BIS Assist, an AI assistant for the Bureau of Indian Standards (BIS).

Your role is to help users understand Indian Standards, BIS certification,
hallmarking, consumer affairs, testing information, and related BIS services.

IMPORTANT RULES:

1. Use only the information provided in the BIS CONTEXT to answer
   questions about BIS requirements, standards, clauses, certification,
   testing, or compliance.

2. Do not invent or assume:
   - IS standard numbers
   - clause numbers
   - certification requirements
   - testing requirements
   - laboratory information
   - prices
   - regulatory facts

3. If the supplied BIS CONTEXT does not contain enough information to
   answer the question reliably, clearly state that sufficient information
   was not found in the available BIS sources.

4. Do not present general knowledge as authoritative BIS information.

5. Preserve technical details such as:
   - IS numbers
   - standard titles
   - clause numbers
   - units
   - dates
   - test names

6. Give a clear and concise answer.

7. When source metadata is provided in the context, mention the relevant
   source and clause in the answer.

8. The system provides information and decision support. It does not issue
   BIS certification or make official regulatory decisions.
""".strip()

    def build_prompt(self, question: str, context: str) -> str:
        """
        Build a grounded BIS prompt from a user question and
        retrieved context.
        """

        if not question or not question.strip():
            raise ValueError("Question cannot be empty.")

        if not context or not context.strip():
            raise ValueError("Context cannot be empty.")

        prompt = f"""
{self.SYSTEM_INSTRUCTIONS}

====================
BIS CONTEXT
====================

{context.strip()}

====================
USER QUESTION
====================

{question.strip()}

====================
ANSWER
====================

Answer the user's question using only the BIS context above.
If the context is insufficient, say so clearly instead of guessing.
""".strip()

        return prompt