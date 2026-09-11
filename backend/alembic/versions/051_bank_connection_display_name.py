"""add display_name to bank_connections

Revision ID: 051
Revises: 050
Create Date: 2026-05-21
"""

from alembic import op
import sqlalchemy as sa

revision = "051"
down_revision = "050"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("bank_connections", sa.Column("display_name", sa.String(255), nullable=True))


def downgrade() -> None:
    op.drop_column("bank_connections", "display_name")
