from functools import lru_cache

from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _normalize_database_url(url: str) -> str:
    normalized = url.strip()
    if normalized.startswith("postgres://"):
        normalized = normalized.replace("postgres://", "postgresql+psycopg://", 1)
    if normalized.startswith("postgresql://") and "+psycopg" not in normalized:
        normalized = normalized.replace("postgresql://", "postgresql+psycopg://", 1)
    return normalized


class Settings(BaseSettings):
    app_name: str = "Terra da Esperanca API"
    api_v1_prefix: str = "/api/v1"
    secret_key: str = "terra-da-esperanca-dev-secret-key"
    access_token_expire_minutes: int = 720
    backend_cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    postgres_host: str = "localhost"
    postgres_port: int = 5432
    postgres_db: str = "terra_esperanca"
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    database_url: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @computed_field  # type: ignore[misc]
    @property
    def sqlalchemy_database_uri(self) -> str:
        if self.database_url:
            return _normalize_database_url(self.database_url)
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [item.strip() for item in self.backend_cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
