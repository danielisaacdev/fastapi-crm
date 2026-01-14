from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "FastAPI CRM"
    API_V1_PREFIX: str = "/api/v1"
    JWT_SECRET: str = "change_me_in_env"
    JWT_ALGORITHM: str = "HS256"
    DATABASE_URL: str = "sqlite:///./crm.db"

    class Config:
        env_file = ".env"

settings = Settings()
