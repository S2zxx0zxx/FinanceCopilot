/**
 * Lightweight page→chat context registry.
 *
 * Pages call `useRegisterPageChatContext({...})` to publish what's
 * currently visible (route, filters, selection). The global slide-over
 * chat reads the latest snapshot at send time via `getPageChatContext()`
 * and forwards it to the executor as `page_context`. Free-form by
 * design — the backend renders whatever it gets into a system primer.
 *
 * Implementation note: we deliberately use a plain ref, NOT React
 * context, so the slide-over can read it without re-rendering on every
 * page state change. The slide-over polls the ref only on send.
 */
import { useEffect, useRef } from 'react'

export type PageChatContext = Record<string, unknown> | null

const _ref: { current: PageChatContext } = { current: null }

export function getPageChatContext(): PageChatContext {
  return _ref.current
}

/** Synthesized fallback when a page hasn't registered explicit context.
 *  Gives the agent at least the route + title + a hint that no detailed
 *  page state was published — beats sending nothing and having the
 *  agent ask "what page?". */
export function getDefaultPageChatContext(): PageChatContext {
  if (typeof window === 'undefined') return null
  const path = window.location.pathname
  const title = (typeof document !== 'undefined' && document.title) || path
  return {
    path,
    label: title,
    summary: `User is on ${title} (${path}). No detailed page state has been published — ask the user what they want explained.`,
  }
}

/** What the global slide-over actually sends: explicit registration if
 *  any, else the synthesized fallback. Always at least returns a path. */
export function getEffectivePageChatContext(): PageChatContext {
  return getPageChatContext() ?? getDefaultPageChatContext()
}

/** Pages call this in a useEffect to publish their context. The latest
 *  registration wins; on unmount the registration is cleared if it
 *  still matches (so navigating away doesn't leave a stale snapshot). */
export function useRegisterPageChatContext(
  ctx: PageChatContext,
  // Pass a stable string — when it changes the registration updates.
  // If you want every render to publish, pass a JSON.stringify of ctx.
  depKey: string,
) {
  const currentRef = useRef<PageChatContext>(null)
  useEffect(() => {
    currentRef.current = ctx
    _ref.current = ctx
    return () => {
      // Only clear if our registration is still the active one — avoids
      // racing with the next page's mount.
      if (_ref.current === currentRef.current) {
        _ref.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey])
}
