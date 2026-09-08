"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Scale, Lightbulb } from "lucide-react";

import { formatPaise } from "@/lib/format";
import { CashflowBarChart } from "@/components/charts/recharts";
import { SectionHeader } from "@/components/shared";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object,rows,amount,label } from "@/lib/response";

type PeriodId = "7d" | "30d" | "90d" | "12mo";

const PERIODS: { id: PeriodId; label: string; months: number; note: string }[] = [
  { id: "7d", label: "7d", months: 1, note: "Last 7 days" },
  { id: "30d", label: "30d", months: 1, note: "Last 30 days" },
  { id: "90d", label: "90d", months: 3, note: "Last 90 days" },
  { id: "12mo", label: "12mo", months: 12, note: "12 calendar months including this month" },
];

export default function CashflowPage() {

  const [period, setPeriod] = React.useState<PeriodId>("12mo");
  const loader=React.useCallback(async()=>rows(object(await api.getCashflowHistory(period)).history).map(row=>{
    const income=amount(row.income_paise),expense=amount(row.expense_paise);
    if(income===null||expense===null)throw new Error('Cashflow amounts are unavailable.');
    return {month:label(row.month),income:income/100,expense:expense/100};
  }),[period]);
  const state=useResource(loader);
  const cashflowData=state.data??[];
  const selected = PERIODS.find((p) => p.id === period)!;

  // cashflowData income/expense are in RUPEES — multiply by 100 to convert to
  // paise for formatPaise so the displayed amounts match the chart's ₹K/L axis.
  const summaryData = cashflowData;
  const totalIncome = summaryData.reduce((s, m) => s + m.income, 0);
  const totalExpense = summaryData.reduce((s, m) => s + m.expense, 0);
  const netFlow = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? (netFlow / totalIncome) * 100 : 0;

  const insight = `Posted income of ${formatPaise(Math.round(totalIncome*100))} and net spending of ${formatPaise(Math.round(totalExpense*100))} across this period. Transfers and records awaiting review are excluded.`;
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">
          Cashflow pulse
        </h1>
        <p className="text-[14px] text-(--text-secondary) mt-1">
          Income vs Expenses · {selected.note}
        </p>
      </motion.header>

      {/* Period toggle */}
      <div className="inline-flex p-1 bg-[var(--surface-subtle)] rounded-full gap-1 self-start">
        {PERIODS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPeriod(p.id)}
            className={`relative px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
              period === p.id
                ? "text-accent-foreground"
                : "text-(--text-secondary) hover:text-foreground"
            }`}
          >
            {period === p.id && (
              <motion.div
                layoutId="cashflow-period-pill"
                className="absolute inset-0 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="premium-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[8px] bg-[var(--positive-light)] flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-(--positive)" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              Total Income
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] text-(--positive)">
            +{formatPaise(totalIncome * 100)}
          </span>
          <span className="text-[12px] text-(--text-tertiary)">
            across {summaryData.length} month{summaryData.length > 1 ? "s" : ""}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="premium-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[8px] bg-(--negative-light) flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 text-(--negative)" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              Total Expense
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] text-(--negative)">
            −{formatPaise(totalExpense * 100)}
          </span>
          <span className="text-[12px] text-(--text-tertiary)">
            across {summaryData.length} month{summaryData.length > 1 ? "s" : ""}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="premium-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-[8px] flex items-center justify-center ${
                netFlow >= 0
                  ? "bg-[var(--accent-light)]"
                  : "bg-(--negative-light)"
              }`}
            >
              <Scale
                className={`w-3.5 h-3.5 ${
                  netFlow >= 0 ? "text-accent" : "text-(--negative)"
                }`}
              />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              Net Flow
            </span>
          </div>
          <span
            className={`font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] ${
              netFlow >= 0 ? "text-(--positive)" : "text-(--negative)"
            }`}
          >
            {netFlow >= 0 ? "+" : "−"}
            {formatPaise(Math.abs(netFlow) * 100)}
          </span>
          <span className="text-[12px] text-(--text-tertiary)">
            savings rate {savingsRate.toFixed(0)}%
          </span>
        </motion.div>
      </div>

      {/* Chart */}
      <section>
        <SectionHeader
          title="Income vs Expenses"
          action={
            <span className="text-[12px] font-mono text-(--text-tertiary)">
              {selected.label} view
            </span>
          }
        />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="premium-card p-5"
        >
          <CashflowBarChart data={summaryData} />
          <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-(--border-subtle)">
            <span className="flex items-center gap-2 text-[11px] font-mono text-(--text-secondary)">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--chart-1)" }} /> Income
            </span>
            <span className="flex items-center gap-2 text-[11px] font-mono text-(--text-secondary)">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--chart-2)" }} /> Expense
            </span>
          </div>
        </motion.div>
      </section>

      {/* Monthly breakdown list */}
      <section>
        <SectionHeader
          title="Monthly Breakdown"
          action={
            <span className="text-[12px] font-mono text-(--text-tertiary)">
              {selected.label} · net per month
            </span>
          }
        />
        <div className="premium-card overflow-hidden">
          {[...summaryData].reverse().map((m, i, arr) => {
            const net = m.income - m.expense;
            const netPct =
              m.income > 0 ? Math.max(0, Math.min(1, net / m.income)) : 0;
            return (
              <motion.div
                key={m.month}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                className={`p-4 ${
                  i < arr.length - 1
                    ? "border-b border-(--border-subtle)"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[13px] font-mono uppercase tracking-wider text-(--text-tertiary) w-9 shrink-0">
                      {m.month}
                    </span>
                    <div className="flex-1 min-w-0 hidden sm:block">
                      <div className="h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden flex">
                        <div
                          className="h-full"
                          style={{ width: `${(m.income / 100000) * 100}%`, background: "var(--chart-1)" }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 text-right shrink-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">
                        Income
                      </span>
                      <span className="text-[13px] font-semibold tabular-nums text-(--positive)">
                        {formatPaise(m.income * 100, { style: "compact" })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">
                        Expense
                      </span>
                      <span className="text-[13px] font-semibold tabular-nums text-(--negative)">
                        {formatPaise(m.expense * 100, { style: "compact" })}
                      </span>
                    </div>
                    <div className="flex flex-col w-16">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">
                        Net
                      </span>
                      <span
                        className={`text-[13px] font-semibold tabular-nums ${
                          net >= 0
                            ? "text-foreground"
                            : "text-(--negative)"
                        }`}
                      >
                        {net >= 0 ? "+" : "−"}
                        {formatPaise(Math.abs(net) * 100, { style: "compact" })}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Mobile-only savings rate bar */}
                <div className="mt-2 sm:hidden flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">
                    Savings
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${netPct * 100}%`,
                        background:
                          net >= 0 ? "var(--accent)" : "var(--negative)",
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-mono tabular-nums text-(--text-secondary) w-9 text-right">
                    {(netPct * 100).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Insight card */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5 }}
        className="premium-card p-5 flex items-start gap-3"
      >
        <span className="w-9 h-9 rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 text-accent" />
        </span>
        <div>
          <h3 className="text-[14px] font-semibold mb-1">What this means</h3>
          <p className="text-[13px] text-(--text-secondary) leading-[1.55]">
            {insight}
          </p>
        </div>
      </motion.section>
    </div>
  );
}
