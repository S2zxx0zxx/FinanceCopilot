"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import { recurringSeries } from "@/lib/data";
import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { Badge, SectionHeader } from "@/components/shared";

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
  const active = recurringSeries.filter((s) => s.status === "active");
  const debits = active.filter((s) => s.direction === "debit");
  const credits = active.filter((s) => s.direction === "credit");
  const totalDebit = debits.reduce((sum, s) => sum + s.amount_paise, 0);
  const totalCredit = credits.reduce((sum, s) => sum + s.amount_paise, 0);
  const netFlow = totalCredit - totalDebit;

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
  };

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
            Recurring
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            {active.length} active series · {formatPaise(totalDebit)} monthly
            outflow
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-sm shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          Detect New
        </button>
      </motion.header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="premium-card p-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[8px] bg-[var(--negative-light)] flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5 text-[var(--negative)]" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Monthly Recurring
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] text-[var(--negative)]">
            −{formatPaise(totalDebit)}
          </span>
          <span className="text-[12px] text-[var(--text-tertiary)]">
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
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--positive)]" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Monthly Income
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] text-[var(--positive)]">
            +{formatPaise(totalCredit)}
          </span>
          <span className="text-[12px] text-[var(--text-tertiary)]">
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
              <Scale className="w-3.5 h-3.5 text-[var(--accent)]" />
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Net Recurring Flow
            </span>
          </div>
          <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em]">
            +{formatPaise(netFlow)}
          </span>
          <span className="text-[12px] text-[var(--text-tertiary)]">
            per month after fixed items
          </span>
        </motion.div>
      </div>

      {/* Series list */}
      <section>
        <SectionHeader
          title="All Series"
          action={
            <span className="text-[12px] font-mono text-[var(--text-tertiary)]">
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
          {recurringSeries.map((s) => {
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
                        <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                          Next {formatDate(s.next_date)} · {s.occurrences_count}{" "}
                          occurrences
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={`text-[16px] font-semibold tabular-nums ${
                            isCredit ? "text-[var(--positive)]" : ""
                          }`}
                        >
                          {isCredit ? "+" : "−"}
                          {formatPaise(s.amount_paise)}
                        </p>
                        <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 capitalize">
                          {s.frequency}
                        </p>
                      </div>
                    </div>

                    {/* Confidence bar */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] shrink-0">
                        Confidence
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{
                            width: `${Math.round(s.confidence * 100)}%`,
                          }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: confidenceColor(s.confidence) }}
                        />
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-[var(--text-secondary)] shrink-0 w-9 text-right">
                        {Math.round(s.confidence * 100)}%
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      <Badge label={s.category} variant="neutral" />
                      <Badge
                        label={s.evidence_state.replace(/_/g, " ")}
                        variant={evidenceVariant[s.evidence_state]}
                      />
                      <Badge
                        label={s.status}
                        variant={statusVariant[s.status]}
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
