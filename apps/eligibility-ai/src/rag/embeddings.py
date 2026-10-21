"""
Vector embedding generation utility for Project Antigravity RAG.
Interacts with OpenAI text-embedding-3-small (1536 dimensions)
with deterministic fallback for test and offline environments.
"""

from typing import List
import hashlib
import math
from core.config import settings

# Initialize OpenAI client if api_key is available
_openai_client = None


def get_openai_client():
    global _openai_client
    if _openai_client is None:
        try:
            from openai import OpenAI
            api_key = settings.OPENAI_API_KEY.strip()
            if api_key and not api_key.startswith("sk-placeholder"):
                _openai_client = OpenAI(api_key=api_key)
        except Exception:
            _openai_client = None
    return _openai_client


def _generate_deterministic_vector(text: str, dim: int = 1536) -> List[float]:
    """
    Generates a deterministic 1536-dimension normalized unit vector from input text.
    Ensures tests and development environments without a live OpenAI API key can run smoothly.
    """
    clean_text = text.strip().lower()
    raw_hash = hashlib.sha512(clean_text.encode("utf-8")).digest()
    
    # Generate seed numbers from hash
    vector: List[float] = []
    seed_idx = 0
    for i in range(dim):
        byte_val = raw_hash[(i + seed_idx) % len(raw_hash)]
        # Map to value between -1.0 and 1.0
        val = (byte_val / 127.5) - 1.0 + (math.sin(i * 0.1) * 0.1)
        vector.append(val)
        if i % len(raw_hash) == 0:
            seed_idx += 3

    # Normalize vector to unit length
    norm = math.sqrt(sum(x * x for x in vector)) or 1.0
    return [round(x / norm, 6) for x in vector]


def get_embedding(text: str) -> List[float]:
    """
    Generate a 1536-dimensional vector embedding for a single text.
    """
    client = get_openai_client()
    if client:
        try:
            response = client.embeddings.create(
                input=text,
                model=settings.OPENAI_EMBEDDING_MODEL
            )
            return response.data[0].embedding
        except Exception as e:
            # Fallback to deterministic vector if OpenAI API call fails or quota exceeded
            return _generate_deterministic_vector(text, settings.OPENAI_EMBEDDING_DIMENSION)
    
    return _generate_deterministic_vector(text, settings.OPENAI_EMBEDDING_DIMENSION)


def get_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for a batch of texts.
    """
    if not texts:
        return []
    
    client = get_openai_client()
    if client:
        try:
            response = client.embeddings.create(
                input=texts,
                model=settings.OPENAI_EMBEDDING_MODEL
            )
            return [item.embedding for item in response.data]
        except Exception:
            return [_generate_deterministic_vector(t, settings.OPENAI_EMBEDDING_DIMENSION) for t in texts]

    return [_generate_deterministic_vector(t, settings.OPENAI_EMBEDDING_DIMENSION) for t in texts]
