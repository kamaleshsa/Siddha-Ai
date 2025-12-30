import asyncio
import logging
import sys
from app.services.rag import generate_answer

# Configure logging to show everything
logging.basicConfig(level=logging.INFO, stream=sys.stdout)


async def test_ask():
    question = "Siddha view on digestion"
    print(f"Asking: {question}")

    result = await generate_answer(question)

    print("\n--- ANSWER ---")
    print(result["answer"])
    print("\n--- SOURCES ---")
    for s in result["sources"]:
        print(s)


if __name__ == "__main__":
    asyncio.run(test_ask())
