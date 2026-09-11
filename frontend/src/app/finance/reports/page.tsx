"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, RefreshCw, TrendingUp, WalletCards } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type Breakdown = { key: string; label: string; value: number; color: string };
type Point = { date: string; value: number; breakdowns?: Record<string, number>; change?: number | null };
type Report = {
  summary: { primary_value: number; change_amount: number; change_percent: number | null; breakdowns: Breakdown[] };
  trend: Point[];
  meta: { type: string; currency: string; interval: string; series_keys: string[] };
};

type ReportBundle = { netWorth: Report; incomeExpenses: Report; cashFlow: Report };

function money(value: number, currency: string) {
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(value || 0); }
  catch { return `${currency} ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value || 0)}`; }
}

const loadReports = async (): Promise<ReportBundle> => {
  const [netWorth, incomeExpenses, cashFlow] = await Promise.all([
    engineApi.get<Report>("/reports/net-worth?months=12&interval=monthly"),
    engineApi.get<Report>("/reports/income-expenses?months=12&interval=monthly"),
    engineApi.get<Report>("/reports/cash-flow?months=6&interval=monthly"),
  ]);
  return { netWorth, incomeExpenses, cashFlow };
};

function ReportCard({ title, description, report, Icon }: { title: string; description: string; report: Report; Icon: typeof TrendingUp }) {
  const currency = report.meta.currency || "INR";
  const maxBreakdown = Math.max(1, ...report.summary.breakdowns.map((item) => Math.abs(item.value)));
  return <article className="premium-card p-6 min-w-0">
    <div className="flex items-start justify-between gap-4"><div><p className="text-xs text-(--text-secondary)">{description}</p><h2 className="font-display font-semibold text-xl mt-1">{title}</h2></div><Icon className="w-5 h-5 text-accent shrink-0"/></div>
    <p className="font-display font-bold text-3xl mt-5">{money(report.summary.primary_value, currency)}</p>
    <p className={`text-xs mt-1 ${report.summary.change_amount >= 0 ? "text-emerald-500" : "text-red-500"}`}>{report.summary.change_amount >= 0 ? "+" : ""}{money(report.summary.change_amount, currency)}{report.summary.change_percent !== null ? ` · ${report.summary.change_percent.toFixed(1)}%` : ""}</p>
    <div className="mt-5 space-y-3">{report.summary.breakdowns.slice(0,5).map((item)=><div key={item.key}><div className="flex justify-between gap-3 text-xs"><span className="text-(--text-secondary)">{item.label}</span><span>{money(item.value,currency)}</span></div><div className="h-1.5 rounded-full bg-(--surface-subtle) overflow-hidden mt-1.5"><div className="h-full rounded-full bg-accent" style={{width:`${Math.max(2,Math.min(100,Math.abs(item.value)/maxBreakdown*100))}%`}}/></div></div>)}</div>
  </article>;
}

export default function FinanceReportsPage() {
  const loader = useCallback(loadReports, []);
  const state = useResource(loader);
  return <div className="flex flex-col gap-6 max-w-6xl pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent"><ArrowLeft className="w-3.5 h-3.5"/>Finance operations</Link><p className="text-xs uppercase tracking-[.18em] text-accent mt-5">Analytics engine</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Reports & net worth</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-2xl">The engine's native net-worth, income/expense and cash-flow calculations presented inside FinCopilot.</p></div><button onClick={state.reload} disabled={state.loading} className="min-h-11 px-4 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${state.loading?"animate-spin":""}`}/>Refresh</button></header>
    <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>
    {state.data && <>
      <section className="grid lg:grid-cols-3 gap-4"><ReportCard title="Net worth" description="Accounts + assets" report={state.data.netWorth} Icon={TrendingUp}/><ReportCard title="Income vs expenses" description="12-month money movement" report={state.data.incomeExpenses} Icon={BarChart3}/><ReportCard title="Cash flow" description="6-month flow outlook" report={state.data.cashFlow} Icon={WalletCards}/></section>
      <section className="premium-card p-6"><h2 className="font-display font-semibold text-xl">Net-worth history</h2><p className="text-xs text-(--text-secondary) mt-1">Latest monthly engine points</p><div className="mt-5 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-(--text-tertiary) border-b border-(--border)"><th className="py-3 font-medium">Period</th><th className="py-3 font-medium text-right">Value</th><th className="py-3 font-medium text-right">Change</th></tr></thead><tbody>{state.data.netWorth.trend.slice(-12).map((point)=><tr key={point.date} className="border-b border-(--border) last:border-0"><td className="py-3">{point.date}</td><td className="py-3 text-right font-medium">{money(point.value,state.data!.netWorth.meta.currency)}</td><td className="py-3 text-right text-(--text-secondary)">{point.change == null ? "—" : money(point.change,state.data!.netWorth.meta.currency)}</td></tr>)}</tbody></table></div></section>
    </>}
  </div>;
}
