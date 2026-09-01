(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/[root-of-the-server]__0qgus9p._.js",
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[project]/fincopilot-landing/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = /*#__PURE__*/ __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["clerkMiddleware"])(async (auth, req)=>{
    const nonce = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(crypto.randomUUID()).toString("base64");
    const isDev = ("TURBOPACK compile-time value", "development") === "development";
    const csp = [
        `default-src 'self'`,
        `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${("TURBOPACK compile-time truthy", 1) ? " 'unsafe-eval'" : "TURBOPACK unreachable"} https://clerk.com https://*.clerk.com https://*.clerk.accounts.dev`,
        `style-src 'self' 'nonce-${nonce}' 'unsafe-inline'`,
        `img-src 'self' blob: data: https:`,
        `font-src 'self' https://fonts.gstatic.com`,
        `connect-src 'self' https://api.posthog.com https://www.google-analytics.com https://clerk.com https://*.clerk.com https://*.clerk.accounts.dev`,
        `worker-src 'self' blob:`,
        `object-src 'none'`,
        `base-uri 'self'`,
        `form-action 'self'`,
        `frame-ancestors 'none'`,
        `upgrade-insecure-requests`
    ].join("; ");
    const reqHeaders = new Headers(req.headers);
    reqHeaders.set("x-nonce", nonce);
    reqHeaders.set("Content-Security-Policy", csp);
    const { userId } = await auth();
    reqHeaders.set("x-logged-in", userId ? "1" : "0");
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next({
        request: {
            headers: reqHeaders
        }
    });
    res.headers.set("Content-Security-Policy", csp);
    return res;
});
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|app|tokens.css|robots.txt|sitemap.xml).*)",
        "/(api|trpc)(.*)",
        "/__clerk/:path*"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__0qgus9p._.js.map