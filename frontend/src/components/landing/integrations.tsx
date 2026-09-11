"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { integrations } from "@/lib/landing-data";

export function Integrations() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Connect everything"
          title="300+ institutions. Read-only. Always."
          subtitle="Setu AA-powered, RBI-regulated, read-only. We can't move your money — only understand it."
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-12">
          {integrations.map((it, i) => (
            <motion.div
              key={it.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlassCard hover className="p-4 flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-3)] group-hover:bg-[var(--accent-dim)] flex items-center justify-center font-display font-bold text-[13px] transition-colors">
                  {it.name.charAt(0)}
                </div>
                <span className="text-[13px] font-medium truncate">{it.name}</span>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 mt-8 text-[13px] text-[var(--text-secondary)]">
          <Plus className="w-3.5 h-3.5" />
          <span>
            Don't see your bank? We support{" "}
            <span className="text-[var(--text)] font-medium">12,000+</span> — search
            on signup.
          </span>
        </div>
      </div>
    </section>
  );
}
