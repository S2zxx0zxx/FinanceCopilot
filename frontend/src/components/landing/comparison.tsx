"use client";

import { motion } from "framer-motion";
import { Check, X, Minus } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { competitors, comparisonRows } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

function ValueCell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-[var(--accent-dim)] flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={3} />
        </div>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-[var(--surface-3)] flex items-center justify-center">
          <X className="w-3.5 h-3.5 text-[var(--text-muted)]" strokeWidth={2.5} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center">
      <span className="text-[11px] font-mono text-[var(--text-secondary)] px-2 py-1 rounded-full bg-[var(--surface-3)]">
        {value}
      </span>
    </div>
  );
}

export function Comparison() {
  return (
    <section id="comparison" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="The difference"
          title="Why people switch to FinCopilot."
          subtitle="See how FinCopilot compares to the tools you're already using — feature by feature."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <GlassCard className="overflow-hidden p-0">
            {/* Desktop table */}
            <div className="hidden md:block">
              {/* Header */}
              <div className="grid grid-cols-5 gap-2 px-6 py-4 border-b border-[var(--border)]">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] flex items-end">
                  Feature
                </div>
                {competitors.map((c) => (
                  <div
                    key={c.name}
                    className={cn(
                      "text-center",
                      c.highlight && "relative"
                    )}
                  >
                    {c.highlight && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-b-[6px] bg-[var(--accent)] text-[#0A0F0D] text-[9px] font-mono uppercase tracking-wider font-bold">
                        Best
                      </div>
                    )}
                    <div
                      className={cn(
                        "font-display font-bold text-[14px] mt-2",
                        c.highlight && "text-[var(--accent)]"
                      )}
                    >
                      {c.name}
                    </div>
                  </div>
                ))}
              </div>
              {/* Rows */}
              <div className="max-h-[480px] overflow-y-auto scrollbar-thin">
                {comparisonRows.map((row, i) => (
                  <motion.div
                    key={row.feature}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className={cn(
                      "grid grid-cols-5 gap-2 px-6 py-3.5 items-center border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]/50 transition-colors",
                      i % 2 === 1 && "bg-[var(--surface-2)]/20"
                    )}
                  >
                    <div className="text-[13px] text-[var(--text)] font-medium pr-3">
                      {row.feature}
                    </div>
                    <div className="relative">
                      {row.finpilot === true && (
                        <div className="absolute inset-0 -m-1 rounded-[10px] bg-[var(--accent-dim)] pointer-events-none" />
                      )}
                      <div className="relative">
                        <ValueCell value={row.finpilot} />
                      </div>
                    </div>
                    {row.others.map((o) => (
                      <ValueCell key={o.name} value={o.value} />
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden p-4 flex flex-col gap-3">
              {comparisonRows.map((row, i) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="p-3 rounded-[12px] bg-[var(--surface-2)]/50 border border-[var(--border)]"
                >
                  <div className="text-[13px] font-medium text-[var(--text)] mb-2">
                    {row.feature}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[var(--accent)] font-bold">FC</span>
                      <ValueCell value={row.finpilot} />
                    </div>
                    {row.others.slice(0, 1).map((o) => (
                      <div key={o.name} className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[var(--text-muted)]">{o.name.slice(0, 4)}</span>
                        <ValueCell value={o.value} />
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Summary stat */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-2 text-[14px] text-[var(--text-secondary)]"
        >
          <Minus className="w-4 h-4 text-[var(--text-muted)]" />
          <span>
            FinCopilot covers <span className="text-[var(--accent)] font-semibold">10 of 10</span> critical features. The next best covers 3.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
