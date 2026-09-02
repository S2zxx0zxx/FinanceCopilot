"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { TrendingUp, TrendingDown, AlertTriangle, Bell, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Section Header ──────────────────────────────────────────────────────────

export function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-display font-semibold text-[16px] tracking-[-0.01em] text-[var(--foreground)]">{title}</h2>
      {action}
    </div>
  );
}

// ── Metric Card ──────────────────────────────────────────────────────────────────

export function MetricCard({
  label,
  value,
  delta,
  deltaPositive,
  sparkline,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  sparkline?: React.ReactNode;
}) {
  return (
    <div className="premium-card p-4 flex flex-col gap-2">
      <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">{label}</span>
      <span className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em]">{value}</span>
      {delta && (
        <div className="flex items-center gap-1 text-[12px]">
          {deltaPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-[var(--positive)]" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-[var(--negative)]" />
          )}
          <span className={deltaPositive ? "text-[var(--positive)]" : "text-[var(--negative)]"}>{delta}</span>
        </div>
      )}
      {sparkline && <div className="h-8 mt-1">{sparkline}</div>}
    </div>
  );
}

// ── Freshness Badge ───────────────────────────────────────────────────────────────

export function FreshnessBadge({ status }: { status: "live" | "recent" | "stale" | "estimated" }) {
  const config = {
    live: { label: "Live", color: "var(--positive)", dot: true },
    recent: { label: "Updated", color: "var(--text-tertiary)", dot: false },
    stale: { label: "Stale", color: "var(--warning)", dot: false },
    estimated: { label: "Estimated", color: "var(--text-tertiary)", dot: false },
  }[status];

  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-tertiary)]">
      {config.dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: config.color, animation: "pulse-dot 2s ease-in-out infinite" }}
        />
      )}
      {config.label}
    </span>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────────────

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="premium-card p-8 flex flex-col items-center text-center gap-3">
      {icon && <div className="text-[var(--text-tertiary)]">{icon}</div>}
      <h3 className="font-display font-semibold text-[16px]">{title}</h3>
      {description && <p className="text-[14px] text-[var(--text-secondary)] max-w-sm">{description}</p>}
      {action}
    </div>
  );
}

// ── Error State ─────────────────────────────────────────────────────────────────

export function ErrorState({
  title = "Couldn't load",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="premium-card p-8 flex flex-col items-center text-center gap-3 border-[var(--negative)]/30">
      <div className="w-10 h-10 rounded-full bg-[var(--negative-light)] flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-[var(--negative)]" />
      </div>
      <h3 className="font-display font-semibold text-[16px]">{title}</h3>
      {description && <p className="text-[14px] text-[var(--text-secondary)] max-w-sm">{description}</p>}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 rounded-[10px] bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

export function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn("skeleton h-[120px] rounded-[var(--radius-lg)]", className)} />;
}

export function SkeletonText({ width = "100%", className }: { width?: string; className?: string }) {
  return <div className={cn("skeleton h-4 rounded-[6px]", className)} style={{ width }} />;
}

// ── Attention Item ───────────────────────────────────────────────────────────

export function AttentionItem({
  title,
  description,
  severity,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  severity: "warning" | "info" | "positive";
  actionHref: string;
  actionLabel: string;
}) {
  const colorMap = {
    warning: "var(--warning)",
    info: "var(--info)",
    positive: "var(--positive)",
  };
  const Icon = severity === "warning" ? Bell : AlertTriangle;

  return (
    <motion.a
      href={actionHref}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="premium-card p-4 flex items-start gap-3 group cursor-pointer"
    >
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ background: `color-mix(in oklab, ${colorMap[severity]} 12%, transparent)` }}
      >
        <Icon className="w-4 h-4" style={{ color: colorMap[severity] }} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-semibold">{title}</h4>
        <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5] mt-0.5">{description}</p>
      </div>
      <span className="text-[12px] font-medium text-[var(--accent)] group-hover:text-[var(--accent-hover)] transition-colors shrink-0">
        {actionLabel} →
      </span>
    </motion.a>
  );
}

// ── Progress Ring (circular) ──────────────────────────────────────────────────

export function ProgressRing({
  pct,
  size = 60,
  stroke = 5,
  color = "var(--accent)",
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(pct, 100) / 100) * c;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-subtle)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 0.8s var(--ease-out-expo)" }}
      />
    </svg>
  );
}

// ── Badge ─────────────────────────────────────────────────────────────────────────

export function Badge({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: "positive" | "warning" | "negative" | "neutral" | "ai" | "gold";
}) {
  const variantMap = {
    positive: "bg-[var(--positive-light)] text-[var(--positive)]",
    warning: "bg-[var(--warning-light)] text-[var(--warning)]",
    negative: "bg-[var(--negative-light)] text-[var(--negative)]",
    neutral: "bg-[var(--surface-subtle)] text-[var(--text-secondary)]",
    ai: "bg-[var(--accent-light)] text-[var(--accent)]",
    gold: "bg-[var(--gold-light)] text-[var(--gold)]",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold", variantMap[variant])}>
      {label}
    </span>
  );
}

// ── Count Up (animated number) ───────────────────────────────────────────────

export function CountUp({
  value,
  format = (v: number) => v.toFixed(0),
  duration = 1500,
  className,
}: {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(2, -10 * p);
      setDisplay(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {format(display)}
    </span>
  );
}
