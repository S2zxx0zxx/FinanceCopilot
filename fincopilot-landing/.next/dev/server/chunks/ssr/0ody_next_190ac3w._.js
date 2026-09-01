module.exports = [
"[project]/fincopilot-landing/node_modules/next/dist/client/add-base-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addBasePath", {
    enumerable: true,
    get: function() {
        return addBasePath;
    }
});
const _addpathprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-ssr] (ecmascript)");
const _normalizetrailingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/normalize-trailing-slash.js [app-ssr] (ecmascript)");
const basePath = ("TURBOPACK compile-time value", "") || '';
function addBasePath(path, required) {
    return (0, _normalizetrailingslash.normalizePathTrailingSlash)(("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : (0, _addpathprefix.addPathPrefix)(path, basePath));
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/add-locale.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addLocale", {
    enumerable: true,
    get: function() {
        return addLocale;
    }
});
const _normalizetrailingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/normalize-trailing-slash.js [app-ssr] (ecmascript)");
const addLocale = (path, ...args)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return path;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    useLinkStatus: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * A React component that extends the HTML `<a>` element to provide
 * [prefetching](https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating#2-prefetching)
 * and client-side navigation. This is the primary way to navigate between routes in Next.js.
 *
 * @remarks
 * - Prefetching is only enabled in production.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/link
 */ default: function() {
        return LinkComponent;
    },
    useLinkStatus: function() {
        return useLinkStatus;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _formaturl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-ssr] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/app-router-context.js [app-ssr] (ecmascript)");
const _usemergedref = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/use-merged-ref.js [app-ssr] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/add-base-path.js [app-ssr] (ecmascript)");
const _routerreducertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)");
const _links = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/links.js [app-ssr] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-ssr] (ecmascript)");
const _types = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)");
function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return target && target !== '_self' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || // triggers resource download
    event.nativeEvent && event.nativeEvent.which === 2;
}
function linkClicked(e, href, linkInstanceRef, replace, scroll, onNavigate, transitionTypes, prefetchIntent = 'none') {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function formatStringOrUrl(urlObjOrString) {
    if (typeof urlObjOrString === 'string') {
        return urlObjOrString;
    }
    return (0, _formaturl.formatUrl)(urlObjOrString);
}
function LinkComponent(props) {
    const [linkStatus, setOptimisticLinkStatus] = (0, _react.useOptimistic)(_links.IDLE_LINK_STATUS);
    let children;
    const linkInstanceRef = (0, _react.useRef)(null);
    const { href: hrefProp, as: asProp, children: childrenProp, prefetch: prefetchProp = null, passHref, replace, shallow, scroll, onClick, onMouseEnter: onMouseEnterProp, onTouchStart: onTouchStartProp, legacyBehavior = false, onNavigate, transitionTypes, ref: forwardedRef, unstable_dynamicOnHover, ...restProps } = props;
    children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            children: children
        });
    }
    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const prefetchIntent = prefetchProp === false ? 'none' : prefetchProp === true ? 'full' : 'auto';
    const fetchStrategy = prefetchIntent !== 'none' ? getFetchStrategyFromPrefetchIntent(prefetchIntent) : _types.FetchStrategy.PPR;
    if ("TURBOPACK compile-time truthy", 1) {
        function createPropError(args) {
            return Object.defineProperty(new Error(`Failed prop type: The prop \`${args.key}\` expects a ${args.expected} in \`<Link>\`, but got \`${args.actual}\` instead.` + (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '')), "__NEXT_ERROR_CODE", {
                value: "E319",
                enumerable: false,
                configurable: true
            });
        }
        // TypeScript trick for type-guarding:
        const requiredPropsGuard = {
            href: true
        };
        const requiredProps = Object.keys(requiredPropsGuard);
        requiredProps.forEach((key)=>{
            if (key === 'href') {
                if (props[key] == null || typeof props[key] !== 'string' && typeof props[key] !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: props[key] === null ? 'null' : typeof props[key]
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
        // TypeScript trick for type-guarding:
        const optionalPropsGuard = {
            as: true,
            replace: true,
            scroll: true,
            shallow: true,
            passHref: true,
            prefetch: true,
            unstable_dynamicOnHover: true,
            onClick: true,
            onMouseEnter: true,
            onTouchStart: true,
            legacyBehavior: true,
            onNavigate: true,
            transitionTypes: true
        };
        const optionalProps = Object.keys(optionalPropsGuard);
        optionalProps.forEach((key)=>{
            const valType = typeof props[key];
            if (key === 'as') {
                if (props[key] && valType !== 'string' && valType !== 'object') {
                    throw createPropError({
                        key,
                        expected: '`string` or `object`',
                        actual: valType
                    });
                }
            } else if (key === 'onClick' || key === 'onMouseEnter' || key === 'onTouchStart' || key === 'onNavigate') {
                if (props[key] && valType !== 'function') {
                    throw createPropError({
                        key,
                        expected: '`function`',
                        actual: valType
                    });
                }
            } else if (key === 'replace' || key === 'scroll' || key === 'shallow' || key === 'passHref' || key === 'legacyBehavior' || key === 'unstable_dynamicOnHover') {
                if (props[key] != null && valType !== 'boolean') {
                    throw createPropError({
                        key,
                        expected: '`boolean`',
                        actual: valType
                    });
                }
            } else if (key === 'prefetch') {
                if (props[key] != null && valType !== 'boolean' && props[key] !== 'auto') {
                    throw createPropError({
                        key,
                        expected: '`boolean | "auto"`',
                        actual: valType
                    });
                }
            } else if (key === 'transitionTypes') {
                if (props[key] != null && !Array.isArray(props[key])) {
                    throw createPropError({
                        key,
                        expected: '`string[]`',
                        actual: valType
                    });
                }
            } else {
                // TypeScript trick for type-guarding:
                const _ = key;
            }
        });
    }
    const resolvedHref = asProp || hrefProp;
    const formattedHref = formatStringOrUrl(resolvedHref);
    if ("TURBOPACK compile-time truthy", 1) {
        const { warnOnce } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)");
        if (props.locale) {
            warnOnce('The `locale` prop is not supported in `next/link` while using the `app` router. Read more about app router internalization: https://nextjs.org/docs/app/building-your-application/routing/internationalization');
        }
        if (!asProp) {
            let href;
            if (typeof resolvedHref === 'string') {
                href = resolvedHref;
            } else if (typeof resolvedHref === 'object' && typeof resolvedHref.pathname === 'string') {
                href = resolvedHref.pathname;
            }
            if (href) {
                const hasDynamicSegment = href.split('/').some((segment)=>segment.startsWith('[') && segment.endsWith(']'));
                if (hasDynamicSegment) {
                    throw Object.defineProperty(new Error(`Dynamic href \`${href}\` found in <Link> while using the \`/app\` router, this is not supported. Read more: https://nextjs.org/docs/messages/app-dir-dynamic-href`), "__NEXT_ERROR_CODE", {
                        value: "E267",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
        }
    }
    // This will return the first child, if multiple are provided it will throw an error
    let child;
    if (legacyBehavior) {
        if (children?.$$typeof === Symbol.for('react.lazy')) {
            throw Object.defineProperty(new Error(`\`<Link legacyBehavior>\` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's \`<a>\` tag.`), "__NEXT_ERROR_CODE", {
                value: "E863",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time truthy", 1) {
            if (onClick) {
                console.warn(`"onClick" was passed to <Link> with \`href\` of \`${formattedHref}\` but "legacyBehavior" was set. The legacy behavior requires onClick be set on the child of next/link`);
            }
            if (onMouseEnterProp) {
                console.warn(`"onMouseEnter" was passed to <Link> with \`href\` of \`${formattedHref}\` but "legacyBehavior" was set. The legacy behavior requires onMouseEnter be set on the child of next/link`);
            }
            try {
                child = _react.default.Children.only(children);
            } catch (err) {
                if (!children) {
                    throw Object.defineProperty(new Error(`No children were passed to <Link> with \`href\` of \`${formattedHref}\` but one child is required https://nextjs.org/docs/messages/link-no-children`), "__NEXT_ERROR_CODE", {
                        value: "E320",
                        enumerable: false,
                        configurable: true
                    });
                }
                throw Object.defineProperty(new Error(`Multiple children were passed to <Link> with \`href\` of \`${formattedHref}\` but only one child is supported https://nextjs.org/docs/messages/link-multiple-children` + (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '')), "__NEXT_ERROR_CODE", {
                    value: "E266",
                    enumerable: false,
                    configurable: true
                });
            }
        } else //TURBOPACK unreachable
        ;
    } else {
        if ("TURBOPACK compile-time truthy", 1) {
            if (children?.type === 'a') {
                throw Object.defineProperty(new Error('Invalid <Link> with <a> child. Please remove <a> or use <Link legacyBehavior>.\nLearn more: https://nextjs.org/docs/messages/invalid-new-link-with-extra-anchor'), "__NEXT_ERROR_CODE", {
                    value: "E209",
                    enumerable: false,
                    configurable: true
                });
            }
        }
    }
    const childRef = legacyBehavior ? child && typeof child === 'object' && child.ref : forwardedRef;
    // Capture the Owner Stack during render so dev-only warnings emitted later
    // at navigation time can be associated with the JSX that created
    // this <Link>.
    const ownerStack = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
    // Use a callback ref to attach an IntersectionObserver to the anchor tag on
    // mount. In the future we will also use this to keep track of all the
    // currently mounted <Link> instances, e.g. so we can re-prefetch them after
    // a revalidation or refresh.
    const observeLinkVisibilityOnMount = _react.default.useCallback((element)=>{
        if (router !== null) {
            linkInstanceRef.current = (0, _links.mountLinkInstance)(element, formattedHref, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus, ownerStack);
        }
        return ()=>{
            if (linkInstanceRef.current) {
                (0, _links.unmountLinkForCurrentNavigation)(linkInstanceRef.current);
                linkInstanceRef.current = null;
            }
            (0, _links.unmountPrefetchableInstance)(element);
        };
    }, [
        prefetchEnabled,
        formattedHref,
        router,
        fetchStrategy,
        setOptimisticLinkStatus,
        ownerStack
    ]);
    const mergedRef = (0, _usemergedref.useMergedRef)(observeLinkVisibilityOnMount, childRef);
    const childProps = {
        ref: mergedRef,
        onClick (e) {
            if ("TURBOPACK compile-time truthy", 1) {
                if (!e) {
                    throw Object.defineProperty(new Error(`Component rendered inside next/link has to pass click event to "onClick" prop.`), "__NEXT_ERROR_CODE", {
                        value: "E312",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            if (!legacyBehavior && typeof onClick === 'function') {
                onClick(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router) {
                return;
            }
            if (e.defaultPrevented) {
                return;
            }
            linkClicked(e, formattedHref, linkInstanceRef, replace, scroll, onNavigate, transitionTypes, prefetchIntent);
        },
        onMouseEnter (e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') {
                onMouseEnterProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router) {
                return;
            }
            if ("TURBOPACK compile-time truthy", 1) {
                return;
            }
            //TURBOPACK unreachable
            ;
            const upgradeToDynamicPrefetch = undefined;
        },
        onTouchStart: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : function onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') {
                onTouchStartProp(e);
            }
            if (legacyBehavior && child.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router) {
                return;
            }
            if (!prefetchEnabled) {
                return;
            }
            const upgradeToDynamicPrefetch = unstable_dynamicOnHover === true;
            (0, _links.onNavigationIntent)(e.currentTarget, upgradeToDynamicPrefetch);
        }
    };
    // If the url is absolute, we can bypass the logic to prepend the basePath.
    if ((0, _utils.isAbsoluteUrl)(formattedHref)) {
        childProps.href = formattedHref;
    } else if (!legacyBehavior || passHref || child.type === 'a' && !('href' in child.props)) {
        childProps.href = (0, _addbasepath.addBasePath)(formattedHref);
    }
    let link;
    if (legacyBehavior) {
        if ("TURBOPACK compile-time truthy", 1) {
            const { errorOnce } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils/error-once.js [app-ssr] (ecmascript)");
            errorOnce('`legacyBehavior` is deprecated and will be removed in a future ' + 'release. A codemod is available to upgrade your components:\n\n' + 'npx @next/codemod@latest new-link .\n\n' + 'Learn more: https://nextjs.org/docs/app/building-your-application/upgrading/codemods#remove-a-tags-from-link-components');
        }
        link = /*#__PURE__*/ _react.default.cloneElement(child, childProps);
    } else {
        link = /*#__PURE__*/ (0, _jsxruntime.jsx)("a", {
            ...restProps,
            ...childProps,
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(LinkStatusContext.Provider, {
        value: linkStatus,
        children: link
    });
}
const LinkStatusContext = /*#__PURE__*/ (0, _react.createContext)(_links.IDLE_LINK_STATUS);
const useLinkStatus = ()=>{
    return (0, _react.useContext)(LinkStatusContext);
};
function getFetchStrategyFromPrefetchIntent(prefetchIntent) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return prefetchIntent === 'auto' ? _types.FetchStrategy.PPR : _types.FetchStrategy.Full;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/app-router-headers.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ACTION_HEADER: null,
    FLIGHT_HEADERS: null,
    NEXT_ACTION_NOT_FOUND_HEADER: null,
    NEXT_ACTION_REVALIDATED_HEADER: null,
    NEXT_DID_POSTPONE_HEADER: null,
    NEXT_HMR_REFRESH_HEADER: null,
    NEXT_HTML_REQUEST_ID_HEADER: null,
    NEXT_INSTANT_TEST_COOKIE: null,
    NEXT_IS_PRERENDER_HEADER: null,
    NEXT_REQUEST_ID_HEADER: null,
    NEXT_REWRITTEN_PATH_HEADER: null,
    NEXT_REWRITTEN_QUERY_HEADER: null,
    NEXT_ROUTER_PREFETCH_HEADER: null,
    NEXT_ROUTER_SEGMENT_PREFETCH_HEADER: null,
    NEXT_ROUTER_STALE_TIME_HEADER: null,
    NEXT_ROUTER_STATE_TREE_HEADER: null,
    NEXT_RSC_UNION_QUERY: null,
    NEXT_URL: null,
    RSC_CONTENT_TYPE_HEADER: null,
    RSC_HEADER: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ACTION_HEADER: function() {
        return ACTION_HEADER;
    },
    FLIGHT_HEADERS: function() {
        return FLIGHT_HEADERS;
    },
    NEXT_ACTION_NOT_FOUND_HEADER: function() {
        return NEXT_ACTION_NOT_FOUND_HEADER;
    },
    NEXT_ACTION_REVALIDATED_HEADER: function() {
        return NEXT_ACTION_REVALIDATED_HEADER;
    },
    NEXT_DID_POSTPONE_HEADER: function() {
        return NEXT_DID_POSTPONE_HEADER;
    },
    NEXT_HMR_REFRESH_HEADER: function() {
        return NEXT_HMR_REFRESH_HEADER;
    },
    NEXT_HTML_REQUEST_ID_HEADER: function() {
        return NEXT_HTML_REQUEST_ID_HEADER;
    },
    NEXT_INSTANT_TEST_COOKIE: function() {
        return NEXT_INSTANT_TEST_COOKIE;
    },
    NEXT_IS_PRERENDER_HEADER: function() {
        return NEXT_IS_PRERENDER_HEADER;
    },
    NEXT_REQUEST_ID_HEADER: function() {
        return NEXT_REQUEST_ID_HEADER;
    },
    NEXT_REWRITTEN_PATH_HEADER: function() {
        return NEXT_REWRITTEN_PATH_HEADER;
    },
    NEXT_REWRITTEN_QUERY_HEADER: function() {
        return NEXT_REWRITTEN_QUERY_HEADER;
    },
    NEXT_ROUTER_PREFETCH_HEADER: function() {
        return NEXT_ROUTER_PREFETCH_HEADER;
    },
    NEXT_ROUTER_SEGMENT_PREFETCH_HEADER: function() {
        return NEXT_ROUTER_SEGMENT_PREFETCH_HEADER;
    },
    NEXT_ROUTER_STALE_TIME_HEADER: function() {
        return NEXT_ROUTER_STALE_TIME_HEADER;
    },
    NEXT_ROUTER_STATE_TREE_HEADER: function() {
        return NEXT_ROUTER_STATE_TREE_HEADER;
    },
    NEXT_RSC_UNION_QUERY: function() {
        return NEXT_RSC_UNION_QUERY;
    },
    NEXT_URL: function() {
        return NEXT_URL;
    },
    RSC_CONTENT_TYPE_HEADER: function() {
        return RSC_CONTENT_TYPE_HEADER;
    },
    RSC_HEADER: function() {
        return RSC_HEADER;
    }
});
const RSC_HEADER = 'rsc';
const ACTION_HEADER = 'next-action';
const NEXT_ROUTER_STATE_TREE_HEADER = 'next-router-state-tree';
const NEXT_ROUTER_PREFETCH_HEADER = 'next-router-prefetch';
const NEXT_ROUTER_SEGMENT_PREFETCH_HEADER = 'next-router-segment-prefetch';
const NEXT_HMR_REFRESH_HEADER = 'next-hmr-refresh';
const NEXT_URL = 'next-url';
const RSC_CONTENT_TYPE_HEADER = 'text/x-component';
const NEXT_INSTANT_TEST_COOKIE = 'next-instant-navigation-testing';
const FLIGHT_HEADERS = [
    RSC_HEADER,
    NEXT_ROUTER_STATE_TREE_HEADER,
    NEXT_ROUTER_PREFETCH_HEADER,
    NEXT_HMR_REFRESH_HEADER,
    NEXT_ROUTER_SEGMENT_PREFETCH_HEADER
];
const NEXT_RSC_UNION_QUERY = '_rsc';
const NEXT_ROUTER_STALE_TIME_HEADER = 'x-nextjs-stale-time';
const NEXT_DID_POSTPONE_HEADER = 'x-nextjs-postponed';
const NEXT_REWRITTEN_PATH_HEADER = 'x-nextjs-rewritten-path';
const NEXT_REWRITTEN_QUERY_HEADER = 'x-nextjs-rewritten-query';
const NEXT_IS_PRERENDER_HEADER = 'x-nextjs-prerender';
const NEXT_ACTION_NOT_FOUND_HEADER = 'x-nextjs-action-not-found';
const NEXT_REQUEST_ID_HEADER = 'x-nextjs-request-id';
const NEXT_HTML_REQUEST_ID_HEADER = 'x-nextjs-html-request-id';
const NEXT_ACTION_REVALIDATED_HEADER = 'x-action-revalidated';
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/links.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    IDLE_LINK_STATUS: null,
    PENDING_LINK_STATUS: null,
    getLinkForCurrentNavigation: null,
    mountFormInstance: null,
    mountLinkInstance: null,
    onLinkVisibilityChanged: null,
    onNavigationIntent: null,
    pingVisibleLinks: null,
    setLinkForCurrentNavigation: null,
    unmountLinkForCurrentNavigation: null,
    unmountPrefetchableInstance: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    IDLE_LINK_STATUS: function() {
        return IDLE_LINK_STATUS;
    },
    PENDING_LINK_STATUS: function() {
        return PENDING_LINK_STATUS;
    },
    getLinkForCurrentNavigation: function() {
        return getLinkForCurrentNavigation;
    },
    mountFormInstance: function() {
        return mountFormInstance;
    },
    mountLinkInstance: function() {
        return mountLinkInstance;
    },
    onLinkVisibilityChanged: function() {
        return onLinkVisibilityChanged;
    },
    onNavigationIntent: function() {
        return onNavigationIntent;
    },
    pingVisibleLinks: function() {
        return pingVisibleLinks;
    },
    setLinkForCurrentNavigation: function() {
        return setLinkForCurrentNavigation;
    },
    unmountLinkForCurrentNavigation: function() {
        return unmountLinkForCurrentNavigation;
    },
    unmountPrefetchableInstance: function() {
        return unmountPrefetchableInstance;
    }
});
const _types = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)");
const _cachekey = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-key.js [app-ssr] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/scheduler.js [app-ssr] (ecmascript)");
const _react = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
// Tracks the most recently navigated link instance. When null, indicates
// the current navigation was not initiated by a link click.
let linkForMostRecentNavigation = null;
const PENDING_LINK_STATUS = {
    pending: true
};
const IDLE_LINK_STATUS = {
    pending: false
};
function setLinkForCurrentNavigation(link) {
    (0, _react.startTransition)(()=>{
        linkForMostRecentNavigation?.setOptimisticLinkStatus(IDLE_LINK_STATUS);
        link?.setOptimisticLinkStatus(PENDING_LINK_STATUS);
        linkForMostRecentNavigation = link;
    });
}
function unmountLinkForCurrentNavigation(link) {
    if (linkForMostRecentNavigation === link) {
        linkForMostRecentNavigation = null;
    }
}
function getLinkForCurrentNavigation() {
    return linkForMostRecentNavigation;
}
// Use a WeakMap to associate a Link instance with its DOM element. This is
// used by the IntersectionObserver to track the link's visibility.
const prefetchable = typeof WeakMap === 'function' ? new WeakMap() : new Map();
// A Set of the currently visible links. We re-prefetch visible links after a
// cache invalidation, or when the current URL changes. It's a separate data
// structure from the WeakMap above because only the visible links need to
// be enumerated.
const prefetchableAndVisible = new Set();
// A single IntersectionObserver instance shared by all <Link> components.
const observer = typeof IntersectionObserver === 'function' ? new IntersectionObserver(handleIntersect, {
    rootMargin: '200px'
}) : null;
function observeVisibility(element, instance) {
    const existingInstance = prefetchable.get(element);
    if (existingInstance !== undefined) {
        // This shouldn't happen because each <Link> component should have its own
        // anchor tag instance, but it's defensive coding to avoid a memory leak in
        // case there's a logical error somewhere else.
        unmountPrefetchableInstance(element);
    }
    // Only track prefetchable links that have a valid prefetch URL
    prefetchable.set(element, instance);
    if (observer !== null) {
        observer.observe(element);
    }
}
function coercePrefetchableUrl(href) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        return null;
    }
}
function mountLinkInstance(element, href, router, fetchStrategy, prefetchEnabled, setOptimisticLinkStatus, ownerStack) {
    if (prefetchEnabled) {
        const prefetchURL = coercePrefetchableUrl(href);
        if (prefetchURL !== null) {
            const instance = {
                router,
                fetchStrategy,
                isVisible: false,
                prefetchTask: null,
                prefetchHref: prefetchURL.href,
                setOptimisticLinkStatus,
                ownerStack
            };
            // We only observe the link's visibility if it's prefetchable. For
            // example, this excludes links to external URLs.
            observeVisibility(element, instance);
            return instance;
        }
    }
    // If the link is not prefetchable, we still create an instance so we can
    // track its optimistic state (i.e. useLinkStatus).
    const instance = {
        router,
        fetchStrategy,
        isVisible: false,
        prefetchTask: null,
        prefetchHref: null,
        setOptimisticLinkStatus,
        ownerStack
    };
    return instance;
}
function mountFormInstance(element, href, router, fetchStrategy) {
    const prefetchURL = coercePrefetchableUrl(href);
    if (prefetchURL === null) {
        // This href is not prefetchable, so we don't track it.
        // TODO: We currently observe/unobserve a form every time its href changes.
        // For Links, this isn't a big deal because the href doesn't usually change,
        // but for forms it's extremely common. We should optimize this.
        return;
    }
    const instance = {
        router,
        fetchStrategy,
        isVisible: false,
        prefetchTask: null,
        prefetchHref: prefetchURL.href,
        setOptimisticLinkStatus: null
    };
    observeVisibility(element, instance);
}
function unmountPrefetchableInstance(element) {
    const instance = prefetchable.get(element);
    if (instance !== undefined) {
        prefetchable.delete(element);
        prefetchableAndVisible.delete(instance);
        const prefetchTask = instance.prefetchTask;
        if (prefetchTask !== null) {
            (0, _scheduler.cancelPrefetchTask)(prefetchTask);
        }
    }
    if (observer !== null) {
        observer.unobserve(element);
    }
}
function handleIntersect(entries) {
    // Process the entries in reverse order. The prefetch scheduler assigns the
    // highest priority to the most recently scheduled task, so whichever link we
    // schedule *last* wins. When multiple links enter the viewport at once (e.g.
    // on initial load), the observer reports them in document order, so iterating
    // in reverse means the link nearest the top of the document is scheduled last
    // and therefore prioritized. The topmost link isn't guaranteed to be the most
    // important, but as a default heuristic it's more reasonable than prioritizing
    // whichever link happens to be lowest in the document.
    for(let i = entries.length - 1; i >= 0; i--){
        const entry = entries[i];
        // Some extremely old browsers or polyfills don't reliably support
        // isIntersecting so we check intersectionRatio instead. (Do we care? Not
        // really. But whatever this is fine.)
        const isVisible = entry.intersectionRatio > 0;
        onLinkVisibilityChanged(entry.target, isVisible);
    }
}
function onLinkVisibilityChanged(element, isVisible) {
    if ("TURBOPACK compile-time truthy", 1) {
        // Prefetching on viewport is disabled in development for performance
        // reasons, because it requires compiling the target page.
        // TODO: Investigate re-enabling this.
        return;
    }
    //TURBOPACK unreachable
    ;
    const instance = undefined;
}
function onNavigationIntent(element, unstable_upgradeToDynamicPrefetch) {
    const instance = prefetchable.get(element);
    if (instance === undefined) {
        return;
    }
    // Prefetch the link on hover/touchstart.
    if (instance !== undefined) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        rescheduleLinkPrefetch(instance, _types.PrefetchPriority.Intent);
    }
}
function rescheduleLinkPrefetch(instance, priority) {
    // Ensures that app-router-instance is not compiled in the server bundle
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
}
function pingVisibleLinks(nextUrl, tree) {
    // For each currently visible link, cancel the existing prefetch task (if it
    // exists) and schedule a new one. This is effectively the same as if all the
    // visible links left and then re-entered the viewport.
    //
    // This is called when the Next-Url or the base tree changes, since those
    // may affect the result of a prefetch task. It's also called after a
    // cache invalidation.
    for (const instance of prefetchableAndVisible){
        const task = instance.prefetchTask;
        if (task !== null && !(0, _scheduler.isPrefetchTaskDirty)(task, nextUrl, tree)) {
            continue;
        }
        // Something changed. Cancel the existing prefetch task and schedule a
        // new one.
        if (task !== null) {
            (0, _scheduler.cancelPrefetchTask)(task);
        }
        const cacheKey = (0, _cachekey.createCacheKey)(instance.prefetchHref, nextUrl);
        instance.prefetchTask = (0, _scheduler.schedulePrefetchTask)(cacheKey, tree, instance.fetchStrategy, _types.PrefetchPriority.Default, null, null // navigationLockPrefetch
        );
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/match-segments.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "matchSegment", {
    enumerable: true,
    get: function() {
        return matchSegment;
    }
});
const matchSegment = (existingSegment, segment)=>{
    // segment is either Array or string
    if (typeof existingSegment === 'string') {
        if (typeof segment === 'string') {
            // Common case: segment is just a string
            return existingSegment === segment;
        }
        return false;
    }
    if (typeof segment === 'string') {
        return false;
    }
    return existingSegment[0] === segment[0] && existingSegment[1] === segment[1];
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/compute-changed-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    computeChangedPath: null,
    extractPathFromFlightRouterState: null,
    extractSourcePageFromFlightRouterState: null,
    getSelectedParams: null,
    segmentToSourcePagePathname: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    computeChangedPath: function() {
        return computeChangedPath;
    },
    extractPathFromFlightRouterState: function() {
        return extractPathFromFlightRouterState;
    },
    extractSourcePageFromFlightRouterState: function() {
        return extractSourcePageFromFlightRouterState;
    },
    getSelectedParams: function() {
        return getSelectedParams;
    },
    segmentToSourcePagePathname: function() {
        return segmentToSourcePagePathname;
    }
});
const _interceptionroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _matchsegments = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/match-segments.js [app-ssr] (ecmascript)");
const removeLeadingSlash = (segment)=>{
    return segment[0] === '/' ? segment.slice(1) : segment;
};
const segmentToPathname = (segment)=>{
    if (typeof segment === 'string') {
        // 'children' is not a valid path -- it's technically a parallel route that corresponds with the current segment's page
        // if we don't skip it, then the computed pathname might be something like `/children` which doesn't make sense.
        if (segment === 'children') return '';
        return segment;
    }
    return segment[1];
};
const segmentToSourcePagePathname = (segment)=>{
    if (typeof segment === 'string') {
        if (segment === 'children') return '';
        if (segment.startsWith(_segment.PAGE_SEGMENT_KEY)) return 'page';
        return segment;
    }
    const [paramName, , dynamicParamType] = segment;
    switch(dynamicParamType){
        case 'c':
            return `[...${paramName}]`;
        case 'ci(..)(..)':
            return `(..)(..)[...${paramName}]`;
        case 'ci(.)':
            return `(.)[...${paramName}]`;
        case 'ci(..)':
            return `(..)[...${paramName}]`;
        case 'ci(...)':
            return `(...)[...${paramName}]`;
        case 'oc':
            return `[[...${paramName}]]`;
        case 'd':
            return `[${paramName}]`;
        case 'di(..)(..)':
            return `(..)(..)[${paramName}]`;
        case 'di(.)':
            return `(.)[${paramName}]`;
        case 'di(..)':
            return `(..)[${paramName}]`;
        case 'di(...)':
            return `(...)[${paramName}]`;
        default:
            dynamicParamType;
            return `[${paramName}]`;
    }
};
function normalizeSegments(segments) {
    return segments.reduce((acc, segment)=>{
        segment = removeLeadingSlash(segment);
        if (segment === '' || (0, _segment.isGroupSegment)(segment)) {
            return acc;
        }
        return `${acc}/${segment}`;
    }, '') || '/';
}
function extractPathFromFlightRouterState(flightRouterState) {
    const segment = Array.isArray(flightRouterState[0]) ? flightRouterState[0][1] : flightRouterState[0];
    if (segment === _segment.DEFAULT_SEGMENT_KEY || _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m)=>segment.startsWith(m))) return undefined;
    if (segment.startsWith(_segment.PAGE_SEGMENT_KEY)) return '';
    const segments = [
        segmentToPathname(segment)
    ];
    const parallelRoutes = flightRouterState[1] ?? {};
    const childrenPath = parallelRoutes.children ? extractPathFromFlightRouterState(parallelRoutes.children) : undefined;
    if (childrenPath !== undefined) {
        segments.push(childrenPath);
    } else {
        for (const [key, value] of Object.entries(parallelRoutes)){
            if (key === 'children') continue;
            const childPath = extractPathFromFlightRouterState(value);
            if (childPath !== undefined) {
                segments.push(childPath);
            }
        }
    }
    return normalizeSegments(segments);
}
function extractSourcePageSegmentsFromFlightRouterState(flightRouterState) {
    const segment = segmentToSourcePagePathname(flightRouterState[0]);
    if (segment === _segment.DEFAULT_SEGMENT_KEY) {
        return undefined;
    }
    if (segment === 'page') {
        return [
            segment
        ];
    }
    const parallelRoutes = flightRouterState[1] ?? {};
    const childrenPath = parallelRoutes.children ? extractSourcePageSegmentsFromFlightRouterState(parallelRoutes.children) : undefined;
    if (childrenPath !== undefined) {
        return segment === '' ? childrenPath : [
            removeLeadingSlash(segment),
            ...childrenPath
        ];
    }
    for (const [key, value] of Object.entries(parallelRoutes)){
        if (key === 'children') continue;
        const childPath = extractSourcePageSegmentsFromFlightRouterState(value);
        if (childPath !== undefined) {
            return segment === '' ? childPath : [
                removeLeadingSlash(segment),
                ...childPath
            ];
        }
    }
    return undefined;
}
function extractSourcePageFromFlightRouterState(flightRouterState) {
    const sourcePageSegments = extractSourcePageSegmentsFromFlightRouterState(flightRouterState);
    return sourcePageSegments ? `/${sourcePageSegments.join('/')}` : undefined;
}
function computeChangedPathImpl(treeA, treeB) {
    const [segmentA, parallelRoutesA] = treeA;
    const [segmentB, parallelRoutesB] = treeB;
    const normalizedSegmentA = segmentToPathname(segmentA);
    const normalizedSegmentB = segmentToPathname(segmentB);
    if (_interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m)=>normalizedSegmentA.startsWith(m) || normalizedSegmentB.startsWith(m))) {
        return '';
    }
    if (!(0, _matchsegments.matchSegment)(segmentA, segmentB)) {
        // once we find where the tree changed, we compute the rest of the path by traversing the tree
        return extractPathFromFlightRouterState(treeB) ?? '';
    }
    for(const parallelRouterKey in parallelRoutesA){
        if (parallelRoutesB[parallelRouterKey]) {
            const changedPath = computeChangedPathImpl(parallelRoutesA[parallelRouterKey], parallelRoutesB[parallelRouterKey]);
            if (changedPath !== null) {
                return `${segmentToPathname(segmentB)}/${changedPath}`;
            }
        }
    }
    return null;
}
function computeChangedPath(treeA, treeB) {
    const changedPath = computeChangedPathImpl(treeA, treeB);
    if (changedPath == null || changedPath === '/') {
        return changedPath;
    }
    // lightweight normalization to remove route groups
    return normalizeSegments(changedPath.split('/'));
}
function getSelectedParams(currentTree, params = {}) {
    const parallelRoutes = currentTree[1];
    for (const parallelRoute of Object.values(parallelRoutes)){
        const segment = parallelRoute[0];
        const isDynamicParameter = Array.isArray(segment);
        const segmentValue = isDynamicParameter ? segment[1] : segment;
        if (!segmentValue || segmentValue.startsWith(_segment.PAGE_SEGMENT_KEY)) continue;
        // Ensure catchAll and optional catchall are turned into an array
        const isCatchAll = isDynamicParameter && (segment[2] === 'c' || segment[2] === 'oc');
        if (isCatchAll) {
            params[segment[0]] = segment[1].split('/');
        } else if (isDynamicParameter) {
            params[segment[0]] = segment[1];
        }
        params = getSelectedParams(parallelRoute, params);
    }
    return params;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/create-href-from-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createHrefFromUrl", {
    enumerable: true,
    get: function() {
        return createHrefFromUrl;
    }
});
function createHrefFromUrl(url, includeHash = true) {
    return url.pathname + url.search + (includeHash ? url.hash : '');
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/fetch-server-response.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createFetch: null,
    createFromNextReadableStream: null,
    decodeBufferedStage: null,
    decodeStageUntilBoundary: null,
    fetchServerResponse: null,
    processFetch: null,
    resolveShellStageData: null,
    resolveStaticStageData: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createFetch: function() {
        return createFetch;
    },
    createFromNextReadableStream: function() {
        return createFromNextReadableStream;
    },
    decodeBufferedStage: function() {
        return decodeBufferedStage;
    },
    decodeStageUntilBoundary: function() {
        return decodeStageUntilBoundary;
    },
    fetchServerResponse: function() {
        return fetchServerResponse;
    },
    processFetch: function() {
        return processFetch;
    },
    resolveShellStageData: function() {
        return resolveShellStageData;
    },
    resolveStaticStageData: function() {
        return resolveStaticStageData;
    }
});
const _client = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-server-dom-turbopack-client.js [app-ssr] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _fetch = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/fetch.js [app-ssr] (ecmascript)");
const _approuterheaders = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/app-router-headers.js [app-ssr] (ecmascript)");
const _appcallserver = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/app-call-server.js [app-ssr] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/app-find-source-map-url.js [app-ssr] (ecmascript)");
const _flightdatahelpers = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/flight-data-helpers.js [app-ssr] (ecmascript)");
const _setcachebustingsearchparam = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/set-cache-busting-search-param.js [app-ssr] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/route-params.js [app-ssr] (ecmascript)");
const _deploymentid = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/deployment-id.js [app-ssr] (ecmascript)");
const _navigationbuildid = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/navigation-build-id.js [app-ssr] (ecmascript)");
const _constants = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/constants.js [app-ssr] (ecmascript)");
const _cache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache.js [app-ssr] (ecmascript)");
const _bfcache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/bfcache.js [app-ssr] (ecmascript)");
const createFromReadableStream = _client.createFromReadableStream;
const createFromFetch = _client.createFromFetch;
let createDebugChannel;
if ("TURBOPACK compile-time truthy", 1) {
    createDebugChannel = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/dev/debug-channel.js [app-ssr] (ecmascript)").createDebugChannel;
}
function doMpaNavigation(url) {
    return (0, _routeparams.urlToUrlWithoutFlightMarker)(new URL(url, location.origin)).toString();
}
let isPageUnloading = false;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
async function fetchServerResponse(url, options) {
    const { flightRouterState, nextUrl } = options;
    const headers = {
        // Enable flight response
        [_approuterheaders.RSC_HEADER]: '1',
        // Provide the current router state
        [_approuterheaders.NEXT_ROUTER_STATE_TREE_HEADER]: (0, _flightdatahelpers.prepareFlightRouterStateForRequest)(flightRouterState, options.isHmrRefresh)
    };
    if (("TURBOPACK compile-time value", "development") === 'development' && options.isHmrRefresh) {
        headers[_approuterheaders.NEXT_HMR_REFRESH_HEADER] = '1';
    }
    if (nextUrl) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    // In static export mode, we need to modify the URL to request the .txt file,
    // but we should preserve the original URL for the canonical URL and error handling.
    const originalUrl = url;
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Typically, during a navigation, we decode the response using Flight's
        // `createFromFetch` API, which accepts a `fetch` promise.
        // TODO: Remove this check once the old PPR flag is removed
        const isLegacyPPR = ("TURBOPACK compile-time value", false) && !("TURBOPACK compile-time value", false);
        const shouldImmediatelyDecode = !isLegacyPPR;
        const res = await createFetch(url, headers, 'auto', shouldImmediatelyDecode, options.signal);
        // If the fetch succeeds while we're in the offline state, notify the
        // offline module so it can short-circuit the polling loop.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const responseUrl = (0, _routeparams.urlToUrlWithoutFlightMarker)(new URL(res.url));
        const canonicalUrl = res.redirected ? responseUrl : originalUrl;
        const contentType = res.headers.get('content-type') || '';
        const interception = !!res.headers.get('vary')?.includes(_approuterheaders.NEXT_URL);
        const postponed = !!res.headers.get(_approuterheaders.NEXT_DID_POSTPONE_HEADER);
        let isFlightResponse = contentType.startsWith(_approuterheaders.RSC_CONTENT_TYPE_HEADER);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // If fetch returns something different than flight response handle it like a mpa navigation
        // If the fetch was not 200, we also handle it like a mpa navigation
        if (!isFlightResponse || !res.ok || !res.body) {
            // in case the original URL came with a hash, preserve it before redirecting to the new URL
            if (url.hash) {
                responseUrl.hash = url.hash;
            }
            return doMpaNavigation(responseUrl.toString());
        }
        // We may navigate to a page that requires a different Webpack runtime.
        // In prod, every page will have the same Webpack runtime.
        // In dev, the Webpack runtime is minimal for each page.
        // We need to ensure the Webpack runtime is updated before executing client-side JS of the new page.
        // TODO: This needs to happen in the Flight Client.
        // Or Webpack needs to include the runtime update in the Flight response as
        // a blocking script.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        let flightResponsePromise = res.flightResponsePromise;
        if (flightResponsePromise === null) {
            // Typically, `createFetch` would have already started decoding the
            // Flight response. If it hasn't, though, we need to decode it now.
            // TODO: This should only be reachable if legacy PPR is enabled (i.e. PPR
            // without Cache Components). Remove this branch once legacy PPR
            // is deleted.
            flightResponsePromise = createFromNextReadableStream(res.body, headers, {
                allowPartialStream: postponed
            });
        }
        const [flightResponse, cacheData] = await Promise.all([
            flightResponsePromise,
            res.cacheData
        ]);
        if ((res.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? flightResponse.b) !== (0, _navigationbuildid.getNavigationBuildId)()) {
            // The server build does not match the client build.
            return doMpaNavigation(res.url);
        }
        const normalizedFlightData = (0, _flightdatahelpers.normalizeFlightData)(flightResponse.f);
        if (typeof normalizedFlightData === 'string') {
            return doMpaNavigation(normalizedFlightData);
        }
        const staticStageData = cacheData !== null ? await resolveStaticStageData(cacheData, flightResponse, headers) : null;
        return {
            flightData: normalizedFlightData,
            canonicalUrl: canonicalUrl,
            // TODO: We should be able to read this from the rewrite header, not the
            // Flight response. Theoretically they should always agree, but there are
            // currently some cases where it's incorrect for interception routes. We
            // can always trust the value in the response body. However, per-segment
            // prefetch responses don't embed the value in the body; they rely on the
            // header alone. So we need to investigate why the header is sometimes
            // wrong for interception routes.
            renderedSearch: flightResponse.q,
            couldBeIntercepted: interception,
            supportsPerSegmentPrefetching: flightResponse.S,
            postponed,
            // The dynamicStaleTime is only present in the response body when
            // a page exports unstable_dynamicStaleTime and this is a dynamic render.
            // When absent (UnknownDynamicStaleTime), the client falls back to the
            // global DYNAMIC_STALETIME_MS. The value is in seconds.
            dynamicStaleTime: flightResponse.d ?? _bfcache.UnknownDynamicStaleTime,
            staticStageData,
            runtimePrefetchStream: flightResponse.p ?? null,
            responseHeaders: res.headers,
            debugInfo: flightResponsePromise._debugInfo ?? null,
            revealAfter: flightResponse._revealAfter ?? null
        };
    } catch (err) {
        if (options.signal?.aborted) {
            // A newer HMR refresh superseded this one and aborted its request.
            // Rethrow so the caller treats it as canceled, rather than logging a
            // failure or falling back to an MPA navigation.
            throw err;
        }
        // If the fetch rejected due to a network error, wait for connectivity
        // to be restored and then retry. checkOfflineError returns true for
        // network errors (and starts the polling loop); returns false for
        // intentional aborts/timeouts, which fall through to the MPA fallback.
        //
        // Note: when the user navigates multiple times while offline, each
        // navigation queues a separate retry here. Once connectivity returns,
        // all pending retries resume simultaneously. This is mitigated in PR 3
        // by reusing back-forward cache entries during offline navigation, which
        // avoids issuing new fetches in the first place.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (!isPageUnloading) {
            console.error(`Failed to fetch RSC payload for ${originalUrl}. Falling back to browser navigation.`, err);
        }
        // If fetch fails handle it like a mpa navigation
        // TODO-APP: Add a test for the case where a CORS request fails, e.g. external url redirect coming from the response.
        // See https://github.com/vercel/next.js/issues/43605#issuecomment-1451617521 for a reproduction.
        return originalUrl.toString();
    }
}
async function processFetch(response) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        response,
        cacheData: null
    };
}
async function resolveStaticStageData(cacheData, flightResponse, headers) {
    const { isResponsePartial, staticBodyClone } = cacheData;
    if (staticBodyClone) {
        if (!isResponsePartial) {
            // Fully static — cache the entire decoded response as-is.
            staticBodyClone.cancel();
            return {
                response: flightResponse,
                isResponsePartial: false
            };
        }
        if (flightResponse.l !== undefined) {
            // Partially static — truncate the body clone at the byte boundary and
            // decode it.
            const staticStageByteLength = await flightResponse.l;
            const response = await decodeStageUntilBoundary(staticBodyClone, staticStageByteLength, headers);
            return {
                response,
                isResponsePartial: true
            };
        }
        // No caching — cancel the unused clone.
        staticBodyClone.cancel();
    }
    return null;
}
async function resolveShellStageData(cacheData, flightResponse, headers) {
    const { shellBodyClone } = cacheData;
    if (!shellBodyClone) {
        return null;
    }
    if (flightResponse.a === undefined) {
        shellBodyClone.cancel();
        return null;
    }
    const shellByteLength = await flightResponse.a;
    if (shellByteLength === null) {
        // Shell == main response — caller reuses the existing flightResponse.
        shellBodyClone.cancel();
        return null;
    }
    return decodeStageUntilBoundary(shellBodyClone, shellByteLength, headers);
}
async function decodeStageUntilBoundary(responseBodyClone, byteLength, headers) {
    const { buffer } = await (0, _cache.createNonTaskyPrefetchResponseStream)(responseBodyClone, byteLength);
    return decodeBufferedStage(buffer, headers);
}
function decodeBufferedStage(buffer, headers) {
    const stream = new ReadableStream({
        start (controller) {
            controller.enqueue(buffer);
            controller.close();
        }
    });
    return createFromNextReadableStream(stream, headers, {
        allowPartialStream: true
    });
}
// When an HMR refresh can be superseded, we decode its Flight response through
// a wrapper stream we can close on abort. Closing the stream (rather than
// letting the aborted fetch error it) makes React's Flight client mark
// unresolved rows as halted: they suspend during render instead of rejecting,
// so a superseded request never surfaces an error on an already-committed tree.
// Because the stream is closed, there's also no unclosed-stream GC-root leak
// (see #89610). The wrapper is created synchronously here so that the decode
// starts at the same point `createFromNextFetch` would, preserving the
// server-latency debug timing.
function createHaltingFlightResponse(fetchPromise, headers, signal) {
    let closed = false;
    let reader = null;
    const wrapper = new ReadableStream({
        start (controller) {
            const onAbort = ()=>{
                closed = true;
                try {
                    controller.close();
                } catch  {
                // The controller may already be closed; nothing to do.
                }
                if (reader !== null) {
                    reader.cancel().catch(()=>{});
                }
            };
            if (signal.aborted) {
                onAbort();
            } else {
                signal.addEventListener('abort', onAbort, {
                    once: true
                });
            }
        },
        async pull (controller) {
            if (closed) {
                return;
            }
            if (reader === null) {
                let response;
                try {
                    response = await fetchPromise;
                } catch (err) {
                    // We don't inspect `err`. If the request was superseded, `onAbort`
                    // already ran synchronously (abort listeners fire during
                    // `signal.abort()`, before this rejection microtask), so `closed` is
                    // true and the controller is already closed — erroring it would
                    // throw, and a superseded request's failure is moot regardless of its
                    // cause. Only a genuine, non-superseded failure reaches here with
                    // `closed` still false; that is the case we surface.
                    if (!closed) {
                        controller.error(err);
                    }
                    return;
                }
                if (closed) {
                    // Aborted while awaiting the response. The `fetch` abort tears down
                    // an in-flight request, but if it had already completed we still hold
                    // an unread body; release it so it isn't left dangling.
                    response.body?.cancel().catch(()=>{});
                    return;
                }
                const body = response.body;
                if (body === null) {
                    controller.close();
                    return;
                }
                reader = body.getReader();
            }
            try {
                const { done, value } = await reader.read();
                if (closed) {
                    return;
                }
                if (done) {
                    controller.close();
                } else {
                    controller.enqueue(value);
                }
            } catch (err) {
                // Same as the fetch catch above: once superseded (`closed`) the
                // controller is already closed and the outcome is moot, so we swallow
                // the rejection unconditionally; only a real, non-superseded read
                // failure (`closed` still false) is surfaced.
                if (!closed) {
                    controller.error(err);
                }
            }
        }
    });
    // React attaches `_debugInfo` to the returned promise at runtime.
    return createFromNextReadableStream(wrapper, headers, {
        allowPartialStream: true
    });
}
// Selects the Flight decode strategy: a halting wrapper for cancellable HMR
// refreshes, otherwise the standard fetch-based decode. Gated to the dev server
// (where HMR runs) so the wrapper is eliminated from production and
// `--debug-prerender` bundles regardless of the flag.
function decodeFlightResponse(fetchPromise, headers, signal) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return createFromNextFetch(fetchPromise, headers);
}
async function createFetch(url, headers, fetchPriority, shouldImmediatelyDecode, signal) {
    // TODO: In output: "export" mode, the headers do nothing. Omit them (and the
    // cache busting search param) from the request so they're
    // maximally cacheable.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const deploymentId = (0, _deploymentid.getDeploymentId)();
    if (deploymentId) {
        headers['x-deployment-id'] = deploymentId;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (self.__next_r) {
            headers[_approuterheaders.NEXT_HTML_REQUEST_ID_HEADER] = self.__next_r;
        }
        // Create a new request ID for the server action request. The server uses
        // this to tag debug information sent via WebSocket to the client, which
        // then routes those chunks to the debug channel associated with this ID.
        headers[_approuterheaders.NEXT_REQUEST_ID_HEADER] = crypto.getRandomValues(new Uint32Array(1))[0].toString(16);
    }
    const fetchOptions = {
        // Backwards compat for older browsers. `same-origin` is the default in modern browsers.
        credentials: 'same-origin',
        headers,
        priority: fetchPriority || undefined,
        signal
    };
    // `fetchUrl` is slightly different from `url` because we add a cache-busting
    // search param to it. This should not leak outside of this function, so we
    // track them separately.
    let fetchUrl = new URL(url);
    await (0, _setcachebustingsearchparam.setCacheBustingSearchParam)(fetchUrl, headers);
    let processed = (0, _fetch.fetch)(fetchUrl, fetchOptions).then(processFetch);
    let fetchPromise = processed.then(({ response })=>response);
    // Immediately pass the fetch promise to the Flight client so that the debug
    // info includes the latency from the client to the server. The internal timer
    // in React starts as soon as `createFromFetch` is called.
    //
    // The only case where we don't do this is during a prefetch, because a
    // top-level prefetch response never blocks a navigation; if it hasn't already
    // been written into the cache by the time the navigation happens, the router
    // will go straight to a dynamic request.
    let flightResponsePromise = shouldImmediatelyDecode ? decodeFlightResponse(fetchPromise, headers, signal) : null;
    let browserResponse = await fetchPromise;
    // If the server responds with a redirect (e.g. 307), and the redirected
    // location does not contain the cache busting search param set in the
    // original request, the response is likely invalid — when following the
    // redirect, the browser forwards the request headers, but since the cache
    // busting search param is missing, the server will reject the request due to
    // a mismatch.
    //
    // Ideally, we would be able to intercept the redirect response and perform it
    // manually, instead of letting the browser automatically follow it, but this
    // is not allowed by the fetch API.
    //
    // So instead, we must "replay" the redirect by fetching the new location
    // again, but this time we'll append the cache busting search param to prevent
    // a mismatch.
    //
    // TODO: We can optimize Next.js's built-in middleware APIs by returning a
    // custom status code, to prevent the browser from automatically following it.
    //
    // This does not affect Server Action-based redirects; those are encoded
    // differently, as part of the Flight body. It only affects redirects that
    // occur in a middleware or a third-party proxy.
    let redirected = browserResponse.redirected;
    if ("TURBOPACK compile-time truthy", 1) {
        // This is to prevent a redirect loop. Same limit used by Chrome.
        const MAX_REDIRECTS = 20;
        for(let n = 0; n < MAX_REDIRECTS; n++){
            if (!browserResponse.redirected) {
                break;
            }
            const responseUrl = new URL(browserResponse.url, fetchUrl);
            if (responseUrl.origin !== fetchUrl.origin) {
                break;
            }
            if (responseUrl.searchParams.get(_approuterheaders.NEXT_RSC_UNION_QUERY) === fetchUrl.searchParams.get(_approuterheaders.NEXT_RSC_UNION_QUERY)) {
                break;
            }
            // The RSC request was redirected. Assume the response is invalid.
            //
            // Append the cache busting search param to the redirected URL and
            // fetch again.
            // TODO: We should abort the previous request.
            fetchUrl = new URL(responseUrl);
            await (0, _setcachebustingsearchparam.setCacheBustingSearchParam)(fetchUrl, headers);
            processed = (0, _fetch.fetch)(fetchUrl, fetchOptions).then(processFetch);
            fetchPromise = processed.then(({ response })=>response);
            flightResponsePromise = shouldImmediatelyDecode ? decodeFlightResponse(fetchPromise, headers, signal) : null;
            browserResponse = await fetchPromise;
            // We just performed a manual redirect, so this is now true.
            redirected = true;
        }
    }
    // Remove the cache busting search param from the response URL, to prevent it
    // from leaking outside of this function.
    const responseUrl = new URL(browserResponse.url, fetchUrl);
    responseUrl.searchParams.delete(_approuterheaders.NEXT_RSC_UNION_QUERY);
    const rscResponse = {
        url: responseUrl.href,
        // This is true if any redirects occurred, either automatically by the
        // browser, or manually by us. So it's different from
        // `browserResponse.redirected`, which only tells us whether the browser
        // followed a redirect, and only for the last response in the chain.
        redirected,
        // These can be copied from the last browser response we received. We
        // intentionally only expose the subset of fields that are actually used
        // elsewhere in the codebase.
        ok: browserResponse.ok,
        headers: browserResponse.headers,
        body: browserResponse.body,
        status: browserResponse.status,
        // This is the exact promise returned by `createFromFetch`. It contains
        // debug information that we need to transfer to any derived promises that
        // are later rendered by React.
        flightResponsePromise: flightResponsePromise,
        cacheData: processed.then(({ cacheData })=>cacheData)
    };
    return rscResponse;
}
function createFromNextReadableStream(flightStream, requestHeaders, options) {
    return createFromReadableStream(flightStream, {
        callServer: _appcallserver.callServer,
        findSourceMapURL: _appfindsourcemapurl.findSourceMapURL,
        debugChannel: createDebugChannel && createDebugChannel(requestHeaders),
        unstable_allowPartialStream: options?.allowPartialStream
    });
}
function createFromNextFetch(promiseForResponse, requestHeaders) {
    return createFromFetch(promiseForResponse, {
        callServer: _appcallserver.callServer,
        findSourceMapURL: _appfindsourcemapurl.findSourceMapURL,
        debugChannel: createDebugChannel && createDebugChannel(requestHeaders)
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/is-navigating-to-new-root-layout.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isNavigatingToNewRootLayout", {
    enumerable: true,
    get: function() {
        return isNavigatingToNewRootLayout;
    }
});
const _approutertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)");
function isNavigatingToNewRootLayout(currentTree, nextTree) {
    // Decides whether navigating from currentTree to nextTree crosses into a
    // different root layout, which requires a full-page (MPA-style) navigation.
    //
    // The "root layout" is the highest-level layout in the tree. The segments at
    // or above it form the "root layout prefix", which the server marks with the
    // IsRootLayoutOrAbove hint. Two routes share a root layout iff their root
    // layout prefixes are structurally identical — same segments (ignoring
    // dynamic param *values*) for the same depth. So we walk the prefix in
    // lockstep and report a change as soon as the prefixes diverge.
    const currentInPrefix = ((currentTree[4] ?? 0) & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0;
    const nextInPrefix = (nextTree.prefetchHints & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0;
    // Both trees have descended past the root layout with everything above
    // matching — same root layout.
    if (!currentInPrefix && !nextInPrefix) {
        return false;
    }
    // One tree's root layout prefix is deeper than the other's, so the root
    // layout boundary moved — it must have changed.
    // E.g. /[lang]/layout.js -> /[lang]/[region]/layout.js
    if (currentInPrefix !== nextInPrefix) {
        return true;
    }
    // Both segments are still inside the root layout prefix. They must match.
    // Compare dynamic param name and type but ignore the value: different values
    // (e.g. /[name] for slug1 vs slug2) still resolve to the same /[name]/layout.
    // E.g. /same/(group1)/layout.js -> /same/(group2)/layout.js: (group1) changed
    // to (group2) inside the prefix, so the root layout changed.
    const currentTreeSegment = currentTree[0];
    const nextTreeSegment = nextTree.segment;
    if (Array.isArray(currentTreeSegment) && Array.isArray(nextTreeSegment)) {
        if (currentTreeSegment[0] !== nextTreeSegment[0] || currentTreeSegment[2] !== nextTreeSegment[2]) {
            return true;
        }
    } else if (currentTreeSegment !== nextTreeSegment) {
        return true;
    }
    // Keep walking the prefix. (Above the root layout there is only a `children`
    // slot, but we traverse all slots defensively.)
    const slots = nextTree.slots;
    const currentTreeChildren = currentTree[1];
    if (slots !== null) {
        for (const [slot, nextTreeChild] of slots){
            const currentTreeChild = currentTreeChildren[slot];
            if (currentTreeChild === undefined || isNavigatingToNewRootLayout(currentTreeChild, nextTreeChild)) {
                return true;
            }
        }
    }
    return false;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/ppr-navigations.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FreshnessPolicy: null,
    beginLockedNavigation: null,
    createInitialCacheNodeForHydration: null,
    getCurrentNavigationLock: null,
    isDeferredRsc: null,
    resetNavigationLockToPending: null,
    spawnDynamicRequests: null,
    startPPRNavigation: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    FreshnessPolicy: function() {
        return FreshnessPolicy;
    },
    beginLockedNavigation: function() {
        return beginLockedNavigation;
    },
    createInitialCacheNodeForHydration: function() {
        return createInitialCacheNodeForHydration;
    },
    getCurrentNavigationLock: function() {
        return getCurrentNavigationLock;
    },
    isDeferredRsc: function() {
        return isDeferredRsc;
    },
    resetNavigationLockToPending: function() {
        return resetNavigationLockToPending;
    },
    spawnDynamicRequests: function() {
        return spawnDynamicRequests;
    },
    startPPRNavigation: function() {
        return startPPRNavigation;
    }
});
const _approutertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _matchsegments = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/match-segments.js [app-ssr] (ecmascript)");
const _createhreffromurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/create-href-from-url.js [app-ssr] (ecmascript)");
const _fetchserverresponse = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/fetch-server-response.js [app-ssr] (ecmascript)");
const _useactionqueue = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/use-action-queue.js [app-ssr] (ecmascript)");
const _routerreducertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)");
const _isnavigatingtonewrootlayout = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/is-navigating-to-new-root-layout.js [app-ssr] (ecmascript)");
const _committedstate = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/reducers/committed-state.js [app-ssr] (ecmascript)");
const _navigation = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation.js [app-ssr] (ecmascript)");
const _cache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache.js [app-ssr] (ecmascript)");
const _types = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)");
const _optimisticroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/optimistic-routes.js [app-ssr] (ecmascript)");
const _constants = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/constants.js [app-ssr] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/route-params.js [app-ssr] (ecmascript)");
const _varypath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/vary-path.js [app-ssr] (ecmascript)");
const _bfcache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/bfcache.js [app-ssr] (ecmascript)");
var FreshnessPolicy = /*#__PURE__*/ function(FreshnessPolicy) {
    FreshnessPolicy[FreshnessPolicy["Default"] = 0] = "Default";
    FreshnessPolicy[FreshnessPolicy["Hydration"] = 1] = "Hydration";
    FreshnessPolicy[FreshnessPolicy["HistoryTraversal"] = 2] = "HistoryTraversal";
    FreshnessPolicy[FreshnessPolicy["RefreshAll"] = 3] = "RefreshAll";
    FreshnessPolicy[FreshnessPolicy["HMRRefresh"] = 4] = "HMRRefresh";
    FreshnessPolicy[FreshnessPolicy["Gesture"] = 5] = "Gesture";
    return FreshnessPolicy;
}({});
const noop = ()=>{};
function createInitialCacheNodeForHydration(navigatedAt, initialTree, seedData, seedHead, seedDynamicStaleAt) {
    // Create the initial cache node tree, using the data embedded into the
    // HTML document.
    const accumulation = {
        separateRefreshUrls: null,
        scrollRef: null
    };
    const restrictToShell = false;
    const task = createCacheNodeOnNavigation(navigatedAt, initialTree, null, 1, seedData, seedHead, seedDynamicStaleAt, false, accumulation, _cache.segmentCacheMap, restrictToShell);
    return task;
}
function startPPRNavigation(navigatedAt, oldUrl, oldRenderedSearch, oldCacheNode, oldRouterState, newRouteTree, newMetadataVaryPath, freshness, seedData, seedHead, seedDynamicStaleAt, isSamePageNavigation, accumulation, // driving-task map, or the shared map. See `segmentCacheMap` in cache.ts.
map, // entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    const parentNeedsDynamicRequest = false;
    const parentRefreshState = null;
    const oldRootRefreshState = {
        canonicalUrl: (0, _createhreffromurl.createHrefFromUrl)(oldUrl),
        renderedSearch: oldRenderedSearch
    };
    return updateCacheNodeOnNavigation(navigatedAt, oldUrl, oldCacheNode !== null ? oldCacheNode : undefined, oldRouterState, newRouteTree, newMetadataVaryPath, freshness, seedData, seedHead, seedDynamicStaleAt, isSamePageNavigation, parentNeedsDynamicRequest, oldRootRefreshState, parentRefreshState, accumulation, map, restrictToShell);
}
function updateCacheNodeOnNavigation(navigatedAt, oldUrl, oldCacheNode, oldRouterState, newRouteTree, newMetadataVaryPath, freshness, seedData, seedHead, seedDynamicStaleAt, isSamePageNavigation, parentNeedsDynamicRequest, oldRootRefreshState, parentRefreshState, accumulation, map, // entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    // Check if this segment matches the one in the previous route. A
    // search-param-only difference at a page segment falls through to the
    // matched branch — the CacheNode is rebuilt (so data refetches), but the
    // bfcacheId carries forward as if the segment had matched.
    const oldSegment = oldRouterState[0];
    const newSegment = createSegmentFromRouteTree(newRouteTree);
    const segmentMatchKind = compareSegments(newSegment, oldSegment);
    if (segmentMatchKind === 1) {
        // This segment does not match the previous route. We're now entering the
        // new part of the target route. Switch to the "create" path.
        if ((newRouteTree.prefetchHints & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0 && (0, _isnavigatingtonewrootlayout.isNavigatingToNewRootLayout)(oldRouterState, newRouteTree) || // The global Not Found route (app/global-not-found.tsx) is a special
        // case, because it acts like a root layout, but in the router tree, it
        // is rendered in the same position as app/layout.tsx.
        //
        // Any navigation to the global Not Found route should trigger a
        // full-page navigation.
        //
        // TODO: We should probably model this by changing the key of the root
        // segment when this happens. Then the root layout check would work
        // as expected, without a special case.
        newSegment === _segment.NOT_FOUND_SEGMENT_KEY) {
            return null;
        }
        return createCacheNodeOnNavigation(navigatedAt, newRouteTree, newMetadataVaryPath, freshness, seedData, seedHead, seedDynamicStaleAt, parentNeedsDynamicRequest, accumulation, map, restrictToShell);
    }
    const newSlots = newRouteTree.slots;
    const oldRouterStateChildren = oldRouterState[1];
    const seedDataChildren = seedData !== null ? seedData[1] : null;
    let shouldRefreshDynamicData = false;
    switch(freshness){
        case 0:
        case 2:
        case 1:
        case 5:
            shouldRefreshDynamicData = false;
            break;
        case 3:
        case 4:
            shouldRefreshDynamicData = true;
            break;
        default:
            freshness;
            break;
    }
    // TODO: We're not consistent about how we do this check. Some places
    // check if the segment starts with PAGE_SEGMENT_KEY, but most seem to
    // check if there any any children, which is why I'm doing it here. We
    // should probably encode an empty children set as `null` though. Either
    // way, we should update all the checks to be consistent.
    const isLeafSegment = newSlots === null;
    // Get the data for this segment. Since it was part of the previous route,
    // usually we just clone the data from the old CacheNode. However, during a
    // refresh or a revalidation, there won't be any existing CacheNode. So we
    // may need to consult the prefetch cache, like we would for a new segment.
    let newCacheNode;
    let needsDynamicRequest;
    if (oldCacheNode !== undefined && !shouldRefreshDynamicData && // During a same-page navigation, we always refetch the page segments
    !(isLeafSegment && isSamePageNavigation) && // A search-param-only change is treated as a refresh of the page segment.
    // The internal cache key of the data is different, but the identity of
    // the node in the route tree is the same.
    segmentMatchKind !== 2) {
        // Reuse the existing CacheNode
        const dropPrefetchRsc = false;
        newCacheNode = reuseSharedCacheNode(dropPrefetchRsc, oldCacheNode);
        needsDynamicRequest = false;
    } else {
        // If this is part of a refresh, ignore the existing CacheNode and create a
        // new one.
        const seedRsc = seedData !== null ? seedData[0] : null;
        const result = createCacheNodeForSegment(navigatedAt, newRouteTree, seedRsc, newMetadataVaryPath, seedHead, freshness, seedDynamicStaleAt, // even though the data is being refreshed, the state identity of the
        // route hasn't changed. Otherwise (no prior node) mint a fresh one.
        oldCacheNode !== undefined ? oldCacheNode.bfcacheId : generateBFCacheId(freshness), map, restrictToShell);
        newCacheNode = result.cacheNode;
        needsDynamicRequest = result.needsDynamicRequest;
        // Scroll handling
        if (isLeafSegment && segmentMatchKind === 2) {
            // Special case: A search param change mostly acts the same as a
            // refresh, except it does trigger a scroll.
            accumulateScrollRef(freshness, newCacheNode, accumulation);
        } else {
            // Normal case: This is a refresh of an existing segment. Carry forward
            // the old node's scrollRef. This preserves scroll intent when a prior
            // navigation's CacheNode is replaced by a refresh before the scroll
            // handler has had a chance to fire — e.g. when router.push() and
            // router.refresh() are called in the same startTransition batch.
            if (oldCacheNode !== undefined) {
                newCacheNode.scrollRef = oldCacheNode.scrollRef;
            }
        }
    }
    // During a refresh navigation, there's a special case that happens when
    // entering a "default" slot. The default slot may not be part of the
    // current route; it may have been reused from an older route. If so,
    // we need to fetch its data from the old route's URL rather than current
    // route's URL. Keep track of this as we traverse the tree.
    const maybeRefreshState = newRouteTree.refreshState;
    const refreshState = maybeRefreshState !== undefined && maybeRefreshState !== null ? maybeRefreshState : parentRefreshState;
    // If this segment itself needs to fetch new data from the server, then by
    // definition it is being refreshed. Track its refresh URL so we know which
    // URL to request the data from.
    if (needsDynamicRequest && refreshState !== null) {
        accumulateRefreshUrl(accumulation, refreshState);
    }
    // As we diff the trees, we may sometimes modify (copy-on-write, not mutate)
    // the Route Tree that was returned by the server — for example, in the case
    // of default parallel routes, we preserve the currently active segment. To
    // avoid mutating the original tree, we clone the router state children along
    // the return path.
    let patchedRouterStateChildren = {};
    let taskChildren = null;
    // Most navigations require a request to fetch additional data from the
    // server, either because the data was not already prefetched, or because the
    // target route contains dynamic data that cannot be prefetched.
    //
    // However, if the target route is fully static, and it's already completely
    // loaded into the segment cache, then we can skip the server request.
    //
    // This starts off as `false`, and is set to `true` if any of the child
    // routes requires a dynamic request.
    let childNeedsDynamicRequest = false;
    // As we traverse the children, we'll construct a FlightRouterState that can
    // be sent to the server to request the dynamic data. If it turns out that
    // nothing in the subtree is dynamic (i.e. childNeedsDynamicRequest is false
    // at the end), then this will be discarded.
    // TODO: We can probably optimize the format of this data structure to only
    // include paths that are dynamic. Instead of reusing the
    // FlightRouterState type.
    let dynamicRequestTreeChildren = {};
    let newCacheNodeSlots = null;
    if (newSlots !== null) {
        const oldCacheNodeSlots = oldCacheNode !== undefined ? oldCacheNode.slots : null;
        newCacheNode.slots = newCacheNodeSlots = {};
        taskChildren = new Map();
        for (let [parallelRouteKey, newRouteTreeChild] of newSlots){
            const oldRouterStateChild = oldRouterStateChildren[parallelRouteKey];
            if (oldRouterStateChild === undefined) {
                // This should never happen, but if it does, it suggests a malformed
                // server response. Trigger a full-page navigation.
                return null;
            }
            let seedDataChild = seedDataChildren !== null ? seedDataChildren[parallelRouteKey] : null;
            const oldSegmentChild = oldRouterStateChild[0];
            let newSegmentChild = createSegmentFromRouteTree(newRouteTreeChild);
            let seedHeadChild = seedHead;
            if (// was stashed in the history entry as-is.
            freshness !== 2 && newSegmentChild === _segment.DEFAULT_SEGMENT_KEY && oldSegmentChild !== _segment.DEFAULT_SEGMENT_KEY) {
                // This is a "default" segment. These are never sent by the server during
                // a soft navigation; instead, the client reuses whatever segment was
                // already active in that slot on the previous route.
                newRouteTreeChild = reuseActiveSegmentInDefaultSlot(newRouteTree, parallelRouteKey, oldRootRefreshState, oldRouterStateChild);
                newSegmentChild = createSegmentFromRouteTree(newRouteTreeChild);
                // Since we're switching to a different route tree, these are no
                // longer valid, because they correspond to the outer tree.
                seedDataChild = null;
                seedHeadChild = null;
            }
            const oldCacheNodeChild = oldCacheNodeSlots !== null ? oldCacheNodeSlots[parallelRouteKey] : undefined;
            const taskChild = updateCacheNodeOnNavigation(navigatedAt, oldUrl, oldCacheNodeChild, oldRouterStateChild, newRouteTreeChild, newMetadataVaryPath, freshness, seedDataChild ?? null, seedHeadChild, seedDynamicStaleAt, isSamePageNavigation, parentNeedsDynamicRequest || needsDynamicRequest, oldRootRefreshState, refreshState, accumulation, map, restrictToShell);
            if (taskChild === null) {
                // One of the child tasks discovered a change to the root layout.
                // Immediately unwind from this recursive traversal. This will trigger a
                // full-page navigation.
                return null;
            }
            // Recursively propagate up the child tasks.
            taskChildren.set(parallelRouteKey, taskChild);
            newCacheNodeSlots[parallelRouteKey] = taskChild.node;
            // The child tree's route state may be different from the prefetched
            // route sent by the server. We need to clone it as we traverse back up
            // the tree.
            const taskChildRoute = taskChild.route;
            patchedRouterStateChildren[parallelRouteKey] = taskChildRoute;
            const dynamicRequestTreeChild = taskChild.dynamicRequestTree;
            if (dynamicRequestTreeChild !== null) {
                // Something in the child tree is dynamic.
                childNeedsDynamicRequest = true;
                dynamicRequestTreeChildren[parallelRouteKey] = dynamicRequestTreeChild;
            } else {
                dynamicRequestTreeChildren[parallelRouteKey] = taskChildRoute;
            }
        }
    }
    const newFlightRouterState = [
        createSegmentFromRouteTree(newRouteTree),
        patchedRouterStateChildren,
        refreshState !== null ? [
            refreshState.canonicalUrl,
            refreshState.renderedSearch
        ] : null,
        null,
        newRouteTree.prefetchHints
    ];
    return {
        status: needsDynamicRequest ? 0 : 1,
        route: newFlightRouterState,
        node: newCacheNode,
        dynamicRequestTree: createDynamicRequestTree(newFlightRouterState, dynamicRequestTreeChildren, needsDynamicRequest, childNeedsDynamicRequest, parentNeedsDynamicRequest),
        refreshState,
        children: taskChildren
    };
}
/**
 * Assigns a ScrollRef to a new leaf CacheNode so the scroll handler
 * knows to scroll to it after navigation. All leaves in the same
 * navigation share the same ScrollRef — the first segment to scroll
 * consumes it, preventing others from also scrolling.
 *
 * This is only called inside `createCacheNodeOnNavigation`, which only
 * runs when segments diverge from the previous route. So for a refresh
 * where the route structure stays the same, segments match, the update
 * path is taken, and this function is never called — no scroll ref is
 * assigned. A scroll ref is only assigned when the route actually
 * changed (e.g. a redirect, or a dynamic condition on the server that
 * produces a different route).
 *
 * Skipped during hydration (initial render should not scroll) and
 * history traversal (scroll restoration is handled separately).
 */ function accumulateScrollRef(freshness, cacheNode, accumulation) {
    switch(freshness){
        case 0:
        case 5:
        case 3:
        case 4:
            if (accumulation.scrollRef === null) {
                accumulation.scrollRef = {
                    current: true
                };
            }
            cacheNode.scrollRef = accumulation.scrollRef;
            break;
        case 1:
            break;
        case 2:
            break;
        default:
            freshness;
            break;
    }
}
function createCacheNodeOnNavigation(navigatedAt, newRouteTree, newMetadataVaryPath, freshness, seedData, seedHead, seedDynamicStaleAt, parentNeedsDynamicRequest, accumulation, map, // entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    // Same traversal as updateCacheNodeNavigation, but simpler. We switch to this
    // path once we reach the part of the tree that was not in the previous route.
    // We don't need to diff against the old tree, we just need to create a new
    // one. We also don't need to worry about any refresh-related logic.
    //
    // For the most part, this is a subset of updateCacheNodeOnNavigation, so any
    // change that happens in this function likely needs to be applied to that
    // one, too. However there are some places where the behavior intentionally
    // diverges, which is why we keep them separate.
    const newSegment = createSegmentFromRouteTree(newRouteTree);
    const newSlots = newRouteTree.slots;
    const seedDataChildren = seedData !== null ? seedData[1] : null;
    const seedRsc = seedData !== null ? seedData[0] : null;
    const result = createCacheNodeForSegment(navigatedAt, newRouteTree, seedRsc, newMetadataVaryPath, seedHead, freshness, seedDynamicStaleAt, // bfcacheId.
    generateBFCacheId(freshness), map, restrictToShell);
    const newCacheNode = result.cacheNode;
    const needsDynamicRequest = result.needsDynamicRequest;
    const isLeafSegment = newSlots === null;
    if (isLeafSegment) {
        accumulateScrollRef(freshness, newCacheNode, accumulation);
    }
    let patchedRouterStateChildren = {};
    let taskChildren = null;
    let childNeedsDynamicRequest = false;
    let dynamicRequestTreeChildren = {};
    let newCacheNodeSlots = null;
    if (newSlots !== null) {
        newCacheNode.slots = newCacheNodeSlots = {};
        taskChildren = new Map();
        for (const [parallelRouteKey, newRouteTreeChild] of newSlots){
            const seedDataChild = seedDataChildren !== null ? seedDataChildren[parallelRouteKey] : null;
            const taskChild = createCacheNodeOnNavigation(navigatedAt, newRouteTreeChild, newMetadataVaryPath, freshness, seedDataChild ?? null, seedHead, seedDynamicStaleAt, parentNeedsDynamicRequest || needsDynamicRequest, accumulation, map, restrictToShell);
            taskChildren.set(parallelRouteKey, taskChild);
            newCacheNodeSlots[parallelRouteKey] = taskChild.node;
            const taskChildRoute = taskChild.route;
            patchedRouterStateChildren[parallelRouteKey] = taskChildRoute;
            const dynamicRequestTreeChild = taskChild.dynamicRequestTree;
            if (dynamicRequestTreeChild !== null) {
                childNeedsDynamicRequest = true;
                dynamicRequestTreeChildren[parallelRouteKey] = dynamicRequestTreeChild;
            } else {
                dynamicRequestTreeChildren[parallelRouteKey] = taskChildRoute;
            }
        }
    }
    const newFlightRouterState = [
        newSegment,
        patchedRouterStateChildren,
        null,
        null,
        newRouteTree.prefetchHints
    ];
    return {
        status: needsDynamicRequest ? 0 : 1,
        route: newFlightRouterState,
        node: newCacheNode,
        dynamicRequestTree: createDynamicRequestTree(newFlightRouterState, dynamicRequestTreeChildren, needsDynamicRequest, childNeedsDynamicRequest, parentNeedsDynamicRequest),
        // This route is not part of the current tree, so there's no reason to
        // track the refresh URL.
        refreshState: null,
        children: taskChildren
    };
}
function createSegmentFromRouteTree(newRouteTree) {
    if (newRouteTree.isPage) {
        // In a dynamic server response, the server embeds the search params into
        // the segment key, but in a static one it's omitted. The client handles
        // this inconsistency by adding the search params back right at the end.
        //
        // TODO: The only thing this is used for is to create a cache key for
        // ChildSegmentMap. But we already track the `renderedSearch` everywhere as
        // part of the varyPath. The plan is get rid of ChildSegmentMap and
        // store the page data in a CacheMap using the varyPath, like we do
        // for prefetches. Then we can remove it from the segment key.
        //
        // As an incremental step, we can grab the search params from the varyPath.
        const renderedSearch = (0, _varypath.getRenderedSearchFromVaryPath)(newRouteTree.varyPath);
        if (renderedSearch === null) {
            return _segment.PAGE_SEGMENT_KEY;
        }
        // This is based on equivalent logic in addSearchParamsIfPageSegment, used
        // on the server.
        const stringifiedQuery = JSON.stringify((0, _routeparams.urlSearchParamsToParsedUrlQuery)(new URLSearchParams(renderedSearch)));
        return stringifiedQuery !== '{}' ? _segment.PAGE_SEGMENT_KEY + '?' + stringifiedQuery : _segment.PAGE_SEGMENT_KEY;
    }
    return newRouteTree.segment;
}
function patchRouterStateWithNewChildren(baseRouterState, newChildren) {
    const clone = [
        baseRouterState[0],
        newChildren
    ];
    // Based on equivalent logic in apply-router-state-patch-to-tree, but should
    // confirm whether we need to copy all of these fields. Not sure the server
    // ever sends, e.g. the refetch marker.
    if (2 in baseRouterState) {
        clone[2] = baseRouterState[2];
    }
    if (3 in baseRouterState) {
        clone[3] = baseRouterState[3];
    }
    if (4 in baseRouterState) {
        clone[4] = baseRouterState[4];
    }
    return clone;
}
function createDynamicRequestTree(newRouterState, dynamicRequestTreeChildren, needsDynamicRequest, childNeedsDynamicRequest, parentNeedsDynamicRequest) {
    // Create a FlightRouterState that instructs the server how to render the
    // requested segment.
    //
    // Or, if neither this segment nor any of the children require a new data,
    // then we return `null` to skip the request.
    let dynamicRequestTree = null;
    if (needsDynamicRequest) {
        dynamicRequestTree = patchRouterStateWithNewChildren(newRouterState, dynamicRequestTreeChildren);
        // The "refetch" marker is set on the top-most segment that requires new
        // data. We can omit it if a parent was already marked.
        if (!parentNeedsDynamicRequest) {
            dynamicRequestTree[3] = 'refetch';
        }
    } else if (childNeedsDynamicRequest) {
        // This segment does not request new data, but at least one of its
        // children does.
        dynamicRequestTree = patchRouterStateWithNewChildren(newRouterState, dynamicRequestTreeChildren);
    } else {
        dynamicRequestTree = null;
    }
    return dynamicRequestTree;
}
function accumulateRefreshUrl(accumulation, refreshState) {
    // This is a refresh navigation, and we're inside a "default" slot that's
    // not part of the current route; it was reused from an older route. In
    // order to get fresh data for this reused route, we need to issue a
    // separate request using the old route's URL.
    //
    // Track these extra URLs in the accumulated result. Later, we'll construct
    // an appropriate request for each unique URL in the final set. The reason
    // we don't do it immediately here is so we can deduplicate multiple
    // instances of the same URL into a single request. See
    // listenForDynamicRequest for more details.
    const refreshUrl = refreshState.canonicalUrl;
    const separateRefreshUrls = accumulation.separateRefreshUrls;
    if (separateRefreshUrls === null) {
        accumulation.separateRefreshUrls = new Set([
            refreshUrl
        ]);
    } else {
        separateRefreshUrls.add(refreshUrl);
    }
}
function reuseActiveSegmentInDefaultSlot(parentRouteTree, parallelRouteKey, oldRootRefreshState, oldRouterState) {
    // This is a "default" segment. These are never sent by the server during a
    // soft navigation; instead, the client reuses whatever segment was already
    // active in that slot on the previous route. This means if we later need to
    // refresh the segment, it will have to be refetched from the previous route's
    // URL. We store it in the Flight Router State.
    let reusedUrl;
    let reusedRenderedSearch;
    const oldRefreshState = oldRouterState[2];
    if (oldRefreshState !== undefined && oldRefreshState !== null) {
        // This segment was already reused from an even older route. Keep its
        // existing URL and refresh state.
        reusedUrl = oldRefreshState[0];
        reusedRenderedSearch = oldRefreshState[1];
    } else {
        // Since this route didn't already have a refresh state, it must have been
        // reachable from the root of the old route. So we use the refresh state
        // that represents the old route.
        reusedUrl = oldRootRefreshState.canonicalUrl;
        reusedRenderedSearch = oldRootRefreshState.renderedSearch;
    }
    const acc = {
        metadataVaryPath: null,
        treeDivergedFromBase: false
    };
    const reusedRouteTree = (0, _cache.convertReusedFlightRouterStateToRouteTree)(parentRouteTree, parallelRouteKey, oldRouterState, reusedRenderedSearch, acc);
    reusedRouteTree.refreshState = {
        canonicalUrl: reusedUrl,
        renderedSearch: reusedRenderedSearch
    };
    return reusedRouteTree;
}
function reuseSharedCacheNode(dropPrefetchRsc, existingCacheNode) {
    // Clone the CacheNode that was already present in the previous tree.
    // Carry forward the scrollRef so scroll intent from a prior navigation
    // survives tree rebuilds (e.g. push + refresh in the same batch).
    // Carry forward the bfcacheId so shared-layout segments retain stable
    // identity across navigations.
    return createCacheNode(existingCacheNode.rsc, dropPrefetchRsc ? null : existingCacheNode.prefetchRsc, existingCacheNode.head, dropPrefetchRsc ? null : existingCacheNode.prefetchHead, existingCacheNode.bfcacheId, existingCacheNode.scrollRef);
}
function createCacheNodeForSegment(now, tree, seedRsc, metadataVaryPath, seedHead, freshness, dynamicStaleAt, bfcacheId, map, // entries. Always false outside the testing API. See navigation-testing-lock.
restrictToShell) {
    // Construct a new CacheNode using data from the BFCache, the client's
    // Segment Cache, or seeded from a server response.
    //
    // If there's a cache miss, or if we only have a partial hit, we'll render
    // the partial state immediately, and spawn a request to the server to fill
    // in the missing data.
    //
    // If the segment is fully cached on the client already, we can omit this
    // segment from the server request.
    //
    // If we already have a dynamic data response associated with this navigation,
    // as in the case of a Server Action-initiated redirect or refresh, we may
    // also be able to use that data without spawning a new request. (This is
    // referred to as the "seed" data.)
    const isPage = tree.isPage;
    // During certain kinds of navigations, we may be able to render from
    // the BFCache.
    switch(freshness){
        case 0:
            {
                // Check BFCache during regular navigations. The entry's staleAt
                // determines whether it's still fresh. This is used when
                // staleTimes.dynamic is configured globally or when a page exports
                // unstable_dynamicStaleTime for per-page control.
                const bfcacheEntry = (0, _bfcache.readFromBFCacheDuringRegularNavigation)(now, tree.varyPath);
                if (bfcacheEntry !== null) {
                    // A regular navigation that happens to read cached data is still a
                    // fresh navigation, so we use the caller-supplied bfcacheId — the
                    // BFCacheEntry's id is only restored on history-traversal
                    // navigations.
                    return {
                        cacheNode: createCacheNode(bfcacheEntry.rsc, bfcacheEntry.prefetchRsc, bfcacheEntry.head, bfcacheEntry.prefetchHead, bfcacheId),
                        needsDynamicRequest: false
                    };
                }
                break;
            }
        case 1:
            {
                // This is not related to the BFCache but it is a special case.
                //
                // We should never spawn network requests during hydration. We must treat
                // the initial payload as authoritative, because the initial page load is
                // used as a last-ditch mechanism for recovering the app.
                //
                // This is also an important safety check because if this leaks into the
                // server rendering path (which theoretically it never should because the
                // server payload should be consistent), the server would hang because these
                // promises would never resolve.
                //
                // TODO: There is an existing case where the global "not found" boundary
                // triggers this path. But it does render correctly despite that. That's an
                // unusual render path so it's not surprising, but we should look into
                // modeling it in a more consistent way. See also the /_notFound special
                // case in updateCacheNodeOnNavigation.
                const rsc = seedRsc;
                const prefetchRsc = null;
                const head = isPage ? seedHead : null;
                const prefetchHead = null;
                (0, _bfcache.writeToBFCache)(now, tree.varyPath, rsc, prefetchRsc, head, prefetchHead, dynamicStaleAt, bfcacheId);
                if (isPage && metadataVaryPath !== null) {
                    (0, _bfcache.writeHeadToBFCache)(now, metadataVaryPath, head, prefetchHead, dynamicStaleAt, bfcacheId);
                }
                return {
                    cacheNode: createCacheNode(rsc, prefetchRsc, head, prefetchHead, bfcacheId),
                    needsDynamicRequest: false
                };
            }
        case 2:
            const bfcacheEntry = (0, _bfcache.readFromBFCache)(tree.varyPath);
            if (bfcacheEntry !== null) {
                // Only show prefetched data if the dynamic data is still pending. This
                // avoids a flash back to the prefetch state in a case where it's highly
                // likely to have already streamed in.
                //
                // Tehnically, what we're actually checking is whether the dynamic
                // network response was received. But since it's a streaming response,
                // this does not mean that all the dynamic data has fully streamed in.
                // It just means that _some_ of the dynamic data was received. But as a
                // heuristic, we assume that the rest dynamic data will stream in
                // quickly, so it's still better to skip the prefetch state.
                const oldRsc = bfcacheEntry.rsc;
                const oldRscDidResolve = !isDeferredRsc(oldRsc) || oldRsc.status !== 'pending';
                const dropPrefetchRsc = oldRscDidResolve;
                // Restore the bfcacheId from the cached entry so that back/forward
                // navigations preserve the original id, regardless of whether
                // `cacheComponents` Activity preservation is enabled.
                return {
                    cacheNode: createCacheNode(bfcacheEntry.rsc, dropPrefetchRsc ? null : bfcacheEntry.prefetchRsc, bfcacheEntry.head, dropPrefetchRsc ? null : bfcacheEntry.prefetchHead, bfcacheEntry.bfcacheId),
                    needsDynamicRequest: false
                };
            }
            break;
        case 3:
        case 4:
        case 5:
            break;
        default:
            freshness;
            break;
    }
    let cachedRsc = null;
    let isCachedRscPartial = true;
    const segmentEntry = (0, _cache.readSegmentCacheEntryForNavigation)(now, map, tree.varyPath, restrictToShell);
    if (segmentEntry !== null) {
        switch(segmentEntry.status){
            case _cache.EntryStatus.Fulfilled:
                {
                    // Happy path: a cache hit
                    cachedRsc = segmentEntry.rsc;
                    isCachedRscPartial = segmentEntry.isPartial;
                    break;
                }
            case _cache.EntryStatus.Pending:
                {
                    // We haven't received data for this segment yet, but there's already
                    // an in-progress request. Since it's extremely likely to arrive
                    // before the dynamic data response, we might as well use it.
                    const promiseForFulfilledEntry = (0, _cache.waitForSegmentCacheEntry)(segmentEntry);
                    cachedRsc = promiseForFulfilledEntry.then((entry)=>entry !== null ? entry.rsc : null);
                    // Because the request is still pending, we typically don't know yet
                    // whether the response will be partial. We shouldn't skip this segment
                    // during the dynamic navigation request. Otherwise, we might need to
                    // do yet another request to fill in the remaining data, creating
                    // a waterfall.
                    //
                    // The one exception is if this segment is being fetched with via
                    // prefetch={true} (i.e. the "force stale" or "full" strategy). If so,
                    // we can assume the response will be full. This field is set to `false`
                    // for such segments.
                    isCachedRscPartial = segmentEntry.isPartial;
                    break;
                }
            case _cache.EntryStatus.Empty:
            case _cache.EntryStatus.Rejected:
                {
                    break;
                }
            default:
                {
                    segmentEntry;
                    break;
                }
        }
    }
    // Now combine the cached data with the seed data to determine what we can
    // render immediately, versus what needs to stream in later.
    // A partial state to show immediately while we wait for the final data to
    // arrive. If `rsc` is already a complete value (not partial), or if we
    // don't have any useful partial state, this will be `null`.
    let prefetchRsc;
    // The final, resolved segment data. If the data is missing, this will be a
    // promise that resolves to the eventual data. A resolved value of `null`
    // means the data failed to load; the LayoutRouter will suspend indefinitely
    // until the router updates again (refer to finishNavigationTask).
    let rsc;
    let doesSegmentNeedDynamicRequest;
    if (seedRsc !== null) {
        // We already have a dynamic server response for this segment.
        if (isCachedRscPartial) {
            // The seed data may still be streaming in, so it's worth showing the
            // partial cached state in the meantime.
            prefetchRsc = cachedRsc;
            rsc = seedRsc;
        } else {
            // We already have a completely cached segment. Ignore the seed data,
            // which may still be streaming in. This shouldn't happen in the normal
            // case because the client will inform the server which segments are
            // already fully cached, and the server will skip rendering them.
            prefetchRsc = null;
            rsc = cachedRsc;
        }
        doesSegmentNeedDynamicRequest = false;
    } else {
        if (isCachedRscPartial) {
            // The cached data contains dynamic holes, or it's missing entirely. We'll
            // show the partial state immediately (if available), and stream in the
            // final data.
            //
            // Create a pending promise that we can later write to when the
            // data arrives from the server.
            prefetchRsc = cachedRsc;
            rsc = createDeferredRsc();
        } else {
            // The data is fully cached.
            prefetchRsc = null;
            rsc = cachedRsc;
        }
        doesSegmentNeedDynamicRequest = isCachedRscPartial;
    }
    // If this is a page segment, we need to do the same for the head. This
    // follows analogous logic to the segment data above.
    // TODO: We don't need to store the head on the page segment's CacheNode; we
    // can lift it to the main state object. Then we can also delete
    // findHeadCache.
    let prefetchHead = null;
    let head = null;
    let doesHeadNeedDynamicRequest = isPage;
    if (isPage) {
        let cachedHead = null;
        let isCachedHeadPartial = true;
        if (metadataVaryPath !== null) {
            const metadataEntry = (0, _cache.readSegmentCacheEntryForNavigation)(now, map, metadataVaryPath, restrictToShell);
            if (metadataEntry !== null) {
                switch(metadataEntry.status){
                    case _cache.EntryStatus.Fulfilled:
                        {
                            cachedHead = metadataEntry.rsc;
                            isCachedHeadPartial = metadataEntry.isPartial;
                            break;
                        }
                    case _cache.EntryStatus.Pending:
                        {
                            cachedHead = (0, _cache.waitForSegmentCacheEntry)(metadataEntry).then((entry)=>entry !== null ? entry.rsc : null);
                            isCachedHeadPartial = metadataEntry.isPartial;
                            break;
                        }
                    case _cache.EntryStatus.Empty:
                    case _cache.EntryStatus.Rejected:
                        {
                            break;
                        }
                    default:
                        {
                            metadataEntry;
                            break;
                        }
                }
            }
        }
        if (("TURBOPACK compile-time value", true) && isCachedHeadPartial) {
            // TODO: When optimistic routing is enabled, don't block on waiting for
            // the viewport to resolve. This is a temporary workaround until Vary
            // Params are tracked when rendering the metadata. We'll fix it before
            // this feature is stable. However, it's not a critical issue because 1)
            // it will stream in eventually anyway 2) metadata is wrapped in an
            // internal Suspense boundary, so is always non-blocking; this only
            // affects the viewport node, which is meant to blocking, however... 3)
            // before Segment Cache landed this wasn't always the case, anyway, so
            // it's unlikely that many people are relying on this behavior. Still,
            // will be fixed before stable. It's the very next step in the sequence of
            // work on this project.
            //
            // This line of code works because the App Router treats `null` as
            // "no renderable head available", rather than an empty head. React treats
            // an empty string as empty.
            cachedHead = '';
        }
        if (seedHead !== null) {
            if (isCachedHeadPartial) {
                prefetchHead = cachedHead;
                head = seedHead;
            } else {
                prefetchHead = null;
                head = cachedHead;
            }
            doesHeadNeedDynamicRequest = false;
        } else {
            if (isCachedHeadPartial) {
                prefetchHead = cachedHead;
                head = createDeferredRsc();
            } else {
                prefetchHead = null;
                head = cachedHead;
            }
            doesHeadNeedDynamicRequest = isCachedHeadPartial;
        }
    }
    // Now that we're creating a new segment, write its data to the BFCache. A
    // subsequent back/forward navigation will reuse this same data, until or
    // unless it's cleared by a refresh/revalidation.
    //
    // Skip BFCache writes for optimistic navigations since they are transient
    // and will be replaced by the canonical navigation.
    if (freshness !== 5) {
        (0, _bfcache.writeToBFCache)(now, tree.varyPath, rsc, prefetchRsc, head, prefetchHead, dynamicStaleAt, bfcacheId);
        if (isPage && metadataVaryPath !== null) {
            (0, _bfcache.writeHeadToBFCache)(now, metadataVaryPath, head, prefetchHead, dynamicStaleAt, bfcacheId);
        }
    }
    return {
        cacheNode: createCacheNode(rsc, prefetchRsc, head, prefetchHead, bfcacheId),
        // TODO: We should store this field on the CacheNode itself. I think we can
        // probably unify NavigationTask, CacheNode, and DeferredRsc into a
        // single type. Or at least CacheNode and DeferredRsc.
        needsDynamicRequest: doesSegmentNeedDynamicRequest || doesHeadNeedDynamicRequest
    };
}
function createCacheNode(rsc, prefetchRsc, head, prefetchHead, bfcacheId, scrollRef = null) {
    return {
        rsc,
        prefetchRsc,
        head,
        prefetchHead,
        slots: null,
        scrollRef,
        bfcacheId
    };
}
// Globally-unique counter for fresh bfcacheIds. Incremented every time a new
// CacheNode is created on the client. The id surfaces to user code as a
// string via `useRouter().bfcacheId`.
let nextBFCacheId = 0;
function generateBFCacheId(freshness) {
    // Server-side rendering and the initial client-side hydration tree both
    // use a fixed sentinel so they reconcile cleanly across hydration. The
    // counter only advances on real client-side navigations after hydration.
    if ("TURBOPACK compile-time truthy", 1) return 0;
    //TURBOPACK unreachable
    ;
}
function compareSegments(newSegment, oldSegment) {
    if ((0, _matchsegments.matchSegment)(newSegment, oldSegment)) {
        return 0;
    }
    if (typeof newSegment === 'string' && typeof oldSegment === 'string' && newSegment.startsWith(_segment.PAGE_SEGMENT_KEY) && oldSegment.startsWith(_segment.PAGE_SEGMENT_KEY)) {
        return 2;
    }
    return 1;
}
// Represents whether the previuos navigation resulted in a route tree mismatch.
// A mismatch results in a refresh of the page. If there are two successive
// mismatches, we will fall back to an MPA navigation, to prevent a retry loop.
let previousNavigationDidMismatch = false;
function spawnDynamicRequests(task, primaryUrl, nextUrl, freshnessPolicy, accumulation, // prediction. Passed through so it can be marked as having a dynamic rewrite
// if the server returns a different pathname than expected (indicating
// dynamic rewrite behavior that varies by param value).
routeCacheEntry, // server-patch retry logic so it can inherit the intent if the original
// transition hasn't committed yet.
navigateType, navigationLock, // in cache.ts.
map, signal) {
    const dynamicRequestTree = task.dynamicRequestTree;
    if (dynamicRequestTree === null) {
        // This navigation was fully cached. There are no dynamic requests to spawn.
        previousNavigationDidMismatch = false;
        return;
    }
    // This is intentionally not an async function to discourage the caller from
    // awaiting the result. Any subsequent async operations spawned by this
    // function should result in a separate navigation task, rather than
    // block the original one.
    //
    // In this function we spawn (but do not await) all the network requests that
    // block the navigation, and collect the promises. The next function,
    // `finishNavigationTask`, can await the promises in any order without
    // accidentally introducing a network waterfall.
    const primaryRequestPromise = fetchMissingDynamicData(task, dynamicRequestTree, primaryUrl, nextUrl, freshnessPolicy, routeCacheEntry, navigationLock, map, signal);
    const separateRefreshUrls = accumulation.separateRefreshUrls;
    let refreshRequestPromises = null;
    if (separateRefreshUrls !== null) {
        // There are multiple URLs that we need to request the data from. This
        // happens when a "default" parallel route slot is present in the tree, and
        // its data cannot be fetched from the current route. We need to split the
        // combined dynamic request tree into separate requests per URL.
        // TODO: Create a scoped dynamic request tree that omits anything that
        // is not relevant to the given URL. Without doing this, the server may
        // sometimes render more data than necessary; this is not a regression
        // compared to the pre-Segment Cache implementation, though, just an
        // optimization we can make in the future.
        // Construct a request tree for each additional refresh URL. This will
        // prune away everything except the parts of the tree that match the
        // given refresh URL.
        refreshRequestPromises = [];
        const canonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(primaryUrl);
        for (const refreshUrl of separateRefreshUrls){
            if (refreshUrl === canonicalUrl) {
                continue;
            }
            // TODO: Create a scoped dynamic request tree that omits anything that
            // is not relevant to the given URL. Without doing this, the server may
            // sometimes render more data than necessary; this is not a regression
            // compared to the pre-Segment Cache implementation, though, just an
            // optimization we can make in the future.
            // const scopedDynamicRequestTree = splitTaskByURL(task, refreshUrl)
            const scopedDynamicRequestTree = dynamicRequestTree;
            if (scopedDynamicRequestTree !== null) {
                refreshRequestPromises.push(fetchMissingDynamicData(task, scopedDynamicRequestTree, new URL(refreshUrl, location.origin), // time the refresh URL was set, not the current Next-Url. Need to
                // start tracking this alongside the refresh URL. In the meantime,
                // if a refresh fails due to a mismatch, it will trigger a
                // hard refresh.
                nextUrl, freshnessPolicy, routeCacheEntry, navigationLock, map, signal));
            }
        }
    }
    // Further async operations are moved into this separate function to
    // discourage sequential network requests.
    const voidPromise = finishNavigationTask(task, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType);
    // `finishNavigationTask` is responsible for error handling, so we can attach
    // noop callbacks to this promise.
    voidPromise.then(noop, noop);
}
async function finishNavigationTask(task, nextUrl, primaryRequestPromise, refreshRequestPromises, routeCacheEntry, navigateType) {
    // Wait for all the requests to finish, or for the first one to fail.
    let exitStatus = await waitForRequestsToFinish(primaryRequestPromise, refreshRequestPromises);
    // Once the all the requests have finished, check the tree for any remaining
    // pending tasks. If anything is still pending, it means the server response
    // does not match the client, and we must refresh to get back to a consistent
    // state. We can skip this step if we already detected a mismatch during the
    // first phase; it doesn't matter in that case because we're going to refresh
    // the whole tree regardless.
    if (exitStatus === 0) {
        exitStatus = abortRemainingPendingTasks(task, null, null);
    }
    switch(exitStatus){
        case -1:
            {
                // This navigation was superseded and its request aborted. Its cache nodes
                // may already be reused by the newer navigation, so leave them untouched
                // for the newer request to fulfill. If the tree was abandoned entirely,
                // it can be garbage collected along with its unresolved promises. We do
                // not retry or hard-navigate.
                return;
            }
        case 0:
            {
                // The task has completely finished. There's no missing data. Exit.
                previousNavigationDidMismatch = false;
                return;
            }
        case 1:
            {
                // Some data failed to finish loading. Trigger a soft retry that re-fetches
                // the tree's dynamic data.
                // TODO: As an extra precaution against soft retry loops, consider
                // tracking whether a navigation was itself triggered by a retry. If two
                // happen in a row, fall back to a hard retry.
                const isHardRetry = false;
                const primaryRequestResult = await primaryRequestPromise;
                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, task.route, routeCacheEntry, navigateType, 3);
                return;
            }
        case 3:
            {
                // The route matched, but the request was redirected, so we committed the
                // wrong canonical URL. Re-resolve the route to invalidate the now-stale
                // route cache and correct the URL — but reuse the data we already received
                // (HistoryTraversal) instead of re-fetching it. See issue #95195.
                const isHardRetry = false;
                const primaryRequestResult = await primaryRequestPromise;
                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, task.route, routeCacheEntry, navigateType, 2);
                return;
            }
        case 2:
            {
                // Some data failed to finish loading in a non-recoverable way, such as a
                // network error. Trigger an MPA navigation.
                //
                // Hard navigating/refreshing is how we prevent an infinite retry loop
                // caused by a network error — when the network fails, we fall back to the
                // browser behavior for offline navigations. In the future, Next.js may
                // introduce its own custom handling of offline navigations, but that
                // doesn't exist yet.
                const isHardRetry = true;
                const primaryRequestResult = await primaryRequestPromise;
                dispatchRetryDueToTreeMismatch(isHardRetry, primaryRequestResult.url, nextUrl, primaryRequestResult.seed, task.route, routeCacheEntry, navigateType, 3);
                return;
            }
        default:
            {
                return exitStatus;
            }
    }
}
function waitForRequestsToFinish(primaryRequestPromise, refreshRequestPromises) {
    // Custom async combinator logic. This could be replaced by Promise.any but
    // we don't assume that's available.
    //
    // Each promise resolves once the server responsds and the data is written
    // into the CacheNode tree. Resolve the combined promise once all the
    // requests finish.
    //
    // Or, resolve as soon as one of the requests fails, without waiting for the
    // others to finish.
    return new Promise((resolve)=>{
        const onFulfill = (result)=>{
            if (result.exitStatus === 0) {
                remainingCount--;
                if (remainingCount === 0) {
                    // All the requests finished successfully.
                    resolve(0);
                }
            } else {
                // One of the requests failed. Exit with a failing status.
                // NOTE: It's possible for one of the requests to fail with SoftRetry
                // and a later one to fail with HardRetry. In this case, we choose to
                // retry immediately, rather than delay the retry until all the requests
                // finish. If it fails again, we will hard retry on the next
                // attempt, anyway.
                resolve(result.exitStatus);
            }
        };
        // onReject shouldn't ever be called because fetchMissingDynamicData's
        // entire body is wrapped in a try/catch. This is just defensive.
        const onReject = ()=>resolve(2);
        // Attach the listeners to the promises.
        let remainingCount = 1;
        primaryRequestPromise.then(onFulfill, onReject);
        if (refreshRequestPromises !== null) {
            remainingCount += refreshRequestPromises.length;
            refreshRequestPromises.forEach((refreshRequestPromise)=>refreshRequestPromise.then(onFulfill, onReject));
        }
    });
}
function dispatchRetryDueToTreeMismatch(isHardRetry, retryUrl, retryNextUrl, seed, baseTree, // prediction. If the navigation results in a mismatch, we mark it as having
// a dynamic rewrite so future predictions bail out.
routeCacheEntry, originalNavigateType, // tree's dynamic data (used for genuine tree mismatches). `HistoryTraversal`
// reuses the data already in the tree (used when only the URL needs
// correcting after a redirect).
retryFreshnessPolicy) {
    // If the navigation used a route prediction, mark it as having a dynamic
    // rewrite since it resulted in a mismatch.
    if (routeCacheEntry !== null) {
        (0, _cache.markRouteEntryAsDynamicRewrite)(routeCacheEntry);
    } else if (seed !== null) {
        // Even without a direct reference to the route cache entry, we can still
        // mark the route as having a dynamic rewrite by traversing the known route
        // tree. This handles cases where the navigation didn't originate from a
        // route prediction, but still needs to mark the pattern.
        const metadataVaryPath = seed.metadataVaryPath;
        if (metadataVaryPath !== null) {
            const now = Date.now();
            (0, _optimisticroutes.discoverKnownRoute)(now, retryUrl.pathname, retryUrl.search, retryNextUrl, null, seed.routeTree, metadataVaryPath, false, (0, _createhreffromurl.createHrefFromUrl)(retryUrl), false, true // hasDynamicRewrite
            );
        }
    }
    // Invalidate all route cache entries. Other entries may have been derived
    // from the template before we knew it had a dynamic rewrite. This also
    // triggers re-prefetching of visible links.
    (0, _cache.invalidateRouteCacheEntries)(retryNextUrl, baseTree);
    // If this is the second time in a row that a navigation resulted in a
    // mismatch, fall back to a hard (MPA) refresh.
    isHardRetry = isHardRetry || previousNavigationDidMismatch;
    previousNavigationDidMismatch = true;
    // If the original navigation hasn't committed to the browser history yet
    // (the transition suspended before React committed), inherit its push/replace
    // intent. Otherwise, the pushState already ran, so use 'replace' to avoid
    // creating a duplicate history entry.
    //
    // This works because React entangles the retry's state update with the
    // original pending transition — they commit together as a single batch,
    // so the navigate type from the retry is what HistoryUpdater ultimately sees.
    //
    // TODO: Ideally this check would happen right before we schedule the React
    // update (i.e., closer to where the action is dispatched into the queue),
    // not here where the action is constructed. But the current action queue
    // doesn't provide a natural place for that. Revisit when we refactor the
    // action queue into a more reactive navigation model.
    const lastCommitted = (0, _committedstate.getLastCommittedTree)();
    const retryNavigateType = lastCommitted !== null && baseTree !== lastCommitted ? originalNavigateType : 'replace';
    const retryAction = {
        type: _routerreducertypes.ACTION_SERVER_PATCH,
        previousTree: baseTree,
        url: retryUrl,
        nextUrl: retryNextUrl,
        seed,
        mpa: isHardRetry,
        navigateType: retryNavigateType,
        freshnessPolicy: retryFreshnessPolicy
    };
    (0, _useactionqueue.dispatchAppRouterAction)(retryAction);
}
async function fetchMissingDynamicData(task, dynamicRequestTree, url, nextUrl, freshnessPolicy, routeCacheEntry, navigationLock, map, signal) {
    try {
        const result = await (0, _fetchserverresponse.fetchServerResponse)(url, {
            flightRouterState: dynamicRequestTree,
            nextUrl,
            isHmrRefresh: freshnessPolicy === 4,
            signal
        });
        if (typeof result === 'string') {
            // fetchServerResponse will return an href to indicate that the SPA
            // navigation failed. For example, if the server triggered a hard
            // redirect, or the fetch request errored. Initiate an MPA navigation
            // to the given href.
            return {
                exitStatus: 2,
                url: new URL(result, location.origin),
                seed: null
            };
        }
        const now = Date.now();
        const seed = (0, _navigation.convertServerPatchToFullTree)(now, task.route, result.flightData, result.renderedSearch, result.dynamicStaleTime);
        // If the navigation lock is active, wait for it to be released before
        // writing the dynamic data. This allows tests to assert on the prefetched
        // UI state.
        if (("TURBOPACK compile-time value", true) && navigationLock !== null) {
            await navigationLock;
        }
        // TODO: Implement Shell extraction as part of Cached Navigations.
        // Intentionally holding off on doing this until we decide how the Cached
        // Navigations behavior should work in combination with App Shells.
        if (routeCacheEntry !== null && result.staticStageData !== null) {
            const { response: staticStageResponse, isResponsePartial } = result.staticStageData;
            (0, _cache.resolveStaleAt)(now, staticStageResponse.s).then((staleAt)=>{
                const buildId = result.responseHeaders.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? staticStageResponse.b;
                (0, _cache.writePrerenderResponseIntoCache)(now, _types.FetchStrategy.PPR, staticStageResponse.f, buildId, staticStageResponse.h, staticStageResponse.r ?? null, staleAt, dynamicRequestTree, result.renderedSearch, isResponsePartial, map);
            }).catch(()=>{
            // The static stage processing failed. Not fatal — the navigation
            // completed normally, we just won't write into the cache.
            });
        }
        if (routeCacheEntry !== null && result.runtimePrefetchStream !== null) {
            (0, _cache.processRuntimePrefetchStream)(now, result.runtimePrefetchStream, dynamicRequestTree, result.renderedSearch).then((processed)=>{
                if (processed !== null) {
                    (0, _cache.writeDynamicRenderResponseIntoCache)(now, _types.FetchStrategy.PPRRuntime, processed.flightDatas, processed.buildId, processed.isResponsePartial, processed.headVaryParams, processed.rootVaryParamsIterable, processed.staleAt, processed.navigationSeed, null, map);
                }
            }).catch(()=>{
            // The runtime prefetch cache write failed. Not fatal — the
            // navigation completed normally, we just won't cache runtime data.
            });
        }
        // result.dynamicStaleTime is in seconds (from the server's `d` field).
        // Convert to an absolute timestamp using the centralized helper.
        const dynamicStaleAt = (0, _bfcache.computeDynamicStaleAt)(now, result.dynamicStaleTime);
        const didReceiveUnknownParallelRoute = writeDynamicDataIntoNavigationTask(task, seed.routeTree, seed.data, seed.head, dynamicStaleAt, result.debugInfo, result.revealAfter);
        const resolvedUrl = new URL(result.canonicalUrl, location.origin);
        // Decide whether the navigation needs to be retried.
        //
        // - A tree mismatch (unknown parallel route) means the data is incomplete,
        //   so we soft-retry and re-fetch the whole tree.
        // - Otherwise, the navigation committed the canonical URL from the route
        //   cache entry it used (a prediction or prefetch). If the request resolved
        //   to a *different* canonical URL — e.g. a middleware/proxy redirect the
        //   prediction didn't account for — then the committed URL is wrong and the
        //   route cache it came from is no longer reliable (the redirect implies a
        //   server change the prediction couldn't know about, like logging in or
        //   out). We re-resolve the route to invalidate the stale cache and correct
        //   the browser URL, reusing the data we just received rather than
        //   re-fetching it. When the entry already reflects the redirect (e.g. a
        //   prefetch that followed it), the committed URL matches and no retry is
        //   needed. See issue #95195.
        let didCommitWrongUrl = false;
        if (routeCacheEntry !== null) {
            const committedUrl = new URL(routeCacheEntry.canonicalUrl, location.origin);
            didCommitWrongUrl = committedUrl.pathname !== resolvedUrl.pathname || committedUrl.search !== resolvedUrl.search;
        }
        const exitStatus = didReceiveUnknownParallelRoute ? 1 : didCommitWrongUrl ? 3 : 0;
        return {
            exitStatus,
            url: resolvedUrl,
            seed
        };
    } catch  {
        if (signal?.aborted) {
            // A newer HMR refresh superseded this one and aborted its request. Treat
            // it as canceled rather than a failure, so we don't retry or
            // hard-navigate.
            return {
                exitStatus: -1,
                url,
                seed: null
            };
        }
        // This shouldn't happen because fetchServerResponse's entire body is
        // wrapped in a try/catch. If it does, though, it implies the server failed
        // to respond with any tree at all. So we must fall back to a hard retry.
        return {
            exitStatus: 2,
            url: url,
            seed: null
        };
    }
}
function writeDynamicDataIntoNavigationTask(task, serverRouteTree, dynamicData, dynamicHead, dynamicStaleAt, debugInfo, revealAfter) {
    if (task.status === 0 && dynamicData !== null) {
        task.status = 1;
        finishPendingCacheNode(task.node, dynamicData, dynamicHead, debugInfo, revealAfter);
        // Update the BFCache entry's staleAt for this segment with the value
        // from the dynamic response. This applies the per-page
        // unstable_dynamicStaleTime if set, or the default DYNAMIC_STALETIME_MS.
        // We only update segments that received dynamic data — static segments
        // are unaffected.
        (0, _bfcache.updateBFCacheEntryStaleAt)(serverRouteTree.varyPath, dynamicStaleAt);
    }
    const taskChildren = task.children;
    const serverChildren = serverRouteTree.slots;
    const dynamicDataChildren = dynamicData !== null ? dynamicData[1] : null;
    // Detect whether the server sends a parallel route slot that the client
    // doesn't know about.
    let didReceiveUnknownParallelRoute = false;
    if (taskChildren !== null) {
        if (serverChildren !== null) {
            for (const [parallelRouteKey, serverRouteTreeChild] of serverChildren){
                const dynamicDataChild = dynamicDataChildren !== null ? dynamicDataChildren[parallelRouteKey] : null;
                const taskChild = taskChildren.get(parallelRouteKey);
                if (taskChild === undefined) {
                    // The server sent a child segment that the client doesn't know about.
                    //
                    // When we receive an unknown parallel route, we must consider it a
                    // mismatch. This is unlike the case where the segment itself
                    // mismatches, because multiple routes can be active simultaneously.
                    // But a given layout should never have a mismatching set of
                    // child slots.
                    //
                    // Theoretically, this should only happen in development during an HMR
                    // refresh, because the set of parallel routes for a layout does not
                    // change over the lifetime of a build/deployment. In production, we
                    // should have already mismatched on either the build id or the segment
                    // path. But as an extra precaution, we validate in prod, too.
                    didReceiveUnknownParallelRoute = true;
                } else {
                    const taskSegment = taskChild.route[0];
                    const serverSegment = createSegmentFromRouteTree(serverRouteTreeChild);
                    if ((0, _matchsegments.matchSegment)(serverSegment, taskSegment) && dynamicDataChild !== null && dynamicDataChild !== undefined) {
                        // Found a match for this task. Keep traversing down the task tree.
                        const childDidReceiveUnknownParallelRoute = writeDynamicDataIntoNavigationTask(taskChild, serverRouteTreeChild, dynamicDataChild, dynamicHead, dynamicStaleAt, debugInfo, revealAfter);
                        if (childDidReceiveUnknownParallelRoute) {
                            didReceiveUnknownParallelRoute = true;
                        }
                    }
                }
            }
        } else {
            if (serverChildren !== null) {
                // The server sent a child segment that the client doesn't know about.
                didReceiveUnknownParallelRoute = true;
            }
        }
    }
    return didReceiveUnknownParallelRoute;
}
function finishPendingCacheNode(cacheNode, dynamicData, dynamicHead, debugInfo, revealAfter) {
    // Writes a dynamic response into an existing Cache Node tree. This does _not_
    // create a new tree, it updates the existing tree in-place. So it must follow
    // the Suspense rules of cache safety — it can resolve pending promises, but
    // it cannot overwrite existing data. It can add segments to the tree (because
    // a missing segment will cause the layout router to suspend).
    // but it cannot delete them.
    //
    // We must resolve every promise in the tree, or else it will suspend
    // indefinitely. If we did not receive data for a segment, we will resolve its
    // data promise to `null` to trigger a lazy fetch during render.
    // Use the dynamic data from the server to fulfill the deferred RSC promise
    // on the Cache Node.
    const rsc = cacheNode.rsc;
    const dynamicSegmentData = dynamicData[0];
    if (dynamicSegmentData === null) {
        // This is an empty CacheNode; this particular server request did not
        // render this segment. There may be a separate pending request that will,
        // though, so we won't abort the task until all pending requests finish.
        return;
    }
    if (rsc === null) {
        // This is a lazy cache node. We can overwrite it. This is only safe
        // because we know that the LayoutRouter suspends if `rsc` is `null`.
        cacheNode.rsc = dynamicSegmentData;
    } else if (isDeferredRsc(rsc)) {
        // This is a deferred RSC promise. We can fulfill it with the data we just
        // received from the server. If it was already resolved by a different
        // navigation, then this does nothing because we can't overwrite data.
        //
        // In the streaming dev render, defer the fill until `revealAfter` settles,
        // so React doesn't render the boundary's children before their row has been
        // decoded (otherwise it suspends on the still-pending children and commits
        // a premature fallback). Outside that render `revealAfter` is null and we
        // resolve immediately.
        if (revealAfter !== null) {
            const resolveRsc = ()=>rsc.resolve(dynamicSegmentData, debugInfo);
            // Use the same callback for both outcomes: we don't expect `revealAfter`
            // to reject, but if it ever did (e.g. a connection drop mid-stream) we'd
            // still want to resolve the RSC.
            revealAfter.then(resolveRsc, resolveRsc);
        } else {
            rsc.resolve(dynamicSegmentData, debugInfo);
        }
    } else {
    // This is not a deferred RSC promise, nor is it empty, so it must have
    // been populated by a different navigation. We must not overwrite it.
    }
    // Check if this is a leaf segment. If so, it will have a `head` property with
    // a pending promise that needs to be resolved with the dynamic head from
    // the server.
    const head = cacheNode.head;
    if (isDeferredRsc(head)) {
        head.resolve(dynamicHead, debugInfo);
    }
}
function abortRemainingPendingTasks(task, error, debugInfo) {
    let exitStatus;
    if (task.status === 0) {
        // The data for this segment is still missing.
        task.status = 2;
        abortPendingCacheNode(task.node, error, debugInfo);
        // If the server failed to fulfill the data for this segment, it implies
        // that the route tree received from the server mismatched the tree that
        // was previously prefetched.
        //
        // In an app with fully static routes and no proxy-driven redirects or
        // rewrites, this should never happen, because the route for a URL would
        // always be the same across multiple requests. So, this implies that some
        // runtime routing condition changed, likely in a proxy, without being
        // pushed to the client.
        //
        // When this happens, we treat this the same as a refresh(). The entire
        // tree will be re-rendered from the root.
        if (task.refreshState === null) {
            // Trigger a "soft" refresh. Essentially the same as calling `refresh()`
            // in a Server Action.
            exitStatus = 1;
        } else {
            // The mismatch was discovered inside an inactive parallel route. This
            // implies the inactive parallel route is no longer reachable at the URL
            // that originally rendered it. Fall back to an MPA refresh.
            // TODO: An alternative could be to trigger a soft refresh but to _not_
            // re-use the inactive parallel routes this time. Similar to what would
            // happen if were to do a hard refrehs, but without the HTML page.
            exitStatus = 2;
        }
    } else {
        // This segment finished. (An error here is treated as Done because they are
        // surfaced to the application during render.)
        exitStatus = 0;
    }
    const taskChildren = task.children;
    if (taskChildren !== null) {
        for (const [, taskChild] of taskChildren){
            const childExitStatus = abortRemainingPendingTasks(taskChild, error, debugInfo);
            // Propagate the exit status up the tree. The statuses are ordered by
            // their precedence.
            if (childExitStatus > exitStatus) {
                exitStatus = childExitStatus;
            }
        }
    }
    return exitStatus;
}
function abortPendingCacheNode(cacheNode, error, debugInfo) {
    const rsc = cacheNode.rsc;
    if (isDeferredRsc(rsc)) {
        if (error === null) {
            // This will trigger a lazy fetch during render.
            rsc.resolve(null, debugInfo);
        } else {
            // This will trigger an error during rendering.
            rsc.reject(error, debugInfo);
        }
    }
    // Check if this is a leaf segment. If so, it will have a `head` property with
    // a pending promise that needs to be resolved. If an error was provided, we
    // will not resolve it with an error, since this is rendered at the root of
    // the app. We want the segment to error, not the entire app.
    const head = cacheNode.head;
    if (isDeferredRsc(head)) {
        head.resolve(null, debugInfo);
    }
}
const DEFERRED = Symbol();
function isDeferredRsc(value) {
    return value && typeof value === 'object' && value.tag === DEFERRED;
}
function createDeferredRsc() {
    // Create an unresolved promise that represents data derived from a Flight
    // response. The promise will be resolved later as soon as we start receiving
    // data from the server, i.e. as soon as the Flight client decodes and returns
    // the top-level response object.
    // The `_debugInfo` field contains profiling information. Promises that are
    // created by Flight already have this info added by React; for any derived
    // promise created by the router, we need to transfer the Flight debug info
    // onto the derived promise.
    //
    // The debug info represents the latency between the start of the navigation
    // and the start of rendering. (It does not represent the time it takes for
    // whole stream to finish.)
    const debugInfo = [];
    let resolve;
    let reject;
    const pendingRsc = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    pendingRsc.status = 'pending';
    pendingRsc.resolve = (value, responseDebugInfo)=>{
        if (pendingRsc.status === 'pending') {
            const fulfilledRsc = pendingRsc;
            fulfilledRsc.status = 'fulfilled';
            fulfilledRsc.value = value;
            if (responseDebugInfo !== null) {
                // Transfer the debug info to the derived promise.
                debugInfo.push.apply(debugInfo, responseDebugInfo);
            }
            resolve(value);
        }
    };
    pendingRsc.reject = (error, responseDebugInfo)=>{
        if (pendingRsc.status === 'pending') {
            const rejectedRsc = pendingRsc;
            rejectedRsc.status = 'rejected';
            rejectedRsc.reason = error;
            if (responseDebugInfo !== null) {
                // Transfer the debug info to the derived promise.
                debugInfo.push.apply(debugInfo, responseDebugInfo);
            }
            reject(error);
        }
    };
    pendingRsc.tag = DEFERRED;
    pendingRsc._debugInfo = debugInfo;
    return pendingRsc;
}
function getCurrentNavigationLock() {
    if ("TURBOPACK compile-time truthy", 1) {
        const { getCurrentNavigationGate } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
        return getCurrentNavigationGate();
    }
    //TURBOPACK unreachable
    ;
}
function beginLockedNavigation() {
    if ("TURBOPACK compile-time truthy", 1) {
        const { beginLockedNavigation: begin } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
        return begin();
    }
    //TURBOPACK unreachable
    ;
}
function resetNavigationLockToPending() {
    if ("TURBOPACK compile-time truthy", 1) {
        const { resetNavigationLockToPending: reset } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
        reset();
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/reducers/committed-state.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getLastCommittedTree: null,
    setLastCommittedTree: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getLastCommittedTree: function() {
        return getLastCommittedTree;
    },
    setLastCommittedTree: function() {
        return setLastCommittedTree;
    }
});
// The tree from the last state that was committed to the browser history
// (i.e., the last state for which HistoryUpdater's useInsertionEffect ran).
// This lets the server-patch reducer distinguish between retrying a
// navigation that already pushed a history entry vs one whose transition
// suspended and never committed.
//
// Currently only used by the server-patch retry logic, but this module is a
// stepping stone toward a broader refactor of the navigation queue. The
// existing AppRouter action queue will eventually be replaced by a more
// reactive model that explicitly tracks pending vs committed navigation
// state. This file will likely evolve into (or be subsumed by) that new
// implementation.
let lastCommittedTree = null;
function getLastCommittedTree() {
    return lastCommittedTree;
}
function setLastCommittedTree(tree) {
    lastCommittedTree = tree;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/reducers/navigate-reducer.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DYNAMIC_STALETIME_MS: null,
    STATIC_STALETIME_MS: null,
    navigateReducer: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DYNAMIC_STALETIME_MS: function() {
        return DYNAMIC_STALETIME_MS;
    },
    STATIC_STALETIME_MS: function() {
        return STATIC_STALETIME_MS;
    },
    navigateReducer: function() {
        return navigateReducer;
    }
});
const _navigation = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation.js [app-ssr] (ecmascript)");
const _cache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache.js [app-ssr] (ecmascript)");
const _pprnavigations = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/ppr-navigations.js [app-ssr] (ecmascript)");
const DYNAMIC_STALETIME_MS = Number(("TURBOPACK compile-time value", "0")) * 1000;
const STATIC_STALETIME_MS = (0, _cache.getStaleTimeMs)(Number(("TURBOPACK compile-time value", "300")));
function navigateReducer(state, action) {
    const { url, isExternalUrl, navigateType, scrollBehavior } = action;
    if (isExternalUrl) {
        return (0, _navigation.completeHardNavigation)(state, url, navigateType);
    }
    // Handles case where `<meta http-equiv="refresh">` tag is present,
    // which will trigger an MPA navigation.
    if (document.getElementById('__next-page-redirect')) {
        return (0, _navigation.completeHardNavigation)(state, url, navigateType);
    }
    // Temporary glue code between the router reducer and the new navigation
    // implementation. Eventually we'll rewrite the router reducer to a
    // state machine.
    const currentUrl = new URL(state.canonicalUrl, location.origin);
    const currentRenderedSearch = state.renderedSearch;
    return (0, _navigation.navigate)(state, url, currentUrl, currentRenderedSearch, state.cache, state.tree, state.nextUrl, _pprnavigations.FreshnessPolicy.Default, scrollBehavior, navigateType);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/set-cache-busting-search-param.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    setCacheBustingSearchParam: null,
    setCacheBustingSearchParamWithHash: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    setCacheBustingSearchParam: function() {
        return setCacheBustingSearchParam;
    },
    setCacheBustingSearchParamWithHash: function() {
        return setCacheBustingSearchParamWithHash;
    }
});
const _cachebustingsearchparam = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/cache-busting-search-param.js [app-ssr] (ecmascript)");
const _approuterheaders = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/app-router-headers.js [app-ssr] (ecmascript)");
async function computeClientCacheBustingSearchParam(headers) {
    if (typeof globalThis.crypto?.subtle?.digest === 'function') {
        return (0, _cachebustingsearchparam.computeCacheBustingSearchParam)(headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER], headers[_approuterheaders.NEXT_ROUTER_SEGMENT_PREFETCH_HEADER], headers[_approuterheaders.NEXT_ROUTER_STATE_TREE_HEADER], headers[_approuterheaders.NEXT_URL]);
    }
    return (0, _cachebustingsearchparam.computeLegacyCacheBustingSearchParam)(headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER], headers[_approuterheaders.NEXT_ROUTER_SEGMENT_PREFETCH_HEADER], headers[_approuterheaders.NEXT_ROUTER_STATE_TREE_HEADER], headers[_approuterheaders.NEXT_URL]);
}
const setCacheBustingSearchParam = async (url, headers)=>{
    const uniqueCacheKey = await computeClientCacheBustingSearchParam(headers);
    setCacheBustingSearchParamWithHash(url, uniqueCacheKey);
};
const setCacheBustingSearchParamWithHash = (url, hash)=>{
    /**
   * Note that we intentionally do not use `url.searchParams.set` here:
   *
   * const url = new URL('https://example.com/search?q=custom%20spacing');
   * url.searchParams.set('_rsc', 'abc123');
   * console.log(url.toString()); // Outputs: https://example.com/search?q=custom+spacing&_rsc=abc123
   *                                                                             ^ <--- this is causing confusion
   * This is in fact intended based on https://url.spec.whatwg.org/#interface-urlsearchparams, but
   * we want to preserve the %20 as %20 if that's what the user passed in, hence the custom
   * logic below.
   */ const existingSearch = url.search;
    const rawQuery = existingSearch.startsWith('?') ? existingSearch.slice(1) : existingSearch;
    // Always remove any existing cache busting param and add a fresh one to ensure
    // we have the correct value based on current request headers
    const pairs = rawQuery.split('&').filter((pair)=>pair && !pair.startsWith(`${_approuterheaders.NEXT_RSC_UNION_QUERY}=`));
    if (hash.length > 0) {
        pairs.push(`${_approuterheaders.NEXT_RSC_UNION_QUERY}=${hash}`);
    } else {
        pairs.push(`${_approuterheaders.NEXT_RSC_UNION_QUERY}`);
    }
    url.search = pairs.length ? `?${pairs.join('&')}` : '';
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/bfcache.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    UnknownDynamicStaleTime: null,
    computeDynamicStaleAt: null,
    invalidateBfCache: null,
    readFromBFCache: null,
    readFromBFCacheDuringRegularNavigation: null,
    updateBFCacheEntryStaleAt: null,
    writeHeadToBFCache: null,
    writeToBFCache: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    UnknownDynamicStaleTime: function() {
        return UnknownDynamicStaleTime;
    },
    computeDynamicStaleAt: function() {
        return computeDynamicStaleAt;
    },
    invalidateBfCache: function() {
        return invalidateBfCache;
    },
    readFromBFCache: function() {
        return readFromBFCache;
    },
    readFromBFCacheDuringRegularNavigation: function() {
        return readFromBFCacheDuringRegularNavigation;
    },
    updateBFCacheEntryStaleAt: function() {
        return updateBFCacheEntryStaleAt;
    },
    writeHeadToBFCache: function() {
        return writeHeadToBFCache;
    },
    writeToBFCache: function() {
        return writeToBFCache;
    }
});
const _navigatereducer = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/reducers/navigate-reducer.js [app-ssr] (ecmascript)");
const _cachemap = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-map.js [app-ssr] (ecmascript)");
const UnknownDynamicStaleTime = -1;
function computeDynamicStaleAt(now, dynamicStaleTimeSeconds) {
    return dynamicStaleTimeSeconds !== UnknownDynamicStaleTime ? now + dynamicStaleTimeSeconds * 1000 : now + _navigatereducer.DYNAMIC_STALETIME_MS;
}
const bfcacheMap = (0, _cachemap.createCacheMap)();
let currentBfCacheVersion = 0;
function invalidateBfCache() {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function writeToBFCache(now, varyPath, rsc, prefetchRsc, head, prefetchHead, dynamicStaleAt, bfcacheId) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
    const entry = undefined;
    const isRevalidation = undefined;
}
function writeHeadToBFCache(now, varyPath, head, prefetchHead, dynamicStaleAt, bfcacheId) {
    // Read the special "segment" that represents the head data.
    writeToBFCache(now, varyPath, head, prefetchHead, null, null, dynamicStaleAt, bfcacheId);
}
function updateBFCacheEntryStaleAt(varyPath, newStaleAt) {
    if ("TURBOPACK compile-time truthy", 1) {
        return;
    }
    //TURBOPACK unreachable
    ;
    const isRevalidation = undefined;
    // Read with staleness bypass (-1) so we can update even stale entries
    const entry = undefined;
}
function readFromBFCache(varyPath) {
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
    const isRevalidation = undefined;
}
function readFromBFCacheDuringRegularNavigation(now, varyPath) {
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
    const isRevalidation = undefined;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-key.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// TypeScript trick to simulate opaque types, like in Flow.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createCacheKey: null,
    splitPathnameIntoParts: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createCacheKey: function() {
        return createCacheKey;
    },
    splitPathnameIntoParts: function() {
        return splitPathnameIntoParts;
    }
});
function createCacheKey(originalHref, nextUrl) {
    const originalUrl = new URL(originalHref);
    const cacheKey = {
        pathname: originalUrl.pathname,
        search: originalUrl.search,
        nextUrl: nextUrl
    };
    return cacheKey;
}
function splitPathnameIntoParts(pathname) {
    const parts = [];
    let start = 0;
    for(let i = 0; i < pathname.length; i++){
        if (pathname.charCodeAt(i) === 47 /* '/' */ ) {
            if (i > start) {
                parts.push(pathname.slice(start, i));
            }
            start = i + 1;
        }
    }
    if (start < pathname.length) {
        parts.push(pathname.slice(start));
    }
    return parts;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-map.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    EntryStatus: null,
    Fallback: null,
    createCacheMap: null,
    deleteFromCacheMap: null,
    deleteMapEntry: null,
    getFromCacheMap: null,
    isValueExpired: null,
    setInCacheMap: null,
    setSizeInCacheMap: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    EntryStatus: function() {
        return EntryStatus;
    },
    Fallback: function() {
        return Fallback;
    },
    createCacheMap: function() {
        return createCacheMap;
    },
    deleteFromCacheMap: function() {
        return deleteFromCacheMap;
    },
    deleteMapEntry: function() {
        return deleteMapEntry;
    },
    getFromCacheMap: function() {
        return getFromCacheMap;
    },
    isValueExpired: function() {
        return isValueExpired;
    },
    setInCacheMap: function() {
        return setInCacheMap;
    },
    setSizeInCacheMap: function() {
        return setSizeInCacheMap;
    }
});
const _lru = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/lru.js [app-ssr] (ecmascript)");
var EntryStatus = /*#__PURE__*/ function(EntryStatus) {
    EntryStatus[EntryStatus["Empty"] = 0] = "Empty";
    EntryStatus[EntryStatus["Pending"] = 1] = "Pending";
    EntryStatus[EntryStatus["Fulfilled"] = 2] = "Fulfilled";
    EntryStatus[EntryStatus["Rejected"] = 3] = "Rejected";
    return EntryStatus;
}({});
const Fallback = {};
// This is a special internal key that is used for "revalidation" entries. It's
// an implementation detail that shouldn't leak outside of this module.
const Revalidation = {};
function createCacheMap() {
    const cacheMap = {
        parent: null,
        key: null,
        value: null,
        map: null,
        // LRU-related fields
        prev: null,
        next: null,
        size: 0
    };
    return cacheMap;
}
function getOrInitialize(cacheMap, keys, isRevalidation) {
    // Go through each level of keys until we find the entry that matches, or
    // create a new entry if one doesn't exist.
    //
    // This function will only return entries that match the keypath _exactly_.
    // Unlike getWithFallback, it will not access fallback entries unless it's
    // explicitly part of the keypath.
    let entry = cacheMap;
    let remainingKeys = keys;
    let key = null;
    while(true){
        const previousKey = key;
        if (remainingKeys !== null) {
            key = remainingKeys.value;
            remainingKeys = remainingKeys.parent;
        } else if (isRevalidation && previousKey !== Revalidation) {
            // During a revalidation, we append an internal "Revalidation" key to
            // the end of the keypath. The "normal" entry is its parent.
            // However, if the parent entry is currently empty, we don't need to store
            // this as a revalidation entry. Just insert the revalidation into the
            // normal slot.
            if (entry.value === null) {
                return entry;
            }
            // Otheriwse, create a child entry.
            key = Revalidation;
        } else {
            break;
        }
        let map = entry.map;
        if (map !== null) {
            const existingEntry = map.get(key);
            if (existingEntry !== undefined) {
                // Found a match. Keep going.
                entry = existingEntry;
                continue;
            }
        } else {
            map = new Map();
            entry.map = map;
        }
        // No entry exists yet at this level. Create a new one.
        const newEntry = {
            parent: entry,
            key,
            value: null,
            map: null,
            // LRU-related fields
            prev: null,
            next: null,
            size: 0
        };
        map.set(key, newEntry);
        entry = newEntry;
    }
    return entry;
}
function getFromCacheMap(now, currentCacheVersion, rootEntry, keys, isRevalidation, // the lookup falls through to a less-specific Fallback entry. Use this
// during a navigation to prefer a Fulfilled shell entry over a more-specific
// Pending entry that may still be in-flight. Callers that want to also
// accept non-Fulfilled entries should perform a second lookup with this set
// to false.
onlyMatchFulfilled) {
    const entry = getEntryWithFallbackImpl(now, currentCacheVersion, rootEntry, keys, isRevalidation, 0, onlyMatchFulfilled);
    if (entry === null || entry.value === null) {
        return null;
    }
    // This is an LRU access. Move the entry to the front of the list.
    (0, _lru.lruPut)(entry);
    return entry.value;
}
function isValueExpired(now, currentCacheVersion, value) {
    return value.staleAt <= now || value.version < currentCacheVersion;
}
function lazilyEvictIfNeeded(now, currentCacheVersion, entry, onlyMatchFulfilled) {
    // We have a matching entry, but before we can return it, we need to check if
    // it's still fresh. Otherwise it should be treated the same as a cache miss.
    if (entry.value === null) {
        // This entry has no value, so there's nothing to evict.
        return entry;
    }
    const value = entry.value;
    if (isValueExpired(now, currentCacheVersion, value)) {
        // The value expired. Lazily evict it from the cache, and return null. This
        // is conceptually the same as a cache miss.
        deleteMapEntry(entry);
        return null;
    }
    if (onlyMatchFulfilled && value.status !== 2) {
        // The entry is fresh but is not Fulfilled. Treat as a non-match so the
        // recursion can continue and try a Fallback entry.
        return null;
    }
    // The matched entry has not expired. Return it.
    return entry;
}
function getEntryWithFallbackImpl(now, currentCacheVersion, entry, keys, isRevalidation, previousKey, onlyMatchFulfilled) {
    // This is similar to getExactEntry, but if an exact match is not found for
    // a key, it will return the fallback entry instead. This is recursive at
    // every level, e.g. an entry with keypath [a, Fallback, c, Fallback] is
    // valid match for [a, b, c, d].
    //
    // It will return the most specific match available.
    //
    // When `onlyMatchFulfilled` is true, terminal entries that aren't Fulfilled
    // are treated as non-matches, so the recursion will continue searching for
    // a Fallback match. See getFromCacheMap for the rationale.
    let key;
    let remainingKeys;
    if (keys !== null) {
        key = keys.value;
        remainingKeys = keys.parent;
    } else if (isRevalidation && previousKey !== Revalidation) {
        // During a revalidation, we append an internal "Revalidation" key to
        // the end of the keypath.
        key = Revalidation;
        remainingKeys = null;
    } else {
        // There are no more keys. This is the terminal entry.
        return lazilyEvictIfNeeded(now, currentCacheVersion, entry, onlyMatchFulfilled);
    }
    const map = entry.map;
    if (map !== null) {
        const existingEntry = map.get(key);
        if (existingEntry !== undefined) {
            // Found an exact match for this key. Keep searching.
            const result = getEntryWithFallbackImpl(now, currentCacheVersion, existingEntry, remainingKeys, isRevalidation, key, onlyMatchFulfilled);
            if (result !== null) {
                return result;
            }
        }
        // No match found for this key. Check if there's a fallback.
        const fallbackEntry = map.get(Fallback);
        if (fallbackEntry !== undefined) {
            // Found a fallback for this key. Keep searching.
            return getEntryWithFallbackImpl(now, currentCacheVersion, fallbackEntry, remainingKeys, isRevalidation, key, onlyMatchFulfilled);
        }
    }
    return null;
}
function setInCacheMap(cacheMap, keys, value, isRevalidation) {
    // Add a value to the map at the given keypath. If the value is already
    // part of the map, it's removed from its previous keypath. (NOTE: This is
    // unlike a regular JS map, but the behavior is intentional.)
    const entry = getOrInitialize(cacheMap, keys, isRevalidation);
    setMapEntryValue(entry, value);
    // This is an LRU access. Move the entry to the front of the list.
    (0, _lru.lruPut)(entry);
    (0, _lru.updateLruSize)(entry, value.size);
}
function setMapEntryValue(entry, value) {
    if (entry.value !== null) {
        // There's already a value at the given keypath. Disconnect the old value
        // from the map. We're not calling `deleteMapEntry` here because the
        // entry itself is still in the map. We just want to overwrite its value.
        dropRef(entry.value);
        entry.value = null;
    }
    // This value may already be in the map at a different keypath.
    // Grab a reference before we overwrite it.
    const oldEntry = value.ref;
    entry.value = value;
    value.ref = entry;
    (0, _lru.updateLruSize)(entry, value.size);
    if (oldEntry !== null && oldEntry !== entry && oldEntry.value === value) {
        // This value is already in the map at a different keypath in the map.
        // Values only exist at a single keypath at a time. Remove it from the
        // previous keypath.
        //
        // Note that only the internal map entry is garbage collected; we don't
        // call `dropRef` here because it's still in the map, just
        // at a new keypath (the one we just set, above).
        deleteMapEntry(oldEntry);
    }
}
function deleteFromCacheMap(value) {
    const entry = value.ref;
    if (entry === null) {
        // This value is not a member of any map.
        return;
    }
    dropRef(value);
    deleteMapEntry(entry);
}
function dropRef(value) {
    // Drop the value from the map by setting its `ref` backpointer to
    // null. This is a separate operation from `deleteMapEntry` because when
    // re-keying a value we need to be able to delete the old, internal map
    // entry without garbage collecting the value itself.
    value.ref = null;
}
function deleteMapEntry(entry) {
    // Delete the entry from the cache.
    entry.value = null;
    (0, _lru.deleteFromLru)(entry);
    // Check if we can garbage collect the entry.
    const map = entry.map;
    if (map === null) {
        // Since this entry has no value, and also no child entries, we can
        // garbage collect it. Remove it from its parent, and keep garbage
        // collecting the parents until we reach a non-empty entry.
        let parent = entry.parent;
        let key = entry.key;
        while(parent !== null){
            const parentMap = parent.map;
            if (parentMap !== null) {
                parentMap.delete(key);
                if (parentMap.size === 0) {
                    // We just removed the last entry in the parent map.
                    parent.map = null;
                    if (parent.value === null) {
                        // The parent node has no child entries, nor does it have a value
                        // on itself. It can be garbage collected. Keep going.
                        key = parent.key;
                        parent = parent.parent;
                        continue;
                    }
                }
            }
            break;
        }
    } else {
        // Check if there's a revalidating entry. If so, promote it to a
        // "normal" entry, since the normal one was just deleted.
        const revalidatingEntry = map.get(Revalidation);
        if (revalidatingEntry !== undefined && revalidatingEntry.value !== null) {
            setMapEntryValue(entry, revalidatingEntry.value);
        }
    }
}
function setSizeInCacheMap(value, size) {
    const entry = value.ref;
    if (entry === null) {
        // This value is not a member of any map.
        return;
    }
    // Except during initialization (when the size is set to 0), this is the only
    // place the `size` field should be updated, to ensure it's in sync with the
    // the LRU.
    value.size = size;
    (0, _lru.updateLruSize)(entry, size);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    EntryStatus: null,
    MetadataOnlyRequestTree: null,
    attemptToFulfillDynamicSegmentFromBFCache: null,
    attemptToUpgradeSegmentFromBFCache: null,
    canNewFetchStrategyProvideMoreContent: null,
    convertReusedFlightRouterStateToRouteTree: null,
    convertRootFlightRouterStateToRouteTree: null,
    convertRouteTreeToFlightRouterState: null,
    createDetachedSegmentCacheEntry: null,
    createMetadataRouteTree: null,
    createNonTaskyPrefetchResponseStream: null,
    deprecated_requestOptimisticRouteCacheEntry: null,
    fetchRouteOnCacheMiss: null,
    fetchSegmentPrefetchesUsingDynamicRequest: null,
    fetchSegmentsOnCacheMiss: null,
    fulfillRouteCacheEntry: null,
    getCurrentRouteCacheVersion: null,
    getCurrentSegmentCacheVersion: null,
    getStaleTimeMs: null,
    invalidateEntirePrefetchCache: null,
    invalidateRouteCacheEntries: null,
    invalidateSegmentCacheEntries: null,
    markRouteEntryAsDynamicRewrite: null,
    overwriteRevalidatingSegmentCacheEntry: null,
    pingInvalidationListeners: null,
    processRuntimePrefetchStream: null,
    readOrCreateRevalidatingSegmentEntry: null,
    readOrCreateRouteCacheEntry: null,
    readOrCreateSegmentCacheEntry: null,
    readRouteCacheEntry: null,
    readSegmentCacheEntryForNavigation: null,
    resolveStaleAt: null,
    segmentCacheMap: null,
    stripIsPartialByte: null,
    upgradeToPendingSegment: null,
    upsertSegmentEntry: null,
    waitForSegmentCacheEntry: null,
    writeDynamicRenderResponseIntoCache: null,
    writePrerenderResponseIntoCache: null,
    writeRouteIntoCache: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    EntryStatus: function() {
        return _cachemap.EntryStatus;
    },
    MetadataOnlyRequestTree: function() {
        return MetadataOnlyRequestTree;
    },
    attemptToFulfillDynamicSegmentFromBFCache: function() {
        return attemptToFulfillDynamicSegmentFromBFCache;
    },
    attemptToUpgradeSegmentFromBFCache: function() {
        return attemptToUpgradeSegmentFromBFCache;
    },
    canNewFetchStrategyProvideMoreContent: function() {
        return canNewFetchStrategyProvideMoreContent;
    },
    convertReusedFlightRouterStateToRouteTree: function() {
        return convertReusedFlightRouterStateToRouteTree;
    },
    convertRootFlightRouterStateToRouteTree: function() {
        return convertRootFlightRouterStateToRouteTree;
    },
    convertRouteTreeToFlightRouterState: function() {
        return convertRouteTreeToFlightRouterState;
    },
    createDetachedSegmentCacheEntry: function() {
        return createDetachedSegmentCacheEntry;
    },
    createMetadataRouteTree: function() {
        return createMetadataRouteTree;
    },
    createNonTaskyPrefetchResponseStream: function() {
        return createNonTaskyPrefetchResponseStream;
    },
    deprecated_requestOptimisticRouteCacheEntry: function() {
        return deprecated_requestOptimisticRouteCacheEntry;
    },
    fetchRouteOnCacheMiss: function() {
        return fetchRouteOnCacheMiss;
    },
    fetchSegmentPrefetchesUsingDynamicRequest: function() {
        return fetchSegmentPrefetchesUsingDynamicRequest;
    },
    fetchSegmentsOnCacheMiss: function() {
        return fetchSegmentsOnCacheMiss;
    },
    fulfillRouteCacheEntry: function() {
        return fulfillRouteCacheEntry;
    },
    getCurrentRouteCacheVersion: function() {
        return getCurrentRouteCacheVersion;
    },
    getCurrentSegmentCacheVersion: function() {
        return getCurrentSegmentCacheVersion;
    },
    getStaleTimeMs: function() {
        return getStaleTimeMs;
    },
    invalidateEntirePrefetchCache: function() {
        return invalidateEntirePrefetchCache;
    },
    invalidateRouteCacheEntries: function() {
        return invalidateRouteCacheEntries;
    },
    invalidateSegmentCacheEntries: function() {
        return invalidateSegmentCacheEntries;
    },
    markRouteEntryAsDynamicRewrite: function() {
        return markRouteEntryAsDynamicRewrite;
    },
    overwriteRevalidatingSegmentCacheEntry: function() {
        return overwriteRevalidatingSegmentCacheEntry;
    },
    pingInvalidationListeners: function() {
        return pingInvalidationListeners;
    },
    processRuntimePrefetchStream: function() {
        return processRuntimePrefetchStream;
    },
    readOrCreateRevalidatingSegmentEntry: function() {
        return readOrCreateRevalidatingSegmentEntry;
    },
    readOrCreateRouteCacheEntry: function() {
        return readOrCreateRouteCacheEntry;
    },
    readOrCreateSegmentCacheEntry: function() {
        return readOrCreateSegmentCacheEntry;
    },
    readRouteCacheEntry: function() {
        return readRouteCacheEntry;
    },
    readSegmentCacheEntryForNavigation: function() {
        return readSegmentCacheEntryForNavigation;
    },
    resolveStaleAt: function() {
        return resolveStaleAt;
    },
    segmentCacheMap: function() {
        return segmentCacheMap;
    },
    stripIsPartialByte: function() {
        return stripIsPartialByte;
    },
    upgradeToPendingSegment: function() {
        return upgradeToPendingSegment;
    },
    upsertSegmentEntry: function() {
        return upsertSegmentEntry;
    },
    waitForSegmentCacheEntry: function() {
        return waitForSegmentCacheEntry;
    },
    writeDynamicRenderResponseIntoCache: function() {
        return writeDynamicRenderResponseIntoCache;
    },
    writePrerenderResponseIntoCache: function() {
        return writePrerenderResponseIntoCache;
    },
    writeRouteIntoCache: function() {
        return writeRouteIntoCache;
    }
});
const _approutertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)");
const _varyparamsdecoding = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment-cache/vary-params-decoding.js [app-ssr] (ecmascript)");
const _approuterheaders = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/app-router-headers.js [app-ssr] (ecmascript)");
const _fetchserverresponse = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/fetch-server-response.js [app-ssr] (ecmascript)");
const _fetch = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/fetch.js [app-ssr] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/scheduler.js [app-ssr] (ecmascript)");
const _varypath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/vary-path.js [app-ssr] (ecmascript)");
const _createhreffromurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/create-href-from-url.js [app-ssr] (ecmascript)");
const _cachekey = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-key.js [app-ssr] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/route-params.js [app-ssr] (ecmascript)");
const _cachemap = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-map.js [app-ssr] (ecmascript)");
const _segmentvalueencoding = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment-cache/segment-value-encoding.js [app-ssr] (ecmascript)");
const _flightdatahelpers = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/flight-data-helpers.js [app-ssr] (ecmascript)");
const _navigatereducer = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/reducers/navigate-reducer.js [app-ssr] (ecmascript)");
const _links = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/links.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _types = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)");
const _promisewithresolvers = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/promise-with-resolvers.js [app-ssr] (ecmascript)");
const _bfcache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/bfcache.js [app-ssr] (ecmascript)");
const _optimisticroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/optimistic-routes.js [app-ssr] (ecmascript)");
const _navigation = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation.js [app-ssr] (ecmascript)");
const _navigationbuildid = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/navigation-build-id.js [app-ssr] (ecmascript)");
const _constants = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/constants.js [app-ssr] (ecmascript)");
function getStaleTimeMs(staleTimeSeconds) {
    return Math.max(staleTimeSeconds, 30) * 1000;
}
const isOutputExportMode = ("TURBOPACK compile-time value", "development") === 'production' && ("TURBOPACK compile-time value", "standalone") === 'export';
const MetadataOnlyRequestTree = [
    '',
    {},
    null,
    'metadata-only'
];
const routeCacheMap = (0, _cachemap.createCacheMap)();
const segmentCacheMap = (0, _cachemap.createCacheMap)();
// All invalidation listeners for the whole cache are tracked in single set.
// Since we don't yet support tag or path-based invalidation, there's no point
// tracking them any more granularly than this. Once we add granular
// invalidation, that may change, though generally the model is to just notify
// the listeners and allow the caller to poll the prefetch cache with a new
// prefetch task if desired.
let invalidationListeners = null;
// Incrementing counters used to track cache invalidations. Route and segment
// caches have separate versions so they can be invalidated independently.
// Invalidation does not eagerly evict anything from the cache; entries are
// lazily evicted when read.
let currentRouteCacheVersion = 0;
let currentSegmentCacheVersion = 0;
function getCurrentRouteCacheVersion() {
    return currentRouteCacheVersion;
}
function getCurrentSegmentCacheVersion() {
    return currentSegmentCacheVersion;
}
function invalidateEntirePrefetchCache(nextUrl, tree) {
    currentRouteCacheVersion++;
    currentSegmentCacheVersion++;
    (0, _links.pingVisibleLinks)(nextUrl, tree);
    pingInvalidationListeners(nextUrl, tree);
}
function invalidateRouteCacheEntries(nextUrl, tree) {
    currentRouteCacheVersion++;
    (0, _links.pingVisibleLinks)(nextUrl, tree);
    pingInvalidationListeners(nextUrl, tree);
}
function invalidateSegmentCacheEntries(nextUrl, tree) {
    currentSegmentCacheVersion++;
    (0, _links.pingVisibleLinks)(nextUrl, tree);
    pingInvalidationListeners(nextUrl, tree);
}
function attachInvalidationListener(task) {
    // This function is called whenever a prefetch task reads a cache entry. If
    // the task has an onInvalidate function associated with it — i.e. the one
    // optionally passed to router.prefetch(onInvalidate) — then we attach that
    // listener to the every cache entry that the task reads. Then, if an entry
    // is invalidated, we call the function.
    if (task.onInvalidate !== null) {
        if (invalidationListeners === null) {
            invalidationListeners = new Set([
                task
            ]);
        } else {
            invalidationListeners.add(task);
        }
    }
}
function notifyInvalidationListener(task) {
    const onInvalidate = task.onInvalidate;
    if (onInvalidate !== null) {
        // Clear the callback from the task object to guarantee it's not called more
        // than once.
        task.onInvalidate = null;
        // This is a user-space function, so we must wrap in try/catch.
        try {
            onInvalidate();
        } catch (error) {
            if (typeof reportError === 'function') {
                reportError(error);
            } else {
                console.error(error);
            }
        }
    }
}
function pingInvalidationListeners(nextUrl, tree) {
    // The rough equivalent of pingVisibleLinks, but for onInvalidate callbacks.
    // This is called when the Next-Url or the base tree changes, since those
    // may affect the result of a prefetch task. It's also called after a
    // cache invalidation.
    if (invalidationListeners !== null) {
        const tasks = invalidationListeners;
        invalidationListeners = null;
        for (const task of tasks){
            if ((0, _scheduler.isPrefetchTaskDirty)(task, nextUrl, tree)) {
                notifyInvalidationListener(task);
            }
        }
    }
}
function readRouteCacheEntry(now, key) {
    const varyPath = (0, _varypath.getRouteVaryPath)(key.pathname, key.search, key.nextUrl);
    const isRevalidation = false;
    const existingEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentRouteCacheVersion(), routeCacheMap, varyPath, isRevalidation, false);
    if (existingEntry !== null) {
        return existingEntry;
    }
    // No cache hit. Attempt to construct from template using the new
    // optimistic routing mechanism (pattern-based matching).
    if ("TURBOPACK compile-time truthy", 1) {
        return (0, _optimisticroutes.matchKnownRoute)(now, key.pathname, key.search);
    }
    //TURBOPACK unreachable
    ;
}
function readSegmentCacheEntryForNavigation(now, // map, or the shared map otherwise.
map, varyPath, restrictToShell = false) {
    const isRevalidation = false;
    let lookupVaryPath = varyPath;
    if (("TURBOPACK compile-time value", true) && restrictToShell) {
        // Instant Navigation Testing API: we're navigating to a link that 1) has
        // Partial Prefetching enabled, and 2) does not have a prefetch prop set.
        // Only the shell may render, not anything that varies on concrete route
        // params.
        lookupVaryPath = (0, _varypath.getShellSegmentVaryPath)(varyPath);
    }
    // Prefer a Fulfilled entry (e.g. a cached shell) over a more-specific
    // Pending/Rejected one so it renders immediately instead of blocking on an
    // in-flight entry.
    const fulfilled = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, lookupVaryPath, isRevalidation, true);
    if (fulfilled !== null) {
        return fulfilled;
    }
    return (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, lookupVaryPath, isRevalidation, false);
}
function readRevalidatingSegmentCacheEntry(now, map, varyPath) {
    const isRevalidation = true;
    return (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, varyPath, isRevalidation, false);
}
function waitForSegmentCacheEntry(pendingEntry) {
    // Because the entry is pending, there's already a in-progress request.
    // Attach a promise to the entry that will resolve when the server responds.
    let promiseWithResolvers = pendingEntry.promise;
    if (promiseWithResolvers === null) {
        promiseWithResolvers = pendingEntry.promise = (0, _promisewithresolvers.createPromiseWithResolvers)();
    } else {
    // There's already a promise we can use
    }
    return promiseWithResolvers.promise;
}
function createDetachedRouteCacheEntry() {
    return {
        canonicalUrl: null,
        status: _cachemap.EntryStatus.Empty,
        blockedTasks: null,
        tree: null,
        metadata: null,
        // This is initialized to true because we don't know yet whether the route
        // could be intercepted. It's only set to false once we receive a response
        // from the server.
        couldBeIntercepted: true,
        // Similarly, we don't yet know if the route supports PPR.
        supportsPerSegmentPrefetching: false,
        hasDynamicRewrite: false,
        renderedSearch: null,
        // Map-related fields
        ref: null,
        size: 0,
        // Since this is an empty entry, there's no reason to ever evict it. It will
        // be updated when the data is populated.
        staleAt: Infinity,
        version: getCurrentRouteCacheVersion()
    };
}
function readOrCreateRouteCacheEntry(now, task, key) {
    attachInvalidationListener(task);
    const existingEntry = readRouteCacheEntry(now, key);
    if (existingEntry !== null) {
        return existingEntry;
    }
    // Create a pending entry and add it to the cache.
    const pendingEntry = createDetachedRouteCacheEntry();
    const varyPath = (0, _varypath.getRouteVaryPath)(key.pathname, key.search, key.nextUrl);
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(routeCacheMap, varyPath, pendingEntry, isRevalidation);
    return pendingEntry;
}
function deprecated_requestOptimisticRouteCacheEntry(now, requestedUrl, nextUrl) {
    // This function is called during a navigation when there was no matching
    // route tree in the prefetch cache. Before de-opting to a blocking,
    // unprefetched navigation, we will first attempt to construct an "optimistic"
    // route tree by checking the cache for similar routes.
    //
    // Check if there's a route with the same pathname, but with different
    // search params. We can then base our optimistic route tree on this entry.
    //
    // Conceptually, we are simulating what would happen if we did perform a
    // prefetch the requested URL, under the assumption that the server will
    // not redirect or rewrite the request in a different manner than the
    // base route tree. This assumption might not hold, in which case we'll have
    // to recover when we perform the dynamic navigation request. However, this
    // is what would happen if a route were dynamically rewritten/redirected
    // in between the prefetch and the navigation. So the logic needs to exist
    // to handle this case regardless.
    // Look for a route with the same pathname, but with an empty search string.
    // TODO: There's nothing inherently special about the empty search string;
    // it's chosen somewhat arbitrarily, with the rationale that it's the most
    // likely one to exist. But we should update this to match _any_ search
    // string. The plan is to generalize this logic alongside other improvements
    // related to "fallback" cache entries.
    const requestedSearch = requestedUrl.search;
    if (requestedSearch === '') {
        // The caller would have already checked if a route with an empty search
        // string is in the cache. So we can bail out here.
        return null;
    }
    const urlWithoutSearchParams = new URL(requestedUrl);
    urlWithoutSearchParams.search = '';
    const routeWithNoSearchParams = readRouteCacheEntry(now, (0, _cachekey.createCacheKey)(urlWithoutSearchParams.href, nextUrl));
    if (routeWithNoSearchParams === null || routeWithNoSearchParams.status !== _cachemap.EntryStatus.Fulfilled) {
        // Bail out of constructing an optimistic route tree. This will result in
        // a blocking, unprefetched navigation.
        return null;
    }
    // Now we have a base route tree we can "patch" with our optimistic values.
    // Optimistically assume that redirects for the requested pathname do
    // not vary on the search string. Therefore, if the base route was
    // redirected to a different search string, then the optimistic route
    // should be redirected to the same search string. Otherwise, we use
    // the requested search string.
    const canonicalUrlForRouteWithNoSearchParams = new URL(routeWithNoSearchParams.canonicalUrl, requestedUrl.origin);
    const optimisticCanonicalSearch = canonicalUrlForRouteWithNoSearchParams.search !== '' ? canonicalUrlForRouteWithNoSearchParams.search : requestedSearch;
    // Similarly, optimistically assume that rewrites for the requested
    // pathname do not vary on the search string. Therefore, if the base
    // route was rewritten to a different search string, then the optimistic
    // route should be rewritten to the same search string. Otherwise, we use
    // the requested search string.
    const optimisticRenderedSearch = routeWithNoSearchParams.renderedSearch !== '' ? routeWithNoSearchParams.renderedSearch : requestedSearch;
    const optimisticUrl = new URL(routeWithNoSearchParams.canonicalUrl, location.origin);
    optimisticUrl.search = optimisticCanonicalSearch;
    const optimisticCanonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(optimisticUrl);
    const optimisticRouteTree = deprecated_createOptimisticRouteTree(routeWithNoSearchParams.tree, optimisticRenderedSearch);
    const optimisticMetadataTree = deprecated_createOptimisticRouteTree(routeWithNoSearchParams.metadata, optimisticRenderedSearch);
    // Clone the base route tree, and override the relevant fields with our
    // optimistic values.
    const optimisticEntry = {
        canonicalUrl: optimisticCanonicalUrl,
        status: _cachemap.EntryStatus.Fulfilled,
        // This isn't cloned because it's instance-specific
        blockedTasks: null,
        tree: optimisticRouteTree,
        metadata: optimisticMetadataTree,
        couldBeIntercepted: routeWithNoSearchParams.couldBeIntercepted,
        supportsPerSegmentPrefetching: routeWithNoSearchParams.supportsPerSegmentPrefetching,
        hasDynamicRewrite: routeWithNoSearchParams.hasDynamicRewrite,
        // Override the rendered search with the optimistic value.
        renderedSearch: optimisticRenderedSearch,
        // Map-related fields
        ref: null,
        size: 0,
        staleAt: routeWithNoSearchParams.staleAt,
        version: routeWithNoSearchParams.version
    };
    // Do not insert this entry into the cache. It only exists so we can
    // perform the current navigation. Just return it to the caller.
    return optimisticEntry;
}
function deprecated_createOptimisticRouteTree(tree, newRenderedSearch) {
    // Create a new route tree that identical to the original one except for
    // the rendered search string, which is contained in the vary path.
    let clonedSlots = null;
    const originalSlots = tree.slots;
    if (originalSlots !== null) {
        clonedSlots = new Map();
        for (const [parallelRouteKey, childTree] of originalSlots){
            clonedSlots.set(parallelRouteKey, deprecated_createOptimisticRouteTree(childTree, newRenderedSearch));
        }
    }
    // We only need to clone the vary path if the route is a page.
    if (tree.isPage) {
        // The shell vary path Fallbacks search params, so it's unaffected by the
        // new rendered search and can be reused as-is.
        return {
            requestKey: tree.requestKey,
            segment: tree.segment,
            shellVaryPath: tree.shellVaryPath,
            refreshState: tree.refreshState,
            varyPath: (0, _varypath.clonePageVaryPathWithNewSearchParams)(tree.varyPath, newRenderedSearch),
            isPage: true,
            slots: clonedSlots,
            prefetchHints: tree.prefetchHints
        };
    }
    return {
        requestKey: tree.requestKey,
        segment: tree.segment,
        shellVaryPath: tree.shellVaryPath,
        refreshState: tree.refreshState,
        varyPath: tree.varyPath,
        isPage: false,
        slots: clonedSlots,
        prefetchHints: tree.prefetchHints
    };
}
function readOrCreateSegmentCacheEntry(now, // captured when the task was scheduled).
map, fetchStrategy, tree) {
    const existingEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, tree.varyPath, false, false);
    if (existingEntry !== null) {
        return existingEntry;
    }
    return insertEmptySegmentCacheEntry(now, map, fetchStrategy, tree);
}
/**
 * Creates an empty segment cache entry and inserts it into the cache, keyed
 * at the vary path a request made with the given fetch strategy is stored
 * under. The stale time is set to a default value; the actual stale time will
 * be set when the entry is fulfilled with data from the server response.
 */ function insertEmptySegmentCacheEntry(now, map, fetchStrategy, tree) {
    const varyPathForRequest = (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
    const emptyEntry = createDetachedSegmentCacheEntry(now);
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(map, varyPathForRequest, emptyEntry, isRevalidation);
    return emptyEntry;
}
function readOrCreateRevalidatingSegmentEntry(now, map, fetchStrategy, tree) {
    // This function is called when we've already confirmed that a particular
    // segment is cached, but we want to perform another request anyway in case it
    // returns more complete and/or fresher data than we already have. The logic
    // for deciding whether to replace the existing entry is handled elsewhere;
    // this function just handles retrieving a cache entry that we can use to
    // track the revalidation.
    //
    // The reason revalidations are stored in the cache is because we need to be
    // able to dedupe multiple revalidation requests. The reason they have to be
    // handled specially is because we shouldn't overwrite a "normal" entry if
    // one exists at the same keypath. So, for each internal cache location, there
    // is a special "revalidation" slot that is used solely for this purpose.
    //
    // You can think of it as if all the revalidation entries were stored in a
    // separate cache map from the canonical entries, and then transfered to the
    // canonical cache map once the request is complete — this isn't how it's
    // actually implemented, since it's more efficient to store them in the same
    // data structure as the normal entries, but that's how it's modeled
    // conceptually.
    // TODO: Once we implement Fallback behavior for params, where an entry is
    // re-keyed based on response information, we'll need to account for the
    // possibility that the keypath of the previous entry is more generic than
    // the keypath of the revalidating entry. In other words, the server could
    // return a less generic entry upon revalidation. For now, though, this isn't
    // a concern because the keypath is based solely on the prefetch strategy,
    // not on data contained in the response.
    const existingEntry = readRevalidatingSegmentCacheEntry(now, map, tree.varyPath);
    if (existingEntry !== null) {
        return existingEntry;
    }
    // Create a pending entry and add it to the cache. The stale time is set to a
    // default value; the actual stale time will be set when the entry is
    // fulfilled with data from the server response.
    const varyPathForRequest = (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
    const pendingEntry = createDetachedSegmentCacheEntry(now);
    const isRevalidation = true;
    (0, _cachemap.setInCacheMap)(map, varyPathForRequest, pendingEntry, isRevalidation);
    return pendingEntry;
}
function overwriteRevalidatingSegmentCacheEntry(now, map, fetchStrategy, tree) {
    // This function is called when we've already decided to replace an existing
    // revalidation entry. Create a new entry and write it into the cache,
    // overwriting the previous value. The stale time is set to a default value;
    // the actual stale time will be set when the entry is fulfilled with data
    // from the server response.
    const varyPathForRequest = (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
    const pendingEntry = createDetachedSegmentCacheEntry(now);
    const isRevalidation = true;
    (0, _cachemap.setInCacheMap)(map, varyPathForRequest, pendingEntry, isRevalidation);
    return pendingEntry;
}
/**
 * Whether an existing cache entry is preferred over an incoming candidate —
 * i.e. the candidate does NOT supersede it. (On an exact tie — same fetch
 * strategy, same partialness — this returns false, so the candidate replaces
 * the existing entry.) This is the precedence rule used both when deciding
 * whether an upsert may replace the entry at its own keypath, and when
 * deciding whether an entry at a more specific keypath may be evicted because
 * it shadows a just-inserted candidate (see `evictShadowingSegmentEntries`).
 *
 * Note that "less/more specific" in the comments below refers to fetch
 * strategy content tiers (how much content a strategy can produce), not the
 * vary-path specificity the eviction docs are concerned with.
 */ function isExistingSegmentEntryPreferred(existingEntry, candidateEntry) {
    return(// strategy than the segment we already have in the cache, so it can't
    // have more content.
    candidateEntry.fetchStrategy !== existingEntry.fetchStrategy && !canNewFetchStrategyProvideMoreContent(existingEntry.fetchStrategy, candidateEntry.fetchStrategy) || // The existing entry isn't partial, but the new one is.
    // (TODO: can this be true if `candidateEntry.fetchStrategy >= existingEntry.fetchStrategy`?)
    !existingEntry.isPartial && candidateEntry.isPartial);
}
function upsertSegmentEntry(now, // operates in. Prefetch response-write paths pass the spawning task's map
// (`PrefetchTask.segmentCacheMap`), so a response that lands after a
// testing-lock scope boundary still writes into the map its entries
// live in.
map, varyPath, candidateEntry, // against (all concrete param values, i.e. `tree.varyPath`) — the most
// specific path a read would use. Note this is the opposite of the
// generalized keying path that `getSegmentVaryPathForRequest` computes.
// Used to detect and evict stale entries at more specific keypaths that
// would otherwise shadow the candidate. Pass null when there's no request
// context; the shadow check is skipped.
lookupVaryPath) {
    // We have a new entry that has not yet been inserted into the cache. Before
    // we do so, we need to confirm whether it takes precedence over the existing
    // entry (if one exists).
    // TODO: We should not upsert an entry if its key was invalidated in the time
    // since the request was made. We can do that by passing the "owner" entry to
    // this function and confirming it's the same as `existingEntry`.
    if ((0, _cachemap.isValueExpired)(now, getCurrentSegmentCacheVersion(), candidateEntry)) {
        // The entry is expired. We cannot upsert it.
        return null;
    }
    const existingEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, varyPath, false, false);
    if (existingEntry !== null) {
        // Don't replace a more specific segment with a less-specific one. A case where this
        // might happen is if the existing segment was fetched via
        // `<Link prefetch={true}>`.
        if (isExistingSegmentEntryPreferred(existingEntry, candidateEntry)) {
            // The candidate does not supersede the existing entry. Leave the
            // existing entry in place and discard the candidate by not inserting it.
            //
            // We must not mutate the candidate here (e.g. downgrade it to Rejected or
            // null out its `rsc`). The caller does not transfer exclusive ownership
            // of it: it may already have been fulfilled, resolving its promise to a
            // waiter that holds the entry and reads `rsc` off it later. A navigation
            // seed is such a waiter, via `waitForSegmentCacheEntry`. Nulling `rsc`
            // after the fact resolves that read to `null`, so the waiter loses the
            // data it was about to render. Declining to insert it is enough: the
            // existing entry stays canonical, and the candidate keeps its valid (if
            // less complete) data for any waiter that already took it.
            return null;
        }
        // Ping any tasks blocked on the existing entry before replacing it so they
        // re-run and pick up the new entry. Without this, tasks waiting on the
        // existing Empty/Pending entry would be stranded — the new fulfilled
        // candidate has no blockedTasks of its own.
        if (existingEntry.status === _cachemap.EntryStatus.Empty || existingEntry.status === _cachemap.EntryStatus.Pending) {
            pingBlockedTasks(existingEntry);
        }
    // Replace the existing entry by writing the candidate over its keypath
    // below (the same mechanism `overwriteRevalidatingSegmentCacheEntry`
    // uses). We intentionally do NOT call `deleteFromCacheMap` first: deleting
    // vacates the canonical slot, and `deleteMapEntry` promotes a pending
    // Revalidation-slot entry into the vacated slot — which the immediate
    // insert below would then silently overwrite. The in-flight revalidation
    // would vanish from the map, so the next scheduler pass would find an
    // empty revalidation slot and spawn a duplicate request instead of
    // deduping against it. Replacing in place never vacates the slot, so
    // promotion never runs and the pending revalidating entry stays in its
    // Revalidation slot where `readOrCreateRevalidatingSegmentEntry`'s dedupe
    // finds it.
    //
    // The displaced entry's map/LRU accounting is handled by the replacement
    // itself: `setMapEntryValue` drops the displaced value's `ref` and
    // `updateLruSize` swaps its size for the candidate's, which is exactly
    // what delete-then-insert did.
    }
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(map, varyPath, candidateEntry, isRevalidation);
    if (lookupVaryPath !== null) {
        evictShadowingSegmentEntries(now, map, lookupVaryPath, candidateEntry);
    }
    return candidateEntry;
}
/**
 * Evicts stale entries at more specific keypaths that shadow a just-inserted
 * candidate entry.
 *
 * A response can be written to the cache at a MORE GENERIC vary path than the
 * path the request was issued against — for example, the server may report
 * that a segment doesn't vary on a param, so the entry is re-keyed with that
 * param as Fallback. Meanwhile, an older, less useful entry can exist at a
 * more specific path within the same fallback chain — for example, a partial
 * shell entry keyed with root params concrete (see
 * `getShellSegmentVaryPath`). Because segment lookup is
 * most-specific-match-wins, every subsequent read at the concrete request
 * path keeps returning the stale specific entry, and the more complete
 * generic entry is unreachable from that URL. That both wastes the completed
 * request and can loop: a prefetch task that revalidated the segment reads
 * back the same stale entry, decides it needs to revalidate again, and
 * repeats forever.
 *
 * The upsert is the one moment we know the ordering between the two entries:
 * the candidate was produced by a request for this segment position, and
 * `lookupVaryPath` is the fully concrete path a read for that position
 * resolves against, so any entry that a read at that path would return in the
 * candidate's stead is directly comparable to it. If such an entry is settled
 * and the candidate supersedes it — under the same precedence rules the
 * upsert applies at its own keypath — we know we never want to match against
 * it again, so delete it, making the candidate reachable.
 *
 * Non-settled entries are never evicted here: a Pending entry is owned by an
 * in-flight request that will settle it, and an Empty entry is a placeholder
 * that a scheduler pass may still claim and upgrade.
 */ function evictShadowingSegmentEntries(now, map, lookupVaryPath, candidateEntry) {
    // There can in principle be multiple shadowing entries at successively less
    // specific keypaths, so loop until the read returns the candidate (or an
    // entry we don't supersede). Each iteration re-reads and re-checks from
    // scratch (in part because `deleteFromCacheMap` can promote a settled
    // Revalidation-slot value into the just-vacated slot, surfacing a new entry
    // at the same keypath). Each iteration deletes an entry from the map, so
    // the loop terminates naturally; the bound is defensive, and 32 is far
    // beyond any real fallback chain, which is bounded by the vary
    // path's length.
    for(let i = 0; i < 32; i++){
        const shadowEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, lookupVaryPath, false, false);
        if (shadowEntry === null || shadowEntry === candidateEntry) {
            // The candidate is reachable from the lookup path (or the read missed
            // entirely, e.g. because the candidate expired). Done.
            return;
        }
        if (shadowEntry.status !== _cachemap.EntryStatus.Fulfilled && shadowEntry.status !== _cachemap.EntryStatus.Rejected) {
            // Only settled entries may be evicted. A Pending entry is held by an
            // in-flight request and will settle on its own.
            return;
        }
        if (isExistingSegmentEntryPreferred(shadowEntry, candidateEntry)) {
            // The shadowing entry is preferred over the candidate (e.g. it's a
            // complete entry fetched with a more specific strategy). Leave it —
            // reads at this path should keep matching it.
            return;
        }
        // The candidate supersedes the shadowing entry. Evict it. Settled entries
        // shouldn't have blocked tasks (Fulfilled always has `blockedTasks:
        // null`, and Rejected entries were pinged at rejection), but ping
        // defensively before deleting, matching the upsert-evict pattern above.
        pingBlockedTasks(shadowEntry);
        (0, _cachemap.deleteFromCacheMap)(shadowEntry);
    }
}
function createDetachedSegmentCacheEntry(now) {
    // Default stale time for pending segment cache entries. The actual stale time
    // is set when the entry is fulfilled with data from the server response.
    const staleAt = now + 30 * 1000;
    const emptyEntry = {
        status: _cachemap.EntryStatus.Empty,
        blockedTasks: null,
        // Default to assuming the fetch strategy will be PPR. This will be updated
        // when a fetch is actually initiated.
        fetchStrategy: _types.FetchStrategy.PPR,
        rsc: null,
        isPartial: true,
        isUpgradeableISRFallback: false,
        promise: null,
        // Map-related fields
        ref: null,
        size: 0,
        staleAt,
        version: 0
    };
    return emptyEntry;
}
function upgradeToPendingSegment(emptyEntry, fetchStrategy) {
    const pendingEntry = emptyEntry;
    pendingEntry.status = _cachemap.EntryStatus.Pending;
    pendingEntry.fetchStrategy = fetchStrategy;
    if (fetchStrategy === _types.FetchStrategy.Full) {
        // We can assume the response will contain the full segment data. Set this
        // to false so we know it's OK to omit this segment from any navigation
        // requests that may happen while the data is still pending.
        pendingEntry.isPartial = false;
    }
    // Set the version here, since this is right before the request is initiated.
    // The next time the segment cache version is incremented, the entry will
    // effectively be evicted. This happens before initiating the request, rather
    // than when receiving the response, because it's guaranteed to happen
    // before the data is read on the server.
    pendingEntry.version = getCurrentSegmentCacheVersion();
    return pendingEntry;
}
function attemptToFulfillDynamicSegmentFromBFCache(now, segment, tree) {
    // Attempts to fulfill an empty segment cache entry using data from the
    // bfcache. This is only valid during a Full prefetch (i.e. one that includes
    // dynamic data), because the bfcache stores data from navigations which
    // always include dynamic data.
    // We always use the canonical vary path when checking the bfcache. This is
    // the same operation we'd use to access the cache during a
    // regular navigation.
    const varyPath = tree.varyPath;
    // Read from the BFCache without expiring it (pass -1). We check freshness
    // ourselves using navigatedAt, because the BFCache's staleAt may have been
    // overridden by a per-page unstable_dynamicStaleTime and can't be used to
    // derive the original request time.
    const bfcacheEntry = (0, _bfcache.readFromBFCache)(varyPath);
    if (bfcacheEntry !== null) {
        // The stale time for dynamic prefetches (default: 5 mins) is different
        // from the stale time for regular navigations (default: 0 secs). Use
        // navigatedAt to compute the correct expiry for prefetch purposes.
        const dynamicPrefetchStaleAt = bfcacheEntry.navigatedAt + _navigatereducer.STATIC_STALETIME_MS;
        if (now > dynamicPrefetchStaleAt) {
            return null;
        }
        const pendingSegment = upgradeToPendingSegment(segment, _types.FetchStrategy.Full);
        const isPartial = false;
        return fulfillSegmentCacheEntry(pendingSegment, bfcacheEntry.rsc, dynamicPrefetchStaleAt, isPartial, false, _types.FetchStrategy.Full);
    }
    return null;
}
function attemptToUpgradeSegmentFromBFCache(now, map, tree) {
    const varyPath = tree.varyPath;
    const bfcacheEntry = (0, _bfcache.readFromBFCache)(varyPath);
    if (bfcacheEntry !== null) {
        const dynamicPrefetchStaleAt = bfcacheEntry.navigatedAt + _navigatereducer.STATIC_STALETIME_MS;
        if (now > dynamicPrefetchStaleAt) {
            return null;
        }
        const pendingSegment = upgradeToPendingSegment(createDetachedSegmentCacheEntry(now), _types.FetchStrategy.Full);
        const isPartial = false;
        const newEntry = fulfillSegmentCacheEntry(pendingSegment, bfcacheEntry.rsc, dynamicPrefetchStaleAt, isPartial, false, _types.FetchStrategy.Full);
        const segmentVaryPath = (0, _varypath.getSegmentVaryPathForRequest)(_types.FetchStrategy.Full, tree);
        const upserted = upsertSegmentEntry(now, map, segmentVaryPath, newEntry, // practice a Full request path is already fully concrete, so nothing
        // can shadow the new entry and the shadow check is a no-op.)
        tree.varyPath);
        if (upserted !== null && upserted.status === _cachemap.EntryStatus.Fulfilled) {
            return upserted;
        }
    }
    return null;
}
function pingBlockedTasks(entry) {
    const blockedTasks = entry.blockedTasks;
    if (blockedTasks !== null) {
        for (const task of blockedTasks){
            (0, _scheduler.pingPrefetchTask)(task);
        }
        entry.blockedTasks = null;
    }
}
function createMetadataRouteTree(metadataVaryPath) {
    // The Head is not actually part of the route tree, but other than that, it's
    // fetched and cached like a segment. Some functions expect a RouteTree
    // object, so rather than fork the logic in all those places, we use this
    // "fake" one.
    const metadata = {
        requestKey: _segmentvalueencoding.HEAD_REQUEST_KEY,
        segment: _segmentvalueencoding.HEAD_REQUEST_KEY,
        shellVaryPath: (0, _varypath.getShellSegmentVaryPath)(metadataVaryPath),
        refreshState: null,
        varyPath: metadataVaryPath,
        // The metadata isn't really a "page" (though it isn't really a "segment"
        // either) but for the purposes of how this field is used, it behaves like
        // one. If this logic ever gets more complex we can change this to an enum.
        isPage: true,
        slots: null,
        prefetchHints: 0
    };
    return metadata;
}
function fulfillRouteCacheEntry(now, entry, tree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching) {
    // Get the rendered search from the vary path
    const renderedSearch = (0, _varypath.getRenderedSearchFromVaryPath)(metadataVaryPath) ?? '';
    const fulfilledEntry = entry;
    fulfilledEntry.status = _cachemap.EntryStatus.Fulfilled;
    fulfilledEntry.tree = tree;
    fulfilledEntry.metadata = createMetadataRouteTree(metadataVaryPath);
    // Route structure is essentially static — it only changes on deploy.
    // Always use the static stale time.
    // NOTE: An exception is rewrites/redirects in middleware or proxy, which can
    // change routes dynamically. We have other strategies for handling those.
    //
    // If the route tree has stale inlining hints (e.g. the initial RSC payload
    // for a build-time static page, generated before collectPrefetchHints ran),
    // immediately expire the entry so it gets re-fetched with correct hints.
    // The segment data itself is still valid — only the route tree (which
    // contains the hint bits) needs to be re-fetched.
    if (tree.prefetchHints & _approutertypes.PrefetchHint.InliningHintsStale) {
        fulfilledEntry.staleAt = -1;
    } else {
        fulfilledEntry.staleAt = now + _navigatereducer.STATIC_STALETIME_MS;
    }
    fulfilledEntry.couldBeIntercepted = couldBeIntercepted;
    fulfilledEntry.canonicalUrl = canonicalUrl;
    fulfilledEntry.renderedSearch = renderedSearch;
    fulfilledEntry.supportsPerSegmentPrefetching = supportsPerSegmentPrefetching;
    fulfilledEntry.hasDynamicRewrite = false;
    pingBlockedTasks(entry);
    return fulfilledEntry;
}
function writeRouteIntoCache(now, pathname, search, nextUrl, tree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching) {
    const pendingEntry = createDetachedRouteCacheEntry();
    const fulfilledEntry = fulfillRouteCacheEntry(now, pendingEntry, tree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
    const varyPath = (0, _varypath.getFulfilledRouteVaryPath)(pathname, search, nextUrl, couldBeIntercepted);
    const isRevalidation = false;
    (0, _cachemap.setInCacheMap)(routeCacheMap, varyPath, fulfilledEntry, isRevalidation);
    return fulfilledEntry;
}
function markRouteEntryAsDynamicRewrite(entry) {
    entry.hasDynamicRewrite = true;
// Note: The caller is responsible for also calling invalidateRouteCacheEntries
// to invalidate other entries that may have been derived from this template
// before we knew it had a dynamic rewrite.
}
function fulfillSegmentCacheEntry(segmentCacheEntry, rsc, staleAt, isPartial, // callers pass false. Always assigned (even when false) so that re-fulfilling
// a previously-fallback entry with a concrete response clears the flag and
// ends the retry loop.
isUpgradeableISRFallback, // which comes from the response, not the tier the entry was requested at.
// Usually the two agree, but when a response's shell payload IS the full
// response (no shell/full split), shell-spawned entries are fulfilled with
// full-tier content and recorded as such (see the promotion in
// writeSegmentBundleResponse). Always assigned, replacing
// the spawn-time strategy set by upgradeToPendingSegment; the write walks'
// matching and keying decisions all happen against the spawn-time
// strategy, before fulfillment, so they are unaffected. See
// SegmentCacheEntryShared['fetchStrategy'].
fetchStrategy) {
    const fulfilledEntry = segmentCacheEntry;
    fulfilledEntry.status = _cachemap.EntryStatus.Fulfilled;
    fulfilledEntry.rsc = rsc;
    fulfilledEntry.staleAt = staleAt;
    fulfilledEntry.isPartial = isPartial;
    fulfilledEntry.isUpgradeableISRFallback = isUpgradeableISRFallback;
    fulfilledEntry.fetchStrategy = fetchStrategy;
    // Resolve any listeners that were waiting for this data.
    if (segmentCacheEntry.promise !== null) {
        segmentCacheEntry.promise.resolve(fulfilledEntry);
        // Free the promise for garbage collection.
        fulfilledEntry.promise = null;
    }
    pingBlockedTasks(segmentCacheEntry);
    return fulfilledEntry;
}
function rejectRouteCacheEntry(entry, staleAt) {
    const rejectedEntry = entry;
    rejectedEntry.status = _cachemap.EntryStatus.Rejected;
    rejectedEntry.staleAt = staleAt;
    pingBlockedTasks(entry);
}
function rejectSegmentCacheEntry(entry, staleAt) {
    const rejectedEntry = entry;
    rejectedEntry.status = _cachemap.EntryStatus.Rejected;
    rejectedEntry.staleAt = staleAt;
    if (entry.promise !== null) {
        // NOTE: We don't currently propagate the reason the prefetch was canceled
        // but we could by accepting a `reason` argument.
        entry.promise.resolve(null);
        entry.promise = null;
    }
    pingBlockedTasks(entry);
}
function convertRootTreePrefetchToRouteTree(rootTree, renderedPathname, renderedSearch, acc) {
    // Remove trailing and leading slashes
    const pathnameParts = (0, _cachekey.splitPathnameIntoParts)(renderedPathname);
    const index = 0;
    const rootSegment = _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY;
    return convertTreePrefetchToRouteTree(rootTree.tree, rootSegment, null, _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY, pathnameParts, index, renderedSearch, acc);
}
function convertTreePrefetchToRouteTree(prefetch, segment, partialVaryPath, requestKey, pathnameParts, pathnamePartsIndex, renderedSearch, acc) {
    // Converts the route tree sent by the server into the format used by the
    // cache. The cached version of the tree includes additional fields, such as a
    // cache key for each segment. Since this is frequently accessed, we compute
    // it once instead of on every access. This same cache key is also used to
    // request the segment from the server.
    let slots = null;
    let isPage;
    let varyPath;
    const prefetchSlots = prefetch.slots;
    if (prefetchSlots !== null) {
        isPage = false;
        varyPath = (0, _varypath.finalizeLayoutVaryPath)(requestKey, partialVaryPath);
        slots = new Map();
        for(let parallelRouteKey in prefetchSlots){
            const childPrefetch = prefetchSlots[parallelRouteKey];
            const childSegmentName = childPrefetch.name;
            const childParam = childPrefetch.param;
            let childDoesAppearInURL;
            let childSegment;
            let childPartialVaryPath;
            if (childParam !== null) {
                // This segment is parameterized. Get the param from the pathname.
                const childParamValue = (0, _routeparams.parseDynamicParamFromURLPart)(childParam.type, pathnameParts, pathnamePartsIndex);
                // Assign a cache key to the segment, based on the param value. In the
                // pre-Segment Cache implementation, the server computes this and sends
                // it in the body of the response. In the Segment Cache implementation,
                // the server sends an empty string and we fill it in here.
                // TODO: We're intentionally not adding the search param to page
                // segments here; it's tracked separately and added back during a read.
                // This would clearer if we waited to construct the segment until it's
                // read from the cache, since that's effectively what we're
                // doing anyway.
                const childParamKey = // cacheComponents is enabled.
                childParam.key !== null ? childParam.key : (0, _routeparams.getCacheKeyForDynamicParam)(childParamValue, '');
                childPartialVaryPath = (0, _varypath.appendLayoutVaryPath)(partialVaryPath, childParamKey, childSegmentName, // above the root layout, which the server marks directly.
                (childPrefetch.prefetchHints & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0);
                childSegment = [
                    childSegmentName,
                    childParamKey,
                    childParam.type,
                    childParam.siblings
                ];
                childDoesAppearInURL = true;
            } else {
                // This segment does not have a param. Inherit the partial vary path of
                // the parent.
                childPartialVaryPath = partialVaryPath;
                childSegment = childSegmentName;
                childDoesAppearInURL = (0, _routeparams.doesStaticSegmentAppearInURL)(childSegmentName);
            }
            // Only increment the index if the segment appears in the URL. If it's a
            // "virtual" segment, like a route group, it remains the same.
            const childPathnamePartsIndex = childDoesAppearInURL ? pathnamePartsIndex + 1 : pathnamePartsIndex;
            const childRequestKeyPart = (0, _segmentvalueencoding.createSegmentRequestKeyPart)(childSegment);
            const childRequestKey = (0, _segmentvalueencoding.appendSegmentRequestKeyPart)(requestKey, parallelRouteKey, childRequestKeyPart);
            slots.set(parallelRouteKey, convertTreePrefetchToRouteTree(childPrefetch, childSegment, childPartialVaryPath, childRequestKey, pathnameParts, childPathnamePartsIndex, renderedSearch, acc));
        }
    } else {
        if (requestKey.endsWith(_segment.PAGE_SEGMENT_KEY)) {
            // This is a page segment.
            isPage = true;
            varyPath = (0, _varypath.finalizePageVaryPath)(requestKey, renderedSearch, partialVaryPath);
            // The metadata "segment" is not part the route tree, but it has the same
            // conceptual params as a page segment. Write the vary path into the
            // accumulator object. If there are multiple parallel pages, we use the
            // first one. Which page we choose is arbitrary as long as it's
            // consistently the same one every time every time. See
            // finalizeMetadataVaryPath for more details.
            if (acc.metadataVaryPath === null) {
                acc.metadataVaryPath = (0, _varypath.finalizeMetadataVaryPath)(requestKey, renderedSearch, partialVaryPath);
            }
        } else {
            // This is a layout segment.
            isPage = false;
            varyPath = (0, _varypath.finalizeLayoutVaryPath)(requestKey, partialVaryPath);
        }
    }
    return {
        requestKey,
        segment,
        shellVaryPath: (0, _varypath.getShellSegmentVaryPath)(varyPath),
        refreshState: null,
        // TODO: Cheating the type system here a bit because TypeScript can't tell
        // that the type of isPage and varyPath are consistent. The fix would be to
        // create separate constructors and call the appropriate one from each of
        // the branches above. Just seems a bit overkill only for one field so I'll
        // leave it as-is for now. If isPage were wrong it would break the behavior
        // and we'd catch it quickly, anyway.
        varyPath: varyPath,
        isPage: isPage,
        slots,
        prefetchHints: prefetch.prefetchHints
    };
}
function convertRootFlightRouterStateToRouteTree(flightRouterState, renderedSearch, acc) {
    return convertFlightRouterStateToRouteTree(flightRouterState, _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY, null, renderedSearch, acc);
}
function convertReusedFlightRouterStateToRouteTree(parentRouteTree, parallelRouteKey, flightRouterState, renderedSearch, acc) {
    // Create a RouteTree for a FlightRouterState that was reused from an older
    // route. This happens during a navigation when a parallel route slot does not
    // match the target route; we reuse whatever slot was already active.
    // Unlike a FlightRouterState, the RouteTree type contains backreferences to
    // the parent segments. Append the vary path to the parent's vary path.
    const parentPartialVaryPath = parentRouteTree.isPage ? (0, _varypath.getPartialPageVaryPath)(parentRouteTree.varyPath) : (0, _varypath.getPartialLayoutVaryPath)(parentRouteTree.varyPath);
    const segment = flightRouterState[0];
    // And the request key.
    const parentRequestKey = parentRouteTree.requestKey;
    const requestKeyPart = (0, _segmentvalueencoding.createSegmentRequestKeyPart)(segment);
    const requestKey = (0, _segmentvalueencoding.appendSegmentRequestKeyPart)(parentRequestKey, parallelRouteKey, requestKeyPart);
    return convertFlightRouterStateToRouteTree(flightRouterState, requestKey, parentPartialVaryPath, renderedSearch, acc);
}
function convertFlightRouterStateToRouteTree(flightRouterState, requestKey, parentPartialVaryPath, parentRenderedSearch, acc) {
    const originalSegment = flightRouterState[0];
    // This segment's param (if any) is a root param iff the segment is at or
    // above the root layout, which the server marks directly.
    const isRootParam = ((flightRouterState[4] ?? 0) & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0;
    // If the FlightRouterState has a refresh state, then this segment is part of
    // an inactive parallel route. It has a different rendered search query than
    // the outer parent route. In order to construct the inactive route correctly,
    // we must restore the query that was originally used to render it.
    const compressedRefreshState = flightRouterState[2] ?? null;
    const refreshState = compressedRefreshState !== null ? {
        canonicalUrl: compressedRefreshState[0],
        renderedSearch: compressedRefreshState[1]
    } : null;
    const renderedSearch = refreshState !== null ? refreshState.renderedSearch : parentRenderedSearch;
    let segment;
    let partialVaryPath;
    let isPage;
    let varyPath;
    if (Array.isArray(originalSegment)) {
        isPage = false;
        const paramCacheKey = originalSegment[1];
        const paramName = originalSegment[0];
        partialVaryPath = (0, _varypath.appendLayoutVaryPath)(parentPartialVaryPath, paramCacheKey, paramName, isRootParam);
        varyPath = (0, _varypath.finalizeLayoutVaryPath)(requestKey, partialVaryPath);
        segment = originalSegment;
    } else {
        // This segment does not have a param. Inherit the partial vary path of
        // the parent.
        partialVaryPath = parentPartialVaryPath;
        if (requestKey.endsWith(_segment.PAGE_SEGMENT_KEY)) {
            // This is a page segment.
            isPage = true;
            // The navigation implementation expects the search params to be included
            // in the segment. However, in the case of a static response, the search
            // params are omitted. So the client needs to add them back in when reading
            // from the Segment Cache.
            //
            // For consistency, we'll do this for dynamic responses, too.
            //
            // TODO: We should move search params out of FlightRouterState and handle
            // them entirely on the client, similar to our plan for dynamic params.
            segment = _segment.PAGE_SEGMENT_KEY;
            varyPath = (0, _varypath.finalizePageVaryPath)(requestKey, renderedSearch, partialVaryPath);
            // The metadata "segment" is not part the route tree, but it has the same
            // conceptual params as a page segment. Write the vary path into the
            // accumulator object. If there are multiple parallel pages, we use the
            // first one. Which page we choose is arbitrary as long as it's
            // consistently the same one every time every time. See
            // finalizeMetadataVaryPath for more details.
            if (acc.metadataVaryPath === null) {
                acc.metadataVaryPath = (0, _varypath.finalizeMetadataVaryPath)(requestKey, renderedSearch, partialVaryPath);
            }
        } else {
            // This is a layout segment.
            isPage = false;
            segment = originalSegment;
            varyPath = (0, _varypath.finalizeLayoutVaryPath)(requestKey, partialVaryPath);
        }
    }
    let slots = null;
    const parallelRoutes = flightRouterState[1];
    for(let parallelRouteKey in parallelRoutes){
        const childRouterState = parallelRoutes[parallelRouteKey];
        const childSegment = childRouterState[0];
        // TODO: Eventually, the param values will not be included in the response
        // from the server. We'll instead fill them in on the client by parsing
        // the URL. This is where we'll do that.
        const childRequestKeyPart = (0, _segmentvalueencoding.createSegmentRequestKeyPart)(childSegment);
        const childRequestKey = (0, _segmentvalueencoding.appendSegmentRequestKeyPart)(requestKey, parallelRouteKey, childRequestKeyPart);
        const childTree = convertFlightRouterStateToRouteTree(childRouterState, childRequestKey, partialVaryPath, renderedSearch, acc);
        if (slots === null) {
            slots = new Map();
        }
        slots.set(parallelRouteKey, childTree);
    }
    return {
        requestKey,
        segment,
        shellVaryPath: (0, _varypath.getShellSegmentVaryPath)(varyPath),
        refreshState,
        // TODO: Cheating the type system here a bit because TypeScript can't tell
        // that the type of isPage and varyPath are consistent. The fix would be to
        // create separate constructors and call the appropriate one from each of
        // the branches above. Just seems a bit overkill only for one field so I'll
        // leave it as-is for now. If isPage were wrong it would break the behavior
        // and we'd catch it quickly, anyway.
        varyPath: varyPath,
        isPage: isPage,
        slots,
        prefetchHints: flightRouterState[4] ?? 0
    };
}
function convertRouteTreeToFlightRouterState(routeTree) {
    const parallelRoutes = {};
    const slots = routeTree.slots;
    if (slots !== null) {
        for (const [parallelRouteKey, childTree] of slots){
            parallelRoutes[parallelRouteKey] = convertRouteTreeToFlightRouterState(childTree);
        }
    }
    const flightRouterState = [
        routeTree.segment,
        parallelRoutes,
        null,
        null
    ];
    if (routeTree.prefetchHints !== 0) {
        flightRouterState[4] = routeTree.prefetchHints;
    }
    return flightRouterState;
}
async function fetchRouteOnCacheMiss(entry, key, // branch that writes segment data included in the tree response.
map) {
    // This function is allowed to use async/await because it contains the actual
    // fetch that gets issued on a cache miss. Notice it writes the result to the
    // cache entry directly, rather than return data that is then written by
    // the caller.
    const pathname = key.pathname;
    const search = key.search;
    const nextUrl = key.nextUrl;
    const segmentPath = '/_tree';
    const headers = {
        [_approuterheaders.RSC_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_SEGMENT_PREFETCH_HEADER]: segmentPath
    };
    if (nextUrl !== null) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    try {
        const url = new URL(pathname + search, location.origin);
        let response;
        let urlAfterRedirects;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            // "Server" mode. We can use request headers instead of the pathname.
            // TODO: The eventual plan is to get rid of our custom request headers and
            // encode everything into the URL, using a similar strategy to the
            // "output: export" block above.
            response = await fetchPrefetchResponse(url, headers);
            urlAfterRedirects = response !== null && response.redirected ? new URL(response.url) : url;
        }
        if (!response || !response.ok || !response.body) {
            // Server responded with an error, or with a miss. We should still cache
            // the response, but we can try again after 10 seconds.
            rejectRouteCacheEntry(entry, Date.now() + 10 * 1000);
            return null;
        }
        // TODO: The canonical URL is the href without the origin. I think
        // historically the reason for this is because the initial canonical URL
        // gets passed as a prop to the top-level React component, which means it
        // needs to be computed during SSR. If it were to include the origin, it
        // would need to always be same as location.origin on the client, to prevent
        // a hydration mismatch. To sidestep this complexity, we omit the origin.
        //
        // However, since this is neither a native URL object nor a fully qualified
        // URL string, we need to be careful about how we use it. To prevent subtle
        // mistakes, we should create a special type for it, instead of just string.
        // Or, we should just use a (readonly) URL object instead. The type of the
        // prop that we pass to seed the initial state does not need to be the same
        // type as the state itself.
        const canonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(urlAfterRedirects);
        // Check whether the response varies based on the Next-Url header.
        const varyHeader = response.headers.get('vary');
        const couldBeIntercepted = varyHeader !== null && varyHeader.includes(_approuterheaders.NEXT_URL);
        // TODO: The `closed` promise was originally used to track when a streaming
        // network connection closes, so the scheduler could limit concurrent
        // connections. Now that prefetch responses are buffered, `closed` is
        // resolved immediately after buffering — before the outer function even
        // returns. This mechanism is only still meaningful for dynamic (Full)
        // prefetches, which use incremental streaming. Consider removing the
        // `closed` plumbing for buffered prefetch paths.
        const closed = (0, _promisewithresolvers.createPromiseWithResolvers)();
        // This checks whether the response was served from the per-segment cache,
        // rather than the old prefetching flow. If it fails, it implies that PPR
        // is disabled on this route.
        const routeIsPPREnabled = response.headers.get(_approuterheaders.NEXT_DID_POSTPONE_HEADER) === '2' || // In output: "export" mode, we can't rely on response headers. But if we
        // receive a well-formed response, we can assume it's a static response,
        // because all data is static in this mode.
        isOutputExportMode;
        if (routeIsPPREnabled) {
            const { stream: prefetchStream, size: responseSize } = await createNonTaskyPrefetchResponseStream(response.body);
            closed.resolve();
            (0, _cachemap.setSizeInCacheMap)(entry, responseSize);
            const serverData = await (0, _fetchserverresponse.createFromNextReadableStream)(prefetchStream, headers, {
                allowPartialStream: true
            });
            if ((response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverData.buildId) !== (0, _navigationbuildid.getNavigationBuildId)()) {
                // The server build does not match the client. Treat as a 404. During
                // an actual navigation, the router will trigger an MPA navigation.
                // TODO: We should cache the fact that this is an MPA navigation.
                rejectRouteCacheEntry(entry, Date.now() + 10 * 1000);
                return null;
            }
            // Get the params that were used to render the target page. These may
            // be different from the params in the request URL, if the page
            // was rewritten.
            const renderedPathname = (0, _routeparams.getRenderedPathname)(response);
            const renderedSearch = (0, _routeparams.getRenderedSearch)(response);
            // Convert the server-sent data into the RouteTree format used by the
            // client cache.
            //
            // During this traversal, we accumulate additional data into this
            // "accumulator" object.
            const acc = {
                metadataVaryPath: null,
                treeDivergedFromBase: false
            };
            const routeTree = convertRootTreePrefetchToRouteTree(serverData, renderedPathname, renderedSearch, acc);
            const metadataVaryPath = acc.metadataVaryPath;
            if (metadataVaryPath === null) {
                rejectRouteCacheEntry(entry, Date.now() + 10 * 1000);
                return null;
            }
            (0, _optimisticroutes.discoverKnownRoute)(Date.now(), pathname, search, nextUrl, entry, routeTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, routeIsPPREnabled, false // hasDynamicRewrite
            );
        } else {
            // PPR is not enabled for this route. The server responds with a
            // different format (FlightRouterState) that we need to convert.
            // TODO: We will unify the responses eventually. I'm keeping the types
            // separate for now because FlightRouterState has so many
            // overloaded concerns.
            const { stream: prefetchStream, size: responseSize } = await createNonTaskyPrefetchResponseStream(response.body);
            closed.resolve();
            (0, _cachemap.setSizeInCacheMap)(entry, responseSize);
            const serverData = await (0, _fetchserverresponse.createFromNextReadableStream)(prefetchStream, headers, {
                allowPartialStream: true
            });
            if ((response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverData.b) !== (0, _navigationbuildid.getNavigationBuildId)()) {
                // The server build does not match the client. Treat as a 404. During
                // an actual navigation, the router will trigger an MPA navigation.
                // TODO: We should cache the fact that this is an MPA navigation.
                rejectRouteCacheEntry(entry, Date.now() + 10 * 1000);
                return null;
            }
            // Read head vary params synchronously (unioning in the response-level
            // root params). Individual segments carry their own iterables in
            // CacheNodeSeedData; the root iterable is threaded down so each segment
            // unions it too.
            const headVaryParams = (0, _varyparamsdecoding.readVaryParams)(serverData.h, serverData.r);
            writeDynamicTreeResponseIntoCache(Date.now(), // using the LoadingBoundary fetch strategy, so mark their cache entries accordingly.
            _types.FetchStrategy.LoadingBoundary, response, serverData, entry, couldBeIntercepted, canonicalUrl, routeIsPPREnabled, headVaryParams, serverData.r ?? null, pathname, search, nextUrl, map);
        }
        if (!couldBeIntercepted) {
            // This route will never be intercepted. So we can use this entry for all
            // requests to this route, regardless of the Next-Url header. This works
            // because when reading the cache we always check for a valid
            // non-intercepted entry first.
            // Re-key the entry. The `set` implementation handles removing it from
            // its previous position in the cache. We don't need to do anything to
            // update the LRU, because the entry is already in it.
            // TODO: Treat this as an upsert — should check if an entry already
            // exists at the new keypath, and if so, whether we should keep that
            // one instead.
            const fulfilledVaryPath = (0, _varypath.getFulfilledRouteVaryPath)(pathname, search, nextUrl, couldBeIntercepted);
            const isRevalidation = false;
            (0, _cachemap.setInCacheMap)(routeCacheMap, fulfilledVaryPath, entry, isRevalidation);
        }
        // Return a promise that resolves when the network connection closes, so
        // the scheduler can track the number of concurrent network connections.
        return {
            value: null,
            closed: closed.promise
        };
    } catch (error) {
        // Either the connection itself failed, or something bad happened while
        // decoding the response. If we're offline, reject with staleAt=-1 so the
        // entry immediately expires and gets retried once the scheduler is
        // re-pinged after connectivity is restored.
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        rejectRouteCacheEntry(entry, Date.now() + 10 * 1000);
        return null;
    }
}
function rejectRemainingSegmentsInBundle(entries, staleAt) {
    let node = entries;
    while(node !== null){
        if (node.entry !== null && node.entry.status === _cachemap.EntryStatus.Pending) {
            rejectSegmentCacheEntry(node.entry, staleAt);
        }
        node = node.parent;
    }
}
// When a static (per-segment PPR) prefetch receives an upgradeable fallback
// shell, the localized retry loop re-issues the same fetch after this delay to
// pick up the concrete version once the server's background regeneration
// finishes.
const FALLBACK_RETRY_DELAY_MS = 2000;
// Maximum number of fallback retries per task, to avoid looping indefinitely
// if the server keeps returning a fallback (e.g. misconfiguration).
const MAX_FALLBACK_RETRIES = 3;
async function fetchSegmentsOnCacheMiss(task, route, routeKey, tree, segments, segmentCount, // identical either way; this only decides which payload of the response
// fulfills the entries.
fetchStrategy) {
    // This function is allowed to use async/await because it contains the actual
    // fetch that gets issued on a cache miss. Notice it writes the result to the
    // cache entry directly, rather than return data that is then written by
    // the caller.
    //
    // Segment fetches are non-blocking so we don't need to ping the scheduler
    // on completion.
    let result;
    try {
        result = await fetchSegmentsOnCacheMissImpl(route, routeKey, tree);
    } catch (error) {
        // The connection failed, or the response couldn't be decoded. Reject the
        // pending entries so they don't stay Pending forever, and get retried once
        // the entry expires. If we're offline, expire immediately (-1) so the entry
        // is re-fetched once the scheduler is re-pinged on reconnect; otherwise
        // apply a 10s backoff. (Unlike navigations and server actions, prefetches
        // don't await `waitForConnection`.)
        let staleAt = Date.now() + 10 * 1000;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        rejectRemainingSegmentsInBundle(segments, staleAt);
        return null;
    }
    if (result === null) {
        // The response was fetched but isn't usable yet (server error/miss, empty
        // data, or a build-id mismatch — the server may be transiently unready).
        // Reject with a short backoff so the entries are retried soon.
        rejectRemainingSegmentsInBundle(segments, Date.now() + 10 * 1000);
        return null;
    }
    const { serverResponse, shellResponse, responseSize, closed } = result;
    const now = Date.now();
    writeSegmentBundleResponseVariants(task.segmentCacheMap, serverResponse, shellResponse, responseSize, segments, segmentCount, now, fetchStrategy);
    // If the server served an upgradeable fallback shell, drive a localized
    // retry loop to pick up the concrete version once the server's background
    // regeneration finishes. Only the first such response per task starts a loop
    // (`fallbackRetryStatus === Empty`); once it leaves Empty, no second loop is
    // started — sibling bundle responses that also got a fallback don't, and
    // neither does a re-hover.
    if (serverResponse.isUpgradeableISRFallback && task.fallbackRetryStatus === _cachemap.EntryStatus.Empty && !task.isCanceled) {
        task.fallbackRetryStatus = _cachemap.EntryStatus.Pending;
        // Fire-and-forget: the loop drives itself via timers and pings the task
        // on success.
        void retryUpgradeableFallbackPrefetch(task, route, routeKey, tree, segments, segmentCount, fetchStrategy);
    }
    return {
        value: null,
        closed
    };
}
/**
 * Issues a single segment-bundle prefetch request, validates it, and decodes
 * the response. Returns the decoded response (see the return type below)
 * on success, or `null` if the response was fetched but isn't usable yet
 * (server error/miss, empty data, or a build-id mismatch — the server may be
 * transiently unready, so it's worth retrying). THROWS if the connection failed
 * or the response couldn't be decoded; re-issuing the identical request won't
 * fix that, so callers should give up rather than retry.
 *
 * This deliberately does NOT touch the cache — it neither writes the decoded
 * segments nor rejects entries. The caller decides what to do with the result:
 * write it (`fetchSegmentsOnCacheMiss`) or ignore it and try again (the retry
 * loop). Calling this again with the same arguments reproduces the exact same
 * request.
 */ async function fetchSegmentsOnCacheMissImpl(route, routeKey, tree) {
    // Use the canonical URL to request the segment, not the original URL. These
    // are usually the same, but the canonical URL will be different if the route
    // tree response was redirected. To avoid an extra waterfall on every segment
    // request, we pass the redirected URL instead of the original one.
    const url = new URL(route.canonicalUrl, location.origin);
    const nextUrl = routeKey.nextUrl;
    const requestKey = tree.requestKey;
    const normalizedRequestKey = requestKey === _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY ? // `_index` instead of as an empty string. This should be treated as
    // an implementation detail and not as a stable part of the protocol.
    // It just needs to match the equivalent logic that happens when
    // prerendering the responses. It should not leak outside of Next.js.
    '/_index' : requestKey;
    const headers = {
        [_approuterheaders.RSC_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_SEGMENT_PREFETCH_HEADER]: normalizedRequestKey
    };
    if (nextUrl !== null) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    const requestUrl = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : url;
    const response = await fetchPrefetchResponse(requestUrl, headers);
    if (!response || !response.ok || // This checks whether the response was served from the per-segment cache,
    // rather than the old prefetching flow. If it fails, it implies that PPR
    // is disabled on this route. Theoretically this should never happen
    // because we only issue requests for segments once we've verified that
    // the route supports PPR.
    response.headers.get(_approuterheaders.NEXT_DID_POSTPONE_HEADER) !== '2' && // In output: "export" mode, we can't rely on response headers. But if
    // we receive a well-formed response, we can assume it's a static
    // response, because all data is static in this mode.
    !isOutputExportMode || !response.body) {
        // Server responded with an error or a miss — fetched but not usable.
        return null;
    }
    // See TODO in fetchRouteOnCacheMiss about removing `closed` for
    // buffered prefetch paths.
    const closed = (0, _promisewithresolvers.createPromiseWithResolvers)();
    const { stream: prefetchStream, size: responseSize, buffer } = await createNonTaskyPrefetchResponseStream(response.body);
    closed.resolve();
    // Parse the response. Always a SegmentPrefetchResponse with a build ID and a
    // data array. A connection drop or malformed stream throws here, which
    // propagates to the caller as a non-retryable failure.
    const serverResponse = await (0, _fetchserverresponse.createFromNextReadableStream)(prefetchStream, headers, {
        allowPartialStream: true
    });
    if (serverResponse.data.length === 0) {
        return null;
    }
    if ((response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverResponse.buildId) !== (0, _navigationbuildid.getNavigationBuildId)()) {
        // The server build does not match the client. Treat as a 404. During
        // an actual navigation, the router will trigger an MPA navigation.
        return null;
    }
    // Extract the shell payload, if the response carries a distinct one
    // (positive shell byte offset): decode the buffered bytes a SECOND time,
    // truncated at the boundary. The truncation is what produces the shell
    // variant: each segment's param-dependent rows land past the boundary and
    // decode as still-pending, which renders as the param fallback. It also
    // rewinds the response's signals — `needsRuntimeRequest` and `isPartial`
    // fulfillments past the boundary read as pending in this decode, so a
    // post-shell runtime-data access doesn't mark the shell variant itself as
    // needing a runtime request.
    // (The offset is never legitimately pending or 0 in this decode: the full
    // buffer is present, and the server only ever emits a positive offset or
    // null. Reading 0 — the default for an unfulfilled `a` — therefore means a
    // bug in Next.js itself, and is handled like an error: the response is
    // treated as carrying no shell, and the scheduler skips the affected
    // segments rather than falling back to a runtime request — see the
    // `shellResponse === null` handling in writeSegmentBundleResponseVariants.
    // Failing in that direction costs a shell prefetch but never leaks
    // post-shell content into shell positions.)
    const shellOffset = readFulfilledValue(serverResponse.a, 0);
    let shellResponse;
    if (shellOffset === null) {
        shellResponse = serverResponse;
    } else if (shellOffset === 0) {
        shellResponse = null;
    } else {
        try {
            shellResponse = await (0, _fetchserverresponse.decodeBufferedStage)(buffer.subarray(0, shellOffset), headers);
        } catch  {
            // The truncated prefix couldn't be decoded. Treat it as if no shell
            // exists; the full payload is still usable. (For a StaticShell-spawned
            // bundle this means the spawned entries are rejected — the scheduler
            // then skips them rather than issuing a runtime substitute; see the
            // no-shell branch in fetchSegmentsOnCacheMiss.)
            shellResponse = null;
        }
    }
    return {
        serverResponse,
        responseSize,
        shellResponse,
        closed: closed.promise
    };
}
/**
 * Writes every payload of a parsed segment-bundle response into the cache.
 * The bundle's entries are fulfilled by the payload matching the walk that
 * spawned them; the other payload, when distinct, is written with a detached
 * copy of the bundle. The full payload is written first so the shell write's
 * shadow eviction sees the fresh concrete entry.
 *
 * Shared by the initial fetch (`fetchSegmentsOnCacheMiss`) and the localized
 * fallback-retry loop. The retry's bundle entries are already settled, so
 * for that caller every write is a detached upsert and the rejection below
 * is a no-op (it only touches Pending entries).
 */ function writeSegmentBundleResponseVariants(// spawned).
map, serverResponse, shellResponse, responseSize, segments, segmentCount, now, // them. See fetchSegmentsOnCacheMiss.
fetchStrategy) {
    if (fetchStrategy === _types.FetchStrategy.StaticShell) {
        if (shellResponse !== serverResponse) {
            writeSegmentBundleResponse(map, serverResponse, responseSize, detachEntriesFromSegmentBundle(segments), segmentCount, now, _types.FetchStrategy.PPR, _types.FetchStrategy.PPR);
        }
        if (shellResponse === null) {
            // No shell exists. Reject the spawned entries so the task isn't
            // stranded blocking on them. Note the scheduler does NOT fall back to
            // a runtime request for rejected segments — it skips them outright (see
            // the Rejected case in pingSegmentBundle in scheduler.ts), so these
            // segments get no shell prefetch and no runtime substitute until the
            // rejection's backoff expires.
            rejectRemainingSegmentsInBundle(segments, now + 10 * 1000);
        } else {
            writeSegmentBundleResponse(map, shellResponse, responseSize, segments, segmentCount, now, _types.FetchStrategy.StaticShell, // entries this write fulfills carry full-tier content, so PPR is the
            // strategy that describes it.
            shellResponse === serverResponse ? _types.FetchStrategy.PPR : _types.FetchStrategy.StaticShell);
        }
    } else {
        writeSegmentBundleResponse(map, serverResponse, responseSize, segments, segmentCount, now, _types.FetchStrategy.PPR, _types.FetchStrategy.PPR);
        if (shellResponse !== null && shellResponse !== serverResponse) {
            writeSegmentBundleResponse(map, shellResponse, responseSize, detachEntriesFromSegmentBundle(segments), segmentCount, now, _types.FetchStrategy.StaticShell, _types.FetchStrategy.StaticShell);
        }
    }
}
/**
 * Writes one payload of a parsed segment-bundle response into the cache:
 * distributes the response size across the bundle, then walks the segments
 * list and the response's `data` array in parallel, fulfilling/upserting
 * each entry. Any segments the server didn't return are rejected so they
 * don't stay Pending forever.
 *
 * `fetchStrategy` says which of the response's payloads this call is
 * writing — StaticShell for the shell payload, PPR for the full payload —
 * which determines the vary paths the entries are keyed at.
 *
 * The walk fulfills any Pending entry in `segments`, so the caller must
 * pass the bundle only to the walk matching the entries' own strategy, and
 * a detached copy to the other. In particular, fulfilling a spawned
 * StaticShell entry with the concrete payload would leak param-dependent
 * content into shell positions: during a navigation, a pending entry can be
 * rendered as a promise that resolves to its eventual value.
 *
 * Shared by the initial fetch and the localized fallback-retry loop (which
 * re-issues the same request and upserts the upgraded result here).
 */ function writeSegmentBundleResponse(map, serverResponse, responseSize, segments, segmentCount, now, fetchStrategy, // the entries it fulfills. Differs from `fetchStrategy` (which drives
// matching and keying) in one case: a StaticShell write whose payload IS
// the full response (no shell/full split) records PPR — see
// writeSegmentBundleResponseVariants.
payloadFetchStrategy) {
    // Distribute the response size evenly across all segments in the bundle.
    // (When a response produces two payload writes, each write distributes the
    // full response size — intentionally double-charging the LRU for one wire
    // response, since it produced two live entries per segment.)
    const averageSize = responseSize / segmentCount;
    let sizeNode = segments;
    while(sizeNode !== null){
        if (sizeNode.entry !== null) {
            (0, _cachemap.setSizeInCacheMap)(sizeNode.entry, averageSize);
        }
        sizeNode = sizeNode.parent;
    }
    const serverDataArray = serverResponse.data;
    // True if the server served an upgradeable fallback shell (page not yet
    // prerendered with concrete params, but the route can be upgraded). Applies
    // to the whole response and is recorded on each fulfilled entry.
    const responseIsUpgradeableISRFallback = serverResponse.isUpgradeableISRFallback;
    // Whether the render that produced this payload accessed runtime data
    // (page-global; combined with each segment's `isPartial` below to decide
    // the tier each entry records). Read from THIS decode's thenable status,
    // which scopes it to the payload being written — see
    // `SegmentPrefetchResponse['needsRuntimeRequest']` for the encoding.
    //
    // Reading it from the same decode that produced the entry's data is what
    // makes the answer rewindable: a truncated shell decode reads a post-shell
    // runtime access as pending, i.e. `false`, because the shell variant itself
    // doesn't need that data.
    //
    // It is load-bearing in one direction only. A false `true` costs a wasted
    // runtime request; a false `false` would record too high a tier and skip a
    // runtime request that had more content.
    const responseNeedsRuntimeRequest = readFulfilledValue(serverResponse.needsRuntimeRequest, false);
    let node = segments;
    let dataIndex = 0;
    while(node !== null && dataIndex < serverDataArray.length){
        const data = serverDataArray[dataIndex];
        // Null data means this segment has prefetching disabled
        // (prefetch: 'force-disabled' — Partial Prefetching segments have static
        // data, so the server emits a real slot for them). Skip it without
        // creating a cache entry.
        if (data === null || node.tree === null) {
            // The server's and the client's prefetch-disabled hints normally agree,
            // so there shouldn't be a spawned entry for a segment the server
            // skipped. But if they disagree, a Pending entry that a task blocked on
            // would otherwise never settle, stranding the task forever. Settle
            // it defensively.
            if (node.entry !== null && node.entry.status === _cachemap.EntryStatus.Pending) {
                rejectSegmentCacheEntry(node.entry, now + 10 * 1000);
            }
            node = node.parent;
            dataIndex++;
            continue;
        }
        // The segment's late-resolving metadata can be read synchronously
        // because the payload was fully buffered before it was decoded (and, for
        // a truncated shell decode, delivered as a single chunk).
        const entryStaleAt = readFulfilledStaleAt(now, data.staleTime);
        // Root params are emitted once at the top level of the response and
        // unioned into each segment's set here, same as for a route-level
        // response.
        const varyParams = (0, _varyparamsdecoding.readVaryParams)(data.varyParams, serverResponse.rootVaryParams);
        const isPartial = readFulfilledIsPartial(data.isPartial);
        // A runtime prefetch can only provide more content than this entry if the
        // render accessed runtime data AND this particular segment has holes — a
        // fully static segment gains nothing from a runtime request no matter
        // what the page accessed.
        const needsRuntimeRequest = responseNeedsRuntimeRequest && isPartial;
        // An entry records the tier of the content that actually satisfied it,
        // which spans both axes: shell-vs-concrete AND static-vs-runtime.
        //
        // When this payload fully satisfied the segment — no runtime request
        // needed — the content is as complete as a RUNTIME response of the same
        // variant would have been, so it records that runtime tier. That's what
        // lets the scheduler decide "would a runtime request return more?" by
        // comparing tiers alone, with no separate signal to consult.
        //
        // Otherwise the content is only as complete as the static tier it was
        // requested at, so a follow-up runtime request can still supersede it.
        const recordedFetchStrategy = !needsRuntimeRequest ? payloadFetchStrategy === _types.FetchStrategy.StaticShell ? _types.FetchStrategy.RuntimeShell : _types.FetchStrategy.PPRRuntime : fetchStrategy;
        // Key the entry by which params the server said this segment depends on.
        // Reusing one copy across param values is the point of the shell, but it
        // requires knowing the content doesn't depend on those params, and the
        // server's report is the direct evidence of that.
        //
        // Without that report, assume every param varies. The exception is a
        // shell variant, which reduces param-dependent content to param
        // fallbacks, so it really is good for any value of them.
        const payloadVaryPath = ("TURBOPACK compile-time value", true) && varyParams !== null ? (0, _varypath.getFulfilledSegmentVaryPath)(node.tree.varyPath, varyParams) : (0, _varypath.getSegmentVaryPathForRequest)(payloadFetchStrategy, node.tree);
        const nodeEntry = node.entry;
        if (nodeEntry !== null && nodeEntry.status === _cachemap.EntryStatus.Pending) {
            // We own this entry — fulfill it directly.
            const fulfilledEntry = fulfillSegmentCacheEntry(nodeEntry, data.rsc, entryStaleAt, isPartial, responseIsUpgradeableISRFallback, recordedFetchStrategy);
            // Move the entry to that key. This is load-bearing rather than a no-op:
            // a task spawns its entries before it knows what the response will
            // contain, so the key it guessed can be more reusable than the response
            // turned out to deserve.
            //
            // Pass the concrete lookup path — the most specific path a read for
            // this segment position would use — so that if the entry lands at a
            // more generic key, a stale entry at a more specific one can't shadow
            // it. See evictShadowingSegmentEntries. The upsert (rather than a bare
            // set) applies the usual precedence rules, so a concurrent task's more
            // complete response already in this slot isn't downgraded.
            upsertSegmentEntry(now, map, payloadVaryPath, fulfilledEntry, node.tree.varyPath);
        } else {
            // We don't own this entry. Create a detached entry and attempt to
            // upsert it into this payload's slot.
            const detachedEntry = createDetachedSegmentCacheEntry(now);
            const fulfilledEntry = fulfillSegmentCacheEntry(upgradeToPendingSegment(detachedEntry, fetchStrategy), data.rsc, entryStaleAt, isPartial, responseIsUpgradeableISRFallback, recordedFetchStrategy);
            upsertSegmentEntry(now, map, payloadVaryPath, fulfilledEntry, node.tree.varyPath);
        }
        node = node.parent;
        dataIndex++;
    }
    // If the server returned fewer segments than expected, reject any
    // remaining pending entries so they don't stay Pending forever.
    if (node !== null) {
        rejectRemainingSegmentsInBundle(node, now + 10 * 1000);
    }
}
/**
 * Clones a SegmentBundle chain with every `entry` removed, so a write walk
 * over it is pure detached upserts. Used for the payload that does NOT
 * match the bundle's spawned entries (see writeSegmentBundleResponse).
 */ function detachEntriesFromSegmentBundle(segments) {
    const head = {
        tree: segments.tree,
        entry: null,
        parent: null
    };
    let clonedTail = head;
    let node = segments.parent;
    while(node !== null){
        const clonedNode = {
            tree: node.tree,
            entry: null,
            parent: null
        };
        clonedTail.parent = clonedNode;
        clonedTail = clonedNode;
        node = node.parent;
    }
    return head;
}
// TODO: Consolidate the read* helpers below with the ones in
// vary-params-decoding — they all perform a version of the same synchronous
// read of a buffered decode's late-resolving values.
/**
 * Reads a segment's partialness from its `isPartial` promise. (Unlike the
 * values read via `readFulfilledValue` below, the fulfillment value here is
 * void — partialness is encoded as the ABSENCE of a fulfillment.) The server
 * fulfills it only for a fully-static segment and leaves it pending for a
 * partial one (see `SegmentPrefetch['isPartial']`), so partial == not
 * fulfilled. The read is synchronous because the response is fully buffered
 * before it's decoded, so a fulfillment is already visible on the thenable's
 * status — the same trick `readVaryParams` uses for the vary params iterables.
 */ function readFulfilledIsPartial(isPartial) {
    const thenable = isPartial;
    // Force Flight to unwrap a received-but-not-yet-settled row. A pending row,
    // or a truncated shell decode whose fulfillment landed past the boundary,
    // stays non-fulfilled — read as partial, which is correct either way.
    thenable.then(noop, noop);
    return thenable.status !== 'fulfilled';
}
/**
 * Reads a late-resolving value off a fully-buffered decode's thenable status,
 * using the same trick as above. Returns `valueIfUnresolved` for a row that
 * is pending or absent in this decode — e.g. one whose fulfillment landed
 * past a truncated shell decode's boundary. That's what scopes a response's
 * late-resolving signals to the payload being decoded.
 */ function readFulfilledValue(valueFromServer, valueIfUnresolved) {
    const thenable = valueFromServer;
    // Force Flight to unwrap a received-but-not-yet-settled row.
    thenable.then(noop, noop);
    if (thenable.status === 'fulfilled' && thenable.value !== undefined) {
        return thenable.value;
    }
    return valueIfUnresolved;
}
/**
 * Reads a stale-at time from the staleTime async iterable of a fully-buffered
 * response — segment bundles and stage decodes, which go through
 * `createNonTaskyPrefetchResponseStream`. Because the bytes are all present,
 * each yielded value is already visible on its chunk's thenable status (the
 * same trick `readVaryParams` uses), so this drains synchronously and takes
 * the last value (the final staleTime, as `resolveStaleAt` does for the
 * async case). A missing iterable, or a truncated shell decode whose value
 * landed past the boundary, reads as absent and falls back to the static
 * stale time.
 *
 * For the one response kind that isn't buffered when read — a dynamic `Full`
 * response (fetchStrategy.Full with Partial Prefetching disabled) — use
 * `resolveStaleAt` instead, since its values aren't materialized synchronously.
 */ function readFulfilledStaleAt(now, staleTime) {
    if (staleTime === undefined) {
        return now + _navigatereducer.STATIC_STALETIME_MS;
    }
    const iterator = staleTime[Symbol.asyncIterator]();
    let staleTimeSeconds;
    while(true){
        const chunk = iterator.next();
        chunk.then(noop, noop);
        if (chunk.status !== 'fulfilled' || chunk.value === undefined) {
            break;
        }
        if (chunk.value.done) {
            break;
        }
        staleTimeSeconds = chunk.value.value;
    }
    if (staleTimeSeconds === undefined || isNaN(staleTimeSeconds)) {
        return now + _navigatereducer.STATIC_STALETIME_MS;
    }
    return now + getStaleTimeMs(staleTimeSeconds);
}
const noop = ()=>{};
/**
 * The localized retry loop for an upgradeable fallback shell. Re-issues the
 * exact same segment-bundle request (via `fetchSegmentsOnCacheMissImpl`) up to
 * MAX_FALLBACK_RETRIES times, FALLBACK_RETRY_DELAY_MS apart, until the server
 * returns the concrete (upgraded) version. On success it upserts the upgraded
 * segments (so they aren't re-fetched) and pings the task, so the task's
 * *other* fallback segments get re-attempted. If every attempt is still a
 * fallback (or fails), it gives up.
 *
 * A loop runs at most once per task, ever (the caller gates on
 * `fallbackRetryStatus === Empty`, set to `Pending` before this runs and never
 * reset to `Empty`). The sleep timer is never `clearTimeout`-ed, so the awaited
 * sleep always settles; the loop simply checks `isCanceled` after waking and
 * bails if the task was canceled in the meantime. On success the status becomes
 * `Fulfilled`; on any non-success exit (exhausted retries, fetch error, or
 * cancel) it becomes `Rejected`.
 */ async function retryUpgradeableFallbackPrefetch(task, route, routeKey, tree, segments, segmentCount, // result is written through the same payload fork so the same cache slots
// (including the shell paths) are upgraded.
fetchStrategy) {
    for(let attempt = 0; attempt < MAX_FALLBACK_RETRIES; attempt++){
        await new Promise((resolve)=>setTimeout(resolve, FALLBACK_RETRY_DELAY_MS));
        if (task.isCanceled) {
            break;
        }
        let result;
        try {
            result = await fetchSegmentsOnCacheMissImpl(route, routeKey, tree);
        } catch  {
            break;
        }
        if (task.isCanceled) {
            break;
        }
        if (result === null) {
            continue;
        }
        if (result.serverResponse.isUpgradeableISRFallback) {
            continue;
        }
        // Success: the server returned the concrete (upgraded) version. Write it
        // back through the same payload fork as the initial fetch, so every slot
        // the initial fetch wrote — including the shell paths, even when the
        // upgraded response is fully static (shell === full) — is upgraded. The
        // bundle's entries were already settled by the initial fetch, so every
        // write is a detached upsert that replaces the fallback. Mark the loop
        // fulfilled and ping the task; its other fallback segments are now
        // allowed to revalidate.
        const { serverResponse, shellResponse, responseSize } = result;
        const now = Date.now();
        writeSegmentBundleResponseVariants(task.segmentCacheMap, serverResponse, shellResponse, responseSize, segments, segmentCount, now, fetchStrategy);
        task.fallbackRetryStatus = _cachemap.EntryStatus.Fulfilled;
        (0, _scheduler.pingPrefetchTask)(task);
        return;
    }
    // The loop finished without success (exhausted its retries, broke out on a
    // fetch error, or the task was canceled). It won't run again for this task.
    task.fallbackRetryStatus = _cachemap.EntryStatus.Rejected;
}
async function fetchSegmentPrefetchesUsingDynamicRequest(task, route, fetchStrategy, dynamicRequestTree, spawnedEntries) {
    const key = task.key;
    const url = new URL(route.canonicalUrl, location.origin);
    const nextUrl = key.nextUrl;
    if (spawnedEntries.size === 1 && spawnedEntries.has(route.metadata.requestKey)) {
        // The only thing pending is the head. Instruct the server to
        // skip over everything else.
        // TODO: Lift this logic into the caller. Or perhaps unify the
        // "request tree" and the spawnedEntries into the same type so they are
        // guaranteed to always been in sync.
        dynamicRequestTree = MetadataOnlyRequestTree;
    }
    const headers = {
        [_approuterheaders.RSC_HEADER]: '1',
        [_approuterheaders.NEXT_ROUTER_STATE_TREE_HEADER]: (0, _flightdatahelpers.prepareFlightRouterStateForRequest)(dynamicRequestTree)
    };
    if (nextUrl !== null) {
        headers[_approuterheaders.NEXT_URL] = nextUrl;
    }
    switch(fetchStrategy){
        case _types.FetchStrategy.Full:
            {
                break;
            }
        case _types.FetchStrategy.PPRRuntime:
            {
                headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] = '2';
                break;
            }
        case _types.FetchStrategy.RuntimeShell:
            {
                headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] = '3';
                break;
            }
        case _types.FetchStrategy.LoadingBoundary:
            {
                headers[_approuterheaders.NEXT_ROUTER_PREFETCH_HEADER] = '1';
                break;
            }
        default:
            {
                fetchStrategy;
            }
    }
    try {
        const response = await fetchPrefetchResponse(url, headers);
        if (!response || !response.ok || !response.body) {
            // Server responded with an error, or with a miss. We should still cache
            // the response, but we can try again after 10 seconds.
            rejectSegmentEntriesIfStillPending(spawnedEntries, Date.now() + 10 * 1000);
            return null;
        }
        const renderedSearch = (0, _routeparams.getRenderedSearch)(response);
        if (renderedSearch !== route.renderedSearch) {
            // The search params that were used to render the target page are
            // different from the search params in the request URL. This only happens
            // when there's a dynamic rewrite in between the tree prefetch and the
            // data prefetch.
            // TODO: For now, since this is an edge case, we reject the prefetch, but
            // the proper way to handle this is to evict the stale route tree entry
            // then fill the cache with the new response.
            rejectSegmentEntriesIfStillPending(spawnedEntries, Date.now() + 10 * 1000);
            return null;
        }
        // Track when the network connection closes. Only meaningful for Full
        // (dynamic) prefetches which use incremental streaming. For buffered
        // paths, this is resolved immediately — see TODO in fetchRouteOnCacheMiss.
        const closed = (0, _promisewithresolvers.createPromiseWithResolvers)();
        let fulfilledEntries = null;
        let prefetchStream;
        let bufferedResponseSize = null;
        if (fetchStrategy === _types.FetchStrategy.Full) {
            // Full prefetches are dynamic responses stored in the prefetch cache.
            // They don't carry vary params or other cache metadata, so there's no
            // need to buffer them. Use the incremental version to allow data to be
            // processed as it arrives.
            prefetchStream = createIncrementalPrefetchResponseStream(response.body, closed.resolve, function onResponseSizeUpdate(totalBytesReceivedSoFar) {
                // When processing a dynamic response, we don't know how large each
                // individual segment is, so approximate by assigning each segment
                // the average of the total response size.
                if (fulfilledEntries === null) {
                    // Haven't received enough data yet to know which segments
                    // were included.
                    return;
                }
                const averageSize = totalBytesReceivedSoFar / fulfilledEntries.length;
                for (const entry of fulfilledEntries){
                    (0, _cachemap.setSizeInCacheMap)(entry, averageSize);
                }
            });
        } else {
            const { stream, size } = await createNonTaskyPrefetchResponseStream(response.body);
            closed.resolve();
            prefetchStream = stream;
            bufferedResponseSize = size;
        }
        const [serverData, cacheData] = await Promise.all([
            (0, _fetchserverresponse.createFromNextReadableStream)(prefetchStream, headers, {
                allowPartialStream: true
            }),
            response.cacheData
        ]);
        const now = Date.now();
        const staleAt = await resolveStaleAt(now, serverData.s, response);
        const buildId = response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverData.b;
        // Check if a reusable App Shell can be extracted from the main response.
        let serverDataThatSatisfiesSpawnedEntries;
        // The shell and full response have independent stale times. Track the
        // staleAt that corresponds to whatever payload the spawned entries get
        // filled with below.
        let staleAtForSpawnedEntries = staleAt;
        if (cacheData === null) {
            // No shell can be extracted without cache metadata (only present when
            // Cached Navigations is enabled). For routes without a distinct App Shell
            // the extraction below is a no-op anyway (`resolveShellStageData` returns
            // null), so this just short-circuits that case.
            serverDataThatSatisfiesSpawnedEntries = serverData;
        } else {
            const shellStageData = await (0, _fetchserverresponse.resolveShellStageData)(cacheData, serverData, headers);
            if (shellStageData === null) {
                // No App Shell can be extracted. This usually means the entire response
                // _is_ the App Shell. The other possibility (for now, until the feature
                // is fully stabilized) is that App Shells are not yet enabled. Either
                // way, there's nothing extra for us to do: fulfill the pending entries
                // using the response from the server.
                serverDataThatSatisfiesSpawnedEntries = serverData;
            } else {
                // Successfully extracted an App Shell that is a subset of the main
                // response. Depending on the type of prefetch this is, we need to
                // decide whether to fulfill the pending entries with the shell or with
                // the entire response. In either scenario, we'll be inserting _both_
                // versions of the response into the cache; the extra logic is only
                // here so that we don't fulfill pending shell entries with something
                // that's more concrete than what they expect.
                // TODO: The only reason this matters is because during a navigation,
                // if a segment is still pending, we render a promise that resolves to
                // the eventual value of that segment. But that means we cannot
                // eventually resolve that segment to something more concrete than what
                // was already requested. Hence the extra logic here. A cleaner way to
                // model this, though, is whenever we render a promise that resolves to
                // the result of a pending entry, do one additional cache look-up right
                // after the promise resolves, to ensure we never get a mismatching
                // entry. Leaving this for a follow up.
                // shellStageData is a fully-buffered stage decode, so read staleTime
                // synchronously off the thenable status.
                const shellStaleAt = readFulfilledStaleAt(now, shellStageData.s);
                if (fetchStrategy === _types.FetchStrategy.RuntimeShell) {
                    // This is a Shell prefetch, so the pending entries must be fulfilled
                    // with the shell.
                    serverDataThatSatisfiesSpawnedEntries = shellStageData;
                    staleAtForSpawnedEntries = shellStaleAt;
                    // Separately, we'll also cache the entire response, by upserting it
                    // into the cache.
                    writePrerenderResponseIntoCache(now, _types.FetchStrategy.PPR, serverData.f, buildId, serverData.h, serverData.r ?? null, staleAt, dynamicRequestTree, renderedSearch, cacheData.isResponsePartial, task.segmentCacheMap);
                } else {
                    // This is _not_ a Shell prefetch, so the pending entries should be
                    // fulfilled with the entire response.
                    serverDataThatSatisfiesSpawnedEntries = serverData;
                    // Additionally, we might as well upsert the extracted Shell into the
                    // cache, too.
                    // `shellStageData` is only provided in cases where the shell is
                    // different from the main response. If they are equivalent, this
                    // branch is skipped. So it follows that any shell data reaches
                    // this path must be partial -- it does not represent the entire
                    // UI of the target page.
                    const isShellStagePartial = true;
                    writePrerenderResponseIntoCache(now, _types.FetchStrategy.RuntimeShell, shellStageData.f, buildId, shellStageData.h, shellStageData.r ?? null, shellStaleAt, dynamicRequestTree, renderedSearch, isShellStagePartial, task.segmentCacheMap);
                }
            }
        }
        // Read head vary params synchronously (unioning in the response-level root
        // params). Individual segments carry their own iterables in
        // CacheNodeSeedData; the root iterable is threaded down so each segment
        // unions it too.
        const rootVaryParamsIterable = serverDataThatSatisfiesSpawnedEntries.r ?? null;
        const headVaryParams = (0, _varyparamsdecoding.readVaryParams)(serverDataThatSatisfiesSpawnedEntries.h, rootVaryParamsIterable);
        // PPRRuntime and RuntimeShell prefetches are partial when the server
        // marks the response as '~' (Partial). RuntimeShell additionally omits
        // every dynamic suspense boundary below the App Shell, so its segments
        // are always partial regardless of what the server marker says.
        // Full/LoadingBoundary prefetches are always complete.
        const isResponsePartial = fetchStrategy === _types.FetchStrategy.RuntimeShell || fetchStrategy === _types.FetchStrategy.PPRRuntime && (cacheData?.isResponsePartial ?? false);
        const flightDatas = (0, _flightdatahelpers.normalizeFlightData)(serverDataThatSatisfiesSpawnedEntries.f);
        if (typeof flightDatas === 'string') {
            rejectSegmentEntriesIfStillPending(spawnedEntries, Date.now() + 10 * 1000);
            return null;
        }
        const navigationSeed = (0, _navigation.convertServerPatchToFullTree)(now, dynamicRequestTree, flightDatas, renderedSearch, _bfcache.UnknownDynamicStaleTime);
        if (navigationSeed.treeDivergedFromBase && // A head-only request uses the MetadataOnlyRequestTree stub rather than
        // a tree derived from the route entry, so divergence from it carries
        // no signal.
        // TODO: This special case goes away once convertServerPatchToFullTree
        // diffs against the base RouteTree (route.tree) instead of the
        // request tree.
        dynamicRequestTree !== MetadataOnlyRequestTree) {
            // The server rendered a different route tree than the one we requested:
            // the URL has a rewrite that behaves dynamically, so the params baked
            // into the request are wrong and the server can never fulfill it. Mark
            // the route entry — which doubles as the stored prediction pattern, so
            // this also disables a bad prediction (see matchKnownRoute) that would
            // otherwise be re-derived on every retry — and invalidate entries that
            // were derived from it. This mirrors dispatchRetryDueToTreeMismatch on
            // the navigation path. It can't loop: the refetched route entry is
            // built from the server's response, so it only mismatches again if the
            // rewrite's behavior changes again.
            markRouteEntryAsDynamicRewrite(route);
            invalidateRouteCacheEntries(key.nextUrl, task.treeAtTimeOfPrefetch);
            // Reject with an immediate expiration instead of the usual backoff: the
            // invalidation above triggers a re-prefetch, which per the above does
            // not loop.
            // TODO: Consider also bounding retries with a counter on the task
            // object, so a prefetch that repeatedly fails to settle backs off
            // regardless of the reason.
            rejectSegmentEntriesIfStillPending(spawnedEntries, -1);
            return null;
        }
        // Aside from writing the data into the cache, this function also returns
        // the entries that were fulfilled, so we can streamingly update their sizes
        // in the LRU as more data comes in.
        fulfilledEntries = writeDynamicRenderResponseIntoCache(now, fetchStrategy, flightDatas, buildId, isResponsePartial, headVaryParams, rootVaryParamsIterable, staleAtForSpawnedEntries, navigationSeed, spawnedEntries, task.segmentCacheMap);
        // For buffered responses, update LRU sizes now that we know which
        // entries were fulfilled.
        if (bufferedResponseSize !== null && fulfilledEntries !== null && fulfilledEntries.length > 0) {
            const averageSize = bufferedResponseSize / fulfilledEntries.length;
            for (const entry of fulfilledEntries){
                (0, _cachemap.setSizeInCacheMap)(entry, averageSize);
            }
        }
        // Return a promise that resolves when the network connection closes, so
        // the scheduler can track the number of concurrent network connections.
        return {
            value: null,
            closed: closed.promise
        };
    } catch (error) {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        rejectSegmentEntriesIfStillPending(spawnedEntries, Date.now() + 10 * 1000);
        return null;
    }
}
function writeDynamicTreeResponseIntoCache(now, fetchStrategy, response, serverData, entry, couldBeIntercepted, canonicalUrl, routeIsPPREnabled, headVaryParams, rootVaryParamsIterable, originalPathname, originalSearch, nextUrl, map) {
    const renderedSearch = (0, _routeparams.getRenderedSearch)(response);
    const normalizedFlightDataResult = (0, _flightdatahelpers.normalizeFlightData)(serverData.f);
    if (// MPA navigation.
    typeof normalizedFlightDataResult === 'string' || normalizedFlightDataResult.length !== 1) {
        rejectRouteCacheEntry(entry, now + 10 * 1000);
        return;
    }
    const flightData = normalizedFlightDataResult[0];
    if (!flightData.isRootRender) {
        // Unexpected response format.
        rejectRouteCacheEntry(entry, now + 10 * 1000);
        return;
    }
    const flightRouterState = flightData.tree;
    // If the response was postponed, segments may contain dynamic holes.
    // The head has its own partiality flag (flightDataEntry.isHeadPartial)
    // which is handled separately in writeDynamicRenderResponseIntoCache.
    const isResponsePartial = response.headers.get(_approuterheaders.NEXT_DID_POSTPONE_HEADER) === '1';
    // Convert the server-sent data into the RouteTree format used by the
    // client cache.
    //
    // During this traversal, we accumulate additional data into this
    // "accumulator" object.
    const acc = {
        metadataVaryPath: null,
        treeDivergedFromBase: false
    };
    const routeTree = convertRootFlightRouterStateToRouteTree(flightRouterState, renderedSearch, acc);
    const metadataVaryPath = acc.metadataVaryPath;
    if (metadataVaryPath === null) {
        rejectRouteCacheEntry(entry, now + 10 * 1000);
        return;
    }
    (0, _optimisticroutes.discoverKnownRoute)(now, originalPathname, originalSearch, nextUrl, entry, routeTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, routeIsPPREnabled, false // hasDynamicRewrite
    );
    // If the server sent segment data as part of the response, we should write
    // it into the cache to prevent a second, redundant prefetch request.
    // TODO: This is a leftover branch from before Client Segment Cache was
    // enabled everywhere. Tree prefetches should never include segment data.  We
    // can delete it. Leaving for a subsequent PR.
    const navigationSeed = (0, _navigation.convertServerPatchToFullTree)(now, flightRouterState, normalizedFlightDataResult, renderedSearch, _bfcache.UnknownDynamicStaleTime);
    const buildId = response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? serverData.b;
    writeDynamicRenderResponseIntoCache(now, fetchStrategy, normalizedFlightDataResult, buildId, isResponsePartial, headVaryParams, rootVaryParamsIterable, getStaleAtFromHeader(now, response), navigationSeed, null, map);
}
function rejectSegmentEntriesIfStillPending(entries, staleAt) {
    const fulfilledEntries = [];
    for (const entry of entries.values()){
        if (entry.status === _cachemap.EntryStatus.Pending) {
            rejectSegmentCacheEntry(entry, staleAt);
        } else if (entry.status === _cachemap.EntryStatus.Fulfilled) {
            fulfilledEntries.push(entry);
        }
    }
    return fulfilledEntries;
}
function writeDynamicRenderResponseIntoCache(now, fetchStrategy, flightDatas, buildId, isResponsePartial, headVaryParams, rootVaryParamsIterable, staleAt, navigationSeed, spawnedEntries, // spawning task's `PrefetchTask.segmentCacheMap` for prefetches, the
// navigation's map for navigation-side writes. Binding the write to the
// requesting work means a response that lands after a testing-lock scope
// boundary still writes into the map its entries live in.
map) {
    if (buildId && buildId !== (0, _navigationbuildid.getNavigationBuildId)()) {
        // The server build does not match the client. Treat as a 404. During
        // an actual navigation, the router will trigger an MPA navigation.
        if (spawnedEntries !== null) {
            rejectSegmentEntriesIfStillPending(spawnedEntries, now + 10 * 1000);
        }
        return null;
    }
    const routeTree = navigationSeed.routeTree;
    const metadataTree = navigationSeed.metadataVaryPath !== null ? createMetadataRouteTree(navigationSeed.metadataVaryPath) : null;
    for (const flightDataEntry of flightDatas){
        const seedData = flightDataEntry.seedData;
        if (seedData !== null) {
            // The data sent by the server represents only a subtree of the app. We
            // need to find the part of the task tree that matches the response.
            //
            // segmentPath represents the parent path of subtree. It's a repeating
            // pattern of parallel route key and segment:
            //
            //   [string, Segment, string, Segment, string, Segment, ...]
            const segmentPath = flightDataEntry.segmentPath;
            let tree = routeTree;
            for(let i = 0; i < segmentPath.length; i += 2){
                const parallelRouteKey = segmentPath[i];
                const childTree = tree?.slots?.get(parallelRouteKey);
                if (childTree !== undefined) {
                    tree = childTree;
                } else {
                    if (spawnedEntries !== null) {
                        rejectSegmentEntriesIfStillPending(spawnedEntries, now + 10 * 1000);
                    }
                    return null;
                }
            }
            writeSeedDataIntoCache(now, // spawning task's `PrefetchTask.segmentCacheMap`).
            map, fetchStrategy, tree, staleAt, seedData, isResponsePartial, rootVaryParamsIterable, spawnedEntries);
        }
        const head = flightDataEntry.head;
        if (head !== null && metadataTree !== null) {
            // When Cache Components is enabled, the server's `isHeadPartial` flag
            // (isPossiblyPartialHead in app-render.tsx) is unreliable: it's computed
            // before the head is serialized, so it's conservatively `true` for every
            // statically-generated PPR page — even pages whose head is actually
            // complete — and it's `false` for runtime/dynamic responses whose head is
            // actually partial (e.g. a route with an async `generateMetadata`). So we
            // ignore it and derive the head's partiality from whether the response
            // itself was partial, exactly as we do for segments (see
            // `writeSeedDataIntoCache`). A non-partial response carries a complete
            // head; a partial (postponed) one does not.
            //
            // Without Cache Components, the server sends the correct isHeadPartial.
            const isHeadPartial = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : flightDataEntry.isHeadPartial;
            fulfillEntrySpawnedByRuntimePrefetch(now, // spawning task's `PrefetchTask.segmentCacheMap`).
            map, fetchStrategy, head, isHeadPartial, staleAt, // parameter.
            headVaryParams, metadataTree, spawnedEntries);
        }
    }
    // Any entry that's still pending was intentionally not rendered by the
    // server, because it was inside the loading boundary. Mark them as rejected
    // so we know not to fetch them again.
    // TODO: If PPR is enabled on some routes but not others, then it's possible
    // that a different page is able to do a per-segment prefetch of one of the
    // segments we're marking as rejected here. We should mark on the segment
    // somehow that the reason for the rejection is because of a non-PPR prefetch.
    // That way a per-segment prefetch knows to disregard the rejection.
    if (spawnedEntries !== null) {
        const fulfilledEntries = rejectSegmentEntriesIfStillPending(spawnedEntries, now + 10 * 1000);
        return fulfilledEntries;
    }
    return null;
}
function writeSeedDataIntoCache(now, map, fetchStrategy, tree, staleAt, seedData, isResponsePartial, rootVaryParamsIterable, entriesOwnedByCurrentTask) {
    // This function is used to write the result of a runtime server request
    // (CacheNodeSeedData) into the prefetch cache.
    const rsc = seedData[0];
    const isPartial = rsc === null || isResponsePartial;
    // Each segment carries its own vary params iterable in the seed data, which
    // drains to the set of params the segment accessed during render. A null
    // iterable means tracking was not enabled (not a prerender). readVaryParams
    // unions in the response-level root params.
    const varyParams = (0, _varyparamsdecoding.readVaryParams)(seedData[4], rootVaryParamsIterable);
    fulfillEntrySpawnedByRuntimePrefetch(now, // task's `PrefetchTask.segmentCacheMap`).
    map, fetchStrategy, rsc, isPartial, staleAt, varyParams, tree, entriesOwnedByCurrentTask);
    // Recursively write the child data into the cache.
    const slots = tree.slots;
    if (slots !== null) {
        const seedDataChildren = seedData[1];
        for (const [parallelRouteKey, childTree] of slots){
            const childSeedData = seedDataChildren[parallelRouteKey];
            if (childSeedData !== null && childSeedData !== undefined) {
                writeSeedDataIntoCache(now, map, fetchStrategy, childTree, staleAt, childSeedData, isResponsePartial, rootVaryParamsIterable, entriesOwnedByCurrentTask);
            }
        }
    }
}
function fulfillEntrySpawnedByRuntimePrefetch(now, map, fetchStrategy, rsc, isPartial, staleAt, segmentVaryParams, tree, entriesOwnedByCurrentTask) {
    // Decide whether to re-key the entry under a more generic vary path based on
    // which params the segment actually depends on.
    //
    // Skip re-keying for Full prefetches: as of today, `varyParams` tracking only
    // works within the static stage portion of a response. A Full prefetch
    // response covers all stages, and we can't track params during the dynamic
    // stage without dead-locking the Flight stream, so the server-reported set is
    // incomplete and can't be trusted for the full response. Re-keying with an
    // untrustworthy set could replace concrete params with Fallback and let
    // unrelated URLs read each other's content from the cache.
    //
    // For RuntimeShell prefetches, always re-key to the precomputed shell vary
    // path. A shell entry is spawned at a concrete param path but is reusable
    // across all of them; tree.shellVaryPath (root-param values kept, every other
    // param replaced with Fallback) is exactly the path that shell reads look it
    // up under.
    let fulfilledVaryPath = null;
    if ("TURBOPACK compile-time truthy", 1) {
        if (fetchStrategy === _types.FetchStrategy.RuntimeShell) {
            fulfilledVaryPath = tree.shellVaryPath;
        } else if (fetchStrategy !== _types.FetchStrategy.Full && segmentVaryParams !== null) {
            fulfilledVaryPath = (0, _varypath.getFulfilledSegmentVaryPath)(tree.varyPath, segmentVaryParams);
        }
    }
    // We should only write into cache entries that are owned by us. Or create
    // a new one and write into that. We must never write over an entry that was
    // created by a different task, because that causes data races.
    const ownedEntry = entriesOwnedByCurrentTask !== null ? entriesOwnedByCurrentTask.get(tree.requestKey) : undefined;
    if (ownedEntry !== undefined) {
        const fulfilledEntry = fulfillSegmentCacheEntry(ownedEntry, rsc, staleAt, isPartial, false, fetchStrategy);
        // Re-key the entry at its canonical path. When `varyParams` produced a
        // generalized path above, use that; otherwise fall back to the request's
        // own keying (this is load-bearing for entries spawned as revalidations:
        // without the re-key they'd stay in their Revalidation slot forever,
        // invisible to canonical reads, and the partial entry that prompted the
        // revalidation would keep serving navigations). Full responses are
        // excluded, matching the varyParams re-key: they're spawned as canonical
        // entries at their final path, and their vary tracking can't be trusted
        // for re-keying (see the fulfilledVaryPath derivation above).
        const canonicalVaryPath = fulfilledVaryPath !== null ? fulfilledVaryPath : fetchStrategy !== _types.FetchStrategy.Full ? (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree) : null;
        if (canonicalVaryPath !== null) {
            const isRevalidation = false;
            (0, _cachemap.setInCacheMap)(map, canonicalVaryPath, fulfilledEntry, isRevalidation);
            // The re-key moved the entry to a more generic path (and, for a spawned
            // revalidation, vacated its Revalidation slot). A stale settled entry
            // at a more specific path — e.g. the partial entry that prompted the
            // revalidation — would shadow every read at the concrete lookup path,
            // causing the scheduler to keep re-reading the stale entry and respawn
            // the revalidation forever. Evict it so the fulfilled entry is
            // reachable. See evictShadowingSegmentEntries.
            evictShadowingSegmentEntries(now, map, tree.varyPath, fulfilledEntry);
        }
    } else {
        // There's no matching entry. Attempt to create a new one.
        let possiblyNewEntry = (0, _cachemap.getFromCacheMap)(now, getCurrentSegmentCacheVersion(), map, tree.varyPath, false, false);
        if (possiblyNewEntry === null) {
            possiblyNewEntry = insertEmptySegmentCacheEntry(now, map, fetchStrategy, tree);
        }
        if (possiblyNewEntry.status === _cachemap.EntryStatus.Empty) {
            // Confirmed this is a new entry. We can fulfill it.
            const newEntry = possiblyNewEntry;
            const fulfilledEntry = fulfillSegmentCacheEntry(upgradeToPendingSegment(newEntry, fetchStrategy), rsc, staleAt, isPartial, false, fetchStrategy);
            if (fulfilledVaryPath !== null) {
                const isRevalidation = false;
                (0, _cachemap.setInCacheMap)(map, fulfilledVaryPath, fulfilledEntry, isRevalidation);
                // Same as the owned-entry re-key above. Usually the entry really is
                // new — the read a moment ago returned nothing at the concrete lookup
                // path, so nothing can shadow it and this is a no-op — but this
                // branch also claims a pre-existing Empty entry, and re-keying that
                // away can expose a stale settled entry at an intermediate path.
                evictShadowingSegmentEntries(now, map, tree.varyPath, fulfilledEntry);
            }
        } else {
            // There was already an entry in the cache. But we may be able to
            // replace it with the new one from the server.
            const newEntry = fulfillSegmentCacheEntry(upgradeToPendingSegment(createDetachedSegmentCacheEntry(now), fetchStrategy), rsc, staleAt, isPartial, false, fetchStrategy);
            const varyPath = fulfilledVaryPath !== null ? fulfilledVaryPath : (0, _varypath.getSegmentVaryPathForRequest)(fetchStrategy, tree);
            // Pass the concrete lookup path so that if the entry was re-keyed to
            // a more generic path, any stale settled entry at a more specific path
            // that would shadow it is evicted (the upsert handles this; the other
            // branches above call evictShadowingSegmentEntries themselves).
            upsertSegmentEntry(now, map, varyPath, newEntry, tree.varyPath);
        }
    }
}
async function fetchPrefetchResponse(url, headers) {
    const fetchPriority = 'low';
    // When issuing a prefetch request, don't immediately decode the response; we
    // use the lower level `createFromResponse` API instead because we need to do
    // some extra processing of the response stream. See
    // `createNonTaskyPrefetchResponseStream` for more details.
    const shouldImmediatelyDecode = false;
    const response = await (0, _fetchserverresponse.createFetch)(url, headers, fetchPriority, shouldImmediatelyDecode);
    if (!response.ok) {
        return null;
    }
    // Check the content type
    if ("TURBOPACK compile-time falsy", 0) {
    // In output: "export" mode, we relaxed about the content type, since it's
    // not Next.js that's serving the response. If the status is OK, assume the
    // response is valid. If it's not a valid response, the Flight client won't
    // be able to decode it, and we'll treat it as a miss.
    } else {
        const contentType = response.headers.get('content-type');
        const isFlightResponse = contentType && contentType.startsWith(_approuterheaders.RSC_CONTENT_TYPE_HEADER);
        if (!isFlightResponse) {
            return null;
        }
    }
    return response;
}
async function createNonTaskyPrefetchResponseStream(body, byteLimit) {
    // Buffer the entire response before passing it to the Flight client. This
    // ensures that when Flight processes the stream, all model data is available
    // synchronously. This is important for readVaryParams, which synchronously
    // checks the thenable status — if data arrived in multiple network chunks,
    // the thenables might not yet be fulfilled.
    //
    // TODO: There are too many intermediate stream transformations in the
    // prefetch response pipeline (e.g. stripIsPartialByte, this function).
    // These could all be consolidated into a single transformation. Refactor
    // once the cached navigations experiment lands.
    //
    // Read the response from the network, optionally truncating at byteLimit.
    const reader = body.getReader();
    const chunks = [];
    let size = 0;
    while(true){
        const { done, value } = await reader.read();
        if (done) break;
        if (byteLimit !== undefined && size + value.byteLength >= byteLimit) {
            const remaining = byteLimit - size;
            if (remaining > 0) {
                chunks.push(value.byteLength > remaining ? value.subarray(0, remaining) : value);
                size += remaining;
            }
            reader.cancel();
            break;
        }
        chunks.push(value);
        size += value.byteLength;
    }
    // Concatenate into a single chunk so that Flight's processBinaryChunk
    // processes all rows synchronously in one call. Multiple chunks would not
    // be sufficient: even though reader.read() resolves as a microtask for
    // already-enqueued data, the `await` continuation from
    // createFromReadableStream can interleave between chunks. If the root
    // model row isn't the first row (e.g. outlined values come first), the
    // PromiseResolveThenableJob from `await` can cause the root to initialize
    // eagerly, scheduling the continuation before remaining chunks (including
    // promise value rows) are processed. A single chunk avoids this.
    let buffer;
    if (chunks.length === 1) {
        buffer = chunks[0];
    } else if (chunks.length > 1) {
        buffer = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks){
            buffer.set(chunk, offset);
            offset += chunk.byteLength;
        }
    } else {
        buffer = new Uint8Array(0);
    }
    const stream = new ReadableStream({
        start (controller) {
            controller.enqueue(buffer);
            controller.close();
        }
    });
    return {
        stream,
        size,
        buffer
    };
}
/**
 * Creates a streaming (non-buffered) prefetch response stream for dynamic/Full
 * prefetches. These are essentially dynamic responses that get stored in the
 * prefetch cache — they don't carry vary params or other cache metadata that
 * requires synchronous thenable resolution, so there's no need to buffer them.
 * They should continue to stream so consumers can process data as it arrives.
 */ function createIncrementalPrefetchResponseStream(originalFlightStream, onStreamClose, onResponseSizeUpdate) {
    // While processing the original stream, we incrementally update the size
    // of the cache entry in the LRU.
    let totalByteLength = 0;
    const reader = originalFlightStream.getReader();
    return new ReadableStream({
        async pull (controller) {
            while(true){
                const { done, value } = await reader.read();
                if (!done) {
                    // Pass to the target stream and keep consuming the Flight response
                    // from the server.
                    controller.enqueue(value);
                    // Incrementally update the size of the cache entry in the LRU.
                    totalByteLength += value.byteLength;
                    onResponseSizeUpdate(totalByteLength);
                    continue;
                }
                controller.close();
                onStreamClose();
                return;
            }
        }
    });
}
function addSegmentPathToUrlInOutputExportMode(url, segmentPath) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return url;
}
function canNewFetchStrategyProvideMoreContent(currentStrategy, newStrategy) {
    return currentStrategy < newStrategy;
}
function getStaleAtFromHeader(now, response) {
    const staleTimeSeconds = parseInt(response.headers.get(_approuterheaders.NEXT_ROUTER_STALE_TIME_HEADER) ?? '', 10);
    const staleTimeMs = !isNaN(staleTimeSeconds) ? getStaleTimeMs(staleTimeSeconds) : _navigatereducer.STATIC_STALETIME_MS;
    return now + staleTimeMs;
}
async function resolveStaleAt(now, staleTimeIterable, response) {
    if (staleTimeIterable !== undefined) {
        // Iterate the async iterable and take the last yielded value. The server
        // yields updated staleTime values during the render; the last one is the
        // final staleTime.
        let staleTimeSeconds;
        for await (const value of staleTimeIterable){
            staleTimeSeconds = value;
        }
        if (staleTimeSeconds !== undefined) {
            const staleTimeMs = isNaN(staleTimeSeconds) ? _navigatereducer.STATIC_STALETIME_MS : getStaleTimeMs(staleTimeSeconds);
            return now + staleTimeMs;
        }
    }
    if (response !== undefined) {
        return getStaleAtFromHeader(now, response);
    }
    return now + _navigatereducer.STATIC_STALETIME_MS;
}
function writePrerenderResponseIntoCache(now, fetchStrategy, flightData, buildId, headVaryParamsIterable, rootVaryParamsIterable, staleAt, baseTree, renderedSearch, isResponsePartial, // writeDynamicRenderResponseIntoCache.
map) {
    // Root params are emitted once at the top level; readVaryParams unions them
    // into the head, and they're threaded down to each segment below.
    const headVaryParams = (0, _varyparamsdecoding.readVaryParams)(headVaryParamsIterable, rootVaryParamsIterable);
    const flightDatas = (0, _flightdatahelpers.normalizeFlightData)(flightData);
    if (typeof flightDatas === 'string') {
        return;
    }
    const navigationSeed = (0, _navigation.convertServerPatchToFullTree)(now, baseTree, flightDatas, renderedSearch, _bfcache.UnknownDynamicStaleTime);
    writeDynamicRenderResponseIntoCache(now, fetchStrategy, flightDatas, buildId, isResponsePartial, headVaryParams, rootVaryParamsIterable, staleAt, navigationSeed, null, map);
}
async function processRuntimePrefetchStream(now, runtimePrefetchStream, baseTree, renderedSearch) {
    const { stream, isPartial } = await stripIsPartialByte(runtimePrefetchStream);
    const serverData = await (0, _fetchserverresponse.createFromNextReadableStream)(stream, undefined, {
        allowPartialStream: true
    });
    // Root params are emitted once at the top level; readVaryParams unions them
    // into the head, and we return the iterable so the caller can union it into
    // each segment too.
    const rootVaryParamsIterable = serverData.r ?? null;
    const headVaryParams = (0, _varyparamsdecoding.readVaryParams)(serverData.h, rootVaryParamsIterable);
    const staleAt = await resolveStaleAt(now, serverData.s);
    const flightDatas = (0, _flightdatahelpers.normalizeFlightData)(serverData.f);
    if (typeof flightDatas === 'string') {
        return null;
    }
    const navigationSeed = (0, _navigation.convertServerPatchToFullTree)(now, baseTree, flightDatas, renderedSearch, _bfcache.UnknownDynamicStaleTime);
    return {
        flightDatas,
        navigationSeed,
        buildId: serverData.b,
        isResponsePartial: isPartial,
        headVaryParams,
        rootVaryParamsIterable,
        staleAt
    };
}
async function stripIsPartialByte(stream) {
    // When there is no recognized marker byte, the fallback depends on whether
    // Cached Navigations is enabled. When enabled, dynamic navigation responses
    // don't have a marker but may contain dynamic holes, so they are treated as
    // partial. When disabled, unmarked responses are treated as non-partial.
    const defaultIsPartial = !!("TURBOPACK compile-time value", false);
    const reader = stream.getReader();
    const { done, value } = await reader.read();
    if (done || !value || value.byteLength === 0) {
        return {
            stream: new ReadableStream({
                start: (c)=>c.close()
            }),
            isPartial: defaultIsPartial
        };
    }
    const firstByte = value[0];
    const hasMarker = firstByte === 0x23 || firstByte === 0x7e;
    const isPartial = hasMarker ? firstByte === 0x7e : defaultIsPartial;
    const remainder = hasMarker ? value.byteLength > 1 ? value.subarray(1) : null : value;
    return {
        isPartial,
        stream: new ReadableStream({
            start (controller) {
                if (remainder) {
                    controller.enqueue(remainder);
                }
            },
            async pull (controller) {
                const result = await reader.read();
                if (result.done) {
                    controller.close();
                } else {
                    controller.enqueue(result.value);
                }
            }
        })
    };
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/fetch.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "fetch", {
    enumerable: true,
    get: function() {
        return fetchInternal;
    }
});
const _navigationtestinglock = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
/**
 * Internal `fetch` used by the Next.js client router.
 *
 * When the Instant Navigation Testing API is enabled, the navigation lock may
 * install a blocking override on `window.fetch` for the duration of a lock
 * scope. To let internal fetches bypass the lock, callers go through a wrapper
 * that falls back to the pre-lock fetch captured at lock-acquire time.
 *
 * When the testing API is not enabled, this calls window.fetch directly.
 */ function fetchInternal(input, init) {
    if ("TURBOPACK compile-time truthy", 1) {
        const preLockFetch = (0, _navigationtestinglock.getPreLockFetch)();
        if (preLockFetch !== null) {
            return preLockFetch(input, init);
        }
    }
    return fetch(input, init);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/lru.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cleanup: null,
    deleteFromLru: null,
    lruPut: null,
    updateLruSize: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cleanup: function() {
        return cleanup;
    },
    deleteFromLru: function() {
        return deleteFromLru;
    },
    lruPut: function() {
        return lruPut;
    },
    updateLruSize: function() {
        return updateLruSize;
    }
});
const _cachemap = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-map.js [app-ssr] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/scheduler.js [app-ssr] (ecmascript)");
// We use an LRU for memory management. We must update this whenever we add or
// remove a new cache entry, or when an entry changes size.
let head = null;
let lruSize = 0;
// TODO: I chose the max size somewhat arbitrarily. Consider setting this based
// on navigator.deviceMemory, or some other heuristic. We should make this
// customizable via the Next.js config, too.
const maxLruSize = 50 * 1024 * 1024 // 50 MB
;
function lruPut(node) {
    if (head === node) {
        // Already at the head
        return;
    }
    const prev = node.prev;
    const next = node.next;
    if (next === null || prev === null) {
        // This is an insertion
        lruSize += node.size;
        // Whenever we add an entry, we need to check if we've exceeded the
        // max size. We don't evict entries immediately; they're evicted later in
        // an asynchronous task.
        ensureCleanupIsScheduled();
    } else {
        // This is a move. Remove from its current position.
        prev.next = next;
        next.prev = prev;
    }
    // Move to the front of the list
    if (head === null) {
        // This is the first entry
        node.prev = node;
        node.next = node;
    } else {
        // Add to the front of the list
        const tail = head.prev;
        node.prev = tail;
        // In practice, this is never null, but that isn't encoded in the type
        if (tail !== null) {
            tail.next = node;
        }
        node.next = head;
        head.prev = node;
    }
    head = node;
}
function updateLruSize(node, newNodeSize) {
    // This is a separate function from `put` so that we can resize the entry
    // regardless of whether it's currently being tracked by the LRU.
    const prevNodeSize = node.size;
    node.size = newNodeSize;
    if (node.next === null) {
        // This entry is not currently being tracked by the LRU.
        return;
    }
    // Update the total LRU size
    lruSize = lruSize - prevNodeSize + newNodeSize;
    ensureCleanupIsScheduled();
}
function deleteFromLru(deleted) {
    const next = deleted.next;
    const prev = deleted.prev;
    if (next !== null && prev !== null) {
        lruSize -= deleted.size;
        deleted.next = null;
        deleted.prev = null;
        // Remove from the list
        if (head === deleted) {
            // Update the head
            if (next === head) {
                // This was the last entry
                head = null;
            } else {
                head = next;
                prev.next = next;
                next.prev = prev;
            }
        } else {
            prev.next = next;
            next.prev = prev;
        }
    } else {
    // Already deleted
    }
}
function ensureCleanupIsScheduled() {
    if (lruSize <= maxLruSize) {
        return;
    }
    // To schedule cleanup, ping the prefetch scheduler. At the end of its work
    // loop, once there are no queued tasks and no in-progress requests, it will
    // call cleanup().
    (0, _scheduler.pingPrefetchScheduler)();
}
function cleanup() {
    if (lruSize <= maxLruSize) {
        return;
    }
    // Evict entries until we're at 90% capacity. We can assume this won't
    // infinite loop because even if `maxLruSize` were 0, eventually
    // `deleteFromLru` sets `head` to `null` when we run out entries.
    const ninetyPercentMax = maxLruSize * 0.9;
    while(lruSize > ninetyPercentMax && head !== null){
        const tail = head.prev;
        // In practice, this is never null, but that isn't encoded in the type
        if (tail !== null) {
            // Delete the entry from the map. In turn, this will remove it from
            // the LRU.
            (0, _cachemap.deleteMapEntry)(tail);
        }
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Navigation lock for the Instant Navigation Testing API.
 *
 * Manages the in-memory lock (a promise) that gates dynamic data writes
 * during instant navigation captures, and owns all cookie state
 * transitions (pending → captured-MPA, pending → captured-SPA).
 *
 * External actors (Playwright, devtools) set [0] to start a lock scope
 * and delete the cookie to end one. Next.js writes captured values.
 * The CookieStore handler distinguishes them by value: pending = external,
 * captured = self-write (ignored).
 *
 * This module assumes the Instant Navigation Testing API is enabled. When it
 * is disabled, the bundler resolves this module to
 * `./navigation-testing-lock.disabled` instead (see
 * `create-compiler-aliases.ts` for webpack and
 * `crates/next-core/src/next_import_map.rs` for Turbopack), so none of this
 * code ships in the browser bundle.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    beginLockedNavigation: null,
    beginNavigationLockPrefetch: null,
    getCurrentNavigationGate: null,
    getNavigationLockSegmentCacheMap: null,
    getPreLockFetch: null,
    isNavigationLocked: null,
    resetNavigationLockToPending: null,
    resolveNavigationLockPrefetch: null,
    shouldRestrictNavigationToShell: null,
    startListeningForInstantNavigationCookie: null,
    updateCapturedSPAToTree: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    beginLockedNavigation: function() {
        return beginLockedNavigation;
    },
    beginNavigationLockPrefetch: function() {
        return beginNavigationLockPrefetch;
    },
    getCurrentNavigationGate: function() {
        return getCurrentNavigationGate;
    },
    getNavigationLockSegmentCacheMap: function() {
        return getNavigationLockSegmentCacheMap;
    },
    getPreLockFetch: function() {
        return getPreLockFetch;
    },
    isNavigationLocked: function() {
        return isNavigationLocked;
    },
    resetNavigationLockToPending: function() {
        return resetNavigationLockToPending;
    },
    resolveNavigationLockPrefetch: function() {
        return resolveNavigationLockPrefetch;
    },
    shouldRestrictNavigationToShell: function() {
        return shouldRestrictNavigationToShell;
    },
    startListeningForInstantNavigationCookie: function() {
        return startListeningForInstantNavigationCookie;
    },
    updateCapturedSPAToTree: function() {
        return updateCapturedSPAToTree;
    }
});
const _approutertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)");
const _approuterheaders = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/app-router-headers.js [app-ssr] (ecmascript)");
const _useactionqueue = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/use-action-queue.js [app-ssr] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/scheduler.js [app-ssr] (ecmascript)");
const _cachemap = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-map.js [app-ssr] (ecmascript)");
function parseCookieValue(raw) {
    if (raw === '') {
        return 'empty';
    }
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            if (parsed.length >= 3) {
                const rawState = parsed[2];
                return rawState === null ? 'mpa' : 'spa';
            }
        }
    } catch  {}
    return 'pending';
}
function writeDocumentCookie(value, options) {
    if (typeof document === 'undefined') {
        return;
    }
    let cookie = `${_approuterheaders.NEXT_INSTANT_TEST_COOKIE}=${JSON.stringify(value)}; Path=${options.path ?? '/'}`;
    if (options.domain) {
        cookie += `; Domain=${options.domain}`;
    }
    document.cookie = cookie;
}
function writeCookieValue(value) {
    if (typeof cookieStore === 'undefined') {
        return;
    }
    // Read the existing cookie to preserve its attributes (domain, path), then
    // write back with the new value. This updates the same cookie entry that the
    // external actor created, regardless of how it was scoped. The read goes
    // through `cookieStore.get` because `document.cookie` exposes only names and
    // values, not the domain/path we need to preserve. The write goes through
    // document.cookie because WebKit exposes Cookie Store on localhost but does
    // not commit cookies written through cookieStore.set() there.
    //
    // Capture the current lockState and compare it in the callback so we only
    // write if the lock we observed at call time is still held. This guards
    // against two races: (a) the scope ended between get and set (lockState is
    // now null), and (b) the scope ended and a new one was acquired in the same
    // gap (lockState is a different object). In either case we must not write —
    // doing so would leak stale state into the next scope or outlive the current
    // one. It cannot close one window, though: the callback can run after an
    // external delete but before the deleted-event handler nulls lockState, so
    // the guard still passes and we resurrect the cookie. The deleted handler
    // clears any such entry once the lock is released (see the `event.deleted`
    // loop below).
    const lockAtCall = lockState;
    cookieStore.get(_approuterheaders.NEXT_INSTANT_TEST_COOKIE).then((existing)=>{
        if (existing && lockState === lockAtCall && lockAtCall !== null) {
            writeDocumentCookie(value, existing);
        }
    });
}
let lockState = null;
function getPreLockFetch() {
    return lockState !== null ? lockState.fetch : null;
}
function beginNavigationLockPrefetch() {
    if (lockState !== null) {
        let resolve;
        const promise = new Promise((r)=>{
            resolve = r;
        });
        const prefetch = {
            promise,
            resolve: resolve
        };
        lockState.activePrefetches.add(prefetch);
        return prefetch;
    }
    return null;
}
function getNavigationLockSegmentCacheMap() {
    return lockState !== null ? lockState.segmentCacheMap : null;
}
function resolveNavigationLockPrefetch(prefetch) {
    if (lockState !== null) {
        lockState.activePrefetches.delete(prefetch);
    }
    prefetch.resolve();
}
function acquireLock() {
    if (lockState !== null) {
        return;
    }
    let resolveReleased;
    const released = new Promise((r)=>{
        resolveReleased = r;
    });
    let resolveCurrentNavigation;
    const currentNavigation = new Promise((r)=>{
        resolveCurrentNavigation = r;
    });
    lockState = {
        released,
        resolveReleased: resolveReleased,
        fetch: window.fetch,
        activePrefetches: new Set(),
        segmentCacheMap: (0, _cachemap.createCacheMap)(),
        currentNavigation,
        resolveCurrentNavigation: resolveCurrentNavigation
    };
    // Install the fetch blocker. We only intercept `window.fetch` for the
    // duration of the lock so that — outside of a testing scope — user-
    // installed overrides of `window.fetch` are untouched.
    window.fetch = globalFetchOverride;
}
function releaseLock() {
    if (lockState === null) {
        return;
    }
    // Restore the pre-lock `window.fetch` before resolving the lock promise
    // so any fetches queued on the promise see the restored fetch.
    window.fetch = lockState.fetch;
    const { resolveReleased, activePrefetches, resolveCurrentNavigation } = lockState;
    lockState = null;
    // Force-resolve every prefetch that hasn't finished, so a navigation still
    // waiting on one doesn't hang now that the scope is ending.
    for (const prefetch of activePrefetches){
        prefetch.resolve();
    }
    // Resolve the current locked navigation's withheld-data gate, so its gated
    // dynamic write unblocks now that the scope is ending.
    resolveCurrentNavigation();
    // Resolve the release promise so blocked out-of-band fetches dispatch too.
    resolveReleased();
}
function beginLockedNavigation() {
    if (lockState === null) {
        return null;
    }
    // Release the previous locked navigation's withheld data, then roll over to a
    // fresh gate for this navigation — all without ending the scope.
    lockState.resolveCurrentNavigation();
    let resolveCurrentNavigation;
    const currentNavigation = new Promise((r)=>{
        resolveCurrentNavigation = r;
    });
    lockState.currentNavigation = currentNavigation;
    lockState.resolveCurrentNavigation = resolveCurrentNavigation;
    return currentNavigation;
}
function resetNavigationLockToPending() {
    if (lockState === null || typeof document === 'undefined') {
        return;
    }
    releaseLock();
    acquireLock();
    writeCookieValue([
        0,
        `c${Math.random()}`
    ]);
}
/**
 * Returns true if the request targets a dev-server endpoint — one of the
 * hot-reloader middleware routes (error overlay, source maps, launch-editor,
 * devtools). They all share the `/__nextjs_` path prefix and are always
 * requested root-relative on the same origin.
 */ function isDevServerRequest(input) {
    let url;
    try {
        url = new URL(typeof input === 'string' ? input : input instanceof URL ? input : input.url, window.location.href);
    } catch  {
        return false;
    }
    return url.origin === window.location.origin && url.pathname.startsWith('/__nextjs_');
}
/**
 * Global fetch override
 *
 * While the navigation lock is active, we install this as `window.fetch` so
 * out-of-band client-side fetches (e.g. `fetch('/api/data')` inside a
 * useEffect) are blocked until the lock is released. Next.js internals
 * bypass the override by importing `fetch` from `./fetch`, which reads the
 * captured pre-lock fetch via `getPreLockFetch`.
 *
 * NOTE: This override only affects environments where the Instant Navigation
 * Testing API is enabled. It has no impact on live production behavior.
 */ function globalFetchOverride(input, init) {
    if (lockState === null) {
        // Lock is not active. Fall through to the global fetch — we reach this
        // only if a caller captured a reference to this function during a lock
        // scope and invoked it after release.
        return fetch(input, init);
    }
    if (("TURBOPACK compile-time value", "1") && isDevServerRequest(input)) {
        // Dev-server requests must not be gated on the testing lock — blocking
        // them would break the error overlay, source maps, and devtools for the
        // whole scope. Dispatch immediately through the pre-lock fetch. Copy to a
        // local so the call doesn't bind `this` to the lock state object (native
        // fetch throws "Illegal invocation" for a foreign receiver).
        const preLockFetch = lockState.fetch;
        return preLockFetch(input, init);
    }
    // Block user-initiated fetches until the lock is released, then dispatch
    // through the fetch captured at acquire time. Reading from `lockState`
    // (rather than `window.fetch`) pins to the capture even if `window.fetch`
    // is reassigned after release.
    const currentLock = lockState;
    return currentLock.released.then(()=>{
        const preLockFetch = currentLock.fetch;
        return preLockFetch(input, init);
    });
}
function startListeningForInstantNavigationCookie() {
    // If the server served a shell, this is an MPA page load
    // while the lock is held. Transition to captured-MPA and acquire.
    if (self.__next_instant_test) {
        if (typeof cookieStore !== 'undefined') {
            // If the cookie was already cleared during the MPA page
            // transition, reload to get the full dynamic page.
            cookieStore.get(_approuterheaders.NEXT_INSTANT_TEST_COOKIE).then((cookie)=>{
                if (!cookie) {
                    window.location.reload();
                }
            });
        }
        // Acquire the lock before writing the cookie. writeCookieValue's
        // guard requires lockState to be non-null at call time (so a stale
        // write can't outlive its scope). On a fresh page load that scope
        // is the one we're about to establish, so we have to establish it
        // first.
        acquireLock();
        writeCookieValue([
            1,
            `c${Math.random()}`,
            null
        ]);
    }
    if (typeof cookieStore === 'undefined') {
        return;
    }
    cookieStore.addEventListener('change', (event)=>{
        for (const cookie of event.changed){
            if (cookie.name === _approuterheaders.NEXT_INSTANT_TEST_COOKIE) {
                const state = parseCookieValue(cookie.value ?? '');
                if (state === 'pending') {
                    // External actor starting a new lock scope.
                    if (lockState !== null) {
                        // This can be the delayed CookieStore event for the pending
                        // cookie that was already observed synchronously from
                        // document.cookie. Keep the existing lock identity so work that
                        // captured it keeps waiting on the same promise.
                        return;
                    }
                    acquireLock();
                }
                // Captured value (our own transition) or empty. Ignore.
                return;
            }
        }
        for (const cookie of event.deleted){
            if (cookie.name === _approuterheaders.NEXT_INSTANT_TEST_COOKIE) {
                if (lockState === null) {
                    // Either no lock is active, or this is the re-entrant change event
                    // from the defensive clear below (which runs after releaseLock).
                    // Nothing to release either way.
                    return;
                }
                releaseLock();
                // A captured write from this page's bootstrap can resurrect the
                // cookie in the narrow gap between the external delete and this
                // handler: writeCookieValue's guard only rejects the write once the
                // lock is torn down, which happens here. Now that the lock is
                // released, no further captured write can re-add the cookie, so clear
                // any entry that was resurrected in that gap. Otherwise an unlock
                // that falls back to a hard reload (when the shell has not yet
                // hydrated) would carry the stale cookie, be served the shell again,
                // and re-enter instant mode with no scope left to release it.
                if (typeof document !== 'undefined') {
                    document.cookie = `${_approuterheaders.NEXT_INSTANT_TEST_COOKIE}=; Path=/; Max-Age=0`;
                }
                (0, _useactionqueue.refreshOnInstantNavigationUnlock)();
                return;
            }
        }
    });
}
function updateCapturedSPAToTree(fromTree, toTree) {
    writeCookieValue([
        1,
        `c${Math.random()}`,
        {
            from: fromTree,
            to: toTree
        }
    ]);
}
function isNavigationLocked() {
    if (lockState !== null) {
        return true;
    }
    // If `lockState` is null, fall back to reading the test cookie
    // synchronously from `document.cookie`. This accounts for a small race
    // between `cookieStore.set(...)` and its corresponding `change` event.
    // During that gap `lockState` is still null even though the cookie
    // indicates a new lock scope is starting.
    if (typeof document === 'undefined') {
        return false;
    }
    const allCookies = document.cookie;
    if (!allCookies.includes(_approuterheaders.NEXT_INSTANT_TEST_COOKIE)) {
        // Fast bail-out: in almost every navigation the test cookie is not
        // set at all.
        return false;
    }
    const target = _approuterheaders.NEXT_INSTANT_TEST_COOKIE + '=';
    for (const segment of allCookies.split(';')){
        const trimmed = segment.trim();
        if (trimmed.startsWith(target) && parseCookieValue(trimmed.slice(target.length)) === 'pending') {
            // The cookie was set by an external actor but the change event was not
            // yet dispatched. Acquire the lock synchronously.
            acquireLock();
            return true;
        }
    }
    return false;
}
function getCurrentNavigationGate() {
    return lockState !== null ? lockState.currentNavigation : null;
}
function shouldRestrictNavigationToShell(rootPrefetchHints, linkFetchStrategy) {
    return isNavigationLocked() && (rootPrefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) !== 0 && !(0, _scheduler.subtreeHasSpeculativePrefetch)(linkFetchStrategy, rootPrefetchHints);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    completeHardNavigation: null,
    completeSoftNavigation: null,
    completeTraverseNavigation: null,
    convertServerPatchToFullTree: null,
    navigate: null,
    navigateToKnownRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    completeHardNavigation: function() {
        return completeHardNavigation;
    },
    completeSoftNavigation: function() {
        return completeSoftNavigation;
    },
    completeTraverseNavigation: function() {
        return completeTraverseNavigation;
    },
    convertServerPatchToFullTree: function() {
        return convertServerPatchToFullTree;
    },
    navigate: function() {
        return navigate;
    },
    navigateToKnownRoute: function() {
        return navigateToKnownRoute;
    }
});
const _approutertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)");
const _fetchserverresponse = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/fetch-server-response.js [app-ssr] (ecmascript)");
const _pprnavigations = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/ppr-navigations.js [app-ssr] (ecmascript)");
const _createhreffromurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/create-href-from-url.js [app-ssr] (ecmascript)");
const _constants = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/constants.js [app-ssr] (ecmascript)");
const _cache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache.js [app-ssr] (ecmascript)");
const _optimisticroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/optimistic-routes.js [app-ssr] (ecmascript)");
const _cachekey = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-key.js [app-ssr] (ecmascript)");
const _scheduler = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/scheduler.js [app-ssr] (ecmascript)");
const _types = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)");
const _links = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/links.js [app-ssr] (ecmascript)");
const _routerreducertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/router-reducer-types.js [app-ssr] (ecmascript)");
const _computechangedpath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/compute-changed-path.js [app-ssr] (ecmascript)");
const _javascripturl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/lib/javascript-url.js [app-ssr] (ecmascript)");
const _bfcache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/bfcache.js [app-ssr] (ecmascript)");
const _instantmessages = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/instant-messages.js [app-ssr] (ecmascript)");
const _matchsegments = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/match-segments.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
function navigate(state, url, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType) {
    let navigationLock = null;
    // Instant Navigation Testing API: when the lock is active, ensure a
    // prefetch task has been initiated before proceeding with the navigation.
    // This guarantees that segment data requests are at least pending, even
    // for routes that already have a cached route tree. Without this, the
    // shell might be incomplete because some segments were never
    // requested.
    if ("TURBOPACK compile-time truthy", 1) {
        const { isNavigationLocked } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
        if (isNavigationLocked()) {
            // Signal that a new locked navigation is starting. This force-resolves the
            // previous locked navigation's withheld data (so a reused shared segment
            // no longer carries a pending deferred rsc) and returns this navigation's
            // own withheld-data gate.
            navigationLock = (0, _pprnavigations.beginLockedNavigation)();
            return ensurePrefetchThenNavigate(state, url, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock);
        }
    }
    return navigateImpl(state, url, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock, _cache.segmentCacheMap);
}
function navigateImpl(state, url, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock, // driving-task map, or the shared map. See `segmentCacheMap` in cache.ts.
map) {
    const now = Date.now();
    const href = url.href;
    const cacheKey = (0, _cachekey.createCacheKey)(href, nextUrl);
    const route = (0, _cache.readRouteCacheEntry)(now, cacheKey);
    if (route !== null && route.status === _cache.EntryStatus.Fulfilled) {
        // We have a matching prefetch.
        return navigateUsingPrefetchedRouteTree(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentCacheNode, currentFlightRouterState, freshnessPolicy, scrollBehavior, navigateType, route, navigationLock, map);
    }
    // There was no matching route tree in the cache. Let's see if we can
    // construct an "optimistic" route tree using the deprecated search-params
    // based matching. This is only used when the new optimisticRouting flag is
    // disabled.
    //
    // Do not construct an optimistic route tree if there was a cache hit, but
    // the entry has a rejected status, since it may have been rejected due to a
    // rewrite or redirect based on the search params.
    //
    // TODO: There are multiple reasons a prefetch might be rejected; we should
    // track them explicitly and choose what to do here based on that.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // There's no matching prefetch for this route in the cache. We must lazily
    // fetch it from the server before we can perform the navigation.
    //
    // TODO: If this is a gesture navigation, instead of performing a
    // dynamic request, we should do a runtime prefetch.
    return navigateToUnknownRoute(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentCacheNode, currentFlightRouterState, freshnessPolicy, scrollBehavior, navigateType, navigationLock, map).catch(()=>{
        // If the navigation fails, return the current state
        return state;
    });
}
function navigateToKnownRoute(now, state, url, canonicalUrl, navigationSeed, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, freshnessPolicy, nextUrl, scrollBehavior, navigateType, navigationLock, // driving-task map, or the shared map. See `segmentCacheMap` in cache.ts.
map, debugInfo, // prediction. Passed through so it can be marked as having a dynamic rewrite
// if the server returns a different pathname (indicating dynamic rewrite
// behavior).
//
// When null, the navigation did not use route prediction - either because
// the route was already fully cached, or it's a navigation that doesn't
// involve prediction (refresh, history traversal, server action, etc.).
// In these cases, if a mismatch occurs, we still mark the route as having a
// dynamic rewrite by traversing the known route tree (see
// dispatchRetryDueToTreeMismatch).
routeCacheEntry, signal) {
    // A version of navigate() that accepts the target route tree as an argument
    // rather than reading it from the prefetch cache.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Instant Navigation Testing API: when the lock is held, restrict segment
    // reads to shell entries if the target route would only have prefetched
    // its shell.
    let restrictToShell = false;
    if ("TURBOPACK compile-time truthy", 1) {
        const { shouldRestrictNavigationToShell } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
        const link = (0, _links.getLinkForCurrentNavigation)();
        restrictToShell = shouldRestrictNavigationToShell(navigationSeed.routeTree.prefetchHints, link !== null ? link.fetchStrategy : _types.FetchStrategy.PPR);
    }
    const accumulation = {
        separateRefreshUrls: null,
        scrollRef: null
    };
    // We special case navigations to the exact same URL as the current location.
    // It's a common UI pattern for apps to refresh when you click a link to the
    // current page. So when this happens, we refresh the dynamic data in the page
    // segments.
    //
    // Note that this does not apply if the any part of the hash or search query
    // has changed. This might feel a bit weird but it makes more sense when you
    // consider that the way to trigger this behavior is to click the same link
    // multiple times.
    //
    // TODO: We should probably refresh the *entire* route when this case occurs,
    // not just the page segments. Essentially treating it the same as a refresh()
    // triggered by an action, which is the more explicit way of modeling the UI
    // pattern described above.
    //
    // Also note that this only refreshes the dynamic data, not static/ cached
    // data. If the page segment is fully static and prefetched, the request is
    // skipped. (This is also how refresh() works.)
    const isSamePageNavigation = url.href === currentUrl.href;
    const task = (0, _pprnavigations.startPPRNavigation)(now, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, navigationSeed.routeTree, navigationSeed.metadataVaryPath, freshnessPolicy, navigationSeed.data, navigationSeed.head, navigationSeed.dynamicStaleAt, isSamePageNavigation, accumulation, map, restrictToShell);
    if (task !== null) {
        if (freshnessPolicy !== _pprnavigations.FreshnessPolicy.Gesture) {
            (0, _pprnavigations.spawnDynamicRequests)(task, url, nextUrl, freshnessPolicy, accumulation, routeCacheEntry, navigateType, navigationLock, map, signal);
        }
        return completeSoftNavigation(state, url, nextUrl, task.route, task.node, navigationSeed.renderedSearch, canonicalUrl, navigateType, scrollBehavior, accumulation.scrollRef, debugInfo);
    }
    // Could not perform a SPA navigation. Revert to a full-page (MPA) navigation.
    return completeHardNavigation(state, url, navigateType);
}
function navigateUsingPrefetchedRouteTree(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentCacheNode, currentFlightRouterState, freshnessPolicy, scrollBehavior, navigateType, route, navigationLock, map) {
    const routeTree = route.tree;
    const canonicalUrl = route.canonicalUrl + url.hash;
    const renderedSearch = route.renderedSearch;
    const prefetchSeed = {
        renderedSearch,
        routeTree,
        metadataVaryPath: route.metadata.varyPath,
        data: null,
        head: null,
        dynamicStaleAt: (0, _bfcache.computeDynamicStaleAt)(now, _bfcache.UnknownDynamicStaleTime),
        // Not derived from a server response; no base to diverge from.
        treeDivergedFromBase: false
    };
    return navigateToKnownRoute(now, state, url, canonicalUrl, prefetchSeed, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, freshnessPolicy, nextUrl, scrollBehavior, navigateType, navigationLock, map, null, route, undefined);
}
// Used to request all the dynamic data for a route, rather than just a subset,
// e.g. during a refresh or a revalidation. Typically this gets constructed
// during the normal flow when diffing the route tree, but for an unprefetched
// navigation, where we don't know the structure of the target route, we use
// this instead.
const DynamicRequestTreeForEntireRoute = [
    '',
    {},
    null,
    'refetch'
];
async function navigateToUnknownRoute(now, state, url, currentUrl, currentRenderedSearch, nextUrl, currentCacheNode, currentFlightRouterState, freshnessPolicy, scrollBehavior, navigateType, navigationLock, map) {
    // Runs when a navigation happens but there's no cached prefetch we can use.
    // Don't bother to wait for a prefetch response; go straight to a full
    // navigation that contains both static and dynamic data in a single stream.
    // (This is unlike the old navigation implementation, which instead blocks
    // the dynamic request until a prefetch request is received.)
    //
    // To avoid duplication of logic, we're going to pretend that the tree
    // returned by the dynamic request is, in fact, a prefetch tree. Then we can
    // use the same server response to write the actual data into the CacheNode
    // tree. So it's the same flow as the "happy path" (prefetch, then
    // navigation), except we use a single server response for both stages.
    let dynamicRequestTree;
    switch(freshnessPolicy){
        case _pprnavigations.FreshnessPolicy.Default:
        case _pprnavigations.FreshnessPolicy.HistoryTraversal:
        case _pprnavigations.FreshnessPolicy.Gesture:
            dynamicRequestTree = currentFlightRouterState;
            break;
        case _pprnavigations.FreshnessPolicy.Hydration:
        case _pprnavigations.FreshnessPolicy.RefreshAll:
        case _pprnavigations.FreshnessPolicy.HMRRefresh:
            dynamicRequestTree = DynamicRequestTreeForEntireRoute;
            break;
        default:
            freshnessPolicy;
            dynamicRequestTree = currentFlightRouterState;
            break;
    }
    const promiseForDynamicServerResponse = (0, _fetchserverresponse.fetchServerResponse)(url, {
        flightRouterState: dynamicRequestTree,
        nextUrl
    });
    const result = await promiseForDynamicServerResponse;
    if (typeof result === 'string') {
        // This is an MPA navigation.
        const redirectUrl = new URL(result, location.origin);
        return completeHardNavigation(state, redirectUrl, navigateType);
    }
    const { flightData, canonicalUrl, renderedSearch, couldBeIntercepted, supportsPerSegmentPrefetching, dynamicStaleTime, staticStageData, runtimePrefetchStream, responseHeaders, debugInfo } = result;
    // Since the response format of dynamic requests and prefetches is slightly
    // different, we'll need to massage the data a bit. Create FlightRouterState
    // tree that simulates what we'd receive as the result of a prefetch.
    const navigationSeed = convertServerPatchToFullTree(now, currentFlightRouterState, flightData, renderedSearch, dynamicStaleTime);
    // Learn the route pattern so we can predict it for future navigations.
    // hasDynamicRewrite is false because this is a fresh navigation to an
    // unknown route - any rewrite detection happens during the traversal inside
    // discoverKnownRoute. The hasDynamicRewrite param is only set to true when
    // retrying after a tree mismatch (see dispatchRetryDueToTreeMismatch).
    const metadataVaryPath = navigationSeed.metadataVaryPath;
    if (metadataVaryPath !== null) {
        (0, _optimisticroutes.discoverKnownRoute)(now, url.pathname, url.search, nextUrl, null, navigationSeed.routeTree, metadataVaryPath, couldBeIntercepted, // a later same-route hash nav appends `url.hash` to it.
        (0, _createhreffromurl.createHrefFromUrl)(canonicalUrl, false), supportsPerSegmentPrefetching, false // hasDynamicRewrite - not a retry, rewrite detection happens during traversal
        );
        if (staticStageData !== null) {
            const { response: staticStageResponse, isResponsePartial } = staticStageData;
            // Write the static stage of the response into the segment cache so that
            // subsequent navigations can serve cached static segments instantly.
            (0, _cache.resolveStaleAt)(now, staticStageResponse.s).then((staleAt)=>{
                const buildId = responseHeaders.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER) ?? staticStageResponse.b;
                // TODO: Implement Shell extraction as part of Cached Navigations.
                // Intentionally holding off on doing this until we decide how the
                // Cached Navigations behavior should work in combination with App
                // Shells.
                (0, _cache.writePrerenderResponseIntoCache)(now, _types.FetchStrategy.PPR, staticStageResponse.f, buildId, staticStageResponse.h, staticStageResponse.r ?? null, staleAt, currentFlightRouterState, renderedSearch, isResponsePartial, map);
            }).catch(()=>{
            // The static stage processing failed. Not fatal — the navigation
            // completed normally, we just won't write into the cache.
            });
        }
        if (runtimePrefetchStream !== null) {
            (0, _cache.processRuntimePrefetchStream)(now, runtimePrefetchStream, currentFlightRouterState, renderedSearch).then((processed)=>{
                if (processed !== null) {
                    (0, _cache.writeDynamicRenderResponseIntoCache)(now, _types.FetchStrategy.PPRRuntime, processed.flightDatas, processed.buildId, processed.isResponsePartial, processed.headVaryParams, processed.rootVaryParamsIterable, processed.staleAt, processed.navigationSeed, null, map);
                }
            }).catch(()=>{
            // The runtime prefetch cache write failed. Not fatal — the
            // navigation completed normally, we just won't cache runtime data.
            });
        }
    }
    // In the streaming dev render, this single response's seed content may still
    // be streaming when we build the tree below. An unknown-route navigation
    // places that content inline (it has no prior cache entry, so the server
    // sends a full seed rather than the dynamic-only delta a known route gets),
    // and that inline content is not gated like a known route's deferred RSCs. So
    // React could read a still-pending chunk and flash a Suspense fallback
    // (wanted on a cold cache, but not on a warm one). Wait for the shell to
    // flush (`revealAfter`) first, so the inline seed content is decoded by the
    // time React reads it, the same way the known-route path gates its deferred
    // RSCs. `revealAfter` is null outside the streaming dev render. On a cache
    // miss it resolves early, so the cold-cache fallback is still shown.
    if (result.revealAfter !== null) {
        await result.revealAfter;
    }
    return navigateToKnownRoute(now, state, url, (0, _createhreffromurl.createHrefFromUrl)(canonicalUrl), navigationSeed, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, freshnessPolicy, nextUrl, scrollBehavior, navigateType, navigationLock, map, debugInfo, // came directly from the server. If a mismatch occurs during dynamic data
    // fetch, the retry handler will traverse the known route tree to mark the
    // entry as having a dynamic rewrite.
    null, undefined);
}
function completeHardNavigation(state, url, navigateType) {
    if ((0, _javascripturl.isJavaScriptURLString)(url.href)) {
        console.error('Next.js has blocked a javascript: URL as a security precaution.');
        return state;
    }
    const newState = {
        canonicalUrl: url.origin === location.origin ? (0, _createhreffromurl.createHrefFromUrl)(url) : url.href,
        pushRef: {
            pendingPush: navigateType === 'push',
            mpaNavigation: true,
            preserveCustomHistoryState: false
        },
        // TODO: None of the rest of these values are consistent with the incoming
        // navigation. We rely on the fact that AppRouter will suspend and trigger
        // a hard navigation before it accesses any of these values. But instead
        // we should trigger the hard navigation and blocking any subsequent
        // router updates without updating React.
        renderedSearch: state.renderedSearch,
        focusAndScrollRef: state.focusAndScrollRef,
        cache: state.cache,
        tree: state.tree,
        nextUrl: state.nextUrl,
        previousNextUrl: state.previousNextUrl,
        debugInfo: null
    };
    return newState;
}
function completeSoftNavigation(oldState, url, referringNextUrl, tree, cache, renderedSearch, canonicalUrl, navigateType, scrollBehavior, scrollRef, collectedDebugInfo) {
    // The "Next-Url" is a special representation of the URL that Next.js
    // uses to implement interception routes.
    // TODO: Get rid of this extra traversal by computing this during the
    // same traversal that computes the tree itself. We should also figure out
    // what is the minimum information needed for the server to correctly
    // intercept the route.
    const changedPath = (0, _computechangedpath.computeChangedPath)(oldState.tree, tree);
    const nextUrlForNewRoute = changedPath ? changedPath : oldState.nextUrl;
    // This value is stored on the state as `previousNextUrl`; the naming is
    // confusing. What it represents is the "Next-Url" header that was used to
    // fetch the incoming route. It's essentially the refererer URL, but in a
    // Next.js specific format. During refreshes, this is sent back to the server
    // instead of the current route's "Next-Url" so that the same interception
    // logic is applied as during the original navigation.
    const previousNextUrl = referringNextUrl;
    // Check if the only thing that changed was the hash fragment.
    const oldUrl = new URL(oldState.canonicalUrl, url);
    const onlyHashChange = // navigations are always same-origin.
    url.pathname === oldUrl.pathname && url.search === oldUrl.search && url.hash !== oldUrl.hash;
    // Determine whether and how the page should scroll after this
    // navigation.
    //
    // By default, we scroll to the segments that were navigated to — i.e.
    // segments in the new part of the route, as opposed to shared segments
    // that were already part of the previous route. All newly navigated
    // segments share a single ScrollRef. When they mount, the first one
    // to mount initiates the scroll. They share a ref so that only one
    // scroll happens per navigation.
    //
    // If a subsequent navigation produces new segments, those supersede
    // any pending scroll from the previous navigation by invalidating its
    // ScrollRef. If a navigation doesn't produce any new segments (e.g.
    // a refresh where the route structure didn't change), any pending
    // scrolls from previous navigations are unaffected.
    //
    // The branches below handle special cases layered on top of this
    // default model.
    let activeScrollRef;
    let forceScroll;
    if (scrollBehavior === _routerreducertypes.ScrollBehavior.NoScroll) {
        // The user explicitly opted out of scrolling (e.g. scroll={false}
        // on a Link or router.push).
        //
        // If this navigation created new scroll targets (scrollRef !== null),
        // neutralize them. If it didn't, any prior scroll targets carried
        // forward on the cache nodes via reuseSharedCacheNode remain active.
        if (scrollRef !== null) {
            scrollRef.current = false;
        }
        activeScrollRef = oldState.focusAndScrollRef.scrollRef;
        forceScroll = false;
    } else if (onlyHashChange) {
        // Hash-only navigations should scroll regardless of per-node state.
        // Create a fresh ref so the first segment to scroll consumes it.
        //
        // Invalidate any scroll ref from a prior navigation that hasn't
        // been consumed yet.
        const oldScrollRef = oldState.focusAndScrollRef.scrollRef;
        if (oldScrollRef !== null) {
            oldScrollRef.current = false;
        }
        // Also invalidate any per-node refs that were accumulated during
        // this navigation's tree construction — the hash-only ref
        // supersedes them.
        if (scrollRef !== null) {
            scrollRef.current = false;
        }
        activeScrollRef = {
            current: true
        };
        forceScroll = true;
    } else {
        // Default case. Use the accumulated scrollRef (may be null if no
        // new segments were created). The handler checks per-node refs, so
        // unchanged parallel route slots won't scroll.
        activeScrollRef = scrollRef;
        // If this navigation created new scroll targets, invalidate any
        // pending scroll from a previous navigation.
        if (scrollRef !== null) {
            const oldScrollRef = oldState.focusAndScrollRef.scrollRef;
            if (oldScrollRef !== null) {
                oldScrollRef.current = false;
            }
        }
        forceScroll = false;
    }
    const newState = {
        canonicalUrl,
        renderedSearch,
        pushRef: {
            pendingPush: navigateType === 'push',
            mpaNavigation: false,
            preserveCustomHistoryState: false
        },
        focusAndScrollRef: {
            scrollRef: activeScrollRef,
            forceScroll,
            onlyHashChange,
            hashFragment: //
            // Empty hash should trigger default behavior of scrolling layout into
            // view. #top is handled in layout-router.
            //
            // Refer to `ScrollAndFocusHandler` for details on how this is used.
            scrollBehavior !== _routerreducertypes.ScrollBehavior.NoScroll && url.hash !== '' ? decodeURIComponent(url.hash.slice(1)) : oldState.focusAndScrollRef.hashFragment
        },
        cache,
        tree,
        nextUrl: nextUrlForNewRoute,
        previousNextUrl,
        debugInfo: collectedDebugInfo
    };
    return newState;
}
function completeTraverseNavigation(state, url, renderedSearch, cache, tree, nextUrl) {
    return {
        // Set canonical url
        canonicalUrl: (0, _createhreffromurl.createHrefFromUrl)(url),
        renderedSearch,
        pushRef: {
            pendingPush: false,
            mpaNavigation: false,
            // Ensures that the custom history state that was set is preserved when applying this update.
            preserveCustomHistoryState: true
        },
        focusAndScrollRef: state.focusAndScrollRef,
        cache,
        // Restore provided tree
        tree,
        nextUrl,
        // TODO: We need to restore previousNextUrl, too, which represents the
        // Next-Url that was used to fetch the data. Anywhere we fetch using the
        // canonical URL, there should be a corresponding Next-Url.
        previousNextUrl: null,
        debugInfo: null
    };
}
function convertServerPatchToFullTree(now, currentTree, flightData, renderedSearch, dynamicStaleTimeSeconds) {
    // During a client navigation or prefetch, the server sends back only a patch
    // for the parts of the tree that have changed.
    //
    // This applies the patch to the base tree to create a full representation of
    // the resulting tree.
    //
    // The return type includes a full FlightRouterState tree and a full
    // CacheNodeSeedData tree. (Conceptually these are the same tree, and should
    // eventually be unified, but there's still lots of existing code that
    // operates on FlightRouterState trees alone without the CacheNodeSeedData.)
    //
    // TODO: This similar to what apply-router-state-patch-to-tree does. It
    // will eventually fully replace it. We should get rid of all the remaining
    // places where we iterate over the server patch format. This should also
    // eventually replace normalizeFlightData.
    let baseTree = currentTree;
    let baseData = null;
    let head = null;
    // Whether any patch rendered a segment whose identity differs from the base
    // (request) tree at the same position. See NavigationSeed.treeDivergedFromBase.
    // Compared against the original `currentTree`, not the progressively-merged
    // `baseTree`, so each patch is checked against what was actually requested.
    let treeDivergedFromBase = false;
    if (flightData !== null) {
        for (const { segmentPath, tree: treePatch, seedData: dataPatch, head: headPatch } of flightData){
            if (!treeDivergedFromBase) {
                treeDivergedFromBase = didServerPatchDivergeFromBase(currentTree, segmentPath, treePatch);
            }
            const result = convertServerPatchToFullTreeImpl(baseTree, baseData, treePatch, dataPatch, segmentPath, renderedSearch, 0);
            baseTree = result.tree;
            baseData = result.data;
            // This is the same for all patches per response, so just pick an
            // arbitrary one
            head = headPatch;
        }
    }
    const finalFlightRouterState = baseTree;
    // Convert the final FlightRouterState into a RouteTree type.
    //
    // TODO: Eventually, FlightRouterState will evolve to being a transport format
    // only. The RouteTree type will become the main type used for dealing with
    // routes on the client, and we'll store it in the state directly.
    const acc = {
        metadataVaryPath: null,
        treeDivergedFromBase: false
    };
    const routeTree = (0, _cache.convertRootFlightRouterStateToRouteTree)(finalFlightRouterState, renderedSearch, acc);
    return {
        routeTree,
        metadataVaryPath: acc.metadataVaryPath,
        data: baseData,
        renderedSearch,
        head,
        dynamicStaleAt: (0, _bfcache.computeDynamicStaleAt)(now, dynamicStaleTimeSeconds),
        treeDivergedFromBase
    };
}
// Whether a server patch's rendered tree diverges in segment identity from the
// base (request) tree it was applied to. Mirrors the comparison performed while
// decoding a server response in newer versions of the client (see
// NavigationSeed.treeDivergedFromBase). Divergence means the server rendered a
// different route than the one we requested — e.g. a URL rewrite that behaves
// dynamically — so a prefetch built from the base tree can never be fulfilled.
//
// The base-tree descent mirrors convertServerPatchToFullTreeImpl: segmentPath
// is a repeating [parallelRouteKey, segment, ...] pattern; segmentPath[i] keys
// into the children, segmentPath[i + 1] is the server's segment at that
// position.
function didServerPatchDivergeFromBase(currentTree, segmentPath, treePatch) {
    let baseNode = currentTree;
    for(let i = 0; i + 1 < segmentPath.length; i += 2){
        const parallelRouteKey = segmentPath[i];
        const serverSegment = segmentPath[i + 1];
        const childBase = baseNode[1][parallelRouteKey];
        if (childBase === undefined) {
            // The base tree doesn't have this branch. Unless the server merely
            // filled it with a default, the trees have different structures.
            return serverSegment !== _segment.DEFAULT_SEGMENT_KEY;
        }
        if (segmentIdentityDivergesFromBase(serverSegment, childBase[0])) {
            return true;
        }
        baseNode = childBase;
    }
    return detectTreeDivergenceFromBase(treePatch, baseNode);
}
// Recursively compares a server-rendered subtree against the base subtree at
// the same position. Inactive parallel route branches — which carry a refresh
// state in the base — are expected to differ and are skipped.
function detectTreeDivergenceFromBase(serverNode, baseNode) {
    if (segmentIdentityDivergesFromBase(serverNode[0], baseNode[0])) {
        return true;
    }
    const serverChildren = serverNode[1];
    const baseChildren = baseNode[1];
    for(const parallelRouteKey in serverChildren){
        const childServer = serverChildren[parallelRouteKey];
        const childBase = baseChildren[parallelRouteKey];
        if (childBase === undefined) {
            // A slot the base tree doesn't have. Unless the server merely filled it
            // with a default, the trees have different structures.
            if (childServer[0] !== _segment.DEFAULT_SEGMENT_KEY) {
                return true;
            }
        } else if ((childBase[2] ?? null) !== null) {
        // The base branch carries a refresh state: an inactive parallel route
        // reused from a different route (e.g. a "default" slot). The server's
        // answer is expected to differ, so skip the branch.
        } else if (detectTreeDivergenceFromBase(childServer, childBase)) {
            return true;
        }
    }
    return false;
}
// Whether two segments at the same position claim different identities. Page
// segments match modulo embedded search params (validated separately, see
// getRenderedSearch), and a default filled in by the server is not a claim
// about the position's identity.
function segmentIdentityDivergesFromBase(serverSegment, baseSegment) {
    if (typeof serverSegment === 'string' && typeof baseSegment === 'string' && serverSegment.startsWith(_segment.PAGE_SEGMENT_KEY) && baseSegment.startsWith(_segment.PAGE_SEGMENT_KEY)) {
        return false;
    }
    if (serverSegment === _segment.DEFAULT_SEGMENT_KEY) {
        return false;
    }
    return !(0, _matchsegments.matchSegment)(baseSegment, serverSegment);
}
function convertServerPatchToFullTreeImpl(baseRouterState, baseData, treePatch, dataPatch, segmentPath, renderedSearch, index) {
    if (index === segmentPath.length) {
        // We reached the part of the tree that we need to patch.
        return {
            tree: treePatch,
            data: dataPatch
        };
    }
    // segmentPath represents the parent path of subtree. It's a repeating
    // pattern of parallel route key and segment:
    //
    //   [string, Segment, string, Segment, string, Segment, ...]
    //
    // This path tells us which part of the base tree to apply the tree patch.
    //
    // NOTE: We receive the FlightRouterState patch in the same request as the
    // seed data patch. Therefore we don't need to worry about diffing the segment
    // values; we can assume the server sent us a correct result.
    const updatedParallelRouteKey = segmentPath[index];
    // const segment: Segment = segmentPath[index + 1] <-- Not used, see note above
    const baseTreeChildren = baseRouterState[1];
    const baseSeedDataChildren = baseData !== null ? baseData[1] : null;
    const newTreeChildren = {};
    const newSeedDataChildren = {};
    for(const parallelRouteKey in baseTreeChildren){
        const childBaseRouterState = baseTreeChildren[parallelRouteKey];
        const childBaseSeedData = baseSeedDataChildren !== null ? baseSeedDataChildren[parallelRouteKey] ?? null : null;
        if (parallelRouteKey === updatedParallelRouteKey) {
            const result = convertServerPatchToFullTreeImpl(childBaseRouterState, childBaseSeedData, treePatch, dataPatch, segmentPath, renderedSearch, // the end of the segment path.
            index + 2);
            newTreeChildren[parallelRouteKey] = result.tree;
            newSeedDataChildren[parallelRouteKey] = result.data;
        } else {
            // This child is not being patched. Copy it over as-is.
            newTreeChildren[parallelRouteKey] = childBaseRouterState;
            newSeedDataChildren[parallelRouteKey] = childBaseSeedData;
        }
    }
    let clonedTree;
    let clonedSeedData;
    // Clone all the fields except the children.
    // Clone the FlightRouterState tree. Based on equivalent logic in
    // apply-router-state-patch-to-tree, but should confirm whether we need to
    // copy all of these fields. Not sure the server ever sends, e.g. the
    // refetch marker.
    clonedTree = [
        baseRouterState[0],
        newTreeChildren
    ];
    if (2 in baseRouterState) {
        const compressedRefreshState = baseRouterState[2];
        if (compressedRefreshState !== undefined && compressedRefreshState !== null) {
            // Since this part of the tree was patched with new data, any parent
            // refresh states should be updated to reflect the new rendered search
            // value. (The refresh state acts like a "context provider".) All pages
            // within the same server response share the same renderedSearch value,
            // but the same RouteTree could be composed from multiple different
            // routes, and multiple responses.
            clonedTree[2] = [
                compressedRefreshState[0],
                renderedSearch
            ];
        }
    }
    if (3 in baseRouterState) {
        clonedTree[3] = baseRouterState[3];
    }
    // Recompute the propagated "subtree" prefetch hints for this segment. Mirrors
    // the propagation done on the server in
    // createFlightRouterStateFromLoaderTree.
    let prefetchHints = (baseRouterState[4] ?? 0) & ~_approutertypes.SubtreePrefetchHints;
    for(const parallelRouteKey in newTreeChildren){
        const childHints = newTreeChildren[parallelRouteKey][4];
        if (childHints !== undefined) {
            prefetchHints = (0, _approutertypes.propagateSubtreeBits)(prefetchHints, childHints);
        }
    }
    if (prefetchHints !== 0) {
        clonedTree[4] = prefetchHints;
    }
    // Clone the CacheNodeSeedData tree.
    const isEmptySeedDataPartial = true;
    clonedSeedData = [
        null,
        newSeedDataChildren,
        null,
        isEmptySeedDataPartial,
        null
    ];
    return {
        tree: clonedTree,
        data: clonedSeedData
    };
}
/**
 * Instant Navigation Testing API: ensures a prefetch task has been initiated
 * and completed before proceeding with the navigation. This guarantees that
 * segment data requests are at least pending, even for routes whose route
 * tree is already cached.
 *
 * After the prefetch completes, delegates to the normal navigation flow.
 */ async function ensurePrefetchThenNavigate(state, url, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock) {
    const link = (0, _links.getLinkForCurrentNavigation)();
    const fetchStrategy = link !== null ? link.fetchStrategy : _types.FetchStrategy.PPR;
    const cacheKey = (0, _cachekey.createCacheKey)(url.href, nextUrl);
    // Create this navigation's "wait for prefetch to fulfill" state and schedule
    // the prefetch as a locked-navigation prefetch. The prefetch's promise
    // resolves when the task completes — after every segment response the task
    // cares about has settled — so the navigation below reads present data
    // rather than a still-in-flight entry.
    const { beginNavigationLockPrefetch } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
    const navigationLockPrefetch = beginNavigationLockPrefetch();
    const prefetchTask = (0, _scheduler.schedulePrefetchTask)(cacheKey, currentFlightRouterState, fetchStrategy, _types.PrefetchPriority.Default, null, navigationLockPrefetch);
    if (navigationLockPrefetch !== null) {
        await navigationLockPrefetch.promise;
    }
    // Prefetch is complete. Proceed with the normal navigation flow, which
    // will now find the route in the cache. The navigation inherits the map of
    // the prefetch task that drives it: the task was scheduled inside the lock
    // scope, so this is the scope's private map, and the navigation reads only
    // data fetched under the lock.
    const result = await navigateImpl(state, url, currentUrl, currentRenderedSearch, currentCacheNode, currentFlightRouterState, nextUrl, freshnessPolicy, scrollBehavior, navigateType, navigationLock, prefetchTask.segmentCacheMap);
    // Only transition to captured-SPA once the navigation is known to be an SPA.
    // If the result is an MPA navigation, leave the cookie pending and let the new
    // document load transition it to captured-MPA.
    if (!result.pushRef.mpaNavigation) {
        const { updateCapturedSPAToTree } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
        updateCapturedSPAToTree(currentFlightRouterState, result.tree);
    }
    return result;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/optimistic-routes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Optimistic Routing (Known Routes)
 *
 * This module enables the client to predict route structure for URLs that
 * haven't been prefetched yet, based on previously learned route patterns.
 * When successful, this allows skipping the route tree prefetch request
 * entirely.
 *
 * The core idea is that many URLs map to the same route structure. For example,
 * /blog/post-1 and /blog/post-2 both resolve to /blog/[slug]. Once we've
 * prefetched one, we can predict the structure of the other.
 *
 * However, we can't always make this prediction. Static siblings (like
 * /blog/featured alongside /blog/[slug]) have different route structures.
 * When we learn a dynamic route, we also learn its static siblings so we
 * know when NOT to apply the prediction.
 *
 * Main entry points:
 *
 * 1. discoverKnownRoute: Called after receiving a route tree from the server.
 *    Traverses the route tree, compares URL parts to segments, and populates
 *    the known route tree if they match. Routes are always inserted into the
 *    cache.
 *
 * 2. matchKnownRoute: Called when looking up a route with no cache entry.
 *    Matches the candidate URL against learned patterns. Returns a synthetic
 *    cache entry if successful, or null to fall back to server resolution.
 *
 * Rewrite detection happens during traversal: if a URL path part doesn't match
 * the corresponding route segment, we stop populating the known route tree
 * (since the mapping is incorrect) but still insert the route into the cache.
 *
 * The known route tree is append-only with no eviction. Route patterns are
 * derived from the filesystem, so they don't become stale within a session.
 * Cache invalidation on deploy clears everything anyway.
 *
 * Current limitations (deopt to server resolution):
 * - Rewrites: Detected during traversal (tree not populated, but route cached)
 * - Intercepted routes: The route tree varies by referrer (Next-Url header),
 *   so we can't predict the correct structure from the URL alone. Patterns are
 *   still stored during discovery (so the trie stays populated for non-
 *   intercepted siblings), but matching bails out when the pattern is marked
 *   as interceptable.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    discoverKnownRoute: null,
    matchKnownRoute: null,
    resetKnownRoutes: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    discoverKnownRoute: function() {
        return discoverKnownRoute;
    },
    matchKnownRoute: function() {
        return matchKnownRoute;
    },
    resetKnownRoutes: function() {
        return resetKnownRoutes;
    }
});
const _approutertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)");
const _cache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache.js [app-ssr] (ecmascript)");
const _cachemap = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-map.js [app-ssr] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/route-params.js [app-ssr] (ecmascript)");
const _cachekey = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-key.js [app-ssr] (ecmascript)");
const _varypath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/vary-path.js [app-ssr] (ecmascript)");
/**
 * Read the pattern from a KnownRoutePart, evicting it if expired.
 *
 * This prevents stale patterns (e.g. from InliningHintsStale route entries
 * with staleAt = -1) from being cloned into synthetic entries indefinitely.
 * Once evicted, the pattern slot can be repopulated by the next
 * discoverKnownRoute call with a fresh entry from a /_tree response.
 */ function readPattern(now, part) {
    const pattern = part.pattern;
    if (pattern === null) {
        return null;
    }
    if ((0, _cachemap.isValueExpired)(now, (0, _cache.getCurrentRouteCacheVersion)(), pattern)) {
        // The pattern is expired. Null it out so the slot can be repopulated.
        part.pattern = null;
        return null;
    }
    return pattern;
}
function createEmptyPart() {
    return {
        staticChildren: null,
        dynamicChild: null,
        dynamicChildParamName: null,
        dynamicChildParamType: null,
        pattern: null,
        hasConflictingDynamicChildren: false
    };
}
// The root of the known route tree.
let knownRouteTreeRoot = createEmptyPart();
function discoverKnownRoute(now, pathname, search, nextUrl, pendingEntry, routeTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching, hasDynamicRewrite) {
    const tree = routeTree;
    const pathnameParts = (0, _cachekey.splitPathnameIntoParts)(pathname);
    if (pendingEntry !== null) {
        // Fulfill the pending entry first
        const fulfilledEntry = (0, _cache.fulfillRouteCacheEntry)(now, pendingEntry, tree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
        if (hasDynamicRewrite) {
            fulfilledEntry.hasDynamicRewrite = true;
        }
        // Populate the known route tree (handles rewrite detection internally).
        // The entry is already in the cache; this just stores it as a pattern
        // if the URL matches the route structure.
        discoverKnownRoutePart(knownRouteTreeRoot, tree, pathnameParts, 0, fulfilledEntry, now, pathname, search, nextUrl, tree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching, hasDynamicRewrite);
        return fulfilledEntry;
    }
    // No pending entry - discoverKnownRoutePart will create one and insert it
    // into the cache, or return an existing pattern if one exists.
    return discoverKnownRoutePart(knownRouteTreeRoot, tree, pathnameParts, 0, null, now, pathname, search, nextUrl, tree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching, hasDynamicRewrite);
}
/**
 * Bail out of populating the known route tree when discovery detects that the
 * URL doesn't match the route structure (a rewrite). The route entry is still
 * inserted into the cache for direct lookup — we just don't store it as a
 * pattern, since the URL and the tree describe different shapes.
 */ function handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching) {
    if (existingEntry !== null) {
        return existingEntry;
    }
    return (0, _cache.writeRouteIntoCache)(now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
}
/**
 * Gets or creates the dynamic child node for a KnownRoutePart. A node can
 * have at most one dynamic child. Sibling filesystem routes can't declare two
 * different params at the same level, but parallel route branches can (e.g.
 * @modal/[...catchAll] alongside [username]) — the caller detects that case
 * and marks the level as conflicted instead of calling this.
 */ function discoverDynamicChild(part, paramName, paramType) {
    if (part.dynamicChild !== null) {
        return part.dynamicChild;
    }
    const newChild = createEmptyPart();
    // Type assertion needed because we're converting from "without" to "with"
    // dynamic child variant.
    const mutablePart = part;
    mutablePart.dynamicChild = newChild;
    mutablePart.dynamicChildParamName = paramName;
    mutablePart.dynamicChildParamType = paramType;
    return newChild;
}
/**
 * Recursive workhorse for discoverKnownRoute.
 *
 * Walks the route tree and URL parts in parallel, building out the known
 * route tree as it goes. At each step:
 * 1. Determines if the current segment appears in the URL (dynamic/static)
 * 2. Validates URL matches route structure (detects rewrites)
 * 3. Creates/updates the corresponding KnownRoutePart node
 * 4. Records static siblings for future matching
 * 5. Recurses into child slots (parallel routes)
 *
 * If a URL/route mismatch is detected (rewrite), we stop building the known
 * route tree but still cache the route entry for direct lookup.
 */ function discoverKnownRoutePart(parentKnownRoutePart, routeTree, pathnameParts, partIndex, existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching, hasDynamicRewrite) {
    const segment = routeTree.segment;
    const urlPart = partIndex < pathnameParts.length ? pathnameParts[partIndex] : null;
    let knownRoutePart = parentKnownRoutePart;
    let nextPartIndex = partIndex;
    if (typeof segment === 'string') {
        if ((0, _routeparams.doesStaticSegmentAppearInURL)(segment)) {
            // A visible static segment must consume exactly one URL part that
            // equals the segment. If the URL is exhausted or the URL part doesn't
            // match, the URL doesn't fit the route shape — the response was
            // rewrite-affected. Bail out.
            if (urlPart === null || urlPart !== segment) {
                return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
            }
            if (parentKnownRoutePart.staticChildren === null) {
                parentKnownRoutePart.staticChildren = new Map();
            }
            let existingChild = parentKnownRoutePart.staticChildren.get(urlPart);
            if (existingChild === undefined) {
                existingChild = createEmptyPart();
                parentKnownRoutePart.staticChildren.set(urlPart, existingChild);
            }
            knownRoutePart = existingChild;
            // Advance to next URL part.
            nextPartIndex = partIndex + 1;
        }
    // else: Transparent segment (route group, __PAGE__, etc.)
    // Stay at the same known route part, don't advance URL parts
    } else {
        // Dynamic segment tuple: [paramName, paramCacheKey, paramType, staticSiblings]
        const paramName = segment[0];
        const paramCacheKey = segment[1];
        const paramType = segment[2];
        const staticSiblings = segment[3];
        if (paramType !== 'oc' && urlPart === null) {
            // Every dynamic segment except the optional catch-all (`[[...param]]`)
            // must consume at least one URL part at runtime. If discovery reached
            // this segment with no URL parts left to consume, the URL doesn't fit
            // the route shape — the response was rewrite-affected. Bail out.
            return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
        }
        if (staticSiblings !== null && urlPart !== null && staticSiblings.includes(urlPart)) {
            // The route tree says this is a dynamic sibling, but the canonical URL
            // is a known static sibling. This is a mismatch.
            return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
        }
        // The param's cache key holds the value parsed from the *rendered*
        // pathname. If the URL part(s) this segment would consume don't equal
        // that value, the response was rewrite-affected in a way that shifts
        // which URL part maps to which segment (e.g. a proxy injected a leading
        // locale segment). A static segment catches this above by failing to
        // match its URL part; a dynamic segment consumes whatever part is in
        // front of it, so compare against the rendered value instead. Bail out.
        switch(paramType){
            case 'd':
                {
                    // Canonicalize the URL part to the same encoded form the server used
                    // for the cache key.
                    if (urlPart !== null && (0, _routeparams.canonicalizeURLPart)(urlPart) !== paramCacheKey) {
                        return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
                    }
                    break;
                }
            case 'c':
            case 'oc':
                {
                    // Catch-alls consume every remaining URL part; their cache keys are
                    // the rendered parts joined with '/' (empty string for an empty
                    // optional catch-all). Comparing the joined remainder also catches a
                    // rewrite that appended segments the URL doesn't have.
                    const joinedRemainingParts = pathnameParts.slice(partIndex).map(_routeparams.canonicalizeURLPart).join('/');
                    if (joinedRemainingParts !== paramCacheKey) {
                        return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
                    }
                    break;
                }
            case 'ci(..)(..)':
            case 'ci(.)':
            case 'ci(..)':
            case 'ci(...)':
            case 'di(..)(..)':
            case 'di(.)':
            case 'di(..)':
            case 'di(...)':
                break;
            default:
                paramType;
        }
        if (parentKnownRoutePart.hasConflictingDynamicChildren || parentKnownRoutePart.dynamicChild !== null && (parentKnownRoutePart.dynamicChildParamName !== paramName || parentKnownRoutePart.dynamicChildParamType !== paramType)) {
            // A different parallel route branch already claimed the dynamic child
            // at this level with a different param. Mark the level as conflicted
            // so matching bails out, and don't store a pattern via this branch.
            parentKnownRoutePart.hasConflictingDynamicChildren = true;
            return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
        }
        // URL matches route structure. Build the known route tree.
        knownRoutePart = discoverDynamicChild(parentKnownRoutePart, paramName, paramType);
        // Record static siblings as placeholder parts.
        // IMPORTANT: We use the null vs Map distinction to track whether
        // siblings are known at this level:
        // - staticChildren: null = siblings unknown (can't safely match dynamic)
        // - staticChildren: Map = siblings known (even if empty)
        // This matters in dev mode where webpack may not know all siblings yet.
        if (staticSiblings !== null) {
            // Siblings are known - ensure we have a Map (even if empty)
            if (parentKnownRoutePart.staticChildren === null) {
                parentKnownRoutePart.staticChildren = new Map();
            }
            for (const sibling of staticSiblings){
                if (!parentKnownRoutePart.staticChildren.has(sibling)) {
                    parentKnownRoutePart.staticChildren.set(sibling, createEmptyPart());
                }
            }
        }
        // Advance to next URL part. Catch-all segments (`[...param]` and
        // `[[...param]]`) absorb every remaining URL part at runtime (see
        // `matchKnownRoutePart`, which slices the rest of `pathnameParts`).
        if (paramType === 'c' || paramType === 'oc') {
            nextPartIndex = pathnameParts.length;
        } else {
            nextPartIndex = partIndex + 1;
        }
    }
    // Recurse into child routes. A route tree can have multiple parallel routes
    // (e.g., @modal alongside children). Each parallel route is a separate
    // branch, but they all share the same URL - we just need to traverse all
    // branches to build out the known route tree.
    const slots = routeTree.slots;
    let resultFromChildren = null;
    if (slots !== null) {
        for (const childRouteTree of slots.values()){
            // Skip branches with refreshState set - these were reused from a
            // different route (e.g., a "default" parallel slot) and don't represent
            // the actual route structure for this URL.
            if (childRouteTree.refreshState !== null) {
                continue;
            }
            const result = discoverKnownRoutePart(knownRoutePart, childRouteTree, pathnameParts, nextPartIndex, existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching, hasDynamicRewrite);
            // All parallel route branches share the same URL, so they should all
            // reach compatible leaf nodes. We capture any result.
            resultFromChildren = result;
        }
        if (resultFromChildren !== null) {
            return resultFromChildren;
        }
        // Defensive fallback: no children returned a result. This shouldn't happen
        // for valid route trees, but handle it gracefully.
        return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
    }
    // Reached a page node (`__PAGE__` leaf). If there are still URL parts
    // left to consume, the route tree is shorter than the URL, which means
    // the URL doesn't match the route structure (likely a rewrite).
    if (nextPartIndex < pathnameParts.length) {
        return handleMismatchDueToRewrite(existingEntry, now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
    }
    // Reached a page node. Create/get the route cache entry and store as a
    // pattern. First, check if there's already a pattern for this route.
    const existingPattern = readPattern(now, knownRoutePart);
    if (existingPattern !== null) {
        // If this route has a dynamic rewrite, mark the existing pattern.
        if (hasDynamicRewrite) {
            existingPattern.hasDynamicRewrite = true;
        }
        return existingPattern;
    }
    // Get or create the entry
    let entry;
    if (existingEntry !== null) {
        // Already have a fulfilled entry, use it directly. It's already in the
        // route cache map.
        entry = existingEntry;
    } else {
        // Create the entry and insert it into the route cache map.
        entry = (0, _cache.writeRouteIntoCache)(now, pathname, search, nextUrl, fullTree, metadataVaryPath, couldBeIntercepted, canonicalUrl, supportsPerSegmentPrefetching);
    }
    if (hasDynamicRewrite) {
        entry.hasDynamicRewrite = true;
    }
    // Store as pattern
    knownRoutePart.pattern = entry;
    return entry;
}
function matchKnownRoute(now, pathname, search) {
    const pathnameParts = (0, _cachekey.splitPathnameIntoParts)(pathname);
    const resolvedParams = new Map();
    const match = matchKnownRoutePart(now, knownRouteTreeRoot, pathnameParts, 0, resolvedParams);
    if (match === null) {
        return null;
    }
    const matchedPart = match.part;
    const pattern = match.pattern;
    // If the pattern could be intercepted, we can't safely use it for prediction.
    // Interception routes resolve to different route trees depending on the
    // referrer (the Next-Url header), which means the same URL can map to
    // different page components depending on where the navigation originated.
    // Since the known route tree only stores a single pattern per URL shape, we
    // can't distinguish between the intercepted and non-intercepted cases, so we
    // bail out to server resolution.
    //
    // TODO: We could store interception behavior in the known route tree itself
    // (e.g., which segments use interception markers and what they resolve to).
    // With enough information embedded in the trie, we could match interception
    // routes entirely on the client without a server round-trip.
    if (pattern.couldBeIntercepted) {
        return null;
    }
    // "Reify" the pattern: clone the template tree with concrete param values.
    // This substitutes resolved params (e.g., slug: "hello") into dynamic
    // segments and recomputes vary paths for correct segment cache keying.
    const acc = {
        metadataVaryPath: null
    };
    const reifiedTree = reifyRouteTree(pattern.tree, resolvedParams, search, null, acc);
    // The metadata tree is a flat page node without the intermediate layout
    // structure. Clone it with the updated metadata vary path collected during
    // the main tree traversal.
    const metadataVaryPath = acc.metadataVaryPath;
    if (metadataVaryPath === null) {
        // This shouldn't be reachable for a valid route tree.
        return null;
    }
    const reifiedMetadata = (0, _cache.createMetadataRouteTree)(metadataVaryPath);
    // Create a synthetic (predicted) entry and store it as the new pattern.
    //
    // Why replace the pattern? We intentionally update the pattern with this
    // synthetic entry so that if our prediction was wrong (server returns a
    // different pathname due to dynamic rewrite), the entry gets marked with
    // hasDynamicRewrite. Future predictions for this route will see the flag
    // and bail out to server resolution instead of making the same mistake.
    const syntheticEntry = {
        canonicalUrl: pathname + search,
        status: _cache.EntryStatus.Fulfilled,
        blockedTasks: null,
        tree: reifiedTree,
        metadata: reifiedMetadata,
        couldBeIntercepted: pattern.couldBeIntercepted,
        supportsPerSegmentPrefetching: pattern.supportsPerSegmentPrefetching,
        hasDynamicRewrite: false,
        renderedSearch: search,
        ref: null,
        size: pattern.size,
        staleAt: pattern.staleAt,
        version: pattern.version
    };
    matchedPart.pattern = syntheticEntry;
    return syntheticEntry;
}
/**
 * Recursively matches a URL against the known route tree.
 *
 * Matching priority (most specific first):
 * 1. Static children - exact path segment match
 * 2. Dynamic child - [param], [...param], [[...param]]
 * 3. Direct pattern - when no more URL parts remain
 *
 * Collects resolved param values in resolvedParams as it traverses.
 * Returns null if no match found (caller should fall back to server).
 */ function matchKnownRoutePart(now, part, pathnameParts, partIndex, resolvedParams) {
    const urlPart = partIndex < pathnameParts.length ? pathnameParts[partIndex] : null;
    // If staticChildren is null, we don't know what static routes exist at this
    // level. This happens in webpack dev mode where routes are compiled
    // on-demand. We can't safely match a dynamicChild because the URL part might
    // be a static sibling we haven't discovered yet. Example: We know
    // /blog/[slug] exists, but haven't compiled /blog/featured. A request for
    // /blog/featured would incorrectly match /blog/[slug].
    if (part.staticChildren === null) {
        // The only safe match is a direct pattern when no URL parts remain.
        if (urlPart === null) {
            const pattern = readPattern(now, part);
            if (pattern !== null && !pattern.hasDynamicRewrite) {
                return {
                    part,
                    pattern
                };
            }
        }
        return null;
    }
    // Static children take priority over dynamic. This ensures /blog/featured
    // matches its own route rather than /blog/[slug].
    if (urlPart !== null) {
        const staticChild = part.staticChildren.get(urlPart);
        if (staticChild !== undefined) {
            // Check if this is an "unknown" placeholder part. These are created when
            // we learn about static siblings (from the route tree's staticSiblings
            // field) but haven't prefetched them yet. We know the path exists but
            // don't know its structure, so we can't predict it.
            if (staticChild.pattern === null && staticChild.dynamicChild === null && staticChild.staticChildren === null) {
                // Bail out - server must resolve this route.
                return null;
            }
            const match = matchKnownRoutePart(now, staticChild, pathnameParts, partIndex + 1, resolvedParams);
            if (match !== null) {
                return match;
            }
            // Static child is a real node (not a placeholder) but its subtree
            // didn't match the remaining URL parts. This means the route exists
            // in the static subtree but hasn't been fully discovered yet. Do not
            // fall through to try the dynamic child — the static match is
            // authoritative. Bail out to server resolution.
            return null;
        }
    }
    // Try dynamic child. Skip it entirely if parallel route branches disagree
    // about the dynamic segment at this level — any pattern stored beneath it
    // was learned under a conflicting model.
    if (part.dynamicChild !== null && !part.hasConflictingDynamicChildren) {
        const dynamicPart = part.dynamicChild;
        const paramName = part.dynamicChildParamName;
        const paramType = part.dynamicChildParamType;
        const dynamicPattern = readPattern(now, dynamicPart);
        switch(paramType){
            case 'c':
                // Required catch-all [...param]: consumes 1+ URL parts
                if (dynamicPattern !== null && !dynamicPattern.hasDynamicRewrite && urlPart !== null) {
                    resolvedParams.set(paramName, pathnameParts.slice(partIndex).join('/'));
                    return {
                        part: dynamicPart,
                        pattern: dynamicPattern
                    };
                }
                break;
            case 'oc':
                {
                    // Optional catch-all [[...param]]: consumes 0+ URL parts
                    if (dynamicPattern !== null && !dynamicPattern.hasDynamicRewrite) {
                        if (urlPart !== null) {
                            resolvedParams.set(paramName, pathnameParts.slice(partIndex).join('/'));
                            return {
                                part: dynamicPart,
                                pattern: dynamicPattern
                            };
                        }
                        // urlPart is null - can match with zero parts, but a direct pattern
                        // (e.g., page.tsx alongside [[...param]]) takes precedence.
                        const directPattern = readPattern(now, part);
                        if (directPattern === null || directPattern.hasDynamicRewrite) {
                            resolvedParams.set(paramName, '');
                            return {
                                part: dynamicPart,
                                pattern: dynamicPattern
                            };
                        }
                    }
                    break;
                }
            case 'd':
                // Regular dynamic [param]: consumes exactly 1 URL part.
                // Unlike catch-all which terminates here, regular dynamic must
                // continue recursing to find the leaf pattern.
                if (urlPart !== null) {
                    resolvedParams.set(paramName, urlPart);
                    return matchKnownRoutePart(now, dynamicPart, pathnameParts, partIndex + 1, resolvedParams);
                }
                break;
            // Intercepted routes use relative path markers like (.), (..), (...)
            // Their behavior depends on navigation context (soft vs hard nav),
            // so we can't predict them client-side. Defer to server.
            case 'ci(..)(..)':
            case 'ci(.)':
            case 'ci(..)':
            case 'ci(...)':
            case 'di(..)(..)':
            case 'di(.)':
            case 'di(..)':
            case 'di(...)':
                return null;
            default:
                paramType;
        }
    }
    // No children matched. If we've consumed all URL parts, check for a direct
    // pattern at this node (the route terminates here).
    if (urlPart === null) {
        const pattern = readPattern(now, part);
        if (pattern !== null && !pattern.hasDynamicRewrite) {
            return {
                part,
                pattern
            };
        }
    }
    return null;
}
/**
 * "Reify" means to make concrete - we take an abstract pattern (the template
 * route tree) and produce a concrete instance with actual param values.
 *
 * This function clones a RouteTree, substituting dynamic segment values from
 * resolvedParams and computing new vary paths. The vary path encodes param
 * values so segment cache entries can be correctly keyed.
 *
 * Example: Pattern for /blog/[slug] with resolvedParams { slug: "hello" }
 * produces a tree where segment [slug] has cacheKey "hello".
 */ function reifyRouteTree(pattern, resolvedParams, search, parentPartialVaryPath, acc) {
    const originalSegment = pattern.segment;
    // This segment's param (if any) is a root param iff the segment is at or
    // above the root layout, which the server marks directly.
    const isRootParam = (pattern.prefetchHints & _approutertypes.PrefetchHint.IsRootLayoutOrAbove) !== 0;
    let newSegment = originalSegment;
    let partialVaryPath;
    if (typeof originalSegment !== 'string') {
        // Dynamic segment: compute new cache key and append to partial vary path
        const paramName = originalSegment[0];
        const paramType = originalSegment[2];
        const staticSiblings = originalSegment[3];
        const newValue = resolvedParams.get(paramName);
        if (newValue !== undefined) {
            // Catch-all values are already joined into a single string when they're
            // resolved in matchKnownRoutePart, so the value can be used directly.
            const newCacheKey = newValue;
            newSegment = [
                paramName,
                newCacheKey,
                paramType,
                staticSiblings
            ];
            partialVaryPath = (0, _varypath.appendLayoutVaryPath)(parentPartialVaryPath, newCacheKey, paramName, isRootParam);
        } else {
            // Param not found in resolvedParams - keep original and inherit partial
            // TODO: This should never happen. Bail out with null.
            partialVaryPath = parentPartialVaryPath;
        }
    } else {
        // Static segment: inherit partial vary path from parent
        partialVaryPath = parentPartialVaryPath;
    }
    // Recurse into children with the (possibly updated) partial vary path
    let newSlots = null;
    const patternSlots = pattern.slots;
    if (patternSlots !== null) {
        newSlots = new Map();
        for (const [key, childPattern] of patternSlots){
            newSlots.set(key, reifyRouteTree(childPattern, resolvedParams, search, partialVaryPath, acc));
        }
    }
    if (pattern.isPage) {
        // Page segment: finalize with search params
        const newVaryPath = (0, _varypath.finalizePageVaryPath)(pattern.requestKey, search, partialVaryPath);
        // Collect metadata vary path (first page wins, same as original algorithm)
        if (acc.metadataVaryPath === null) {
            acc.metadataVaryPath = (0, _varypath.finalizeMetadataVaryPath)(pattern.requestKey, search, partialVaryPath);
        }
        return {
            requestKey: pattern.requestKey,
            segment: newSegment,
            shellVaryPath: (0, _varypath.getShellSegmentVaryPath)(newVaryPath),
            refreshState: pattern.refreshState,
            varyPath: newVaryPath,
            isPage: true,
            slots: newSlots,
            prefetchHints: pattern.prefetchHints
        };
    } else {
        // Layout segment: finalize without search params
        const newVaryPath = (0, _varypath.finalizeLayoutVaryPath)(pattern.requestKey, partialVaryPath);
        return {
            requestKey: pattern.requestKey,
            segment: newSegment,
            shellVaryPath: (0, _varypath.getShellSegmentVaryPath)(newVaryPath),
            refreshState: pattern.refreshState,
            varyPath: newVaryPath,
            isPage: false,
            slots: newSlots,
            prefetchHints: pattern.prefetchHints
        };
    }
}
function resetKnownRoutes() {
    knownRouteTreeRoot = createEmptyPart();
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/scheduler.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelPrefetchTask: null,
    isPrefetchTaskDirty: null,
    pingPrefetchScheduler: null,
    pingPrefetchTask: null,
    reschedulePrefetchTask: null,
    schedulePrefetchTask: null,
    startRevalidationCooldown: null,
    subtreeHasSpeculativePrefetch: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelPrefetchTask: function() {
        return cancelPrefetchTask;
    },
    isPrefetchTaskDirty: function() {
        return isPrefetchTaskDirty;
    },
    pingPrefetchScheduler: function() {
        return pingPrefetchScheduler;
    },
    pingPrefetchTask: function() {
        return pingPrefetchTask;
    },
    reschedulePrefetchTask: function() {
        return reschedulePrefetchTask;
    },
    schedulePrefetchTask: function() {
        return schedulePrefetchTask;
    },
    startRevalidationCooldown: function() {
        return startRevalidationCooldown;
    },
    subtreeHasSpeculativePrefetch: function() {
        return subtreeHasSpeculativePrefetch;
    }
});
const _approutertypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)");
const _matchsegments = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/match-segments.js [app-ssr] (ecmascript)");
const _cache = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache.js [app-ssr] (ecmascript)");
const _cachekey = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-key.js [app-ssr] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/route-params.js [app-ssr] (ecmascript)");
const _types = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _lru = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/lru.js [app-ssr] (ecmascript)");
const scheduleMicrotask = typeof queueMicrotask === 'function' ? queueMicrotask : (fn)=>Promise.resolve().then(fn).catch((error)=>setTimeout(()=>{
            throw error;
        }));
const taskHeap = [];
let inProgressRequests = 0;
let sortIdCounter = 0;
let didScheduleMicrotask = false;
// The most recently hovered (or touched, etc) link, i.e. the most recent task
// scheduled at Intent priority. There's only ever a single task at Intent
// priority at a time. We reserve special network bandwidth for this task only.
let mostRecentlyHoveredLink = null;
// CDN cache propagation delay after revalidation (in milliseconds)
const REVALIDATION_COOLDOWN_MS = 300;
// Timeout handle for the revalidation cooldown. When non-null, prefetch
// requests are blocked to allow CDN cache propagation.
let revalidationCooldownTimeoutHandle = null;
function startRevalidationCooldown() {
    // Clear any existing timeout in case multiple revalidations happen
    // in quick succession.
    if (revalidationCooldownTimeoutHandle !== null) {
        clearTimeout(revalidationCooldownTimeoutHandle);
    }
    // Schedule the cooldown to expire after the delay.
    revalidationCooldownTimeoutHandle = setTimeout(()=>{
        revalidationCooldownTimeoutHandle = null;
        // Retry the prefetch queue now that the cooldown has expired.
        pingPrefetchScheduler();
    }, REVALIDATION_COOLDOWN_MS);
}
function schedulePrefetchTask(key, treeAtTimeOfPrefetch, fetchStrategy, priority, onInvalidate, navigationLockPrefetch) {
    // Bind the task to the segment cache map that is active right now: the
    // shared map, unless the Instant Navigation Testing lock is held, in which
    // case the task gets the lock scope's private map. This is the single
    // place work is bound to a map based on lock state — everything downstream
    // receives the map explicitly. See `segmentCacheMap` in cache.ts.
    let taskSegmentCacheMap = _cache.segmentCacheMap;
    if ("TURBOPACK compile-time truthy", 1) {
        const { getNavigationLockSegmentCacheMap } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
        const lockMap = getNavigationLockSegmentCacheMap();
        if (lockMap !== null) {
            taskSegmentCacheMap = lockMap;
        }
    }
    // Spawn a new prefetch task
    const task = {
        key,
        treeAtTimeOfPrefetch,
        routeCacheVersion: (0, _cache.getCurrentRouteCacheVersion)(),
        segmentCacheVersion: (0, _cache.getCurrentSegmentCacheVersion)(),
        segmentCacheMap: taskSegmentCacheMap,
        priority,
        phase: 2,
        hasBackgroundWork: false,
        hasPendingResponses: false,
        spawnedRuntimePrefetches: null,
        fetchStrategy,
        sortId: sortIdCounter++,
        isCanceled: false,
        fallbackRetryStatus: _cache.EntryStatus.Empty,
        onInvalidate,
        _heapIndex: -1
    };
    if ("TURBOPACK compile-time truthy", 1) {
        task._navigationLockPrefetch = navigationLockPrefetch;
    }
    trackMostRecentlyHoveredLink(task);
    heapPush(taskHeap, task);
    // Schedule an async task to process the queue.
    //
    // The main reason we process the queue in an async task is for batching.
    // It's common for a single JS task/event to trigger multiple prefetches.
    // By deferring to a microtask, we only process the queue once per JS task.
    // If they have different priorities, it also ensures they are processed in
    // the optimal order.
    pingPrefetchScheduler();
    return task;
}
function cancelPrefetchTask(task) {
    // Remove the prefetch task from the queue. If the task already completed,
    // then this is a no-op.
    //
    // We must also explicitly mark the task as canceled so that a blocked task
    // does not get added back to the queue when it's pinged by the network.
    task.isCanceled = true;
    // A running fallback-retry loop notices `isCanceled` when it next wakes and
    // bails (settling its status to Rejected), so there's nothing to clean up here.
    heapDelete(taskHeap, task);
}
function reschedulePrefetchTask(task, treeAtTimeOfPrefetch, fetchStrategy, priority) {
    // Bump the prefetch task to the top of the queue, as if it were a fresh
    // task. This is essentially the same as canceling the task and scheduling
    // a new one, except it reuses the original object.
    //
    // The primary use case is to increase the priority of a Link-initated
    // prefetch on hover.
    // Un-cancel the task, in case it was previously canceled.
    task.isCanceled = false;
    task.phase = 2;
    // Note: fallback-retry state is deliberately NOT reset here. A retry loop runs
    // at most once per task, even across reschedules, so a re-hover never starts a
    // second loop. A loop already running simply continues (it only stops on
    // cancel); `fallbackRetryStatus` never returns to `Empty` once it leaves it.
    // Assign a new sort ID to move it ahead of all other tasks at the same
    // priority level. (Higher sort IDs are processed first.)
    task.sortId = sortIdCounter++;
    task.priority = // Intent priority, even if the rescheduled priority is lower.
    task === mostRecentlyHoveredLink ? _types.PrefetchPriority.Intent : priority;
    task.treeAtTimeOfPrefetch = treeAtTimeOfPrefetch;
    task.fetchStrategy = fetchStrategy;
    trackMostRecentlyHoveredLink(task);
    if (task._heapIndex !== -1) {
        // The task is already in the queue.
        heapResift(taskHeap, task);
    } else {
        heapPush(taskHeap, task);
    }
    pingPrefetchScheduler();
}
function isPrefetchTaskDirty(task, nextUrl, tree) {
    // This is used to quickly bail out of a prefetch task if the result is
    // guaranteed to not have changed since the task was initiated. This is
    // strictly an optimization — theoretically, if it always returned true, no
    // behavior should change because a full prefetch task will effectively
    // perform the same checks.
    return task.routeCacheVersion !== (0, _cache.getCurrentRouteCacheVersion)() || task.segmentCacheVersion !== (0, _cache.getCurrentSegmentCacheVersion)() || task.treeAtTimeOfPrefetch !== tree || task.key.nextUrl !== nextUrl;
}
function trackMostRecentlyHoveredLink(task) {
    // Track the mostly recently hovered link, i.e. the most recently scheduled
    // task at Intent priority. There must only be one such task at a time.
    if (task.priority === _types.PrefetchPriority.Intent && task !== mostRecentlyHoveredLink) {
        if (mostRecentlyHoveredLink !== null) {
            // Bump the previously hovered link's priority down to Default.
            if (mostRecentlyHoveredLink.priority !== _types.PrefetchPriority.Background) {
                mostRecentlyHoveredLink.priority = _types.PrefetchPriority.Default;
                heapResift(taskHeap, mostRecentlyHoveredLink);
            }
        }
        mostRecentlyHoveredLink = task;
    }
}
function pingPrefetchScheduler() {
    if (didScheduleMicrotask) {
        // Already scheduled a task to process the queue
        return;
    }
    didScheduleMicrotask = true;
    scheduleMicrotask(processQueueInMicrotask);
}
/**
 * Checks if we've exceeded the maximum number of concurrent prefetch requests,
 * to avoid saturating the browser's internal network queue. This is a
 * cooperative limit — prefetch tasks should check this before issuing
 * new requests.
 *
 * Also checks if we're within the revalidation cooldown window, during which
 * prefetch requests are delayed to allow CDN cache propagation.
 */ function hasNetworkBandwidth(task) {
    // When offline, don't issue any prefetch requests. The scheduler will be
    // re-pinged when connectivity is restored.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Check if we're within the revalidation cooldown window
    if (revalidationCooldownTimeoutHandle !== null) {
        // We're within the cooldown window. Return false to prevent prefetching.
        // When the cooldown expires, the timeout will call ensureWorkIsScheduled()
        // to retry the queue.
        return false;
    }
    // TODO: Also check if there's an in-progress navigation. We should never
    // add prefetch requests to the network queue if an actual navigation is
    // taking place, to ensure there's sufficient bandwidth for render-blocking
    // data and resources.
    // TODO: Consider reserving some amount of bandwidth for static prefetches.
    if (task.priority === _types.PrefetchPriority.Intent) {
        // The most recently hovered link is allowed to exceed the default limit.
        //
        // The goal is to always have enough bandwidth to start a new prefetch
        // request when hovering over a link.
        //
        // However, because we don't abort in-progress requests, it's still possible
        // we'll run out of bandwidth. When links are hovered in quick succession,
        // there could be multiple hover requests running simultaneously.
        return inProgressRequests < 12;
    }
    // The default limit is lower than the limit for a hovered link.
    return inProgressRequests < 4;
}
function spawnPrefetchSubtask(prefetchSubtask) {
    // When the scheduler spawns an async task, we don't await its result.
    // Instead, the async task writes its result directly into the cache, then
    // pings the scheduler to continue.
    //
    // We process server responses streamingly, so the prefetch subtask will
    // likely resolve before we're finished receiving all the data. The subtask
    // result includes a promise that resolves once the network connection is
    // closed. The scheduler uses this to control network bandwidth by tracking
    // and limiting the number of concurrent requests.
    inProgressRequests++;
    return prefetchSubtask.then((result)=>{
        if (result === null) {
            // The prefetch task errored before it could start processing the
            // network stream. Assume the connection is closed.
            onPrefetchConnectionClosed();
            return null;
        }
        // Wait for the connection to close before freeing up more bandwidth.
        result.closed.then(onPrefetchConnectionClosed);
        return result.value;
    });
}
function onPrefetchConnectionClosed() {
    inProgressRequests--;
    // Notify the scheduler that we have more bandwidth, and can continue
    // processing tasks.
    pingPrefetchScheduler();
}
function pingPrefetchTask(task) {
    // "Ping" a prefetch that's already in progress to notify it of new data.
    if (task.isCanceled || // Check if prefetch is already queued.
    task._heapIndex !== -1) {
        return;
    }
    // Add the task back to the queue.
    heapPush(taskHeap, task);
    pingPrefetchScheduler();
}
function processQueueInMicrotask() {
    didScheduleMicrotask = false;
    // We aim to minimize how often we read the current time. Since nearly all
    // functions in the prefetch scheduler are synchronous, we can read the time
    // once and pass it as an argument wherever it's needed.
    const now = Date.now();
    // Process the task queue until we run out of network bandwidth.
    let task = heapPeek(taskHeap);
    while(task !== null && hasNetworkBandwidth(task)){
        task.routeCacheVersion = (0, _cache.getCurrentRouteCacheVersion)();
        task.segmentCacheVersion = (0, _cache.getCurrentSegmentCacheVersion)();
        const exitStatus = pingRoute(now, task);
        // These fields are only valid for a single "pass" — one pingRoute
        // invocation for a task, which is what the comments here also call an
        // attempt or an iteration. Reset them after each iteration of the
        // task queue.
        const hasBackgroundWork = task.hasBackgroundWork;
        task.hasBackgroundWork = false;
        task.hasPendingResponses = false;
        task.spawnedRuntimePrefetches = null;
        switch(exitStatus){
            case 0:
                // The task yielded because there are too many requests in progress.
                // Stop processing tasks until we have more bandwidth.
                return;
            case 1:
                // The task is blocked. It needs more data before it can proceed.
                // Keep the task out of the queue until the server responds.
                heapPop(taskHeap);
                // Continue to the next task
                task = heapPeek(taskHeap);
                continue;
            case 2:
                if (task.phase === 2) {
                    // Finished prefetching the route tree. The two-phase (Shell then
                    // Speculative) flow only applies to routes that have opted into
                    // Partial Prefetching — either globally via the `partialPrefetching`
                    // config or per segment (`prefetch: 'partial'` or
                    // `'unstable_eager'`), all surfaced as the
                    // `SubtreeHasPartialPrefetching` hint on the route tree. Every other
                    // route skips the Shell phase and goes straight to Speculative.
                    //
                    // The route entry is fulfilled at this point (the RouteTree phase
                    // just completed), so its prefetch hints are available.
                    const route = (0, _cache.readRouteCacheEntry)(now, task.key);
                    const routeHasPartialPrefetching = route !== null && route.status === _cache.EntryStatus.Fulfilled && (route.tree.prefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) !== 0;
                    task.phase = routeHasPartialPrefetching ? 1 : 0;
                    heapResift(taskHeap, task);
                } else if (task.phase === 1) {
                    // Shell phase complete — a Done exit means the pass observed every
                    // response it cares about (otherwise it would have exited Blocked;
                    // see hasPendingResponses). Always advance to Speculative regardless
                    // of whether Shell-phase work fired — Speculative is responsible
                    // for the per-link concrete work and runs even on routes whose
                    // shell phase was a no-op.
                    task.phase = 0;
                    heapResift(taskHeap, task);
                } else if (hasBackgroundWork) {
                    // The task spawned additional background work. Reschedule the task
                    // at background priority.
                    task.priority = _types.PrefetchPriority.Background;
                    heapResift(taskHeap, task);
                } else {
                    // The prefetch is complete. Continue to the next task.
                    //
                    // Completion is terminal in the normal flow: a task only completes
                    // after a full pass observed every response it cares about. In rare
                    // cases, though, a task can complete while still registered on an
                    // entry from an earlier pass whose subtree the final pass no longer
                    // reached; when that entry later settles, it re-pings the completed
                    // task. The re-run is a harmless idempotent no-op, but any
                    // per-completion side effect added here must be idempotent or
                    // once-guarded — in particular, the navigation-lock release below
                    // must not fire twice (hence the nulling).
                    if (("TURBOPACK compile-time value", true) && task._navigationLockPrefetch != null) {
                        // This locked-navigation prefetch is complete: the final pass
                        // observed every segment response it cares about, so the data the
                        // navigation will read has settled. Resolve the prefetch's
                        // promise (awaited by `ensurePrefetchThenNavigate`) so the
                        // navigation proceeds against present data rather than a
                        // still-in-flight entry.
                        const { resolveNavigationLockPrefetch } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/navigation-testing-lock.js [app-ssr] (ecmascript)");
                        resolveNavigationLockPrefetch(task._navigationLockPrefetch);
                        // Release at most once per task: a stale registration from an
                        // earlier pass can re-ping a completed task (see above), so it can
                        // pass through here again.
                        task._navigationLockPrefetch = null;
                    }
                    heapPop(taskHeap);
                }
                task = heapPeek(taskHeap);
                continue;
            default:
                exitStatus;
        }
    }
    // Run LRU cleanup only when the scheduler is fully idle: no queued tasks and
    // no in-progress requests. At that point, all active prefetch tasks have
    // finished reading from the cache (moving recently used entries to the front
    // of the list), so only genuinely stale data gets evicted.
    if (task === null && inProgressRequests === 0) {
        (0, _lru.cleanup)();
    }
}
/**
 * Check this during a prefetch task to determine if background work can be
 * performed. If so, it evaluates to `true`. Otherwise, it returns `false`,
 * while also scheduling a background task to run later. Usage:
 *
 * @example
 * if (background(task)) {
 *   // Perform background-pri work
 * }
 *
 * TODO: Model "background" as a phase (like Shell / Speculative) rather
 * than as a priority. Conceptually it's the same pattern: defer work
 * until a later pass over the task. The current priority-based encoding
 * predates the phase model and could be unified.
 */ function background(task) {
    if (task.priority === _types.PrefetchPriority.Background) {
        return true;
    }
    task.hasBackgroundWork = true;
    return false;
}
function pingRoute(now, task) {
    const key = task.key;
    const route = (0, _cache.readOrCreateRouteCacheEntry)(now, task, key);
    const exitStatus = pingRootRouteTree(now, task, route);
    if (exitStatus !== 0 && key.search !== '') {
        // If the URL has a non-empty search string, also prefetch the pathname
        // without the search string. We use the searchless route tree as a base for
        // optimistic routing; see requestOptimisticRouteCacheEntry for details.
        //
        // Note that we don't need to prefetch any of the segment data. Just the
        // route tree.
        //
        // TODO: This is a temporary solution; the plan is to replace this by adding
        // a wildcard lookup method to the TupleMap implementation. This is
        // non-trivial to implement because it needs to account for things like
        // fallback route entries, hence this temporary workaround.
        const url = new URL(key.pathname, location.origin);
        const keyWithoutSearch = (0, _cachekey.createCacheKey)(url.href, key.nextUrl);
        const routeWithoutSearch = (0, _cache.readOrCreateRouteCacheEntry)(now, task, keyWithoutSearch);
        switch(routeWithoutSearch.status){
            case _cache.EntryStatus.Empty:
                {
                    if (background(task)) {
                        routeWithoutSearch.status = _cache.EntryStatus.Pending;
                        spawnPrefetchSubtask((0, _cache.fetchRouteOnCacheMiss)(routeWithoutSearch, keyWithoutSearch, task.segmentCacheMap));
                    }
                    break;
                }
            case _cache.EntryStatus.Pending:
            case _cache.EntryStatus.Fulfilled:
            case _cache.EntryStatus.Rejected:
                {
                    break;
                }
            default:
                routeWithoutSearch;
        }
    }
    if (exitStatus === 2 && task.hasPendingResponses) {
        // The pass traversed the whole tree, but some segment responses haven't
        // arrived yet, so the current phase isn't actually complete. Block until
        // they do (see blockTaskOnPendingResponse for the full rationale).
        return 1;
    }
    return exitStatus;
}
function pingRootRouteTree(now, task, route) {
    switch(route.status){
        case _cache.EntryStatus.Empty:
            {
                // Route is not yet cached, and there's no request already in progress.
                // Spawn a task to request the route, load it into the cache, and ping
                // the task to continue.
                // TODO: There are multiple strategies in the <Link> API for prefetching
                // a route. Currently we've only implemented the main one: per-segment,
                // static-data only.
                //
                // There's also `<Link prefetch={true}>`
                // which prefetch both static *and* dynamic data.
                // Similarly, we need to fallback to the old, per-page
                // behavior if PPR is disabled for a route (via the incremental opt-in).
                //
                // Those cases will be handled here.
                spawnPrefetchSubtask((0, _cache.fetchRouteOnCacheMiss)(route, task.key, task.segmentCacheMap));
                // If the request takes longer than a minute, a subsequent request should
                // retry instead of waiting for this one. When the response is received,
                // this value will be replaced by a new value based on the stale time sent
                // from the server.
                // TODO: We should probably also manually abort the fetch task, to reclaim
                // server bandwidth.
                route.staleAt = now + 60 * 1000;
                // Upgrade to Pending so we know there's already a request in progress
                route.status = _cache.EntryStatus.Pending;
            // Intentional fallthrough to the Pending branch
            }
        case _cache.EntryStatus.Pending:
            {
                // Still pending. We can't start prefetching the segments until the route
                // tree has loaded. Add the task to the set of blocked tasks so that it
                // is notified when the route tree is ready.
                const blockedTasks = route.blockedTasks;
                if (blockedTasks === null) {
                    route.blockedTasks = new Set([
                        task
                    ]);
                } else {
                    blockedTasks.add(task);
                }
                return 1;
            }
        case _cache.EntryStatus.Rejected:
            {
                // Route tree failed to load. Treat as a 404.
                return 2;
            }
        case _cache.EntryStatus.Fulfilled:
            {
                if (task.phase === 2) {
                    // Do not prefetch segment data during the route tree phase.
                    return 2;
                }
                // Recursively fill in the segment tree.
                if (!hasNetworkBandwidth(task)) {
                    // Stop prefetching segments until there's more bandwidth.
                    return 0;
                }
                const tree = route.tree;
                // A task's fetch strategy gets set to `PPR` for any "auto" prefetch.
                // If it turned out that the route isn't PPR-enabled, we need to use `LoadingBoundary` instead.
                // We don't need to do this for runtime prefetches, because those are only available in
                // `cacheComponents`, where every route is PPR.
                let fetchStrategy;
                if (tree.prefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) {
                    // If Partial Prefetching is enabled anywhere on the target route,
                    // ignore the fetch strategy and switch to unified strategy used by
                    // Cache Components (called `PPR` for now, will likely be renamed).
                    //
                    // In practice, this just means that a "full" prefetch (<Link
                    // prefetch={true}>) has no effect. You're meant to use Runtime
                    // Prefetching instead — that's the new pattern that replaces
                    // prefetch={true}.
                    //
                    // The reason we check for the Partial Prefetching opt-in rather than
                    // the `cacheComponents` flag is to support incremental adoption.
                    // `prefetch={true}` will continue to work until you opt into
                    // Partial Prefetching.
                    fetchStrategy = _types.FetchStrategy.PPR;
                } else if (task.fetchStrategy === _types.FetchStrategy.PPR) {
                    fetchStrategy = route.supportsPerSegmentPrefetching ? _types.FetchStrategy.PPR : _types.FetchStrategy.LoadingBoundary;
                } else {
                    fetchStrategy = task.fetchStrategy;
                }
                switch(fetchStrategy){
                    case _types.FetchStrategy.PPR:
                        {
                            // For Cache Components pages, each segment may be prefetched
                            // statically or using a runtime request, based on various
                            // configurations and heuristics. We'll do this in two passes: first
                            // traverse the tree and perform all the static prefetches.
                            //
                            // Then, if there are any segments that need a runtime request,
                            // do another pass to perform a runtime prefetch.
                            // Derive the static walk's parameters once per pass; the walk
                            // functions below receive them as arguments and are phase-agnostic.
                            // During the Shell phase the walk targets the App Shell variant of
                            // each segment (keyed at the shell vary paths); otherwise it's the
                            // ordinary per-segment static strategy. This is the only place the
                            // phase is consulted — everything below keys off the strategy.
                            const staticWalkStrategy = task.phase === 1 ? _types.FetchStrategy.StaticShell : _types.FetchStrategy.PPR;
                            if (staticWalkStrategy === _types.FetchStrategy.PPR && !subtreeHasSpeculativePrefetch(task.fetchStrategy, tree.prefetchHints)) {
                                // Nothing in the target route needs to be speculatively prefetched.
                                // Bail out. (A PPR walk is the Speculative pass; same check as
                                // the per-subtree bail in pingNewPartOfCacheComponentsTree.)
                                return 2;
                            }
                            pingStaticHead(now, task, route, staticWalkStrategy);
                            const exitStatus = pingSharedPartOfCacheComponentsTree(now, task, route, task.treeAtTimeOfPrefetch, tree, null, staticWalkStrategy);
                            if (exitStatus === 0) {
                                // Child yielded without finishing.
                                return 0;
                            }
                            // We may need to do a runtime prefetch for one or more segments.
                            // Before checking, we can do some fast checks to bail out of this
                            // branch early.
                            //
                            // Runtime prefetches are only issued for walks that require runtime
                            // completeness — the same per-pass predicate that produced the
                            // deopt registrations during the traversal above; see the decision
                            // point in pingNewPartOfCacheComponentsTree. Which segments
                            // actually need a runtime request — registered directly, or only
                            // as the fallback after an insufficient static attempt — was
                            // decided there.
                            if (walkRequiresRuntimeCompleteness(staticWalkStrategy, route)) {
                                const runtimeStrategy = staticWalkStrategy === _types.FetchStrategy.StaticShell ? _types.FetchStrategy.RuntimeShell : _types.FetchStrategy.PPRRuntime;
                                // spawnedRuntimePrefetches was populated during the traversal
                                // above: every subtree in the new part of the tree that needs a
                                // runtime prefetch — plus, during the Shell phase, the head, if
                                // its static attempt was insufficient (see above).
                                //
                                // If it's null, nothing in the new part of the tree is a candidate
                                // for runtime prefetching, and we don't fetch the head, either —
                                // the head is runtime prefetched only if one of the segments is.
                                const spawnedRuntimePrefetches = task.spawnedRuntimePrefetches;
                                if (spawnedRuntimePrefetches !== null) {
                                    const spawnedEntries = new Map();
                                    pingRuntimeHead(now, task, route, spawnedEntries, runtimeStrategy);
                                    const requestTree = pingRuntimePrefetches(now, task, route, tree, spawnedRuntimePrefetches, spawnedEntries, runtimeStrategy);
                                    if (spawnedEntries.size > 0) {
                                        spawnPrefetchSubtask((0, _cache.fetchSegmentPrefetchesUsingDynamicRequest)(task, route, runtimeStrategy, requestTree, spawnedEntries));
                                    }
                                }
                            }
                            return 2;
                        }
                    case _types.FetchStrategy.Full:
                    case _types.FetchStrategy.PPRRuntime:
                    case _types.FetchStrategy.LoadingBoundary:
                        {
                            if (task.phase === 1) {
                                // Shell phase only does work on routes that use the PPR strategy
                                // (Cache Components routes). Other strategies are Shell no-ops
                                // and fall through to Speculative.
                                return 2;
                            }
                            // Prefetch multiple segments using a single dynamic request.
                            // TODO: We can consolidate this branch with previous one by modeling
                            // it as if the first segment in the new tree has runtime prefetching
                            // enabled. Will do this as a follow-up refactor. Might want to remove
                            // the special metatdata case below first. In the meantime, it's not
                            // really that much duplication, just would be nice to remove one of
                            // these codepaths.
                            const spawnedEntries = new Map();
                            pingRuntimeHead(now, task, route, spawnedEntries, fetchStrategy);
                            const dynamicRequestTree = diffRouteTreeAgainstCurrent(now, task, route, task.treeAtTimeOfPrefetch, tree, spawnedEntries, fetchStrategy);
                            let needsDynamicRequest = spawnedEntries.size > 0;
                            if (needsDynamicRequest) {
                                spawnPrefetchSubtask((0, _cache.fetchSegmentPrefetchesUsingDynamicRequest)(task, route, fetchStrategy, dynamicRequestTree, spawnedEntries));
                            }
                            return 2;
                        }
                    default:
                        fetchStrategy;
                }
                break;
            }
        default:
            {
                route;
            }
    }
    return 2;
}
/**
 * Prefetches the Head data for a page (metadata, viewport). The Head is not
 * really a route segment, in the sense that it doesn't appear in the route
 * tree, but we store it in the cache as if it were, using a special key.
 *
 * Symmetric with the per-segment decision point in
 * pingNewPartOfCacheComponentsTree: the head deopts to the runtime prefetch
 * path either when it requires runtime completeness and no static attempt is
 * happening, or when a fulfilled static head entry reported that a runtime
 * request would return more content than the entry contains. Deopting
 * registers the head under its metadata request key, which makes the runtime
 * gate in pingRootRouteTree fire even when every tree segment was
 * sufficient; pingRuntimeHead performs the actual head work.
 */ function pingStaticHead(now, task, route, // it's derived.
fetchStrategy) {
    // The head is subject to the same per-pass runtime-completeness contract
    // as the route's segments: during an App Shell walk, and during any walk
    // of a Partial Prefetching route, the head needs a response at least as
    // complete as a runtime one.
    const headRequiresRuntimeCompleteness = walkRequiresRuntimeCompleteness(fetchStrategy, route);
    if (headRequiresRuntimeCompleteness && // The head is not a tree node — it hangs off the route root — so the
    // static-attempt hint is read from the root's node. (Segments read the
    // bit from their own node; see the decision point in
    // pingNewPartOfCacheComponentsTree.)
    (route.tree.prefetchHints & _approutertypes.PrefetchHint.ShouldAttemptStaticPrefetch) === 0) {
        // No static attempt: the head arrives via the runtime request instead.
        addSpawnedRuntimePrefetch(task, route.metadata.requestKey);
        return;
    }
    if (// on the root), skip the standalone fetch — the head data will arrive
    // as part of that page's response, and its runtime-completeness signal
    // is carried by that page's own entries.
    ("TURBOPACK compile-time value", true) && !(route.tree.prefetchHints & _approutertypes.PrefetchHint.HeadOutlined)) {
        return;
    }
    const segments = {
        tree: route.metadata,
        entry: (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, fetchStrategy, route.metadata),
        parent: null
    };
    const needsRuntimeRequest = pingSegmentBundle(now, task, route, task.key, route.metadata, segments, fetchStrategy, true);
    if (headRequiresRuntimeCompleteness && needsRuntimeRequest) {
        // The static attempt was insufficient for the head. Deopt to a
        // runtime prefetch. (Outside of runtime-completeness contexts the
        // head's signal is unused — a partial static head is filled in by the
        // navigation-time request, as with any other static segment.)
        addSpawnedRuntimePrefetch(task, route.metadata.requestKey);
    }
}
/**
 * Whether the task needs a cache entry at least as complete as a runtime
 * response for every segment it walks before the prefetch counts as done.
 * Runtime completeness is the universal contract for Partial Prefetching,
 * so the predicate is per pass, not per segment:
 *
 * - Every walk of a route that opts into Partial Prefetching (any segment
 *   with a partial-prefetching config, or the global `partialPrefetching`
 *   flag — both surfaced as SubtreeHasPartialPrefetching on the route
 *   root), in both the Shell and Speculative phases.
 * - Every App Shell (StaticShell) walk, because the App Shell must be
 *   reusable across all params by definition. (In practice this is implied
 *   by the first case — the Shell phase only runs for Partial Prefetching
 *   routes.)
 *
 * Routes without Partial Prefetching keep the static-only contract: their
 * walks prefetch static data and partial entries are acceptable — the
 * dynamic holes are filled by the navigation-time request.
 *
 * Note that on a Partial Prefetching route, non-eager subtrees are still
 * skipped by the Speculative pass of a default (auto) link — eagerness is
 * unaffected by this predicate. But every segment the pass DOES walk (eager
 * segments, and everything on a `prefetch={true}` walk) is held to the
 * runtime-completeness contract. The contract is affordable because most
 * routes carry the ShouldAttemptStaticPrefetch hint: their segments are
 * prefetched statically and the responses' own sufficiency signal makes a
 * runtime request rare. On a hint-unset route, a walked segment deopts
 * directly to the batched runtime request — which then serves the segment's
 * whole subtree, so navigations into it are complete without a
 * navigation-time request.
 *
 * This is also the gate for the batched runtime request at the end of
 * pingRootRouteTree; requiring runtime completeness does not itself mean a
 * runtime request is issued for a given segment — see the decision point in
 * pingNewPartOfCacheComponentsTree.
 */ function walkRequiresRuntimeCompleteness(staticWalkStrategy, route) {
    return staticWalkStrategy === _types.FetchStrategy.StaticShell || (route.tree.prefetchHints & _approutertypes.PrefetchHint.SubtreeHasPartialPrefetching) !== 0;
}
/**
 * The runtime counterpart of a pass's static walk strategy: the strategy the
 * batched runtime request uses if this walk deopts. Each phase has exactly one
 * — the Shell phase escalates to a runtime App Shell, the Speculative phase to
 * a per-link concrete runtime prefetch.
 */ function getRuntimeStrategyForWalk(staticWalkStrategy) {
    return staticWalkStrategy === _types.FetchStrategy.StaticShell ? _types.FetchStrategy.RuntimeShell : _types.FetchStrategy.PPRRuntime;
}
/**
 * Whether this phase's runtime request would return more content for a
 * fulfilled entry than the entry already holds.
 *
 * An entry records the tier its CONTENT achieved, not the one it was requested
 * at, and that tier spans both axes — so a static response that needed no
 * runtime data records the runtime counterpart of its own variant (see
 * `recordedFetchStrategy` in cache.ts). That makes this a pure tier
 * comparison: an entry at or above the phase's runtime tier has nothing to
 * gain from it.
 */ function wouldRuntimeRequestProvideMore(entry, staticWalkStrategy) {
    return (0, _cache.canNewFetchStrategyProvideMoreContent)(entry.fetchStrategy, getRuntimeStrategyForWalk(staticWalkStrategy));
}
/**
 * Register a subtree root (or the head's metadata key) for the batched
 * runtime request issued by the gate at the end of pingRootRouteTree.
 */ function addSpawnedRuntimePrefetch(task, requestKey) {
    if (task.spawnedRuntimePrefetches === null) {
        task.spawnedRuntimePrefetches = new Set([
            requestKey
        ]);
    } else {
        task.spawnedRuntimePrefetches.add(requestKey);
    }
}
function pingRuntimeHead(now, task, route, spawnedEntries, fetchStrategy) {
    pingRouteTreeAndIncludeDynamicData(now, task, route, route.metadata, false, spawnedEntries, // and LoadingBoundary
    fetchStrategy === _types.FetchStrategy.LoadingBoundary ? _types.FetchStrategy.Full : fetchStrategy);
}
// TODO: Rename dynamic -> runtime throughout this module
function pingSharedPartOfCacheComponentsTree(now, task, route, oldTree, newTree, parentBundle, // it's derived.
fetchStrategy) {
    // When Cache Components is enabled (or PPR, or a fully static route when PPR
    // is disabled; those cases are treated equivalently to Cache Components), we
    // start by prefetching each segment individually. Once we reach the "new"
    // part of the tree — the part that doesn't exist on the current page — we
    // may choose to switch to a runtime prefetch instead, based on the
    // information sent by the server in the route tree.
    //
    // The traversal starts in the "shared" part of the tree. Once we reach the
    // "new" part of the tree, we switch to a different traversal,
    // pingNewPartOfCacheComponentsTree.
    // The shared part of the tree always performs the ordinary static (PPR)
    // prefetch, regardless of phase. Phase-specific strategies — the runtime
    // shell request and the Shell phase's StaticShell walk — apply only to the
    // new part of the tree, so the per-pass walk strategy is irrelevant here.
    // (The needs-runtime signal is ignored: shared segments are already
    // rendered on the current page, so a runtime prefetch has nothing to add.)
    const bundleInProgress = accumulateSegmentBundle(now, task, route, newTree, parentBundle, _types.FetchStrategy.PPR, true).bundle;
    // Recursively ping the children.
    const oldTreeChildren = oldTree[1];
    const newTreeChildren = newTree.slots;
    if (newTreeChildren !== null) {
        for (const [parallelRouteKey, newTreeChild] of newTreeChildren){
            if (!hasNetworkBandwidth(task)) {
                // Stop prefetching segments until there's more bandwidth.
                return 0;
            }
            const newTreeChildSegment = newTreeChild.segment;
            const oldTreeChild = oldTreeChildren[parallelRouteKey];
            const oldTreeChildSegment = oldTreeChild?.[0];
            // Only pass the bundle to the child that accepts it. A parent is
            // only ever bundled into one child.
            const bundleForChild = ("TURBOPACK compile-time value", true) && bundleInProgress !== null && newTreeChild.prefetchHints & _approutertypes.PrefetchHint.ParentInlinedIntoSelf ? bundleInProgress : null;
            let childExitStatus;
            if (oldTreeChildSegment !== undefined && doesCurrentSegmentMatchCachedSegment(route, newTreeChildSegment, oldTreeChildSegment)) {
                // We're still in the "shared" part of the tree.
                childExitStatus = pingSharedPartOfCacheComponentsTree(now, task, route, oldTreeChild, newTreeChild, bundleForChild, fetchStrategy);
            } else {
                // We've entered the "new" part of the tree. Switch
                // traversal functions.
                //
                // Bundle chains must not cross the strategy boundary: the shared
                // part walks at PPR while a Shell-phase new part walks at
                // StaticShell, and a chain spanning both would fulfill the shared
                // parent's concrete-path entry with shell-variant data. Nor may we
                // finish the chain by fetching the new-part child at PPR here —
                // that would prefetch new-part segments at the concrete tier
                // during the Shell phase, which only the Speculative phase is
                // allowed to do. So drop the bundle instead, exactly like the
                // Speculative walk's subtree bail does when a chain crosses into a
                // subtree it skips: nothing in a dropped chain was upgraded to
                // Pending, so no entry is stranded, and the inlined shared data is
                // fetched by the Speculative pass whenever its walk of the new
                // part permits the child fetch.
                const bundleForNewPart = fetchStrategy === _types.FetchStrategy.StaticShell ? null : bundleForChild;
                childExitStatus = pingNewPartOfCacheComponentsTree(now, task, route, newTreeChild, bundleForNewPart, fetchStrategy);
            }
            if (childExitStatus === 0) {
                // Child yielded without finishing.
                return 0;
            }
        }
    }
    return 2;
}
function pingNewPartOfCacheComponentsTree(now, task, route, tree, parentBundle, // it's derived.
fetchStrategy) {
    // We're now prefetching in the "new" part of the tree, the part that
    // doesn't exist on the current page. (In other words, we're deeper than
    // the shared layouts.) Segments in here default to being prefetched
    // statically, at the per-pass strategy derived in pingRootRouteTree.
    //
    // When the walk requires runtime completeness — an entry at least as
    // complete as a runtime response for every segment before the prefetch
    // can complete (see walkRequiresRuntimeCompleteness) — this function is
    // also the per-segment decision point. If the segment's node carries the
    // ShouldAttemptStaticPrefetch hint (the build-time prerender accessed no
    // runtime data), its subtree is prefetched statically first,
    // and the responses themselves decide whether that was enough: every
    // fulfilled entry carries a needsRuntimeRequest signal. Pending responses
    // block the task, so the attempt is serial, never raced: static attempt →
    // observe → runtime only if needed. Without the hint, the segment deopts
    // directly. Deopting registers the segment's request key in
    // spawnedRuntimePrefetches; the runtime gate at the end of
    // pingRootRouteTree issues a single batched runtime request for
    // everything that accumulated, and that request re-fetches the whole
    // subtree, so the walk stops descending at a deopt.
    //
    // Outside a runtime-completeness walk the same needsRuntimeRequest signal
    // is routine and ignored — any partial entry of a page that accesses
    // runtime data carries it, and the dynamic holes are filled by the
    // navigation-time request.
    if (// prefetch. (It's also the only pass that walks at FetchStrategy.PPR;
    // the Shell phase walks at StaticShell and covers the whole new tree.)
    fetchStrategy === _types.FetchStrategy.PPR && !subtreeHasSpeculativePrefetch(task.fetchStrategy, tree.prefetchHints)) {
        // Nothing in the new part of the tree needs to be speculatively prefetched.
        // Bail out.
        return 2;
    }
    // Constant for the whole pass; recomputed here only because the walk is
    // recursive and the check is cheap.
    const segmentRequiresRuntimeCompleteness = walkRequiresRuntimeCompleteness(fetchStrategy, route);
    // TODO: The static-attempt hint reflects the build-time prerender's whole
    // runtime-data tracking, so a page that always accesses
    // runtime data after the shell stage never attempts a static prefetch —
    // even though its shell variant is rewindable at the shell boundary and
    // perfectly reusable. The server could emit a second bit derived from the
    // shell-stage value ("a static SHELL attempt is worthwhile even though
    // the page accesses runtime data post-shell") to let such pages attempt
    // static, too.
    // A force-disabled segment deliberately does NOT deopt here: disabling
    // prefetch is passive. It never initiates a request — its accumulation
    // below contributes nothing — and must never be the reason a runtime
    // prefetch spawns, though it may ride along in a runtime response issued
    // on another segment's behalf.
    const attemptStaticPrefetchOfSegment = (tree.prefetchHints & _approutertypes.PrefetchHint.ShouldAttemptStaticPrefetch) !== 0;
    if (segmentRequiresRuntimeCompleteness && !attemptStaticPrefetchOfSegment) {
        // Deopt directly to a runtime prefetch, without a static attempt.
        addSpawnedRuntimePrefetch(task, tree.requestKey);
        // If there's a pending static bundle from a parent, we need to finish
        // prefetching it before bailing out to runtime prefetching.
        if (parentBundle !== null) {
            finishStaticBundleOnRuntimeBailout(now, task, route, tree, parentBundle, fetchStrategy);
        }
        return 2;
    }
    // Prefetch this segment and its subtree statically, using the normal
    // static bundling walk.
    const accumulation = accumulateSegmentBundle(now, task, route, tree, parentBundle, fetchStrategy, true);
    const bundleInProgress = accumulation.bundle;
    if (segmentRequiresRuntimeCompleteness && accumulation.needsRuntimeRequest) {
        // The static attempt for this segment was insufficient. Stop the walk
        // and deopt — the runtime prefetch covers the whole subtree. (Unlike the
        // direct deopt above, any open bundle is dropped rather than finished: a
        // fulfilled InlinedIntoChild node can report a true signal while its
        // chain is still open. That's safe — nothing in an un-pinged chain was
        // upgraded to Pending, so no entry is stranded blocking the task, and
        // Empty entries in the dropped chain are re-fetched by a later pass.)
        addSpawnedRuntimePrefetch(task, tree.requestKey);
        return 2;
    }
    if (tree.slots !== null) {
        if (!hasNetworkBandwidth(task)) {
            // Stop prefetching segments until there's more bandwidth.
            return 0;
        }
        // Recursively ping the children.
        for (const childTree of tree.slots.values()){
            // Only pass the bundle to the child that accepts it. A parent is
            // only ever bundled into one child.
            const bundleForChild = ("TURBOPACK compile-time value", true) && bundleInProgress !== null && childTree.prefetchHints & _approutertypes.PrefetchHint.ParentInlinedIntoSelf ? bundleInProgress : null;
            const childResult = pingNewPartOfCacheComponentsTree(now, task, route, childTree, bundleForChild, fetchStrategy);
            if (childResult === 0) {
                // Child yielded without finishing.
                return 0;
            }
        }
    }
    // The static attempt was sufficient for this segment (each child is its
    // own decision point) — or parts of it are still in flight, in which case
    // the task is blocked and the decision re-runs against the received
    // responses.
    return 2;
}
function diffRouteTreeAgainstCurrent(now, task, route, oldTree, newTree, spawnedEntries, fetchStrategy) {
    // This is a single recursive traversal that does multiple things:
    // - Finds the parts of the target route (newTree) that are not part of
    //   of the current page (oldTree) by diffing them, using the same algorithm
    //   as a real navigation.
    // - Constructs a request tree (FlightRouterState) that describes which
    //   segments need to be prefetched and which ones are already cached.
    // - Creates a set of pending cache entries for the segments that need to
    //   be prefetched, so that a subsequent prefetch task does not request the
    //   same segments again.
    const oldTreeChildren = oldTree[1];
    const newTreeChildren = newTree.slots;
    let requestTreeChildren = {};
    if (newTreeChildren !== null) {
        for (const [parallelRouteKey, newTreeChild] of newTreeChildren){
            const newTreeChildSegment = newTreeChild.segment;
            const oldTreeChild = oldTreeChildren[parallelRouteKey];
            const oldTreeChildSegment = oldTreeChild?.[0];
            if (oldTreeChildSegment !== undefined && doesCurrentSegmentMatchCachedSegment(route, newTreeChildSegment, oldTreeChildSegment)) {
                // This segment is already part of the current route. Keep traversing.
                const requestTreeChild = diffRouteTreeAgainstCurrent(now, task, route, oldTreeChild, newTreeChild, spawnedEntries, fetchStrategy);
                requestTreeChildren[parallelRouteKey] = requestTreeChild;
            } else {
                // This segment is not part of the current route. We're entering a
                // part of the tree that we need to prefetch (unless everything is
                // already cached).
                switch(fetchStrategy){
                    case _types.FetchStrategy.LoadingBoundary:
                        {
                            // When PPR is disabled, we can't prefetch per segment. We must
                            // fallback to the old prefetch behavior and send a dynamic request.
                            // Only routes that include a loading boundary can be prefetched in
                            // this way.
                            //
                            // This is simlar to a "full" prefetch, but we're much more
                            // conservative about which segments to include in the request.
                            //
                            // The server will only render up to the first loading boundary
                            // inside new part of the tree. If there's no loading boundary
                            // anywhere in the tree, the server will never return any data, so
                            // we can skip the request.
                            const subtreeHasLoadingBoundary = (newTreeChild.prefetchHints & (_approutertypes.PrefetchHint.SegmentHasLoadingBoundary | _approutertypes.PrefetchHint.SubtreeHasLoadingBoundary)) !== 0;
                            const requestTreeChild = subtreeHasLoadingBoundary ? pingPPRDisabledRouteTreeUpToLoadingBoundary(now, task, route, newTreeChild, null, spawnedEntries) : (0, _cache.convertRouteTreeToFlightRouterState)(newTreeChild);
                            requestTreeChildren[parallelRouteKey] = requestTreeChild;
                            break;
                        }
                    case _types.FetchStrategy.PPRRuntime:
                        {
                            // This is a runtime prefetch. Fetch all cacheable data in the tree,
                            // not just the static PPR shell.
                            const requestTreeChild = pingRouteTreeAndIncludeDynamicData(now, task, route, newTreeChild, false, spawnedEntries, fetchStrategy);
                            requestTreeChildren[parallelRouteKey] = requestTreeChild;
                            break;
                        }
                    case _types.FetchStrategy.Full:
                        {
                            // This is a "full" prefetch. Fetch all the data in the tree, both
                            // static and dynamic. We issue roughly the same request that we
                            // would during a real navigation. The goal is that once the
                            // navigation occurs, the router should not have to fetch any
                            // additional data.
                            //
                            // Although the response will include dynamic data, opting into a
                            // Full prefetch — via <Link prefetch={true}> — implicitly
                            // instructs the cache to treat the response as "static", or non-
                            // dynamic, since the whole point is to cache it for
                            // future navigations.
                            //
                            // Construct a tree (currently a FlightRouterState) that represents
                            // which segments need to be prefetched and which ones are already
                            // cached. If the tree is empty, then we can exit. Otherwise, we'll
                            // send the request tree to the server and use the response to
                            // populate the segment cache.
                            const requestTreeChild = pingRouteTreeAndIncludeDynamicData(now, task, route, newTreeChild, false, spawnedEntries, fetchStrategy);
                            requestTreeChildren[parallelRouteKey] = requestTreeChild;
                            break;
                        }
                    default:
                        fetchStrategy;
                }
            }
        }
    }
    const requestTree = [
        newTree.segment,
        requestTreeChildren,
        null,
        null
    ];
    if (newTree.prefetchHints !== 0) {
        requestTree[4] = newTree.prefetchHints;
    }
    return requestTree;
}
function pingPPRDisabledRouteTreeUpToLoadingBoundary(now, task, route, tree, refetchMarkerContext, spawnedEntries) {
    // This function is similar to pingRouteTreeAndIncludeDynamicData, except the
    // server is only going to return a minimal loading state — it will stop
    // rendering at the first loading boundary. Whereas a Full prefetch is
    // intentionally aggressive and tries to pretfetch all the data that will be
    // needed for a navigation, a LoadingBoundary prefetch is much more
    // conservative. For example, it will omit from the request tree any segment
    // that is already cached, regardles of whether it's partial or full. By
    // contrast, a Full prefetch will refetch partial segments.
    // "inside-shared-layout" tells the server where to start looking for a
    // loading boundary.
    let refetchMarker = refetchMarkerContext === null ? 'inside-shared-layout' : null;
    const segment = (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, task.fetchStrategy, tree);
    switch(segment.status){
        case _cache.EntryStatus.Empty:
            {
                // This segment is not cached. Add a refetch marker so the server knows
                // to start rendering here.
                // TODO: Instead of a "refetch" marker, we could just omit this subtree's
                // FlightRouterState from the request tree. I think this would probably
                // already work even without any updates to the server. For consistency,
                // though, I'll send the full tree and we'll look into this later as part
                // of a larger redesign of the request protocol.
                // Add the pending cache entry to the result map.
                const pendingSegment = (0, _cache.upgradeToPendingSegment)(segment, // might not include it in the pending response. If another route is able
                // to issue a per-segment request, we'll do that in the background.
                _types.FetchStrategy.LoadingBoundary);
                spawnedEntries.set(tree.requestKey, pendingSegment);
                // The pass blocks on every request it spawns, not just requests it
                // finds already in flight.
                blockTaskOnPendingResponse(task, pendingSegment);
                if (refetchMarkerContext !== 'refetch') {
                    refetchMarker = refetchMarkerContext = 'refetch';
                } else {
                // There's already a parent with a refetch marker, so we don't need
                // to add another one.
                }
                break;
            }
        case _cache.EntryStatus.Fulfilled:
            {
                // The segment is already cached.
                const segmentHasLoadingBoundary = (tree.prefetchHints & _approutertypes.PrefetchHint.SegmentHasLoadingBoundary) !== 0;
                if (segmentHasLoadingBoundary) {
                    // This segment has a loading boundary, which means the server won't
                    // render its children. So there's nothing left to prefetch along this
                    // path. We can bail out.
                    return (0, _cache.convertRouteTreeToFlightRouterState)(tree);
                }
                break;
            }
        case _cache.EntryStatus.Pending:
            {
                // There's another prefetch currently in progress. Don't add the refetch
                // marker yet, so the server knows it can skip rendering this segment.
                // The pass still depends on the in-flight response, so wait for it
                // before the phase can complete.
                blockTaskOnPendingResponse(task, segment);
                break;
            }
        case _cache.EntryStatus.Rejected:
            {
                break;
            }
        default:
            segment;
    }
    const requestTreeChildren = {};
    if (tree.slots !== null) {
        for (const [parallelRouteKey, childTree] of tree.slots){
            requestTreeChildren[parallelRouteKey] = pingPPRDisabledRouteTreeUpToLoadingBoundary(now, task, route, childTree, refetchMarkerContext, spawnedEntries);
        }
    }
    const requestTree = [
        tree.segment,
        requestTreeChildren,
        null,
        refetchMarker
    ];
    if (tree.prefetchHints !== 0) {
        requestTree[4] = tree.prefetchHints;
    }
    return requestTree;
}
/**
 * Called during a pass when a segment's response hasn't been received yet —
 * whether the request was just spawned by this pass or was already in flight.
 * Marks the task as blocked: a phase only completes once a full pass observes
 * every segment response it cares about, because later decisions (like
 * whether a segment needs a follow-up runtime request) are made against the
 * contents of those responses, and a phase may need to restart its work based
 * on what they contain. The task is re-pinged (via pingBlockedTasks in
 * cache.ts) when the entry resolves, re-running the pass against the
 * received data. Only a pass that observes every response may advance the
 * phase or complete the task.
 *
 * Never call this for an entry that's already Rejected — nothing ever pings
 * a Rejected entry, so registering on one would strand the task. A rejected
 * segment is simply skipped: the pass keeps prefetching the rest of the tree
 * without it.
 */ function blockTaskOnPendingResponse(task, segment) {
    // This state is reset after each iteration of the task queue. We use it to
    // inform the scheduler that the task is blocked.
    task.hasPendingResponses = true;
    // Add the task to this segment's blocked tasks, so it can be rescheduled
    // once the segment finishes loading.
    if (segment.blockedTasks === null) {
        segment.blockedTasks = new Set([
            task
        ]);
    } else {
        segment.blockedTasks.add(task);
    }
}
function pingRouteTreeAndIncludeDynamicData(now, task, route, tree, isInsideRefetchingParent, spawnedEntries, fetchStrategy) {
    // The tree we're constructing is the same shape as the tree we're navigating
    // to. But even though this is a "new" tree, some of the individual segments
    // may be cached as a result of other route prefetches.
    //
    // So we need to find the first uncached segment along each path add an
    // explicit "refetch" marker so the server knows where to start rendering.
    // Once the server starts rendering along a path, it keeps rendering the
    // entire subtree.
    const segment = (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, // and we have to use the former here.
    // We can have a task with `FetchStrategy.PPR` where some of its segments are configured to
    // always use runtime prefetching (via `export const prefetch`), and those should check for
    // entries that include search params.
    fetchStrategy, tree);
    let spawnedSegment = null;
    switch(segment.status){
        case _cache.EntryStatus.Empty:
            {
                // This segment is not cached.
                if (fetchStrategy === _types.FetchStrategy.Full) {
                    // Check if there's a matching entry in the bfcache. If so, fulfill the
                    // segment using the bfcache entry instead of issuing a new request.
                    const fulfilled = (0, _cache.attemptToFulfillDynamicSegmentFromBFCache)(now, segment, tree);
                    if (fulfilled !== null) {
                        break;
                    }
                }
                // Include it in the request.
                spawnedSegment = (0, _cache.upgradeToPendingSegment)(segment, fetchStrategy);
                break;
            }
        case _cache.EntryStatus.Fulfilled:
            {
                // The segment is already cached.
                if (segment.isPartial && (0, _cache.canNewFetchStrategyProvideMoreContent)(segment.fetchStrategy, fetchStrategy)) {
                    // The cached segment contains dynamic holes, and was prefetched using a
                    // less specific strategy than the current one. This means we're in one
                    // of these cases:
                    //   - we have a static prefetch, and we're doing a runtime prefetch
                    //   - we have a static or runtime prefetch, and we're doing a Full
                    //     prefetch (or a navigation).
                    // In either case, we need to include it in the request to get a more
                    // specific (or full) version. However, if there's a non-stale bfcache
                    // entry from a previous navigation, prefer that over making a new
                    // request.
                    if (fetchStrategy === _types.FetchStrategy.Full) {
                        const fulfilled = (0, _cache.attemptToUpgradeSegmentFromBFCache)(now, task.segmentCacheMap, tree);
                        if (fulfilled !== null) {
                            break;
                        }
                    }
                    spawnedSegment = pingFullSegmentRevalidation(now, task, tree, fetchStrategy);
                }
                break;
            }
        case _cache.EntryStatus.Pending:
        case _cache.EntryStatus.Rejected:
            {
                // There's either another prefetch currently in progress, or the previous
                // attempt failed. If the new strategy can provide more content, fetch it again.
                if ((0, _cache.canNewFetchStrategyProvideMoreContent)(segment.fetchStrategy, fetchStrategy)) {
                    spawnedSegment = pingFullSegmentRevalidation(now, task, tree, fetchStrategy);
                }
                if (segment.status === _cache.EntryStatus.Pending) {
                    // A response for this segment is still in flight. The pass must
                    // observe it before the phase can complete.
                    blockTaskOnPendingResponse(task, segment);
                } else {
                // The segment failed to load, or the server intentionally omitted it
                // from a response (both are encoded as Rejected). Skip it and keep
                // prefetching the rest of the tree; the entry's staleAt governs when
                // it may be retried. Don't register the task on the rejected entry —
                // nothing ever pings a Rejected entry.
                //
                // TODO: The cache encodes real failures and intentional server
                // omissions identically (both Rejected); with per-segment skipping
                // this has no task-lifecycle consequence, but distinguishing them
                // could still be useful someday.
                }
                break;
            }
        default:
            segment;
    }
    if (spawnedSegment !== null) {
        // A pass must observe the response for every request it spawns before
        // its phase can complete — not just requests it finds already in flight.
        // Block on the entry we just spawned; the task is re-pinged when it's
        // fulfilled or rejected.
        blockTaskOnPendingResponse(task, spawnedSegment);
    }
    const requestTreeChildren = {};
    if (tree.slots !== null) {
        for (const [parallelRouteKey, childTree] of tree.slots){
            requestTreeChildren[parallelRouteKey] = pingRouteTreeAndIncludeDynamicData(now, task, route, childTree, isInsideRefetchingParent || spawnedSegment !== null, spawnedEntries, fetchStrategy);
        }
    }
    if (spawnedSegment !== null) {
        // Add the pending entry to the result map.
        spawnedEntries.set(tree.requestKey, spawnedSegment);
    }
    // Don't bother to add a refetch marker if one is already present in a parent.
    const refetchMarker = !isInsideRefetchingParent && spawnedSegment !== null ? 'refetch' : null;
    const requestTree = [
        tree.segment,
        requestTreeChildren,
        null,
        refetchMarker
    ];
    if (tree.prefetchHints !== 0) {
        requestTree[4] = tree.prefetchHints;
    }
    return requestTree;
}
function pingRuntimePrefetches(now, task, route, tree, spawnedRuntimePrefetches, spawnedEntries, fetchStrategy) {
    // Construct a request tree (FlightRouterState) for a runtime prefetch. If
    // a segment is part of the runtime prefetch, the tree is constructed by
    // diffing against what's already in the prefetch cache. Otherwise, we send
    // a regular FlightRouterState with no special markers.
    //
    // See pingRouteTreeAndIncludeDynamicData for details.
    if (spawnedRuntimePrefetches.has(tree.requestKey)) {
        // This segment needs a runtime prefetch.
        return pingRouteTreeAndIncludeDynamicData(now, task, route, tree, false, spawnedEntries, fetchStrategy);
    }
    let requestTreeChildren = {};
    const slots = tree.slots;
    if (slots !== null) {
        for (const [parallelRouteKey, childTree] of slots){
            requestTreeChildren[parallelRouteKey] = pingRuntimePrefetches(now, task, route, childTree, spawnedRuntimePrefetches, spawnedEntries, fetchStrategy);
        }
    }
    // This segment is not part of the runtime prefetch. Clone the base tree.
    const requestTree = [
        tree.segment,
        requestTreeChildren,
        null,
        null
    ];
    if (tree.prefetchHints !== 0) {
        requestTree[4] = tree.prefetchHints;
    }
    return requestTree;
}
/**
 * Walk a SegmentBundle, apply status-based logic to each entry, and if any
 * entries need data, spawn a single fetch request for the whole bundle.
 *
 * Returns true if a fulfilled entry in the bundle reported that a runtime
 * request would return more content than the entry contains
 * (needsRuntimeRequest, derived at write time from the response that
 * produced the entry). The callers surface this signal to the per-segment
 * decision point in pingNewPartOfCacheComponentsTree (and its analog for
 * the head in pingStaticHead), which uses it during a static attempt to
 * decide whether to fall back to a runtime prefetch.
 */ function pingSegmentBundle(now, task, route, routeKey, tree, segments, fetchStrategy, // (finishStaticBundleOnRuntimeBailout). The finish exists only to fetch
// data the batched runtime request won't cover — Empty entries in the
// chain — so it must not spawn revalidations over entries that are
// already settled or in flight: the chain's terminal segments are inside
// the deopted subtree, and re-fetching their static bundle would at best
// duplicate the runtime request and at worst replace a runtime-complete
// entry (e.g. a runtime App Shell) with a less complete static fallback
// response.
spawnRevalidations) {
    let segmentCount = 0;
    let needsFetch = false;
    let needsRuntimeRequest = false;
    let node = segments;
    while(node !== null){
        segmentCount++;
        const nodeEntry = node.entry;
        const nodeTree = node.tree;
        if (nodeEntry === null || nodeTree === null) {
            node = node.parent;
            continue;
        }
        switch(nodeEntry.status){
            case _cache.EntryStatus.Empty:
                (0, _cache.upgradeToPendingSegment)(nodeEntry, fetchStrategy);
                needsFetch = true;
                // The pass blocks on every request it spawns, not just requests it
                // finds already in flight.
                blockTaskOnPendingResponse(task, nodeEntry);
                break;
            case _cache.EntryStatus.Pending:
                if (spawnRevalidations && // During a static shell attempt, never spawn revalidations — just
                // wait for the in-flight response (blocked below); its sufficiency
                // is checked on the re-run pass.
                fetchStrategy === _types.FetchStrategy.PPR && (0, _cache.canNewFetchStrategyProvideMoreContent)(nodeEntry.fetchStrategy, fetchStrategy)) {
                    const revalidatingEntry = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, nodeTree);
                    if (revalidatingEntry.status === _cache.EntryStatus.Empty) {
                        (0, _cache.upgradeToPendingSegment)(revalidatingEntry, fetchStrategy);
                        node.entry = revalidatingEntry;
                        needsFetch = true;
                        // Block on the revalidation request we just spawned, in
                        // addition to the original in-flight entry (blocked below).
                        blockTaskOnPendingResponse(task, revalidatingEntry);
                    } else {
                        node.entry = null;
                    }
                } else {
                    node.entry = null;
                }
                blockTaskOnPendingResponse(task, nodeEntry);
                break;
            case _cache.EntryStatus.Rejected:
                if (spawnRevalidations && // During a static shell attempt, a rejected entry is skipped
                // outright: no retry revalidation, and — deliberately — no runtime
                // fallback either (per-segment rejection semantics; the entry's
                // staleAt governs when it may be retried). Note that the cache
                // path encodes "no shell exists" (a static response whose shell
                // byte offset is 0, i.e. the page wasn't produced by staged
                // rendering) as a rejection too, so such segments get no shell
                // prefetch at all — an edge that shouldn't occur for hint-set
                // Cache Components routes.
                fetchStrategy === _types.FetchStrategy.PPR && (0, _cache.canNewFetchStrategyProvideMoreContent)(nodeEntry.fetchStrategy, fetchStrategy)) {
                    const revalidatingEntry = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, nodeTree);
                    if (revalidatingEntry.status === _cache.EntryStatus.Empty) {
                        (0, _cache.upgradeToPendingSegment)(revalidatingEntry, fetchStrategy);
                        node.entry = revalidatingEntry;
                        needsFetch = true;
                        // Block on the retry revalidation we just spawned, like any
                        // other pending response. If the retry succeeds, its upsert
                        // evicts the rejected entry (see evictShadowingSegmentEntries
                        // in cache.ts) and the re-run pass reads the healed data. If it
                        // rejects too, the re-run observes a settled revalidation and
                        // moves on.
                        blockTaskOnPendingResponse(task, revalidatingEntry);
                    } else {
                        node.entry = null;
                    }
                } else {
                    node.entry = null;
                }
                break;
            case _cache.EntryStatus.Fulfilled:
                {
                    const runtimeWouldProvideMore = wouldRuntimeRequestProvideMore(nodeEntry, fetchStrategy);
                    if (runtimeWouldProvideMore) {
                        // A runtime request would return more content for this segment
                        // than the entry contains. Surface it via the return value, so the
                        // caller can deopt this subtree to a runtime prefetch.
                        needsRuntimeRequest = true;
                    }
                    // For entries below this phase's tier, upgrade during the phase
                    // itself — no background deferral, since the whole point of the
                    // Speculative phase is to bring the cache up to the
                    // per-link-concrete tier. `isPartial` ensures a complete entry isn't
                    // re-fetched.
                    //
                    // Exception: when a runtime request would return more AND this walk
                    // permits one, skip the static path entirely. The runtime request
                    // covers this segment and supersedes anything a static fetch could
                    // add, so a static upgrade would at best duplicate it — delivering
                    // the same content twice — and at worst replace runtime content with
                    // static content.
                    //
                    // When no runtime request is permitted, the signal is irrelevant:
                    // nothing can act on it, so it must not suppress the static upgrade.
                    // That's what keeps a link prefetching static content on top of a
                    // cached shell.
                    const willBeSupersededByRuntimeRequest = runtimeWouldProvideMore && walkRequiresRuntimeCompleteness(fetchStrategy, route);
                    // Check if we should attempt to upgrade a fallback ISR response to
                    // a concrete version.
                    const isUpgradeableISRFallbackRetry = nodeEntry.isUpgradeableISRFallback && // If the status is empty, then we haven't yet attempted to upgrade
                    // the fallback.
                    //
                    // If the status is fulfilled, then the fallback was
                    // successfully upgraded to a concrete version.
                    //
                    // Do not attempt to upgrade if the status is Pending or Rejected.
                    (task.fallbackRetryStatus === _cache.EntryStatus.Empty || task.fallbackRetryStatus === _cache.EntryStatus.Fulfilled);
                    if (spawnRevalidations && !willBeSupersededByRuntimeRequest && (nodeEntry.isPartial && (0, _cache.canNewFetchStrategyProvideMoreContent)(nodeEntry.fetchStrategy, fetchStrategy) || isUpgradeableISRFallbackRetry)) {
                        const revalidatingEntry = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, nodeTree);
                        if (revalidatingEntry.status === _cache.EntryStatus.Empty) {
                            (0, _cache.upgradeToPendingSegment)(revalidatingEntry, fetchStrategy);
                            node.entry = revalidatingEntry;
                            needsFetch = true;
                            // The pass blocks on every request it spawns, including
                            // revalidations of an already-fulfilled entry.
                            blockTaskOnPendingResponse(task, revalidatingEntry);
                        } else {
                            // A non-empty revalidating entry means a request is already in
                            // flight (or recently settled), so we dedupe and don't issue a
                            // competing one — including for ISR-fallback upgrades, which then
                            // share the same revalidation across tasks.
                            node.entry = null;
                            if (revalidatingEntry.status === _cache.EntryStatus.Pending) {
                                // The deduped-against revalidation is still in flight, and this
                                // pass depends on its response. Wait for it before the phase
                                // can complete. (A settled revalidation we chose not to use
                                // needs no waiting and is not a prefetch failure — the base
                                // entry here is already Fulfilled.)
                                blockTaskOnPendingResponse(task, revalidatingEntry);
                            }
                        }
                    } else {
                        node.entry = null;
                    }
                    break;
                }
            default:
                nodeEntry;
        }
        node = node.parent;
    }
    if (needsFetch) {
        spawnPrefetchSubtask((0, _cache.fetchSegmentsOnCacheMiss)(task, route, routeKey, tree, segments, segmentCount, fetchStrategy));
    }
    return needsRuntimeRequest;
}
/**
 * During the tree walk, decide whether this segment should be added to the
 * in-progress bundle (if it has InlinedIntoChild) or finalize the bundle
 * and ping it, triggering a fetch if any of its entries need data (if it
 * doesn't). Returns the updated bundle to pass to children (null if the
 * bundle was finalized here), along with the needs-runtime signal from the
 * bundle ping, if one happened (always false otherwise).
 */ function accumulateSegmentBundle(now, task, route, tree, parentBundle, // PPR for the normal static bundling walk; StaticShell during the Shell
// phase's static App Shell attempt, whose entries are keyed at the shell
// vary paths.
fetchStrategy, // pingSegmentBundle.
spawnRevalidations) {
    // Prefetching is disabled for this segment (prefetch: 'force-disabled'):
    // the server emits null for its slot, and it participates in the bundle
    // chain with null tree/entry so the null-slot positions line up.
    // (Partial Prefetching segments are NOT in this mask — the server emits
    // static data for them unconditionally.) Intentionally not gated by the
    // prefetch inlining flag: we never statically prefetch unprefetchable
    // segments.
    if (tree.prefetchHints & _approutertypes.StaticPrefetchDisabled) {
        return {
            bundle: {
                tree: null,
                entry: null,
                parent: parentBundle
            },
            needsRuntimeRequest: false
        };
    }
    const segment = (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, fetchStrategy, tree);
    if (("TURBOPACK compile-time value", true) && tree.prefetchHints & _approutertypes.PrefetchHint.InlinedIntoChild) {
        if (segment.status === _cache.EntryStatus.Pending) {
            // The chain this entry joins may be dropped before it's ever pinged
            // (see the drop sites in pingNewPartOfCacheComponentsTree), and only
            // the ping blocks on Pending entries. Register on the in-flight
            // response at read time instead, so the pass observes it before the
            // phase can complete even if the chain is dropped. When the chain does
            // get pinged, the ping's own registration dedupes against this one.
            blockTaskOnPendingResponse(task, segment);
        }
        return {
            bundle: {
                tree,
                entry: segment,
                parent: parentBundle
            },
            // No bundle ping happens here, but the node's own entry may already be
            // fulfilled and insufficient. Report that signal directly: the chain
            // ping only reaches the terminal descendant, and if that descendant is
            // itself a decision point it consumes the signal for its own subtree,
            // leaving this ancestor's insufficiency invisible to the decision
            // point above it.
            needsRuntimeRequest: segment.status === _cache.EntryStatus.Fulfilled && wouldRuntimeRequestProvideMore(segment, fetchStrategy)
        };
    }
    // Not bundled. Build a single-node bundle and ping it. If this page
    // accepts the head (HeadInlinedIntoSelf), prepend the head's cache entry
    // to the bundle.
    let effectiveParent = parentBundle;
    if (("TURBOPACK compile-time value", true) && tree.prefetchHints & _approutertypes.PrefetchHint.HeadInlinedIntoSelf) {
        effectiveParent = {
            tree: route.metadata,
            entry: (0, _cache.readOrCreateSegmentCacheEntry)(now, task.segmentCacheMap, fetchStrategy, route.metadata),
            parent: parentBundle
        };
    }
    const segments = {
        tree,
        entry: segment,
        parent: effectiveParent
    };
    const needsRuntimeRequest = pingSegmentBundle(now, task, route, task.key, tree, segments, fetchStrategy, spawnRevalidations);
    return {
        bundle: null,
        needsRuntimeRequest
    };
}
function finishStaticBundleOnRuntimeBailout(now, task, route, tree, parentBundle, // Any needs-runtime signal from finishing the bundle is dropped: the
// caller is already deopting this subtree to a runtime prefetch.
fetchStrategy) {
    const bundle = accumulateSegmentBundle(now, task, route, tree, parentBundle, fetchStrategy, // Empty entries the chain would otherwise strand — never spawn
    // revalidations over settled or in-flight ones. See pingSegmentBundle.
    false).bundle;
    if (bundle === null) {
        return;
    }
    if (tree.slots !== null) {
        for (const childTree of tree.slots.values()){
            if (childTree.prefetchHints & _approutertypes.PrefetchHint.ParentInlinedIntoSelf) {
                finishStaticBundleOnRuntimeBailout(now, task, route, childTree, bundle, fetchStrategy);
                return;
            }
        }
    }
}
function pingFullSegmentRevalidation(now, task, tree, fetchStrategy) {
    const revalidatingSegment = (0, _cache.readOrCreateRevalidatingSegmentEntry)(now, task.segmentCacheMap, fetchStrategy, tree);
    if (revalidatingSegment.status === _cache.EntryStatus.Empty) {
        // During a Full/PPRRuntime prefetch, a single dynamic request is made for all the
        // segments that we need. So we don't initiate a request here directly. By
        // returning a pending entry from this function, it signals to the caller
        // that this segment should be included in the request that's sent to
        // the server.
        const pendingSegment = (0, _cache.upgradeToPendingSegment)(revalidatingSegment, fetchStrategy);
        // The upsert is handled by fulfillEntrySpawnedByRuntimePrefetch
        // when the dynamic prefetch response is written into the cache.
        return pendingSegment;
    } else {
        // There's already a revalidation in progress.
        const nonEmptyRevalidatingSegment = revalidatingSegment;
        if ((0, _cache.canNewFetchStrategyProvideMoreContent)(nonEmptyRevalidatingSegment.fetchStrategy, fetchStrategy)) {
            // The existing revalidation was fetched using a less specific strategy.
            // Reset it and start a new revalidation.
            const emptySegment = (0, _cache.overwriteRevalidatingSegmentCacheEntry)(now, task.segmentCacheMap, fetchStrategy, tree);
            const pendingSegment = (0, _cache.upgradeToPendingSegment)(emptySegment, fetchStrategy);
            // The upsert is handled by fulfillEntrySpawnedByRuntimePrefetch
            // when the dynamic prefetch response is written into the cache.
            return pendingSegment;
        }
        switch(nonEmptyRevalidatingSegment.status){
            case _cache.EntryStatus.Pending:
                // There's already an in-progress prefetch that includes this segment.
                // The pass needs the contents of that response, too. Wait for it
                // before the phase can complete.
                blockTaskOnPendingResponse(task, nonEmptyRevalidatingSegment);
                return null;
            case _cache.EntryStatus.Fulfilled:
            case _cache.EntryStatus.Rejected:
                // A previous revalidation attempt finished, but we chose not to replace
                // the existing entry in the cache. Don't try again until or unless the
                // revalidation entry expires.
                return null;
            default:
                nonEmptyRevalidatingSegment;
                return null;
        }
    }
}
function doesCurrentSegmentMatchCachedSegment(route, currentSegment, cachedSegment) {
    if (cachedSegment === _segment.PAGE_SEGMENT_KEY) {
        // In the FlightRouterState stored by the router, the page segment has the
        // rendered search params appended to the name of the segment. In the
        // prefetch cache, however, this is stored separately. So, when comparing
        // the router's current FlightRouterState to the cached FlightRouterState,
        // we need to make sure we compare both parts of the segment.
        // TODO: This is not modeled clearly. We use the same type,
        // FlightRouterState, for both the CacheNode tree _and_ the prefetch cache
        // _and_ the server response format, when conceptually those are three
        // different things and treated in different ways. We should encode more of
        // this information into the type design so mistakes are less likely.
        return currentSegment === (0, _segment.addSearchParamsIfPageSegment)(_segment.PAGE_SEGMENT_KEY, (0, _routeparams.urlSearchParamsToParsedUrlQuery)(new URLSearchParams(route.renderedSearch)));
    }
    // Non-page segments are compared using the same function as the server
    return (0, _matchsegments.matchSegment)(cachedSegment, currentSegment);
}
function subtreeHasSpeculativePrefetch(fetchStrategy, prefetchHints) {
    return fetchStrategy === _types.FetchStrategy.Full || // Check if something in this subtree is configured to be eagerly
    // prefetched at the route level. Segments that don't opt into Partial
    // Prefetching are marked eager, so a route without any Partial Prefetching
    // still speculatively prefetches everything.
    (prefetchHints & _approutertypes.PrefetchHint.SubtreeHasEagerPrefetch) !== 0;
}
// -----------------------------------------------------------------------------
// The remainder of the module is a MinHeap implementation. Try not to put any
// logic below here unless it's related to the heap algorithm. We can extract
// this to a separate module if/when we need multiple kinds of heaps.
// -----------------------------------------------------------------------------
function compareQueuePriority(a, b) {
    // Since the queue is a MinHeap, this should return a positive number if b is
    // higher priority than a, and a negative number if a is higher priority
    // than b.
    // `priority` is an integer, where higher numbers are higher priority.
    const priorityDiff = b.priority - a.priority;
    if (priorityDiff !== 0) {
        return priorityDiff;
    }
    // If the priority is the same, check which phase the prefetch is in — is it
    // prefetching the route tree, or the segments? Route trees are prioritized.
    const phaseDiff = b.phase - a.phase;
    if (phaseDiff !== 0) {
        return phaseDiff;
    }
    // Finally, check the insertion order. `sortId` is an incrementing counter
    // assigned to prefetches. We want to process the newest prefetches first.
    return b.sortId - a.sortId;
}
function heapPush(heap, node) {
    const index = heap.length;
    heap.push(node);
    node._heapIndex = index;
    heapSiftUp(heap, node, index);
}
function heapPeek(heap) {
    return heap.length === 0 ? null : heap[0];
}
function heapPop(heap) {
    if (heap.length === 0) {
        return null;
    }
    const first = heap[0];
    first._heapIndex = -1;
    const last = heap.pop();
    if (last !== first) {
        heap[0] = last;
        last._heapIndex = 0;
        heapSiftDown(heap, last, 0);
    }
    return first;
}
function heapDelete(heap, node) {
    const index = node._heapIndex;
    if (index !== -1) {
        node._heapIndex = -1;
        if (heap.length !== 0) {
            const last = heap.pop();
            if (last !== node) {
                heap[index] = last;
                last._heapIndex = index;
                heapSiftDown(heap, last, index);
            }
        }
    }
}
function heapResift(heap, node) {
    const index = node._heapIndex;
    if (index !== -1) {
        if (index === 0) {
            heapSiftDown(heap, node, 0);
        } else {
            const parentIndex = index - 1 >>> 1;
            const parent = heap[parentIndex];
            if (compareQueuePriority(parent, node) > 0) {
                // The parent is larger. Sift up.
                heapSiftUp(heap, node, index);
            } else {
                // The parent is smaller (or equal). Sift down.
                heapSiftDown(heap, node, index);
            }
        }
    }
}
function heapSiftUp(heap, node, i) {
    let index = i;
    while(index > 0){
        const parentIndex = index - 1 >>> 1;
        const parent = heap[parentIndex];
        if (compareQueuePriority(parent, node) > 0) {
            // The parent is larger. Swap positions.
            heap[parentIndex] = node;
            node._heapIndex = parentIndex;
            heap[index] = parent;
            parent._heapIndex = index;
            index = parentIndex;
        } else {
            // The parent is smaller. Exit.
            return;
        }
    }
}
function heapSiftDown(heap, node, i) {
    let index = i;
    const length = heap.length;
    const halfLength = length >>> 1;
    while(index < halfLength){
        const leftIndex = (index + 1) * 2 - 1;
        const left = heap[leftIndex];
        const rightIndex = leftIndex + 1;
        const right = heap[rightIndex];
        // If the left or right node is smaller, swap with the smaller of those.
        if (compareQueuePriority(left, node) < 0) {
            if (rightIndex < length && compareQueuePriority(right, left) < 0) {
                heap[index] = right;
                right._heapIndex = index;
                heap[rightIndex] = node;
                node._heapIndex = rightIndex;
                index = rightIndex;
            } else {
                heap[index] = left;
                left._heapIndex = index;
                heap[leftIndex] = node;
                node._heapIndex = leftIndex;
                index = leftIndex;
            }
        } else if (rightIndex < length && compareQueuePriority(right, node) < 0) {
            heap[index] = right;
            right._heapIndex = index;
            heap[rightIndex] = node;
            node._heapIndex = rightIndex;
            index = rightIndex;
        } else {
            // Neither child is smaller. Exit.
            return;
        }
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Shared types and constants for the Segment Cache.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    FetchStrategy: null,
    NavigationResultTag: null,
    PrefetchPriority: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    FetchStrategy: function() {
        return FetchStrategy;
    },
    NavigationResultTag: function() {
        return NavigationResultTag;
    },
    PrefetchPriority: function() {
        return PrefetchPriority;
    }
});
var NavigationResultTag = /*#__PURE__*/ function(NavigationResultTag) {
    NavigationResultTag[NavigationResultTag["MPA"] = 0] = "MPA";
    NavigationResultTag[NavigationResultTag["Success"] = 1] = "Success";
    NavigationResultTag[NavigationResultTag["NoOp"] = 2] = "NoOp";
    NavigationResultTag[NavigationResultTag["Async"] = 3] = "Async";
    return NavigationResultTag;
}({});
var PrefetchPriority = /*#__PURE__*/ function(PrefetchPriority) {
    /**
   * Assigned to the most recently hovered/touched link. Special network
   * bandwidth is reserved for this task only. There's only ever one Intent-
   * priority task at a time; when a new Intent task is scheduled, the previous
   * one is bumped down to Default.
   */ PrefetchPriority[PrefetchPriority["Intent"] = 2] = "Intent";
    /**
   * The default priority for prefetch tasks.
   */ PrefetchPriority[PrefetchPriority["Default"] = 1] = "Default";
    /**
   * Assigned to tasks when they spawn non-blocking background work, like
   * revalidating a partially cached entry to see if more data is available.
   */ PrefetchPriority[PrefetchPriority["Background"] = 0] = "Background";
    return PrefetchPriority;
}({});
var FetchStrategy = /*#__PURE__*/ function(FetchStrategy) {
    // Deliberately ordered so we can easily compare two segments
    // and determine if one segment is "more specific" than another
    // (i.e. if it's likely that it contains more data). See
    // canNewFetchStrategyProvideMoreContent in cache.ts for what each tier can
    // contain relative to the others.
    //
    // These numeric values are client-internal and never cross the wire — the
    // `next-router-prefetch` request header values are mapped explicitly in
    // fetchSegmentPrefetchesUsingDynamicRequest (cache.ts) — so the members can
    // be renumbered freely as long as the relative order is preserved.
    FetchStrategy[FetchStrategy["LoadingBoundary"] = 0] = "LoadingBoundary";
    // The App Shell variant extracted from a static per-segment prefetch
    // response: every segment's param-dependent content is reduced to pending
    // references that render as the param fallback. Less complete than
    // RuntimeShell — a static response can't include content that depends on
    // session data (cookies, headers) — and less complete than PPR at concrete
    // paths, which includes prerendered param-dependent content.
    FetchStrategy[FetchStrategy["StaticShell"] = 1] = "StaticShell";
    FetchStrategy[FetchStrategy["RuntimeShell"] = 2] = "RuntimeShell";
    FetchStrategy[FetchStrategy["PPR"] = 3] = "PPR";
    FetchStrategy[FetchStrategy["PPRRuntime"] = 4] = "PPRRuntime";
    FetchStrategy[FetchStrategy["Full"] = 5] = "Full";
    return FetchStrategy;
}({});
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/vary-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    appendLayoutVaryPath: null,
    clonePageVaryPathWithNewSearchParams: null,
    finalizeLayoutVaryPath: null,
    finalizeMetadataVaryPath: null,
    finalizePageVaryPath: null,
    getFulfilledRouteVaryPath: null,
    getFulfilledSegmentVaryPath: null,
    getPartialLayoutVaryPath: null,
    getPartialPageVaryPath: null,
    getRenderedSearchFromVaryPath: null,
    getRouteVaryPath: null,
    getSegmentVaryPathForRequest: null,
    getShellSegmentVaryPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    appendLayoutVaryPath: function() {
        return appendLayoutVaryPath;
    },
    clonePageVaryPathWithNewSearchParams: function() {
        return clonePageVaryPathWithNewSearchParams;
    },
    finalizeLayoutVaryPath: function() {
        return finalizeLayoutVaryPath;
    },
    finalizeMetadataVaryPath: function() {
        return finalizeMetadataVaryPath;
    },
    finalizePageVaryPath: function() {
        return finalizePageVaryPath;
    },
    getFulfilledRouteVaryPath: function() {
        return getFulfilledRouteVaryPath;
    },
    getFulfilledSegmentVaryPath: function() {
        return getFulfilledSegmentVaryPath;
    },
    getPartialLayoutVaryPath: function() {
        return getPartialLayoutVaryPath;
    },
    getPartialPageVaryPath: function() {
        return getPartialPageVaryPath;
    },
    getRenderedSearchFromVaryPath: function() {
        return getRenderedSearchFromVaryPath;
    },
    getRouteVaryPath: function() {
        return getRouteVaryPath;
    },
    getSegmentVaryPathForRequest: function() {
        return getSegmentVaryPathForRequest;
    },
    getShellSegmentVaryPath: function() {
        return getShellSegmentVaryPath;
    }
});
const _types = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/types.js [app-ssr] (ecmascript)");
const _cachemap = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/segment-cache/cache-map.js [app-ssr] (ecmascript)");
const _segmentvalueencoding = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment-cache/segment-value-encoding.js [app-ssr] (ecmascript)");
function getRouteVaryPath(pathname, search, nextUrl) {
    // requestKey -> searchParams -> nextUrl
    const varyPath = {
        id: null,
        value: pathname,
        isRootParam: false,
        parent: {
            id: '?',
            value: search,
            isRootParam: false,
            parent: {
                id: null,
                value: nextUrl,
                isRootParam: false,
                parent: null
            }
        }
    };
    return varyPath;
}
function getFulfilledRouteVaryPath(pathname, search, nextUrl, couldBeIntercepted) {
    // This is called when a route's data is fulfilled. The cache entry will be
    // re-keyed based on which inputs the response varies by.
    // requestKey -> searchParams -> nextUrl
    const varyPath = {
        id: null,
        value: pathname,
        isRootParam: false,
        parent: {
            id: '?',
            value: search,
            isRootParam: false,
            parent: {
                id: null,
                value: couldBeIntercepted ? nextUrl : _cachemap.Fallback,
                isRootParam: false,
                parent: null
            }
        }
    };
    return varyPath;
}
function appendLayoutVaryPath(parentPath, cacheKey, paramName, isRootParam) {
    const varyPathPart = {
        id: paramName,
        value: cacheKey,
        isRootParam,
        parent: parentPath
    };
    return varyPathPart;
}
function finalizeLayoutVaryPath(requestKey, varyPath) {
    const layoutVaryPath = {
        id: null,
        value: requestKey,
        isRootParam: false,
        parent: varyPath
    };
    return layoutVaryPath;
}
function getPartialLayoutVaryPath(finalizedVaryPath) {
    // This is the inverse of finalizeLayoutVaryPath.
    return finalizedVaryPath.parent;
}
function finalizePageVaryPath(requestKey, renderedSearch, varyPath) {
    // Unlike layouts, a page segment's vary path also includes the search string.
    // requestKey -> searchParams -> pathParams
    const pageVaryPath = {
        id: null,
        value: requestKey,
        isRootParam: false,
        parent: {
            id: '?',
            value: renderedSearch,
            isRootParam: false,
            parent: varyPath
        }
    };
    return pageVaryPath;
}
function getPartialPageVaryPath(finalizedVaryPath) {
    // This is the inverse of finalizePageVaryPath.
    return finalizedVaryPath.parent.parent;
}
function finalizeMetadataVaryPath(pageRequestKey, renderedSearch, varyPath) {
    // The metadata "segment" is not a real segment because it doesn't exist in
    // the normal structure of the route tree, but in terms of caching, it
    // behaves like a page segment because it varies by all the same params as
    // a page.
    //
    // To keep the protocol for querying the server simple, the request key for
    // the metadata does not include any path information. It's unnecessary from
    // the server's perspective, because unlike page segments, there's only one
    // metadata response per URL, i.e. there's no need to distinguish multiple
    // parallel pages.
    //
    // However, this means the metadata request key is insufficient for
    // caching the the metadata in the client cache, because on the client we
    // use the request key to distinguish the metadata entry from all other
    // page's metadata entries.
    //
    // So instead we create a simulated request key based on the page segment.
    // Conceptually this is equivalent to the request key the server would have
    // assigned the metadata segment if it treated it as part of the actual
    // route structure.
    // If there are multiple parallel pages, we use whichever is the first one.
    // This is fine because the only difference between request keys for
    // different parallel pages are things like route groups and parallel
    // route slots. As long as it's always the same one, it doesn't matter.
    const pageVaryPath = {
        id: null,
        // Append the actual metadata request key to the page request key. Note
        // that we're not using a separate vary path part; it's unnecessary because
        // these are not conceptually separate inputs.
        value: pageRequestKey + _segmentvalueencoding.HEAD_REQUEST_KEY,
        isRootParam: false,
        parent: {
            id: '?',
            value: renderedSearch,
            isRootParam: false,
            parent: varyPath
        }
    };
    return pageVaryPath;
}
function getSegmentVaryPathForRequest(fetchStrategy, tree) {
    // This is used for storing pending requests in the cache. We want to choose
    // the most generic vary path based on the strategy used to fetch it, i.e.
    // static/PPR versus runtime prefetching, so that it can be reused as much
    // as possible.
    //
    // We may be able to re-key the response to something even more generic once
    // we receive it — for example, if the server tells us that the response
    // doesn't vary on a particular param — but even before we send the request,
    // we know some params are reusable based on the fetch strategy alone. For
    // example, a static prefetch will never vary on search params.
    //
    // The original vary path with all the params filled in is stored on the
    // route tree object. We will clone this one to create a new vary path
    // where certain params are replaced with Fallback.
    //
    // This result of this function is not stored anywhere. It's only used to
    // access the cache a single time.
    //
    // TODO: Rather than create a new list object just to access the cache, the
    // plan is to add the concept of a "vary mask". This will represent all the
    // params that can be treated as Fallback. (Or perhaps the inverse.)
    const originalVaryPath = tree.varyPath;
    if (fetchStrategy === _types.FetchStrategy.RuntimeShell || fetchStrategy === _types.FetchStrategy.StaticShell) {
        // Both shell strategies produce the App Shell variant of a segment —
        // RuntimeShell via a runtime render with non-root params omitted,
        // StaticShell by truncating a static per-segment response at the shell
        // byte boundary. Either way, the resulting entry is reusable across all
        // concrete values of the non-root params, so we key it at the precomputed
        // shell vary path (every non-root param substituted with Fallback; root
        // params keep their concrete value).
        return tree.shellVaryPath;
    }
    // Only page segments (and the special "metadata" segment, which is treated
    // like a page segment for the purposes of caching) may contain search
    // params. There's no reason to include them in the vary path otherwise.
    if (tree.isPage) {
        // Only a runtime prefetch will include search params in the vary path.
        // Static prefetches never include search params, so they can be reused
        // across all possible search param values.
        const doesVaryOnSearchParams = fetchStrategy === _types.FetchStrategy.Full || fetchStrategy === _types.FetchStrategy.PPRRuntime;
        if (!doesVaryOnSearchParams) {
            // The response from the the server will not vary on search params. Clone
            // the end of the original vary path to replace the search params
            // with Fallback.
            //
            // requestKey -> searchParams -> pathParams
            //               ^ This part gets replaced with Fallback
            const searchParamsVaryPath = originalVaryPath.parent;
            const pathParamsVaryPath = searchParamsVaryPath.parent;
            const patchedVaryPath = {
                id: null,
                value: originalVaryPath.value,
                isRootParam: false,
                parent: {
                    id: '?',
                    value: _cachemap.Fallback,
                    isRootParam: false,
                    parent: pathParamsVaryPath
                }
            };
            return patchedVaryPath;
        }
    }
    // The request does vary on search params. We don't need to modify anything.
    return originalVaryPath;
}
function clonePageVaryPathWithNewSearchParams(originalVaryPath, newSearch) {
    // requestKey -> searchParams -> pathParams
    //               ^ This part gets replaced with newSearch
    const searchParamsVaryPath = originalVaryPath.parent;
    const clonedVaryPath = {
        id: null,
        value: originalVaryPath.value,
        isRootParam: false,
        parent: {
            id: '?',
            value: newSearch,
            isRootParam: false,
            parent: searchParamsVaryPath.parent
        }
    };
    return clonedVaryPath;
}
function getRenderedSearchFromVaryPath(varyPath) {
    const searchParams = varyPath.parent.value;
    return typeof searchParams === 'string' ? searchParams : null;
}
function getFulfilledSegmentVaryPath(original, varyParams) {
    // Re-keys a segment's vary path based on which params the segment actually
    // depends on. Params that are NOT in the varyParams set are replaced with
    // Fallback, allowing the cache entry to be reused across different values of
    // those params.
    // This is called when a segment is fulfilled with data from the server. The
    // varyParams set comes from the server and indicates which params were
    // accessed during rendering.
    const clone = {
        id: original.id,
        // If the id is null, this node is not a param (e.g., it's a request key).
        // If the id is in the varyParams set, keep the original value.
        // Otherwise, replace with Fallback to make it reusable.
        value: original.id === null || varyParams.has(original.id) ? original.value : _cachemap.Fallback,
        isRootParam: original.isRootParam,
        parent: original.parent === null ? null : getFulfilledSegmentVaryPath(original.parent, varyParams)
    };
    return clone;
}
function getShellSegmentVaryPath(original) {
    // Re-keys a segment's vary path to identify the "App Shell" entry for this
    // segment position — a reusable loading state that can be served for any
    // concrete navigation to this segment. The shell is rendered with params
    // omitted, with one exception: root params (path params at or above the root
    // layout) may be accessed during the shell render, so the shell varies on
    // them. Accordingly, we keep the concrete value of structural nodes (request
    // keys, etc.) and root param nodes, and replace every other param node (non-
    // root path params and search params) with Fallback.
    const clone = {
        id: original.id,
        value: original.id === null || original.isRootParam === true ? original.value : _cachemap.Fallback,
        isRootParam: original.isRootParam,
        parent: original.parent === null ? null : getShellSegmentVaryPath(original.parent)
    };
    return clone;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/detect-domain-locale.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "detectDomainLocale", {
    enumerable: true,
    get: function() {
        return detectDomainLocale;
    }
});
const detectDomainLocale = (...args)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/dev/debug-channel.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createDebugChannel: null,
    getOrCreateDebugChannelReadableWriterPair: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createDebugChannel: function() {
        return createDebugChannel;
    },
    getOrCreateDebugChannelReadableWriterPair: function() {
        return getOrCreateDebugChannelReadableWriterPair;
    }
});
const _approuterheaders = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/app-router-headers.js [app-ssr] (ecmascript)");
const _invarianterror = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const pairs = new Map();
/**
 * Upper bound on the number of in-memory debug-channel pairs we retain, evicted
 * least-recently-used, bounding the live per-request map.
 *
 * A pair must outlive its stream's close so a late decode of the same response
 * (the primary decode plus stage extractions via `decodeStageUntilBoundary`,
 * which can run after the channel closed over the WebSocket) still finds the
 * buffered data. The cap only needs to exceed the pairs live or recently closed
 * at once (bounded by how many prefetch/navigation requests are in flight
 * together), so a few dozen leaves ample headroom even for the segment-heavy
 * bursts the Instant Navs DevTools capture can produce.
 */ const MAX_DEBUG_CHANNEL_PAIRS = 64;
const DB_NAME = '__next_debug_channel';
const STORE_NAME = 'channels';
const CREATED_AT_INDEX = 'createdAt';
/**
 * Upper bound on persisted document debug channels in IndexedDB (one per
 * document, kept for HTTP-cache restore), evicted oldest-first.
 */ const MAX_PERSISTED_DOCUMENT_CHANNELS = 10;
function openDebugChannelDB() {
    return new Promise((resolve, reject)=>{
        const openRequest = indexedDB.open(DB_NAME, 1);
        openRequest.onupgradeneeded = ()=>{
            const store = openRequest.result.createObjectStore(STORE_NAME, {
                keyPath: 'requestId'
            });
            store.createIndex(CREATED_AT_INDEX, 'createdAt');
        };
        openRequest.onsuccess = ()=>resolve(openRequest.result);
        openRequest.onerror = ()=>reject(openRequest.error);
        openRequest.onblocked = ()=>reject(openRequest.error);
    });
}
/**
 * Resolves on the next idle period via `requestIdleCallback`, falling back to a
 * `setTimeout` where `requestIdleCallback` is unavailable.
 */ function whenIdle() {
    return new Promise((resolve)=>{
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(()=>resolve());
        } else {
            setTimeout(resolve, 0);
        }
    });
}
async function persistDebugChannelToIndexedDB(requestId, chunks) {
    let db;
    try {
        db = await openDebugChannelDB();
    } catch (error) {
        console.debug('Failed to open debug channel IndexedDB for write', error);
        return;
    }
    try {
        await new Promise((resolve, reject)=>{
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.put({
                requestId,
                createdAt: Date.now(),
                chunks
            });
            // Prune oldest entries beyond the cap to bound storage growth across tabs
            // and/or page loads. The createdAt index gives ordered traversal without
            // scanning, and the cursor deletes commit atomically with the put above.
            const countReq = store.count();
            countReq.onsuccess = ()=>{
                let entriesToDelete = countReq.result - MAX_PERSISTED_DOCUMENT_CHANNELS;
                if (entriesToDelete <= 0) {
                    return;
                }
                const cursorReq = store.index(CREATED_AT_INDEX).openCursor();
                cursorReq.onsuccess = ()=>{
                    const cursor = cursorReq.result;
                    if (!cursor || entriesToDelete === 0) {
                        return;
                    }
                    cursor.delete();
                    entriesToDelete--;
                    cursor.continue();
                };
            };
            transaction.oncomplete = ()=>{
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                resolve();
            };
            transaction.onerror = ()=>reject(transaction.error);
            transaction.onabort = ()=>reject(transaction.error);
        });
    } catch (error) {
        // Best-effort: if persistence fails (quota, transaction abort, etc.), an
        // HTTP cache restore will fall back to location.reload() since no entry
        // will be found.
        console.debug('Failed to write debug channel entry to IndexedDB', error);
    } finally{
        db.close();
    }
}
function restoreDebugChannelFromIndexedDB(requestId) {
    return new ReadableStream({
        async start (controller) {
            let entry;
            try {
                const db = await openDebugChannelDB();
                try {
                    entry = await new Promise((resolve, reject)=>{
                        const tx = db.transaction(STORE_NAME, 'readonly');
                        const store = tx.objectStore(STORE_NAME);
                        const getReq = store.get(requestId);
                        getReq.onsuccess = ()=>resolve(getReq.result);
                        getReq.onerror = ()=>reject(getReq.error);
                    });
                } finally{
                    db.close();
                }
            } catch (error) {
                // Treat any IDB failure as "no entry" and fall through to reload.
                console.debug('Failed to read debug channel entry from IndexedDB', error);
            }
            if (!entry) {
                // Debug channel can't be restored — missing debug chunks would block
                // hydration. Force a fresh page load from the server. Leave the stream
                // parked (no enqueue, no close) so the Flight client stays put until
                // the reload tears the document down, instead of synchronously erroring
                // with "Connection closed.".
                location.reload();
                return;
            }
            for (const chunk of entry.chunks){
                controller.enqueue(chunk);
            }
            controller.close();
        }
    });
}
/**
 * Decide at script-execution time whether the document was served from the
 * browser's cache or freshly fetched from the server. `type === 'back_forward'`
 * alone isn't enough: a back/forward navigation can also be a fresh server
 * re-fetch when the HTTP cache entry was evicted (long-lived tab, storage
 * pressure, manual cache clear), and treating that as a cache restore would
 * trigger an unnecessary `location.reload()` when no persisted chunks are
 * found.
 */ function wasServedFromCacheKnownAtExec(entry) {
    if (!entry) {
        return 1;
    }
    // Safari tab-duplication cache restore: type='navigate' paired with
    // responseStart=0 (no first-body-byte over the network) and a non-zero
    // responseEnd. Fresh navigations always have responseStart > 0.
    if (entry.type === 'navigate' && entry.responseStart === 0 && entry.responseEnd > 0) {
        return 0;
    }
    // Every remaining cache-restore signal requires a back/forward navigation.
    // (bfcache restores don't re-execute scripts and never reach this code.)
    if (entry.type !== 'back_forward') {
        return 1;
    }
    // Chrome ≥109 and Safari ≥17 populate `deliveryType` at exec time even when
    // the size fields aren't filled in yet. This is the only exec-time fast path
    // for real Safari ≥17 cache restores (Safari leaves encodedBodySize at 0 at
    // exec).
    if (entry.deliveryType === 'cache') {
        return 0;
    }
    // Chrome and Firefox publish an HTTP cache restore as transferSize=0 (no
    // bytes over the wire) plus a non-zero cached body size at exec time.
    if (entry.transferSize === 0 && entry.encodedBodySize > 0) {
        return 0;
    }
    // No body bytes measured yet. Either the response is still streaming, or
    // WebKit is reporting transferSize=0 and encodedBodySize=0 at exec time
    // regardless of whether the document was cached or re-fetched. Defer to
    // `pageshow` where the two cases become distinguishable.
    if (entry.encodedBodySize === 0) {
        return 2;
    }
    // Body bytes already measured at exec time with no other cache signal: a
    // re-fetched back-nav whose response happened to complete before our script
    // ran. The deferred branch above would have caught the same case if the
    // response had still been streaming.
    return 1;
}
/**
 * Re-check the cache-restore decision at `pageshow`, when every browser has
 * populated the navigation-entry size fields. Only called when
 * `wasServedFromCacheKnownAtExec` returned `ExecTimeCacheDecision.Undecided`.
 */ function wasServedFromCacheAtPageshow(entry) {
    if (!entry) {
        return false;
    }
    // Safari tab-duplication signature; see the matching branch in
    // `wasServedFromCacheKnownAtExec`.
    if (entry.type === 'navigate' && entry.responseStart === 0 && entry.responseEnd > 0) {
        return true;
    }
    // A back/forward navigation where at least one of the size fields is zero
    // means the body didn't come over the wire. Browsers signal a cache restore
    // differently — Chrome/Firefox zero `transferSize` and keep a non-zero cached
    // `encodedBodySize`; Safari does the inverse with a small `transferSize`
    // (header overhead) and `encodedBodySize=0`; WebKit under Playwright zeros
    // both. A fresh re-fetch populates both with the response size.
    return entry.type === 'back_forward' && (entry.transferSize === 0 || entry.encodedBodySize === 0);
}
function getNavigationEntry() {
    try {
        return performance.getEntriesByType('navigation')[0];
    } catch  {
        return undefined;
    }
}
/**
 * Reclaim the least-recently-used debug-channel pairs once the map exceeds
 * `MAX_DEBUG_CHANNEL_PAIRS`. The map is iterated in insertion order and we
 * re-insert entries on access (see
 * `getOrCreateDebugChannelReadableWriterPair`), so the least-recently-used
 * pairs sit at the front. Evicting only ever affects future lookups for that
 * request id; consumers that already hold a tee branch keep reading
 * independently of the map.
 */ function evictExcessDebugChannelPairs() {
    while(pairs.size > MAX_DEBUG_CHANNEL_PAIRS){
        const oldestRequestId = pairs.keys().next().value;
        if (oldestRequestId === undefined) {
            break;
        }
        pairs.delete(oldestRequestId);
    }
}
function getOrCreateDebugChannelReadableWriterPair(requestId) {
    const existingPair = pairs.get(requestId);
    if (existingPair) {
        // Refresh the LRU recency of an already-known channel by re-inserting it at
        // the most-recent position, so a channel that's still being written to or
        // read from isn't evicted while a late consumer (e.g. a stage re-decode of
        // the same response) still needs it.
        pairs.delete(requestId);
        pairs.set(requestId, existingPair);
        return existingPair;
    }
    // Buffer chunks only for the initial document's debug channel, not for
    // client-side navigation requests. Persisted to IndexedDB once complete so it
    // can be restored when the browser serves the page from HTTP cache
    // (back-forward navigation, tab duplication, etc.).
    const chunks = requestId === self.__next_r ? [] : null;
    const { readable, writable } = new TransformStream({
        transform (chunk, controller) {
            if (chunks) {
                chunks.push(chunk.slice());
            }
            controller.enqueue(chunk);
        }
    });
    const pair = {
        readable,
        writer: writable.getWriter()
    };
    pairs.set(requestId, pair);
    // Retain the pair past its stream's close (see MAX_DEBUG_CHANNEL_PAIRS) and
    // bound the map by reclaiming the least-recently-used.
    evictExcessDebugChannelPairs();
    pair.writer.closed.then(async ()=>{
        if (!chunks) {
            return;
        }
        // The initial document's debug stream closes while hydration is still
        // running, so persisting here would steal main-thread time from it. Wait
        // for genuine idle (no timeout): persistence is best-effort, so if the
        // page never idles before navigation we skip it and a later restore falls
        // back to a reload, rather than forcing a blocking write.
        await whenIdle();
        await persistDebugChannelToIndexedDB(requestId, chunks);
    }).catch((error)=>{
        // writer.closed rejected (e.g., stream aborted), nothing to persist.
        console.debug('Debug channel writer closed with error', error);
    }).finally(()=>{
        // Keep the now-closed pair in the map so late decodes of this request
        // still resolve against its buffered stream; it's reclaimed later by LRU
        // eviction. Release the IndexedDB staging buffer now that it's persisted.
        if (chunks) {
            chunks.length = 0;
        }
    });
    return pair;
}
function createDebugChannel(requestHeaders) {
    let requestId;
    if (requestHeaders) {
        requestId = requestHeaders[_approuterheaders.NEXT_REQUEST_ID_HEADER] ?? undefined;
        if (!requestId) {
            throw Object.defineProperty(new _invarianterror.InvariantError(`Expected a ${JSON.stringify(_approuterheaders.NEXT_REQUEST_ID_HEADER)} request header.`), "__NEXT_ERROR_CODE", {
                value: "E854",
                enumerable: false,
                configurable: true
            });
        }
    } else {
        requestId = self.__next_r;
        if (!requestId) {
            throw Object.defineProperty(new _invarianterror.InvariantError(`Expected a request ID to be defined for the document via self.__next_r.`), "__NEXT_ERROR_CODE", {
                value: "E806",
                enumerable: false,
                configurable: true
            });
        }
    }
    // Only attempt to restore the IndexedDB debug channel entry for the
    // initial document load (no request headers). Client-side navigations pass
    // request headers and should always use the WebSocket-backed debug channel.
    if (!requestHeaders) {
        switch(wasServedFromCacheKnownAtExec(getNavigationEntry())){
            case 0:
                return {
                    readable: restoreDebugChannelOrReload(requestId)
                };
            case 2:
                // Body bytes haven't been measured on the navigation entry yet. Suspend
                // the stream until pageshow, re-check there, then source from the
                // persisted chunks or the WebSocket-backed pair accordingly.
                return {
                    readable: createDeferredDebugChannelReadable(requestId)
                };
            case 1:
                break;
        }
    }
    const pair = getOrCreateDebugChannelReadableWriterPair(requestId);
    // Hand out a fresh tee branch per consumer and keep the remainder for the
    // next one (see the `readable` field doc above).
    const [branch, rest] = pair.readable.tee();
    pair.readable = rest;
    return {
        readable: branch
    };
}
/**
 * Try to restore the debug channel from the persisted chunks. If none are
 * found, force a fresh page load.
 */ function restoreDebugChannelOrReload(requestId) {
    const readable = restoreDebugChannelFromIndexedDB(requestId);
    if (readable) {
        return readable;
    }
    // No persisted entry. Typically this happens when the HTTP cache held the
    // HTML but the persisted entry was never written, or was overwritten by a
    // newer document in this tab.
    location.reload();
    // Never-closing stream. Keeps the Flight client suspended until the reload
    // tears the document down, instead of letting it synchronously error with
    // "Connection closed.".
    return new ReadableStream();
}
/**
 * Used when `wasServedFromCacheKnownAtExec` returns
 * `ExecTimeCacheDecision.Undecided`. Waits for `pageshow`, re-runs the check,
 * and forwards data from either the persisted chunks or the WebSocket.
 */ function createDeferredDebugChannelReadable(requestId) {
    return new ReadableStream({
        async start (controller) {
            // By `pageshow` every browser has populated the navigation-entry size
            // fields, so the re-check below is unambiguous.
            await new Promise((resolve)=>{
                window.addEventListener('pageshow', ()=>resolve(), {
                    once: true
                });
            });
            const source = wasServedFromCacheAtPageshow(getNavigationEntry()) ? restoreDebugChannelOrReload(requestId) : getOrCreateDebugChannelReadableWriterPair(requestId).readable;
            const reader = source.getReader();
            try {
                while(true){
                    const { done, value } = await reader.read();
                    if (done) {
                        controller.close();
                        return;
                    }
                    controller.enqueue(value);
                }
            } catch (error) {
                controller.error(error);
            } finally{
                reader.releaseLock();
            }
        }
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/flight-data-helpers.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createInitialRSCPayloadFromFallbackPrerender: null,
    getFlightDataPartsFromPath: null,
    getNextFlightSegmentPath: null,
    normalizeFlightData: null,
    prepareFlightRouterStateForRequest: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createInitialRSCPayloadFromFallbackPrerender: function() {
        return createInitialRSCPayloadFromFallbackPrerender;
    },
    getFlightDataPartsFromPath: function() {
        return getFlightDataPartsFromPath;
    },
    getNextFlightSegmentPath: function() {
        return getNextFlightSegmentPath;
    },
    normalizeFlightData: function() {
        return normalizeFlightData;
    },
    prepareFlightRouterStateForRequest: function() {
        return prepareFlightRouterStateForRequest;
    }
});
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/route-params.js [app-ssr] (ecmascript)");
const _createhreffromurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/router-reducer/create-href-from-url.js [app-ssr] (ecmascript)");
function getFlightDataPartsFromPath(flightDataPath) {
    // Pick the last 4 items from the `FlightDataPath` to get the [tree, seedData, viewport, isHeadPartial].
    const flightDataPathLength = 4;
    // tree, seedData, and head are *always* the last three items in the `FlightDataPath`.
    const [tree, seedData, head, isHeadPartial] = flightDataPath.slice(-flightDataPathLength);
    // The `FlightSegmentPath` is everything except the last three items. For a root render, it won't be present.
    const segmentPath = flightDataPath.slice(0, -flightDataPathLength);
    return {
        // TODO: Unify these two segment path helpers. We are inconsistently pushing an empty segment ("")
        // to the start of the segment path in some places which makes it hard to use solely the segment path.
        // Look for "// TODO-APP: remove ''" in the codebase.
        pathToSegment: segmentPath.slice(0, -1),
        segmentPath,
        // if the `FlightDataPath` corresponds with the root, there'll be no segment path,
        // in which case we default to ''.
        segment: segmentPath[segmentPath.length - 1] ?? '',
        tree,
        seedData,
        head,
        isHeadPartial,
        isRootRender: flightDataPath.length === flightDataPathLength
    };
}
function createInitialRSCPayloadFromFallbackPrerender(response, fallbackInitialRSCPayload) {
    // This is a static fallback page. In order to hydrate the page, we need to
    // parse the client params from the URL, but to account for the possibility
    // that the page was rewritten, we need to check the response headers
    // for x-nextjs-rewritten-path or x-nextjs-rewritten-query headers. Since
    // we can't access the headers of the initial document response, the client
    // performs a fetch request to the current location. Since it's possible that
    // the fetch request will be dynamically rewritten to a different path than
    // the initial document, this fetch request delivers _all_ the hydration data
    // for the page; it was not inlined into the document, like it normally
    // would be.
    //
    // TODO: Consider treating the case where fetch is rewritten to a different
    // path from the document as a special deopt case. We should optimistically
    // assume this won't happen, inline the data into the document, and perform
    // a minimal request (like a HEAD or range request) to verify that the
    // response matches. Tricky to get right because we need to account for
    // all the different deployment environments we support, like output:
    // "export" mode, where we currently don't assume that custom response
    // headers are present.
    // Patch the Flight data sent by the server with the correct params parsed
    // from the URL + response object.
    const renderedPathname = (0, _routeparams.getRenderedPathname)(response);
    const renderedSearch = (0, _routeparams.getRenderedSearch)(response);
    const canonicalUrl = (0, _createhreffromurl.createHrefFromUrl)(new URL(location.href));
    const originalFlightDataPath = fallbackInitialRSCPayload.f[0];
    const originalFlightRouterState = originalFlightDataPath[0];
    const payload = {
        c: canonicalUrl.split('/'),
        q: renderedSearch,
        i: fallbackInitialRSCPayload.i,
        f: [
            [
                fillInFallbackFlightRouterState(originalFlightRouterState, renderedPathname, renderedSearch),
                originalFlightDataPath[1],
                originalFlightDataPath[2],
                // isHeadPartial. Previously this incorrectly passed the head itself
                // (index 2), which is truthy, so the head was always treated
                // as partial.
                originalFlightDataPath[3]
            ]
        ],
        m: fallbackInitialRSCPayload.m,
        G: fallbackInitialRSCPayload.G,
        S: fallbackInitialRSCPayload.S,
        h: fallbackInitialRSCPayload.h
    };
    if (fallbackInitialRSCPayload.b) {
        payload.b = fallbackInitialRSCPayload.b;
    }
    return payload;
}
function fillInFallbackFlightRouterState(flightRouterState, renderedPathname, renderedSearch) {
    const pathnameParts = renderedPathname.split('/').filter((p)=>p !== '');
    const index = 0;
    return fillInFallbackFlightRouterStateImpl(flightRouterState, renderedSearch, pathnameParts, index);
}
function fillInFallbackFlightRouterStateImpl(flightRouterState, renderedSearch, pathnameParts, pathnamePartsIndex) {
    const originalSegment = flightRouterState[0];
    let newSegment;
    let doesAppearInURL;
    if (typeof originalSegment === 'string') {
        newSegment = originalSegment;
        doesAppearInURL = (0, _routeparams.doesStaticSegmentAppearInURL)(originalSegment);
    } else {
        const paramName = originalSegment[0];
        const paramType = originalSegment[2];
        const staticSiblings = originalSegment[3];
        const paramValue = (0, _routeparams.parseDynamicParamFromURLPart)(paramType, pathnameParts, pathnamePartsIndex);
        const cacheKey = (0, _routeparams.getCacheKeyForDynamicParam)(paramValue, renderedSearch);
        newSegment = [
            paramName,
            cacheKey,
            paramType,
            staticSiblings
        ];
        doesAppearInURL = true;
    }
    // Only increment the index if the segment appears in the URL. If it's a
    // "virtual" segment, like a route group, it remains the same.
    const childPathnamePartsIndex = doesAppearInURL ? pathnamePartsIndex + 1 : pathnamePartsIndex;
    const children = flightRouterState[1];
    const newChildren = {};
    for(let key in children){
        const childFlightRouterState = children[key];
        newChildren[key] = fillInFallbackFlightRouterStateImpl(childFlightRouterState, renderedSearch, pathnameParts, childPathnamePartsIndex);
    }
    const newState = [
        newSegment,
        newChildren,
        null,
        flightRouterState[3],
        flightRouterState[4]
    ];
    return newState;
}
function getNextFlightSegmentPath(flightSegmentPath) {
    // Since `FlightSegmentPath` is a repeated tuple of `Segment` and `ParallelRouteKey`, we slice off two items
    // to get the next segment path.
    return flightSegmentPath.slice(2);
}
function normalizeFlightData(flightData) {
    // FlightData can be a string when the server didn't respond with a proper flight response,
    // or when a redirect happens, to signal to the client that it needs to perform an MPA navigation.
    if (typeof flightData === 'string') {
        return flightData;
    }
    return flightData.map((flightDataPath)=>getFlightDataPartsFromPath(flightDataPath));
}
function prepareFlightRouterStateForRequest(flightRouterState, isHmrRefresh) {
    // HMR requests need the complete, unmodified state for proper functionality
    if (isHmrRefresh) {
        return encodeURIComponent(JSON.stringify(flightRouterState));
    }
    return encodeURIComponent(JSON.stringify(stripClientOnlyDataFromFlightRouterState(flightRouterState)));
}
/**
 * Recursively strips client-only data from FlightRouterState while preserving
 * server-needed information for proper rendering decisions.
 */ function stripClientOnlyDataFromFlightRouterState(flightRouterState) {
    const [segment, parallelRoutes, _refreshState, refreshMarker, prefetchHints] = flightRouterState;
    // Strip client-only data from the segment
    const cleanedSegment = stripClientOnlyDataFromSegment(segment);
    // Recursively process parallel routes
    const cleanedParallelRoutes = {};
    for (const [key, childState] of Object.entries(parallelRoutes)){
        cleanedParallelRoutes[key] = stripClientOnlyDataFromFlightRouterState(childState);
    }
    const result = [
        cleanedSegment,
        cleanedParallelRoutes
    ];
    if (refreshMarker) {
        result[2] = null // null slightly more compact than undefined
        ;
        result[3] = refreshMarker;
    }
    // Append optional fields if present
    if (prefetchHints !== undefined) {
        result[4] = prefetchHints;
    }
    // Everything else is used only by the client and is not needed for requests.
    return result;
}
/**
 * Strips client-only data from segments:
 * - Search parameters from __PAGE__ segments
 * - staticSiblings from dynamic segment tuples (only needed for client-side
 *   prefetch reuse decisions)
 */ function stripClientOnlyDataFromSegment(segment) {
    if (typeof segment === 'string') {
        // Strip search params from __PAGE__ segments
        if (segment.startsWith(_segment.PAGE_SEGMENT_KEY + '?')) {
            return _segment.PAGE_SEGMENT_KEY;
        }
        return segment;
    }
    // Dynamic segment tuple: [paramName, paramCacheKey, paramType, staticSiblings]
    // Strip staticSiblings (4th element) since server doesn't need it
    const [paramName, paramCacheKey, paramType] = segment;
    return [
        paramName,
        paramCacheKey,
        paramType,
        null
    ];
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/has-base-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "hasBasePath", {
    enumerable: true,
    get: function() {
        return hasBasePath;
    }
});
const _pathhasprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-ssr] (ecmascript)");
const basePath = ("TURBOPACK compile-time value", "") || '';
function hasBasePath(path) {
    return (0, _pathhasprefix.pathHasPrefix)(path, basePath);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/lib/javascript-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Adapted from React's sanitizeURL function found here: https://github.com/facebook/react/blob/b565373afd0cc1988497e1107106e851e8cfb261/packages/react-dom-bindings/src/shared/sanitizeURL.js
// A javascript: URL can contain leading C0 control or \u0020 SPACE,
// and any newline or tab are filtered out as if they're not part of the URL.
// https://url.spec.whatwg.org/#url-parsing
// Tab or newline are defined as \r\n\t:
// https://infra.spec.whatwg.org/#ascii-tab-or-newline
// A C0 control is a code point in the range \u0000 NULL to \u001F
// INFORMATION SEPARATOR ONE, inclusive:
// https://infra.spec.whatwg.org/#c0-control-or-space
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isJavaScriptURLString", {
    enumerable: true,
    get: function() {
        return isJavaScriptURLString;
    }
});
const isJavaScriptProtocol = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
function isJavaScriptURLString(url) {
    return isJavaScriptProtocol.test('' + url);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/lib/promise.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolvePromiseWithTimeout", {
    enumerable: true,
    get: function() {
        return resolvePromiseWithTimeout;
    }
});
const _requestidlecallback = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/request-idle-callback.js [app-ssr] (ecmascript)");
// 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
// considers as "Good" time-to-interactive. We must assume something went
// wrong beyond this point, and then fall-back to a full page transition to
// show the user something of value.
const MS_MAX_IDLE_DELAY = 3800;
function resolvePromiseWithTimeout(p, err, devPromise) {
    return new Promise((resolve, reject)=>{
        let cancelled = false;
        p.then((r)=>{
            // Resolved, cancel the timeout
            cancelled = true;
            resolve(r);
        }).catch(reject);
        // We wrap these checks separately for better dead-code elimination in
        // production bundles.
        if ("TURBOPACK compile-time truthy", 1) {
            ;
            (devPromise || Promise.resolve()).then(()=>{
                (0, _requestidlecallback.requestIdleCallback)(()=>setTimeout(()=>{
                        if (!cancelled) {
                            reject(err);
                        }
                    }, MS_MAX_IDLE_DELAY));
            });
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/navigation-build-id.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This gets assigned as a side-effect during app initialization. Because it
// represents the build used to create the JS bundle, it should never change
// after being set, so we store it in a global variable.
//
// When performing RSC requests, if the incoming data has a different build ID,
// we perform an MPA navigation/refresh to load the updated build and ensure
// that the client and server in sync.
//
// Starts as an empty string. In practice, because setNavigationBuildId is called during initialization
// before hydration starts, this will always get reassigned to the actual ID before it's ever needed
// by a navigation. If for some reasons it didn't, due to a bug or race condition, then on
// navigation the build comparision would fail and trigger an MPA navigation.
//
// Note that this can also be initialized with the deployment id instead (if available). So it's not
// the same as "the build id", but we are running out of alternative names for "build id or
// deployment id".
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getNavigationBuildId: null,
    setNavigationBuildId: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getNavigationBuildId: function() {
        return getNavigationBuildId;
    },
    setNavigationBuildId: function() {
        return setNavigationBuildId;
    }
});
let globalBuildId = '';
function setNavigationBuildId(buildId) {
    globalBuildId = buildId;
}
function getNavigationBuildId() {
    return globalBuildId;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/normalize-trailing-slash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizePathTrailingSlash", {
    enumerable: true,
    get: function() {
        return normalizePathTrailingSlash;
    }
});
const _removetrailingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-ssr] (ecmascript)");
const _parsepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
const normalizePathTrailingSlash = (path)=>{
    // 47 is the char code for '/'
    if (path.charCodeAt(0) !== 47 || ("TURBOPACK compile-time value", void 0)) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return `${(0, _removetrailingslash.removeTrailingSlash)(pathname)}${query}${hash}`;
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/remove-base-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeBasePath", {
    enumerable: true,
    get: function() {
        return removeBasePath;
    }
});
const _hasbasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/has-base-path.js [app-ssr] (ecmascript)");
const basePath = ("TURBOPACK compile-time value", "") || '';
function removeBasePath(path) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    // Can't trim the basePath if it has zero length!
    if (basePath.length === 0) return path;
    path = path.slice(basePath.length);
    if (!path.startsWith('/')) path = `/${path}`;
    return path;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/remove-locale.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeLocale", {
    enumerable: true,
    get: function() {
        return removeLocale;
    }
});
const _parsepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
function removeLocale(path, locale) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return path;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/request-idle-callback.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    cancelIdleCallback: null,
    requestIdleCallback: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    cancelIdleCallback: function() {
        return cancelIdleCallback;
    },
    requestIdleCallback: function() {
        return requestIdleCallback;
    }
});
const requestIdleCallback = typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(cb) {
    let start = Date.now();
    return self.setTimeout(function() {
        cb({
            didTimeout: false,
            timeRemaining: function() {
                return Math.max(0, 50 - (Date.now() - start));
            }
        });
    }, 1);
};
const cancelIdleCallback = typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(id) {
    return clearTimeout(id);
};
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/resolve-href.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveHref", {
    enumerable: true,
    get: function() {
        return resolveHref;
    }
});
const _querystring = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)");
const _formaturl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-ssr] (ecmascript)");
const _omit = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/omit.js [app-ssr] (ecmascript)");
const _utils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _normalizetrailingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/normalize-trailing-slash.js [app-ssr] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-ssr] (ecmascript)");
const _utils1 = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/index.js [app-ssr] (ecmascript)");
const _interpolateas = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interpolate-as.js [app-ssr] (ecmascript)");
const _routeregex = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-regex.js [app-ssr] (ecmascript)");
const _routematcher = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-matcher.js [app-ssr] (ecmascript)");
function resolveHref(router, href, resolveAs) {
    // we use a dummy base url for relative urls
    let base;
    let urlAsString = typeof href === 'string' ? href : (0, _formaturl.formatWithValidation)(href);
    // repeated slashes and backslashes in the URL are considered
    // invalid and will never match a Next.js page/file
    // https://www.rfc-editor.org/rfc/rfc3986.html#section-3.1
    const urlProtoMatch = urlAsString.match(/^[a-z][a-z0-9+.-]*:\/\//i);
    const urlAsStringNoProto = urlProtoMatch ? urlAsString.slice(urlProtoMatch[0].length) : urlAsString;
    const urlParts = urlAsStringNoProto.split('?', 1);
    if ((urlParts[0] || '').match(/(\/\/|\\)/)) {
        console.error(`Invalid href '${urlAsString}' passed to next/router in page: '${router.pathname}'. Repeated forward-slashes (//) or backslashes \\ are not valid in the href.`);
        const normalizedUrl = (0, _utils.normalizeRepeatedSlashes)(urlAsStringNoProto);
        urlAsString = (urlProtoMatch ? urlProtoMatch[0] : '') + normalizedUrl;
    }
    // Return because it cannot be routed by the Next.js router
    if (!(0, _islocalurl.isLocalURL)(urlAsString)) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
    try {
        let baseBase = urlAsString.startsWith('#') ? router.asPath : router.pathname;
        // If the provided href is only a query string, it is safer to use the asPath
        // considering rewrites.
        if (urlAsString.startsWith('?')) {
            baseBase = router.asPath;
            // However, if is a dynamic route, we need to use the pathname to preserve the
            // query interpolation and rewrites (router.pathname will look like "/[slug]").
            if ((0, _utils1.isDynamicRoute)(router.pathname)) {
                baseBase = router.pathname;
                const routeRegex = (0, _routeregex.getRouteRegex)(router.pathname);
                const match = (0, _routematcher.getRouteMatcher)(routeRegex)(router.asPath);
                // For dynamic routes, if asPath doesn't match the pathname regex, it is a rewritten path.
                // In this case, should use asPath to preserve the current URL.
                if (!match) {
                    baseBase = router.asPath;
                }
            // Note: There is an edge case where the pathname is dynamic, and also a rewrite path to the same segment.
            // E.g. in "/[slug]" path, rewrite "/foo" -> "/bar"
            // In this case, it will be treated as a non-rewritten path and possibly interpolate the query string.
            // E.g., "/any?slug=foo" will become the content of "/foo", not rewritten as "/bar"
            // This is currently a trade-off of not resolving rewrite paths on every Router/Link call,
            // but using a lighter route regex pattern check.
            }
        }
        base = new URL(baseBase, 'http://n');
    } catch (_) {
        // fallback to / for invalid asPath values e.g. //
        base = new URL('/', 'http://n');
    }
    try {
        const finalUrl = new URL(urlAsString, base);
        finalUrl.pathname = (0, _normalizetrailingslash.normalizePathTrailingSlash)(finalUrl.pathname);
        let interpolatedAs = '';
        if ((0, _utils1.isDynamicRoute)(finalUrl.pathname) && finalUrl.searchParams && resolveAs) {
            const query = (0, _querystring.searchParamsToUrlQuery)(finalUrl.searchParams);
            const { result, params } = (0, _interpolateas.interpolateAs)(finalUrl.pathname, finalUrl.pathname, query);
            if (result) {
                interpolatedAs = (0, _formaturl.formatWithValidation)({
                    pathname: result,
                    hash: finalUrl.hash,
                    query: (0, _omit.omit)(query, params)
                });
            }
        }
        // if the origin didn't change, it means we received a relative href
        const resolvedHref = finalUrl.origin === base.origin ? finalUrl.href.slice(finalUrl.origin.length) : finalUrl.href;
        return resolveAs ? [
            resolvedHref,
            interpolatedAs || resolvedHref
        ] : resolvedHref;
    } catch (_) {
        return resolveAs ? [
            urlAsString
        ] : urlAsString;
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/route-loader.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createRouteLoader: null,
    getClientBuildManifest: null,
    isAssetError: null,
    markAssetError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createRouteLoader: function() {
        return createRouteLoader;
    },
    getClientBuildManifest: function() {
        return getClientBuildManifest;
    },
    isAssetError: function() {
        return isAssetError;
    },
    markAssetError: function() {
        return markAssetError;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _getassetpathfromroute = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-asset-path-from-route.js [app-ssr] (ecmascript)"));
const _trustedtypes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/trusted-types.js [app-ssr] (ecmascript)");
const _requestidlecallback = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/request-idle-callback.js [app-ssr] (ecmascript)");
const _deploymentid = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/deployment-id.js [app-ssr] (ecmascript)");
const _encodeuripath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/encode-uri-path.js [app-ssr] (ecmascript)");
const _promise = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/lib/promise.js [app-ssr] (ecmascript)");
function withFuture(key, map, generator) {
    let entry = map.get(key);
    if (entry) {
        if ('future' in entry) {
            return entry.future;
        }
        return Promise.resolve(entry);
    }
    let resolver;
    const prom = new Promise((resolve)=>{
        resolver = resolve;
    });
    map.set(key, {
        resolve: resolver,
        future: prom
    });
    return generator ? generator().then((value)=>{
        resolver(value);
        return value;
    }).catch((err)=>{
        map.delete(key);
        throw err;
    }) : prom;
}
const ASSET_LOAD_ERROR = Symbol('ASSET_LOAD_ERROR');
function markAssetError(err) {
    return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
}
function isAssetError(err) {
    return err && ASSET_LOAD_ERROR in err;
}
function hasPrefetch(link) {
    try {
        link = document.createElement('link');
        return(// with relList.support
        !!window.MSInputMethodContext && !!document.documentMode || link.relList.supports('prefetch'));
    } catch  {
        return false;
    }
}
const canPrefetch = hasPrefetch();
function prefetchViaDom(href, as, link) {
    return new Promise((resolve, reject)=>{
        const selector = `
      link[rel="prefetch"][href^="${href}"],
      link[rel="preload"][href^="${href}"],
      script[src^="${href}"]`;
        if (document.querySelector(selector)) {
            return resolve();
        }
        link = document.createElement('link');
        // The order of property assignment here is intentional:
        if (as) link.as = as;
        link.rel = `prefetch`;
        link.crossOrigin = ("TURBOPACK compile-time value", void 0);
        link.onload = resolve;
        link.onerror = ()=>reject(markAssetError(Object.defineProperty(new Error(`Failed to prefetch: ${href}`), "__NEXT_ERROR_CODE", {
                value: "E268",
                enumerable: false,
                configurable: true
            })));
        // `href` should always be last:
        link.href = href;
        document.head.appendChild(link);
    });
}
function appendScript(src, script) {
    return new Promise((resolve, reject)=>{
        script = document.createElement('script');
        // The order of property assignment here is intentional.
        // 1. Setup success/failure hooks in case the browser synchronously
        //    executes when `src` is set.
        script.onload = resolve;
        script.onerror = ()=>reject(markAssetError(Object.defineProperty(new Error(`Failed to load script: ${src}`), "__NEXT_ERROR_CODE", {
                value: "E74",
                enumerable: false,
                configurable: true
            })));
        // 2. Configure the cross-origin attribute before setting `src` in case the
        //    browser begins to fetch.
        script.crossOrigin = ("TURBOPACK compile-time value", void 0);
        // 3. Finally, set the source and inject into the DOM in case the child
        //    must be appended for fetching to start.
        script.src = src;
        document.body.appendChild(script);
    });
}
// We wait for pages to be built in dev before we start the route transition
// timeout to prevent an un-necessary hard navigation in development.
let devBuildPromise;
function getClientBuildManifest() {
    if (self.__BUILD_MANIFEST) {
        return Promise.resolve(self.__BUILD_MANIFEST);
    }
    const onBuildManifest = new Promise((resolve)=>{
        // Mandatory because this is not concurrent safe:
        const cb = self.__BUILD_MANIFEST_CB;
        self.__BUILD_MANIFEST_CB = ()=>{
            resolve(self.__BUILD_MANIFEST);
            cb && cb();
        };
    });
    return (0, _promise.resolvePromiseWithTimeout)(onBuildManifest, markAssetError(Object.defineProperty(new Error('Failed to load client build manifest'), "__NEXT_ERROR_CODE", {
        value: "E273",
        enumerable: false,
        configurable: true
    })), devBuildPromise);
}
function getFilesForRoute(assetPrefix, route) {
    if ("TURBOPACK compile-time truthy", 1) {
        const scriptUrl = assetPrefix + '/_next/static/chunks/pages' + (0, _encodeuripath.encodeURIPath)((0, _getassetpathfromroute.default)(route, '.js')) + (0, _deploymentid.getAssetTokenQuery)();
        return Promise.resolve({
            scripts: [
                (0, _trustedtypes.__unsafeCreateTrustedScriptURL)(scriptUrl)
            ],
            // Styles are handled by `style-loader` in development:
            css: []
        });
    }
    //TURBOPACK unreachable
    ;
}
function createRouteLoader(assetPrefix) {
    const entrypoints = new Map();
    const loadedScripts = new Map();
    const styleSheets = new Map();
    const routes = new Map();
    const bootstrappedRoutes = new Set();
    // Bootstrap a client-loaded route (navigation/prefetch) so its entry registers via
    // `window.__NEXT_P`. The initial page is bootstrapped in the document.
    function bootstrapRoute(route) {
        // Gated for DCE
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const params = undefined;
        const global = undefined;
    }
    function maybeExecuteScript(src) {
        // With HMR we might need to "reload" scripts when they are
        // disposed and readded. Executing scripts twice has no functional
        // differences
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            return appendScript(src);
        }
    }
    function fetchStyleSheet(href) {
        let prom = styleSheets.get(href);
        if (prom) {
            return prom;
        }
        styleSheets.set(href, prom = fetch(href, {
            credentials: 'same-origin'
        }).then((res)=>{
            if (!res.ok) {
                throw Object.defineProperty(new Error(`Failed to load stylesheet: ${href}`), "__NEXT_ERROR_CODE", {
                    value: "E189",
                    enumerable: false,
                    configurable: true
                });
            }
            return res.text().then((text)=>({
                    href: href,
                    content: text
                }));
        }).catch((err)=>{
            throw markAssetError(err);
        }));
        return prom;
    }
    return {
        whenEntrypoint (route) {
            return withFuture(route, entrypoints);
        },
        onEntrypoint (route, execute) {
            ;
            (execute ? Promise.resolve().then(()=>execute()).then((exports1)=>({
                    component: exports1 && exports1.default || exports1,
                    exports: exports1
                }), (err)=>({
                    error: err
                })) : Promise.resolve(undefined)).then((input)=>{
                const old = entrypoints.get(route);
                if (old && 'resolve' in old) {
                    if (input) {
                        entrypoints.set(route, input);
                        old.resolve(input);
                    }
                } else {
                    if (input) {
                        entrypoints.set(route, input);
                    } else {
                        entrypoints.delete(route);
                    }
                    // when this entrypoint has been resolved before
                    // the route is outdated and we want to invalidate
                    // this cache entry
                    routes.delete(route);
                }
            });
        },
        loadRoute (route, prefetch) {
            return withFuture(route, routes, ()=>{
                let devBuildPromiseResolve;
                if ("TURBOPACK compile-time truthy", 1) {
                    devBuildPromise = new Promise((resolve)=>{
                        devBuildPromiseResolve = resolve;
                    });
                }
                return (0, _promise.resolvePromiseWithTimeout)(getFilesForRoute(assetPrefix, route).then(({ scripts, css })=>{
                    return Promise.all([
                        entrypoints.has(route) ? [] : Promise.all(scripts.map(maybeExecuteScript)).then((r)=>{
                            bootstrapRoute(route);
                            return r;
                        }),
                        Promise.all(css.map(fetchStyleSheet))
                    ]);
                }).then((res)=>{
                    return this.whenEntrypoint(route).then((entrypoint)=>({
                            entrypoint,
                            styles: res[1]
                        }));
                }), markAssetError(Object.defineProperty(new Error(`Route did not complete loading: ${route}`), "__NEXT_ERROR_CODE", {
                    value: "E12",
                    enumerable: false,
                    configurable: true
                })), devBuildPromise).then(({ entrypoint, styles })=>{
                    const res = Object.assign({
                        styles: styles
                    }, entrypoint);
                    return 'error' in entrypoint ? entrypoint : res;
                }).catch((err)=>{
                    if (prefetch) {
                        // we don't want to cache errors during prefetch
                        throw err;
                    }
                    return {
                        error: err
                    };
                }).finally(()=>devBuildPromiseResolve?.());
            });
        },
        prefetch (route) {
            // https://github.com/GoogleChromeLabs/quicklink/blob/453a661fa1fa940e2d2e044452398e38c67a98fb/src/index.mjs#L115-L118
            // License: Apache 2.0
            let cn;
            if (cn = navigator.connection) {
                // Don't prefetch if using 2G or if Save-Data is enabled.
                if (cn.saveData || /2g/.test(cn.effectiveType)) return Promise.resolve();
            }
            return getFilesForRoute(assetPrefix, route).then((output)=>Promise.all(canPrefetch ? output.scripts.map((script)=>prefetchViaDom(script.toString(), 'script')) : [])).then(()=>{
                (0, _requestidlecallback.requestIdleCallback)(()=>this.loadRoute(route, true).catch(()=>{}));
            }).catch(()=>{});
        }
    };
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/route-params.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    canonicalizeURLPart: null,
    doesStaticSegmentAppearInURL: null,
    getCacheKeyForDynamicParam: null,
    getParamValueFromCacheKey: null,
    getRenderedPathname: null,
    getRenderedSearch: null,
    parseDynamicParamFromURLPart: null,
    urlSearchParamsToParsedUrlQuery: null,
    urlToUrlWithoutFlightMarker: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    canonicalizeURLPart: function() {
        return canonicalizeURLPart;
    },
    doesStaticSegmentAppearInURL: function() {
        return doesStaticSegmentAppearInURL;
    },
    getCacheKeyForDynamicParam: function() {
        return getCacheKeyForDynamicParam;
    },
    getParamValueFromCacheKey: function() {
        return getParamValueFromCacheKey;
    },
    getRenderedPathname: function() {
        return getRenderedPathname;
    },
    getRenderedSearch: function() {
        return getRenderedSearch;
    },
    parseDynamicParamFromURLPart: function() {
        return parseDynamicParamFromURLPart;
    },
    urlSearchParamsToParsedUrlQuery: function() {
        return urlSearchParamsToParsedUrlQuery;
    },
    urlToUrlWithoutFlightMarker: function() {
        return urlToUrlWithoutFlightMarker;
    }
});
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const _segmentvalueencoding = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment-cache/segment-value-encoding.js [app-ssr] (ecmascript)");
const _approuterheaders = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/components/app-router-headers.js [app-ssr] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/has-base-path.js [app-ssr] (ecmascript)");
const _removebasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/remove-base-path.js [app-ssr] (ecmascript)");
function getRenderedSearch(response) {
    // If the server performed a rewrite, the search params used to render the
    // page will be different from the params in the request URL. In this case,
    // the response will include a header that gives the rewritten search query.
    const rewrittenQuery = response.headers.get(_approuterheaders.NEXT_REWRITTEN_QUERY_HEADER);
    if (rewrittenQuery !== null) {
        return rewrittenQuery === '' ? '' : '?' + rewrittenQuery;
    }
    // If the header is not present, there was no rewrite, so we use the search
    // query of the response URL.
    return urlToUrlWithoutFlightMarker(new URL(response.url)).search;
}
function getRenderedPathname(response) {
    // If the server performed a rewrite, the pathname used to render the
    // page will be different from the pathname in the request URL. In this case,
    // the response will include a header that gives the rewritten pathname.
    const rewrittenPath = response.headers.get(_approuterheaders.NEXT_REWRITTEN_PATH_HEADER);
    if (rewrittenPath !== null) {
        return rewrittenPath;
    }
    const pathname = urlToUrlWithoutFlightMarker(new URL(response.url)).pathname;
    return (0, _hasbasepath.hasBasePath)(pathname) ? (0, _removebasepath.removeBasePath)(pathname) : pathname;
}
function canonicalizeURLPart(part) {
    try {
        return encodeURIComponent(decodeURIComponent(part));
    } catch  {
        // `decodeURIComponent` throws on malformed sequences. Fall back to the
        // already-encoded form rather than failing the navigation.
        return part;
    }
}
function parseDynamicParamFromURLPart(paramType, pathnameParts, partIndex) {
    // This needs to match the behavior in get-dynamic-param.ts.
    switch(paramType){
        // Catchalls
        case 'c':
            {
                // Catchalls receive all the remaining URL parts. If there are no
                // remaining pathname parts, return an empty array.
                return partIndex < pathnameParts.length ? pathnameParts.slice(partIndex).map((s)=>canonicalizeURLPart(s)) : [];
            }
        // Catchall intercepted
        case 'ci(..)(..)':
        case 'ci(.)':
        case 'ci(..)':
        case 'ci(...)':
            {
                const prefix = paramType.length - 2;
                return partIndex < pathnameParts.length ? pathnameParts.slice(partIndex).map((s, i)=>{
                    if (i === 0) {
                        return canonicalizeURLPart(s.slice(prefix));
                    }
                    return canonicalizeURLPart(s);
                }) : [];
            }
        // Optional catchalls
        case 'oc':
            {
                // Optional catchalls receive all the remaining URL parts, unless this is
                // the end of the pathname, in which case they return null.
                return partIndex < pathnameParts.length ? pathnameParts.slice(partIndex).map((s)=>canonicalizeURLPart(s)) : null;
            }
        // Dynamic
        case 'd':
            {
                if (partIndex >= pathnameParts.length) {
                    // The route tree expected there to be more parts in the URL than there
                    // actually are. This could happen if the x-nextjs-rewritten-path header
                    // is incorrectly set, or potentially due to bug in Next.js. TODO:
                    // Should this be a hard error? During a prefetch, we can just abort.
                    // During a client navigation, we could trigger a hard refresh. But if
                    // it happens during initial render, we don't really have any
                    // recovery options.
                    return '';
                }
                return canonicalizeURLPart(pathnameParts[partIndex]);
            }
        // Dynamic intercepted
        case 'di(..)(..)':
        case 'di(.)':
        case 'di(..)':
        case 'di(...)':
            {
                const prefix = paramType.length - 2;
                if (partIndex >= pathnameParts.length) {
                    // The route tree expected there to be more parts in the URL than there
                    // actually are. This could happen if the x-nextjs-rewritten-path header
                    // is incorrectly set, or potentially due to bug in Next.js. TODO:
                    // Should this be a hard error? During a prefetch, we can just abort.
                    // During a client navigation, we could trigger a hard refresh. But if
                    // it happens during initial render, we don't really have any
                    // recovery options.
                    return '';
                }
                return canonicalizeURLPart(pathnameParts[partIndex].slice(prefix));
            }
        default:
            paramType;
            return '';
    }
}
function doesStaticSegmentAppearInURL(segment) {
    // This is not a parameterized segment; however, we need to determine
    // whether or not this segment appears in the URL. For example, this route
    // groups do not appear in the URL, so they should be skipped. Any other
    // special cases must be handled here.
    // TODO: Consider encoding this directly into the router tree instead of
    // inferring it on the client based on the segment type. Something like
    // a `doesAppearInURL` flag in FlightRouterState.
    if (segment === _segmentvalueencoding.ROOT_SEGMENT_REQUEST_KEY || // For some reason, the loader tree sometimes includes extra __PAGE__
    // "layouts" when part of a parallel route. But it's not a leaf node.
    // Otherwise, we wouldn't need this special case because pages are
    // always leaf nodes.
    // TODO: Investigate why the loader produces these fake page segments.
    segment.startsWith(_segment.PAGE_SEGMENT_KEY) || // Route groups.
    segment[0] === '(' && segment.endsWith(')') || segment === _segment.DEFAULT_SEGMENT_KEY || segment === '/_not-found') {
        return false;
    } else {
        // All other segment types appear in the URL
        return true;
    }
}
function getCacheKeyForDynamicParam(paramValue, renderedSearch) {
    // This needs to match the logic in get-dynamic-param.ts, until we're able to
    // unify the various implementations so that these are always computed on
    // the client.
    if (typeof paramValue === 'string') {
        // TODO: Refactor or remove this helper function to accept a string rather
        // than the whole segment type. Also we can probably just append the
        // search string instead of turning it into JSON.
        const pageSegmentWithSearchParams = (0, _segment.addSearchParamsIfPageSegment)(paramValue, urlSearchParamsToParsedUrlQuery(new URLSearchParams(renderedSearch)));
        return pageSegmentWithSearchParams;
    } else if (paramValue === null) {
        return '';
    } else {
        return paramValue.join('/');
    }
}
function urlToUrlWithoutFlightMarker(url) {
    const urlWithoutFlightParameters = new URL(url);
    urlWithoutFlightParameters.searchParams.delete(_approuterheaders.NEXT_RSC_UNION_QUERY);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return urlWithoutFlightParameters;
}
function getParamValueFromCacheKey(paramCacheKey, paramType) {
    // Turn the cache key string sent by the server (as part of FlightRouterState)
    // into a value that can be passed to `useParams` and client components.
    const isCatchAll = paramType === 'c' || paramType === 'oc';
    if (isCatchAll) {
        // Catch-all param keys are a concatenation of the path segments.
        // See equivalent logic in `getSelectedParams`.
        // TODO: We should just pass the array directly, rather than concatenate
        // it to a string and then split it back to an array. It needs to be an
        // array in some places, like when passing a key React, but we can convert
        // it at runtime in those places.
        return paramCacheKey.split('/');
    }
    return paramCacheKey;
}
function urlSearchParamsToParsedUrlQuery(searchParams) {
    // Converts a URLSearchParams object to the same type used by the server when
    // creating search params props, i.e. the type returned by Node's
    // "querystring" module.
    const result = {};
    for (const [key, value] of searchParams.entries()){
        if (result[key] === undefined) {
            result[key] = value;
        } else if (Array.isArray(result[key])) {
            result[key].push(value);
        } else {
            result[key] = [
                result[key],
                value
            ];
        }
    }
    return result;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/router.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/* global window */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    Router: null,
    createRouter: null,
    default: null,
    makePublicRouterInstance: null,
    useRouter: null,
    withRouter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    Router: function() {
        return _router.default;
    },
    createRouter: function() {
        return createRouter;
    },
    // Export the singletonRouter and this is the public API.
    default: function() {
        return _default;
    },
    makePublicRouterInstance: function() {
        return makePublicRouterInstance;
    },
    useRouter: function() {
        return useRouter;
    },
    withRouter: function() {
        return _withrouter.default;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _router = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/router.js [app-ssr] (ecmascript)"));
const _routercontextsharedruntime = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/router-context.js [app-ssr] (ecmascript)");
const _iserror = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/is-error.js [app-ssr] (ecmascript)"));
const _withrouter = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/with-router.js [app-ssr] (ecmascript)"));
const singletonRouter = {
    router: null,
    readyCallbacks: [],
    ready (callback) {
        if (this.router) return callback();
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
};
// Create public properties and methods of the router in the singletonRouter
const urlPropertyFields = [
    'pathname',
    'route',
    'query',
    'asPath',
    'components',
    'isFallback',
    'basePath',
    'locale',
    'locales',
    'defaultLocale',
    'isReady',
    'isPreview',
    'isLocaleDomain',
    'domainLocales'
];
const routerEvents = [
    'routeChangeStart',
    'beforeHistoryChange',
    'routeChangeComplete',
    'routeChangeError',
    'hashChangeStart',
    'hashChangeComplete'
];
const coreMethodFields = [
    'push',
    'replace',
    'reload',
    'back',
    'prefetch',
    'beforePopState'
];
// Events is a static property on the router, the router doesn't have to be initialized to use it
Object.defineProperty(singletonRouter, 'events', {
    get () {
        return _router.default.events;
    }
});
function getRouter() {
    if (!singletonRouter.router) {
        const message = 'No router instance found.\n' + 'You should only use "next/router" on the client side of your app.\n';
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E1044",
            enumerable: false,
            configurable: true
        });
    }
    return singletonRouter.router;
}
urlPropertyFields.forEach((field)=>{
    // Here we need to use Object.defineProperty because we need to return
    // the property assigned to the actual router
    // The value might get changed as we change routes and this is the
    // proper way to access it
    Object.defineProperty(singletonRouter, field, {
        get () {
            const router = getRouter();
            return router[field];
        }
    });
});
coreMethodFields.forEach((field)=>{
    // We don't really know the types here, so we add them later instead
    ;
    singletonRouter[field] = (...args)=>{
        const router = getRouter();
        return router[field](...args);
    };
});
routerEvents.forEach((event)=>{
    singletonRouter.ready(()=>{
        _router.default.events.on(event, (...args)=>{
            const eventField = `on${event.charAt(0).toUpperCase()}${event.substring(1)}`;
            const _singletonRouter = singletonRouter;
            if (_singletonRouter[eventField]) {
                try {
                    _singletonRouter[eventField](...args);
                } catch (err) {
                    console.error(`Error when running the Router event: ${eventField}`);
                    console.error((0, _iserror.default)(err) ? `${err.message}\n${err.stack}` : err + '');
                }
            }
        });
    });
});
const _default = singletonRouter;
function useRouter() {
    const router = _react.default.useContext(_routercontextsharedruntime.RouterContext);
    if (!router) {
        throw Object.defineProperty(new Error('NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted'), "__NEXT_ERROR_CODE", {
            value: "E509",
            enumerable: false,
            configurable: true
        });
    }
    return router;
}
function createRouter(...args) {
    singletonRouter.router = new _router.default(...args);
    singletonRouter.readyCallbacks.forEach((cb)=>cb());
    singletonRouter.readyCallbacks = [];
    return singletonRouter.router;
}
function makePublicRouterInstance(router) {
    const scopedRouter = router;
    const instance = {};
    for (const property of urlPropertyFields){
        if (typeof scopedRouter[property] === 'object') {
            instance[property] = Object.assign(Array.isArray(scopedRouter[property]) ? [] : {}, scopedRouter[property]) // makes sure query is not stateful
            ;
            continue;
        }
        instance[property] = scopedRouter[property];
    }
    // Events is a static property on the router, the router doesn't have to be initialized to use it
    instance.events = _router.default.events;
    coreMethodFields.forEach((field)=>{
        instance[field] = (...args)=>{
            return scopedRouter[field](...args);
        };
    });
    return instance;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/script.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    handleClientScriptLoad: null,
    initScriptLoader: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return _default;
    },
    handleClientScriptLoad: function() {
        return handleClientScriptLoad;
    },
    initScriptLoader: function() {
        return initScriptLoader;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _reactdom = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-dom.js [app-ssr] (ecmascript)"));
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _headmanagercontextsharedruntime = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/head-manager-context.js [app-ssr] (ecmascript)");
const _setattributesfromprops = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/set-attributes-from-props.js [app-ssr] (ecmascript)");
const _requestidlecallback = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/request-idle-callback.js [app-ssr] (ecmascript)");
const _htmlescape = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/htmlescape.js [app-ssr] (ecmascript)");
const ScriptCache = new Map();
const LoadCache = new Set();
const insertStylesheets = (stylesheets)=>{
    // Case 1: Styles for afterInteractive/lazyOnload with appDir injected via handleClientScriptLoad
    //
    // Using ReactDOM.preinit to feature detect appDir and inject styles
    // Stylesheets might have already been loaded if initialized with Script component
    // Re-inject styles here to handle scripts loaded via handleClientScriptLoad
    // ReactDOM.preinit handles dedup and ensures the styles are loaded only once
    if (_reactdom.default.preinit) {
        stylesheets.forEach((stylesheet)=>{
            _reactdom.default.preinit(stylesheet, {
                as: 'style'
            });
        });
        return;
    }
    // Case 2: Styles for afterInteractive/lazyOnload with pages injected via handleClientScriptLoad
    //
    // We use this function to load styles when appdir is not detected
    // TODO: Use React float APIs to load styles once available for pages dir
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
};
const loadScript = (props)=>{
    const { src, id, onLoad = ()=>{}, onReady = null, dangerouslySetInnerHTML, children = '', strategy = 'afterInteractive', onError, stylesheets } = props;
    const cacheKey = id || src;
    // Script has already loaded
    if (cacheKey && LoadCache.has(cacheKey)) {
        return;
    }
    // Contents of this script are already loading/loaded
    if (ScriptCache.has(src)) {
        LoadCache.add(cacheKey);
        // It is possible that multiple `next/script` components all have same "src", but has different "onLoad"
        // This is to make sure the same remote script will only load once, but "onLoad" are executed in order
        ScriptCache.get(src).then(onLoad, onError);
        return;
    }
    /** Execute after the script first loaded */ const afterLoad = ()=>{
        // Run onReady for the first time after load event
        if (onReady) {
            onReady();
        }
        // add cacheKey to LoadCache when load successfully
        LoadCache.add(cacheKey);
    };
    const el = document.createElement('script');
    const loadPromise = new Promise((resolve, reject)=>{
        el.addEventListener('load', function(e) {
            resolve();
            if (onLoad) {
                onLoad.call(this, e);
            }
            afterLoad();
        });
        el.addEventListener('error', function(e) {
            reject(e);
        });
    }).catch(function(e) {
        if (onError) {
            onError(e);
        }
    });
    if (dangerouslySetInnerHTML) {
        // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
        el.innerHTML = dangerouslySetInnerHTML.__html || '';
        afterLoad();
    } else if (children) {
        el.textContent = typeof children === 'string' ? children : Array.isArray(children) ? children.join('') : '';
        afterLoad();
    } else if (src) {
        el.src = src;
        // do not add cacheKey into LoadCache for remote script here
        // cacheKey will be added to LoadCache when it is actually loaded (see loadPromise above)
        ScriptCache.set(src, loadPromise);
    }
    (0, _setattributesfromprops.setAttributesFromProps)(el, props);
    if (strategy === 'worker') {
        el.setAttribute('type', 'text/partytown');
    }
    el.setAttribute('data-nscript', strategy);
    // Load styles associated with this script
    if (stylesheets) {
        insertStylesheets(stylesheets);
    }
    document.body.appendChild(el);
};
function handleClientScriptLoad(props) {
    const { strategy = 'afterInteractive' } = props;
    if (strategy === 'lazyOnload') {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    } else {
        loadScript(props);
    }
}
function loadLazyScript(props) {
    if (document.readyState === 'complete') {
        (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
    } else {
        window.addEventListener('load', ()=>{
            (0, _requestidlecallback.requestIdleCallback)(()=>loadScript(props));
        });
    }
}
function addBeforeInteractiveToCache() {
    const scripts = [
        ...document.querySelectorAll('[data-nscript="beforeInteractive"]'),
        ...document.querySelectorAll('[data-nscript="beforePageRender"]')
    ];
    scripts.forEach((script)=>{
        const cacheKey = script.id || script.getAttribute('src');
        LoadCache.add(cacheKey);
    });
}
function initScriptLoader(scriptLoaderItems) {
    scriptLoaderItems.forEach(handleClientScriptLoad);
    addBeforeInteractiveToCache();
}
/**
 * Load a third-party scripts in an optimized way.
 *
 * Read more: [Next.js Docs: `next/script`](https://nextjs.org/docs/app/api-reference/components/script)
 */ function Script(props) {
    const { id, src = '', onLoad = ()=>{}, onReady = null, strategy = 'afterInteractive', onError, stylesheets, ...restProps } = props;
    // Context is available only during SSR
    let { updateScripts, scripts, getIsSsr, appDir, nonce } = (0, _react.useContext)(_headmanagercontextsharedruntime.HeadManagerContext);
    // if a nonce is explicitly passed to the script tag, favor that over the automatic handling
    nonce = restProps.nonce || nonce;
    /**
   * - First mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script hasn't loaded yet (not in LoadCache)
   *      onReady is skipped, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. hasLoadScriptEffectCalled.current is false, loadScript executes
   *      Once the script is loaded, the onLoad and onReady will be called by then
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   *
   * - Second mount:
   *   1. The useEffect for onReady executes
   *   2. hasOnReadyEffectCalled.current is false, but the script has already loaded (found in LoadCache)
   *      onReady is called, set hasOnReadyEffectCalled.current to true
   *   3. The useEffect for loadScript executes
   *   4. The script is already loaded, loadScript bails out
   *   [If strict mode is enabled / is wrapped in <OffScreen /> component]
   *   5. The useEffect for onReady executes again
   *   6. hasOnReadyEffectCalled.current is true, so entire effect is skipped
   *   7. The useEffect for loadScript executes again
   *   8. hasLoadScriptEffectCalled.current is true, so entire effect is skipped
   */ const hasOnReadyEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        const cacheKey = id || src;
        if (!hasOnReadyEffectCalled.current) {
            // Run onReady if script has loaded before but component is re-mounted
            if (onReady && cacheKey && LoadCache.has(cacheKey)) {
                onReady();
            }
            hasOnReadyEffectCalled.current = true;
        }
    }, [
        onReady,
        id,
        src
    ]);
    const hasLoadScriptEffectCalled = (0, _react.useRef)(false);
    (0, _react.useEffect)(()=>{
        if (!hasLoadScriptEffectCalled.current) {
            if (strategy === 'afterInteractive') {
                loadScript(props);
            } else if (strategy === 'lazyOnload') {
                loadLazyScript(props);
            }
            hasLoadScriptEffectCalled.current = true;
        }
    }, [
        props,
        strategy
    ]);
    if (strategy === 'beforeInteractive' || strategy === 'worker') {
        if (updateScripts) {
            scripts[strategy] = (scripts[strategy] || []).concat([
                {
                    id,
                    src,
                    onLoad,
                    onReady,
                    onError,
                    ...restProps,
                    nonce
                }
            ]);
            updateScripts(scripts);
        } else if (getIsSsr && getIsSsr()) {
            // Script has already loaded during SSR
            LoadCache.add(id || src);
        } else if (getIsSsr && !getIsSsr()) {
            loadScript({
                ...props,
                nonce
            });
        }
    }
    // For the app directory, we need React Float to preload these scripts.
    if (appDir) {
        // Injecting stylesheets here handles beforeInteractive and worker scripts correctly
        // For other strategies injecting here ensures correct stylesheet order
        // ReactDOM.preinit handles loading the styles in the correct order,
        // also ensures the stylesheet is loaded only once and in a consistent manner
        //
        // Case 1: Styles for beforeInteractive/worker with appDir - handled here
        // Case 2: Styles for beforeInteractive/worker with pages dir - Not handled yet
        // Case 3: Styles for afterInteractive/lazyOnload with appDir - handled here
        // Case 4: Styles for afterInteractive/lazyOnload with pages dir - handled in insertStylesheets function
        if (stylesheets) {
            stylesheets.forEach((styleSrc)=>{
                _reactdom.default.preinit(styleSrc, {
                    as: 'style'
                });
            });
        }
        // Before interactive scripts need to be loaded by Next.js' runtime instead
        // of native <script> tags, because they no longer have `defer`.
        if (strategy === 'beforeInteractive') {
            if (!src) {
                // For inlined scripts, we put the content in `children`.
                if (restProps.dangerouslySetInnerHTML) {
                    // Casting since lib.dom.d.ts doesn't have TrustedHTML yet.
                    restProps.children = restProps.dangerouslySetInnerHTML.__html;
                    delete restProps.dangerouslySetInnerHTML;
                }
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0, _htmlescape.htmlEscapeJsonString)(JSON.stringify([
                            0,
                            {
                                ...restProps,
                                id
                            }
                        ]))})`
                    }
                });
            } else {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("script", {
                    nonce: nonce,
                    dangerouslySetInnerHTML: {
                        __html: `(self.__next_s=self.__next_s||[]).push(${(0, _htmlescape.htmlEscapeJsonString)(JSON.stringify([
                            src,
                            {
                                ...restProps,
                                id
                            }
                        ]))})`
                    }
                });
            }
        } else if (strategy === 'afterInteractive') {
            if (src) {
                // @ts-ignore
                _reactdom.default.preload(src, restProps.integrity ? {
                    as: 'script',
                    integrity: restProps.integrity,
                    nonce,
                    crossOrigin: restProps.crossOrigin
                } : {
                    as: 'script',
                    nonce,
                    crossOrigin: restProps.crossOrigin
                });
            }
        }
    }
    return null;
}
Object.defineProperty(Script, '__nextScript', {
    value: true
});
const _default = Script;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/set-attributes-from-props.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "setAttributesFromProps", {
    enumerable: true,
    get: function() {
        return setAttributesFromProps;
    }
});
const DOMAttributeNames = {
    acceptCharset: 'accept-charset',
    className: 'class',
    htmlFor: 'for',
    httpEquiv: 'http-equiv',
    noModule: 'noModule'
};
const ignoreProps = [
    'onLoad',
    'onReady',
    'dangerouslySetInnerHTML',
    'children',
    'onError',
    'strategy',
    'stylesheets'
];
function isBooleanScriptAttribute(attr) {
    return [
        'async',
        'defer',
        'noModule'
    ].includes(attr);
}
function setAttributesFromProps(el, props) {
    for (const [p, value] of Object.entries(props)){
        if (!props.hasOwnProperty(p)) continue;
        if (ignoreProps.includes(p)) continue;
        // we don't render undefined props to the DOM
        if (value === undefined) {
            continue;
        }
        const attr = DOMAttributeNames[p] || p.toLowerCase();
        if (el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr)) {
            // Correctly assign boolean script attributes
            // https://github.com/vercel/next.js/pull/20748
            ;
            el[attr] = !!value;
        } else {
            el.setAttribute(attr, String(value));
        }
        // Remove falsy non-zero boolean attributes so they are correctly interpreted
        // (e.g. if we set them to false, this coerces to the string "false", which the browser interprets as true)
        if (value === false || el.tagName === 'SCRIPT' && isBooleanScriptAttribute(attr) && (!value || value === 'false')) {
            // Call setAttribute before, as we need to set and unset the attribute to override force async:
            // https://html.spec.whatwg.org/multipage/scripting.html#script-force-async
            el.setAttribute(attr, '');
            el.removeAttribute(attr);
        }
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/trusted-types.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Stores the Trusted Types Policy. Starts as undefined and can be set to null
 * if Trusted Types is not supported in the browser.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "__unsafeCreateTrustedScriptURL", {
    enumerable: true,
    get: function() {
        return __unsafeCreateTrustedScriptURL;
    }
});
let policy;
/**
 * Getter for the Trusted Types Policy. If it is undefined, it is instantiated
 * here or set to null if Trusted Types is not supported in the browser.
 */ function getPolicy() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return policy;
}
function __unsafeCreateTrustedScriptURL(url) {
    return getPolicy()?.createScriptURL(url) || url;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/use-merged-ref.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useMergedRef", {
    enumerable: true,
    get: function() {
        return useMergedRef;
    }
});
const _react = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);
    // NOTE: In theory, we could skip the wrapping if only one of the refs is non-null.
    // (this happens often if the user doesn't pass a ref to Link/Form/Image)
    // But this can cause us to leak a cleanup-ref into user code (previously via `<Link legacyBehavior>`),
    // and the user might pass that ref into ref-merging library that doesn't support cleanup refs
    // (because it hasn't been updated for React 19)
    // which can then cause things to blow up, because a cleanup-returning ref gets called with `null`.
    // So in practice, it's safer to be defensive and always wrap the ref, even on React 19.
    return (0, _react.useCallback)((current)=>{
        if (current === null) {
            const cleanupFnA = cleanupA.current;
            if (cleanupFnA) {
                cleanupA.current = null;
                cleanupFnA();
            }
            const cleanupFnB = cleanupB.current;
            if (cleanupFnB) {
                cleanupB.current = null;
                cleanupFnB();
            }
        } else {
            if (refA) {
                cleanupA.current = applyRef(refA, current);
            }
            if (refB) {
                cleanupB.current = applyRef(refB, current);
            }
        }
    }, [
        refA,
        refB
    ]);
}
function applyRef(refA, current) {
    if (typeof refA === 'function') {
        const cleanup = refA(current);
        if (typeof cleanup === 'function') {
            return cleanup;
        } else {
            return ()=>refA(null);
        }
    } else {
        refA.current = current;
        return ()=>{
            refA.current = null;
        };
    }
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/client/with-router.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return withRouter;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-runtime.js [app-ssr] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)"));
const _router = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/router.js [app-ssr] (ecmascript)");
function withRouter(ComposedComponent) {
    function WithRouterWrapper(props) {
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(ComposedComponent, {
            router: (0, _router.useRouter)(),
            ...props
        });
    }
    WithRouterWrapper.getInitialProps = ComposedComponent.getInitialProps;
    WithRouterWrapper.origGetInitialProps = ComposedComponent.origGetInitialProps;
    if ("TURBOPACK compile-time truthy", 1) {
        const name = ComposedComponent.displayName || ComposedComponent.name || 'Unknown';
        WithRouterWrapper.displayName = `withRouter(${name})`;
    }
    return WithRouterWrapper;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/compiled/gzip-size/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

(()=>{
    var e = {
        166: (e, r, t)=>{
            var n = t(203);
            var o = [
                "write",
                "end",
                "destroy"
            ];
            var i = [
                "resume",
                "pause"
            ];
            var s = [
                "data",
                "close"
            ];
            var c = Array.prototype.slice;
            e.exports = duplex;
            function forEach(e, r) {
                if (e.forEach) {
                    return e.forEach(r);
                }
                for(var t = 0; t < e.length; t++){
                    r(e[t], t);
                }
            }
            function duplex(e, r) {
                var t = new n;
                var a = false;
                forEach(o, proxyWriter);
                forEach(i, proxyReader);
                forEach(s, proxyStream);
                r.on("end", handleEnd);
                e.on("drain", function() {
                    t.emit("drain");
                });
                e.on("error", reemit);
                r.on("error", reemit);
                t.writable = e.writable;
                t.readable = r.readable;
                return t;
                //TURBOPACK unreachable
                ;
                function proxyWriter(r) {
                    t[r] = method;
                    function method() {
                        return e[r].apply(e, arguments);
                    }
                }
                function proxyReader(e) {
                    t[e] = method;
                    function method() {
                        t.emit(e);
                        var n = r[e];
                        if (n) {
                            return n.apply(r, arguments);
                        }
                        r.emit(e);
                    }
                }
                function proxyStream(e) {
                    r.on(e, reemit);
                    function reemit() {
                        var r = c.call(arguments);
                        r.unshift(e);
                        t.emit.apply(t, r);
                    }
                }
                function handleEnd() {
                    if (a) {
                        return;
                    }
                    a = true;
                    var e = c.call(arguments);
                    e.unshift("end");
                    t.emit.apply(t, e);
                }
                function reemit(e) {
                    t.emit("error", e);
                }
            }
        },
        118: (e, r, t)=>{
            "use strict";
            const n = t(896);
            const o = t(203);
            const i = t(106);
            const s = t(166);
            const c = t(420);
            const getOptions = (e)=>Object.assign({
                    level: 9
                }, e);
            e.exports = (e, r)=>{
                if (!e) {
                    return Promise.resolve(0);
                }
                return c(i.gzip)(e, getOptions(r)).then((e)=>e.length).catch((e)=>0);
            };
            e.exports.sync = (e, r)=>i.gzipSync(e, getOptions(r)).length;
            e.exports.stream = (e)=>{
                const r = new o.PassThrough;
                const t = new o.PassThrough;
                const n = s(r, t);
                let c = 0;
                const a = i.createGzip(getOptions(e)).on("data", (e)=>{
                    c += e.length;
                }).on("error", ()=>{
                    n.gzipSize = 0;
                }).on("end", ()=>{
                    n.gzipSize = c;
                    n.emit("gzip-size", c);
                    t.end();
                });
                r.pipe(a);
                r.pipe(t, {
                    end: false
                });
                return n;
            };
            e.exports.file = (r, t)=>new Promise((o, i)=>{
                    const s = n.createReadStream(r);
                    s.on("error", i);
                    const c = s.pipe(e.exports.stream(t));
                    c.on("error", i);
                    c.on("gzip-size", o);
                });
            e.exports.fileSync = (r, t)=>e.exports.sync(n.readFileSync(r), t);
        },
        420: (e)=>{
            "use strict";
            const processFn = (e, r)=>function(...t) {
                    const n = r.promiseModule;
                    return new n((n, o)=>{
                        if (r.multiArgs) {
                            t.push((...e)=>{
                                if (r.errorFirst) {
                                    if (e[0]) {
                                        o(e);
                                    } else {
                                        e.shift();
                                        n(e);
                                    }
                                } else {
                                    n(e);
                                }
                            });
                        } else if (r.errorFirst) {
                            t.push((e, r)=>{
                                if (e) {
                                    o(e);
                                } else {
                                    n(r);
                                }
                            });
                        } else {
                            t.push(n);
                        }
                        e.apply(this, t);
                    });
                };
            e.exports = (e, r)=>{
                r = Object.assign({
                    exclude: [
                        /.+(Sync|Stream)$/
                    ],
                    errorFirst: true,
                    promiseModule: Promise
                }, r);
                const t = typeof e;
                if (!(e !== null && (t === "object" || t === "function"))) {
                    throw new TypeError(`Expected \`input\` to be a \`Function\` or \`Object\`, got \`${e === null ? "null" : t}\``);
                }
                const filter = (e)=>{
                    const match = (r)=>typeof r === "string" ? e === r : r.test(e);
                    return r.include ? r.include.some(match) : !r.exclude.some(match);
                };
                let n;
                if (t === "function") {
                    n = function(...t) {
                        return r.excludeMain ? e(...t) : processFn(e, r).apply(this, t);
                    };
                } else {
                    n = Object.create(Object.getPrototypeOf(e));
                }
                for(const t in e){
                    const o = e[t];
                    n[t] = typeof o === "function" && filter(t) ? processFn(o, r) : o;
                }
                return n;
            };
        },
        896: (e)=>{
            "use strict";
            e.exports = __turbopack_context__.r("[externals]/fs [external] (fs, cjs)");
        },
        203: (e)=>{
            "use strict";
            e.exports = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
        },
        106: (e)=>{
            "use strict";
            e.exports = __turbopack_context__.r("[externals]/zlib [external] (zlib, cjs)");
        }
    };
    var r = {};
    function __nccwpck_require__(t) {
        var n = r[t];
        if (n !== undefined) {
            return n.exports;
        }
        var o = r[t] = {
            exports: {}
        };
        var i = true;
        try {
            e[t](o, o.exports, __nccwpck_require__);
            i = false;
        } finally{
            if (i) delete r[t];
        }
        return o.exports;
    }
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/fincopilot-landing/node_modules/next/dist/compiled/gzip-size") + "/";
    var t = __nccwpck_require__(118);
    module.exports = t;
})();
}),
"[project]/fincopilot-landing/node_modules/next/dist/compiled/path-to-regexp/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

(()=>{
    "use strict";
    if (typeof __nccwpck_require__ !== "undefined") __nccwpck_require__.ab = ("TURBOPACK compile-time value", "/ROOT/fincopilot-landing/node_modules/next/dist/compiled/path-to-regexp") + "/";
    var e = {};
    (()=>{
        var n = e;
        Object.defineProperty(n, "__esModule", {
            value: true
        });
        n.pathToRegexp = n.tokensToRegexp = n.regexpToFunction = n.match = n.tokensToFunction = n.compile = n.parse = void 0;
        function lexer(e) {
            var n = [];
            var r = 0;
            while(r < e.length){
                var t = e[r];
                if (t === "*" || t === "+" || t === "?") {
                    n.push({
                        type: "MODIFIER",
                        index: r,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === "\\") {
                    n.push({
                        type: "ESCAPED_CHAR",
                        index: r++,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === "{") {
                    n.push({
                        type: "OPEN",
                        index: r,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === "}") {
                    n.push({
                        type: "CLOSE",
                        index: r,
                        value: e[r++]
                    });
                    continue;
                }
                if (t === ":") {
                    var a = "";
                    var i = r + 1;
                    while(i < e.length){
                        var o = e.charCodeAt(i);
                        if (o >= 48 && o <= 57 || o >= 65 && o <= 90 || o >= 97 && o <= 122 || o === 95) {
                            a += e[i++];
                            continue;
                        }
                        break;
                    }
                    if (!a) throw new TypeError("Missing parameter name at ".concat(r));
                    n.push({
                        type: "NAME",
                        index: r,
                        value: a
                    });
                    r = i;
                    continue;
                }
                if (t === "(") {
                    var c = 1;
                    var f = "";
                    var i = r + 1;
                    if (e[i] === "?") {
                        throw new TypeError('Pattern cannot start with "?" at '.concat(i));
                    }
                    while(i < e.length){
                        if (e[i] === "\\") {
                            f += e[i++] + e[i++];
                            continue;
                        }
                        if (e[i] === ")") {
                            c--;
                            if (c === 0) {
                                i++;
                                break;
                            }
                        } else if (e[i] === "(") {
                            c++;
                            if (e[i + 1] !== "?") {
                                throw new TypeError("Capturing groups are not allowed at ".concat(i));
                            }
                        }
                        f += e[i++];
                    }
                    if (c) throw new TypeError("Unbalanced pattern at ".concat(r));
                    if (!f) throw new TypeError("Missing pattern at ".concat(r));
                    n.push({
                        type: "PATTERN",
                        index: r,
                        value: f
                    });
                    r = i;
                    continue;
                }
                n.push({
                    type: "CHAR",
                    index: r,
                    value: e[r++]
                });
            }
            n.push({
                type: "END",
                index: r,
                value: ""
            });
            return n;
        }
        function parse(e, n) {
            if (n === void 0) {
                n = {};
            }
            var r = lexer(e);
            var t = n.prefixes, a = t === void 0 ? "./" : t, i = n.delimiter, o = i === void 0 ? "/#?" : i;
            var c = [];
            var f = 0;
            var u = 0;
            var p = "";
            var tryConsume = function(e) {
                if (u < r.length && r[u].type === e) return r[u++].value;
            };
            var mustConsume = function(e) {
                var n = tryConsume(e);
                if (n !== undefined) return n;
                var t = r[u], a = t.type, i = t.index;
                throw new TypeError("Unexpected ".concat(a, " at ").concat(i, ", expected ").concat(e));
            };
            var consumeText = function() {
                var e = "";
                var n;
                while(n = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")){
                    e += n;
                }
                return e;
            };
            var isSafe = function(e) {
                for(var n = 0, r = o; n < r.length; n++){
                    var t = r[n];
                    if (e.indexOf(t) > -1) return true;
                }
                return false;
            };
            var safePattern = function(e) {
                var n = c[c.length - 1];
                var r = e || (n && typeof n === "string" ? n : "");
                if (n && !r) {
                    throw new TypeError('Must have text between two parameters, missing text after "'.concat(n.name, '"'));
                }
                if (!r || isSafe(r)) return "[^".concat(escapeString(o), "]+?");
                return "(?:(?!".concat(escapeString(r), ")[^").concat(escapeString(o), "])+?");
            };
            while(u < r.length){
                var v = tryConsume("CHAR");
                var s = tryConsume("NAME");
                var d = tryConsume("PATTERN");
                if (s || d) {
                    var g = v || "";
                    if (a.indexOf(g) === -1) {
                        p += g;
                        g = "";
                    }
                    if (p) {
                        c.push(p);
                        p = "";
                    }
                    c.push({
                        name: s || f++,
                        prefix: g,
                        suffix: "",
                        pattern: d || safePattern(g),
                        modifier: tryConsume("MODIFIER") || ""
                    });
                    continue;
                }
                var x = v || tryConsume("ESCAPED_CHAR");
                if (x) {
                    p += x;
                    continue;
                }
                if (p) {
                    c.push(p);
                    p = "";
                }
                var h = tryConsume("OPEN");
                if (h) {
                    var g = consumeText();
                    var l = tryConsume("NAME") || "";
                    var m = tryConsume("PATTERN") || "";
                    var T = consumeText();
                    mustConsume("CLOSE");
                    c.push({
                        name: l || (m ? f++ : ""),
                        pattern: l && !m ? safePattern(g) : m,
                        prefix: g,
                        suffix: T,
                        modifier: tryConsume("MODIFIER") || ""
                    });
                    continue;
                }
                mustConsume("END");
            }
            return c;
        }
        n.parse = parse;
        function compile(e, n) {
            return tokensToFunction(parse(e, n), n);
        }
        n.compile = compile;
        function tokensToFunction(e, n) {
            if (n === void 0) {
                n = {};
            }
            var r = flags(n);
            var t = n.encode, a = t === void 0 ? function(e) {
                return e;
            } : t, i = n.validate, o = i === void 0 ? true : i;
            var c = e.map(function(e) {
                if (typeof e === "object") {
                    return new RegExp("^(?:".concat(e.pattern, ")$"), r);
                }
            });
            return function(n) {
                var r = "";
                for(var t = 0; t < e.length; t++){
                    var i = e[t];
                    if (typeof i === "string") {
                        r += i;
                        continue;
                    }
                    var f = n ? n[i.name] : undefined;
                    var u = i.modifier === "?" || i.modifier === "*";
                    var p = i.modifier === "*" || i.modifier === "+";
                    if (Array.isArray(f)) {
                        if (!p) {
                            throw new TypeError('Expected "'.concat(i.name, '" to not repeat, but got an array'));
                        }
                        if (f.length === 0) {
                            if (u) continue;
                            throw new TypeError('Expected "'.concat(i.name, '" to not be empty'));
                        }
                        for(var v = 0; v < f.length; v++){
                            var s = a(f[v], i);
                            if (o && !c[t].test(s)) {
                                throw new TypeError('Expected all "'.concat(i.name, '" to match "').concat(i.pattern, '", but got "').concat(s, '"'));
                            }
                            r += i.prefix + s + i.suffix;
                        }
                        continue;
                    }
                    if (typeof f === "string" || typeof f === "number") {
                        var s = a(String(f), i);
                        if (o && !c[t].test(s)) {
                            throw new TypeError('Expected "'.concat(i.name, '" to match "').concat(i.pattern, '", but got "').concat(s, '"'));
                        }
                        r += i.prefix + s + i.suffix;
                        continue;
                    }
                    if (u) continue;
                    var d = p ? "an array" : "a string";
                    throw new TypeError('Expected "'.concat(i.name, '" to be ').concat(d));
                }
                return r;
            };
        }
        n.tokensToFunction = tokensToFunction;
        function match(e, n) {
            var r = [];
            var t = pathToRegexp(e, r, n);
            return regexpToFunction(t, r, n);
        }
        n.match = match;
        function regexpToFunction(e, n, r) {
            if (r === void 0) {
                r = {};
            }
            var t = r.decode, a = t === void 0 ? function(e) {
                return e;
            } : t;
            return function(r) {
                var t = e.exec(r);
                if (!t) return false;
                var i = t[0], o = t.index;
                var c = Object.create(null);
                var _loop_1 = function(e) {
                    if (t[e] === undefined) return "continue";
                    var r = n[e - 1];
                    if (r.modifier === "*" || r.modifier === "+") {
                        c[r.name] = t[e].split(r.prefix + r.suffix).map(function(e) {
                            return a(e, r);
                        });
                    } else {
                        c[r.name] = a(t[e], r);
                    }
                };
                for(var f = 1; f < t.length; f++){
                    _loop_1(f);
                }
                return {
                    path: i,
                    index: o,
                    params: c
                };
            };
        }
        n.regexpToFunction = regexpToFunction;
        function escapeString(e) {
            return e.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
        }
        function flags(e) {
            return e && e.sensitive ? "" : "i";
        }
        function regexpToRegexp(e, n) {
            if (!n) return e;
            var r = /\((?:\?<(.*?)>)?(?!\?)/g;
            var t = 0;
            var a = r.exec(e.source);
            while(a){
                n.push({
                    name: a[1] || t++,
                    prefix: "",
                    suffix: "",
                    modifier: "",
                    pattern: ""
                });
                a = r.exec(e.source);
            }
            return e;
        }
        function arrayToRegexp(e, n, r) {
            var t = e.map(function(e) {
                return pathToRegexp(e, n, r).source;
            });
            return new RegExp("(?:".concat(t.join("|"), ")"), flags(r));
        }
        function stringToRegexp(e, n, r) {
            return tokensToRegexp(parse(e, r), n, r);
        }
        function tokensToRegexp(e, n, r) {
            if (r === void 0) {
                r = {};
            }
            var t = r.strict, a = t === void 0 ? false : t, i = r.start, o = i === void 0 ? true : i, c = r.end, f = c === void 0 ? true : c, u = r.encode, p = u === void 0 ? function(e) {
                return e;
            } : u, v = r.delimiter, s = v === void 0 ? "/#?" : v, d = r.endsWith, g = d === void 0 ? "" : d;
            var x = "[".concat(escapeString(g), "]|$");
            var h = "[".concat(escapeString(s), "]");
            var l = o ? "^" : "";
            for(var m = 0, T = e; m < T.length; m++){
                var E = T[m];
                if (typeof E === "string") {
                    l += escapeString(p(E));
                } else {
                    var w = escapeString(p(E.prefix));
                    var y = escapeString(p(E.suffix));
                    if (E.pattern) {
                        if (n) n.push(E);
                        if (w || y) {
                            if (E.modifier === "+" || E.modifier === "*") {
                                var R = E.modifier === "*" ? "?" : "";
                                l += "(?:".concat(w, "((?:").concat(E.pattern, ")(?:").concat(y).concat(w, "(?:").concat(E.pattern, "))*)").concat(y, ")").concat(R);
                            } else {
                                l += "(?:".concat(w, "(").concat(E.pattern, ")").concat(y, ")").concat(E.modifier);
                            }
                        } else {
                            if (E.modifier === "+" || E.modifier === "*") {
                                throw new TypeError('Can not repeat "'.concat(E.name, '" without a prefix and suffix'));
                            }
                            l += "(".concat(E.pattern, ")").concat(E.modifier);
                        }
                    } else {
                        l += "(?:".concat(w).concat(y, ")").concat(E.modifier);
                    }
                }
            }
            if (f) {
                if (!a) l += "".concat(h, "?");
                l += !r.endsWith ? "$" : "(?=".concat(x, ")");
            } else {
                var A = e[e.length - 1];
                var _ = typeof A === "string" ? h.indexOf(A[A.length - 1]) > -1 : A === undefined;
                if (!a) {
                    l += "(?:".concat(h, "(?=").concat(x, "))?");
                }
                if (!_) {
                    l += "(?=".concat(h, "|").concat(x, ")");
                }
            }
            return new RegExp(l, flags(r));
        }
        n.tokensToRegexp = tokensToRegexp;
        function pathToRegexp(e, n, r) {
            if (e instanceof RegExp) return regexpToRegexp(e, n);
            if (Array.isArray(e)) return arrayToRegexp(e, n, r);
            return stringToRegexp(e, n, r);
        }
        n.pathToRegexp = pathToRegexp;
    })();
    module.exports = e;
})();
}),
"[project]/fincopilot-landing/node_modules/next/dist/compiled/react-is/cjs/react-is.development.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-is.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "production" !== ("TURBOPACK compile-time value", "development") && function() {
    function typeOf(object) {
        if ("object" === typeof object && null !== object) {
            var $$typeof = object.$$typeof;
            switch($$typeof){
                case REACT_ELEMENT_TYPE:
                    switch(object = object.type, object){
                        case REACT_FRAGMENT_TYPE:
                        case REACT_PROFILER_TYPE:
                        case REACT_STRICT_MODE_TYPE:
                        case REACT_SUSPENSE_TYPE:
                        case REACT_SUSPENSE_LIST_TYPE:
                        case REACT_VIEW_TRANSITION_TYPE:
                            return object;
                        default:
                            switch(object = object && object.$$typeof, object){
                                case REACT_CONTEXT_TYPE:
                                case REACT_FORWARD_REF_TYPE:
                                case REACT_LAZY_TYPE:
                                case REACT_MEMO_TYPE:
                                    return object;
                                case REACT_CONSUMER_TYPE:
                                    return object;
                                default:
                                    return $$typeof;
                            }
                    }
                case REACT_PORTAL_TYPE:
                    return $$typeof;
            }
        }
    }
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
    exports.ContextConsumer = REACT_CONSUMER_TYPE;
    exports.ContextProvider = REACT_CONTEXT_TYPE;
    exports.Element = REACT_ELEMENT_TYPE;
    exports.ForwardRef = REACT_FORWARD_REF_TYPE;
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.Lazy = REACT_LAZY_TYPE;
    exports.Memo = REACT_MEMO_TYPE;
    exports.Portal = REACT_PORTAL_TYPE;
    exports.Profiler = REACT_PROFILER_TYPE;
    exports.StrictMode = REACT_STRICT_MODE_TYPE;
    exports.Suspense = REACT_SUSPENSE_TYPE;
    exports.SuspenseList = REACT_SUSPENSE_LIST_TYPE;
    exports.isContextConsumer = function(object) {
        return typeOf(object) === REACT_CONSUMER_TYPE;
    };
    exports.isContextProvider = function(object) {
        return typeOf(object) === REACT_CONTEXT_TYPE;
    };
    exports.isElement = function(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    };
    exports.isForwardRef = function(object) {
        return typeOf(object) === REACT_FORWARD_REF_TYPE;
    };
    exports.isFragment = function(object) {
        return typeOf(object) === REACT_FRAGMENT_TYPE;
    };
    exports.isLazy = function(object) {
        return typeOf(object) === REACT_LAZY_TYPE;
    };
    exports.isMemo = function(object) {
        return typeOf(object) === REACT_MEMO_TYPE;
    };
    exports.isPortal = function(object) {
        return typeOf(object) === REACT_PORTAL_TYPE;
    };
    exports.isProfiler = function(object) {
        return typeOf(object) === REACT_PROFILER_TYPE;
    };
    exports.isStrictMode = function(object) {
        return typeOf(object) === REACT_STRICT_MODE_TYPE;
    };
    exports.isSuspense = function(object) {
        return typeOf(object) === REACT_SUSPENSE_TYPE;
    };
    exports.isSuspenseList = function(object) {
        return typeOf(object) === REACT_SUSPENSE_LIST_TYPE;
    };
    exports.isValidElementType = function(type) {
        return "string" === typeof type || "function" === typeof type || type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || type === REACT_VIEW_TRANSITION_TYPE || "object" === typeof type && null !== type && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_CONSUMER_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE || void 0 !== type.getModuleId) ? !0 : !1;
    };
    exports.typeOf = typeOf;
}();
}),
"[project]/fincopilot-landing/node_modules/next/dist/compiled/react-is/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/compiled/react-is/cjs/react-is.development.js [app-ssr] (ecmascript)");
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/lib/constants.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ACTION_SUFFIX: null,
    APP_DIR_ALIAS: null,
    CACHE_ONE_YEAR_SECONDS: null,
    DOT_NEXT_ALIAS: null,
    ESLINT_DEFAULT_DIRS: null,
    GSP_NO_RETURNED_VALUE: null,
    GSSP_COMPONENT_MEMBER_ERROR: null,
    GSSP_NO_RETURNED_VALUE: null,
    HTML_CONTENT_TYPE_HEADER: null,
    INFINITE_CACHE: null,
    INSTRUMENTATION_HOOK_FILENAME: null,
    JSON_CONTENT_TYPE_HEADER: null,
    MATCHED_PATH_HEADER: null,
    MIDDLEWARE_FILENAME: null,
    MIDDLEWARE_LOCATION_REGEXP: null,
    NEXT_BODY_SUFFIX: null,
    NEXT_CACHE_IMPLICIT_TAG_ID: null,
    NEXT_CACHE_REVALIDATED_TAGS_HEADER: null,
    NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: null,
    NEXT_CACHE_ROOT_PARAM_TAG_ID: null,
    NEXT_CACHE_SOFT_TAG_MAX_LENGTH: null,
    NEXT_CACHE_TAGS_HEADER: null,
    NEXT_CACHE_TAG_MAX_ITEMS: null,
    NEXT_CACHE_TAG_MAX_LENGTH: null,
    NEXT_DATA_SUFFIX: null,
    NEXT_INTERCEPTION_MARKER_PREFIX: null,
    NEXT_META_SUFFIX: null,
    NEXT_NAV_DEPLOYMENT_ID_HEADER: null,
    NEXT_QUERY_PARAM_PREFIX: null,
    NEXT_RESUME_HEADER: null,
    NEXT_RESUME_STATE_LENGTH_HEADER: null,
    NON_STANDARD_NODE_ENV: null,
    PAGES_DIR_ALIAS: null,
    PRERENDER_REVALIDATE_HEADER: null,
    PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: null,
    PROXY_FILENAME: null,
    PROXY_LOCATION_REGEXP: null,
    PUBLIC_DIR_MIDDLEWARE_CONFLICT: null,
    ROOT_DIR_ALIAS: null,
    RSC_ACTION_CLIENT_WRAPPER_ALIAS: null,
    RSC_ACTION_ENCRYPTION_ALIAS: null,
    RSC_ACTION_PROXY_ALIAS: null,
    RSC_ACTION_VALIDATE_ALIAS: null,
    RSC_CACHE_WRAPPER_ALIAS: null,
    RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS: null,
    RSC_MOD_REF_PROXY_ALIAS: null,
    RSC_SEGMENTS_DIR_SUFFIX: null,
    RSC_SEGMENT_SUFFIX: null,
    RSC_SUFFIX: null,
    SERVER_PROPS_EXPORT_ERROR: null,
    SERVER_PROPS_GET_INIT_PROPS_CONFLICT: null,
    SERVER_PROPS_SSG_CONFLICT: null,
    SERVER_RUNTIME: null,
    SSG_FALLBACK_EXPORT_ERROR: null,
    SSG_GET_INITIAL_PROPS_CONFLICT: null,
    STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: null,
    TEXT_PLAIN_CONTENT_TYPE_HEADER: null,
    UNSTABLE_REVALIDATE_RENAME_ERROR: null,
    WEBPACK_LAYERS: null,
    WEBPACK_RESOURCE_QUERIES: null,
    WEB_SOCKET_MAX_RECONNECTIONS: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ACTION_SUFFIX: function() {
        return ACTION_SUFFIX;
    },
    APP_DIR_ALIAS: function() {
        return APP_DIR_ALIAS;
    },
    CACHE_ONE_YEAR_SECONDS: function() {
        return CACHE_ONE_YEAR_SECONDS;
    },
    DOT_NEXT_ALIAS: function() {
        return DOT_NEXT_ALIAS;
    },
    ESLINT_DEFAULT_DIRS: function() {
        return ESLINT_DEFAULT_DIRS;
    },
    GSP_NO_RETURNED_VALUE: function() {
        return GSP_NO_RETURNED_VALUE;
    },
    GSSP_COMPONENT_MEMBER_ERROR: function() {
        return GSSP_COMPONENT_MEMBER_ERROR;
    },
    GSSP_NO_RETURNED_VALUE: function() {
        return GSSP_NO_RETURNED_VALUE;
    },
    HTML_CONTENT_TYPE_HEADER: function() {
        return HTML_CONTENT_TYPE_HEADER;
    },
    INFINITE_CACHE: function() {
        return INFINITE_CACHE;
    },
    INSTRUMENTATION_HOOK_FILENAME: function() {
        return INSTRUMENTATION_HOOK_FILENAME;
    },
    JSON_CONTENT_TYPE_HEADER: function() {
        return JSON_CONTENT_TYPE_HEADER;
    },
    MATCHED_PATH_HEADER: function() {
        return MATCHED_PATH_HEADER;
    },
    MIDDLEWARE_FILENAME: function() {
        return MIDDLEWARE_FILENAME;
    },
    MIDDLEWARE_LOCATION_REGEXP: function() {
        return MIDDLEWARE_LOCATION_REGEXP;
    },
    NEXT_BODY_SUFFIX: function() {
        return NEXT_BODY_SUFFIX;
    },
    NEXT_CACHE_IMPLICIT_TAG_ID: function() {
        return NEXT_CACHE_IMPLICIT_TAG_ID;
    },
    NEXT_CACHE_REVALIDATED_TAGS_HEADER: function() {
        return NEXT_CACHE_REVALIDATED_TAGS_HEADER;
    },
    NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER: function() {
        return NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER;
    },
    NEXT_CACHE_ROOT_PARAM_TAG_ID: function() {
        return NEXT_CACHE_ROOT_PARAM_TAG_ID;
    },
    NEXT_CACHE_SOFT_TAG_MAX_LENGTH: function() {
        return NEXT_CACHE_SOFT_TAG_MAX_LENGTH;
    },
    NEXT_CACHE_TAGS_HEADER: function() {
        return NEXT_CACHE_TAGS_HEADER;
    },
    NEXT_CACHE_TAG_MAX_ITEMS: function() {
        return NEXT_CACHE_TAG_MAX_ITEMS;
    },
    NEXT_CACHE_TAG_MAX_LENGTH: function() {
        return NEXT_CACHE_TAG_MAX_LENGTH;
    },
    NEXT_DATA_SUFFIX: function() {
        return NEXT_DATA_SUFFIX;
    },
    NEXT_INTERCEPTION_MARKER_PREFIX: function() {
        return NEXT_INTERCEPTION_MARKER_PREFIX;
    },
    NEXT_META_SUFFIX: function() {
        return NEXT_META_SUFFIX;
    },
    NEXT_NAV_DEPLOYMENT_ID_HEADER: function() {
        return NEXT_NAV_DEPLOYMENT_ID_HEADER;
    },
    NEXT_QUERY_PARAM_PREFIX: function() {
        return NEXT_QUERY_PARAM_PREFIX;
    },
    NEXT_RESUME_HEADER: function() {
        return NEXT_RESUME_HEADER;
    },
    NEXT_RESUME_STATE_LENGTH_HEADER: function() {
        return NEXT_RESUME_STATE_LENGTH_HEADER;
    },
    NON_STANDARD_NODE_ENV: function() {
        return NON_STANDARD_NODE_ENV;
    },
    PAGES_DIR_ALIAS: function() {
        return PAGES_DIR_ALIAS;
    },
    PRERENDER_REVALIDATE_HEADER: function() {
        return PRERENDER_REVALIDATE_HEADER;
    },
    PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER: function() {
        return PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER;
    },
    PROXY_FILENAME: function() {
        return PROXY_FILENAME;
    },
    PROXY_LOCATION_REGEXP: function() {
        return PROXY_LOCATION_REGEXP;
    },
    PUBLIC_DIR_MIDDLEWARE_CONFLICT: function() {
        return PUBLIC_DIR_MIDDLEWARE_CONFLICT;
    },
    ROOT_DIR_ALIAS: function() {
        return ROOT_DIR_ALIAS;
    },
    RSC_ACTION_CLIENT_WRAPPER_ALIAS: function() {
        return RSC_ACTION_CLIENT_WRAPPER_ALIAS;
    },
    RSC_ACTION_ENCRYPTION_ALIAS: function() {
        return RSC_ACTION_ENCRYPTION_ALIAS;
    },
    RSC_ACTION_PROXY_ALIAS: function() {
        return RSC_ACTION_PROXY_ALIAS;
    },
    RSC_ACTION_VALIDATE_ALIAS: function() {
        return RSC_ACTION_VALIDATE_ALIAS;
    },
    RSC_CACHE_WRAPPER_ALIAS: function() {
        return RSC_CACHE_WRAPPER_ALIAS;
    },
    RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS: function() {
        return RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS;
    },
    RSC_MOD_REF_PROXY_ALIAS: function() {
        return RSC_MOD_REF_PROXY_ALIAS;
    },
    RSC_SEGMENTS_DIR_SUFFIX: function() {
        return RSC_SEGMENTS_DIR_SUFFIX;
    },
    RSC_SEGMENT_SUFFIX: function() {
        return RSC_SEGMENT_SUFFIX;
    },
    RSC_SUFFIX: function() {
        return RSC_SUFFIX;
    },
    SERVER_PROPS_EXPORT_ERROR: function() {
        return SERVER_PROPS_EXPORT_ERROR;
    },
    SERVER_PROPS_GET_INIT_PROPS_CONFLICT: function() {
        return SERVER_PROPS_GET_INIT_PROPS_CONFLICT;
    },
    SERVER_PROPS_SSG_CONFLICT: function() {
        return SERVER_PROPS_SSG_CONFLICT;
    },
    SERVER_RUNTIME: function() {
        return SERVER_RUNTIME;
    },
    SSG_FALLBACK_EXPORT_ERROR: function() {
        return SSG_FALLBACK_EXPORT_ERROR;
    },
    SSG_GET_INITIAL_PROPS_CONFLICT: function() {
        return SSG_GET_INITIAL_PROPS_CONFLICT;
    },
    STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR: function() {
        return STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR;
    },
    TEXT_PLAIN_CONTENT_TYPE_HEADER: function() {
        return TEXT_PLAIN_CONTENT_TYPE_HEADER;
    },
    UNSTABLE_REVALIDATE_RENAME_ERROR: function() {
        return UNSTABLE_REVALIDATE_RENAME_ERROR;
    },
    WEBPACK_LAYERS: function() {
        return WEBPACK_LAYERS;
    },
    WEBPACK_RESOURCE_QUERIES: function() {
        return WEBPACK_RESOURCE_QUERIES;
    },
    WEB_SOCKET_MAX_RECONNECTIONS: function() {
        return WEB_SOCKET_MAX_RECONNECTIONS;
    }
});
const TEXT_PLAIN_CONTENT_TYPE_HEADER = 'text/plain';
const HTML_CONTENT_TYPE_HEADER = 'text/html; charset=utf-8';
const JSON_CONTENT_TYPE_HEADER = 'application/json; charset=utf-8';
const NEXT_QUERY_PARAM_PREFIX = 'nxtP';
const NEXT_INTERCEPTION_MARKER_PREFIX = 'nxtI';
const MATCHED_PATH_HEADER = 'x-matched-path';
const PRERENDER_REVALIDATE_HEADER = 'x-prerender-revalidate';
const PRERENDER_REVALIDATE_ONLY_GENERATED_HEADER = 'x-prerender-revalidate-if-generated';
const RSC_SEGMENTS_DIR_SUFFIX = '.segments';
const RSC_SEGMENT_SUFFIX = '.segment.rsc';
const RSC_SUFFIX = '.rsc';
const ACTION_SUFFIX = '.action';
const NEXT_DATA_SUFFIX = '.json';
const NEXT_META_SUFFIX = '.meta';
const NEXT_BODY_SUFFIX = '.body';
const NEXT_NAV_DEPLOYMENT_ID_HEADER = 'x-nextjs-deployment-id';
const NEXT_CACHE_TAGS_HEADER = 'x-next-cache-tags';
const NEXT_CACHE_REVALIDATED_TAGS_HEADER = 'x-next-revalidated-tags';
const NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER = 'x-next-revalidate-tag-token';
const NEXT_RESUME_HEADER = 'next-resume';
const NEXT_RESUME_STATE_LENGTH_HEADER = 'x-next-resume-state-length';
const NEXT_CACHE_TAG_MAX_ITEMS = 128;
const NEXT_CACHE_TAG_MAX_LENGTH = 256;
const NEXT_CACHE_SOFT_TAG_MAX_LENGTH = 1024;
const NEXT_CACHE_IMPLICIT_TAG_ID = '_N_T_';
const NEXT_CACHE_ROOT_PARAM_TAG_ID = '_N_RP_';
const CACHE_ONE_YEAR_SECONDS = 31536000;
const INFINITE_CACHE = 0xfffffffe;
const MIDDLEWARE_FILENAME = 'middleware';
const MIDDLEWARE_LOCATION_REGEXP = `(?:src/)?${MIDDLEWARE_FILENAME}`;
const PROXY_FILENAME = 'proxy';
const PROXY_LOCATION_REGEXP = `(?:src/)?${PROXY_FILENAME}`;
const INSTRUMENTATION_HOOK_FILENAME = 'instrumentation';
const PAGES_DIR_ALIAS = 'private-next-pages';
const DOT_NEXT_ALIAS = 'private-dot-next';
const ROOT_DIR_ALIAS = 'private-next-root-dir';
const APP_DIR_ALIAS = 'private-next-app-dir';
const RSC_MOD_REF_PROXY_ALIAS = 'private-next-rsc-mod-ref-proxy';
const RSC_ACTION_VALIDATE_ALIAS = 'private-next-rsc-action-validate';
const RSC_ACTION_PROXY_ALIAS = 'private-next-rsc-server-reference';
const RSC_CACHE_WRAPPER_ALIAS = 'private-next-rsc-cache-wrapper';
const RSC_DYNAMIC_IMPORT_WRAPPER_ALIAS = 'private-next-rsc-track-dynamic-import';
const RSC_ACTION_ENCRYPTION_ALIAS = 'private-next-rsc-action-encryption';
const RSC_ACTION_CLIENT_WRAPPER_ALIAS = 'private-next-rsc-action-client-wrapper';
const PUBLIC_DIR_MIDDLEWARE_CONFLICT = `You can not have a '_next' folder inside of your public folder. This conflicts with the internal '/_next' route. https://nextjs.org/docs/messages/public-next-folder-conflict`;
const SSG_GET_INITIAL_PROPS_CONFLICT = `You can not use getInitialProps with getStaticProps. To use SSG, please remove your getInitialProps`;
const SERVER_PROPS_GET_INIT_PROPS_CONFLICT = `You can not use getInitialProps with getServerSideProps. Please remove getInitialProps.`;
const SERVER_PROPS_SSG_CONFLICT = `You can not use getStaticProps or getStaticPaths with getServerSideProps. To use SSG, please remove getServerSideProps`;
const STATIC_STATUS_PAGE_GET_INITIAL_PROPS_ERROR = `can not have getInitialProps/getServerSideProps, https://nextjs.org/docs/messages/404-get-initial-props`;
const SERVER_PROPS_EXPORT_ERROR = `pages with \`getServerSideProps\` can not be exported. See more info here: https://nextjs.org/docs/messages/gssp-export`;
const GSP_NO_RETURNED_VALUE = 'Your `getStaticProps` function did not return an object. Did you forget to add a `return`?';
const GSSP_NO_RETURNED_VALUE = 'Your `getServerSideProps` function did not return an object. Did you forget to add a `return`?';
const UNSTABLE_REVALIDATE_RENAME_ERROR = 'The `unstable_revalidate` property is available for general use.\n' + 'Please use `revalidate` instead.';
const GSSP_COMPONENT_MEMBER_ERROR = `can not be attached to a page's component and must be exported from the page. See more info here: https://nextjs.org/docs/messages/gssp-component-member`;
const NON_STANDARD_NODE_ENV = `You are using a non-standard "NODE_ENV" value in your environment. This creates inconsistencies in the project and is strongly advised against. Read more: https://nextjs.org/docs/messages/non-standard-node-env`;
const SSG_FALLBACK_EXPORT_ERROR = `Pages with \`fallback\` enabled in \`getStaticPaths\` can not be exported. See more info here: https://nextjs.org/docs/messages/ssg-fallback-true-export`;
const ESLINT_DEFAULT_DIRS = [
    'app',
    'pages',
    'components',
    'lib',
    'src'
];
const SERVER_RUNTIME = {
    edge: 'edge',
    experimentalEdge: 'experimental-edge',
    nodejs: 'nodejs'
};
const WEB_SOCKET_MAX_RECONNECTIONS = 12;
/**
 * The names of the webpack layers. These layers are the primitives for the
 * webpack chunks.
 */ const WEBPACK_LAYERS_NAMES = {
    /**
   * The layer for the shared code between the client and server bundles.
   */ shared: 'shared',
    /**
   * The layer for server-only runtime and picking up `react-server` export conditions.
   * Including app router RSC pages and app router custom routes and metadata routes.
   */ reactServerComponents: 'rsc',
    /**
   * Server Side Rendering layer for app (ssr).
   */ serverSideRendering: 'ssr',
    /**
   * The browser client bundle layer for actions.
   */ actionBrowser: 'action-browser',
    /**
   * The Node.js bundle layer for the API routes.
   */ apiNode: 'api-node',
    /**
   * The Edge Lite bundle layer for the API routes.
   */ apiEdge: 'api-edge',
    /**
   * The layer for the middleware code.
   */ middleware: 'middleware',
    /**
   * The layer for the instrumentation hooks.
   */ instrument: 'instrument',
    /**
   * The layer for assets on the edge.
   */ edgeAsset: 'edge-asset',
    /**
   * The browser client bundle layer for App directory.
   */ appPagesBrowser: 'app-pages-browser',
    /**
   * The browser client bundle layer for Pages directory.
   */ pagesDirBrowser: 'pages-dir-browser',
    /**
   * The Edge Lite bundle layer for Pages directory.
   */ pagesDirEdge: 'pages-dir-edge',
    /**
   * The Node.js bundle layer for Pages directory.
   */ pagesDirNode: 'pages-dir-node'
};
const WEBPACK_LAYERS = {
    ...WEBPACK_LAYERS_NAMES,
    GROUP: {
        builtinReact: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser
        ],
        serverOnly: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
        ],
        neutralTarget: [
            // pages api
            WEBPACK_LAYERS_NAMES.apiNode,
            WEBPACK_LAYERS_NAMES.apiEdge
        ],
        clientOnly: [
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser
        ],
        bundled: [
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.actionBrowser,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.shared,
            WEBPACK_LAYERS_NAMES.instrument,
            WEBPACK_LAYERS_NAMES.middleware
        ],
        appPages: [
            // app router pages and layouts
            WEBPACK_LAYERS_NAMES.reactServerComponents,
            WEBPACK_LAYERS_NAMES.serverSideRendering,
            WEBPACK_LAYERS_NAMES.appPagesBrowser,
            WEBPACK_LAYERS_NAMES.actionBrowser
        ]
    }
};
const WEBPACK_RESOURCE_QUERIES = {
    edgeSSREntry: '__next_edge_ssr_entry__',
    metadata: '__next_metadata__',
    metadataRoute: '__next_metadata_route__',
    metadataImageMeta: '__next_metadata_image_meta__'
};
}),
"[project]/fincopilot-landing/node_modules/next/dist/lib/is-api-route.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isAPIRoute", {
    enumerable: true,
    get: function() {
        return isAPIRoute;
    }
});
function isAPIRoute(value) {
    return value === '/api' || Boolean(value == null ? void 0 : value.startsWith('/api/'));
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/lib/is-error.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    default: null,
    getProperError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    /**
 * Checks whether the given value is a NextError.
 * This can be used to print a more detailed error message with properties like `code` & `digest`.
 */ default: function() {
        return isError;
    },
    getProperError: function() {
        return getProperError;
    }
});
const _isplainobject = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/is-plain-object.js [app-ssr] (ecmascript)");
/**
 * This is a safe stringify function that handles circular references.
 * We're using a simpler version here to avoid introducing
 * the dependency `safe-stable-stringify` into production bundle.
 *
 * This helper is used both in development and production.
 */ function safeStringifyLite(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, (_key, value)=>{
        // If value is an object and already seen, replace with "[Circular]"
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) {
                return '[Circular]';
            }
            seen.add(value);
        }
        return value;
    });
}
function isError(err) {
    return typeof err === 'object' && err !== null && 'name' in err && 'message' in err;
}
function getProperError(err) {
    if (isError(err)) {
        return err;
    }
    if ("TURBOPACK compile-time truthy", 1) {
        // provide better error for case where `throw undefined`
        // is called in development
        if (typeof err === 'undefined') {
            return Object.defineProperty(new Error('An undefined error was thrown, ' + 'see here for more info: https://nextjs.org/docs/messages/threw-undefined'), "__NEXT_ERROR_CODE", {
                value: "E98",
                enumerable: false,
                configurable: true
            });
        }
        if (err === null) {
            return Object.defineProperty(new Error('A null error was thrown, ' + 'see here for more info: https://nextjs.org/docs/messages/threw-undefined'), "__NEXT_ERROR_CODE", {
                value: "E336",
                enumerable: false,
                configurable: true
            });
        }
    }
    return Object.defineProperty(new Error((0, _isplainobject.isPlainObject)(err) ? safeStringifyLite(err) : err + ''), "__NEXT_ERROR_CODE", {
        value: "E394",
        enumerable: false,
        configurable: true
    });
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/lib/route-pattern-normalizer.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PARAM_SEPARATOR: null,
    hasAdjacentParameterIssues: null,
    normalizeAdjacentParameters: null,
    normalizeTokensForRegexp: null,
    stripNormalizedSeparators: null,
    stripParameterSeparators: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PARAM_SEPARATOR: function() {
        return PARAM_SEPARATOR;
    },
    hasAdjacentParameterIssues: function() {
        return hasAdjacentParameterIssues;
    },
    normalizeAdjacentParameters: function() {
        return normalizeAdjacentParameters;
    },
    normalizeTokensForRegexp: function() {
        return normalizeTokensForRegexp;
    },
    stripNormalizedSeparators: function() {
        return stripNormalizedSeparators;
    },
    stripParameterSeparators: function() {
        return stripParameterSeparators;
    }
});
const PARAM_SEPARATOR = '_NEXTSEP_';
function hasAdjacentParameterIssues(route) {
    if (typeof route !== 'string') return false;
    // Check for interception route markers followed immediately by parameters
    // Pattern: /(.):param, /(..):param, /(...):param, /(.)(.):param etc.
    // These patterns cause "Must have text between two parameters" errors
    if (/\/\(\.{1,3}\):[^/\s]+/.test(route)) {
        return true;
    }
    // Check for basic adjacent parameters without separators
    // Pattern: :param1:param2 (but not :param* or other URL patterns)
    if (/:[a-zA-Z_][a-zA-Z0-9_]*:[a-zA-Z_][a-zA-Z0-9_]*/.test(route)) {
        return true;
    }
    return false;
}
function normalizeAdjacentParameters(route) {
    let normalized = route;
    // Handle interception route patterns: (.):param -> (.)_NEXTSEP_:param
    normalized = normalized.replace(/(\([^)]*\)):([^/\s]+)/g, `$1${PARAM_SEPARATOR}:$2`);
    // Handle other adjacent parameter patterns: :param1:param2 -> :param1_NEXTSEP_:param2
    normalized = normalized.replace(/:([^:/\s)]+)(?=:)/g, `:$1${PARAM_SEPARATOR}`);
    return normalized;
}
function normalizeTokensForRegexp(tokens) {
    return tokens.map((token)=>{
        // Token union type: Token = string | TokenObject
        // Literal path segments are strings, parameters/wildcards are objects
        if (typeof token === 'object' && token !== null && // Not all token objects have 'modifier' property (e.g., simple text tokens)
        'modifier' in token && // Only repeating modifiers (* or +) cause the validation error
        // Other modifiers like '?' (optional) are fine
        (token.modifier === '*' || token.modifier === '+') && // Token objects can have different shapes depending on route pattern
        'prefix' in token && 'suffix' in token && // Both prefix and suffix must be empty strings
        // This is what causes the validation error in path-to-regexp
        token.prefix === '' && token.suffix === '') {
            // Add minimal prefix to satisfy path-to-regexp validation
            // We use '/' as it's the most common path delimiter and won't break route matching
            // The prefix gets used in regex generation but doesn't affect parameter extraction
            return {
                ...token,
                prefix: '/'
            };
        }
        return token;
    });
}
function stripNormalizedSeparators(pathname) {
    // Remove separator after interception route markers
    // Pattern: (.)_NEXTSEP_ -> (.), (..)_NEXTSEP_ -> (..), etc.
    // The separator appears after the closing paren of interception markers
    return pathname.replace(new RegExp(`\\)${PARAM_SEPARATOR}`, 'g'), ')');
}
function stripParameterSeparators(params) {
    const cleaned = {};
    for (const [key, value] of Object.entries(params)){
        if (typeof value === 'string') {
            // Remove the separator if it appears at the start of parameter values
            cleaned[key] = value.replace(new RegExp(`^${PARAM_SEPARATOR}`), '');
        } else if (Array.isArray(value)) {
            // Handle array parameters (from repeated route segments)
            cleaned[key] = value.map((item)=>typeof item === 'string' ? item.replace(new RegExp(`^${PARAM_SEPARATOR}`), '') : item);
        } else {
            cleaned[key] = value;
        }
    }
    return cleaned;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/vendored/contexts/head-manager-context.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['contexts'].HeadManagerContext;
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/app-router-types.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * App Router types - Client-safe types for the Next.js App Router
 *
 * This file contains type definitions that can be safely imported
 * by both client-side and server-side code without circular dependencies.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PrefetchHint: null,
    StaticPrefetchDisabled: null,
    SubtreePrefetchHints: null,
    propagateSubtreeBits: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PrefetchHint: function() {
        return PrefetchHint;
    },
    StaticPrefetchDisabled: function() {
        return StaticPrefetchDisabled;
    },
    SubtreePrefetchHints: function() {
        return SubtreePrefetchHints;
    },
    propagateSubtreeBits: function() {
        return propagateSubtreeBits;
    }
});
var PrefetchHint = /*#__PURE__*/ function(PrefetchHint) {
    // NOTE: The 0b00001 bit was previously HasRuntimePrefetch (prefetch:
    // 'allow-runtime'). Partial Prefetching now implies runtime completeness
    // for every segment, so the bit was removed. Do not reuse it without
    // considering caches populated by older builds.
    // This segment or one of its descendants opts into Partial Prefetching, i.e.
    // uses the two-phase (Shell then Speculative) prefetch flow. Set when
    // `prefetch` is 'partial' or 'unstable_eager' (including the defaults
    // implied by the global `partialPrefetching` config). Propagates upward so
    // the root segment reflects the entire subtree.
    //
    // Partial Prefetching segments require RUNTIME COMPLETENESS: a prefetch
    // isn't considered done for such a segment until an entry at least as
    // complete as a runtime response exists. This does NOT mean the segment
    // lacks static data — the server emits static data unconditionally, and the
    // scheduler may attempt a static prefetch first (per
    // ShouldAttemptStaticPrefetch), issuing the runtime request only if the
    // static response's own `needsRuntimeRequest` signal says it would
    // return more.
    PrefetchHint[PrefetchHint["SubtreeHasPartialPrefetching"] = 2] = "SubtreeHasPartialPrefetching";
    // This segment itself has a loading.tsx boundary.
    PrefetchHint[PrefetchHint["SegmentHasLoadingBoundary"] = 4] = "SegmentHasLoadingBoundary";
    // A descendant segment (but not this one) has a loading.tsx boundary.
    // Propagates upward so the root reflects the entire subtree.
    PrefetchHint[PrefetchHint["SubtreeHasLoadingBoundary"] = 8] = "SubtreeHasLoadingBoundary";
    // This segment is at or above the application's root layout — the root layout
    // segment itself and all of its ancestors. A dynamic param in one of these
    // segments is a "root param".
    PrefetchHint[PrefetchHint["IsRootLayoutOrAbove"] = 16] = "IsRootLayoutOrAbove";
    // This segment's response includes its parent's data inlined into it.
    // Set at build time by the segment size measurement pass.
    PrefetchHint[PrefetchHint["ParentInlinedIntoSelf"] = 32] = "ParentInlinedIntoSelf";
    // This segment's data is inlined into one of its children — don't fetch
    // it separately. Set at build time by the segment size measurement pass.
    PrefetchHint[PrefetchHint["InlinedIntoChild"] = 64] = "InlinedIntoChild";
    // On a __PAGE__: this page's response includes the head (metadata/viewport)
    // at the end of its SegmentPrefetch[] array.
    PrefetchHint[PrefetchHint["HeadInlinedIntoSelf"] = 128] = "HeadInlinedIntoSelf";
    // On the root hint node: the head was NOT inlined into any page — fetch
    // it separately. Absence of this bit means the head is bundled into a page.
    PrefetchHint[PrefetchHint["HeadOutlined"] = 256] = "HeadOutlined";
    // The inlining hints in this tree may be stale because the tree was
    // generated before collectPrefetchHints ran (e.g. the initial RSC payload
    // for a fully static page at build time). When writing this tree into the
    // cache, the route entry should be immediately expired so it gets
    // re-fetched with correct hints. Only set during build-time prerendering,
    // never at runtime.
    PrefetchHint[PrefetchHint["InliningHintsStale"] = 512] = "InliningHintsStale";
    // This segment has prefetch = 'force-disabled'. The opt-out is passive
    // and applies to this segment only: it never INITIATES a prefetch — no
    // static data is emitted or fetched, and it's never the reason a runtime
    // prefetch spawns — but it may ride along in a runtime response issued on
    // another segment's behalf. Descendants prefetch normally.
    //
    // TODO: Also set as an internal fallback when the prefetch hints manifest
    // is unavailable (see #91407 mitigations), which only means "no static
    // prefetch data exists" — not a user opt-out. Split the fallback into its
    // own bit so the two intents can diverge.
    PrefetchHint[PrefetchHint["PrefetchDisabled"] = 1024] = "PrefetchDisabled";
    // NOTE: The 0b100000000000 bit was previously SubtreeHasRuntimePrefetch.
    // Partial Prefetching now implies runtime completeness for every segment
    // (see SubtreeHasPartialPrefetching), so the bit was removed. Do not reuse
    // it without considering caches populated by older builds.
    // This segment or one of its descendants prefetches "eagerly" — i.e. its
    // effective prefetch strategy is anything other than 'partial'. Used by
    // App Shells: a non-eager subtree relies on the shared app shell and skips
    // its Speculative prefetch. Propagates upward so the root reflects the
    // entire subtree.
    PrefetchHint[PrefetchHint["SubtreeHasEagerPrefetch"] = 4096] = "SubtreeHasEagerPrefetch";
    // This segment or one of its descendants exports `instant = false`,
    // explicitly opting out of Partial Prefetching. Propagates upward so the root
    // reflects the entire subtree. Used only to suppress the dev-time
    // `<Link prefetch={true}>` warning — unlike PrefetchDisabled, it has no effect
    // on the actual prefetch behavior.
    PrefetchHint[PrefetchHint["SubtreeHasInstantFalse"] = 8192] = "SubtreeHasInstantFalse";
    // The client should attempt a static prefetch for this route: the
    // build-time prerender did not access any runtime data (cookies, headers,
    // searchParams, ...), so a static prefetch is expected to be as complete
    // as a runtime one. A fallback-param access only unsets the bit when the
    // route can never be upgraded from a fallback to a concrete prerender —
    // on an upgradeable route, ISR later produces the concrete prerender a
    // static attempt would hit (until then, the static responses' own
    // signal reports the insufficiency per response). Purely advisory, and
    // both error directions are safe: if set when a runtime request is
    // actually needed, that same response-level signal (the load-bearing
    // `needsRuntimeRequest` promise combined with each segment's `isPartial`)
    // directs the client to follow up — the cost is a wasted static attempt.
    // If unset when static would have sufficed, the client goes straight to a
    // runtime prefetch, which is a superset of the static response — the cost
    // is only reduced cacheability. Like the other bits, this one is computed
    // once per build and stays constant for the build's lifetime; it rides
    // the prefetch-hints manifest into every response that carries hints —
    // `/_tree` prefetch responses and the FlightRouterState of dynamic
    // navigations alike. (Routes missing from the manifest — see the #91407
    // fallbacks — simply never carry it.) Set on every node of the tree, but
    // does not propagate.
    PrefetchHint[PrefetchHint["ShouldAttemptStaticPrefetch"] = 16384] = "ShouldAttemptStaticPrefetch";
    return PrefetchHint;
}({});
const StaticPrefetchDisabled = 1024;
const SubtreePrefetchHints = 2 | 8 | 8192 | 4096;
function propagateSubtreeBits(parentHints, childHints) {
    if (childHints & 2) {
        parentHints |= 2;
    }
    // A child with a loading boundary (directly, or anywhere in its subtree) makes
    // this a SubtreeHasLoadingBoundary on the parent.
    if (childHints & (4 | 8)) {
        parentHints |= 8;
    }
    // And for eager prefetch. The bit is set directly on each eager segment, so
    // there's no separate segment-local flag — propagate it as-is.
    if (childHints & 4096) {
        parentHints |= 4096;
    }
    // And for `instant = false`. Like eager prefetch, the bit is set directly on
    // each opted-out segment, so propagate it as-is.
    if (childHints & 8192) {
        parentHints |= 8192;
    }
    return parentHints;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/bloom-filter.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// minimal implementation MurmurHash2 hash function
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BloomFilter", {
    enumerable: true,
    get: function() {
        return BloomFilter;
    }
});
function murmurhash2(str) {
    let h = 0;
    for(let i = 0; i < str.length; i++){
        const c = str.charCodeAt(i);
        h = Math.imul(h ^ c, 0x5bd1e995);
        h ^= h >>> 13;
        h = Math.imul(h, 0x5bd1e995);
    }
    return h >>> 0;
}
// default to 0.01% error rate as the filter compresses very well
const DEFAULT_ERROR_RATE = 0.0001;
class BloomFilter {
    constructor(numItems, errorRate = DEFAULT_ERROR_RATE){
        this.numItems = numItems;
        this.errorRate = errorRate;
        this.numBits = Math.ceil(-(numItems * Math.log(errorRate)) / (Math.log(2) * Math.log(2)));
        this.numHashes = Math.ceil(this.numBits / numItems * Math.log(2));
        this.bitArray = new Array(this.numBits).fill(0);
    }
    static from(items, errorRate = DEFAULT_ERROR_RATE) {
        const filter = new BloomFilter(items.length, errorRate);
        for (const item of items){
            filter.add(item);
        }
        return filter;
    }
    export() {
        const data = {
            numItems: this.numItems,
            errorRate: this.errorRate,
            numBits: this.numBits,
            numHashes: this.numHashes,
            bitArray: this.bitArray
        };
        if ("TURBOPACK compile-time truthy", 1) {
            if (this.errorRate < DEFAULT_ERROR_RATE) {
                const filterData = JSON.stringify(data);
                const gzipSize = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/compiled/gzip-size/index.js [app-ssr] (ecmascript)").sync(filterData);
                if (gzipSize > 1024) {
                    console.warn(`Creating filter with error rate less than 0.1% (0.001) can increase the size dramatically proceed with caution. Received error rate ${this.errorRate} resulted in size ${filterData.length} bytes, ${gzipSize} bytes (gzip)`);
                }
            }
        }
        return data;
    }
    import(data) {
        this.numItems = data.numItems;
        this.errorRate = data.errorRate;
        this.numBits = data.numBits;
        this.numHashes = data.numHashes;
        this.bitArray = data.bitArray;
    }
    add(item) {
        const hashValues = this.getHashValues(item);
        hashValues.forEach((hash)=>{
            this.bitArray[hash] = 1;
        });
    }
    contains(item) {
        const hashValues = this.getHashValues(item);
        return hashValues.every((hash)=>this.bitArray[hash]);
    }
    getHashValues(item) {
        const hashValues = [];
        for(let i = 1; i <= this.numHashes; i++){
            const hash = murmurhash2(`${item}${i}`) % this.numBits;
            hashValues.push(hash);
        }
        return hashValues;
    }
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/deployment-id.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getAssetToken: null,
    getAssetTokenQuery: null,
    getDeploymentId: null,
    getDeploymentIdQuery: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getAssetToken: function() {
        return getAssetToken;
    },
    getAssetTokenQuery: function() {
        return getAssetTokenQuery;
    },
    getDeploymentId: function() {
        return getDeploymentId;
    },
    getDeploymentIdQuery: function() {
        return getDeploymentIdQuery;
    }
});
let deploymentId;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    // Client side: replaced with globalThis.NEXT_DEPLOYMENT_ID
    // Server side: left as is or replaced with a string or replaced with false
    deploymentId = ("TURBOPACK compile-time value", false) || undefined;
}
function getDeploymentId() {
    return deploymentId;
}
function getDeploymentIdQuery(ampersand = false) {
    let id = getDeploymentId();
    if (id) {
        return `${ampersand ? '&' : '?'}dpl=${id}`;
    }
    return '';
}
function getAssetToken() {
    return ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : ("TURBOPACK compile-time value", false);
}
function getAssetTokenQuery(ampersand = false) {
    let id = getAssetToken();
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return '';
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/encode-uri-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/escape-regexp.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// regexp is based on https://github.com/sindresorhus/escape-string-regexp
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "escapeStringRegexp", {
    enumerable: true,
    get: function() {
        return escapeStringRegexp;
    }
});
const reHasRegExp = /[|\\{}()[\]^$+*?.-]/;
const reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
function escapeStringRegexp(str) {
    // see also: https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/escapeRegExp.js#L23
    if (reHasRegExp.test(str)) {
        return str.replace(reReplaceRegExp, '\\$&');
    }
    return str;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/hash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// http://www.cse.yorku.ca/~oz/hash.html
// More specifically, 32-bit hash via djbxor
// (ref: https://gist.github.com/eplawless/52813b1d8ad9af510d85?permalink_comment_id=3367765#gistcomment-3367765)
// This is due to number type differences between rust for turbopack to js number types,
// where rust does not have easy way to repreesnt js's 53-bit float number type for the matching
// overflow behavior. This is more `correct` in terms of having canonical hash across different runtime / implementation
// as can gaurantee determinstic output from 32bit hash.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    djb2Hash: null,
    hexHash: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    djb2Hash: function() {
        return djb2Hash;
    },
    hexHash: function() {
        return hexHash;
    }
});
function djb2Hash(str) {
    let hash = 5381;
    for(let i = 0; i < str.length; i++){
        const char = str.charCodeAt(i);
        hash = (hash << 5) + hash + char & 0xffffffff;
    }
    return hash >>> 0;
}
function hexHash(str) {
    return djb2Hash(str).toString(36).slice(0, 5);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/htmlescape.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This utility is based on https://github.com/zertosh/htmlescape
// License: https://github.com/zertosh/htmlescape/blob/0527ca7156a524d256101bb310a9f970f63078ad/LICENSE
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    ESCAPE_REGEX: null,
    htmlEscapeAttributeString: null,
    htmlEscapeJsonString: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    ESCAPE_REGEX: function() {
        return ESCAPE_REGEX;
    },
    htmlEscapeAttributeString: function() {
        return htmlEscapeAttributeString;
    },
    htmlEscapeJsonString: function() {
        return htmlEscapeJsonString;
    }
});
const ESCAPE_LOOKUP = {
    '&': '\\u0026',
    '>': '\\u003e',
    '<': '\\u003c',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
const ESCAPE_REGEX = /[&><\u2028\u2029]/g;
const ATTRIBUTE_ESCAPE_LOOKUP = {
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#39;',
    '<': '&lt;',
    '>': '&gt;'
};
const ATTRIBUTE_ESCAPE_REGEX = /[&"'<>]/g;
function htmlEscapeJsonString(str) {
    return str.replace(ESCAPE_REGEX, (match)=>ESCAPE_LOOKUP[match]);
}
function htmlEscapeAttributeString(str) {
    return str.replace(ATTRIBUTE_ESCAPE_REGEX, (match)=>ATTRIBUTE_ESCAPE_LOOKUP[match]);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizeLocalePath", {
    enumerable: true,
    get: function() {
        return normalizeLocalePath;
    }
});
/**
 * A cache of lowercased locales for each list of locales. This is stored as a
 * WeakMap so if the locales are garbage collected, the cache entry will be
 * removed as well.
 */ const cache = new WeakMap();
function normalizeLocalePath(pathname, locales) {
    // If locales is undefined, return the pathname as is.
    if (!locales) return {
        pathname
    };
    // Get the cached lowercased locales or create a new cache entry.
    let lowercasedLocales = cache.get(locales);
    if (!lowercasedLocales) {
        lowercasedLocales = locales.map((locale)=>locale.toLowerCase());
        cache.set(locales, lowercasedLocales);
    }
    let detectedLocale;
    // The first segment will be empty, because it has a leading `/`. If
    // there is no further segment, there is no locale (or it's the default).
    const segments = pathname.split('/', 2);
    // If there's no second segment (ie, the pathname is just `/`), there's no
    // locale.
    if (!segments[1]) return {
        pathname
    };
    // The second segment will contain the locale part if any.
    const segment = segments[1].toLowerCase();
    // See if the segment matches one of the locales. If it doesn't, there is
    // no locale (or it's the default).
    const index = lowercasedLocales.indexOf(segment);
    if (index < 0) return {
        pathname
    };
    // Return the case-sensitive locale.
    detectedLocale = locales[index];
    // Remove the `/${locale}` part of the pathname.
    pathname = pathname.slice(detectedLocale.length + 1) || '/';
    return {
        pathname,
        detectedLocale
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/is-plain-object.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getObjectClassLabel: null,
    isPlainObject: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getObjectClassLabel: function() {
        return getObjectClassLabel;
    },
    isPlainObject: function() {
        return isPlainObject;
    }
});
function getObjectClassLabel(value) {
    return Object.prototype.toString.call(value);
}
function isPlainObject(value) {
    if (getObjectClassLabel(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    /**
   * this used to be previously:
   *
   * `return prototype === null || prototype === Object.prototype`
   *
   * but Edge Runtime expose Object from vm, being that kind of type-checking wrongly fail.
   *
   * It was changed to the current implementation since it's resilient to serialization.
   */ return prototype === null || prototype.hasOwnProperty('isPrototypeOf');
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/mitt.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/*
MIT License

Copyright (c) Jason Miller (https://jasonformat.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/ // This file is based on https://github.com/developit/mitt/blob/v1.1.3/src/index.js
// It's been edited for the needs of this script
// See the LICENSE at the top of the file
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return mitt;
    }
});
function mitt() {
    const all = Object.create(null);
    return {
        on (type, handler) {
            ;
            (all[type] || (all[type] = [])).push(handler);
        },
        off (type, handler) {
            if (all[type]) {
                all[type].splice(all[type].indexOf(handler) >>> 0, 1);
            }
        },
        emit (type, ...evts) {
            // eslint-disable-next-line array-callback-return
            ;
            (all[type] || []).slice().map((handler)=>{
                handler(...evts);
            });
        }
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/page-path/denormalize-page-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "denormalizePagePath", {
    enumerable: true,
    get: function() {
        return denormalizePagePath;
    }
});
const _utils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/index.js [app-ssr] (ecmascript)");
const _normalizepathsep = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/page-path/normalize-path-sep.js [app-ssr] (ecmascript)");
function denormalizePagePath(page) {
    let _page = (0, _normalizepathsep.normalizePathSep)(page);
    return _page.startsWith('/index/') && !(0, _utils.isDynamicRoute)(_page) ? _page.slice(6) : _page !== '/index' ? _page : '/';
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/page-path/ensure-leading-slash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * For a given page path, this function ensures that there is a leading slash.
 * If there is not a leading slash, one is added, otherwise it is noop.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ensureLeadingSlash", {
    enumerable: true,
    get: function() {
        return ensureLeadingSlash;
    }
});
function ensureLeadingSlash(path) {
    return path.startsWith('/') ? path : `/${path}`;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/page-path/normalize-path-sep.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * For a given page path, this function ensures that there is no backslash
 * escaping slashes in the path. Example:
 *  - `foo\/bar\/baz` -> `foo/bar/baz`
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "normalizePathSep", {
    enumerable: true,
    get: function() {
        return normalizePathSep;
    }
});
function normalizePathSep(path) {
    return path.replace(/\\/g, '/');
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/router.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createKey: null,
    default: null,
    matchesMiddleware: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createKey: function() {
        return createKey;
    },
    default: function() {
        return Router;
    },
    matchesMiddleware: function() {
        return matchesMiddleware;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-ssr] (ecmascript)");
const _interop_require_wildcard = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _removetrailingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-ssr] (ecmascript)");
const _routeloader = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/route-loader.js [app-ssr] (ecmascript)");
const _script = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/script.js [app-ssr] (ecmascript)");
const _iserror = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/is-error.js [app-ssr] (ecmascript)"));
const _denormalizepagepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/page-path/denormalize-page-path.js [app-ssr] (ecmascript)");
const _normalizelocalepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js [app-ssr] (ecmascript)");
const _mitt = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/mitt.js [app-ssr] (ecmascript)"));
const _utils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _isdynamic = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-dynamic.js [app-ssr] (ecmascript)");
const _parserelativeurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js [app-ssr] (ecmascript)");
const _routematcher = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-matcher.js [app-ssr] (ecmascript)");
const _routeregex = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-regex.js [app-ssr] (ecmascript)");
const _dynamicfilterpattern = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/dynamic-filter-pattern.js [app-ssr] (ecmascript)");
const _formaturl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-ssr] (ecmascript)");
const _detectdomainlocale = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/detect-domain-locale.js [app-ssr] (ecmascript)");
const _parsepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
const _addlocale = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/add-locale.js [app-ssr] (ecmascript)");
const _removelocale = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/remove-locale.js [app-ssr] (ecmascript)");
const _removebasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/remove-base-path.js [app-ssr] (ecmascript)");
const _addbasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/add-base-path.js [app-ssr] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/has-base-path.js [app-ssr] (ecmascript)");
const _resolvehref = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/resolve-href.js [app-ssr] (ecmascript)");
const _isapiroute = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/is-api-route.js [app-ssr] (ecmascript)");
const _getnextpathnameinfo = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js [app-ssr] (ecmascript)");
const _formatnextpathnameinfo = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js [app-ssr] (ecmascript)");
const _comparestates = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/compare-states.js [app-ssr] (ecmascript)");
const _islocalurl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-ssr] (ecmascript)");
const _isbot = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-bot.js [app-ssr] (ecmascript)");
const _omit = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/omit.js [app-ssr] (ecmascript)");
const _interpolateas = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interpolate-as.js [app-ssr] (ecmascript)");
const _disablesmoothscroll = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-ssr] (ecmascript)");
const _constants = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/constants.js [app-ssr] (ecmascript)");
const _deploymentid = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/deployment-id.js [app-ssr] (ecmascript)");
const _javascripturl = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/lib/javascript-url.js [app-ssr] (ecmascript)");
let resolveRewrites;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
function buildCancellationError() {
    return Object.assign(Object.defineProperty(new Error('Route Cancelled'), "__NEXT_ERROR_CODE", {
        value: "E315",
        enumerable: false,
        configurable: true
    }), {
        cancelled: true
    });
}
async function matchesMiddleware(options) {
    const matchers = await Promise.resolve(options.router.pageLoader.getMiddleware());
    if (!matchers) return false;
    const { pathname: asPathname } = (0, _parsepath.parsePath)(options.asPath);
    // remove basePath first since path prefix has to be in the order of `/${basePath}/${locale}`
    const cleanedAs = (0, _hasbasepath.hasBasePath)(asPathname) ? (0, _removebasepath.removeBasePath)(asPathname) : asPathname;
    const asWithBasePathAndLocale = (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(cleanedAs, options.locale));
    // Check only path match on client. Matching "has" should be done on server
    // where we can access more info such as headers, HttpOnly cookie, etc.
    return matchers.some((m)=>new RegExp(m.regexp).test(asWithBasePathAndLocale));
}
function stripOrigin(url) {
    const origin = (0, _utils.getLocationOrigin)();
    return url.startsWith(origin) ? url.substring(origin.length) : url;
}
function prepareUrlAs(router, url, as) {
    // If url and as provided as an object representation,
    // we'll format them into the string version here.
    let [resolvedHref, resolvedAs] = (0, _resolvehref.resolveHref)(router, url, true);
    const origin = (0, _utils.getLocationOrigin)();
    const hrefWasAbsolute = resolvedHref.startsWith(origin);
    const asWasAbsolute = resolvedAs && resolvedAs.startsWith(origin);
    resolvedHref = stripOrigin(resolvedHref);
    resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
    const preparedUrl = hrefWasAbsolute ? resolvedHref : (0, _addbasepath.addBasePath)(resolvedHref);
    const preparedAs = as ? stripOrigin((0, _resolvehref.resolveHref)(router, as)) : resolvedAs || resolvedHref;
    return {
        url: preparedUrl,
        as: asWasAbsolute ? preparedAs : (0, _addbasepath.addBasePath)(preparedAs)
    };
}
function resolveDynamicRoute(pathname, pages) {
    const cleanPathname = (0, _removetrailingslash.removeTrailingSlash)((0, _denormalizepagepath.denormalizePagePath)(pathname));
    if (cleanPathname === '/404' || cleanPathname === '/_error') {
        return pathname;
    }
    // handle resolving href for dynamic routes
    if (!pages.includes(cleanPathname)) {
        // eslint-disable-next-line array-callback-return
        pages.some((page)=>{
            if ((0, _isdynamic.isDynamicRoute)(page) && (0, _routeregex.getRouteRegex)(page).re.test(cleanPathname)) {
                pathname = page;
                return true;
            }
        });
    }
    return (0, _removetrailingslash.removeTrailingSlash)(pathname);
}
function getMiddlewareData(source, response, options) {
    const nextConfig = {
        basePath: options.router.basePath,
        i18n: {
            locales: options.router.locales
        },
        trailingSlash: Boolean(("TURBOPACK compile-time value", false))
    };
    const rewriteHeader = response.headers.get('x-nextjs-rewrite');
    let rewriteTarget = rewriteHeader || response.headers.get('x-nextjs-matched-path');
    const matchedPath = response.headers.get(_constants.MATCHED_PATH_HEADER);
    if (matchedPath && !rewriteTarget && !matchedPath.includes('__next_data_catchall') && !matchedPath.includes('/_error') && !matchedPath.includes('/404')) {
        // leverage x-matched-path to detect next.config.js rewrites
        rewriteTarget = matchedPath;
    }
    if (rewriteTarget) {
        if (rewriteTarget.startsWith('/') || ("TURBOPACK compile-time value", false)) {
            const parsedRewriteTarget = (0, _parserelativeurl.parseRelativeUrl)(rewriteTarget);
            const pathnameInfo = (0, _getnextpathnameinfo.getNextPathnameInfo)(parsedRewriteTarget.pathname, {
                nextConfig,
                parseData: true
            });
            let fsPathname = (0, _removetrailingslash.removeTrailingSlash)(pathnameInfo.pathname);
            return Promise.all([
                options.router.pageLoader.getPageList(),
                (0, _routeloader.getClientBuildManifest)()
            ]).then(([pages, { __rewrites: rewrites }])=>{
                let as = (0, _addlocale.addLocale)(pathnameInfo.pathname, pathnameInfo.locale);
                if ((0, _isdynamic.isDynamicRoute)(as) || !rewriteHeader && pages.includes((0, _normalizelocalepath.normalizeLocalePath)((0, _removebasepath.removeBasePath)(as), options.router.locales).pathname)) {
                    const parsedSource = (0, _getnextpathnameinfo.getNextPathnameInfo)((0, _parserelativeurl.parseRelativeUrl)(source).pathname, {
                        // Pass basePath (and trailingSlash) so the basePath prefix is
                        // stripped before the `_next/data/` check, but omit `i18n` so the
                        // locale prefix is preserved here — the rewrite resolver below
                        // handles the locale-prefixed `as`.
                        nextConfig: {
                            basePath: nextConfig.basePath,
                            trailingSlash: nextConfig.trailingSlash
                        },
                        parseData: true
                    });
                    as = (0, _addbasepath.addBasePath)(parsedSource.pathname);
                    parsedRewriteTarget.pathname = as;
                }
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                else if (!pages.includes(fsPathname)) {
                    const resolvedPathname = resolveDynamicRoute(fsPathname, pages);
                    if (resolvedPathname !== fsPathname) {
                        fsPathname = resolvedPathname;
                    }
                }
                const resolvedHref = !pages.includes(fsPathname) ? resolveDynamicRoute((0, _normalizelocalepath.normalizeLocalePath)((0, _removebasepath.removeBasePath)(parsedRewriteTarget.pathname), options.router.locales).pathname, pages) : fsPathname;
                if ((0, _isdynamic.isDynamicRoute)(resolvedHref)) {
                    const matches = (0, _routematcher.getRouteMatcher)((0, _routeregex.getRouteRegex)(resolvedHref))(as);
                    Object.assign(parsedRewriteTarget.query, matches || {});
                }
                return {
                    type: 'rewrite',
                    parsedAs: parsedRewriteTarget,
                    resolvedHref
                };
            });
        }
        const src = (0, _parsepath.parsePath)(source);
        const pathname = (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
            ...(0, _getnextpathnameinfo.getNextPathnameInfo)(src.pathname, {
                nextConfig,
                parseData: true
            }),
            defaultLocale: options.router.defaultLocale,
            buildId: ''
        });
        return Promise.resolve({
            type: 'redirect-external',
            destination: `${pathname}${src.query}${src.hash}`
        });
    }
    const redirectTarget = response.headers.get('x-nextjs-redirect');
    if (redirectTarget) {
        if (redirectTarget.startsWith('/')) {
            const src = (0, _parsepath.parsePath)(redirectTarget);
            const pathname = (0, _formatnextpathnameinfo.formatNextPathnameInfo)({
                ...(0, _getnextpathnameinfo.getNextPathnameInfo)(src.pathname, {
                    nextConfig,
                    parseData: true
                }),
                defaultLocale: options.router.defaultLocale,
                buildId: ''
            });
            return Promise.resolve({
                type: 'redirect-internal',
                newAs: `${pathname}${src.query}${src.hash}`,
                newUrl: `${pathname}${src.query}${src.hash}`
            });
        }
        return Promise.resolve({
            type: 'redirect-external',
            destination: redirectTarget
        });
    }
    return Promise.resolve({
        type: 'next'
    });
}
async function withMiddlewareEffects(options) {
    const matches = await matchesMiddleware(options);
    if (!matches || !options.fetchData) {
        return null;
    }
    const data = await options.fetchData();
    const effect = await getMiddlewareData(data.dataHref, data.response, options);
    return {
        dataHref: data.dataHref,
        json: data.json,
        response: data.response,
        text: data.text,
        cacheKey: data.cacheKey,
        effect
    };
}
const manualScrollRestoration = ("TURBOPACK compile-time value", false) && ("TURBOPACK compile-time value", "undefined") !== 'undefined' && 'scrollRestoration' in window.history && !!function() {
    try {
        let v = '__next';
        return sessionStorage.setItem(v, v), sessionStorage.removeItem(v), true;
    } catch (n) {}
}();
const SSG_DATA_NOT_FOUND = Symbol('SSG_DATA_NOT_FOUND');
function fetchRetry(url, attempts, options) {
    return fetch(url, {
        // Cookies are required to be present for Next.js' SSG "Preview Mode".
        // Cookies may also be required for `getServerSideProps`.
        //
        // > `fetch` won’t send cookies, unless you set the credentials init
        // > option.
        // https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
        //
        // > For maximum browser compatibility when it comes to sending &
        // > receiving cookies, always supply the `credentials: 'same-origin'`
        // > option instead of relying on the default.
        // https://github.com/github/fetch#caveats
        credentials: 'same-origin',
        method: options.method || 'GET',
        headers: Object.assign({}, options.headers, {
            'x-nextjs-data': '1'
        })
    }).then((response)=>{
        return !response.ok && attempts > 1 && response.status >= 500 ? fetchRetry(url, attempts - 1, options) : response;
    });
}
function tryToParseAsJSON(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        return null;
    }
}
function fetchNextData({ dataHref, inflightCache, isPrefetch, hasMiddleware, isServerRender, parseJSON, persistCache, isBackground, unstable_skipClientCache }) {
    const { href: cacheKey } = new URL(dataHref, window.location.href);
    const deploymentId = (0, _deploymentid.getDeploymentId)();
    const getData = (params)=>fetchRetry(dataHref, isServerRender ? 3 : 1, {
            headers: Object.assign({}, isPrefetch ? {
                purpose: 'prefetch'
            } : {}, isPrefetch && hasMiddleware ? {
                'x-middleware-prefetch': '1'
            } : {}, deploymentId ? {
                'x-deployment-id': deploymentId
            } : {}),
            method: params?.method ?? 'GET'
        }).then((response)=>{
            if (response.ok && params?.method === 'HEAD') {
                return {
                    dataHref,
                    response,
                    text: '',
                    json: {},
                    cacheKey
                };
            }
            return response.text().then((text)=>{
                if (!response.ok) {
                    /**
             * When the data response is a redirect because of a middleware
             * we do not consider it an error. The headers must bring the
             * mapped location.
             * TODO: Change the status code in the handler.
             */ if (hasMiddleware && [
                        301,
                        302,
                        307,
                        308
                    ].includes(response.status)) {
                        return {
                            dataHref,
                            response,
                            text,
                            json: {},
                            cacheKey
                        };
                    }
                    if (response.status === 404) {
                        if (tryToParseAsJSON(text)?.notFound) {
                            return {
                                dataHref,
                                json: {
                                    notFound: SSG_DATA_NOT_FOUND
                                },
                                response,
                                text,
                                cacheKey
                            };
                        }
                    }
                    const error = Object.defineProperty(new Error(`Failed to load static props`), "__NEXT_ERROR_CODE", {
                        value: "E124",
                        enumerable: false,
                        configurable: true
                    });
                    /**
             * We should only trigger a server-side transition if this was
             * caused on a client-side transition. Otherwise, we'd get into
             * an infinite loop.
             */ if (!isServerRender) {
                        (0, _routeloader.markAssetError)(error);
                    }
                    throw error;
                }
                let dplResponseHeader = response.headers.get(_constants.NEXT_NAV_DEPLOYMENT_ID_HEADER);
                if (dplResponseHeader != null && dplResponseHeader !== deploymentId) {
                    // When not found, or we want to force a MPA navigation because of Skew Protection
                    const error = Object.defineProperty(new Error(`Loaded static props were from an outdated deployment, forcing a hard reload`), "__NEXT_ERROR_CODE", {
                        value: "E989",
                        enumerable: false,
                        configurable: true
                    });
                    /**
             * We should only trigger a server-side transition if this was
             * caused on a client-side transition. Otherwise, we'd get into
             * an infinite loop.
             */ if (!isServerRender) {
                        (0, _routeloader.markAssetError)(error);
                    }
                    throw error;
                }
                return {
                    dataHref,
                    json: parseJSON ? tryToParseAsJSON(text) : null,
                    response,
                    text,
                    cacheKey
                };
            });
        }).then((data)=>{
            if (!persistCache || ("TURBOPACK compile-time value", "development") !== 'production' || data.response.headers.get('x-middleware-cache') === 'no-cache') {
                delete inflightCache[cacheKey];
            }
            return data;
        }).catch((err)=>{
            if (!unstable_skipClientCache) {
                delete inflightCache[cacheKey];
            }
            if (err.message === 'Failed to fetch' || // firefox
            err.message === 'NetworkError when attempting to fetch resource.' || // safari
            err.message === 'Load failed') {
                (0, _routeloader.markAssetError)(err);
            }
            throw err;
        });
    // when skipping client cache we wait to update
    // inflight cache until successful data response
    // this allows racing click event with fetching newer data
    // without blocking navigation when stale data is available
    if (unstable_skipClientCache && persistCache) {
        return getData({}).then((data)=>{
            if (data.response.headers.get('x-middleware-cache') !== 'no-cache') {
                // only update cache if not marked as no-cache
                inflightCache[cacheKey] = Promise.resolve(data);
            }
            return data;
        });
    }
    if (inflightCache[cacheKey] !== undefined) {
        return inflightCache[cacheKey];
    }
    return inflightCache[cacheKey] = getData(isBackground ? {
        method: 'HEAD'
    } : {});
}
function createKey() {
    return Math.random().toString(36).slice(2, 10);
}
function handleHardNavigation({ url, router }) {
    // ensure we don't trigger a hard navigation to the same
    // URL as this can end up with an infinite refresh
    if (url === (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(router.asPath, router.locale))) {
        throw Object.defineProperty(new Error(`Invariant: attempted to hard navigate to the same URL ${url} ${location.href}`), "__NEXT_ERROR_CODE", {
            value: "E282",
            enumerable: false,
            configurable: true
        });
    }
    window.location.href = url;
}
const getCancelledHandler = ({ route, router })=>{
    let cancelled = false;
    const cancel = router.clc = ()=>{
        cancelled = true;
    };
    const handleCancelled = ()=>{
        if (cancelled) {
            const error = Object.defineProperty(new Error(`Abort fetching component for route: "${route}"`), "__NEXT_ERROR_CODE", {
                value: "E483",
                enumerable: false,
                configurable: true
            });
            error.cancelled = true;
            throw error;
        }
        if (cancel === router.clc) {
            router.clc = null;
        }
    };
    return handleCancelled;
};
class Router {
    static{
        this.events = (0, _mitt.default)();
    }
    constructor(pathname, query, as, { initialProps, pageLoader, App, wrapApp, Component, err, subscription, isFallback, locale, locales, defaultLocale, domainLocales, isPreview }){
        // Server Data Cache (full data requests)
        this.sdc = {};
        // Server Background Cache (HEAD requests)
        this.sbc = {};
        this.isFirstPopStateEvent = true;
        this._key = createKey();
        this.onPopState = (e)=>{
            const { isFirstPopStateEvent } = this;
            this.isFirstPopStateEvent = false;
            const state = e.state;
            if (!state) {
                // We get state as undefined for two reasons.
                //  1. With older safari (< 8) and older chrome (< 34)
                //  2. When the URL changed with #
                //
                // In the both cases, we don't need to proceed and change the route.
                // (as it's already changed)
                // But we can simply replace the state with the new changes.
                // Actually, for (1) we don't need to nothing. But it's hard to detect that event.
                // So, doing the following for (1) does no harm.
                const { pathname, query } = this;
                this.changeState('replaceState', (0, _formaturl.formatWithValidation)({
                    pathname: (0, _addbasepath.addBasePath)(pathname),
                    query
                }), (0, _utils.getURL)());
                return;
            }
            // __NA is used to identify if the history entry can be handled by the app-router.
            if (state.__NA) {
                window.location.reload();
                return;
            }
            if (!state.__N) {
                return;
            }
            // Safari fires popstateevent when reopening the browser.
            if (isFirstPopStateEvent && this.locale === state.options.locale && state.as === this.asPath) {
                return;
            }
            let forcedScroll;
            const { url, as, options, key } = state;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            this._key = key;
            const { pathname } = (0, _parserelativeurl.parseRelativeUrl)(url);
            // Make sure we don't re-render on initial load,
            // can be caused by navigating back from an external site
            if (this.isSsr && as === (0, _addbasepath.addBasePath)(this.asPath) && pathname === (0, _addbasepath.addBasePath)(this.pathname)) {
                return;
            }
            // If the downstream application returns falsy, return.
            // They will then be responsible for handling the event.
            if (this._bps && !this._bps(state)) {
                return;
            }
            this.change('replaceState', url, as, Object.assign({}, options, {
                shallow: options.shallow && this._shallow,
                locale: options.locale || this.defaultLocale,
                // @ts-ignore internal value not exposed on types
                _h: 0
            }), forcedScroll);
        };
        // represents the current component key
        const route = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        // set up the component cache (by route keys)
        this.components = {};
        // We should not keep the cache, if there's an error
        // Otherwise, this cause issues when when going back and
        // come again to the errored page.
        if (pathname !== '/_error') {
            this.components[route] = {
                Component,
                initial: true,
                props: initialProps,
                err,
                __N_SSG: initialProps && initialProps.__N_SSG,
                __N_SSP: initialProps && initialProps.__N_SSP
            };
        }
        this.components['/_app'] = {
            Component: App,
            styleSheets: []
        };
        // Backwards compat for Router.router.events
        // TODO: Should be remove the following major version as it was never documented
        this.events = Router.events;
        this.pageLoader = pageLoader;
        // if auto prerendered and dynamic route wait to update asPath
        // until after mount to prevent hydration mismatch
        const autoExportDynamic = (0, _isdynamic.isDynamicRoute)(pathname) && self.__NEXT_DATA__.autoExport;
        this.basePath = ("TURBOPACK compile-time value", "") || '';
        this.sub = subscription;
        this.clc = null;
        this._wrapApp = wrapApp;
        // make sure to ignore extra popState in safari on navigating
        // back from external site
        this.isSsr = true;
        this.isLocaleDomain = false;
        this.isReady = !!(self.__NEXT_DATA__.gssp || self.__NEXT_DATA__.gip || self.__NEXT_DATA__.isExperimentalCompile || self.__NEXT_DATA__.appGip && !self.__NEXT_DATA__.gsp || !autoExportDynamic && !self.location.search && !("TURBOPACK compile-time value", false));
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        this.state = {
            route,
            pathname,
            query,
            asPath: autoExportDynamic ? pathname : as,
            isPreview: !!isPreview,
            locale: ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined,
            isFallback
        };
        this._initialMatchesMiddlewarePromise = Promise.resolve(false);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
    reload() {
        window.location.reload();
    }
    /**
   * Go back in history
   */ back() {
        window.history.back();
    }
    /**
   * Go forward in history
   */ forward() {
        window.history.forward();
    }
    /**
   * Performs a `pushState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ push(url, as, options = {}) {
        if ((0, _javascripturl.isJavaScriptURLString)(url.toString()) || as && (0, _javascripturl.isJavaScriptURLString)(as.toString())) {
            throw Object.defineProperty(new Error('Next.js has blocked a javascript: URL as a security precaution.'), "__NEXT_ERROR_CODE", {
                value: "E978",
                enumerable: false,
                configurable: true
            });
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        ;
        ({ url, as } = prepareUrlAs(this, url, as));
        return this.change('pushState', url, as, options);
    }
    /**
   * Performs a `replaceState` with arguments
   * @param url of the route
   * @param as masks `url` for the browser
   * @param options object you can define `shallow` and other options
   */ replace(url, as, options = {}) {
        if ((0, _javascripturl.isJavaScriptURLString)(url.toString()) || as && (0, _javascripturl.isJavaScriptURLString)(as.toString())) {
            throw Object.defineProperty(new Error('Next.js has blocked a javascript: URL as a security precaution.'), "__NEXT_ERROR_CODE", {
                value: "E978",
                enumerable: false,
                configurable: true
            });
        }
        ;
        ({ url, as } = prepareUrlAs(this, url, as));
        return this.change('replaceState', url, as, options);
    }
    async _bfl(as, resolvedAs, locale, skipNavigate) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (!this._bfl_s && !this._bfl_d) {
                const { BloomFilter } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/bloom-filter.js [app-ssr] (ecmascript)");
                let staticFilterData;
                let dynamicFilterData;
                try {
                    ;
                    ({ __routerFilterStatic: staticFilterData, __routerFilterDynamic: dynamicFilterData } = await (0, _routeloader.getClientBuildManifest)());
                } catch (err) {
                    // failed to load build manifest hard navigate
                    // to be safe
                    console.error(err);
                    if (skipNavigate) {
                        return true;
                    }
                    handleHardNavigation({
                        url: (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(as, locale || this.locale, this.defaultLocale)),
                        router: this
                    });
                    return new Promise(()=>{});
                }
                const routerFilterSValue = ("TURBOPACK compile-time value", {
                    "numItems": ("TURBOPACK compile-time value", 5),
                    "errorRate": ("TURBOPACK compile-time value", 0.0001),
                    "numBits": ("TURBOPACK compile-time value", 96),
                    "numHashes": ("TURBOPACK compile-time value", 14),
                    "bitArray": ("TURBOPACK compile-time value", [
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0)
                    ])
                });
                if (!staticFilterData && routerFilterSValue) {
                    staticFilterData = routerFilterSValue ? routerFilterSValue : undefined;
                }
                const routerFilterDValue = ("TURBOPACK compile-time value", {
                    "numItems": ("TURBOPACK compile-time value", 2),
                    "errorRate": ("TURBOPACK compile-time value", 0.0001),
                    "numBits": ("TURBOPACK compile-time value", 39),
                    "numHashes": ("TURBOPACK compile-time value", 14),
                    "bitArray": ("TURBOPACK compile-time value", [
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1),
                        ("TURBOPACK compile-time value", 0),
                        ("TURBOPACK compile-time value", 1)
                    ])
                });
                if (!dynamicFilterData && routerFilterDValue) {
                    dynamicFilterData = ("TURBOPACK compile-time truthy", 1) ? routerFilterDValue : "TURBOPACK unreachable";
                }
                if (staticFilterData?.numHashes) {
                    this._bfl_s = new BloomFilter(staticFilterData.numItems, staticFilterData.errorRate);
                    this._bfl_s.import(staticFilterData);
                }
                if (dynamicFilterData?.numHashes) {
                    this._bfl_d = new BloomFilter(dynamicFilterData.numItems, dynamicFilterData.errorRate);
                    this._bfl_d.import(dynamicFilterData);
                }
            }
            let matchesBflStatic = false;
            let matchesBflDynamic = false;
            const pathsToCheck = [
                {
                    as
                },
                {
                    as: resolvedAs
                }
            ];
            for (const { as: curAs, allowMatchCurrent } of pathsToCheck){
                if (curAs) {
                    const asNoSlash = (0, _removetrailingslash.removeTrailingSlash)(new URL(curAs, 'http://n').pathname);
                    const asNoSlashLocale = (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(asNoSlash, locale || this.locale));
                    if (allowMatchCurrent || asNoSlash !== (0, _removetrailingslash.removeTrailingSlash)(new URL(this.asPath, 'http://n').pathname)) {
                        matchesBflStatic = matchesBflStatic || !!this._bfl_s?.contains(asNoSlash) || !!this._bfl_s?.contains(asNoSlashLocale);
                        for (const normalizedAS of [
                            asNoSlash,
                            asNoSlashLocale
                        ]){
                            // if any sub-path of as matches a dynamic filter path
                            // it should be hard navigated
                            const curAsParts = normalizedAS.split('/');
                            for(let i = 0; !matchesBflDynamic && i < curAsParts.length + 1; i++){
                                const currentPart = curAsParts.slice(0, i).join('/');
                                if (currentPart && this._bfl_d?.contains(currentPart)) {
                                    matchesBflDynamic = true;
                                    break;
                                }
                            }
                        }
                        // if the client router filter is matched then we trigger
                        // a hard navigation
                        if (matchesBflStatic || matchesBflDynamic) {
                            if (skipNavigate) {
                                return true;
                            }
                            handleHardNavigation({
                                url: (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(as, locale || this.locale, this.defaultLocale)),
                                router: this
                            });
                            return new Promise(()=>{});
                        }
                    }
                }
            }
        }
        return false;
    }
    async change(method, url, as, options, forcedScroll) {
        if (!(0, _islocalurl.isLocalURL)(url)) {
            handleHardNavigation({
                url,
                router: this
            });
            return false;
        }
        // WARNING: `_h` is an internal option for handing Next.js client-side
        // hydration. Your app should _never_ use this property. It may change at
        // any time without notice.
        const isQueryUpdating = options._h === 1;
        if (!isQueryUpdating && !options.shallow) {
            await this._bfl(as, undefined, options.locale);
        }
        let shouldResolveHref = isQueryUpdating || options._shouldResolveHref || (0, _parsepath.parsePath)(url).pathname === (0, _parsepath.parsePath)(as).pathname;
        const nextState = {
            ...this.state
        };
        // for static pages with query params in the URL we delay
        // marking the router ready until after the query is updated
        // or a navigation has occurred
        const readyStateChange = this.isReady !== true;
        this.isReady = true;
        const isSsr = this.isSsr;
        if (!isQueryUpdating) {
            this.isSsr = false;
        }
        // if a route transition is already in progress before
        // the query updating is triggered ignore query updating
        if (isQueryUpdating && this.clc) {
            return false;
        }
        const prevLocale = nextState.locale;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // marking route changes as a navigation start entry
        if (_utils.ST) {
            performance.mark('routeChange');
        }
        const { shallow = false, scroll = true } = options;
        const routeProps = {
            shallow
        };
        if (this._inFlightRoute && this.clc) {
            if (!isSsr) {
                Router.events.emit('routeChangeError', buildCancellationError(), this._inFlightRoute, routeProps);
            }
            this.clc();
            this.clc = null;
        }
        as = (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)((0, _hasbasepath.hasBasePath)(as) ? (0, _removebasepath.removeBasePath)(as) : as, options.locale, this.defaultLocale));
        const cleanedAs = (0, _removelocale.removeLocale)((0, _hasbasepath.hasBasePath)(as) ? (0, _removebasepath.removeBasePath)(as) : as, nextState.locale);
        this._inFlightRoute = as;
        const localeChange = prevLocale !== nextState.locale;
        // If the url change is only related to a hash change
        // We should not proceed. We should only change the state.
        if (!isQueryUpdating && this.onlyAHashChange(cleanedAs) && !localeChange) {
            nextState.asPath = cleanedAs;
            Router.events.emit('hashChangeStart', as, routeProps);
            // TODO: do we need the resolved href when only a hash change?
            this.changeState(method, url, as, {
                ...options,
                scroll: false
            });
            if (scroll) {
                this.scrollToHash(cleanedAs);
            }
            try {
                await this.set(nextState, this.components[nextState.route], null);
            } catch (err) {
                if ((0, _iserror.default)(err) && err.cancelled) {
                    Router.events.emit('routeChangeError', err, cleanedAs, routeProps);
                }
                throw err;
            }
            Router.events.emit('hashChangeComplete', as, routeProps);
            return true;
        }
        let parsed = (0, _parserelativeurl.parseRelativeUrl)(url);
        let { pathname, query } = parsed;
        // The build manifest needs to be loaded before auto-static dynamic pages
        // get their query parameters to allow ensuring they can be parsed properly
        // when rewritten to
        let pages, rewrites;
        try {
            ;
            [pages, { __rewrites: rewrites }] = await Promise.all([
                this.pageLoader.getPageList(),
                (0, _routeloader.getClientBuildManifest)(),
                this.pageLoader.getMiddleware()
            ]);
        } catch (err) {
            // If we fail to resolve the page list or client-build manifest, we must
            // do a server-side transition:
            handleHardNavigation({
                url: as,
                router: this
            });
            return false;
        }
        // If asked to change the current URL we should reload the current page
        // (not location.reload() but reload getInitialProps and other Next.js stuffs)
        // We also need to set the method = replaceState always
        // as this should not go into the history (That's how browsers work)
        // We should compare the new asPath to the current asPath, not the url
        if (!this.urlIsNew(cleanedAs) && !localeChange) {
            method = 'replaceState';
        }
        // we need to resolve the as value using rewrites for dynamic SSG
        // pages to allow building the data URL correctly
        let resolvedAs = as;
        // url and as should always be prefixed with basePath by this
        // point by either next/link or router.push/replace so strip the
        // basePath from the pathname to match the pages dir 1-to-1
        pathname = pathname ? (0, _removetrailingslash.removeTrailingSlash)((0, _removebasepath.removeBasePath)(pathname)) : pathname;
        let route = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        const parsedAsPathname = as.startsWith('/') && (0, _parserelativeurl.parseRelativeUrl)(as).pathname;
        // if we detected the path as app route during prefetching
        // trigger hard navigation
        if (this.components[pathname]?.__appRouter) {
            handleHardNavigation({
                url: as,
                router: this
            });
            return new Promise(()=>{});
        }
        const isMiddlewareRewrite = !!(parsedAsPathname && route !== parsedAsPathname && (!(0, _isdynamic.isDynamicRoute)(route) || !(0, _routematcher.getRouteMatcher)((0, _routeregex.getRouteRegex)(route))(parsedAsPathname)));
        // we don't attempt resolve asPath when we need to execute
        // middleware as the resolving will occur server-side
        const isMiddlewareMatch = !options.shallow && await matchesMiddleware({
            asPath: as,
            locale: nextState.locale,
            router: this
        });
        if (isQueryUpdating && isMiddlewareMatch) {
            shouldResolveHref = false;
        }
        if (shouldResolveHref && pathname !== '/_error') {
            ;
            options._shouldResolveHref = true;
            if (("TURBOPACK compile-time value", false) && as.startsWith('/')) //TURBOPACK unreachable
            ;
            else {
                parsed.pathname = resolveDynamicRoute(pathname, pages);
                if (parsed.pathname !== pathname) {
                    pathname = parsed.pathname;
                    parsed.pathname = (0, _addbasepath.addBasePath)(pathname);
                    if (!isMiddlewareMatch) {
                        url = (0, _formaturl.formatWithValidation)(parsed);
                    }
                }
            }
        }
        // The pages client router resolves a navigation against pages routes only.
        // When it resolves to a dynamic pages route, an app route that begins with
        // a dynamic segment may be more specific and own this path on the server
        // (e.g. `/en/about` resolves to the pages route `/[locale]/[category]`, but
        // the app route `/[locale]/about` should win). Such app routes have no
        // static prefix for the early `_bfl` check, so reconstruct the candidate
        // patterns from the resolved route and hard navigate when one is in the
        // dynamic filter.
        if (!isQueryUpdating && !options.shallow && ("TURBOPACK compile-time value", true) && this._bfl_d && (0, _isdynamic.isDynamicRoute)(pathname)) {
            const concretePathname = (0, _removetrailingslash.removeTrailingSlash)((0, _parserelativeurl.parseRelativeUrl)(cleanedAs).pathname);
            const isShadowedByAppRoute = (0, _dynamicfilterpattern.hasDynamicFilterCandidate)(pathname, concretePathname, (candidate)=>!!this._bfl_d?.contains(candidate));
            if (isShadowedByAppRoute) {
                handleHardNavigation({
                    url: as,
                    router: this
                });
                return new Promise(()=>{});
            }
        }
        if (!(0, _islocalurl.isLocalURL)(as)) {
            if ("TURBOPACK compile-time truthy", 1) {
                throw Object.defineProperty(new Error(`Invalid href: "${url}" and as: "${as}", received relative href and external as` + `\nSee more info: https://nextjs.org/docs/messages/invalid-relative-url-external-as`), "__NEXT_ERROR_CODE", {
                    value: "E380",
                    enumerable: false,
                    configurable: true
                });
            }
            handleHardNavigation({
                url: as,
                router: this
            });
            return false;
        }
        resolvedAs = (0, _removelocale.removeLocale)((0, _removebasepath.removeBasePath)(resolvedAs), nextState.locale);
        route = (0, _removetrailingslash.removeTrailingSlash)(pathname);
        let routeMatch = false;
        if ((0, _isdynamic.isDynamicRoute)(route)) {
            const parsedAs = (0, _parserelativeurl.parseRelativeUrl)(resolvedAs);
            const asPathname = parsedAs.pathname;
            const routeRegex = (0, _routeregex.getRouteRegex)(route);
            routeMatch = (0, _routematcher.getRouteMatcher)(routeRegex)(asPathname);
            const shouldInterpolate = route === asPathname;
            const interpolatedAs = shouldInterpolate ? (0, _interpolateas.interpolateAs)(route, asPathname, query) : {};
            if (!routeMatch || shouldInterpolate && !interpolatedAs.result) {
                const missingParams = Object.keys(routeRegex.groups).filter((param)=>!query[param] && !routeRegex.groups[param].optional);
                if (missingParams.length > 0 && !isMiddlewareMatch) {
                    if ("TURBOPACK compile-time truthy", 1) {
                        console.warn(`${shouldInterpolate ? `Interpolating href` : `Mismatching \`as\` and \`href\``} failed to manually provide ` + `the params: ${missingParams.join(', ')} in the \`href\`'s \`query\``);
                    }
                    throw Object.defineProperty(new Error((shouldInterpolate ? `The provided \`href\` (${url}) value is missing query values (${missingParams.join(', ')}) to be interpolated properly. ` : `The provided \`as\` value (${asPathname}) is incompatible with the \`href\` value (${route}). `) + `Read more: https://nextjs.org/docs/messages/${shouldInterpolate ? 'href-interpolation-failed' : 'incompatible-href-as'}`), "__NEXT_ERROR_CODE", {
                        value: "E344",
                        enumerable: false,
                        configurable: true
                    });
                }
            } else if (shouldInterpolate) {
                as = (0, _formaturl.formatWithValidation)(Object.assign({}, parsedAs, {
                    pathname: interpolatedAs.result,
                    query: (0, _omit.omit)(query, interpolatedAs.params)
                }));
            } else {
                // Merge params into `query`, overwriting any specified in search
                Object.assign(query, routeMatch);
            }
        }
        if (!isQueryUpdating) {
            Router.events.emit('routeChangeStart', as, routeProps);
        }
        const isErrorRoute = this.pathname === '/404' || this.pathname === '/_error';
        try {
            let routeInfo = await this.getRouteInfo({
                route,
                pathname,
                query,
                as,
                resolvedAs,
                routeProps,
                locale: nextState.locale,
                isPreview: nextState.isPreview,
                hasMiddleware: isMiddlewareMatch,
                unstable_skipClientCache: options.unstable_skipClientCache,
                isQueryUpdating: isQueryUpdating && !this.isFallback,
                isMiddlewareRewrite
            });
            if (!isQueryUpdating && !options.shallow) {
                await this._bfl(as, 'resolvedAs' in routeInfo ? routeInfo.resolvedAs : undefined, nextState.locale);
            }
            if ('route' in routeInfo && isMiddlewareMatch) {
                pathname = routeInfo.route || route;
                route = pathname;
                if (!routeProps.shallow) {
                    query = Object.assign({}, routeInfo.query || {}, query);
                }
                const cleanedParsedPathname = (0, _hasbasepath.hasBasePath)(parsed.pathname) ? (0, _removebasepath.removeBasePath)(parsed.pathname) : parsed.pathname;
                if (routeMatch && pathname !== cleanedParsedPathname) {
                    Object.keys(routeMatch).forEach((key)=>{
                        if (routeMatch && query[key] === routeMatch[key]) {
                            delete query[key];
                        }
                    });
                }
                if ((0, _isdynamic.isDynamicRoute)(pathname)) {
                    const prefixedAs = !routeProps.shallow && routeInfo.resolvedAs ? routeInfo.resolvedAs : (0, _addbasepath.addBasePath)((0, _addlocale.addLocale)(new URL(as, location.href).pathname, nextState.locale), true);
                    let rewriteAs = prefixedAs;
                    if ((0, _hasbasepath.hasBasePath)(rewriteAs)) {
                        rewriteAs = (0, _removebasepath.removeBasePath)(rewriteAs);
                    }
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    const routeRegex = (0, _routeregex.getRouteRegex)(pathname);
                    const curRouteMatch = (0, _routematcher.getRouteMatcher)(routeRegex)(new URL(rewriteAs, location.href).pathname);
                    if (curRouteMatch) {
                        Object.assign(query, curRouteMatch);
                    }
                }
            }
            // If the routeInfo brings a redirect we simply apply it.
            if ('type' in routeInfo) {
                if (routeInfo.type === 'redirect-internal') {
                    return this.change(method, routeInfo.newUrl, routeInfo.newAs, options);
                } else {
                    handleHardNavigation({
                        url: routeInfo.destination,
                        router: this
                    });
                    return new Promise(()=>{});
                }
            }
            const component = routeInfo.Component;
            if (component && component.unstable_scriptLoader) {
                const scripts = [].concat(component.unstable_scriptLoader());
                scripts.forEach((script)=>{
                    (0, _script.handleClientScriptLoad)(script.props);
                });
            }
            // handle redirect on client-transition
            if ((routeInfo.__N_SSG || routeInfo.__N_SSP) && routeInfo.props) {
                if (routeInfo.props.pageProps && routeInfo.props.pageProps.__N_REDIRECT) {
                    // Use the destination from redirect without adding locale
                    options.locale = false;
                    const destination = routeInfo.props.pageProps.__N_REDIRECT;
                    // check if destination is internal (resolves to a page) and attempt
                    // client-navigation if it is falling back to hard navigation if
                    // it's not
                    if (destination.startsWith('/') && routeInfo.props.pageProps.__N_REDIRECT_BASE_PATH !== false) {
                        const parsedHref = (0, _parserelativeurl.parseRelativeUrl)(destination);
                        parsedHref.pathname = resolveDynamicRoute(parsedHref.pathname, pages);
                        const { url: newUrl, as: newAs } = prepareUrlAs(this, destination, destination);
                        return this.change(method, newUrl, newAs, options);
                    }
                    handleHardNavigation({
                        url: destination,
                        router: this
                    });
                    return new Promise(()=>{});
                }
                nextState.isPreview = !!routeInfo.props.__N_PREVIEW;
                // handle SSG data 404
                if (routeInfo.props.notFound === SSG_DATA_NOT_FOUND) {
                    let notFoundRoute;
                    try {
                        await this.fetchComponent('/404');
                        notFoundRoute = '/404';
                    } catch (_) {
                        notFoundRoute = '/_error';
                    }
                    routeInfo = await this.getRouteInfo({
                        route: notFoundRoute,
                        pathname: notFoundRoute,
                        query,
                        as,
                        resolvedAs,
                        routeProps: {
                            shallow: false
                        },
                        locale: nextState.locale,
                        isPreview: nextState.isPreview,
                        isNotFound: true
                    });
                    if ('type' in routeInfo) {
                        throw Object.defineProperty(new Error(`Unexpected middleware effect on /404`), "__NEXT_ERROR_CODE", {
                            value: "E158",
                            enumerable: false,
                            configurable: true
                        });
                    }
                }
            }
            if (isQueryUpdating && this.pathname === '/_error' && self.__NEXT_DATA__.props?.pageProps?.statusCode === 500 && routeInfo.props?.pageProps) {
                // ensure statusCode is still correct for static 500 page
                // when updating query information
                routeInfo.props.pageProps.statusCode = 500;
            }
            // shallow routing is only allowed for same page URL changes.
            const isValidShallowRoute = options.shallow && nextState.route === (routeInfo.route ?? route);
            const shouldScroll = options.scroll ?? (!isQueryUpdating && !isValidShallowRoute);
            const resetScroll = shouldScroll ? {
                x: 0,
                y: 0
            } : null;
            const upcomingScrollState = forcedScroll ?? resetScroll;
            // the new state that the router gonna set
            const upcomingRouterState = {
                ...nextState,
                route,
                pathname,
                query,
                asPath: cleanedAs,
                isFallback: false
            };
            // When the page being rendered is the 404 page, we should only update the
            // query parameters. Route changes here might add the basePath when it
            // wasn't originally present. This is also why this block is before the
            // below `changeState` call which updates the browser's history (changing
            // the URL).
            if (isQueryUpdating && isErrorRoute) {
                routeInfo = await this.getRouteInfo({
                    route: this.pathname,
                    pathname: this.pathname,
                    query,
                    as,
                    resolvedAs,
                    routeProps: {
                        shallow: false
                    },
                    locale: nextState.locale,
                    isPreview: nextState.isPreview,
                    isQueryUpdating: isQueryUpdating && !this.isFallback
                });
                if ('type' in routeInfo) {
                    throw Object.defineProperty(new Error(`Unexpected middleware effect on ${this.pathname}`), "__NEXT_ERROR_CODE", {
                        value: "E225",
                        enumerable: false,
                        configurable: true
                    });
                }
                if (this.pathname === '/_error' && self.__NEXT_DATA__.props?.pageProps?.statusCode === 500 && routeInfo.props?.pageProps) {
                    // ensure statusCode is still correct for static 500 page
                    // when updating query information
                    routeInfo.props.pageProps.statusCode = 500;
                }
                try {
                    await this.set(upcomingRouterState, routeInfo, upcomingScrollState);
                } catch (err) {
                    if ((0, _iserror.default)(err) && err.cancelled) {
                        Router.events.emit('routeChangeError', err, cleanedAs, routeProps);
                    }
                    throw err;
                }
                return true;
            }
            Router.events.emit('beforeHistoryChange', as, routeProps);
            this.changeState(method, url, as, options);
            // for query updates we can skip it if the state is unchanged and we don't
            // need to scroll
            // https://github.com/vercel/next.js/issues/37139
            const canSkipUpdating = isQueryUpdating && !upcomingScrollState && !readyStateChange && !localeChange && (0, _comparestates.compareRouterStates)(upcomingRouterState, this.state);
            if (!canSkipUpdating) {
                try {
                    await this.set(upcomingRouterState, routeInfo, upcomingScrollState);
                } catch (e) {
                    if (e.cancelled) routeInfo.error = routeInfo.error || e;
                    else throw e;
                }
                if (routeInfo.error) {
                    if (!isQueryUpdating) {
                        Router.events.emit('routeChangeError', routeInfo.error, cleanedAs, routeProps);
                    }
                    throw routeInfo.error;
                }
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                if (!isQueryUpdating) {
                    Router.events.emit('routeChangeComplete', as, routeProps);
                }
                // A hash mark # is the optional last part of a URL
                const hashRegex = /#.+$/;
                if (shouldScroll && hashRegex.test(as)) {
                    this.scrollToHash(as);
                }
            }
            return true;
        } catch (err) {
            if ((0, _iserror.default)(err) && err.cancelled) {
                return false;
            }
            throw err;
        }
    }
    changeState(method, url, as, options = {}) {
        if ("TURBOPACK compile-time truthy", 1) {
            if (typeof window.history === 'undefined') {
                console.error(`Warning: window.history is not available.`);
                return;
            }
            if (typeof window.history[method] === 'undefined') {
                console.error(`Warning: window.history.${method} is not available`);
                return;
            }
        }
        if (method !== 'pushState' || (0, _utils.getURL)() !== as) {
            this._shallow = options.shallow;
            window.history[method]({
                url,
                as,
                options,
                __N: true,
                key: this._key = method !== 'pushState' ? this._key : createKey()
            }, // Passing the empty string here should be safe against future changes to the method.
            // https://developer.mozilla.org/docs/Web/API/History/replaceState
            '', as);
        }
    }
    async handleRouteInfoError(err, pathname, query, as, routeProps, loadErrorFail) {
        if (err.cancelled) {
            // bubble up cancellation errors
            throw err;
        }
        if ((0, _routeloader.isAssetError)(err) || loadErrorFail) {
            Router.events.emit('routeChangeError', err, as, routeProps);
            // If we can't load the page it could be one of following reasons
            //  1. Page doesn't exists
            //  2. Page does exist in a different zone
            //  3. Internal error while loading the page
            // So, doing a hard reload is the proper way to deal with this.
            handleHardNavigation({
                url: as,
                router: this
            });
            // Changing the URL doesn't block executing the current code path.
            // So let's throw a cancellation error stop the routing logic.
            throw buildCancellationError();
        }
        console.error(err);
        try {
            let props;
            const { page: Component, styleSheets } = await this.fetchComponent('/_error');
            const routeInfo = {
                props,
                Component,
                styleSheets,
                err,
                error: err
            };
            if (!routeInfo.props) {
                try {
                    routeInfo.props = await this.getInitialProps(Component, {
                        err,
                        pathname,
                        query
                    });
                } catch (gipErr) {
                    console.error('Error in error page `getInitialProps`: ', gipErr);
                    routeInfo.props = {};
                }
            }
            return routeInfo;
        } catch (routeInfoErr) {
            return this.handleRouteInfoError((0, _iserror.default)(routeInfoErr) ? routeInfoErr : Object.defineProperty(new Error(routeInfoErr + ''), "__NEXT_ERROR_CODE", {
                value: "E394",
                enumerable: false,
                configurable: true
            }), pathname, query, as, routeProps, true);
        }
    }
    async getRouteInfo({ route: requestedRoute, pathname, query, as, resolvedAs, routeProps, locale, hasMiddleware, isPreview, unstable_skipClientCache, isQueryUpdating, isMiddlewareRewrite, isNotFound }) {
        /**
     * This `route` binding can change if there's a rewrite
     * so we keep a reference to the original requested route
     * so we can store the cache for it and avoid re-requesting every time
     * for shallow routing purposes.
     */ let route = requestedRoute;
        try {
            let existingInfo = this.components[route];
            if (routeProps.shallow && existingInfo && this.route === route) {
                return existingInfo;
            }
            const handleCancelled = getCancelledHandler({
                route,
                router: this
            });
            if (hasMiddleware) {
                existingInfo = undefined;
            }
            let cachedRouteInfo = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : undefined;
            const isBackground = isQueryUpdating;
            const fetchNextDataParams = {
                dataHref: this.pageLoader.getDataHref({
                    href: (0, _formaturl.formatWithValidation)({
                        pathname,
                        query
                    }),
                    skipInterpolation: true,
                    asPath: isNotFound ? '/404' : resolvedAs,
                    locale
                }),
                hasMiddleware: true,
                isServerRender: this.isSsr,
                parseJSON: true,
                inflightCache: isBackground ? this.sbc : this.sdc,
                persistCache: !isPreview,
                isPrefetch: false,
                unstable_skipClientCache,
                isBackground
            };
            let data = isQueryUpdating && !isMiddlewareRewrite ? null : await withMiddlewareEffects({
                fetchData: ()=>fetchNextData(fetchNextDataParams),
                asPath: isNotFound ? '/404' : resolvedAs,
                locale: locale,
                router: this
            }).catch((err)=>{
                // we don't hard error during query updating
                // as it's un-necessary and doesn't need to be fatal
                // unless it is a fallback route and the props can't
                // be loaded
                if (isQueryUpdating) {
                    return null;
                }
                throw err;
            });
            // when rendering error routes we don't apply middleware
            // effects
            if (data && (pathname === '/_error' || pathname === '/404')) {
                data.effect = undefined;
            }
            if (isQueryUpdating) {
                if (!data) {
                    data = {
                        json: self.__NEXT_DATA__.props
                    };
                } else {
                    data.json = self.__NEXT_DATA__.props;
                }
            }
            handleCancelled();
            if (data?.effect?.type === 'redirect-internal' || data?.effect?.type === 'redirect-external') {
                return data.effect;
            }
            if (data?.effect?.type === 'rewrite') {
                const resolvedRoute = (0, _removetrailingslash.removeTrailingSlash)(data.effect.resolvedHref);
                const pages = await this.pageLoader.getPageList();
                // during query updating the page must match although during
                // client-transition a redirect that doesn't match a page
                // can be returned and this should trigger a hard navigation
                // which is valid for incremental migration
                if (!isQueryUpdating || pages.includes(resolvedRoute)) {
                    route = resolvedRoute;
                    pathname = data.effect.resolvedHref;
                    query = {
                        ...query,
                        ...data.effect.parsedAs.query
                    };
                    resolvedAs = (0, _removebasepath.removeBasePath)((0, _normalizelocalepath.normalizeLocalePath)(data.effect.parsedAs.pathname, this.locales).pathname);
                    // Check again the cache with the new destination.
                    existingInfo = this.components[route];
                    if (routeProps.shallow && existingInfo && this.route === route && !hasMiddleware) {
                        // If we have a match with the current route due to rewrite,
                        // we can copy the existing information to the rewritten one.
                        // Then, we return the information along with the matched route.
                        return {
                            ...existingInfo,
                            route
                        };
                    }
                }
            }
            if ((0, _isapiroute.isAPIRoute)(route)) {
                handleHardNavigation({
                    url: as,
                    router: this
                });
                return new Promise(()=>{});
            }
            const routeInfo = cachedRouteInfo || await this.fetchComponent(route).then((res)=>({
                    Component: res.page,
                    styleSheets: res.styleSheets,
                    __N_SSG: res.mod.__N_SSG,
                    __N_SSP: res.mod.__N_SSP
                }));
            if ("TURBOPACK compile-time truthy", 1) {
                const { isValidElementType } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/compiled/react-is/index.js [app-ssr] (ecmascript)");
                if (!isValidElementType(routeInfo.Component)) {
                    throw Object.defineProperty(new Error(`The default export is not a React Component in page: "${pathname}"`), "__NEXT_ERROR_CODE", {
                        value: "E286",
                        enumerable: false,
                        configurable: true
                    });
                }
            }
            const wasBailedPrefetch = data?.response?.headers.get('x-middleware-skip');
            const shouldFetchData = routeInfo.__N_SSG || routeInfo.__N_SSP;
            // For non-SSG prefetches that bailed before sending data
            // we clear the cache to fetch full response
            if (wasBailedPrefetch && data?.dataHref) {
                delete this.sdc[data.dataHref];
            }
            const { props, cacheKey } = await this._getData(async ()=>{
                if (shouldFetchData) {
                    if (data?.json && !wasBailedPrefetch) {
                        return {
                            cacheKey: data.cacheKey,
                            props: data.json
                        };
                    }
                    const dataHref = data?.dataHref ? data.dataHref : this.pageLoader.getDataHref({
                        href: (0, _formaturl.formatWithValidation)({
                            pathname,
                            query
                        }),
                        asPath: resolvedAs,
                        locale
                    });
                    const fetched = await fetchNextData({
                        dataHref,
                        isServerRender: this.isSsr,
                        parseJSON: true,
                        inflightCache: wasBailedPrefetch ? {} : this.sdc,
                        persistCache: !isPreview,
                        isPrefetch: false,
                        unstable_skipClientCache
                    });
                    return {
                        cacheKey: fetched.cacheKey,
                        props: fetched.json || {}
                    };
                }
                return {
                    headers: {},
                    props: await this.getInitialProps(routeInfo.Component, {
                        pathname,
                        query,
                        asPath: as,
                        locale,
                        locales: this.locales,
                        defaultLocale: this.defaultLocale
                    })
                };
            });
            // Only bust the data cache for SSP routes although
            // middleware can skip cache per request with
            // x-middleware-cache: no-cache as well
            if (routeInfo.__N_SSP && fetchNextDataParams.dataHref && cacheKey) {
                delete this.sdc[cacheKey];
            }
            // we kick off a HEAD request in the background
            // when a non-prefetch request is made to signal revalidation
            if (!this.isPreview && routeInfo.__N_SSG && ("TURBOPACK compile-time value", "development") !== 'development' && !isQueryUpdating) //TURBOPACK unreachable
            ;
            props.pageProps = Object.assign({}, props.pageProps);
            routeInfo.props = props;
            routeInfo.route = route;
            routeInfo.query = query;
            routeInfo.resolvedAs = resolvedAs;
            this.components[route] = routeInfo;
            return routeInfo;
        } catch (err) {
            return this.handleRouteInfoError((0, _iserror.getProperError)(err), pathname, query, as, routeProps);
        }
    }
    set(state, data, resetScroll) {
        this.state = state;
        return this.sub(data, this.components['/_app'].Component, resetScroll);
    }
    /**
   * Callback to execute before replacing router state
   * @param cb callback to be executed
   */ beforePopState(cb) {
        this._bps = cb;
    }
    onlyAHashChange(as) {
        if (!this.asPath) return false;
        const [oldUrlNoHash, oldHash] = this.asPath.split('#', 2);
        const [newUrlNoHash, newHash] = as.split('#', 2);
        // Makes sure we scroll to the provided hash if the url/hash are the same
        if (newHash && oldUrlNoHash === newUrlNoHash && oldHash === newHash) {
            return true;
        }
        // If the urls are change, there's more than a hash change
        if (oldUrlNoHash !== newUrlNoHash) {
            return false;
        }
        // If the hash has changed, then it's a hash only change.
        // This check is necessary to handle both the enter and
        // leave hash === '' cases. The identity case falls through
        // and is treated as a next reload.
        return oldHash !== newHash;
    }
    scrollToHash(as) {
        const [, hash = ''] = as.split('#', 2);
        (0, _disablesmoothscroll.disableSmoothScrollDuringRouteTransition)(()=>{
            // Scroll to top if the hash is just `#` with no value or `#top`
            // To mirror browsers
            if (hash === '' || hash === 'top') {
                window.scrollTo(0, 0);
                return;
            }
            // Decode hash to make non-latin anchor works.
            const rawHash = decodeURIComponent(hash);
            // First we check if the element by id is found
            const idEl = document.getElementById(rawHash);
            if (idEl) {
                idEl.scrollIntoView();
                return;
            }
            // If there's no element with the id, we check the `name` property
            // To mirror browsers
            const nameEl = document.getElementsByName(rawHash)[0];
            if (nameEl) {
                nameEl.scrollIntoView();
            }
        }, {
            onlyHashChange: this.onlyAHashChange(as)
        });
    }
    urlIsNew(asPath) {
        return this.asPath !== asPath;
    }
    /**
   * Prefetch page code, you may wait for the data during page rendering.
   * This feature only works in production!
   * @param url the href of prefetched page
   * @param asPath the as path of the prefetched page
   */ async prefetch(url, asPath = url, options = {}) {
        // Prefetch is not supported in development mode because it would trigger on-demand-entries
        if ("TURBOPACK compile-time truthy", 1) {
            return;
        }
        //TURBOPACK unreachable
        ;
        let parsed;
        const urlPathname = undefined;
        let pathname, query;
        const originalPathname = undefined;
        const pages = undefined;
        let resolvedAs;
        const locale = undefined;
        const isMiddlewareMatch = undefined;
        const data = undefined;
        const route = undefined;
    }
    async fetchComponent(route) {
        const handleCancelled = getCancelledHandler({
            route,
            router: this
        });
        try {
            const componentResult = await this.pageLoader.loadPage(route);
            handleCancelled();
            return componentResult;
        } catch (err) {
            handleCancelled();
            throw err;
        }
    }
    _getData(fn) {
        let cancelled = false;
        const cancel = ()=>{
            cancelled = true;
        };
        this.clc = cancel;
        return fn().then((data)=>{
            if (cancel === this.clc) {
                this.clc = null;
            }
            if (cancelled) {
                const err = Object.defineProperty(new Error('Loading initial props cancelled'), "__NEXT_ERROR_CODE", {
                    value: "E405",
                    enumerable: false,
                    configurable: true
                });
                err.cancelled = true;
                throw err;
            }
            return data;
        });
    }
    getInitialProps(Component, ctx) {
        const { Component: App } = this.components['/_app'];
        const AppTree = this._wrapApp(App);
        ctx.AppTree = AppTree;
        return (0, _utils.loadGetInitialProps)(App, {
            AppTree,
            Component,
            router: this,
            ctx
        });
    }
    get route() {
        return this.state.route;
    }
    get pathname() {
        return this.state.pathname;
    }
    get query() {
        return this.state.query;
    }
    get asPath() {
        return this.state.asPath;
    }
    get locale() {
        return this.state.locale;
    }
    get isFallback() {
        return this.state.isFallback;
    }
    get isPreview() {
        return this.state.isPreview;
    }
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/routes/app.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    isInterceptionAppRoute: null,
    isNormalizedAppRoute: null,
    parseAppRouteSegment: null,
    parseAppRouteWithSlots: null,
    parseNormalizedAppRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    isInterceptionAppRoute: function() {
        return isInterceptionAppRoute;
    },
    isNormalizedAppRoute: function() {
        return isNormalizedAppRoute;
    },
    parseAppRouteSegment: function() {
        return parseAppRouteSegment;
    },
    parseAppRouteWithSlots: function() {
        return parseAppRouteWithSlots;
    },
    parseNormalizedAppRoute: function() {
        return parseNormalizedAppRoute;
    }
});
const _invarianterror = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _getsegmentparam = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-segment-param.js [app-ssr] (ecmascript)");
const _interceptionroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)");
function normalizeEncodedDynamicPlaceholder(segment) {
    if (!/%5b|%5d/i.test(segment)) {
        return segment;
    }
    try {
        const decodedSegment = decodeURIComponent(segment);
        return (0, _getsegmentparam.getSegmentParam)(decodedSegment) ? decodedSegment : segment;
    } catch  {
        return segment;
    }
}
function parseAppRouteSegment(segment) {
    if (segment === '') {
        return null;
    }
    // Check if the segment starts with an interception marker
    const interceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
    const param = (0, _getsegmentparam.getSegmentParam)(segment);
    if (param) {
        return {
            type: 'dynamic',
            name: segment,
            param,
            interceptionMarker
        };
    } else if (segment.startsWith('(') && segment.endsWith(')')) {
        return {
            type: 'route-group',
            name: segment,
            interceptionMarker
        };
    } else if (segment.startsWith('@')) {
        return {
            type: 'parallel-route',
            name: segment,
            interceptionMarker
        };
    } else {
        return {
            type: 'static',
            name: segment,
            interceptionMarker
        };
    }
}
function isNormalizedAppRoute(route) {
    return route.normalized;
}
function isInterceptionAppRoute(route) {
    return route.interceptionMarker !== undefined && route.interceptingRoute !== undefined && route.interceptedRoute !== undefined;
}
// Bitmask for which non-URL segment types to allow during parsing.
// By default, route groups and parallel routes are rejected because
// they should have been stripped by normalizeAppPath. These flags
// let callers opt in to allowing specific types.
const OnlyRoutableSegments = /*   */ 0;
const AllowParallelSegments = /*  */ 1;
const AllowGroupSegments = /*     */ 2;
function parseAppRouteImpl(pathname, allowedTypes) {
    const pathnameSegments = pathname.split('/').filter(Boolean);
    // Build segments array with static and dynamic segments
    const segments = [];
    // Parse if this is an interception route.
    let interceptionMarker;
    let interceptingRoute;
    let interceptedRoute;
    for (const segment of pathnameSegments){
        const normalizedSegment = normalizeEncodedDynamicPlaceholder(segment);
        // Parse the segment into an AppSegment.
        const appSegment = parseAppRouteSegment(normalizedSegment);
        if (!appSegment) {
            continue;
        }
        if (appSegment.type === 'route-group' && !(allowedTypes & AllowGroupSegments)) {
            throw Object.defineProperty(new _invarianterror.InvariantError(`${pathname} is being parsed as a normalized route, but it has a route group segment.`), "__NEXT_ERROR_CODE", {
                value: "E1151",
                enumerable: false,
                configurable: true
            });
        }
        if (appSegment.type === 'parallel-route' && !(allowedTypes & AllowParallelSegments)) {
            throw Object.defineProperty(new _invarianterror.InvariantError(`${pathname} is being parsed as a normalized route, but it has a parallel route segment.`), "__NEXT_ERROR_CODE", {
                value: "E1152",
                enumerable: false,
                configurable: true
            });
        }
        segments.push(appSegment);
        if (appSegment.interceptionMarker) {
            const parts = pathname.split(appSegment.interceptionMarker);
            if (parts.length !== 2) {
                throw Object.defineProperty(new Error(`Invalid interception route: ${pathname}`), "__NEXT_ERROR_CODE", {
                    value: "E924",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptingRoute = parseAppRouteImpl(parts[0], allowedTypes);
            interceptedRoute = parseAppRouteImpl(parts[1], allowedTypes);
            interceptionMarker = appSegment.interceptionMarker;
        }
    }
    const dynamicSegments = segments.filter((segment)=>segment.type === 'dynamic');
    return {
        normalized: allowedTypes === OnlyRoutableSegments,
        pathname,
        segments,
        dynamicSegments,
        interceptionMarker,
        interceptingRoute,
        interceptedRoute
    };
}
function parseNormalizedAppRoute(pathname) {
    return parseAppRouteImpl(pathname, OnlyRoutableSegments);
}
function parseAppRouteWithSlots(pathname) {
    return parseAppRouteImpl(pathname, AllowParallelSegments);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-locale.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addLocale", {
    enumerable: true,
    get: function() {
        return addLocale;
    }
});
const _addpathprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-ssr] (ecmascript)");
const _pathhasprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-ssr] (ecmascript)");
function addLocale(path, locale, defaultLocale, ignorePrefix) {
    // If no locale was given or the locale is the default locale, we don't need
    // to prefix the path.
    if (!locale || locale === defaultLocale) return path;
    const lower = path.toLowerCase();
    // If the path is an API path or the path already has the locale prefix, we
    // don't need to prefix the path.
    if (!ignorePrefix) {
        if ((0, _pathhasprefix.pathHasPrefix)(lower, '/api')) return path;
        if ((0, _pathhasprefix.pathHasPrefix)(lower, `/${locale.toLowerCase()}`)) return path;
    }
    // Add the locale prefix to the path.
    return (0, _addpathprefix.addPathPrefix)(path, `/${locale}`);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addPathPrefix", {
    enumerable: true,
    get: function() {
        return addPathPrefix;
    }
});
const _parsepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
function addPathPrefix(path, prefix) {
    if (!path.startsWith('/') || !prefix) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    return `${prefix}${pathname}${query}${hash}`;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "addPathSuffix", {
    enumerable: true,
    get: function() {
        return addPathSuffix;
    }
});
const _parsepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
function addPathSuffix(path, suffix) {
    if (!path.startsWith('/') || !suffix) {
        return path;
    }
    const { pathname, query, hash } = (0, _parsepath.parsePath)(path);
    return `${pathname}${suffix}${query}${hash}`;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/app-paths.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    compareAppPaths: null,
    normalizeAppPath: null,
    normalizeRscURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    compareAppPaths: function() {
        return compareAppPaths;
    },
    normalizeAppPath: function() {
        return normalizeAppPath;
    },
    normalizeRscURL: function() {
        return normalizeRscURL;
    }
});
const _ensureleadingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/page-path/ensure-leading-slash.js [app-ssr] (ecmascript)");
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
function normalizeAppPath(route) {
    return (0, _ensureleadingslash.ensureLeadingSlash)(route.split('/').reduce((pathname, segment, index, segments)=>{
        // Empty segments are ignored.
        if (!segment) {
            return pathname;
        }
        // Groups are ignored.
        if ((0, _segment.isGroupSegment)(segment)) {
            return pathname;
        }
        // Parallel segments are ignored.
        if (segment[0] === '@') {
            return pathname;
        }
        // The last segment (if it's a leaf) should be ignored.
        if ((segment === 'page' || segment === 'route') && index === segments.length - 1) {
            return pathname;
        }
        return `${pathname}/${segment}`;
    }, ''));
}
function compareAppPaths(a, b) {
    const aHasSlot = a.includes('/@');
    const bHasSlot = b.includes('/@');
    if (aHasSlot && !bHasSlot) return -1;
    if (!aHasSlot && bHasSlot) return 1;
    return a.localeCompare(b);
}
function normalizeRscURL(url) {
    return url.replace(/\.rsc($|\?)/, '$1');
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/cache-busting-search-param.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    computeCacheBustingSearchParam: null,
    computeLegacyCacheBustingSearchParam: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    computeCacheBustingSearchParam: function() {
        return computeCacheBustingSearchParam;
    },
    computeLegacyCacheBustingSearchParam: function() {
        return computeLegacyCacheBustingSearchParam;
    }
});
const _hash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/hash.js [app-ssr] (ecmascript)");
const CACHE_BUSTING_SEARCH_PARAM_DIGEST_BYTES = 12;
const textEncoder = new TextEncoder();
function encodeCacheBustingSearchParam(bytes) {
    let binary = '';
    for(let i = 0; i < bytes.length; i++){
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function normalizeCacheBustingInput(value) {
    if (value === undefined) {
        return '0';
    }
    return Array.isArray(value) ? value.join(',') : value;
}
function createCacheBustingSearchParamInput(prefetchHeader, segmentPrefetchHeader, stateTreeHeader, nextUrlHeader) {
    if ((prefetchHeader === undefined || prefetchHeader === '0') && segmentPrefetchHeader === undefined && stateTreeHeader === undefined && nextUrlHeader === undefined) {
        return null;
    }
    return [
        prefetchHeader ?? '0',
        normalizeCacheBustingInput(segmentPrefetchHeader),
        normalizeCacheBustingInput(stateTreeHeader),
        normalizeCacheBustingInput(nextUrlHeader)
    ].join(',');
}
async function computeCacheBustingSearchParamFromInput(input) {
    // Truncate SHA-256 to 96 bits to keep `_rsc` compact
    const digest = await globalThis.crypto.subtle.digest('SHA-256', textEncoder.encode(input));
    return encodeCacheBustingSearchParam(new Uint8Array(digest).subarray(0, CACHE_BUSTING_SEARCH_PARAM_DIGEST_BYTES));
}
async function computeCacheBustingSearchParam(prefetchHeader, segmentPrefetchHeader, stateTreeHeader, nextUrlHeader) {
    const input = createCacheBustingSearchParamInput(prefetchHeader, segmentPrefetchHeader, stateTreeHeader, nextUrlHeader);
    if (input === null) {
        return '';
    }
    return computeCacheBustingSearchParamFromInput(input);
}
function computeLegacyCacheBustingSearchParam(prefetchHeader, segmentPrefetchHeader, stateTreeHeader, nextUrlHeader) {
    const input = createCacheBustingSearchParamInput(prefetchHeader, segmentPrefetchHeader, stateTreeHeader, nextUrlHeader);
    if (input === null) {
        return '';
    }
    return (0, _hash.hexHash)(input);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/compare-states.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "compareRouterStates", {
    enumerable: true,
    get: function() {
        return compareRouterStates;
    }
});
function compareRouterStates(a, b) {
    const stateKeys = Object.keys(a);
    if (stateKeys.length !== Object.keys(b).length) return false;
    for(let i = stateKeys.length; i--;){
        const key = stateKeys[i];
        if (key === 'query') {
            const queryKeys = Object.keys(a.query);
            if (queryKeys.length !== Object.keys(b.query).length) {
                return false;
            }
            for(let j = queryKeys.length; j--;){
                const queryKey = queryKeys[j];
                if (!b.query.hasOwnProperty(queryKey) || a.query[queryKey] !== b.query[queryKey]) {
                    return false;
                }
            }
        } else if (!b.hasOwnProperty(key) || a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Run function with `scroll-behavior: auto` applied to `<html/>`.
 * This css change will be reverted after the function finishes.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "disableSmoothScrollDuringRouteTransition", {
    enumerable: true,
    get: function() {
        return disableSmoothScrollDuringRouteTransition;
    }
});
function disableSmoothScrollDuringRouteTransition(fn, options = {}) {
    // if only the hash is changed, we don't need to disable smooth scrolling
    // we only care to prevent smooth scrolling when navigating to a new page to avoid jarring UX
    if (options.onlyHashChange) {
        fn();
        return;
    }
    const htmlElement = document.documentElement;
    const hasDataAttribute = htmlElement.dataset.scrollBehavior === 'smooth';
    if (!hasDataAttribute) {
        // Warn if smooth scrolling is detected but no data attribute is present
        if (("TURBOPACK compile-time value", "development") === 'development' && getComputedStyle(htmlElement).scrollBehavior === 'smooth') {
            const { warnOnce } = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)");
            warnOnce('Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling during route transitions, ' + 'add `data-scroll-behavior="smooth"` to your <html> element. ' + 'Learn more: https://nextjs.org/docs/messages/missing-data-scroll-behavior');
        }
        // No smooth scrolling configured, run directly without style manipulation
        fn();
        return;
    }
    // Proceed with temporarily disabling smooth scrolling
    const existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';
    if (!options.dontForceLayout) {
        // In Chrome-based browsers we need to force reflow before calling `scrollTo`.
        // Otherwise it will not pickup the change in scrollBehavior
        // More info here: https://github.com/vercel/next.js/issues/40719#issuecomment-1336248042
        htmlElement.getClientRects();
    }
    fn();
    htmlElement.style.scrollBehavior = existing;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/dynamic-filter-pattern.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// The client router filter handles app routes that begin with a dynamic segment
// (e.g. `/[locale]/about`). Such routes have no static prefix to anchor the
// prefix-based dynamic filter on, so the build-time producer
// (`createClientRouterFilter`) stores them as a normalized pattern with dynamic
// segments replaced by the placeholder token below, and the pages router
// reconstructs matching candidates from the route it resolved a navigation to.
/**
 * A token that can never collide with a real path segment (dynamic segments are
 * always `[name]`, `[...name]`, or `[[...name]]`, and static segments never
 * equal `[]`). Shared with the builder's `normalizeRouteToFilterPattern`.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DYNAMIC_FILTER_PLACEHOLDER: null,
    hasDynamicFilterCandidate: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DYNAMIC_FILTER_PLACEHOLDER: function() {
        return DYNAMIC_FILTER_PLACEHOLDER;
    },
    hasDynamicFilterCandidate: function() {
        return hasDynamicFilterCandidate;
    }
});
const DYNAMIC_FILTER_PLACEHOLDER = '[]';
/**
 * Beyond this many dynamic segments the 2^n candidate set is skipped. Real
 * routes never approach this; the cap only guards against pathological input.
 */ const MAX_DYNAMIC_SEGMENTS = 8;
function hasDynamicFilterCandidate(routePattern, concretePathname, test) {
    const routeSegments = routePattern.split('/');
    const concreteSegments = concretePathname.split('/');
    const lastSegment = routeSegments[routeSegments.length - 1] ?? '';
    const hasCatchAll = lastSegment.startsWith('[...') || lastSegment.startsWith('[[...');
    // A non-catch-all route always has the same segment count as the path it
    // matched; a mismatch there means the inputs don't line up. A catch-all route
    // legitimately differs because its final param absorbs the remaining
    // segments.
    if (!hasCatchAll && routeSegments.length !== concreteSegments.length) {
        return false;
    }
    // Collect the concrete positions that are dynamic in the matched route: any
    // position without a static route segment (a dynamic param, or one absorbed
    // by the trailing catch-all).
    const dynamicIndices = [];
    for(let i = 1; i < concreteSegments.length; i++){
        // An empty concrete segment is not a real path segment (splitting `/`
        // yields a trailing `''`). A trailing optional catch-all matches it by
        // absorbing nothing, so it must not be treated as a dynamic position:
        // otherwise `/` would reconstruct the `/[]` candidate and spuriously match
        // a root-level dynamic app route such as `/[lang]`, which does not own `/`.
        if (concreteSegments[i] === '') {
            continue;
        }
        const routeSegment = routeSegments[i];
        const isStaticSegment = routeSegment !== undefined && !routeSegment.startsWith('[');
        if (!isStaticSegment) {
            dynamicIndices.push(i);
        }
    }
    if (dynamicIndices.length === 0 || dynamicIndices.length > MAX_DYNAMIC_SEGMENTS) {
        return false;
    }
    // Enumerate the keep-literal/placeholder combinations as a bitmask over those
    // positions (a set bit keeps the concrete value, an unset bit is a
    // placeholder). The all-literal combination is skipped: a fully concrete path
    // is a static route, already covered by the static filter and the early
    // prefix check, so it can never appear in the dynamic filter as a pattern.
    const allLiteral = (1 << dynamicIndices.length) - 1;
    for(let mask = 0; mask < allLiteral; mask++){
        const segments = concreteSegments.slice();
        for(let bit = 0; bit < dynamicIndices.length; bit++){
            if ((mask & 1 << bit) === 0) {
                segments[dynamicIndices[bit]] = DYNAMIC_FILTER_PLACEHOLDER;
            }
        }
        if (test(segments.join('/'))) {
            return true;
        }
    }
    return false;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/format-next-pathname-info.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "formatNextPathnameInfo", {
    enumerable: true,
    get: function() {
        return formatNextPathnameInfo;
    }
});
const _removetrailingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-ssr] (ecmascript)");
const _addpathprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-path-prefix.js [app-ssr] (ecmascript)");
const _addpathsuffix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-path-suffix.js [app-ssr] (ecmascript)");
const _addlocale = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/add-locale.js [app-ssr] (ecmascript)");
function formatNextPathnameInfo(info) {
    let pathname = (0, _addlocale.addLocale)(info.pathname, info.locale, info.buildId ? undefined : info.defaultLocale, info.ignorePrefix);
    if (info.buildId || !info.trailingSlash) {
        pathname = (0, _removetrailingslash.removeTrailingSlash)(pathname);
    }
    if (info.buildId) {
        pathname = (0, _addpathsuffix.addPathSuffix)((0, _addpathprefix.addPathPrefix)(pathname, `/_next/data/${info.buildId}`), info.pathname === '/' ? 'index.json' : '.json');
    }
    pathname = (0, _addpathprefix.addPathPrefix)(pathname, info.basePath);
    return !info.buildId && info.trailingSlash ? !pathname.endsWith('/') ? (0, _addpathsuffix.addPathSuffix)(pathname, '/') : pathname : (0, _removetrailingslash.removeTrailingSlash)(pathname);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/format-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Format function modified from nodejs
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    formatUrl: null,
    formatWithValidation: null,
    urlObjectKeys: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    formatUrl: function() {
        return formatUrl;
    },
    formatWithValidation: function() {
        return formatWithValidation;
    },
    urlObjectKeys: function() {
        return urlObjectKeys;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-ssr] (ecmascript)");
const _querystring = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)"));
const slashedProtocols = /https?|ftp|gopher|file/;
function formatUrl(urlObj) {
    let { auth, hostname } = urlObj;
    let protocol = urlObj.protocol || '';
    let pathname = urlObj.pathname || '';
    let hash = urlObj.hash || '';
    let query = urlObj.query || '';
    let host = false;
    auth = auth ? encodeURIComponent(auth).replace(/%3A/i, ':') + '@' : '';
    if (urlObj.host) {
        host = auth + urlObj.host;
    } else if (hostname) {
        host = auth + (~hostname.indexOf(':') ? `[${hostname}]` : hostname);
        if (urlObj.port) {
            host += ':' + urlObj.port;
        }
    }
    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }
    let search = urlObj.search || query && `?${query}` || '';
    if (protocol && !protocol.endsWith(':')) protocol += ':';
    if (urlObj.slashes || (!protocol || slashedProtocols.test(protocol)) && host !== false) {
        host = '//' + (host || '');
        if (pathname && pathname[0] !== '/') pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }
    if (hash && hash[0] !== '#') hash = '#' + hash;
    if (search && search[0] !== '?') search = '?' + search;
    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    search = search.replace('#', '%23');
    return `${protocol}${host}${pathname}${search}${hash}`;
}
const urlObjectKeys = [
    'auth',
    'hash',
    'host',
    'hostname',
    'href',
    'path',
    'pathname',
    'port',
    'protocol',
    'query',
    'search',
    'slashes'
];
function formatWithValidation(url) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (url !== null && typeof url === 'object') {
            Object.keys(url).forEach((key)=>{
                if (!urlObjectKeys.includes(key)) {
                    console.warn(`Unknown key passed via urlObject into url.format: ${key}`);
                }
            });
        }
    }
    return formatUrl(url);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-asset-path-from-route.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Translates a logical route into its pages asset path (relative from a common prefix)
// "asset path" being its javascript file, data file, prerendered html,...
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return getAssetPathFromRoute;
    }
});
function getAssetPathFromRoute(route, ext = '') {
    const path = route === '/' ? '/index' : /^\/index(\/|$)/.test(route) ? `/index${route}` : route;
    return path + ext;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-dynamic-param.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    PARAMETER_PATTERN: null,
    getDynamicParam: null,
    interpolateParallelRouteParams: null,
    parseMatchedParameter: null,
    parseParameter: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    PARAMETER_PATTERN: function() {
        return PARAMETER_PATTERN;
    },
    getDynamicParam: function() {
        return getDynamicParam;
    },
    interpolateParallelRouteParams: function() {
        return interpolateParallelRouteParams;
    },
    parseMatchedParameter: function() {
        return parseMatchedParameter;
    },
    parseParameter: function() {
        return parseParameter;
    }
});
const _invarianterror = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _parseloadertree = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-loader-tree.js [app-ssr] (ecmascript)");
const _app = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/routes/app.js [app-ssr] (ecmascript)");
const _resolveparamvalue = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/resolve-param-value.js [app-ssr] (ecmascript)");
/**
 * Gets the value of a param from the params object. This correctly handles the
 * case where the param is a fallback route param and encodes the resulting
 * value.
 *
 * @param interpolatedParams - The params object.
 * @param segmentKey - The key of the segment.
 * @param fallbackRouteParams - The fallback route params.
 * @returns The value of the param.
 */ function getParamValue(interpolatedParams, segmentKey, fallbackRouteParams) {
    let value = interpolatedParams[segmentKey];
    if (fallbackRouteParams?.has(segmentKey)) {
        // We know that the fallback route params has the segment key because we
        // checked that above.
        const [searchValue] = fallbackRouteParams.get(segmentKey);
        value = searchValue;
    } else if (Array.isArray(value)) {
        value = value.map((i)=>encodeURIComponent(i));
    } else if (typeof value === 'string') {
        value = encodeURIComponent(value);
    }
    return value;
}
function interpolateParallelRouteParams(loaderTree, params, pagePath, fallbackRouteParams) {
    const interpolated = structuredClone(params);
    // Stack-based traversal with depth tracking
    const stack = [
        {
            tree: loaderTree,
            depth: 0
        }
    ];
    // Parse the route from the provided page path.
    const route = (0, _app.parseNormalizedAppRoute)(pagePath);
    while(stack.length > 0){
        const { tree, depth } = stack.pop();
        const { segment, parallelRoutes } = (0, _parseloadertree.parseLoaderTree)(tree);
        const appSegment = (0, _app.parseAppRouteSegment)(segment);
        if (appSegment?.type === 'dynamic' && !interpolated.hasOwnProperty(appSegment.param.paramName) && // If the param is in the fallback route params, we don't need to
        // interpolate it because it's already marked as being unknown.
        !fallbackRouteParams?.has(appSegment.param.paramName)) {
            const { paramName, paramType } = appSegment.param;
            const paramValue = (0, _resolveparamvalue.resolveParamValue)(paramName, paramType, depth, route, interpolated);
            if (paramValue !== undefined) {
                interpolated[paramName] = paramValue;
            } else if (paramType !== 'optional-catchall') {
                throw Object.defineProperty(new _invarianterror.InvariantError(`Could not resolve param value for segment: ${paramName}`), "__NEXT_ERROR_CODE", {
                    value: "E932",
                    enumerable: false,
                    configurable: true
                });
            }
        }
        // Calculate next depth - increment if this is not a route group and not empty
        let nextDepth = depth;
        if (appSegment && appSegment.type !== 'route-group' && appSegment.type !== 'parallel-route') {
            nextDepth++;
        }
        // Add all parallel routes to the stack for processing
        for (const parallelRoute of Object.values(parallelRoutes)){
            stack.push({
                tree: parallelRoute,
                depth: nextDepth
            });
        }
    }
    return interpolated;
}
function getDynamicParam(interpolatedParams, segmentKey, dynamicParamType, fallbackRouteParams, staticSiblings) {
    let value = getParamValue(interpolatedParams, segmentKey, fallbackRouteParams);
    // handle the case where an optional catchall does not have a value,
    // e.g. `/dashboard/[[...slug]]` when requesting `/dashboard`
    if (!value || value.length === 0) {
        if (dynamicParamType === 'oc') {
            return {
                param: segmentKey,
                value: null,
                type: dynamicParamType,
                treeSegment: [
                    segmentKey,
                    '',
                    dynamicParamType,
                    staticSiblings
                ]
            };
        }
        throw Object.defineProperty(new _invarianterror.InvariantError(`Missing value for segment key: "${segmentKey}" with dynamic param type: ${dynamicParamType}`), "__NEXT_ERROR_CODE", {
            value: "E864",
            enumerable: false,
            configurable: true
        });
    }
    const paramCacheKey = Array.isArray(value) ? value.join('/') : value;
    return {
        param: segmentKey,
        // The value that is passed to user code.
        value,
        // The value that is rendered in the router tree.
        // TODO: If the number of static siblings exceeds some threshold (e.g.,
        // dozens or hundreds), consider sending a Bloom filter instead of the full
        // array to reduce payload size. The client would then use the Bloom filter
        // to check membership with a small false positive rate.
        treeSegment: [
            segmentKey,
            paramCacheKey,
            dynamicParamType,
            staticSiblings
        ],
        type: dynamicParamType
    };
}
const PARAMETER_PATTERN = /^([^[]*)\[((?:\[[^\]]*\])|[^\]]+)\](.*)$/;
function parseParameter(param) {
    const match = param.match(PARAMETER_PATTERN);
    if (!match) {
        return parseMatchedParameter(param);
    }
    return parseMatchedParameter(match[2]);
}
function parseMatchedParameter(param) {
    const optional = param.startsWith('[') && param.endsWith(']');
    if (optional) {
        param = param.slice(1, -1);
    }
    const repeat = param.startsWith('...');
    if (repeat) {
        param = param.slice(3);
    }
    return {
        key: param,
        repeat,
        optional
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-next-pathname-info.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getNextPathnameInfo", {
    enumerable: true,
    get: function() {
        return getNextPathnameInfo;
    }
});
const _normalizelocalepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/i18n/normalize-locale-path.js [app-ssr] (ecmascript)");
const _removepathprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js [app-ssr] (ecmascript)");
const _pathhasprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-ssr] (ecmascript)");
function getNextPathnameInfo(pathname, options) {
    const { basePath, i18n, trailingSlash } = options.nextConfig ?? {};
    const info = {
        pathname,
        trailingSlash: pathname !== '/' ? pathname.endsWith('/') : trailingSlash
    };
    if (basePath && (0, _pathhasprefix.pathHasPrefix)(info.pathname, basePath)) {
        info.pathname = (0, _removepathprefix.removePathPrefix)(info.pathname, basePath);
        info.basePath = basePath;
    }
    let pathnameNoDataPrefix = info.pathname;
    if (info.pathname.startsWith('/_next/data/') && info.pathname.endsWith('.json')) {
        const paths = info.pathname.replace(/^\/_next\/data\//, '').replace(/\.json$/, '').split('/');
        const buildId = paths[0];
        info.buildId = buildId;
        pathnameNoDataPrefix = paths[1] !== 'index' ? `/${paths.slice(1).join('/')}` : '/';
        // update pathname with normalized if enabled although
        // we use normalized to populate locale info still
        if (options.parseData === true) {
            info.pathname = pathnameNoDataPrefix;
        }
    }
    // If provided, use the locale route normalizer to detect the locale instead
    // of the function below.
    if (i18n) {
        let result = options.i18nProvider ? options.i18nProvider.analyze(info.pathname) : (0, _normalizelocalepath.normalizeLocalePath)(info.pathname, i18n.locales);
        info.locale = result.detectedLocale;
        info.pathname = result.pathname ?? info.pathname;
        if (!result.detectedLocale && info.buildId) {
            result = options.i18nProvider ? options.i18nProvider.analyze(pathnameNoDataPrefix) : (0, _normalizelocalepath.normalizeLocalePath)(pathnameNoDataPrefix, i18n.locales);
            if (result.detectedLocale) {
                info.locale = result.detectedLocale;
            }
        }
    }
    return info;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-segment-param.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getParamProperties: null,
    getSegmentParam: null,
    isCatchAll: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getParamProperties: function() {
        return getParamProperties;
    },
    getSegmentParam: function() {
        return getSegmentParam;
    },
    isCatchAll: function() {
        return isCatchAll;
    }
});
const _interceptionroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)");
function getSegmentParam(segment) {
    const interceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((marker)=>segment.startsWith(marker));
    // if an interception marker is part of the path segment, we need to jump ahead
    // to the relevant portion for param parsing
    if (interceptionMarker) {
        segment = segment.slice(interceptionMarker.length);
    }
    if (segment.startsWith('[[...') && segment.endsWith(']]')) {
        return {
            // TODO-APP: Optional catchall does not currently work with parallel routes,
            // so for now aren't handling a potential interception marker.
            paramType: 'optional-catchall',
            paramName: segment.slice(5, -2)
        };
    }
    if (segment.startsWith('[...') && segment.endsWith(']')) {
        return {
            paramType: interceptionMarker ? `catchall-intercepted-${interceptionMarker}` : 'catchall',
            paramName: segment.slice(4, -1)
        };
    }
    if (segment.startsWith('[') && segment.endsWith(']')) {
        return {
            paramType: interceptionMarker ? `dynamic-intercepted-${interceptionMarker}` : 'dynamic',
            paramName: segment.slice(1, -1)
        };
    }
    return null;
}
function isCatchAll(type) {
    return type === 'catchall' || type === 'catchall-intercepted-(..)(..)' || type === 'catchall-intercepted-(.)' || type === 'catchall-intercepted-(..)' || type === 'catchall-intercepted-(...)' || type === 'optional-catchall';
}
function getParamProperties(paramType) {
    let repeat = false;
    let optional = false;
    switch(paramType){
        case 'catchall':
        case 'catchall-intercepted-(..)(..)':
        case 'catchall-intercepted-(.)':
        case 'catchall-intercepted-(..)':
        case 'catchall-intercepted-(...)':
            repeat = true;
            break;
        case 'optional-catchall':
            repeat = true;
            optional = true;
            break;
        case 'dynamic':
        case 'dynamic-intercepted-(..)(..)':
        case 'dynamic-intercepted-(.)':
        case 'dynamic-intercepted-(..)':
        case 'dynamic-intercepted-(...)':
            break;
        default:
            paramType;
    }
    return {
        repeat,
        optional
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/html-bots.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This regex contains the bots that we need to do a blocking render for and can't safely stream the response
// due to how they parse the DOM. For example, they might explicitly check for metadata in the `head` tag, so we can't stream metadata tags after the `head` was sent.
// Note: The pattern [\w-]+-Google captures all Google crawlers with "-Google" suffix (e.g., Mediapartners-Google, AdsBot-Google, Storebot-Google)
// as well as crawlers starting with "Google-" (e.g., Google-PageRenderer, Google-InspectionTool)
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "HTML_LIMITED_BOT_UA_RE", {
    enumerable: true,
    get: function() {
        return HTML_LIMITED_BOT_UA_RE;
    }
});
const HTML_LIMITED_BOT_UA_RE = /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i;
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/index.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getSortedRouteObjects: null,
    getSortedRoutes: null,
    isDynamicRoute: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getSortedRouteObjects: function() {
        return _sortedroutes.getSortedRouteObjects;
    },
    getSortedRoutes: function() {
        return _sortedroutes.getSortedRoutes;
    },
    isDynamicRoute: function() {
        return _isdynamic.isDynamicRoute;
    }
});
const _sortedroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/sorted-routes.js [app-ssr] (ecmascript)");
const _isdynamic = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-dynamic.js [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-prefix-from-param-type.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "interceptionPrefixFromParamType", {
    enumerable: true,
    get: function() {
        return interceptionPrefixFromParamType;
    }
});
function interceptionPrefixFromParamType(paramType) {
    switch(paramType){
        case 'catchall-intercepted-(..)(..)':
        case 'dynamic-intercepted-(..)(..)':
            return '(..)(..)';
        case 'catchall-intercepted-(.)':
        case 'dynamic-intercepted-(.)':
            return '(.)';
        case 'catchall-intercepted-(..)':
        case 'dynamic-intercepted-(..)':
            return '(..)';
        case 'catchall-intercepted-(...)':
        case 'dynamic-intercepted-(...)':
            return '(...)';
        case 'catchall':
        case 'dynamic':
        case 'optional-catchall':
        default:
            return null;
    }
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    INTERCEPTION_ROUTE_MARKERS: null,
    extractInterceptionRouteInformation: null,
    isInterceptionRouteAppPath: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    INTERCEPTION_ROUTE_MARKERS: function() {
        return INTERCEPTION_ROUTE_MARKERS;
    },
    extractInterceptionRouteInformation: function() {
        return extractInterceptionRouteInformation;
    },
    isInterceptionRouteAppPath: function() {
        return isInterceptionRouteAppPath;
    }
});
const _apppaths = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/app-paths.js [app-ssr] (ecmascript)");
const INTERCEPTION_ROUTE_MARKERS = [
    '(..)(..)',
    '(.)',
    '(..)',
    '(...)'
];
function isInterceptionRouteAppPath(path) {
    // TODO-APP: add more serious validation
    return path.split('/').find((segment)=>INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m))) !== undefined;
}
function extractInterceptionRouteInformation(path) {
    let interceptingRoute;
    let marker;
    let interceptedRoute;
    for (const segment of path.split('/')){
        marker = INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        if (marker) {
            ;
            [interceptingRoute, interceptedRoute] = path.split(marker, 2);
            break;
        }
    }
    if (!interceptingRoute || !marker || !interceptedRoute) {
        throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", {
            value: "E269",
            enumerable: false,
            configurable: true
        });
    }
    interceptingRoute = (0, _apppaths.normalizeAppPath)(interceptingRoute) // normalize the path, e.g. /(blog)/feed -> /feed
    ;
    switch(marker){
        case '(.)':
            // (.) indicates that we should match with sibling routes, so we just need to append the intercepted route to the intercepting route
            if (interceptingRoute === '/') {
                interceptedRoute = `/${interceptedRoute}`;
            } else {
                interceptedRoute = interceptingRoute + '/' + interceptedRoute;
            }
            break;
        case '(..)':
            // (..) indicates that we should match at one level up, so we need to remove the last segment of the intercepting route
            if (interceptingRoute === '/') {
                throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", {
                    value: "E207",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptedRoute = interceptingRoute.split('/').slice(0, -1).concat(interceptedRoute).join('/');
            break;
        case '(...)':
            // (...) will match the route segment in the root directory, so we need to use the root directory to prepend the intercepted route
            interceptedRoute = '/' + interceptedRoute;
            break;
        case '(..)(..)':
            // (..)(..) indicates that we should match at two levels up, so we need to remove the last two segments of the intercepting route
            const splitInterceptingRoute = interceptingRoute.split('/');
            if (splitInterceptingRoute.length <= 2) {
                throw Object.defineProperty(new Error(`Invalid interception route: ${path}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", {
                    value: "E486",
                    enumerable: false,
                    configurable: true
                });
            }
            interceptedRoute = splitInterceptingRoute.slice(0, -2).concat(interceptedRoute).join('/');
            break;
        default:
            throw Object.defineProperty(new Error('Invariant: unexpected marker'), "__NEXT_ERROR_CODE", {
                value: "E112",
                enumerable: false,
                configurable: true
            });
    }
    return {
        interceptingRoute,
        interceptedRoute
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interpolate-as.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "interpolateAs", {
    enumerable: true,
    get: function() {
        return interpolateAs;
    }
});
const _routematcher = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-matcher.js [app-ssr] (ecmascript)");
const _routeregex = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-regex.js [app-ssr] (ecmascript)");
function interpolateAs(route, asPathname, query) {
    let interpolatedRoute = '';
    const dynamicRegex = (0, _routeregex.getRouteRegex)(route);
    const dynamicGroups = dynamicRegex.groups;
    const dynamicMatches = (asPathname !== route ? (0, _routematcher.getRouteMatcher)(dynamicRegex)(asPathname) : '') || // Fall back to reading the values from the href
    // TODO: should this take priority; also need to change in the router.
    query;
    interpolatedRoute = route;
    const params = Object.keys(dynamicGroups);
    if (!params.every((param)=>{
        let value = dynamicMatches[param] || '';
        const { repeat, optional } = dynamicGroups[param];
        // support single-level catch-all
        // TODO: more robust handling for user-error (passing `/`)
        let replaced = `[${repeat ? '...' : ''}${param}]`;
        if (optional) {
            replaced = `${!value ? '/' : ''}[${replaced}]`;
        }
        if (repeat && !Array.isArray(value)) value = [
            value
        ];
        return (optional || param in dynamicMatches) && // Interpolate group into data URL if present
        (interpolatedRoute = interpolatedRoute.replace(replaced, repeat ? value.map(// path delimiter escaped since they are being inserted
        // into the URL and we expect URL encoded segments
        // when parsing dynamic route params
        (segment)=>encodeURIComponent(segment)).join('/') : encodeURIComponent(value)) || '/');
    })) {
        interpolatedRoute = '' // did not satisfy all requirements
        ;
    // n.b. We ignore this error because we handle warning for this case in
    // development in the `<Link>` component directly.
    }
    return {
        params,
        result: interpolatedRoute
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-bot.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HTML_LIMITED_BOT_UA_RE: null,
    HTML_LIMITED_BOT_UA_RE_STRING: null,
    getBotType: null,
    isBot: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HTML_LIMITED_BOT_UA_RE: function() {
        return _htmlbots.HTML_LIMITED_BOT_UA_RE;
    },
    HTML_LIMITED_BOT_UA_RE_STRING: function() {
        return HTML_LIMITED_BOT_UA_RE_STRING;
    },
    getBotType: function() {
        return getBotType;
    },
    isBot: function() {
        return isBot;
    }
});
const _htmlbots = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/html-bots.js [app-ssr] (ecmascript)");
// Bot crawler that will spin up a headless browser and execute JS.
// Only the main Googlebot search crawler executes JavaScript, not other Google crawlers.
// x-ref: https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers
// This regex specifically matches "Googlebot" but NOT "Mediapartners-Google", "AdsBot-Google", etc.
const HEADLESS_BROWSER_BOT_UA_RE = /Googlebot(?!-)|Googlebot$/i;
const HTML_LIMITED_BOT_UA_RE_STRING = _htmlbots.HTML_LIMITED_BOT_UA_RE.source;
function isDomBotUA(userAgent) {
    return HEADLESS_BROWSER_BOT_UA_RE.test(userAgent);
}
function isHtmlLimitedBotUA(userAgent) {
    return _htmlbots.HTML_LIMITED_BOT_UA_RE.test(userAgent);
}
function isBot(userAgent) {
    return isDomBotUA(userAgent) || isHtmlLimitedBotUA(userAgent);
}
function getBotType(userAgent) {
    if (isDomBotUA(userAgent)) {
        return 'dom';
    }
    if (isHtmlLimitedBotUA(userAgent)) {
        return 'html';
    }
    return undefined;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-dynamic.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isDynamicRoute", {
    enumerable: true,
    get: function() {
        return isDynamicRoute;
    }
});
const _interceptionroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)");
// Identify /.*[param].*/ in route string
const TEST_ROUTE = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/;
// Identify /[param]/ in route string
const TEST_STRICT_ROUTE = /\/\[[^/]+\](?=\/|$)/;
function isDynamicRoute(route, strict = true) {
    if ((0, _interceptionroutes.isInterceptionRouteAppPath)(route)) {
        route = (0, _interceptionroutes.extractInterceptionRouteInformation)(route).interceptedRoute;
    }
    if (strict) {
        return TEST_STRICT_ROUTE.test(route);
    }
    return TEST_ROUTE.test(route);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/is-local-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "isLocalURL", {
    enumerable: true,
    get: function() {
        return isLocalURL;
    }
});
const _utils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _hasbasepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/has-base-path.js [app-ssr] (ecmascript)");
function isLocalURL(url) {
    // prevent a hydration mismatch on href for url with anchor refs
    if (!(0, _utils.isAbsoluteUrl)(url)) return true;
    try {
        // absolute urls can be local if they are on the same origin
        const locationOrigin = (0, _utils.getLocationOrigin)();
        const resolved = new URL(url, locationOrigin);
        return resolved.origin === locationOrigin && (0, _hasbasepath.hasBasePath)(resolved.pathname);
    } catch (_) {
        return false;
    }
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/omit.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "omit", {
    enumerable: true,
    get: function() {
        return omit;
    }
});
function omit(object, keys) {
    const omitted = {};
    Object.keys(object).forEach((key)=>{
        if (!keys.includes(key)) {
            omitted[key] = object[key];
        }
    });
    return omitted;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-loader-tree.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseLoaderTree", {
    enumerable: true,
    get: function() {
        return parseLoaderTree;
    }
});
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
function parseLoaderTree(tree) {
    const [segment, parallelRoutes, modules, staticSiblings] = tree;
    const { layout, template } = modules;
    let { page } = modules;
    // a __DEFAULT__ segment means that this route didn't match any of the
    // segments in the route, so we should use the default page
    page = segment === _segment.DEFAULT_SEGMENT_KEY ? modules.defaultPage : page;
    const conventionPath = layout?.[1] || template?.[1] || page?.[1];
    return {
        page,
        segment,
        modules,
        /* it can be either layout / template / page */ conventionPath,
        parallelRoutes,
        staticSiblings
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Given a path this function will find the pathname, query and hash and return
 * them. This is useful to parse full paths on the client side.
 * @param path A path to parse e.g. /foo/bar?id=1#hash
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parsePath", {
    enumerable: true,
    get: function() {
        return parsePath;
    }
});
function parsePath(path) {
    const hashIndex = path.indexOf('#');
    const queryIndex = path.indexOf('?');
    const hasQuery = queryIndex > -1 && (hashIndex < 0 || queryIndex < hashIndex);
    if (hasQuery || hashIndex > -1) {
        return {
            pathname: path.substring(0, hasQuery ? queryIndex : hashIndex),
            query: hasQuery ? path.substring(queryIndex, hashIndex > -1 ? hashIndex : undefined) : '',
            hash: hashIndex > -1 ? path.slice(hashIndex) : ''
        };
    }
    return {
        pathname: path,
        query: '',
        hash: ''
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-relative-url.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "parseRelativeUrl", {
    enumerable: true,
    get: function() {
        return parseRelativeUrl;
    }
});
const _utils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _querystring = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)");
function parseRelativeUrl(url, base, parseQuery = true) {
    const globalBase = new URL(("TURBOPACK compile-time truthy", 1) ? 'http://n' : "TURBOPACK unreachable");
    const resolvedBase = base ? new URL(base, globalBase) : url.startsWith('.') ? new URL(("TURBOPACK compile-time truthy", 1) ? 'http://n' : "TURBOPACK unreachable") : globalBase;
    const { pathname, searchParams, search, hash, href, origin } = url.startsWith('/') ? // Not using `origin` to support other protocols
    new URL(`${resolvedBase.protocol}//${resolvedBase.host}${url}`) : new URL(url, resolvedBase);
    if (origin !== globalBase.origin) {
        throw Object.defineProperty(new Error(`invariant: invalid relative URL, router received ${url}`), "__NEXT_ERROR_CODE", {
            value: "E159",
            enumerable: false,
            configurable: true
        });
    }
    return {
        auth: null,
        host: null,
        hostname: null,
        pathname,
        port: null,
        protocol: null,
        query: parseQuery ? (0, _querystring.searchParamsToUrlQuery)(searchParams) : undefined,
        search,
        hash,
        href: href.slice(origin.length),
        // We don't know for relative URLs at this point since we set a custom, internal
        // base that isn't surfaced to users.
        slashes: null
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "pathHasPrefix", {
    enumerable: true,
    get: function() {
        return pathHasPrefix;
    }
});
const _parsepath = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/parse-path.js [app-ssr] (ecmascript)");
function pathHasPrefix(path, prefix) {
    if (typeof path !== 'string') {
        return false;
    }
    const { pathname } = (0, _parsepath.parsePath)(path);
    return pathname === prefix || pathname.startsWith(prefix + '/');
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/querystring.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    assign: null,
    searchParamsToUrlQuery: null,
    urlQueryToSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    assign: function() {
        return assign;
    },
    searchParamsToUrlQuery: function() {
        return searchParamsToUrlQuery;
    },
    urlQueryToSearchParams: function() {
        return urlQueryToSearchParams;
    }
});
function searchParamsToUrlQuery(searchParams) {
    const query = {};
    for (const [key, value] of searchParams.entries()){
        const existing = query[key];
        if (typeof existing === 'undefined') {
            query[key] = value;
        } else if (Array.isArray(existing)) {
            existing.push(value);
        } else {
            query[key] = [
                existing,
                value
            ];
        }
    }
    return query;
}
function stringifyUrlQueryParam(param) {
    if (typeof param === 'string') {
        return param;
    }
    if (typeof param === 'number' && !isNaN(param) || typeof param === 'boolean') {
        return String(param);
    } else {
        return '';
    }
}
function urlQueryToSearchParams(query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)){
        if (Array.isArray(value)) {
            for (const item of value){
                searchParams.append(key, stringifyUrlQueryParam(item));
            }
        } else {
            searchParams.set(key, stringifyUrlQueryParam(value));
        }
    }
    return searchParams;
}
function assign(target, ...searchParamsList) {
    for (const searchParams of searchParamsList){
        for (const key of searchParams.keys()){
            target.delete(key);
        }
        for (const [key, value] of searchParams.entries()){
            target.append(key, value);
        }
    }
    return target;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/remove-path-prefix.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removePathPrefix", {
    enumerable: true,
    get: function() {
        return removePathPrefix;
    }
});
const _pathhasprefix = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/path-has-prefix.js [app-ssr] (ecmascript)");
function removePathPrefix(path, prefix) {
    // If the path doesn't start with the prefix we can return it as is. This
    // protects us from situations where the prefix is a substring of the path
    // prefix such as:
    //
    // For prefix: /blog
    //
    //   /blog -> true
    //   /blog/ -> true
    //   /blog/1 -> true
    //   /blogging -> false
    //   /blogging/ -> false
    //   /blogging/1 -> false
    if (!(0, _pathhasprefix.pathHasPrefix)(path, prefix)) {
        return path;
    }
    // Remove the prefix from the path via slicing.
    const withoutPrefix = path.slice(prefix.length);
    // If the path without the prefix starts with a `/` we can return it as is.
    if (withoutPrefix.startsWith('/')) {
        return withoutPrefix;
    }
    // If the path without the prefix doesn't start with a `/` we need to add it
    // back to the path to make sure it's a valid path.
    return `/${withoutPrefix}`;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Removes the trailing slash for a given route or page path. Examples:
 *   - `/foo/bar/` -> `/foo/bar`
 *   - `/foo/bar` -> `/foo/bar`
 *
 * Uses charCodeAt (47 === '/') instead of regex to avoid the overhead of
 * compiling and executing a RegExp on every call (~3-5x faster).
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "removeTrailingSlash", {
    enumerable: true,
    get: function() {
        return removeTrailingSlash;
    }
});
function removeTrailingSlash(route) {
    return route.charCodeAt(route.length - 1) === 47 && route.length > 1 ? route.slice(0, -1) : route;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/resolve-param-value.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "resolveParamValue", {
    enumerable: true,
    get: function() {
        return resolveParamValue;
    }
});
const _invarianterror = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/invariant-error.js [app-ssr] (ecmascript)");
const _interceptionprefixfromparamtype = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-prefix-from-param-type.js [app-ssr] (ecmascript)");
/**
 * Extracts the param value from a path segment, handling interception markers
 * based on the expected param type.
 *
 * @param pathSegment - The path segment to extract the value from
 * @param params - The current params object for resolving dynamic param references
 * @param paramType - The expected param type which may include interception marker info
 * @returns The extracted param value
 */ function getParamValueFromSegment(pathSegment, params, paramType) {
    // If the segment is dynamic, resolve it from the params object
    if (pathSegment.type === 'dynamic') {
        return params[pathSegment.param.paramName];
    }
    // If the paramType indicates this is an intercepted param, strip the marker
    // that matches the interception marker in the param type
    const interceptionPrefix = (0, _interceptionprefixfromparamtype.interceptionPrefixFromParamType)(paramType);
    if (interceptionPrefix === pathSegment.interceptionMarker) {
        return pathSegment.name.replace(pathSegment.interceptionMarker, '');
    }
    // For static segments, use the name
    return pathSegment.name;
}
function resolveParamValue(paramName, paramType, depth, route, params) {
    switch(paramType){
        case 'catchall':
        case 'optional-catchall':
        case 'catchall-intercepted-(..)(..)':
        case 'catchall-intercepted-(.)':
        case 'catchall-intercepted-(..)':
        case 'catchall-intercepted-(...)':
            // For catchall routes, derive from pathname using depth to determine
            // which segments to use
            const processedSegments = [];
            // Process segments to handle any embedded dynamic params
            for(let index = depth; index < route.segments.length; index++){
                const pathSegment = route.segments[index];
                if (pathSegment.type === 'static') {
                    let value = pathSegment.name;
                    // For intercepted catch-all params, strip the marker from the first segment
                    const interceptionPrefix = (0, _interceptionprefixfromparamtype.interceptionPrefixFromParamType)(paramType);
                    if (interceptionPrefix && index === depth && interceptionPrefix === pathSegment.interceptionMarker) {
                        // Strip the interception marker from the value
                        value = value.replace(pathSegment.interceptionMarker, '');
                    }
                    processedSegments.push(value);
                } else {
                    // If the segment is a param placeholder, check if we have its value
                    if (!params.hasOwnProperty(pathSegment.param.paramName)) {
                        // If the segment is an optional catchall, we can break out of the
                        // loop because it's optional!
                        if (pathSegment.param.paramType === 'optional-catchall') {
                            break;
                        }
                        // Unknown param placeholder in pathname - can't derive full value
                        return undefined;
                    }
                    // If the segment matches a param, use the param value
                    // We don't encode values here as that's handled during retrieval.
                    const paramValue = params[pathSegment.param.paramName];
                    if (Array.isArray(paramValue)) {
                        processedSegments.push(...paramValue);
                    } else {
                        processedSegments.push(paramValue);
                    }
                }
            }
            if (processedSegments.length > 0) {
                return processedSegments;
            } else if (paramType === 'optional-catchall') {
                return undefined;
            } else {
                // We shouldn't be able to match a catchall segment without any path
                // segments if it's not an optional catchall
                throw Object.defineProperty(new _invarianterror.InvariantError(`Unexpected empty path segments match for a route "${route.pathname}" with param "${paramName}" of type "${paramType}"`), "__NEXT_ERROR_CODE", {
                    value: "E931",
                    enumerable: false,
                    configurable: true
                });
            }
        case 'dynamic':
        case 'dynamic-intercepted-(..)(..)':
        case 'dynamic-intercepted-(.)':
        case 'dynamic-intercepted-(..)':
        case 'dynamic-intercepted-(...)':
            // For regular dynamic parameters, take the segment at this depth
            if (depth < route.segments.length) {
                const pathSegment = route.segments[depth];
                // Check if the segment at this depth is a placeholder for an unknown param
                if (pathSegment.type === 'dynamic' && !params.hasOwnProperty(pathSegment.param.paramName)) {
                    // The segment is a placeholder like [category] and we don't have the value
                    return undefined;
                }
                // If the segment matches a param, use the param value from params object
                // Otherwise it's a static segment, just use it directly
                // We don't encode values here as that's handled during retrieval
                return getParamValueFromSegment(pathSegment, params, paramType);
            }
            return undefined;
        default:
            paramType;
    }
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-match-utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Client-safe utilities for route matching that don't import server-side
 * utilities to avoid bundling issues with Turbopack
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    safeCompile: null,
    safePathToRegexp: null,
    safeRegexpToFunction: null,
    safeRouteMatcher: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    safeCompile: function() {
        return safeCompile;
    },
    safePathToRegexp: function() {
        return safePathToRegexp;
    },
    safeRegexpToFunction: function() {
        return safeRegexpToFunction;
    },
    safeRouteMatcher: function() {
        return safeRouteMatcher;
    }
});
const _pathtoregexp = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/compiled/path-to-regexp/index.js [app-ssr] (ecmascript)");
const _routepatternnormalizer = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/route-pattern-normalizer.js [app-ssr] (ecmascript)");
function safePathToRegexp(route, keys, options) {
    if (typeof route !== 'string') {
        return (0, _pathtoregexp.pathToRegexp)(route, keys, options);
    }
    // Check if normalization is needed and cache the result
    const needsNormalization = (0, _routepatternnormalizer.hasAdjacentParameterIssues)(route);
    const routeToUse = needsNormalization ? (0, _routepatternnormalizer.normalizeAdjacentParameters)(route) : route;
    try {
        return (0, _pathtoregexp.pathToRegexp)(routeToUse, keys, options);
    } catch (error) {
        // Only try normalization if we haven't already normalized
        if (!needsNormalization) {
            try {
                const normalizedRoute = (0, _routepatternnormalizer.normalizeAdjacentParameters)(route);
                return (0, _pathtoregexp.pathToRegexp)(normalizedRoute, keys, options);
            } catch (retryError) {
                // If that doesn't work, fall back to original error
                throw error;
            }
        }
        throw error;
    }
}
function safeCompile(route, options) {
    // Check if normalization is needed and cache the result
    const needsNormalization = (0, _routepatternnormalizer.hasAdjacentParameterIssues)(route);
    const routeToUse = needsNormalization ? (0, _routepatternnormalizer.normalizeAdjacentParameters)(route) : route;
    try {
        const compiler = (0, _pathtoregexp.compile)(routeToUse, options);
        // If we normalized the route, wrap the compiler to strip separators from output
        // The normalization inserts _NEXTSEP_ as a literal string in the pattern to satisfy
        // path-to-regexp validation, but we don't want it in the final compiled URL
        if (needsNormalization) {
            return (params)=>{
                return (0, _routepatternnormalizer.stripNormalizedSeparators)(compiler(params));
            };
        }
        return compiler;
    } catch (error) {
        // Only try normalization if we haven't already normalized
        if (!needsNormalization) {
            try {
                const normalizedRoute = (0, _routepatternnormalizer.normalizeAdjacentParameters)(route);
                const compiler = (0, _pathtoregexp.compile)(normalizedRoute, options);
                // Wrap the compiler to strip separators from output
                return (params)=>{
                    return (0, _routepatternnormalizer.stripNormalizedSeparators)(compiler(params));
                };
            } catch (retryError) {
                // If that doesn't work, fall back to original error
                throw error;
            }
        }
        throw error;
    }
}
function safeRegexpToFunction(regexp, keys) {
    const originalMatcher = (0, _pathtoregexp.regexpToFunction)(regexp, keys || []);
    return (pathname)=>{
        const result = originalMatcher(pathname);
        if (!result) return false;
        // Clean parameters before returning
        return {
            ...result,
            params: (0, _routepatternnormalizer.stripParameterSeparators)(result.params)
        };
    };
}
function safeRouteMatcher(matcherFn) {
    return (pathname)=>{
        const result = matcherFn(pathname);
        if (!result) return false;
        // Clean parameters before returning
        return (0, _routepatternnormalizer.stripParameterSeparators)(result);
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-matcher.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getRouteMatcher", {
    enumerable: true,
    get: function() {
        return getRouteMatcher;
    }
});
const _utils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)");
const _routematchutils = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-match-utils.js [app-ssr] (ecmascript)");
function getRouteMatcher({ re, groups }) {
    const rawMatcher = (pathname)=>{
        const routeMatch = re.exec(pathname);
        if (!routeMatch) return false;
        const decode = (param)=>{
            try {
                return decodeURIComponent(param);
            } catch  {
                throw Object.defineProperty(new _utils.DecodeError('failed to decode param'), "__NEXT_ERROR_CODE", {
                    value: "E528",
                    enumerable: false,
                    configurable: true
                });
            }
        };
        const params = {};
        for (const [key, group] of Object.entries(groups)){
            const match = routeMatch[group.pos];
            if (match !== undefined) {
                if (group.repeat) {
                    params[key] = match.split('/').map((entry)=>decode(entry));
                } else {
                    params[key] = decode(match);
                }
            }
        }
        return params;
    };
    // Wrap with safe matcher to handle parameter cleaning
    return (0, _routematchutils.safeRouteMatcher)(rawMatcher);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/route-regex.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getNamedMiddlewareRegex: null,
    getNamedRouteRegex: null,
    getRouteRegex: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getNamedMiddlewareRegex: function() {
        return getNamedMiddlewareRegex;
    },
    getNamedRouteRegex: function() {
        return getNamedRouteRegex;
    },
    getRouteRegex: function() {
        return getRouteRegex;
    }
});
const _constants = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/lib/constants.js [app-ssr] (ecmascript)");
const _interceptionroutes = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/interception-routes.js [app-ssr] (ecmascript)");
const _escaperegexp = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/escape-regexp.js [app-ssr] (ecmascript)");
const _removetrailingslash = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/remove-trailing-slash.js [app-ssr] (ecmascript)");
const _getdynamicparam = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/get-dynamic-param.js [app-ssr] (ecmascript)");
function getParametrizedRoute(route, includeSuffix, includePrefix) {
    const groups = {};
    let groupIndex = 1;
    const segments = [];
    for (const segment of (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split('/')){
        const markerMatch = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.find((m)=>segment.startsWith(m));
        const paramMatches = segment.match(_getdynamicparam.PARAMETER_PATTERN) // Check for parameters
        ;
        if (markerMatch && paramMatches && paramMatches[2]) {
            const { key, optional, repeat } = (0, _getdynamicparam.parseMatchedParameter)(paramMatches[2]);
            groups[key] = {
                pos: groupIndex++,
                repeat,
                optional
            };
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(markerMatch)}([^/]+?)`);
        } else if (paramMatches && paramMatches[2]) {
            const { key, repeat, optional } = (0, _getdynamicparam.parseMatchedParameter)(paramMatches[2]);
            groups[key] = {
                pos: groupIndex++,
                repeat,
                optional
            };
            if (includePrefix && paramMatches[1]) {
                segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(paramMatches[1])}`);
            }
            let s = repeat ? optional ? '(?:/(.+?))?' : '/(.+?)' : '/([^/]+?)';
            // Remove the leading slash if includePrefix already added it.
            if (includePrefix && paramMatches[1]) {
                s = s.substring(1);
            }
            segments.push(s);
        } else {
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(segment)}`);
        }
        // If there's a suffix, add it to the segments if it's enabled.
        if (includeSuffix && paramMatches && paramMatches[3]) {
            segments.push((0, _escaperegexp.escapeStringRegexp)(paramMatches[3]));
        }
    }
    return {
        parameterizedRoute: segments.join(''),
        groups
    };
}
function getRouteRegex(normalizedRoute, { includeSuffix = false, includePrefix = false, excludeOptionalTrailingSlash = false } = {}) {
    const { parameterizedRoute, groups } = getParametrizedRoute(normalizedRoute, includeSuffix, includePrefix);
    let re = parameterizedRoute;
    if (!excludeOptionalTrailingSlash) {
        re += '(?:/)?';
    }
    return {
        re: new RegExp(`^${re}$`),
        groups: groups
    };
}
/**
 * Builds a function to generate a minimal routeKey using only a-z and minimal
 * number of characters.
 */ function buildGetSafeRouteKey() {
    let i = 0;
    return ()=>{
        let routeKey = '';
        let j = ++i;
        while(j > 0){
            routeKey += String.fromCharCode(97 + (j - 1) % 26);
            j = Math.floor((j - 1) / 26);
        }
        return routeKey;
    };
}
function getSafeKeyFromSegment({ interceptionMarker, getSafeRouteKey, segment, routeKeys, keyPrefix, backreferenceDuplicateKeys }) {
    const { key, optional, repeat } = (0, _getdynamicparam.parseMatchedParameter)(segment);
    // replace any non-word characters since they can break
    // the named regex
    let cleanedKey = key.replace(/\W/g, '');
    if (keyPrefix) {
        cleanedKey = `${keyPrefix}${cleanedKey}`;
    }
    let invalidKey = false;
    // check if the key is still invalid and fallback to using a known
    // safe key
    if (cleanedKey.length === 0 || cleanedKey.length > 30) {
        invalidKey = true;
    }
    if (!isNaN(parseInt(cleanedKey.slice(0, 1)))) {
        invalidKey = true;
    }
    if (invalidKey) {
        cleanedKey = getSafeRouteKey();
    }
    const duplicateKey = cleanedKey in routeKeys;
    if (keyPrefix) {
        routeKeys[cleanedKey] = `${keyPrefix}${key}`;
    } else {
        routeKeys[cleanedKey] = key;
    }
    // if the segment has an interception marker, make sure that's part of the regex pattern
    // this is to ensure that the route with the interception marker doesn't incorrectly match
    // the non-intercepted route (ie /app/(.)[username] should not match /app/[username])
    const interceptionPrefix = interceptionMarker ? (0, _escaperegexp.escapeStringRegexp)(interceptionMarker) : '';
    let pattern;
    if (duplicateKey && backreferenceDuplicateKeys) {
        // Use a backreference to the key to ensure that the key is the same value
        // in each of the placeholders.
        pattern = `\\k<${cleanedKey}>`;
    } else if (repeat) {
        pattern = `(?<${cleanedKey}>.+?)`;
    } else {
        pattern = `(?<${cleanedKey}>[^/]+?)`;
    }
    return {
        key,
        pattern: optional ? `(?:/${interceptionPrefix}${pattern})?` : `/${interceptionPrefix}${pattern}`,
        cleanedKey: cleanedKey,
        optional,
        repeat
    };
}
function getNamedParametrizedRoute(route, prefixRouteKeys, includeSuffix, includePrefix, backreferenceDuplicateKeys, reference = {
    names: {},
    intercepted: {}
}) {
    const getSafeRouteKey = buildGetSafeRouteKey();
    const routeKeys = {};
    const segments = [];
    const inverseParts = [];
    // Ensure we don't mutate the original reference object.
    reference = structuredClone(reference);
    for (const segment of (0, _removetrailingslash.removeTrailingSlash)(route).slice(1).split('/')){
        const hasInterceptionMarker = _interceptionroutes.INTERCEPTION_ROUTE_MARKERS.some((m)=>segment.startsWith(m));
        const paramMatches = segment.match(_getdynamicparam.PARAMETER_PATTERN) // Check for parameters
        ;
        const interceptionMarker = hasInterceptionMarker ? paramMatches?.[1] : undefined;
        let keyPrefix;
        if (interceptionMarker && paramMatches?.[2]) {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_INTERCEPTION_MARKER_PREFIX : undefined;
            reference.intercepted[paramMatches[2]] = interceptionMarker;
        } else if (paramMatches?.[2] && reference.intercepted[paramMatches[2]]) {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_INTERCEPTION_MARKER_PREFIX : undefined;
        } else {
            keyPrefix = prefixRouteKeys ? _constants.NEXT_QUERY_PARAM_PREFIX : undefined;
        }
        if (interceptionMarker && paramMatches && paramMatches[2]) {
            // If there's an interception marker, add it to the segments.
            const { key, pattern, cleanedKey, repeat, optional } = getSafeKeyFromSegment({
                getSafeRouteKey,
                interceptionMarker,
                segment: paramMatches[2],
                routeKeys,
                keyPrefix,
                backreferenceDuplicateKeys
            });
            segments.push(pattern);
            inverseParts.push(`/${paramMatches[1]}:${reference.names[key] ?? cleanedKey}${repeat ? optional ? '*' : '+' : ''}`);
            reference.names[key] ??= cleanedKey;
        } else if (paramMatches && paramMatches[2]) {
            // If there's a prefix, add it to the segments if it's enabled.
            if (includePrefix && paramMatches[1]) {
                segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(paramMatches[1])}`);
                inverseParts.push(`/${paramMatches[1]}`);
            }
            const { key, pattern, cleanedKey, repeat, optional } = getSafeKeyFromSegment({
                getSafeRouteKey,
                segment: paramMatches[2],
                routeKeys,
                keyPrefix,
                backreferenceDuplicateKeys
            });
            // Remove the leading slash if includePrefix already added it.
            let s = pattern;
            if (includePrefix && paramMatches[1]) {
                s = s.substring(1);
            }
            segments.push(s);
            inverseParts.push(`/:${reference.names[key] ?? cleanedKey}${repeat ? optional ? '*' : '+' : ''}`);
            reference.names[key] ??= cleanedKey;
        } else {
            segments.push(`/${(0, _escaperegexp.escapeStringRegexp)(segment)}`);
            inverseParts.push(`/${segment}`);
        }
        // If there's a suffix, add it to the segments if it's enabled.
        if (includeSuffix && paramMatches && paramMatches[3]) {
            segments.push((0, _escaperegexp.escapeStringRegexp)(paramMatches[3]));
            inverseParts.push(paramMatches[3]);
        }
    }
    return {
        namedParameterizedRoute: segments.join(''),
        routeKeys,
        pathToRegexpPattern: inverseParts.join(''),
        reference
    };
}
function getNamedRouteRegex(normalizedRoute, options) {
    const result = getNamedParametrizedRoute(normalizedRoute, options.prefixRouteKeys, options.includeSuffix ?? false, options.includePrefix ?? false, options.backreferenceDuplicateKeys ?? false, options.reference);
    let namedRegex = result.namedParameterizedRoute;
    if (!options.excludeOptionalTrailingSlash) {
        namedRegex += '(?:/)?';
    }
    return {
        ...getRouteRegex(normalizedRoute, options),
        namedRegex: `^${namedRegex}$`,
        routeKeys: result.routeKeys,
        pathToRegexpPattern: result.pathToRegexpPattern,
        reference: result.reference
    };
}
function getNamedMiddlewareRegex(normalizedRoute, options) {
    const { parameterizedRoute } = getParametrizedRoute(normalizedRoute, false, false);
    const { catchAll = true } = options;
    if (parameterizedRoute === '/') {
        let catchAllRegex = catchAll ? '.*' : '';
        return {
            namedRegex: `^/${catchAllRegex}$`
        };
    }
    const { namedParameterizedRoute } = getNamedParametrizedRoute(normalizedRoute, false, false, false, false, undefined);
    let catchAllGroupedRegex = catchAll ? '(?:(/.*)?)' : '';
    return {
        namedRegex: `^${namedParameterizedRoute}${catchAllGroupedRegex}$`
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/router/utils/sorted-routes.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    getSortedRouteObjects: null,
    getSortedRoutes: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    getSortedRouteObjects: function() {
        return getSortedRouteObjects;
    },
    getSortedRoutes: function() {
        return getSortedRoutes;
    }
});
class UrlNode {
    insert(urlPath) {
        this._insert(urlPath.split('/').filter(Boolean), [], false);
    }
    smoosh() {
        return this._smoosh();
    }
    _smoosh(prefix = '/') {
        const childrenPaths = [
            ...this.children.keys()
        ].sort();
        if (this.slugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf('[]'), 1);
        }
        if (this.restSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf('[...]'), 1);
        }
        if (this.optionalRestSlugName !== null) {
            childrenPaths.splice(childrenPaths.indexOf('[[...]]'), 1);
        }
        const routes = childrenPaths.map((c)=>this.children.get(c)._smoosh(`${prefix}${c}/`)).reduce((prev, curr)=>[
                ...prev,
                ...curr
            ], []);
        if (this.slugName !== null) {
            routes.push(...this.children.get('[]')._smoosh(`${prefix}[${this.slugName}]/`));
        }
        if (!this.placeholder) {
            const r = prefix === '/' ? '/' : prefix.slice(0, -1);
            if (this.optionalRestSlugName != null) {
                throw Object.defineProperty(new Error(`You cannot define a route with the same specificity as a optional catch-all route ("${r}" and "${r}[[...${this.optionalRestSlugName}]]").`), "__NEXT_ERROR_CODE", {
                    value: "E458",
                    enumerable: false,
                    configurable: true
                });
            }
            routes.unshift(r);
        }
        if (this.restSlugName !== null) {
            routes.push(...this.children.get('[...]')._smoosh(`${prefix}[...${this.restSlugName}]/`));
        }
        if (this.optionalRestSlugName !== null) {
            routes.push(...this.children.get('[[...]]')._smoosh(`${prefix}[[...${this.optionalRestSlugName}]]/`));
        }
        return routes;
    }
    _insert(urlPaths, slugNames, isCatchAll) {
        if (urlPaths.length === 0) {
            this.placeholder = false;
            return;
        }
        if (isCatchAll) {
            throw Object.defineProperty(new Error(`Catch-all must be the last part of the URL.`), "__NEXT_ERROR_CODE", {
                value: "E392",
                enumerable: false,
                configurable: true
            });
        }
        // The next segment in the urlPaths list
        let nextSegment = urlPaths[0];
        // Check if the segment matches `[something]`
        if (nextSegment.startsWith('[') && nextSegment.endsWith(']')) {
            // Strip `[` and `]`, leaving only `something`
            let segmentName = nextSegment.slice(1, -1);
            let isOptional = false;
            if (segmentName.startsWith('[') && segmentName.endsWith(']')) {
                // Strip optional `[` and `]`, leaving only `something`
                segmentName = segmentName.slice(1, -1);
                isOptional = true;
            }
            if (segmentName.startsWith('…')) {
                throw Object.defineProperty(new Error(`Detected a three-dot character ('…') at ('${segmentName}'). Did you mean ('...')?`), "__NEXT_ERROR_CODE", {
                    value: "E147",
                    enumerable: false,
                    configurable: true
                });
            }
            if (segmentName.startsWith('...')) {
                // Strip `...`, leaving only `something`
                segmentName = segmentName.substring(3);
                isCatchAll = true;
            }
            if (segmentName.startsWith('[') || segmentName.endsWith(']')) {
                throw Object.defineProperty(new Error(`Segment names may not start or end with extra brackets ('${segmentName}').`), "__NEXT_ERROR_CODE", {
                    value: "E421",
                    enumerable: false,
                    configurable: true
                });
            }
            if (segmentName.startsWith('.')) {
                throw Object.defineProperty(new Error(`Segment names may not start with erroneous periods ('${segmentName}').`), "__NEXT_ERROR_CODE", {
                    value: "E288",
                    enumerable: false,
                    configurable: true
                });
            }
            function handleSlug(previousSlug, nextSlug) {
                if (previousSlug !== null) {
                    // If the specific segment already has a slug but the slug is not `something`
                    // This prevents collisions like:
                    // pages/[post]/index.js
                    // pages/[id]/index.js
                    // Because currently multiple dynamic params on the same segment level are not supported
                    if (previousSlug !== nextSlug) {
                        // TODO: This error seems to be confusing for users, needs an error link, the description can be based on above comment.
                        throw Object.defineProperty(new Error(`You cannot use different slug names for the same dynamic path ('${previousSlug}' !== '${nextSlug}').`), "__NEXT_ERROR_CODE", {
                            value: "E337",
                            enumerable: false,
                            configurable: true
                        });
                    }
                }
                slugNames.forEach((slug)=>{
                    if (slug === nextSlug) {
                        throw Object.defineProperty(new Error(`You cannot have the same slug name "${nextSlug}" repeat within a single dynamic path`), "__NEXT_ERROR_CODE", {
                            value: "E247",
                            enumerable: false,
                            configurable: true
                        });
                    }
                    if (slug.replace(/\W/g, '') === nextSegment.replace(/\W/g, '')) {
                        throw Object.defineProperty(new Error(`You cannot have the slug names "${slug}" and "${nextSlug}" differ only by non-word symbols within a single dynamic path`), "__NEXT_ERROR_CODE", {
                            value: "E499",
                            enumerable: false,
                            configurable: true
                        });
                    }
                });
                slugNames.push(nextSlug);
            }
            if (isCatchAll) {
                if (isOptional) {
                    if (this.restSlugName != null) {
                        throw Object.defineProperty(new Error(`You cannot use both an required and optional catch-all route at the same level ("[...${this.restSlugName}]" and "${urlPaths[0]}" ).`), "__NEXT_ERROR_CODE", {
                            value: "E299",
                            enumerable: false,
                            configurable: true
                        });
                    }
                    handleSlug(this.optionalRestSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.optionalRestSlugName = segmentName;
                    // nextSegment is overwritten to [[...]] so that it can later be sorted specifically
                    nextSegment = '[[...]]';
                } else {
                    if (this.optionalRestSlugName != null) {
                        throw Object.defineProperty(new Error(`You cannot use both an optional and required catch-all route at the same level ("[[...${this.optionalRestSlugName}]]" and "${urlPaths[0]}").`), "__NEXT_ERROR_CODE", {
                            value: "E300",
                            enumerable: false,
                            configurable: true
                        });
                    }
                    handleSlug(this.restSlugName, segmentName);
                    // slugName is kept as it can only be one particular slugName
                    this.restSlugName = segmentName;
                    // nextSegment is overwritten to [...] so that it can later be sorted specifically
                    nextSegment = '[...]';
                }
            } else {
                if (isOptional) {
                    throw Object.defineProperty(new Error(`Optional route parameters are not yet supported ("${urlPaths[0]}").`), "__NEXT_ERROR_CODE", {
                        value: "E435",
                        enumerable: false,
                        configurable: true
                    });
                }
                handleSlug(this.slugName, segmentName);
                // slugName is kept as it can only be one particular slugName
                this.slugName = segmentName;
                // nextSegment is overwritten to [] so that it can later be sorted specifically
                nextSegment = '[]';
            }
        }
        // If this UrlNode doesn't have the nextSegment yet we create a new child UrlNode
        if (!this.children.has(nextSegment)) {
            this.children.set(nextSegment, new UrlNode());
        }
        this.children.get(nextSegment)._insert(urlPaths.slice(1), slugNames, isCatchAll);
    }
    constructor(){
        this.placeholder = true;
        this.children = new Map();
        this.slugName = null;
        this.restSlugName = null;
        this.optionalRestSlugName = null;
    }
}
function getSortedRoutes(normalizedPages) {
    // First the UrlNode is created, and every UrlNode can have only 1 dynamic segment
    // Eg you can't have pages/[post]/abc.js and pages/[hello]/something-else.js
    // Only 1 dynamic segment per nesting level
    // So in the case that is test/e2e/dynamic-routing it'll be this:
    // pages/[post]/comments.js
    // pages/blog/[post]/comment/[id].js
    // Both are fine because `pages/[post]` and `pages/blog` are on the same level
    // So in this case `UrlNode` created here has `this.slugName === 'post'`
    // And since your PR passed through `slugName` as an array basically it'd including it in too many possibilities
    // Instead what has to be passed through is the upwards path's dynamic names
    const root = new UrlNode();
    // Here the `root` gets injected multiple paths, and insert will break them up into sublevels
    normalizedPages.forEach((pagePath)=>root.insert(pagePath));
    // Smoosh will then sort those sublevels up to the point where you get the correct route definition priority
    return root.smoosh();
}
function getSortedRouteObjects(objects, getter) {
    // We're assuming here that all the pathnames are unique, that way we can
    // sort the list and use the index as the key.
    const indexes = {};
    const pathnames = [];
    for(let i = 0; i < objects.length; i++){
        const pathname = getter(objects[i]);
        indexes[pathname] = i;
        pathnames[i] = pathname;
    }
    // Sort the pathnames.
    const sorted = getSortedRoutes(pathnames);
    // Map the sorted pathnames back to the original objects using the new sorted
    // index.
    return sorted.map((pathname)=>objects[indexes[pathname]]);
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment-cache/segment-value-encoding.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    HEAD_REQUEST_KEY: null,
    ROOT_SEGMENT_REQUEST_KEY: null,
    appendSegmentRequestKeyPart: null,
    convertSegmentPathToStaticExportFilename: null,
    createSegmentRequestKeyPart: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    HEAD_REQUEST_KEY: function() {
        return HEAD_REQUEST_KEY;
    },
    ROOT_SEGMENT_REQUEST_KEY: function() {
        return ROOT_SEGMENT_REQUEST_KEY;
    },
    appendSegmentRequestKeyPart: function() {
        return appendSegmentRequestKeyPart;
    },
    convertSegmentPathToStaticExportFilename: function() {
        return convertSegmentPathToStaticExportFilename;
    },
    createSegmentRequestKeyPart: function() {
        return createSegmentRequestKeyPart;
    }
});
const _segment = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment.js [app-ssr] (ecmascript)");
const ROOT_SEGMENT_REQUEST_KEY = '';
const HEAD_REQUEST_KEY = '/_head';
function createSegmentRequestKeyPart(segment) {
    if (typeof segment === 'string') {
        if (segment.startsWith(_segment.PAGE_SEGMENT_KEY)) {
            // The Flight Router State type sometimes includes the search params in
            // the page segment. However, the Segment Cache tracks this as a separate
            // key. So, we strip the search params here, and then add them back when
            // the cache entry is turned back into a FlightRouterState. This is an
            // unfortunate consequence of the FlightRouteState being used both as a
            // transport type and as a cache key; we'll address this once more of the
            // Segment Cache implementation has settled.
            // TODO: We should hoist the search params out of the FlightRouterState
            // type entirely, This is our plan for dynamic route params, too.
            return _segment.PAGE_SEGMENT_KEY;
        }
        const safeName = // But params typically don't include the leading slash. We should use
        // a different encoding to avoid this special case.
        segment === '/_not-found' ? '_not-found' : encodeToFilesystemAndURLSafeString(segment);
        // Since this is not a dynamic segment, it's fully encoded. It does not
        // need to be "hydrated" with a param value.
        return safeName;
    }
    const name = segment[0];
    const paramType = segment[2];
    const safeName = encodeToFilesystemAndURLSafeString(name);
    const encodedName = '$' + paramType + '$' + safeName;
    return encodedName;
}
function appendSegmentRequestKeyPart(parentRequestKey, parallelRouteKey, childRequestKeyPart) {
    // Aside from being filesystem safe, segment keys are also designed so that
    // each segment and parallel route creates its own subdirectory. Roughly in
    // the same shape as the source app directory. This is mostly just for easier
    // debugging (you can open up the build folder and navigate the output); if
    // we wanted to do we could just use a flat structure.
    // Omit the parallel route key for children, since this is the most
    // common case. Saves some bytes (and it's what the app directory does).
    const slotKey = parallelRouteKey === 'children' ? childRequestKeyPart : `@${encodeToFilesystemAndURLSafeString(parallelRouteKey)}/${childRequestKeyPart}`;
    return parentRequestKey + '/' + slotKey;
}
// Define a regex pattern to match the most common characters found in a route
// param. It excludes anything that might not be cross-platform filesystem
// compatible, like |. It does not need to be precise because the fallback is to
// just base64url-encode the whole parameter, which is fine; we just don't do it
// by default for compactness, and for easier debugging.
const simpleParamValueRegex = /^[a-zA-Z0-9\-_@]+$/;
function encodeToFilesystemAndURLSafeString(value) {
    if (simpleParamValueRegex.test(value)) {
        return value;
    }
    // If there are any unsafe characters, base64url-encode the entire value.
    // We also add a ! prefix so it doesn't collide with the simple case.
    const base64url = btoa(value).replace(/\+/g, '-') // Replace '+' with '-'
    .replace(/\//g, '_') // Replace '/' with '_'
    .replace(/=+$/, '') // Remove trailing '='
    ;
    return '!' + base64url;
}
function convertSegmentPathToStaticExportFilename(segmentPath) {
    return `__next${segmentPath.replace(/\//g, '.')}.txt`;
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/segment-cache/vary-params-decoding.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Vary Params Decoding
 *
 * This module is shared between server and client.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "readVaryParams", {
    enumerable: true,
    get: function() {
        return readVaryParams;
    }
});
/**
 * Synchronously drains a vary params `AsyncIterable`, adding each yielded name
 * to `target`.
 *
 * By the time this runs (on the client, or in collectSegmentData), the Flight
 * stream has been fully buffered, so every yielded value is already
 * materialized and can be read without awaiting. We force each iterator result
 * to resolve synchronously using the same `.then(noop)` trick React uses
 * internally, then read its `status`/`value` directly.
 *
 * We add "every param yielded up to the point the stream suspends": a
 * normally-closed iterable drains fully, while one left hanging (a sync-I/O
 * abort, or a `close()` whose row hasn't flushed yet) drains to the prefix
 * already in the stream. Both are correct — a segment's param accesses are all
 * flushed as they happen during its render, so the prefix is exactly the set
 * the response depends on. We therefore never need the terminating `done` row
 * to be present; it's only stream hygiene.
 */ function drainVaryParams(iterable, target) {
    const iterator = iterable[Symbol.asyncIterator]();
    while(true){
        const chunk = iterator.next();
        // Attach a no-op listener to force Flight to synchronously resolve the
        // chunk. A freshly-arrived result may be in an intermediate
        // 'resolved_model' state (data received but not unwrapped); calling
        // .then() transitions it to 'fulfilled', making the value available
        // synchronously. (A native Promise has no `status` and simply reads as
        // not-fulfilled below, so this can never hang.)
        chunk.then(noop, noop);
        if (chunk.status !== 'fulfilled' || chunk.value === undefined) {
            // The stream suspended here. Everything yielded before this point has
            // already been added.
            return;
        }
        const step = chunk.value;
        if (step.done) {
            return;
        }
        target.add(step.value);
    }
}
function readVaryParams(iterable, rootIterable) {
    if (iterable === null || iterable === undefined || rootIterable === null || rootIterable === undefined) {
        return null;
    }
    const varyParams = new Set();
    drainVaryParams(iterable, varyParams);
    drainVaryParams(rootIterable, varyParams);
    return varyParams;
}
const noop = ()=>{};
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    DecodeError: null,
    MiddlewareNotFoundError: null,
    MissingStaticPage: null,
    NormalizeError: null,
    PageNotFoundError: null,
    SP: null,
    ST: null,
    WEB_VITALS: null,
    execOnce: null,
    getDisplayName: null,
    getLocationOrigin: null,
    getURL: null,
    isAbsoluteUrl: null,
    isResSent: null,
    loadGetInitialProps: null,
    normalizeRepeatedSlashes: null,
    stringifyError: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    DecodeError: function() {
        return DecodeError;
    },
    MiddlewareNotFoundError: function() {
        return MiddlewareNotFoundError;
    },
    MissingStaticPage: function() {
        return MissingStaticPage;
    },
    NormalizeError: function() {
        return NormalizeError;
    },
    PageNotFoundError: function() {
        return PageNotFoundError;
    },
    SP: function() {
        return SP;
    },
    ST: function() {
        return ST;
    },
    WEB_VITALS: function() {
        return WEB_VITALS;
    },
    execOnce: function() {
        return execOnce;
    },
    getDisplayName: function() {
        return getDisplayName;
    },
    getLocationOrigin: function() {
        return getLocationOrigin;
    },
    getURL: function() {
        return getURL;
    },
    isAbsoluteUrl: function() {
        return isAbsoluteUrl;
    },
    isResSent: function() {
        return isResSent;
    },
    loadGetInitialProps: function() {
        return loadGetInitialProps;
    },
    normalizeRepeatedSlashes: function() {
        return normalizeRepeatedSlashes;
    },
    stringifyError: function() {
        return stringifyError;
    }
});
const WEB_VITALS = [
    'CLS',
    'FCP',
    'FID',
    'INP',
    'LCP',
    'TTFB'
];
function execOnce(fn) {
    let used = false;
    let result;
    return (...args)=>{
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}
// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
// Absolute URL: https://tools.ietf.org/html/rfc3986#section-4.3
const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
const isAbsoluteUrl = (url)=>{
    // Fast path: an absolute URL must start with a letter (the scheme).
    // Check for a-z and A-Z without the cost of the regex.
    const c = url.charCodeAt(0);
    const isLetter = c >= 65 /* A */  && c <= 90 || c >= 97 /* a */  && c <= 122;
    /* z */ if (!isLetter) {
        return false;
    }
    return ABSOLUTE_URL_REGEX.test(url);
};
function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? ':' + port : ''}`;
}
function getURL() {
    const { href } = window.location;
    const origin = getLocationOrigin();
    return href.substring(origin.length);
}
function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Unknown';
}
function isResSent(res) {
    return res.finished || res.headersSent;
}
function normalizeRepeatedSlashes(url) {
    const urlParts = url.split('?');
    const urlNoQuery = urlParts[0];
    return urlNoQuery // first we replace any non-encoded backslashes with forward
    // then normalize repeated forward slashes
    .replace(/\\/g, '/').replace(/\/\/+/g, '/') + (urlParts[1] ? `?${urlParts.slice(1).join('?')}` : '');
}
async function loadGetInitialProps(App, ctx) {
    if ("TURBOPACK compile-time truthy", 1) {
        if (App.prototype?.getInitialProps) {
            const message = `"${getDisplayName(App)}.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.`;
            throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
                value: "E1035",
                enumerable: false,
                configurable: true
            });
        }
    }
    // when called from _app `ctx` is nested in `ctx`
    const res = ctx.res || ctx.ctx && ctx.ctx.res;
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            // @ts-ignore pageProps default
            return {
                pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx)
            };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) {
        return props;
    }
    if (!props) {
        const message = `"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`;
        throw Object.defineProperty(new Error(message), "__NEXT_ERROR_CODE", {
            value: "E1025",
            enumerable: false,
            configurable: true
        });
    }
    if ("TURBOPACK compile-time truthy", 1) {
        if (Object.keys(props).length === 0 && !ctx.ctx) {
            console.warn(`${getDisplayName(App)} returned an empty object from \`getInitialProps\`. This de-optimizes and prevents automatic static optimization. https://nextjs.org/docs/messages/empty-object-getInitialProps`);
        }
    }
    return props;
}
const SP = typeof performance !== 'undefined';
const ST = SP && [
    'mark',
    'measure',
    'getEntriesByName'
].every((method)=>typeof performance[method] === 'function');
class DecodeError extends Error {
}
class NormalizeError extends Error {
}
class PageNotFoundError extends Error {
    constructor(page){
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = `Cannot find module for page: ${page}`;
    }
}
class MissingStaticPage extends Error {
    constructor(page, message){
        super();
        this.message = `Failed to load static file for page: ${page} ${message}`;
    }
}
class MiddlewareNotFoundError extends Error {
    constructor(){
        super();
        this.code = 'ENOENT';
        this.message = `Cannot find the middleware module`;
    }
}
function stringifyError(error) {
    return JSON.stringify({
        message: error.message,
        stack: error.stack
    });
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils/error-once.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "errorOnce", {
    enumerable: true,
    get: function() {
        return errorOnce;
    }
});
let errorOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const errors = new Set();
    errorOnce = (msg)=>{
        if (!errors.has(msg)) {
            console.error(msg);
        }
        errors.add(msg);
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/dist/shared/lib/utils/warn-once.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "warnOnce", {
    enumerable: true,
    get: function() {
        return warnOnce;
    }
});
let warnOnce = (_)=>{};
if ("TURBOPACK compile-time truthy", 1) {
    const warnings = new Set();
    warnOnce = (msg)=>{
        if (!warnings.has(msg)) {
            console.warn(msg);
        }
        warnings.add(msg);
    };
}
}),
"[project]/fincopilot-landing/node_modules/next/router.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/router.js [app-ssr] (ecmascript)");
}),
"[project]/fincopilot-landing/node_modules/next/script.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/fincopilot-landing/node_modules/next/dist/client/script.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=0ody_next_190ac3w._.js.map