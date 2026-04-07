import uuid

from sqlalchemy import String, Text, DateTime, ForeignKey, Index, Uuid, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True
    )

    username: Mapped[str | None] = mapped_column(
        String(50),
        unique=True,
        nullable=False
    )

    first_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    last_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    phone_number: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True
    )

    self_introduction: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationship back to User
    user = relationship(
        "User",
        back_populates="profile",
        uselist=False
    )

    __table_args__ = (
        Index(
            "ix_user_profiles_username_lower",
            func.lower(username),
            unique=True,
            postgresql_where=username.isnot(None)
        ),
    )
