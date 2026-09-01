import { cookies } from "next/headers";

export async function GET() {
  const c = (await cookies()).get("session");
  if (!c) {
    return Response.json({ loggedIn: false }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
  try {
    // verifyJwt must match the app's session format.
    // For the demo (no real app auth wired), return a mock logged-in state
    // when a session cookie exists. Replace with real verification when the
    // app's auth is integrated.
    const user = await verifyJwt(c.value);
    return Response.json({ loggedIn: true, user }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ loggedIn: false }, {
      headers: { "Cache-Control": "no-store" },
    });
  }
}

async function verifyJwt(token: string): Promise<{ email: string; name: string; id: string }> {
  // TODO(app): implement real verification to match the app's session format.
  // If the app uses an opaque session ID stored in DB, look it up here.
  // If the app uses a JWT, verify with the same secret the app uses.
  // For now, return a demo user when any session cookie is present.
  if (!token || token.length < 4) throw new Error("invalid");
  return { email: "demo@fincopilot.ai", name: "Demo", id: "demo" };
}
