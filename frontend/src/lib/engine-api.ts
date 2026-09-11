import { ApiError, getAuthToken } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
const WORKSPACE_KEY = "fincopilot.active-workspace";

export function getActiveWorkspaceId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(WORKSPACE_KEY);
}

export function setActiveWorkspaceId(id: string | null): void {
  if (typeof window === "undefined") return;
  if (id) window.localStorage.setItem(WORKSPACE_KEY, id);
  else window.localStorage.removeItem(WORKSPACE_KEY);
  window.dispatchEvent(new CustomEvent("fincopilot:workspace-change", { detail: id }));
}

function normalizeEndpoint(endpoint: string): string {
  let normalized = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  // The browser client is mounted at FinCopilot's historic /api/v1 prefix,
  // while backend modules declare canonical /api/... routes. Accept either
  // spelling at call sites without ever producing /api/v1/api/....
  if (normalized === "/api") return "";
  if (normalized.startsWith("/api/")) normalized = normalized.slice(4);
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

async function authenticatedResponse(endpoint: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const workspaceId = getActiveWorkspaceId();
  if (workspaceId && !headers.has("X-Workspace-Id")) headers.set("X-Workspace-Id", workspaceId);

  const response = await fetch(`${API_BASE}${normalizeEndpoint(endpoint)}`, { ...options, headers, cache: "no-store" });
  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const payload = await response.clone().json();
      const detail = payload?.detail;
      message = typeof detail === "string" ? detail : detail?.message || payload?.message || payload?.error || message;
    } catch {
      try { const text = await response.clone().text(); if (text.trim()) message = text.trim(); } catch {}
    }
    throw new ApiError(message, response.status);
  }
  return response;
}

export async function engineFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await authenticatedResponse(endpoint, options);
  if (response.status === 204) return {} as T;
  return response.json() as Promise<T>;
}
export async function engineBlob(endpoint: string, options: RequestInit = {}): Promise<Blob> {
  return (await authenticatedResponse(endpoint, options)).blob();
}

export const engineApi = {
  get: <T = unknown>(endpoint: string) => engineFetch<T>(endpoint),
  post: <T = unknown>(endpoint: string, body?: unknown) => engineFetch<T>(endpoint, { method: "POST", body: body === undefined ? undefined : JSON.stringify(body) }),
  put: <T = unknown>(endpoint: string, body?: unknown) => engineFetch<T>(endpoint, { method: "PUT", body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T = unknown>(endpoint: string, body?: unknown) => engineFetch<T>(endpoint, { method: "PATCH", body: body === undefined ? undefined : JSON.stringify(body) }),
  delete: <T = unknown>(endpoint: string) => engineFetch<T>(endpoint, { method: "DELETE" }),
  form: <T = unknown>(endpoint: string, formData: FormData, method: "POST" | "PATCH" = "POST") => engineFetch<T>(endpoint, { method, body: formData }),
  blob: (endpoint: string, options: RequestInit = {}) => engineBlob(endpoint, options),
  getActiveWorkspaceId,
  setActiveWorkspaceId,
};
