import uuid
from datetime import datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict

ShareType = Literal["equal", "exact", "percent"]


class TransactionSplitInput(BaseModel):
    """One row in a splits payload. Required fields depend on share_type:
    equal -> only group_member_id; exact -> + share_amount; percent ->
    + share_pct."""

    group_member_id: uuid.UUID
    share_amount: Optional[Decimal] = None
    share_pct: Optional[Decimal] = None
    notes: Optional[str] = None


class TransactionSplitsInput(BaseModel):
    """Whole splits payload attached to a transaction."""

    share_type: ShareType
    splits: list[TransactionSplitInput]


class TransactionSplitRead(BaseModel):
    id: uuid.UUID
    transaction_id: uuid.UUID
    group_member_id: uuid.UUID
    share_amount: Decimal
    share_type: str
    share_pct: Optional[Decimal] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
