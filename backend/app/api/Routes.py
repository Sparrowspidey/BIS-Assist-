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
    """
    TEMPORARY: each branch below returns placeholder text. As each real
    module lands, replace the corresponding branch with the actual call:

        RAG_QUERY      -> app.rag.answer_from_documents(request.query)
        LABS_LOOKUP    -> app.recommender / a labs filter function over
                          data/processed/testing_labs.json
        RECOMMENDATION -> app.recommender.matcher.match_product(request.query)
        GENERAL_CHAT   -> can stay simple / static, or route through the
                          LLM module with no retrieval context

    Multilingual (FR8) is NOT handled here — per app/router/intent_detector.py's
    module docstring, language detection/translation should wrap this whole
    function (translate query in, classify + answer in English, translate
    answer back out), not live inside intent branches. That wrapper belongs
    in app/translation/, applied by whoever calls this endpoint or by
    middleware — not added as more logic in this function.
    """
    try:
        sources = []
        labs = []
        answer = "Temporary response: unable to determine the intent."
        intent = detect_intent(request.query)

        if intent == Intent.RAG_QUERY:
            result = answer_from_documents(request.query)
            answer = result.answer
            sources = [
                {
                    "standard_id": source.get("standard_id"),
                    "clause": source.get("clause"),
                    "document_title": source.get("document_title") or source.get("title"),
                    "snippet": source.get("snippet") or source.get("text"),
                    "url": source.get("url") or source.get("source_url"),
                }
                for source in result.sources
            ]
        elif intent == Intent.LABS_LOOKUP:
            from app.labs.Lookup import search_labs

            matches = search_labs(request.query)

            if matches:
                labs = [
                    {
                        "name": lab["name"],
                        "state": lab["state"],
                        "osl_code": lab["osl_code"],
                        "source_url": lab.get("source_url", ""),
                    }
                    for lab in matches
                ]

                lines = [
                    f"{lab['name']} ({lab['state']}, OSL {lab['osl_code']})"
                    for lab in matches
                ]

                answer = "Here are some matching labs:\n" + "\n".join(lines)
            else:
                labs = []
                answer = "I couldn't find a matching lab for that location."
        elif intent == Intent.RECOMMENDATION:
            from app.recommender.Matcher import match_product
            matches = match_product(request.query)
            answer = "..."  # format matches into text
        elif intent == Intent.TRANSLATE_TEXT:
            answer = "Temporary response: translate-text intent detected."
        elif intent == Intent.GENERAL_CHAT:
            answer = handle_general_chat(request.query)

        return QueryResponse(
            query=request.query,
            response=answer,
            sources=sources,
            labs=labs,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {e}")