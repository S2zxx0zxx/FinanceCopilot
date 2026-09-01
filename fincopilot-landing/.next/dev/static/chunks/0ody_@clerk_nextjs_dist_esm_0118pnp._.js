(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/ClerkProvider.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientClerkProvider",
    ()=>ClientClerkProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$internal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/internal.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useSafeLayoutEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/useSafeLayoutEffect.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$NextOptionsContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/NextOptionsContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$errorThrower$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/server/errorThrower.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$feature$2d$flags$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/feature-flags.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$mergeNextClerkPropsWithEnv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/mergeNextClerkPropsWithEnv.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$router$2d$telemetry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/router-telemetry.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$data$3a$45ef89__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/data:45ef89 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$ClerkScripts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/ClerkScripts.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useAwaitablePush$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/useAwaitablePush.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useAwaitableReplace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/useAwaitableReplace.js [app-client] (ecmascript)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const NextClientClerkProvider = (props)=>{
    const { __internal_invokeMiddlewareOnAuthStateChange = true, __internal_scriptsSlot, children } = props;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const push = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useAwaitablePush$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAwaitablePush"])();
    const replace = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useAwaitableReplace$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAwaitableReplace"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useSafeLayoutEffect$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSafeLayoutEffect"])({
        "NextClientClerkProvider.useSafeLayoutEffect": ()=>{
            window.__internal_onBeforeSetActive = ({
                "NextClientClerkProvider.useSafeLayoutEffect": (intent)=>{
                    return new Promise({
                        "NextClientClerkProvider.useSafeLayoutEffect": (resolve)=>{
                            var _a;
                            const nextVersion = ((_a = window == null ? void 0 : window.next) == null ? void 0 : _a.version) || "";
                            if ((nextVersion.startsWith("15") || nextVersion.startsWith("16")) && intent === "sign-out") {
                                resolve();
                            } else {
                                void (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$data$3a$45ef89__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["invalidateCacheAction"])().then({
                                    "NextClientClerkProvider.useSafeLayoutEffect": ()=>resolve()
                                }["NextClientClerkProvider.useSafeLayoutEffect"]);
                            }
                        }
                    }["NextClientClerkProvider.useSafeLayoutEffect"]);
                }
            })["NextClientClerkProvider.useSafeLayoutEffect"];
            window.__internal_onAfterSetActive = ({
                "NextClientClerkProvider.useSafeLayoutEffect": ()=>{
                    if (__internal_invokeMiddlewareOnAuthStateChange) {
                        return router.refresh();
                    }
                }
            })["NextClientClerkProvider.useSafeLayoutEffect"];
        }
    }["NextClientClerkProvider.useSafeLayoutEffect"], []);
    const mergedProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$mergeNextClerkPropsWithEnv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeNextClerkPropsWithEnv"])({
        ...props,
        // @ts-expect-error Error because of the stricter types of internal `push`
        routerPush: push,
        // @ts-expect-error Error because of the stricter types of internal `replace`
        routerReplace: replace
    });
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$NextOptionsContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClerkNextOptionsProvider"], {
        options: mergedProps
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$internal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["InternalClerkProvider"], {
        ...mergedProps
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$router$2d$telemetry$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RouterTelemetry"], null), __internal_scriptsSlot != null ? __internal_scriptsSlot : /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$ClerkScripts$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClerkScripts"], null), children));
};
const ClientClerkProvider = (props)=>{
    const { children, disableKeyless = false, ...rest } = props;
    const safePublishableKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$mergeNextClerkPropsWithEnv$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeNextClerkPropsWithEnv"])(rest).publishableKey;
    const isNested = Boolean((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$NextOptionsContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClerkNextOptions"])());
    if (isNested) {
        if (rest.initialState) {
            return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InitialStateProvider"], {
                initialState: rest.initialState
            }, children);
        }
        return children;
    }
    if (safePublishableKey || !__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$feature$2d$flags$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseKeyless"] || disableKeyless) {
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(NextClientClerkProvider, {
            ...rest
        }, children);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$errorThrower$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["errorThrower"].throwMissingPublishableKeyError();
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/ClerkScripts.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkScripts",
    ()=>ClerkScripts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__$3c$export__s__as__useClerk$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useClerk as s> <export s as useClerk>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$NextOptionsContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/NextOptionsContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$clerk$2d$script$2d$tags$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/clerk-script-tags.js [app-client] (ecmascript)");
;
;
;
;
;
function ClerkScripts() {
    const { publishableKey, __internal_clerkJSUrl, __internal_clerkJSVersion, __internal_clerkUIUrl, __internal_clerkUIVersion, nonce, prefetchUI } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$NextOptionsContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useClerkNextOptions"])();
    const { domain, proxyUrl } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__$3c$export__s__as__useClerk$3e$__["useClerk"])();
    if (!publishableKey) {
        return null;
    }
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$clerk$2d$script$2d$tags$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ClerkScriptTags"], {
        publishableKey,
        __internal_clerkJSUrl,
        __internal_clerkJSVersion,
        __internal_clerkUIUrl,
        __internal_clerkUIVersion,
        nonce,
        domain,
        proxyUrl,
        prefetchUI
    });
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/useAwaitablePush.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAwaitablePush",
    ()=>useAwaitablePush
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useInternalNavFun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/useInternalNavFun.js [app-client] (ecmascript)");
"use client";
;
;
;
const useAwaitablePush = ()=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useInternalNavFun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInternalNavFun"])({
        windowNav: typeof window !== "undefined" ? window.history.pushState.bind(window.history) : void 0,
        routerNav: router.push.bind(router),
        name: "push"
    });
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/useAwaitableReplace.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAwaitableReplace",
    ()=>useAwaitableReplace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useInternalNavFun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/useInternalNavFun.js [app-client] (ecmascript)");
"use client";
;
;
;
const useAwaitableReplace = ()=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$app$2d$router$2f$client$2f$useInternalNavFun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useInternalNavFun"])({
        windowNav: typeof window !== "undefined" ? window.history.replaceState.bind(window.history) : void 0,
        routerNav: router.replace.bind(router),
        name: "replace"
    });
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/client/useInternalNavFun.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useInternalNavFun",
    ()=>useInternalNavFun
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$removeBasePath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/removeBasePath.js [app-client] (ecmascript)");
;
;
;
const getClerkNavigationObject = (name)=>{
    var _a, _b, _c;
    (_a = window.__clerk_internal_navigations) != null ? _a : window.__clerk_internal_navigations = {};
    (_c = (_b = window.__clerk_internal_navigations)[name]) != null ? _c : _b[name] = {};
    return window.__clerk_internal_navigations[name];
};
const useInternalNavFun = (props)=>{
    const { windowNav, routerNav, name } = props;
    const [isPending, startTransition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTransition"])();
    if (windowNav) {
        getClerkNavigationObject(name).fun = (to, opts)=>{
            var _a, _b;
            const nav = getClerkNavigationObject(name);
            if (((_b = (_a = nav.promisesBuffer) == null ? void 0 : _a.length) != null ? _b : 0) > 0 && nav.pendingDestination === to) {
                return new Promise((res)=>{
                    var _a2;
                    (_a2 = nav.promisesBuffer) != null ? _a2 : nav.promisesBuffer = [];
                    nav.promisesBuffer.push(res);
                });
            }
            nav.pendingDestination = to;
            return new Promise((res)=>{
                var _a2;
                (_a2 = nav.promisesBuffer) != null ? _a2 : nav.promisesBuffer = [];
                nav.promisesBuffer.push(res);
                startTransition(()=>{
                    var _a3;
                    if (((_a3 = opts == null ? void 0 : opts.__internal_metadata) == null ? void 0 : _a3.navigationType) === "internal") {
                        windowNav(null, "", to);
                    } else {
                        routerNav((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$utils$2f$removeBasePath$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["removeBasePath"])(to));
                    }
                });
            });
        };
    }
    const flushPromises = ()=>{
        var _a;
        const nav = getClerkNavigationObject(name);
        (_a = nav.promisesBuffer) == null ? void 0 : _a.forEach((resolve)=>resolve());
        nav.promisesBuffer = [];
        nav.pendingDestination = void 0;
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInternalNavFun.useEffect": ()=>{
            flushPromises();
            return flushPromises;
        }
    }["useInternalNavFun.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useInternalNavFun.useEffect": ()=>{
            if (!isPending) {
                flushPromises();
            }
        }
    }["useInternalNavFun.useEffect"], [
        isPending
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useInternalNavFun.useCallback": (to, metadata)=>{
            return getClerkNavigationObject(name).fun(to, metadata);
        }
    }["useInternalNavFun.useCallback"], []);
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/data:45ef89 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "invalidateCacheAction",
    ()=>$$RSC_SERVER_ACTION_0
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
/* __next_internal_action_entry_do_not_use__ [{"0098b50b89c81c09c8d4212bcbe7b69fcd81da0657":{"name":"invalidateCacheAction"}},"fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/app-router/server-actions.js",""] */ "use turbopack no side effects";
;
const $$RSC_SERVER_ACTION_0 = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("0098b50b89c81c09c8d4212bcbe7b69fcd81da0657", __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "invalidateCacheAction");
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/NextOptionsContext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkNextOptionsProvider",
    ()=>ClerkNextOptionsProvider,
    "useClerkNextOptions",
    ()=>useClerkNextOptions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
const ClerkNextOptionsCtx = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createContext(void 0);
ClerkNextOptionsCtx.displayName = "ClerkNextOptionsCtx";
const useClerkNextOptions = ()=>{
    const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useContext(ClerkNextOptionsCtx);
    return ctx == null ? void 0 : ctx.value;
};
const ClerkNextOptionsProvider = (props)=>{
    const { children, options } = props;
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(ClerkNextOptionsCtx.Provider, {
        value: {
            value: options
        }
    }, children);
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/controlComponents.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthenticateWithRedirectCallback",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__r__as__AuthenticateWithRedirectCallback$3e$__["AuthenticateWithRedirectCallback"],
    "ClerkDegraded",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__ClerkDegraded$3e$__["ClerkDegraded"],
    "ClerkFailed",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__ClerkFailed$3e$__["ClerkFailed"],
    "ClerkLoaded",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__ClerkLoaded$3e$__["ClerkLoaded"],
    "ClerkLoading",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__s__as__ClerkLoading$3e$__["ClerkLoading"],
    "MultisessionAppSupport",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__c__as__MultisessionAppSupport$3e$__["MultisessionAppSupport"],
    "RedirectToCreateOrganization",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__l__as__RedirectToCreateOrganization$3e$__["RedirectToCreateOrganization"],
    "RedirectToOrganizationProfile",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__RedirectToOrganizationProfile$3e$__["RedirectToOrganizationProfile"],
    "RedirectToSignIn",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__d__as__RedirectToSignIn$3e$__["RedirectToSignIn"],
    "RedirectToSignUp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__f__as__RedirectToSignUp$3e$__["RedirectToSignUp"],
    "RedirectToTasks",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__RedirectToTasks$3e$__["RedirectToTasks"],
    "RedirectToUserProfile",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__m__as__RedirectToUserProfile$3e$__["RedirectToUserProfile"],
    "Show",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__h__as__Show$3e$__["Show"],
    "UNSAFE_PortalProvider",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UNSAFE_PortalProvider"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$controlComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/controlComponents.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__r__as__AuthenticateWithRedirectCallback$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export r as AuthenticateWithRedirectCallback>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__ClerkDegraded$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export i as ClerkDegraded>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__ClerkFailed$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export a as ClerkFailed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__ClerkLoaded$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export o as ClerkLoaded>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__s__as__ClerkLoading$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export s as ClerkLoading>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__l__as__RedirectToCreateOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export l as RedirectToCreateOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__RedirectToOrganizationProfile$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export u as RedirectToOrganizationProfile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__d__as__RedirectToSignIn$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export d as RedirectToSignIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__f__as__RedirectToSignUp$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export f as RedirectToSignUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__RedirectToTasks$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export p as RedirectToTasks>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__m__as__RedirectToUserProfile$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export m as RedirectToUserProfile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__h__as__Show$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export h as Show>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__c__as__MultisessionAppSupport$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export c as MultisessionAppSupport>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/controlComponents.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__r__as__AuthenticateWithRedirectCallback$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export r as AuthenticateWithRedirectCallback>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__ClerkDegraded$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export i as ClerkDegraded>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__ClerkFailed$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export a as ClerkFailed>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__ClerkLoaded$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export o as ClerkLoaded>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__s__as__ClerkLoading$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export s as ClerkLoading>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__l__as__RedirectToCreateOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export l as RedirectToCreateOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__u__as__RedirectToOrganizationProfile$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export u as RedirectToOrganizationProfile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__d__as__RedirectToSignIn$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export d as RedirectToSignIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__f__as__RedirectToSignUp$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export f as RedirectToSignUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__RedirectToTasks$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export p as RedirectToTasks>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__m__as__RedirectToUserProfile$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export m as RedirectToUserProfile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__h__as__Show$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export h as Show>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$internal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/internal.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$ClerkProvider$2d$DY0lNOEl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__c__as__MultisessionAppSupport$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/ClerkProvider-DY0lNOEl.mjs [app-client] (ecmascript) <export c as MultisessionAppSupport>");
"use client";
;
;
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmailLinkErrorCode",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$__as__EmailLinkErrorCode$3e$__["EmailLinkErrorCode"],
    "EmailLinkErrorCodeStatus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v__as__EmailLinkErrorCodeStatus$3e$__["EmailLinkErrorCodeStatus"],
    "isClerkAPIResponseError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__isClerkAPIResponseError$3e$__["isClerkAPIResponseError"],
    "isClerkRuntimeError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__n__as__isClerkRuntimeError$3e$__["isClerkRuntimeError"],
    "isEmailLinkError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__isEmailLinkError$3e$__["isEmailLinkError"],
    "isKnownError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__isKnownError$3e$__["isKnownError"],
    "isMetamaskError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__s__as__isMetamaskError$3e$__["isMetamaskError"],
    "isReverificationCancelledError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__d__as__isReverificationCancelledError$3e$__["isReverificationCancelledError"],
    "useAPIKeys",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useAPIKeys__as__o$3e$__$3c$export__o__as__useAPIKeys$3e$__["useAPIKeys"],
    "useAuth",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__b__as__useAuth$3e$__["useAuth"],
    "useClerk",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__$3c$export__s__as__useClerk$3e$__["useClerk"],
    "useEmailLink",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__y__as__useEmailLink$3e$__["useEmailLink"],
    "useOAuthConsent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOAuthConsent__as__c$3e$__$3c$export__c__as__useOAuthConsent$3e$__["useOAuthConsent"],
    "useOrganization",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganization__as__l$3e$__$3c$export__l__as__useOrganization$3e$__["useOrganization"],
    "useOrganizationCreationDefaults",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganizationCreationDefaults__as__u$3e$__$3c$export__u__as__useOrganizationCreationDefaults$3e$__["useOrganizationCreationDefaults"],
    "useOrganizationList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganizationList__as__d$3e$__$3c$export__d__as__useOrganizationList$3e$__["useOrganizationList"],
    "useReverification",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useReverification__as__f$3e$__$3c$export__f__as__useReverification$3e$__["useReverification"],
    "useSession",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSession__as__p$3e$__$3c$export__p__as__useSession$3e$__["useSession"],
    "useSessionList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSessionList__as__m$3e$__$3c$export__m__as__useSessionList$3e$__["useSessionList"],
    "useSignIn",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__g__as__useSignIn$3e$__["useSignIn"],
    "useSignUp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__$5f$__as__useSignUp$3e$__["useSignUp"],
    "useUser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__h$3e$__$3c$export__h__as__useUser$3e$__["useUser"],
    "useWaitlist",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__v__as__useWaitlist$3e$__["useWaitlist"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__b__as__useAuth$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export b as useAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__$3c$export__s__as__useClerk$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useClerk as s> <export s as useClerk>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__y__as__useEmailLink$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export y as useEmailLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOAuthConsent__as__c$3e$__$3c$export__c__as__useOAuthConsent$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOAuthConsent as c> <export c as useOAuthConsent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganization__as__l$3e$__$3c$export__l__as__useOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOrganization as l> <export l as useOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganizationList__as__d$3e$__$3c$export__d__as__useOrganizationList$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOrganizationList as d> <export d as useOrganizationList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganizationCreationDefaults__as__u$3e$__$3c$export__u__as__useOrganizationCreationDefaults$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOrganizationCreationDefaults as u> <export u as useOrganizationCreationDefaults>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSession__as__p$3e$__$3c$export__p__as__useSession$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useSession as p> <export p as useSession>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSessionList__as__m$3e$__$3c$export__m__as__useSessionList$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useSessionList as m> <export m as useSessionList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__g__as__useSignIn$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export g as useSignIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__$5f$__as__useSignUp$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export _ as useSignUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__v__as__useWaitlist$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export v as useWaitlist>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__h$3e$__$3c$export__h__as__useUser$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useUser as h> <export h as useUser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useReverification__as__f$3e$__$3c$export__f__as__useReverification$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useReverification as f> <export f as useReverification>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useAPIKeys__as__o$3e$__$3c$export__o__as__useAPIKeys$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useAPIKeys as o> <export o as useAPIKeys>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__isClerkAPIResponseError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export C as isClerkAPIResponseError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__n__as__isClerkRuntimeError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-client] (ecmascript) <export n as isClerkRuntimeError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__isEmailLinkError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export a as isEmailLinkError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__isKnownError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export o as isKnownError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__s__as__isMetamaskError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export s as isMetamaskError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__d__as__isReverificationCancelledError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export d as isReverificationCancelledError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$__as__EmailLinkErrorCode$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export _ as EmailLinkErrorCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v__as__EmailLinkErrorCodeStatus$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export v as EmailLinkErrorCodeStatus>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__b__as__useAuth$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export b as useAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__$3c$export__s__as__useClerk$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useClerk as s> <export s as useClerk>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__y__as__useEmailLink$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export y as useEmailLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOAuthConsent__as__c$3e$__$3c$export__c__as__useOAuthConsent$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOAuthConsent as c> <export c as useOAuthConsent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganization__as__l$3e$__$3c$export__l__as__useOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOrganization as l> <export l as useOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganizationList__as__d$3e$__$3c$export__d__as__useOrganizationList$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOrganizationList as d> <export d as useOrganizationList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useOrganizationCreationDefaults__as__u$3e$__$3c$export__u__as__useOrganizationCreationDefaults$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useOrganizationCreationDefaults as u> <export u as useOrganizationCreationDefaults>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSession__as__p$3e$__$3c$export__p__as__useSession$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useSession as p> <export p as useSession>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSessionList__as__m$3e$__$3c$export__m__as__useSessionList$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useSessionList as m> <export m as useSessionList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__g__as__useSignIn$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export g as useSignIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__$5f$__as__useSignUp$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export _ as useSignUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__v__as__useWaitlist$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export v as useWaitlist>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__h$3e$__$3c$export__h__as__useUser$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useUser as h> <export h as useUser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useReverification__as__f$3e$__$3c$export__f__as__useReverification$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useReverification as f> <export f as useReverification>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useAPIKeys__as__o$3e$__$3c$export__o__as__useAPIKeys$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useAPIKeys as o> <export o as useAPIKeys>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$errors$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/errors.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__isClerkAPIResponseError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export C as isClerkAPIResponseError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__n__as__isClerkRuntimeError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-client] (ecmascript) <export n as isClerkRuntimeError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__a__as__isEmailLinkError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export a as isEmailLinkError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__o__as__isKnownError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export o as isKnownError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__s__as__isMetamaskError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export s as isMetamaskError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__d__as__isReverificationCancelledError$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export d as isReverificationCancelledError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$5f$__as__EmailLinkErrorCode$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export _ as EmailLinkErrorCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__v__as__EmailLinkErrorCodeStatus$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export v as EmailLinkErrorCodeStatus>");
"use client";
;
;
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/useEnforceCatchAllRoute.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEnforceCatchAllRoute",
    ()=>useEnforceCatchAllRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/utils/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__isProductionEnvironment$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-client] (ecmascript) <export i as isProductionEnvironment>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSession__as__p$3e$__$3c$export__p__as__useSession$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useSession as p> <export p as useSession>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePagesRouter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/usePagesRouter.js [app-client] (ecmascript)");
;
;
;
;
;
const useEnforceCatchAllRoute = (component, path, routing, requireSessionBeforeCheck = true)=>{
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef(0);
    const { pagesRouter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePagesRouter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePagesRouter"])();
    const { session, isLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useSession__as__p$3e$__$3c$export__p__as__useSession$3e$__["useSession"])();
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__isProductionEnvironment$3e$__["isProductionEnvironment"])()) {
        return;
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect({
        "useEnforceCatchAllRoute.useEffect": ()=>{
            if (!isLoaded || routing && routing !== "path") {
                return;
            }
            if (requireSessionBeforeCheck && !session) {
                return;
            }
            const ac = new AbortController();
            const error = {
                "useEnforceCatchAllRoute.useEffect.error": ()=>{
                    const correctPath = pagesRouter ? `${path}/[[...index]].tsx` : `${path}/[[...rest]]/page.tsx`;
                    throw new Error(`
Clerk: The <${component}/> component is not configured correctly. The most likely reasons for this error are:

1. The "${path}" route is not a catch-all route.
It is recommended to convert this route to a catch-all route, eg: "${correctPath}". Alternatively, you can update the <${component}/> component to use hash-based routing by setting the "routing" prop to "hash".

2. The <${component}/> component is mounted in a catch-all route, but all routes under "${path}" are protected by the middleware.
To resolve this, ensure that the middleware does not protect the catch-all route or any of its children. If you are using the "createRouteMatcher" helper, consider adding "(.*)" to the end of the route pattern, eg: "${path}(.*)". For more information, see: https://clerk.com/docs/reference/nextjs/clerk-middleware#create-route-matcher
`);
                }
            }["useEnforceCatchAllRoute.useEffect.error"];
            if (pagesRouter) {
                if (!pagesRouter.pathname.match(/\[\[\.\.\..+]]/)) {
                    error();
                }
            } else {
                const check = {
                    "useEnforceCatchAllRoute.useEffect.check": async ()=>{
                        ref.current++;
                        if (ref.current > 1) {
                            return;
                        }
                        let res;
                        try {
                            const url = `${window.location.origin}${window.location.pathname}/${component}_clerk_catchall_check_${Date.now()}`;
                            res = await fetch(url, {
                                signal: ac.signal
                            });
                        } catch  {}
                        if ((res == null ? void 0 : res.status) === 404) {
                            error();
                        }
                    }
                }["useEnforceCatchAllRoute.useEffect.check"];
                void check();
            }
            return ({
                "useEnforceCatchAllRoute.useEffect": ()=>{
                    if (ref.current > 1) {
                        ac.abort();
                    }
                }
            })["useEnforceCatchAllRoute.useEffect"];
        }
    }["useEnforceCatchAllRoute.useEffect"], [
        isLoaded
    ]);
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/useEnforceRoutingProps.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useEnforceCorrectRoutingProps",
    ()=>useEnforceCorrectRoutingProps
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$internal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/internal.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useEnforceCatchAllRoute$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/useEnforceCatchAllRoute.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePathnameWithoutCatchAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/usePathnameWithoutCatchAll.js [app-client] (ecmascript)");
;
;
;
;
function useEnforceCorrectRoutingProps(componentName, props, requireSessionBeforeCheck = true) {
    const path = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePathnameWithoutCatchAll$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathnameWithoutCatchAll"])();
    const routingProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$internal$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["useRoutingProps"])(componentName, props, {
        path
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useEnforceCatchAllRoute$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnforceCatchAllRoute"])(componentName, path, routingProps.routing, requireSessionBeforeCheck);
    return routingProps;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/usePagesRouter.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePagesRouter",
    ()=>usePagesRouter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$compat$2f$router$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/compat/router.js [app-client] (ecmascript)");
;
;
const usePagesRouter = ()=>{
    return {
        pagesRouter: (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$compat$2f$router$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])()
    };
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/usePathnameWithoutCatchAll.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePathnameWithoutCatchAll",
    ()=>usePathnameWithoutCatchAll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePagesRouter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/usePagesRouter.js [app-client] (ecmascript)");
;
;
;
const usePathnameWithoutCatchAll = ()=>{
    const pathRef = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useRef();
    const { pagesRouter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePagesRouter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePagesRouter"])();
    if (pagesRouter) {
        if (pathRef.current) {
            return pathRef.current;
        } else {
            pathRef.current = pagesRouter.pathname.replace(/\/\[\[\.\.\..*/, "");
            return pathRef.current;
        }
    }
    const usePathname = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/navigation.js [app-client] (ecmascript)").usePathname;
    const useParams = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/navigation.js [app-client] (ecmascript)").useParams;
    const pathname = usePathname() || "";
    const pathParts = pathname.split("/").filter(Boolean);
    const catchAllParams = Object.values(useParams() || {}).filter((v)=>Array.isArray(v)).flat(Infinity);
    if (pathRef.current) {
        return pathRef.current;
    } else {
        pathRef.current = `/${pathParts.slice(0, pathParts.length - catchAllParams.length).join("/")}`;
        return pathRef.current;
    }
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/useSafeLayoutEffect.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSafeLayoutEffect",
    ()=>useSafeLayoutEffect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
const useSafeLayoutEffect = typeof window !== "undefined" ? __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useLayoutEffect : __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].useEffect;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/uiComponents.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "APIKeys",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__S__as__APIKeys$3e$__["APIKeys"],
    "CreateOrganization",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__C__as__CreateOrganization$3e$__["CreateOrganization"],
    "GoogleOneTap",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__w__as__GoogleOneTap$3e$__["GoogleOneTap"],
    "HandleSSOCallback",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HandleSSOCallback"],
    "InviteMembersButton",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["InviteMembersButton"],
    "OAuthConsent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__T__as__OAuthConsent$3e$__["OAuthConsent"],
    "OrganizationList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__E__as__OrganizationList$3e$__["OrganizationList"],
    "OrganizationProfile",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$uiComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["OrganizationProfile"],
    "OrganizationSwitcher",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__O__as__OrganizationSwitcher$3e$__["OrganizationSwitcher"],
    "PricingTable",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__k__as__PricingTable$3e$__["PricingTable"],
    "SignIn",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$uiComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignIn"],
    "SignInButton",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignInButton"],
    "SignInWithMetamaskButton",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignInWithMetamaskButton"],
    "SignOutButton",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignOutButton"],
    "SignUp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$uiComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignUp"],
    "SignUpButton",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["SignUpButton"],
    "TaskChooseOrganization",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__M__as__TaskChooseOrganization$3e$__["TaskChooseOrganization"],
    "TaskResetPassword",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__N__as__TaskResetPassword$3e$__["TaskResetPassword"],
    "TaskSetupMFA",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__P__as__TaskSetupMFA$3e$__["TaskSetupMFA"],
    "UserAvatar",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__F__as__UserAvatar$3e$__["UserAvatar"],
    "UserButton",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__I__as__UserButton$3e$__["UserButton"],
    "UserProfile",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$uiComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["UserProfile"],
    "Waitlist",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__R__as__Waitlist$3e$__["Waitlist"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$uiComponents$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/uiComponents.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__S__as__APIKeys$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export S as APIKeys>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__C__as__CreateOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export C as CreateOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__w__as__GoogleOneTap$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export w as GoogleOneTap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__T__as__OAuthConsent$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export T as OAuthConsent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__E__as__OrganizationList$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export E as OrganizationList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__O__as__OrganizationSwitcher$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export O as OrganizationSwitcher>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__k__as__PricingTable$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export k as PricingTable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__M__as__TaskChooseOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export M as TaskChooseOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__N__as__TaskResetPassword$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export N as TaskResetPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__P__as__TaskSetupMFA$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export P as TaskSetupMFA>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__F__as__UserAvatar$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export F as UserAvatar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__I__as__UserButton$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export I as UserButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__R__as__Waitlist$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export R as Waitlist>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/uiComponents.js [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OrganizationProfile",
    ()=>OrganizationProfile,
    "SignIn",
    ()=>SignIn,
    "SignUp",
    ()=>SignUp,
    "UserProfile",
    ()=>UserProfile
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__D__as__OrganizationProfile$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export D as OrganizationProfile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__A__as__SignIn$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export A as SignIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__j__as__SignUp$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export j as SignUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__L__as__UserProfile$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export L as UserProfile>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useEnforceRoutingProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/useEnforceRoutingProps.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__S__as__APIKeys$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export S as APIKeys>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__C__as__CreateOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export C as CreateOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__w__as__GoogleOneTap$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export w as GoogleOneTap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__T__as__OAuthConsent$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export T as OAuthConsent>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__E__as__OrganizationList$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export E as OrganizationList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__O__as__OrganizationSwitcher$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export O as OrganizationSwitcher>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__k__as__PricingTable$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export k as PricingTable>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__M__as__TaskChooseOrganization$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export M as TaskChooseOrganization>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__N__as__TaskResetPassword$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export N as TaskResetPassword>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__P__as__TaskSetupMFA$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export P as TaskSetupMFA>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__F__as__UserAvatar$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export F as UserAvatar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__I__as__UserButton$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export I as UserButton>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__R__as__Waitlist$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/react/dist/hooks-74kNS3WZ.mjs [app-client] (ecmascript) <locals> <export R as Waitlist>");
"use client";
;
;
;
;
;
const UserProfile = Object.assign((props)=>{
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__L__as__UserProfile$3e$__["UserProfile"], {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useEnforceRoutingProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnforceCorrectRoutingProps"])("UserProfile", props)
    });
}, {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__L__as__UserProfile$3e$__["UserProfile"]
});
const OrganizationProfile = Object.assign((props)=>{
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__D__as__OrganizationProfile$3e$__["OrganizationProfile"], {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useEnforceRoutingProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnforceCorrectRoutingProps"])("OrganizationProfile", props)
    });
}, {
    ...__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__D__as__OrganizationProfile$3e$__["OrganizationProfile"]
});
const SignIn = (props)=>{
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__A__as__SignIn$3e$__["SignIn"], {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useEnforceRoutingProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnforceCorrectRoutingProps"])("SignIn", props, false)
    });
};
const SignUp = (props)=>{
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$74kNS3WZ$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__j__as__SignUp$3e$__["SignUp"], {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$useEnforceRoutingProps$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEnforceCorrectRoutingProps"])("SignUp", props, false)
    });
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/server/constants.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "API_URL",
    ()=>API_URL,
    "API_VERSION",
    ()=>API_VERSION,
    "CLERK_JS_URL",
    ()=>CLERK_JS_URL,
    "CLERK_JS_VERSION",
    ()=>CLERK_JS_VERSION,
    "CLERK_UI_URL",
    ()=>CLERK_UI_URL,
    "CLERK_UI_VERSION",
    ()=>CLERK_UI_VERSION,
    "DOMAIN",
    ()=>DOMAIN,
    "ENCRYPTION_KEY",
    ()=>ENCRYPTION_KEY,
    "IS_SATELLITE",
    ()=>IS_SATELLITE,
    "KEYLESS_DISABLED",
    ()=>KEYLESS_DISABLED,
    "MACHINE_SECRET_KEY",
    ()=>MACHINE_SECRET_KEY,
    "PROXY_URL",
    ()=>PROXY_URL,
    "PUBLISHABLE_KEY",
    ()=>PUBLISHABLE_KEY,
    "SDK_METADATA",
    ()=>SDK_METADATA,
    "SECRET_KEY",
    ()=>SECRET_KEY,
    "SIGN_IN_URL",
    ()=>SIGN_IN_URL,
    "SIGN_UP_URL",
    ()=>SIGN_UP_URL,
    "TELEMETRY_DEBUG",
    ()=>TELEMETRY_DEBUG,
    "TELEMETRY_DISABLED",
    ()=>TELEMETRY_DISABLED
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$apiUrlFromPublishableKey$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/apiUrlFromPublishableKey.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [app-client] (ecmascript)");
;
;
;
const CLERK_JS_VERSION = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_JS_VERSION || "";
const CLERK_JS_URL = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_JS_URL || "";
const CLERK_UI_URL = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_UI_URL || "";
const CLERK_UI_VERSION = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_UI_VERSION || "";
const API_VERSION = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_API_VERSION || "v1";
const SECRET_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_SECRET_KEY || "";
const MACHINE_SECRET_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_MACHINE_SECRET_KEY || "";
const PUBLISHABLE_KEY = ("TURBOPACK compile-time value", "pk_test_aGVhbHRoeS1hYXJkdmFyay02Nzg3LmNsZXJrLmFjY291bnRzLmRldiQ") || "";
const ENCRYPTION_KEY = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_ENCRYPTION_KEY || "";
const API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.CLERK_API_URL || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$apiUrlFromPublishableKey$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiUrlFromPublishableKey"])(PUBLISHABLE_KEY);
const DOMAIN = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_DOMAIN || "";
const PROXY_URL = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_PROXY_URL || "";
const IS_SATELLITE = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_IS_SATELLITE) || false;
const SIGN_IN_URL = ("TURBOPACK compile-time value", "/sign-in") || "";
const SIGN_UP_URL = ("TURBOPACK compile-time value", "/sign-up") || "";
const SDK_METADATA = {
    name: "@clerk/nextjs",
    version: "7.8.4",
    environment: ("TURBOPACK compile-time value", "development")
};
const TELEMETRY_DISABLED = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED);
const TELEMETRY_DEBUG = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG);
const KEYLESS_DISABLED = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_KEYLESS_DISABLED) || false;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/server/errorThrower.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "errorThrower",
    ()=>errorThrower
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$error$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/error.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__y__as__buildErrorThrower$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export y as buildErrorThrower>");
;
;
const errorThrower = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__y__as__buildErrorThrower$3e$__["buildErrorThrower"])({
    packageName: "@clerk/nextjs"
});
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/clerk-script-tags.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkScriptTags",
    ()=>ClerkScriptTags
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadClerkJsScript$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/loadClerkJsScript.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
;
;
function ClerkScriptTags(props) {
    const { publishableKey, __internal_clerkJSUrl, __internal_clerkJSVersion, __internal_clerkUIUrl, __internal_clerkUIVersion, nonce, domain, proxyUrl, prefetchUI } = props;
    const opts = {
        publishableKey,
        __internal_clerkJSUrl,
        __internal_clerkJSVersion,
        __internal_clerkUIUrl,
        __internal_clerkUIVersion,
        nonce,
        domain,
        proxyUrl
    };
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Fragment, null, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("script", {
        src: (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadClerkJsScript$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clerkJSScriptUrl"])(opts),
        "data-clerk-js-script": true,
        async: true,
        crossOrigin: "anonymous",
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadClerkJsScript$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["buildClerkJSScriptAttributes"])(opts)
    }), prefetchUI !== false && /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("link", {
        rel: "preload",
        href: (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadClerkJsScript$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clerkUIScriptUrl"])(opts),
        as: "script",
        crossOrigin: "anonymous",
        nonce
    }));
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/feature-flags.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "canUseKeyless",
    ()=>canUseKeyless
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/utils/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__n__as__isAutomatedEnvironment$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-client] (ecmascript) <export n as isAutomatedEnvironment>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__r__as__isDevelopmentEnvironment$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-client] (ecmascript) <export r as isDevelopmentEnvironment>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/server/constants.js [app-client] (ecmascript)");
;
;
;
const canUseKeyless = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__r__as__isDevelopmentEnvironment$3e$__["isDevelopmentEnvironment"])() && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__n__as__isAutomatedEnvironment$3e$__["isAutomatedEnvironment"])() && !__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KEYLESS_DISABLED"];
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/mergeNextClerkPropsWithEnv.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeNextClerkPropsWithEnv",
    ()=>mergeNextClerkPropsWithEnv
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/server/constants.js [app-client] (ecmascript)");
;
;
;
;
function getPrefetchUIFromEnvAndProps(propsPrefetchUI) {
    if (propsPrefetchUI === false) {
        return false;
    }
    if (__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_PREFETCH_UI === "false") {
        return false;
    }
    return void 0;
}
const mergeNextClerkPropsWithEnv = (props)=>{
    var _a;
    const publishableKey = props.publishableKey || ("TURBOPACK compile-time value", "pk_test_aGVhbHRoeS1hYXJkdmFyay02Nzg3LmNsZXJrLmFjY291bnRzLmRldiQ") || "";
    const proxyUrl = props.proxyUrl || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_PROXY_URL || "";
    const domain = props.domain || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_DOMAIN || "";
    return {
        ...props,
        publishableKey,
        __internal_clerkJSUrl: props.__internal_clerkJSUrl || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_JS_URL,
        __internal_clerkJSVersion: props.__internal_clerkJSVersion || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_JS_VERSION,
        __internal_clerkUIUrl: props.__internal_clerkUIUrl || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_UI_URL,
        __internal_clerkUIVersion: props.__internal_clerkUIVersion || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_UI_VERSION,
        prefetchUI: getPrefetchUIFromEnvAndProps(props.prefetchUI),
        proxyUrl: proxyUrl || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAutoProxyUrlFromEnvironment"])({
            hasDomain: !!domain,
            hasProxyUrl: !!proxyUrl,
            publishableKey
        }),
        domain,
        isSatellite: props.isSatellite || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_IS_SATELLITE),
        signInUrl: props.signInUrl || ("TURBOPACK compile-time value", "/sign-in") || "",
        signUpUrl: props.signUpUrl || ("TURBOPACK compile-time value", "/sign-up") || "",
        signInForceRedirectUrl: props.signInForceRedirectUrl || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL || "",
        signUpForceRedirectUrl: props.signUpForceRedirectUrl || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL || "",
        signInFallbackRedirectUrl: props.signInFallbackRedirectUrl || ("TURBOPACK compile-time value", "/") || "",
        signUpFallbackRedirectUrl: props.signUpFallbackRedirectUrl || ("TURBOPACK compile-time value", "/") || "",
        newSubscriptionRedirectUrl: props.newSubscriptionRedirectUrl || __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_CHECKOUT_CONTINUE_URL || "",
        telemetry: (_a = props.telemetry) != null ? _a : {
            disabled: (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED),
            debug: (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_TELEMETRY_DEBUG)
        },
        sdkMetadata: __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$constants$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SDK_METADATA"],
        unsafe_disableDevelopmentModeConsoleWarning: (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isTruthy"])(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_CLERK_UNSAFE_DISABLE_DEVELOPMENT_MODE_CONSOLE_WARNING)
    };
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/removeBasePath.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "removeBasePath",
    ()=>removeBasePath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
;
function removeBasePath(to) {
    let destination = to;
    const basePath = ("TURBOPACK compile-time value", "");
    if (basePath && destination.startsWith(basePath)) //TURBOPACK unreachable
    ;
    return destination;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/utils/router-telemetry.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RouterTelemetry",
    ()=>RouterTelemetry
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$telemetry$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/telemetry.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__eventFrameworkMetadata$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-client] (ecmascript) <export i as eventFrameworkMetadata>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__$3c$export__s__as__useClerk$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useClerk as s> <export s as useClerk>");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePagesRouter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/nextjs/dist/esm/client-boundary/hooks/usePagesRouter.js [app-client] (ecmascript)");
;
;
;
;
const RouterTelemetry = ()=>{
    var _a, _b;
    const clerk = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__$3c$export__s__as__useClerk$3e$__["useClerk"])();
    const { pagesRouter } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$client$2d$boundary$2f$hooks$2f$usePagesRouter$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePagesRouter"])();
    (_b = clerk.telemetry) == null ? void 0 : _b.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__i__as__eventFrameworkMetadata$3e$__["eventFrameworkMetadata"])({
        router: pagesRouter ? "pages" : "app",
        ...((_a = globalThis == null ? void 0 : globalThis.next) == null ? void 0 : _a.version) ? {
            nextjsVersion: globalThis.next.version
        } : {}
    }));
    return null;
};
;
}),
]);

//# sourceMappingURL=0ody_%40clerk_nextjs_dist_esm_0118pnp._.js.map