"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";

import { formatPaise, formatDate } from "@/lib/format";
import { FreshnessBadge } from "@/components/shared";

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { accounts } = useAppData();
  const { id } = React.use(params);
  const acc = accounts.find(a => a.account_id === id) || accounts[0];
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/accounts" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">{acc.institution_name}</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6">
        <div className="flex items-center justify-between mb-4"><span className="text-[11px] font-mono uppercase tracking-widest text-(--text-secondary)">Available Balance</span><FreshnessBadge status="live" /></div>
        <p className="font-display font-bold text-[40px] tabular-nums tracking-[-0.03em]">{formatPaise(acc.balances.available_balance_paise)}</p>
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-(--border-subtle)">
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Type</span><p className="text-[15px] font-medium capitalize mt-1">{acc.account_type.replace("_", " ")}</p></div>
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Account No.</span><p className="text-[15px] font-medium mt-1">•••• {acc.account_number_last4}</p></div>
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Posted</span><p className="text-[15px] font-medium tabular-nums mt-1">{formatPaise(acc.balances.posted_balance_paise)}</p></div>
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Last Sync</span><p className="text-[15px] font-medium mt-1">{formatDate(acc.last_synced_at, { style: "relative" })}</p></div>
        </div>
      </motion.div>
    </div>
  );
}
