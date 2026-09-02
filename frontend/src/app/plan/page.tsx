"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { SectionHeader, Badge, ProgressRing } from "@/components/shared";
import { goals, recurringSeries, upcomingCommitments, financialHealth } from "@/lib/data";
import { formatPaise, formatDate } from "@/lib/format";

export default function PlanPage() {
  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Plan</h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">Goals, budgets, and your financial future</p>
      </motion.header>

      {/* Financial Health */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <SectionHeader title="Financial Health" action={<Link href="/financial-health" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1">Details <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Cash Buffer", value: `${financialHealth.cash_buffer_months?.toFixed(1)} mo`, status: financialHealth.cash_buffer_status },
            { label: "Commitment Load", value: `${Math.round((financialHealth.commitment_load_ratio ?? 0) * 100)}%`, status: financialHealth.commitment_load_status },
            { label: "Savings Rate", value: `${Math.round((financialHealth.savings_rate_pct ?? 0) * 100)}%`, status: financialHealth.savings_rate_status },
            { label: "Emergency Fund", value: `${financialHealth.emergency_fund_months?.toFixed(1)} mo`, status: financialHealth.emergency_fund_status },
          ].map((metric, i) => {
            const color = metric.status === "healthy" || metric.status === "on_track" ? "var(--positive)" : metric.status === "low" || metric.status === "moderate" || metric.status === "below" ? "var(--warning)" : "var(--negative)";
            return (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }} className="premium-card p-4 flex flex-col items-center gap-2">
                <ProgressRing pct={75} size={56} stroke={5} color={color} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)] text-center">{metric.label}</span>
                <span className="text-[14px] font-display font-semibold tabular-nums">{metric.value}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Goals */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <SectionHeader title="Goals" action={<Link href="/goals" className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="flex flex-col gap-3">
          {goals.map((goal, i) => (
            <Link key={goal.goal_id} href={`/goals/${goal.goal_id}`} className="premium-card p-4 group">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-[15px] font-semibold">{goal.name}</h3>
                  <Badge label={goal.goal_type.replace(/_/g, " ")} variant="neutral" />
                </div>
                <span className="text-[16px] font-display font-bold tabular-nums">{goal.pace.progress_pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, goal.pace.progress_pct)}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${goal.status === "completed" ? "bg-[var(--positive)]" : "bg-[var(--accent)]"}`} />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[13px] font-medium tabular-nums">{formatPaise(goal.current_amount_paise)}</span>
                <span className="text-[12px] text-[var(--text-tertiary)]">of {formatPaise(goal.target_amount_paise)}</span>
              </div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Upcoming Commitments */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
        <SectionHeader title="Upcoming" />
        <div className="premium-card overflow-hidden">
          {upcomingCommitments.map((item, i) => (
            <Link key={item.id} href="/transactions" className={`flex items-center gap-3 p-4 hover:bg-[var(--surface-subtle)] transition-colors ${i < upcomingCommitments.length - 1 ? "border-b border-[var(--border-subtle)]" : ""}`}>
              <div className="flex-1">
                <p className="text-[14px] font-medium">{item.merchant_name}</p>
                <p className="text-[12px] text-[var(--text-tertiary)]">{item.category} · {formatDate(item.due_date)}</p>
              </div>
              <span className="text-[14px] font-semibold tabular-nums">{formatPaise(item.amount_paise)}</span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Quick Links */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[{ label: "Recurring", href: "/recurring", icon: "🔄" }, { label: "Cashflow", href: "/cashflow", icon: "📊" }, { label: "Forecast", href: "/forecast", icon: "🔮" }].map((item) => (
          <Link key={item.href} href={item.href} className="premium-card p-4 flex items-center gap-3 group hover:border-[var(--accent)] transition-colors">
            <span className="text-[20px]">{item.icon}</span>
            <span className="text-[13px] font-medium">{item.label}</span>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
