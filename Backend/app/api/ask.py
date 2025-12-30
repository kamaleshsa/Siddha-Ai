from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.rag import generate_answer

router = APIRouter()


class AskRequest(BaseModel):
    question: str


class Source(BaseModel):
    book: str | None
    page: str | None
    url: str | None


class AskResponse(BaseModel):
    answer: str
    sources: list[Source]


@router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """
    Accepts a question, retrieves context, and returns a strict AI answer.
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    result = await generate_answer(request.question)

    return {"answer": result["answer"], "sources": result["sources"]}
