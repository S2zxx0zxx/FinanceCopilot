"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { bentoFeatures } from "@/lib/landing-data";
import { getIcon } from "@/lib/icon-map";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { ChatDemo } from "@/components/bits/chat-demo";
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
          {bentoFeatures.map((feature, i) => {
            const Icon = getIcon(feature.iconKey ?? "");
            const isLarge = feature.span?.includes("col-span-2");
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={cn(feature.span)}
              >
                <GlassCard
                  hover
                  className={cn(
                    "p-5 h-full flex flex-col gap-3 relative overflow-hidden group",
                    isLarge && "min-h-[280px]"
                  )}
                >
                  {/* hover glow */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[var(--accent-glow)] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 pointer-events-none" />

                  <div className="relative z-10 flex flex-col gap-3 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-dim)] text-[var(--accent)] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="font-display font-semibold text-[18px] text-[var(--text)] leading-[1.2]">
                      {feature.title}
                    </h3>
                    <p className="text-[13px] text-[var(--text-secondary)] leading-[1.6]">
                      {feature.body}
                    </p>

                    {feature.hasChat && (
                      <div className="mt-1 flex-1 min-h-[180px]">
                        <ChatDemo variant="compact" />
                      </div>
                    )}

                    <a
                      href="#"
                      className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors self-start group/cta"
                    >
                      {feature.cta}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-0.5" />
                    </a>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
