import type { AxiosError } from 'axios'

/**
 * Tells "the backend answered and rejected the request" apart from "the
 * backend never produced a usable answer" (stopped, unreachable, or 5xx
 * from a proxy in front of a dead service).
 *
 * The auth screens used to collapse every failure into "invalid
 * credentials", so an outage looked like a wrong password (issue #318).
 * Use this to surface a connectivity hint instead.
 */
export function isServerUnreachable(err: unknown): boolean {
  const axiosErr = err as AxiosError
  // No HTTP response at all: connection refused, DNS, timeout, CORS — the
  // server never answered.
  if (!axiosErr?.response) return true
  // 5xx (500/502/503/504) — e.g. a reverse proxy returning 502 while the
  // backend container is down.
  return axiosErr.response.status >= 500
}
