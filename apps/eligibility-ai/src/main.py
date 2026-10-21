"""
Main FastAPI Application Entrypoint for Project Antigravity.
Module 3: Deterministic Eligibility Engine
Module 4: AI RAG & Knowledge Base
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from api.v1 import api_v1_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    Project Antigravity (The Talent & Innovation Academy) - AI & Rules Microservice.
    - **Module 3:** Deterministic Boolean Eligibility Engine for JHS opportunity discovery.
    - **Module 4:** RAG-powered knowledge base & academic guidance.
    """,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware (permitting Next.js frontend & Node Core API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Health"])
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify service liveness."""
    return {
        "status": "healthy",
        "service": "eligibility-ai",
        "version": settings.VERSION
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.FASTAPI_HOST,
        port=settings.FASTAPI_PORT,
        reload=True
    )
