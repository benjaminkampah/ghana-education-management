"""
Configuration settings for Project Antigravity AI & Eligibility Engine
"""

import os
from pathlib import Path

# Load .env file if available
try:
    from dotenv import load_dotenv
    root_dir = Path(__file__).resolve().parent.parent.parent.parent
    env_path = root_dir / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
    else:
        load_dotenv()
except ImportError:
    pass

class Settings:
    PROJECT_NAME: str = "Project Antigravity - Eligibility & AI Engine"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database URL
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@localhost:5432/antigravity_db?schema=public"
    )
    
    # Server Host / Port
    FASTAPI_HOST: str = os.getenv("FASTAPI_HOST", "0.0.0.0")
    FASTAPI_PORT: int = int(os.getenv("FASTAPI_PORT", "8000"))
    
    # OpenAI Settings for Module 4 RAG
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_EMBEDDING_MODEL: str = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    OPENAI_EMBEDDING_DIMENSION: int = int(os.getenv("OPENAI_EMBEDDING_DIMENSION", "1536"))
    OPENAI_COMPLETION_MODEL: str = os.getenv("OPENAI_COMPLETION_MODEL", "gpt-4o-mini")

settings = Settings()
