"""
PyTest Suite for Module 4: AI RAG Service & Knowledge Base
Tests:
1. Text Chunking with Overlap
2. 1536-Dimensional Embeddings
3. Document Ingestion into VectorDocument
4. Cosine Similarity Semantic Search
5. Prompt Constraints & Strict CSSPS Disclaimers
6. REST API Endpoints:
   - POST /api/v1/admin/ingest
   - POST /api/v1/ai/chat
"""

import sys
import os
import uuid
import math
import pytest

# Add src to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from rag.chunker import chunk_text
from rag.embeddings import get_embedding, get_embeddings
from rag.service import RagService, SYSTEM_PROMPT_CONSTRAINT, CSSPS_DISCLAIMER
from models.schema import Base, VectorDocument


# ==============================================================================
# 1. TEXT CHUNKING TESTS
# ==============================================================================

def test_chunk_text_empty():
    assert chunk_text("") == []
    assert chunk_text("   ") == []


def test_chunk_text_short():
    short_text = "The CSSPS guidelines ensure fair placement for all Ghanaian JHS graduates."
    chunks = chunk_text(short_text, chunk_size=500, chunk_overlap=50)
    assert len(chunks) == 1
    assert chunks[0] == short_text


def test_chunk_text_multiparagraph():
    para1 = "Paragraph 1: Selection is determined by candidate BECE raw scores across 4 core and 2 best electives."
    para2 = "Paragraph 2: Category A Senior High Schools maintain a 30% quota reservation for public basic school pupils."
    para3 = "Paragraph 3: TVET tracks offer hands-on apprenticeships and direct certifications."
    full_text = f"{para1}\n\n{para2}\n\n{para3}"

    chunks = chunk_text(full_text, chunk_size=120, chunk_overlap=20)
    assert len(chunks) >= 3
    assert all(len(c) > 0 for c in chunks)


# ==============================================================================
# 2. EMBEDDINGS TESTS (1536 DIMENSIONS)
# ==============================================================================

def test_embedding_dimension():
    sample_text = "Ghana Education Service CSSPS placement criteria"
    vec = get_embedding(sample_text)
    assert isinstance(vec, list)
    assert len(vec) == 1536
    assert all(isinstance(x, (int, float)) for x in vec)


def test_embedding_unit_norm():
    vec = get_embedding("Testing normalization")
    norm = math.sqrt(sum(x * x for x in vec))
    # Normalized unit vectors should have norm ~ 1.0 (tolerance 0.05)
    assert abs(norm - 1.0) < 0.05


def test_batch_embeddings():
    texts = ["First document", "Second document", "Third document"]
    vectors = get_embeddings(texts)
    assert len(vectors) == 3
    assert all(len(v) == 1536 for v in vectors)


# ==============================================================================
# 3. RAG SERVICE INGESTION & SEARCH TESTS
# ==============================================================================

@pytest.fixture
def test_db_session():
    """In-memory SQLite session configured for VectorDocument tests."""
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy.pool import StaticPool

    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    session = TestingSession()
    try:
        yield session
    finally:
        session.close()


def test_ingest_document(test_db_session):
    service = RagService(test_db_session)
    policy_text = (
        "CSSPS Policy 2026: Candidates select up to six secondary institutions. "
        "Placements are strictly merit-based using raw scores from Core Mathematics, "
        "English Language, Integrated Science, and Social Studies. "
        "STEM academies require grade 1 or 2 in Mathematics and Science."
    )
    source_url = "https://ges.gov.gh/cssps/2026-policy"

    docs = service.ingest_document(
        text=policy_text,
        source_url=source_url,
        title="2026 Placement Guidelines",
        chunk_size=150,
        chunk_overlap=20
    )

    assert len(docs) >= 1
    assert all(d.source_url == source_url for d in docs)
    assert all(len(d.embedding) == 1536 for d in docs)

    # Verify rows in database
    db_count = test_db_session.query(VectorDocument).count()
    assert db_count == len(docs)


def test_semantic_similarity_search(test_db_session):
    service = RagService(test_db_session)

    # Ingest two distinct documents
    service.ingest_document(
        text="The Mastercard Foundation Scholarship covers full tuition, hostel accommodation, and stipends for brilliant but needy SHS students.",
        source_url="https://mastercardfdn.org/ghana-scholars",
        title="Mastercard Foundation Scholarship"
    )
    service.ingest_document(
        text="Technical and Vocational Education and Training (TVET) provides practical engineering, carpentry, and electrical wiring training.",
        source_url="https://tvet.gov.gh/tracks",
        title="TVET Pathways"
    )

    # Query for scholarship
    results = service.search_similar(query="How do I get financial assistance and scholarships for SHS?", top_k=1)
    assert len(results) == 1
    top_doc, score = results[0]
    assert "Mastercard" in top_doc.content or "Scholarship" in top_doc.content
    assert top_doc.source_url == "https://mastercardfdn.org/ghana-scholars"


def test_chat_prompt_constraints_and_disclaimer(test_db_session):
    service = RagService(test_db_session)
    service.ingest_document(
        text="Candidates who complete JHS can access Free SHS secondary education nationwide.",
        source_url="https://freeshs.gov.gh/policy",
        title="Free SHS Policy"
    )

    result = service.chat(query="Can you guarantee my admission to Achimota School?", top_k=1)

    assert "query" in result
    assert "answer" in result
    assert "sources" in result
    assert "disclaimer" in result

    # Check strict constraints:
    # 1. Answer must NOT guarantee admission
    # 2. Disclaimer must state admissions cannot be guaranteed
    assert "CSSPS" in result["answer"] or "CSSPS" in result["disclaimer"]
    assert "cannot guarantee" in result["disclaimer"].lower()
    # 3. Must cite official source URL
    assert any("https://freeshs.gov.gh/policy" in s["source_url"] for s in result["sources"])


# ==============================================================================
# 4. REST API ENDPOINT TESTS (POST /admin/ingest & POST /ai/chat)
# ==============================================================================

def test_api_admin_ingest_and_chat(test_db_session):
    from fastapi.testclient import TestClient
    from core.database import get_db
    from main import app

    def override_get_db():
        try:
            yield test_db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    client = TestClient(app)

    # 1. Test POST /api/v1/admin/ingest
    ingest_payload = {
        "text": "The CSSPS Secretariat operates an automated selection portal. Candidates are placed by merit into available vacancies.",
        "source_url": "https://cssps.gov.gh/automated-selection",
        "title": "CSSPS Portal Operation Guidelines",
        "chunk_size": 300,
        "chunk_overlap": 30
    }
    res_ingest = client.post("/api/v1/admin/ingest", json=ingest_payload)
    assert res_ingest.status_code == 201
    data_ingest = res_ingest.json()
    assert data_ingest["status"] == "SUCCESS"
    assert data_ingest["chunks_ingested"] >= 1
    assert data_ingest["source_url"] == ingest_payload["source_url"]
    assert len(data_ingest["document_ids"]) == data_ingest["chunks_ingested"]

    # 2. Test POST /api/v1/ai/chat
    chat_payload = {
        "query": "How are candidates selected into available vacancies?",
        "top_k": 2
    }
    res_chat = client.post("/api/v1/ai/chat", json=chat_payload)
    assert res_chat.status_code == 200
    data_chat = res_chat.json()
    assert "answer" in data_chat
    assert len(data_chat["sources"]) >= 1
    assert data_chat["sources"][0]["source_url"] == ingest_payload["source_url"]
    assert "cannot guarantee" in data_chat["disclaimer"].lower()

    app.dependency_overrides.clear()
