"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ArrowUpRight, ArrowDownRight, Flame, TrendingUp, TrendingDown, Wallet, Calendar } from "lucide-react";
import { CountUp, Badge, SectionHeader, FreshnessBadge } from "@/components/shared";
import { Card3D, CardChip, ContactlessIcon } from "@/components/shared/card3d";
import { Sparkline, MiniBarChart } from "@/components/charts/sparkline";
import { SpendingDonutChart } from "@/components/charts/recharts";
import { getMerchantStyle } from "@/lib/merchant-data";
import {
  financialStateHome, recentTransactions, aiInsights, spendingStory,
  gamification, currentUser, calendarEvents,
} from "@/lib/data";
import { formatPaise, formatDate, timeAgo, getGreeting, categoryIcon } from "@/lib/format";

// ── Merchant Avatar (brand-colored square) ────────────────────────────────────
function MerchantAvatar({ merchantName, size = 40 }: { merchantName: string; size?: number }) {
  const style = getMerchantStyle(merchantName);
  return (
    <div
      className="rounded-[12px] flex items-center justify-center shrink-0 font-bold"
      style={{
        width: size, height: size,
        background: style.bg,
        color: style.color,
        fontSize: size > 36 ? 14 : 12,
      }}
    >
      <span style={{ fontSize: size * 0.45 }}>{style.glyph}</span>
    </div>
  );
}

// ── Transaction Row ────────────────────────────────────────────────────────────
function TransactionRow({ tx }: { tx: typeof recentTransactions[0] }) {
  const isIncome = tx.direction === "credit";
  return (
    <Link href={`/transactions/${tx.transaction_id}`} className="flex items-center gap-3 p-3.5 hover:bg-[var(--surface-subtle)] transition-colors group">
      <MerchantAvatar merchantName={tx.merchant_name} size={42} />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold truncate">{tx.merchant_name}</p>
        <p className="text-[11px] text-[var(--text-tertiary)] font-mono uppercase tracking-wide">
          {tx.category} · {formatDate(tx.date, { style: "relative" })}
          {tx.pending && <span className="ml-1.5 text-[var(--warning)]">· PENDING</span>}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className={`text-[15px] font-display font-semibold tabular-nums ${isIncome ? "text-[var(--positive)]" : "text-[var(--foreground)]"}`}>
          {isIncome ? "+" : ""}{formatPaise(tx.amount_paise)}
        </span>
        {tx.source === "ai_inferred" && <span className="block text-[9px] text-[var(--accent)] font-mono">AI</span>}
      </div>
    </Link>
  );
}

export default function HomePage() {
  const greeting = getGreeting();
  const firstName = currentUser.displayName?.split(" ")[0] || "there";
  const sts = financialStateHome.safe_to_spend_paise;
  const stsStatus = financialStateHome.safe_to_spend_status;
  const stsColor = stsStatus === "safe" ? "#047857" : stsStatus === "moderate" ? "#D97706" : "#DC2626";
  const donutData = spendingStory.categories.map(c => ({ name: c.category, value: c.amount_paise / 100, color: c.color }));

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* ── Greeting + Streak ─────────────────────────────────── */}
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-[var(--text-tertiary)] font-mono">{greeting},</p>
          <h1 className="font-display font-bold text-[28px] tracking-[-0.02em] mt-0.5">{firstName}</h1>
        </div>
        <Link href="/you" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--accent-light)] to-[var(--gold-light)] text-[12px] font-semibold">
          <Flame className="w-3.5 h-3.5 text-[var(--accent)]" />
          {gamification.tracking_streak_days}d
        </Link>
      </motion.header>

      {/* ── Safe-to-Spend Platinum Credit Card 3D ────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }} style={{ perspective: 1200 }}>
        <Card3D
          rotateMax={6}
          className="relative w-full rounded-[24px] overflow-hidden cursor-default"
          gradient="linear-gradient(135deg, #047857 0%, #065F46 30%, #0A0F0D 60%, #B08D57 100%)"
        >
          <div
            className="relative p-6 sm:p-8 text-white overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #047857 0%, #065F46 25%, #0A0F0D 55%, #1A1A1A 80%, #B08D57 100%)",
              minHeight: 200,
            }}
          >
            {/* Platinum sheen overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
              mixBlendMode: "overlay",
            }} />

            {/* Subtle dot pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-10" style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 0.5px, transparent 0.5px)",
              backgroundSize: "20px 20px",
            }} />

            {/* Top row: chip + contactless + freshness */}
            <div className="relative flex items-start justify-between mb-6" style={{ transform: "translateZ(40px)" }}>
              <div className="flex items-center gap-3">
                <CardChip />
                <div className="text-white/60"><ContactlessIcon /></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" style={{ animation: "pulse-dot 2s infinite" }} />
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-white/60">Safe to Spend</span>
              </div>
            </div>

            {/* Big amount */}
            <div className="relative" style={{ transform: "translateZ(30px)" }}>
              <CountUp
                value={sts / 100}
                format={(v) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                duration={1800}
                className="font-display font-bold text-[44px] sm:text-[52px] leading-none tracking-[-0.03em]"
              />
              <p className="text-[13px] text-white/50 mt-2 font-mono">{financialStateHome.safe_to_spend_horizon} · {financialStateHome.synced_accounts}/{financialStateHome.total_accounts} accounts synced</p>
            </div>

            {/* Bottom row: mini stats + card number */}
            <div className="relative flex items-end justify-between mt-8" style={{ transform: "translateZ(20px)" }}>
              <div className="flex gap-6">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">Balance</span>
                  <p className="text-[15px] font-display font-semibold tabular-nums">{formatPaise(financialStateHome.available_balance_paise, { style: "compact" })}</p>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">Spent</span>
                  <p className="text-[15px] font-display font-semibold tabular-nums flex items-center gap-1">
                    {formatPaise(financialStateHome.this_month_spending_paise, { style: "compact" })}
                    <span className="text-[#34D399] text-[10px]">↓8%</span>
                  </p>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/40">Income</span>
                  <p className="text-[15px] font-display font-semibold tabular-nums">{formatPaise(financialStateHome.this_month_income_paise, { style: "compact" })}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-[12px] text-white/30 tracking-[0.15em]">•••• 2K8F</p>
                <p className="text-[10px] font-mono text-white/20 mt-1">FINCOPILOT</p>
              </div>
            </div>
          </div>
        </Card3D>
      </motion.div>

      {/* ── Bento Grid: 4 satellite tiles ──────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Balance */}
        <Link href="/money" className="premium-card p-4 flex flex-col gap-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Balance</span>
            <Wallet className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          </div>
          <span className="font-display font-bold text-[20px] tabular-nums">{formatPaise(financialStateHome.available_balance_paise, { style: "compact" })}</span>
          <div className="h-6 -mb-1"><Sparkline data={[22,24,23,25,24,26,25,27]} color="var(--accent)" /></div>
        </Link>

        {/* Spending */}
        <Link href="/spending-story" className="premium-card p-4 flex flex-col gap-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Spent</span>
            <TrendingDown className="w-3.5 h-3.5 text-[var(--positive)]" />
          </div>
          <span className="font-display font-bold text-[20px] tabular-nums">{formatPaise(financialStateHome.this_month_spending_paise, { style: "compact" })}</span>
          <span className="text-[10px] text-[var(--positive)] font-medium">↓8% vs last</span>
        </Link>

        {/* Income */}
        <Link href="/income" className="premium-card p-4 flex flex-col gap-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Income</span>
            <TrendingUp className="w-3.5 h-3.5 text-[var(--positive)]" />
          </div>
          <span className="font-display font-bold text-[20px] tabular-nums">{formatPaise(financialStateHome.this_month_income_paise, { style: "compact" })}</span>
          <span className="text-[10px] text-[var(--positive)] font-medium">↑2.1%</span>
        </Link>

        {/* Streak */}
        <Link href="/you" className="premium-card p-4 flex flex-col gap-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Streak</span>
            <Flame className="w-3.5 h-3.5 text-[var(--warning)]" />
          </div>
          <span className="font-display font-bold text-[20px] tabular-nums">{gamification.tracking_streak_days}d 🔥</span>
          <span className="text-[10px] text-[var(--text-tertiary)]">Level {gamification.level} · {gamification.level_name}</span>
        </Link>
      </motion.div>

      {/* ── Needs Attention (2 per row, attractive borders) ──────── */}
      {financialStateHome.needs_attention.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <SectionHeader title="Needs Attention" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {financialStateHome.needs_attention.map((item) => {
              const color = item.severity === "warning" ? "#D97706" : "#DC2626";
              return (
                <Link key={item.id} href={item.action_href} className="premium-card p-4 flex items-center gap-3 group relative overflow-hidden" style={{ borderColor: `color-mix(in oklab, ${color} 20%, var(--border))` }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: color }} />
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0" style={{ background: `color-mix(in oklab, ${color} 12%, transparent)` }}>
                    <span className="text-[18px]">{item.type === "unusual_charge" ? "⚠️" : "📋"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[14px] font-semibold truncate">{item.title}</h4>
                    <p className="text-[12px] text-[var(--text-secondary)] leading-[1.4] mt-0.5 truncate">{item.description}</p>
                  </div>
                  <div className="shrink-0 text-[12px] font-medium text-[var(--accent)] group-hover:translate-x-0.5 transition-transform">
                    {item.action_label} →
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ── Recent Transactions (real merchant avatars) ─────────── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}>
        <SectionHeader title="Recent Transactions" action={<Link href="/transactions" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors">View All <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="premium-card overflow-hidden">
          {recentTransactions.slice(0, 5).map((tx, i) => (
            <div key={tx.transaction_id} className={i < 4 ? "border-b border-[var(--border-subtle)]" : ""}>
              <TransactionRow tx={tx} />
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── AI Insight ────────────────────────────────────────── */}
      {aiInsights[0] && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <SectionHeader title="AI Insight" />
          <div className="premium-card p-5 border-[var(--accent)]/20 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 pointer-events-none" style={{ background: "var(--accent-glow)", filter: "blur(40px)" }} />
            <div className="relative flex items-start gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-semibold text-[15px]">{aiInsights[0].title}</h3>
                  <Badge label={`${aiInsights[0].confidence}%`} variant="ai" />
                </div>
                <p className="text-[13px] text-[var(--text-secondary)] leading-[1.5] mb-3">{aiInsights[0].summary}</p>
                <div className="flex items-center gap-2">
                  {aiInsights[0].actions.map((action, i) => (
                    <Link key={i} href={action.href} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
                      {action.label} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Spending Story (Donut + Table combo) ─────────────────── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.45 }}>
        <SectionHeader title="Spending Story" action={<Link href="/spending-story" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors">See All <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="premium-card p-5">
          {/* Summary */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="font-display font-bold text-[24px] tabular-nums">{formatPaise(spendingStory.total_spent_paise)}</span>
            <span className="text-[12px] text-[var(--positive)] flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5" /> {formatPaise(Math.abs(spendingStory.change_paise), { style: "compact" })} less than last month
            </span>
          </div>

          {/* Donut + Table combo */}
          <div className="grid sm:grid-cols-2 gap-5 items-center">
            {/* Donut chart */}
            <div>
              <SpendingDonutChart data={donutData} />
            </div>

            {/* Table */}
            <div className="flex flex-col gap-2">
              {spendingStory.categories.slice(0, 6).map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color }} />
                  <span className="text-[13px] font-medium flex-1">{cat.category}</span>
                  <span className="text-[13px] font-semibold tabular-nums">{formatPaise(cat.amount_paise)}</span>
                  <span className={`text-[11px] tabular-nums w-10 text-right ${cat.change_pct > 0 ? "text-[var(--negative)]" : "text-[var(--positive)]"}`}>
                    {cat.change_pct > 0 ? "↑" : "↓"}{Math.abs(cat.change_pct)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Upcoming Calendar ──────────────────────────────────── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
        <SectionHeader title="Upcoming" action={<Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />} />
        <div className="flex flex-col gap-2">
          {calendarEvents.slice(0, 4).map((event) => {
            const isIncome = event.type === "income";
            const sevColor = event.severity === "high" ? "var(--negative)" : event.severity === "positive" ? "var(--positive)" : "var(--text-tertiary)";
            return (
              <div key={event.id} className="premium-card p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0 text-center" style={{ background: `color-mix(in oklab, ${sevColor} 10%, transparent)` }}>
                  <span className="text-[14px]">{event.type === "income" ? "💰" : event.type === "bill" ? "📋" : event.type === "investment" ? "📈" : "🔄"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium truncate">{event.title}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] font-mono">{formatDate(event.date, { style: "long" })} · {timeAgo(event.date) === "Just now" ? "today" : `in ${Math.ceil((new Date(event.date).getTime() - Date.now()) / 86400000)}d`}</p>
                </div>
                <span className={`text-[14px] font-semibold tabular-nums ${isIncome ? "text-[var(--positive)]" : ""}`}>{isIncome ? "+" : ""}{formatPaise(event.amount_paise)}</span>
              </div>
            );
          })}
        </div>
      </motion.section>
    </div>
  );
}
