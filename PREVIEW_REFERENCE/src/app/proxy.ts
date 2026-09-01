import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' blob: data: https:`,
    `font-src 'self' https://fonts.gstatic.com`,
    `connect-src 'self' https://api.posthog.com https://www.google-analytics.com`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-nonce", nonce);
  reqHeaders.set("Content-Security-Policy", csp);

  // Read session cookie and set x-logged-in for SSR nav rendering
  const session = req.cookies.get("session");
  reqHeaders.set("x-logged-in", session ? "1" : "0");

  const res = NextResponse.next({ request: { headers: reqHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  return res;
}

export const config = {
  // Run on everything EXCEPT: Next.js internals, static, api, app, tokens.css, robots.txt
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api|app|tokens.css|robots.txt|sitemap.xml).*)"],
};
