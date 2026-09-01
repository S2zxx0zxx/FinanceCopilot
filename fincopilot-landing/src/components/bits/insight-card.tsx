"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "./glass-card";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { cn } from "@/lib/utils";
import type { InsightCardData } from "@/lib/landing-data";

interface InsightCardProps {
  data: InsightCardData;
  index?: number;
  className?: string;
}

export function InsightCard({ data, index = 0, className }: InsightCardProps) {
  const accentColor =
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
      <GlassCard hover className={cn("p-4 h-full flex flex-col gap-3", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: accentColor }}
            />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
              {data.title}
            </span>
          </div>
          {data.type === "alert" && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--danger)]/15 text-[var(--danger)]">
              Alert
            </span>
          )}
          {data.type === "forecast" && data.confidence && (
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--gold-glow)] text-[var(--gold)]">
              {data.confidence}% conf
            </span>
          )}
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className="font-mono text-[22px] font-bold leading-none"
            style={{ color: data.type === "alert" ? "var(--danger)" : "var(--text)" }}
          >
            {data.metric}
          </span>
          {data.delta && (
            <span className="text-[11px] text-[var(--text-muted)]">{data.delta}</span>
          )}
        </div>

        {data.chart === "bar" && (
          <div className="h-12 flex items-end gap-1">
            {[40, 65, 50, 80, 55, 90, 75, 60, 85, 70].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-[2px]"
                style={{
                  height: `${h}%`,
                  background: i >= 7 ? "var(--accent)" : "var(--surface-3)",
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
            />
          </div>
        )}

        {data.chart === "alert" && (
          <div className="h-12 flex items-center justify-center rounded-[8px] bg-[var(--danger)]/10">
            <span className="text-[12px] text-[var(--danger)] font-mono">
              ↑ 3× anomaly detected
            </span>
          </div>
        )}

        {data.chart === "list" && data.list && (
          <div className="flex flex-col gap-1.5">
            {data.list.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-[12px] py-1.5 border-b border-[var(--border)] last:border-0"
              >
                <span className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span className="text-[var(--text-secondary)]">{item.name}</span>
                </span>
                <span className="font-mono text-[var(--text)]">{item.price}</span>
              </div>
            ))}
          </div>
        )}

        <button
          className="mt-auto inline-flex items-center justify-center gap-1.5 text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors self-start group"
        >
          {data.action}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </GlassCard>
    </motion.div>
  );
}
