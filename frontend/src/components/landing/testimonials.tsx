"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { testimonials } from "@/lib/landing-data";

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Loved by people who hate their bank app"
          title="Real users. Real outcomes. Real numbers."
          subtitle="Every testimonial comes with a quantified outcome — because vague praise doesn't pay the bills."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
            >
              <GlassCard hover className="p-5 h-full flex flex-col gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="font-mono text-[26px] font-bold text-[var(--accent)] leading-none">
                    {t.metric}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                    {t.label}
                  </span>
                </div>

                <p className="text-[14px] text-[var(--text-secondary)] italic leading-[1.55] flex-1">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3 pt-1 border-t border-[var(--border)]">
                  <img
                    src={t.avatar}
                    width={36}
                    height={36}
                    alt={t.author}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium">{t.author}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {t.role}
                    </span>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]"
                      />
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
