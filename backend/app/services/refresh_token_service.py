import secrets
import hashlib
from datetime import datetime, timedelta, timezone

from app.services import BaseService
from app.core.config import REFRESH_TOKEN_EXPIRE_DAYS
from app.db.models import RefreshToken

class RefreshTokenService(BaseService):

    @staticmethod
    def generate_refresh_token() -> str:
        """Generate a random secure token."""
        return secrets.token_urlsafe(64)

    @staticmethod
    def hash_token(token: str) -> str:
        """Hash a token using SHA256."""
        return hashlib.sha256(token.encode()).hexdigest()

    async def create_refresh_token(self, user_id: str) -> str:
        raw_token = self.generate_refresh_token()
        token_hash = self.hash_token(raw_token)

        expires_at = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

        session = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=expires_at,
        )

        self.db.add(session)

        return raw_token
