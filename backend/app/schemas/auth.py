from pydantic import BaseModel
from app.core.types.email import LocalizedEmail


class LoginRequest(BaseModel):
    email: LocalizedEmail
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"