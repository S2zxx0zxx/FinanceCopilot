"""manual effective_bill_date override on transactions

Lets users override the cycle assignment for a credit-card transaction by
setting an explicit date. Useful when the provider didn't tag the tx with a
billId, or when the user disagrees with how a tx was bucketed (LucasFidelis's
suggestion in issue #92). Empty by default; only meaningful for CC accounts.

Revision ID: 043
Revises: 042
Create Date: 2026-04-28
"""

from alembic import op
import sqlalchemy as sa


revision = "043"
down_revision = "042"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "transactions",
        sa.Column("effective_bill_date", sa.Date(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("transactions", "effective_bill_date")
