from fastapi import APIRouter, Depends, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.core.config import (
    REFRESH_COOKIE_NAME,
    COOKIE_SECURE,
    COOKIE_SAMESITE,
)
from app.db.database import get_db
from app.db.models import User
from app.schemas.user import UserCreateRequest, UserResponse
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import AuthService
from app.dependencies.auth import get_current_user, verify_access_token
from app.db.transaction import transactional

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    access_token, refresh_token = await transactional(
        db,
        lambda: auth_service.login_user(data.email, data.password),
    )

    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * 7,
    )


    return { "access_token": access_token }

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreateRequest, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user, _ = await transactional(db, lambda: auth_service.register_user(user_data))
    return user

@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Missing refresh token")

    auth_service = AuthService(db)
    access_token, new_refresh_token = await transactional(db, lambda: auth_service.refresh_access_token(refresh_token))

    # Set new refresh token cookie
    response.set_cookie(
        key=REFRESH_COOKIE_NAME,
        value=new_refresh_token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite=COOKIE_SAMESITE,
        max_age=60 * 60 * 24 * 7,  # 7 days
    )

    return {"access_token": access_token}

@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    refresh_token = request.cookies.get(REFRESH_COOKIE_NAME)

    if refresh_token:
        auth_service = AuthService(db)
        await transactional(db, lambda: auth_service.logout_user(refresh_token))

    # Clear the cookie
    response.delete_cookie(REFRESH_COOKIE_NAME)
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/protected")
def get_protected(_: dict = Depends(verify_access_token)):
    return {"message": "This is a protected endpoint"}
