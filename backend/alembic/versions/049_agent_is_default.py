"""agents.is_default flag + at-most-one constraint per user

Revision ID: 049
Revises: 048
Create Date: 2026-05-11
"""

from alembic import op
import sqlalchemy as sa

revision = "049"
down_revision = "048"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "agents",
        sa.Column(
            "is_default",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )
    # Partial unique index — at most one default per user, but multiple
    # non-defaults are fine.
    op.create_index(
        "uq_agents_one_default_per_user",
        "agents",
        ["user_id"],
        unique=True,
        postgresql_where=sa.text("is_default = true"),
    )


def downgrade() -> None:
    op.drop_index("uq_agents_one_default_per_user", table_name="agents")
    op.drop_column("agents", "is_default")
