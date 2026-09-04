"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Aurora } from "@/components/bits/aurora";
import { MagneticButton } from "@/components/bits/magnetic-button";
import { SignUpButton } from "@clerk/nextjs";

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <Aurora variant="mixed" />
      {/* particles drift */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[var(--accent)]"
            style={{
              left: `${(i * 8.5) % 100}%`,
              bottom: "10%",
              animation: `particle-drift ${6 + (i % 4)}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center flex flex-col gap-5 items-center relative">
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          Start today
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em]"
        >
          Your money,{" "}
          <span className="text-gradient-accent">on autopilot.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-[16px] sm:text-[17px] text-[var(--text-secondary)] leading-[1.65] max-w-xl"
        >
          Join the waitlist for early access. Free forever to start — be among the first users when we launch.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-2"
        >
          <SignUpButton mode="modal">
            <div>
              <MagneticButton className="px-6 py-3 text-[15px]">
                <span>Start free</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </SignUpButton>
          <a
            href="/api/cta?dest=contact&source=final-cta-talk-to-us"
            className="inline-flex items-center gap-2 border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)] text-[13px] px-4 py-3 rounded-[10px] transition-colors"
          >
            Talk to us
          </a>
        </motion.div>

        <p className="text-[12px] text-[var(--text-muted)] mt-2">
          No credit card · 14-day trial on paid plans · Cancel anytime
        </p>
      </div>
    </section>
  );
}
