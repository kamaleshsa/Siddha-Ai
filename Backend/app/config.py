import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    GEMINI_API_KEY: str
    NVIDIA_API_KEY: str | None = None
    CHROMA_DB_PATH: str = "app/db/chroma"
    METADATA_DB_URL: str = "sqlite+aiosqlite:///app/db/metadata.db"
    ENVIRONMENT: str = "development"
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:8080"

    # Crawler Settings
    ALLOWED_DOMAINS: list[str] = ["tknsiddha.com", "siddha.jfn.ac.lk"]
    USER_AGENT: str = "SiddhaAI/1.0 (+http://localhost:8000)"

    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()
