"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Lock, Star } from "lucide-react";
import { GlassCard } from "@/components/bits/glass-card";
import { MagneticButton } from "@/components/bits/magnetic-button";
import { Aurora } from "@/components/bits/aurora";
import { ChatDemo } from "@/components/bits/chat-demo";
import { CountUp } from "@/components/bits/count-up";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { SpendingArea } from "@/components/charts/spending-area";
import { heroPhrases, heroInlineStats } from "@/lib/landing-data";

export function Hero() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const { scrollYProgress } = useScroll();
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);

  useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % heroPhrases.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="min-h-[88svh] pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden flex items-center relative"
    >
      <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
      <Aurora variant="mixed" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 w-full relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left column */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-secondary)]"
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
              />
              Now with FinCopilot AI v2
            </motion.div>

            {/* H1 */}
            <h1 className="font-display font-bold text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
              <motion.span
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                className="block"
              >
                Your money,
              </motion.span>
              <span className="block text-gradient-accent">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phraseIdx}
                    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-block"
                  >
                    {heroPhrases[phraseIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-[16px] sm:text-[17px] text-[var(--text-secondary)] max-w-md leading-[1.6]"
            >
              FinCopilot tracks your spending, builds smart budgets, forecasts
              cash flow, and answers your money questions — all in one beautiful
              place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center gap-3"
            >
              <MagneticButton variant="primary" className="px-5 py-3 text-[14px]">
                Start free
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-4 py-3 text-[14px] font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors"
              >
                <Play className="w-4 h-4" />
                See how it works
              </a>
            </motion.div>

            {/* Trust microcopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-wrap gap-4 text-[12px] text-[var(--text-muted)]"
            >
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                No credit card required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Bank-level 256-bit AES
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                SOC 2 Type II
              </span>
            </motion.div>

            {/* Inline stats */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.85 }}
              className="flex flex-wrap gap-8 pt-2"
            >
              {heroInlineStats.map((s) => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="text-[20px] font-bold font-mono">{s.value}</span>
                  <span className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column — 3D dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
            style={{ perspective: 2000 }}
          >
            <motion.div
              style={{ rotateX, transformStyle: "preserve-3d" }}
              className="relative"
            >
              <GlassCard className="p-3 preserve-3d relative">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-2 pb-2.5 border-b border-[var(--border)]">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] opacity-70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)] opacity-70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] opacity-70" />
                  </div>
                  <div className="flex-1 mx-2 h-6 rounded-md bg-[var(--surface-2)] flex items-center px-2 text-[10px] font-mono text-[var(--text-muted)]">
                    🔒 app.fincopilot.ai
                  </div>
                </div>

                {/* 2×2 KPI tiles */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <GlassCard className="p-3 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Net worth
                    </span>
                    <CountUp
                      value={4021700}
                      format="currency"
                      className="text-[18px] font-bold font-mono text-[var(--text)]"
                    />
                    <div className="h-5 -mx-0.5">
                      <MiniSparkline
                        data={[42, 43, 44, 46, 45, 47, 48]}
                        color="var(--accent)"
                        fill
                        height={20}
                      />
                    </div>
                  </GlassCard>
                  <GlassCard className="p-3 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      This month
                    </span>
                    <span className="text-[18px] font-bold font-mono text-[var(--success)]">
                      +₹1,00,240
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] inline-flex items-center gap-1">
                      <Star className="w-3 h-3 text-[var(--gold)] fill-[var(--gold)]" />
                      cash flow positive
                    </span>
                  </GlassCard>
                </div>

                {/* Spending area chart */}
                <GlassCard className="p-2 mt-2">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Spending · 30 days
                    </span>
                    <span className="text-[10px] font-mono text-[var(--success)]">
                      ↓ 12%
                    </span>
                  </div>
                  <div className="h-[60px]">
                    <SpendingArea />
                  </div>
                </GlassCard>

                {/* Chat demo */}
                <div className="mt-2">
                  <ChatDemo variant="hero" />
                </div>
              </GlassCard>

              {/* Floating satellite cards */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="hidden sm:block absolute -top-4 -left-4"
              >
                <GlassCard hover className="w-[160px] p-3 flex flex-col gap-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Dining
                  </span>
                  <span className="text-[14px] font-bold font-mono text-[var(--text)]">
                    ₹8,450
                  </span>
                  <span className="text-[10px] font-mono text-[var(--danger)]">
                    ↑22% vs avg
                  </span>
                  <div className="h-4 mt-1">
                    <MiniSparkline
                      data={[3, 4, 3, 5, 6, 5, 8]}
                      color="var(--danger)"
                      fill
                      height={16}
                    />
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.22, ease: [0.16, 1, 0.3, 1] }}
                className="hidden sm:block absolute -top-4 -right-4"
              >
                <GlassCard hover className="w-[160px] p-3 flex flex-col gap-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Subs found
                  </span>
                  <span className="text-[14px] font-bold font-mono text-[var(--text)]">
                    3 unused
                  </span>
                  <a
                    href="#top"
                    className="text-[10px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)]"
                  >
                    Cancel →
                  </a>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.34, ease: [0.16, 1, 0.3, 1] }}
                className="hidden sm:block absolute -bottom-4 -right-4"
              >
                <GlassCard
                  hover
                  className="w-[160px] p-3 flex flex-col gap-1 border-[var(--gold)]/30"
                >
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Forecast
                  </span>
                  <span className="text-[14px] font-bold font-mono text-[var(--gold)]">
                    Goal hit Mar 14
                  </span>
                  <div className="h-4 mt-1">
                    <MiniSparkline
                      data={[42, 44, 43, 46, 48, 47, 50, 49, 52, 54, 55, 56]}
                      color="var(--gold)"
                      fill
                      height={16}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
