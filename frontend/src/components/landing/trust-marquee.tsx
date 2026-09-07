"use client";

import { motion } from "framer-motion";
import { pressLogos, stats } from "@/lib/landing-data";
import { CountUp } from "@/components/bits/count-up";

export function TrustMarquee() {
  const doubled = [...pressLogos, ...pressLogos];

  return (
    <section className="py-14 border-y border-[var(--border)] bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <p className="eyebrow text-center mb-6">As featured in</p>

        {/* Marquee */}
        <div className="relative overflow-hidden">
          <div
            className="flex gap-12 whitespace-nowrap will-change-transform"
            style={{ animation: "marquee 35s linear infinite" }}
          >
            {doubled.map((logo, i) => (
              <span
                key={i}
                className="text-[22px] sm:text-[24px] font-display font-bold text-[var(--text-secondary)] opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition shrink-0"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center gap-1"
            >
              <span className="text-[24px] font-bold font-mono text-[var(--text)]">
                {s.format === "text" ? (
                  "SOC 2"
                ) : (
                  <CountUp
                    value={s.value}
                    prefix={s.prefix}
                    suffix={s.suffix}
                    format={s.format}
                    decimals={s.value % 1 !== 0 ? 1 : 0}
                  />
                )}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
