"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  CheckCircle2,
  Pause,
  Pencil,
  Play,
  Plus,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type GoalStatus = "active" | "completed" | "paused" | "archived";
type TrackingType = "manual" | "account" | "asset" | "asset_group" | "net_worth";
type Goal = {
  id: string;
  name: string;
  target_amount: number | string;
  current_amount: number | string;
  currency: string;
  target_amount_primary?: number | string | null;
  current_amount_primary?: number | string | null;
  target_date?: string | null;
  tracking_type: TrackingType;
  account_id?: string | null;
  asset_id?: string | null;
  asset_group_id?: string | null;
  status: GoalStatus;
  icon?: string | null;
  color?: string | null;
  percentage: number;
  monthly_contribution?: number | null;
  on_track?: string | null;
  account_name?: string | null;
  asset_name?: string | null;
  asset_group_name?: string | null;
};
type ResourceOption = { id: string; name: string };
type Currency = { code: string; symbol: string; name: string; flag: string };
type GoalDraft = {
  name: string;
  target_amount: string;
  current_amount: string;
  currency: string;
  target_date: string;
  tracking_type: TrackingType;
  linked_id: string;
  icon: string;
  color: string;
};

const emptyDraft = (): GoalDraft => ({
  name: "",
  target_amount: "",
  current_amount: "0",
  currency: "INR",
  target_date: "",
  tracking_type: "manual",
  linked_id: "",
  icon: "target",
  color: "#6366F1",
});

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["items", "data", "accounts", "assets", "groups"]) if (Array.isArray(record[key])) return record[key] as T[];
  }
  return [];
}

function amount(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: number | string | null | undefined, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: currency || "INR", maximumFractionDigits: 0 }).format(amount(value));
  } catch {
    return `${currency} ${amount(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
  }
}

function trackingLabel(goal: Goal) {
  if (goal.tracking_type === "account") return goal.account_name || "Linked account";
  if (goal.tracking_type === "asset") return goal.asset_name || "Linked asset";
  if (goal.tracking_type === "asset_group") return goal.asset_group_name || "Linked asset group";
  if (goal.tracking_type === "net_worth") return "Whole net worth";
  return "Manual progress";
}

function tone(status: string | null | undefined) {
  if (status === "ahead" || status === "achieved" || status === "completed") return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
  if (status === "behind" || status === "overdue") return "text-amber-500 border-amber-500/20 bg-amber-500/5";
  if (status === "paused") return "text-amber-500 border-amber-500/20 bg-amber-500/5";
  if (status === "archived") return "text-(--text-tertiary) border-(--border) bg-(--surface-subtle)";
  return "text-accent border-accent/20 bg-accent/5";
}

export default function GoalsPage() {
  const [statusFilter, setStatusFilter] = useState<GoalStatus | "">("active");
  const [query, setQuery] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [draft, setDraft] = useState<GoalDraft>(emptyDraft());
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const goalsLoader = useCallback(async () => {
    const suffix = statusFilter ? `?status=${statusFilter}` : "";
    return asArray<Goal>(await engineApi.get(`/goals${suffix}`));
  }, [statusFilter]);
  const goals = useResource(goalsLoader);
  const accounts = useResource(useCallback(async () => asArray<ResourceOption>(await engineApi.get("/accounts")), []));
  const assets = useResource(useCallback(async () => asArray<ResourceOption>(await engineApi.get("/assets")), []));
  const assetGroups = useResource(useCallback(async () => asArray<ResourceOption>(await engineApi.get("/asset-groups")), []));
  const currencies = useResource(useCallback(async () => asArray<Currency>(await engineApi.get("/currencies")), []));

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (goals.data ?? []).filter((goal) => !needle || `${goal.name} ${trackingLabel(goal)}`.toLowerCase().includes(needle));
  }, [goals.data, query]);

  const stats = useMemo(() => {
    const rows = goals.data ?? [];
    const target = rows.reduce((sum, goal) => sum + amount(goal.target_amount_primary ?? goal.target_amount), 0);
    const current = rows.reduce((sum, goal) => sum + amount(goal.current_amount_primary ?? goal.current_amount), 0);
    const needsAttention = rows.filter((goal) => goal.on_track === "behind" || goal.on_track === "overdue").length;
    const achieved = rows.filter((goal) => goal.on_track === "achieved" || goal.status === "completed").length;
    return { target, current, needsAttention, achieved };
  }, [goals.data]);

  const linkedOptions = useMemo(() => {
    if (draft.tracking_type === "account") return accounts.data ?? [];
    if (draft.tracking_type === "asset") return assets.data ?? [];
    if (draft.tracking_type === "asset_group") return assetGroups.data ?? [];
    return [];
  }, [accounts.data, assetGroups.data, assets.data, draft.tracking_type]);

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft());
    setMutationError(null);
    setEditorOpen(true);
  };

  const startEdit = (goal: Goal) => {
    const linkedId = goal.tracking_type === "account" ? goal.account_id : goal.tracking_type === "asset" ? goal.asset_id : goal.tracking_type === "asset_group" ? goal.asset_group_id : "";
    setEditing(goal);
    setDraft({
      name: goal.name,
      target_amount: String(amount(goal.target_amount)),
      current_amount: String(amount(goal.current_amount)),
      currency: goal.currency,
      target_date: goal.target_date ?? "",
      tracking_type: goal.tracking_type,
      linked_id: linkedId ?? "",
      icon: goal.icon ?? "target",
      color: goal.color ?? "#6366F1",
    });
    setMutationError(null);
    setEditorOpen(true);
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const target = Number(draft.target_amount);
    const current = Number(draft.current_amount || 0);
    if (!draft.name.trim() || !Number.isFinite(target) || target <= 0) {
      setMutationError("Enter a goal name and positive target amount.");
      return;
    }
    if (["account", "asset", "asset_group"].includes(draft.tracking_type) && !draft.linked_id) {
      setMutationError("Choose the resource this goal should track.");
      return;
    }
    setBusy("save");
    setMutationError(null);
    setMessage(null);
    const payload = {
      name: draft.name.trim(),
      target_amount: target,
      current_amount: draft.tracking_type === "manual" ? Math.max(0, current) : undefined,
      currency: draft.currency,
      target_date: draft.target_date || null,
      tracking_type: draft.tracking_type,
      account_id: draft.tracking_type === "account" ? draft.linked_id : null,
      asset_id: draft.tracking_type === "asset" ? draft.linked_id : null,
      asset_group_id: draft.tracking_type === "asset_group" ? draft.linked_id : null,
      icon: draft.icon.trim() || "target",
      color: draft.color,
    };
    try {
      if (editing) {
        await engineApi.patch(`/goals/${editing.id}`, payload);
        setMessage("Goal updated.");
      } else {
        await engineApi.post("/goals", payload);
        setMessage("Goal created.");
      }
      setEditorOpen(false);
      setEditing(null);
      goals.reload();
    } catch (caught) {
      setMutationError(caught instanceof Error ? caught.message : "Goal could not be saved.");
    } finally {
      setBusy(null);
    }
  };

  const changeStatus = async (goal: Goal, status: GoalStatus) => {
    setBusy(`status-${goal.id}`);
    setMutationError(null);
    try {
      await engineApi.patch(`/goals/${goal.id}`, { status });
      setMessage(`Goal ${status}.`);
      goals.reload();
    } catch (caught) {
      setMutationError(caught instanceof Error ? caught.message : "Goal status could not be changed.");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (goal: Goal) => {
    if (!window.confirm(`Delete “${goal.name}” permanently?`)) return;
    setBusy(`delete-${goal.id}`);
    setMutationError(null);
    try {
      await engineApi.delete(`/goals/${goal.id}`);
      setMessage("Goal deleted.");
      goals.reload();
    } catch (caught) {
      setMutationError(caught instanceof Error ? caught.message : "Goal could not be deleted.");
    } finally {
      setBusy(null);
    }
  };

  const primaryCurrency = goals.data?.[0]?.currency || "INR";

  return (
    <div className="flex flex-col gap-6 max-w-7xl pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-accent">Build ahead</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Dream milestones</h1>
          <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Track goals manually or link them directly to an account, investment, asset wallet or your total net worth. FinCopilot calculates progress and pace from the finance engine.</p>
        </div>
        <button onClick={startCreate} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2"><Plus className="size-4" />New goal</button>
      </header>

      {message && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-500">{message}</p>}
      {mutationError && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">{mutationError}</p>}

      <section className="premium-card p-4 sm:p-5 flex flex-wrap items-center gap-2">
        {(["active", "completed", "paused", "archived", ""] as const).map((status) => (
          <button key={status || "all"} onClick={() => setStatusFilter(status)} className={`min-h-9 px-3 rounded-lg text-xs border transition ${statusFilter === status ? "bg-accent text-white border-accent" : "border-(--border) text-(--text-secondary) hover:text-(--text-primary)"}`}>
            {status ? status[0].toUpperCase() + status.slice(1) : "All"}
          </button>
        ))}
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search goals…" className="min-h-10 flex-1 min-w-52 rounded-xl border border-(--border) bg-(--surface) px-3 sm:ml-auto" />
      </section>

      <ResourceState loading={goals.loading} error={goals.error} retry={goals.reload} />

      {goals.data && (
        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="premium-card p-5"><Target className="size-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{goals.data.length}</p><p className="text-xs text-(--text-secondary) mt-1">Goals in this view</p></div>
          <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Progress value</p><p className="font-display text-2xl font-semibold mt-3">{money(stats.current, primaryCurrency)}</p><p className="text-[11px] text-(--text-tertiary) mt-1">toward {money(stats.target, primaryCurrency)}</p></div>
          <div className="premium-card p-5"><CheckCircle2 className="size-5 text-emerald-500"/><p className="font-display text-3xl font-semibold mt-3">{stats.achieved}</p><p className="text-xs text-(--text-secondary) mt-1">Achieved / completed</p></div>
          <div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Needs attention</p><p className="font-display text-3xl font-semibold mt-3">{stats.needsAttention}</p><p className="text-[11px] text-(--text-tertiary) mt-1">Behind pace or overdue</p></div>
        </section>
      )}

      {editorOpen && (
        <form onSubmit={save} className="premium-card p-5 sm:p-6">
          <div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-accent">{editing ? "Edit milestone" : "Create milestone"}</p><h2 className="font-display text-xl font-semibold mt-1">{editing?.name || "A goal tied to real money"}</h2></div><button type="button" onClick={()=>setEditorOpen(false)} className="grid size-10 place-items-center rounded-xl border border-(--border)"><X className="size-4"/></button></div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">
            <label className="text-sm">Name<input required value={draft.name} onChange={(event)=>setDraft((current)=>({...current,name:event.target.value}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2" placeholder="Emergency fund" /></label>
            <label className="text-sm">Target amount<input type="number" min="0.01" step="0.01" required value={draft.target_amount} onChange={(event)=>setDraft((current)=>({...current,target_amount:event.target.value}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2" /></label>
            <label className="text-sm">Currency<select value={draft.currency} onChange={(event)=>setDraft((current)=>({...current,currency:event.target.value}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2">{(currencies.data?.length ? currencies.data : [{code:"INR",symbol:"₹",name:"Indian Rupee",flag:"🇮🇳"}]).map((item)=><option key={item.code} value={item.code}>{item.flag} {item.code} · {item.name}</option>)}</select></label>
            <label className="text-sm">Target date<input type="date" value={draft.target_date} onChange={(event)=>setDraft((current)=>({...current,target_date:event.target.value}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2" /></label>
            <label className="text-sm">Tracking<select value={draft.tracking_type} onChange={(event)=>setDraft((current)=>({...current,tracking_type:event.target.value as TrackingType,linked_id:""}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2"><option value="manual">Manual progress</option><option value="account">Account balance</option><option value="asset">Single asset</option><option value="asset_group">Asset group / wallet</option><option value="net_worth">Whole net worth</option></select></label>
            {draft.tracking_type === "manual" ? <label className="text-sm">Current saved amount<input type="number" min="0" step="0.01" value={draft.current_amount} onChange={(event)=>setDraft((current)=>({...current,current_amount:event.target.value}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2" /></label> : ["account","asset","asset_group"].includes(draft.tracking_type) ? <label className="text-sm">Linked resource<select required value={draft.linked_id} onChange={(event)=>setDraft((current)=>({...current,linked_id:event.target.value}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2"><option value="">Choose resource</option>{linkedOptions.map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label> : <div className="rounded-xl border border-(--border) bg-(--surface-subtle) p-3 mt-7 text-xs text-(--text-secondary)">Progress follows your total net worth automatically.</div>}
            <label className="text-sm">Icon key<input value={draft.icon} onChange={(event)=>setDraft((current)=>({...current,icon:event.target.value}))} className="block w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 mt-2" placeholder="target" /></label>
            <label className="text-sm">Accent colour<div className="flex gap-2 mt-2"><input type="color" value={draft.color} onChange={(event)=>setDraft((current)=>({...current,color:event.target.value}))} className="size-11 rounded-xl border border-(--border) bg-(--surface) p-1"/><input value={draft.color} onChange={(event)=>setDraft((current)=>({...current,color:event.target.value}))} className="min-h-11 flex-1 rounded-xl border border-(--border) bg-(--surface) px-3" /></div></label>
          </div>
          <button disabled={busy === "save"} className="mt-5 min-h-11 px-5 rounded-xl bg-accent text-white disabled:opacity-50">{busy === "save" ? "Saving…" : editing ? "Save changes" : "Create goal"}</button>
        </form>
      )}

      {goals.data && (
        <section className="grid lg:grid-cols-2 gap-4">
          {filtered.length === 0 && <div className="premium-card p-10 lg:col-span-2 text-center"><Target className="size-8 text-accent mx-auto"/><h2 className="font-display text-xl font-semibold mt-4">No goals in this view</h2><p className="text-sm text-(--text-secondary) mt-2">Change the status filter or create a new milestone.</p></div>}
          {filtered.map((goal) => {
            const pct = Math.max(0, Math.min(100, Number(goal.percentage || 0)));
            return <article key={goal.id} className="premium-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4"><div className="flex items-center gap-3 min-w-0"><span className="grid size-11 place-items-center rounded-xl text-white font-bold shrink-0" style={{backgroundColor:goal.color || "#6366F1"}}>{goal.name.slice(0,1).toUpperCase()}</span><div className="min-w-0"><h2 className="font-display font-semibold text-lg truncate">{goal.name}</h2><p className="text-xs text-(--text-secondary) mt-1">{trackingLabel(goal)}</p></div></div><button onClick={()=>startEdit(goal)} className="grid size-9 place-items-center rounded-lg border border-(--border)" aria-label="Edit goal"><Pencil className="size-3.5"/></button></div>
              <div className="flex flex-wrap gap-2 mt-4"><span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-1 ${tone(goal.status)}`}>{goal.status}</span>{goal.on_track && <span className={`text-[10px] uppercase tracking-wider border rounded-full px-2 py-1 ${tone(goal.on_track)}`}>{goal.on_track.replaceAll("_"," ")}</span>}</div>
              <div className="mt-5"><div className="flex justify-between gap-3 text-sm"><span className="font-semibold">{money(goal.current_amount,goal.currency)}</span><span className="text-(--text-secondary)">of {money(goal.target_amount,goal.currency)}</span></div><div className="h-2.5 rounded-full bg-(--surface-subtle) overflow-hidden mt-2"><div className="h-full rounded-full bg-accent" style={{width:`${pct}%`}}/></div><div className="flex justify-between gap-3 text-xs text-(--text-secondary) mt-2"><span>{Number(goal.percentage || 0).toFixed(0)}% complete</span><span>{goal.target_date || "No deadline"}</span></div></div>
              {(goal.monthly_contribution !== null && goal.monthly_contribution !== undefined) && <div className="rounded-xl bg-(--surface-subtle) p-3 mt-4"><p className="text-xs text-(--text-secondary)">Suggested monthly contribution</p><p className="font-semibold mt-1">{money(goal.monthly_contribution,goal.currency)}</p></div>}
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-(--border)">{goal.status === "active" && <button disabled={busy === `status-${goal.id}`} onClick={()=>void changeStatus(goal,"paused")} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1.5"><Pause className="size-3.5"/>Pause</button>}{goal.status === "paused" && <button disabled={busy === `status-${goal.id}`} onClick={()=>void changeStatus(goal,"active")} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1.5"><Play className="size-3.5"/>Resume</button>}{goal.status !== "completed" && <button disabled={busy === `status-${goal.id}`} onClick={()=>void changeStatus(goal,"completed")} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1.5"><CheckCircle2 className="size-3.5"/>Complete</button>}{goal.status !== "archived" ? <button disabled={busy === `status-${goal.id}`} onClick={()=>void changeStatus(goal,"archived")} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1.5"><Archive className="size-3.5"/>Archive</button> : <button disabled={busy === `status-${goal.id}`} onClick={()=>void changeStatus(goal,"active")} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1.5"><ArchiveRestore className="size-3.5"/>Restore</button>}<button disabled={busy === `delete-${goal.id}`} onClick={()=>void remove(goal)} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs text-red-500 flex items-center gap-1.5 ml-auto"><Trash2 className="size-3.5"/>Delete</button></div>
            </article>;
          })}
        </section>
      )}
    </div>
  );
}
