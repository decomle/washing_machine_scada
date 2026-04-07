from fastapi import Request
from fastapi.responses import JSONResponse

from app.exceptions.types import DatabaseTechnicalIssueException


def database_technical_issue_handler(request: Request, exc: DatabaseTechnicalIssueException):
    return JSONResponse(
        status_code=500,
        content={"message": str(exc)}
    )
