"""add totp_secret and is_2fa_enabled to users

Revision ID: 021
Revises: 020
Create Date: 2026-04-02
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "021"
down_revision: Union[str, None] = "020"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("totp_secret", sa.String(32), nullable=True))
    op.add_column(
        "users",
        sa.Column("is_2fa_enabled", sa.Boolean(), nullable=False, server_default="0"),
    )


def downgrade() -> None:
    op.drop_column("users", "is_2fa_enabled")
    op.drop_column("users", "totp_secret")
