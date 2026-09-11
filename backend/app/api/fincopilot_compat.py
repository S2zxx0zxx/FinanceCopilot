from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import current_active_user
from app.core.database import get_async_session
from app.core.workspace_context import WorkspaceContext, current_workspace
from app.models.user import User
from app.services import dashboard_service

router = APIRouter(prefix="/api", tags=["fincopilot-compat"])


def _get(value: Any, key: str, default: Any = 0) -> Any:
    if isinstance(value, dict):
        return value.get(key, default)
    return getattr(value, key, default)


def _paise(value: Any) -> int:
    try:
        return int(round(float(value or 0) * 100))
    except (TypeError, ValueError):
        return 0


async def _summary(session: AsyncSession, ctx: WorkspaceContext) -> Any:
    return await dashboard_service.get_summary(
        session,
        ctx.workspace.id,
        ctx.user_id,
        None,
        None,
        None,
        None,
    )


async def _selected_preset(session: AsyncSession, preset_id: str | None) -> dict[str, Any] | None:
    if not preset_id:
        return None
    row = (
        await session.execute(
            text(
                "SELECT preset_id, label, asset_path, alt_text, sort_order "
                "FROM profile_avatar_presets WHERE preset_id = :preset_id AND is_active = true"
            ),
            {"preset_id": preset_id},
        )
    ).mappings().first()
    return dict(row) if row else None


def _profile_payload(user: User, preset: dict[str, Any] | None) -> dict[str, Any]:
    return {
        "user_id": str(user.id),
        "email": user.email,
        "display_name": user.display_name,
        "created_at": user.created_at.isoformat() if user.created_at else datetime.now(timezone.utc).isoformat(),
        "avatar_mode": user.avatar_mode or "account",
        "preset_avatar_id": user.preset_avatar_id,
        "preset_avatar_url": preset.get("asset_path") if preset else None,
        "preset_avatar_label": preset.get("label") if preset else None,
    }


@router.get("/profile")
async def get_profile(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    preset = await _selected_preset(session, user.preset_avatar_id)
    return _profile_payload(user, preset)


@router.get("/profile/avatar-presets")
async def list_profile_avatar_presets(
    _user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    rows = (
        await session.execute(
            text(
                "SELECT preset_id, label, asset_path, alt_text, sort_order "
                "FROM profile_avatar_presets WHERE is_active = true ORDER BY sort_order"
            )
        )
    ).mappings().all()
    return {"presets": [dict(row) for row in rows]}


@router.patch("/profile/avatar")
async def update_profile_avatar(
    payload: dict[str, Any],
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    mode = payload.get("mode")
    preset_id = payload.get("preset_avatar_id")
    if mode not in {"account", "preset"}:
        raise HTTPException(status_code=422, detail="Avatar mode must be account or preset")
    preset = None
    if mode == "preset":
        if not isinstance(preset_id, str) or not preset_id.strip():
            raise HTTPException(status_code=422, detail="Choose a valid avatar preset")
        preset = await _selected_preset(session, preset_id)
        if preset is None:
            raise HTTPException(status_code=422, detail="Avatar preset is unavailable")
        user.preset_avatar_id = preset_id
    else:
        user.preset_avatar_id = None
    user.avatar_mode = mode
    user.updated_at = datetime.now(timezone.utc)
    await session.commit()
    await session.refresh(user)
    return {"profile": _profile_payload(user, preset)}


@router.get("/preferences")
async def get_preferences(user: User = Depends(current_active_user)):
    prefs = dict(user.preferences or {})
    return {"preferences": prefs}


@router.put("/preferences")
async def update_preferences(
    payload: dict[str, Any],
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    prefs = dict(user.preferences or {})
    prefs.update(payload)
    user.preferences = prefs
    user.updated_at = datetime.now(timezone.utc)
    await session.commit()
    return {"preferences": prefs}


def _game_state(user: User) -> dict[str, Any]:
    prefs = dict(user.preferences or {})
    saved = dict(prefs.get("fincopilot_game") or {})
    defaults = {
        "level": 1,
        "level_name": "Beginner",
        "xp": 0,
        "xp_to_next_level": 500,
        "xp_to_next": 500,
        "xp_progress_pct": 0,
        "next_level": 2,
        "next_level_name": "Builder",
        "tracking_streak_days": 0,
        "longest_streak_days": 0,
        "total_actions": 0,
        "badges": [],
        "milestones": [],
        "featured_milestones": [],
    }
    defaults.update(saved)
    return defaults


async def _store_game(session: AsyncSession, user: User, game: dict[str, Any]) -> None:
    prefs = dict(user.preferences or {})
    prefs["fincopilot_game"] = game
    user.preferences = prefs
    user.updated_at = datetime.now(timezone.utc)
    await session.commit()


@router.get("/gamification")
async def get_gamification(
    ctx: WorkspaceContext = Depends(current_workspace),
    session: AsyncSession = Depends(get_async_session),
):
    game = _game_state(ctx.user)
    summary = await _summary(session, ctx)
    accounts = int(_get(summary, "accounts_count", 0) or 0)
    categorized_pending = int(_get(summary, "pending_categorization", 0) or 0)
    dynamic_badges = [
        {
            "key": "first_account",
            "name": "Connected",
            "description": "Add your first financial account.",
            "progress": min(accounts, 1),
            "raw_progress": accounts,
            "target": 1,
            "unit": "account",
            "progress_pct": 100 if accounts >= 1 else 0,
            "remaining": max(0, 1 - accounts),
            "earned": accounts >= 1,
            "earned_at": None,
            "icon_key": "wallet",
            "tier": "core",
            "tone": "emerald",
        },
        {
            "key": "clear_inbox",
            "name": "Money Inbox Zero",
            "description": "Keep transaction categorization fully reviewed.",
            "progress": 1 if accounts > 0 and categorized_pending == 0 else 0,
            "raw_progress": 1 if accounts > 0 and categorized_pending == 0 else 0,
            "target": 1,
            "unit": "state",
            "progress_pct": 100 if accounts > 0 and categorized_pending == 0 else 0,
            "remaining": 0 if accounts > 0 and categorized_pending == 0 else 1,
            "earned": accounts > 0 and categorized_pending == 0,
            "earned_at": None,
            "icon_key": "check-circle",
            "tier": "advanced",
            "tone": "azure",
        },
    ]
    game["badges"] = dynamic_badges + list(game.get("badges") or [])
    return game


@router.post("/gamification/streak/tick")
async def tick_streak(
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    game = _game_state(user)
    game["tracking_streak_days"] = int(game.get("tracking_streak_days", 0)) + 1
    game["longest_streak_days"] = max(
        int(game.get("longest_streak_days", 0)),
        int(game["tracking_streak_days"]),
    )
    game["total_actions"] = int(game.get("total_actions", 0)) + 1
    game["xp"] = int(game.get("xp", 0)) + 10
    game["xp_progress_pct"] = min(100, int(game["xp"] / max(1, int(game.get("xp_to_next_level", 500))) * 100))
    await _store_game(session, user, game)
    return game


@router.post("/gamification/badges/{badge_name}/earn")
async def earn_badge(
    badge_name: str,
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    game = _game_state(user)
    badges = list(game.get("badges") or [])
    if not any(item.get("key") == badge_name for item in badges if isinstance(item, dict)):
        badges.append(
            {
                "key": badge_name,
                "name": badge_name.replace("_", " ").title(),
                "description": "FinCopilot achievement",
                "progress": 1,
                "raw_progress": 1,
                "target": 1,
                "unit": "achievement",
                "progress_pct": 100,
                "remaining": 0,
                "earned": True,
                "earned_at": datetime.now(timezone.utc).isoformat(),
                "icon_key": "achievement",
                "tier": "core",
                "tone": "amber",
            }
        )
    game["badges"] = badges
    await _store_game(session, user, game)
    return game


@router.get("/notifications")
async def get_notifications(_user: User = Depends(current_active_user)):
    # Notifications are retained as a FinCopilot surface. Engine-driven event
    # production can populate this contract incrementally without breaking the UI.
    return {"notifications": []}


@router.get("/financial-state/home")
async def financial_state_home(
    ctx: WorkspaceContext = Depends(current_workspace),
    session: AsyncSession = Depends(get_async_session),
):
    summary = await _summary(session, ctx)
    current = float(_get(summary, "total_balance_primary", 0) or 0)
    projected_income = float(_get(summary, "projected_income_primary", 0) or 0)
    projected_expenses = float(_get(summary, "projected_expenses_primary", 0) or 0)
    safe = max(0.0, current + projected_income - projected_expenses)
    return {
        "safe_to_spend": {
            "safe_to_spend_paise": _paise(safe),
            "horizon_days": 30,
            "planning_data_status": "engine",
        }
    }


@router.get("/financial-state/money")
async def financial_state_money(
    ctx: WorkspaceContext = Depends(current_workspace),
    session: AsyncSession = Depends(get_async_session),
):
    summary = await _summary(session, ctx)
    balance = float(_get(summary, "total_balance_primary", 0) or 0)
    assets = float(_get(summary, "assets_value_primary", 0) or 0)
    return {
        "net_position": {
            "available_balance_paise": _paise(balance),
            "net_worth_paise": _paise(balance + assets),
            "assets_value_paise": _paise(assets),
        },
        "coverage": {"total_accounts": int(_get(summary, "accounts_count", 0) or 0)},
    }


@router.get("/financial-state/spending-story")
async def financial_state_spending_story(
    ctx: WorkspaceContext = Depends(current_workspace),
    session: AsyncSession = Depends(get_async_session),
):
    summary = await _summary(session, ctx)
    categories = await dashboard_service.get_spending_by_category(
        session, ctx.workspace.id, ctx.user_id, None, None
    )
    mapped = []
    for item in categories:
        mapped.append(
            {
                "category_id": _get(item, "category_id", None),
                "category": _get(item, "category_name", "Uncategorized"),
                "category_name": _get(item, "category_name", "Uncategorized"),
                "icon": _get(item, "category_icon", "circle"),
                "color": _get(item, "category_color", "#64748b"),
                "amount_paise": _paise(_get(item, "total", 0)),
                "projected_amount_paise": _paise(_get(item, "projected_total", 0)),
                "percentage": float(_get(item, "percentage", 0) or 0),
            }
        )
    return {
        "spending": {
            "effective_spending_paise": _paise(_get(summary, "monthly_expenses_primary", 0)),
        },
        "categories": mapped,
    }


@router.get("/financial-state/income")
async def financial_state_income(
    ctx: WorkspaceContext = Depends(current_workspace),
    session: AsyncSession = Depends(get_async_session),
):
    summary = await _summary(session, ctx)
    trend = await dashboard_service.get_monthly_trend(
        session, ctx.workspace.id, ctx.user_id, 6, None
    )
    return {
        "income": {"total_income_paise": _paise(_get(summary, "monthly_income_primary", 0))},
        "sources": [],
        "trend": [
            {
                "month": _get(item, "month", ""),
                "income_paise": _paise(_get(item, "income", 0)),
                "expenses_paise": _paise(_get(item, "expenses", 0)),
            }
            for item in trend
        ],
    }


@router.get("/data-quality")
async def data_quality(
    ctx: WorkspaceContext = Depends(current_workspace),
    session: AsyncSession = Depends(get_async_session),
):
    summary = await _summary(session, ctx)
    accounts = int(_get(summary, "accounts_count", 0) or 0)
    pending = int(_get(summary, "pending_categorization", 0) or 0)
    score = 100 if accounts > 0 and pending == 0 else 70 if accounts > 0 else 20
    return {
        "score": score,
        "accounts_count": accounts,
        "pending_categorization": pending,
        "status": "healthy" if score >= 80 else "needs_attention",
    }


@router.post("/auth/onboarding-complete")
async def onboarding_complete(
    payload: dict[str, Any],
    user: User = Depends(current_active_user),
    session: AsyncSession = Depends(get_async_session),
):
    prefs = dict(user.preferences or {})
    prefs["onboarding_complete"] = True
    prefs["onboarding"] = payload
    if isinstance(payload.get("display_name"), str) and payload["display_name"].strip():
        user.display_name = payload["display_name"].strip()[:160]
    user.preferences = prefs
    user.updated_at = datetime.now(timezone.utc)
    await session.commit()
    return {"status": "complete"}
