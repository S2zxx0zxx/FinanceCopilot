"use client";

import { motion } from "framer-motion";
import { painPoints } from "@/lib/landing-data";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";

export function Problem() {
  return (
    <section id="problem" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="The problem"
          title="Money is messy. Your bank app isn't helping."
          subtitle="You juggle 6 apps, 3 cards, 2 brokerages — and still can't answer 'can I afford this?'"
        />
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {painPoints.map((point, i) => {
            const Icon = point.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <GlassCard hover className="p-5 h-full flex flex-col gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="font-display font-semibold text-[16px] text-[var(--text)]">
                    {point.title}
                  </h4>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                    {point.body}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
