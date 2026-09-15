from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.router import Intent, detect_intent
from app.api.Schemas import QueryRequest, QueryResponse
from app.rag.Answer import answer_from_documents
from app.rag.General_chat import handle_general_chat

router = APIRouter()


@router.get("/")
async def root():
    return {"project": "Standard_AI - BIS Assist", "status": "online"}


@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "BIS-Assist API"}


@router.post("/ask", response_model=QueryResponse)
async def ask_query(request: QueryRequest) -> QueryResponse:
    try:
        intent = detect_intent(request.query)

        # Default value for branches that do not return sources.
        sources = []

        if intent == Intent.RAG_QUERY:
            result = answer_from_documents(request.query)
            answer = result.answer
            sources = result.sources

        elif intent == Intent.LABS_LOOKUP:
            from app.labs.Lookup import search_labs

            matches = search_labs(request.query)

            if matches:
                lines = [
                    f"{lab['name']} ({lab['state']}, OSL {lab['osl_code']})"
                    for lab in matches
                ]
                answer = "Here are some matching labs:\n" + "\n".join(lines)
            else:
                answer = "I couldn't find a matching lab for that location."

        elif intent == Intent.RECOMMENDATION:
            from app.recommender.Matcher import match_product

            matches = match_product(request.query)
            answer = "Product recommendations:\n" + "\n".join(
                str(match) for match in matches
            )

        elif intent == Intent.TRANSLATE_TEXT:
            answer = "Temporary response: translate-text intent detected."

        elif intent == Intent.GENERAL_CHAT:
            answer = handle_general_chat(request.query)

        else:
            answer = "Temporary response: unable to determine the intent."

        return QueryResponse(
            query=request.query,
            response=answer,
            sources=sources,
        )

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {exc}",
        ) from exc