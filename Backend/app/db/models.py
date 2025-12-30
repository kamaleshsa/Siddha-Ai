from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db.database import Base


class DocumentMetadata(Base):
    __tablename__ = "document_metadata"

    id = Column(Integer, primary_key=True, index=True)
    source_url = Column(String, index=True)
    book_title = Column(String, index=True)
    page_number = Column(Integer, nullable=True)  # None for web pages
    file_path = Column(String, nullable=True)  # Path to PDF if downloaded
    chunk_id = Column(String, index=True)  # ID in ChromaDB
    content_preview = Column(Text, nullable=True)
    crawled_at = Column(DateTime, default=func.now())
