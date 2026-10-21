"""
FastAPI Router for AI RAG Chat endpoints.
Performs pgvector cosine similarity search and constrained LLM academic guidance.
"""

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.rag import ChatRequest, ChatResponse, CitedSource
from rag.service import RagService

router = APIRouter(prefix="/ai", tags=["AI Guidance & RAG Chat"])


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Query AI knowledge base for academic and placement guidance",
    description="""
    Performs cosine similarity search against pgvector chunks and passes retrieved context
    into a strictly constrained LLM prompt.
    Constraints:
    - Never hallucinates facts not found in context.
    - Explicitly includes disclaimer that CSSPS placements cannot be guaranteed.
    - Cites the official `source_url`.
    """
)
def chat_guidance(
    payload: ChatRequest,
    db: Session = Depends(get_db)
) -> ChatResponse:
    try:
        service = RagService(db)
        result = service.chat(
            query=payload.query,
            top_k=payload.top_k or 4
        )

        sources = [
            CitedSource(
                source_url=s["source_url"],
                title=s.get("title"),
                content_snippet=s["content_snippet"],
                similarity_score=s["similarity_score"]
            )
            for s in result["sources"]
        ]

        return ChatResponse(
            query=result["query"],
            answer=result["answer"],
            sources=sources,
            disclaimer=result["disclaimer"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI chat pipeline error: {str(e)}"
        )
