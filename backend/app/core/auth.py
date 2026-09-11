import hashlib
import os
import time
import uuid
from decimal import Decimal
from typing import Any, Optional

import httpx
from fastapi import Depends, HTTPException, Request, status
from fastapi_users import BaseUserManager, FastAPIUsers, UUIDIDMixin, schemas
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from jose import jwk, jwt
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth_policy import require_local_auth_enabled
from app.core.config import get_settings
from app.core.database import get_async_session
from app.models.user import User

settings = get_settings()


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    user_db: SQLAlchemyUserDatabase
    reset_password_token_secret = settings.secret_key
    verification_token_secret = settings.secret_key

    async def update(
        self,
        user_update: schemas.BaseUserUpdate,
        user: User,
        safe: bool = False,
        request: Request | None = None,
    ) -> User:
        if user_update.password is not None:
            require_local_auth_enabled()
        return await super().update(user_update, user, safe=safe, request=request)

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        print(f"User {user.id} has registered.")
        if request is None:
            return
        from app.models.account import Account
        from app.services.category_service import create_default_categories
        from app.services.rule_service import create_default_rules
        from app.services.workspace_service import create_personal_workspace_for_user

        session = self.user_db.session
        currency = user.primary_currency
        lang = (user.preferences or {}).get("language", "en")
        workspace = await create_personal_workspace_for_user(session, user)

        wallet_name = "Carteira" if lang.startswith("pt") else "Wallet"
        wallet = Account(
            user_id=user.id,
            workspace_id=workspace.id,
            name=wallet_name,
            type="checking",
            balance=Decimal("0.00"),
            currency=currency,
        )
        session.add(wallet)
        await session.commit()
        await create_default_categories(session, user.id, lang, workspace_id=workspace.id)
        await create_default_rules(session, user.id, lang, workspace_id=workspace.id)


async def get_user_manager(user_db: SQLAlchemyUserDatabase = Depends(get_user_db)):
    yield UserManager(user_db)


bearer_transport = BearerTransport(tokenUrl="api/auth/login")


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.secret_key.get_secret_value(),
        lifetime_seconds=settings.access_token_expire_minutes * 60,
    )


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

fastapi_users = FastAPIUsers[User, uuid.UUID](get_user_manager, [auth_backend])
_native_optional_user = fastapi_users.current_user(active=True, optional=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)

# Clerk compatibility -------------------------------------------------------
# The existing FinCopilot Next.js UI obtains a Clerk session JWT and sends it
# as a Bearer token.  The finance engine keeps its native JWT/OIDC/passkey auth,
# but can additionally accept that Clerk JWT when CLERK_ISSUER (or an explicit
# CLERK_JWKS_URL) is configured.  Clerk identities are mapped onto the existing
# OIDC identity columns, so no parallel user table or destructive migration is
# required.
_JWKS_CACHE: dict[str, Any] = {"expires": 0.0, "keys": []}
_PASSWORD_CONTEXT = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _clerk_enabled() -> bool:
    return bool(os.getenv("CLERK_ISSUER", "").strip() or os.getenv("CLERK_JWKS_URL", "").strip())


def _clerk_jwks_url() -> str:
    explicit = os.getenv("CLERK_JWKS_URL", "").strip()
    if explicit:
        return explicit
    issuer = os.getenv("CLERK_ISSUER", "").strip().rstrip("/")
    return f"{issuer}/.well-known/jwks.json" if issuer else ""


async def _get_clerk_jwks() -> list[dict[str, Any]]:
    now = time.monotonic()
    if _JWKS_CACHE["keys"] and now < float(_JWKS_CACHE["expires"]):
        return list(_JWKS_CACHE["keys"])

    url = _clerk_jwks_url()
    if not url:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication provider is not configured")
    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(url)
        response.raise_for_status()
        payload = response.json()
    keys = payload.get("keys", [])
    if not isinstance(keys, list) or not keys:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication keys unavailable")
    _JWKS_CACHE["keys"] = keys
    _JWKS_CACHE["expires"] = now + 300.0
    return keys


async def _verify_clerk_token(token: str) -> dict[str, Any]:
    try:
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")
        keys = await _get_clerk_jwks()
        raw_key = next((item for item in keys if item.get("kid") == kid), None)
        if raw_key is None:
            # Key rotation: force one cache refresh before rejecting.
            _JWKS_CACHE["expires"] = 0.0
            keys = await _get_clerk_jwks()
            raw_key = next((item for item in keys if item.get("kid") == kid), None)
        if raw_key is None:
            raise ValueError("Signing key not found")

        public_key = jwk.construct(raw_key).to_pem()
        issuer = os.getenv("CLERK_ISSUER", "").strip() or None
        options = {"verify_aud": False}
        claims = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            issuer=issuer,
            options=options,
        )
        if not claims.get("sub"):
            raise ValueError("Missing subject")
        return claims
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token") from exc


async def _provision_clerk_user(
    session: AsyncSession,
    claims: dict[str, Any],
) -> User:
    subject = str(claims["sub"])
    existing = await session.scalar(
        select(User).where(User.oidc_issuer == "clerk", User.oidc_subject == subject)
    )
    if existing is not None:
        if not existing.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
        return existing

    token_email = claims.get("email")
    if isinstance(token_email, str) and "@" in token_email:
        email = token_email.strip().lower()
        email_owner = await session.scalar(select(User).where(User.email == email))
        if email_owner is not None:
            # Do not silently hijack an existing local/OIDC identity by email.
            # It can be linked explicitly later through account settings.
            email = ""
    else:
        email = ""
    if not email:
        digest = hashlib.sha256(subject.encode("utf-8")).hexdigest()[:24]
        email = f"clerk-{digest}@users.fincopilot.invalid"

    user = User(
        id=uuid.uuid4(),
        email=email,
        hashed_password=_PASSWORD_CONTEXT.hash(uuid.uuid4().hex + uuid.uuid4().hex),
        is_active=True,
        is_superuser=False,
        is_verified=True,
        oidc_issuer="clerk",
        oidc_subject=subject,
    )
    session.add(user)
    try:
        await session.commit()
        await session.refresh(user)
    except IntegrityError:
        await session.rollback()
        raced = await session.scalar(
            select(User).where(User.oidc_issuer == "clerk", User.oidc_subject == subject)
        )
        if raced is None:
            raise
        return raced

    from app.models.account import Account
    from app.services.category_service import create_default_categories
    from app.services.rule_service import create_default_rules
    from app.services.workspace_service import create_personal_workspace_for_user

    workspace = await create_personal_workspace_for_user(session, user)
    session.add(
        Account(
            user_id=user.id,
            workspace_id=workspace.id,
            name="Wallet",
            type="checking",
            balance=Decimal("0.00"),
            currency=user.primary_currency,
        )
    )
    await session.commit()
    await create_default_categories(session, user.id, "en", workspace_id=workspace.id)
    await create_default_rules(session, user.id, "en", workspace_id=workspace.id)
    return user


async def current_active_user(
    request: Request,
    session: AsyncSession = Depends(get_async_session),
    native_user: Optional[User] = Depends(_native_optional_user),
) -> User:
    """Return a native engine user or a mapped Clerk-backed FinCopilot user."""
    if native_user is not None:
        return native_user

    if not _clerk_enabled():
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    authorization = request.headers.get("Authorization", "")
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    token = authorization.split(" ", 1)[1].strip()
    claims = await _verify_clerk_token(token)
    return await _provision_clerk_user(session, claims)
