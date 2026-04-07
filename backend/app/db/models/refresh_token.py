# models/refresh_token.py

import uuid
from datetime import datetime, timezone

from sqlalchemy import Index, String, ForeignKey, DateTime, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    __table_args__ = (
        Index("ix_refresh_user_expires", "user_id", "expires_at"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        primary_key=True,
        default=lambda: uuid.uuid4(),
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    token_hash: Mapped[str] = mapped_column(
        String,
        index=True,
        nullable=False,
        unique=True
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        index=True,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    revoked_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    user = relationship("User", back_populates="refresh_tokens")
