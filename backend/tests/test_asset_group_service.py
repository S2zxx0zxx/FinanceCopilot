import uuid
from datetime import datetime, timezone

import pytest
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.asset_group import AssetGroup
from app.models.bank_connection import BankConnection
from app.services.asset_group_service import get_groups


@pytest.mark.asyncio
async def test_get_groups_hides_empty_synced_wallets(
    session: AsyncSession, test_user, test_workspace
):
    active_connection = BankConnection(
        id=uuid.uuid4(),
        user_id=test_user.id,
        provider="pluggy",
        external_id="item-active",
        institution_name="Active Bank",
        credentials={"token": "x"},
        status="active",
        created_at=datetime.now(timezone.utc),
    )
    session.add(active_connection)

    manual_group = AssetGroup(
        id=uuid.uuid4(),
        user_id=test_user.id,
        name="Manual Wallet",
        source="manual",
    )
    orphan_synced_group = AssetGroup(
        id=uuid.uuid4(),
        user_id=test_user.id,
        name="MeuPluggy",
        source="pluggy",
        connection_id=None,
    )
    active_synced_group = AssetGroup(
        id=uuid.uuid4(),
        user_id=test_user.id,
        name="Connected Wallet",
        source="pluggy",
        connection_id=active_connection.id,
    )
    session.add_all([manual_group, orphan_synced_group, active_synced_group])
    await session.commit()

    groups = await get_groups(session, test_workspace.id, test_user.id)
    names = {g.name for g in groups}

    assert "Manual Wallet" in names
    assert "Connected Wallet" not in names
    assert "MeuPluggy" not in names
