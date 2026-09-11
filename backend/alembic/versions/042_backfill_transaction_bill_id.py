"""backfill transaction.bill_id from raw_data on existing CC transactions

Phase 2 starts persisting credit_card_bills and linking new transactions to
them, but the 14-day sync rewind doesn't refetch older transactions. For
already-synced data, the bill linkage is recoverable directly: every
Pluggy CC transaction stores the original payload in raw_data, including
creditCardMetadata.billId. This migration matches those to the bills table
and stamps bill_id + effective_date in one shot — no HTTP traffic needed.

Idempotent (only touches rows where bill_id is NULL). Safe to re-run.
Issue #92.

Revision ID: 042
Revises: 041
Create Date: 2026-04-27
"""

from alembic import op


revision = "042"
down_revision = "041"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute(
        """
        UPDATE transactions AS t
        SET bill_id = b.id,
            effective_date = b.due_date
        FROM credit_card_bills AS b
        WHERE t.bill_id IS NULL
          AND t.account_id = b.account_id
          AND b.external_id = t.raw_data -> 'creditCardMetadata' ->> 'billId'
        """
    )


def downgrade() -> None:
    # No-op: clearing bill_id wholesale would also wipe links the sync layer
    # legitimately set after this migration ran. Operators who really need to
    # reverse should run the equivalent UPDATE manually with whatever filter
    # makes sense for their case.
    pass
