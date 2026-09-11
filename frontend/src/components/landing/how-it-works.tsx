"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { getIcon } from "@/lib/icon-map";
import { howItWorksSteps } from "@/lib/landing-data";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-20 md:py-28 scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="Live in 3 minutes, not 3 weeks."
          subtitle="Connect once. FinCopilot does the rest — forever."
        />

        <div className="grid md:grid-cols-3 gap-6 mt-14 relative">
          {howItWorksSteps.map((step, i) => {
            const Icon = getIcon(step.icon);
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <GlassCard className="p-6 h-full flex flex-col gap-3 relative overflow-hidden">
                  {/* Ghosted number */}
                  <span
                    className="text-[110px] leading-none text-[var(--surface-2)] select-none pointer-events-none absolute -top-3 -left-1 font-display font-bold"
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--accent-dim)] to-transparent border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-[18px] relative">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-[var(--text-secondary)] leading-[1.55] relative">
                    {step.body}
                  </p>
                </GlassCard>

                {/* Connector arrow (md+ only) */}
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-6 h-6 rounded-full bg-[var(--surface-2)] border border-[var(--border)] items-center justify-center text-[var(--text-secondary)]">
                    <ArrowRight className="w-3 h-3" />
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
