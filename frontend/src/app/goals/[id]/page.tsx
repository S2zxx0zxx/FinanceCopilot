"use client";

import { FormEvent, use, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Archive, ArchiveRestore, ArrowLeft, CheckCircle2, Pause, Play, RefreshCw, Target } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type GoalStatus = "active" | "completed" | "paused" | "archived";
type Goal = {
  id: string; name: string; target_amount: number | string; current_amount: number | string;
  currency: string; target_date?: string | null; tracking_type: "manual" | "account" | "asset" | "asset_group" | "net_worth";
  status: GoalStatus; color?: string | null; percentage: number; monthly_contribution?: number | null;
  on_track?: string | null; account_name?: string | null; asset_name?: string | null; asset_group_name?: string | null; updated_at: string;
};

const num = (value: number | string | null | undefined) => Number(value ?? 0) || 0;
function money(value: number | string | null | undefined, currency: string) {
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR", maximumFractionDigits: 0 }).format(num(value)); }
  catch { return `${currency} ${num(value).toLocaleString("en-IN")}`; }
}
function source(goal: Goal) {
  if (goal.tracking_type === "account") return goal.account_name || "Linked account";
  if (goal.tracking_type === "asset") return goal.asset_name || "Linked asset";
  if (goal.tracking_type === "asset_group") return goal.asset_group_name || "Linked asset group";
  if (goal.tracking_type === "net_worth") return "Whole net worth";
  return "Manual progress";
}
function tone(value?: string | null) {
  if (["completed", "achieved", "ahead"].includes(value || "")) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
  if (["behind", "overdue", "paused"].includes(value || "")) return "text-amber-500 border-amber-500/20 bg-amber-500/5";
  return "text-accent border-accent/20 bg-accent/5";
}

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const state = useResource(useCallback(() => engineApi.get<Goal>(`/goals/${id}`), [id]));
  const [savedAmount, setSavedAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const goal = state.data;
  const progress = useMemo(() => Math.max(0, Math.min(100, Number(goal?.percentage ?? 0))), [goal?.percentage]);

  const patch = async (payload: Record<string, unknown>, success: string) => {
    setBusy(true); setError(null); setNotice(null);
    try { await engineApi.patch(`/goals/${id}`, payload); setNotice(success); state.reload(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Goal could not be updated."); }
    finally { setBusy(false); }
  };

  const saveManual = async (event: FormEvent) => {
    event.preventDefault();
    const next = Number(savedAmount);
    if (!Number.isFinite(next) || next < 0) { setError("Enter a valid non-negative saved amount."); return; }
    await patch({ current_amount: next }, "Manual progress updated.");
    setSavedAmount("");
  };

  if (!goal) return <ResourceState loading={state.loading} error={state.error} retry={state.reload} />;
  const remaining = Math.max(0, num(goal.target_amount) - num(goal.current_amount));

  return <div className="flex flex-col gap-6 max-w-5xl pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link href="/goals" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent"><ArrowLeft className="size-3.5" />Dream milestones</Link>
        <p className="text-xs uppercase tracking-[.16em] text-accent mt-5">Native finance goal</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-1">{goal.name}</h1>
        <p className="text-sm text-(--text-secondary) mt-2">{source(goal)}</p>
      </div>
      <button onClick={state.reload} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><RefreshCw className="size-4" />Refresh</button>
    </header>

    {notice && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-500">{notice}</p>}
    {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">{error}</p>}

    <section className="premium-card p-6 sm:p-7">
      <div className="flex flex-col md:flex-row md:items-center gap-7">
        <div className="relative size-32 shrink-0 rounded-full grid place-items-center" style={{ background: `conic-gradient(${goal.color || "#6366F1"} ${progress * 3.6}deg, var(--surface-subtle) 0deg)` }}><div className="size-24 rounded-full bg-(--surface) grid place-items-center text-center"><div><p className="font-display text-2xl font-bold">{progress.toFixed(0)}%</p><p className="text-[10px] text-(--text-tertiary)">COMPLETE</p></div></div></div>
        <div className="flex-1">
          <div className="flex flex-wrap gap-2"><span className={`text-[10px] uppercase border rounded-full px-2.5 py-1 ${tone(goal.status)}`}>{goal.status}</span>{goal.on_track && <span className={`text-[10px] uppercase border rounded-full px-2.5 py-1 ${tone(goal.on_track)}`}>{goal.on_track.replaceAll("_", " ")}</span>}</div>
          <div className="grid sm:grid-cols-3 gap-4 mt-5"><div><p className="text-xs text-(--text-secondary)">Current</p><p className="font-display font-semibold text-xl mt-1">{money(goal.current_amount, goal.currency)}</p></div><div><p className="text-xs text-(--text-secondary)">Target</p><p className="font-display font-semibold text-xl mt-1">{money(goal.target_amount, goal.currency)}</p></div><div><p className="text-xs text-(--text-secondary)">Remaining</p><p className="font-display font-semibold text-xl mt-1">{money(remaining, goal.currency)}</p></div></div>
          <div className="h-2.5 rounded-full bg-(--surface-subtle) overflow-hidden mt-5"><div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: goal.color || "#6366F1" }} /></div>
        </div>
      </div>
    </section>

    <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
      <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Target date</p><p className="font-semibold mt-2">{goal.target_date || "No deadline"}</p></div>
      <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Monthly pace</p><p className="font-semibold mt-2">{goal.monthly_contribution == null ? "Not required" : money(goal.monthly_contribution, goal.currency)}</p></div>
      <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Tracking</p><p className="font-semibold mt-2 capitalize">{goal.tracking_type.replaceAll("_", " ")}</p></div>
      <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Updated</p><p className="font-semibold mt-2">{new Date(goal.updated_at).toLocaleDateString("en-IN")}</p></div>
    </section>

    {goal.tracking_type === "manual" && <form onSubmit={saveManual} className="premium-card p-5 sm:p-6"><h2 className="font-display font-semibold text-xl">Manual progress</h2><p className="text-sm text-(--text-secondary) mt-2">Set the total currently saved. Linked goals update from their account, asset or net worth automatically.</p><div className="flex flex-col sm:flex-row gap-3 mt-5"><label className="flex-1 text-sm">Total saved in {goal.currency}<input type="number" min="0" step="0.01" value={savedAmount} onChange={(event) => setSavedAmount(event.target.value)} className="block w-full mt-2 min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" placeholder={String(num(goal.current_amount))} /></label><button disabled={busy || !savedAmount} className="self-end min-h-11 px-5 rounded-xl bg-accent text-white disabled:opacity-40">{busy ? "Saving…" : "Update progress"}</button></div></form>}

    <section className="premium-card p-5 sm:p-6"><h2 className="font-display font-semibold text-xl">Goal state</h2><div className="flex flex-wrap gap-2 mt-4">{goal.status === "active" && <button disabled={busy} onClick={() => void patch({ status: "paused" }, "Goal paused.")} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2 text-sm"><Pause className="size-4" />Pause</button>}{goal.status === "paused" && <button disabled={busy} onClick={() => void patch({ status: "active" }, "Goal resumed.")} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2 text-sm"><Play className="size-4" />Resume</button>}{goal.status !== "completed" && <button disabled={busy} onClick={() => void patch({ status: "completed" }, "Goal completed.")} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2 text-sm"><CheckCircle2 className="size-4" />Complete</button>}{goal.status !== "archived" ? <button disabled={busy} onClick={() => void patch({ status: "archived" }, "Goal archived.")} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2 text-sm"><Archive className="size-4" />Archive</button> : <button disabled={busy} onClick={() => void patch({ status: "active" }, "Goal restored.")} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2 text-sm"><ArchiveRestore className="size-4" />Restore</button>}</div></section>
  </div>;
}
