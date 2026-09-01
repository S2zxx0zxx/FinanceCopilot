// src/app/api/cta/route.ts
// Landing CTA bridge. Logs the click server-side (no ad-blocker loss), sets a
// `landing_ref` cookie so the SPA can personalize onboarding, and 302-redirects
// to the SPA's login route (which handles both login + signup via Firebase OAuth).
//
// The SPA has NO /signup.html — it has a /login route that handles both flows.
// So we redirect to /app/login (the SPA's auth entry point), not a static file.

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const dest = req.nextUrl.searchParams.get("dest") ?? "login";
  const source = req.nextUrl.searchParams.get("source") ?? "unknown";

  // 1. Server-side analytics fire (no ad-blocker loss).
  // Uncomment and wire to your analytics provider:
  // await fetch(`https://www.google-analytics.com/mp/collect?...`);
  // await fetch(`https://app.posthog.com/capture`, { method: 'POST', body: JSON.stringify({ event: 'cta_clicked', properties: { source, dest } }) });

  // 2. Allowlist valid SPA destinations (security: prevent open redirect).
  // The SPA's router (frontend/public/app.js) defines these routes.
  const allowedDests = ["login", "dashboard", "onboarding", "contact", "pricing"];
  const safeDest = allowedDests.includes(dest) ? dest : "login";

  // 3. Build redirect URL — /app/<dest> (SPA route, NOT a static .html file).
  // The SPA's app.js catches /app/login, /app/dashboard etc. via its router.
  const redirectUrl = new URL(`/app/${safeDest}`, req.url);

  // 4. Set landing_ref cookie (Path=/, SameSite=Lax, 30 days).
  // The SPA at /app/* reads this client-side to personalize the onboarding flow.
  const res = NextResponse.redirect(redirectUrl, 302);
  res.cookies.set("landing_ref", source, {
    path: "/",
    httpOnly: false,        // needs to be readable by the SPA's client JS
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,  // 30 days
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
