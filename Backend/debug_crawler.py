import asyncio
import logging
import sys
import requests
from bs4 import BeautifulSoup
from app.config import settings

# Configure logging to show everything
logging.basicConfig(level=logging.INFO, stream=sys.stdout)


async def test_html_extraction():
    url = "https://www.tknsiddha.com/medicine/category/siddha-medicine-system/"
    headers = {"User-Agent": settings.USER_AGENT}

    print(f"Fetching {url}...")
    try:
        response = requests.get(url, headers=headers, timeout=15)
        if response.status_code == 200:
            soup = BeautifulSoup(response.content, "html.parser")

            # Extract paragraphs
            paragraphs = soup.find_all("p")
            text_content = "\n\n".join(
                [
                    p.get_text().strip()
                    for p in paragraphs
                    if len(p.get_text().strip()) > 50
                ]
            )

            print(f"Extracted {len(text_content)} characters.")
            print("First 500 characters:")
            print(text_content[:500])
        else:
            print(f"Failed: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    asyncio.run(test_html_extraction())
