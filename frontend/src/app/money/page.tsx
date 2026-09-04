"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown, Shield, Sparkles, Eye, EyeOff } from "lucide-react";
import { SectionHeader, Badge, FreshnessBadge, CountUp } from "@/components/shared";
import { Sparkline } from "@/components/charts/sparkline";
import { useAppData } from "@/hooks/use-app-data";
import { type Account } from "@/lib/data";
import { bankCardGradients } from "@/lib/merchant-data";
import { formatPaise, formatDate } from "@/lib/format";

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRecentlySynced(lastSyncedAt: string): boolean {
  try {
    const diff = Date.now() - new Date(lastSyncedAt).getTime();
    return diff < 24 * 3600 * 1000; // within 24h
  } catch {
    return false;
  }
}

// ── 3D Currency Note Card ─────────────────────────────────────────────────
function CurrencyNoteCard({ netWorth, posted, pending }: { netWorth: number; posted: number; pending: number }) {
  const { netWorthHistory = [], financialStateMoney } = useAppData();
  const [showDetails, setShowDetails] = React.useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setShowDetails(!showDetails)}
    >
      {/* Note background — emerald gradient with lathework pattern */}
      <div className="relative p-6 sm:p-8 text-white" style={{
        background: "linear-gradient(135deg, #047857 0%, #065F46 30%, #064E3B 60%, #022C22 100%)",
        minHeight: 220,
      }}>
        {/* Lathework pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px),
                            repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 4px)`,
        }} />

        {/* Watermark F */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] font-display font-bold opacity-[0.04] pointer-events-none">F</div>

        {/* Top row */}
        <div className="relative flex items-start justify-between mb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Total Net Position</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="w-3.5 h-3.5 text-white/60" />
              <span className="text-[11px] text-white/60">All accounts</span>
            </div>
          </div>
          <Badge label={`${financialStateMoney.coverage.synced_accounts}/${financialStateMoney.coverage.total_accounts} Synced`} variant="positive" />
        </div>

        {/* Big amount */}
        <div className="relative">
          <CountUp
            value={netWorth / 100}
            format={(v) => `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            duration={2000}
            className="font-display font-bold text-[40px] sm:text-[48px] leading-none tracking-[-0.03em]"
          />
          <p className="text-[12px] text-white/40 mt-2 font-mono">≈ ${(netWorth / 100 / 83).toFixed(0)} USD · as of today</p>
        </div>

        {/* Bottom: posted + pending */}
        <div className="relative flex items-center justify-between mt-8 pt-4 border-t border-white/10">
          <div className="flex gap-6">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Posted</span>
              <p className="text-[15px] font-display font-semibold tabular-nums">{formatPaise(posted, { style: "compact" })}</p>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Pending</span>
              <p className="text-[15px] font-display font-semibold tabular-nums text-white/70">{formatPaise(pending, { style: "compact" })}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-white/40">
            {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-[10px] font-mono">{showDetails ? "Hide" : "Tap"}</span>
          </div>
        </div>

        {/* Expandable details */}
        {showDetails && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="relative mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
            <div><span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Assets</span><p className="text-[14px] font-semibold tabular-nums text-[#34D399]">+{formatPaise(2497000 + 1240000, { style: "compact" })}</p></div>
            <div><span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Liabilities</span><p className="text-[14px] font-semibold tabular-nums text-red-400">{formatPaise(45000, { style: "compact" })}</p></div>
            <div><span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Investments</span><p className="text-[14px] font-semibold tabular-nums">{formatPaise(1240000, { style: "compact" })}</p></div>
            <div><span className="text-[9px] font-mono uppercase tracking-wider text-white/30">Cash</span><p className="text-[14px] font-semibold tabular-nums">{formatPaise(2497000, { style: "compact" })}</p></div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ── 3D Bank Card (for each account) ──────────────────────────────────────────
function BankCard3D({ account }: { account: Account }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const isCredit = account.account_type === "credit_card";
  const gradient = bankCardGradients[account.institution_name] || bankCardGradients["fincopilot"];
  const typeIcons: Record<string, string> = { savings: "🏦", current: "💳", credit_card: "💳", loan: "📋", investment: "📈" };

  const handleMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (px / rect.width) * 8, y: -(py / rect.height) * 8 });
  };

  return (
    <Link href={`/accounts/${account.account_id}`} className="block">
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`, transition: "transform 0.2s ease-out" }}
        className="relative rounded-2xl overflow-hidden cursor-pointer h-35"
      >
        <div className="absolute inset-0" style={{ background: gradient }} />
        {/* Sheen */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
        }} />
        <div className="relative p-4 text-white h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[20px]">{typeIcons[account.account_type]}</span>
              <div>
                <p className="text-[13px] font-semibold">{account.institution_name}</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">{account.account_type.replace("_", " ")} • •••• {account.account_number_last4}</p>
              </div>
            </div>
            <FreshnessBadge status={isRecentlySynced(account.last_synced_at) ? "live" : "recent"} />
          </div>
          <div>
            <p className={`text-[20px] font-display font-bold tabular-nums ${isCredit ? "opacity-90" : ""}`}>
              {formatPaise(account.balances.available_balance_paise)}
            </p>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">{isCredit ? "OUTSTANDING" : "AVAILABLE"}</p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

export default function MoneyPage() {
  const { accounts, financialStateMoney, netWorthHistory = [] } = useAppData();
  const net = financialStateMoney?.net_position ?? { available_balance_paise: 0, posted_balance_paise: 0, pending_balance_paise: 0 };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Money</h1>
        <p className="text-[14px] text-(--text-secondary) mt-1">Your complete financial picture</p>
      </motion.header>

      {/* 3D Currency Note Card */}
      <CurrencyNoteCard netWorth={net.available_balance_paise} posted={net.posted_balance_paise} pending={net.pending_balance_paise} />

      {/* Net Worth Trend mini chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="premium-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Net Worth Trend · 12 months</span>
          <span className="text-[12px] text-(--positive) flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +38% YoY</span>
        </div>
        <div className="h-20">
          <Sparkline data={netWorthHistory.map(d => d.value / 100)} color="var(--accent)" fill height={80} />
        </div>
      </motion.div>

      {/* Connected Accounts — 3 per row with 3D bank cards */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <SectionHeader title="Connected Accounts" action={<Link href="/accounts" className="text-[12px] font-medium text-accent hover:text-(--accent-hover) flex items-center gap-1 transition-colors">View All <ArrowRight className="w-3.5 h-3.5" /></Link>} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {accounts.map((acc) => <BankCard3D key={acc.account_id} account={acc} />)}
        </div>
      </motion.section>

      {/* Quick Links — compact grid */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Income", href: "/income", icon: "💰", desc: "Sources & trends" },
          { label: "Liabilities", href: "/liabilities", icon: "📋", desc: "What you owe" },
          { label: "Spending Story", href: "/spending-story", icon: "📊", desc: "By category" },
          { label: "Transactions", href: "/transactions", icon: "🔍", desc: "All activity" },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="premium-card p-4 flex flex-col gap-1.5 group hover:border-accent transition-colors">
            <span className="text-[22px]">{item.icon}</span>
            <span className="text-[13px] font-semibold">{item.label}</span>
            <span className="text-[11px] text-(--text-tertiary)">{item.desc}</span>
          </Link>
        ))}
      </motion.section>
    </div>
  );
}
