"use client";

import { motion } from "framer-motion";
import { pressLogos, stats } from "@/lib/landing-data";
import { CountUp } from "@/components/bits/count-up";

export function TrustMarquee() {
  const doubled = [...pressLogos, ...pressLogos];
  return (
    <section className="py-14 border-y border-[var(--border)] bg-[var(--bg)] relative overflow-hidden">
      {/* Press strip */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="eyebrow text-center mb-6"
        >
          As featured in
        </motion.p>
      </div>
      <div className="relative overflow-hidden py-2">
        <div
          className="flex gap-12 whitespace-nowrap will-change-transform"
          style={{ animation: "marquee 35s linear infinite" }}
        >
          {doubled.map((name, i) => (
            <span
              key={i}
              className="text-[22px] sm:text-[24px] font-display font-bold text-[var(--text-secondary)] opacity-50 hover:opacity-100 hover:text-[var(--accent)] transition-all cursor-default tracking-[-0.01em]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 mt-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <span className="text-[28px] font-bold font-mono text-[var(--text)]">
                {stat.format === "text" ? (
                  stat.label.split(" ")[0]
                ) : (
                  <CountUp
                    value={stat.value}
                    format={stat.format}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                )}
              </span>
              <span className="text-[12px] uppercase tracking-wider text-[var(--text-muted)] mt-1">
                {stat.format === "text" ? stat.label.split(" ").slice(1).join(" ") : stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
