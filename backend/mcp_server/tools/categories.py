from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.services import category_service
from mcp_server.auth import CallContext
from mcp_server.registry import tool
from mcp_server.tools._helpers import resolve_workspace_id


@tool(
    name="list_categories",
    description=(
        "List the user's categories. Each category has an id, name, optional "
        "group_id, icon, and color. Use the ids when filtering or proposing "
        "categorization."
    ),
    parameters={"type": "object", "properties": {}, "additionalProperties": False},
    tags=["read", "categories"],
)
async def list_categories(
    *,
    session: AsyncSession,
    ctx: CallContext,
) -> dict[str, Any]:
    ws_id = await resolve_workspace_id(session, ctx)
    cats = await category_service.get_categories(session, ws_id)
    items = [
        {
            "id": str(c.id),
            "name": c.name,
            "group_id": str(c.group_id) if c.group_id else None,
            "icon": c.icon,
            "color": c.color,
            "is_system": bool(c.is_system),
            "treat_as_transfer": bool(getattr(c, "treat_as_transfer", False)),
        }
        for c in cats
    ]
    return {"items": items, "total": len(items)}
