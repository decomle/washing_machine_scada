from datetime import datetime, timezone
from sqlalchemy import select, delete, func, exists
from sqlalchemy.orm import joinedload

from app.services import BaseService
from app.services.user_service import UserService
from app.core.security import hash_password, verify_password
from app.db.models import User, UserProfile, RefreshToken
from app.services.refresh_token_service import RefreshTokenService
from app.core.security import create_access_token
from app.exceptions.types import InvalidCredentialsError
from app.utils.timezone import TimeZoneUtils
from app.schemas.user import UserCreateRequest

class AuthService(BaseService):
    def __init__(self, db):
        super().__init__(db)
        self.user_service = UserService(db)

    async def authenticate_user(self, email: str, password: str) -> User:
        result = await self.db.execute(select(User).filter(User.email == email))
        user = result.scalar_one_or_none()

        if not user or not verify_password(password, user.password_hash):
            raise InvalidCredentialsError("Invalid email or password")

        return user

    async def get_user_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).filter(User.email == email))
        return result.scalar_one_or_none()

    async def is_email_registered(self, email: str) -> bool:
        stmt = select(
            exists().where(
                func.lower(User.email) == email.lower()
            )
        )

        result = await self.db.execute(stmt)
        return result.scalar()

    async def register_user(self, user_data: UserCreateRequest) -> User:
        if await self.is_email_registered(user_data.email):
            raise InvalidCredentialsError("Email is already registered")
        
        if await self.user_service.is_username_registered(user_data.username):
            raise InvalidCredentialsError("Username is already registered")

        new_user = User(
            email=user_data.email,
            password_hash=hash_password(user_data.password),
            timezone=user_data.timezone,
        )
        self.db.add(new_user)
        await self.db.flush()
        new_profile = UserProfile(
            user_id=new_user.id,
            username=user_data.username,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            self_introduction=user_data.self_introduction,
            phone_number = user_data.phone_number
        )
        self.db.add(new_profile)

        return new_user, new_profile

    async def _issue_token_pair_for_user(self, user: User) -> tuple[str, str]:
        access_token = create_access_token({
            "sub": str(user.id),
            "roles": ["user"],
            "tz": str(TimeZoneUtils.get_timezone(user)),
        })

        token_service = RefreshTokenService(self.db)
        refresh_token = await token_service.create_refresh_token(user.id)

        return access_token, refresh_token

    async def login_user(self, email: str, password: str) -> tuple[str, str]:
        user = await self.authenticate_user(email, password)
        return await self._issue_token_pair_for_user(user)

    async def logout_user(self, raw_refresh_token: str) -> None:
        token_hash = RefreshTokenService.hash_token(raw_refresh_token)
        await self.db.execute(
            delete(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )

    async def refresh_access_token(self, raw_refresh_token: str) -> tuple[str, str]:
        token_hash = RefreshTokenService.hash_token(raw_refresh_token)

        result = await self.db.execute(
            select(RefreshToken)
            .options(joinedload(RefreshToken.user))
            .where(RefreshToken.token_hash == token_hash)
        )
        token = result.scalar_one_or_none()
        if not token:
            raise InvalidCredentialsError("Invalid refresh token")

        if token.expires_at < datetime.now(timezone.utc):
            raise InvalidCredentialsError("Refresh token expired")

        user = token.user
        if not user:
            raise InvalidCredentialsError("Invalid refresh token")

        await self.db.delete(token)

        return await self._issue_token_pair_for_user(user)

    async def cleanup_expired_refresh_tokens(self) -> int:
        now = datetime.now(timezone.utc)
        stmt = delete(RefreshToken).where(RefreshToken.expires_at < now)

        result = await self.db.execute(stmt)

        return result.rowcount or 0
