"""Tests for bulk-add-to-group (issue #156).

Conservative semantics: equal split across all members; transactions that
are transfers or already have splits are skipped, never overwritten.
"""

import pytest
from httpx import AsyncClient


async def _create_account(client: AsyncClient, auth_headers, name="Wallet") -> dict:
    resp = await client.post(
        "/api/accounts",
        headers=auth_headers,
        json={"name": name, "type": "checking", "balance": 0, "currency": "USD"},
    )
    assert resp.status_code in (200, 201), resp.text
    return resp.json()


async def _create_group_with_members(client, auth_headers, *names):
    g = (
        await client.post(
            "/api/groups",
            headers=auth_headers,
            json={"name": f"Trip-{names[0]}", "kind": "social", "default_currency": "USD"},
        )
    ).json()
    members = []
    for n in names:
        m = (
            await client.post(
                f"/api/groups/{g['id']}/members",
                headers=auth_headers,
                json={"name": n, "is_self": n == names[0]},
            )
        ).json()
        members.append(m)
    return g, members


async def _create_tx(client, auth_headers, account_id, amount=100, description="X"):
    resp = await client.post(
        "/api/transactions",
        headers=auth_headers,
        json={
            "account_id": account_id,
            "description": description,
            "amount": amount,
            "date": "2026-04-28",
            "type": "debit",
            "currency": "USD",
        },
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


@pytest.mark.asyncio
async def test_bulk_add_to_group_equal_split(client, auth_headers):
    account = await _create_account(client, auth_headers)
    _, members = await _create_group_with_members(client, auth_headers, "Me", "A", "B")
    group_id = members[0]["group_id"]

    tx1 = await _create_tx(client, auth_headers, account["id"], amount=99)
    tx2 = await _create_tx(client, auth_headers, account["id"], amount=60)

    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={"transaction_ids": [tx1["id"], tx2["id"]], "group_id": group_id},
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert body == {"updated": 2, "skipped": 0}

    # Verify splits materialized for both
    full1 = (await client.get(f"/api/transactions/{tx1['id']}", headers=auth_headers)).json()
    assert len(full1["splits"]) == 3
    assert abs(sum(float(s["share_amount"]) for s in full1["splits"]) - 99.0) < 0.01

    full2 = (await client.get(f"/api/transactions/{tx2['id']}", headers=auth_headers)).json()
    assert len(full2["splits"]) == 3
    assert abs(sum(float(s["share_amount"]) for s in full2["splits"]) - 60.0) < 0.01


@pytest.mark.asyncio
async def test_bulk_add_skips_already_split(client, auth_headers):
    """A tx that already has splits must not be overwritten."""
    account = await _create_account(client, auth_headers)
    _, members = await _create_group_with_members(client, auth_headers, "Me", "A")
    group_id = members[0]["group_id"]

    # Pre-split tx with exact amounts that the bulk equal-split would *not* produce.
    pre = await client.post(
        "/api/transactions",
        headers=auth_headers,
        json={
            "account_id": account["id"],
            "description": "Pre-split",
            "amount": 100,
            "date": "2026-04-28",
            "type": "debit",
            "currency": "USD",
            "splits": {
                "share_type": "exact",
                "splits": [
                    {"group_member_id": members[0]["id"], "share_amount": "30.00"},
                    {"group_member_id": members[1]["id"], "share_amount": "70.00"},
                ],
            },
        },
    )
    assert pre.status_code == 201, pre.text
    pre_tx = pre.json()

    fresh = await _create_tx(client, auth_headers, account["id"], amount=50)

    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={"transaction_ids": [pre_tx["id"], fresh["id"]], "group_id": group_id},
    )
    assert resp.status_code == 200, resp.text
    assert resp.json() == {"updated": 1, "skipped": 1}

    # Pre-existing splits preserved exactly.
    refreshed = (await client.get(f"/api/transactions/{pre_tx['id']}", headers=auth_headers)).json()
    by_member = {s["group_member_id"]: float(s["share_amount"]) for s in refreshed["splits"]}
    assert by_member[members[0]["id"]] == 30.0
    assert by_member[members[1]["id"]] == 70.0


@pytest.mark.asyncio
async def test_bulk_add_skips_transfers(client, auth_headers):
    src = await _create_account(client, auth_headers, name="Src")
    dst = await _create_account(client, auth_headers, name="Dst")
    _, members = await _create_group_with_members(client, auth_headers, "Me", "A")
    group_id = members[0]["group_id"]

    transfer = await client.post(
        "/api/transactions/transfer",
        headers=auth_headers,
        json={
            "from_account_id": src["id"],
            "to_account_id": dst["id"],
            "description": "Move",
            "amount": 200,
            "date": "2026-04-28",
        },
    )
    assert transfer.status_code == 201, transfer.text
    debit_id = transfer.json()["debit"]["id"]

    fresh = await _create_tx(client, auth_headers, src["id"], amount=40)

    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={"transaction_ids": [debit_id, fresh["id"]], "group_id": group_id},
    )
    assert resp.status_code == 200, resp.text
    assert resp.json() == {"updated": 1, "skipped": 1}


@pytest.mark.asyncio
async def test_bulk_add_unknown_group_returns_400(client, auth_headers):
    account = await _create_account(client, auth_headers)
    fresh = await _create_tx(client, auth_headers, account["id"], amount=10)

    bogus_group = "00000000-0000-0000-0000-000000000000"
    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={"transaction_ids": [fresh["id"]], "group_id": bogus_group},
    )
    assert resp.status_code == 400, resp.text
    assert "Group" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_bulk_add_percent_split(client, auth_headers):
    """Same percentages applied to each tx — sums must match each tx's amount."""
    account = await _create_account(client, auth_headers)
    _, members = await _create_group_with_members(client, auth_headers, "Me", "A", "B")
    group_id = members[0]["group_id"]

    tx1 = await _create_tx(client, auth_headers, account["id"], amount=120)
    tx2 = await _create_tx(client, auth_headers, account["id"], amount=80)

    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={
            "transaction_ids": [tx1["id"], tx2["id"]],
            "group_id": group_id,
            "share_type": "percent",
            "member_splits": [
                {"group_member_id": members[0]["id"], "share_pct": "50"},
                {"group_member_id": members[1]["id"], "share_pct": "30"},
                {"group_member_id": members[2]["id"], "share_pct": "20"},
            ],
        },
    )
    assert resp.status_code == 200, resp.text
    assert resp.json() == {"updated": 2, "skipped": 0}

    full1 = (await client.get(f"/api/transactions/{tx1['id']}", headers=auth_headers)).json()
    by_member1 = {s["group_member_id"]: float(s["share_amount"]) for s in full1["splits"]}
    assert by_member1[members[0]["id"]] == 60.0  # 50% of 120
    assert by_member1[members[1]["id"]] == 36.0  # 30% of 120

    full2 = (await client.get(f"/api/transactions/{tx2['id']}", headers=auth_headers)).json()
    by_member2 = {s["group_member_id"]: float(s["share_amount"]) for s in full2["splits"]}
    assert by_member2[members[0]["id"]] == 40.0  # 50% of 80
    assert by_member2[members[1]["id"]] == 24.0  # 30% of 80


@pytest.mark.asyncio
async def test_bulk_add_partial_member_subset(client, auth_headers):
    """Only the explicitly chosen members get a share."""
    account = await _create_account(client, auth_headers)
    _, members = await _create_group_with_members(client, auth_headers, "Me", "A", "B")
    group_id = members[0]["group_id"]

    tx = await _create_tx(client, auth_headers, account["id"], amount=100)

    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={
            "transaction_ids": [tx["id"]],
            "group_id": group_id,
            "share_type": "equal",
            "member_splits": [
                {"group_member_id": members[0]["id"]},
                {"group_member_id": members[1]["id"]},
            ],
        },
    )
    assert resp.status_code == 200, resp.text
    full = (await client.get(f"/api/transactions/{tx['id']}", headers=auth_headers)).json()
    assert len(full["splits"]) == 2
    assert {s["group_member_id"] for s in full["splits"]} == {members[0]["id"], members[1]["id"]}


@pytest.mark.asyncio
async def test_bulk_add_rejects_exact_share_type(client, auth_headers):
    """Exact amounts can't generalize across many txs — must be 400."""
    account = await _create_account(client, auth_headers)
    _, members = await _create_group_with_members(client, auth_headers, "Me", "A")
    group_id = members[0]["group_id"]

    tx = await _create_tx(client, auth_headers, account["id"], amount=100)

    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={
            "transaction_ids": [tx["id"]],
            "group_id": group_id,
            "share_type": "exact",
            "member_splits": [
                {"group_member_id": members[0]["id"], "share_amount": "60"},
                {"group_member_id": members[1]["id"], "share_amount": "40"},
            ],
        },
    )
    # Pydantic Literal["equal","percent"] rejects with 422; if Literal
    # constraint is removed in the future the service catches it as 400.
    assert resp.status_code in (400, 422), resp.text


@pytest.mark.asyncio
async def test_bulk_add_percent_must_sum_to_100(client, auth_headers):
    account = await _create_account(client, auth_headers)
    _, members = await _create_group_with_members(client, auth_headers, "Me", "A")
    group_id = members[0]["group_id"]

    tx = await _create_tx(client, auth_headers, account["id"], amount=100)

    resp = await client.patch(
        "/api/transactions/bulk-add-to-group",
        headers=auth_headers,
        json={
            "transaction_ids": [tx["id"]],
            "group_id": group_id,
            "share_type": "percent",
            "member_splits": [
                {"group_member_id": members[0]["id"], "share_pct": "60"},
                {"group_member_id": members[1]["id"], "share_pct": "30"},
            ],
        },
    )
    assert resp.status_code == 400, resp.text
    assert "100" in resp.json()["detail"]
