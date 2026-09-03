"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Wallet } from "lucide-react";

export default function Page() {
  const isLeaks = "ai/afford".includes("leaks");
  const Icon = isLeaks ? AlertTriangle : Wallet;
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-light)] flex items-center justify-center"><Icon className="w-5 h-5 text-accent" /></div>
        <div><h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">{isLeaks ? "Money Leaks" : "Can I Afford This?"}</h1><p className="text-[13px] text-(--text-secondary)">{isLeaks ? "Find where money is leaking" : "Check if you can afford a purchase"}</p></div>
      </motion.header>
      <div className="premium-card p-6 flex flex-col gap-4">
        <label className="text-[13px] font-medium text-(--text-secondary)">{isLeaks ? "Describe what you want to analyze" : "What do you want to buy?"}</label>
        <input placeholder={isLeaks ? "e.g. subscriptions I don't use" : "e.g. New laptop ₹80,000"} className="px-4 py-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors" />
        <button className="px-4 py-3 rounded-[12px] bg-accent text-white text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors">Analyze</button>
      </div>
    </div>
  );
}
