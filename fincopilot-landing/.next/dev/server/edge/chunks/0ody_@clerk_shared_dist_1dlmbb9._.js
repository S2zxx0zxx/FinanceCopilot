(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push(["chunks/0ody_@clerk_shared_dist_1dlmbb9._.js",
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [middleware-edge] (ecmascript) <export r as ClerkError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["r"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/createDeferredPromise-DNC587Fa.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>createDeferredPromise
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/noop-LBsrDrTs.mjs [middleware-edge] (ecmascript)");
;
//#region src/utils/createDeferredPromise.ts
/**
* Create a promise that can be resolved or rejected from
* outside the Promise constructor callback
* A ES6 compatible utility that implements `Promise.withResolvers`
*
* @internal
*/ const createDeferredPromise = ()=>{
    let resolve = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"];
    let reject = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"];
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [middleware-edge] (ecmascript)");
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
*/ const isClerkAPIError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["a"])(ClerkAPIError);
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
var ClerkAPIResponseError = class ClerkAPIResponseError extends __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["r"] {
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
*/ const isClerkAPIResponseError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["a"])(ClerkAPIResponseError);
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
*/ var ClerkOfflineError = class ClerkOfflineError extends __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"] {
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
        return error instanceof ClerkOfflineError || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["n"])(error) && error.code === ClerkOfflineError.ERROR_CODE;
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
var ClerkWebAuthnError = class extends __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"] {
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
    return isClerkAPIResponseError(error) || isMetamaskError(error) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["n"])(error);
}
/**
* Checks if the provided error is a Clerk runtime error indicating a reverification was cancelled.
*/ function isReverificationCancelledError(err) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["n"])(err) && err.code === "reverification_cancelled";
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
        isClerkRuntimeError: __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["n"]
    };
    for (const [name, fn] of Object.entries(predicates))Object.assign(error, {
        [name]: fn
    });
    return error;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript) <export C as isClerkAPIResponseError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isClerkAPIResponseError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["C"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript) <export S as ClerkAPIResponseError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClerkAPIResponseError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["S"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript) <export T as parseError>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["T"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript) <export y as buildErrorThrower>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildErrorThrower",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["y"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/handleValueOrFn-CKEDuW4I.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/handleValueOrFn-CKEDuW4I.mjs [middleware-edge] (ecmascript) <export t as handleValueOrFn>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "handleValueOrFn",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$handleValueOrFn$2d$CKEDuW4I$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$handleValueOrFn$2d$CKEDuW4I$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/handleValueOrFn-CKEDuW4I.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/instance-DNaRGwPZ.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/noop-LBsrDrTs.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "t",
    ()=>noop
]);
//#region src/utils/noop.ts
const noop = (..._args)=>{};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/pathToRegexp-C-7qTA7_.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "n",
    ()=>pathToRegexp,
    "t",
    ()=>match
]);
//#region src/compiled/path-to-regexp/index.js
function _(r) {
    for(var n = [], e = 0; e < r.length;){
        var a = r[e];
        if (a === "*" || a === "+" || a === "?") {
            n.push({
                type: "MODIFIER",
                index: e,
                value: r[e++]
            });
            continue;
        }
        if (a === "\\") {
            n.push({
                type: "ESCAPED_CHAR",
                index: e++,
                value: r[e++]
            });
            continue;
        }
        if (a === "{") {
            n.push({
                type: "OPEN",
                index: e,
                value: r[e++]
            });
            continue;
        }
        if (a === "}") {
            n.push({
                type: "CLOSE",
                index: e,
                value: r[e++]
            });
            continue;
        }
        if (a === ":") {
            for(var u = "", t = e + 1; t < r.length;){
                var c = r.charCodeAt(t);
                if (c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 95) {
                    u += r[t++];
                    continue;
                }
                break;
            }
            if (!u) throw new TypeError("Missing parameter name at ".concat(e));
            n.push({
                type: "NAME",
                index: e,
                value: u
            }), e = t;
            continue;
        }
        if (a === "(") {
            var o = 1, m = "", t = e + 1;
            if (r[t] === "?") throw new TypeError("Pattern cannot start with \"?\" at ".concat(t));
            for(; t < r.length;){
                if (r[t] === "\\") {
                    m += r[t++] + r[t++];
                    continue;
                }
                if (r[t] === ")") {
                    if (o--, o === 0) {
                        t++;
                        break;
                    }
                } else if (r[t] === "(" && (o++, r[t + 1] !== "?")) throw new TypeError("Capturing groups are not allowed at ".concat(t));
                m += r[t++];
            }
            if (o) throw new TypeError("Unbalanced pattern at ".concat(e));
            if (!m) throw new TypeError("Missing pattern at ".concat(e));
            n.push({
                type: "PATTERN",
                index: e,
                value: m
            }), e = t;
            continue;
        }
        n.push({
            type: "CHAR",
            index: e,
            value: r[e++]
        });
    }
    return n.push({
        type: "END",
        index: e,
        value: ""
    }), n;
}
function F(r, n) {
    n === void 0 && (n = {});
    for(var e = _(r), a = n.prefixes, u = a === void 0 ? "./" : a, t = n.delimiter, c = t === void 0 ? "/#?" : t, o = [], m = 0, h = 0, p = "", f = function(l) {
        if (h < e.length && e[h].type === l) return e[h++].value;
    }, w = function(l) {
        var v = f(l);
        if (v !== void 0) return v;
        var E = e[h], N = E.type, S = E.index;
        throw new TypeError("Unexpected ".concat(N, " at ").concat(S, ", expected ").concat(l));
    }, d = function() {
        for(var l = "", v; v = f("CHAR") || f("ESCAPED_CHAR");)l += v;
        return l;
    }, M = function(l) {
        for(var v = 0, E = c; v < E.length; v++){
            var N = E[v];
            if (l.indexOf(N) > -1) return !0;
        }
        return !1;
    }, A = function(l) {
        var v = o[o.length - 1], E = l || (v && typeof v == "string" ? v : "");
        if (v && !E) throw new TypeError("Must have text between two parameters, missing text after \"".concat(v.name, "\""));
        return !E || M(E) ? "[^".concat(s(c), "]+?") : "(?:(?!".concat(s(E), ")[^").concat(s(c), "])+?");
    }; h < e.length;){
        var T = f("CHAR"), x = f("NAME"), C = f("PATTERN");
        if (x || C) {
            var g = T || "";
            u.indexOf(g) === -1 && (p += g, g = ""), p && (o.push(p), p = ""), o.push({
                name: x || m++,
                prefix: g,
                suffix: "",
                pattern: C || A(g),
                modifier: f("MODIFIER") || ""
            });
            continue;
        }
        var i = T || f("ESCAPED_CHAR");
        if (i) {
            p += i;
            continue;
        }
        p && (o.push(p), p = "");
        if (f("OPEN")) {
            var g = d(), y = f("NAME") || "", O = f("PATTERN") || "", b = d();
            w("CLOSE"), o.push({
                name: y || (O ? m++ : ""),
                pattern: y && !O ? A(g) : O,
                prefix: g,
                suffix: b,
                modifier: f("MODIFIER") || ""
            });
            continue;
        }
        w("END");
    }
    return o;
}
function H(r, n) {
    var e = [];
    return I(P(r, e, n), e, n);
}
function I(r, n, e) {
    e === void 0 && (e = {});
    var a = e.decode, u = a === void 0 ? function(t) {
        return t;
    } : a;
    return function(t) {
        var c = r.exec(t);
        if (!c) return !1;
        for(var o = c[0], m = c.index, h = Object.create(null), p = function(w) {
            if (c[w] === void 0) return "continue";
            var d = n[w - 1];
            d.modifier === "*" || d.modifier === "+" ? h[d.name] = c[w].split(d.prefix + d.suffix).map(function(M) {
                return u(M, d);
            }) : h[d.name] = u(c[w], d);
        }, f = 1; f < c.length; f++)p(f);
        return {
            path: o,
            index: m,
            params: h
        };
    };
}
function s(r) {
    return r.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function D(r) {
    return r && r.sensitive ? "" : "i";
}
function $(r, n) {
    if (!n) return r;
    for(var e = /\((?:\?<(.*?)>)?(?!\?)/g, a = 0, u = e.exec(r.source); u;)n.push({
        name: u[1] || a++,
        prefix: "",
        suffix: "",
        modifier: "",
        pattern: ""
    }), u = e.exec(r.source);
    return r;
}
function W(r, n, e) {
    var a = r.map(function(u) {
        return P(u, n, e).source;
    });
    return new RegExp("(?:".concat(a.join("|"), ")"), D(e));
}
function L(r, n, e) {
    return U(F(r, e), n, e);
}
function U(r, n, e) {
    e === void 0 && (e = {});
    for(var a = e.strict, u = a === void 0 ? !1 : a, t = e.start, c = t === void 0 ? !0 : t, o = e.end, m = o === void 0 ? !0 : o, h = e.encode, p = h === void 0 ? function(v) {
        return v;
    } : h, f = e.delimiter, w = f === void 0 ? "/#?" : f, d = e.endsWith, M = d === void 0 ? "" : d, A = "[".concat(s(M), "]|$"), T = "[".concat(s(w), "]"), x = c ? "^" : "", C = 0, g = r; C < g.length; C++){
        var i = g[C];
        if (typeof i == "string") x += s(p(i));
        else {
            var R = s(p(i.prefix)), y = s(p(i.suffix));
            if (i.pattern) if (n && n.push(i), R || y) if (i.modifier === "+" || i.modifier === "*") {
                var O = i.modifier === "*" ? "?" : "";
                x += "(?:".concat(R, "((?:").concat(i.pattern, ")(?:").concat(y).concat(R, "(?:").concat(i.pattern, "))*)").concat(y, ")").concat(O);
            } else x += "(?:".concat(R, "(").concat(i.pattern, ")").concat(y, ")").concat(i.modifier);
            else {
                if (i.modifier === "+" || i.modifier === "*") throw new TypeError("Can not repeat \"".concat(i.name, "\" without a prefix and suffix"));
                x += "(".concat(i.pattern, ")").concat(i.modifier);
            }
            else x += "(?:".concat(R).concat(y, ")").concat(i.modifier);
        }
    }
    if (m) u || (x += "".concat(T, "?")), x += e.endsWith ? "(?=".concat(A, ")") : "$";
    else {
        var b = r[r.length - 1], l = typeof b == "string" ? T.indexOf(b[b.length - 1]) > -1 : b === void 0;
        u || (x += "(?:".concat(T, "(?=").concat(A, "))?")), l || (x += "(?=".concat(T, "|").concat(A, ")"));
    }
    return new RegExp(x, D(e));
}
function P(r, n, e) {
    return r instanceof RegExp ? $(r, n) : Array.isArray(r) ? W(r, n, e) : L(r, n, e);
}
//#endregion
//#region src/pathToRegexp.ts
const pathToRegexp = (path)=>{
    try {
        return P(path);
    } catch (e) {
        throw new Error(`Invalid path: ${path}.\nConsult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x\n${e.message}`);
    }
};
/**
*
*/ function match(str, options) {
    try {
        return H(str, options);
    } catch (e) {
        throw new Error(`Invalid path and options: Consult the documentation of path-to-regexp here: https://github.com/pillarjs/path-to-regexp/tree/6.x\n${e.message}`);
    }
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/pathToRegexp-C-7qTA7_.mjs [middleware-edge] (ecmascript) <export t as match>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "match",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$pathToRegexp$2d$C$2d$7qTA7_$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$pathToRegexp$2d$C$2d$7qTA7_$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/pathToRegexp-C-7qTA7_.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$getEnvVariable$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/getEnvVariable.mjs [middleware-edge] (ecmascript)");
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
    return automatedEnvironmentVariables.some((name)=>isTruthyEnvValue((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$getEnvVariable$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getEnvVariable"])(name)));
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript) <export i as isProductionEnvironment>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isProductionEnvironment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript) <export n as isAutomatedEnvironment>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isAutomatedEnvironment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["n"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript) <export r as isDevelopmentEnvironment>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isDevelopmentEnvironment",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["r"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [middleware-edge] (ecmascript)");
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"].some((name)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isTruthy"])(process.env[name]));
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
        const parsedKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["parsePublishableKey"])(options.publishableKey);
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
        if (this.#config.disabled || typeof process !== "undefined" && process.env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isTruthy"])(process.env.CLERK_TELEMETRY_DISABLED)) return false;
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && !!window?.navigator?.webdriver) //TURBOPACK unreachable
        ;
        return true;
    }
    get isDebug() {
        return this.#config.debug || typeof process !== "undefined" && process.env && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isTruthy"])(process.env.CLERK_TELEMETRY_DEBUG);
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [middleware-edge] (ecmascript) <export u as TelemetryCollector>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TelemetryCollector",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["u"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [middleware-edge] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/utils-V2FbmPWk.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)");
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
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["r"])()) console.error(`Clerk: ${message}`);
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/apiUrlFromPublishableKey.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiUrlFromPublishableKey",
    ()=>apiUrlFromPublishableKey
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [middleware-edge] (ecmascript)");
;
;
//#region src/apiUrlFromPublishableKey.ts
/**
* Get the correct API url based on the publishable key.
*
* @param publishableKey - The publishable key to parse.
* @returns One of Clerk's API URLs.
*/ const apiUrlFromPublishableKey = (publishableKey)=>{
    const frontendApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["parsePublishableKey"])(publishableKey)?.frontendApi;
    if (frontendApi?.startsWith("clerk.") && __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((suffix)=>frontendApi?.endsWith(suffix))) return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["PROD_API_URL"];
    if (__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["LOCAL_ENV_SUFFIXES"].some((suffix)=>frontendApi?.endsWith(suffix))) return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["LOCAL_API_URL"];
    if (__TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["STAGING_ENV_SUFFIXES"].some((suffix)=>frontendApi?.endsWith(suffix))) return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["STAGING_API_URL"];
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["PROD_API_URL"];
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/authorization-errors.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/authorization.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/buildAccountsBaseUrl.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildAccountsBaseUrl",
    ()=>buildAccountsBaseUrl
]);
//#region src/buildAccountsBaseUrl.ts
/**
* Builds a full origin string pointing to the Account Portal for the given frontend API.
*/ function buildAccountsBaseUrl(frontendApi) {
    if (!frontendApi) return "";
    return `https://${frontendApi.replace(/clerk\.accountsstage\./, "accountsstage.").replace(/clerk\.accounts\.|clerk\./, "accounts.")}`;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/deprecated.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deprecated",
    ()=>deprecated,
    "deprecatedObjectProperty",
    ()=>deprecatedObjectProperty,
    "deprecatedProperty",
    ()=>deprecatedProperty
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)");
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
    const hideWarning = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["a"])() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["i"])();
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/devBrowser.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEV_BROWSER_HEADER",
    ()=>DEV_BROWSER_HEADER,
    "DEV_BROWSER_KEY",
    ()=>DEV_BROWSER_KEY,
    "extractDevBrowserFromURL",
    ()=>extractDevBrowserFromURL,
    "setDevBrowserInURL",
    ()=>setDevBrowserInURL
]);
//#region src/devBrowser.ts
const DEV_BROWSER_KEY = "__clerk_db_jwt";
const DEV_BROWSER_HEADER = "Clerk-Db-Jwt";
function setDevBrowserInURL(url, devBrowser) {
    const resultURL = new URL(url);
    const existing = resultURL.searchParams.get(DEV_BROWSER_KEY);
    resultURL.searchParams.delete(DEV_BROWSER_KEY);
    const value = existing || devBrowser;
    if (value) resultURL.searchParams.set(DEV_BROWSER_KEY, value);
    return resultURL;
}
/**
* Gets the __clerk_db_jwt dev browser from either the hash or the search
* Side effect:
* Removes __clerk_db_jwt from the URL (hash and searchParams) and updates the browser history
*/ function extractDevBrowserFromURL(url) {
    const devBrowser = readDevBrowserFromSearchParams(url);
    const cleanUrl = removeDevBrowserFromURL(url);
    if (cleanUrl.href !== url.href && typeof globalThis.history !== "undefined") globalThis.history.replaceState(null, "", cleanUrl);
    return devBrowser;
}
const readDevBrowserFromSearchParams = (url)=>{
    return url.searchParams.get("__clerk_db_jwt") || "";
};
const removeDevBrowserFromURL = (url)=>{
    return removeDevBrowserFromURLSearchParams(removeLegacyDevBrowser(url));
};
const removeDevBrowserFromURLSearchParams = (_url)=>{
    const url = new URL(_url);
    url.searchParams.delete(DEV_BROWSER_KEY);
    return url;
};
/**
* Removes the __clerk_db_jwt dev browser from the URL hash, as well as
* the legacy __dev_session from the URL searchParams
* We no longer need to use this value, however, we should remove it from the URL
* Existing v4 apps will write the dev browser to the hash and the search params in order to ensure
* backwards compatibility with older v4 apps.
* The only use case where this is needed now is when a user upgrades to clerk@5 locally
* without changing the component's version on their dashboard.
* In this scenario, the AP@4 -> localhost@5 redirect will still have the value in the hash,
* in which case we need to remove it.
*/ const removeLegacyDevBrowser = (_url)=>{
    const DEV_BROWSER_MARKER_REGEXP = /__clerk_db_jwt\[(.*)\]/;
    const DEV_BROWSER_LEGACY_KEY = "__dev_session";
    const url = new URL(_url);
    url.searchParams.delete(DEV_BROWSER_LEGACY_KEY);
    url.hash = decodeURI(url.hash).replace(DEV_BROWSER_MARKER_REGEXP, "");
    if (url.href.endsWith("#")) url.hash = "";
    return url;
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/error.mjs [middleware-edge] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$clerkRuntimeError$2d$DlesLWqO$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/clerkRuntimeError-DlesLWqO.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [middleware-edge] (ecmascript)");
;
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/getEnvVariable.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicAtob.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicBtoa.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/jwtPayloadParser.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__experimental_JWTPayloadToAuthObjectProperties",
    ()=>__experimental_JWTPayloadToAuthObjectProperties,
    "parsePermissions",
    ()=>parsePermissions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/authorization.mjs [middleware-edge] (ecmascript)");
;
//#region src/jwtPayloadParser.ts
const decimalToBinaryBits = (decimal, minimumLength)=>{
    if (!/^\d+$/.test(decimal)) return;
    let remaining = decimal.replace(/^0+/, "") || "0";
    const bits = [];
    while(remaining !== "0"){
        let quotient = "";
        let remainder = 0;
        for(let i = 0; i < remaining.length; i++){
            const value = remainder * 10 + remaining.charCodeAt(i) - 48;
            const quotientDigit = Math.floor(value / 2);
            if (quotient || quotientDigit !== 0) quotient += quotientDigit;
            remainder = value % 2;
        }
        bits.push(remainder);
        remaining = quotient || "0";
    }
    if (bits.length === 0) bits.push(0);
    while(bits.length < minimumLength)bits.push(0);
    return bits;
};
const parsePermissions = ({ per, fpm })=>{
    if (!per || !fpm) return {
        permissions: [],
        featurePermissionMap: []
    };
    const permissions = per.split(",").map((p)=>p.trim());
    return {
        permissions,
        featurePermissionMap: fpm.split(",").map((permission)=>decimalToBinaryBits(permission.trim(), permissions.length) ?? [])
    };
};
/**
*
*/ function buildOrgPermissions({ features, permissions, featurePermissionMap }) {
    if (!features || !permissions || !featurePermissionMap) return [];
    const orgPermissions = [];
    for(let featureIndex = 0; featureIndex < features.length; featureIndex++){
        const feature = features[featureIndex];
        if (featureIndex >= featurePermissionMap.length) continue;
        const permissionBits = featurePermissionMap[featureIndex];
        if (!permissionBits) continue;
        for(let permIndex = 0; permIndex < permissionBits.length && permIndex < permissions.length; permIndex++)if (permissionBits[permIndex] === 1) orgPermissions.push(`org:${feature}:${permissions[permIndex]}`);
    }
    return orgPermissions;
}
/**
* Resolves the signed-in auth state from JWT claims.
*
* @experimental
*/ const __experimental_JWTPayloadToAuthObjectProperties = (claims)=>{
    let orgId;
    let orgRole;
    let orgSlug;
    let orgPermissions;
    const factorVerificationAge = claims.fva ?? null;
    const sessionStatus = claims.sts ?? null;
    switch(claims.v){
        case 2:
            if (claims.o) {
                orgId = claims.o?.id;
                orgSlug = claims.o?.slg;
                if (claims.o?.rol) orgRole = `org:${claims.o?.rol}`;
                const { org } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$authorization$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["splitByScope"])(claims.fea);
                const { permissions, featurePermissionMap } = parsePermissions({
                    per: claims.o?.per,
                    fpm: claims.o?.fpm
                });
                orgPermissions = buildOrgPermissions({
                    features: org,
                    featurePermissionMap,
                    permissions
                });
            }
            break;
        default:
            orgId = claims.org_id;
            orgRole = claims.org_role;
            orgSlug = claims.org_slug;
            orgPermissions = claims.org_permissions;
            break;
    }
    return {
        sessionClaims: claims,
        sessionId: claims.sid,
        sessionStatus,
        actor: claims.act,
        userId: claims.sub,
        orgId,
        orgRole,
        orgSlug,
        orgPermissions,
        factorVerificationAge
    };
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicAtob$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicAtob.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicBtoa$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/isomorphicBtoa.mjs [middleware-edge] (ecmascript)");
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
    return `${PUBLISHABLE_FRONTEND_API_DEV_REGEX.test(frontendApi) || frontendApi.startsWith("clerk.") && __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((s)=>frontendApi.endsWith(s)) ? PUBLISHABLE_KEY_TEST_PREFIX : PUBLISHABLE_KEY_LIVE_PREFIX}${(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicBtoa$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isomorphicBtoa"])(`${frontendApi}$`).replace(/=+$/, "")}`;
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
        decodedFrontendApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicAtob$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isomorphicAtob"])(key.split("_")[2]);
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
        return isValidDecodedPublishableKey((0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicAtob$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isomorphicAtob"])(encodedPart));
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
                res = __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["DEV_OR_STAGING_SUFFIXES"].some((s)=>hostname.endsWith(s));
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$isomorphicBtoa$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isomorphicBtoa"])(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/gi, "-").replace(/\//gi, "_").substring(0, 8);
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/logger.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/netlifyCacheHandler.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLERK_NETLIFY_CACHE_BUST_PARAM",
    ()=>CLERK_NETLIFY_CACHE_BUST_PARAM,
    "handleNetlifyCacheInDevInstance",
    ()=>handleNetlifyCacheInDevInstance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [middleware-edge] (ecmascript)");
;
//#region src/netlifyCacheHandler.ts
/**
* Cache busting parameter for Netlify to prevent cached responses
* during handshake flows with Clerk development instances.
*
* Note: This query parameter will be removed in the "@clerk/clerk-js" package.
*
* @internal
*/ const CLERK_NETLIFY_CACHE_BUST_PARAM = "__clerk_netlify_cache_bust";
/**
* Returns true if running in a Netlify environment.
* Checks for Netlify-specific environment variables in process.env.
* Safe for browser and non-Node environments.
*/ function isNetlifyRuntime() {
    if (typeof process === "undefined" || !process.env) return false;
    return Boolean(process.env.NETLIFY) || Boolean(process.env.NETLIFY_FUNCTIONS_TOKEN) || typeof process.env.URL === "string" && process.env.URL.endsWith("netlify.app");
}
/**
* Prevents infinite redirects in Netlify's functions by adding a cache bust parameter
* to the original redirect URL. This ensures that Netlify doesn't serve a cached response
* during the handshake flow.
*
* The issue happens only on Clerk development instances running on Netlify. This is
* a workaround until we find a better solution.
*
* See https://answers.netlify.com/t/cache-handling-recommendation-for-authentication-handshake-redirects/143969/1.
*
* @internal
*/ function handleNetlifyCacheInDevInstance({ locationHeader, requestStateHeaders, publishableKey }) {
    const isOnNetlify = isNetlifyRuntime();
    const isDevelopmentInstance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isDevelopmentFromPublishableKey"])(publishableKey);
    if (isOnNetlify && isDevelopmentInstance) {
        if (!locationHeader.includes("__clerk_handshake")) {
            const url = new URL(locationHeader);
            url.searchParams.append(CLERK_NETLIFY_CACHE_BUST_PARAM, Date.now().toString());
            requestStateHeaders.set("Location", url.toString());
        }
    }
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/pathMatcher.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MalformedURLError",
    ()=>MalformedURLError,
    "createPathMatcher",
    ()=>createPathMatcher,
    "isMalformedURLError",
    ()=>isMalformedURLError,
    "normalizePath",
    ()=>normalizePath
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$pathToRegexp$2d$C$2d$7qTA7_$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/pathToRegexp-C-7qTA7_.mjs [middleware-edge] (ecmascript)");
;
//#region src/pathMatcher.ts
var MalformedURLError = class extends Error {
    statusCode = 400;
    constructor(pathname, cause){
        super(`Malformed encoding in URL path: ${pathname}`);
        this.name = "MalformedURLError";
        this.cause = cause;
    }
};
/**
* String-based check for MalformedURLError that works across package bundles
* where `instanceof` would fail due to duplicate class identities.
*/ function isMalformedURLError(e) {
    return e instanceof Error && e.name === "MalformedURLError";
}
const precomputePathRegex = (patterns)=>{
    return patterns.map((pattern)=>pattern instanceof RegExp ? pattern : (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$pathToRegexp$2d$C$2d$7qTA7_$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["n"])(pattern));
};
/**
* Normalizes a URL path for safe route matching.
*
* 1. Decodes percent-encoded unreserved characters using decodeURI (not
*    decodeURIComponent) so path-reserved delimiters like %2F, %3F, %23
*    are preserved — matching how framework routers interpret paths.
* 2. Collapses consecutive slashes (e.g. //api/admin → /api/admin) to
*    prevent bypass via extra slashes.
*
* @throws {MalformedURLError} if the path contains invalid percent-encoding
*/ const normalizePath = (pathname)=>{
    try {
        pathname = decodeURI(pathname);
    } catch (e) {
        throw new MalformedURLError(pathname, e);
    }
    return pathname.replace(/\/\/+/g, "/");
};
/**
* Creates a function that matches paths against a set of patterns.
*
* @param patterns - A string, RegExp, or array of patterns to match against
* @returns A function that takes a pathname and returns true if it matches any of the patterns
*
* @deprecated This function will be removed in the next major version. Pattern-based path matching
* can diverge from how frameworks route requests; use your framework's native routing primitives
* to decide which paths to protect instead.
*/ const createPathMatcher = (patterns)=>{
    const matchers = precomputePathRegex([
        patterns || ""
    ].flat().filter(Boolean));
    return (pathname)=>matchers.some((matcher)=>matcher.test(normalizePath(pathname)));
};
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/pathToRegexp.mjs [middleware-edge] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$pathToRegexp$2d$C$2d$7qTA7_$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/pathToRegexp-C-7qTA7_.mjs [middleware-edge] (ecmascript)");
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/proxy.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/keys.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [middleware-edge] (ecmascript)");
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
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$underscore$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isTruthy"])(environment.CLERK_DISABLE_AUTO_PROXY);
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
    if (hasProxyUrl || hasDomain || !(0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$keys$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isProductionFromPublishableKey"])(publishableKey)) return "";
    if (isAutoProxyDisabledFromEnvironment(environment)) return "";
    if (environment.VERCEL_TARGET_ENV !== "production") return "";
    const vercelProductionHostname = environment.VERCEL_PROJECT_PRODUCTION_URL;
    if (!vercelProductionHostname || !shouldAutoProxy(normalizeHostname(vercelProductionHostname))) return "";
    return AUTO_PROXY_PATH;
}
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/retry.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/telemetry.mjs [middleware-edge] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$telemetry$2d$9C6N5ppw$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/telemetry-9C6N5ppw.mjs [middleware-edge] (ecmascript)");
;
;
}),
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/underscore.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/url.mjs [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/constants.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$instance$2d$DNaRGwPZ$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/instance-DNaRGwPZ.mjs [middleware-edge] (ecmascript)");
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
    if (!version && (0, __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$instance$2d$DNaRGwPZ$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["t"])(frontendApi)) return "canary";
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
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["LEGACY_DEV_INSTANCE_SUFFIXES"].some((legacyDevSuffix)=>{
        return host.startsWith("accounts.") && host.endsWith(legacyDevSuffix);
    });
}
/**
*
*/ function isCurrentDevAccountPortalOrigin(host) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$constants$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["CURRENT_DEV_INSTANCE_SUFFIXES"].some((currentDevSuffix)=>{
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
"[project]/fincopilot-landing/node_modules/@clerk/shared/dist/utils/index.mjs [middleware-edge] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$runtimeEnvironment$2d$CTVGzENl$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/runtimeEnvironment-CTVGzENl.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$handleValueOrFn$2d$CKEDuW4I$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/handleValueOrFn-CKEDuW4I.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$instance$2d$DNaRGwPZ$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/instance-DNaRGwPZ.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$noop$2d$LBsrDrTs$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/noop-LBsrDrTs.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$createDeferredPromise$2d$DNC587Fa$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/createDeferredPromise-DNC587Fa.mjs [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$fincopilot$2d$landing$2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$utils$2d$V2FbmPWk$2e$mjs__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/fincopilot-landing/node_modules/@clerk/shared/dist/_chunks/utils-V2FbmPWk.mjs [middleware-edge] (ecmascript)");
;
;
;
;
;
;
;
}),
]);

//# sourceMappingURL=0ody_%40clerk_shared_dist_1dlmbb9._.js.map