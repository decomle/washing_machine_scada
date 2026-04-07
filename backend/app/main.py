import logging

from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from contextlib import asynccontextmanager

from app.exceptions.handlers import (
    validation_exception_handler,
    invalid_credentials_handler,
    invalid_username_handler,
    database_technical_issue_handler,
    not_found_handler,
)
from app.db.database import async_engine, Base
from app.i18n import configure_i18n
from app.middlewares.locale import locale_middleware
from app.routers import auth_router, user_router
from app.exceptions.types import (
    InvalidCredentialsError,
    InvalidUserNameException,
    DatabaseTechnicalIssueException,
    NotFoundError,
)
from app.core.logging import setup_logging

setup_logging()
logger = logging.getLogger(__name__)

logger.info("Add event lifespan for startup and shutdown tasks...")


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

app = FastAPI(lifespan=lifespan)

logger.info("Configuring i18n...")
configure_i18n()

logger.info("Configuring middlewares...")
# Middlewares
app.middleware("http")(locale_middleware)

logger.info("Configuring routers and exception handlers...")
# Routers
app.include_router(auth_router, prefix="/api")
app.include_router(user_router, prefix="/api")

# Exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(InvalidCredentialsError, invalid_credentials_handler)
app.add_exception_handler(InvalidUserNameException, invalid_username_handler)
app.add_exception_handler(DatabaseTechnicalIssueException, database_technical_issue_handler)
app.add_exception_handler(NotFoundError, not_found_handler)

@app.get("/")
def root():
    return {"message": "Basic backend starter running"}
