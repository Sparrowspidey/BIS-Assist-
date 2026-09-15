from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000)
    language: Optional[str] = "en"


class Citation(BaseModel):
    standard_id: Optional[str] = None
    clause: Optional[str] = None
    document_title: Optional[str] = None
    snippet: Optional[str] = None
    url: Optional[str] = None

class LabResult(BaseModel):
    name: str
    state: str
    osl_code: str
    source_url: str = ""


class QueryResponse(BaseModel):
    query: str
    response: str
    sources: List[Citation] = []
    labs: List[LabResult] = []