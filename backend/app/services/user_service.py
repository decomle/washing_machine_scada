import uuid

from sqlalchemy import select, exists
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError
from pydantic_core import PydanticCustomError

from app.services import BaseService
from app.db.models import User, UserProfile
from app.schemas.user import UserUpdateRequest
from app.exceptions.types import InvalidUserNameException, DatabaseTechnicalIssueException


class UserService(BaseService):
    async def get_user(self, user_id: uuid.UUID, with_profile : bool = False) -> User:
        stmp = select(User).where(User.id == user_id)
        if with_profile:
            stmp = stmp.options(selectinload(User.profile))
        result = await self.db.execute(stmp)
        return result.scalar_one_or_none()
    
    async def is_username_registered(self, username: str) -> bool:
        stmt = select(
            exists().where(UserProfile.username == username)
        )
        result = await self.db.execute(stmt)
        return result.scalar()

    async def upsert_profile(
        self,
        user_id: uuid.UUID,
        payload: UserUpdateRequest,
    ) -> User:
        user = await self.get_user(user_id=user_id, with_profile=True)
        if not user:
            raise PydanticCustomError(
                "validations.USER_NOT_FOUND",
                "User not found"
            )

        profile: UserProfile | None = user.profile
        update_data = payload.model_dump(exclude_unset=True)
        timezone = update_data.pop("timezone", None)

        if timezone:
            user.timezone = timezone

        if not profile:
            if "username" not in update_data:
                raise PydanticCustomError( "validations.USERNAME_REQUIRED",
                    "Username is required when creating profile"
                )

            if await self.is_username_registered(update_data["username"]):
                raise InvalidUserNameException("Username already exists")

            profile = UserProfile(
                user_id=user_id,
                **update_data,
            )

            self.db.add(profile)
            try:
                await self.db.flush()
            except IntegrityError as error:
                raise DatabaseTechnicalIssueException("A technical issue occurred. Please try again later") from error

            return user

        if "username" in update_data:
            new_username = update_data["username"]

            if new_username != profile.username:
                if await self.is_username_registered(new_username):
                    raise InvalidUserNameException("Username already exists")

        for field, value in update_data.items():
            setattr(profile, field, value)

        try:
            await self.db.flush()
        except IntegrityError as error:
            raise DatabaseTechnicalIssueException("A technical issue occurred. Please try again later") from error

        return user
