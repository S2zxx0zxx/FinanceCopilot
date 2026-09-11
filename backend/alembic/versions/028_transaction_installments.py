"""add installment metadata to transactions

Revision ID: 028
Revises: 027
Create Date: 2026-04-13
"""

from alembic import op
import sqlalchemy as sa

revision = "028"
down_revision = "027"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("transactions", sa.Column("installment_number", sa.SmallInteger(), nullable=True))
    op.add_column("transactions", sa.Column("total_installments", sa.SmallInteger(), nullable=True))
    op.add_column(
        "transactions",
        sa.Column("installment_total_amount", sa.Numeric(precision=15, scale=2), nullable=True),
    )
    op.add_column(
        "transactions",
        sa.Column("installment_purchase_date", sa.Date(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("transactions", "installment_purchase_date")
    op.drop_column("transactions", "installment_total_amount")
    op.drop_column("transactions", "total_installments")
    op.drop_column("transactions", "installment_number")
