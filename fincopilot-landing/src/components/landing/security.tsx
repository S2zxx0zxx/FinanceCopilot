"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { securityItems, securityBadges } from "@/lib/landing-data";
import { getIcon } from "@/lib/icon-map";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";

export function Security() {
  return (
    <section id="security" className="py-20 md:py-28 scroll-mt-20 bg-[var(--bg-aurora-1)]/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <SectionHeading
              align="left"
              eyebrow="Security & trust"
              title="Your money is sacred. We treat it that way."
              subtitle="Bank-grade infrastructure, read-only by design, independently audited. We never sell your data — ever."
            />
            <div className="flex flex-col gap-4 mt-8">
              {securityItems.map((item, i) => {
                const Icon = getIcon(item.iconKey ?? "");
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-[10px] bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h4 className="font-display font-semibold text-[15px] text-[var(--text)]">{item.title}</h4>
                      <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55]">{item.body}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="p-6 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                {securityBadges.map((badge, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="flex flex-col items-center gap-2 p-4 rounded-[10px] bg-[var(--surface)] border border-[var(--border)]"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-dim)] to-transparent border border-[var(--accent)]/20 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-secondary)] text-center leading-tight">{badge}</span>
                  </motion.div>
                ))}
              </div>
              <div className="pt-4 border-t border-[var(--border)] flex flex-col gap-2">
                <p className="text-[12px] text-[var(--text-muted)] italic text-center">Independently audited by Coalfire, 2025.</p>
                <a href="#" className="text-[12px] text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors self-center inline-flex items-center gap-1">
                  Read the security overview →
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


