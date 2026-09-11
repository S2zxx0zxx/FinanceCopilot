import uuid
from typing import TYPE_CHECKING, Optional

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import JSON, Boolean, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.category_group import CategoryGroup
    from app.models.bank_connection import BankConnection
    from app.models.passkey import UserPasskey


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("oidc_issuer", "oidc_subject", name="uq_users_oidc_identity"),
    )

    if TYPE_CHECKING:
        id: Mapped[uuid.UUID]
        email: Mapped[str]
        hashed_password: Mapped[str]
        is_active: Mapped[bool]
        is_superuser: Mapped[bool]
        is_verified: Mapped[bool]

    preferences: Mapped[Optional[dict]] = mapped_column(
        JSON,
        default=lambda: {
            "language": "en",
            "date_format": "MM/DD/YYYY",
            "timezone": "UTC",
            "currency_display": "USD",
        },
    )

    # FinCopilot profile identity. These fields intentionally live on the
    # engine user so Personal Hub is first-class data rather than a separate
    # frontend-only profile store.
    display_name: Mapped[Optional[str]] = mapped_column(String(160), nullable=True, default=None)
    avatar_mode: Mapped[str] = mapped_column(String(16), nullable=False, default="account", server_default="account")
    preset_avatar_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True, default=None)

    totp_secret: Mapped[Optional[str]] = mapped_column(String(32), nullable=True, default=None)
    is_2fa_enabled: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0")
    oidc_issuer: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    oidc_subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)

    categories: Mapped[list["Category"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    category_groups: Mapped[list["CategoryGroup"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    bank_connections: Mapped[list["BankConnection"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    passkeys: Mapped[list["UserPasskey"]] = relationship(back_populates="user", cascade="all, delete-orphan")

    @property
    def primary_currency(self) -> str:
        from app.core.config import get_settings
        return (self.preferences or {}).get("currency_display", get_settings().default_currency)
