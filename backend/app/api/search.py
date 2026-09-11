from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_async_session
from app.core.workspace_context import WorkspaceContext, current_workspace
from app.services import search_service

router = APIRouter(prefix="/api/search", tags=["search"])


@router.get("")
async def global_search(
    q: str = Query("", min_length=0, max_length=100),
    limit: int = Query(5, ge=1, le=20),
    ctx: WorkspaceContext = Depends(current_workspace),
    session: AsyncSession = Depends(get_async_session),
):
    """Global search across transactions, accounts, payees, categories, goals and assets.

    Used by the command palette (Cmd/Ctrl+K). Returns a flat list of
    typed hits limited to ``limit`` results per entity type.
    """
    hits = await search_service.search_all(
        session=session,
        workspace_id=ctx.workspace.id,
        user_id=ctx.user_id,
        query=q,
        per_type_limit=limit,
    )
    return {"query": q, "results": hits}
