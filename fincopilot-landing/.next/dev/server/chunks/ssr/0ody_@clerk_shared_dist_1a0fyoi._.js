module.exports = [
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>createErrorTypeGuard,
    "i",
    ()=>isClerkError,
    "n",
    ()=>isClerkRuntimeError,
    "r",
    ()=>ClerkError,
    "t",
    ()=>ClerkRuntimeError
]);
//#region src/errors/createErrorTypeGuard.ts
/**
* Creates a type guard function for any error class.
* The returned function can be called as a standalone function or as a method on an error object.
*
* @example
* ```typescript
* class MyError extends Error {}
* const isMyError = createErrorTypeGuard(MyError);
*
* // As a standalone function
* if (isMyError(error)) { ... }
*
* // As a method (when attached to error object)
* if (error.isMyError()) { ... }
* ```
*/ function createErrorTypeGuard(ErrorClass) {
    function typeGuard(error) {
        const target = error ?? this;
        if (!target) throw new TypeError(`${ErrorClass.kind || ErrorClass.name} type guard requires an error object`);
        if (ErrorClass.kind && typeof target === "object" && target !== null && "constructor" in target) {
            if (target.constructor?.kind === ErrorClass.kind) return true;
        }
        return target instanceof ErrorClass;
    }
    return typeGuard;
}
//#endregion
//#region src/errors/clerkError.ts
var ClerkError = class ClerkError extends Error {
    static kind = "ClerkError";
    clerkError = true;
    code;
    longMessage;
    docsUrl;
    cause;
    get name() {
        return this.constructor.name;
    }
    constructor(opts){
        super(new.target.formatMessage(new.target.kind, opts.message, opts.code, opts.docsUrl), {
            cause: opts.cause
        });
        Object.setPrototypeOf(this, ClerkError.prototype);
        this.code = opts.code;
        this.docsUrl = opts.docsUrl;
        this.longMessage = opts.longMessage;
        this.cause = opts.cause;
    }
    toString() {
        return `[${this.name}]\nMessage:${this.message}`;
    }
    static formatMessage(name, msg, code, docsUrl) {
        const prefix = "Clerk:";
        const regex = new RegExp(prefix.replace(" ", "\\s*"), "i");
        msg = msg.replace(regex, "");
        msg = `${prefix} ${msg.trim()}\n\n(code="${code}")\n\n`;
        if (docsUrl) msg += `\n\nDocs: ${docsUrl}`;
        return msg;
    }
};
/**
* Type guard to check if a value is a ClerkError instance.
*/ function isClerkError(val) {
    return createErrorTypeGuard(ClerkError)(val) || !!val && typeof val === "object" && "clerkError" in val && val.clerkError === true;
}
//#endregion
//#region src/errors/clerkRuntimeError.ts
/**
* Custom error class for representing Clerk runtime errors.
*
* @class ClerkRuntimeError
*
* @example
*   throw new ClerkRuntimeError('An error occurred', { code: 'password_invalid' });
*/ var ClerkRuntimeError = class ClerkRuntimeError extends ClerkError {
    static kind = "ClerkRuntimeError";
    /**
	* @deprecated Use `clerkError` property instead. This property is maintained for backward compatibility.
	*/ clerkRuntimeError = true;
    constructor(message, options){
        super({
            ...options,
            message
        });
        Object.setPrototypeOf(this, ClerkRuntimeError.prototype);
    }
};
/**
* Type guard to check if an error is a ClerkRuntimeError.
* Can be called as a standalone function or as a method on an error object.
*
* @example
* // As a standalone function
* if (isClerkRuntimeError(error)) { ... }
*
* // As a method (when attached to error object)
* if (error.isClerkRuntimeError()) { ... }
*/ const isClerkRuntimeError = createErrorTypeGuard(ClerkRuntimeError);
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript) <export n as isClerkRuntimeError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isClerkRuntimeError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["n"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript) <export t as ClerkRuntimeError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkRuntimeError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/createDeferredPromise-DNC587Fa.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>createDeferredPromise
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/noop-LBsrDrTs.mjs [app-ssr] (ecmascript)");
;
//#region src/utils/createDeferredPromise.ts
/**
* Create a promise that can be resolved or rejected from
* outside the Promise constructor callback
* A ES6 compatible utility that implements `Promise.withResolvers`
*
* @internal
*/ const createDeferredPromise = ()=>{
    let resolve = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"];
    let reject = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"];
    return {
        promise: new Promise((res, rej)=>{
            resolve = res;
            reject = rej;
        }),
        resolve,
        reject
    };
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "C",
    ()=>isClerkAPIResponseError,
    "D",
    ()=>ClerkAPIError,
    "E",
    ()=>parseErrors,
    "O",
    ()=>isClerkAPIError,
    "S",
    ()=>ClerkAPIResponseError,
    "T",
    ()=>parseError,
    "_",
    ()=>EmailLinkErrorCode,
    "a",
    ()=>isEmailLinkError,
    "b",
    ()=>ClerkOfflineError,
    "c",
    ()=>isNetworkError,
    "d",
    ()=>isReverificationCancelledError,
    "f",
    ()=>isUnauthenticatedError,
    "g",
    ()=>EmailLinkError,
    "h",
    ()=>ClerkWebAuthnError,
    "i",
    ()=>isCaptchaError,
    "l",
    ()=>isPasswordCompromisedError,
    "m",
    ()=>isUserLockedError,
    "n",
    ()=>is429Error,
    "o",
    ()=>isKnownError,
    "p",
    ()=>isUnauthorizedError,
    "r",
    ()=>is4xxError,
    "s",
    ()=>isMetamaskError,
    "t",
    ()=>createClerkGlobalHookError,
    "u",
    ()=>isPasswordPwnedError,
    "v",
    ()=>EmailLinkErrorCodeStatus,
    "w",
    ()=>errorToJSON,
    "x",
    ()=>MissingExpiredTokenError,
    "y",
    ()=>buildErrorThrower
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)");
;
//#region src/errors/clerkApiError.ts
/**
* This error contains the specific error message, code, and any additional metadata that was returned by the Clerk API.
*/ var ClerkAPIError = class {
    static kind = "ClerkAPIError";
    code;
    message;
    longMessage;
    meta;
    constructor(json){
        const parsedError = {
            code: json.code,
            message: json.message,
            longMessage: json.long_message,
            meta: {
                paramName: json.meta?.param_name,
                sessionId: json.meta?.session_id,
                emailAddresses: json.meta?.email_addresses,
                identifiers: json.meta?.identifiers,
                zxcvbn: json.meta?.zxcvbn,
                plan: json.meta?.plan,
                isPlanUpgradePossible: json.meta?.is_plan_upgrade_possible,
                seatsQuantityToAdd: json.meta?.seats_quantity_to_add,
                seatsQuantity: json.meta?.seats_quantity
            }
        };
        this.code = parsedError.code;
        this.message = parsedError.message;
        this.longMessage = parsedError.longMessage;
        this.meta = parsedError.meta;
    }
};
/**
* Type guard to check if a value is a ClerkAPIError instance.
*/ const isClerkAPIError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(ClerkAPIError);
//#endregion
//#region src/errors/parseError.ts
/**
* Parses an array of ClerkAPIErrorJSON objects into an array of ClerkAPIError objects.
*
* @internal
*/ function parseErrors(data = []) {
    return data.length > 0 ? data.map((e)=>new ClerkAPIError(e)) : [];
}
/**
* Parses a ClerkAPIErrorJSON object into a ClerkAPIError object.
*
* @deprecated Use `ClerkAPIError` class instead
*
* @internal
*/ function parseError(error) {
    return new ClerkAPIError(error);
}
/**
* Converts a ClerkAPIError object into a ClerkAPIErrorJSON object.
*
* @internal
*/ function errorToJSON(error) {
    return {
        code: error?.code || "",
        message: error?.message || "",
        long_message: error?.longMessage,
        meta: {
            param_name: error?.meta?.paramName,
            session_id: error?.meta?.sessionId,
            email_addresses: error?.meta?.emailAddresses,
            identifiers: error?.meta?.identifiers,
            zxcvbn: error?.meta?.zxcvbn,
            plan: error?.meta?.plan,
            is_plan_upgrade_possible: error?.meta?.isPlanUpgradePossible,
            seats_quantity_to_add: error?.meta?.seatsQuantityToAdd,
            seats_quantity: error?.meta?.seatsQuantity
        }
    };
}
//#endregion
//#region src/errors/clerkApiResponseError.ts
var ClerkAPIResponseError = class ClerkAPIResponseError extends __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["r"] {
    static kind = "ClerkAPIResponseError";
    status;
    clerkTraceId;
    retryAfter;
    errors;
    constructor(message, options){
        const { data: errorsJson, status, clerkTraceId, retryAfter } = options;
        super({
            ...options,
            message,
            code: "api_response_error"
        });
        Object.setPrototypeOf(this, ClerkAPIResponseError.prototype);
        this.status = status;
        this.clerkTraceId = clerkTraceId;
        this.retryAfter = retryAfter;
        this.errors = (errorsJson || []).map((e)=>new ClerkAPIError(e));
    }
    toString() {
        let message = `[${this.name}]\nMessage:${this.message}\nStatus:${this.status}\nSerialized errors: ${this.errors.map((e)=>JSON.stringify(e))}`;
        if (this.clerkTraceId) message += `\nClerk Trace ID: ${this.clerkTraceId}`;
        return message;
    }
    static formatMessage(name, msg, _, __) {
        return msg;
    }
};
/**
* Type guard to check if an error is a ClerkAPIResponseError.
* Can be called as a standalone function or as a method on an error object.
*
* @example
* // As a standalone function
* if (isClerkAPIResponseError(error)) { ... }
*
* // As a method (when attached to error object)
* if (error.isClerkAPIResponseError()) { ... }
*/ const isClerkAPIResponseError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(ClerkAPIResponseError);
//#endregion
//#region src/errors/missingExpiredTokenError.ts
/**
* Error class representing a missing expired token error from the API.
* This error occurs when the server requires an expired token to mint a new session token.
*
* Use the static `is` method to check if a ClerkAPIResponseError matches this error type.
*
* @example
* ```typescript
* if (MissingExpiredTokenError.is(error)) {
*   // Handle the missing expired token error
* }
* ```
*/ var MissingExpiredTokenError = class MissingExpiredTokenError extends ClerkAPIResponseError {
    static kind = "MissingExpiredTokenError";
    static ERROR_CODE = "missing_expired_token";
    static STATUS = 422;
    /**
	* Type guard to check if an error is a MissingExpiredTokenError.
	* This checks the error's properties (status and error code) rather than instanceof,
	* allowing it to work with ClerkAPIResponseError instances thrown from the API layer.
	*
	* @example
	* ```typescript
	* try {
	*   await someApiCall();
	* } catch (e) {
	*   if (MissingExpiredTokenError.is(e)) {
	*     // e is typed as ClerkAPIResponseError with the specific error properties
	*   }
	* }
	* ```
	*/ static is(err) {
        return isClerkAPIResponseError(err) && err.status === MissingExpiredTokenError.STATUS && err.errors.length > 0 && err.errors[0].code === MissingExpiredTokenError.ERROR_CODE;
    }
};
//#endregion
//#region src/errors/clerkOfflineError.ts
/**
* Error thrown when a network request fails due to the client being offline.
*
* This error is thrown instead of returning `null` to make it explicit that
* the failure was due to network conditions, not authentication state.
*
* @example
* ```typescript
* try {
*   const token = await session.getToken();
* } catch (error) {
*   if (ClerkOfflineError.is(error)) {
*     // Handle offline scenario
*     showOfflineScreen();
*   }
* }
* ```
*/ var ClerkOfflineError = class ClerkOfflineError extends __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"] {
    static kind = "ClerkOfflineError";
    static ERROR_CODE = "clerk_offline";
    constructor(message){
        super(message, {
            code: ClerkOfflineError.ERROR_CODE
        });
        Object.setPrototypeOf(this, ClerkOfflineError.prototype);
    }
    /**
	* Type guard to check if an error is a ClerkOfflineError.
	* This checks both instanceof and the error code to support cross-bundle/cross-realm errors
	*
	* @example
	* ```typescript
	* try {
	*   const token = await session.getToken();
	* } catch (error) {
	*   if (ClerkOfflineError.is(error)) {
	*     // error is typed as ClerkOfflineError
	*     console.log('User is offline');
	*   }
	* }
	* ```
	*/ static is(error) {
        if (error === null || error === void 0) return false;
        return error instanceof ClerkOfflineError || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["n"])(error) && error.code === ClerkOfflineError.ERROR_CODE;
    }
};
//#endregion
//#region src/errors/errorThrower.ts
const DefaultMessages = Object.freeze({
    InvalidProxyUrlErrorMessage: `The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})`,
    InvalidPublishableKeyErrorMessage: `The publishableKey passed to Clerk is invalid (key={{key}}, expected format: pk_test_... or pk_live_...). To create a Clerk application with valid keys, in your terminal run:

npx clerk@latest init

\`npx clerk@latest init\` creates a Clerk application and writes keys to your .env file. No Clerk account or login required and the command is non-interactive.

If you have a Clerk application, run \`npx clerk@latest env pull\` to write the keys (\`--instance prod\` for production keys). Or copy its Publishable key from https://dashboard.clerk.com/last-active?path=api-keys.`,
    MissingPublishableKeyErrorMessage: `Missing publishableKey. To set up Clerk for this project, in your terminal run:

npx clerk@latest init

\`npx clerk@latest init\` creates a Clerk application and writes keys to your .env file. No Clerk account or login required and the command is non-interactive.

If you have a Clerk application, run \`npx clerk@latest env pull\` to write the keys. Or copy them from https://dashboard.clerk.com/last-active?path=api-keys. Deploy a production instance by running \`npx clerk@latest deploy\`, or \`npx clerk@latest env pull --instance prod\` to use an existing one.`,
    MissingSecretKeyErrorMessage: `Missing secretKey. To set up Clerk for this project, in your terminal run:

npx clerk@latest init

\`npx clerk@latest init\` creates a Clerk application and writes keys to your .env file. No Clerk account or login required and the command is non-interactive.

If you have a Clerk application, run \`npx clerk@latest env pull\` to write the keys. Or copy them from https://dashboard.clerk.com/last-active?path=api-keys. Deploy a production instance by running \`npx clerk@latest deploy\`, or \`npx clerk@latest env pull --instance prod\` to use an existing one.`,
    MissingClerkProvider: `{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider`
});
/**
* Builds an error thrower.
*
* @internal
*/ function buildErrorThrower({ packageName, customMessages }) {
    let pkg = packageName;
    /**
	* Builds a message from a raw message and replacements.
	*
	* @internal
	*/ function buildMessage(rawMessage, replacements) {
        if (!replacements) return `${pkg}: ${rawMessage}`;
        let msg = rawMessage;
        const matches = rawMessage.matchAll(/{{([a-zA-Z0-9-_]+)}}/g);
        for (const match of matches){
            const replacement = (replacements[match[1]] || "").toString();
            msg = msg.replace(`{{${match[1]}}}`, replacement);
        }
        return `${pkg}: ${msg}`;
    }
    const messages = {
        ...DefaultMessages,
        ...customMessages
    };
    return {
        setPackageName ({ packageName }) {
            if (typeof packageName === "string") pkg = packageName;
            return this;
        },
        setMessages ({ customMessages }) {
            Object.assign(messages, customMessages || {});
            return this;
        },
        throwInvalidPublishableKeyError (params) {
            throw new Error(buildMessage(messages.InvalidPublishableKeyErrorMessage, params));
        },
        throwInvalidProxyUrl (params) {
            throw new Error(buildMessage(messages.InvalidProxyUrlErrorMessage, params));
        },
        throwMissingPublishableKeyError () {
            throw new Error(buildMessage(messages.MissingPublishableKeyErrorMessage));
        },
        throwMissingSecretKeyError () {
            throw new Error(buildMessage(messages.MissingSecretKeyErrorMessage));
        },
        throwMissingClerkProviderError (params) {
            throw new Error(buildMessage(messages.MissingClerkProvider, params));
        },
        throw (message) {
            throw new Error(buildMessage(message));
        }
    };
}
//#endregion
//#region src/errors/emailLinkError.ts
var EmailLinkError = class EmailLinkError extends Error {
    code;
    constructor(code){
        super(code);
        this.code = code;
        this.name = "EmailLinkError";
        Object.setPrototypeOf(this, EmailLinkError.prototype);
    }
};
/**
* @deprecated Use `EmailLinkErrorCodeStatus` instead.
*
* @internal
*/ const EmailLinkErrorCode = {
    Expired: "expired",
    Failed: "failed",
    ClientMismatch: "client_mismatch"
};
const EmailLinkErrorCodeStatus = {
    Expired: "expired",
    Failed: "failed",
    ClientMismatch: "client_mismatch"
};
//#endregion
//#region src/errors/webAuthNError.ts
var ClerkWebAuthnError = class extends __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"] {
    /**
	* A unique code identifying the error, can be used for localization.
	*/ code;
    constructor(message, options){
        super(message, options);
        this.code = options.code;
    }
};
//#endregion
//#region src/errors/helpers.ts
/**
* Checks if the provided error object is an unauthorized error.
*
* @internal
*
* @deprecated This is no longer used, and will be removed in the next major version.
*/ function isUnauthorizedError(e) {
    const status = e?.status;
    return e?.errors?.[0]?.code === "authentication_invalid" && status === 401;
}
/**
* Checks if the provided error object is a captcha error.
*
* @internal
*/ function isCaptchaError(e) {
    return [
        "captcha_invalid",
        "captcha_not_enabled",
        "captcha_missing_token"
    ].includes(e.errors[0].code);
}
/**
* Checks if the provided error is a 4xx error.
*
* @internal
*/ function is4xxError(e) {
    const status = e?.status;
    return !!status && status >= 400 && status < 500;
}
/**
* Checks if the provided error is a 429 (Too Many Requests) error.
*
* @internal
*/ function is429Error(e) {
    return e?.status === 429;
}
const unauthenticated403ErrorCodes = new Set([
    "user_banned",
    "user_deactivated"
]);
/**
* Checks if the provided error indicates the user's session is no longer valid
* and should trigger the unauthenticated flow (e.g. sign-out / redirect to sign-in).
*
* Only matches explicit authentication failure status codes:
* - 401: session is invalid or expired
* - 422: invalid session state (e.g. missing_expired_token)
* - 403: terminal user state (e.g. user_banned, user_deactivated)
*
* 404 is intentionally excluded despite being returned for "session not found",
* because it's also returned for unrelated resources (org not found, JWT template
* not found) and shares the same `resource_not_found` error code, making it
* impossible to distinguish. Session-not-found 401s are already handled directly
* by Base._fetch.
*
* @internal
*/ function isUnauthenticatedError(e) {
    const status = e?.status;
    const hasTerminalUserErrorCode = Array.isArray(e?.errors) && e.errors.some((error)=>unauthenticated403ErrorCodes.has(error?.code));
    return status === 401 || status === 422 || status === 403 && hasTerminalUserErrorCode;
}
/**
* Checks if the provided error is a network error.
*
* @internal
*/ function isNetworkError(e) {
    return (`${e.message}${e.name}` || "").toLowerCase().replace(/\s+/g, "").includes("networkerror");
}
/**
* Checks if the provided error is either a ClerkAPIResponseError, a ClerkRuntimeError, or a MetamaskError.
*/ function isKnownError(error) {
    return isClerkAPIResponseError(error) || isMetamaskError(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["n"])(error);
}
/**
* Checks if the provided error is a Clerk runtime error indicating a reverification was cancelled.
*/ function isReverificationCancelledError(err) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["n"])(err) && err.code === "reverification_cancelled";
}
/**
* Checks if the provided error is a Metamask error.
*/ function isMetamaskError(err) {
    return "code" in err && [
        4001,
        32602,
        32603
    ].includes(err.code) && "message" in err;
}
/**
* Checks if the provided error is clerk api response error indicating a user is locked.
*/ function isUserLockedError(err) {
    return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "user_locked";
}
/**
* Checks if the provided error is a clerk api response error indicating a password was pwned.
*
* @internal
*/ function isPasswordPwnedError(err) {
    return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "form_password_pwned";
}
/**
* Checks if the provided error is a clerk api response error indicating a password was compromised.
*
* @internal
*/ function isPasswordCompromisedError(err) {
    return isClerkAPIResponseError(err) && err.errors?.[0]?.code === "form_password_compromised";
}
/**
* Checks if the provided error is an EmailLinkError.
*/ function isEmailLinkError(err) {
    return err.name === "EmailLinkError";
}
//#endregion
//#region src/errors/globalHookError.ts
/**
* Creates a ClerkGlobalHookError object from a ClerkError instance.
* It's a wrapper for all the different instances of Clerk errors that can
* be returned when using Clerk hooks.
*/ function createClerkGlobalHookError(error) {
    const predicates = {
        isClerkAPIResponseError,
        isClerkRuntimeError: __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["n"]
    };
    for (const [name, fn] of Object.entries(predicates))Object.assign(error, {
        [name]: fn
    });
    return error;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export C as isClerkAPIResponseError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isClerkAPIResponseError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["C"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export S as ClerkAPIResponseError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkAPIResponseError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["S"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export _ as EmailLinkErrorCode>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmailLinkErrorCode",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["_"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export a as isEmailLinkError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isEmailLinkError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export b as ClerkOfflineError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkOfflineError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["b"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export d as isReverificationCancelledError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isReverificationCancelledError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["d"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export o as isKnownError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isKnownError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["o"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export s as isMetamaskError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isMetamaskError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["s"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export v as EmailLinkErrorCodeStatus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EmailLinkErrorCodeStatus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["v"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript) <export y as buildErrorThrower>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildErrorThrower",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["y"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/handleValueOrFn-CKEDuW4I.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>handleValueOrFn
]);
//#region src/utils/handleValueOrFn.ts
/**
*
*/ function handleValueOrFn(value, url, defaultValue) {
    if (typeof value === "function") return value(url);
    if (typeof value !== "undefined") return value;
    if (typeof defaultValue !== "undefined") return defaultValue;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/instance-DNaRGwPZ.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>isStaging
]);
//#region src/utils/instance.ts
/**
* Check if the frontendApi ends with a staging domain
*/ function isStaging(frontendApi) {
    return frontendApi.endsWith(".lclstage.dev") || frontendApi.endsWith(".stgstage.dev") || frontendApi.endsWith(".clerkstage.dev") || frontendApi.endsWith(".accountsstage.dev");
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/noop-LBsrDrTs.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>noop
]);
//#region src/utils/noop.ts
const noop = (..._args)=>{};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>isTestEnvironment,
    "i",
    ()=>isProductionEnvironment,
    "n",
    ()=>isAutomatedEnvironment,
    "r",
    ()=>isDevelopmentEnvironment,
    "t",
    ()=>automatedEnvironmentVariables
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$getEnvVariable$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/getEnvVariable.mjs [app-ssr] (ecmascript)");
;
//#region src/utils/runtimeEnvironment.ts
const automatedEnvironmentVariables = [
    "CI",
    "CONTINUOUS_INTEGRATION",
    "GITHUB_ACTIONS",
    "GITLAB_CI",
    "CIRCLECI",
    "TRAVIS",
    "BUILDKITE",
    "BITBUCKET_BUILD_NUMBER",
    "APPVEYOR",
    "CODEBUILD_BUILD_ID",
    "TF_BUILD",
    "TEAMCITY_VERSION",
    "JENKINS_URL",
    "HUDSON_URL",
    "BAMBOO_BUILDKEY",
    "CF_PAGES"
];
const isTruthyEnvValue = (value)=>{
    if (typeof value !== "string" || !value) return false;
    return ![
        "0",
        "false",
        "off",
        "no"
    ].includes(value.toLowerCase());
};
const isDevelopmentEnvironment = ()=>{
    try {
        return ("TURBOPACK compile-time value", "development") === "development";
    } catch  {}
    return false;
};
const isTestEnvironment = ()=>{
    try {
        return ("TURBOPACK compile-time value", "development") === "test";
    } catch  {}
    return false;
};
const isProductionEnvironment = ()=>{
    try {
        return ("TURBOPACK compile-time value", "development") === "production";
    } catch  {}
    return false;
};
const isAutomatedEnvironment = ()=>{
    return automatedEnvironmentVariables.some((name)=>isTruthyEnvValue((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$getEnvVariable$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getEnvVariable"])(name)));
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript) <export i as isProductionEnvironment>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isProductionEnvironment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript) <export n as isAutomatedEnvironment>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isAutomatedEnvironment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["n"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript) <export r as isDevelopmentEnvironment>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isDevelopmentEnvironment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["r"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>eventMethodCalled,
    "c",
    ()=>eventPrebuiltComponentMounted,
    "i",
    ()=>eventFrameworkMetadata,
    "l",
    ()=>eventPrebuiltComponentOpened,
    "n",
    ()=>EVENT_THEME_USAGE,
    "o",
    ()=>eventFlowStepMounted,
    "r",
    ()=>eventThemeUsage,
    "s",
    ()=>eventComponentMounted,
    "t",
    ()=>EVENT_SAMPLING_RATE,
    "u",
    ()=>TelemetryCollector
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [app-ssr] (ecmascript)");
;
;
;
//#region src/telemetry/notice.ts
/**
* One-time runtime disclosure that Clerk collects telemetry from development instances.
*
* Replaces the previous `postinstall` script. Disclosure is intentionally surfaced
* only on Node (server-side) so the noise profile matches the original postinstall
* (terminal-only, dev-eyes-only). Browser consoles are not used because they are
* frequently observed by non-developers (QA, screenshots, demos), and adding another
* console warning is a common source of customer complaints.
*
* Known gap: pure browser-only setups with no server-side Clerk runtime (e.g. a Vite
* SPA using `@clerk/clerk-react` or `@clerk/clerk-js` directly, without any Node/Edge
* backend that imports `@clerk/shared`) will never hit this code path and therefore
* see no in-band disclosure. This is an accepted trade-off: the original postinstall
* already fired only once at install time and was easily missed, so the practical
* delta is small. Authoritative disclosure for those setups lives in the Clerk
* telemetry docs (https://clerk.com/docs/telemetry). Opt-out continues to work the
* same way (`telemetry={false}` on `<ClerkProvider>` or the framework-specific
* `*_CLERK_TELEMETRY_DISABLED` env var).
*
* Persistence is in-process via a `globalThis` Symbol, which survives Next.js HMR
* module reloads. No filesystem access, no `node:` imports, no dynamic-code APIs, so
* the module remains safe to bundle for Edge Runtime, Workers, and any browser path.
*
* All work is wrapped in try/catch. Failure to display the notice must never affect
* the SDK.
*/ const PROCESS_FLAG = Symbol.for("@clerk/shared.telemetryNoticeShown");
const NOTICE_LINES = [
    "Attention: Clerk collects telemetry data from its SDKs when connected to development instances.",
    "The data collected is used to inform Clerk's product roadmap.",
    "To learn more, including how to opt-out from the telemetry program, visit: https://clerk.com/docs/telemetry."
];
function isServerRuntime() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (typeof globalThis.EdgeRuntime !== "undefined") return false;
    return true;
}
function isCI() {
    if (typeof process === "undefined" || !process.env) return false;
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"].some((name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTruthy"])(process.env[name]));
}
function hasSeen() {
    return Boolean(globalThis[PROCESS_FLAG]);
}
function markSeen() {
    globalThis[PROCESS_FLAG] = true;
}
function printNotice() {
    if (typeof console === "undefined" || typeof console.log !== "function") return;
    for (const line of NOTICE_LINES)console.log(line);
    console.log("");
}
/**
* Display the one-time telemetry disclosure on server runtimes if it has not already been
* shown in this process. Browser and Edge Runtime callers are silently skipped. Never throws.
*/ function maybeShowTelemetryNotice(options = {}) {
    if (options.skip) return;
    try {
        if (!isServerRuntime()) return;
        if (isCI()) return;
        if (hasSeen()) return;
        printNotice();
        markSeen();
    } catch  {}
}
//#endregion
//#region src/telemetry/throttler.ts
const DEFAULT_CACHE_TTL_MS = 864e5;
/**
* Manages throttling for telemetry events using a configurable cache implementation
* to mitigate event flooding in frequently executed code paths.
*/ var TelemetryEventThrottler = class {
    #cache;
    #cacheTtl = DEFAULT_CACHE_TTL_MS;
    constructor(cache){
        this.#cache = cache;
    }
    isEventThrottled(payload) {
        const now = Date.now();
        const key = this.#generateKey(payload);
        const entry = this.#cache.getItem(key);
        if (!entry) {
            this.#cache.setItem(key, now);
            return false;
        }
        if (now - entry > this.#cacheTtl) {
            this.#cache.setItem(key, now);
            return false;
        }
        return true;
    }
    /**
	* Generates a consistent unique key for telemetry events by sorting payload properties.
	* This ensures that payloads with identical content in different orders produce the same key.
	*/ #generateKey(event) {
        const { sk: _sk, pk: _pk, payload, ...rest } = event;
        const sanitizedEvent = {
            ...payload,
            ...rest
        };
        return JSON.stringify(Object.keys({
            ...payload,
            ...rest
        }).sort().map((key)=>sanitizedEvent[key]));
    }
};
/**
* LocalStorage-based cache implementation for browser environments.
*/ var LocalStorageThrottlerCache = class {
    #storageKey = "clerk_telemetry_throttler";
    getItem(key) {
        return this.#getCache()[key];
    }
    setItem(key, value) {
        try {
            const cache = this.#getCache();
            cache[key] = value;
            localStorage.setItem(this.#storageKey, JSON.stringify(cache));
        } catch (err) {
            if (err instanceof DOMException && (err.name === "QuotaExceededError" || err.name === "NS_ERROR_DOM_QUOTA_REACHED") && localStorage.length > 0) localStorage.removeItem(this.#storageKey);
        }
    }
    removeItem(key) {
        try {
            const cache = this.#getCache();
            delete cache[key];
            localStorage.setItem(this.#storageKey, JSON.stringify(cache));
        } catch  {}
    }
    #getCache() {
        try {
            const cacheString = localStorage.getItem(this.#storageKey);
            if (!cacheString) return {};
            return JSON.parse(cacheString);
        } catch  {
            return {};
        }
    }
    static isSupported() {
        return ("TURBOPACK compile-time value", "undefined") !== "undefined" && !!window.localStorage;
    }
};
/**
* In-memory cache implementation for non-browser environments (e.g., React Native).
*/ var InMemoryThrottlerCache = class {
    #cache = /* @__PURE__ */ new Map();
    #maxSize = 1e4;
    getItem(key) {
        if (this.#cache.size > this.#maxSize) {
            this.#cache.clear();
            return;
        }
        return this.#cache.get(key);
    }
    setItem(key, value) {
        this.#cache.set(key, value);
    }
    removeItem(key) {
        this.#cache.delete(key);
    }
};
//#endregion
//#region src/telemetry/collector.ts
/**
* The `TelemetryCollector` class handles collection of telemetry events from Clerk SDKs. Telemetry is opt-out and can be disabled by setting a CLERK_TELEMETRY_DISABLED environment variable.
* The `ClerkProvider` also accepts a `telemetry` prop that will be passed to the collector during initialization:.
*
* ```jsx
* <ClerkProvider telemetry={false}>
*    ...
* </ClerkProvider>
* ```
*
* For more information, please see the telemetry documentation page: https://clerk.com/docs/telemetry.
*/ /**
* Type guard to check if window.Clerk exists and has the expected structure.
*/ function isWindowClerkWithMetadata(clerk) {
    return typeof clerk === "object" && clerk !== null && "constructor" in clerk && typeof clerk.constructor === "function";
}
const VALID_LOG_LEVELS = new Set([
    "error",
    "warn",
    "info",
    "debug",
    "trace"
]);
const DEFAULT_CONFIG = {
    samplingRate: 1,
    maxBufferSize: 5,
    endpoint: "https://clerk-telemetry.com"
};
var TelemetryCollector = class {
    #config;
    #eventThrottler;
    #metadata = {};
    #buffer = [];
    #pendingFlush = null;
    constructor(options){
        this.#config = {
            maxBufferSize: options.maxBufferSize ?? DEFAULT_CONFIG.maxBufferSize,
            samplingRate: options.samplingRate ?? DEFAULT_CONFIG.samplingRate,
            perEventSampling: options.perEventSampling ?? true,
            disabled: options.disabled ?? false,
            debug: options.debug ?? false,
            endpoint: DEFAULT_CONFIG.endpoint
        };
        if (!options.clerkVersion && ("TURBOPACK compile-time value", "undefined") === "undefined") this.#metadata.clerkVersion = "";
        else this.#metadata.clerkVersion = options.clerkVersion ?? "";
        this.#metadata.sdk = options.sdk;
        this.#metadata.sdkVersion = options.sdkVersion;
        this.#metadata.publishableKey = options.publishableKey ?? "";
        const parsedKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePublishableKey"])(options.publishableKey);
        if (parsedKey) this.#metadata.instanceType = parsedKey.instanceType;
        if (options.secretKey) this.#metadata.secretKey = options.secretKey.substring(0, 16);
        const cache = LocalStorageThrottlerCache.isSupported() ? new LocalStorageThrottlerCache() : new InMemoryThrottlerCache();
        this.#eventThrottler = new TelemetryEventThrottler(cache);
        maybeShowTelemetryNotice({
            skip: !this.isEnabled
        });
    }
    get isEnabled() {
        if (this.#metadata.instanceType !== "development") return false;
        if (this.#config.disabled || typeof process !== "undefined" && process.env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTruthy"])(process.env.CLERK_TELEMETRY_DISABLED)) return false;
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && !!window?.navigator?.webdriver) //TURBOPACK unreachable
        ;
        return true;
    }
    get isDebug() {
        return this.#config.debug || typeof process !== "undefined" && process.env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTruthy"])(process.env.CLERK_TELEMETRY_DEBUG);
    }
    record(event) {
        try {
            const preparedPayload = this.#preparePayload(event.event, event.payload);
            this.#logEvent(preparedPayload.event, preparedPayload);
            if (!this.#shouldRecord(preparedPayload, event.eventSamplingRate)) return;
            this.#buffer.push({
                kind: "event",
                value: preparedPayload
            });
            this.#scheduleFlush();
        } catch (error) {
            console.error("[clerk/telemetry] Error recording telemetry event", error);
        }
    }
    /**
	* Records a telemetry log entry if logging is enabled and not in debug mode.
	*
	* @param entry - The telemetry log entry to record.
	*/ recordLog(entry) {
        try {
            if (!this.#shouldRecordLog(entry)) return;
            const levelIsValid = typeof entry?.level === "string" && VALID_LOG_LEVELS.has(entry.level);
            const messageIsValid = typeof entry?.message === "string" && entry.message.trim().length > 0;
            let normalizedTimestamp = null;
            const timestampInput = entry?.timestamp;
            if (typeof timestampInput === "number" || typeof timestampInput === "string") {
                const candidate = new Date(timestampInput);
                if (!Number.isNaN(candidate.getTime())) normalizedTimestamp = candidate;
            }
            if (!levelIsValid || !messageIsValid || normalizedTimestamp === null) {
                if (this.isDebug && typeof console !== "undefined") console.warn("[clerk/telemetry] Dropping invalid telemetry log entry", {
                    levelIsValid,
                    messageIsValid,
                    timestampIsValid: normalizedTimestamp !== null
                });
                return;
            }
            const sdkMetadata = this.#getSDKMetadata();
            const logData = {
                sdk: sdkMetadata.name,
                sdkv: sdkMetadata.version,
                cv: this.#metadata.clerkVersion ?? "",
                lvl: entry.level,
                msg: entry.message,
                ts: normalizedTimestamp.toISOString(),
                pk: this.#metadata.publishableKey || null,
                payload: this.#sanitizeContext(entry.context)
            };
            this.#buffer.push({
                kind: "log",
                value: logData
            });
            this.#scheduleFlush();
        } catch (error) {
            console.error("[clerk/telemetry] Error recording telemetry log entry", error);
        }
    }
    #shouldRecord(preparedPayload, eventSamplingRate) {
        return this.isEnabled && !this.isDebug && this.#shouldBeSampled(preparedPayload, eventSamplingRate);
    }
    #shouldRecordLog(_entry) {
        return true;
    }
    #shouldBeSampled(preparedPayload, eventSamplingRate) {
        const randomSeed = Math.random();
        if (!(randomSeed <= this.#config.samplingRate && (this.#config.perEventSampling === false || typeof eventSamplingRate === "undefined" || randomSeed <= eventSamplingRate))) return false;
        return !this.#eventThrottler.isEventThrottled(preparedPayload);
    }
    #scheduleFlush() {
        if ("TURBOPACK compile-time truthy", 1) {
            this.#flush();
            return;
        }
        //TURBOPACK unreachable
        ;
    }
    #flush() {
        const itemsToSend = [
            ...this.#buffer
        ];
        this.#buffer = [];
        this.#pendingFlush = null;
        if (itemsToSend.length === 0) return;
        const eventsToSend = itemsToSend.filter((item)=>item.kind === "event").map((item)=>item.value);
        const logsToSend = itemsToSend.filter((item)=>item.kind === "log").map((item)=>item.value);
        if (eventsToSend.length > 0) {
            const eventsUrl = new URL("/v1/event", this.#config.endpoint);
            fetch(eventsUrl, {
                headers: {
                    "Content-Type": "application/json"
                },
                keepalive: true,
                method: "POST",
                body: JSON.stringify({
                    events: eventsToSend
                })
            }).catch(()=>void 0);
        }
        if (logsToSend.length > 0) {
            const logsUrl = new URL("/v1/logs", this.#config.endpoint);
            fetch(logsUrl, {
                headers: {
                    "Content-Type": "application/json"
                },
                keepalive: true,
                method: "POST",
                body: JSON.stringify({
                    logs: logsToSend
                })
            }).catch(()=>void 0);
        }
    }
    /**
	* If running in debug mode, log the event and its payload to the console.
	*/ #logEvent(event, payload) {
        if (!this.isDebug) return;
        if (typeof console.groupCollapsed !== "undefined") {
            console.groupCollapsed("[clerk/telemetry]", event);
            console.log(payload);
            console.groupEnd();
        } else console.log("[clerk/telemetry]", event, payload);
    }
    /**
	* If in browser, attempt to lazily grab the SDK metadata from the Clerk singleton, otherwise fallback to the initially passed in values.
	*
	* This is necessary because the sdkMetadata can be set by the host SDK after the TelemetryCollector is instantiated.
	*/ #getSDKMetadata() {
        const sdkMetadata = {
            name: this.#metadata.sdk,
            version: this.#metadata.sdkVersion
        };
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return sdkMetadata;
    }
    /**
	* Append relevant metadata from the Clerk singleton to the event payload.
	*/ #preparePayload(event, payload) {
        const sdkMetadata = this.#getSDKMetadata();
        return {
            event,
            cv: this.#metadata.clerkVersion ?? "",
            it: this.#metadata.instanceType ?? "",
            sdk: sdkMetadata.name,
            sdkv: sdkMetadata.version,
            ...this.#metadata.publishableKey ? {
                pk: this.#metadata.publishableKey
            } : {},
            ...this.#metadata.secretKey ? {
                sk: this.#metadata.secretKey
            } : {},
            payload
        };
    }
    /**
	* Best-effort sanitization of the context payload. Returns a plain object with JSON-serializable
	* values or null when the input is missing or not serializable. Arrays are not accepted.
	*/ #sanitizeContext(context) {
        if (context === null || typeof context === "undefined") return null;
        if (typeof context !== "object") return null;
        try {
            const cleaned = JSON.parse(JSON.stringify(context));
            if (cleaned && typeof cleaned === "object" && !Array.isArray(cleaned)) return cleaned;
            return null;
        } catch  {
            return null;
        }
    }
};
//#endregion
//#region src/telemetry/events/component-mounted.ts
const EVENT_COMPONENT_MOUNTED = "COMPONENT_MOUNTED";
const EVENT_COMPONENT_OPENED = "COMPONENT_OPENED";
const EVENT_SAMPLING_RATE$4 = .1;
/** Increase sampling for high-signal auth components on mount. */ const AUTH_COMPONENTS = new Set([
    "SignIn",
    "SignUp"
]);
/**
* Returns the per-event sampling rate for component-mounted telemetry events.
* Uses a higher rate for SignIn/SignUp to improve signal quality.
*
*  @internal
*/ function getComponentMountedSamplingRate(component) {
    return AUTH_COMPONENTS.has(component) ? 1 : EVENT_SAMPLING_RATE$4;
}
/**
* Factory for prebuilt component telemetry events.
*
* @internal
*/ function createPrebuiltComponentEvent(event) {
    return function(component, props, additionalPayload) {
        return {
            event,
            eventSamplingRate: event === EVENT_COMPONENT_MOUNTED ? getComponentMountedSamplingRate(component) : EVENT_SAMPLING_RATE$4,
            payload: {
                component,
                appearanceProp: Boolean(props?.appearance),
                theme: Boolean(props?.appearance?.theme),
                elements: Boolean(props?.appearance?.elements),
                variables: Boolean(props?.appearance?.variables),
                ...additionalPayload
            }
        };
    };
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a prebuilt (AIO) component is mounted.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Will be filtered to a known list of props.
* @param additionalPayload - Additional data to send with the event.
* @example
* telemetry.record(eventPrebuiltComponentMounted('SignUp', props));
*/ function eventPrebuiltComponentMounted(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_MOUNTED)(component, props, additionalPayload);
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a prebuilt (AIO) component is opened as a modal.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Will be filtered to a known list of props.
* @param additionalPayload - Additional data to send with the event.
* @example
* telemetry.record(eventPrebuiltComponentOpened('GoogleOneTap', props));
*/ function eventPrebuiltComponentOpened(component, props, additionalPayload) {
    return createPrebuiltComponentEvent(EVENT_COMPONENT_OPENED)(component, props, additionalPayload);
}
/**
* Helper function for `telemetry.record()`. Create a consistent event object for when a component is mounted. Use `eventPrebuiltComponentMounted` for prebuilt components.
*
* **Caution:** Filter the `props` you pass to this function to avoid sending too much data.
*
* @param component - The name of the component.
* @param props - The props passed to the component. Ideally you only pass a handful of props here.
* @example
* telemetry.record(eventComponentMounted('SignUp', props));
*/ function eventComponentMounted(component, props = {}) {
    return {
        event: EVENT_COMPONENT_MOUNTED,
        eventSamplingRate: getComponentMountedSamplingRate(component),
        payload: {
            component,
            ...props
        }
    };
}
//#endregion
//#region src/telemetry/events/flow-step.ts
const EVENT_FLOW_STEP_MOUNTED = "FLOW_STEP_MOUNTED";
const EVENT_SAMPLING_RATE$3 = 1;
/**
* Fires an event from a part of a multi-step flow.
*
* @param flow - The flow identifier (matches `Flow.Root`'s `flow`).
* @param step - The step/part that mounted.
* @param metadata - Flow-specific metadata sent under `payload.metadata`.
* @param eventSamplingRate - Override the default full-capture sampling rate.
* @example
* telemetry.record(eventFlowStepMounted('configureSSO', 'verify-domain', { timestamp: new Date().toISOString(), connectionStatus: 'unconfigured' }));
*/ function eventFlowStepMounted(flow, step, metadata = {}, eventSamplingRate = EVENT_SAMPLING_RATE$3) {
    return {
        event: EVENT_FLOW_STEP_MOUNTED,
        eventSamplingRate,
        payload: {
            flow,
            step,
            metadata
        }
    };
}
//#endregion
//#region src/telemetry/events/method-called.ts
const EVENT_METHOD_CALLED = "METHOD_CALLED";
const EVENT_SAMPLING_RATE$2 = .1;
/**
* Fired when a helper method is called from a Clerk SDK.
*/ function eventMethodCalled(method, payload) {
    return {
        event: EVENT_METHOD_CALLED,
        eventSamplingRate: EVENT_SAMPLING_RATE$2,
        payload: {
            method,
            ...payload
        }
    };
}
//#endregion
//#region src/telemetry/events/framework-metadata.ts
const EVENT_FRAMEWORK_METADATA = "FRAMEWORK_METADATA";
const EVENT_SAMPLING_RATE$1 = .1;
/**
* Fired when a helper method is called from a Clerk SDK.
*/ function eventFrameworkMetadata(payload) {
    return {
        event: EVENT_FRAMEWORK_METADATA,
        eventSamplingRate: EVENT_SAMPLING_RATE$1,
        payload
    };
}
//#endregion
//#region src/telemetry/events/theme-usage.ts
const EVENT_THEME_USAGE = "THEME_USAGE";
const EVENT_SAMPLING_RATE = 1;
/**
* Helper function for `telemetry.record()`. Create a consistent event object for tracking theme usage in ClerkProvider.
*
* @param appearance - The appearance prop from ClerkProvider.
* @example
* telemetry.record(eventThemeUsage(appearance));
*/ function eventThemeUsage(appearance) {
    return {
        event: EVENT_THEME_USAGE,
        eventSamplingRate: 1,
        payload: analyzeThemeUsage(appearance)
    };
}
/**
* Analyzes the appearance prop to extract theme usage information for telemetry.
*
* @internal
*/ function analyzeThemeUsage(appearance) {
    if (!appearance || typeof appearance !== "object") return {};
    const themeProperty = appearance.theme;
    if (!themeProperty) return {};
    let themeName;
    if (Array.isArray(themeProperty)) for (const theme of themeProperty){
        const name = extractThemeName(theme);
        if (name) {
            themeName = name;
            break;
        }
    }
    else themeName = extractThemeName(themeProperty);
    return {
        themeName
    };
}
/**
* Extracts the theme name from a theme object.
*
* @internal
*/ function extractThemeName(theme) {
    if (typeof theme === "string") return theme;
    if (typeof theme === "object" && theme !== null) {
        if ("name" in theme && typeof theme.name === "string") return theme.name;
    }
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-ssr] (ecmascript) <export a as eventMethodCalled>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eventMethodCalled",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-ssr] (ecmascript) <export i as eventFrameworkMetadata>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "eventFrameworkMetadata",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/utils-V2FbmPWk.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>logErrorInDevMode,
    "i",
    ()=>runIfFunctionOrReturn,
    "n",
    ()=>fastDeepMergeAndKeep,
    "o",
    ()=>allSettled,
    "r",
    ()=>fastDeepMergeAndReplace,
    "t",
    ()=>timeLimit
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)");
;
//#region src/utils/allSettled.ts
/**
* A ES6 compatible utility that implements `Promise.allSettled`
*
* @internal
*/ function allSettled(iterable) {
    const promises = Array.from(iterable).map((p)=>p.then((value)=>({
                status: "fulfilled",
                value
            }), (reason)=>({
                status: "rejected",
                reason
            })));
    return Promise.all(promises);
}
//#endregion
//#region src/utils/logErrorInDevMode.ts
const logErrorInDevMode = (message)=>{
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["r"])()) console.error(`Clerk: ${message}`);
};
//#endregion
//#region src/utils/runIfFunctionOrReturn.ts
/**
*
*/ function runIfFunctionOrReturn(o) {
    if (typeof o === "function") return o();
    return o;
}
//#endregion
//#region src/utils/fastDeepMerge.ts
const DANGEROUS_KEYS = new Set([
    "__proto__",
    "constructor",
    "prototype"
]);
/**
* Merges 2 objects without creating new object references
* The merged props will appear on the `target` object
* If `target` already has a value for a given key it will not be overwritten
*/ const fastDeepMergeAndReplace = (source, target)=>{
    if (!source || !target) return;
    for(const key in source){
        if (DANGEROUS_KEYS.has(key)) continue;
        if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && typeof source[key] === `object`) {
            if (target[key] === void 0) target[key] = new (Object.getPrototypeOf(source[key])).constructor();
            fastDeepMergeAndReplace(source[key], target[key]);
        } else if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== void 0) target[key] = source[key];
    }
};
const fastDeepMergeAndKeep = (source, target)=>{
    if (!source || !target) return;
    for(const key in source){
        if (DANGEROUS_KEYS.has(key)) continue;
        if (Object.prototype.hasOwnProperty.call(source, key) && source[key] !== null && typeof source[key] === `object`) {
            if (target[key] === void 0) target[key] = new (Object.getPrototypeOf(source[key])).constructor();
            fastDeepMergeAndKeep(source[key], target[key]);
        } else if (Object.prototype.hasOwnProperty.call(source, key) && target[key] === void 0) target[key] = source[key];
    }
};
//#endregion
//#region src/utils/timeLimit.ts
function timeLimit(value, ms, abortController) {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject)=>{
        timeoutId = setTimeout(()=>{
            const error = /* @__PURE__ */ new Error(`Timed out after ${ms}ms`);
            abortController?.abort();
            reject(error);
        }, ms);
        timeoutId.unref?.();
    });
    return Promise.race([
        Promise.resolve(value),
        timeoutPromise
    ]).finally(()=>{
        clearTimeout(timeoutId);
    });
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/utils-V2FbmPWk.mjs [app-ssr] (ecmascript) <export a as logErrorInDevMode>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logErrorInDevMode",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$utils$2d$V2FbmPWk$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$utils$2d$V2FbmPWk$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/utils-V2FbmPWk.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/apiUrlFromPublishableKey.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiUrlFromPublishableKey",
    ()=>apiUrlFromPublishableKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [app-ssr] (ecmascript)");
;
;
//#region src/apiUrlFromPublishableKey.ts
/**
* Get the correct API url based on the publishable key.
*
* @param publishableKey - The publishable key to parse.
* @returns One of Clerk's API URLs.
*/ const apiUrlFromPublishableKey = (publishableKey)=>{
    const frontendApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)?.frontendApi;
    if (frontendApi?.startsWith("clerk.") && __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((suffix)=>frontendApi?.endsWith(suffix))) return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROD_API_URL"];
    if (__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCAL_ENV_SUFFIXES"].some((suffix)=>frontendApi?.endsWith(suffix))) return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LOCAL_API_URL"];
    if (__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STAGING_ENV_SUFFIXES"].some((suffix)=>frontendApi?.endsWith(suffix))) return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["STAGING_API_URL"];
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PROD_API_URL"];
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/authorization-errors.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isReverificationHint",
    ()=>isReverificationHint,
    "reverificationError",
    ()=>reverificationError,
    "reverificationErrorResponse",
    ()=>reverificationErrorResponse
]);
//#region src/authorization-errors.ts
const REVERIFICATION_REASON = "reverification-error";
const reverificationError = (missingConfig)=>({
        clerk_error: {
            type: "forbidden",
            reason: REVERIFICATION_REASON,
            metadata: {
                reverification: missingConfig
            }
        }
    });
const reverificationErrorResponse = (...args)=>new Response(JSON.stringify(reverificationError(...args)), {
        status: 403
    });
const isReverificationHint = (result)=>{
    return result && typeof result === "object" && "clerk_error" in result && result.clerk_error?.type === "forbidden" && result.clerk_error?.reason === REVERIFICATION_REASON;
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/authorization.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCheckAuthorization",
    ()=>createCheckAuthorization,
    "resolveAuthState",
    ()=>resolveAuthState,
    "splitByScope",
    ()=>splitByScope,
    "validateReverificationConfig",
    ()=>validateReverificationConfig
]);
//#region src/authorization.ts
const TYPES_TO_OBJECTS = {
    strict_mfa: {
        afterMinutes: 10,
        level: "multi_factor"
    },
    strict: {
        afterMinutes: 10,
        level: "second_factor"
    },
    moderate: {
        afterMinutes: 60,
        level: "second_factor"
    },
    lax: {
        afterMinutes: 1440,
        level: "second_factor"
    }
};
const ALLOWED_LEVELS = new Set([
    "first_factor",
    "second_factor",
    "multi_factor"
]);
const ALLOWED_TYPES = new Set([
    "strict_mfa",
    "strict",
    "moderate",
    "lax"
]);
const ORG_SCOPES = new Set([
    "o",
    "org",
    "organization"
]);
const USER_SCOPES = new Set([
    "u",
    "user"
]);
const isValidMaxAge = (maxAge)=>typeof maxAge === "number" && maxAge > 0;
const isValidLevel = (level)=>ALLOWED_LEVELS.has(level);
const isValidVerificationType = (type)=>ALLOWED_TYPES.has(type);
const isValidFactorAge = (x)=>typeof x === "number" && Number.isFinite(x) && (x === -1 || x >= 0);
const prefixWithOrg = (value)=>value.replace(/^(org:)*/, "org:");
/**
* Checks if a user has the required organization-level authorization.
* If both role and permission are provided, both must match (AND).
*/ const checkOrgAuthorization = (params, options)=>{
    const { orgId, orgRole, orgPermissions } = options;
    const roleAsked = params.role !== void 0;
    const permissionAsked = params.permission !== void 0;
    if (!roleAsked && !permissionAsked) return "skip";
    if (roleAsked && typeof params.role !== "string") return "fail";
    if (permissionAsked && typeof params.permission !== "string") return "fail";
    if (!orgId) return "fail";
    if (roleAsked) {
        if (typeof orgRole !== "string" || !orgRole) return "fail";
        if (prefixWithOrg(orgRole) !== prefixWithOrg(params.role)) return "fail";
    }
    if (permissionAsked) {
        if (!Array.isArray(orgPermissions)) return "fail";
        if (!orgPermissions.includes(prefixWithOrg(params.permission))) return "fail";
    }
    return "pass";
};
const checkForFeatureOrPlan = (claim, featureOrPlan)=>{
    const { org: orgFeatures, user: userFeatures } = splitByScope(claim);
    const [rawScope, rawId] = featureOrPlan.split(":");
    const hasExplicitScope = rawId !== void 0;
    const scope = rawScope;
    const id = rawId || rawScope;
    if (hasExplicitScope && !ORG_SCOPES.has(scope) && !USER_SCOPES.has(scope)) throw new Error(`Invalid scope: ${scope}`);
    if (hasExplicitScope) {
        if (ORG_SCOPES.has(scope)) return orgFeatures.includes(id);
        if (USER_SCOPES.has(scope)) return userFeatures.includes(id);
    }
    return [
        ...orgFeatures,
        ...userFeatures
    ].includes(id);
};
/**
* Checks if a user is entitled to the requested feature or plan.
* If both feature and plan are provided, both must match (AND).
*/ const checkBillingAuthorization = (params, options)=>{
    const { features, plans } = options;
    const featureAsked = params.feature !== void 0;
    const planAsked = params.plan !== void 0;
    if (!featureAsked && !planAsked) return "skip";
    if (featureAsked && typeof params.feature !== "string") return "fail";
    if (planAsked && typeof params.plan !== "string") return "fail";
    if (featureAsked) {
        if (typeof features !== "string" || !features) return "fail";
        try {
            if (!checkForFeatureOrPlan(features, params.feature)) return "fail";
        } catch  {
            return "fail";
        }
    }
    if (planAsked) {
        if (typeof plans !== "string" || !plans) return "fail";
        try {
            if (!checkForFeatureOrPlan(plans, params.plan)) return "fail";
        } catch  {
            return "fail";
        }
    }
    return "pass";
};
const splitByScope = (fea)=>{
    const org = [];
    const user = [];
    if (!fea) return {
        org,
        user
    };
    const parts = fea.split(",");
    for(let i = 0; i < parts.length; i++){
        const part = parts[i].trim();
        const colonIndex = part.indexOf(":");
        if (colonIndex === -1) throw new Error(`Invalid claim element (missing colon): ${part}`);
        const scope = part.slice(0, colonIndex);
        const value = part.slice(colonIndex + 1);
        if (scope === "o") org.push(value);
        else if (scope === "u") user.push(value);
        else if (scope === "ou" || scope === "uo") {
            org.push(value);
            user.push(value);
        }
    }
    return {
        org,
        user
    };
};
const validateReverificationConfig = (config)=>{
    if (!config) return false;
    const convertConfigToObject = (config)=>{
        if (typeof config === "string") return TYPES_TO_OBJECTS[config];
        return config;
    };
    const isValidStringValue = typeof config === "string" && isValidVerificationType(config);
    const isValidObjectValue = typeof config === "object" && isValidLevel(config.level) && isValidMaxAge(config.afterMinutes);
    if (isValidStringValue || isValidObjectValue) return convertConfigToObject.bind(null, config);
    return false;
};
/**
* Evaluates if the user meets re-verification authentication requirements.
* Handles different verification levels (first factor, second factor, multi-factor).
*/ const checkReverificationAuthorization = (params, { factorVerificationAge })=>{
    if (params.reverification === void 0) return "skip";
    if (!factorVerificationAge) return "fail";
    if (!Array.isArray(factorVerificationAge) || factorVerificationAge.length !== 2 || !isValidFactorAge(factorVerificationAge[0]) || !isValidFactorAge(factorVerificationAge[1])) return "fail";
    const getConfig = validateReverificationConfig(params.reverification);
    if (!getConfig) return "fail";
    const { level, afterMinutes } = getConfig();
    const [factor1Age, factor2Age] = factorVerificationAge;
    if (factor1Age === -1 && factor2Age === -1) return "fail";
    const factor1FreshEnough = factor1Age !== -1 && afterMinutes > factor1Age;
    const factor2FreshEnough = factor2Age !== -1 && afterMinutes > factor2Age;
    switch(level){
        case "first_factor":
            return factor1FreshEnough ? "pass" : "fail";
        case "second_factor":
            if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
            if (factor1Age === -1) return factor2FreshEnough ? "pass" : "fail";
            return factor2FreshEnough ? "pass" : "fail";
        case "multi_factor":
            if (factor2Age === -1) return factor1FreshEnough ? "pass" : "fail";
            if (factor1Age === -1) return "fail";
            return factor1FreshEnough && factor2FreshEnough ? "pass" : "fail";
    }
};
const combine = (results)=>results.some((r)=>r === "pass") && results.every((r)=>r === "pass" || r === "skip");
/**
* Creates a function for comprehensive user authorization checks.
* Combines organization, billing, and reverification checks. The returned function
* authorizes only when every requested dimension passes; any requested dimension
* that cannot be satisfied (including missing or malformed session data) denies
* the request. Fails if `userId` is missing.
*/ const createCheckAuthorization = (options)=>{
    return (params)=>{
        if (!options.userId) return false;
        return combine([
            checkOrgAuthorization(params, options),
            checkBillingAuthorization(params, options),
            checkReverificationAuthorization(params, options)
        ]);
    };
};
/**
* Shared utility function that centralizes auth state resolution logic,
* preventing duplication across different packages.
*
* @internal
*/ const resolveAuthState = ({ authObject: { sessionId, sessionStatus, userId, actor, orgId, orgRole, orgSlug, signOut, getToken, has, sessionClaims }, options: { treatPendingAsSignedOut = true } })=>{
    if (sessionId === void 0 && userId === void 0) return {
        actor: void 0,
        getToken,
        has: ()=>false,
        isLoaded: false,
        isSignedIn: void 0,
        orgId: void 0,
        orgRole: void 0,
        orgSlug: void 0,
        sessionClaims: void 0,
        sessionId,
        signOut,
        userId
    };
    if (sessionId === null && userId === null) return {
        actor: null,
        getToken,
        has: ()=>false,
        isLoaded: true,
        isSignedIn: false,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        sessionClaims: null,
        sessionId,
        signOut,
        userId
    };
    if (treatPendingAsSignedOut && sessionStatus === "pending") return {
        actor: null,
        getToken,
        has: ()=>false,
        isLoaded: true,
        isSignedIn: false,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        sessionClaims: null,
        sessionId: null,
        signOut,
        userId: null
    };
    if (!!sessionId && !!sessionClaims && !!userId && !!orgId && !!orgRole) return {
        actor: actor || null,
        getToken,
        has,
        isLoaded: true,
        isSignedIn: true,
        orgId,
        orgRole,
        orgSlug: orgSlug || null,
        sessionClaims,
        sessionId,
        signOut,
        userId
    };
    if (!!sessionId && !!sessionClaims && !!userId && !orgId) return {
        actor: actor || null,
        getToken,
        has,
        isLoaded: true,
        isSignedIn: true,
        orgId: null,
        orgRole: null,
        orgSlug: null,
        sessionClaims,
        sessionId,
        signOut,
        userId
    };
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/browser.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "inBrowser",
    ()=>inBrowser,
    "isBrowserOnline",
    ()=>isBrowserOnline,
    "isValidBrowser",
    ()=>isValidBrowser,
    "isValidBrowserOnline",
    ()=>isValidBrowserOnline,
    "userAgentIsRobot",
    ()=>userAgentIsRobot
]);
//#region src/browser.ts
/**
* Checks if the window object is defined. You can also use this to check if something is happening on the client side.
*
* @returns
*/ function inBrowser() {
    return ("TURBOPACK compile-time value", "undefined") !== "undefined";
}
const botAgentRegex = new RegExp([
    "bot",
    "spider",
    "crawl",
    "APIs-Google",
    "AdsBot",
    "Googlebot",
    "mediapartners",
    "Google Favicon",
    "FeedFetcher",
    "Google-Read-Aloud",
    "DuplexWeb-Google",
    "googleweblight",
    "bing",
    "yandex",
    "baidu",
    "duckduck",
    "yahoo",
    "ecosia",
    "ia_archiver",
    "facebook",
    "instagram",
    "pinterest",
    "reddit",
    "slack",
    "twitter",
    "whatsapp",
    "youtube",
    "semrush"
].join("|"), "i");
/**
* Checks if the user agent is a bot.
*
* @param userAgent - Any user agent string
* @returns
*/ function userAgentIsRobot(userAgent) {
    return !userAgent ? false : botAgentRegex.test(userAgent);
}
/**
* Server-side runtimes with worker-like globals self-identify in `navigator.userAgent`
* (`Cloudflare-Workers`, `Node.js/24`, `Deno/2.5.0`, `Bun/1.3.9`). Today workerd's `self`
* does not satisfy `instanceof WorkerGlobalScope` (even though it exposes the constructor),
* so the scope gate alone happens to exclude it, but that is an implementation detail of
* workerd's prototype chain, not a guarantee. Excluding self-identified server runtimes by
* user agent keeps these heuristics server-false even if such a runtime becomes fully
* spec-compliant about its worker scope.
*/ const serverRuntimeUserAgentRegex = /^(Cloudflare-Workers|Node\.js|Deno|Bun)\b/i;
/**
* Resolves the `Navigator` object from either the DOM `window` (standard browsers)
* or a Web/Service Worker global scope. An MV3 extension background service worker
* has no `window`, but runs inside a `WorkerGlobalScope` that exposes a
* `WorkerNavigator` as `self.navigator` with the `onLine`/`userAgent` properties
* our heuristics rely on.
*
* We intentionally gate the worker fallback on a real `WorkerGlobalScope` rather than
* accepting any global `navigator`. Modern Node exposes `globalThis.navigator`, so a
* blanket global-navigator check would make Node SSR look like a browser; requiring a
* `WorkerGlobalScope` keeps SSR returning `null`.
*
* @returns
*/ function getNavigator() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const workerScope = globalThis;
    if (typeof workerScope.WorkerGlobalScope === "function" && workerScope.self instanceof workerScope.WorkerGlobalScope && workerScope.self.navigator && !serverRuntimeUserAgentRegex.test(workerScope.self.navigator.userAgent ?? "")) return workerScope.self.navigator;
    return null;
}
/**
* Checks if the current environment is a browser and the user agent is not a bot.
*
* @returns
*/ function isValidBrowser() {
    const navigator = getNavigator();
    if (!navigator) return false;
    return !userAgentIsRobot(navigator?.userAgent) && !navigator?.webdriver;
}
/**
* Checks if the current environment is a browser and if the navigator is online.
*
* @returns
*/ function isBrowserOnline() {
    const navigator = getNavigator();
    if (!navigator) return false;
    if (typeof navigator.onLine !== "boolean") return true;
    return !!navigator.onLine;
}
/**
* Runs `isBrowserOnline` and `isValidBrowser` to check if the current environment is a valid browser and if the navigator is online.
*
* @returns
*/ function isValidBrowserOnline() {
    return isBrowserOnline() && isValidBrowser();
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/clerkEventBus.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clerkEvents",
    ()=>clerkEvents,
    "createClerkEventBus",
    ()=>createClerkEventBus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$eventBus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/eventBus.mjs [app-ssr] (ecmascript)");
;
//#region src/clerkEventBus.ts
const clerkEvents = {
    Status: "status"
};
const createClerkEventBus = ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$eventBus$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createEventBus"])();
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CURRENT_DEV_INSTANCE_SUFFIXES",
    ()=>CURRENT_DEV_INSTANCE_SUFFIXES,
    "DEFAULT_PROXY_PATH",
    ()=>DEFAULT_PROXY_PATH,
    "DEV_OR_STAGING_SUFFIXES",
    ()=>DEV_OR_STAGING_SUFFIXES,
    "LEGACY_DEV_INSTANCE_SUFFIXES",
    ()=>LEGACY_DEV_INSTANCE_SUFFIXES,
    "LOCAL_API_URL",
    ()=>LOCAL_API_URL,
    "LOCAL_ENV_SUFFIXES",
    ()=>LOCAL_ENV_SUFFIXES,
    "LOCAL_FAPI_URL",
    ()=>LOCAL_FAPI_URL,
    "PROD_API_URL",
    ()=>PROD_API_URL,
    "PROD_FAPI_URL",
    ()=>PROD_FAPI_URL,
    "STAGING_API_URL",
    ()=>STAGING_API_URL,
    "STAGING_ENV_SUFFIXES",
    ()=>STAGING_ENV_SUFFIXES,
    "STAGING_FAPI_URL",
    ()=>STAGING_FAPI_URL,
    "iconImageUrl",
    ()=>iconImageUrl
]);
//#region src/constants.ts
const LEGACY_DEV_INSTANCE_SUFFIXES = [
    ".lcl.dev",
    ".lclstage.dev",
    ".lclclerk.com"
];
const CURRENT_DEV_INSTANCE_SUFFIXES = [
    ".accounts.dev",
    ".accountsstage.dev",
    ".accounts.lclclerk.com"
];
const DEV_OR_STAGING_SUFFIXES = [
    ".lcl.dev",
    ".stg.dev",
    ".lclstage.dev",
    ".stgstage.dev",
    ".dev.lclclerk.com",
    ".stg.lclclerk.com",
    ".accounts.lclclerk.com",
    "accountsstage.dev",
    "accounts.dev"
];
const LOCAL_ENV_SUFFIXES = [
    ".lcl.dev",
    "lclstage.dev",
    ".lclclerk.com",
    ".accounts.lclclerk.com"
];
const STAGING_ENV_SUFFIXES = [
    ".accountsstage.dev"
];
const LOCAL_API_URL = "https://api.lclclerk.com";
const STAGING_API_URL = "https://api.clerkstage.dev";
const PROD_API_URL = "https://api.clerk.com";
const LOCAL_FAPI_URL = "https://frontend-api.lclclerk.com";
const STAGING_FAPI_URL = "https://frontend-api.clerkstage.dev";
const PROD_FAPI_URL = "https://frontend-api.clerk.dev";
const DEFAULT_PROXY_PATH = "/__clerk";
/**
* Returns the URL for a static image
* using the new img.clerk.com service
*/ function iconImageUrl(id, format = "svg") {
    return `https://img.clerk.com/static/${id}.${format}`;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/deprecated.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deprecated",
    ()=>deprecated,
    "deprecatedObjectProperty",
    ()=>deprecatedObjectProperty,
    "deprecatedProperty",
    ()=>deprecatedProperty
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)");
;
//#region src/deprecated.ts
/**
* Mark class method / function as deprecated.
*
* A console WARNING will be displayed when class method / function is invoked.
*
* Examples
* 1. Deprecate class method
* class Example {
*   getSomething = (arg1, arg2) => {
*       deprecated('Example.getSomething', 'Use `getSomethingElse` instead.');
*       return `getSomethingValue:${arg1 || '-'}:${arg2 || '-'}`;
*   };
* }
*
* 2. Deprecate function
* const getSomething = () => {
*   deprecated('getSomething', 'Use `getSomethingElse` instead.');
*   return 'getSomethingValue';
* };
*/ const displayedWarnings = /* @__PURE__ */ new Set();
const deprecated = (fnName, warning, key)=>{
    const hideWarning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["i"])();
    const messageId = key ?? fnName;
    if (displayedWarnings.has(messageId) || hideWarning) return;
    displayedWarnings.add(messageId);
    console.warn(`Clerk - DEPRECATION WARNING: "${fnName}" is deprecated and will be removed in the next major release.\n${warning}`);
};
const deprecatedProperty = (cls, propName, warning, isStatic = false)=>{
    const target = isStatic ? cls : cls.prototype;
    let value = target[propName];
    Object.defineProperty(target, propName, {
        get () {
            deprecated(propName, warning, `${cls.name}:${propName}`);
            return value;
        },
        set (v) {
            value = v;
        }
    });
};
/**
* Mark object property as deprecated.
*
* A console WARNING will be displayed when object property is being accessed.
*
* 1. Deprecate object property
* const obj = { something: 'aloha' };
*
* deprecatedObjectProperty(obj, 'something', 'Use `somethingElse` instead.');
*/ const deprecatedObjectProperty = (obj, propName, warning, key)=>{
    let value = obj[propName];
    Object.defineProperty(obj, propName, {
        get () {
            deprecated(propName, warning, key);
            return value;
        },
        set (v) {
            value = v;
        }
    });
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/deriveState.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deriveFromClientSideState",
    ()=>deriveFromClientSideState,
    "deriveFromSsrInitialState",
    ()=>deriveFromSsrInitialState,
    "deriveState",
    ()=>deriveState
]);
//#region src/deriveState.ts
/**
* Derives authentication state based on the current rendering context (SSR or client-side).
*/ const deriveState = (clerkOperational, state, initialState)=>{
    if (!clerkOperational && initialState) return deriveFromSsrInitialState(initialState);
    return deriveFromClientSideState(state);
};
const deriveFromSsrInitialState = (initialState)=>{
    const userId = initialState.userId;
    const user = initialState.user;
    const sessionId = initialState.sessionId;
    const sessionStatus = initialState.sessionStatus;
    const sessionClaims = initialState.sessionClaims;
    return {
        userId,
        user,
        sessionId,
        session: initialState.session,
        sessionStatus,
        sessionClaims,
        organization: initialState.organization,
        orgId: initialState.orgId,
        orgRole: initialState.orgRole,
        orgPermissions: initialState.orgPermissions,
        orgSlug: initialState.orgSlug,
        actor: initialState.actor,
        factorVerificationAge: initialState.factorVerificationAge
    };
};
const deriveFromClientSideState = (state)=>{
    const userId = state.user ? state.user.id : state.user;
    const user = state.user;
    const sessionId = state.session ? state.session.id : state.session;
    const session = state.session;
    const sessionStatus = state.session?.status;
    const sessionClaims = state.session ? state.session.lastActiveToken?.jwt?.claims : null;
    const factorVerificationAge = state.session ? state.session.factorVerificationAge : null;
    const actor = session?.actor;
    const organization = state.organization;
    const orgId = state.organization ? state.organization.id : state.organization;
    const orgSlug = organization?.slug;
    const membership = organization ? user?.organizationMemberships?.find((om)=>om.organization.id === orgId) : organization;
    const orgPermissions = membership ? membership.permissions : membership;
    return {
        userId,
        user,
        sessionId,
        session,
        sessionStatus,
        sessionClaims,
        organization,
        orgId,
        orgRole: membership ? membership.role : membership,
        orgSlug,
        orgPermissions,
        actor,
        factorVerificationAge
    };
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/error.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
;
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/eventBus.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createEventBus",
    ()=>createEventBus
]);
//#region src/eventBus.ts
/**
* @internal
*/ const _on = (eventToHandlersMap, latestPayloadMap, event, handler, opts)=>{
    const { notify } = opts || {};
    let handlers = eventToHandlersMap.get(event);
    if (!handlers) {
        handlers = [];
        eventToHandlersMap.set(event, handlers);
    }
    handlers.push(handler);
    if (notify && latestPayloadMap.has(event)) handler(latestPayloadMap.get(event));
};
/**
* @internal
*/ const _dispatch = (eventToHandlersMap, event, payload)=>(eventToHandlersMap.get(event) || []).map((h)=>h(payload));
/**
* @internal
*/ const _off = (eventToHandlersMap, event, handler)=>{
    const handlers = eventToHandlersMap.get(event);
    if (handlers) if (handler) handlers.splice(handlers.indexOf(handler) >>> 0, 1);
    else eventToHandlersMap.set(event, []);
};
/**
* A ES6/2015 compatible 300 byte event bus
*
* Creates a strongly-typed event bus that enables publish/subscribe communication between components.
*
* @template Events - A record type that maps event names to their payload types
*
* @returns An EventBus instance with the following methods:
* - `on`: Subscribe to an event
* - `onPreDispatch`: Subscribe to an event, triggered before regular subscribers
* - `emit`: Publish an event with payload
* - `off`: Unsubscribe from an event
* - `offPreDispatch`: Unsubscribe from a pre-dispatch event
*
* @example
* // Define event types
* const eventBus = createEventBus<{
*   'user-login': { userId: string; timestamp: number };
*   'data-updated': { records: any[] };
*   'error': Error;
* }>();
*
* // Subscribe to events
* eventBus.on('user-login', ({ userId, timestamp }) => {
*   console.log(`User ${userId} logged in at ${timestamp}`);
* });
*
* // Subscribe with immediate notification if event was already dispatched
* eventBus.on('user-login', (payload) => {
*   // This will be called immediately if 'user-login' was previously dispatched
* }, { notify: true });
*
* // Publish an event
* eventBus.emit('user-login', { userId: 'abc123', timestamp: Date.now() });
*
* // Unsubscribe from event
* const handler = (payload) => console.log(payload);
* eventBus.on('error', handler);
* // Later...
* eventBus.off('error', handler);
*
* // Unsubscribe all handlers for an event
* eventBus.off('data-updated');
*/ const createEventBus = ()=>{
    const eventToHandlersMap = /* @__PURE__ */ new Map();
    const latestPayloadMap = /* @__PURE__ */ new Map();
    const eventToPredispatchHandlersMap = /* @__PURE__ */ new Map();
    const emit = (event, payload)=>{
        latestPayloadMap.set(event, payload);
        _dispatch(eventToPredispatchHandlersMap, event, payload);
        _dispatch(eventToHandlersMap, event, payload);
    };
    return {
        on: (...args)=>_on(eventToHandlersMap, latestPayloadMap, ...args),
        prioritizedOn: (...args)=>_on(eventToPredispatchHandlersMap, latestPayloadMap, ...args),
        emit,
        off: (...args)=>_off(eventToHandlersMap, ...args),
        prioritizedOff: (...args)=>_off(eventToPredispatchHandlersMap, ...args),
        internal: {
            retrieveListeners: (event)=>eventToHandlersMap.get(event) || []
        }
    };
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/getEnvVariable.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getEnvVariable",
    ()=>getEnvVariable
]);
var __TURBOPACK__import$2e$meta__ = {
    get url () {
        return __turbopack_context__.F("fincopilot-landing/node_modules/@clerk/shared/dist/getEnvVariable.mjs");
    },
    env: {
        DEV: true,
        PROD: false,
        MODE: "development",
        BASE_URL: "/",
        SSR: true
    },
    get turbopackHot () {
        return __turbopack_context__.m.hot;
    }
};
//#region src/getEnvVariable.ts
const hasCloudflareProxyContext = (context)=>{
    return !!context?.cloudflare?.env;
};
const hasCloudflareContext = (context)=>{
    return !!context?.env;
};
/**
* Retrieves an environment variable across runtime environments.
*
* @param name - The environment variable name to retrieve.
* @param context - Optional context object that may contain environment values.
* @returns The environment variable value or empty string if not found.
*/ const getEnvVariable = (name, context)=>{
    if (typeof process !== "undefined" && process.env && typeof process.env[name] === "string") return process.env[name];
    if (("TURBOPACK compile-time value", "object") !== "undefined" && __TURBOPACK__import$2e$meta__.env && typeof __TURBOPACK__import$2e$meta__.env[name] === "string") return __TURBOPACK__import$2e$meta__.env[name];
    if (hasCloudflareProxyContext(context)) return context.cloudflare.env[name] || "";
    if (hasCloudflareContext(context)) return context.env[name] || "";
    if (context && typeof context[name] === "string") return context[name];
    try {
        return globalThis[name];
    } catch  {}
    return "";
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/getToken.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getToken",
    ()=>getToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$browser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/browser.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)");
;
;
//#region src/getToken.ts
const TIMEOUT_MS = 1e4;
function getWindowClerk() {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$browser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inBrowser"])() && "Clerk" in window) {
        const clerk = window.Clerk;
        if (clerk && (clerk.status === "ready" || clerk.status === "degraded")) return clerk;
        if (clerk?.loaded && !clerk.status) return clerk;
    }
}
async function waitForClerk() {
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$browser$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["inBrowser"])()) throw new __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"]("getToken can only be used in browser environments. To access auth data server-side, see the Auth object reference doc: https://clerk.com/docs/reference/backend/types/auth-object", {
        code: "clerk_runtime_not_browser"
    });
    const clerk = getWindowClerk();
    if (clerk) return clerk;
    const clerkWindow = window;
    if (!clerkWindow.__clerk_internal_ready) {
        let resolve;
        let reject;
        const promise = new Promise((res, rej)=>{
            resolve = res;
            reject = rej;
        });
        promise.__resolve = resolve;
        promise.__reject = reject;
        clerkWindow.__clerk_internal_ready = promise;
    }
    const readyPromise = clerkWindow.__clerk_internal_ready;
    let timeoutId;
    const timeoutPromise = new Promise((_, reject)=>{
        timeoutId = setTimeout(()=>reject(new __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"]("Timeout waiting for Clerk to load.", {
                code: "clerk_runtime_load_timeout"
            })), TIMEOUT_MS);
    });
    return Promise.race([
        readyPromise,
        timeoutPromise
    ]).finally(()=>{
        clearTimeout(timeoutId);
    });
}
/**
* Retrieves the current session token, waiting for Clerk to initialize if necessary.
*
* This function is safe to call from anywhere in the browser, such as API interceptors,
* data fetching layers, or vanilla JavaScript code.
*
* **Note:** In frameworks with concurrent rendering (e.g., React 18+), a global token read
* may not correspond to the currently committed UI during transitions. This is a coherence
* consideration, not an auth safety issue.
*
* @param options - Optional configuration for token retrieval
* @param options.template - The name of a JWT template to use
* @param options.organizationId - Organization ID to include in the token
* @param options.skipCache - Whether to skip the token cache
* @returns A Promise that resolves to the session token, or `null` if the user is not signed in
*
* @throws {ClerkRuntimeError} When called in a non-browser environment (code: `clerk_runtime_not_browser`)
*
* @throws {ClerkRuntimeError} When Clerk fails to load within timeout (code: `clerk_runtime_load_timeout`)
*
* @throws {ClerkOfflineError} When the browser is offline and unable to fetch a token (code: `clerk_offline`).
* Use `ClerkOfflineError.is(error)` to check for this error type.
*
* @example
* ```typescript
* // In an Axios interceptor
* import { getToken } from '@clerk/nextjs';
*
* axios.interceptors.request.use(async (config) => {
*   const token = await getToken();
*   if (token) {
*     config.headers.Authorization = `Bearer ${token}`;
*   }
*   return config;
* });
* ```
*/ async function getToken(options) {
    const clerk = await waitForClerk();
    if (!clerk.session) return null;
    return clerk.session.getToken(options);
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/internal/clerk-js/errors.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clerkCoreErrorContextProviderNotFound",
    ()=>clerkCoreErrorContextProviderNotFound,
    "clerkCoreErrorNoClerkSingleton",
    ()=>clerkCoreErrorNoClerkSingleton,
    "clerkErrorDevInitFailed",
    ()=>clerkErrorDevInitFailed,
    "clerkErrorInitFailed",
    ()=>clerkErrorInitFailed,
    "clerkErrorPathRouterMissingPath",
    ()=>clerkErrorPathRouterMissingPath,
    "clerkFailedToLoadThirdPartyScript",
    ()=>clerkFailedToLoadThirdPartyScript,
    "clerkInvalidFAPIResponse",
    ()=>clerkInvalidFAPIResponse,
    "clerkInvalidRoutingStrategy",
    ()=>clerkInvalidRoutingStrategy,
    "clerkInvalidSignInUrlFormat",
    ()=>clerkInvalidSignInUrlFormat,
    "clerkInvalidSignInUrlOrigin",
    ()=>clerkInvalidSignInUrlOrigin,
    "clerkInvalidStrategy",
    ()=>clerkInvalidStrategy,
    "clerkMissingDevBrowser",
    ()=>clerkMissingDevBrowser,
    "clerkMissingFapiClientInResources",
    ()=>clerkMissingFapiClientInResources,
    "clerkMissingOptionError",
    ()=>clerkMissingOptionError,
    "clerkMissingProxyUrlAndDomain",
    ()=>clerkMissingProxyUrlAndDomain,
    "clerkMissingSignInUrlAsSatellite",
    ()=>clerkMissingSignInUrlAsSatellite,
    "clerkMissingWebAuthnPublicKeyOptions",
    ()=>clerkMissingWebAuthnPublicKeyOptions,
    "clerkNetworkError",
    ()=>clerkNetworkError,
    "clerkOAuthCallbackDidNotCompleteSignInSignUp",
    ()=>clerkOAuthCallbackDidNotCompleteSignInSignUp,
    "clerkRedirectUrlIsMissingScheme",
    ()=>clerkRedirectUrlIsMissingScheme,
    "clerkUIErrorDOMElementNotFound",
    ()=>clerkUIErrorDOMElementNotFound,
    "clerkUnsupportedEnvironmentWarning",
    ()=>clerkUnsupportedEnvironmentWarning,
    "clerkUnsupportedReloadMethod",
    ()=>clerkUnsupportedReloadMethod,
    "clerkVerifyEmailAddressCalledBeforeCreate",
    ()=>clerkVerifyEmailAddressCalledBeforeCreate,
    "clerkVerifyPasskeyCalledBeforeCreate",
    ()=>clerkVerifyPasskeyCalledBeforeCreate,
    "clerkVerifyWeb3WalletCalledBeforeCreate",
    ()=>clerkVerifyWeb3WalletCalledBeforeCreate
]);
//#region src/internal/clerk-js/errors.ts
const errorPrefix = "ClerkJS:";
/**
*
*/ function clerkErrorPathRouterMissingPath(componentName) {
    throw new Error(`${errorPrefix} Missing path option. The ${componentName} component was mounted with path routing so you need to specify the path where the component is mounted on e.g. path="/sign-in".`);
}
/**
*
*/ function clerkInvalidRoutingStrategy(strategy) {
    throw new Error(`${errorPrefix} Invalid routing strategy, path cannot be used in tandem with ${strategy}.`);
}
/**
*
*/ function clerkCoreErrorNoClerkSingleton() {
    throw new Error(`${errorPrefix} Clerk instance not found. Make sure Clerk is initialized before using any Clerk components.`);
}
/**
*
*/ function clerkCoreErrorContextProviderNotFound(providerName) {
    throw new Error(`${errorPrefix} ${providerName} not found. Make sure you wrap your app with <${providerName}>.`);
}
/**
*
*/ function clerkUIErrorDOMElementNotFound() {
    throw new Error(`${errorPrefix} The target element is empty. Provide a valid DOM element.`);
}
/**
* Used to log a warning when a Clerk feature is used in an unsupported environment.
* (Development Only)
* This is a warning and not an error because the application will still work, but the feature will not be available.
*
* @param strategy - The strategy that is not supported in the current environment.
* @returns void
*/ function clerkUnsupportedEnvironmentWarning(strategy) {
    console.warn(`${errorPrefix} ${strategy} is not supported in this environment.`);
}
/**
*
*/ function clerkNetworkError(url, e) {
    throw new Error(`${errorPrefix} Network error at "${url}" - ${e}. Please try again.`);
}
/**
*
*/ function clerkErrorInitFailed() {
    throw new Error(`${errorPrefix} Something went wrong initializing Clerk.`);
}
/**
*
*/ function clerkErrorDevInitFailed(msg = "") {
    throw new Error(`${errorPrefix} Something went wrong initializing Clerk in development mode.${msg && ` ${msg}`}`);
}
/**
*
*/ function clerkMissingFapiClientInResources() {
    throw new Error(`${errorPrefix} Missing FAPI client in resources.`);
}
/**
*
*/ function clerkOAuthCallbackDidNotCompleteSignInSignUp(type) {
    throw new Error(`${errorPrefix} Something went wrong initializing Clerk during the ${type} flow. Please contact support.`);
}
/**
*
*/ function clerkVerifyEmailAddressCalledBeforeCreate(type) {
    throw new Error(`${errorPrefix} You need to start a ${type} flow by calling ${type}.create() first.`);
}
/**
*
*/ function clerkInvalidStrategy(functionaName, strategy) {
    throw new Error(`${errorPrefix} Strategy "${strategy}" is not a valid strategy for ${functionaName}.`);
}
/**
*
*/ function clerkVerifyWeb3WalletCalledBeforeCreate(type) {
    throw new Error(`${errorPrefix} You need to start a ${type} flow by calling ${type}.create({ identifier: 'your web3 wallet address' }) first`);
}
/**
*
*/ function clerkVerifyPasskeyCalledBeforeCreate() {
    throw new Error(`${errorPrefix} You need to start a SignIn flow by calling SignIn.create({ strategy: 'passkey' }) first`);
}
/**
*
*/ function clerkMissingOptionError(name = "") {
    throw new Error(`${errorPrefix} Missing '${name}' option`);
}
/**
*
*/ function clerkInvalidFAPIResponse(status, supportEmail) {
    throw new Error(`${errorPrefix} Response: ${status || 0} not supported yet.\nFor more information contact us at ${supportEmail}`);
}
/**
*
*/ function clerkMissingDevBrowser() {
    throw new Error(`${errorPrefix} Missing dev browser. Please contact support.`);
}
/**
*
*/ function clerkMissingProxyUrlAndDomain() {
    throw new Error(`${errorPrefix} Missing domain and proxyUrl. A satellite application needs to specify a domain or a proxyUrl.`);
}
/**
*
*/ function clerkInvalidSignInUrlOrigin() {
    throw new Error(`${errorPrefix} The signInUrl needs to be on a different origin than your satellite application.`);
}
/**
*
*/ function clerkInvalidSignInUrlFormat() {
    throw new Error(`${errorPrefix} The signInUrl needs to have a absolute url format.`);
}
/**
*
*/ function clerkMissingSignInUrlAsSatellite() {
    throw new Error(`${errorPrefix} Missing signInUrl. A satellite application needs to specify the signInUrl for development instances.`);
}
/**
*
*/ function clerkRedirectUrlIsMissingScheme() {
    throw new Error(`${errorPrefix} Invalid redirect_url. A valid http or https url should be used for the redirection.`);
}
/**
*
*/ function clerkFailedToLoadThirdPartyScript(name) {
    throw new Error(`${errorPrefix} Unable to retrieve a third party script${name ? ` ${name}` : ""}.`);
}
/**
*
*/ function clerkUnsupportedReloadMethod(className) {
    throw new Error(`${errorPrefix} Calling ${className}.reload is not currently supported. Please contact support.`);
}
/**
*
*/ function clerkMissingWebAuthnPublicKeyOptions(name) {
    throw new Error(`${errorPrefix} Missing publicKey. When calling 'navigator.credentials.${name}()' it is required to pass a publicKey object.`);
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/internal/clerk-js/windowNavigate.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ALLOWED_PROTOCOLS",
    ()=>ALLOWED_PROTOCOLS,
    "CLERK_BEFORE_UNLOAD_EVENT",
    ()=>CLERK_BEFORE_UNLOAD_EVENT,
    "windowNavigate",
    ()=>windowNavigate
]);
//#region src/internal/clerk-js/windowNavigate.ts
const CLERK_BEFORE_UNLOAD_EVENT = "clerk:beforeunload";
/**
* Additional protocols can be provided using the `allowedRedirectProtocols` Clerk option.
*/ const ALLOWED_PROTOCOLS = [
    "http:",
    "https:",
    "wails:",
    "chrome-extension:"
];
const SCHEME_RELATIVE_PREFIX = /^[/\\][/\\]/;
/**
* Normalizes a string the same way the WHATWG URL parser does before it parses: strip leading C0
* control and space characters, then remove ASCII tab/LF/CR from anywhere. Without this, inputs
* like `/\t/evil.com` or `\x00//evil.com` slip past the scheme-relative check yet still resolve
* scheme-relative (inheriting the base's allowlisted scheme) and redirect cross-origin.
*/ function stripUrlParserIgnoredChars(to) {
    let start = 0;
    while(start < to.length && to.charCodeAt(start) <= 32)start++;
    let result = "";
    for(let i = start; i < to.length; i++){
        const code = to.charCodeAt(i);
        if (code !== 9 && code !== 10 && code !== 13) result += to[i];
    }
    return result;
}
/**
* Helper utility to navigate via window.location.href. Also dispatches a clerk:beforeunload custom event.
*
* Navigations whose protocol is not in the allowlist (e.g. `javascript:`, `data:`) are aborted.
* Scheme-relative inputs (`//host`, `\\host`) are also rejected: they adopt the base URL's scheme,
* which is always in the allowlist, so they would otherwise pass the protocol check while
* redirecting cross-origin.
*
* Callers that have already validated against an extended allowlist should pass it via
* `options.allowedProtocols` so legitimate custom protocols (Wails, Tauri, etc.) are honored.
*
* @deprecated Use `clerk.__internal_windowNavigate` instead. It honors the customer-supplied
* `allowedRedirectProtocols` option by default, so internal call sites can't accidentally
* bypass it by forgetting to pass `options.allowedProtocols`. The bare export will be removed
* in the next major version.
*/ function windowNavigate(to, options) {
    if (typeof to === "string" && SCHEME_RELATIVE_PREFIX.test(stripUrlParserIgnoredChars(to))) {
        console.warn(`Clerk: scheme-relative navigation to "${to}" is not allowed. Provide a same-origin path or an absolute URL.`);
        return;
    }
    const toURL = new URL(to, window.location.href);
    if (!(options?.allowedProtocols ?? ALLOWED_PROTOCOLS).includes(toURL.protocol)) {
        console.warn(`Clerk: "${toURL.protocol}" is not a valid navigation protocol. Aborting navigation. If you think this is a mistake, please open an issue.`);
        return;
    }
    window.dispatchEvent(new CustomEvent(CLERK_BEFORE_UNLOAD_EVENT));
    window.location.href = toURL.href;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicAtob.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isomorphicAtob",
    ()=>isomorphicAtob
]);
//#region src/isomorphicAtob.ts
/**
* A function that decodes a string of data which has been encoded using base-64 encoding.
* Uses `atob` if available, otherwise uses `Buffer` from `globalThis`. If neither are available, returns the data as-is.
*/ const isomorphicAtob = (data)=>{
    if (typeof atob !== "undefined" && typeof atob === "function") return atob(data);
    else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data, "base64").toString();
    return data;
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicBtoa.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isomorphicBtoa",
    ()=>isomorphicBtoa
]);
//#region src/isomorphicBtoa.ts
const isomorphicBtoa = (data)=>{
    if (typeof btoa !== "undefined" && typeof btoa === "function") return btoa(data);
    else if (typeof globalThis.Buffer !== "undefined") return globalThis.Buffer.from(data).toString("base64");
    return data;
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildPublishableKey",
    ()=>buildPublishableKey,
    "createDevOrStagingUrlCache",
    ()=>createDevOrStagingUrlCache,
    "getCookieSuffix",
    ()=>getCookieSuffix,
    "getSuffixedCookieName",
    ()=>getSuffixedCookieName,
    "isDevelopmentFromPublishableKey",
    ()=>isDevelopmentFromPublishableKey,
    "isDevelopmentFromSecretKey",
    ()=>isDevelopmentFromSecretKey,
    "isProductionFromPublishableKey",
    ()=>isProductionFromPublishableKey,
    "isProductionFromSecretKey",
    ()=>isProductionFromSecretKey,
    "isPublishableKey",
    ()=>isPublishableKey,
    "parsePublishableKey",
    ()=>parsePublishableKey,
    "publishableKeyFromHost",
    ()=>publishableKeyFromHost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicAtob$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicAtob.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicBtoa$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicBtoa.mjs [app-ssr] (ecmascript)");
;
;
;
//#region src/keys.ts
/** Prefix used for production publishable keys */ const PUBLISHABLE_KEY_LIVE_PREFIX = "pk_live_";
/** Prefix used for development publishable keys */ const PUBLISHABLE_KEY_TEST_PREFIX = "pk_test_";
/**
* Regular expression that matches development frontend API keys.
* Matches patterns like: foo-bar-13.clerk.accounts.dev.
*/ const PUBLISHABLE_FRONTEND_API_DEV_REGEX = /^(([a-z]+)-){2}([0-9]{1,2})\.clerk\.accounts([a-z.]*)(dev|com)$/i;
/**
* Converts a frontend API URL into an unpadded base64-encoded publishable key.
*
* @param frontendApi - The frontend API URL (e.g., 'clerk.example.com').
* @returns An unpadded base64-encoded publishable key with appropriate prefix (pk_live_ or pk_test_).
*/ function buildPublishableKey(frontendApi) {
    return `${PUBLISHABLE_FRONTEND_API_DEV_REGEX.test(frontendApi) || frontendApi.startsWith("clerk.") && __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((s)=>frontendApi.endsWith(s)) ? PUBLISHABLE_KEY_TEST_PREFIX : PUBLISHABLE_KEY_LIVE_PREFIX}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicBtoa$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isomorphicBtoa"])(`${frontendApi}$`).replace(/=+$/, "")}`;
}
/**
* Derives a publishable key from the current hostname. Intended for multi-domain
* setups (e.g. custom domains on top of a default domain) where the correct key
* must be resolved per request.
*
* Pass the configured publishable key as `fallbackKey` so that development
* instances (pk_test_) are returned as-is instead of being incorrectly derived
* from the host (e.g. localhost).
*
* @example
* // React (use window.location.hostname, not window.location.host, to avoid including the port)
* <ClerkProvider publishableKey={publishableKeyFromHost(window.location.hostname, import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)}>
*
* @example
* // Express (inside clerkMiddleware callback)
* // Validate req.hostname against a known allowlist before passing it in.
* // When `trust proxy` is enabled, req.hostname reads from X-Forwarded-Host
* // and can be spoofed if your proxy is not properly configured.
* const ALLOWED_HOSTS = ['domain-a.com', 'domain-b.com'];
* clerkMiddleware((req) => {
*   if (!ALLOWED_HOSTS.includes(req.hostname)) throw new Error('Unknown host');
*   return { publishableKey: publishableKeyFromHost(req.hostname, process.env.CLERK_PUBLISHABLE_KEY) };
* })
*/ function publishableKeyFromHost(host, fallbackKey) {
    if (fallbackKey && isDevelopmentFromPublishableKey(fallbackKey)) return fallbackKey;
    const hostname = host.toLowerCase().replace(/:\d+$/, "");
    if (!hostname) throw new Error("Host must not be empty.");
    return buildPublishableKey(`clerk.${hostname}`);
}
/**
* Validates that a decoded publishable key has the correct format.
* The decoded value should be a frontend API followed by exactly one '$' at the end.
*
* @param decoded - The decoded publishable key string to validate.
* @returns `true` if the decoded key has valid format, `false` otherwise.
*/ function isValidDecodedPublishableKey(decoded) {
    if (!decoded.endsWith("$")) return false;
    const withoutTrailing = decoded.slice(0, -1);
    if (withoutTrailing.includes("$")) return false;
    return withoutTrailing.includes(".");
}
const fatalKeyGuidance = `To create a Clerk application with valid keys, in your terminal run:

npx clerk@latest init

\`npx clerk@latest init\` creates a Clerk application and writes keys to your .env file. No Clerk account or login required and the command is non-interactive.

If you have a Clerk application, run \`npx clerk@latest env pull\` to write the keys (\`--instance prod\` for production keys). Or copy them from https://dashboard.clerk.com/last-active?path=api-keys.`;
/**
* Parses and validates a publishable key, extracting the frontend API and instance type.
*
* @param key - The publishable key to parse.
* @param options - Configuration options for parsing.
* @param options.fatal
* @param options.domain
* @param options.proxyUrl
* @param options.isSatellite
* @returns Parsed publishable key object with instanceType and frontendApi, or null if invalid.
*
* @throws {Error} When options.fatal is true and key is missing or invalid.
*/ function parsePublishableKey(key, options = {}) {
    key = key || "";
    if (!key || !isPublishableKey(key)) {
        if (options.fatal && !key) throw new Error(`Publishable key is missing. ${fatalKeyGuidance}`);
        if (options.fatal && !isPublishableKey(key)) throw new Error(`Publishable key not valid (expected format: pk_test_... or pk_live_...). ${fatalKeyGuidance}`);
        return null;
    }
    const instanceType = key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) ? "production" : "development";
    let decodedFrontendApi;
    try {
        decodedFrontendApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicAtob$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isomorphicAtob"])(key.split("_")[2]);
    } catch  {
        if (options.fatal) throw new Error(`Publishable key not valid: Failed to decode key. ${fatalKeyGuidance}`);
        return null;
    }
    if (!isValidDecodedPublishableKey(decodedFrontendApi)) {
        if (options.fatal) throw new Error(`Publishable key not valid: Decoded key has invalid format. ${fatalKeyGuidance}`);
        return null;
    }
    let frontendApi = decodedFrontendApi.slice(0, -1);
    if (options.proxyUrl) frontendApi = options.proxyUrl;
    else if (instanceType !== "development" && options.domain && options.isSatellite) frontendApi = `clerk.${options.domain}`;
    return {
        instanceType,
        frontendApi
    };
}
/**
* Checks if the provided key is a valid publishable key.
*
* @param key - The key to be checked. Defaults to an empty string if not provided.
* @returns `true` if 'key' is a valid publishable key, `false` otherwise.
*/ function isPublishableKey(key = "") {
    try {
        if (!(key.startsWith(PUBLISHABLE_KEY_LIVE_PREFIX) || key.startsWith(PUBLISHABLE_KEY_TEST_PREFIX))) return false;
        const parts = key.split("_");
        if (parts.length !== 3) return false;
        const encodedPart = parts[2];
        if (!encodedPart) return false;
        return isValidDecodedPublishableKey((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicAtob$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isomorphicAtob"])(encodedPart));
    } catch  {
        return false;
    }
}
/**
* Creates a memoized cache for checking if URLs are development or staging environments.
* Uses a Map to cache results for better performance on repeated checks.
*
* @returns An object with an isDevOrStagingUrl method that checks if a URL is dev/staging.
*/ function createDevOrStagingUrlCache() {
    const devOrStagingUrlCache = /* @__PURE__ */ new Map();
    return {
        /**
	* Checks if a URL is a development or staging environment.
	*
	* @param url - The URL to check (string or URL object).
	* @returns `true` if the URL is a development or staging environment, `false` otherwise.
	*/ isDevOrStagingUrl: (url)=>{
            if (!url) return false;
            const hostname = typeof url === "string" ? url : url.hostname;
            let res = devOrStagingUrlCache.get(hostname);
            if (res === void 0) {
                res = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEV_OR_STAGING_SUFFIXES"].some((s)=>hostname.endsWith(s));
                devOrStagingUrlCache.set(hostname, res);
            }
            return res;
        }
    };
}
/**
* Checks if a publishable key is for a development environment.
* Supports both legacy format (test_) and new format (pk_test_).
*
* @param apiKey - The API key to check.
* @returns `true` if the key is for development, `false` otherwise.
*/ function isDevelopmentFromPublishableKey(apiKey) {
    return apiKey.startsWith("test_") || apiKey.startsWith("pk_test_");
}
/**
* Checks if a publishable key is for a production environment.
* Supports both legacy format (live_) and new format (pk_live_).
*
* @param apiKey - The API key to check.
* @returns `true` if the key is for production, `false` otherwise.
*/ function isProductionFromPublishableKey(apiKey) {
    return apiKey.startsWith("live_") || apiKey.startsWith("pk_live_");
}
/**
* Checks if a secret key is for a development environment.
* Supports both legacy format (test_) and new format (sk_test_).
*
* @param apiKey - The secret key to check.
* @returns `true` if the key is for development, `false` otherwise.
*/ function isDevelopmentFromSecretKey(apiKey) {
    return apiKey.startsWith("test_") || apiKey.startsWith("sk_test_");
}
/**
* Checks if a secret key is for a production environment.
* Supports both legacy format (live_) and new format (sk_live_).
*
* @param apiKey - The secret key to check.
* @returns `true` if the key is for production, `false` otherwise.
*/ function isProductionFromSecretKey(apiKey) {
    return apiKey.startsWith("live_") || apiKey.startsWith("sk_live_");
}
/**
* Generates a unique cookie suffix based on the publishable key using SHA-1 hashing.
* The suffix is base64-encoded and URL-safe (+ and / characters are replaced).
*
* @param publishableKey - The publishable key to generate suffix from.
* @param subtle - The SubtleCrypto interface to use for hashing (defaults to globalThis.crypto.subtle).
* @returns A promise that resolves to an 8-character URL-safe base64 string.
*/ async function getCookieSuffix(publishableKey, subtle = globalThis.crypto.subtle) {
    const data = new TextEncoder().encode(publishableKey);
    const digest = await subtle.digest("sha-1", data);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicBtoa$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isomorphicBtoa"])(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
}
/**
* Creates a suffixed cookie name by appending the cookie suffix to the base name.
* Used to create unique cookie names based on the publishable key.
*
* @param cookieName - The base cookie name.
* @param cookieSuffix - The suffix to append (typically generated by getCookieSuffix).
* @returns The suffixed cookie name in format: `${cookieName}_${cookieSuffix}`.
*/ const getSuffixedCookieName = (cookieName, cookieSuffix)=>{
    return `${cookieName}_${cookieSuffix}`;
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/loadClerkJsScript.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildClerkJSScriptAttributes",
    ()=>buildClerkJSScriptAttributes,
    "buildClerkJsScriptAttributes",
    ()=>buildClerkJsScriptAttributes,
    "buildClerkUIScriptAttributes",
    ()=>buildClerkUIScriptAttributes,
    "buildScriptHost",
    ()=>buildScriptHost,
    "clerkJSScriptUrl",
    ()=>clerkJSScriptUrl,
    "clerkJsScriptUrl",
    ()=>clerkJsScriptUrl,
    "clerkUIScriptUrl",
    ()=>clerkUIScriptUrl,
    "loadClerkJSScript",
    ()=>loadClerkJSScript,
    "loadClerkJsScript",
    ()=>loadClerkJsScript,
    "loadClerkUIScript",
    ()=>loadClerkUIScript,
    "setClerkJSLoadingErrorPackageName",
    ()=>setClerkJSLoadingErrorPackageName,
    "setClerkJsLoadingErrorPackageName",
    ()=>setClerkJsLoadingErrorPackageName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadScript$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/loadScript.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$url$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/url.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$versionSelector$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/versionSelector.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
//#region src/loadClerkJsScript.ts
const { isDevOrStagingUrl } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createDevOrStagingUrlCache"])();
const errorThrower = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["y"])({
    packageName: "@clerk/shared"
});
/**
* Validates that window.Clerk exists and is properly initialized.
* This ensures we don't have false positives where the script loads but Clerk is malformed.
*
* @returns `true` if window.Clerk exists and has the expected structure with a load method.
*/ function isClerkGlobalProperlyLoaded(prop) {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
const isClerkProperlyLoaded = ()=>isClerkGlobalProperlyLoaded("Clerk");
const isClerkUIProperlyLoaded = ()=>isClerkGlobalProperlyLoaded("__internal_ClerkUICtor");
/**
* Checks if an existing script has a request error using Performance API.
*
* @param scriptUrl - The URL of the script to check.
* @returns True if the script has failed to load due to a network/HTTP error.
*/ function hasScriptRequestError(scriptUrl) {
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    const entries = undefined;
    const scriptEntry = undefined;
}
/**
* Hotloads the Clerk JS script with robust failure detection.
*
* Uses a timeout-based approach to ensure absolute certainty about load success/failure.
* If the script fails to load within the timeout period, or loads but doesn't create
* a proper Clerk instance, the promise rejects with an error.
*
* @param opts - The options used to build the Clerk JS script URL and load the script.
*               Must include a `publishableKey` if no existing script is found.
* @returns Promise that resolves with null if Clerk loads successfully, or rejects with an error.
*
* @example
* ```typescript
* try {
*   await loadClerkJsScript({ publishableKey: 'pk_test_...' });
*   console.log('Clerk loaded successfully');
* } catch (error) {
*   console.error('Failed to load Clerk:', error.message);
* }
* ```
*/ const loadClerkJSScript = async (opts)=>{
    const timeout = opts?.scriptLoadTimeout ?? 15e3;
    const rejectWith = (error)=>new __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"]("Failed to load Clerk JS" + (error?.message ? `, ${error.message}` : ""), {
            code: "failed_to_load_clerk_js",
            cause: error
        });
    if (isClerkProperlyLoaded()) return null;
    if (!opts?.publishableKey) {
        errorThrower.throwMissingPublishableKeyError();
        return null;
    }
    const scriptUrl = clerkJSScriptUrl(opts);
    const existingScript = document.querySelector("script[data-clerk-js-script]");
    if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
    else try {
        await waitForPredicateWithTimeout(timeout, isClerkProperlyLoaded, rejectWith(), existingScript);
        return null;
    } catch  {
        existingScript.remove();
    }
    const loadPromise = waitForPredicateWithTimeout(timeout, isClerkProperlyLoaded, rejectWith());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadScript$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadScript"])(scriptUrl, {
        async: true,
        crossOrigin: "anonymous",
        nonce: opts.nonce,
        beforeLoad: applyAttributesToScript(buildClerkJSScriptAttributes(opts))
    }).catch((error)=>{
        throw rejectWith(error);
    });
    return loadPromise;
};
const loadClerkUIScript = async (opts)=>{
    const timeout = opts?.scriptLoadTimeout ?? 15e3;
    const rejectWith = (error)=>new __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"]("Failed to load Clerk UI" + (error?.message ? `, ${error.message}` : ""), {
            code: "failed_to_load_clerk_ui",
            cause: error
        });
    if (isClerkUIProperlyLoaded()) return null;
    if (!opts?.publishableKey) {
        errorThrower.throwMissingPublishableKeyError();
        return null;
    }
    const scriptUrl = clerkUIScriptUrl(opts);
    const existingScript = document.querySelector("script[data-clerk-ui-script]");
    if (existingScript) if (hasScriptRequestError(scriptUrl)) existingScript.remove();
    else try {
        await waitForPredicateWithTimeout(timeout, isClerkUIProperlyLoaded, rejectWith(), existingScript);
        return null;
    } catch  {
        existingScript.remove();
    }
    const loadPromise = waitForPredicateWithTimeout(timeout, isClerkUIProperlyLoaded, rejectWith());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$loadScript$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadScript"])(scriptUrl, {
        async: true,
        crossOrigin: "anonymous",
        nonce: opts.nonce,
        beforeLoad: applyAttributesToScript(buildClerkUIScriptAttributes(opts))
    }).catch((error)=>{
        throw rejectWith(error);
    });
    return loadPromise;
};
const clerkJSScriptUrl = (opts)=>{
    const { __internal_clerkJSUrl, __internal_clerkJSVersion, proxyUrl, domain, publishableKey } = opts;
    if (__internal_clerkJSUrl) return __internal_clerkJSUrl;
    const version = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$versionSelector$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["versionSelector"])(__internal_clerkJSVersion);
    if (proxyUrl && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isProxyUrlRelative"])(proxyUrl)) return buildRelativeProxyScriptUrl(proxyUrl, "clerk-js", version, "clerk.browser.js");
    return `https://${buildScriptHost({
        publishableKey,
        proxyUrl,
        domain
    })}/npm/@clerk/clerk-js@${version}/dist/clerk.browser.js`;
};
const clerkUIScriptUrl = (opts)=>{
    const { __internal_clerkUIUrl, __internal_clerkUIVersion, proxyUrl, domain, publishableKey } = opts;
    if (__internal_clerkUIUrl) return __internal_clerkUIUrl;
    const version = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$versionSelector$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["versionSelector"])(__internal_clerkUIVersion, "1.31.0");
    if (proxyUrl && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isProxyUrlRelative"])(proxyUrl)) return buildRelativeProxyScriptUrl(proxyUrl, "ui", version, "ui.browser.js");
    return `https://${buildScriptHost({
        publishableKey,
        proxyUrl,
        domain
    })}/npm/@clerk/ui@${version}/dist/ui.browser.js`;
};
const buildClerkJSScriptAttributes = (options)=>{
    const obj = {};
    if (options.publishableKey) obj["data-clerk-publishable-key"] = options.publishableKey;
    if (options.proxyUrl) obj["data-clerk-proxy-url"] = options.proxyUrl;
    if (options.domain) obj["data-clerk-domain"] = options.domain;
    if (options.nonce) obj.nonce = options.nonce;
    return obj;
};
const buildClerkUIScriptAttributes = (options)=>{
    return buildClerkJSScriptAttributes(options);
};
const applyAttributesToScript = (attributes)=>(script)=>{
        for(const attribute in attributes)script.setAttribute(attribute, attributes[attribute]);
    };
const stripTrailingSlashes = (value)=>{
    while(value.endsWith("/"))value = value.slice(0, -1);
    return value;
};
const buildRelativeProxyScriptUrl = (proxyUrl, packageName, version, fileName)=>{
    return `${stripTrailingSlashes(proxyUrl)}/npm/@clerk/${packageName}@${version}/dist/${fileName}`;
};
const buildScriptHost = (opts)=>{
    const { proxyUrl, domain, publishableKey } = opts;
    if (!!proxyUrl && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isValidProxyUrl"])(proxyUrl)) {
        const resolvedProxyUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["proxyUrlToAbsoluteURL"])(proxyUrl);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isProxyUrlRelative"])(resolvedProxyUrl)) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)?.frontendApi || "";
        return resolvedProxyUrl.replace(/http(s)?:\/\//, "");
    } else if (domain && !isDevOrStagingUrl((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)?.frontendApi || "")) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$url$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["addClerkPrefix"])(domain);
    else return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)?.frontendApi || "";
};
function waitForPredicateWithTimeout(timeoutMs, predicate, rejectWith, existingScript) {
    return new Promise((resolve, reject)=>{
        let resolved = false;
        const cleanup = (timeoutId, pollInterval)=>{
            clearTimeout(timeoutId);
            clearInterval(pollInterval);
        };
        existingScript?.addEventListener("error", ()=>{
            cleanup(timeoutId, pollInterval);
            reject(rejectWith);
        });
        const checkAndResolve = ()=>{
            if (resolved) return;
            if (predicate()) {
                resolved = true;
                cleanup(timeoutId, pollInterval);
                resolve(null);
            }
        };
        const handleTimeout = ()=>{
            if (resolved) return;
            resolved = true;
            cleanup(timeoutId, pollInterval);
            if (!predicate()) reject(rejectWith);
            else resolve(null);
        };
        const timeoutId = setTimeout(handleTimeout, timeoutMs);
        checkAndResolve();
        const pollInterval = setInterval(()=>{
            if (resolved) {
                clearInterval(pollInterval);
                return;
            }
            checkAndResolve();
        }, 100);
    });
}
function setClerkJSLoadingErrorPackageName(packageName) {
    errorThrower.setPackageName({
        packageName
    });
}
/**
* @deprecated Use `loadClerkJSScript` instead. This alias will be removed in a future major version.
*/ const loadClerkJsScript = loadClerkJSScript;
/**
* @deprecated Use `clerkJSScriptUrl` instead. This alias will be removed in a future major version.
*/ const clerkJsScriptUrl = clerkJSScriptUrl;
/**
* @deprecated Use `buildClerkJSScriptAttributes` instead. This alias will be removed in a future major version.
*/ const buildClerkJsScriptAttributes = buildClerkJSScriptAttributes;
/**
* @deprecated Use `setClerkJSLoadingErrorPackageName` instead. This alias will be removed in a future major version.
*/ const setClerkJsLoadingErrorPackageName = setClerkJSLoadingErrorPackageName;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/loadScript.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loadScript",
    ()=>loadScript
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$retry$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/retry.mjs [app-ssr] (ecmascript)");
;
//#region src/loadScript.ts
const NO_DOCUMENT_ERROR = "loadScript cannot be called when document does not exist";
const NO_SRC_ERROR = "loadScript cannot be called without a src";
/**
*
*/ async function loadScript(src = "", opts) {
    const { async, defer, beforeLoad, crossOrigin, nonce } = opts || {};
    const load = ()=>{
        return new Promise((resolve, reject)=>{
            if (!src) reject(/* @__PURE__ */ new Error(NO_SRC_ERROR));
            if (!document || !document.body) reject(/* @__PURE__ */ new Error(NO_DOCUMENT_ERROR));
            const script = document.createElement("script");
            if (crossOrigin) script.setAttribute("crossorigin", crossOrigin);
            script.async = async || false;
            script.defer = defer || false;
            script.addEventListener("load", ()=>{
                script.remove();
                resolve(script);
            });
            script.addEventListener("error", (event)=>{
                script.remove();
                reject(event.error ?? /* @__PURE__ */ new Error(`failed to load script: ${src}`));
            });
            script.src = src;
            if (nonce) script.nonce = nonce;
            beforeLoad?.(script);
            document.body.appendChild(script);
        });
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$retry$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["retry"])(load, {
        shouldRetry: (_, iterations)=>{
            return iterations <= 5;
        }
    });
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/logger.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logger",
    ()=>logger
]);
//#region src/logger.ts
const loggedMessages = /* @__PURE__ */ new Set();
const logger = {
    /**
	* A custom logger that ensures messages are logged only once.
	* Reduces noise and duplicated messages when logs are in a hot codepath.
	*/ warnOnce: (msg)=>{
        if (loggedMessages.has(msg)) return;
        loggedMessages.add(msg);
        console.warn(msg);
    },
    logOnce: (msg)=>{
        if (loggedMessages.has(msg)) return;
        console.log(msg);
        loggedMessages.add(msg);
    }
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/object.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyFunctionToObj",
    ()=>applyFunctionToObj,
    "filterProps",
    ()=>filterProps,
    "removeUndefined",
    ()=>removeUndefined,
    "without",
    ()=>without
]);
//#region src/object.ts
const without = (obj, ...props)=>{
    const copy = {
        ...obj
    };
    for (const prop of props)delete copy[prop];
    return copy;
};
const removeUndefined = (obj)=>{
    return Object.entries(obj).reduce((acc, [key, value])=>{
        if (value !== void 0 && value !== null) acc[key] = value;
        return acc;
    }, {});
};
const applyFunctionToObj = (obj, fn)=>{
    const result = {};
    for(const key in obj)result[key] = fn(obj[key], key);
    return result;
};
const filterProps = (obj, filter)=>{
    const result = {};
    for(const key in obj)if (obj[key] && filter(obj[key])) result[key] = obj[key];
    return result;
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/organization.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCurrentOrganizationMembership",
    ()=>getCurrentOrganizationMembership
]);
//#region src/organization.ts
/**
* Finds the Organization membership for a given Organization ID from a list of memberships
*
* @param organizationMemberships - Array of Organization memberships to search through
* @param organizationId - ID of the Organization to find the membership for
* @returns The matching Organization membership or undefined if not found
*/ function getCurrentOrganizationMembership(organizationMemberships, organizationId) {
    return organizationMemberships.find((organizationMembership)=>organizationMembership.organization.id === organizationId);
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/proxy.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTO_PROXY_PATH",
    ()=>AUTO_PROXY_PATH,
    "getAutoProxyUrlFromEnvironment",
    ()=>getAutoProxyUrlFromEnvironment,
    "isAutoProxyDisabledFromEnvironment",
    ()=>isAutoProxyDisabledFromEnvironment,
    "isHttpOrHttps",
    ()=>isHttpOrHttps,
    "isProxyUrlRelative",
    ()=>isProxyUrlRelative,
    "isValidProxyUrl",
    ()=>isValidProxyUrl,
    "proxyUrlToAbsoluteURL",
    ()=>proxyUrlToAbsoluteURL,
    "shouldAutoProxy",
    ()=>shouldAutoProxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [app-ssr] (ecmascript)");
;
;
//#region src/proxy.ts
/**
*
*/ function isValidProxyUrl(key) {
    if (!key) return true;
    return isHttpOrHttps(key) || isProxyUrlRelative(key);
}
/**
*
*/ function isHttpOrHttps(key) {
    return /^http(s)?:\/\//.test(key || "");
}
/**
*
*/ function isProxyUrlRelative(key) {
    return key.startsWith("/");
}
/**
*
*/ function proxyUrlToAbsoluteURL(url) {
    if (!url) return "";
    if (!isProxyUrlRelative(url)) return url;
    if (("TURBOPACK compile-time value", "undefined") === "undefined" || !window.location?.origin) return url;
    //TURBOPACK unreachable
    ;
}
const AUTO_PROXY_HOST_SUFFIXES = [
    ".vercel.app"
];
const AUTO_PROXY_PATH = "/__clerk";
function shouldAutoProxy(hostname) {
    return AUTO_PROXY_HOST_SUFFIXES.some((hostSuffix)=>hostname?.endsWith(hostSuffix)) ?? false;
}
function getDefaultEnvironment() {
    return typeof process !== "undefined" && process.env ? process.env : {};
}
function isAutoProxyDisabledFromEnvironment(environment = getDefaultEnvironment()) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isTruthy"])(environment.CLERK_DISABLE_AUTO_PROXY);
}
function normalizeHostname(hostnameOrUrl) {
    if (hostnameOrUrl.startsWith("http://") || hostnameOrUrl.startsWith("https://")) try {
        return new URL(hostnameOrUrl).hostname;
    } catch  {
        return "";
    }
    return hostnameOrUrl.split("/")[0] || "";
}
/**
* Determines if the current Vercel environment should use auto-proxy.
* Note: This runs both at build time (static generation) and at runtime
* (server-side rendering) via mergeNextClerkPropsWithEnv in providers.
* The return value may become the proxyUrl or the script src prefix.
*/ function getAutoProxyUrlFromEnvironment({ publishableKey, hasDomain = false, hasProxyUrl = false, environment = getDefaultEnvironment() }) {
    if (hasProxyUrl || hasDomain || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isProductionFromPublishableKey"])(publishableKey)) return "";
    if (isAutoProxyDisabledFromEnvironment(environment)) return "";
    if (environment.VERCEL_TARGET_ENV !== "production") return "";
    const vercelProductionHostname = environment.VERCEL_PROJECT_PRODUCTION_URL;
    if (!vercelProductionHostname || !shouldAutoProxy(normalizeHostname(vercelProductionHostname))) return "";
    return AUTO_PROXY_PATH;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkContextProvider",
    ()=>ClerkContextProvider,
    "ClerkInstanceContext",
    ()=>ClerkInstanceContext,
    "InitialStateProvider",
    ()=>InitialStateProvider,
    "OptionsContext",
    ()=>OptionsContext,
    "UNSAFE_PortalProvider",
    ()=>UNSAFE_PortalProvider,
    "__createClerkTestQueryClient",
    ()=>__createClerkTestQueryClient,
    "__experimental_CheckoutProvider",
    ()=>__experimental_CheckoutProvider,
    "__experimental_PaymentElement",
    ()=>PaymentElement,
    "__experimental_PaymentElementProvider",
    ()=>PaymentElementProvider,
    "__experimental_useCheckout",
    ()=>useCheckout,
    "__experimental_usePaymentAttempts",
    ()=>usePaymentAttempts,
    "__experimental_usePaymentElement",
    ()=>usePaymentElement,
    "__experimental_usePaymentMethods",
    ()=>usePaymentMethods,
    "__experimental_usePlans",
    ()=>usePlans,
    "__experimental_useStatements",
    ()=>useStatements,
    "__experimental_useSubscription",
    ()=>useSubscription,
    "__internal_useClientBase",
    ()=>useClientBase,
    "__internal_useCreditBalanceQuery",
    ()=>__internal_useCreditBalanceQuery,
    "__internal_useCreditHistoryQuery",
    ()=>__internal_useCreditHistoryQuery,
    "__internal_useOrganizationBase",
    ()=>useOrganizationBase,
    "__internal_useOrganizationDomains",
    ()=>useOrganizationDomains,
    "__internal_useOrganizationEnterpriseConnectionTestRuns",
    ()=>useOrganizationEnterpriseConnectionTestRuns,
    "__internal_useOrganizationEnterpriseConnections",
    ()=>useOrganizationEnterpriseConnections,
    "__internal_usePaymentAttemptQuery",
    ()=>usePaymentAttemptQuery,
    "__internal_usePlanDetailsQuery",
    ()=>__internal_usePlanDetailsQuery,
    "__internal_useSessionBase",
    ()=>useSessionBase,
    "__internal_useStatementQuery",
    ()=>useStatementQuery,
    "__internal_useUserBase",
    ()=>useUserBase,
    "__internal_useUserEnterpriseConnections",
    ()=>useUserEnterpriseConnections,
    "__resetClerkQueryClientForTest",
    ()=>__resetClerkQueryClientForTest,
    "__setClerkQueryClientForTest",
    ()=>__setClerkQueryClientForTest,
    "assertContextExists",
    ()=>assertContextExists,
    "createContextAndHook",
    ()=>createContextAndHook,
    "getClerkQueryClient",
    ()=>getClerkQueryClient,
    "isDeeplyEqual",
    ()=>isDeeplyEqual,
    "useAPIKeys",
    ()=>useAPIKeys,
    "useAssertWrappedByClerkProvider",
    ()=>useAssertWrappedByClerkProvider,
    "useAttemptToEnableOrganizations",
    ()=>useAttemptToEnableOrganizations,
    "useClerk",
    ()=>useClerk,
    "useClerkInstanceContext",
    ()=>useClerkInstanceContext,
    "useDeepEqualMemo",
    ()=>useDeepEqualMemo,
    "useInitialStateContext",
    ()=>useInitialStateContext,
    "useOAuthConsent",
    ()=>useOAuthConsent,
    "useOptionsContext",
    ()=>useOptionsContext,
    "useOrganization",
    ()=>useOrganization,
    "useOrganizationCreationDefaults",
    ()=>useOrganizationCreationDefaults,
    "useOrganizationList",
    ()=>useOrganizationList,
    "usePortalRoot",
    ()=>usePortalRoot,
    "useReverification",
    ()=>useReverification,
    "useSafeLayoutEffect",
    ()=>useSafeLayoutEffect,
    "useSession",
    ()=>useSession,
    "useSessionList",
    ()=>useSessionList,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2d$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/authorization-errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/authorization.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$deriveState$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/deriveState.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/logger.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$organization$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/organization.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$createDeferredPromise$2d$DNC587Fa$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/createDeferredPromise-DNC587Fa.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$internal$2f$clerk$2d$js$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/internal/clerk-js/errors.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryObserver$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@tanstack/query-core/build/modern/infiniteQueryObserver.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryObserver$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@tanstack/query-core/build/modern/queryObserver.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@tanstack/query-core/build/modern/utils.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@tanstack/query-core/build/modern/notifyManager.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$dequal$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/dequal/dist/index.mjs [app-ssr] (ecmascript)");
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
//#region src/react/hooks/createContextAndHook.ts
/**
* Assert that the context value exists, otherwise throw an error.
*
* @internal
*/ function assertContextExists(contextVal, msgOrCtx) {
    if (!contextVal) throw typeof msgOrCtx === "string" ? new Error(msgOrCtx) : /* @__PURE__ */ new Error(`${msgOrCtx.displayName} not found`);
}
/**
* Create and return a Context and two hooks that return the context value.
* The Context type is derived from the type passed in by the user.
*
* The first hook returned guarantees that the context exists so the returned value is always `CtxValue`
* The second hook makes no guarantees, so the returned value can be `CtxValue | undefined`
*
* @internal
*/ const createContextAndHook = (displayName, options)=>{
    const { assertCtxFn = assertContextExists } = options || {};
    const Ctx = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createContext(void 0);
    Ctx.displayName = displayName;
    const useCtx = ()=>{
        const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useContext(Ctx);
        assertCtxFn(ctx, `${displayName} not found`);
        return ctx.value;
    };
    const useCtxWithoutGuarantee = ()=>{
        const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useContext(Ctx);
        return ctx ? ctx.value : {};
    };
    return [
        Ctx,
        useCtx,
        useCtxWithoutGuarantee
    ];
};
//#endregion
//#region src/react/contexts.tsx
const [ClerkInstanceContext, useClerkInstanceContext] = createContextAndHook("ClerkInstanceContext");
const [InitialStateContext, _useInitialStateContext] = createContextAndHook("InitialStateContext");
/**
* Provides initial Clerk state (session, user, organization data) from server-side rendering
* to child components via React context.
*
* Passing in a promise is only supported for React >= 19.
*
* The initialState is snapshotted on mount and cannot change during the component lifecycle.
*
* Note that different parts of the React tree can use separate InitialStateProvider instances
* with different initialState values if needed.
*/ function InitialStateProvider({ children, initialState }) {
    const [initialStateSnapshot] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(initialState);
    const initialStateCtx = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>({
            value: initialStateSnapshot
        }), [
        initialStateSnapshot
    ]);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(InitialStateContext.Provider, {
        value: initialStateCtx
    }, children);
}
function useInitialStateContext() {
    const initialState = _useInitialStateContext();
    if (initialState instanceof Promise) if ("use" in __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] && typeof __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use === "function") return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use(initialState);
    else throw new Error("initialState cannot be a promise if React version is less than 19");
    return initialState;
}
const OptionsContext = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createContext({});
const [CheckoutContext, useCheckoutContext] = createContextAndHook("CheckoutContext");
const __experimental_CheckoutProvider = ({ children, ...rest })=>{
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(CheckoutContext.Provider, {
        value: {
            value: rest
        }
    }, children);
};
/**
* @internal
*/ function useOptionsContext() {
    const context = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useContext(OptionsContext);
    if (context === void 0) throw new Error("useOptions must be used within an OptionsContext");
    return context;
}
/**
* @internal
*/ function useAssertWrappedByClerkProvider(displayNameOrFn) {
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useContext(ClerkInstanceContext)) {
        if (typeof displayNameOrFn === "function") {
            displayNameOrFn();
            return;
        }
        throw new Error(`${displayNameOrFn} can only be used within the <ClerkProvider /> component.

Possible fixes:
1. Ensure that the <ClerkProvider /> is correctly wrapping your application where this component is used.
2. Check for multiple versions of the \`@clerk/shared\` package in your project. Use a tool like \`npm ls @clerk/shared\` to identify multiple versions, and update your dependencies to only rely on one.

Learn more: https://clerk.com/docs/components/clerk-provider`.trim());
    }
}
//#endregion
//#region src/react/stable-keys.ts
const USER_MEMBERSHIPS_KEY = "userMemberships";
const USER_INVITATIONS_KEY = "userInvitations";
const USER_SUGGESTIONS_KEY = "userSuggestions";
const DOMAINS_KEY = "domains";
const MEMBERSHIP_REQUESTS_KEY = "membershipRequests";
const MEMBERSHIPS_KEY = "memberships";
const INVITATIONS_KEY = "invitations";
const API_KEYS_KEY = "apiKeys";
const ORGANIZATION_CREATION_DEFAULTS_KEY = "organizationCreationDefaults";
const OAUTH_CONSENT_INFO_KEY = "oauthConsentInfo";
const PLANS_KEY = "billing-plans";
const SUBSCRIPTION_KEY = "billing-subscription";
const PAYMENT_METHODS_KEY = "billing-payment-methods";
const PAYMENT_ATTEMPTS_KEY = "billing-payment-attempts";
const STATEMENTS_KEY = "billing-statements";
const CREDIT_BALANCE_KEY = "billing-credit-balance";
const STABLE_KEYS = {
    USER_MEMBERSHIPS_KEY,
    USER_INVITATIONS_KEY,
    USER_SUGGESTIONS_KEY,
    DOMAINS_KEY,
    MEMBERSHIP_REQUESTS_KEY,
    MEMBERSHIPS_KEY,
    INVITATIONS_KEY,
    PLANS_KEY,
    SUBSCRIPTION_KEY,
    PAYMENT_METHODS_KEY,
    PAYMENT_ATTEMPTS_KEY,
    STATEMENTS_KEY,
    API_KEYS_KEY,
    ORGANIZATION_CREATION_DEFAULTS_KEY,
    OAUTH_CONSENT_INFO_KEY,
    CREDIT_BALANCE_KEY
};
/**
* Internal stable keys for queries only used by our UI components.
* These keys are not used by the hooks themselves.
*/ const PAYMENT_ATTEMPT_KEY = "billing-payment-attempt";
const BILLING_PLANS_KEY = "billing-plan";
const BILLING_STATEMENTS_KEY = "billing-statement";
const USER_ENTERPRISE_CONNECTIONS_KEY = "userEnterpriseConnections";
const ENTERPRISE_CONNECTION_TEST_RUNS_KEY = "enterpriseConnectionTestRuns";
const ORGANIZATION_ENTERPRISE_CONNECTIONS_KEY = "organizationEnterpriseConnections";
const ORGANIZATION_ENTERPRISE_CONNECTION_TEST_RUNS_KEY = "organizationEnterpriseConnectionTestRuns";
const ORGANIZATION_DOMAINS_KEY = "organizationDomains";
const CREDIT_HISTORY_KEY = "billing-credit-history";
const INTERNAL_STABLE_KEYS = {
    PAYMENT_ATTEMPT_KEY,
    BILLING_PLANS_KEY,
    BILLING_STATEMENTS_KEY,
    CREDIT_HISTORY_KEY,
    USER_ENTERPRISE_CONNECTIONS_KEY,
    ENTERPRISE_CONNECTION_TEST_RUNS_KEY,
    ORGANIZATION_ENTERPRISE_CONNECTIONS_KEY,
    ORGANIZATION_ENTERPRISE_CONNECTION_TEST_RUNS_KEY,
    ORGANIZATION_DOMAINS_KEY
};
//#endregion
//#region src/react/hooks/createCacheKeys.ts
/**
* @internal
*/ function createCacheKeys(params) {
    return {
        queryKey: [
            params.stablePrefix,
            params.authenticated,
            params.tracked,
            params.untracked
        ],
        invalidationKey: [
            params.stablePrefix,
            params.authenticated,
            params.tracked
        ],
        stableKey: params.stablePrefix,
        authenticated: params.authenticated
    };
}
//#endregion
//#region src/react/query/keep-previous-data.ts
/**
* @internal
*/ function defineKeepPreviousDataFn(enabled) {
    if (enabled) return function KeepPreviousDataFn(previousData) {
        return previousData;
    };
}
//#endregion
//#region src/react/query/clerk-query-client.ts
/**
* The QueryClient backing every clerk-query hook. Owned by `@clerk/shared` so the
* `QueryObserver` that observes it and the `Query` objects inside it always
* resolve to the same `@tanstack/query-core` (no cross-bundle drift between
* the consumer-side `@clerk/shared` and the production CDN `clerk-js` bundle).
*
* Lazily instantiated on the client only. Server-side renders return
* `undefined` so per-request renders never share a cache across requests.
*/ let clerkQueryClient;
let initialized = false;
function getClerkQueryClient() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
/**
* Test-only: install a custom client (for deterministic defaults like
* `staleTime: Infinity`) or pass `undefined` to simulate the "no client"
* state without triggering lazy creation on subsequent reads.
*/ function __setClerkQueryClientForTest(client) {
    clerkQueryClient = client;
    initialized = true;
}
/**
* Test-only: build and install a fresh `QueryClient` with deterministic
* defaults (no retries, infinite stale time, no refetching). Returns the
* client so the spec can read/write its cache directly.
*
* Avoids forcing every test consumer to depend on `@tanstack/query-core`.
*/ function __createClerkTestQueryClient() {
    const client = new __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryClient"]({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: Infinity,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                refetchOnMount: false
            }
        }
    });
    __setClerkQueryClientForTest(client);
    return client;
}
/**
* Test-only: clear both the override and the initialization flag so the
* next read lazy-creates a fresh client.
*/ function __resetClerkQueryClientForTest() {
    clerkQueryClient = void 0;
    initialized = false;
}
//#endregion
//#region src/react/query/use-clerk-query-client.ts
/**
* Creates a recursively self-referential Proxy that safely handles:
* - Arbitrary property access (e.g., obj.any.prop.path)
* - Function calls at any level (e.g., obj.a().b.c())
* - Construction (e.g., new obj.a.b())
*
* Always returns itself to allow infinite chaining without throwing.
*/ function createRecursiveProxy(label) {
    const callableTarget = function noop() {};
    let self;
    self = new Proxy(callableTarget, {
        get (_target, prop) {
            if (prop === "then") return;
            if (prop === "toString") return ()=>`[${label}]`;
            if (prop === Symbol.toPrimitive) return ()=>0;
            return self;
        },
        apply () {
            return self;
        },
        construct () {
            return self;
        },
        has () {
            return false;
        },
        set () {
            return false;
        }
    });
    return self;
}
const mockQueryClient = createRecursiveProxy("ClerkMockQueryClient");
/**
* Returns `[client, isLoaded]`. The real client is owned by `@clerk/shared`
* and lazily instantiated on the browser only — SSR returns the proxy mock
* + `isLoaded: false` so per-request renders never share a query cache.
*/ const useClerkQueryClient = ()=>{
    const client = getClerkQueryClient();
    return [
        client ?? mockQueryClient,
        Boolean(client)
    ];
};
//#endregion
//#region src/react/query/useBaseQuery.ts
/**
* Stripped down version of useBaseQuery from @tanstack/query-core.
* This implementation allows for an observer to be created every time a query client changes.
*/ /**
* An alternative `useBaseQuery` implementation that allows for an observer to be created every time a query client changes.
*
* @internal
*/ function useBaseQuery(options, Observer) {
    const [client, isQueryClientLoaded] = useClerkQueryClient();
    const defaultedOptions = isQueryClientLoaded ? client.defaultQueryOptions(options) : options;
    defaultedOptions._optimisticResults = "optimistic";
    const observer = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"](()=>{
        return new Observer(client, defaultedOptions);
    }, [
        client
    ]);
    const result = observer.getOptimisticResult(defaultedOptions);
    const shouldSubscribe = options.subscribed !== false;
    __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"](__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"]((onStoreChange)=>{
        const unsubscribe = shouldSubscribe ? observer.subscribe(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$notifyManager$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["notifyManager"].batchCalls(onStoreChange)) : __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$utils$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["noop"];
        observer.updateResult();
        return unsubscribe;
    }, [
        observer,
        shouldSubscribe
    ]), ()=>observer.getCurrentResult(), ()=>observer.getCurrentResult());
    __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        observer.setOptions(defaultedOptions);
    }, [
        defaultedOptions,
        observer
    ]);
    if (!isQueryClientLoaded) return {
        data: void 0,
        error: null,
        isLoading: options.enabled !== false,
        isFetching: false,
        status: "pending"
    };
    return !defaultedOptions.notifyOnChangeProps ? observer.trackResult(result) : result;
}
//#endregion
//#region src/react/query/useInfiniteQuery.ts
/**
*
*/ function useClerkInfiniteQuery(options) {
    return useBaseQuery(options, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$infiniteQueryObserver$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["InfiniteQueryObserver"]);
}
//#endregion
//#region src/react/query/useQuery.ts
/**
*
*/ function useClerkQuery(options) {
    return useBaseQuery(options, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryObserver$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["QueryObserver"]);
}
//#endregion
//#region src/react/hooks/usePreviousValue.ts
/**
* A hook that retains the previous value of a primitive type.
* It uses a ref to prevent causing unnecessary re-renders.
*
* @internal
*
* @example
* ```
* Render 1: value = 'A' → returns null
* Render 2: value = 'B' → returns 'A'
* Render 3: value = 'B' → returns 'A'
* Render 4: value = 'B' → returns 'A'
* Render 5: value = 'C' → returns 'B'
* ```
*/ function usePreviousValue(value) {
    const currentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(value);
    const previousRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    if (currentRef.current !== value) {
        previousRef.current = currentRef.current;
        currentRef.current = value;
    }
    return previousRef.current;
}
//#endregion
//#region src/react/hooks/useClearQueriesOnSignOut.ts
const withInfiniteKey = (key)=>[
        key,
        `${key}-inf`
    ];
/**
* Clears React Query caches associated with the given stable prefixes when
* the authenticated state transitions from signed-in to signed-out.
*
* @internal
*/ function useClearQueriesOnSignOut(options) {
    const { isSignedOut, stableKeys, authenticated = true, onCleanup } = options;
    const stableKeysRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(stableKeys);
    const [queryClient] = useClerkQueryClient();
    const previousIsSignedIn = usePreviousValue(!isSignedOut);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (authenticated !== true) return;
        if (previousIsSignedIn && isSignedOut === true) {
            queryClient.removeQueries({
                predicate: (query)=>{
                    const [cachedStableKey, queryAuthenticated] = query.queryKey;
                    return queryAuthenticated === true && typeof cachedStableKey === "string" && (Array.isArray(stableKeysRef.current) ? stableKeysRef.current.includes(cachedStableKey) : stableKeysRef.current === cachedStableKey);
                }
            });
            onCleanup?.();
        }
    }, [
        authenticated,
        isSignedOut,
        previousIsSignedIn,
        queryClient
    ]);
}
//#endregion
//#region src/react/hooks/usePagesOrInfinite.shared.ts
/**
* A hook that safely merges user-provided pagination options with default values.
* It caches initial pagination values (page and size) until component unmount to prevent unwanted rerenders.
*
* @internal
*
* @example
* ```typescript
* // Example 1: With user-provided options
* const userOptions = { initialPage: 2, pageSize: 20, infinite: true };
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(userOptions, defaults);
* // Returns { initialPage: 2, pageSize: 20, infinite: true }
*
* // Example 2: With boolean true (use defaults)
* const params = true;
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(params, defaults);
* // Returns { initialPage: 1, pageSize: 10, infinite: false }
*
* // Example 3: With undefined options (fallback to defaults)
* const params = undefined;
* const defaults = { initialPage: 1, pageSize: 10, infinite: false };
* useWithSafeValues(params, defaults);
* // Returns { initialPage: 1, pageSize: 10, infinite: false }
* ```
*/ const useWithSafeValues = (params, defaultValues)=>{
    const shouldUseDefaults = typeof params === "boolean" && params;
    const initialPageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(shouldUseDefaults ? defaultValues.initialPage : params?.initialPage ?? defaultValues.initialPage);
    const pageSizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(shouldUseDefaults ? defaultValues.pageSize : params?.pageSize ?? defaultValues.pageSize);
    const newObj = {};
    for (const key of Object.keys(defaultValues))newObj[key] = shouldUseDefaults ? defaultValues[key] : params?.[key] ?? defaultValues[key];
    return {
        ...newObj,
        initialPage: initialPageRef.current,
        pageSize: pageSizeRef.current
    };
};
/**
* Calculates the offset count for pagination based on initial page and page size.
* This represents the number of items to skip before the first page.
*
* @param initialPage - The starting page number (1-based)
* @param pageSize - The number of items per page
* @returns The number of items to offset
*
* @example
* ```typescript
* calculateOffsetCount(1, 10); // Returns 0 (no offset for first page)
* calculateOffsetCount(2, 10); // Returns 10 (skip first 10 items)
* calculateOffsetCount(3, 20); // Returns 40 (skip first 40 items)
* ```
*/ function calculateOffsetCount(initialPage, pageSize) {
    return (initialPage - 1) * pageSize;
}
/**
* Calculates the total number of pages based on total count, offset, and page size.
*
* @param totalCount - The total number of items
* @param offsetCount - The number of items to offset (from calculateOffsetCount)
* @param pageSize - The number of items per page
* @returns The total number of pages
*
* @example
* ```typescript
* calculatePageCount(100, 0, 10);  // Returns 10
* calculatePageCount(95, 0, 10);   // Returns 10 (rounds up)
* calculatePageCount(100, 20, 10); // Returns 8 (100 - 20 = 80 items, 8 pages)
* ```
*/ function calculatePageCount(totalCount, offsetCount, pageSize) {
    return Math.ceil((totalCount - offsetCount) / pageSize);
}
/**
* Determines if there is a next page available in non-infinite pagination mode.
*
* @param totalCount - The total number of items
* @param offsetCount - The number of items to offset
* @param currentPage - The current page number (1-based)
* @param pageSize - The number of items per page
* @returns True if there are more items beyond the current page
*
* @example
* ```typescript
* calculateHasNextPage(100, 0, 1, 10);  // Returns true (page 1 of 10)
* calculateHasNextPage(100, 0, 10, 10); // Returns false (last page)
* calculateHasNextPage(25, 0, 2, 10);   // Returns true (page 2, 5 more items)
* calculateHasNextPage(20, 0, 2, 10);   // Returns false (exactly 2 pages)
* ```
*/ function calculateHasNextPage(totalCount, offsetCount, currentPage, pageSize) {
    return totalCount - offsetCount > currentPage * pageSize;
}
/**
* Determines if there is a previous page available in non-infinite pagination mode.
*
* @param currentPage - The current page number (1-based)
* @param pageSize - The number of items per page
* @param offsetCount - The number of items to offset
* @returns True if there are pages before the current page
*
* @example
* ```typescript
* calculateHasPreviousPage(1, 10, 0);  // Returns false (first page)
* calculateHasPreviousPage(2, 10, 0);  // Returns true (can go back to page 1)
* calculateHasPreviousPage(1, 10, 10); // Returns false (first page with offset)
* ```
*/ function calculateHasPreviousPage(currentPage, pageSize, offsetCount) {
    return (currentPage - 1) * pageSize > offsetCount;
}
//#endregion
//#region src/react/hooks/usePagesOrInfinite.tsx
const usePagesOrInfinite = (params)=>{
    const { fetcher, config, keys } = params;
    const [paginatedPage, setPaginatedPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(config.initialPage ?? 1);
    const initialPageRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(config.initialPage ?? 1);
    const pageSizeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(config.pageSize ?? 10);
    const enabled = config.enabled ?? true;
    const isSignedIn = config.isSignedIn;
    const triggerInfinite = config.infinite ?? false;
    const cacheMode = config.__experimental_mode === "cache";
    const keepPreviousData = config.keepPreviousData ?? false;
    const [queryClient] = useClerkQueryClient();
    const queriesEnabled = enabled && Boolean(fetcher) && !cacheMode && isSignedIn !== false;
    const [forceUpdateCounter, setForceUpdateCounter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const forceUpdate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((updater)=>{
        setForceUpdateCounter(updater);
    }, []);
    const pagesQueryKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const [stablePrefix, authenticated, tracked, untracked] = keys.queryKey;
        return [
            stablePrefix,
            authenticated,
            tracked,
            {
                ...untracked,
                args: {
                    ...untracked.args,
                    initialPage: paginatedPage,
                    pageSize: pageSizeRef.current
                }
            }
        ];
    }, [
        keys.queryKey,
        paginatedPage
    ]);
    const singlePageQuery = useClerkQuery({
        queryKey: pagesQueryKey,
        queryFn: ({ queryKey })=>{
            const { args } = queryKey[3];
            if (!fetcher) return;
            return fetcher(args);
        },
        staleTime: 6e4,
        enabled: queriesEnabled && !triggerInfinite,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData)
    });
    const infiniteQueryKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const [stablePrefix, authenticated, tracked, untracked] = keys.queryKey;
        return [
            stablePrefix + "-inf",
            authenticated,
            tracked,
            untracked
        ];
    }, [
        keys.queryKey
    ]);
    const infiniteQuery = useClerkInfiniteQuery({
        queryKey: infiniteQueryKey,
        initialPageParam: config.initialPage ?? 1,
        getNextPageParam: (lastPage, allPages, lastPageParam)=>{
            const total = lastPage?.total_count ?? 0;
            return (allPages.length + (config.initialPage ? config.initialPage - 1 : 0)) * (config.pageSize ?? 10) < total ? lastPageParam + 1 : void 0;
        },
        queryFn: ({ pageParam, queryKey })=>{
            const { args } = queryKey[3];
            if (!fetcher) return;
            return fetcher({
                ...args,
                initialPage: pageParam,
                pageSize: pageSizeRef.current
            });
        },
        staleTime: 6e4,
        enabled: queriesEnabled && triggerInfinite
    });
    useClearQueriesOnSignOut({
        isSignedOut: isSignedIn === false,
        authenticated: keys.authenticated,
        stableKeys: withInfiniteKey(keys.stableKey),
        onCleanup: ()=>{
            setPaginatedPage(initialPageRef.current);
            Promise.resolve().then(()=>forceUpdate((n)=>n + 1));
        }
    });
    const { data, count, page } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (triggerInfinite) {
            const cachedData = queryClient.getQueryData(infiniteQueryKey);
            const pages = queriesEnabled ? infiniteQuery.data?.pages ?? cachedData?.pages ?? [] : cachedData?.pages ?? [];
            const validPages = Array.isArray(pages) ? pages.filter(Boolean) : [];
            return {
                data: validPages.map((a)=>a?.data).flat().filter(Boolean) ?? [],
                count: validPages[validPages.length - 1]?.total_count ?? 0,
                page: validPages.length > 0 ? validPages.length : initialPageRef.current
            };
        }
        const pageData = queriesEnabled ? singlePageQuery.data ?? queryClient.getQueryData(pagesQueryKey) : queryClient.getQueryData(pagesQueryKey);
        return {
            data: Array.isArray(pageData?.data) ? pageData.data : [],
            count: typeof pageData?.total_count === "number" ? pageData.total_count : 0,
            page: paginatedPage
        };
    }, [
        queriesEnabled,
        forceUpdateCounter,
        triggerInfinite,
        infiniteQuery.data?.pages,
        singlePageQuery.data,
        queryClient,
        infiniteQueryKey,
        pagesQueryKey,
        paginatedPage
    ]);
    const fetchPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((numberOrgFn)=>{
        if (triggerInfinite) {
            const next = typeof numberOrgFn === "function" ? numberOrgFn(page) : numberOrgFn;
            const targetCount = Math.max(0, next);
            const cachedData = queryClient.getQueryData(infiniteQueryKey);
            if (targetCount - (infiniteQuery.data?.pages ?? cachedData?.pages ?? []).length > 0) infiniteQuery.fetchNextPage({
                cancelRefetch: false
            });
            return;
        }
        return setPaginatedPage(numberOrgFn);
    }, [
        infiniteQuery,
        page,
        triggerInfinite,
        queryClient,
        infiniteQueryKey
    ]);
    const isLoading = triggerInfinite ? infiniteQuery.isLoading : singlePageQuery.isLoading;
    const isFetching = triggerInfinite ? infiniteQuery.isFetching : singlePageQuery.isFetching;
    const error = (triggerInfinite ? infiniteQuery.error : singlePageQuery.error) ?? null;
    const isError = !!error;
    const fetchNext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (triggerInfinite) {
            infiniteQuery.fetchNextPage({
                cancelRefetch: false
            });
            return;
        }
        setPaginatedPage((n)=>Math.max(0, n + 1));
    }, [
        infiniteQuery,
        triggerInfinite
    ]);
    const fetchPrevious = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (triggerInfinite) return;
        setPaginatedPage((n)=>Math.max(0, n - 1));
    }, [
        triggerInfinite
    ]);
    const offsetCount = calculateOffsetCount(initialPageRef.current, pageSizeRef.current);
    const pageCount = calculatePageCount(count, offsetCount, pageSizeRef.current);
    const hasNextPage = triggerInfinite ? Boolean(infiniteQuery.hasNextPage) : calculateHasNextPage(count, offsetCount, page, pageSizeRef.current);
    const hasPreviousPage = triggerInfinite ? Boolean(infiniteQuery.hasPreviousPage) : calculateHasPreviousPage(page, pageSizeRef.current, offsetCount);
    const setData = (value)=>{
        if (triggerInfinite) {
            queryClient.setQueryData(infiniteQueryKey, (prevValue = {})=>{
                const prevPages = Array.isArray(prevValue?.pages) ? prevValue.pages : [];
                const nextPages = typeof value === "function" ? value(prevPages) : value;
                return {
                    ...prevValue,
                    pages: nextPages
                };
            });
            forceUpdate((n)=>n + 1);
            return Promise.resolve();
        }
        queryClient.setQueryData(pagesQueryKey, (prevValue = {
            data: [],
            total_count: 0
        })=>{
            return typeof value === "function" ? value(prevValue) : value;
        });
        forceUpdate((n)=>n + 1);
        return Promise.resolve();
    };
    const revalidate = async ()=>{
        await queryClient.invalidateQueries({
            queryKey: keys.invalidationKey
        });
        const [stablePrefix, ...rest] = keys.invalidationKey;
        return queryClient.invalidateQueries({
            queryKey: [
                stablePrefix + "-inf",
                ...rest
            ]
        });
    };
    return {
        data,
        count,
        error,
        isLoading,
        isFetching,
        isError,
        page,
        pageCount,
        fetchPage,
        fetchNext,
        fetchPrevious,
        hasNextPage,
        hasPreviousPage,
        revalidate,
        setData
    };
};
//#endregion
//#region src/react/hooks/useAPIKeys.tsx
/**
* The `useAPIKeys()` hook provides access to paginated API keys for the current user or organization.
*
* @example
* ### Basic usage with default pagination
*
* ```tsx
* const { data, isLoading, page, pageCount, fetchNext, fetchPrevious } = useAPIKeys({
*   subject: 'user_123',
*   pageSize: 10,
*   initialPage: 1,
* });
* ```
*
* @example
* ### With search query
*
* ```tsx
* const [searchValue, setSearchValue] = useState('');
* const debouncedSearch = useDebounce(searchValue, 500);
*
* const { data, isLoading } = useAPIKeys({
*   subject: 'user_123',
*   query: debouncedSearch.trim(),
*   pageSize: 10,
* });
* ```
*
* @example
* ### Infinite scroll
*
* ```tsx
* const { data, isLoading, fetchNext, hasNextPage } = useAPIKeys({
*   subject: 'user_123',
*   infinite: true,
* });
* ```
*/ function useAPIKeys(params) {
    useAssertWrappedByClerkProvider("useAPIKeys");
    const safeValues = useWithSafeValues(params, {
        initialPage: 1,
        pageSize: 10,
        keepPreviousData: false,
        infinite: false,
        subject: "",
        query: "",
        enabled: true
    });
    const clerk = useClerkInstanceContext();
    clerk.telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])("useAPIKeys"));
    const hookParams = {
        initialPage: safeValues.initialPage,
        pageSize: safeValues.pageSize,
        ...safeValues.subject ? {
            subject: safeValues.subject
        } : {},
        ...safeValues.query ? {
            query: safeValues.query
        } : {}
    };
    const isEnabled = (safeValues.enabled ?? true) && clerk.loaded;
    return usePagesOrInfinite({
        fetcher: clerk.apiKeys?.getAll ? (params)=>clerk.apiKeys.getAll({
                ...params,
                subject: safeValues.subject
            }) : void 0,
        config: {
            keepPreviousData: safeValues.keepPreviousData,
            infinite: safeValues.infinite,
            enabled: isEnabled,
            isSignedIn: clerk.user !== null,
            initialPage: safeValues.initialPage,
            pageSize: safeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.API_KEYS_KEY,
            authenticated: true,
            tracked: {
                subject: safeValues.subject
            },
            untracked: {
                args: hookParams
            }
        })
    });
}
//#endregion
//#region src/react/hooks/base/useUserBase.ts
function useUserBase() {
    const clerk = useClerkInstanceContext();
    const initialState = useInitialStateContext();
    const getInitialState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>initialState?.user, [
        initialState?.user
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((callback)=>{
        return clerk.addListener(callback, {
            skipInitialEmit: true
        });
    }, [
        clerk
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return getInitialState();
        return clerk.__internal_lastEmittedResources.user;
    }, [
        clerk,
        getInitialState
    ]), getInitialState);
}
//#endregion
//#region src/react/hooks/useOAuthConsent.shared.ts
function useOAuthConsentCacheKeys(params) {
    const { userId, oauthClientId, scope, redirectUri } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const args = {
            oauthClientId,
            ...scope !== void 0 && {
                scope
            },
            ...redirectUri !== void 0 && {
                redirectUri
            }
        };
        return createCacheKeys({
            stablePrefix: STABLE_KEYS.OAUTH_CONSENT_INFO_KEY,
            authenticated: true,
            tracked: {
                userId: userId ?? null
            },
            untracked: {
                args
            }
        });
    }, [
        userId,
        oauthClientId,
        scope,
        redirectUri
    ]);
}
//#endregion
//#region src/react/hooks/useOAuthConsent.tsx
const HOOK_NAME$4 = "useOAuthConsent";
/**
* The `useOAuthConsent()` hook loads OAuth application consent metadata for the **signed-in** user
* (`GET /me/oauth/consent/{oauthClientId}`). Ensure the user is authenticated before relying on this hook
* (e.g., redirect to sign-in on your custom consent route).
*
* @example
* ```tsx
* import { useOAuthConsent } from '@clerk/react/internal'
*
* const { data, isLoading, error } = useOAuthConsent({
*   oauthClientId: clientIdFromProps,
*   scope: scopeFromProps,
* })
* ```
*/ function useOAuthConsent(params) {
    useAssertWrappedByClerkProvider(HOOK_NAME$4);
    const { oauthClientId: oauthClientIdParam, scope, redirectUri, keepPreviousData = true, enabled = true } = params;
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const oauthClientId = (oauthClientIdParam ?? "").trim();
    clerk.telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(HOOK_NAME$4));
    const { queryKey } = useOAuthConsentCacheKeys({
        userId: user?.id ?? null,
        oauthClientId,
        scope,
        redirectUri
    });
    const hasClientId = oauthClientId.length > 0;
    const queryEnabled = Boolean(user) && hasClientId && enabled && clerk.loaded;
    const query = useClerkQuery({
        queryKey,
        queryFn: ()=>fetchConsentInfo(clerk, {
                oauthClientId,
                scope,
                redirectUri
            }),
        enabled: queryEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData && queryEnabled)
    });
    return {
        data: query.data,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching
    };
}
function fetchConsentInfo(clerk, params) {
    return clerk.oauthApplication.getConsentInfo(params);
}
//#endregion
//#region src/react/hooks/base/useOrganizationBase.ts
function useOrganizationBase() {
    const clerk = useClerkInstanceContext();
    const initialState = useInitialStateContext();
    const getInitialState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>initialState?.organization, [
        initialState?.organization
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((callback)=>clerk.addListener(callback, {
            skipInitialEmit: true
        }), [
        clerk
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return getInitialState();
        return clerk.__internal_lastEmittedResources.organization;
    }, [
        clerk,
        getInitialState
    ]), getInitialState);
}
//#endregion
//#region src/react/hooks/base/useSessionBase.ts
function useSessionBase() {
    const clerk = useClerkInstanceContext();
    const initialState = useInitialStateContext();
    const getInitialState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return initialState ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$deriveState$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deriveFromSsrInitialState"])(initialState)?.session : void 0;
    }, [
        initialState
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((callback)=>clerk.addListener(callback, {
            skipInitialEmit: true
        }), [
        clerk
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return getInitialState();
        return clerk.__internal_lastEmittedResources.session;
    }, [
        clerk,
        getInitialState
    ]), getInitialState);
}
//#endregion
//#region src/react/hooks/useClerk.ts
/**
* > [!WARNING]
* > This hook should only be used for advanced use cases, such as building a completely custom OAuth flow or as an escape hatch to access to the `Clerk` object.
*
* The `useClerk()` hook provides access to the [`Clerk`](https://clerk.com/docs/reference/objects/clerk) object, allowing you to build alternatives to any Clerk Component.
*
* @function
*
* @returns The `useClerk()` hook returns the `Clerk` object, which includes all the methods and properties listed in the [`Clerk` reference](https://clerk.com/docs/reference/objects/clerk).
*
* @example
*
* The following example uses the `useClerk()` hook to access the `clerk` object. The `clerk` object is used to call the [`openSignIn()`](https://clerk.com/docs/reference/objects/clerk#sign-in) method to open the sign-in modal.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useClerk } from '@clerk/react'
*
* export default function Home() {
*   const clerk = useClerk()
*
*   return <button onClick={() => clerk.openSignIn({})}>Sign in</button>
* }
* ```
*
* </Tab>
* <Tab>
*
* ```tsx {{ filename: 'app/page.tsx' }}
* 'use client';
*
* import { useClerk } from '@clerk/nextjs';
*
* export default function HomePage() {
*   const clerk = useClerk();
*
*   return <button onClick={() => clerk.openSignIn({})}>Sign in</button>;
* }
* ```
*
* </Tab>
* </Tabs>
*/ const useClerk = ()=>{
    useAssertWrappedByClerkProvider("useClerk");
    return useClerkInstanceContext();
};
//#endregion
//#region src/react/hooks/useAttemptToEnableOrganizations.ts
/**
* Attempts to enable the organizations environment setting for a given caller
*
* @internal
*/ function useAttemptToEnableOrganizations(caller, { enabled = true } = {}) {
    const clerk = useClerk();
    const hasAttempted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!enabled || hasAttempted.current) return;
        hasAttempted.current = true;
        clerk.__internal_attemptToEnableEnvironmentSetting?.({
            for: "organizations",
            caller
        });
    }, [
        clerk,
        caller,
        enabled
    ]);
}
//#endregion
//#region src/react/hooks/useOrganization.tsx
const undefinedPaginatedResource$1 = {
    data: void 0,
    count: void 0,
    error: void 0,
    isLoading: false,
    isFetching: false,
    isError: false,
    page: void 0,
    pageCount: void 0,
    fetchPage: void 0,
    fetchNext: void 0,
    fetchPrevious: void 0,
    hasNextPage: false,
    hasPreviousPage: false,
    revalidate: void 0,
    setData: void 0
};
/**
* The `useOrganization()` hook retrieves attributes of the currently Active Organization.
*
* @example
* ### Expand and paginate attributes
*
* To keep network usage to a minimum, developers are required to opt-in by specifying which resource they need to fetch and paginate through. By default, the `memberships`, `invitations`, `membershipRequests`, and `domains` attributes are not populated. You must pass `true` or an object with the desired properties to fetch and paginate the data.
*
* ```tsx
* // invitations.data will never be populated.
* const { invitations } = useOrganization()
*
* // Use default values to fetch invitations, such as initialPage = 1 and pageSize = 10
* const { invitations } = useOrganization({
*   invitations: true,
* })
*
* // Pass your own values to fetch invitations
* const { invitations } = useOrganization({
*   invitations: {
*     pageSize: 20,
*     initialPage: 2, // skips the first page
*   },
* })
*
* // Aggregate pages in order to render an infinite list
* const { invitations } = useOrganization({
*   invitations: {
*     infinite: true,
*   },
* })
* ```
*
* @example
* ### Infinite pagination
*
* The following example demonstrates how to use the `infinite` property to fetch and append new data to the existing list. The `memberships` attribute will be populated with the first page of the Organization's memberships. When the "Load more" button is clicked, the `fetchNext` helper function will be called to append the next page of memberships to the list.
*
* ```tsx
* import { useOrganization } from '@clerk/react'
*
* export default function MemberList() {
*   const { memberships } = useOrganization({
*     memberships: {
*       infinite: true, // Append new data to the existing list
*       keepPreviousData: true, // Persist the cached data until the new data has been fetched
*     },
*   })
*
*   if (!memberships) {
*     // Handle loading state
*     return null
*   }
*
*   return (
*     <div>
*       <h2>Organization members</h2>
*       <ul>
*         {memberships.data?.map((membership) => (
*           <li key={membership.id}>
*             {membership.publicUserData.firstName} {membership.publicUserData.lastName} <
*             {membership.publicUserData.identifier}> :: {membership.role}
*           </li>
*         ))}
*       </ul>
*
*       <button
*         disabled={!memberships.hasNextPage} // Disable the button if there are no more available pages to be fetched
*         onClick={memberships.fetchNext}
*       >
*         Load more
*       </button>
*     </div>
*   )
* }
* ```
*
* @example
* ### Simple pagination
*
* The following example demonstrates how to use the `fetchPrevious` and `fetchNext` helper functions to paginate through the data. The `memberships` attribute will be populated with the first page of the Organization's memberships. When the "Previous page" or "Next page" button is clicked, the `fetchPrevious` or `fetchNext` helper function will be called to fetch the previous or next page of memberships.
*
* Notice the difference between this example's pagination and the infinite pagination example above.
*
* ```tsx
* import { useOrganization } from '@clerk/react'
*
* export default function MemberList() {
*   const { memberships } = useOrganization({
*     memberships: {
*       keepPreviousData: true, // Persist the cached data until the new data has been fetched
*     },
*   })
*
*   if (!memberships) {
*     // Handle loading state
*     return null
*   }
*
*   return (
*     <div>
*       <h2>Organization members</h2>
*       <ul>
*         {memberships.data?.map((membership) => (
*           <li key={membership.id}>
*             {membership.publicUserData.firstName} {membership.publicUserData.lastName} <
*             {membership.publicUserData.identifier}> :: {membership.role}
*           </li>
*         ))}
*       </ul>
*
*       <button disabled={!memberships.hasPreviousPage} onClick={memberships.fetchPrevious}>
*         Previous page
*       </button>
*
*       <button disabled={!memberships.hasNextPage} onClick={memberships.fetchNext}>
*         Next page
*       </button>
*     </div>
*   )
* }
* ```
*/ function useOrganization(params) {
    const { domains: domainListParams, membershipRequests: membershipRequestsListParams, memberships: membersListParams, invitations: invitationsListParams, __internal_skipAttemptToEnableOrganizations } = params || {};
    useAssertWrappedByClerkProvider("useOrganization");
    useAttemptToEnableOrganizations("useOrganization", {
        enabled: !__internal_skipAttemptToEnableOrganizations
    });
    const organization = useOrganizationBase();
    const session = useSessionBase();
    const domainSafeValues = useWithSafeValues(domainListParams, {
        initialPage: 1,
        pageSize: 10,
        keepPreviousData: false,
        infinite: false,
        enrollmentMode: void 0
    });
    const membershipRequestSafeValues = useWithSafeValues(membershipRequestsListParams, {
        initialPage: 1,
        pageSize: 10,
        status: "pending",
        keepPreviousData: false,
        infinite: false
    });
    const membersSafeValues = useWithSafeValues(membersListParams, {
        initialPage: 1,
        pageSize: 10,
        role: void 0,
        keepPreviousData: false,
        infinite: false,
        query: void 0
    });
    const invitationsSafeValues = useWithSafeValues(invitationsListParams, {
        initialPage: 1,
        pageSize: 10,
        status: [
            "pending"
        ],
        keepPreviousData: false,
        infinite: false
    });
    const clerk = useClerkInstanceContext();
    clerk.telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])("useOrganization"));
    const domainParams = typeof domainListParams === "undefined" ? void 0 : {
        initialPage: domainSafeValues.initialPage,
        pageSize: domainSafeValues.pageSize,
        enrollmentMode: domainSafeValues.enrollmentMode
    };
    const membershipRequestParams = typeof membershipRequestsListParams === "undefined" ? void 0 : {
        initialPage: membershipRequestSafeValues.initialPage,
        pageSize: membershipRequestSafeValues.pageSize,
        status: membershipRequestSafeValues.status
    };
    const membersParams = typeof membersListParams === "undefined" ? void 0 : {
        initialPage: membersSafeValues.initialPage,
        pageSize: membersSafeValues.pageSize,
        role: membersSafeValues.role,
        query: membersSafeValues.query
    };
    const invitationsParams = typeof invitationsListParams === "undefined" ? void 0 : {
        initialPage: invitationsSafeValues.initialPage,
        pageSize: invitationsSafeValues.pageSize,
        status: invitationsSafeValues.status
    };
    const domains = usePagesOrInfinite({
        fetcher: organization?.getDomains,
        config: {
            keepPreviousData: domainSafeValues.keepPreviousData,
            infinite: domainSafeValues.infinite,
            enabled: !!domainParams,
            isSignedIn: organization !== null,
            initialPage: domainSafeValues.initialPage,
            pageSize: domainSafeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.DOMAINS_KEY,
            authenticated: true,
            tracked: {
                organizationId: organization?.id
            },
            untracked: {
                args: domainParams
            }
        })
    });
    const membershipRequests = usePagesOrInfinite({
        fetcher: organization?.getMembershipRequests,
        config: {
            keepPreviousData: membershipRequestSafeValues.keepPreviousData,
            infinite: membershipRequestSafeValues.infinite,
            enabled: !!membershipRequestParams,
            isSignedIn: organization !== null,
            initialPage: membershipRequestSafeValues.initialPage,
            pageSize: membershipRequestSafeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.MEMBERSHIP_REQUESTS_KEY,
            authenticated: true,
            tracked: {
                organizationId: organization?.id
            },
            untracked: {
                args: membershipRequestParams
            }
        })
    });
    const memberships = usePagesOrInfinite({
        fetcher: organization?.getMemberships,
        config: {
            keepPreviousData: membersSafeValues.keepPreviousData,
            infinite: membersSafeValues.infinite,
            enabled: !!membersParams,
            isSignedIn: organization !== null,
            initialPage: membersSafeValues.initialPage,
            pageSize: membersSafeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.MEMBERSHIPS_KEY,
            authenticated: true,
            tracked: {
                organizationId: organization?.id
            },
            untracked: {
                args: membersParams
            }
        })
    });
    const invitations = usePagesOrInfinite({
        fetcher: organization?.getInvitations,
        config: {
            keepPreviousData: invitationsSafeValues.keepPreviousData,
            infinite: invitationsSafeValues.infinite,
            enabled: !!invitationsParams,
            isSignedIn: organization !== null,
            initialPage: invitationsSafeValues.initialPage,
            pageSize: invitationsSafeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.INVITATIONS_KEY,
            authenticated: true,
            tracked: {
                organizationId: organization?.id
            },
            untracked: {
                args: invitationsParams
            }
        })
    });
    if (organization === void 0) return {
        isLoaded: false,
        organization: void 0,
        membership: void 0,
        domains: undefinedPaginatedResource$1,
        membershipRequests: undefinedPaginatedResource$1,
        memberships: undefinedPaginatedResource$1,
        invitations: undefinedPaginatedResource$1
    };
    if (organization === null) return {
        isLoaded: true,
        organization: null,
        membership: null,
        domains: null,
        membershipRequests: null,
        memberships: null,
        invitations: null
    };
    /** In SSR context we include only the organization object when loadOrg is set to true. */ if (!clerk.loaded && organization) return {
        isLoaded: true,
        organization,
        membership: void 0,
        domains: undefinedPaginatedResource$1,
        membershipRequests: undefinedPaginatedResource$1,
        memberships: undefinedPaginatedResource$1,
        invitations: undefinedPaginatedResource$1
    };
    return {
        isLoaded: clerk.loaded,
        organization,
        membership: (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$organization$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCurrentOrganizationMembership"])(session.user.organizationMemberships, organization.id),
        domains,
        membershipRequests,
        memberships,
        invitations
    };
}
//#endregion
//#region src/react/hooks/useOrganizationCreationDefaults.shared.ts
function useOrganizationCreationDefaultsCacheKeys(params) {
    const { userId } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: STABLE_KEYS.ORGANIZATION_CREATION_DEFAULTS_KEY,
            authenticated: Boolean(userId),
            tracked: {
                userId: userId ?? null
            },
            untracked: {
                args: {}
            }
        });
    }, [
        userId
    ]);
}
//#endregion
//#region src/react/hooks/useOrganizationCreationDefaults.tsx
const HOOK_NAME$3 = "useOrganizationCreationDefaults";
/**
* The `useOrganizationCreationDefaults()` hook retrieves the organization creation defaults for the current user.
*
* @example
* ### Basic usage
*
* ```tsx
* import { useOrganizationCreationDefaults } from '@clerk/clerk-react'
*
* export default function CreateOrganizationForm() {
*   const { data, isLoading } = useOrganizationCreationDefaults()
*
*   if (isLoading) return <div>Loading...</div>
*
*   return (
*     <form>
*       <input defaultValue={data?.form.name} placeholder="Organization name" />
*       <input defaultValue={data?.form.slug} placeholder="Slug" />
*       <button type="submit">Create</button>
*     </form>
*   )
* }
* ```
*/ function useOrganizationCreationDefaults(params = {}) {
    useAssertWrappedByClerkProvider(HOOK_NAME$3);
    const { keepPreviousData = true, enabled = true } = params;
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const featureEnabled = clerk.__internal_environment?.organizationSettings?.organizationCreationDefaults?.enabled ?? false;
    clerk.telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(HOOK_NAME$3));
    const { queryKey } = useOrganizationCreationDefaultsCacheKeys({
        userId: user?.id ?? null
    });
    const queryEnabled = Boolean(user) && enabled && featureEnabled && clerk.loaded;
    const query = useClerkQuery({
        queryKey,
        queryFn: user?.getOrganizationCreationDefaults,
        enabled: queryEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData)
    });
    return {
        data: query.data,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching
    };
}
//#endregion
//#region src/react/hooks/useOrganizationList.tsx
const undefinedPaginatedResource = {
    data: void 0,
    count: void 0,
    error: void 0,
    isLoading: false,
    isFetching: false,
    isError: false,
    page: void 0,
    pageCount: void 0,
    fetchPage: void 0,
    fetchNext: void 0,
    fetchPrevious: void 0,
    hasNextPage: false,
    hasPreviousPage: false,
    revalidate: void 0,
    setData: void 0
};
/**
* The `useOrganizationList()` hook provides access to the current user's organization memberships, invitations, and suggestions. It also includes methods for creating new organizations and managing the active organization.
*
* @example
* ### Expanding and paginating attributes
*
* To keep network usage to a minimum, developers are required to opt-in by specifying which resource they need to fetch and paginate through. So by default, the `userMemberships`, `userInvitations`, and `userSuggestions` attributes are not populated. You must pass true or an object with the desired properties to fetch and paginate the data.
*
* ```tsx
* // userMemberships.data will never be populated
* const { userMemberships } = useOrganizationList()
*
* // Use default values to fetch userMemberships, such as initialPage = 1 and pageSize = 10
* const { userMemberships } = useOrganizationList({
*   userMemberships: true,
* })
*
* // Pass your own values to fetch userMemberships
* const { userMemberships } = useOrganizationList({
*   userMemberships: {
*     pageSize: 20,
*     initialPage: 2, // skips the first page
*   },
* })
*
* // Aggregate pages in order to render an infinite list
* const { userMemberships } = useOrganizationList({
*   userMemberships: {
*     infinite: true,
*   },
* })
* ```
*
* @example
* ### Infinite pagination
*
* The following example demonstrates how to use the `infinite` property to fetch and append new data to the existing list. The `userMemberships` attribute will be populated with the first page of the user's Organization memberships. When the "Load more" button is clicked, the `fetchNext` helper function will be called to append the next page of memberships to the list.
*
* ```tsx {{ filename: 'src/components/JoinedOrganizations.tsx' }}
* import { useOrganizationList } from '@clerk/react'
* import React from 'react'
*
* const JoinedOrganizations = () => {
*   const { isLoaded, setActive, userMemberships } = useOrganizationList({
*     userMemberships: {
*       infinite: true,
*     },
*   })
*
*   if (!isLoaded) {
*     return <>Loading</>
*   }
*
*   return (
*     <>
*       <ul>
*         {userMemberships.data?.map((mem) => (
*           <li key={mem.id}>
*             <span>{mem.organization.name}</span>
*             <button onClick={() => setActive({ organization: mem.organization.id })}>Select</button>
*           </li>
*         ))}
*       </ul>
*
*       <button disabled={!userMemberships.hasNextPage} onClick={() => userMemberships.fetchNext()}>
*         Load more
*       </button>
*     </>
*   )
* }
*
* export default JoinedOrganizations
* ```
*
* @example
* ### Simple pagination
*
* The following example demonstrates how to use the `fetchPrevious` and `fetchNext` helper functions to paginate through the data. The `userInvitations` attribute will be populated with the first page of invitations. When the "Previous page" or "Next page" button is clicked, the `fetchPrevious` or `fetchNext` helper function will be called to fetch the previous or next page of invitations.
*
* Notice the difference between this example's pagination and the infinite pagination example above.
*
* ```tsx {{ filename: 'src/components/UserInvitationsTable.tsx' }}
* import { useOrganizationList } from '@clerk/react'
* import React from 'react'
*
* const UserInvitationsTable = () => {
*   const { isLoaded, userInvitations } = useOrganizationList({
*     userInvitations: {
*       infinite: true,
*       keepPreviousData: true,
*     },
*   })
*
*   if (!isLoaded || userInvitations.isLoading) {
*     return <>Loading</>
*   }
*
*   return (
*     <>
*       <table>
*         <thead>
*           <tr>
*             <th>Email</th>
*             <th>Org name</th>
*           </tr>
*         </thead>
*
*         <tbody>
*           {userInvitations.data?.map((inv) => (
*             <tr key={inv.id}>
*               <th>{inv.emailAddress}</th>
*               <th>{inv.publicOrganizationData.name}</th>
*             </tr>
*           ))}
*         </tbody>
*       </table>
*
*       <button disabled={!userInvitations.hasPreviousPage} onClick={userInvitations.fetchPrevious}>
*         Prev
*       </button>
*       <button disabled={!userInvitations.hasNextPage} onClick={userInvitations.fetchNext}>
*         Next
*       </button>
*     </>
*   )
* }
*
* export default UserInvitationsTable
* ```
*/ function useOrganizationList(params) {
    const { userMemberships, userInvitations, userSuggestions } = params || {};
    useAssertWrappedByClerkProvider("useOrganizationList");
    useAttemptToEnableOrganizations("useOrganizationList", {
        enabled: userMemberships !== void 0 || userInvitations !== void 0 || userSuggestions !== void 0
    });
    const userMembershipsSafeValues = useWithSafeValues(userMemberships, {
        initialPage: 1,
        pageSize: 10,
        keepPreviousData: false,
        infinite: false
    });
    const userInvitationsSafeValues = useWithSafeValues(userInvitations, {
        initialPage: 1,
        pageSize: 10,
        status: "pending",
        keepPreviousData: false,
        infinite: false
    });
    const userSuggestionsSafeValues = useWithSafeValues(userSuggestions, {
        initialPage: 1,
        pageSize: 10,
        status: "pending",
        keepPreviousData: false,
        infinite: false
    });
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    clerk.telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])("useOrganizationList"));
    const userMembershipsParams = typeof userMemberships === "undefined" ? void 0 : {
        initialPage: userMembershipsSafeValues.initialPage,
        pageSize: userMembershipsSafeValues.pageSize
    };
    const userInvitationsParams = typeof userInvitations === "undefined" ? void 0 : {
        initialPage: userInvitationsSafeValues.initialPage,
        pageSize: userInvitationsSafeValues.pageSize,
        status: userInvitationsSafeValues.status
    };
    const userSuggestionsParams = typeof userSuggestions === "undefined" ? void 0 : {
        initialPage: userSuggestionsSafeValues.initialPage,
        pageSize: userSuggestionsSafeValues.pageSize,
        status: userSuggestionsSafeValues.status
    };
    const isClerkLoaded = !!(clerk.loaded && user);
    const memberships = usePagesOrInfinite({
        fetcher: user?.getOrganizationMemberships,
        config: {
            keepPreviousData: userMembershipsSafeValues.keepPreviousData,
            infinite: userMembershipsSafeValues.infinite,
            enabled: !!userMembershipsParams,
            isSignedIn: user !== null,
            initialPage: userMembershipsSafeValues.initialPage,
            pageSize: userMembershipsSafeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.USER_MEMBERSHIPS_KEY,
            authenticated: true,
            tracked: {
                userId: user?.id
            },
            untracked: {
                args: userMembershipsParams
            }
        })
    });
    const invitations = usePagesOrInfinite({
        fetcher: user?.getOrganizationInvitations,
        config: {
            keepPreviousData: userInvitationsSafeValues.keepPreviousData,
            infinite: userInvitationsSafeValues.infinite,
            enabled: !!userInvitationsParams,
            isSignedIn: user !== null,
            initialPage: userInvitationsSafeValues.initialPage,
            pageSize: userInvitationsSafeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.USER_INVITATIONS_KEY,
            authenticated: true,
            tracked: {
                userId: user?.id
            },
            untracked: {
                args: userInvitationsParams
            }
        })
    });
    const suggestions = usePagesOrInfinite({
        fetcher: user?.getOrganizationSuggestions,
        config: {
            keepPreviousData: userSuggestionsSafeValues.keepPreviousData,
            infinite: userSuggestionsSafeValues.infinite,
            enabled: !!userSuggestionsParams,
            isSignedIn: user !== null,
            initialPage: userSuggestionsSafeValues.initialPage,
            pageSize: userSuggestionsSafeValues.pageSize
        },
        keys: createCacheKeys({
            stablePrefix: STABLE_KEYS.USER_SUGGESTIONS_KEY,
            authenticated: true,
            tracked: {
                userId: user?.id
            },
            untracked: {
                args: userSuggestionsParams
            }
        })
    });
    if (!isClerkLoaded) return {
        isLoaded: false,
        createOrganization: void 0,
        setActive: void 0,
        userMemberships: undefinedPaginatedResource,
        userInvitations: undefinedPaginatedResource,
        userSuggestions: undefinedPaginatedResource
    };
    return {
        isLoaded: isClerkLoaded,
        setActive: clerk.setActive,
        createOrganization: clerk.createOrganization,
        userMemberships: memberships,
        userInvitations: invitations,
        userSuggestions: suggestions
    };
}
//#endregion
//#region src/react/hooks/useSafeLayoutEffect.tsx
/**
* @internal
*/ const useSafeLayoutEffect = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect;
//#endregion
//#region src/react/hooks/useSession.ts
const hookName$2 = `useSession`;
/**
* The `useSession()` hook provides access to the current user's [`Session`](https://clerk.com/docs/reference/objects/session) object, as well as helpers for setting the active session.
*
* @unionReturnHeadings
* ["Loading", "Signed out", "Signed in"]
*
* @function
*
* @param [options] - An object containing options for the `useSession()` hook.
* @example
* ### Access the `Session` object
*
* The following example uses the `useSession()` hook to access the `Session` object, which has the `lastActiveAt` property. The `lastActiveAt` property is a `Date` object used to show the time the session was last active.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useSession } from '@clerk/react'
*
* export default function Home() {
*   const { isLoaded, session, isSignedIn } = useSession()
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null
*   }
*   if (!isSignedIn) {
*     // Handle signed out state
*     return null
*   }
*
*   return (
*     <div>
*       <p>This session has been active since {session.lastActiveAt.toLocaleString()}</p>
*     </div>
*   )
* }
* ```
*
* </Tab>
* <Tab>
*
* ```tsx {{ filename: 'app/page.tsx' }}
* 'use client';
*
* import { useSession } from '@clerk/nextjs';
*
* export default function HomePage() {
*   const { isLoaded, session, isSignedIn } = useSession();
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null;
*   }
*   if (!isSignedIn) {
*     // Handle signed out state
*     return null;
*   }
*
*   return (
*     <div>
*       <p>This session has been active since {session.lastActiveAt.toLocaleString()}</p>
*     </div>
*   );
* }
* ```
*
* </Tab>
* </Tabs>
*/ const useSession = ()=>{
    useAssertWrappedByClerkProvider(hookName$2);
    const session = useSessionBase();
    const clerk = useClerkInstanceContext();
    clerk.telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(hookName$2));
    if (session === void 0) return {
        isLoaded: false,
        isSignedIn: void 0,
        session: void 0
    };
    if (session === null) return {
        isLoaded: true,
        isSignedIn: false,
        session: null
    };
    return {
        isLoaded: true,
        isSignedIn: clerk.isSignedIn,
        session
    };
};
//#endregion
//#region src/react/hooks/base/useClientBase.ts
const initialSnapshot = void 0;
const getInitialSnapshot = ()=>initialSnapshot;
function useClientBase() {
    const clerk = useClerkInstanceContext();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((callback)=>clerk.addListener(callback, {
            skipInitialEmit: true
        }), [
        clerk
    ]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!clerk.loaded || !clerk.__internal_lastEmittedResources) return;
        return clerk.__internal_lastEmittedResources.client;
    }, [
        clerk
    ]), getInitialSnapshot);
}
//#endregion
//#region src/react/hooks/useSessionList.ts
const hookName$1 = "useSessionList";
/**
* The `useSessionList()` hook returns an array of [`Session`](https://clerk.com/docs/reference/objects/session) objects that have been registered on the client device.
*
* @unionReturnHeadings
* ["Initialization", "Loaded"]
*
* @function
*
* @example
* ### Get a list of sessions
*
* The following example uses `useSessionList()` to get a list of sessions that have been registered on the client device. The `sessions` property is used to show the number of times the user has visited the page.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useSessionList } from '@clerk/react'
*
* export default function Home() {
*   const { isLoaded, sessions } = useSessionList()
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null
*   }
*
*   return (
*     <div>
*       <p>Welcome back. You've been here {sessions.length} times before.</p>
*     </div>
*   )
* }
* ```
*
* </Tab>
* <Tab>
*
* ```tsx {{ filename: 'app/page.tsx' }}
* 'use client';
*
* import { useSessionList } from '@clerk/nextjs';
*
* export default function HomePage() {
*   const { isLoaded, sessions } = useSessionList();
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null;
*   }
*
*   return (
*     <div>
*       <p>Welcome back. You've been here {sessions.length} times before.</p>
*     </div>
*   );
* }
* ```
*
* </Tab>
* </Tabs>
*/ const useSessionList = ()=>{
    useAssertWrappedByClerkProvider(hookName$1);
    const isomorphicClerk = useClerkInstanceContext();
    const client = useClientBase();
    useClerkInstanceContext().telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(hookName$1));
    if (!client) return {
        isLoaded: false,
        sessions: void 0,
        setActive: void 0
    };
    return {
        isLoaded: true,
        sessions: client.sessions,
        setActive: isomorphicClerk.setActive
    };
};
//#endregion
//#region src/react/hooks/useUser.ts
const hookName = "useUser";
/**
* The `useUser()` hook provides access to the current user's [`User`](https://clerk.com/docs/reference/objects/user) object, which contains all the data for a single user in your application and provides methods to manage their account. This hook also allows you to check if the user is signed in and if Clerk has loaded.
*
* @unionReturnHeadings
* ["Loading", "Signed out", "Signed in"]
*
* @example
* ### Get the current user
*
* The following example uses the `useUser()` hook to access the [`User`](https://clerk.com/docs/reference/objects/user) object, which contains the current user's data such as their full name. The `isLoaded` and `isSignedIn` properties are used to handle the loading state and to check if the user is signed in, respectively.
*
* ```tsx {{ filename: 'src/Example.tsx' }}
* import { useUser } from '@clerk/react'
*
* export default function Example() {
*   const { isSignedIn, user, isLoaded } = useUser()
*
*   if (!isLoaded) {
*     return <div>Loading...</div>
*   }
*
*   if (!isSignedIn) {
*     return <div>Sign in to view this page</div>
*   }
*
*   return <div>Hello {user.firstName}!</div>
* }
* ```
*
* @example
* ### Update user data
*
* The following example uses the `useUser()` hook to access the [`User`](https://clerk.com/docs/reference/objects/user) object, which calls the [`update()`](https://clerk.com/docs/reference/objects/user#update) method to update the current user's information.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useUser } from '@clerk/react'
*
* export default function Home() {
*   const { isSignedIn, isLoaded, user } = useUser()
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null
*   }
*
*   if (!isSignedIn) return null
*
*   const updateUser = async () => {
*     await user.update({
*       firstName: 'John',
*       lastName: 'Doe',
*     })
*   }
*
*   return (
*     <>
*       <button onClick={updateUser}>Update your name</button>
*       <p>user.firstName: {user.firstName}</p>
*       <p>user.lastName: {user.lastName}</p>
*     </>
*   )
* }
* ```
* </Tab>
* <Tab>
*
* ```tsx {{ filename: 'app/page.tsx' }}
* 'use client';
*
* import { useUser } from '@clerk/nextjs';
*
* export default function HomePage() {
*   const { isSignedIn, isLoaded, user } = useUser();
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null;
*   }
*
*   if (!isSignedIn) return null;
*
*   const updateUser = async () => {
*     await user.update({
*       firstName: 'John',
*       lastName: 'Doe',
*     });
*   };
*
*   return (
*     <>
*       <button onClick={updateUser}>Update your name</button>
*       <p>user.firstName: {user.firstName}</p>
*       <p>user.lastName: {user.lastName}</p>
*     </>
*   );
* }
* ```
*
* </Tab>
* </Tabs>
*
* @example
* ### Reload user data
*
* The following example uses the `useUser()` hook to access the [`User`](https://clerk.com/docs/reference/objects/user) object, which calls the [`reload()`](https://clerk.com/docs/reference/objects/user#reload) method to get the latest user's information.
*
* <Tabs items='React,Next.js'>
* <Tab>
*
* ```tsx {{ filename: 'src/Home.tsx' }}
* import { useUser } from '@clerk/react'
*
* export default function Home() {
*   const { isSignedIn, isLoaded, user } = useUser();
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null;
*   }
*
*   if (!isSignedIn) return null;
*
*   const updateUser = async () => {
*     // Update data via an API endpoint
*     const updateMetadata = await fetch('/api/updateMetadata', {
*       method: 'POST',
*       body: JSON.stringify({
*         role: 'admin'
*       })
*     });
*
*     // Check if the update was successful
*     if ((await updateMetadata.json()).message !== 'success') {
*       throw new Error('Error updating');
*     }
*
*     // If the update was successful, reload the user data
*     await user.reload();
*   };
*
*   return (
*     <>
*       <button onClick={updateUser}>Update your metadata</button>
*       <p>user role: {user.publicMetadata.role}</p>
*     </>
*   );
* }
* ```
*
* </Tab>
* <Tab>
*
* ```tsx {{ filename: 'app/page.tsx' }}
* 'use client';
*
* import { useUser } from '@clerk/nextjs';
*
* export default function HomePage() {
*   const { isSignedIn, isLoaded, user } = useUser();
*
*   if (!isLoaded) {
*     // Handle loading state
*     return null;
*   }
*
*   if (!isSignedIn) return null;
*
*   const updateUser = async () => {
*     // Update data via an API endpoint
*     const updateMetadata = await fetch('/api/updateMetadata', {
*       method: 'POST',
*       body: JSON.stringify({
*         role: 'admin',
*       }),
*     });
*
*     // Check if the update was successful
*     if ((await updateMetadata.json()).message !== 'success') {
*       throw new Error('Error updating');
*     }
*
*     // If the update was successful, reload the user data
*     await user.reload();
*   };
*
*   return (
*     <>
*       <button onClick={updateUser}>Update your metadata</button>
*       <p>user role: {user.publicMetadata.role}</p>
*     </>
*   );
* }
* ```
*
* </Tab>
* </Tabs>
*/ function useUser() {
    useAssertWrappedByClerkProvider(hookName);
    const user = useUserBase();
    useClerkInstanceContext().telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(hookName));
    if (user === void 0) return {
        isLoaded: false,
        isSignedIn: void 0,
        user: void 0
    };
    if (user === null) return {
        isLoaded: true,
        isSignedIn: false,
        user: null
    };
    return {
        isLoaded: true,
        isSignedIn: true,
        user
    };
}
//#endregion
//#region src/react/hooks/useDeepEqualMemo.ts
const useDeepEqualMemoize = (value)=>{
    const ref = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(value);
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$dequal$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dequal"])(value, ref.current)) ref.current = value;
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>ref.current, [
        ref.current
    ]);
};
/**
* @internal
*/ const useDeepEqualMemo = (factory, dependencyArray)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(factory, useDeepEqualMemoize(dependencyArray));
};
/**
* @internal
*/ const isDeeplyEqual = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$dequal$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["dequal"];
//#endregion
//#region src/react/hooks/useReverification.ts
const CLERK_API_REVERIFICATION_ERROR_CODE = "session_reverification_required";
/**
*
*/ async function resolveResult(result) {
    try {
        const r = await result;
        if (r instanceof Response) return r.json();
        return r;
    } catch (e) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["C"])(e) && e.errors.find(({ code })=>code === CLERK_API_REVERIFICATION_ERROR_CODE)) return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2d$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["reverificationError"])();
        throw e;
    }
}
/**
*
*/ function createReverificationHandler(params) {
    /**
	*
	*/ function assertReverification(fetcher) {
        return async (...args)=>{
            let result = await resolveResult(fetcher(...args));
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2d$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isReverificationHint"])(result)) {
                /**
				* Create a promise
				*/ const resolvers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$createDeferredPromise$2d$DNC587Fa$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"])();
                const isValidMetadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["validateReverificationConfig"])(result.clerk_error.metadata?.reverification);
                const level = isValidMetadata ? isValidMetadata().level : void 0;
                const cancel = ()=>{
                    resolvers.reject(new __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"]("User cancelled attempted verification", {
                        code: "reverification_cancelled"
                    }));
                };
                const complete = ()=>{
                    resolvers.resolve(true);
                };
                if (params.onNeedsReverification === void 0) /**
				* On success resolve the pending promise
				* On cancel reject the pending promise
				*/ params.openUIComponent?.({
                    level,
                    afterVerification: complete,
                    afterVerificationCancelled: cancel
                });
                else params.onNeedsReverification({
                    cancel,
                    complete,
                    level
                });
                /**
				* Wait until the promise from above have been resolved or rejected
				*/ await resolvers.promise;
                /**
				* After the promise resolved successfully try the original request one more time
				*/ result = await resolveResult(fetcher(...args));
            }
            return result;
        };
    }
    return assertReverification;
}
/**
* > [!WARNING]
* >
* > Depending on the SDK you're using, this feature requires `@clerk/nextjs@6.12.7` or later, `@clerk/react@5.25.1` or later, and `@clerk/clerk-js@5.57.1` or later.
*
* The `useReverification()` hook is used to handle a session's reverification flow. If a request requires reverification, a modal will display, prompting the user to verify their credentials. Upon successful verification, the original request will automatically retry.
*
* @function
*
* @returns The `useReverification()` hook returns an array with the "enhanced" fetcher.
*
* @example
* ### Handle cancellation of the reverification process
*
* The following example demonstrates how to handle scenarios where a user cancels the reverification flow, such as closing the modal, which might result in `myData` being `null`.
*
* In the following example, `myFetcher` would be a function in your backend that fetches data from the route that requires reverification. See the [guide on how to require reverification](https://clerk.com/docs/guides/secure/reverification) for more information.
*
* ```tsx {{ filename: 'src/components/MyButton.tsx' }}
* import { useReverification } from '@clerk/react'
* import { isReverificationCancelledError } from '@clerk/react/error'
*
* type MyData = {
*   balance: number
* }
*
* export function MyButton() {
*   const fetchMyData = () => fetch('/api/balance').then(res=> res.json() as Promise<MyData>)
*   const enhancedFetcher = useReverification(fetchMyData);
*
*   const handleClick = async () => {
*     try {
*       const myData = await enhancedFetcher()
*       //     ^ is types as `MyData`
*     } catch (e) {
*       // Handle error returned from the fetcher here
*
*       // You can also handle cancellation with the following
*       if (isReverificationCancelledError(err)) {
*         // Handle the cancellation error here
*       }
*     }
*   }
*
*   return <button onClick={handleClick}>Update User</button>
* }
* ```
*/ const useReverification = (fetcher, options)=>{
    const { __internal_openReverification, telemetry } = useClerk();
    const fetcherRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(fetcher);
    const optionsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(options);
    telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])("useReverification", {
        onNeedsReverification: Boolean(options?.onNeedsReverification)
    }));
    useSafeLayoutEffect(()=>{
        fetcherRef.current = fetcher;
        optionsRef.current = options;
    });
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((...args)=>{
        return createReverificationHandler({
            openUIComponent: __internal_openReverification,
            telemetry,
            ...optionsRef.current
        })(fetcherRef.current)(...args);
    }, [
        __internal_openReverification,
        telemetry
    ]);
};
//#endregion
//#region src/react/hooks/useBillingIsEnabled.ts
/**
* @internal
*/ function useBillingIsEnabled(params) {
    const clerk = useClerkInstanceContext();
    const enabledFromParam = params?.enabled ?? true;
    const environment = clerk.__internal_environment;
    const user = useUserBase();
    const organization = useOrganizationBase();
    const userBillingEnabled = environment?.commerceSettings.billing.user.enabled;
    const orgBillingEnabled = environment?.commerceSettings.billing.organization.enabled;
    const billingEnabled = params?.for === "organization" ? orgBillingEnabled : params?.for === "user" ? userBillingEnabled : userBillingEnabled || orgBillingEnabled;
    const isOrganization = params?.for === "organization";
    const requireUserAndOrganizationWhenAuthenticated = params?.authenticated ?? true ? (isOrganization ? Boolean(organization?.id) : true) && Boolean(user?.id) : true;
    return billingEnabled && enabledFromParam && clerk.loaded && requireUserAndOrganizationWhenAuthenticated;
}
//#endregion
//#region src/react/hooks/createBillingPaginatedHook.tsx
/**
* A hook factory that creates paginated data fetching hooks for commerce-related resources.
* It provides a standardized way to create hooks that can fetch either user or Organization resources
* with built-in pagination support.
*
* The generated hooks handle:
* - Clerk authentication context
* - Resource-specific data fetching
* - Pagination (both traditional and infinite scroll)
* - Telemetry tracking
* - Type safety for the specific resource.
*
* @internal
*/ function createBillingPaginatedHook({ hookName, resourceType, useFetcher, options }) {
    return function useBillingHook(params) {
        const { for: _for, enabled: externalEnabled, ...paginationParams } = params || {};
        const safeFor = _for || "user";
        useAssertWrappedByClerkProvider(hookName);
        const fetchFn = useFetcher(safeFor);
        const safeValues = useWithSafeValues(paginationParams, {
            initialPage: 1,
            pageSize: 10,
            keepPreviousData: false,
            infinite: false,
            __experimental_mode: void 0
        });
        const clerk = useClerkInstanceContext();
        const user = useUserBase();
        const organization = useOrganizationBase();
        clerk.telemetry?.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(hookName));
        const isForOrganization = safeFor === "organization";
        const billingEnabled = useBillingIsEnabled({
            for: safeFor,
            enabled: externalEnabled,
            authenticated: !options?.unauthenticated
        });
        const hookParams = typeof paginationParams === "undefined" ? void 0 : {
            initialPage: safeValues.initialPage,
            pageSize: safeValues.pageSize,
            ...options?.unauthenticated ? {} : isForOrganization ? {
                orgId: organization?.id
            } : {}
        };
        const isEnabled = !!hookParams && clerk.loaded && !!billingEnabled;
        return usePagesOrInfinite({
            fetcher: fetchFn,
            config: {
                keepPreviousData: safeValues.keepPreviousData,
                infinite: safeValues.infinite,
                enabled: isEnabled,
                ...options?.unauthenticated ? {} : {
                    isSignedIn: user !== null
                },
                __experimental_mode: safeValues.__experimental_mode,
                initialPage: safeValues.initialPage,
                pageSize: safeValues.pageSize
            },
            keys: createCacheKeys({
                stablePrefix: resourceType,
                authenticated: !options?.unauthenticated,
                tracked: options?.unauthenticated ? {
                    for: safeFor
                } : {
                    userId: user?.id,
                    ...isForOrganization ? {
                        orgId: organization?.id
                    } : {}
                },
                untracked: {
                    args: hookParams
                }
            })
        });
    };
}
//#endregion
//#region src/react/hooks/useStatements.tsx
/**
* @internal
*/ const useStatements = createBillingPaginatedHook({
    hookName: "useStatements",
    resourceType: STABLE_KEYS.STATEMENTS_KEY,
    useFetcher: ()=>{
        const clerk = useClerkInstanceContext();
        if (clerk.loaded) return clerk.billing.getStatements;
    }
});
//#endregion
//#region src/react/hooks/usePaymentAttempts.tsx
/**
* @internal
*/ const usePaymentAttempts = createBillingPaginatedHook({
    hookName: "usePaymentAttempts",
    resourceType: STABLE_KEYS.PAYMENT_ATTEMPTS_KEY,
    useFetcher: ()=>{
        const clerk = useClerkInstanceContext();
        if (clerk.loaded) return clerk.billing.getPaymentAttempts;
    }
});
//#endregion
//#region src/react/hooks/usePaymentMethods.tsx
/**
* @internal
*/ const usePaymentMethods = createBillingPaginatedHook({
    hookName: "usePaymentMethods",
    resourceType: STABLE_KEYS.PAYMENT_METHODS_KEY,
    useFetcher: (resource)=>{
        const organization = useOrganizationBase();
        const user = useUserBase();
        if (resource === "organization") return organization?.getPaymentMethods;
        return user?.getPaymentMethods;
    }
});
//#endregion
//#region src/react/hooks/usePlans.tsx
/**
* @internal
*/ const usePlans = createBillingPaginatedHook({
    hookName: "usePlans",
    resourceType: STABLE_KEYS.PLANS_KEY,
    useFetcher: (_for)=>{
        const clerk = useClerkInstanceContext();
        if (!clerk.loaded) return;
        return (params)=>clerk.billing.getPlans({
                ...params,
                for: _for
            });
    },
    options: {
        unauthenticated: true
    }
});
//#endregion
//#region src/react/hooks/useSubscription.shared.ts
function useSubscriptionCacheKeys(params) {
    const { userId, orgId, for: forType } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const safeOrgId = forType === "organization" ? orgId : void 0;
        return createCacheKeys({
            stablePrefix: STABLE_KEYS.SUBSCRIPTION_KEY,
            authenticated: true,
            tracked: {
                userId,
                orgId: safeOrgId
            },
            untracked: {
                args: {
                    orgId: safeOrgId
                }
            }
        });
    }, [
        userId,
        orgId,
        forType
    ]);
}
//#endregion
//#region src/react/hooks/useSubscription.tsx
const HOOK_NAME$2 = "useSubscription";
/**
* @internal
*/ function useSubscription(params) {
    useAssertWrappedByClerkProvider(HOOK_NAME$2);
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const organization = useOrganizationBase();
    const billingEnabled = useBillingIsEnabled(params);
    const recordedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!recordedRef.current && clerk?.telemetry) {
            clerk.telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(HOOK_NAME$2));
            recordedRef.current = true;
        }
    }, [
        clerk
    ]);
    const keepPreviousData = params?.keepPreviousData ?? false;
    const [queryClient] = useClerkQueryClient();
    const { queryKey, invalidationKey, stableKey, authenticated } = useSubscriptionCacheKeys({
        userId: user?.id,
        orgId: organization?.id,
        for: params?.for
    });
    const queriesEnabled = Boolean(user?.id && billingEnabled);
    useClearQueriesOnSignOut({
        isSignedOut: user === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ({ queryKey })=>{
            const obj = queryKey[3];
            return clerk.billing.getSubscription(obj.args);
        },
        staleTime: 1e3 * 60,
        enabled: queriesEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData && queriesEnabled)
    });
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>queryClient.invalidateQueries({
            queryKey: invalidationKey
        }), [
        queryClient,
        invalidationKey
    ]);
    return {
        data: query.data,
        error: query.error ?? void 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        revalidate
    };
}
//#endregion
//#region src/react/hooks/useCheckout.ts
/**
* @function
*
* @param [options] - An object containing the configuration for the checkout flow.
*
* **Required** if the hook is used without a `<CheckoutProvider />` wrapping the component tree.
*/ const useCheckout = (options)=>{
    const contextOptions = useCheckoutContext();
    const { for: forOrganization, planId, planPeriod, seatsQuantity, priceId } = options || contextOptions;
    const organization = useOrganizationBase();
    const { isLoaded, user } = useUser();
    const clerk = useClerkInstanceContext();
    if (user === null && isLoaded) throw new Error("Clerk: Ensure that `useCheckout` is inside a component wrapped with `<Show when=\"signed-in\" />`.");
    if (isLoaded && forOrganization === "organization" && organization === null) throw new Error("Clerk: Ensure your flow checks for an active organization. Retrieve `orgId` from `useAuth()` and confirm it is defined. For SSR, see: https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object");
    const signal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return clerk.__experimental_checkout({
            planId,
            planPeriod,
            for: forOrganization,
            seatsQuantity,
            priceId
        });
    }, [
        user?.id,
        organization?.id,
        planId,
        planPeriod,
        forOrganization,
        seatsQuantity,
        priceId
    ]);
    const subscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((callback)=>{
        if (!clerk.loaded) return ()=>{};
        return clerk.__internal_state.__internal_effect(()=>{
            signal();
            callback();
        });
    }, [
        signal,
        clerk.loaded,
        clerk.__internal_state
    ]);
    const getSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        return signal();
    }, [
        signal
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getSnapshot);
};
//#endregion
//#region src/react/hooks/useCreditBalance.tsx
const HOOK_NAME$1 = "useCreditBalance";
/**
* @internal
*/ function __internal_useCreditBalanceQuery(params) {
    useAssertWrappedByClerkProvider(HOOK_NAME$1);
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const organization = useOrganizationBase();
    const billingEnabled = useBillingIsEnabled(params);
    const recordedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!recordedRef.current && clerk?.telemetry) {
            clerk.telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(HOOK_NAME$1));
            recordedRef.current = true;
        }
    }, [
        clerk
    ]);
    const keepPreviousData = params?.keepPreviousData ?? false;
    const [queryClient] = useClerkQueryClient();
    const { queryKey, invalidationKey, stableKey, authenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const safeOrgId = params?.for === "organization" ? organization?.id : void 0;
        return createCacheKeys({
            stablePrefix: STABLE_KEYS.CREDIT_BALANCE_KEY,
            authenticated: true,
            tracked: {
                userId: user?.id,
                orgId: safeOrgId
            },
            untracked: {
                args: {
                    orgId: safeOrgId
                }
            }
        });
    }, [
        user?.id,
        organization?.id,
        params?.for
    ]);
    const queriesEnabled = Boolean(user?.id && billingEnabled && (params?.enabled ?? true));
    useClearQueriesOnSignOut({
        isSignedOut: user === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ({ queryKey })=>{
            const obj = queryKey[3];
            return clerk.billing.getCreditBalance(obj.args);
        },
        staleTime: 1e3 * 60,
        enabled: queriesEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData && queriesEnabled)
    });
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>queryClient.invalidateQueries({
            queryKey: invalidationKey
        }), [
        queryClient,
        invalidationKey
    ]);
    return {
        data: query.data,
        error: query.error ?? void 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        revalidate
    };
}
//#endregion
//#region src/react/hooks/useCreditHistory.tsx
const HOOK_NAME = "useCreditHistory";
/**
* @internal
*/ function __internal_useCreditHistoryQuery(params) {
    useAssertWrappedByClerkProvider(HOOK_NAME);
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const organization = useOrganizationBase();
    const billingEnabled = useBillingIsEnabled(params);
    const recordedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!recordedRef.current && clerk?.telemetry) {
            clerk.telemetry.record((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["a"])(HOOK_NAME));
            recordedRef.current = true;
        }
    }, [
        clerk
    ]);
    const [queryClient] = useClerkQueryClient();
    const { queryKey, invalidationKey, stableKey, authenticated } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const safeOrgId = params?.for === "organization" ? organization?.id : void 0;
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.CREDIT_HISTORY_KEY,
            authenticated: true,
            tracked: {
                userId: user?.id,
                orgId: safeOrgId
            },
            untracked: {
                args: {
                    orgId: safeOrgId
                }
            }
        });
    }, [
        user?.id,
        organization?.id,
        params?.for
    ]);
    const queriesEnabled = Boolean(user?.id && billingEnabled && (params?.enabled ?? true));
    useClearQueriesOnSignOut({
        isSignedOut: user === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ({ queryKey })=>{
            const obj = queryKey[3];
            return clerk.billing.getCreditHistory(obj.args);
        },
        staleTime: 1e3 * 60,
        enabled: queriesEnabled
    });
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>queryClient.invalidateQueries({
            queryKey: invalidationKey
        }), [
        queryClient,
        invalidationKey
    ]);
    return {
        data: query.data,
        error: query.error ?? void 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        revalidate
    };
}
//#endregion
//#region src/react/hooks/useStatementQuery.shared.ts
function useStatementQueryCacheKeys(params) {
    const { statementId, userId, orgId, for: forType } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.BILLING_STATEMENTS_KEY,
            authenticated: true,
            tracked: {
                statementId,
                forType,
                userId,
                orgId
            },
            untracked: {
                args: {
                    id: statementId ?? void 0,
                    orgId: orgId ?? void 0
                }
            }
        });
    }, [
        statementId,
        forType,
        userId,
        orgId
    ]);
}
//#endregion
//#region src/react/hooks/useStatementQuery.tsx
/**
* @internal
*/ function useStatementQuery(params = {}) {
    const { statementId = null, keepPreviousData = false, for: forType = "user" } = params;
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const organization = useOrganizationBase();
    const organizationId = forType === "organization" ? organization?.id ?? null : null;
    const { queryKey, stableKey, authenticated } = useStatementQueryCacheKeys({
        statementId,
        userId: user?.id ?? null,
        orgId: organizationId,
        for: forType
    });
    const billingEnabled = useBillingIsEnabled(params);
    const queryEnabled = Boolean(statementId) && billingEnabled;
    useClearQueriesOnSignOut({
        isSignedOut: user === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ()=>{
            if (!statementId) throw new Error("statementId is required to fetch a statement");
            return clerk.billing.getStatement({
                id: statementId,
                orgId: organizationId ?? void 0
            });
        },
        enabled: queryEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData),
        staleTime: 1e3 * 60
    });
    return {
        data: query.data,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching
    };
}
//#endregion
//#region src/react/hooks/usePlanDetailsQuery.shared.ts
function usePlanDetailsQueryCacheKeys(params) {
    const { planId } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.BILLING_PLANS_KEY,
            authenticated: false,
            tracked: {
                planId: planId ?? null
            },
            untracked: {
                args: {
                    id: planId ?? void 0
                }
            }
        });
    }, [
        planId
    ]);
}
//#endregion
//#region src/react/hooks/usePlanDetailsQuery.tsx
/**
* @internal
*/ function __internal_usePlanDetailsQuery(params = {}) {
    const { planId, initialPlan = null, keepPreviousData = true } = params;
    const clerk = useClerkInstanceContext();
    const targetPlanId = planId ?? initialPlan?.id ?? null;
    const { queryKey } = usePlanDetailsQueryCacheKeys({
        planId: targetPlanId
    });
    const billingEnabled = useBillingIsEnabled({
        authenticated: false
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ()=>{
            if (!targetPlanId) throw new Error("planId is required to fetch plan details");
            return clerk.billing.getPlan({
                id: targetPlanId
            });
        },
        enabled: Boolean(targetPlanId) && billingEnabled,
        initialData: initialPlan ?? void 0,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData),
        initialDataUpdatedAt: 0
    });
    return {
        data: query.data,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching
    };
}
//#endregion
//#region src/react/hooks/usePaymentAttemptQuery.shared.ts
function usePaymentAttemptQueryCacheKeys(params) {
    const { paymentAttemptId, userId, orgId, for: forType } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.PAYMENT_ATTEMPT_KEY,
            authenticated: true,
            tracked: {
                paymentAttemptId,
                forType,
                userId,
                orgId
            },
            untracked: {
                args: {
                    id: paymentAttemptId ?? void 0,
                    orgId: orgId ?? void 0
                }
            }
        });
    }, [
        paymentAttemptId,
        forType,
        userId,
        orgId
    ]);
}
//#endregion
//#region src/react/hooks/usePaymentAttemptQuery.tsx
/**
* @internal
*/ function usePaymentAttemptQuery(params) {
    const { paymentAttemptId, keepPreviousData = false, for: forType = "user" } = params;
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const organization = useOrganizationBase();
    const organizationId = forType === "organization" ? organization?.id ?? null : null;
    const { queryKey, stableKey, authenticated } = usePaymentAttemptQueryCacheKeys({
        paymentAttemptId,
        userId: user?.id ?? null,
        orgId: organizationId,
        for: forType
    });
    const billingEnabled = useBillingIsEnabled(params);
    const queryEnabled = Boolean(paymentAttemptId) && billingEnabled;
    useClearQueriesOnSignOut({
        isSignedOut: user === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ({ queryKey })=>{
            const args = queryKey[3].args;
            return clerk.billing.getPaymentAttempt(args);
        },
        enabled: queryEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData),
        staleTime: 1e3 * 60
    });
    return {
        data: query.data,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching
    };
}
//#endregion
//#region src/react/hooks/useUserEnterpriseConnections.shared.ts
/**
* @internal
*/ function useUserEnterpriseConnectionsCacheKeys(params) {
    const { userId, withOrganizationAccountLinking = false } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.USER_ENTERPRISE_CONNECTIONS_KEY,
            authenticated: Boolean(userId),
            tracked: {
                userId: userId ?? null,
                withOrganizationAccountLinking
            },
            untracked: {
                args: {}
            }
        });
    }, [
        userId,
        withOrganizationAccountLinking
    ]);
}
//#endregion
//#region src/react/hooks/useUserEnterpriseConnections.tsx
/**
* Enterprise connections for the signed-in user
*
* @internal
*/ function useUserEnterpriseConnections(params = {}) {
    const { keepPreviousData = true, enabled = true, withOrganizationAccountLinking = false } = params;
    const clerk = useClerkInstanceContext();
    const user = useUserBase();
    const [queryClient] = useClerkQueryClient();
    const { queryKey, stableKey, authenticated } = useUserEnterpriseConnectionsCacheKeys({
        userId: user?.id ?? null,
        withOrganizationAccountLinking
    });
    const queryEnabled = enabled && clerk.loaded && Boolean(user);
    useClearQueriesOnSignOut({
        isSignedOut: user === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ()=>user?.getEnterpriseConnections({
                withOrganizationAccountLinking
            }),
        enabled: queryEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData)
    });
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>queryClient.invalidateQueries({
            queryKey: [
                stableKey
            ]
        }), [
        queryClient,
        stableKey
    ]);
    return {
        data: query.data,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        revalidate
    };
}
//#endregion
//#region src/react/hooks/useOrganizationEnterpriseConnections.shared.ts
/**
* @internal
*/ function useOrganizationEnterpriseConnectionsCacheKeys(params) {
    const { organizationId, withOrganizationAccountLinking = false } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.ORGANIZATION_ENTERPRISE_CONNECTIONS_KEY,
            authenticated: Boolean(organizationId),
            tracked: {
                organizationId: organizationId ?? null,
                withOrganizationAccountLinking
            },
            untracked: {
                args: {}
            }
        });
    }, [
        organizationId,
        withOrganizationAccountLinking
    ]);
}
//#endregion
//#region src/react/hooks/useOrganizationEnterpriseConnections.tsx
/**
* Enterprise connections for the active organization
*
* @internal
*/ function useOrganizationEnterpriseConnections(params = {}) {
    const { keepPreviousData = true, enabled = true, withOrganizationAccountLinking = false } = params;
    const clerk = useClerkInstanceContext();
    const organization = useOrganizationBase();
    const [queryClient] = useClerkQueryClient();
    const { queryKey, stableKey, authenticated } = useOrganizationEnterpriseConnectionsCacheKeys({
        organizationId: organization?.id ?? null,
        withOrganizationAccountLinking
    });
    const queryEnabled = enabled && clerk.loaded && Boolean(organization);
    useClearQueriesOnSignOut({
        isSignedOut: organization === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: ()=>organization?.getEnterpriseConnections({
                withOrganizationAccountLinking
            }),
        enabled: queryEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData)
    });
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>queryClient.invalidateQueries({
            queryKey: [
                stableKey
            ]
        }), [
        queryClient,
        stableKey
    ]);
    const createEnterpriseConnection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (createParams)=>{
        const created = await organization?.createEnterpriseConnection(createParams);
        await revalidate();
        return created;
    }, [
        organization,
        revalidate
    ]);
    const updateEnterpriseConnection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (enterpriseConnectionId, updateParams)=>{
        const updated = await organization?.updateEnterpriseConnection(enterpriseConnectionId, updateParams);
        await revalidate();
        return updated;
    }, [
        organization,
        revalidate
    ]);
    const deleteEnterpriseConnection = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (enterpriseConnectionId)=>{
        const deleted = await organization?.deleteEnterpriseConnection(enterpriseConnectionId);
        await revalidate();
        return deleted;
    }, [
        organization,
        revalidate
    ]);
    return {
        data: query.data,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        createEnterpriseConnection,
        updateEnterpriseConnection,
        deleteEnterpriseConnection,
        revalidate
    };
}
//#endregion
//#region src/react/hooks/useOrganizationDomains.shared.ts
/**
* @internal
*/ function useOrganizationDomainsCacheKeys(params) {
    const { organizationId, enrollmentMode } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.ORGANIZATION_DOMAINS_KEY,
            authenticated: Boolean(organizationId),
            tracked: {
                organizationId: organizationId ?? null,
                enrollmentMode: enrollmentMode ?? null
            },
            untracked: {
                args: {}
            }
        });
    }, [
        organizationId,
        enrollmentMode
    ]);
}
//#endregion
//#region src/react/hooks/useOrganizationDomains.tsx
const OWNERSHIP_VERIFICATION_POLL_INTERVAL_MS = 1e4;
/**
* Domains for the active organization.
*
* @internal
*/ function useOrganizationDomains(params = {}) {
    const { keepPreviousData = true, enabled = true, enrollmentMode, onOwnershipVerified } = params;
    const clerk = useClerkInstanceContext();
    const organization = useOrganizationBase();
    const [queryClient] = useClerkQueryClient();
    const onOwnershipVerifiedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(onOwnershipVerified);
    onOwnershipVerifiedRef.current = onOwnershipVerified;
    const { queryKey, stableKey, authenticated } = useOrganizationDomainsCacheKeys({
        organizationId: organization?.id ?? null,
        enrollmentMode
    });
    const queryEnabled = enabled && clerk.loaded && Boolean(organization);
    useClearQueriesOnSignOut({
        isSignedOut: organization === null,
        authenticated,
        stableKeys: stableKey
    });
    const fetchParams = enrollmentMode ? {
        enrollmentMode
    } : void 0;
    const query = useClerkQuery({
        queryKey,
        queryFn: ()=>organization?.getDomains(fetchParams),
        enabled: queryEnabled,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData)
    });
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>queryClient.invalidateQueries({
            queryKey: [
                stableKey
            ]
        }), [
        queryClient,
        stableKey
    ]);
    const createDomain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (name)=>{
        let created = await organization?.createDomain(name, enrollmentMode ? {
            enrollmentMode
        } : void 0);
        if (created && enrollmentMode === "enterprise_sso") created = (await organization?.prepareOwnershipVerification([
            created.id
        ]))?.data[0] ?? created;
        await revalidate();
        return created;
    }, [
        organization,
        revalidate,
        enrollmentMode
    ]);
    const prepareOwnershipVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (domains)=>{
        const prepared = await organization?.prepareOwnershipVerification(domains.map((domain)=>domain.id));
        await revalidate();
        return prepared;
    }, [
        organization,
        revalidate
    ]);
    const attemptOwnershipVerification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (domains)=>{
        const attempted = await organization?.attemptOwnershipVerification(domains.map((domain)=>domain.id));
        await revalidate();
        return attempted;
    }, [
        organization,
        revalidate
    ]);
    const response = query.data;
    const unverifiedOwnershipKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(response?.data ?? []).filter((domain)=>domain.ownershipVerification?.status === "unverified").map((domain)=>domain.id), [
        response?.data
    ]).join(",");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!queryEnabled || !organization || !unverifiedOwnershipKey) return;
        let cancelled = false;
        let timeoutId;
        const scheduleNext = ()=>{
            timeoutId = setTimeout(()=>void runAttempt(), OWNERSHIP_VERIFICATION_POLL_INTERVAL_MS);
        };
        const domainIds = unverifiedOwnershipKey.split(",");
        const runAttempt = async ()=>{
            const result = await organization.attemptOwnershipVerification(domainIds).catch((error)=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$logger$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["logger"].warnOnce(`Clerk: failed to attempt organization domain ownership verification: ${error}`);
            });
            if (cancelled) return;
            await revalidate();
            if (cancelled) return;
            const verifiedDomains = result?.data.filter((domain)=>domain.ownershipVerification?.status === "verified") ?? [];
            if (verifiedDomains.length) await onOwnershipVerifiedRef.current?.(verifiedDomains);
            if (cancelled) return;
            if (!!result?.data.length && result.data.every((domain)=>domain.ownershipVerification?.status === "verified")) return;
            scheduleNext();
        };
        scheduleNext();
        return ()=>{
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [
        unverifiedOwnershipKey,
        queryEnabled
    ]);
    return {
        data: response?.data,
        totalCount: response?.total_count,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        createDomain,
        prepareOwnershipVerification,
        attemptOwnershipVerification,
        revalidate
    };
}
//#endregion
//#region src/react/hooks/useOrganizationEnterpriseConnectionTestRuns.shared.ts
/**
* @internal
*/ function useOrganizationEnterpriseConnectionTestRunsCacheKeys(params) {
    const { organizationId, enterpriseConnectionId, args } = params;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return createCacheKeys({
            stablePrefix: INTERNAL_STABLE_KEYS.ORGANIZATION_ENTERPRISE_CONNECTION_TEST_RUNS_KEY,
            authenticated: Boolean(organizationId),
            tracked: {
                organizationId: organizationId ?? null,
                enterpriseConnectionId: enterpriseConnectionId ?? null
            },
            untracked: {
                args
            }
        });
    }, [
        organizationId,
        enterpriseConnectionId,
        JSON.stringify(args)
    ]);
}
//#endregion
//#region src/react/hooks/useOrganizationEnterpriseConnectionTestRuns.tsx
const DEFAULT_POLL_INTERVAL_MS = 2e3;
/**
* Subscribes to the list of enterprise-connection test runs for the active organization
*
* @internal
*/ function useOrganizationEnterpriseConnectionTestRuns(params) {
    const { enterpriseConnectionId, params: fetchParams = {
        initialPage: 1,
        pageSize: 10
    }, pollIntervalMs = DEFAULT_POLL_INTERVAL_MS, enabled = true, keepPreviousData = false } = params;
    const clerk = useClerkInstanceContext();
    const organization = useOrganizationBase();
    const [queryClient] = useClerkQueryClient();
    const { queryKey, invalidationKey, stableKey, authenticated } = useOrganizationEnterpriseConnectionTestRunsCacheKeys({
        organizationId: organization?.id ?? null,
        enterpriseConnectionId,
        args: fetchParams
    });
    useClearQueriesOnSignOut({
        isSignedOut: organization === null,
        authenticated,
        stableKeys: stableKey
    });
    const queryEnabled = enabled && clerk.loaded && Boolean(organization) && Boolean(enterpriseConnectionId);
    const [shouldPoll, setShouldPoll] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setShouldPoll(false);
    }, [
        enterpriseConnectionId
    ]);
    const query = useClerkQuery({
        queryKey,
        queryFn: ()=>{
            if (!enterpriseConnectionId) throw new Error("enterpriseConnectionId is required to fetch test runs");
            return organization?.getEnterpriseConnectionTestRuns(enterpriseConnectionId, fetchParams);
        },
        refetchInterval: (q)=>{
            if (!shouldPoll) return false;
            return (q.state.data?.data?.length ?? 0) > 0 ? false : pollIntervalMs;
        },
        enabled: queryEnabled,
        refetchIntervalInBackground: false,
        placeholderData: defineKeepPreviousDataFn(keepPreviousData)
    });
    const hasRows = (query.data?.data?.length ?? 0) > 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (shouldPoll && hasRows) setShouldPoll(false);
    }, [
        shouldPoll,
        hasRows
    ]);
    const revalidate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (options)=>{
        if ((options?.armPolling ?? true) && !hasRows) setShouldPoll(true);
        if (options?.exact) await queryClient.invalidateQueries({
            queryKey,
            exact: true
        });
        else await queryClient.invalidateQueries({
            queryKey: invalidationKey
        });
        const fresh = queryClient.getQueryData(queryKey);
        return {
            data: fresh?.data,
            totalCount: fresh?.total_count
        };
    }, [
        queryClient,
        invalidationKey,
        queryKey,
        hasRows
    ]);
    const isPolling = queryEnabled && shouldPoll && !hasRows;
    return {
        data: query.data?.data,
        totalCount: query.data?.total_count,
        error: query.error ?? null,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isPolling,
        revalidate
    };
}
//#endregion
//#region src/react/utils.ts
function assertClerkSingletonExists(clerk) {
    if (!clerk) (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$internal$2f$clerk$2d$js$2f$errors$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clerkCoreErrorNoClerkSingleton"])();
}
//#endregion
//#region src/react/ClerkContextProvider.tsx
function ClerkContextProvider(props) {
    const clerk = props.clerk;
    assertClerkSingletonExists(clerk);
    if (props.initialState instanceof Promise && !("use" in __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"] && typeof __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].use === "function")) throw new Error("initialState cannot be a promise if React version is less than 19");
    const clerkCtx = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>({
            value: clerk
        }), [
        props.clerkStatus
    ]);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(InitialStateProvider, {
        initialState: props.initialState
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(ClerkInstanceContext.Provider, {
        value: clerkCtx
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__experimental_CheckoutProvider, {
        value: void 0
    }, props.children)));
}
//#endregion
//#region src/react/stripe-react/utils.ts
const usePrevious = (value)=>{
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(value);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        ref.current = value;
    }, [
        value
    ]);
    return ref.current;
};
const useAttachEvent = (element, event, cb)=>{
    const cbDefined = !!cb;
    const cbRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(cb);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        cbRef.current = cb;
    }, [
        cb
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!cbDefined || !element) return ()=>{};
        const decoratedCb = (...args)=>{
            if (cbRef.current) cbRef.current(...args);
        };
        element.on(event, decoratedCb);
        return ()=>{
            element.off(event, decoratedCb);
        };
    }, [
        cbDefined,
        event,
        element,
        cbRef
    ]);
};
//#endregion
//#region src/react/stripe-react/index.tsx
const ElementsContext = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createContext(null);
ElementsContext.displayName = "ElementsContext";
const parseElementsContext = (ctx, useCase)=>{
    if (!ctx) throw new Error(`Could not find Elements context; You need to wrap the part of your app that ${useCase} in an <Elements> provider.`);
    return ctx;
};
/**
* The `Elements` provider allows you to use [Element components](https://stripe.com/docs/stripe-js/react#element-components) and access the [Stripe object](https://stripe.com/docs/js/initializing) in any nested component.
* Render an `Elements` provider at the root of your React app so that it is available everywhere you need it.
*
* To use the `Elements` provider, call `loadStripe` from `@stripe/stripe-js` with your publishable key.
* The `loadStripe` function will asynchronously load the Stripe.js script and initialize a `Stripe` object.
* Pass the returned `Promise` to `Elements`.
*
* @docs https://stripe.com/docs/stripe-js/react#elements-provider
*/ const Elements = ({ stripe: rawStripeProp, options, children })=>{
    const parsed = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>parseStripeProp(rawStripeProp), [
        rawStripeProp
    ]);
    const [ctx, setContext] = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(()=>({
            stripe: parsed.tag === "sync" ? parsed.stripe : null,
            elements: parsed.tag === "sync" ? parsed.stripe.elements(options) : null
        }));
    __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        let isMounted = true;
        const safeSetContext = (stripe)=>{
            setContext((ctx)=>{
                if (ctx.stripe) return ctx;
                return {
                    stripe,
                    elements: stripe.elements(options)
                };
            });
        };
        if (parsed.tag === "async" && !ctx.stripe) parsed.stripePromise.then((stripe)=>{
            if (stripe && isMounted) safeSetContext(stripe);
        });
        else if (parsed.tag === "sync" && !ctx.stripe) safeSetContext(parsed.stripe);
        return ()=>{
            isMounted = false;
        };
    }, [
        parsed,
        ctx,
        options
    ]);
    const prevStripe = usePrevious(rawStripeProp);
    __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (prevStripe !== null && prevStripe !== rawStripeProp) console.warn("Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.");
    }, [
        prevStripe,
        rawStripeProp
    ]);
    const prevOptions = usePrevious(options);
    __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        if (!ctx.elements) return;
        const updates = extractAllowedOptionsUpdates(options, prevOptions, [
            "clientSecret",
            "fonts"
        ]);
        if (updates) ctx.elements.update(updates);
    }, [
        options,
        prevOptions,
        ctx.elements
    ]);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(ElementsContext.Provider, {
        value: ctx
    }, children);
};
const useElementsContextWithUseCase = (useCaseMessage)=>{
    return parseElementsContext(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useContext(ElementsContext), useCaseMessage);
};
const useElements = ()=>{
    const { elements } = useElementsContextWithUseCase("calls useElements()");
    return elements;
};
const INVALID_STRIPE_ERROR = "Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.";
const validateStripe = (maybeStripe, errorMsg = INVALID_STRIPE_ERROR)=>{
    if (maybeStripe === null || isStripe(maybeStripe)) return maybeStripe;
    throw new Error(errorMsg);
};
const parseStripeProp = (raw, errorMsg = INVALID_STRIPE_ERROR)=>{
    if (isPromise(raw)) return {
        tag: "async",
        stripePromise: Promise.resolve(raw).then((result)=>validateStripe(result, errorMsg))
    };
    const stripe = validateStripe(raw, errorMsg);
    if (stripe === null) return {
        tag: "empty"
    };
    return {
        tag: "sync",
        stripe
    };
};
const isUnknownObject = (raw)=>{
    return raw !== null && typeof raw === "object";
};
const isPromise = (raw)=>{
    return isUnknownObject(raw) && typeof raw.then === "function";
};
const isStripe = (raw)=>{
    return isUnknownObject(raw) && typeof raw.elements === "function" && typeof raw.createToken === "function" && typeof raw.createPaymentMethod === "function" && typeof raw.confirmCardPayment === "function";
};
const extractAllowedOptionsUpdates = (options, prevOptions, immutableKeys)=>{
    if (!isUnknownObject(options)) return null;
    return Object.keys(options).reduce((newOptions, key)=>{
        const isUpdated = !isUnknownObject(prevOptions) || !isEqual(options[key], prevOptions[key]);
        if (immutableKeys.includes(key)) {
            if (isUpdated) console.warn(`Unsupported prop change: options.${key} is not a mutable property.`);
            return newOptions;
        }
        if (!isUpdated) return newOptions;
        return {
            ...newOptions || {},
            [key]: options[key]
        };
    }, null);
};
const PLAIN_OBJECT_STR = "[object Object]";
const isEqual = (left, right)=>{
    if (!isUnknownObject(left) || !isUnknownObject(right)) return left === right;
    const leftArray = Array.isArray(left);
    if (leftArray !== Array.isArray(right)) return false;
    const leftPlainObject = Object.prototype.toString.call(left) === PLAIN_OBJECT_STR;
    if (leftPlainObject !== (Object.prototype.toString.call(right) === PLAIN_OBJECT_STR)) return false;
    if (!leftPlainObject && !leftArray) return left === right;
    const leftKeys = Object.keys(left);
    const rightKeys = Object.keys(right);
    if (leftKeys.length !== rightKeys.length) return false;
    const keySet = {};
    for(let i = 0; i < leftKeys.length; i += 1)keySet[leftKeys[i]] = true;
    for(let i = 0; i < rightKeys.length; i += 1)keySet[rightKeys[i]] = true;
    const allKeys = Object.keys(keySet);
    if (allKeys.length !== leftKeys.length) return false;
    const l = left;
    const r = right;
    const pred = (key)=>{
        return isEqual(l[key], r[key]);
    };
    return allKeys.every(pred);
};
const useStripe = ()=>{
    const { stripe } = useElementsOrCheckoutSdkContextWithUseCase("calls useStripe()");
    return stripe;
};
const useElementsOrCheckoutSdkContextWithUseCase = (useCaseString)=>{
    return parseElementsContext(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useContext(ElementsContext), useCaseString);
};
const capitalized = (str)=>str.charAt(0).toUpperCase() + str.slice(1);
const createElementComponent = (type, isServer)=>{
    const displayName = `${capitalized(type)}Element`;
    const ClientElement = ({ id, className, fallback, options = {}, onBlur, onFocus, onReady, onChange, onEscape, onClick, onLoadError, onLoaderStart, onNetworksChange, onConfirm, onCancel, onShippingAddressChange, onShippingRateChange })=>{
        const ctx = useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
        const elements = "elements" in ctx ? ctx.elements : null;
        const [element, setElement] = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(null);
        const elementRef = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
        const domNode = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useRef(null);
        const [isReady, setReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
        useAttachEvent(element, "blur", onBlur);
        useAttachEvent(element, "focus", onFocus);
        useAttachEvent(element, "escape", onEscape);
        useAttachEvent(element, "click", onClick);
        useAttachEvent(element, "loaderror", onLoadError);
        useAttachEvent(element, "loaderstart", onLoaderStart);
        useAttachEvent(element, "networkschange", onNetworksChange);
        useAttachEvent(element, "confirm", onConfirm);
        useAttachEvent(element, "cancel", onCancel);
        useAttachEvent(element, "shippingaddresschange", onShippingAddressChange);
        useAttachEvent(element, "shippingratechange", onShippingRateChange);
        useAttachEvent(element, "change", onChange);
        let readyCallback;
        if (onReady) readyCallback = ()=>{
            setReady(true);
            onReady(element);
        };
        useAttachEvent(element, "ready", readyCallback);
        __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useLayoutEffect(()=>{
            if (elementRef.current === null && domNode.current !== null && elements) {
                let newElement = null;
                if (elements) newElement = elements.create(type, options);
                elementRef.current = newElement;
                setElement(newElement);
                if (newElement) newElement.mount(domNode.current);
            }
        }, [
            elements,
            options
        ]);
        const prevOptions = usePrevious(options);
        __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
            if (!elementRef.current) return;
            const updates = extractAllowedOptionsUpdates(options, prevOptions, [
                "paymentRequest"
            ]);
            if (updates && "update" in elementRef.current) elementRef.current.update(updates);
        }, [
            options,
            prevOptions
        ]);
        __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useLayoutEffect(()=>{
            return ()=>{
                if (elementRef.current && typeof elementRef.current.destroy === "function") try {
                    elementRef.current.destroy();
                    elementRef.current = null;
                } catch  {}
            };
        }, []);
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, null, !isReady && fallback, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("div", {
            id,
            style: {
                height: isReady ? "unset" : "0px",
                visibility: isReady ? "visible" : "hidden"
            },
            className,
            ref: domNode
        }));
    };
    const ServerElement = (props)=>{
        useElementsOrCheckoutSdkContextWithUseCase(`mounts <${displayName}>`);
        const { id, className } = props;
        return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement("div", {
            id,
            className
        });
    };
    const Element = isServer ? ServerElement : ClientElement;
    Element.displayName = displayName;
    Element.__elementType = type;
    return Element;
};
const PaymentElement$1 = createElementComponent("payment", ("TURBOPACK compile-time value", "undefined") === "undefined");
//#endregion
//#region src/react/billing/useInitializePaymentMethod.tsx
/**
* @internal
*/ function useInitializePaymentMethod(options) {
    const { for: forType } = options ?? {};
    const organization = useOrganizationBase();
    const user = useUserBase();
    const resource = forType === "organization" ? organization : user;
    const billingEnabled = useBillingIsEnabled(options);
    const stableKey = "billing-payment-method-initialize";
    const authenticated = true;
    const queryKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return [
            stableKey,
            authenticated,
            {
                resourceId: resource?.id
            },
            {}
        ];
    }, [
        resource?.id
    ]);
    const isEnabled = Boolean(resource?.id) && billingEnabled;
    useClearQueriesOnSignOut({
        isSignedOut: user === null,
        authenticated,
        stableKeys: stableKey
    });
    const query = useClerkQuery({
        queryKey,
        queryFn: async ()=>{
            if (!resource) return;
            return resource.initializePaymentMethod({
                gateway: "stripe"
            });
        },
        enabled: isEnabled,
        staleTime: 1e3 * 60,
        refetchOnWindowFocus: false,
        placeholderData: defineKeepPreviousDataFn(isEnabled)
    });
    const [queryClient] = useClerkQueryClient();
    const initializePaymentMethod = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!resource) return;
        const result = await resource.initializePaymentMethod({
            gateway: "stripe"
        });
        queryClient.setQueryData(queryKey, result);
        return result;
    }, [
        queryClient,
        queryKey,
        resource
    ]);
    return {
        initializedPaymentMethod: query.data ?? void 0,
        initializePaymentMethod
    };
}
//#endregion
//#region src/react/billing/useStripeClerkLibs.tsx
/**
* @internal
*/ function useStripeClerkLibs() {
    const clerk = useClerk();
    return useClerkQuery({
        queryKey: [
            "clerk-stripe-sdk"
        ],
        queryFn: async ()=>{
            return {
                loadStripe: await clerk.__internal_loadStripeJs()
            };
        },
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        placeholderData: defineKeepPreviousDataFn(true)
    }).data ?? null;
}
//#endregion
//#region src/react/billing/useStripeLoader.tsx
/**
* @internal
*/ function useStripeLoader(options) {
    const { stripeClerkLibs, externalGatewayId, stripePublishableKey } = options;
    const queryKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return [
            "stripe-sdk",
            {
                externalGatewayId,
                stripePublishableKey
            }
        ];
    }, [
        externalGatewayId,
        stripePublishableKey
    ]);
    const billingEnabled = useBillingIsEnabled({
        authenticated: true
    });
    return useClerkQuery({
        queryKey,
        queryFn: ()=>{
            if (!stripeClerkLibs || !externalGatewayId || !stripePublishableKey) return null;
            return stripeClerkLibs.loadStripe(stripePublishableKey, {
                stripeAccount: externalGatewayId
            });
        },
        enabled: Boolean(stripeClerkLibs && externalGatewayId && stripePublishableKey) && billingEnabled,
        staleTime: 1e3 * 60,
        refetchOnWindowFocus: false,
        placeholderData: defineKeepPreviousDataFn(true)
    }).data;
}
//#endregion
//#region src/react/billing/payment-element.tsx
const useInternalEnvironment = ()=>{
    return useClerk().__internal_environment;
};
const useLocalization = ()=>{
    const clerk = useClerk();
    let locale = "en";
    try {
        locale = clerk.__internal_getOption("localization")?.locale || "en";
    } catch  {}
    return locale.split("-")[0];
};
const usePaymentSourceUtils = (forResource = "user")=>{
    const stripeClerkLibs = useStripeClerkLibs();
    const environment = useInternalEnvironment();
    const { initializedPaymentMethod, initializePaymentMethod } = useInitializePaymentMethod({
        for: forResource
    });
    const stripePublishableKey = environment?.commerceSettings.billing.stripePublishableKey ?? void 0;
    return {
        stripe: useStripeLoader({
            stripeClerkLibs,
            externalGatewayId: initializedPaymentMethod?.externalGatewayId,
            stripePublishableKey
        }),
        initializePaymentMethod,
        externalClientSecret: initializedPaymentMethod?.externalClientSecret,
        paymentMethodOrder: initializedPaymentMethod?.paymentMethodOrder
    };
};
const [PaymentElementContext, usePaymentElementContext] = createContextAndHook("PaymentElementContext");
const [StripeUtilsContext, useStripeUtilsContext] = createContextAndHook("StripeUtilsContext");
const ValidateStripeUtils = ({ children })=>{
    const stripe = useStripe();
    const elements = useElements();
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(StripeUtilsContext.Provider, {
        value: {
            value: {
                stripe,
                elements
            }
        }
    }, children);
};
const DummyStripeUtils = ({ children })=>{
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(StripeUtilsContext.Provider, {
        value: {
            value: {}
        }
    }, children);
};
const PropsProvider = ({ children, ...props })=>{
    const utils = usePaymentSourceUtils(props.for);
    const [isPaymentElementReady, setIsPaymentElementReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(PaymentElementContext.Provider, {
        value: {
            value: {
                ...props,
                ...utils,
                setIsPaymentElementReady,
                isPaymentElementReady
            }
        }
    }, children);
};
const PaymentElementProvider = ({ children, ...props })=>{
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(PropsProvider, props, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(PaymentElementInternalRoot, null, children));
};
const PaymentElementInternalRoot = (props)=>{
    const { stripe, externalClientSecret, stripeAppearance } = usePaymentElementContext();
    const locale = useLocalization();
    if (stripe && externalClientSecret) return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(Elements, {
        key: externalClientSecret,
        stripe,
        options: {
            loader: "never",
            clientSecret: externalClientSecret,
            appearance: {
                variables: stripeAppearance
            },
            locale
        }
    }, /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(ValidateStripeUtils, null, props.children));
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(DummyStripeUtils, null, props.children);
};
const PaymentElement = ({ fallback })=>{
    const { setIsPaymentElementReady, paymentMethodOrder, checkout, stripe, externalClientSecret, paymentDescription, for: _for } = usePaymentElementContext();
    const environment = useInternalEnvironment();
    const applePay = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!checkout || !checkout.totals || !checkout.plan) return;
        return {
            recurringPaymentRequest: {
                paymentDescription: paymentDescription || "",
                managementURL: _for === "organization" ? environment?.displayConfig.organizationProfileUrl || "" : environment?.displayConfig.userProfileUrl || "",
                regularBilling: {
                    amount: checkout.totals.totalDueNow?.amount || checkout.totals.grandTotal.amount,
                    label: checkout.plan.name,
                    recurringPaymentIntervalUnit: checkout.planPeriod === "annual" ? "year" : "month"
                }
            }
        };
    }, [
        checkout,
        paymentDescription,
        _for,
        environment
    ]);
    const options = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return {
            layout: {
                type: "tabs",
                defaultCollapsed: false
            },
            paymentMethodOrder,
            applePay
        };
    }, [
        applePay,
        paymentMethodOrder
    ]);
    const onReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsPaymentElementReady(true);
    }, [
        setIsPaymentElementReady
    ]);
    if (!stripe || !externalClientSecret) return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, null, fallback);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(PaymentElement$1, {
        fallback,
        onReady,
        options
    });
};
const throwLibsMissingError = ()=>{
    throw new Error("Clerk: Unable to submit, Stripe libraries are not yet loaded. Be sure to check `isFormReady` before calling `submit`.");
};
const usePaymentElement = ()=>{
    const { isPaymentElementReady, initializePaymentMethod } = usePaymentElementContext();
    const { stripe, elements } = useStripeUtilsContext();
    const { externalClientSecret } = usePaymentElementContext();
    const submit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!stripe || !elements) return throwLibsMissingError();
        const { setupIntent, error } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: window.location.href
            },
            redirect: "if_required"
        });
        if (error) return {
            data: null,
            error: {
                gateway: "stripe",
                error: {
                    code: error.code,
                    message: error.message,
                    type: error.type
                }
            }
        };
        return {
            data: {
                gateway: "stripe",
                paymentToken: setupIntent.payment_method
            },
            error: null
        };
    }, [
        stripe,
        elements
    ]);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (!stripe || !elements) return throwLibsMissingError();
        await initializePaymentMethod();
    }, [
        stripe,
        elements,
        initializePaymentMethod
    ]);
    const isProviderReady = Boolean(stripe && externalClientSecret);
    if (!isProviderReady) return {
        submit: throwLibsMissingError,
        reset: throwLibsMissingError,
        isFormReady: false,
        provider: void 0,
        isProviderReady: false
    };
    return {
        submit,
        reset,
        isFormReady: isPaymentElementReady,
        provider: {
            name: "stripe"
        },
        isProviderReady
    };
};
//#endregion
//#region src/react/PortalProvider.tsx
const [PortalContext, , usePortalContextWithoutGuarantee] = createContextAndHook("PortalProvider");
/**
* UNSAFE_PortalProvider allows you to specify a custom container for Clerk floating UI elements
* (popovers, modals, tooltips, etc.) that use portals.
*
* Only components within this provider will be affected. Components outside the provider
* will continue to use the default document.body for portals.
*
* This is particularly useful when using Clerk components inside external UI libraries
* like Radix Dialog or React Aria Components, where portaled elements need to render
* within the dialog's container to remain interactable.
*
* @example
* ```tsx
* function Example() {
*   const containerRef = useRef(null);
*   return (
*     <RadixDialog ref={containerRef}>
*       <UNSAFE_PortalProvider getContainer={() => containerRef.current}>
*         <UserButton />
*       </UNSAFE_PortalProvider>
*     </RadixDialog>
*   );
* }
* ```
*/ const UNSAFE_PortalProvider = ({ children, getContainer })=>{
    const contextValue = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useMemo(()=>({
            value: {
                getContainer
            }
        }), [
        getContainer
    ]);
    return /* @__PURE__ */ __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].createElement(PortalContext.Provider, {
        value: contextValue
    }, children);
};
UNSAFE_PortalProvider.displayName = "UNSAFE_PortalProvider";
/**
* Hook to get the current portal root container.
* Returns the getContainer function from context if inside a PortalProvider,
* otherwise returns a function that returns null (default behavior).
*/ const usePortalRoot = ()=>{
    const contextValue = usePortalContextWithoutGuarantee();
    if (contextValue && "getContainer" in contextValue && contextValue.getContainer) return contextValue.getContainer;
    return ()=>null;
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export __experimental_CheckoutProvider as t>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__experimental_CheckoutProvider"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export __experimental_PaymentElement as n>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "n",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__experimental_PaymentElement"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export __experimental_PaymentElementProvider as r>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "r",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__experimental_PaymentElementProvider"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export __experimental_useCheckout as i>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "i",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__experimental_useCheckout"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export __experimental_usePaymentElement as a>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "a",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["__experimental_usePaymentElement"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useAPIKeys as o>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "o",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAPIKeys"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useAPIKeys as o> <export o as useAPIKeys>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAPIKeys",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useAPIKeys__as__o$3e$__["o"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useAPIKeys__as__o$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useAPIKeys as o>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useClerk as s>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "s",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useClerk"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useClerk as s> <export s as useClerk>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useClerk",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__["s"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useClerk__as__s$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useClerk as s>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOAuthConsent as c>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOAuthConsent"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOAuthConsent as c> <export c as useOAuthConsent>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOAuthConsent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOAuthConsent__as__c$3e$__["c"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOAuthConsent__as__c$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOAuthConsent as c>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganization as l>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "l",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrganization"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganization as l> <export l as useOrganization>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrganization",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOrganization__as__l$3e$__["l"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOrganization__as__l$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganization as l>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganizationCreationDefaults as u>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "u",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrganizationCreationDefaults"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganizationCreationDefaults as u> <export u as useOrganizationCreationDefaults>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrganizationCreationDefaults",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOrganizationCreationDefaults__as__u$3e$__["u"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOrganizationCreationDefaults__as__u$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganizationCreationDefaults as u>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganizationList as d>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "d",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useOrganizationList"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganizationList as d> <export d as useOrganizationList>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrganizationList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOrganizationList__as__d$3e$__["d"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useOrganizationList__as__d$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useOrganizationList as d>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useReverification as f>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReverification"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useReverification as f> <export f as useReverification>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReverification",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useReverification__as__f$3e$__["f"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useReverification__as__f$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useReverification as f>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useSession as p>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "p",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useSession as p> <export p as useSession>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSession",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useSession__as__p$3e$__["p"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useSession__as__p$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useSession as p>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useSessionList as m>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "m",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSessionList"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useSessionList as m> <export m as useSessionList>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useSessionList__as__m$3e$__["m"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useSessionList__as__m$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useSessionList as m>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useUser as h>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "h",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useUser"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useUser as h> <export h as useUser>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useUser__as__h$3e$__["h"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__useUser__as__h$3e$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/react/index.mjs [app-ssr] (ecmascript) <export useUser as h>");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/retry.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "retry",
    ()=>retry
]);
//#region src/retry.ts
const defaultOptions = {
    initialDelay: 125,
    maxDelayBetweenRetries: 0,
    factor: 2,
    shouldRetry: (_, iteration)=>iteration < 5,
    retryImmediately: false,
    jitter: true
};
const RETRY_IMMEDIATELY_DELAY = 100;
const sleep = async (ms)=>new Promise((s)=>setTimeout(s, ms));
const applyJitter = (delay, jitter)=>{
    return jitter ? delay * (1 + Math.random()) : delay;
};
const createExponentialDelayAsyncFn = (opts)=>{
    let timesCalled = 0;
    const calculateDelayInMs = ()=>{
        const constant = opts.initialDelay;
        const base = opts.factor;
        let delay = constant * Math.pow(base, timesCalled);
        delay = applyJitter(delay, opts.jitter);
        return Math.min(opts.maxDelayBetweenRetries || delay, delay);
    };
    return async ()=>{
        await sleep(calculateDelayInMs());
        timesCalled++;
    };
};
/**
* Retries a callback until it succeeds or the shouldRetry function returns false.
* See {@link RetryOptions} for the available options.
*/ const retry = async (callback, options = {})=>{
    let iterations = 0;
    const { shouldRetry, initialDelay, maxDelayBetweenRetries, factor, retryImmediately, jitter, onBeforeRetry } = {
        ...defaultOptions,
        ...options
    };
    const delay = createExponentialDelayAsyncFn({
        initialDelay,
        maxDelayBetweenRetries,
        factor,
        jitter
    });
    while(true)try {
        return await callback();
    } catch (e) {
        iterations++;
        if (!shouldRetry(e, iterations)) throw e;
        if (onBeforeRetry) await onBeforeRetry(iterations);
        if (retryImmediately && iterations === 1) await sleep(applyJitter(RETRY_IMMEDIATELY_DELAY, jitter));
        else await delay();
    }
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/telemetry.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [app-ssr] (ecmascript)");
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "camelToSnake",
    ()=>camelToSnake,
    "deepCamelToSnake",
    ()=>deepCamelToSnake,
    "deepSnakeToCamel",
    ()=>deepSnakeToCamel,
    "getNonUndefinedValues",
    ()=>getNonUndefinedValues,
    "isIPV4Address",
    ()=>isIPV4Address,
    "isTruthy",
    ()=>isTruthy,
    "snakeToCamel",
    ()=>snakeToCamel,
    "titleize",
    ()=>titleize,
    "toSentence",
    ()=>toSentence
]);
//#region src/underscore.ts
/**
* Convert words to a sentence.
*
* @param items - An array of words to be joined.
* @returns A string with the items joined by a comma and the last item joined by ", or".
*/ const toSentence = (items)=>{
    if (items.length == 0) return "";
    if (items.length == 1) return items[0];
    let sentence = items.slice(0, -1).join(", ");
    sentence += `, or ${items.slice(-1)}`;
    return sentence;
};
const IP_V4_ADDRESS_REGEX = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
/**
* Checks if a string is a valid IPv4 address.
*
* @returns True if the string is a valid IPv4 address, false otherwise.
*/ function isIPV4Address(str) {
    return IP_V4_ADDRESS_REGEX.test(str || "");
}
/**
* Converts the first character of a string to uppercase.
*
* @param str - The string to be converted.
* @returns The modified string with the rest of the string unchanged.
*
* @example
* ```ts
* titleize('hello world') // 'Hello world'
* ```
*/ function titleize(str) {
    const s = str || "";
    return s.charAt(0).toUpperCase() + s.slice(1);
}
/**
* Converts a string from snake_case to camelCase.
*/ function snakeToCamel(str) {
    return str ? str.replace(/([-_][a-z])/g, (match)=>match.toUpperCase().replace(/-|_/, "")) : "";
}
/**
* Converts a string from camelCase to snake_case.
*/ function camelToSnake(str) {
    return str ? str.replace(/[A-Z]/g, (letter)=>`_${letter.toLowerCase()}`) : "";
}
const createDeepObjectTransformer = (transform)=>{
    const deepTransform = (obj)=>{
        if (!obj) return obj;
        if (Array.isArray(obj)) return obj.map((el)=>{
            if (typeof el === "object" || Array.isArray(el)) return deepTransform(el);
            return el;
        });
        const copy = {
            ...obj
        };
        const keys = Object.keys(copy);
        for (const oldName of keys){
            const newName = transform(oldName.toString());
            if (newName !== oldName) {
                copy[newName] = copy[oldName];
                delete copy[oldName];
            }
            if (typeof copy[newName] === "object") copy[newName] = deepTransform(copy[newName]);
        }
        return copy;
    };
    return deepTransform;
};
/**
* Transforms camelCased objects/ arrays to snake_cased.
* This function recursively traverses all objects and arrays of the passed value
* camelCased keys are removed.
*
* @function
*/ const deepCamelToSnake = createDeepObjectTransformer(camelToSnake);
/**
* Transforms snake_cased objects/ arrays to camelCased.
* This function recursively traverses all objects and arrays of the passed value
* camelCased keys are removed.
*
* @function
*/ const deepSnakeToCamel = createDeepObjectTransformer(snakeToCamel);
/**
* A function to determine if a value is truthy.
*
* @returns True for `true`, true, positive numbers. False for `false`, false, 0, negative integers and anything else.
*/ function isTruthy(value) {
    if (typeof value === `boolean`) return value;
    if (value === void 0 || value === null) return false;
    if (typeof value === `string`) {
        if (value.toLowerCase() === `true`) return true;
        if (value.toLowerCase() === `false`) return false;
    }
    const number = parseInt(value, 10);
    if (isNaN(number)) return false;
    if (number > 0) return true;
    return false;
}
/**
* Get all non-undefined values from an object.
*/ function getNonUndefinedValues(obj) {
    return Object.entries(obj).reduce((acc, [key, value])=>{
        if (value !== void 0) acc[key] = value;
        return acc;
    }, {});
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/url.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addClerkPrefix",
    ()=>addClerkPrefix,
    "cleanDoubleSlashes",
    ()=>cleanDoubleSlashes,
    "getClerkJsMajorVersionOrTag",
    ()=>getClerkJsMajorVersionOrTag,
    "getScriptUrl",
    ()=>getScriptUrl,
    "hasLeadingSlash",
    ()=>hasLeadingSlash,
    "hasTrailingSlash",
    ()=>hasTrailingSlash,
    "isAbsoluteUrl",
    ()=>isAbsoluteUrl,
    "isCurrentDevAccountPortalOrigin",
    ()=>isCurrentDevAccountPortalOrigin,
    "isLegacyDevAccountPortalOrigin",
    ()=>isLegacyDevAccountPortalOrigin,
    "isNonEmptyURL",
    ()=>isNonEmptyURL,
    "joinURL",
    ()=>joinURL,
    "parseSearchParams",
    ()=>parseSearchParams,
    "stripScheme",
    ()=>stripScheme,
    "withLeadingSlash",
    ()=>withLeadingSlash,
    "withTrailingSlash",
    ()=>withTrailingSlash,
    "withoutLeadingSlash",
    ()=>withoutLeadingSlash,
    "withoutTrailingSlash",
    ()=>withoutTrailingSlash
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$instance$2d$DNaRGwPZ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/instance-DNaRGwPZ.mjs [app-ssr] (ecmascript)");
;
;
//#region src/url.ts
/**
*
*/ function parseSearchParams(queryString = "") {
    if (queryString.startsWith("?")) queryString = queryString.slice(1);
    return new URLSearchParams(queryString);
}
/**
*
*/ function stripScheme(url = "") {
    return (url || "").replace(/^.+:\/\//, "");
}
/**
*
*/ function addClerkPrefix(str) {
    if (!str) return "";
    let regex;
    if (str.match(/^(clerk\.)+\w*$/)) regex = /(clerk\.)*(?=clerk\.)/;
    else if (str.match(/\.clerk.accounts/)) return str;
    else regex = /^(clerk\.)*/gi;
    return `clerk.${str.replace(regex, "")}`;
}
/**
*
* Retrieve the clerk-js major tag using the major version from the pkgVersion
* param or use the frontendApi to determine if the canary tag should be used.
* The default tag is `latest`.
*/ const getClerkJsMajorVersionOrTag = (frontendApi, version)=>{
    if (!version && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$instance$2d$DNaRGwPZ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["t"])(frontendApi)) return "canary";
    if (!version) return "latest";
    return version.split(".")[0] || "latest";
};
/**
*
* Retrieve the clerk-js script url from the frontendApi and the major tag
* using the {@link getClerkJsMajorVersionOrTag} or a provided clerkJSVersion tag.
*/ const getScriptUrl = (frontendApi, { clerkJSVersion })=>{
    const noSchemeFrontendApi = frontendApi.replace(/http(s)?:\/\//, "");
    const major = getClerkJsMajorVersionOrTag(frontendApi, clerkJSVersion);
    return `https://${noSchemeFrontendApi}/npm/@clerk/clerk-js@${clerkJSVersion || major}/dist/clerk.browser.js`;
};
/**
*
*/ function isLegacyDevAccountPortalOrigin(host) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((legacyDevSuffix)=>{
        return host.startsWith("accounts.") && host.endsWith(legacyDevSuffix);
    });
}
/**
*
*/ function isCurrentDevAccountPortalOrigin(host) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CURRENT_DEV_INSTANCE_SUFFIXES"].some((currentDevSuffix)=>{
        return host.endsWith(currentDevSuffix) && !host.endsWith(".clerk" + currentDevSuffix);
    });
}
const TRAILING_SLASH_RE = /\/$|\/\?|\/#/;
/**
*
*/ function hasTrailingSlash(input = "", respectQueryAndFragment) {
    if (!respectQueryAndFragment) return input.endsWith("/");
    return TRAILING_SLASH_RE.test(input);
}
/**
*
*/ function withTrailingSlash(input = "", respectQueryAndFragment) {
    if (!respectQueryAndFragment) return input.endsWith("/") ? input : input + "/";
    if (hasTrailingSlash(input, true)) return input || "/";
    let path = input;
    let fragment = "";
    const fragmentIndex = input.indexOf("#");
    if (fragmentIndex >= 0) {
        path = input.slice(0, fragmentIndex);
        fragment = input.slice(fragmentIndex);
        if (!path) return fragment;
    }
    const [s0, ...s] = path.split("?");
    return s0 + "/" + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
/**
*
*/ function withoutTrailingSlash(input = "", respectQueryAndFragment) {
    if (!respectQueryAndFragment) return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
    if (!hasTrailingSlash(input, true)) return input || "/";
    let path = input;
    let fragment = "";
    const fragmentIndex = input.indexOf("#");
    if (fragmentIndex >= 0) {
        path = input.slice(0, fragmentIndex);
        fragment = input.slice(fragmentIndex);
    }
    const [s0, ...s] = path.split("?");
    return (s0.slice(0, -1) || "/") + (s.length > 0 ? `?${s.join("?")}` : "") + fragment;
}
/**
*
*/ function hasLeadingSlash(input = "") {
    return input.startsWith("/");
}
/**
*
*/ function withoutLeadingSlash(input = "") {
    return (hasLeadingSlash(input) ? input.slice(1) : input) || "/";
}
/**
*
*/ function withLeadingSlash(input = "") {
    return hasLeadingSlash(input) ? input : "/" + input;
}
/**
*
*/ function cleanDoubleSlashes(input = "") {
    return input.split("://").map((string_)=>string_.replace(/\/{2,}/g, "/")).join("://");
}
/**
*
*/ function isNonEmptyURL(url) {
    return url && url !== "/";
}
const JOIN_LEADING_SLASH_RE = /^\.?\//;
/**
*
*/ function joinURL(base, ...input) {
    let url = base || "";
    for (const segment of input.filter((url)=>isNonEmptyURL(url)))if (url) {
        const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
        url = withTrailingSlash(url) + _segment;
    } else url = segment;
    return url;
}
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>ABSOLUTE_URL_REGEX.test(url);
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/utils/index.mjs [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$handleValueOrFn$2d$CKEDuW4I$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/handleValueOrFn-CKEDuW4I.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$instance$2d$DNaRGwPZ$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/instance-DNaRGwPZ.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/noop-LBsrDrTs.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$createDeferredPromise$2d$DNC587Fa$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/createDeferredPromise-DNC587Fa.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$utils$2d$V2FbmPWk$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/utils-V2FbmPWk.mjs [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/versionCheck.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkVersionAgainstBounds",
    ()=>checkVersionAgainstBounds,
    "isVersionAtLeast",
    ()=>isVersionAtLeast,
    "isVersionCompatible",
    ()=>isVersionCompatible,
    "parseVersion",
    ()=>parseVersion
]);
//#region src/versionCheck.ts
/**
* Parses a version string into major, minor, and patch numbers.
* Returns null if the version string cannot be parsed.
*
* @example
* parseVersion("18.3.1") // { major: 18, minor: 3, patch: 1 }
* parseVersion("19.0.0-rc.1") // { major: 19, minor: 0, patch: 0 }
* parseVersion("invalid") // null
*/ function parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;
    const [, majorStr, minorStr, patchStr] = match;
    return {
        major: parseInt(majorStr, 10),
        minor: parseInt(minorStr, 10),
        patch: parseInt(patchStr, 10)
    };
}
/**
* Checks if a parsed version satisfies the given version bounds.
*
* @param version - The parsed version to check
* @param version.major
* @param bounds - Array of version bounds to check against
* @param version.minor
* @param version.patch
* @returns true if the version satisfies any of the bounds
*/ function checkVersionAgainstBounds(version, bounds) {
    const { major, minor, patch } = version;
    return bounds.some(([bMajor, minMinor, maxMinor, minPatch])=>{
        if (major !== bMajor) return false;
        if (maxMinor === -1) return minor > minMinor || minor === minMinor && patch >= minPatch;
        return minor === maxMinor && patch >= minPatch;
    });
}
/**
* Checks if a version string is compatible with the given bounds.
* This is a convenience function that combines parsing and checking.
*
* @param version - The version string to check (e.g., "18.3.1")
* @param bounds - Array of version bounds to check against
* @returns true if the version is compatible, false otherwise
*/ function isVersionCompatible(version, bounds) {
    const parsed = parseVersion(version);
    if (!parsed) return false;
    return checkVersionAgainstBounds(parsed, bounds);
}
/**
* Returns true if the given version is at least the minimum version.
* Both versions are compared by their major.minor.patch components only.
* Pre-release suffixes are ignored (e.g., "5.114.0-canary.123" is treated as "5.114.0").
*
* @param version - The version string to check (e.g., "5.114.0")
* @param minVersion - The minimum required version (e.g., "5.100.0")
* @returns true if version >= minVersion, false otherwise (including if either cannot be parsed)
*
* @example
* isVersionAtLeast("5.114.0", "5.100.0") // true
* isVersionAtLeast("5.99.0", "5.100.0") // false
* isVersionAtLeast("5.100.0-canary.123", "5.100.0") // true
*/ function isVersionAtLeast(version, minVersion) {
    if (!version) return false;
    const parsed = parseVersion(version);
    const minParsed = parseVersion(minVersion);
    if (!parsed || !minParsed) return false;
    if (parsed.major !== minParsed.major) return parsed.major > minParsed.major;
    if (parsed.minor !== minParsed.minor) return parsed.minor > minParsed.minor;
    return parsed.patch >= minParsed.patch;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/versionSelector.mjs [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getMajorVersion",
    ()=>getMajorVersion,
    "versionSelector",
    ()=>versionSelector
]);
//#region src/versionSelector.ts
/**
* This version selector is a bit complicated, so here is the flow:
* 1. Use the clerkJSVersion prop on the provider
* 2. Use the exact `@clerk/clerk-js` version if it is a `@snapshot` prerelease
* 3. Use the prerelease tag of `@clerk/clerk-js` or the packageVersion provided
* 4. Fallback to the major version of `@clerk/clerk-js` or the packageVersion provided
*
* @param clerkJSVersion - The optional clerkJSVersion prop on the provider
* @param packageVersion - The version of `@clerk/clerk-js` that will be used if an explicit version is not provided
* @returns The npm tag, version or major version to use
*/ const versionSelector = (clerkJSVersion, packageVersion = "6.30.2")=>{
    if (clerkJSVersion) return clerkJSVersion;
    const prereleaseTag = getPrereleaseTag(packageVersion);
    if (prereleaseTag) {
        if (prereleaseTag === "snapshot") return packageVersion;
        return prereleaseTag;
    }
    return getMajorVersion(packageVersion);
};
const getPrereleaseTag = (packageVersion)=>packageVersion.trim().replace(/^v/, "").match(/-(.+?)(\.|$)/)?.[1];
const getMajorVersion = (packageVersion)=>packageVersion.trim().replace(/^v/, "").split(".")[0];
;
}),
];

//# sourceMappingURL=0ody_%40clerk_shared_dist_1a0fyoi._.js.map