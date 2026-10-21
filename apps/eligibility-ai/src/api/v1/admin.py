"""
FastAPI Router for Admin ingestion endpoints.
Handles document chunking, OpenAI embedding generation, and saving to pgvector.
"""

from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.rag import IngestRequest, IngestResponse
from rag.service import RagService

router = APIRouter(prefix="/admin", tags=["Admin & Document Ingestion"])


@router.post(
    "/ingest",
    response_model=IngestResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest policy document into pgvector knowledge base",
    description="""
    Takes a raw policy document, chunks it with overlap, generates 1536-dimensional OpenAI embeddings,
    and saves the chunks into the `vector_documents` table for semantic similarity search.
    """
)
def ingest_document(
    payload: IngestRequest,
    db: Session = Depends(get_db)
) -> IngestResponse:
    try:
        service = RagService(db)
        docs = service.ingest_document(
            text=payload.text,
            source_url=payload.source_url,
            title=payload.title,
            document_type=payload.document_type,
            chunk_size=payload.chunk_size or 500,
            chunk_overlap=payload.chunk_overlap or 50
        )

        return IngestResponse(
            status="SUCCESS",
            message=f"Successfully ingested {len(docs)} document chunks.",
            source_url=payload.source_url,
            title=payload.title,
            chunks_ingested=len(docs),
            document_ids=[str(doc.id) for doc in docs]
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Document ingestion failed: {str(e)}"
        )
