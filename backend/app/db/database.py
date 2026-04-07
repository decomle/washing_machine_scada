from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base

from app.core.config import DATABASE_URL

async_engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

async_session_maker = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

Base = declarative_base()

async def get_db():
    """FastAPI dependency that yields an AsyncSession."""
    async with async_session_maker() as db:
        yield db