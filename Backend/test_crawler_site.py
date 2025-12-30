import asyncio
import logging
import sys
from app.services.crawler import crawler_service
from app.db.database import init_db

# Configure logging
logging.basicConfig(level=logging.INFO, stream=sys.stdout)


async def test_crawler():
    # Initialize DB
    await init_db()

    url = "https://www.tknsiddha.com/medicine/siddha-books-free/"
    print(f"Testing crawler on {url}...")

    result = await crawler_service.crawl_site(url)
    print(f"Result: {result}")


if __name__ == "__main__":
    asyncio.run(test_crawler())
