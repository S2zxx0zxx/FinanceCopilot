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
          api.getAccounts().catch(() => fallbackData.accounts),
          api.getMoneyState().catch(() => fallbackData.financialStateMoney),
          api.getTransactions().catch(() => fallbackData.recentTransactions),
          api.getGoals().catch(() => fallbackData.goals),
          api.getBudgets().catch(() => fallbackData.budgets),
          api.getFinancialHealth().catch(() => fallbackData.financialHealth),
          api.getRecurring().catch(() => fallbackData.recurringSeries),
          api.getCashflow().catch(() => fallbackData.cashflowData),
          api.getForecast().catch(() => fallbackData.forecastData),
          api.getAIHomeFeed().catch(() => fallbackData.aiHomeFeed),
          api.getPeerComparison().catch(() => fallbackData.peerComparison),
          api.getCalendarEvents().catch(() => fallbackData.calendarEvents),
          api.getSpendingStory().catch(() => fallbackData.spendingStory),
          api.getIncome().catch(() => fallbackData.incomeData),
          api.getLiabilities().catch(() => fallbackData.liabilities),
          api.getNotifications().catch(() => fallbackData.notifications),
        ]);

        if (!mounted) return;

        setData((prev: any) => ({
          ...prev,
          loading: false,
          accounts,
          financialStateMoney,
          recentTransactions: transactions,
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
        }));
      } catch (err) {
        if (!mounted) return;
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
