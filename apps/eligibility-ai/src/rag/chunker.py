"""
Intelligent text chunking utility for RAG knowledge ingestion.
Splits long documents into contextual passages with configurable overlap.
"""

from typing import List
import re


def chunk_text(
    text: str,
    chunk_size: int = 500,
    chunk_overlap: int = 50
) -> List[str]:
    """
    Splits text into chunks of roughly `chunk_size` characters,
    with `chunk_overlap` character boundary overlap, preserving sentence/paragraph boundaries.
    """
    clean_text = text.strip()
    if not clean_text:
        return []

    if len(clean_text) <= chunk_size:
        return [clean_text]

    # Split by double newline (paragraphs) or sentence terminators
    paragraphs = re.split(r'\n\s*\n', clean_text)
    raw_blocks: List[str] = []

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        if len(para) <= chunk_size:
            raw_blocks.append(para)
        else:
            # Further split long paragraphs by sentences
            sentences = re.split(r'(?<=[.!?])\s+', para)
            curr = ""
            for s in sentences:
                s = s.strip()
                if not s:
                    continue
                if len(curr) + len(s) + 1 <= chunk_size:
                    curr = f"{curr} {s}".strip()
                else:
                    if curr:
                        raw_blocks.append(curr)
                    # If single sentence exceeds chunk_size, split by words
                    if len(s) > chunk_size:
                        words = s.split()
                        w_curr = ""
                        for w in words:
                            if len(w_curr) + len(w) + 1 <= chunk_size:
                                w_curr = f"{w_curr} {w}".strip()
                            else:
                                if w_curr:
                                    raw_blocks.append(w_curr)
                                w_curr = w
                        if w_curr:
                            raw_blocks.append(w_curr)
                        curr = ""
                    else:
                        curr = s
            if curr:
                raw_blocks.append(curr)

    # Now group raw blocks into target chunk_size with overlap
    chunks: List[str] = []
    current_chunk = ""

    for block in raw_blocks:
        if not current_chunk:
            current_chunk = block
        elif len(current_chunk) + len(block) + 1 <= chunk_size:
            current_chunk = f"{current_chunk}\n\n{block}"
        else:
            chunks.append(current_chunk.strip())
            # Handle overlap from the tail of current_chunk
            if chunk_overlap > 0 and len(current_chunk) > chunk_overlap:
                overlap_text = current_chunk[-chunk_overlap:].strip()
                current_chunk = f"{overlap_text}\n\n{block}"
            else:
                current_chunk = block

    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    return chunks
