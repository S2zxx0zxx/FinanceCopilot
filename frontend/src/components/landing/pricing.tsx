"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { pricingTiers } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing that grows with you."
          subtitle="Start free. Upgrade when FinCopilot becomes essential."
        />

        {/* Toggle */}
        <div className="flex justify-center mt-8 mb-10">
          <div className="inline-flex items-center gap-1 p-1 rounded-full border border-[var(--border)] bg-[var(--surface)]">
            <button
              onClick={() => setYearly(false)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors",
                !yearly
                  ? "bg-[var(--accent)] text-[#0A0F0D]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={cn(
                "px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors flex items-center gap-1.5",
                yearly
                  ? "bg-[var(--accent)] text-[#0A0F0D]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              )}
            >
              Yearly
              <span className="text-[10px] font-mono text-[var(--gold)]">Save ~40%</span>
            </button>
          </div>
        </div>

        {/* Tiers */}
        <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pricingTiers.map((tier, i) => {
            const price = yearly ? tier.yearly : tier.monthly;
            const isFree = tier.monthly === 0;
            const isPro = tier.popular;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={cn(isPro && "md:-translate-y-3")}
              >
                <GlassCard
                  hover
                  className={cn(
                    "p-6 flex flex-col gap-4 relative h-full overflow-hidden",
                    isPro &&
                      "border-[var(--accent)]/40 shadow-[0_0_40px_var(--accent-glow)]"
                  )}
                >
                  {/* Popular pill */}
                  {isPro && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <span className="inline-flex items-center gap-1 bg-[var(--gold)] text-[#0A0F0D] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-[0_0_20px_var(--gold-glow)]">
                        <Star className="w-3 h-3 fill-[#0A0F0D]" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Radial glow overlay for Pro */}
                  {isPro && (
                    <div
                      className="absolute inset-0 opacity-30 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle at top, var(--accent-glow), transparent 60%)",
                      }}
                    />
                  )}

                  <div className="flex flex-col gap-1 relative">
                    <h3 className="font-display font-bold text-[20px]">{tier.name}</h3>
                    <p className="text-[13px] text-[var(--text-secondary)]">
                      {tier.tagline}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 relative">
                    <span className="font-display font-bold text-[40px] leading-none">
                      ₹{price}
                    </span>
                    <span className="text-[13px] text-[var(--text-secondary)]">/mo</span>
                  </div>
                  {yearly && !isFree && (
                    <span className="text-[11px] text-[var(--text-muted)] -mt-3 relative">
                      billed annually
                    </span>
                  )}

                  {/* CTA */}
                  <a
                    href="#top"
                    className={cn(
                      "inline-flex items-center justify-center px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all relative",
                      isFree
                        ? "border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)]"
                        : isPro
                        ? "bg-[var(--accent)] text-[#0A0F0D] hover:bg-[var(--accent-bright)] shadow-[0_0_24px_-4px_var(--accent-glow)]"
                        : "bg-[var(--accent)] text-[#0A0F0D] hover:bg-[var(--accent-bright)]"
                    )}
                  >
                    {isFree ? "Start free" : "Start free trial"}
                  </a>

                  {/* Features */}
                  <div className="flex flex-col gap-2 relative">
                    {tier.features.map((feature, idx) => {
                      const isSubhead = feature.endsWith(":");
                      if (isSubhead) {
                        return (
                          <span
                            key={idx}
                            className="text-[13px] font-semibold text-[var(--text)] mt-1"
                          >
                            {feature}
                          </span>
                        );
                      }
                      return (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[var(--accent)] mt-0.5 shrink-0" />
                          <span className="text-[13px] text-[var(--text-secondary)] leading-[1.5]">
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[12px] text-[var(--text-muted)] mt-10">
          All plans: Bank-level 256-bit AES · SOC 2 Type II · No ads · Cancel
          anytime · 14-day free trial on paid plans
        </p>
      </div>
    </section>
  );
}
