"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { spendingStory } from "@/lib/data";
import { formatPaise } from "@/lib/format";
import { MiniBarChart } from "@/components/charts/sparkline";
import { SectionHeader } from "@/components/shared";

export default function SpendingStoryPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div><h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Spending Story</h1><p className="text-[14px] text-[var(--text-secondary)] mt-1">{spendingStory.period}</p></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6">
        <p className="font-display font-bold text-[36px] tabular-nums">{formatPaise(spendingStory.total_spent_paise)}</p>
        <p className="text-[13px] text-[var(--positive)] mt-2">↓ {formatPaise(Math.abs(spendingStory.change_paise), { style: "compact" })} less than last month</p>
      </motion.div>
      <section><SectionHeader title="By Category" /><div className="premium-card p-5"><MiniBarChart data={spendingStory.categories.map(c => ({ label: c.category.slice(0, 5), value: c.amount_paise / 100, color: c.color }))} height={120} /></div></section>
    </div>
  );
}
