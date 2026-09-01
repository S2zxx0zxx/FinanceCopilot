"use client";

import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { chatExamples, chatExampleChips, chatPlaceholders, insightCards } from "@/lib/landing-data";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { InsightCard } from "@/components/bits/insight-card";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { Aurora } from "@/components/bits/aurora";
import * as React from "react";

export function AICopilotDeepDive() {
  const [placeholderIdx, setPlaceholderIdx] = React.useState(0);
  React.useEffect(() => {
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
          {/* Left: chat transcript */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <GlassCard className="flex flex-col overflow-hidden h-[520px]">
              {/* header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]/40">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-[#0A0F0D]" />
                  </div>
                  <span className="text-[12px] font-semibold">FinCopilot</span>
                </div>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">AI</span>
              </div>

              {/* input bar */}
              <div className="border-b border-[var(--border)] p-2.5 bg-[var(--surface)]/40">
                <div className="flex items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--bg)] px-2.5 py-2">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
                  <div className="relative flex-1 h-4 overflow-hidden">
                    <motion.span
                      key={placeholderIdx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 text-[12px] text-[var(--text-muted)] truncate"
                    >
                      {chatPlaceholders[placeholderIdx]}
                    </motion.span>
                  </div>
                  <button className="w-6 h-6 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-bright)] flex items-center justify-center transition-colors">
                    <Send className="w-3 h-3 text-[#0A0F0D]" />
                  </button>
                </div>
              </div>

              {/* transcript */}
              <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-3 flex flex-col gap-3">
                {chatExamples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col gap-3"
                  >
                    {/* user bubble */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-[14px] rounded-tr-[4px] bg-[var(--accent)] text-[#0A0F0D] px-3 py-2 text-[13px] font-medium">
                        {ex.q}
                      </div>
                    </div>
                    {/* AI answer */}
                    <div className="flex justify-start">
                      <div className="max-w-[88%] rounded-[14px] rounded-tl-[4px] bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2.5 text-[13px]">
                        <p className="leading-[1.5] text-[var(--text)]">{ex.a}</p>
                        {ex.card.type === "insight" && ex.card.metric && (
                          <div className="mt-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-2.5 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Insight</span>
                              {ex.card.delta && <span className="text-[10px] text-[var(--danger)]">{ex.card.delta}</span>}
                            </div>
                            <span className="font-mono text-[18px] font-bold">{ex.card.metric}</span>
                            {ex.card.chart === "mini-bar" && (
                              <div className="h-8 flex items-end gap-0.5">
                                {[40, 65, 50, 80, 55, 90, 75, 60, 85, 70].map((h, j) => (
                                  <div key={j} className="flex-1 rounded-[2px]" style={{ height: `${h}%`, background: j >= 7 ? "var(--accent)" : "var(--surface-3)" }} />
                                ))}
                              </div>
                            )}
                            {ex.card.action && (
                              <button className="text-[11px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors self-start">{ex.card.action} →</button>
                            )}
                          </div>
                        )}
                        {ex.card.type === "forecast" && (
                          <div className="mt-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-2.5 flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Forecast</span>
                              {ex.card.confidence && (
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded-full bg-[var(--gold-glow)] text-[var(--gold)]">{ex.card.confidence}% conf</span>
                              )}
                            </div>
                            <span className="font-mono text-[18px] font-bold">{ex.card.metric}</span>
                            <div className="h-10"><MiniSparkline data={[42, 44, 43, 46, 48, 47, 50, 49, 52, 54, 55, 56]} color="var(--gold)" fill /></div>
                            {ex.card.action && <button className="text-[11px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors self-start">{ex.card.action} →</button>}
                          </div>
                        )}
                        {ex.card.type === "action" && ex.card.list && (
                          <div className="mt-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-2.5 flex flex-col gap-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Action</span>
                            {ex.card.list.map((item, j) => (
                              <div key={j} className="flex items-center justify-between text-[12px]">
                                <span className="flex items-center gap-2"><span>{item.emoji}</span><span className="text-[var(--text-secondary)]">{item.name}</span></span>
                                <span className="font-mono">{item.price}</span>
                              </div>
                            ))}
                            {ex.card.action && <button className="mt-1 text-[11px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors self-start">{ex.card.action} →</button>}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* chips */}
              <div className="border-t border-[var(--border)] p-2.5 flex gap-1.5 overflow-x-auto scrollbar-thin">
                {chatExampleChips.map((chip, i) => (
                  <button key={i} className="shrink-0 text-[11px] px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors whitespace-nowrap">
                    {chip.length > 32 ? chip.slice(0, 30) + "…" : chip}
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Right: insight cards */}
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
