"use client";

import { useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useCallback } from "react";

// ── Empty defaults (NO mock data — only safe empty structures) ───────────────
const EMPTY_STATE = {
  accounts: [] as any[],
  financialStateMoney: {
    net_position: { available_balance_paise: 0, posted_balance_paise: 0, pending_balance_paise: 0 },
    coverage: { synced_accounts: 0, total_accounts: 0 },
  } as any,
  recentTransactions: [] as any[],
  goals: [] as any[],
  budgets: [] as any[],
  financialHealth: { cash_buffer_months: 0, cash_buffer_status: "missing", commitment_load_ratio: 0, commitment_load_status: "missing", savings_rate_pct: 0, savings_rate_status: "missing", emergency_fund_months: 0, emergency_fund_status: "missing", drivers: {} } as any,
  recurringSeries: [] as any[],
  cashflowData: [] as any[],
  forecastData: { horizons: [], timeline: [], drivers: [] } as any,
  aiHomeFeed: { insights: [] } as any,
  aiInsights: [] as any[],
  peerComparison: { bracket: "—", total_peers: 0, your_savings_rate: 0, peer_median_savings_rate: 0, peer_top_10_pct: 0, your_cash_buffer_months: 0, peer_median_cash_buffer: 0, peer_top_10_pct_buffer: 0, your_subscription_count: 0, peer_median_subscriptions: 0, your_dining_spend_pct_of_income: 0, peer_median_dining_pct: 0 } as any,
  calendarEvents: [] as any[],
  spendingStory: { total_spent_paise: 0, change_paise: 0, categories: [] } as any,
  incomeData: {} as any,
  liabilities: {} as any,
  notifications: [] as any[],
  currentUser: { id: "", email: "", displayName: "", photoURL: null, createdAt: new Date().toISOString() } as any,
  securityData: { security_score: 0, two_factor_enabled: false, active_sessions: [], recent_activity: [] } as any,
  gamification: { level: 1, level_name: "Beginner", xp: 0, xp_to_next_level: 1000, tracking_streak_days: 0, longest_streak_days: 0, badges: [], milestones: [] } as any,
  privacyData: { data_retention_days: 365, marketing_consent: false, analytics_consent: false, ai_sharing_consent: false, data_inventory: [], consent_history: [] } as any,
  dataCoverage: { coverage_pct: 0, synced_accounts: 0, total_accounts: 0, accounts: [] } as any,
  netWorthHistory: [] as any[],
};

// Helper to safely extract arrays/objects
const extract = (data: any, fallback: any, key: string) => {
  if (data === null || data === undefined) return fallback;
  if (Array.isArray(data)) return data;
  if (data[key]) return data[key];
  if (data.data) return data.data;
  if (data.user) return data.user;
  if (data.cashflow) return data.cashflow;
  if (data.history) return data.history;
  return data;
};

export function useAppData() {
  const results = useQueries({
    queries: [
      { queryKey: ['accounts'], queryFn: () => api.getAccounts().catch(() => null) },
      { queryKey: ['financialStateMoney'], queryFn: () => api.getMoneyState().catch(() => null) },
      { queryKey: ['transactions'], queryFn: () => api.getTransactions().catch(() => null) },
      { queryKey: ['goals'], queryFn: () => api.getGoals().catch(() => null) },
      { queryKey: ['budgets'], queryFn: () => api.getBudgets().catch(() => null) },
      { queryKey: ['financialHealth'], queryFn: () => api.getFinancialHealth().catch(() => null) },
      { queryKey: ['recurringSeries'], queryFn: () => api.getRecurring().catch(() => null) },
      { queryKey: ['cashflowData'], queryFn: () => api.getCashflow().catch(() => null) },
      { queryKey: ['forecastData'], queryFn: () => api.getForecast().catch(() => null) },
      { queryKey: ['aiHomeFeed'], queryFn: () => api.getAIHomeFeed().catch(() => null) },
      { queryKey: ['peerComparison'], queryFn: () => api.getPeerComparison().catch(() => null) },
      { queryKey: ['calendarEvents'], queryFn: () => api.getCalendarEvents().catch(() => null) },
      { queryKey: ['spendingStory'], queryFn: () => api.getSpendingStory().catch(() => null) },
      { queryKey: ['incomeData'], queryFn: () => api.getIncome().catch(() => null) },
      { queryKey: ['liabilities'], queryFn: () => api.getLiabilities().catch(() => null) },
      { queryKey: ['notifications'], queryFn: () => api.getNotifications().catch(() => null) },
      { queryKey: ['currentUser'], queryFn: () => api.getMe().catch(() => null) },
      { queryKey: ['gamification'], queryFn: () => api.getGamification().catch(() => null) },
      { queryKey: ['securityData'], queryFn: () => Promise.resolve(null) },
      { queryKey: ['privacyData'], queryFn: () => Promise.resolve(null) },
      { queryKey: ['dataCoverage'], queryFn: () => Promise.resolve(null) },
      { queryKey: ['netWorthHistory'], queryFn: () => api.getNetWorthHistory().catch(() => null) },
    ]
  });

  const isLoading = results.some(r => r.isLoading);
  const error = results.find(r => r.error)?.error || null;

  const refetch = useCallback(async () => {
    await Promise.all(results.map(r => r.refetch()));
  }, [results]);

  const [
    accountsRes, moneyRes, txRes, goalsRes, budgetsRes, healthRes, recurringRes,
    cashflowRes, forecastRes, aiRes, peerRes, calendarRes, spendingRes, incomeRes,
    liabilitiesRes, notificationsRes, meRes, gamificationRes, securityRes, privacyRes,
    coverageRes, netWorthRes
  ] = results;

  const aiHomeFeed = extract(aiRes.data, EMPTY_STATE.aiHomeFeed, 'data');
  const aiInsights = aiHomeFeed?.insights || aiHomeFeed?.data?.insights || [];

  return {
    loading: isLoading,
    error,
    accounts: extract(accountsRes.data, EMPTY_STATE.accounts, 'accounts'),
    financialStateMoney: extract(moneyRes.data, EMPTY_STATE.financialStateMoney, 'data'),
    recentTransactions: extract(txRes.data, EMPTY_STATE.recentTransactions, 'transactions'),
    goals: extract(goalsRes.data, EMPTY_STATE.goals, 'goals'),
    budgets: extract(budgetsRes.data, EMPTY_STATE.budgets, 'budgets'),
    financialHealth: extract(healthRes.data, EMPTY_STATE.financialHealth, 'data'),
    recurringSeries: extract(recurringRes.data, EMPTY_STATE.recurringSeries, 'series'),
    cashflowData: extract(cashflowRes.data, EMPTY_STATE.cashflowData, 'data'),
    forecastData: extract(forecastRes.data, EMPTY_STATE.forecastData, 'data'),
    aiHomeFeed,
    aiInsights,
    peerComparison: extract(peerRes.data, EMPTY_STATE.peerComparison, 'data'),
    calendarEvents: extract(calendarRes.data, EMPTY_STATE.calendarEvents, 'events'),
    spendingStory: extract(spendingRes.data, EMPTY_STATE.spendingStory, 'data'),
    incomeData: extract(incomeRes.data, EMPTY_STATE.incomeData, 'data'),
    liabilities: extract(liabilitiesRes.data, EMPTY_STATE.liabilities, 'data'),
    notifications: extract(notificationsRes.data, EMPTY_STATE.notifications, 'notifications'),
    currentUser: extract(meRes.data, EMPTY_STATE.currentUser, 'data'),
    gamification: extract(gamificationRes.data, EMPTY_STATE.gamification, 'data'),
    securityData: extract(securityRes.data, EMPTY_STATE.securityData, 'data'),
    privacyData: extract(privacyRes.data, EMPTY_STATE.privacyData, 'data'),
    dataCoverage: extract(coverageRes.data, EMPTY_STATE.dataCoverage, 'data'),
    netWorthHistory: extract(netWorthRes.data, EMPTY_STATE.netWorthHistory, 'data'),
    refetch
  };
}
