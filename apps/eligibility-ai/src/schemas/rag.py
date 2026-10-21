"""
Pydantic Schemas for Module 4: AI RAG & Knowledge Base.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl


class IngestRequest(BaseModel):
    """Payload for POST /api/v1/admin/ingest"""
    text: str = Field(..., min_length=10, description="Full raw policy or guideline text to chunk and embed")
    source_url: str = Field(..., description="Official citation URL (e.g. https://ges.gov.gh/cssps-guidelines)")
    title: Optional[str] = Field(None, description="Descriptive title of the document")
    document_type: Optional[str] = Field("POLICY_GUIDELINE", description="Category tag (e.g. CSSPS, SCHOLARSHIP, CURRICULUM)")
    chunk_size: Optional[int] = Field(500, ge=100, le=2000, description="Target chunk size in characters")
    chunk_overlap: Optional[int] = Field(50, ge=0, le=500, description="Character overlap between consecutive chunks")

    model_config = {
        "json_schema_extra": {
            "example": {
                "text": "The Computerized School Selection and Placement System (CSSPS) places JHS graduates into SHS and TVET institutions based on candidate raw aggregate and programme vacancies.",
                "source_url": "https://cssps.gov.gh/guidelines",
                "title": "2026 CSSPS Selection Policy",
                "chunk_size": 500,
                "chunk_overlap": 50
            }
        }
    }


class IngestResponse(BaseModel):
    """Response payload for POST /api/v1/admin/ingest"""
    status: str = "SUCCESS"
    message: str
    source_url: str
    title: Optional[str] = None
    chunks_ingested: int
    document_ids: List[str]


class ChatRequest(BaseModel):
    """Payload for POST /api/v1/ai/chat"""
    query: str = Field(..., min_length=2, description="Academic or placement question from learner")
    top_k: Optional[int] = Field(4, ge=1, le=10, description="Number of most relevant context chunks to retrieve")

    model_config = {
        "json_schema_extra": {
            "example": {
                "query": "How is the raw score calculated for CSSPS school placement?",
                "top_k": 3
            }
        }
    }


class CitedSource(BaseModel):
    source_url: str
    title: Optional[str] = None
    content_snippet: str
    similarity_score: float


class ChatResponse(BaseModel):
    """Response payload for POST /api/v1/ai/chat"""
    query: str
    answer: str
    sources: List[CitedSource]
    disclaimer: str
