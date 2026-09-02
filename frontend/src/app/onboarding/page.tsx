"use client";
import * as React from "react";
import { motion } from "framer-motion";

export default function OnboardingPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em] capitalize">onboarding</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">This section is being built</p>
      </motion.header>
      <div className="premium-card p-8 flex flex-col items-center text-center gap-3">
        <span className="text-[40px]">🚧</span>
        <h3 className="font-display font-semibold text-[16px]">Coming Soon</h3>
        <p className="text-[14px] text-[var(--text-secondary)] max-w-sm">This page is under active development. The full onboarding experience will be available shortly.</p>
      </div>
    </div>
  );
}
