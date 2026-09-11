from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class StoredFile:
    storage_key: str
    size: int
    content_type: str


class StorageProvider(ABC):
    """Abstract interface for file storage backends."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Unique provider identifier (e.g. 'local', 's3')."""
        ...

    @abstractmethod
    async def upload(self, storage_key: str, data: bytes, content_type: str) -> StoredFile:
        """Upload file data and return metadata."""
        ...

    @abstractmethod
    async def download(self, storage_key: str) -> bytes:
        """Download and return file contents."""
        ...

    @abstractmethod
    async def delete(self, storage_key: str) -> None:
        """Delete a file from storage."""
        ...

    def get_url(self, storage_key: str) -> str | None:
        """Return a direct URL (e.g. presigned S3 URL). None for local storage."""
        return None
