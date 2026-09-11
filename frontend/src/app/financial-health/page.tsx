"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, ArrowDownRight,
  TrendingUp, ShieldCheck, Wallet, PiggyBank, Lightbulb,
  Users, Activity, Trophy,
} from "lucide-react";
import {
  SectionHeader, Badge, ProgressRing, CountUp,
} from "@/components/shared";

import { formatPct } from "@/lib/format";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object,label } from "@/lib/response";
const loadHealth=async()=>object(await api.getFinancialHealth());

// ── Helpers ──────────────────────────────────────────────

type Status = "positive" | "warning" | "negative";

function statusToColor(status: string): Status {
  const s = status.toLowerCase();
  if (
    s === "healthy" ||
    s === "on_track" ||
    s === "excellent" ||
    s === "strong"
  ) {
    return "positive";
  }
  if (
    s === "low" ||
    s === "moderate" ||
    s === "below" ||
    s === "watch" ||
    s === "warning"
  ) {
    return "warning";
  }
  return "negative";
}

function colorVar(s: Status): string {
  return s === "positive"
    ? "var(--positive)"
    : s === "warning"
      ? "var(--warning)"
      : "var(--negative)";
}

function colorLightVar(s: Status): string {
  return s === "positive"
    ? "var(--positive-light)"
    : s === "warning"
      ? "var(--warning-light)"
      : "var(--negative-light)";
}

function prettifyStatus(status: string): string {
  return status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ── Page ──────────────────────────────────────────────────

export default function FinancialHealthPage() {
  const state=useResource(loadHealth);
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const financialHealth=state.data;const drivers=object(financialHealth.drivers);
  const metrics=[
    {key:'cash_buffer',field:'cash_buffer_months',label:'Cash buffer',icon:Wallet,target:'Months of essential expenses',suffix:' mo',scale:12},
    {key:'commitment_load',field:'commitment_load_ratio',label:'Commitment load',icon:Activity,target:'Share of confirmed income committed',suffix:'%',scale:1},
    {key:'savings_pace',field:'savings_pace_ratio',label:'Savings pace',icon:PiggyBank,target:'Against your goal contribution targets',suffix:'%',scale:1},
    {key:'spending_stability',field:'spending_stability_cv',label:'Spending stability',icon:TrendingUp,target:'Weekly coefficient of variation',suffix:' CV',scale:1},
    {key:'emergency_fund',field:'emergency_fund_months',label:'Emergency fund',icon:ShieldCheck,target:'Track a dedicated goal in Dream milestones',suffix:' mo',scale:12}
  ].map(item=>{const driver=object(drivers[item.key]??{});const raw=financialHealth[item.field];const value=typeof raw==='number'&&Number.isFinite(raw)&&driver.coverage!=='unknown'?raw:null;return {...item,numericValue:value===null?null:item.suffix==='%'?value*100:value,value:value===null?'Unavailable':`${(item.suffix==='%'?value*100:value).toFixed(1)}${item.suffix}`,pct:value===null?0:Math.max(0,Math.min(100,value/item.scale*100)),status:label(financialHealth[item.key+'_status'],'missing'),driver:label(driver.reason,'This metric is not available from the current records.')};});
  const recommendations=metrics.map(metric=>({icon:metric.icon,title:metric.label,description:metric.driver,tone:statusToColor(metric.status),cta:metric.key.includes('savings')||metric.key==='emergency_fund'?'Review goals':metric.key==='commitment_load'?'Review recurring activity':'Review data coverage',href:metric.key.includes('savings')||metric.key==='emergency_fund'?'/goals':metric.key==='commitment_load'?'/recurring':'/data-coverage'}));
  const peerComparison={bracket:'No validated peer cohort is available for this account.'};
  const peerRows:{label:string;yourValue:number;peerMedian:number;top10:number|null;unit:string;higherIsBetter:boolean;format:(value:number)=>string}[]=[];

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* ── Header ───────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-[8px] bg-[var(--accent-light)] flex items-center justify-center">
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-tertiary)">
            Financial Health
          </span>
        </div>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">
          Financial fitness
        </h1>
        <p className="text-[14px] text-(--text-secondary) mt-1 max-w-md">
          A snapshot of your recorded indicators — plus tailored recommendations
          and transparent data availability.
        </p>
      </motion.header>

      {/* ── Health metric cards ──────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric, i) => {
            const status = statusToColor(metric.status);
            const color = colorVar(status);
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="premium-card p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                      style={{ background: colorLightVar(status) }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
                        {metric.label}
                      </p>
                      <p className="text-[11px] text-(--text-tertiary) mt-0.5">
                        {metric.target}
                      </p>
                    </div>
                  </div>
                  <Badge
                    label={prettifyStatus(metric.status)}
                    variant={
                      status === "positive"
                        ? "positive"
                        : status === "warning"
                          ? "warning"
                          : "negative"
                    }
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative shrink-0">
                    <ProgressRing
                      pct={metric.pct}
                      size={84}
                      stroke={7}
                      color={color}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[13px] font-display font-bold tabular-nums">
                        {metric.numericValue===null?"N/A":"Recorded"}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-[28px] tracking-[-0.02em] block leading-none">{metric.value}</p>
                    <p className="text-[12px] text-(--text-secondary) mt-1 leading-normal">
                      {metric.driver}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Recommendations ───────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionHeader
          title="Tips"
          action={
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              <Lightbulb className="w-3 h-3 text-(--warning)" />
              General guidance
            </span>
          }
        />
        <div className="flex flex-col gap-3">
          {recommendations.map((rec, i) => {
            const Icon = rec.icon;
            const color = colorVar(rec.tone);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              >
                <Link
                  href={rec.href}
                  className="premium-card p-4 flex items-start gap-3 group hover:border-accent transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                    style={{ background: colorLightVar(rec.tone) }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-semibold">{rec.title}</h3>
                    <p className="text-[13px] text-(--text-secondary) leading-normal mt-1">
                      {rec.description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-2.5 text-[12px] font-medium text-accent group-hover:text-(--accent-hover) transition-colors">
                      {rec.cta}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Peer Comparison ──────────────────────────────── */}
      <motion.section
        id="peer"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SectionHeader
          title="How you compare"
          action={
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              <Users className="w-3 h-3" />
              Anonymous peers
            </span>
          }
        />

        {/* Bracket banner */}
        <div className="premium-card p-4 mb-3 flex items-center gap-3 bg-linear-to-br from-(--accent-light) to-(--gold-light)">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface)] flex items-center justify-center shadow-sm shrink-0">
            <Users className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold">Your peer bracket</p>
            <p className="text-[12px] text-(--text-secondary) truncate">
              {peerComparison.bracket}
            </p>
          </div>
          <span className="text-[12px] font-mono tabular-nums text-(--text-tertiary) shrink-0">
            Unavailable
          </span>
        </div>

        {/* Peer rows */}
        <div className="premium-card overflow-hidden">
          {peerRows.length===0&&<p className="p-5 text-sm text-(--text-secondary)">Comparisons will appear only when a validated, consented comparison dataset is available. No demographic bracket or peer percentile has been assigned.</p>}
          {peerRows.map((row, i) => {
            const delta = row.yourValue - row.peerMedian;
            const youWin =
              row.higherIsBetter === delta > 0 ||
              (!row.higherIsBetter && delta < 0);
            const winColor = youWin ? "var(--positive)" : "var(--negative)";
            const WinIcon = row.higherIsBetter
              ? delta > 0
                ? ArrowUpRight
                : ArrowDownRight
              : delta > 0
                ? ArrowDownRight
                : ArrowUpRight;

            // Bar widths (% relative to peerMedian baseline + 50% headroom)
            const yourPctOfRef =
              row.peerMedian > 0
                ? Math.min(120, (row.yourValue / row.peerMedian) * 100)
                : Math.min(120, row.yourValue * 20);
            const peerWidth = 100; // baseline
            const top10Pct =
              row.top10 != null && row.peerMedian > 0
                ? Math.min(120, (row.top10 / row.peerMedian) * 100)
                : null;

            return (
              <div
                key={row.label}
                className={`p-4 ${i < peerRows.length - 1 ? "border-b border-(--border-subtle)" : ""}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] font-medium">{row.label}</span>
                  <span
                    className="inline-flex items-center gap-1 text-[12px] font-semibold"
                    style={{ color: winColor }}
                  >
                    <WinIcon className="w-3.5 h-3.5" />
                    {delta > 0 ? "+" : "−"}
                    {row.format(Math.abs(delta))}
                  </span>
                </div>

                {/* Bar viz */}
                <div className="relative h-9 rounded-[10px] bg-[var(--surface-subtle)] overflow-hidden">
                  {/* Peer median marker */}
                  <div
                    className="absolute top-0 bottom-0 w-px bg-[var(--text-tertiary)] opacity-50"
                    style={{ left: `${peerWidth / 1.2}%` }}
                    aria-hidden
                  />
                  {/* Your bar */}
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(yourPctOfRef / 1.2)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute top-1 bottom-1 left-1 rounded-[8px]"
                    style={{
                      background: youWin
                        ? "linear-gradient(90deg, var(--accent), color-mix(in oklab, var(--accent) 70%, var(--gold)))"
                        : "linear-gradient(90deg, var(--warning), color-mix(in oklab, var(--warning) 70%, var(--negative)))",
                    }}
                  />
                  {/* Top 10 marker */}
                  {top10Pct != null && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-[var(--gold)] opacity-80"
                      style={{ left: `${(top10Pct / 1.2)}%` }}
                      aria-hidden
                    />
                  )}
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-white mix-blend-difference">
                    You: {row.format(row.yourValue)}
                  </span>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-2 text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">
                  <span>
                    Peer median: <span className="text-foreground font-semibold">{row.format(row.peerMedian)}</span>
                  </span>
                  {row.top10 != null && (
                    <span>
                      Top 10%: <span className="text-[var(--gold)] font-semibold">{row.format(row.top10)}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Footer note ───────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65 }}
        className="text-[11px] text-(--text-tertiary) text-center max-w-lg mx-auto leading-normal"
      >
        Tips are general guidance based on common personal-finance best practices. Always consider your own circumstances before acting.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Link
          href="/plan"
          className="premium-card p-4 flex items-center gap-3 group hover:border-accent transition-colors"
        >
          <div className="w-10 h-10 rounded-[12px] bg-linear-to-br from-accent to-(--gold) flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-accent-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold">Track your progress monthly</p>
            <p className="text-[12px] text-(--text-secondary)">
              See your goals, budgets, and upcoming commitments in one place.
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-(--text-tertiary) group-hover:text-accent transition-colors" />
        </Link>
      </motion.div>
    </div>
  );
}
