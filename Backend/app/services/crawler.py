import requests
from bs4 import BeautifulSoup
import logging
import uuid

from app.config import settings
from app.services.pdf_extractor import extract_text_from_pdf
from app.services.chunker import chunk_text
from app.services.embeddings import get_embedding
from app.db.vector_store import add_documents
from app.db.database import SessionLocal
from app.db.models import DocumentMetadata

logger = logging.getLogger(__name__)


class CrawlerService:
    def __init__(self):
        self.headers = {"User-Agent": settings.USER_AGENT}
        self.visited_urls = set()
        self.max_depth = 2

    async def crawl_seeds(self):
        # Hardcoded seed URLs based on the prompt's allowed sites
        seeds = [
            "https://www.tknsiddha.com/medicine/siddha-books-free/",
            "https://www.siddha.jfn.ac.lk/e-books/",
        ]
        results = []
        self.visited_urls.clear()
        for seed in seeds:
            res = await self.crawl_site(seed, depth=0)
            results.append(res)
        return results

    async def crawl_site(self, url: str, depth: int = 0):
        if depth > self.max_depth:
            return f"Max depth reached for {url}"

        if url in self.visited_urls:
            return f"Already visited {url}"

        if not any(domain in url for domain in settings.ALLOWED_DOMAINS):
            logger.warning(f"Skipping disallowed domain: {url}")
            return f"Skipped {url}"

        self.visited_urls.add(url)
        logger.info(f"Crawling {url} (depth {depth})...")

        try:
            response = requests.get(url, headers=self.headers, timeout=15)
            if response.status_code != 200:
                logger.error(f"Failed to fetch {url}: {response.status_code}")
                return f"Failed {url}"

            soup = BeautifulSoup(response.content, "html.parser")

            # Process current page HTML
            await self.process_html_content(url, soup)

            links = soup.find_all("a", href=True)
            pdf_count = 0

            from urllib.parse import urljoin, urlparse

            for link in links:
                href = link["href"]
                # Handle relative URLs
                if not href.lower().startswith("http"):
                    href = urljoin(url, href)

                # Normalize URL
                parsed_href = urlparse(href)
                clean_href = (
                    f"{parsed_href.scheme}://{parsed_href.netloc}{parsed_href.path}"
                )
                if parsed_href.query:
                    clean_href += f"?{parsed_href.query}"

                # 1. Check for PDFs
                is_pdf = False
                if clean_href.lower().endswith(".pdf"):
                    is_pdf = True
                elif "drive.google.com" in clean_href and (
                    "/uc?" in clean_href or "/file/d/" in clean_href
                ):
                    is_pdf = True

                if is_pdf:
                    await self.process_pdf(clean_href, source_page=url)
                    pdf_count += 1

                # 2. Recursive crawl same domain
                elif depth < self.max_depth:
                    if any(domain in clean_href for domain in settings.ALLOWED_DOMAINS):
                        # Avoid crawling the same page or jumping to external domains
                        base_url_domain = urlparse(url).netloc
                        link_domain = urlparse(clean_href).netloc
                        if base_url_domain == link_domain:
                            await self.crawl_site(clean_href, depth=depth + 1)

            return f"Processed {pdf_count} PDFs from {url} at depth {depth}"

        except Exception as e:
            logger.error(f"Error crawling {url}: {e}")
            return f"Error {url}: {str(e)}"

    async def process_pdf(self, pdf_url: str, source_page: str):
        # Prevent refetching the same PDF
        if pdf_url in self.visited_urls and not pdf_url.endswith(
            ".pdf"
        ):  # set visited for pages only, but let's avoid re-processing same PDF URL
            return

        # Special handling for Google Drive links to ensure direct download
        download_url = pdf_url
        if "drive.google.com/file/d/" in pdf_url:
            file_id = pdf_url.split("/file/d/")[1].split("/")[0]
            download_url = f"https://drive.google.com/uc?id={file_id}&export=download"
        elif "drive.google.com/uc?" in pdf_url and "export=download" not in pdf_url:
            download_url += "&export=download"

        logger.info(f"Processing PDF: {download_url}")
        try:
            # 1. Download
            resp = requests.get(
                download_url, headers=self.headers, timeout=60, stream=True
            )
            if resp.status_code != 200:
                logger.error(
                    f"Failed to download PDF {download_url}: {resp.status_code}"
                )
                return

            # Check content type if possible
            content_type = resp.headers.get("Content-Type", "")
            if "text/html" in content_type and "drive.google.com" in download_url:
                # This might be a virus scan warning or preview page
                logger.warning(
                    f"Likely hit Google Drive warning page for {download_url}"
                )
                # We could try to extract the real download link from this page, but usually uc?id=...&export=download bypasses it for small/medium files.
                # For now, just skip if it's not a PDF.
                # return

            # Read content
            content = resp.content

            # 2. Extract Text
            # Run blocking PDF extraction in a separate thread
            import asyncio

            loop = asyncio.get_running_loop()
            pages_data = await loop.run_in_executor(
                None, extract_text_from_pdf, content
            )
            if not pages_data:
                logger.warning(f"No text extracted from {pdf_url}")
                return

            # Prepare for Ingestion
            ids = []
            docs = []
            embeddings = []
            metadatas = []

            # Improved book title extraction
            if "id=" in pdf_url:
                book_title = f"GoogleDrive_{pdf_url.split('id=')[1].split('&')[0]}"
            else:
                book_title = (
                    pdf_url.split("/")[-1].replace(".pdf", "").replace("%20", " ")
                )

            async with SessionLocal() as session:
                for page_item in pages_data:
                    from app.services.chunker import chunk_text

                    page_num = page_item["page"]
                    page_text = page_item["text"]

                    # 3. Chunk each page
                    chunks = chunk_text(page_text)

                    for chunk in chunks:
                        chunk_id = str(uuid.uuid4())
                        emb = await get_embedding(chunk)

                        ids.append(chunk_id)
                        docs.append(chunk)
                        embeddings.append(emb)

                        meta = {
                            "source_url": pdf_url,
                            "book_title": book_title,
                            "page_number": page_num,
                            "chunk_id": chunk_id,
                        }
                        metadatas.append(meta)

                        # Store in SQLite
                        db_entry = DocumentMetadata(
                            source_url=pdf_url,
                            book_title=book_title,
                            page_number=page_num,
                            chunk_id=chunk_id,
                            content_preview=chunk[:50],
                        )
                        session.add(db_entry)

                await session.commit()

            # 5. Add to Vector DB
            if ids:
                add_documents(ids, docs, embeddings, metadatas)
                logger.info(f"Ingested {len(ids)} chunks from {book_title}")

            self.visited_urls.add(pdf_url)

        except Exception as e:
            logger.error(f"Failed to process PDF {pdf_url}: {e}")

    async def process_html_content(self, url: str, soup: BeautifulSoup):
        # Extract meaningful text from p tags
        logger.info(f"Processing HTML content: {url}")
        try:
            paragraphs = soup.find_all("p")
            # Filter short/empty paragraphs
            valid_paras = [
                p.get_text().strip()
                for p in paragraphs
                if len(p.get_text().strip()) > 50
            ]

            if not valid_paras:
                return

            full_text = "\n\n".join(valid_paras)

            # Chunk
            chunks = chunk_text(full_text)

            ids = []
            docs = []
            embeddings = []
            metadatas = []

            page_title = soup.title.string if soup.title else url.split("/")[-1]

            async with SessionLocal() as session:
                for chunk in chunks:
                    chunk_id = str(uuid.uuid4())
                    emb = await get_embedding(chunk)

                    ids.append(chunk_id)
                    docs.append(chunk)
                    embeddings.append(emb)

                    meta = {
                        "source_url": url,
                        "book_title": page_title,  # using page title as 'book'
                        "page_number": 0,
                        "chunk_id": chunk_id,
                    }
                    metadatas.append(meta)

                    # Store in SQLite
                    db_entry = DocumentMetadata(
                        source_url=url,
                        book_title=page_title,
                        chunk_id=chunk_id,
                        content_preview=chunk[:50],
                    )
                    session.add(db_entry)

                await session.commit()

            if ids:
                add_documents(ids, docs, embeddings, metadatas)
                logger.info(f"Ingested {len(ids)} text chunks from HTML: {url}")

        except Exception as e:
            logger.error(f"Failed to process HTML {url}: {e}")


crawler_service = CrawlerService()
