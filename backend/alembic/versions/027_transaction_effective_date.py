"""add effective_date to transactions for cash/accrual reporting

Revision ID: 027
Revises: 026
Create Date: 2026-04-13
"""

from alembic import op
import sqlalchemy as sa

revision = "027"
down_revision = "026"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("transactions", sa.Column("effective_date", sa.Date(), nullable=True))
    # Backfill: effective_date defaults to the transaction date for everyone.
    # Credit card transactions get their cycle-due-date computed on next sync/edit;
    # a post-migration helper (or manual re-save) can populate historical data later.
    op.execute("UPDATE transactions SET effective_date = date WHERE effective_date IS NULL")
    op.alter_column("transactions", "effective_date", nullable=False)
    op.create_index("ix_transactions_effective_date", "transactions", ["effective_date"])


def downgrade() -> None:
    op.drop_index("ix_transactions_effective_date", table_name="transactions")
    op.drop_column("transactions", "effective_date")
