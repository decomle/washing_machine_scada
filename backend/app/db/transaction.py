from sqlalchemy.ext.asyncio import AsyncSession
from typing import Callable, Awaitable, TypeVar
from app.exceptions.types import AppException
import logging

logger = logging.getLogger(__name__)
T = TypeVar("T")

async def transactional(db: AsyncSession, operation: Callable[[], Awaitable[T]]) -> T:
    try:
        result = await operation()
        await db.commit()
        return result
    except Exception as e:
        await db.rollback()
        logger.error("Error during transaction: %s", e)
        raise e
