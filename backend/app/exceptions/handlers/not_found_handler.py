from fastapi import Request
from fastapi.responses import JSONResponse
from app.exceptions.types import NotFoundError
from app.core.translator import t

def not_found_handler(request: Request, exc: NotFoundError):
    return JSONResponse(
        status_code=404,
        content={"errors": [exc.message]},
    )