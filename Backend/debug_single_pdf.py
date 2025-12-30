import requests
from app.services.pdf_extractor import extract_text_from_pdf
from app.config import settings


def test_single_pdf():
    url = "https://drive.google.com/uc?id=1aUUAURoSOl6HZ1F6J4mbKeGilFGSsuOR&export=download"
    headers = {"User-Agent": settings.USER_AGENT}

    print(f"Downloading {url}...")
    try:
        resp = requests.get(url, headers=headers, timeout=60, stream=True)
        print(f"Status Code: {resp.status_code}")
        print(f"Content Type: {resp.headers.get('Content-Type')}")

        if resp.status_code == 200:
            content = resp.content
            print(f"Downloaded {len(content)} bytes.")

            print("Extracting text...")
            pages_data = extract_text_from_pdf(content)

            if pages_data:
                print(f"Extracted {len(pages_data)} pages.")
                total_chars = sum(len(p["text"]) for p in pages_data)
                print(f"Total extracted characters: {total_chars}")

                # Show first few chars of first page
                first_page = pages_data[0]
                print(f"\nPage {first_page['page']} preview (first 200 chars):")
                print(first_page["text"][:200])
            else:
                print("No text extracted.")
        else:
            print(f"Failed to download: {resp.text[:500]}")
    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    test_single_pdf()
