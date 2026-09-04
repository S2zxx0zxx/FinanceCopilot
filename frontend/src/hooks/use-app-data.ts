"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import * as fallbackData from "@/lib/data";

// Type mapping to ensure we match what data.ts exported
export function useAppData() {
  const [data, setData] = useState<any>({
    loading: true,
    error: null,
    // Start with fallback/mock data so the UI doesn't crash before fetch finishes
    ...fallbackData
  });

  useEffect(() => {
    let mounted = true;

    async function loadData() {
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
          notifications
        ] = await Promise.all([
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
        ]);

        if (!mounted) return;

        setData((prev: any) => ({
          ...prev,
          loading: false,
          error: null,
          // Use real data if available, fall back to existing state (not mock) on null
          accounts: accounts !== null
            ? (Array.isArray(accounts) ? accounts : accounts?.accounts || [])
            : prev.accounts,
          financialStateMoney: financialStateMoney !== null
            ? (financialStateMoney?.data || financialStateMoney)
            : prev.financialStateMoney,
          recentTransactions: transactions !== null
            ? (Array.isArray(transactions) ? transactions : transactions?.transactions || transactions?.data || [])
            : prev.recentTransactions,
          goals: goals !== null
            ? (Array.isArray(goals) ? goals : goals?.goals || [])
            : prev.goals,
          budgets: budgets !== null
            ? (Array.isArray(budgets) ? budgets : budgets?.budgets || [])
            : prev.budgets,
          financialHealth: financialHealth !== null
            ? (financialHealth?.data || financialHealth)
            : prev.financialHealth,
          recurringSeries: recurringSeries !== null
            ? (Array.isArray(recurringSeries) ? recurringSeries : recurringSeries?.series || recurringSeries?.data || [])
            : prev.recurringSeries,
          cashflowData: cashflowData !== null
            ? (cashflowData?.data || cashflowData)
            : prev.cashflowData,
          forecastData: forecastData !== null
            ? (forecastData?.data || forecastData)
            : prev.forecastData,
          aiHomeFeed: aiHomeFeed !== null
            ? (aiHomeFeed?.data || aiHomeFeed)
            : prev.aiHomeFeed,
          // aiInsights is a sub-key of aiHomeFeed — keep in sync
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
        }));
      } catch (err) {
        if (!mounted) return;
        // On catastrophic failure, keep existing data (from initial fallback) but flag error
        setData((prev: any) => ({ ...prev, loading: false, error: err }));
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}
