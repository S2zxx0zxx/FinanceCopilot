"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { integrations } from "@/lib/landing-data";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";

export function Integrations() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Connect everything"
          title="12,000+ institutions. Read-only. Always."
          subtitle="Plaid-powered, bank-grade, read-only. We can't move your money — only understand it."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-12">
          {integrations.map((name, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard hover className="p-4 flex items-center gap-3 h-full group cursor-default">
                <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-3)] group-hover:bg-[var(--accent-dim)] flex items-center justify-center text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                  <span className="font-display font-bold text-[13px]">{name.charAt(0)}</span>
                </div>
                <span className="text-[13px] font-medium text-[var(--text)] truncate">{name}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 flex items-center justify-center gap-2 text-[13px] text-[var(--text-secondary)]">
          <Plus className="w-4 h-4 text-[var(--accent)]" />
          <span>Don't see your bank? We support <span className="text-[var(--text)] font-medium">12,000+</span> — search on signup.</span>
        </div>
      </div>
    </section>
  );
}
