"""group_settlements.receiver_transaction_id — receiver-side credit link

Settlements that involve a Securo-linked receiver now mirror the
payer's debit with a corresponding credit on the receiver's account.
This column points to that auto-created credit. Nullable: settlements
where the receiver is a shadow member (no linked user) or has no
suitable account stay payer-only.

Revision ID: 045
Revises: 044
Create Date: 2026-04-29
"""

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects.postgresql import UUID

revision: str = "045"
down_revision: Union[str, None] = "044"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "group_settlements",
        sa.Column(
            "receiver_transaction_id",
            UUID(as_uuid=True),
            sa.ForeignKey("transactions.id", ondelete="SET NULL"),
            nullable=True,
        ),
    )
    op.create_index(
        "ix_group_settlements_receiver_transaction_id",
        "group_settlements",
        ["receiver_transaction_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_group_settlements_receiver_transaction_id",
        table_name="group_settlements",
    )
    op.drop_column("group_settlements", "receiver_transaction_id")
