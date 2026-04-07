from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.translator import t

def validation_exception_handler( request: Request, exc: RequestValidationError):
    errors = []

    for err in exc.errors():
        message_key = err["type"]
        translated = t(message_key, request=request)

        errors.append({
            "field": err["loc"][-1],
            "message": translated
        })

    return JSONResponse(
        status_code=422,
        content={"errors": errors},
    )