"""link transactions to credit_card_bills

Adds a nullable FK so the sync layer can record which bill (fatura) a credit
card transaction belongs to (issue #92). Null = fall back to locally-computed
cycle math; ON DELETE SET NULL = unlink rather than cascade-delete the tx if
the bill row goes away.

Revision ID: 041
Revises: 040
Create Date: 2026-04-27
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


revision = "041"
down_revision = "040"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "transactions",
        sa.Column("bill_id", postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_foreign_key(
        "transactions_bill_id_fkey",
        "transactions",
        "credit_card_bills",
        ["bill_id"],
        ["id"],
        ondelete="SET NULL",
    )
    op.create_index("ix_transactions_bill_id", "transactions", ["bill_id"])


def downgrade() -> None:
    op.drop_index("ix_transactions_bill_id", table_name="transactions")
    op.drop_constraint("transactions_bill_id_fkey", "transactions", type_="foreignkey")
    op.drop_column("transactions", "bill_id")
