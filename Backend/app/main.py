from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.api import crawl, ask
from app.db.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB on startup
    await init_db()
    yield


app = FastAPI(
    title="Siddha AI Backend",
    description="Backend for Siddha AI Assistant using Gemini and RAG",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Configuration
origins = settings.ALLOWED_ORIGINS.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(crawl.router, prefix="/api", tags=["Crawling"])
app.include_router(ask.router, prefix="/api", tags=["Q&A"])


@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to Siddha AI Backend. Visit /docs for API documentation."}


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
