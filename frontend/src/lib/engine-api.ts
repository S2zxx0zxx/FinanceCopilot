import { ApiError, getAuthToken } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

export async function engineFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE}${normalized}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const payload = await response.json();
      const detail = payload?.detail;
      message = typeof detail === "string"
        ? detail
        : detail?.message || payload?.message || payload?.error || message;
    } catch {}
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return {} as T;
  return response.json() as Promise<T>;
}

export const engineApi = {
  get: <T = unknown>(endpoint: string) => engineFetch<T>(endpoint),
  post: <T = unknown>(endpoint: string, body?: unknown) =>
    engineFetch<T>(endpoint, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T = unknown>(endpoint: string, body?: unknown) =>
    engineFetch<T>(endpoint, { method: "PUT", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T = unknown>(endpoint: string, body?: unknown) =>
    engineFetch<T>(endpoint, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T = unknown>(endpoint: string) => engineFetch<T>(endpoint, { method: "DELETE" }),
};
