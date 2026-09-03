// ============================================================================
// FinCopilot API Client — Real API calls to backend with Clerk auth
// ============================================================================
// This replaces the hardcoded data.ts. Every page uses this to fetch real data
// from the backend. Auth token comes from Clerk automatically.
// ============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

// ── Token Management ────────────────────────────────────────────────────────
let _cachedToken: string | null = null;
let _tokenExpiry: number = 0;

export async function getAuthToken(): Promise<string | null> {
  // Try Clerk token from window (set by ClerkProvider)
  if (typeof window !== "undefined") {
    // Clerk stores token in __clerk_client_jwt or we use the Clerk session
    const clerkToken = (window as any).__clerk_session_token;
    if (clerkToken && Date.now() < _tokenExpiry) return clerkToken;

    // Try to get fresh token from Clerk
    try {
      const clerk = (window as any).Clerk;
      if (clerk?.session) {
        const token = await clerk.session.getToken();
        if (token) {
          _cachedToken = token;
          _tokenExpiry = Date.now() + 50 * 1000; // 50 seconds
          return token;
        }
      }
    } catch {
      // Clerk not loaded yet — return null
    }
  }
  return _cachedToken;
}

// ── Fetch Wrapper ──────────────────────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Dev bypass (localhost only)
  const isDev =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  if (isDev && !token) {
    headers["X-Dev-Bypass"] = "true";
    headers["X-Dev-User-Id"] = "seed_user";
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint}`;

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.message || error.error || errorMessage;
    } catch {
      // Non-JSON error
    }
    throw new ApiError(errorMessage, response.status);
  }

  // 204 No Content
  if (response.status === 204) return {} as T;

  return response.json();
}

// ── API Error Class ─────────────────────────────────────────────────────────
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// ── API Client ──────────────────────────────────────────────────────────────
export const api = {
  // ── Financial State ────────────────────────────────────────────────────────
  getHomeState: () => apiFetch("/financial-state/home"),
  getMoneyState: () => apiFetch("/financial-state/money"),
  getSpendingStory: () => apiFetch("/financial-state/spending-story"),
  getIncome: () => apiFetch("/financial-state/income"),
  getCategoryDetail: (id: string) => apiFetch(`/financial-state/categories/${id}`),

  // ── Accounts ───────────────────────────────────────────────────────────────
  getAccounts: () => apiFetch("/accounts"),
  getAccountDetail: (id: string) => apiFetch(`/accounts/${id}`),

  // ── Transactions ────────────────────────────────────────────────────────────
  getTransactions: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/transactions${qs}`);
  },
  getTransactionDetail: (id: string) => apiFetch(`/transactions/${id}`),

  // ── Goals ───────────────────────────────────────────────────────────────────
  getGoals: () => apiFetch("/goals"),
  getGoalDetail: (id: string) => apiFetch(`/goals/${id}`),
  createGoal: (data: any) =>
    apiFetch("/goals", { method: "POST", body: JSON.stringify(data) }),
  updateGoal: (id: string, data: any) =>
    apiFetch(`/goals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteGoal: (id: string) =>
    apiFetch(`/goals/${id}`, { method: "DELETE" }),

  // ── Budgets ────────────────────────────────────────────────────────────────
  getBudgets: () => apiFetch("/budgets"),
  createBudget: (data: any) =>
    apiFetch("/budgets", { method: "POST", body: JSON.stringify(data) }),
  updateBudget: (id: string, data: any) =>
    apiFetch(`/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteBudget: (id: string) =>
    apiFetch(`/budgets/${id}`, { method: "DELETE" }),
  recalculateBudgets: () =>
    apiFetch("/budgets/recalculate", { method: "POST" }),

  // ── Recurring ──────────────────────────────────────────────────────────────
  getRecurring: () => apiFetch("/recurring"),
  getRecurringSummary: () => apiFetch("/recurring/summary"),
  detectRecurring: () =>
    apiFetch("/recurring/detect", { method: "POST" }),

  // ── Upcoming ───────────────────────────────────────────────────────────────
  getUpcoming: () => apiFetch("/upcoming"),

  // ── Plan ───────────────────────────────────────────────────────────────────
  getPlan: () => apiFetch("/plan"),

  // ── Financial Health ────────────────────────────────────────────────────────
  getFinancialHealth: () => apiFetch("/financial-health"),

  // ── Forecast ────────────────────────────────────────────────────────────────
  getForecast: (horizon?: number) =>
    apiFetch(`/forecast/outlook${horizon ? `?horizon=${horizon}` : ""}`),
  runScenario: (data: any) =>
    apiFetch("/forecast/scenario", { method: "POST", body: JSON.stringify(data) }),

  // ── Cashflow ────────────────────────────────────────────────────────────────
  getCashflow: (period?: string) =>
    apiFetch(`/financial/cashflow${period ? `?period=${period}` : ""}`),

  // ── Liabilities ─────────────────────────────────────────────────────────────
  getLiabilities: () => apiFetch("/financial/liabilities"),

  // ── Search ─────────────────────────────────────────────────────────────────
  search: (q: string) => apiFetch(`/search?q=${encodeURIComponent(q)}`),

  // ── AI ─────────────────────────────────────────────────────────────────────
  getAIHomeFeed: () => apiFetch("/ai/home-feed"),
  getAIInsight: (id: string) => apiFetch(`/ai/insights/${id}`),
  sendAIChat: (message: string) =>
    apiFetch("/ai/chat", { method: "POST", body: JSON.stringify({ prompt: message }) }),
  runAISimulate: (data: any) =>
    apiFetch("/ai/simulate", { method: "POST", body: JSON.stringify(data) }),

  // ── Notifications ────────────────────────────────────────────────────────────
  getNotifications: (unreadOnly?: boolean) =>
    apiFetch(`/notifications${unreadOnly ? "?unread_only=true" : ""}`).then((res: any) => res.notifications),
  markNotificationRead: (id: string) =>
    apiFetch(`/notifications/${id}/read`, { method: "PUT" }),
  markAllNotificationsRead: () =>
    apiFetch("/notifications/read-all", { method: "PUT" }),
  deleteNotification: (id: string) =>
    apiFetch(`/notifications/${id}`, { method: "DELETE" }),

  // ── Gamification ────────────────────────────────────────────────────────────
  getGamification: () => apiFetch("/gamification"),
  tickStreak: () =>
    apiFetch("/gamification/streak/tick", { method: "POST" }),
  earnBadge: (badgeName: string) =>
    apiFetch(`/gamification/badges/${badgeName}/earn`, { method: "POST" }),

  // ── Insights ────────────────────────────────────────────────────────────────
  getPeerComparison: () => apiFetch("/peer-comparison"),
  getCalendarEvents: (horizonDays?: number) =>
    apiFetch(`/calendar/events${horizonDays ? `?horizon_days=${horizonDays}` : ""}`),
  getNetWorthHistory: (months?: number) =>
    apiFetch(`/net-worth/history${months ? `?months=${months}` : ""}`),
  getSavingsChallenges: () => apiFetch("/savings-challenges"),

  // ── Trust / Privacy / Security ──────────────────────────────────────────────
  getConnections: () => apiFetch("/trust/connections"),
  disconnectConnection: (id: string) =>
    apiFetch(`/trust/connections/${id}/disconnect`, { method: "POST" }),
  getPrivacyInventory: () => apiFetch("/trust/privacy/inventory"),
  updatePrivacyConsent: (data: any) =>
    apiFetch("/trust/privacy/consent", { method: "POST", body: JSON.stringify(data) }),
  getSecuritySessions: () => apiFetch("/trust/security/sessions"),
  revokeSession: (id: string) =>
    apiFetch(`/trust/security/sessions/revoke`, { method: "POST", body: JSON.stringify({ session_id: id }) }),
  requestExport: (format?: string) =>
    apiFetch("/trust/export", { method: "POST", body: JSON.stringify({ format: format || "csv" }) }),
  requestDeletion: () =>
    apiFetch("/trust/deletion", { method: "POST" }),

  // ── Auth ────────────────────────────────────────────────────────────────────
  getMe: () => apiFetch("/auth/me"),
  getPreferences: () => apiFetch("/preferences"),
  updatePreferences: (data: any) =>
    apiFetch("/preferences", { method: "PUT", body: JSON.stringify(data) }),

  // ── Data Quality ────────────────────────────────────────────────────────────
  getDataQuality: () => apiFetch("/data-quality"),

  // ── Onboarding ──────────────────────────────────────────────────────────────
  completeOnboarding: (data: any) =>
    apiFetch("/auth/onboarding-complete", { method: "POST", body: JSON.stringify(data) }),
};
