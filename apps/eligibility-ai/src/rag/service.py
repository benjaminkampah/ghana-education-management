"""
High-Level RAG Service for Project Antigravity.
Handles document ingestion, pgvector cosine similarity search,
and constrained LLM academic guidance with CSSPS placement disclaimer.
"""

from typing import List, Dict, Any, Optional, Tuple
import math
import uuid
from sqlalchemy.orm import Session
from sqlalchemy import select

from core.config import settings
from models.schema import VectorDocument
from .chunker import chunk_text
from .embeddings import get_embedding, get_embeddings, get_openai_client

SYSTEM_PROMPT_CONSTRAINT = (
    "You are an academic guide for Ghanaian JHS learners. "
    "Answer using ONLY the provided context. "
    "You cannot guarantee CSSPS placements. "
    "Always cite the source_url of the reference documents. "
    "If the answer cannot be determined strictly from the provided context, state clearly "
    "that the verified policy documents do not contain this information."
)

CSSPS_DISCLAIMER = (
    "This system provides academic guidance based on official guidelines. "
    "It cannot guarantee CSSPS placements, school selection admissions, or scholarship awards."
)


def _cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
    """Computes cosine similarity between two numeric vectors in Python."""
    if not vec_a or not vec_b or len(vec_a) != len(vec_b):
        return 0.0
    dot_product = sum(a * b for a, b in zip(vec_a, vec_b))
    norm_a = math.sqrt(sum(a * a for a in vec_a))
    norm_b = math.sqrt(sum(b * b for b in vec_b))
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
    return max(0.0, min(1.0, dot_product / (norm_a * norm_b)))


class RagService:
    def __init__(self, db: Session):
        self.db = db

    def ingest_document(
        self,
        text: str,
        source_url: str,
        title: Optional[str] = None,
        document_type: Optional[str] = "POLICY_GUIDELINE",
        chunk_size: int = 500,
        chunk_overlap: int = 50,
        metadata: Optional[Dict[str, Any]] = None
    ) -> List[VectorDocument]:
        """
        Chunks raw policy text, computes vector embeddings,
        and saves chunks into the vector_documents table.
        """
        chunks = chunk_text(text, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
        if not chunks:
            return []

        embeddings = get_embeddings(chunks)
        ingested_docs: List[VectorDocument] = []

        for idx, (chunk_content, emb) in enumerate(zip(chunks, embeddings)):
            doc = VectorDocument(
                id=uuid.uuid4(),
                title=title or f"Document Chunk {idx + 1}",
                content=chunk_content,
                embedding=emb,
                source_url=source_url,
                document_type=document_type,
                chunk_index=idx,
                metadata_=metadata or {"source": source_url, "chunk": idx}
            )
            self.db.add(doc)
            ingested_docs.append(doc)

        self.db.commit()
        for doc in ingested_docs:
            self.db.refresh(doc)

        return ingested_docs

    def search_similar(
        self,
        query: str,
        top_k: int = 4
    ) -> List[Tuple[VectorDocument, float]]:
        """
        Performs cosine similarity search against VectorDocument records.
        Uses PostgreSQL pgvector cosine distance if available,
        falling back to Python in-memory cosine search for SQLite/testing.
        """
        query_vector = get_embedding(query)
        scored_results: List[Tuple[VectorDocument, float]] = []

        # 1. Attempt PostgreSQL pgvector cosine distance query
        try:
            # VectorDocument.embedding.cosine_distance computes distance: 0 = identical, 2 = opposite
            raw_results = (
                self.db.query(
                    VectorDocument,
                    VectorDocument.embedding.cosine_distance(query_vector).label("distance")
                )
                .order_by("distance")
                .limit(top_k)
                .all()
            )
            for doc, distance in raw_results:
                # Convert distance into similarity score: 1 - (dist / 2)
                sim = max(0.0, 1.0 - float(distance or 0.0))
                scored_results.append((doc, round(sim, 4)))
            return scored_results
        except Exception:
            # 2. In-memory fallback for environments without active pgvector extensions (e.g. SQLite test runners)
            self.db.rollback()
            all_docs = self.db.query(VectorDocument).all()
            for doc in all_docs:
                raw_emb = doc.embedding
                # Handle cases where embedding is list or string
                if isinstance(raw_emb, list):
                    emb_list = [float(x) for x in raw_emb]
                elif isinstance(raw_emb, str):
                    clean = raw_emb.strip("[]()").split(",")
                    emb_list = [float(x.strip()) for x in clean if x.strip()]
                else:
                    emb_list = []

                if emb_list:
                    sim = _cosine_similarity(query_vector, emb_list)
                    scored_results.append((doc, round(sim, 4)))

            scored_results.sort(key=lambda x: x[1], reverse=True)
            return scored_results[:top_k]

    def chat(
        self,
        query: str,
        top_k: int = 4
    ) -> Dict[str, Any]:
        """
        Retrieves matching chunks and generates a strictly constrained academic response.
        Enforces no admissions guarantee and requires source URL citations.
        """
        similar_docs = self.search_similar(query, top_k=top_k)

        # Build context prompt
        context_blocks = []
        cited_sources = []

        for doc, score in similar_docs:
            context_blocks.append(
                f"[Source: {doc.source_url} | Title: {doc.title}]\n{doc.content}"
            )
            cited_sources.append({
                "source_url": doc.source_url,
                "title": doc.title,
                "content_snippet": doc.content[:180] + ("..." if len(doc.content) > 180 else ""),
                "similarity_score": score
            })

        formatted_context = "\n\n---\n\n".join(context_blocks) if context_blocks else "No relevant documents found."

        # Query OpenAI LLM if configured
        client = get_openai_client()
        if client and context_blocks:
            try:
                response = client.chat.completions.create(
                    model=settings.OPENAI_COMPLETION_MODEL,
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT_CONSTRAINT},
                        {
                            "role": "user",
                            "content": (
                                f"Context from official educational documents:\n{formatted_context}\n\n"
                                f"Learner Inquiry: {query}\n\n"
                                f"Provide a factual answer grounded strictly in the context above. Cite the source URLs."
                            )
                        }
                    ],
                    temperature=0.1
                )
                answer = response.choices[0].message.content or ""
            except Exception as e:
                # Fallback response citing retrieved context directly
                answer = (
                    f"Based on the official educational guidelines from {cited_sources[0]['source_url']}:\n\n"
                    f"{similar_docs[0][0].content}\n\n"
                    f"(Source: {cited_sources[0]['source_url']})"
                )
        elif context_blocks:
            # Deterministic academic guide response for test and offline environments
            top_doc = similar_docs[0][0]
            answer = (
                f"Based on the official educational guidelines from {top_doc.source_url}:\n\n"
                f"{top_doc.content}\n\n"
                f"Reference: {top_doc.source_url}"
            )
        else:
            answer = (
                "The official policy documents currently ingested into our knowledge base "
                "do not contain information answering this inquiry. Please consult the "
                "Ghana Education Service (GES) or CSSPS Secretariat directly."
            )

        # Enforce that the CSSPS placement disclaimer is present
        if "CSSPS" not in answer:
            answer = f"{answer}\n\n*Note: {CSSPS_DISCLAIMER}*"

        return {
            "query": query,
            "answer": answer,
            "sources": cited_sources,
            "disclaimer": CSSPS_DISCLAIMER
        }
