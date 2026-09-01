// src/app/api/session/route.ts
// Landing-side session bridge. Reads the `session` cookie and delegates
// verification to the backend's /api/v1/auth/verify endpoint (which uses
// Firebase Admin to actually verify the JWT). The landing never trusts the
// cookie locally — it always asks the backend.
//
// Cookie scope: the SPA at /app/* sets `session` with Path=/ so it's sent
// here too. The backend verifies via FirebaseAuthAdapter.

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET() {
  const cookieHeader = await readCookieHeader();

  if (!cookieHeader) {
    return Response.json(
      { loggedIn: false },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const resp = await fetch(`${BACKEND_URL}/api/v1/auth/verify`, {
      headers: { cookie: cookieHeader, Accept: "application/json" },
      // Don't let Next.js cache this — it's user-specific.
      cache: "no-store",
    });

    if (!resp.ok) {
      return Response.json(
        { loggedIn: false },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const data = await resp.json();
    return Response.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    // Backend unreachable — return not-logged-in rather than guessing.
    // In production this should never happen; if it does, the nav shows
    // "Start free" which is the safe fallback (user can still hit the CTA).
    console.error("[landing /api/session] backend verify failed:", err);
    return Response.json(
      { loggedIn: false, _error: "backend-unreachable" },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}

// Helper: read the raw Cookie header from the incoming Next.js request.
// In Next.js App Router, we read it from the `headers()` async API.
async function readCookieHeader(): Promise<string | null> {
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    const c = h.get("cookie");
    return c || null;
  } catch {
    return null;
  }
}
