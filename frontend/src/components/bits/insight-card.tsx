"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "./glass-card";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import type { InsightCardData } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  data: InsightCardData;
  index?: number;
  className?: string;
}

export function InsightCard({ data, index = 0, className }: InsightCardProps) {
  const accent =
    data.type === "alert"
      ? "var(--danger)"
      : data.type === "forecast"
      ? "var(--gold)"
      : "var(--accent)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard hover className={cn("p-4 h-full flex flex-col gap-3 group", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
              {data.title}
            </span>
          </div>
          {data.type === "alert" ? (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--danger)]/15 text-[var(--danger)] font-semibold">
              Alert
            </span>
          ) : data.confidence != null ? (
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-semibold">
              {data.confidence * 100}% conf
            </span>
          ) : null}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-[22px] font-bold" style={{ color: accent }}>
            {data.metric}
          </span>
          {data.delta && (
            <span className="text-[12px] text-[var(--text-muted)]">{data.delta}</span>
          )}
        </div>
        {data.chart === "bar" && data.barData && (
          <div className="flex items-end gap-1 h-12">
            {data.barData.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${(v / Math.max(...data.barData!)) * 100}%`,
                  background: i >= data.barData!.length - 3 ? "var(--accent)" : "var(--surface-3)",
                }}
              />
            ))}
          </div>
        )}
        {data.chart === "forecast" && (
          <div className="h-12">
            <MiniSparkline
              data={[42, 44, 43, 46, 48, 47, 50, 49, 52, 51, 54, 56]}
              color="var(--gold)"
              fill
              height={48}
            />
          </div>
        )}
        {data.chart === "alert" && (
          <div className="h-12 rounded-[8px] bg-[var(--danger)]/10 flex items-center justify-center">
            <span className="text-[12px] font-mono text-[var(--danger)]">↑ 3× anomaly detected</span>
          </div>
        )}
        {data.chart === "list" && data.list && (
          <div className="flex flex-col gap-1.5">
            {data.list.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[12px] border-b border-[var(--border)] pb-1.5 last:border-0">
                <span className="flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  <span className="text-[var(--text)]">{item.name}</span>
                </span>
                <span className="font-mono text-[var(--text-secondary)]">{item.price}</span>
              </div>
            ))}
          </div>
        )}
        <button className="mt-auto flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors text-left">
          {data.action}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </GlassCard>
    </motion.div>
  );
}
