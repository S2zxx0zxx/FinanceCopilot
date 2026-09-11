import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AttachmentRead(BaseModel):
    id: uuid.UUID
    transaction_id: uuid.UUID
    filename: str
    content_type: str
    size: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttachmentRename(BaseModel):
    filename: str
