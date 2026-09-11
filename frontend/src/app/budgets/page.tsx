"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Pencil, Plus, RefreshCw, Repeat2, Trash2 } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type Budget = {
  id: string;
  category_id: string;
  amount: number | string;
  month: string;
  is_recurring: boolean;
};
type Comparison = {
  category_id: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  group_id?: string | null;
  group_name?: string | null;
  budget_amount?: number | string | null;
  actual_amount: number | string;
  projected_amount: number | string;
  prev_month_amount: number | string;
  projected_prev_month_amount: number | string;
  percentage_used?: number | null;
  is_recurring: boolean;
};
type Category = {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  is_hidden?: boolean;
};
type BudgetBundle = { budgets: Budget[]; comparison: Comparison[] };

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function moveMonth(value: string, delta: number) {
  const [year, month] = value.split("-").map(Number);
  const date = new Date(year, month - 1 + delta, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthTitle(value: string) {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function number(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number | string | null | undefined) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number(value));
}

export default function BudgetsPage() {
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const categories = useResource(useCallback(async () => {
    const rows = await engineApi.get<Category[]>("/categories?include_hidden=true");
    return Array.isArray(rows) ? rows : [];
  }, []));

  const loader = useCallback(async (): Promise<BudgetBundle> => {
    const month = `${selectedMonth}-01`;
    const [budgets, comparison] = await Promise.all([
      engineApi.get<Budget[]>(`/budgets?month=${month}`),
      engineApi.get<Comparison[]>(`/budgets/comparison?month=${month}`),
    ]);
    return {
      budgets: Array.isArray(budgets) ? budgets : [],
      comparison: Array.isArray(comparison) ? comparison : [],
    };
  }, [selectedMonth]);
  const state = useResource(loader);

  const categoryMap = useMemo(() => new Map((categories.data ?? []).map((item) => [item.id, item])), [categories.data]);
  const budgetMap = useMemo(() => new Map((state.data?.budgets ?? []).map((item) => [item.category_id, item])), [state.data]);
  const rows = useMemo(() => {
    const comparison = state.data?.comparison ?? [];
    return comparison
      .filter((item) => item.budget_amount !== null && item.budget_amount !== undefined)
      .sort((a, b) => number(b.percentage_used) - number(a.percentage_used));
  }, [state.data]);

  const totals = useMemo(() => {
    return rows.reduce((acc, row) => {
      acc.budget += number(row.budget_amount);
      acc.actual += number(row.actual_amount);
      acc.projected += number(row.projected_amount);
      if (number(row.percentage_used) > 100) acc.over += 1;
      if (number(row.percentage_used) >= 80 && number(row.percentage_used) <= 100) acc.warning += 1;
      return acc;
    }, { budget: 0, actual: 0, projected: 0, over: 0, warning: 0 });
  }, [rows]);

  const availableCategories = useMemo(() => (categories.data ?? []).filter((item) => !item.is_hidden), [categories.data]);

  const startCreate = () => {
    setEditing(null);
    setCategoryId(availableCategories.find((item) => !budgetMap.has(item.id))?.id ?? availableCategories[0]?.id ?? "");
    setAmount("");
    setIsRecurring(false);
    setMutationError(null);
    setEditorOpen(true);
  };

  const startEdit = (row: Comparison) => {
    const budget = budgetMap.get(row.category_id);
    if (!budget) return;
    setEditing(budget);
    setCategoryId(budget.category_id);
    setAmount(String(number(budget.amount)));
    setIsRecurring(budget.is_recurring);
    setMutationError(null);
    setEditorOpen(true);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setMutationError("Enter a positive budget amount.");
      return;
    }
    if (!editing && !categoryId) {
      setMutationError("Choose a category.");
      return;
    }
    setBusy("save");
    setMutationError(null);
    setMessage(null);
    try {
      if (editing) {
        await engineApi.patch(`/budgets/${editing.id}`, { amount: parsed });
        setMessage("Budget updated.");
      } else {
        await engineApi.post("/budgets", {
          category_id: categoryId,
          amount: parsed,
          month: `${selectedMonth}-01`,
          is_recurring: isRecurring,
        });
        setMessage(isRecurring ? "Recurring budget created." : "Budget created.");
      }
      setEditorOpen(false);
      setEditing(null);
      state.reload();
    } catch (caught) {
      setMutationError(caught instanceof Error ? caught.message : "Budget could not be saved.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (row: Comparison) => {
    const budget = budgetMap.get(row.category_id);
    if (!budget || !window.confirm(`Delete the ${row.category_name} budget for ${monthTitle(selectedMonth)}?`)) return;
    setBusy(`delete-${budget.id}`);
    setMutationError(null);
    try {
      await engineApi.delete(`/budgets/${budget.id}`);
      setMessage("Budget deleted.");
      state.reload();
    } catch (caught) {
      setMutationError(caught instanceof Error ? caught.message : "Budget could not be deleted.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto flex flex-col gap-6 pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-accent">Plan your spending</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-2">Spending guardrails</h1>
          <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Set category budgets against the real finance ledger, compare actual and projected spending, and carry recurring limits into future months.</p>
        </div>
        <button onClick={startCreate} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2"><Plus className="size-4" />Add budget</button>
      </header>

      <section className="premium-card p-3 flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => setSelectedMonth((value) => moveMonth(value, -1))} className="grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Previous month"><ChevronLeft className="size-4" /></button>
        <label className="flex items-center gap-2 min-h-10 px-4 rounded-xl border border-(--border) bg-(--surface)">
          <CalendarDays className="size-4 text-accent" />
          <input type="month" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)} className="bg-transparent outline-none font-medium" />
        </label>
        <button onClick={() => setSelectedMonth((value) => moveMonth(value, 1))} className="grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Next month"><ChevronRight className="size-4" /></button>
      </section>

      {message && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-500">{message}</p>}
      {mutationError && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">{mutationError}</p>}

      {editorOpen && (
        <form onSubmit={save} className="premium-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs uppercase tracking-wider text-accent">{editing ? "Edit budget" : "New budget"}</p><h2 className="font-display text-xl font-semibold mt-1">{monthTitle(selectedMonth)}</h2></div>
            <button type="button" onClick={() => setEditorOpen(false)} className="text-xs text-(--text-secondary) hover:text-(--text-primary)">Close</button>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-5">
            <label className="text-sm">Category<select disabled={Boolean(editing)} value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2 disabled:opacity-50"><option value="">Choose category</option>{availableCategories.map((category)=><option key={category.id} value={category.id} disabled={!editing && budgetMap.has(category.id)}>{category.name}{budgetMap.has(category.id) && !editing ? " · budgeted" : ""}</option>)}</select></label>
            <label className="text-sm">Amount (INR)<input type="number" min="0.01" step="0.01" required value={amount} onChange={(event)=>setAmount(event.target.value)} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2" placeholder="10000" /></label>
            <label className={`text-sm rounded-xl border border-(--border) p-3 mt-0 md:mt-7 flex items-center gap-3 ${editing ? "opacity-60" : ""}`}><input type="checkbox" disabled={Boolean(editing)} checked={isRecurring} onChange={(event)=>setIsRecurring(event.target.checked)} /><span><span className="font-medium flex items-center gap-1.5"><Repeat2 className="size-3.5" />Recurring</span><span className="block text-[11px] text-(--text-secondary) mt-1">Carry this limit forward.</span></span></label>
          </div>
          <button disabled={busy === "save"} className="mt-4 min-h-11 px-5 rounded-xl bg-accent text-white disabled:opacity-50">{busy === "save" ? "Saving…" : editing ? "Save changes" : "Create budget"}</button>
        </form>
      )}

      <ResourceState loading={state.loading || categories.loading} error={state.error || categories.error} retry={() => { state.reload(); categories.reload(); }} />

      {state.data && (
        <>
          <section className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
            <div className="premium-card p-5 sm:col-span-2"><p className="text-xs text-(--text-secondary)">Planned · {monthTitle(selectedMonth)}</p><p className="font-display text-3xl font-semibold mt-2">{money(totals.budget)}</p><p className="text-xs text-(--text-tertiary) mt-1">{rows.length} category guardrail{rows.length === 1 ? "" : "s"}</p></div>
            <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Spent</p><p className="font-display text-2xl font-semibold mt-2">{money(totals.actual)}</p></div>
            <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Projected</p><p className="font-display text-2xl font-semibold mt-2">{money(totals.projected)}</p></div>
            <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Needs attention</p><p className="font-display text-2xl font-semibold mt-2">{totals.over + totals.warning}</p><p className="text-[11px] text-(--text-secondary) mt-1">{totals.over} over · {totals.warning} near limit</p></div>
          </section>

          <section className="premium-card overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-(--border) flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-xl font-semibold">Budget vs actual</h2><p className="text-xs text-(--text-secondary) mt-1">Live category spending and month-end projection from the finance engine.</p></div><button onClick={state.reload} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2 text-sm"><RefreshCw className="size-4" />Refresh</button></div>
            {rows.length === 0 ? <div className="p-10 text-center"><p className="font-medium">No budgets for {monthTitle(selectedMonth)}</p><p className="text-sm text-(--text-secondary) mt-2">Create a category guardrail or move to another month.</p><button onClick={startCreate} className="mt-4 text-sm text-accent hover:underline">Add your first budget</button></div> : <div className="divide-y divide-(--border)">{rows.map((row)=>{
              const used = Math.max(0, number(row.percentage_used));
              const width = Math.min(100, used);
              const over = used > 100;
              const warning = used >= 80 && !over;
              const category = categoryMap.get(row.category_id);
              return <article key={row.category_id} className="p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0"><span className="size-10 rounded-xl grid place-items-center text-sm font-bold shrink-0" style={{backgroundColor:`${row.category_color || category?.color || "#6366f1"}22`,color:row.category_color || category?.color || "#6366f1"}}>{(row.category_name || category?.name || "?").slice(0,1).toUpperCase()}</span><div className="min-w-0"><p className="font-semibold truncate">{row.category_name || category?.name || "Category"}</p><p className="text-xs text-(--text-secondary) mt-1">{row.group_name || "Un-grouped"}{row.is_recurring ? " · recurring" : ""}</p></div></div>
                  <div className="flex items-start gap-3"><div className="text-right"><p className="font-semibold tabular-nums">{money(row.actual_amount)} <span className="text-(--text-tertiary) font-normal">/ {money(row.budget_amount)}</span></p><p className={`text-xs mt-1 ${over ? "text-red-500" : warning ? "text-amber-500" : "text-(--text-secondary)"}`}>{used.toFixed(0)}% used · projected {money(row.projected_amount)}</p></div><button onClick={()=>startEdit(row)} className="grid size-9 place-items-center rounded-lg border border-(--border)" aria-label="Edit budget"><Pencil className="size-3.5" /></button><button disabled={busy === `delete-${budgetMap.get(row.category_id)?.id}`} onClick={()=>void remove(row)} className="grid size-9 place-items-center rounded-lg border border-(--border) text-red-500 disabled:opacity-50" aria-label="Delete budget"><Trash2 className="size-3.5" /></button></div>
                </div>
                <div className="h-2.5 rounded-full bg-(--surface-subtle) overflow-hidden mt-4"><div className={`h-full rounded-full transition-all ${over ? "bg-red-500" : warning ? "bg-amber-500" : "bg-accent"}`} style={{width:`${width}%`}} /></div>
                <div className="grid sm:grid-cols-3 gap-2 mt-3 text-xs text-(--text-secondary)"><p>Current: <span className="text-(--text-primary)">{money(row.actual_amount)}</span></p><p>Last month: <span className="text-(--text-primary)">{money(row.prev_month_amount)}</span></p><p>Projected last month: <span className="text-(--text-primary)">{money(row.projected_prev_month_amount)}</span></p></div>
              </article>;})}</div>}
          </section>
        </>
      )}
    </main>
  );
}
