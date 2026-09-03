"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { pricingTiers } from "@/lib/landing-data";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [yearly, setYearly] = React.useState(false);

  return (
    <section id="pricing" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing that grows with you."
          subtitle="Start free. Upgrade when FinCopilot becomes essential."
        />

        {/* toggle */}
        <div className="flex justify-center mt-8 mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all",
                !yearly ? "bg-[var(--accent)] text-[#0A0F0D]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-medium transition-all inline-flex items-center gap-1.5",
                yearly ? "bg-[var(--accent)] text-[#0A0F0D]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              )}
            >
              Yearly
              <span className="text-[10px] font-mono text-[var(--gold)]">Save ~40%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pricingTiers.map((tier, i) => {
            const price = yearly ? tier.yearly : tier.monthly;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={cn("relative", tier.popular && "md:-translate-y-3")}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--gold)] text-[#0A0F0D] text-[10px] font-bold uppercase tracking-wider shadow-[0_0_20px_var(--gold-glow)]">
                      ★ Most Popular
                    </span>
                  </div>
                )}
                <GlassCard
                  hover={false}
                  className={cn(
                    "p-6 h-full flex flex-col gap-4 relative overflow-hidden",
                    tier.popular
                      ? "border-[var(--accent)]/40 shadow-[0_0_40px_var(--accent-glow)]"
                      : ""
                  )}
                >
                  {tier.popular && (
                    <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 0%, var(--accent-glow), transparent 60%)" }} />
                  )}
                  <div className="flex flex-col gap-1">
                    <span className="text-[12px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{tier.name}</span>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5]">{tier.pitch}</p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display font-bold text-[40px] leading-none">${price}</span>
                    <span className="text-[13px] text-[var(--text-muted)]">/mo</span>
                  </div>

                  <a
                    href={`/api/cta?dest=signup&source=pricing-${tier.name.toLowerCase()}`}
                    className={cn(
                      "inline-flex items-center justify-center gap-2 rounded-[10px] text-[13px] font-semibold py-2.5 transition-all",
                      tier.popular
                        ? "bg-[var(--accent)] text-[#0A0F0D] hover:bg-[var(--accent-bright)] shadow-[0_4px_20px_-4px_var(--accent-glow)]"
                        : "border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:border-[var(--accent)]"
                    )}
                  >
                    {tier.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex flex-col gap-1.5 mt-2">
                    {tier.features.map((f, j) => {
                      const isHeader = f.endsWith(":");
                      return (
                        <div key={j} className="flex items-start gap-2 text-[12px]">
                          {isHeader ? (
                            <span className="text-[var(--text-secondary)] font-semibold mt-2 pt-1 w-full">{f}</span>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 text-[var(--accent)] shrink-0 mt-0.5" />
                              <span className="text-[var(--text-secondary)]">{f}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center mt-8 text-[12px] text-[var(--text-muted)]">
          All plans: Bank-level 256-bit AES · SOC 2 Type II · No ads · Cancel anytime · 14-day free trial on paid plans
        </p>
      </div>
    </section>
  );
}
