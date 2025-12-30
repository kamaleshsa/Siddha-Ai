# Siddha AI Backend

A production-ready FastAPI backend for the Siddha AI Assistant. This service crawls specific Siddha book websites, stores text embeddings in ChromaDB, and uses Google Gemini 2.5 Flash for RAG-based answers.

## Prerequisites

- Python 3.10+
- Google Gemini API Key

## Setup

1.  **Clone the repository** (if not already done).

2.  **Navigate to the backend directory**:

    ```bash
    cd Backend
    ```

3.  **Create a virtual environment**:

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

4.  **Install dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

5.  **Environment Configuration**:
    Copy `.env.example` to `.env` and update your API Key.
    ```bash
    cp .env.example .env
    # Edit .env and set GEMINI_API_KEY
    ```

## Running the Application

Start the server using Uvicorn:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.
Swagger Documentation: `http://localhost:8000/docs`.

## Usage

### 1. Crawl Data

Trigger the crawling process to populate the database. This runs in the background.

```bash
curl -X POST http://localhost:8000/api/crawl
```

### 2. Ask a Question

```bash
curl -X POST http://localhost:8000/api/ask \
     -H "Content-Type: application/json" \
     -d '{"question": "What is Nilavembu?"}'
```

## Disclaimer

This AI provides information strictly from crawled Siddha texts. It is not a substitute for professional medical advice.
