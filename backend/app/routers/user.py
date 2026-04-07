from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.db.transaction import transactional
from app.dependencies.auth import verify_access_token
from app.schemas.user import UserUpdateRequest, UpdateProfileResponse, UserDetailResponse
from app.services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserDetailResponse)
async def get_me(
    db: AsyncSession = Depends(get_db),
    jwt_payload: dict = Depends(verify_access_token),
) -> UserDetailResponse:
    user_id = jwt_payload["sub"]

    user_service = UserService(db)
    user = await transactional(db, 
        lambda: user_service.get_user(user_id=user_id, with_profile=True)
    )

    return UserDetailResponse.from_user(user)



@router.patch("/me", response_model=UpdateProfileResponse)
async def update_me(
    payload: UserUpdateRequest,
    db: AsyncSession = Depends(get_db),
    jwt_payload: dict = Depends(verify_access_token),
) -> UpdateProfileResponse:
    user_service = UserService(db)

    user_id = jwt_payload["sub"]
    user = await transactional(db, 
        lambda: user_service.upsert_profile(user_id=user_id, payload=payload)
    )

    return UpdateProfileResponse.from_user(user)
