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

import { formatPaise, formatPct } from "@/lib/format";
import { ForecastComboChart } from "@/components/charts/recharts";
import {
  SectionHeader,
  Badge,
  FreshnessBadge,
  CountUp,
} from "@/components/shared";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object,rows,label,amount } from "@/lib/response";
const loadForecast=async()=>{const [forecast,money]=await Promise.all([api.getForecast(),api.getMoneyState()]);return {outlook:object(object(forecast).outlook),balance:amount(object(object(money).net_position).available_balance_paise)};};
function ForecastAmount({value,...props}:{value:number|null;className?:string;duration?:number;format:(value:number)=>string}){return value===null?<span className={props.className}>Not enough data</span>:<CountUp value={value} {...props}/>;}

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

export default function ForecastPage() {
  const state=useResource(loadForecast);
  const [horizonIdx, setHorizonIdx] = React.useState(1); // default 30 days
  const [showAssumptions, setShowAssumptions] = React.useState(false);

  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const horizons=['7d','30d','90d'].map(key=>{const row=object(state.data!.outlook[key]);return {days:Number.parseInt(key,10),label:key.replace('d',' days'),raw:row,projected_balance_paise:row.status==='FORECAST_UNAVAILABLE'?null:amount(row.pointEstimatePaise),confidence:typeof row.intervalLevel==='number'?row.intervalLevel:null};});
  const horizon=horizons[horizonIdx];
  const forecastData={horizons,timeline:horizons.map(h=>({month:h.label,actual:null,projected:h.projected_balance_paise===null?null:h.projected_balance_paise/100,upper:amount(h.raw.upperBoundPaise)===null?null:amount(h.raw.upperBoundPaise)!/100,lower:amount(h.raw.lowerBoundPaise)===null?null:amount(h.raw.lowerBoundPaise)!/100})),drivers:rows(horizon.raw.drivers??[]).map(row=>{const impact=amount(row.impactPaise);return {label:label(row.description),impact_paise:impact,type:impact===null||impact===0?'neutral':impact>0?'positive':'negative'};})};
  const currentBalance=state.data.balance;
  const projectedDelta=horizon.projected_balance_paise!==null&&currentBalance!==null?horizon.projected_balance_paise-currentBalance:null;
  const ASSUMPTIONS=Object.entries(object(horizon.raw.assumptions??{})).map(([key,value])=>`${key.replace(/([a-z])([A-Z])/g,'$1 $2')}: ${String(value)}`);
  const totalDriversImpact=forecastData.drivers.reduce((sum,driver)=>sum+(driver.impact_paise??0),0);
  const confidenceVariant='neutral' as const;

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
            Future outlook
          </h1>
          <p className="text-[14px] text-(--text-secondary) mt-1">
            Explore estimates, ranges and the assumptions behind them
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
                ? "text-accent-foreground"
                : "text-(--text-secondary) hover:text-foreground"
            }`}
          >
            {horizonIdx === i && (
              <motion.div
                layoutId="forecast-horizon-pill"
                className="absolute inset-0 rounded-full bg-accent"
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
          <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
            Recorded net activity
          </span>
          <ForecastAmount
            value={currentBalance}
            format={(v) => formatPaise(v)}
            duration={1500}
            className="font-display font-bold text-[32px] tabular-nums tracking-[-0.02em]"
          />
          <span className="text-[12px] text-(--text-tertiary) mt-1">
            Opening balances are not included
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="premium-card-glow p-6 flex flex-col gap-2"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
              Projected in {horizon.label}
            </span>
            <Badge
              label={label(horizon.raw.trustState).replaceAll("_"," ")}
              variant={confidenceVariant}
            />
          </div>
          <ForecastAmount
            value={horizon.projected_balance_paise}
            format={(v) => formatPaise(v)}
            duration={1500}
            className="font-display font-bold text-[32px] tabular-nums tracking-[-0.02em]"
          />
          <span
            className={`text-[12px] font-medium tabular-nums ${
              (projectedDelta??0) >= 0
                ? "text-(--positive)"
                : "text-(--negative)"
            }`}
          >
            {(projectedDelta??0) >= 0 ? "↑" : "↓"}{" "}
            {projectedDelta===null?"Comparison unavailable":formatPaise(Math.abs(projectedDelta), { style: "signed" })} vs
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
          <span className="text-[12px] font-mono uppercase tracking-wider text-(--text-tertiary)">
            Prediction interval level
          </span>
        </div>
        <div className="flex-1 h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(horizon.confidence??0) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{
              background:
                (horizon.confidence??0) >= 0.85
                  ? "var(--positive)"
                  : (horizon.confidence??0) >= 0.7
                    ? "var(--warning)"
                    : "var(--negative)",
            }}
          />
        </div>
        <span className="text-[13px] font-semibold tabular-nums shrink-0 w-12 text-right">
          {horizon.confidence===null?"Unavailable":formatPct(horizon.confidence)}
        </span>
      </motion.div>

      {/* Chart */}
      <section>
        <SectionHeader
          title="Estimates by horizon"
          action={
            <span className="text-[12px] font-mono text-(--text-tertiary)">
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
          <ForecastComboChart data={forecastData.timeline} /><p className="text-xs text-(--text-secondary) mt-3">Each point is a separate horizon estimate. Lines connect those estimates; they are not daily predictions.</p>
          <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-(--border-subtle) flex-wrap">
            <span className="flex items-center gap-2 text-[11px] font-mono text-(--text-secondary)">
              <span className="w-3 h-0.5" style={{ background: "var(--chart-1)" }} /> Actual
            </span>
            <span className="flex items-center gap-2 text-[11px] font-mono text-(--text-secondary)">
              <span
                className="w-3 h-0.5"
                style={{ borderTop: "1px dashed var(--chart-2)", background: "transparent" }}
              />{" "}
              Projected
            </span>
            <span className="flex items-center gap-2 text-[11px] font-mono text-(--text-secondary)">
              <span
                className="w-3 h-2 rounded-sm"
                style={{ background: "color-mix(in oklab, var(--chart-1) 20%, transparent)" }}
              /> Confidence
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
            <span className="text-[12px] font-mono text-(--text-tertiary)">
              net {formatPaise(totalDriversImpact, { style: "signed" })} across this horizon
            </span>
          }
        />
        <div className="premium-card overflow-hidden">
          {forecastData.drivers.map((d, i, arr) => {
            const key = d.type as "positive" | "negative" | "neutral";
            const Icon = driverIcon[key];
            const color = driverColor[key];
            const bg = driverBg[key];
            return (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className={`p-4 flex items-center gap-3 ${
                  i < arr.length - 1
                    ? "border-b border-(--border-subtle)"
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
                  {(d.impact_paise??0) >= 0 ? "+" : "−"}
                  {d.impact_paise===null?"Unavailable":formatPaise(Math.abs(d.impact_paise))}
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
          className="w-full p-4 flex items-center justify-between gap-3 hover:bg-(--surface-subtle) transition-colors"
        >
          <span className="text-[14px] font-semibold">Assumptions</span>
          <motion.span
            animate={{ rotate: showAssumptions ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="shrink-0"
          >
            <ChevronDown className="w-4 h-4 text-(--text-tertiary)" />
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
                {ASSUMPTIONS.length===0&&<li className="text-sm text-(--text-secondary)">No assumptions were returned for this horizon.</li>}
                {ASSUMPTIONS.map((a, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-[13px] text-(--text-secondary) leading-[1.55]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-[7px] shrink-0" />
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
          <ShieldCheck className="w-4 h-4 text-accent shrink-0" />
          <span className="text-[13px] text-(--text-secondary) truncate">
            Estimates depend on available account history
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge label={label(horizon.raw.trustState).replaceAll("_"," ")} variant="ai" />
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
        <AlertTriangle className="w-5 h-5 text-(--warning) shrink-0 mt-0.5" />
        <p className="text-[13px] text-(--text-secondary) leading-[1.55]">
          <span className="font-semibold text-foreground">
            Forecasts are estimates
          </span>{" "}
          based on your patterns. Actual results may vary due to unexpected
          income, expenses, or market conditions.
        </p>
      </div>
    </div>
  );
}
