"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { incomeData } from "@/lib/data";
import { formatPaise } from "@/lib/format";
import { Badge } from "@/components/shared";

export default function IncomePage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3"><Link href="/money" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[var(--surface-subtle)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link><h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Income</h1></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-secondary)]">{incomeData.period}</span>
        <p className="font-display font-bold text-[36px] tabular-nums mt-2">{formatPaise(incomeData.effective_income_paise)}</p>
        <p className="text-[13px] text-[var(--positive)] mt-2">↑ {incomeData.month_over_month_change}% vs last month</p>
      </motion.div>
      <div className="premium-card overflow-hidden">
        {incomeData.sources.map((src, i) => (
          <div key={i} className={`flex items-center justify-between p-4 ${i < incomeData.sources.length - 1 ? "border-b border-[var(--border-subtle)]" : ""}`}>
            <div><p className="text-[14px] font-medium">{src.source_name}</p>{src.is_recurring && <Badge label="Recurring" variant="positive" />}</div>
            <span className="text-[15px] font-semibold tabular-nums">{formatPaise(src.amount_paise)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
