"use client";
import Link from 'next/link';
import { ArrowUpRight, Target, CalendarDays, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { amount, label, object, rows } from '@/lib/response';
import { formatPaise } from '@/lib/format';
import { useResource } from '@/hooks/use-resource';
import { ResourceState } from '@/components/shared/resource-state';
import { NewGoalDialog } from '@/components/shared/new-goal-dialog';

const money = (value: unknown) => { const parsed = amount(value); return parsed === null ? 'Unavailable' : formatPaise(parsed); };
async function loadPlan() {
  const [goals,budgets,recurring] = await Promise.all([api.getGoals(),api.getBudgets(),api.getRecurring()]);
  return {goals:rows(object(goals).goals),budgets:rows(object(budgets).budgets),recurring:rows(object(recurring).recurring)};
}
async function loadForecast() { return object(object(await api.getForecast()).outlook); }

function ForecastOutlook() {
  const state=useResource(loadForecast);
  return <section className="premium-card p-6"><div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-accent">Looking ahead</p><h2 className="font-display text-2xl font-semibold mt-2">Your balance outlook</h2></div><Link href="/forecast" className="text-sm text-accent">Explore forecast <ArrowUpRight className="inline h-4 w-4" /></Link></div>
    <p className="text-sm text-(--text-secondary) mt-2">Estimates depend on the data you have connected. They are not guaranteed balances.</p>
    <div className="mt-6"><ResourceState loading={state.loading} error={state.error} retry={state.reload} /></div>
    {state.data && <div className="grid gap-4 sm:grid-cols-3">{['7d','30d','90d'].map(key=>{
      const forecast=object(state.data?.[key]); const available=forecast.status !== 'FORECAST_UNAVAILABLE' && amount(forecast.pointEstimatePaise)!==null;
      return <div key={key} className="rounded-2xl border border-(--border) p-4"><p className="text-sm text-(--text-secondary)">{key.replace('d',' days')}</p><p className="text-2xl font-semibold mt-3 tabular-nums">{available ? money(forecast.pointEstimatePaise) : 'Not enough data'}</p><p className="text-xs text-(--text-secondary) mt-2">{available ? `${money(forecast.lowerBoundPaise)} – ${money(forecast.upperBoundPaise)}` : 'Connect more account history to improve this outlook.'}</p><p className="text-xs mt-3">{label(forecast.trustState).replaceAll('_',' ')}</p></div>;
    })}</div>}
  </section>;
}

export default function PlanPage() {
  const state=useResource(loadPlan);
  return <main className="max-w-5xl mx-auto flex flex-col gap-7 pb-12">
    <header className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.2em] text-accent">Make room for what matters</p><h1 className="font-display text-4xl font-semibold mt-3">Your plan</h1><p className="text-(--text-secondary) mt-2">Goals, budgets and upcoming commitments in one place.</p></div><NewGoalDialog onCreated={state.reload} /></header>
    <ResourceState loading={state.loading} error={state.error} retry={state.reload} />
    {state.data && <>
      <section><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-semibold flex gap-2 items-center"><Target className="h-5 w-5 text-accent" /> Goals</h2><Link href="/goals" className="text-sm text-accent">Manage goals →</Link></div>
      {!state.data.goals.length ? <div className="premium-card p-8"><h3 className="text-lg font-semibold">Give your next milestone a plan</h3><p className="text-sm text-(--text-secondary) mt-2">Create a goal, then record contributions to track actual progress.</p></div> : <div className="grid gap-4 sm:grid-cols-2">{state.data.goals.map(goal=>{
        const target=amount(goal.target_amount_paise); const saved=amount(goal.current_amount_paise); const progress=target && saved!==null ? Math.min(100,Math.max(0,saved/target*100)) : 0;
        return <Link href={`/goals/${encodeURIComponent(label(goal.goal_id,''))}`} key={label(goal.goal_id)} className="premium-card p-5 hover:border-accent transition-colors"><div className="flex justify-between gap-3"><h3 className="font-semibold">{label(goal.name)}</h3><ArrowUpRight className="h-4 w-4" /></div><p className="mt-4 text-2xl font-semibold tabular-nums">{money(goal.current_amount_paise)} <span className="text-sm font-normal text-(--text-secondary)">of {money(goal.target_amount_paise)}</span></p><progress className="w-full h-2 mt-4 accent-(--accent)" max={100} value={progress} aria-label={`${label(goal.name)} progress`} /><p className="text-xs text-(--text-secondary) mt-3">{label(goal.status).replaceAll('_',' ')} · Monthly plan {money(goal.monthly_contribution_paise)}</p></Link>;
      })}</div>}</section>
      <section className="premium-card p-6"><div className="flex justify-between mb-4"><h2 className="text-xl font-semibold">Budget check-in</h2><Link href="/budgets" className="text-sm text-accent">Manage budgets →</Link></div>{!state.data.budgets.length ? <p className="text-sm text-(--text-secondary)">No budgets yet. Set category limits to compare them with recorded spending.</p> : <div className="divide-y divide-(--border)">{state.data.budgets.map(budget=><div key={label(budget.budget_id)} className="py-4 flex justify-between gap-4"><div><p className="font-medium">{label(budget.category_name,label(budget.category))}</p><p className="text-xs text-(--text-secondary) mt-1">{label(budget.period,'Current period')}</p></div><p className="text-sm tabular-nums">{money(budget.spent_paise)} <span className="text-(--text-secondary)">/ {money(budget.budgeted_paise)}</span></p></div>)}</div>}</section>
      <section className="premium-card p-6"><div className="flex justify-between mb-4"><h2 className="text-xl font-semibold flex items-center gap-2"><CalendarDays className="h-5 w-5 text-accent" /> Recurring activity</h2><Link href="/recurring" className="text-sm text-accent">Review activity →</Link></div>{!state.data.recurring.length ? <p className="text-sm text-(--text-secondary)">Recurring patterns will appear after enough transaction history is imported.</p> : <div className="divide-y divide-(--border)">{state.data.recurring.map(series=><div key={label(series.series_id)} className="py-4 flex justify-between gap-4"><div><p className="font-medium">{label(series.merchant_name,label(series.name))}</p><p className="text-xs text-(--text-secondary) mt-1">{label(series.frequency)} · {label(series.status)}</p></div><p className="text-sm tabular-nums">{money(series.amount_paise)}</p></div>)}</div>}</section>
    </>}
    <ForecastOutlook />
    <button onClick={state.reload} className="self-start text-sm flex gap-2 items-center text-(--text-secondary)"><RefreshCw className="h-4 w-4" /> Refresh plan</button>
  </main>;
}
