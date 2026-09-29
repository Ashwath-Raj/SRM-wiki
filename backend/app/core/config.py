from typing import List, Union
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os


class Settings(BaseSettings):
    PROJECT_NAME: str = "SRM AP Wiki"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    SECRET_KEY: str = "dev-secret-key-change-in-production-srm-wiki-2026"
    ADMIN_TOKEN: str = "srmwiki-admin-secret-token-2026"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS
    CORS_ORIGINS: Union[str, List[str]] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    # Database
    DATABASE_URL: str = "sqlite:///./srm_wiki.db"

    # AI Configuration
    AI_PROVIDER: str = "mock"  # mock, openai, gemini
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    # Google OAuth Configuration
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""

    # Crawler Configuration
    CRAWLER_USER_AGENT: str = "SRMAPWikiBot/1.0 (+https://wiki.srmap.edu.in/bot)"
    CRAWLER_RATE_LIMIT_DELAY: float = 1.0
    CRAWLER_MAX_DEPTH: int = 2

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "allow"


settings = Settings()
