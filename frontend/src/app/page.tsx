"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Flame, TrendingUp, TrendingDown } from "lucide-react";
import { CountUp, Badge, SectionHeader } from "@/components/shared";
import { getMerchantStyle } from "@/lib/merchant-data";
import { formatPaise, getGreeting, timeAgo } from "@/lib/format";
import {
  financialStateHome, recentTransactions, aiInsights, spendingStory,
  gamification, currentUser,
} from "@/lib/data";

function MerchantAvatar({ merchantName, size = 40 }: { merchantName: string; size?: number }) {
  const style = getMerchantStyle(merchantName);
  return (
    <div className="rounded-[12px] flex items-center justify-center shrink-0 font-bold"
      style={{ width: size, height: size, background: style.bg, color: style.color, fontSize: size > 36 ? 14 : 12 }}>
      <span style={{ fontSize: size * 0.45 }}>{style.glyph}</span>
    </div>
  );
}

export default function HomePage() {
  const home = financialStateHome;
  const transactions = recentTransactions.slice(0, 5);
  const insights = aiInsights.slice(0, 1);
  const spending = spendingStory;
  const game = gamification;
  const user = currentUser;

  const greeting = getGreeting();
  const firstName = user.displayName.split(" ")[0];
  const sts = home.safe_to_spend_paise;
  const stsStatus = home.safe_to_spend_status;
  const stsColor = stsStatus === "safe" ? "var(--positive)" : stsStatus === "moderate" ? "var(--warning)" : "var(--negative)";

  return (
    <div className="flex flex-col gap-5 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center justify-between mb-1">
        <div>
          <h1 className="font-display font-bold text-[26px] tracking-[-0.02em] text-[var(--text)]">Dashboard</h1>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Manage your money, track spending, and plan ahead.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-accent-foreground font-bold text-[14px]">{firstName.charAt(0)}</div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:col-span-2 bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[13px] text-[var(--text-secondary)] font-medium">Total Balance</p>
              <div className="flex items-baseline gap-3 mt-1">
                <CountUp value={home.available_balance_paise} format={(v: number) => formatPaise(Math.round(v))} duration={1500} className="font-display font-bold text-[36px] leading-none tabular-nums tracking-[-0.02em] text-[var(--text)]" />
                <span className="text-[13px] text-[var(--success)] font-semibold flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> 3.2%</span>
              </div>
            </div>
            <Badge label={home.synced_accounts + "/" + home.total_accounts + " Synced"} variant="positive" />
          </div>
          <div className="flex gap-3 mb-5">
            <button className="px-4 py-2.5 rounded-[12px] bg-[var(--surface-subtle)] border border-[var(--border)] text-[13px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">Deposit</button>
            <button className="px-4 py-2.5 rounded-[12px] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] text-accent-foreground text-[13px] font-semibold hover:shadow-[0_4px_20px_-4px_var(--accent-glow)] transition-shadow">Transfer</button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
            <div><p className="text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider">Main Balance</p><p className="text-[18px] font-bold tabular-nums text-[var(--text)] mt-1">{formatPaise(home.available_balance_paise - 45000)}</p></div>
            <div><p className="text-[11px] text-[var(--text-muted)] font-mono uppercase tracking-wider">Credit Balance</p><p className="text-[18px] font-bold tabular-nums text-[var(--text)] mt-1">{formatPaise(45000)}</p></div>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)]" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col">
          <div className="flex items-center justify-between mb-3"><h3 className="text-[15px] font-semibold text-[var(--text)]">Spending</h3><span className="text-[11px] text-[var(--text-muted)] font-mono">This Month</span></div>
          <CountUp value={home.this_month_spending_paise} format={(v: number) => formatPaise(Math.round(v))} duration={1500} className="font-display font-bold text-[28px] tabular-nums tracking-[-0.02em] text-[var(--text)]" />
          <div className="flex items-center gap-2 mt-1"><span className="text-[12px] text-[var(--success)] font-semibold flex items-center gap-0.5"><TrendingDown className="w-3 h-3" /> {Math.abs(home.spending_change_pct)}%</span><span className="text-[11px] text-[var(--text-muted)]">vs last month</span></div>
          <div className="mt-4 flex items-end gap-1.5 h-16">
            {[40, 65, 45, 80, 55, 70, 50, 75, 60, 85, 45, 65].map((h, i) => (
              <motion.div key={i} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: 0.6 + i * 0.05, ease: [0.16, 1, 0.3, 1] }} className="flex-1 rounded-t-[4px] bg-gradient-to-t from-[var(--accent)] to-[var(--accent-bright)] opacity-80 hover:opacity-100 transition-opacity" />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="relative overflow-hidden rounded-[20px] p-5" style={{ background: `linear-gradient(135deg, ${stsColor} 0%, var(--surface-elevated) 60%, var(--gold) 100%)` }}>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative">
            <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white" style={{ animation: "pulse-dot 2s ease-in-out infinite" }} /><span className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/70">Safe to Spend</span></div>
            <CountUp value={sts} format={(v: number) => formatPaise(Math.round(v))} duration={1800} className="font-display font-bold text-[36px] leading-none text-white tabular-nums tracking-[-0.03em] mt-2 block" />
            <p className="text-[12px] text-white/50 font-mono mt-1">/ {home.safe_to_spend_horizon}</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-muted)]">Income (mo)</span><div className="w-8 h-8 rounded-[10px] bg-[var(--success-light,rgba(5,150,105,0.12))] flex items-center justify-center"><TrendingUp className="w-4 h-4 text-[var(--success)]" /></div></div>
          <CountUp value={home.this_month_income_paise} format={(v: number) => formatPaise(Math.round(v))} duration={1500} className="font-display font-bold text-[24px] tabular-nums tracking-[-0.02em] text-[var(--text)]" />
          <p className="text-[12px] text-[var(--success)] font-semibold mt-1">↑ 2.1% vs last month</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="bg-gradient-to-br from-[var(--accent-dim)] to-[var(--gold-light)] border border-[var(--border)] rounded-[20px] p-5">
          <div className="flex items-center justify-between mb-2"><span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-muted)]">Your Streak</span><div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center"><Flame className="w-4 h-4 text-accent-foreground" /></div></div>
          <p className="font-display font-bold text-[24px] tabular-nums tracking-[-0.02em] text-[var(--text)]">{game.tracking_streak_days} days</p>
          <p className="text-[12px] text-[var(--text-secondary)] mt-1">Level {game.level}: {game.level_name}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }} className="lg:col-span-2">
          <SectionHeader title="Recent Transactions" action={<Link href="/transactions" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-bright)]">View All →</Link>} />
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            {transactions.map((tx, i) => (
              <Link key={tx.transaction_id} href={`/transactions/${tx.transaction_id}`} className={`flex items-center gap-3 p-4 hover:bg-[var(--surface-subtle)] transition-colors ${i !== transactions.length - 1 ? "border-b border-[var(--border)]" : ""}`}>
                <MerchantAvatar merchantName={tx.merchant_name} size={40} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2"><span className="text-[14px] font-semibold truncate text-[var(--text)]">{tx.merchant_name}</span>{tx.pending && <Badge label="Pending" variant="warning" />}</div>
                  <span className="text-[12px] text-[var(--text-secondary)]">{tx.category} · {timeAgo(tx.date)}</span>
                </div>
                <span className={`font-mono font-bold text-[14px] tabular-nums ${tx.direction === "credit" ? "text-[var(--success)]" : "text-[var(--text)]"}`}>{tx.direction === "credit" ? "+" : "−"}{formatPaise(tx.amount_paise, { style: "compact" })}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <SectionHeader title="AI Insight" />
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[20px] p-5 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[var(--accent-glow)] opacity-20 blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3 relative">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shrink-0"><Sparkles className="w-5 h-5 text-accent-foreground" /></div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-[14px] text-[var(--text)]">{insights[0]?.title || "Spending Alert"}</h3><Badge label={`${insights[0]?.confidence || 92}%`} variant="ai" /></div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5]">{insights[0]?.summary || "Your dining spend is 22% above average."}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}>
        <SectionHeader title="Spending by Category" action={<Link href="/spending-story" className="text-[12px] font-medium text-[var(--accent)]">See All →</Link>} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {(spending.categories || []).slice(0, 8).map((cat: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.6 + i * 0.05 }} className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center gap-2 mb-2"><span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} /><span className="text-[13px] font-medium text-[var(--text)] truncate">{cat.category}</span></div>
              <p className="font-mono font-bold text-[16px] tabular-nums text-[var(--text)]">{formatPaise(cat.amount_paise)}</p>
              <span className={`text-[11px] ${cat.change_pct < 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{cat.change_pct < 0 ? "↓" : "↑"}{Math.abs(cat.change_pct)}% vs avg</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
