import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const dest = req.nextUrl.searchParams.get("dest") || "signup";
  const source = req.nextUrl.searchParams.get("source") || "unknown";

  // Server-side analytics (no ad-blocker loss).
  // Wire to GA4 Measurement Protocol / Mixpanel / PostHog when keys are available.
  // Example (commented — uncomment with real env keys):
  // await fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_ID}&api_secret=${process.env.GA4_SECRET}`, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     client_id: req.cookies.get("_ga")?.value || "anonymous",
  //     events: [{ name: "start_free_click", params: { source } }],
  //   }),
  // });

  // Cookie pre-seed — the app can read this client-side to personalize onboarding.
  const res = NextResponse.redirect(new URL(`/app/${dest}.html`, req.url), 302);
  res.cookies.set("landing_ref", source, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
