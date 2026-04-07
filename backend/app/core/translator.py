import i18n

from fastapi import Request

DEFAULT_LOCALE = "en"

def t(key: str, request: Request | None = None, locale: str | None = None, **kwargs):
    resolved_locale = ""
    if request and locale:
        raise ValueError("Provide either request or locale, not both.")
    if locale:
        resolved_locale = locale
    elif request:
        resolved_locale = getattr(request.state, "locale", DEFAULT_LOCALE)
    else:
        resolved_locale = DEFAULT_LOCALE

    return i18n.t(key, locale=resolved_locale, **kwargs)