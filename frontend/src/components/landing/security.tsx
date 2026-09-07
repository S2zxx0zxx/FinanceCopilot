"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { getIcon } from "@/lib/icon-map";
import { securityItems, securityBadges } from "@/lib/landing-data";

export function Security() {
  return (
    <section
      id="security"
      className="py-20 md:py-28 scroll-mt-20 bg-[var(--bg-aurora-1)]/30"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy + pillars */}
          <div className="flex flex-col gap-8">
            <SectionHeading
              align="left"
              eyebrow="Security & trust"
              title="Your money is sacred. We treat it that way."
              subtitle="Bank-grade infrastructure, read-only by design, independently audited. We never sell your data — ever."
            />

            <div className="flex flex-col gap-4">
              {securityItems.map((item, i) => {
                const Icon = getIcon(item.icon);
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-[15px]">{item.title}</span>
                      <span className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">
                        {item.body}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: badges card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                {securityBadges.map((badge) => (
                  <div
                    key={badge}
                    className="flex flex-col items-center gap-2 p-4 rounded-[12px] bg-[var(--surface-2)]"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-dim)] to-transparent border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <span className="text-[12px] font-mono text-center text-[var(--text)]">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-[var(--border)]" />

              <p className="text-[13px] italic text-[var(--text-secondary)] text-center">
                Independently audited by Coalfire, 2025.
              </p>

              <a
                href="#top"
                className="self-center inline-flex items-center gap-1 text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors"
              >
                Read the security overview
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
