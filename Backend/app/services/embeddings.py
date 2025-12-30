import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

# Use the embedding model - specifically text-embedding-004 or similar
EMBEDDING_MODEL = "models/text-embedding-004"


async def get_embedding(text: str) -> list[float]:
    """
    Generates an embedding for the given text using Gemini.
    """
    # Gemini embedding API
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document",
        title="Siddha Text",
    )
    return result["embedding"]


async def get_query_embedding(text: str) -> list[float]:
    """
    Generates an embedding for a query (optimized for retrieval).
    """
    result = genai.embed_content(
        model=EMBEDDING_MODEL, content=text, task_type="retrieval_query"
    )
    return result["embedding"]
