import { object, rows } from "./response";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

type ClerkSession = { getToken(): Promise<string | null> };
type ClerkWindow = Window & { Clerk?: { session?: ClerkSession | null } };

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  const clerk = (window as ClerkWindow).Clerk;
  if (!clerk?.session) return null;
  return clerk.session.getToken();
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const error = await response.json();
      errorMessage = error.detail || error.message || error.error || errorMessage;
    } catch {}
    throw new ApiError(errorMessage, response.status);
  }
  if (response.status === 204) return {} as T;
  return response.json();
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type AAConsentStart = {
  consentId: string;
  consentHandle: string;
  redirectUrl: string;
  status: string;
};

export const api = {
  getHomeState: () => apiFetch("/financial-state/home"),
  getMoneyState: () => apiFetch("/financial-state/money"),
  getSpendingStory: () => apiFetch("/financial-state/spending-story"),
  getIncome: () => apiFetch("/financial-state/income"),
  getCategoryDetail: (id: string) => apiFetch(`/financial-state/categories/${id}`),

  getAccounts: () => apiFetch("/accounts"),
  createAccount: (data: {institution_name:string;account_type:string;account_number_last4?:string}) => apiFetch('/accounts', {method:'POST',body:JSON.stringify(data)}),
  getAccountDetail: (id: string) => apiFetch(`/accounts/${id}`),

  // ── Setu Account Aggregator ────────────────────────────────────────────────
  initiateAAConsent: (data: { vua: string; from?: string; to?: string; redirectUrl?: string }) =>
    apiFetch<AAConsentStart>("/aa/consent/initiate", { method: "POST", body: JSON.stringify(data) }),
  getAAConsent: (consentId: string) =>
    apiFetch(`/aa/consent/${encodeURIComponent(consentId)}`),
  revokeAAConsent: (consentId: string) =>
    apiFetch(`/aa/consent/${encodeURIComponent(consentId)}/revoke`, { method: "POST" }),
  syncAAConsent: (consentId: string, dataRange?: { from: string; to: string }) =>
    apiFetch("/aa/data/sync", { method: "POST", body: JSON.stringify({ consentId, dataRange }) }),

  initiateUpload: (fileName: string, mimeType: string, account_id: string) =>
    apiFetch("/import/upload-intent", { method: "POST", body: JSON.stringify({ fileName, mimeType, account_id }) }),
  confirmUpload: (jobId: string, storageKey: string) =>
    apiFetch("/import/confirm", { method: "POST", body: JSON.stringify({ job_id: jobId, storage_key: storageKey }) }),
  getImportJobs: () => apiFetch("/import/jobs"),
  retryImportJob: (jobId: string) => apiFetch(`/import/replay/${encodeURIComponent(jobId)}`, { method: "POST" }),

  getTransactions: (params?: Record<string, string>) => {
    const qs = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch(`/transactions${qs}`).then(value => {
      const response=object(value);
      return {...response, transactions:rows(response.data).map(row=>({...row,
        merchant_name:row.merchant_normalized,
        category:row.transaction_type,
        pending:row.posting_status==='pending',
      }))};
    });
  },
  getTransactionDetail: (id: string) => apiFetch(`/transactions/${id}`),

  getGoals: () => apiFetch("/goals"),
  getGoalDetail: (id: string) => apiFetch(`/goals/${id}`),
  addGoalContribution: (id:string,amountPaise:number,idempotencyKey:string) => apiFetch(`/goals/${id}/contributions`,{method:'POST',headers:{'Idempotency-Key':idempotencyKey},body:JSON.stringify({amount_paise:amountPaise,source_type:'manual'})}),
  createGoal: (data: any) => apiFetch("/goals", { method: "POST", body: JSON.stringify(data) }),
  updateGoal: (id: string, data: any) => apiFetch(`/goals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteGoal: (id: string) => apiFetch(`/goals/${id}`, { method: "DELETE" }),

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
  updateRecurring: (id: string, action: "confirm" | "dismiss" | "pause" | "resume") =>
    apiFetch(`/recurring/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ action }) }),
  getRecurring: () => apiFetch("/recurring"),
  getRecurringSummary: () => apiFetch("/recurring/summary"),
  detectRecurring: () => apiFetch("/recurring/detect", { method: "POST" }),
  getUpcoming: () => apiFetch("/upcoming"),
  getPlan: () => apiFetch("/plan"),
  getFinancialHealth: () => apiFetch("/financial-health"),
  getForecast: (horizon?: number) => apiFetch(`/forecast/outlook${horizon ? `?horizon=${horizon}` : ""}`),
  runScenario: (data: any) => apiFetch("/forecast/scenario", { method: "POST", body: JSON.stringify(data) }),
  getCashflowHistory: (period:string) => apiFetch(`/financial/cashflow/history?period=${encodeURIComponent(period)}`),
  getCashflow: (period?: string) => apiFetch(`/financial/cashflow${period ? `?period=${period}` : ""}`),
  getLiabilities: () => apiFetch("/financial/liabilities"),
  search: (q: string) => apiFetch(`/search?q=${encodeURIComponent(q)}`),

  getAIHomeFeed: () => apiFetch("/ai/home-feed"),
  getAIInsight: (id: string) => apiFetch(`/ai/insights/${id}`),
  sendAIChat: (message: string) => apiFetch("/ai/chat", { method: "POST", body: JSON.stringify({ prompt: message }) }),
  runAISimulate: (data: any) => apiFetch("/ai/simulate", { method: "POST", body: JSON.stringify(data) }),

  getNotifications: (unreadOnly?: boolean) => apiFetch(`/notifications${unreadOnly ? "?unread_only=true" : ""}`).then((res: any) => res.notifications),
  markNotificationRead: (id: string) => apiFetch(`/notifications/${id}/read`, { method: "PUT" }),
  markAllNotificationsRead: () => apiFetch("/notifications/read-all", { method: "PUT" }),
  deleteNotification: (id: string) => apiFetch(`/notifications/${id}`, { method: "DELETE" }),

  getGamification: () => apiFetch("/gamification"),
  tickStreak: () => apiFetch("/gamification/streak/tick", { method: "POST" }),
  earnBadge: (badgeName: string) => apiFetch(`/gamification/badges/${badgeName}/earn`, { method: "POST" }),

  getPeerComparison: () => apiFetch("/peer-comparison"),
  getCalendarEvents: (horizonDays?: number) => apiFetch(`/calendar/events${horizonDays ? `?horizon_days=${horizonDays}` : ""}`),
  getNetWorthHistory: (months?: number) => apiFetch(`/net-worth/history${months ? `?months=${months}` : ""}`),
  getSavingsChallenges: () => apiFetch("/savings-challenges"),

  getConnections: () => apiFetch("/trust/connections"),
  disconnectConnection: (id: string) => apiFetch(`/trust/connections/${id}/disconnect`, { method: "POST" }),
  getPrivacyInventory: () => apiFetch("/trust/privacy/inventory"),
  updatePrivacyConsent: (data: any) => apiFetch("/trust/privacy/consent", { method: "POST", body: JSON.stringify(data) }),
  getSecuritySessions: () => apiFetch("/trust/security/sessions"),
  revokeSession: (id: string) =>
    apiFetch(`/trust/security/sessions/revoke`, { method: "POST", body: JSON.stringify({ id }) }),
  getExportStatus: () => apiFetch<{status?: string; job?: {job_id: string; status: string; format: "csv" | "json" | "pdf"; download_url?: string; created_at: string}}>("/trust/export/status"),
  requestExport: (format?: string) =>
    apiFetch<{jobId: string; status: string}>("/trust/export", { method: "POST", body: JSON.stringify({ format: format || "csv" }) }),
  requestDeletion: () =>
    apiFetch("/trust/deletion", { method: "POST" }),

  // ── Auth ────────────────────────────────────────────────────────────────────
  getMe: () => apiFetch("/auth/me"),
  getPreferences: () => apiFetch("/preferences"),
  updatePreferences: (data: any) => apiFetch("/preferences", { method: "PUT", body: JSON.stringify(data) }),
  getDataQuality: () => apiFetch("/data-quality"),
  completeOnboarding: (data: any) => apiFetch("/auth/onboarding-complete", { method: "POST", body: JSON.stringify(data) }),
  seedDemoData: () => apiFetch("/dev/seed", { method: "POST" }),
};
