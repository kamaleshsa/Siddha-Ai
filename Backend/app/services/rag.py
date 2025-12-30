from openai import AsyncOpenAI
from app.config import settings
from app.services.embeddings import get_query_embedding
from app.db.vector_store import query_documents
import logging
import re
import time

import sys

# Ensure logs are printed to stdout
logging.basicConfig(level=logging.INFO, stream=sys.stdout)
logger = logging.getLogger(__name__)

# Configure OpenRouter client
client = AsyncOpenAI(
    api_key=settings.OPENROUTER_API_KEY,
    base_url="https://openrouter.ai/api/v1",
)
MODEL_NAME = "google/gemini-2.0-flash-exp:free"


async def load_system_prompt() -> str:
    try:
        with open("app/prompts/system_prompt.txt", "r") as f:
            return f.read()
    except FileNotFoundError:
        return "You are a helpful assistant."


async def generate_answer(question: str) -> dict:
    """
    Orchestrates the RAG flow with performance logging.
    """
    start_total = time.time()

    # 1. Embed
    start_embed = time.time()
    q_embedding = await get_query_embedding(question)
    embed_time = time.time() - start_embed
    logger.info(f"Embedding took: {embed_time:.4f}s")

    # 2. Retrieve
    start_retrieve = time.time()
    results = query_documents(q_embedding, n_results=5)
    retrieve_time = time.time() - start_retrieve
    logger.info(f"Retrieval took: {retrieve_time:.4f}s")

    sources = []

    context_blocks = []
    if results and results["documents"]:
        for i, doc in enumerate(results["documents"][0]):
            meta = results["metadatas"][0][i]
            book = meta.get("book_title", "Unknown")
            url = meta.get("source_url", "N/A")

            # Format each chunk with its metadata for the LLM
            block = f"SOURCE: {book}\nURL: {url}\nCONTENT: {doc}"
            context_blocks.append(block)

            sources.append(
                {
                    "book": book,
                    "page": str(meta.get("page_number", 0)),
                    "url": url,
                }
            )

    context_str = "\n\n---\n\n".join(context_blocks)
    logger.info(
        f"--- RETRIEVED CONTEXT START ---\n{context_str}\n--- RETRIEVED CONTEXT END ---"
    )

    # 3. Construct Prompt
    system_prompt_template = await load_system_prompt()
    final_prompt = system_prompt_template.format(context=context_str, question=question)

    # 4. Generate
    start_gen = time.time()

    # List of free models to try in order
    models_to_try = [
        "google/gemini-2.0-flash-exp:free",
        "deepseek/deepseek-r1:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "meta-llama/llama-4-scout:free",
        "google/gemma-2-9b-it:free",
        "mistralai/mistral-nemo:free",
        "mistralai/mistral-7b-instruct:free",
        "xiaomi/mimo-v2-flash:free",
        "qwen/qwen-2.5-72b-instruct:free",
        "z-ai/glm-4.5-air:free",
    ]

    answer_text = "I encountered an error generating the answer after trying all available models."

    for model_str in models_to_try:
        try:
            logger.info(f"Trying generation with model: {model_str}")
            # Use OpenRouter via OpenAI SDK
            response = await client.chat.completions.create(
                model=model_str,
                messages=[{"role": "user", "content": final_prompt}],
                temperature=0.2,
                top_p=0.95,
                extra_headers={
                    "HTTP-Referer": settings.ALLOWED_ORIGINS.split(",")[0],
                    "X-Title": "Siddha AI",
                },
            )
            answer_text = response.choices[0].message.content

            # Clean model-specific tags
            answer_text = re.sub(r"^<s>\s*|\[OUT\]\s*", "", answer_text).strip()

            logger.info(f"Success with model: {model_str}")
            break  # Exit loop on success
        except Exception as e:
            logger.warning(f"Failed with {model_str}: {e}")
            continue  # Try next model

    gen_time = time.time() - start_gen
    logger.info(f"Generation took: {gen_time:.4f}s")

    total_time = time.time() - start_total
    logger.info(f"Total RAG time: {total_time:.4f}s")

    return {"answer": answer_text, "sources": sources}
