import asyncio
import sys
import os

# Add parent directory to path to import app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.services.rag import generate_answer
from app.config import settings


async def test_fallback():
    question = "What are the benefits of Siddha medicine?"
    print(f"Testing RAG answer generation for question: {question}")

    try:
        result = await generate_answer(question)
        print("\n--- RESULT ---")
        print(f"Answer: {result['answer'][:500]}...")
        print(f"Sources: {len(result['sources'])}")
    except Exception as e:
        print(f"Error during test: {e}")


if __name__ == "__main__":
    asyncio.run(test_fallback())
