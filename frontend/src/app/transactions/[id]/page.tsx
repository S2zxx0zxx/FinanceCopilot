"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { recentTransactions } from "@/lib/data";
import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { Badge } from "@/components/shared";

export default function TransactionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const tx = recentTransactions.find(t => t.transaction_id === id) || recentTransactions[0];
  const isIncome = tx.direction === "credit";
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/transactions" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[var(--surface-subtle)] transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Transaction</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-[16px] bg-[var(--surface-subtle)] flex items-center justify-center text-[32px]">{categoryIcon(tx.category)}</div>
        <p className="text-[18px] font-semibold">{tx.merchant_name}</p>
        <p className={`font-display font-bold text-[36px] tabular-nums ${isIncome ? "text-[var(--positive)]" : ""}`}>{isIncome ? "+" : ""}{formatPaise(tx.amount_paise)}</p>
        <div className="flex items-center gap-2"><Badge label={tx.category} variant="neutral" />{tx.pending && <Badge label="Pending" variant="warning" />}</div>
      </motion.div>
      <div className="premium-card p-5 flex flex-col gap-3">
        <div className="flex justify-between"><span className="text-[13px] text-[var(--text-tertiary)]">Date</span><span className="text-[13px] font-medium">{formatDate(tx.date, { style: "long" })}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-[var(--text-tertiary)]">Category</span><span className="text-[13px] font-medium capitalize">{tx.category}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-[var(--text-tertiary)]">Direction</span><span className="text-[13px] font-medium capitalize">{tx.direction}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-[var(--text-tertiary)]">Source</span><span className="text-[13px] font-medium capitalize">{tx.source.replace("_", " ")}</span></div>
        {tx.notes && <div className="flex justify-between"><span className="text-[13px] text-[var(--text-tertiary)]">Notes</span><span className="text-[13px] font-medium text-[var(--warning)]">{tx.notes}</span></div>}
      </div>
    </div>
  );
}
