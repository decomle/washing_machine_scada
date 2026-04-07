from fastapi import Request
from fastapi.responses import JSONResponse

from app.exceptions.types import InvalidUserNameException


def invalid_username_handler(request: Request, exc: InvalidUserNameException):
    return JSONResponse(
        status_code=400,
        content={"message": str(exc)}
    )
