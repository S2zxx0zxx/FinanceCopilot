"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  Pencil,
  Plus,
  RefreshCw,
  Scale,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatPaise } from "@/lib/format";
import { api, ApiError } from "@/lib/api";
import { engineApi } from "@/lib/engine-api";
import { amount, label, object, rows } from "@/lib/response";

type DetectedSeries = {
  series_id: string;
  merchant_name: string;
  category: string;
  direction: "credit" | "debit";
  status: string;
  frequency: string;
  amount_paise: number | null;
  monthly: number | null;
  next_date: string;
  occurrences_count: number | null;
  confidence: number | null;
  evidence_state: string;
};

type ScheduledItem = {
  id: string;
  account_id: string | null;
  category_id: string | null;
  description: string;
  amount: number | string;
  currency: string;
  type: "credit" | "debit" | string;
  frequency: string;
  weekend_adjustment: "none" | "previous_friday" | "next_monday" | string;
  day_of_month: number | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  auto_generate: boolean;
  next_occurrence: string;
  amount_primary?: number | null;
  fx_rate_used?: number | null;
};

type AccountOption = { id: string; name?: string; display_name?: string | null; currency?: string | null };
type CategoryOption = { id: string; name: string };

type Draft = {
  description: string;
  amount: string;
  currency: string;
  type: "debit" | "credit";
  frequency: string;
  weekend_adjustment: "none" | "previous_friday" | "next_monday";
  day_of_month: string;
  start_date: string;
  end_date: string;
  account_id: string;
  category_id: string;
  auto_generate: boolean;
  is_active: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);
const emptyDraft = (): Draft => ({
  description: "",
  amount: "",
  currency: "INR",
  type: "debit",
  frequency: "monthly",
  weekend_adjustment: "none",
  day_of_month: "",
  start_date: today(),
  end_date: "",
  account_id: "",
  category_id: "",
  auto_generate: true,
  is_active: true,
});

const frequencyOptions = ["weekly", "biweekly", "monthly", "quarterly", "semiannual", "yearly"];

function asArray<T>(payload: unknown, keys: string[] = []): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (!payload || typeof payload !== "object") return [];
  const source = payload as Record<string, unknown>;
  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key] as T[];
  }
  return [];
}

function money(value: number | string, currency = "INR") {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(numeric);
  } catch {
    return `${currency} ${numeric.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  }
}

function monthlyEquivalent(item: ScheduledItem) {
  const value = Number(item.amount);
  if (!Number.isFinite(value)) return 0;
  const multiplier: Record<string, number> = {
    weekly: 52 / 12,
    biweekly: 26 / 12,
    monthly: 1,
    quarterly: 1 / 3,
    semiannual: 1 / 6,
    yearly: 1 / 12,
  };
  return value * (multiplier[item.frequency] ?? 1);
}

async function loadDetected(): Promise<DetectedSeries[]> {
  const payload = object(await api.getRecurring());
  return rows(payload.recurring).map((row) => ({
    series_id: label(row.series_id),
    merchant_name: label(row.series_name),
    category: label(row.series_type),
    direction: row.is_income === true ? "credit" : "debit",
    status: label(row.status),
    frequency: label(row.frequency),
    amount_paise: amount(row.typical_amount_paise),
    monthly: amount(row.monthly_equivalent_paise),
    next_date: label(row.next_expected_at, ""),
    occurrences_count: amount(row.observation_count),
    confidence: row.confidence === null || row.confidence === undefined ? null : Number(row.confidence),
    evidence_state: label(row.evidence_state),
  }));
}

export default function RecurringPage() {
  const { userId } = useAuth();
  const { toast } = useToast();
  const owner = React.useRef(userId);
  owner.current = userId;

  const [tab, setTab] = React.useState<"schedules" | "patterns">("schedules");
  const [patterns, setPatterns] = React.useState<DetectedSeries[]>([]);
  const [schedules, setSchedules] = React.useState<ScheduledItem[]>([]);
  const [accounts, setAccounts] = React.useState<AccountOption[]>([]);
  const [categories, setCategories] = React.useState<CategoryOption[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [patternLoading, setPatternLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [patternError, setPatternError] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("all");
  const [pending, setPending] = React.useState<string | null>(null);
  const [detecting, setDetecting] = React.useState(false);
  const [generating, setGenerating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<ScheduledItem | null>(null);
  const [draft, setDraft] = React.useState<Draft>(emptyDraft);

  const reloadSchedules = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [scheduledPayload, accountsPayload, categoriesPayload] = await Promise.all([
        engineApi.get<unknown>("/recurring-transactions"),
        engineApi.get<unknown>("/accounts"),
        engineApi.get<unknown>("/categories"),
      ]);
      const nextSchedules = asArray<ScheduledItem>(scheduledPayload, ["items", "recurring_transactions", "recurring"]);
      const nextAccounts = asArray<AccountOption>(accountsPayload, ["items", "accounts"]);
      const nextCategories = asArray<CategoryOption>(categoriesPayload, ["items", "categories"]);
      setSchedules(nextSchedules);
      setAccounts(nextAccounts);
      setCategories(nextCategories);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load scheduled transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reloadPatterns = React.useCallback(async () => {
    setPatternLoading(true);
    setPatternError(null);
    try {
      setPatterns(await loadDetected());
    } catch (cause) {
      setPatternError(cause instanceof Error ? cause.message : "Could not load detected patterns.");
    } finally {
      setPatternLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (!userId) return;
    setPending(null);
    setDetecting(false);
    void reloadSchedules();
    void reloadPatterns();
  }, [userId, reloadSchedules, reloadPatterns]);

  const activeSchedules = schedules.filter((item) => item.is_active);
  const debitSchedules = activeSchedules.filter((item) => item.type === "debit");
  const creditSchedules = activeSchedules.filter((item) => item.type === "credit");
  const estimatedOut = debitSchedules.reduce((sum, item) => sum + monthlyEquivalent(item), 0);
  const estimatedIn = creditSchedules.reduce((sum, item) => sum + monthlyEquivalent(item), 0);
  const primaryCurrency = activeSchedules[0]?.currency || "INR";

  const activePatterns = patterns.filter((series) => ["active", "confirmed"].includes(series.status));
  const patternDebits = activePatterns.filter((series) => series.direction === "debit");
  const patternCredits = activePatterns.filter((series) => series.direction === "credit");
  const detectedOut = patternDebits.reduce((sum, series) => sum + (series.monthly ?? 0), 0);
  const detectedIn = patternCredits.reduce((sum, series) => sum + (series.monthly ?? 0), 0);

  const openCreate = () => {
    const next = emptyDraft();
    next.account_id = accounts[0]?.id ?? "";
    next.currency = accounts[0]?.currency || "INR";
    setEditing(null);
    setDraft(next);
    setDialogOpen(true);
  };

  const openEdit = (item: ScheduledItem) => {
    setEditing(item);
    setDraft({
      description: item.description,
      amount: String(item.amount),
      currency: item.currency,
      type: item.type === "credit" ? "credit" : "debit",
      frequency: item.frequency,
      weekend_adjustment:
        item.weekend_adjustment === "previous_friday" || item.weekend_adjustment === "next_monday"
          ? item.weekend_adjustment
          : "none",
      day_of_month: item.day_of_month ? String(item.day_of_month) : "",
      start_date: item.start_date,
      end_date: item.end_date ?? "",
      account_id: item.account_id ?? "",
      category_id: item.category_id ?? "",
      auto_generate: item.auto_generate,
      is_active: item.is_active,
    });
    setDialogOpen(true);
  };

  const saveSchedule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.description.trim() || !draft.amount || !draft.account_id) {
      toast({ title: "Missing details", description: "Description, amount and account are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        description: draft.description.trim(),
        amount: Number(draft.amount),
        currency: draft.currency.trim().toUpperCase() || "INR",
        type: draft.type,
        frequency: draft.frequency,
        weekend_adjustment: draft.weekend_adjustment,
        day_of_month: draft.day_of_month ? Number(draft.day_of_month) : null,
        start_date: draft.start_date,
        end_date: draft.end_date || null,
        account_id: draft.account_id,
        category_id: draft.category_id || null,
        auto_generate: draft.auto_generate,
      };
      if (editing) {
        await engineApi.patch(`/recurring-transactions/${editing.id}`, { ...payload, is_active: draft.is_active });
      } else {
        await engineApi.post("/recurring-transactions", payload);
      }
      setDialogOpen(false);
      setEditing(null);
      toast({ title: editing ? "Schedule updated" : "Schedule created", description: "Bills & rhythms is now using the full recurring schedule model." });
      await reloadSchedules();
    } catch (cause) {
      toast({ title: "Could not save schedule", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const removeSchedule = async (item: ScheduledItem) => {
    if (!window.confirm(`Delete ${item.description}?`)) return;
    setPending(item.id);
    try {
      await engineApi.delete(`/recurring-transactions/${item.id}`);
      toast({ title: "Schedule deleted" });
      await reloadSchedules();
    } catch (cause) {
      toast({ title: "Could not delete schedule", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    } finally {
      setPending(null);
    }
  };

  const generatePending = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const result = await engineApi.post<{ generated?: number }>("/recurring-transactions/generate");
      toast({ title: "Pending occurrences generated", description: `${result.generated ?? 0} transaction${result.generated === 1 ? "" : "s"} created.` });
      await reloadSchedules();
    } catch (cause) {
      toast({ title: "Generation failed", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    } finally {
      setGenerating(false);
    }
  };

  const detectPatterns = async () => {
    if (!userId || detecting) return;
    const requestOwner = userId;
    setDetecting(true);
    try {
      await api.detectRecurring();
      if (owner.current !== requestOwner) return;
      await reloadPatterns();
      toast({ title: "Detection complete", description: "Recurring patterns were refreshed from your transaction history." });
    } catch (cause) {
      if (owner.current !== requestOwner) return;
      const message = cause instanceof ApiError || cause instanceof Error ? cause.message : "Could not run detection.";
      toast({ title: "Detection failed", description: message, variant: "destructive" });
    } finally {
      if (owner.current === requestOwner) setDetecting(false);
    }
  };

  const updatePattern = async (id: string, action: "confirm" | "dismiss" | "pause" | "resume") => {
    if (!userId || pending) return;
    const requestOwner = userId;
    setPending(id);
    try {
      await api.updateRecurring(id, action);
      if (owner.current !== requestOwner) return;
      await reloadPatterns();
      toast({ title: "Pattern updated", description: "Your recurring tracking preference has been saved." });
    } catch (cause) {
      if (owner.current === requestOwner) {
        toast({ title: "Could not update pattern", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
      }
    } finally {
      if (owner.current === requestOwner) setPending(null);
    }
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-(--text-tertiary)">Money automation</p>
          <h1 className="mt-1 font-display text-[28px] font-bold tracking-[-0.02em]">Bills & rhythms</h1>
          <p className="mt-1 max-w-2xl text-[14px] text-(--text-secondary)">
            Create real recurring schedules, generate due transactions, and review patterns FinCopilot detects from your history.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => void generatePending()} disabled={generating} className="min-h-11 rounded-xl border border-(--border) px-3 text-xs font-semibold hover:bg-(--surface-subtle) disabled:opacity-50">
            <RefreshCw className={`mr-2 inline h-4 w-4 ${generating ? "animate-spin" : ""}`} />
            {generating ? "Generating..." : "Generate due"}
          </button>
          <button onClick={openCreate} className="min-h-11 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground shadow-sm hover:bg-[var(--accent-hover)]">
            <Plus className="mr-2 inline h-4 w-4" />Add schedule
          </button>
        </div>
      </motion.header>

      <div className="inline-flex w-fit rounded-xl border border-(--border) bg-(--surface) p-1">
        <button onClick={() => setTab("schedules")} className={`min-h-10 rounded-lg px-4 text-xs font-semibold transition-colors ${tab === "schedules" ? "bg-accent text-accent-foreground" : "text-(--text-secondary) hover:bg-(--surface-subtle)"}`}>
          Scheduled transactions
        </button>
        <button onClick={() => setTab("patterns")} className={`min-h-10 rounded-lg px-4 text-xs font-semibold transition-colors ${tab === "patterns" ? "bg-accent text-accent-foreground" : "text-(--text-secondary) hover:bg-(--surface-subtle)"}`}>
          Detected patterns
        </button>
      </div>

      {tab === "schedules" ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Summary icon={<ArrowDownLeft className="h-4 w-4 text-(--negative)" />} label="Estimated monthly outflow" value={`−${money(estimatedOut, primaryCurrency)}`} detail={`${debitSchedules.length} active debit schedules`} />
            <Summary icon={<ArrowUpRight className="h-4 w-4 text-(--positive)" />} label="Estimated monthly inflow" value={`+${money(estimatedIn, primaryCurrency)}`} detail={`${creditSchedules.length} active credit schedules`} />
            <Summary icon={<Scale className="h-4 w-4 text-accent" />} label="Net scheduled flow" value={money(estimatedIn - estimatedOut, primaryCurrency)} detail={`${activeSchedules.length} active schedules`} />
          </div>

          <section className="premium-card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-(--border) p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold">Recurring schedules</h2>
                <p className="mt-1 text-xs text-(--text-tertiary)">Weekly through yearly schedules, weekend adjustments, category mapping and automatic occurrence generation.</p>
              </div>
              <span className="text-xs font-mono text-(--text-tertiary)">{schedules.length} total</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-sm text-(--text-secondary)">Loading schedules…</div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-sm text-(--negative)">{error}</p>
                <button onClick={() => void reloadSchedules()} className="mt-3 rounded-lg border border-(--border) px-3 py-2 text-xs font-semibold">Retry</button>
              </div>
            ) : schedules.length === 0 ? (
              <div className="p-10 text-center">
                <CalendarClock className="mx-auto h-8 w-8 text-(--text-tertiary)" />
                <h3 className="mt-3 font-semibold">No recurring schedules yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-(--text-secondary)">Add rent, subscriptions, salary, EMIs or any repeating cash movement. FinCopilot can generate each occurrence when it becomes due.</p>
                <button onClick={openCreate} className="mt-4 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground">Create first schedule</button>
              </div>
            ) : (
              <div className="divide-y divide-(--border)">
                {schedules.map((item) => (
                  <div key={item.id} className="flex flex-col gap-4 p-4 transition-colors hover:bg-(--surface-subtle) sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate text-sm font-semibold">{item.description}</h3>
                        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${item.is_active ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : "border-(--border) text-(--text-tertiary)"}`}>{item.is_active ? "Active" : "Paused"}</span>
                        <span className="rounded-full bg-(--surface-subtle) px-2 py-0.5 text-[10px] font-medium capitalize text-(--text-secondary)">{item.frequency}</span>
                        {!item.auto_generate && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">Track only</span>}
                      </div>
                      <p className="mt-1 text-xs text-(--text-tertiary)">
                        Next {item.next_occurrence ? formatDate(item.next_occurrence) : "occurrence unavailable"}
                        {item.day_of_month ? ` · day ${item.day_of_month}` : ""}
                        {item.weekend_adjustment !== "none" ? ` · ${item.weekend_adjustment.replaceAll("_", " ")}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="text-right">
                        <p className={`text-base font-semibold tabular-nums ${item.type === "credit" ? "text-(--positive)" : ""}`}>{item.type === "credit" ? "+" : "−"}{money(item.amount, item.currency)}</p>
                        {item.amount_primary != null && item.currency !== primaryCurrency && <p className="text-[10px] text-(--text-tertiary)">≈ {money(item.amount_primary, primaryCurrency)}</p>}
                      </div>
                      <button onClick={() => openEdit(item)} className="grid h-10 w-10 place-items-center rounded-xl border border-(--border) hover:bg-(--surface-subtle)" aria-label={`Edit ${item.description}`}><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => void removeSchedule(item)} disabled={pending === item.id} className="grid h-10 w-10 place-items-center rounded-xl border border-(--border) text-(--negative) hover:bg-(--negative-light) disabled:opacity-50" aria-label={`Delete ${item.description}`}><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Summary icon={<ArrowDownLeft className="h-4 w-4 text-(--negative)" />} label="Detected monthly outflow" value={`−${formatPaise(detectedOut)}`} detail={`${patternDebits.length} active debit patterns`} />
            <Summary icon={<ArrowUpRight className="h-4 w-4 text-(--positive)" />} label="Detected monthly inflow" value={`+${formatPaise(detectedIn)}`} detail={`${patternCredits.length} active credit patterns`} />
            <Summary icon={<Scale className="h-4 w-4 text-accent" />} label="Net detected flow" value={formatPaise(detectedIn - detectedOut)} detail={`${activePatterns.length} active patterns`} />
          </div>

          <section className="premium-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-(--text-secondary)">Detected patterns are estimates inferred from transaction history. Confirming or pausing a pattern changes tracking only; it never moves money at your bank.</p>
              <div className="flex gap-2">
                <select aria-label="Filter recurring status" value={filter} onChange={(event) => setFilter(event.target.value)} className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 text-xs">
                  <option value="all">All statuses</option>
                  {Array.from(new Set(patterns.map((series) => series.status))).filter(Boolean).map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
                <button onClick={() => void detectPatterns()} disabled={detecting} className="min-h-11 shrink-0 rounded-xl bg-accent px-3 text-xs font-semibold text-accent-foreground disabled:opacity-50"><Sparkles className="mr-2 inline h-4 w-4" />{detecting ? "Detecting…" : "Detect new"}</button>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            {patternLoading ? (
              <div className="premium-card p-8 text-center text-sm text-(--text-secondary)">Loading detected patterns…</div>
            ) : patternError ? (
              <div className="premium-card p-8 text-center"><p className="text-sm text-(--negative)">{patternError}</p><button onClick={() => void reloadPatterns()} className="mt-3 rounded-lg border border-(--border) px-3 py-2 text-xs font-semibold">Retry</button></div>
            ) : patterns.length === 0 ? (
              <div className="premium-card p-10 text-center"><Sparkles className="mx-auto h-8 w-8 text-(--text-tertiary)" /><h3 className="mt-3 font-semibold">No recurring patterns detected yet</h3><p className="mt-2 text-sm text-(--text-secondary)">Import enough statement history, then run detection to find repeating bills and income.</p></div>
            ) : patterns.filter((series) => filter === "all" || series.status === filter).map((series) => (
              <motion.div key={series.series_id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="premium-card p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate text-sm font-semibold">{series.merchant_name}</h3>
                      <span className="rounded-full bg-(--surface-subtle) px-2 py-0.5 text-[10px] font-medium capitalize text-(--text-secondary)">{series.status}</span>
                      {series.evidence_state && <span className="rounded-full border border-(--border) px-2 py-0.5 text-[10px] text-(--text-tertiary)">{series.evidence_state}</span>}
                    </div>
                    <p className="mt-1 text-xs text-(--text-tertiary)">{series.next_date ? `Next ${formatDate(series.next_date)}` : "Next date unavailable"} · {series.occurrences_count ?? "Unknown"} occurrences · {series.frequency}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-base font-semibold tabular-nums ${series.direction === "credit" ? "text-(--positive)" : ""}`}>{series.direction === "credit" ? "+" : "−"}{series.amount_paise == null ? "Unknown" : formatPaise(series.amount_paise)}</p>
                    <p className="mt-1 text-[10px] text-(--text-tertiary)">{series.confidence == null ? "Confidence unavailable" : `${Math.round(Math.max(0, Math.min(1, series.confidence)) * 100)}% confidence`}</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-(--surface-subtle)"><div className="h-full rounded-full bg-accent" style={{ width: `${series.confidence == null ? 0 : Math.round(Math.max(0, Math.min(1, series.confidence)) * 100)}%` }} /></div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[...(series.status === "reviewable" || series.status === "detected" ? [{ action: "confirm" as const, title: "Confirm pattern" }] : []), ...(["confirmed", "active"].includes(series.status) ? [{ action: "pause" as const, title: "Pause tracking" }] : []), ...(["paused", "confirmed"].includes(series.status) ? [{ action: "resume" as const, title: series.status === "paused" ? "Resume tracking" : "Activate tracking" }] : []), ...(["detected", "reviewable", "confirmed", "active", "paused"].includes(series.status) ? [{ action: "dismiss" as const, title: "Dismiss" }] : [])].map(({ action, title }) => (
                    <button key={action} disabled={pending !== null || detecting} onClick={() => void updatePattern(series.series_id, action)} className="min-h-10 rounded-xl border border-(--border) px-3 text-xs font-medium hover:bg-(--surface-subtle) disabled:opacity-50">{pending === series.series_id ? "Saving…" : title}</button>
                  ))}
                </div>
              </motion.div>
            ))}
          </section>
        </>
      )}

      {dialogOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) setDialogOpen(false); }}>
          <form onSubmit={saveSchedule} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">Recurring transaction</p><h2 className="mt-1 text-xl font-bold">{editing ? "Edit schedule" : "Add schedule"}</h2></div>
              <button type="button" onClick={() => setDialogOpen(false)} disabled={saving} className="grid h-10 w-10 place-items-center rounded-xl border border-(--border)"><X className="h-4 w-4" /></button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Description" className="sm:col-span-2"><input required value={draft.description} onChange={(e) => setDraft((value) => ({ ...value, description: e.target.value }))} className="field" placeholder="Rent, Netflix, Salary…" /></Field>
              <Field label="Amount"><input required type="number" min="0" step="0.01" value={draft.amount} onChange={(e) => setDraft((value) => ({ ...value, amount: e.target.value }))} className="field" /></Field>
              <Field label="Currency"><input required maxLength={3} value={draft.currency} onChange={(e) => setDraft((value) => ({ ...value, currency: e.target.value.toUpperCase() }))} className="field uppercase" /></Field>
              <Field label="Direction"><select value={draft.type} onChange={(e) => setDraft((value) => ({ ...value, type: e.target.value as Draft["type"] }))} className="field"><option value="debit">Debit / expense</option><option value="credit">Credit / income</option></select></Field>
              <Field label="Frequency"><select value={draft.frequency} onChange={(e) => setDraft((value) => ({ ...value, frequency: e.target.value }))} className="field">{frequencyOptions.map((frequency) => <option key={frequency} value={frequency}>{frequency}</option>)}</select></Field>
              <Field label="Account"><select required value={draft.account_id} onChange={(e) => setDraft((value) => ({ ...value, account_id: e.target.value }))} className="field"><option value="">Select account</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.display_name || account.name || "Account"}</option>)}</select></Field>
              <Field label="Category"><select value={draft.category_id} onChange={(e) => setDraft((value) => ({ ...value, category_id: e.target.value }))} className="field"><option value="">No category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></Field>
              <Field label="Start date"><input required type="date" value={draft.start_date} onChange={(e) => setDraft((value) => ({ ...value, start_date: e.target.value }))} className="field" /></Field>
              <Field label="End date"><input type="date" value={draft.end_date} onChange={(e) => setDraft((value) => ({ ...value, end_date: e.target.value }))} className="field" /></Field>
              <Field label="Day of month"><input type="number" min="1" max="31" value={draft.day_of_month} onChange={(e) => setDraft((value) => ({ ...value, day_of_month: e.target.value }))} className="field" placeholder="Optional" /></Field>
              <Field label="Weekend handling"><select value={draft.weekend_adjustment} onChange={(e) => setDraft((value) => ({ ...value, weekend_adjustment: e.target.value as Draft["weekend_adjustment"] }))} className="field"><option value="none">No adjustment</option><option value="previous_friday">Move to previous Friday</option><option value="next_monday">Move to next Monday</option></select></Field>
            </div>

            <div className="mt-4 grid gap-3 rounded-xl border border-(--border) bg-(--surface-subtle) p-4 sm:grid-cols-2">
              <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={draft.auto_generate} onChange={(e) => setDraft((value) => ({ ...value, auto_generate: e.target.checked }))} className="mt-1" /><span><strong className="block text-xs">Auto-generate occurrences</strong><span className="text-xs text-(--text-tertiary)">Create transaction records when each occurrence becomes due.</span></span></label>
              {editing && <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={draft.is_active} onChange={(e) => setDraft((value) => ({ ...value, is_active: e.target.checked }))} className="mt-1" /><span><strong className="block text-xs">Schedule active</strong><span className="text-xs text-(--text-tertiary)">Turn off to pause future generation without deleting history.</span></span></label>}
            </div>

            <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDialogOpen(false)} disabled={saving} className="min-h-11 rounded-xl border border-(--border) px-4 text-xs font-semibold">Cancel</button><button type="submit" disabled={saving} className="min-h-11 rounded-xl bg-accent px-5 text-xs font-semibold text-accent-foreground disabled:opacity-50">{saving ? "Saving…" : editing ? "Save changes" : "Create schedule"}</button></div>
          </form>
        </div>
      )}

      <style jsx>{`
        .field { width: 100%; min-height: 44px; border: 1px solid var(--border); border-radius: 12px; padding: 0 12px; background: var(--surface); color: var(--text-primary); font-size: 13px; outline: none; }
        .field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 14%, transparent); }
      `}</style>
    </div>
  );
}

function Summary({ icon, label: summaryLabel, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return (
    <div className="premium-card p-5">
      <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-(--surface-subtle)">{icon}</span><span className="text-[10px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">{summaryLabel}</span></div>
      <p className="mt-3 font-display text-[21px] font-bold tabular-nums tracking-[-0.02em]">{value}</p>
      <p className="mt-1 text-xs text-(--text-tertiary)">{detail}</p>
    </div>
  );
}

function Field({ label: fieldLabel, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`flex flex-col gap-1.5 ${className}`}><span className="text-[11px] font-semibold text-(--text-secondary)">{fieldLabel}</span>{children}</label>;
}
