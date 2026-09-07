"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { Aurora } from "@/components/bits/aurora";
import { InsightCard } from "@/components/bits/insight-card";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import {
  chatExamples,
  chatPlaceholders,
  chatExampleChips,
  insightCards,
} from "@/lib/landing-data";

export function AICopilotDeepDive() {
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % chatPlaceholders.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <Aurora variant="emerald" />
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <SectionHeading
          eyebrow="FinCopilot AI"
          title="Talk to your money. It talks back."
          subtitle="No bank-speak. Just answers, charts, and one-tap actions."
        />

        <div className="grid lg:grid-cols-12 gap-8 items-center mt-12">
          {/* Left: Chat transcript */}
          <div className="lg:col-span-5">
            <GlassCard className="h-[520px] flex flex-col overflow-hidden">
              {/* Header bar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[6px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#0A0F0D]" />
                  </div>
                  <span className="font-display font-bold text-[13px]">FinCopilot</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-secondary)]">
                    AI
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                    style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
                  />
                  online
                </span>
              </div>

              {/* Scrollable transcript */}
              <div className="flex-1 overflow-y-auto scrollbar-thin p-3 flex flex-col gap-3">
                {chatExamples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex flex-col gap-2"
                  >
                    {/* User bubble */}
                    <div className="self-end max-w-[85%]">
                      <div className="bg-[var(--accent)] text-[#0A0F0D] rounded-[14px] rounded-tr-[4px] px-3 py-2 text-[12px] font-medium">
                        {ex.q}
                      </div>
                    </div>
                    {/* AI bubble */}
                    <div className="self-start max-w-[90%]">
                      <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[14px] rounded-tl-[4px] px-3 py-2 text-[12px] text-[var(--text)] leading-relaxed">
                        {ex.a}
                      </div>
                      {/* Response card */}
                      <ResponseCard card={ex.card} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Fake input bar */}
              <div className="border-t border-[var(--border)] bg-[var(--surface)]/40 p-2.5">
                <div className="flex items-center gap-2 bg-[var(--surface-3)] rounded-[10px] px-3 py-2">
                  <span className="flex-1 text-[12px] text-[var(--text-muted)] truncate">
                    {chatPlaceholders[placeholderIdx]}
                  </span>
                  <button className="w-7 h-7 rounded-[8px] bg-[var(--accent)] flex items-center justify-center hover:bg-[var(--accent-bright)] transition-colors">
                    <Send className="w-3 h-3 text-[#0A0F0D]" />
                  </button>
                </div>
              </div>

              {/* Chips bar */}
              <div className="overflow-x-auto scrollbar-thin flex gap-2 p-2 border-t border-[var(--border)]">
                {chatExampleChips.map((chip, i) => (
                  <button
                    key={i}
                    className="shrink-0 text-[10px] font-mono px-2.5 py-1.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/30 transition-colors"
                  >
                    {chip.length > 30 ? `${chip.slice(0, 30)}…` : chip}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right: Insight cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {insightCards.map((card, i) => (
              <InsightCard key={i} data={card} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResponseCard({ card }: { card: import("@/lib/landing-data").ChatCard }) {
  const accent =
    card.type === "alert"
      ? "var(--danger)"
      : card.type === "forecast"
      ? "var(--gold)"
      : "var(--accent)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="mt-2 glass-card p-2.5 rounded-[10px] flex flex-col gap-1.5"
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] font-mono uppercase tracking-wider"
          style={{ color: accent }}
        >
          {card.type}
        </span>
        {card.confidence != null && (
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-semibold">
            {card.confidence * 100}% conf
          </span>
        )}
      </div>

      {card.metric && (
        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-[14px] font-bold" style={{ color: accent }}>
            {card.metric}
          </span>
          {card.delta && (
            <span
              className="text-[10px] font-mono"
              style={{
                color:
                  card.type === "alert" ? "var(--danger)" : "var(--text-muted)",
              }}
            >
              {card.delta}
            </span>
          )}
        </div>
      )}

      {card.chart === "bar" && (
        <div className="flex items-end gap-0.5 h-6">
          {[4200, 3800, 5100, 4600, 6900, 7200, 8450].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm"
              style={{
                height: `${(v / 8450) * 100}%`,
                background: i >= 4 ? "var(--accent)" : "var(--surface-3)",
              }}
            />
          ))}
        </div>
      )}

      {card.chart === "forecast" && (
        <div className="h-6">
          <MiniSparkline
            data={[42, 44, 43, 46, 48, 47, 50, 49, 52, 54, 55, 56]}
            color="var(--gold)"
            fill
            height={24}
          />
        </div>
      )}

      {card.chart === "list" && card.list && (
        <div className="flex flex-col gap-0.5">
          {card.list.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[10px]">
              <span>
                {item.emoji} {item.name}
              </span>
              <span className="font-mono text-[var(--text-secondary)]">{item.price}</span>
            </div>
          ))}
        </div>
      )}

      {card.action && (
        <button className="text-[10px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] text-left mt-0.5">
          {card.action}
        </button>
      )}
    </motion.div>
  );
}
