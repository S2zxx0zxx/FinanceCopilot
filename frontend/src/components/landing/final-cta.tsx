"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Aurora } from "@/components/bits/aurora";
import { MagneticButton } from "@/components/bits/magnetic-button";

const PARTICLES = Array.from({ length: 12 });

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <Aurora variant="mixed" />

      {/* Particle drift background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((_, i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-[var(--accent)]"
            style={{
              position: "absolute",
              bottom: "10%",
              left: `${(i * 8.5) % 100}%`,
              animation: `particle-drift ${6 + (i % 4)}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center flex flex-col gap-5 items-center"
        >
          <span className="eyebrow">Start today</span>

          <h2 className="font-display font-bold text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.03em]">
            Your money,{" "}
            <span className="text-gradient-accent">on autopilot.</span>
          </h2>

          <p className="text-[16px] text-[var(--text-secondary)] leading-[1.6] max-w-lg">
            Join 250,000+ people who stopped worrying about money. Free forever
            to start.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <MagneticButton variant="primary" className="px-6 py-3 text-[15px]">
              Start free
              <ArrowRight className="w-4 h-4" />
            </MagneticButton>
            <a
              href="#top"
              className="inline-flex items-center gap-2 px-6 py-3 text-[15px] font-medium text-[var(--text)] border border-[var(--border-strong)] rounded-[10px] hover:bg-[var(--surface-2)] transition-colors"
            >
              Talk to us
            </a>
          </div>

          <p className="text-[12px] text-[var(--text-muted)]">
            No credit card · 14-day trial on paid plans · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
