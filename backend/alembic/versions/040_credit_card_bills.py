"""create credit_card_bills table

Provider-agnostic credit-card bill (fatura) snapshot — see issue #92.
Schema is a generic billing shape; provider-specific payloads live in
`raw_data` so we don't tie the table to one integration.

Phase 1: schema only. Sync wiring ships in a follow-up so this migration
is safe to apply ahead of the provider changes.

Revision ID: 040
Revises: 039
Create Date: 2026-04-27
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "040"
down_revision = "039"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "credit_card_bills",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("account_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("external_id", sa.String(length=255), nullable=False),
        sa.Column("due_date", sa.Date(), nullable=False),
        sa.Column("total_amount", sa.Numeric(precision=15, scale=2), nullable=False),
        sa.Column("currency", sa.String(length=3), nullable=False, server_default="BRL"),
        sa.Column("minimum_payment", sa.Numeric(precision=15, scale=2), nullable=True),
        sa.Column("raw_data", sa.JSON(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"]),
        sa.ForeignKeyConstraint(["account_id"], ["accounts.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("account_id", "external_id", name="uq_cc_bills_account_external_id"),
    )
    op.create_index("ix_credit_card_bills_due_date", "credit_card_bills", ["due_date"])
    op.create_index("ix_credit_card_bills_account_id", "credit_card_bills", ["account_id"])


def downgrade() -> None:
    op.drop_index("ix_credit_card_bills_account_id", table_name="credit_card_bills")
    op.drop_index("ix_credit_card_bills_due_date", table_name="credit_card_bills")
    op.drop_table("credit_card_bills")
