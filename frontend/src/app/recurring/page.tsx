"use client";

import * as React from "react";
import { useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles, ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { Badge, SectionHeader } from "@/components/shared";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { rows,object,label,amount } from "@/lib/response";
const loadRecurring=async()=>rows(object(await api.getRecurring()).recurring).map(row=>({
 series_id:label(row.series_id),merchant_name:label(row.series_name),category:label(row.series_type),
 direction:row.is_income===true?'credit':'debit',status:label(row.status),frequency:label(row.frequency),
 amount_paise:amount(row.typical_amount_paise),monthly:amount(row.monthly_equivalent_paise),
 next_date:label(row.next_expected_at,''),occurrences_count:amount(row.observation_count),
 confidence:row.confidence===null||row.confidence===undefined?null:Number(row.confidence),evidence_state:label(row.evidence_state)
}));
import { api, ApiError } from "@/lib/api";



const evidenceVariant: Record<
  "USER_CONFIRMED" | "OBSERVED" | "INFERRED",
  "positive" | "ai" | "neutral"
> = {
  USER_CONFIRMED: "positive",
  OBSERVED: "ai",
  INFERRED: "neutral",
};

const statusVariant: Record<
  "active" | "paused" | "ended" | "candidate",
  "positive" | "warning" | "neutral" | "gold"
> = {
  active: "positive",
  paused: "warning",
  ended: "neutral",
  candidate: "gold",
};

function confidenceColor(c: number): string {
  if (c >= 0.9) return "var(--positive)";
  if (c >= 0.8) return "var(--accent)";
  return "var(--warning)";
}

export default function RecurringPage() {
  const state=useResource(loadRecurring);
  const { userId } = useAuth();
  const owner = React.useRef(userId);
  owner.current = userId;
  const [pending, setPending] = React.useState<string | null>(null);
  React.useEffect(() => { setPending(null); setDetecting(false); }, [userId]);
  const updateSeries = async (id: string, action: "confirm" | "dismiss" | "pause" | "resume") => {
    if (pending || !userId) return;
    const requestOwner = userId;
    setPending(id);
    try {
      await api.updateRecurring(id, action);
      if (owner.current !== requestOwner) return;
      state.reload();
      toast({ title: "Series updated", description: "Your recurring tracking preference has been saved. This does not change a payment at your bank." });
    } catch (error: unknown) {
      if (owner.current === requestOwner) toast({ title: "Could not update series", description: error instanceof Error ? error.message : "Please retry.", variant: "destructive" });
    } finally { if (owner.current === requestOwner) setPending(null); }
  };
  const [filter,setFilter]=React.useState("all");
  const { toast } = useToast();

  const [detecting, setDetecting] = React.useState(false);
  const recurringSeries=state.data??[];
  const active = recurringSeries.filter((s) => s.status === "active");
  const debits = active.filter((s) => s.direction === "debit");
  const credits = active.filter((s) => s.direction === "credit");
  const totalDebit = debits.reduce((sum, s) => sum + (s.monthly??0), 0);
  const totalCredit = credits.reduce((sum, s) => sum + (s.monthly??0), 0);
  const netFlow = totalCredit - totalDebit;

  const handleDetect = async () => {
    if (!userId || detecting) return;
    const requestOwner = userId;
    setDetecting(true);
    try {
      await api.detectRecurring();
      if (owner.current !== requestOwner) return;
      toast({ title: "Detection complete", description: "Refreshed your recurring series with the latest patterns." });
      // Refetch so the list reflects newly detected series.
      state.reload();
    } catch (err: unknown) {
      if (owner.current !== requestOwner) return;
      const msg = err instanceof ApiError ? err.message : "Could not start detection. Try again.";
      toast({ title: "Detection failed", description: msg, variant: "destructive" });
    } finally {
      if (owner.current === requestOwner) setDetecting(false);
    }
  };

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  };

  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">
            Bills & rhythms
          </h1>
          <p className="text-[14px] text-(--text-secondary) mt-1">
            {active.length} active series · {formatPaise(totalDebit)} monthly
            outflow
          </p>
        </div>
        <button
          type="button"
          onClick={handleDetect}
          disabled={detecting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm shrink-0 disabled:opacity-60"
        >
          <Sparkles className="w-4 h-4" />
          {detecting ? "Detecting..." : "Detect New"}
        </button>
      </motion.header>

      <section className="premium-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"><p className="text-xs text-(--text-secondary)">Monthly equivalents cover active series with known amounts. Detected patterns are estimates, not scheduled payments. {active.filter(series => series.monthly === null).length > 0 && `${active.filter(series => series.monthly === null).length} active series have unknown monthly amounts and are excluded.`}</p><select aria-label="Filter recurring status" value={filter} onChange={e=>setFilter(e.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="all">All statuses</option>{Array.from(new Set(recurringSeries.map(s=>s.status))).map(status=><option key={status} value={status}>{status}</option>)}</select></section>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="premium-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[8px] bg-(--negative-light) flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 text-(--negative)" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              Estimated monthly outflow
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] text-(--negative)">
            −{formatPaise(totalDebit)}
          </span>
          <span className="text-[12px] text-(--text-tertiary)">
            {debits.length} debit series
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="premium-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[8px] bg-[var(--positive-light)] flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5 text-(--positive)" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              Estimated monthly inflow
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] text-(--positive)">
            +{formatPaise(totalCredit)}
          </span>
          <span className="text-[12px] text-(--text-tertiary)">
            {credits.length} credit series
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="premium-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[8px] bg-[var(--accent-light)] flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-accent" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              Net Recurring Flow
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em]">
            {formatPaise(netFlow)}
          </span>
          <span className="text-[12px] text-(--text-tertiary)">
            per month after fixed items
          </span>
        </motion.div>
      </div>

      {/* Series list */}
      <section>
        <SectionHeader
          title="All Series"
          action={
            <span className="text-[12px] font-mono text-(--text-tertiary)">
              {recurringSeries.length} total
            </span>
          }
        />
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-col gap-3"
        >
          {recurringSeries.length===0&&<div className="premium-card p-8 text-center"><h3 className="font-semibold">Find the rhythm in your records</h3><p className="text-sm text-(--text-secondary) mt-2">Import statement history, then use Detect New to look for repeated payments and income.</p></div>}
          {recurringSeries.filter(s=>filter==="all"||s.status===filter).map((s) => {
            const isCredit = s.direction === "credit";
            return (
              <motion.div
                key={s.series_id}
                variants={item}
                className="premium-card p-4 sm:p-5"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-[18px] shrink-0">
                    {categoryIcon(s.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold truncate">
                          {s.merchant_name}
                        </h3>
                        <p className="text-[12px] text-(--text-tertiary) mt-0.5">
                          Next {s.next_date?formatDate(s.next_date):"date unavailable"} · {s.occurrences_count??"Unknown"}{" "}
                          occurrences
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-[16px] font-semibold tabular-nums ${
                            isCredit ? "text-(--positive)" : ""
                          }`}
                        >
                          {isCredit ? "+" : "−"}
                          {s.amount_paise===null?"Unknown amount":formatPaise(s.amount_paise)}
                        </p>
                        <p className="text-[11px] text-(--text-tertiary) mt-0.5 capitalize">
                          {s.frequency}
                        </p>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary) shrink-0">
                        Confidence
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${s.confidence === null || !Number.isFinite(s.confidence) ? 0 : Math.max(0, Math.min(100, s.confidence * 100))}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: confidenceColor(s.confidence??0) }}
                        />
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-(--text-secondary) shrink-0 w-9 text-right">
                        {s.confidence===null?"Unknown":`${Math.round(s.confidence * 100)}%`}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2" aria-label={`Manage ${s.merchant_name}`}>
                      {([
                        ...(s.status === "reviewable" ? [{ action: "confirm" as const, title: "Confirm pattern" }] : []),
                        ...(["confirmed", "active"].includes(s.status) ? [{ action: "pause" as const, title: "Pause tracking" }] : []),
                        ...(["confirmed", "paused"].includes(s.status) ? [{ action: "resume" as const, title: s.status === "confirmed" ? "Activate tracking" : "Resume tracking" }] : []),
                        ...(["detected", "reviewable", "confirmed", "active", "paused"].includes(s.status) ? [{ action: "dismiss" as const, title: "Dismiss pattern" }] : []),
                      ]).map(({ action, title }) => <button key={action} disabled={pending !== null || detecting} onClick={() => updateSeries(s.series_id, action)} className="min-h-11 px-3 rounded-xl border border-(--border) text-xs font-medium hover:bg-(--surface-subtle) disabled:opacity-50">{pending === s.series_id ? "Saving..." : title}</button>)}
                    </div>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge label={s.category} variant="neutral" />
                      <Badge
                        label={s.evidence_state.replace(/_/g, " ")}
                        variant={evidenceVariant[s.evidence_state as keyof typeof evidenceVariant]??"neutral"}
                      />
                      <Badge
                        label={s.status}
                        variant={statusVariant[s.status as keyof typeof statusVariant]??"neutral"}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}
