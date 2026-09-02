"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader, Badge, FreshnessBadge } from "@/components/shared";
import { accounts, financialStateMoney } from "@/lib/data";
import { formatPaise } from "@/lib/format";

export default function MoneyPage() {
  const netPosition = financialStateMoney.net_position;
  const coverage = financialStateMoney.coverage;
  const isFullySynced = coverage.synced_accounts >= coverage.total_accounts;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Money</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">Your complete financial picture</p>
      </motion.header>

      {/* Net Position Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
        className="premium-card p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[var(--accent-glow)] opacity-40 pointer-events-none" style={{ filter: "blur(50px)" }} />
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-secondary)]">Total Net Position</span>
            <Badge label={`${coverage.synced_accounts}/${coverage.total_accounts} Synced`} variant={isFullySynced ? "positive" : "warning"} />
          </div>
          <p className="font-display font-bold text-[44px] tabular-nums tracking-[-0.03em]">{formatPaise(netPosition.available_balance_paise)}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-[var(--border-subtle)]">
            <div><span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Posted</span><p className="text-[15px] font-semibold tabular-nums mt-0.5">{formatPaise(netPosition.posted_balance_paise)}</p></div>
            <div><span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Pending</span><p className="text-[15px] font-semibold tabular-nums mt-0.5">{formatPaise(netPosition.pending_balance_paise)}</p></div>
          </div>
        </div>
      </motion.div>

      {/* Connected Accounts */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <SectionHeader title="Connected Accounts" action={<Link href="/accounts" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors">View All <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="flex flex-col gap-3">
          {accounts.map((acc) => {
            const typeIcons: Record<string, string> = { savings: "🏦", current: "💳", credit_card: "💳", loan: "📋", investment: "📈" };
            const isCredit = acc.account_type === "credit_card";
            return (
              <Link key={acc.account_id} href={`/accounts/${acc.account_id}`} className="premium-card p-4 flex items-center gap-4 group">
                <div className="w-11 h-11 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-[18px] shrink-0">{typeIcons[acc.account_type] || "🏦"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><h3 className="text-[15px] font-semibold truncate">{acc.institution_name}</h3><span className="text-[12px] text-[var(--text-tertiary)] capitalize">{acc.account_type.replace("_", " ")}</span></div>
                  <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">•••• {acc.account_number_last4}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-[16px] font-display font-semibold tabular-nums ${isCredit ? "text-[var(--negative)]" : ""}`}>{formatPaise(acc.balances.available_balance_paise)}</p>
                  <FreshnessBadge status={acc.last_synced_at.startsWith("2026-09-01") ? "live" : "recent"} />
                </div>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* Quick Links */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[{ label: "Income", href: "/income", icon: "💰" }, { label: "Liabilities", href: "/liabilities", icon: "📋" }, { label: "Spending Story", href: "/spending-story", icon: "📊" }, { label: "Transactions", href: "/transactions", icon: "🔍" }].map((item) => (
          <Link key={item.href} href={item.href} className="premium-card p-4 flex flex-col items-center gap-2 group hover:border-[var(--accent)] transition-colors">
            <span className="text-[24px]">{item.icon}</span>
            <span className="text-[12px] font-medium">{item.label}</span>
          </Link>
        ))}
      </motion.section>
    </div>
  );
}
