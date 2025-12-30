import pdfplumber
import io
import re
import logging

logger = logging.getLogger(__name__)


def extract_text_from_pdf(pdf_bytes: bytes) -> list[dict]:
    """
    Extracts text from a PDF file provided as bytes.
    Returns a list of dictionaries with page number and cleaned text.
    """
    pages_data = []

    try:
        with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
            logger.info(f"Extracting text from {len(pdf.pages)} pages...")
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    lines = text.split("\n")
                    cleaned_lines = []
                    for line in lines:
                        # Less aggressive filtering
                        if "novaPDF" in line or len(line.strip()) < 2:
                            continue
                        cleaned_lines.append(line)

                    page_text = "\n".join(cleaned_lines)
                    # Clean whitespace but keep some structure
                    page_text = re.sub(r"[ \t]+", " ", page_text)
                    page_text = re.sub(r"\n\s*\n", "\n\n", page_text).strip()

                    if page_text:
                        pages_data.append({"page": i + 1, "text": page_text})

                    if i % 10 == 0:
                        logger.info(f"Processed {i + 1}/{len(pdf.pages)} pages...")

        total_length = sum(len(p["text"]) for p in pages_data)
        logger.info(
            f"Total extracted text length: {total_length} from {len(pages_data)} pages"
        )
        return pages_data
    except Exception as e:
        logger.error(f"Error during PDF extraction: {e}")
        return []
