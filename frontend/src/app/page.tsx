"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, AlertTriangle, Bell, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  SectionHeader, MetricCard, FreshnessBadge, AttentionItem,
  Badge, CountUp,
} from "@/components/shared";
import { Sparkline, MiniBarChart } from "@/components/charts/sparkline";
import {
  financialStateHome, recentTransactions, aiInsights,
  spendingStory, currentUser,
} from "@/lib/data";
import { formatPaise, formatDate, getGreeting, categoryIcon } from "@/lib/format";

export default function HomePage() {
  const greeting = getGreeting();
  const firstName = currentUser.displayName?.split(" ")[0] || "there";
  const sts = financialStateHome.safe_to_spend_paise;
  const stsStatus = financialStateHome.safe_to_spend_status;

  const stsColor = stsStatus === "safe" ? "var(--positive)" : stsStatus === "moderate" ? "var(--warning)" : "var(--negative)";

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* ── Greeting ─────────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-[13px] text-[var(--text-tertiary)] font-mono">{greeting},</p>
          <h1 className="font-display font-bold text-[28px] tracking-[-0.02em] mt-0.5">{firstName}</h1>
        </div>
        <Link
          href="/ai"
          className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-[12px] bg-[var(--accent-light)] text-[var(--accent)] text-[13px] font-semibold hover:bg-[var(--accent)] hover:text-white transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Ask AI
        </Link>
      </motion.header>

      {/* ── Safe-to-Spend Hero ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, color-mix(in oklab, ${stsColor} 10%, var(--surface)), var(--surface))`,
          border: `1px solid color-mix(in oklab, ${stsColor} 25%, var(--border))`,
          boxShadow: `0 12px 32px color-mix(in oklab, ${stsColor} 8%, transparent)`,
        }}
      >
        {/* glow blob */}
        <div
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full opacity-30 pointer-events-none"
          style={{ background: stsColor, filter: "blur(60px)" }}
        />

        <div className="relative flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: stsColor, animation: "pulse-dot 2s ease-in-out infinite" }}
            />
            <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-secondary)]">
              Safe to Spend
            </span>
          </div>
          <FreshnessBadge status="live" />
        </div>

        <div className="relative flex items-end gap-3 mb-2">
          <CountUp
            value={sts / 100}
            format={(v) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            duration={1500}
            className="font-display font-bold text-[48px] sm:text-[56px] leading-none tracking-[-0.03em]"
          />
        </div>
        <p className="relative text-[14px] text-[var(--text-secondary)]">
          {financialStateHome.safe_to_spend_horizon} · synced {financialStateHome.synced_accounts}/{financialStateHome.total_accounts} accounts
        </p>

        {/* mini stats */}
        <div className="relative grid grid-cols-3 gap-4 mt-6 pt-6 border-t" style={{ borderColor: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Balance</span>
            <p className="text-[15px] font-display font-semibold tabular-nums mt-1">
              {formatPaise(financialStateHome.available_balance_paise, { style: "compact" })}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Spending</span>
            <p className="text-[15px] font-display font-semibold tabular-nums mt-1 flex items-center gap-1">
              {formatPaise(financialStateHome.this_month_spending_paise, { style: "compact" })}
              <span className="text-[var(--positive)] text-[11px]">↓8%</span>
            </p>
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">Income</span>
            <p className="text-[15px] font-display font-semibold tabular-nums mt-1">
              {formatPaise(financialStateHome.this_month_income_paise, { style: "compact" })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Stats Bento ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <MetricCard
          label="Total Balance"
          value={formatPaise(financialStateHome.available_balance_paise)}
          delta="+3.2%"
          deltaPositive
          sparkline={<Sparkline data={[22, 24, 23, 25, 24, 26, 25, 27]} color="var(--accent)" />}
        />
        <MetricCard
          label="This Month Spending"
          value={formatPaise(financialStateHome.this_month_spending_paise)}
          delta="↓8% vs last"
          deltaPositive
          sparkline={<Sparkline data={[40, 35, 38, 32, 34, 30, 28, 27]} color="var(--negative)" />}
        />
        <MetricCard
          label="This Month Income"
          value={formatPaise(financialStateHome.this_month_income_paise)}
          delta="+2.1%"
          deltaPositive
          sparkline={<Sparkline data={[80, 82, 81, 83, 82, 84, 85, 85]} color="var(--positive)" />}
        />
      </motion.div>

      {/* ── Needs Attention ───────────────────────────────────── */}
      {financialStateHome.needs_attention.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SectionHeader title="Needs Attention" />
          <div className="flex flex-col gap-3">
            {financialStateHome.needs_attention.map((item) => (
              <AttentionItem
                key={item.id}
                title={item.title}
                description={item.description}
                severity={item.severity as "warning" | "info" | "positive"}
                actionHref={item.action_href}
                actionLabel={item.action_label}
              />
            ))}
          </div>
        </motion.section>
      )}

      {/* ── Recent Transactions ───────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionHeader
          title="Recent Transactions"
          action={
            <Link href="/transactions" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="premium-card overflow-hidden">
          {recentTransactions.slice(0, 5).map((tx, i) => {
            const isIncome = tx.direction === "credit";
            return (
              <Link
                key={tx.transaction_id}
                href={`/transactions/${tx.transaction_id}`}
                className={`flex items-center gap-3 p-4 hover:bg-[var(--surface-subtle)] transition-colors ${
                  i < 4 ? "border-b border-[var(--border-subtle)]" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center text-[16px] shrink-0">
                  {categoryIcon(tx.category)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium truncate">{tx.merchant_name}</p>
                  <p className="text-[12px] text-[var(--text-tertiary)] capitalize">
                    {tx.category} · {formatDate(tx.date, { style: "relative" })}
                    {tx.pending && <span className="ml-1.5 text-[var(--warning)]">· Pending</span>}
                  </p>
                </div>
                <span className={`text-[14px] font-semibold tabular-nums shrink-0 ${isIncome ? "text-[var(--positive)]" : "text-[var(--foreground)]"}`}>
                  {isIncome ? "+" : ""}{formatPaise(tx.amount_paise)}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.section>

      {/* ── AI Insight ────────────────────────────────────────── */}
      {aiInsights[0] && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SectionHeader title="AI Insight" />
          <div className="premium-card p-5 border-[var(--accent)]/30 relative overflow-hidden">
            {/* corner glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[var(--accent-glow)] opacity-50 pointer-events-none" style={{ filter: "blur(40px)" }} />

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
                    <Link
                      key={i}
                      href={action.href}
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      {action.label} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* ── Spending Story Preview ───────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SectionHeader
          title="Spending Story"
          action={
            <Link href="/spending-story" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors">
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="premium-card p-5">
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display font-bold text-[24px] tabular-nums">{formatPaise(spendingStory.total_spent_paise)}</span>
            <span className="text-[13px] text-[var(--positive)] flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5" /> {formatPaise(Math.abs(spendingStory.change_paise), { style: "compact" })} less than last month
            </span>
          </div>
          <MiniBarChart
            data={spendingStory.categories.slice(0, 6).map(c => ({
              label: c.category.slice(0, 4),
              value: c.amount_paise / 100,
              color: c.color,
            }))}
            height={80}
          />
        </div>
      </motion.section>
    </div>
  );
}
