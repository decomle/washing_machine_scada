import uuid, re

from datetime import datetime
from pydantic import BaseModel, ConfigDict, field_validator
from pydantic_core import PydanticCustomError

from app.db.models import User
from app.core.types.email import LocalizedEmail


class UserCreateRequest(BaseModel):
    email: LocalizedEmail
    password: str
    username: str
    first_name: str
    last_name: str
    timezone: str
    phone_number: str | None = None
    self_introduction: str | None = None

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 6:
            raise PydanticCustomError("validations.PASSWORD_TOO_SHORT", "Short password")

        if not re.search(r"\d", value):
            raise PydanticCustomError("validations.PASSWORD_NO_NUMBER", "No number in password")

        if not re.search(r"[A-Za-z]", value):
            raise PydanticCustomError("validations.PASSWORD_NO_LETTER", "No letter in password")

        return value

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    created_at: datetime

class UserUpdateRequest(BaseModel):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    timezone: str | None = None
    phone_number: str | None = None
    self_introduction: str | None = None

class UserDetailResponse(UserResponse):
    username: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    timezone: str
    phone_number: str | None = None
    self_introduction: str | None = None

    @classmethod
    def from_user(cls, user:User):
        profile = user.profile

        return cls(
            id=user.id,
            email=user.email,
            created_at=user.created_at,
            username=profile.username if profile else None,
            first_name=profile.first_name if profile else None,
            last_name=profile.last_name if profile else None,
            timezone=user.timezone,
            phone_number=profile.phone_number if profile else None,
            self_introduction=profile.self_introduction if profile else None,
        )

class UpdateProfileResponse(BaseModel):
    username: str | None
    first_name: str | None
    last_name: str | None
    timezone: str
    phone_number: str | None
    self_introduction: str | None

    @classmethod
    def from_user(cls, user: User):
        profile = user.profile

        return cls(
            username=profile.username if profile else None,
            first_name=profile.first_name if profile else None,
            last_name=profile.last_name if profile else None,
            timezone=user.timezone,
            phone_number=profile.phone_number if profile else None,
            self_introduction=profile.self_introduction if profile else None,
        )
