from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.router import Intent, detect_intent
from app.api.Schemas import QueryRequest, QueryResponse
from app.rag.Answer import answer_from_documents
from app.rag.General_chat import handle_general_chat
from app.translation import (
    detect_language,
    translate_to_english,
    translate_from_english,
)

router = APIRouter()


@router.get("/")
async def root():
    return {
        "project": "Standard_AI - BIS Assist",
        "status": "online",
    }


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "BIS-Assist API",
    }


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

  Main BIS Assist query pipeline.

    Multilingual flow:

        1. Detect the user's language.
        2. Translate the query to English when necessary.
        3. Detect intent using the English query.
        4. Run the appropriate backend action.
        5. Translate the generated answer back to the user's language.

    The backend internally works in English so that the existing
    RAG / lab / recommendation logic does not need separate
    language-specific implementations.
    """
    try:
        sources = []
        labs = []

        original_query = request.query.strip()

        if not original_query:
            raise HTTPException(
                status_code=400,
                detail="Query cannot be empty.",
            )

        # ---------------------------------------------------------------
        # 1. Determine user's language
        # ---------------------------------------------------------------
        #
        # The frontend can explicitly send:
        #
        #     language = "hi"
        #
        # When a non-English language is selected, trust that selection.
        #
        # Otherwise detect the language from the actual query.
        #

        requested_language = (request.language or "").strip().lower()

        if requested_language and requested_language != "en":
            user_language = requested_language
        else:
            user_language = detect_language(original_query)

        print("DEBUG original_query:", repr(original_query))
        print("DEBUG requested_language:", repr(requested_language))
        print("DEBUG user_language:", repr(user_language))

        # ---------------------------------------------------------------
        # 2. Translate user's query into English
        # ---------------------------------------------------------------

        english_query = translate_to_english(
            original_query,
            user_language,
        )

        print("DEBUG english_query:", repr(english_query))

       
        # ---------------------------------------------------------------
        # 3. Detect intent using the English query
        # ---------------------------------------------------------------

        intent = detect_intent(english_query)

        # Default answer
        answer = "Temporary response: unable to determine the intent."

        # ===============================================================
        # RAG QUERY
        # ===============================================================

        if intent == Intent.RAG_QUERY:

            result = answer_from_documents(english_query)

            answer = result.answer

            sources = [
                {
                    "standard_id": source.get("standard_id"),
                    "clause": source.get("clause"),
                    "document_title": (
                        source.get("document_title")
                        or source.get("title")
                    ),
                    "snippet": (
                        source.get("snippet")
                        or source.get("text")
                    ),
                    "url": (
                        source.get("url")
                        or source.get("source_url")
                    ),
                }
                for source in result.sources
            ]

        # ===============================================================
        # LABS LOOKUP
        # ===============================================================

        elif intent == Intent.LABS_LOOKUP:

            from app.labs.Lookup import search_labs

            matches = search_labs(english_query)

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
                    f"{lab['name']} "
                    f"({lab['state']}, OSL {lab['osl_code']})"
                    for lab in matches
                ]

                answer = (
                    "Here are some matching labs:\n"
                    + "\n".join(lines)
                )

            else:

                labs = []

                answer = (
                    "I couldn't find a matching lab for that location."
                )

        # ===============================================================
        # RECOMMENDATION
        # ===============================================================

        elif intent == Intent.RECOMMENDATION:

            from app.recommender.Matcher import match_product

            matches = match_product(english_query)

            if matches:
                answer = "\n".join(
                    str(match)
                    for match in matches
                )
            else:
                answer = (
                    "I couldn't find a suitable recommendation "
                    "for your query."
                )

        # ===============================================================
        # EXPLICIT TRANSLATION REQUEST
        # ===============================================================

        elif intent == Intent.TRANSLATE_TEXT:

            answer = (
                "Translation requests are handled through the "
                "multilingual translation layer."
            )

        # ===============================================================
        # GENERAL CHAT
        # ===============================================================

        elif intent == Intent.GENERAL_CHAT:

            answer = handle_general_chat(english_query)

        # ===============================================================
        # UNKNOWN
        # ===============================================================

        elif intent == Intent.UNKNOWN:

            # For an unknown query, try RAG as a useful fallback.
            result = answer_from_documents(english_query)

            answer = result.answer

            sources = [
                {
                    "standard_id": source.get("standard_id"),
                    "clause": source.get("clause"),
                    "document_title": (
                        source.get("document_title")
                        or source.get("title")
                    ),
                    "snippet": (
                        source.get("snippet")
                        or source.get("text")
                    ),
                    "url": (
                        source.get("url")
                        or source.get("source_url")
                    ),
                }
                for source in result.sources
            ]

        # ---------------------------------------------------------------
        # 4. Translate final answer back to user's language
        # ---------------------------------------------------------------
        
        print("DEBUG final translation language:", repr(user_language))
        print("DEBUG answer before translation:", repr(answer[:200]))

        final_answer = translate_from_english(
            answer,
            user_language,
        )

        # ---------------------------------------------------------------
        # 5. Return response
        # ---------------------------------------------------------------

        return QueryResponse(
            query=original_query,
            response=final_answer,
            sources=sources,
            labs=labs,
        )

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {e}",
        )