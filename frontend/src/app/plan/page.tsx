"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ChevronDown,
  Activity,
  Wallet,
  PiggyBank,
  ShieldCheck,
  Target,
  Flame,
  Trophy,
  CalendarDays,
  Receipt,
  RefreshCw,
  TrendingUp,
  Users,
  Sparkles,
  Lightbulb,
  Repeat2,
  CreditCard,
  Snowflake,
  Mountain,
  Calendar,
  Lock,
} from "lucide-react";
import {
  SectionHeader,
  Badge,
  ProgressRing,
  CountUp,
} from "@/components/shared";
import {
  goals,
  budgets,
  financialHealth,
  recurringSeries,
  calendarEvents,
  peerComparison,
  cashflowData,
  forecastData,
  gamification,
} from "@/lib/data";
import { formatPaise, formatDate } from "@/lib/format";
import type { Budget } from "@/lib/data";

// ── Helpers ────────────────────────────────────────────────────────────────

type Tone = "positive" | "warning" | "negative" | "neutral";

function statusTone(status: string): Tone {
  const s = status.toLowerCase();
  if (
    s === "healthy" ||
    s === "on_track" ||
    s === "excellent" ||
    s === "strong" ||
    s === "completed"
  )
    return "positive";
  if (
    s === "low" ||
    s === "moderate" ||
    s === "below" ||
    s === "watch" ||
    s === "warning" ||
    s === "behind"
  )
    return "warning";
  if (s === "over" || s === "critical" || s === "deadline_passed") return "negative";
  return "neutral";
}

function toneColor(t: Tone): string {
  return t === "positive"
    ? "var(--positive)"
    : t === "warning"
      ? "var(--warning)"
      : t === "negative"
        ? "var(--negative)"
        : "var(--text-tertiary)";
}

function prettifyStatus(s: string): string {
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Financial Health Score (0-100) ──────────────────────────────────────────
function calcHealthScore(): number {
  const cashBufferPct = Math.min(
    100,
    ((financialHealth.cash_buffer_months ?? 0) / 6) * 100,
  );
  const commitmentPct = Math.max(
    0,
    Math.min(100, (1 - (financialHealth.commitment_load_ratio ?? 0)) * 100),
  );
  const savingsPct = Math.min(
    100,
    ((financialHealth.savings_rate_pct ?? 0) / 0.5) * 100,
  );
  const emergencyPct = Math.min(
    100,
    ((financialHealth.emergency_fund_months ?? 0) / 6) * 100,
  );
  return Math.round(
    (cashBufferPct + commitmentPct + savingsPct + emergencyPct) / 4,
  );
}

function scoreLabel(score: number): { label: string; tone: Tone } {
  if (score >= 80) return { label: "Excellent", tone: "positive" };
  if (score >= 65) return { label: "Good", tone: "positive" };
  if (score >= 50) return { label: "Fair", tone: "warning" };
  return { label: "Needs Work", tone: "negative" };
}

// ── Savings challenge (52-week) ────────────────────────────────────────────
const CHALLENGE_CURRENT_WEEK = 36;
const CHALLENGE_TOTAL_WEEKS = 52;

function weekDepositPaise(week: number): number {
  return week * 100 * 100;
}
function cumulativeSavedPaise(uptoWeek: number): number {
  return ((uptoWeek * (uptoWeek + 1)) / 2) * 100 * 100;
}

const CHALLENGE_SAVED = cumulativeSavedPaise(CHALLENGE_CURRENT_WEEK);
const CHALLENGE_TARGET = cumulativeSavedPaise(CHALLENGE_TOTAL_WEEKS);
const CHALLENGE_THIS_WEEK = weekDepositPaise(CHALLENGE_CURRENT_WEEK);

// ── Recurring summary ─────────────────────────────────────────────────────
function recurringSummary() {
  const active = recurringSeries.filter((s) => s.status === "active");
  const outflow = active
    .filter((s) => s.direction === "debit")
    .reduce((sum, s) => sum + s.amount_paise, 0);
  const inflow = active
    .filter((s) => s.direction === "credit")
    .reduce((sum, s) => sum + s.amount_paise, 0);
  return {
    count: active.length,
    outflow,
    inflow,
    net: inflow - outflow,
  };
}

// ── Calendar event helpers ────────────────────────────────────────────────
type CalType = "bill" | "subscription" | "investment" | "income";

function calTypeIcon(type: string) {
  switch (type as CalType) {
    case "bill":
      return Receipt;
    case "subscription":
      return RefreshCw;
    case "investment":
      return TrendingUp;
    case "income":
      return ArrowDownRight;
    default:
      return CalendarDays;
  }
}

function calTypeColor(type: string, severity: string): string {
  if (type === "income") return "var(--positive)";
  if (type === "investment") return "var(--accent)";
  if (type === "subscription") return "var(--text-tertiary)";
  return severity === "high" ? "var(--negative)" : "var(--text-tertiary)";
}

// ── Motion variants ───────────────────────────────────────────────────────
const EASE = [0.16, 1, 0.3, 1] as const;
const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// ── Inline Cashflow Chart (12 months, ALIVE) ───────────────────────────────
function CashflowInlineChart() {
  const [hover, setHover] = React.useState<number | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const W = 560;
  const H = 200;
  const pad = { l: 38, r: 8, t: 12, b: 24 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const maxVal = Math.max(...cashflowData.map((d) => Math.max(d.income, d.expense)));
  const niceMax = Math.ceil(maxVal / 20000) * 20000;
  const groupW = innerW / cashflowData.length;
  const barW = Math.min(14, groupW * 0.34);

  const yScale = (v: number) => pad.t + innerH - (v / niceMax) * innerH;

  return (
    <div ref={ref} className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full"
        style={{ height: "auto" }}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="cfIncomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--positive)" stopOpacity={0.95} />
            <stop offset="60%" stopColor="var(--positive)" stopOpacity={0.55} />
            <stop offset="100%" stopColor="var(--positive)" stopOpacity={0.18} />
          </linearGradient>
          <linearGradient id="cfExpenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--text-tertiary)" stopOpacity={0.7} />
            <stop offset="100%" stopColor="var(--text-tertiary)" stopOpacity={0.15} />
          </linearGradient>
        </defs>

        {/* Grid lines + Y axis labels */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
          const y = pad.t + innerH - t * innerH;
          const val = Math.round(t * niceMax);
          return (
            <g key={i}>
              <line
                x1={pad.l}
                x2={pad.l + innerW}
                y1={y}
                y2={y}
                stroke="var(--border-subtle)"
                strokeWidth={1}
                strokeDasharray={t === 0 ? "0" : "3 3"}
              />
              <text
                x={pad.l - 6}
                y={y + 3}
                textAnchor="end"
                className="font-mono"
                fontSize={9}
                fill="var(--text-tertiary)"
              >
                ₹{val >= 1000 ? `${(val / 1000).toFixed(0)}K` : val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {cashflowData.map((d, i) => {
          const x = pad.l + i * groupW + groupW / 2;
          const incH = (d.income / niceMax) * innerH;
          const expH = (d.expense / niceMax) * innerH;
          const incY = pad.t + innerH - incH;
          const expY = pad.t + innerH - expH;
          const isHover = hover === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHover(i)}
              style={{ cursor: "pointer" }}
            >
              {/* Hover background */}
              {isHover && (
                <rect
                  x={pad.l + i * groupW + 2}
                  y={pad.t}
                  width={groupW - 4}
                  height={innerH}
                  fill="var(--surface-subtle)"
                  opacity={0.6}
                  rx={6}
                />
              )}
              {/* Income bar */}
              <motion.rect
                x={x - barW - 1}
                width={barW}
                rx={3}
                fill={isHover ? "var(--positive)" : "url(#cfIncomeGrad)"}
                initial={{ height: 0, y: pad.t + innerH }}
                animate={
                  inView
                    ? { height: incH, y: incY }
                    : { height: 0, y: pad.t + innerH }
                }
                transition={{
                  duration: 0.8,
                  ease: EASE,
                  delay: 0.05 * i,
                }}
              />
              {/* Expense bar */}
              <motion.rect
                x={x + 1}
                width={barW}
                rx={3}
                fill={isHover ? "var(--text-secondary)" : "url(#cfExpenseGrad)"}
                initial={{ height: 0, y: pad.t + innerH }}
                animate={
                  inView
                    ? { height: expH, y: expY }
                    : { height: 0, y: pad.t + innerH }
                }
                transition={{
                  duration: 0.8,
                  ease: EASE,
                  delay: 0.05 * i + 0.1,
                }}
              />
              {/* Month label */}
              <text
                x={x}
                y={H - 6}
                textAnchor="middle"
                fontSize={10}
                className="font-mono"
                fill={isHover ? "var(--foreground)" : "var(--text-tertiary)"}
                fontWeight={isHover ? 600 : 400}
              >
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hover !== null && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute premium-card p-2.5 pointer-events-none z-10 min-w-[140px]"
            style={{
              left: `min(${(hover / cashflowData.length) * 100}%, calc(100% - 160px))`,
              top: 0,
            }}
          >
            <p className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-1.5">
              {cashflowData[hover].month}
            </p>
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--positive)]" />
                Income
              </span>
              <span className="font-semibold tabular-nums">
                {formatPaise(cashflowData[hover].income * 100)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[12px] mt-0.5">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--text-tertiary)]" />
                Expense
              </span>
              <span className="font-semibold tabular-nums">
                {formatPaise(cashflowData[hover].expense * 100)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[12px] mt-1 pt-1 border-t border-[var(--border-subtle)]">
              <span className="text-[var(--text-tertiary)]">Net</span>
              <span
                className="font-semibold tabular-nums"
                style={{
                  color:
                    cashflowData[hover].income - cashflowData[hover].expense >= 0
                      ? "var(--positive)"
                      : "var(--negative)",
                }}
              >
                {formatPaise(
                  (cashflowData[hover].income - cashflowData[hover].expense) * 100,
                  { style: "signed" },
                )}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 mt-2">
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-tertiary)]">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--positive)]" />
          Income
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-tertiary)]">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--text-tertiary)]" />
          Expense
        </span>
      </div>
    </div>
  );
}

// ── Inline Forecast Chart (timeline, ALIVE) ───────────────────────────────
function ForecastInlineChart() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const data = forecastData.timeline;
  const W = 560;
  const H = 180;
  const pad = { l: 38, r: 8, t: 10, b: 24 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const allVals = data
    .flatMap((d) => [d.actual, d.projected, d.upper, d.lower])
    .filter((v): v is number => v != null);
  const minV = Math.min(...allVals);
  const maxV = Math.max(...allVals);
  const niceMin = Math.floor(minV / 100000) * 100000;
  const niceMax = Math.ceil(maxV / 100000) * 100000;
  const xStep = innerW / (data.length - 1);

  const xAt = (i: number) => pad.l + i * xStep;
  const yAt = (v: number) =>
    pad.t + innerH - ((v - niceMin) / (niceMax - niceMin)) * innerH;

  // Build paths
  const actualPts = data
    .map((d, i) => (d.actual != null ? `${xAt(i)},${yAt(d.actual)}` : null))
    .filter(Boolean) as string[];
  const actualPath = `M${actualPts.join(" L")}`;

  const projPts = data
    .map((d, i) => (d.projected != null ? `${xAt(i)},${yAt(d.projected)}` : null))
    .filter(Boolean) as string[];
  const projPath = `M${projPts.join(" L")}`;

  // Confidence band area
  const upperPts = data
    .map((d, i) => (d.upper != null ? `${xAt(i)},${yAt(d.upper)}` : null))
    .filter(Boolean) as string[];
  const lowerPts = data
    .map((d, i) => (d.lower != null ? `${xAt(i)},${yAt(d.lower)}` : null))
    .filter(Boolean) as string[];
  const bandPath = `M${upperPts.join(" L")} L${lowerPts
    .slice()
    .reverse()
    .join(" L")} Z`;

  return (
    <div ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="w-full">
        <defs>
          <linearGradient id="fcArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fcLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--gold)" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0, 0.5, 1].map((t, i) => {
          const y = pad.t + innerH - t * innerH;
          const val = Math.round(niceMin + t * (niceMax - niceMin));
          return (
            <g key={i}>
              <line
                x1={pad.l}
                x2={pad.l + innerW}
                y1={y}
                y2={y}
                stroke="var(--border-subtle)"
                strokeWidth={1}
                strokeDasharray={t === 0 ? "0" : "3 3"}
              />
              <text
                x={pad.l - 6}
                y={y + 3}
                textAnchor="end"
                fontSize={9}
                className="font-mono"
                fill="var(--text-tertiary)"
              >
                ₹{(val / 100000).toFixed(1)}L
              </text>
            </g>
          );
        })}

        {/* Confidence band */}
        <motion.path
          d={bandPath}
          fill="url(#fcArea)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
        />

        {/* Actual line */}
        <motion.path
          d={actualPath}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        />
        {/* Projected line (dashed) */}
        <motion.path
          d={projPath}
          fill="none"
          stroke="var(--gold)"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 4"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.5 }}
        />

        {/* Data point dots on actual */}
        {data.map((d, i) =>
          d.actual != null ? (
            <motion.circle
              key={`a${i}`}
              cx={xAt(i)}
              cy={yAt(d.actual)}
              r={2.5}
              fill="var(--surface)"
              stroke="var(--accent)"
              strokeWidth={1.5}
              initial={{ opacity: 0, scale: 0 }}
              animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
            />
          ) : null,
        )}

        {/* Month labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xAt(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize={10}
            className="font-mono"
            fill={d.actual != null ? "var(--foreground)" : "var(--text-tertiary)"}
            fontWeight={d.actual != null ? 600 : 400}
          >
            {d.month}
          </text>
        ))}

        {/* Divider between actual and projected */}
        {(() => {
          const divX = xAt(5);
          return (
            <line
              x1={divX}
              x2={divX}
              y1={pad.t}
              y2={pad.t + innerH}
              stroke="var(--border-strong)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          );
        })()}
      </svg>
      <div className="flex items-center justify-center gap-5 mt-2">
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-tertiary)]">
          <span className="w-3 h-0.5 bg-[var(--accent)]" />
          Actual
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-tertiary)]">
          <span className="w-3 h-0.5 border-t border-dashed border-[var(--gold)]" />
          Projected
        </span>
        <span className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-tertiary)]">
          <span className="w-3 h-2 bg-[var(--accent)] opacity-30 rounded-sm" />
          Confidence
        </span>
      </div>
    </div>
  );
}

// ── 52-Week Heatmap ────────────────────────────────────────────────────────
function SavingsHeatmap() {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(13, minmax(0, 1fr))", gap: "6px" }}>
      {Array.from({ length: 52 }, (_, i) => {
        const week = i + 1;
        const done = week <= CHALLENGE_CURRENT_WEEK;
        const isCurrent = week === CHALLENGE_CURRENT_WEEK;
        const intensity = week / 52; // 0..1 — darker for higher amount
        const bg = done
          ? isCurrent
            ? "var(--gold)"
            : `color-mix(in oklab, var(--positive) ${30 + intensity * 55}%, var(--surface-subtle))`
          : "var(--surface-subtle)";
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
            transition={{
              duration: 0.3,
              ease: EASE,
              delay: 0.012 * i,
            }}
            title={`Week ${week} · ${formatPaise(weekDepositPaise(week))}`}
            className="aspect-square rounded-[3px] relative"
            style={{
              background: bg,
              boxShadow: isCurrent ? "0 0 8px var(--gold-glow)" : "none",
              border: isCurrent ? "1px solid var(--gold)" : "none",
            }}
          />
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function PlanPage() {
  const [expandedBudget, setExpandedBudget] = React.useState<string | null>(null);
  const [debtStrategy, setDebtStrategy] = React.useState<"snowball" | "avalanche">(
    "avalanche",
  );
  const [monthlyPayment, setMonthlyPayment] = React.useState(5000); // in rupees for slider

  const score = calcHealthScore();
  const { label: scoreLabelStr, tone: scoreTone } = scoreLabel(score);
  const scoreColor = toneColor(scoreTone);

  const recurring = React.useMemo(() => recurringSummary(), []);

  // Forecast 30-day
  const forecast30 = forecastData.horizons.find((h) => h.days === 30)!;
  const confPct = Math.round(forecast30.confidence * 100);
  const confTone: Tone =
    confPct >= 85 ? "positive" : confPct >= 70 ? "warning" : "negative";
  const confColor = toneColor(confTone);

  // Mini health metric chips (top 4)
  const healthMetrics = [
    {
      key: "cash_buffer",
      label: "Cash Buffer",
      icon: Wallet,
      value: `${(financialHealth.cash_buffer_months ?? 0).toFixed(1)} mo`,
      pct: Math.min(100, ((financialHealth.cash_buffer_months ?? 0) / 6) * 100),
      status: financialHealth.cash_buffer_status,
    },
    {
      key: "commitment_load",
      label: "Commitment Load",
      icon: Activity,
      value: `${Math.round((financialHealth.commitment_load_ratio ?? 0) * 100)}%`,
      pct: Math.max(
        0,
        Math.min(100, (1 - (financialHealth.commitment_load_ratio ?? 0)) * 100),
      ),
      status: financialHealth.commitment_load_status,
    },
    {
      key: "savings_rate",
      label: "Savings Rate",
      icon: PiggyBank,
      value: `${Math.round((financialHealth.savings_rate_pct ?? 0) * 100)}%`,
      pct: Math.min(100, ((financialHealth.savings_rate_pct ?? 0) / 0.5) * 100),
      status: financialHealth.savings_rate_status,
    },
    {
      key: "emergency_fund",
      label: "Emergency Fund",
      icon: ShieldCheck,
      value: `${(financialHealth.emergency_fund_months ?? 0).toFixed(1)} mo`,
      pct: Math.min(100, ((financialHealth.emergency_fund_months ?? 0) / 6) * 100),
      status: financialHealth.emergency_fund_status,
    },
  ];

  // Calendar grouping
  const today = new Date("2026-09-01T12:00:00Z");
  const sortedEvents = [...calendarEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
  const groupedEvents = sortedEvents.reduce<
    Record<"thisWeek" | "nextWeek" | "later", typeof sortedEvents>
  >(
    (acc, e) => {
      const diff = Math.ceil(
        (new Date(e.date).getTime() - today.getTime()) / 86400000,
      );
      if (diff <= 7) acc.thisWeek.push(e);
      else if (diff <= 14) acc.nextWeek.push(e);
      else acc.later.push(e);
      return acc;
    },
    { thisWeek: [], nextWeek: [], later: [] },
  );

  // Peer comparison rows
  const peerRows = [
    {
      label: "Savings Rate",
      yourValue: peerComparison.your_savings_rate,
      peerMedian: peerComparison.peer_median_savings_rate,
      top10: peerComparison.peer_top_10_pct,
      higherIsBetter: true,
      format: (v: number) => `${v}%`,
    },
    {
      label: "Cash Buffer",
      yourValue: peerComparison.your_cash_buffer_months,
      peerMedian: peerComparison.peer_median_cash_buffer,
      top10: peerComparison.peer_top_10_pct_buffer,
      higherIsBetter: true,
      format: (v: number) => `${v.toFixed(1)} mo`,
    },
    {
      label: "Subscriptions",
      yourValue: peerComparison.your_subscription_count,
      peerMedian: peerComparison.peer_median_subscriptions,
      top10: null,
      higherIsBetter: false,
      format: (v: number) => `${v}`,
    },
  ];

  // Gamification
  const milestonePreviews = gamification.milestones.filter((m) => !m.achieved).slice(0, 2);
  const earnedBadges = gamification.badges.filter((b) => b.earned).length;
  const totalBadges = gamification.badges.length;
  const xpPct = Math.round(
    (gamification.xp / gamification.xp_to_next_level) * 100,
  );
  const xpRemaining = gamification.xp_to_next_level - gamification.xp;

  // Streak flames (10 cells for 50 days)
  const streakFlames = Math.min(
    10,
    Math.ceil(gamification.tracking_streak_days / 5),
  );

  // Cashflow totals
  const totalIncome = cashflowData.reduce((s, d) => s + d.income, 0) * 100;
  const totalExpense = cashflowData.reduce((s, d) => s + d.expense, 0) * 100;
  const totalNet = totalIncome - totalExpense;

  // Debt payoff math (mock Axis card ₹45,000, APR 36%)
  const DEBT_Paise = 4500000;
  const DEBT_APR = 0.36;
  const monthlyR = DEBT_APR / 12;
  const principalRupees = DEBT_Paise / 100;
  const monthsToPayoff = monthlyPayment <= monthlyR * principalRupees
    ? 999
    : Math.ceil(
        Math.log(monthlyPayment / (monthlyPayment - monthlyR * principalRupees)) /
          Math.log(1 + monthlyR),
      );
  const totalInterestPaise = Math.max(
    0,
    Math.round(monthsToPayoff * monthlyPayment * 100 - DEBT_Paise),
  );
  // "Min payment" reference: ₹2,500/month — the absolute minimum to make progress
  const MIN_MONTHLY = 2500;
  const minMonths = MIN_MONTHLY <= monthlyR * principalRupees
    ? 999
    : Math.ceil(
        Math.log(MIN_MONTHLY / (MIN_MONTHLY - monthlyR * principalRupees)) /
          Math.log(1 + monthlyR),
      );
  const minInterestPaise = Math.max(
    0,
    Math.round(minMonths * MIN_MONTHLY * 100 - DEBT_Paise),
  );
  const interestSavedPaise = Math.max(0, minInterestPaise - totalInterestPaise);
  // Snowball vs Avalanche: since only 1 debt, both same; snowball slightly slower (smallest first)
  const snowballMonths = monthsToPayoff + 1;
  const avalancheMonths = monthsToPayoff;
  const activeMonths = debtStrategy === "snowball" ? snowballMonths : avalancheMonths;
  const activePayoffDate = new Date(today);
  activePayoffDate.setMonth(activePayoffDate.getMonth() + activeMonths);

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-[8px] bg-[var(--accent-light)] flex items-center justify-center">
              <Target className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              Plan
            </span>
          </div>
          <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">
            Your financial plan
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-md">
            Health, goals, budgets, bills, forecasts and challenges — your
            complete money roadmap.
          </p>
        </div>
        <Link
          href="/goals"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-[var(--accent)] text-[var(--accent-foreground)] text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" /> New Goal
        </Link>
      </motion.header>

      {/* ── 1. Financial Health Score Hero ─────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
      >
        <SectionHeader
          title="Financial Health Score"
          action={
            <Link
              href="/financial-health"
              className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
            >
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <Link
          href="/financial-health"
          className="premium-card-glow p-6 block group"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Big score ring */}
            <div className="relative shrink-0">
              <ProgressRing
                pct={score}
                size={132}
                stroke={11}
                color={scoreColor}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <CountUp
                  value={score}
                  duration={1500}
                  className="font-display font-bold text-[40px] leading-none tracking-[-0.03em]"
                />
                <span
                  className="text-[11px] font-mono uppercase tracking-[0.12em] mt-1"
                  style={{ color: scoreColor }}
                >
                  {scoreLabelStr}
                </span>
              </div>
            </div>

            {/* Summary text + 4 mini metric chips */}
            <div className="flex-1 w-full min-w-0 flex flex-col gap-4">
              <div>
                <h3 className="text-[15px] font-semibold">
                  Your money is in {scoreLabelStr.toLowerCase()} shape
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5] mt-1">
                  A weighted blend of cash buffer, commitment load, savings
                  rate and emergency fund. Tap to see the breakdown and
                  recommendations.
                </p>
              </div>
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
              >
                {healthMetrics.map((m) => {
                  const t = statusTone(m.status);
                  const c = toneColor(t);
                  const Icon = m.icon;
                  return (
                    <motion.div
                      key={m.key}
                      variants={item}
                      className="rounded-[12px] p-3 flex flex-col gap-1.5 bg-[var(--surface-subtle)]"
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="w-3.5 h-3.5" style={{ color: c }} />
                        <span
                          className="text-[9px] font-mono uppercase tracking-wider"
                          style={{ color: c }}
                        >
                          {prettifyStatus(m.status)}
                        </span>
                      </div>
                      <span className="text-[14px] font-display font-semibold tabular-nums leading-none mt-0.5">
                        {m.value}
                      </span>
                      <div className="h-1 rounded-full bg-[var(--surface)] overflow-hidden mt-0.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{
                            duration: 0.8,
                            ease: EASE,
                            delay: 0.2,
                          }}
                          className="h-full rounded-full"
                          style={{ background: c }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* ── 2. Goals — 2-per-row grid ────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionHeader
          title="Goals"
          action={
            <div className="flex items-center gap-3">
              <Link
                href="/goals"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] bg-[var(--accent)] text-[var(--accent-foreground)] text-[12px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> New Goal
              </Link>
              <Link
                href="/goals"
                className="hidden sm:flex text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          }
        />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {goals.map((goal) => {
            const paceTone = statusTone(goal.pace.status);
            const paceColor = toneColor(paceTone);
            const monthsLeft = Math.max(
              0,
              Math.round(goal.pace.remaining_days / 30),
            );
            return (
              <motion.div key={goal.goal_id} variants={item}>
                <Link
                  href={`/goals/${goal.goal_id}`}
                  className="premium-card p-5 block group h-full"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center shrink-0">
                        <Target className="w-4 h-4 text-[var(--accent)]" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-[15px] font-semibold truncate">
                          {goal.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge
                            label={goal.goal_type.replace(/_/g, " ")}
                            variant="neutral"
                          />
                          <span
                            className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                            style={{
                              color: paceColor,
                              background: `color-mix(in oklab, ${paceColor} 12%, transparent)`,
                            }}
                          >
                            {prettifyStatus(goal.pace.status)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <CountUp
                        value={goal.pace.progress_pct}
                        duration={1500}
                        className="text-[22px] font-display font-bold tabular-nums tracking-[-0.02em] block leading-none"
                      />
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mt-1">
                        Funded
                      </p>
                    </div>
                  </div>

                  <div className="h-2.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden mb-3">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${Math.min(100, goal.pace.progress_pct)}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        ease: EASE,
                      }}
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 60%, var(--gold)))",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[12px] gap-2">
                    <span className="font-semibold tabular-nums">
                      {formatPaise(goal.current_amount_paise)}
                    </span>
                    <span className="text-[var(--text-tertiary)]">
                      of {formatPaise(goal.target_amount_paise)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[var(--border-subtle)]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                        Monthly
                      </span>
                      <span className="text-[12px] font-semibold tabular-nums">
                        {formatPaise(goal.monthly_contribution_paise)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                        Target
                      </span>
                      <span className="text-[12px] font-semibold">
                        {formatDate(goal.target_date)}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                        Time Left
                      </span>
                      <span className="text-[12px] font-semibold tabular-nums">
                        {monthsLeft}mo · {goal.pace.remaining_days}d
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ── 3. Budgets — 2-per-row grid ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <SectionHeader title="Budgets · This Month" />
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {budgets.map((b: Budget) => {
            const tone = statusTone(b.status);
            const color = toneColor(tone);
            const isExpanded = expandedBudget === b.category;
            const isOver = b.status === "over";
            const advice =
              b.status === "over"
                ? `You're ₹${Math.abs(b.remaining_paise / 100).toLocaleString("en-IN")} over budget. Pause discretionary spend here for the rest of the month.`
                : b.status === "warning"
                  ? `Using ${b.pct_used}% of budget. Stay disciplined — about ₹${Math.round(b.remaining_paise / 100).toLocaleString("en-IN")} left for ${Math.ceil((new Date("2026-09-30").getTime() - today.getTime()) / 86400000)} days.`
                  : b.status === "under"
                    ? `Only ${b.pct_used}% used — consider increasing next month's budget or rolling over the surplus.`
                    : `Healthy pace at ${b.pct_used}%. On track to stay within budget this month.`;
            return (
              <motion.div key={b.category} variants={item}>
                <div
                  className="premium-card p-4 cursor-pointer"
                  onClick={() =>
                    setExpandedBudget(isExpanded ? null : b.category)
                  }
                  role="button"
                  aria-expanded={isExpanded}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setExpandedBudget(isExpanded ? null : b.category);
                    }
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: color }}
                      />
                      <h3 className="text-[14px] font-semibold truncate">
                        {b.category}
                      </h3>
                      {b.rollover_paise > 0 && (
                        <Badge label="Rollover" variant="gold" />
                      )}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>

                  <div className="flex items-baseline justify-between mt-2">
                    <span
                      className="text-[18px] font-display font-bold tabular-nums tracking-[-0.02em]"
                      style={{ color: isOver ? "var(--negative)" : "var(--foreground)" }}
                    >
                      {formatPaise(b.spent_paise, { style: "compact" })}
                    </span>
                    <span className="text-[12px] text-[var(--text-tertiary)] font-mono">
                      of {formatPaise(b.budgeted_paise, { style: "compact" })}
                    </span>
                  </div>

                  {/* Progress bar — animated */}
                  <div className="h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden mt-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${Math.min(100, b.pct_used)}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: EASE }}
                      className="h-full rounded-full"
                      style={{
                        background: isOver
                          ? "var(--negative)"
                          : tone === "warning"
                            ? "var(--warning)"
                            : "var(--positive)",
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 text-[11px]">
                    <span className="font-mono text-[var(--text-tertiary)] tabular-nums">
                      {b.pct_used}% used
                    </span>
                    <span
                      className="font-semibold tabular-nums"
                      style={{
                        color: isOver ? "var(--negative)" : "var(--positive)",
                      }}
                    >
                      {isOver
                        ? `${formatPaise(Math.abs(b.remaining_paise))} over`
                        : `${formatPaise(b.remaining_paise)} left`}
                    </span>
                  </div>

                  {/* Drill-down */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex flex-col gap-3">
                          <div className="flex items-start gap-2">
                            <Lightbulb
                              className="w-4 h-4 mt-0.5 shrink-0"
                              style={{ color: "var(--gold)" }}
                            />
                            <p className="text-[12px] leading-[1.5] text-[var(--text-secondary)]">
                              {advice}
                            </p>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-[10px] bg-[var(--surface-subtle)] p-2 flex flex-col gap-0.5">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                                Budget
                              </span>
                              <span className="text-[12px] font-semibold tabular-nums">
                                {formatPaise(b.budgeted_paise, { style: "compact" })}
                              </span>
                            </div>
                            <div className="rounded-[10px] bg-[var(--surface-subtle)] p-2 flex flex-col gap-0.5">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                                Spent
                              </span>
                              <span className="text-[12px] font-semibold tabular-nums">
                                {formatPaise(b.spent_paise, { style: "compact" })}
                              </span>
                            </div>
                            <div className="rounded-[10px] bg-[var(--surface-subtle)] p-2 flex flex-col gap-0.5">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                                Rollover
                              </span>
                              <span className="text-[12px] font-semibold tabular-nums">
                                {formatPaise(b.rollover_paise, { style: "compact" })}
                              </span>
                            </div>
                          </div>
                          <Link
                            href="/transactions"
                            className="text-[12px] font-semibold text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
                          >
                            View Transactions <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* ── 4. Upcoming Bills Calendar ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionHeader
          title="Upcoming Bills"
          action={
            <Link
              href="/recurring"
              className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
            >
              All Recurring <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="premium-card p-5">
          <div className="relative pl-1">
            {/* Timeline connector */}
            <div className="absolute left-[20px] top-2 bottom-2 w-px bg-[var(--border-subtle)]" />
            {(["thisWeek", "nextWeek", "later"] as const).map((group) => {
              const items = groupedEvents[group];
              if (items.length === 0) return null;
              const label =
                group === "thisWeek"
                  ? "This Week"
                  : group === "nextWeek"
                    ? "Next Week"
                    : "Later";
              return (
                <div key={group} className="mb-4 last:mb-0">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-2 ml-12">
                    {label}
                  </p>
                  <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-col gap-1"
                  >
                    {items.map((e) => {
                      const Icon = calTypeIcon(e.type);
                      const c = calTypeColor(e.type, e.severity);
                      const days = Math.ceil(
                        (new Date(e.date).getTime() - today.getTime()) / 86400000,
                      );
                      const isIncome = e.type === "income";
                      return (
                        <motion.div
                          key={e.id}
                          variants={item}
                          className="flex items-center gap-3 py-2 relative"
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10 bg-[var(--surface)] border"
                            style={{
                              borderColor: c,
                              background: `color-mix(in oklab, ${c} 10%, var(--surface))`,
                            }}
                          >
                            <Icon className="w-4 h-4" style={{ color: c }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-[13px] font-semibold truncate">
                                {e.title}
                              </h4>
                              {e.severity === "high" && (
                                <Badge label="Urgent" variant="negative" />
                              )}
                              {isIncome && (
                                <Badge label="Income" variant="positive" />
                              )}
                            </div>
                            <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5">
                              {formatDate(e.date, { style: "long" })} · in{" "}
                              {days} day{days !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <span
                            className="text-[13px] font-semibold tabular-nums shrink-0"
                            style={{ color: isIncome ? "var(--positive)" : "var(--foreground)" }}
                          >
                            {formatPaise(
                              isIncome ? e.amount_paise : -e.amount_paise,
                              { style: "signed" },
                            )}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── 5. Recurring Summary ────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <SectionHeader title="Recurring" />
        <Link href="/recurring" className="premium-card p-5 block group">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center shrink-0">
              <Repeat2 className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold">Monthly Recurring</h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                {recurring.count} active series · all confirmed & scheduled
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] -rotate-90" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                <ArrowDownRight className="w-3 h-3" style={{ color: "var(--negative)" }} />
                Outflow
              </div>
              <span className="text-[15px] font-display font-bold tabular-nums">
                {formatPaise(recurring.outflow, { style: "compact" })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                <ArrowUpRight className="w-3 h-3" style={{ color: "var(--positive)" }} />
                Inflow
              </div>
              <span className="text-[15px] font-display font-bold tabular-nums">
                {formatPaise(recurring.inflow, { style: "compact" })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Net / month
              </div>
              <span
                className="text-[15px] font-display font-bold tabular-nums"
                style={{
                  color: recurring.net >= 0 ? "var(--positive)" : "var(--negative)",
                }}
              >
                {formatPaise(recurring.net, { style: "signed" })}
              </span>
            </div>
          </div>
        </Link>
      </motion.section>

      {/* ── 6. Peer Comparison ──────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionHeader
          title="How You Compare"
          action={
            <Link
              href="/financial-health"
              className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
            >
              Full Comparison <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="premium-card p-5">
          {/* Bracket banner */}
          <div
            className="rounded-[12px] p-3 flex items-center gap-2 mb-4"
            style={{
              background:
                "linear-gradient(90deg, var(--accent-light), color-mix(in oklab, var(--gold) 8%, var(--surface)))",
            }}
          >
            <Users className="w-4 h-4 text-[var(--accent)] shrink-0" />
            <p className="text-[12px] font-mono text-[var(--text-secondary)] flex-1">
              {peerComparison.bracket}
            </p>
            <span className="text-[11px] font-mono font-semibold text-[var(--accent)]">
              {peerComparison.total_peers.toLocaleString("en-IN")} peers
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {peerRows.map((row) => {
              const youWin = row.higherIsBetter
                ? row.yourValue >= row.peerMedian
                : row.yourValue <= row.peerMedian;
              // Compute bar widths as % of max of (yourValue, top10) or peer
              const barMax =
                row.top10 != null
                  ? Math.max(row.yourValue, row.top10, row.peerMedian)
                  : Math.max(row.yourValue, row.peerMedian) * 1.1;
              const yourPct = (row.yourValue / barMax) * 100;
              const peerPct = (row.peerMedian / barMax) * 100;
              const top10Pct =
                row.top10 != null ? (row.top10 / barMax) * 100 : null;
              const yourColor = youWin
                ? "var(--positive)"
                : "var(--text-tertiary)";
              const delta = row.yourValue - row.peerMedian;
              const deltaFmt = row.higherIsBetter
                ? `+${row.format(Math.abs(delta))}`
                : `−${row.format(Math.abs(delta))}`;
              return (
                <div key={row.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold">
                      {row.label}
                    </span>
                    <span
                      className="text-[11px] font-mono font-semibold tabular-nums"
                      style={{
                        color: youWin ? "var(--positive)" : "var(--text-tertiary)",
                      }}
                    >
                      {deltaFmt} vs median
                    </span>
                  </div>
                  <div className="relative h-7 rounded-[8px] bg-[var(--surface-subtle)] overflow-hidden">
                    {/* Peer median marker (vertical line) */}
                    <div
                      className="absolute top-0 bottom-0 w-px bg-[var(--text-tertiary)] opacity-60"
                      style={{ left: `${peerPct}%` }}
                    />
                    {/* Your bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${yourPct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: EASE }}
                      className="h-full rounded-[8px] flex items-center justify-end pr-2"
                      style={{
                        background: youWin
                          ? "linear-gradient(90deg, color-mix(in oklab, var(--positive) 30%, transparent), var(--positive))"
                          : "linear-gradient(90deg, color-mix(in oklab, var(--text-tertiary) 20%, transparent), var(--text-tertiary))",
                      }}
                    >
                      <span className="text-[10px] font-mono font-semibold text-white whitespace-nowrap">
                        You · {row.format(row.yourValue)}
                      </span>
                    </motion.div>
                    {/* Top 10% gold marker */}
                    {top10Pct != null && (
                      <div
                        className="absolute top-0 bottom-0 w-0.5"
                        style={{
                          left: `calc(${top10Pct}% - 1px)`,
                          background: "var(--gold)",
                          boxShadow: "0 0 4px var(--gold-glow)",
                        }}
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-tertiary)]">
                    <span>Peer median · {row.format(row.peerMedian)}</span>
                    {top10Pct != null && (
                      <span className="text-[var(--gold)]">
                        Top 10% · {row.format(row.top10!)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-[var(--border-subtle)] text-[10px] font-mono text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-1.5 rounded-[2px] bg-[var(--positive)]" />
              You
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-px h-3 bg-[var(--text-tertiary)]" />
              Peer median
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-0.5 h-3 bg-[var(--gold)]" />
              Top 10%
            </span>
          </div>
        </div>
      </motion.section>

      {/* ── 7. Cashflow Preview — ALIVE ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <SectionHeader
          title="Cashflow · Last 12 Months"
          action={
            <Link
              href="/cashflow"
              className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
            >
              Full Cashflow <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="premium-card p-5">
          <CashflowInlineChart />
          {/* Net flow summary */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                <ArrowUpRight className="w-3 h-3" style={{ color: "var(--positive)" }} />
                Total Income
              </div>
              <span className="text-[16px] font-display font-bold tabular-nums">
                {formatPaise(totalIncome, { style: "compact" })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                <ArrowDownRight className="w-3 h-3" style={{ color: "var(--negative)" }} />
                Total Expense
              </div>
              <span className="text-[16px] font-display font-bold tabular-nums">
                {formatPaise(totalExpense, { style: "compact" })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Net Flow
              </div>
              <span
                className="text-[16px] font-display font-bold tabular-nums"
                style={{
                  color: totalNet >= 0 ? "var(--positive)" : "var(--negative)",
                }}
              >
                {formatPaise(totalNet, { style: "signed" })}
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 8. Forecast Preview — ALIVE ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionHeader
          title="Forecast · Next 90 Days"
          action={
            <Link
              href="/forecast"
              className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
            >
              Full Forecast <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="premium-card p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-[10px] bg-[var(--gold-light)] flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  30-Day Projected Balance
                </p>
                <CountUp
                  value={forecast30.projected_balance_paise}
                  format={(v) => formatPaise(Math.round(v))}
                  duration={1500}
                  className="text-[24px] font-display font-bold tabular-nums tracking-[-0.02em] block leading-none mt-0.5"
                />
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Confidence
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Sparkles className="w-3.5 h-3.5" style={{ color: confColor }} />
                <span
                  className="text-[14px] font-display font-semibold tabular-nums"
                  style={{ color: confColor }}
                >
                  {confPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden mb-4">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${confPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, color-mix(in oklab, ${confColor} 40%, transparent), ${confColor})`,
              }}
            />
          </div>

          <ForecastInlineChart />

          {/* Horizon chips */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[var(--border-subtle)]">
            {forecastData.horizons.map((h) => {
              const hpct = Math.round(h.confidence * 100);
              const hc: Tone =
                hpct >= 85 ? "positive" : hpct >= 70 ? "warning" : "negative";
              return (
                <div
                  key={h.days}
                  className="rounded-[10px] bg-[var(--surface-subtle)] p-2.5 flex flex-col gap-1"
                >
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                    {h.label}
                  </span>
                  <span className="text-[12px] font-semibold tabular-nums">
                    {formatPaise(h.projected_balance_paise, { style: "compact" })}
                  </span>
                  <span
                    className="text-[10px] font-mono tabular-nums"
                    style={{ color: toneColor(hc) }}
                  >
                    {hpct}% conf
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── 9. Savings Challenge (52-Week) ──────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <SectionHeader
          title="52-Week Savings Challenge"
          action={<Badge label="Active" variant="gold" />}
        />
        <div className="premium-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center shrink-0">
              <PiggyBank className="w-4 h-4 text-[var(--accent)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold">Save a little more every week</h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                Week {CHALLENGE_CURRENT_WEEK} · {formatPaise(CHALLENGE_THIS_WEEK)} this week
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Current Week
              </span>
              <span className="text-[18px] font-display font-bold tabular-nums">
                <CountUp value={CHALLENGE_CURRENT_WEEK} />/{CHALLENGE_TOTAL_WEEKS}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                This Week
              </span>
              <span
                className="text-[18px] font-display font-bold tabular-nums"
                style={{ color: "var(--gold)" }}
              >
                {formatPaise(CHALLENGE_THIS_WEEK, { style: "compact" })}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Total Saved
              </span>
              <span
                className="text-[18px] font-display font-bold tabular-nums"
                style={{ color: "var(--positive)" }}
              >
                {formatPaise(CHALLENGE_SAVED, { style: "compact" })}
              </span>
            </div>
          </div>

          {/* Heatmap */}
          <SavingsHeatmap />

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 text-[10px] font-mono text-[var(--text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--surface-subtle)]" />
              Pending
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--positive)]" />
              Saved
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-[3px] bg-[var(--gold)]" />
              This week
            </span>
          </div>

          {/* Progress to target */}
          <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between mb-2 text-[12px]">
              <span className="text-[var(--text-secondary)]">
                Progress to{" "}
                <span className="font-semibold">
                  {formatPaise(CHALLENGE_TARGET, { style: "compact" })}
                </span>
              </span>
              <span className="font-mono font-semibold tabular-nums">
                {Math.round((CHALLENGE_SAVED / CHALLENGE_TARGET) * 100)}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{
                  width: `${Math.round((CHALLENGE_SAVED / CHALLENGE_TARGET) * 100)}%`,
                }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--accent), var(--gold))",
                }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[10px] font-mono text-[var(--text-tertiary)]">
              <span>Week 1 · {formatPaise(weekDepositPaise(1))}</span>
              <span>Week 52 · {formatPaise(weekDepositPaise(52))}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 10. Debt Payoff Planner (NEW 2026) ──────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <SectionHeader
          title="Debt Payoff Planner"
          action={<Badge label="2026" variant="ai" />}
        />
        <div className="premium-card p-5">
          {/* Current debt */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--negative-light)] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-[var(--negative)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[14px] font-semibold">Axis Bank Credit Card</h3>
              <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                Outstanding · 36% APR · Min due {formatPaise(225000)}
              </p>
            </div>
            <span className="text-[20px] font-display font-bold tabular-nums text-[var(--negative)]">
              {formatPaise(DEBT_Paise)}
            </span>
          </div>

          {/* Strategy toggle */}
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setDebtStrategy("snowball")}
              className={`flex-1 rounded-[12px] p-3 flex items-center gap-2.5 border transition-all ${
                debtStrategy === "snowball"
                  ? "border-[var(--accent)] bg-[var(--accent-light)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] hover:border-[var(--border-strong)]"
              }`}
            >
              <Snowflake
                className={`w-4 h-4 shrink-0 ${debtStrategy === "snowball" ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]"}`}
              />
              <div className="text-left min-w-0">
                <p className="text-[12px] font-semibold">Snowball</p>
                <p className="text-[10px] font-mono text-[var(--text-tertiary)]">
                  Smallest first
                </p>
              </div>
            </button>
            <button
              onClick={() => setDebtStrategy("avalanche")}
              className={`flex-1 rounded-[12px] p-3 flex items-center gap-2.5 border transition-all ${
                debtStrategy === "avalanche"
                  ? "border-[var(--accent)] bg-[var(--accent-light)]"
                  : "border-[var(--border-subtle)] bg-[var(--surface-subtle)] hover:border-[var(--border-strong)]"
              }`}
            >
              <Mountain
                className={`w-4 h-4 shrink-0 ${debtStrategy === "avalanche" ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]"}`}
              />
              <div className="text-left min-w-0">
                <p className="text-[12px] font-semibold">Avalanche</p>
                <p className="text-[10px] font-mono text-[var(--text-tertiary)]">
                  Highest interest
                </p>
              </div>
            </button>
          </div>

          {/* Monthly payment slider */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-semibold">Monthly Payment</span>
              <span className="text-[18px] font-display font-bold tabular-nums">
                {formatPaise(monthlyPayment * 100)}
              </span>
            </div>
            <input
              type="range"
              min={2500}
              max={15000}
              step={500}
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--surface-subtle)] accent-[var(--accent)]"
              style={{
                background: `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${((monthlyPayment - 2500) / (15000 - 2500)) * 100}%, var(--surface-subtle) ${((monthlyPayment - 2500) / (15000 - 2500)) * 100}%, var(--surface-subtle) 100%)`,
              }}
            />
            <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-[var(--text-tertiary)]">
              <span>Min {formatPaise(250000)}</span>
              <span>Max {formatPaise(1500000)}</span>
            </div>
          </div>

          {/* Payoff projection */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-[12px] bg-[var(--surface-subtle)] p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                <Calendar className="w-3 h-3" />
                Payoff
              </div>
              <span className="text-[14px] font-semibold">
                {formatDate(activePayoffDate.toISOString(), { style: "short" })}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-tertiary)] tabular-nums">
                in {activeMonths} months
              </span>
            </div>
            <div className="rounded-[12px] bg-[var(--surface-subtle)] p-3 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                <TrendingUp className="w-3 h-3" style={{ color: "var(--negative)" }} />
                Total Interest
              </div>
              <span className="text-[14px] font-semibold tabular-nums">
                {formatPaise(totalInterestPaise, { style: "compact" })}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                @ 36% APR
              </span>
            </div>
            <div
              className="rounded-[12px] p-3 flex flex-col gap-1"
              style={{ background: "var(--positive-light)" }}
            >
              <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--positive)" }}>
                <Sparkles className="w-3 h-3" />
                Saved
              </div>
              <span
                className="text-[14px] font-semibold tabular-nums"
                style={{ color: "var(--positive)" }}
              >
                {formatPaise(interestSavedPaise, { style: "compact" })}
              </span>
              <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
                vs min payment
              </span>
            </div>
          </div>

          {/* Mini progress visual */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[var(--text-secondary)] font-mono">
                Debt cleared
              </span>
              <span className="font-mono font-semibold tabular-nums">
                {Math.min(100, Math.round((monthlyPayment * activeMonths * 100 / DEBT_Paise) * 100)) > 100 ? 100 : Math.round((monthlyPayment * activeMonths * 100 / DEBT_Paise) * 100)}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
              <motion.div
                animate={{
                  width: `${Math.min(100, Math.round((monthlyPayment * activeMonths * 100 / DEBT_Paise) * 100))}%`,
                }}
                transition={{ duration: 0.4, ease: EASE }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, var(--negative), color-mix(in oklab, var(--negative) 50%, var(--positive)))",
                }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── 11. Gamification Hub ────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <SectionHeader
          title="Your Progress"
          action={
            <Link
              href="/you"
              className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1"
            >
              Full Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <Link href="/you" className="premium-card p-5 block group">
          {/* Level + Streak */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Level */}
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <ProgressRing
                  pct={xpPct}
                  size={56}
                  stroke={5}
                  color="var(--gold)"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-[var(--gold)]" />
                </div>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  Level
                </p>
                <p className="text-[18px] font-display font-bold leading-none mt-0.5">
                  {gamification.level}
                </p>
                <p className="text-[11px] font-medium text-[var(--gold)] mt-0.5">
                  {gamification.level_name}
                </p>
              </div>
            </div>
            {/* Streak */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1 mb-1.5">
                <Flame className="w-4 h-4 text-[var(--warning)]" />
                <span className="text-[18px] font-display font-bold tabular-nums">
                  {gamification.tracking_streak_days}
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)]">
                  day streak
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 10 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: EASE,
                      delay: 0.04 * i,
                    }}
                  >
                    <Flame
                      className="w-3 h-3"
                      style={{
                        color: i < streakFlames ? "var(--warning)" : "var(--text-muted)",
                        fill: i < streakFlames ? "var(--warning)" : "none",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-mono text-[var(--text-tertiary)]">
                {gamification.xp.toLocaleString("en-IN")} / {gamification.xp_to_next_level.toLocaleString("en-IN")} XP
              </span>
              <span className="font-mono text-[var(--text-tertiary)]">
                {xpRemaining.toLocaleString("en-IN")} to Level 5
              </span>
            </div>
            <div className="h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${xpPct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: EASE }}
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, var(--accent), var(--gold))",
                }}
              />
            </div>
          </div>

          {/* Badges */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                Badges
              </span>
              <span className="text-[10px] font-mono text-[var(--gold)] font-semibold tabular-nums">
                {earnedBadges} / {totalBadges}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {gamification.badges.map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.05 * i, ease: EASE }}
                  title={b.name}
                  className="relative w-10 h-10 rounded-[12px] flex items-center justify-center"
                  style={{
                    background: b.earned
                      ? "var(--gold-light)"
                      : "var(--surface-subtle)",
                    opacity: b.earned ? 1 : 0.4,
                  }}
                >
                  <span className="text-[16px]">{b.icon}</span>
                  {!b.earned && (
                    <Lock className="absolute -top-1 -right-1 w-3 h-3 text-[var(--text-tertiary)] bg-[var(--surface)] rounded-full p-0.5" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Milestones preview */}
          <div className="pt-4 border-t border-[var(--border-subtle)]">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] mb-3">
              Next Milestones
            </p>
            <div className="flex flex-col gap-3">
              {milestonePreviews.map((m) => {
                const pct =
                  m.target && typeof m.progress === "number"
                    ? Math.min(100, Math.round((m.progress / m.target) * 100))
                    : 0;
                const progressLabel =
                  m.id === "m10"
                    ? `${formatPaise(m.progress ?? 0, { style: "compact" })} of ${formatPaise(m.target ?? 0, { style: "compact" })}`
                    : `${m.progress ?? 0} / ${m.target ?? 0}`;
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
                      <span className="text-[16px]">{m.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[12px] font-semibold truncate">
                          {m.title}
                        </p>
                        <span className="text-[10px] font-mono text-[var(--text-tertiary)] tabular-nums shrink-0 ml-2">
                          {progressLabel}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden mt-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: EASE }}
                          className="h-full rounded-full"
                          style={{
                            background: "linear-gradient(90deg, var(--accent), var(--gold))",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Link>
      </motion.section>

      {/* ── Footer CTA: Ask AI ───────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Link
          href="/ai"
          className="premium-card-glow p-5 flex items-center gap-4 group block"
        >
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--gold))",
            }}
          >
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-semibold">
              Ask FinCopilot about your plan
            </h3>
            <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 truncate">
              &ldquo;Can I afford to increase my SIP this month?&rdquo;
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--accent)] shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.section>
    </div>
  );
}
