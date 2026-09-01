"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { howItWorksSteps } from "@/lib/landing-data";
import { getIcon } from "@/lib/icon-map";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 scroll-mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <SectionHeading
          eyebrow="How it works"
          title="Live in 3 minutes, not 3 weeks."
          subtitle="Connect once. FinCopilot does the rest — forever."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-14 relative">
          {howItWorksSteps.map((step, i) => {
            const Icon = getIcon(step.iconKey ?? "");
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <GlassCard className="p-6 h-full flex flex-col gap-3 relative overflow-hidden">
                  <span className="absolute -top-3 -left-1 font-display font-bold text-[110px] leading-none text-[var(--surface-2)] select-none pointer-events-none">
                    {i + 1}
                  </span>
                  <div className="relative z-10 flex flex-col gap-3 mt-2">
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--accent-dim)] to-transparent border border-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-semibold text-[20px] text-[var(--text)]">
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                      {step.body}
                    </p>
                  </div>
                </GlassCard>
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[var(--surface-2)] border border-[var(--border)] items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-[var(--accent)]" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
