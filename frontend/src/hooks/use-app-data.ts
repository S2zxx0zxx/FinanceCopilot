"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

// ── Empty defaults (NO mock data — only safe empty structures) ───────────────
const EMPTY_STATE = {
  accounts: [] as any[],
  financialStateMoney: {
    net_position: {
      available_balance_paise: 0,
      posted_balance_paise: 0,
      pending_balance_paise: 0,
    },
    coverage: { synced_accounts: 0, total_accounts: 0 },
  } as any,
  recentTransactions: [] as any[],
  goals: [] as any[],
  budgets: [] as any[],
  financialHealth: {
    cash_buffer_months: 0,
    cash_buffer_status: "missing",
    commitment_load_ratio: 0,
    commitment_load_status: "missing",
    savings_rate_pct: 0,
    savings_rate_status: "missing",
    emergency_fund_months: 0,
    emergency_fund_status: "missing",
    drivers: {},
  } as any,
  recurringSeries: [] as any[],
  cashflowData: [] as any[],
  forecastData: {
    horizons: [],
    timeline: [],
    drivers: [],
  } as any,
  aiHomeFeed: { insights: [] } as any,
  aiInsights: [] as any[],
  peerComparison: {
    bracket: "—",
    total_peers: 0,
    your_savings_rate: 0,
    peer_median_savings_rate: 0,
    peer_top_10_pct: 0,
    your_cash_buffer_months: 0,
    peer_median_cash_buffer: 0,
    peer_top_10_pct_buffer: 0,
    your_subscription_count: 0,
    peer_median_subscriptions: 0,
    your_dining_spend_pct_of_income: 0,
    peer_median_dining_pct: 0,
  } as any,
  calendarEvents: [] as any[],
  spendingStory: { total_spent_paise: 0, change_paise: 0, categories: [] } as any,
  incomeData: {} as any,
  liabilities: {} as any,
  notifications: [] as any[],
  currentUser: {
    id: "",
    email: "",
    displayName: "",
    photoURL: null,
    createdAt: new Date().toISOString(),
  } as any,
  securityData: {
    security_score: 0,
    two_factor_enabled: false,
    active_sessions: [],
    recent_activity: [],
  } as any,
  gamification: {
    level: 1,
    level_name: "Beginner",
    xp: 0,
    xp_to_next_level: 1000,
    tracking_streak_days: 0,
    longest_streak_days: 0,
    badges: [],
    milestones: [],
  } as any,
  privacyData: {
    data_retention_days: 365,
    marketing_consent: false,
    analytics_consent: false,
    ai_sharing_consent: false,
    data_inventory: [],
    consent_history: [],
  } as any,
  dataCoverage: {
    coverage_pct: 0,
    synced_accounts: 0,
    total_accounts: 0,
    accounts: [],
  } as any,
  netWorthHistory: [] as any[],
};

export function useAppData() {
  const [data, setData] = useState<any>({
    loading: true,
    error: null,
    ...EMPTY_STATE,
  });

  const loadData = useCallback(async () => {
    let mounted = true;

    try {
      const [
        accounts,
        financialStateMoney,
        transactions,
        goals,
        budgets,
        financialHealth,
        recurringSeries,
        cashflowData,
        forecastData,
        aiHomeFeed,
        peerComparison,
        calendarEvents,
        spendingStory,
        incomeData,
        liabilities,
        notifications,
        me,
        gamification,
        securityData,
        privacyData,
        dataCoverage,
        netWorthHistory,
      ]: any[] = await Promise.all([
        api.getAccounts().catch(() => null),
        api.getMoneyState().catch(() => null),
        api.getTransactions().catch(() => null),
        api.getGoals().catch(() => null),
        api.getBudgets().catch(() => null),
        api.getFinancialHealth().catch(() => null),
        api.getRecurring().catch(() => null),
        api.getCashflow().catch(() => null),
        api.getForecast().catch(() => null),
        api.getAIHomeFeed().catch(() => null),
        api.getPeerComparison().catch(() => null),
        api.getCalendarEvents().catch(() => null),
        api.getSpendingStory().catch(() => null),
        api.getIncome().catch(() => null),
        api.getLiabilities().catch(() => null),
        api.getNotifications().catch(() => null),
        api.getMe().catch(() => null),
        api.getGamification().catch(() => null),
        // Security + privacy + data coverage use trust endpoints; not all backends ship them.
        Promise.resolve(null),
        Promise.resolve(null),
        Promise.resolve(null),
        api.getNetWorthHistory().catch(() => null),
      ]);

      if (!mounted) return;

      setData((prev: any) => ({
        ...prev,
        loading: false,
        error: null,
        accounts: accounts !== null
          ? (Array.isArray(accounts) ? accounts : accounts?.accounts || accounts?.data || [])
          : prev.accounts,
        financialStateMoney: financialStateMoney !== null
          ? (financialStateMoney?.data || financialStateMoney)
          : prev.financialStateMoney,
        recentTransactions: transactions !== null
          ? (Array.isArray(transactions) ? transactions : transactions?.transactions || transactions?.data || [])
          : prev.recentTransactions,
        goals: goals !== null
          ? (Array.isArray(goals) ? goals : goals?.goals || goals?.data || [])
          : prev.goals,
        budgets: budgets !== null
          ? (Array.isArray(budgets) ? budgets : budgets?.budgets || budgets?.data || [])
          : prev.budgets,
        financialHealth: financialHealth !== null
          ? (financialHealth?.data || financialHealth)
          : prev.financialHealth,
        recurringSeries: recurringSeries !== null
          ? (Array.isArray(recurringSeries) ? recurringSeries : recurringSeries?.series || recurringSeries?.data || [])
          : prev.recurringSeries,
        cashflowData: cashflowData !== null
          ? (Array.isArray(cashflowData) ? cashflowData : cashflowData?.data || cashflowData?.cashflow || [])
          : prev.cashflowData,
        forecastData: forecastData !== null
          ? (forecastData?.data || forecastData)
          : prev.forecastData,
        aiHomeFeed: aiHomeFeed !== null
          ? (aiHomeFeed?.data || aiHomeFeed)
          : prev.aiHomeFeed,
        aiInsights: aiHomeFeed !== null
          ? (aiHomeFeed?.insights || aiHomeFeed?.data?.insights || [])
          : prev.aiInsights || [],
        peerComparison: peerComparison !== null
          ? (peerComparison?.data || peerComparison)
          : prev.peerComparison,
        calendarEvents: calendarEvents !== null
          ? (Array.isArray(calendarEvents) ? calendarEvents : calendarEvents?.events || calendarEvents?.data || [])
          : prev.calendarEvents,
        spendingStory: spendingStory !== null
          ? (spendingStory?.data || spendingStory)
          : prev.spendingStory,
        incomeData: incomeData !== null
          ? (incomeData?.data || incomeData)
          : prev.incomeData,
        liabilities: liabilities !== null
          ? (liabilities?.data || liabilities)
          : prev.liabilities,
        notifications: notifications !== null
          ? (Array.isArray(notifications) ? notifications : notifications?.notifications || notifications?.data || [])
          : prev.notifications || [],
        currentUser: me !== null
          ? (me?.user || me?.data || me)
          : prev.currentUser,
        gamification: gamification !== null
          ? (gamification?.data || gamification)
          : prev.gamification,
        securityData: securityData !== null
          ? (securityData?.data || securityData)
          : prev.securityData,
        privacyData: privacyData !== null
          ? (privacyData?.data || privacyData)
          : prev.privacyData,
        dataCoverage: dataCoverage !== null
          ? (dataCoverage?.data || dataCoverage)
          : prev.dataCoverage,
        netWorthHistory: netWorthHistory !== null
          ? (Array.isArray(netWorthHistory) ? netWorthHistory : netWorthHistory?.history || netWorthHistory?.data || [])
          : prev.netWorthHistory,
      }));
    } catch (err) {
      if (!mounted) return;
      setData((prev: any) => ({ ...prev, loading: false, error: err }));
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    const cleanup = () => { active = false; };

    (async () => {
      const unload = await loadData();
      if (!active && typeof unload === "function") unload();
    })();

    return cleanup;
  }, []);

  const refetch = useCallback(async () => {
    await loadData();
  }, [loadData]);

  return { ...data, refetch };
}
