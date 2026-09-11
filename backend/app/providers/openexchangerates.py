import logging
from datetime import date
from decimal import Decimal

import httpx

from app.core.config import get_settings
from app.providers.base import FxRateProvider

logger = logging.getLogger(__name__)

BASE_URL = "https://openexchangerates.org/api"


class OpenExchangeRatesProvider(FxRateProvider):
    """FX rate provider using Open Exchange Rates API."""

    @property
    def name(self) -> str:
        return "openexchangerates"

    def _app_id(self) -> str:
        return get_settings().openexchangerates_app_id

    def _symbols(self) -> str:
        """Return comma-separated supported currencies for the OER `symbols` param."""
        return get_settings().supported_currencies

    async def fetch_latest(self) -> dict[str, Decimal]:
        app_id = self._app_id()
        if not app_id:
            raise ValueError("openexchangerates_app_id not configured")
        params = {"app_id": app_id, "symbols": self._symbols()}
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(f"{BASE_URL}/latest.json", params=params)
            resp.raise_for_status()
            data = resp.json()
        return {code: Decimal(str(rate)) for code, rate in data.get("rates", {}).items()}

    async def fetch_historical(self, target_date: date) -> dict[str, Decimal]:
        app_id = self._app_id()
        if not app_id:
            raise ValueError("openexchangerates_app_id not configured")
        date_str = target_date.strftime("%Y-%m-%d")
        params = {"app_id": app_id, "symbols": self._symbols()}
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(f"{BASE_URL}/historical/{date_str}.json", params=params)
            resp.raise_for_status()
            data = resp.json()
        return {code: Decimal(str(rate)) for code, rate in data.get("rates", {}).items()}
