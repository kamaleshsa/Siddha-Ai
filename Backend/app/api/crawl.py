from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from app.services.crawler import crawler_service

router = APIRouter()


class CrawlResponse(BaseModel):
    message: str
    status: str


@router.post("/crawl", response_model=CrawlResponse)
async def trigger_crawl(background_tasks: BackgroundTasks):
    """
    Triggers the background crawling process.
    """
    background_tasks.add_task(crawler_service.crawl_seeds)
    return {
        "message": "Crawl started in background for permitted sites.",
        "status": "pending",
    }
