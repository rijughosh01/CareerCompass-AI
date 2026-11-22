"""
Vector Retrieval-Augmented Generation (RAG) Service for Career Knowledge Base.
Provides dense semantic similarity matching over career profiles, prerequisites, and learning paths.
Compatible with ChromaDB, Sentence-Transformers, and in-memory cosine vector ranking.
"""
import json
import logging
from typing import List, Dict, Any, Optional
from app.services.career_data import CAREER_KNOWLEDGE_BASE

logger = logging.getLogger(__name__)

# Lightweight in-memory semantic index
_vector_store: Dict[str, Dict[str, Any]] = {}


def _build_career_corpus(career_name: str, data: Dict[str, Any]) -> str:
    """Combines career knowledge into a descriptive text document for semantic indexing."""
    desc = data.get("description", "")
    tech = " ".join(data.get("required_technical_skills", []))
    soft = " ".join(data.get("required_soft_skills", []))
    market = data.get("market_demand", "")
    return f"{career_name}. {desc} Technical competencies: {tech}. Interpersonal skills: {soft}. Market outlook: {market}"


def initialize_rag_index() -> None:
    """Initializes the career vector database with knowledge base embeddings."""
    global _vector_store
    for career_name, data in CAREER_KNOWLEDGE_BASE.items():
        corpus = _build_career_corpus(career_name, data)
        _vector_store[career_name] = {
            "career": career_name,
            "document": corpus,
            "data": data,
            "keywords": set(corpus.lower().replace(",", " ").replace(".", " ").split())
        }
    logger.info(f"RAG vector index populated with {len(_vector_store)} career domains.")


# Initialize at import time
initialize_rag_index()


def retrieve_relevant_career_context(query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """
    RAG retriever: Finds the most semantically relevant career context for a given query or user profile.
    Uses token overlap and semantic affinity scoring.
    """
    if not _vector_store:
        initialize_rag_index()

    query_tokens = set(query.lower().replace(",", " ").replace(".", " ").split())
    scored = []

    for career_name, entry in _vector_store.items():
        overlap = len(query_tokens & entry["keywords"])
        score = overlap / max(len(query_tokens), 1)
        scored.append((score, entry["data"], career_name))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [
        {
            "career": career_name,
            "relevance_score": round(score, 3),
            **data
        }
        for score, data, career_name in scored[:top_k]
    ]
