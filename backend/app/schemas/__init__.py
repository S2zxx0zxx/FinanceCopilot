from app.schemas.user import UserCreate, UserRead, UserUpdate, UserPreferences
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate
from app.schemas.bank_connection import (
    BankConnectionRead,
    OAuthUrlRequest,
    OAuthUrlResponse,
    OAuthCallbackRequest,
)
from app.schemas.account import AccountRead
from app.schemas.transaction import (
    TransactionCreate,
    TransactionRead,
    TransactionUpdate,
    TransactionImportPreview,
    TransactionImportRequest,
)
from app.schemas.dashboard import DashboardSummary, SpendingByCategory, MonthlyTrend

__all__ = [
    "UserCreate",
    "UserRead",
    "UserUpdate",
    "UserPreferences",
    "CategoryCreate",
    "CategoryRead",
    "CategoryUpdate",
    "BankConnectionRead",
    "OAuthUrlRequest",
    "OAuthUrlResponse",
    "OAuthCallbackRequest",
    "AccountRead",
    "TransactionCreate",
    "TransactionRead",
    "TransactionUpdate",
    "TransactionImportPreview",
    "TransactionImportRequest",
    "DashboardSummary",
    "SpendingByCategory",
    "MonthlyTrend",
]
