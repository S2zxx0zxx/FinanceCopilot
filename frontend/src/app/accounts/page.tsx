"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAppData } from "@/hooks/use-app-data";

import { formatPaise, formatDate } from "@/lib/format";
import { FreshnessBadge } from "@/components/shared";

function isRecentlySynced(lastSyncedAt: string): boolean {
  try {
    const diff = Date.now() - new Date(lastSyncedAt).getTime();
    return diff < 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

export default function AccountsPage() {
  const { accounts } = useAppData();
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div><h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Accounts</h1><p className="text-[14px] text-(--text-secondary) mt-1">{accounts.length} accounts connected</p></div>
      <div className="flex flex-col gap-3">
        {accounts.map((acc: any, i: number) => {
          const typeIcons: Record<string, string> = { savings: "🏦", current: "💳", credit_card: "💳", loan: "📋", investment: "📈" };
          const isCredit = acc.account_type === "credit_card";
          return (
            <motion.div key={acc.account_id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
              <Link href={`/accounts/${acc.account_id}`} className="premium-card p-5 flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-[20px] shrink-0">{typeIcons[acc.account_type] || "🏦"}</div>
                <div className="flex-1"><div className="flex items-center gap-2"><h3 className="text-[16px] font-semibold">{acc.institution_name}</h3><span className="text-[12px] text-(--text-tertiary) capitalize">{acc.account_type.replace("_", " ")}</span></div><p className="text-[12px] text-(--text-tertiary) mt-0.5">•••• {acc.account_number_last4} · Synced {formatDate(acc.last_synced_at, { style: "relative" })}</p></div>
                <div className="text-right"><p className={`text-[18px] font-display font-semibold tabular-nums ${isCredit ? "text-(--negative)" : ""}`}>{formatPaise(acc.balances.available_balance_paise)}</p><FreshnessBadge status={isRecentlySynced(acc.last_synced_at) ? "live" : "recent"} /></div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
