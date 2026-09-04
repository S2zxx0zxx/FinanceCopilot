"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/landing-data";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Illustrative scenarios"
          title="What FinCopilot could do for you."
          subtitle="Pre-launch, these composite scenarios show the kinds of outcomes we aim to deliver. Not real customer claims — yet."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <GlassCard hover className="p-5 h-full flex flex-col gap-3">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[26px] font-bold text-[var(--accent)] leading-none">
                    {t.metric}
                  </span>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  {t.label}
                </span>
                <p className="text-[14px] text-[var(--text-secondary)] italic leading-[1.55] flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border)]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- avatars are static local files */}
                  <img
                    src={t.avatar}
                    alt={`${t.author}, ${t.role}`}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover shrink-0 border border-[var(--border)] opacity-80"
                  />
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-[13px] font-semibold text-[var(--text)] truncate">{t.author}</span>
                    <span className="text-[11px] text-[var(--text-muted)] truncate">{t.role}</span>
                  </div>
                  {/* No star rating — these are illustrative composites, not real customer reviews. */}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
