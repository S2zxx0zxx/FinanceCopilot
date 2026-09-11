from __future__ import annotations

from typing import Any, Awaitable, Callable, MutableMapping


class ApiV1CompatibilityMiddleware:
    """Expose the finance engine under FinCopilot's historic ``/api/v1`` prefix.

    The canonical engine routes stay under ``/api``.  FinCopilot's existing
    Next.js client still calls ``/api/v1``.  Rewriting at the ASGI layer keeps
    one implementation of accounts, budgets, goals, transactions, imports,
    rules, reports, assets and the rest of the engine while the frontend is
    migrated screen-by-screen.
    """

    def __init__(self, app: Callable[..., Awaitable[Any]]) -> None:
        self.app = app

    async def __call__(
        self,
        scope: MutableMapping[str, Any],
        receive: Callable[..., Awaitable[Any]],
        send: Callable[..., Awaitable[Any]],
    ) -> None:
        if scope.get("type") == "http":
            path = scope.get("path", "")
            if path == "/api/v1":
                rewritten = "/api"
            elif path.startswith("/api/v1/"):
                rewritten = "/api/" + path[len("/api/v1/") :]
            else:
                rewritten = None

            if rewritten is not None:
                scope = dict(scope)
                scope["path"] = rewritten
                scope["raw_path"] = rewritten.encode("utf-8")

        await self.app(scope, receive, send)
