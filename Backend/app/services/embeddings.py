from openai import AsyncOpenAI
from app.config import settings

# Configure NVIDIA client for embeddings
client = AsyncOpenAI(
    api_key=settings.NVIDIA_API_KEY or "dummy-key-to-prevent-startup-crash",
    base_url="https://integrate.api.nvidia.com/v1",
)

# Use NVIDIA's embedding model
EMBEDDING_MODEL = "nvidia/nv-embedqa-e5-v5"

async def get_embedding(text: str) -> list[float]:
    """
    Generates an embedding for the given text using NVIDIA's API.
    """
    response = await client.embeddings.create(
        input=[text],
        model=EMBEDDING_MODEL,
        encoding_format="float",
        extra_body={"input_type": "passage"},
    )
    return response.data[0].embedding

async def get_query_embedding(text: str) -> list[float]:
    """
    Generates an embedding for a query (optimized for retrieval) using NVIDIA's API.
    """
    response = await client.embeddings.create(
        input=[text],
        model=EMBEDDING_MODEL,
        encoding_format="float",
        extra_body={"input_type": "query"},
    )
    return response.data[0].embedding
