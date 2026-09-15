from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ..router import detect_intent

router = APIRouter()


class QueryRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=1,
        max_length=2000
    )
    language: Optional[str] = "en"


class Citation(BaseModel):
    standard_id: Optional[str] = None
    clause: Optional[str] = None
    document_title: Optional[str] = None
    snippet: Optional[str] = None


class QueryResponse(BaseModel):
    query: str
    response: str
    sources: List[Citation] = []


@router.get("/")
async def root():
    return {
        "project": "Standard_AI - BIS Assist",
        "status": "online"
    }


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "BIS-Assist API"
    }


@router.post("/ask", response_model=QueryResponse)
async def ask_query(request: QueryRequest):
    try:
        intent = detect_intent(request.query)

        if intent == "bis_information":
            answer = "Temporary response: BIS information intent detected."

        elif intent == "standard_information":
            answer = "Temporary response: BIS standard information intent detected."

        elif intent == "product_information":
            answer = "Temporary response: BIS product information intent detected."

        elif intent == "recommendation":
            answer = "Temporary response: recommendation intent detected."

        elif intent == "translation":
            answer = "Temporary response: translation intent detected."

        elif intent == "general_chat":
            answer = "Temporary response: general conversation intent detected."

        else:
            answer = "Temporary response: unable to determine the intent."

        return QueryResponse(
            query=request.query,
            response=answer,
            sources=[]
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing query: {str(e)}"
        )