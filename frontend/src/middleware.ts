import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/i(.*)",
  "/api/v1/public/invoices(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // In development accessed from a LAN/mobile IP, Clerk cookies are scoped to
    // localhost and won't be present — skip server-side protection so the
    // client-side useResource hook can show the sign-in state gracefully.
    const host = req.headers.get("host") ?? "";
    const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
    if (process.env.NODE_ENV === "production" || isLocalhost) {
      await auth.protect();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
