from app.exceptions.types import InvalidCredentialsError
from fastapi import Request
from fastapi.responses import JSONResponse

def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(
        status_code=401,
        content={"message": str(exc)}
    )