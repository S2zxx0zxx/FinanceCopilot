"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const title = "you/security".split("/").pop().replace(/-/g, " ");
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/you" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[var(--surface-subtle)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em] capitalize">{title}</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-8 flex flex-col items-center text-center gap-3">
        <span className="text-[40px]">⚙️</span>
        <h3 className="font-display font-semibold text-[16px] capitalize">{title} Settings</h3>
        <p className="text-[14px] text-[var(--text-secondary)] max-w-sm">Full {title} management interface coming soon.</p>
      </motion.div>
    </div>
  );
}
