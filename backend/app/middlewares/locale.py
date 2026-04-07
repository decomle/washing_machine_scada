from fastapi import Request

SUPPORTED_LOCALES = {"en", "vi"}
DEFAULT_LOCALE = "en"


async def locale_middleware(request: Request, call_next):
    lang = request.query_params.get("lang")

    if not lang:
        header = request.headers.get("Accept-Language")
        if header:
            lang = header.split(",")[0].split("-")[0]

    if lang not in SUPPORTED_LOCALES:
        lang = DEFAULT_LOCALE

    request.state.locale = lang

    response = await call_next(request)
    return response