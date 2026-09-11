import uuid
from datetime import date as _date, datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.group import Group, GroupMember
    from app.models.transaction import Transaction


class GroupSettlement(Base):
    __tablename__ = "group_settlements"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    group_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("groups.id", ondelete="CASCADE")
    )
    workspace_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), index=True
    )
    from_member_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("group_members.id", ondelete="RESTRICT")
    )
    to_member_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("group_members.id", ondelete="RESTRICT")
    )
    amount: Mapped[Decimal] = mapped_column(Numeric(precision=15, scale=2))
    currency: Mapped[str] = mapped_column(String(3))
    date: Mapped[_date] = mapped_column(Date)
    # Optional link to a real bank transaction so the cash side
    # reconciles against the account ledger. SET NULL on delete: the
    # settlement record survives if the linked tx is later removed.
    transaction_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("transactions.id", ondelete="SET NULL"),
        nullable=True,
    )
    # Receiver-side mirror: when the to_member is a linked Securo user
    # with at least one checking/savings account, the settlement also
    # creates a credit on their account. This column points to it.
    receiver_transaction_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("transactions.id", ondelete="SET NULL"),
        nullable=True,
    )
    notes: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    group: Mapped["Group"] = relationship(back_populates="settlements")
    from_member: Mapped["GroupMember"] = relationship(foreign_keys=[from_member_id])
    to_member: Mapped["GroupMember"] = relationship(foreign_keys=[to_member_id])
    transaction: Mapped[Optional["Transaction"]] = relationship(foreign_keys=[transaction_id])
    receiver_transaction: Mapped[Optional["Transaction"]] = relationship(
        foreign_keys=[receiver_transaction_id]
    )
