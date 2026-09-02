"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { forecastData } from "@/lib/data";
import { formatPaise, formatPct } from "@/lib/format";
import { ForecastComboChart } from "@/components/charts/recharts";
import {
  SectionHeader,
  Badge,
  FreshnessBadge,
  CountUp,
} from "@/components/shared";

const driverIcon = {
  positive: TrendingUp,
  negative: TrendingDown,
  neutral: Minus,
} as const;

const driverColor = {
  positive: "var(--positive)",
  negative: "var(--negative)",
  neutral: "var(--text-tertiary)",
} as const;

const driverBg = {
  positive: "var(--positive-light)",
  negative: "var(--negative-light)",
  neutral: "var(--surface-subtle)",
} as const;

const ASSUMPTIONS = [
  "Salary credits continue at the current monthly rate.",
  "Recurring subscriptions (Netflix, Cult.fit, Jio) remain active at current prices.",
  "Average discretionary spend trends forward at the 30-day trailing average.",
  "Investment SIPs continue on schedule with no early redemptions.",
  "No major one-time events — bonuses, large purchases, or medical emergencies.",
  "Investment returns follow historical averages; no market shock modelled.",
];

export default function ForecastPage() {
  const [horizonIdx, setHorizonIdx] = React.useState(1); // default 30 days
  const [showAssumptions, setShowAssumptions] = React.useState(false);

  const horizon = forecastData.horizons[horizonIdx];

  // timeline values are rupees (chart formats with /100000 → L). Multiply by 100
  // to convert to paise so formatPaise matches the chart's lakh-scale display.
  const currentBalance =
    [...forecastData.timeline]
      .reverse()
      .find((t) => t.actual !== null)?.actual ?? 0;

  const projectedDelta = horizon.projected_balance_paise - currentBalance;
  const confidenceVariant =
    horizon.confidence >= 0.85
      ? "positive"
      : horizon.confidence >= 0.7
        ? "warning"
        : "negative";

  const totalDriversImpact = forecastData.drivers.reduce(
    (s, d) => s + d.impact_paise,
    0,
  );

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
            Forecast
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Your financial future, predicted
          </p>
        </div>
        <FreshnessBadge status="estimated" />
      </motion.header>

      {/* Horizon selector */}
      <div className="inline-flex p-1 bg-[var(--surface-subtle)] rounded-full gap-1 self-start">
        {forecastData.horizons.map((h, i) => (
          <button
            key={h.days}
            type="button"
            onClick={() => setHorizonIdx(i)}
            className={`relative px-4 py-1.5 rounded-full text-[12px] font-medium transition-colors ${
              horizonIdx === i
                ? "text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            {horizonIdx === i && (
              <motion.div
                layoutId="forecast-horizon-pill"
                className="absolute inset-0 rounded-full bg-[var(--accent)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{h.label}</span>
          </button>
        ))}
      </div>

      {/* Current + projected hero cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="premium-card p-6 flex flex-col gap-1"
        >
          <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
            Current Balance
          </span>
          <CountUp
            value={currentBalance * 100}
            format={(v) => formatPaise(v)}
            duration={1500}
            className="font-display font-bold text-[32px] tabular-nums tracking-[-0.02em]"
          />
          <span className="text-[12px] text-[var(--text-tertiary)] mt-1">
            As of latest sync
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="premium-card-glow p-6 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              Projected in {horizon.label}
            </span>
            <Badge
              label={`${formatPct(horizon.confidence)} conf.`}
              variant={confidenceVariant}
            />
          </div>
          <CountUp
            value={horizon.projected_balance_paise * 100}
            format={(v) => formatPaise(v)}
            duration={1500}
            className="font-display font-bold text-[32px] tabular-nums tracking-[-0.02em]"
          />
          <span
            className={`text-[12px] font-medium tabular-nums ${
              projectedDelta >= 0
                ? "text-[var(--positive)]"
                : "text-[var(--negative)]"
            }`}
          >
            {projectedDelta >= 0 ? "↑" : "↓"}{" "}
            {formatPaise(Math.abs(projectedDelta) * 100, { style: "signed" })} vs
            today
          </span>
        </motion.div>
      </div>

      {/* Confidence indicator strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="premium-card p-4 flex items-center gap-4"
      >
        <div className="flex items-center gap-2 shrink-0">
          <ShieldCheck
            className="w-4 h-4"
            style={{ color: "var(--accent)" }}
          />
          <span className="text-[12px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
            Forecast confidence
          </span>
        </div>
        <div className="flex-1 h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${horizon.confidence * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{
              background:
                horizon.confidence >= 0.85
                  ? "var(--positive)"
                  : horizon.confidence >= 0.7
                    ? "var(--warning)"
                    : "var(--negative)",
            }}
          />
        </div>
        <span className="text-[13px] font-semibold tabular-nums shrink-0 w-12 text-right">
          {formatPct(horizon.confidence)}
        </span>
      </motion.div>

      {/* Chart */}
      <section>
        <SectionHeader
          title="Balance Trajectory"
          action={
            <span className="text-[12px] font-mono text-[var(--text-tertiary)]">
              6 months actual · 3 months projected
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
          <ForecastComboChart data={forecastData.timeline} />
          <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-[var(--border-subtle)] flex-wrap">
            <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <span className="w-3 h-0.5 bg-[#047857]" /> Actual
            </span>
            <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <span
                className="w-3 h-0.5 bg-[#B08D57]"
                style={{ borderTop: "1px dashed #B08D57" }}
              />{" "}
              Projected
            </span>
            <span className="flex items-center gap-2 text-[11px] font-mono text-[var(--text-secondary)]">
              <span className="w-3 h-2 rounded-sm bg-[#047857]/20" /> Confidence
              band
            </span>
          </div>
        </motion.div>
      </section>

      {/* Drivers */}
      <section>
        <SectionHeader
          title="Forecast Drivers"
          action={
            <span className="text-[12px] font-mono text-[var(--text-tertiary)]">
              net {formatPaise(totalDriversImpact, { style: "signed" })}/mo
            </span>
          }
        />
        <div className="premium-card overflow-hidden">
          {forecastData.drivers.map((d, i, arr) => {
            const Icon = driverIcon[d.type];
            const color = driverColor[d.type];
            const bg = driverBg[d.type];
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className={`p-4 flex items-center gap-3 ${
                  i < arr.length - 1
                    ? "border-b border-[var(--border-subtle)]"
                    : ""
                }`}
              >
                <span
                  className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: bg }}
                >
                  <Icon className="w-4 h-4" style={{ color }} />
                </span>
                <span className="text-[14px] font-medium flex-1 min-w-0 truncate">
                  {d.label}
                </span>
                <span
                  className="text-[14px] font-semibold tabular-nums shrink-0"
                  style={{ color }}
                >
                  {d.impact_paise >= 0 ? "+" : "−"}
                  {formatPaise(Math.abs(d.impact_paise))}
                </span>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Assumptions disclosure */}
      <section className="premium-card overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAssumptions((v) => !v)}
          aria-expanded={showAssumptions}
          className="w-full p-4 flex items-center justify-between gap-3 hover:bg-[var(--surface-subtle)] transition-colors"
        >
          <span className="text-[14px] font-semibold">Assumptions</span>
          <motion.span
            animate={{ rotate: showAssumptions ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)]" />
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {showAssumptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <ul className="px-4 pb-4 flex flex-col gap-2">
                {ASSUMPTIONS.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)] leading-[1.55]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-[7px] shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Coverage / freshness */}
      <section className="premium-card p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <span className="text-[13px] text-[var(--text-secondary)] truncate">
            Based on 12 months of synced transactions
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge label="85% coverage" variant="ai" />
          <FreshnessBadge status="estimated" />
        </div>
      </section>

      {/* Warning */}
      <div
        className="flex items-start gap-3 p-4 rounded-[12px] border"
        style={{
          background: "var(--warning-light)",
          borderColor: "color-mix(in oklab, var(--warning) 25%, transparent)",
        }}
      >
        <AlertTriangle className="w-5 h-5 text-[var(--warning)] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
          <span className="font-semibold text-[var(--foreground)]">
            Forecasts are estimates
          </span>{" "}
          based on your patterns. Actual results may vary due to unexpected
          income, expenses, or market conditions.
        </p>
      </div>
    </div>
  );
}
