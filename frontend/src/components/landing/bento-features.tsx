"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { ChatDemo } from "@/components/bits/chat-demo";
import { getIcon } from "@/lib/icon-map";
import { bentoFeatures } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

export function BentoFeatures() {
  return (
    <section id="features" className="py-20 md:py-28 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Everything in one place"
          title="A full financial OS, not another tracker."
          subtitle="Seven pillars. One screen. Zero spreadsheets."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {bentoFeatures.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className={cn(f.span)}
              >
                <GlassCard hover className={cn("p-5 h-full flex flex-col gap-3 group relative overflow-hidden", f.span)}>
                  {/* Hover glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[var(--accent-glow)] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none" />

                  <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center relative">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-semibold text-[16px] relative">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-[var(--text-secondary)] leading-[1.55] relative">
                    {f.body}
                  </p>

                  {f.hasChat && (
                    <div className="mt-3 min-h-[180px] relative">
                      <ChatDemo variant="compact" className="min-h-[180px] h-[200px]" />
                    </div>
                  )}

                  <a
                    href="#top"
                    className="mt-auto inline-flex items-center gap-1 text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors relative"
                  >
                    Learn more
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </a>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
