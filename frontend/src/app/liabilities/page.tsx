"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useAppData } from "@/hooks/use-app-data";

import { formatPaise, formatDate } from "@/lib/format";

export default function LiabilitiesPage() {
  const { liabilities } = useAppData();
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div><h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Liabilities</h1><p className="text-[14px] text-(--text-secondary) mt-1">What you owe and upcoming payments</p></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 border-[var(--negative)]/20">
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-secondary)">Total Outstanding</span>
        <p className="font-display font-bold text-[36px] tabular-nums text-(--negative) mt-2">{formatPaise(liabilities.total_paise)}</p>
        <p className="text-[13px] text-(--text-tertiary) mt-2">↑ {formatPaise(liabilities.change_paise, { style: "compact" })} from last month</p>
      </motion.div>
      {liabilities.accounts.map((acc, i) => (
        <div key={i} className="premium-card p-5">
          <div className="flex items-center justify-between mb-3"><div><h3 className="text-[15px] font-semibold">{acc.institution}</h3><p className="text-[12px] text-(--text-tertiary) capitalize">{acc.type}</p></div><span className="text-[18px] font-display font-semibold tabular-nums text-(--negative)">{formatPaise(acc.balance_paise)}</span></div>
          <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-(--border-subtle)">
            <div><span className="text-[10px] font-mono uppercase text-(--text-tertiary)">Min Due</span><p className="text-[14px] font-medium tabular-nums mt-1">{formatPaise(acc.min_due_paise)}</p></div>
            <div><span className="text-[10px] font-mono uppercase text-(--text-tertiary)">Due Date</span><p className="text-[14px] font-medium mt-1">{formatDate(acc.due_date)}</p></div>
            <div><span className="text-[10px] font-mono uppercase text-(--text-tertiary)">Utilization</span><p className="text-[14px] font-medium tabular-nums mt-1">{acc.utilization_pct}%</p></div>
          </div>
        </div>
      ))}
    </div>
  );
}
