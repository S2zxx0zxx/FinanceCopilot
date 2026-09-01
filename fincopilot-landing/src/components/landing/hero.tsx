"use client";

import * as React from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, ShieldCheck, Lock, Star } from "lucide-react";
import { heroPhrases, heroInlineStats } from "@/lib/landing-data";
import { Aurora } from "@/components/bits/aurora";
import { MagneticButton } from "@/components/bits/magnetic-button";
import { CountUp } from "@/components/bits/count-up";
import { ChatDemo } from "@/components/bits/chat-demo";
import { GlassCard } from "@/components/bits/glass-card";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { SpendingArea } from "@/components/charts/spending-area";

export function Hero() {
  const [phraseIdx, setPhraseIdx] = React.useState(0);
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const tiltX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % heroPhrases.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-[88svh] pt-28 pb-12 md:pt-32 md:pb-16 overflow-hidden flex items-center"
    >
      {/* Backgrounds */}
      <div className="absolute inset-0 -z-10 grid-overlay opacity-30" />
      <Aurora variant="mixed" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Left column */}
        <div className="lg:col-span-6 flex flex-col gap-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/60 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} />
              Now with FinCopilot AI v2
            </span>
          </motion.div>

          <h1 className="font-display font-bold text-[clamp(2.75rem,6vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[var(--text)]"
            >
              Your money,
            </motion.span>
            <span className="block h-[1.1em] relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIdx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-gradient-accent inline-block"
                >
                  {heroPhrases[phraseIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16px] sm:text-[17px] text-[var(--text-secondary)] leading-[1.65] max-w-[34rem]"
          >
            FinCopilot tracks your spending, builds smart budgets, forecasts cash flow, and answers your money questions — all in one beautiful place.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-1"
          >
            <MagneticButton className="px-5 py-2.5 text-[14px]">
              <span>Start free</span>
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <button className="inline-flex items-center gap-2 border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)] text-[13px] px-4 py-2.5 rounded-[10px] transition-colors">
              <Play className="w-3.5 h-3.5" />
              <span>See how it works</span>
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[var(--text-muted)] mt-1"
          >
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[var(--accent)]" /> No credit card required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[var(--accent)]" /> Bank-level 256-bit AES
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-[var(--accent)]" /> SOC 2 Type II
            </span>
          </motion.div>

          {/* Inline stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 flex items-center gap-6"
          >
            {heroInlineStats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-[20px] font-bold font-mono text-[var(--text)]">
                  {s.value}
                </span>
                <span className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column — 3D dashboard + chat + floating cards */}
        <motion.div
          style={{ opacity }}
          className="lg:col-span-6 relative"
        >
          <div className="relative" style={{ perspective: "2000px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ rotateX: tiltX, transformStyle: "preserve-3d" }}
            >
              <GlassCard className="p-3 preserve-3d relative">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--danger)]/70" />
                  <span className="w-2 h-2 rounded-full bg-[var(--warning)]/70" />
                  <span className="w-2 h-2 rounded-full bg-[var(--success)]/70" />
                  <div className="flex-1 ml-2 h-5 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">🔒 app.fincopilot.ai</span>
                  </div>
                </div>

                {/* Mini dashboard */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="glass-card p-3 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Net worth</span>
                    <span className="text-[22px] font-bold font-mono">
                      $<CountUp value={48217} format="currency" duration={1800} />
                    </span>
                    <div className="h-6">
                      <MiniSparkline data={[42, 43, 44, 46, 45, 47, 48]} color="var(--accent)" fill />
                    </div>
                  </div>
                  <div className="glass-card p-3 flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">This month</span>
                    <span className="text-[22px] font-bold font-mono text-[var(--success)]">
                      +$1,240
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)]">
                      <Star className="w-2.5 h-2.5 text-[var(--gold)]" />
                      <span>cash flow positive</span>
                    </div>
                  </div>
                </div>

                {/* Area chart */}
                <div className="glass-card p-2.5 mt-2.5 h-[88px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Spending · 30 days</span>
                    <span className="text-[10px] font-mono text-[var(--success)]">↓ 12%</span>
                  </div>
                  <div className="h-[52px]">
                    <SpendingArea />
                  </div>
                </div>

                {/* Chat demo embedded */}
                <div className="mt-2.5">
                  <ChatDemo variant="hero" />
                </div>
              </GlassCard>

              {/* Floating satellite cards */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -top-3 -left-4 lg:-left-8 w-[150px] hidden sm:block"
                style={{ transform: "translateZ(60px) rotate(-3deg)" }}
              >
                <GlassCard hover className="p-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Dining</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[16px] font-bold font-mono">₹8,450</span>
                    <span className="text-[10px] text-[var(--danger)]">↑22% vs avg</span>
                  </div>
                  <div className="h-5 mt-1">
                    <MiniSparkline data={[20, 30, 25, 40, 35, 50, 48]} color="var(--danger)" />
                  </div>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.22, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-6 -right-4 lg:-right-8 w-[150px] hidden sm:block"
                style={{ transform: "translateZ(80px) rotate(3deg)" }}
              >
                <GlassCard hover className="p-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Subs found</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[16px] font-bold font-mono">3 unused</span>
                  </div>
                  <button className="mt-1 text-[10px] text-[var(--accent)] hover:text-[var(--accent-bright)] transition-colors">
                    Cancel →
                  </button>
                </GlassCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.34, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-4 right-4 lg:right-12 w-[160px] hidden sm:block"
                style={{ transform: "translateZ(50px) rotate(-1.5deg)" }}
              >
                <GlassCard hover className="p-2.5 border-[var(--gold)]/30" >
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)]">Forecast</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[14px] font-bold font-mono">Goal hit</span>
                    <span className="text-[10px] text-[var(--gold)]">Mar 14</span>
                  </div>
                  <div className="h-5 mt-1">
                    <MiniSparkline data={[30, 35, 38, 42, 45, 50, 52]} color="var(--gold)" fill />
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
