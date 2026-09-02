"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Database, ShieldCheck, Lock, Key, RefreshCw, ArrowRight,
  CheckCircle2, AlertCircle, Clock, CloudOff, Cloud, FileText,
  Wallet, Sparkles, Target, Layers, ExternalLink, TrendingUp,
} from "lucide-react";
import {
  SectionHeader, Badge, CountUp,
} from "@/components/shared";
import {
  dataCoverage, privacyData,
} from "@/lib/data";
import { timeAgo } from "@/lib/format";

// Map account type to icon
function accountTypeIcon(type: string) {
  switch (type) {
    case "savings":
      return Wallet;
    case "current":
      return Wallet;
    case "credit_card":
      return Layers;
    case "loan":
      return FileText;
    case "investment":
      return TrendingUp;
    default:
      return Wallet;
  }
}

// Sync status visual config
function syncConfig(status: string) {
  switch (status) {
    case "LIVE":
      return {
        label: "Live",
        color: "var(--positive)",
        lightColor: "var(--positive-light)",
        Icon: Cloud,
        dot: true,
      };
    case "RECENT":
      return {
        label: "Recent",
        color: "var(--text-secondary)",
        lightColor: "var(--surface-subtle)",
        Icon: Clock,
        dot: false,
      };
    case "STALE":
      return {
        label: "Stale",
        color: "var(--warning)",
        lightColor: "var(--warning-light)",
        Icon: AlertCircle,
        dot: false,
      };
    default:
      return {
        label: "Unknown",
        color: "var(--text-tertiary)",
        lightColor: "var(--surface-subtle)",
        Icon: CloudOff,
        dot: false,
      };
  }
}

// Map privacy data inventory category to icon
function dataIcon(category: string) {
  const c = category.toLowerCase();
  if (c.includes("transaction")) return FileText;
  if (c.includes("balance")) return Wallet;
  if (c.includes("ai")) return Sparkles;
  if (c.includes("goal") || c.includes("budget")) return Target;
  return Database;
}

export default function DataCoveragePage() {
  const coveragePct = Math.round(dataCoverage.coverage_pct * 100);
  const accountsData = dataCoverage.accounts;
  const lastSync = accountsData
    .map((a) => a.last_synced_at)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];

  const totalRecords = privacyData.data_inventory.reduce(
    (sum, d) => sum + d.record_count,
    0,
  );

  // Trust badges
  const trustBadges = [
    { icon: Lock, label: "AES-256 Encryption", sub: "At rest & in transit" },
    { icon: ShieldCheck, label: "ISO 27001", sub: "Certified" },
    { icon: Key, label: "Zero-knowledge", sub: "We can't see your data" },
    { icon: RefreshCw, label: "Auto-sync", sub: "Every 15 minutes" },
  ];

  // Large ring stroke math
  const ringSize = 200;
  const ringStroke = 16;
  const r = (ringSize - ringStroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c - (coveragePct / 100) * c;

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      {/* ── Header ───────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-[8px] bg-[var(--accent-light)] flex items-center justify-center">
            <Database className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
            Data Coverage · Trust Center
          </span>
        </div>
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">
          How complete is your data?
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-md">
          A healthy financial picture starts with complete data. See what's
          synced, what's stale, and how we protect it all.
        </p>
      </motion.header>

      {/* ── Coverage hero ring ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-8"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--accent) 8%, var(--surface)), var(--surface))",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        }}
      >
        {/* glow */}
        <div
          className="absolute -top-24 -right-24 w-56 h-56 rounded-full opacity-30 pointer-events-none"
          style={{ background: "var(--accent)", filter: "blur(80px)" }}
        />

        <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
          {/* Ring */}
          <div className="relative shrink-0">
            <svg
              width={ringSize}
              height={ringSize}
              viewBox={`0 0 ${ringSize} ${ringSize}`}
              className="-rotate-90"
            >
              <defs>
                <linearGradient id="coverageGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--gold)" />
                </linearGradient>
              </defs>
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={r}
                fill="none"
                stroke="var(--surface-subtle)"
                strokeWidth={ringStroke}
              />
              <motion.circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={r}
                fill="none"
                stroke="url(#coverageGrad)"
                strokeWidth={ringStroke}
                strokeLinecap="round"
                strokeDasharray={c}
                initial={{ strokeDashoffset: c }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CountUp
                value={coveragePct}
                format={(v) => `${Math.round(v)}%`}
                duration={1500}
                className="font-display font-bold text-[40px] leading-none tracking-[-0.02em]"
              />
              <span className="text-[10px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)] mt-1.5">
                Coverage
              </span>
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex-1 grid grid-cols-3 sm:grid-cols-1 gap-4 sm:gap-3 w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[var(--positive)]" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  Synced Accounts
                </p>
                <p className="text-[18px] font-display font-bold tabular-nums">
                  <CountUp value={dataCoverage.synced_accounts} duration={1000} />
                  <span className="text-[14px] text-[var(--text-tertiary)] font-medium">
                    {" "}/ {dataCoverage.total_accounts}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  Last sync
                </p>
                <p className="text-[15px] font-semibold tabular-nums">
                  {timeAgo(lastSync)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  Records tracked
                </p>
                <p className="text-[18px] font-display font-bold tabular-nums">
                  <CountUp
                    value={totalRecords}
                    format={(v) => v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    duration={1500}
                  />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hint about stale account */}
        {dataCoverage.synced_accounts < dataCoverage.total_accounts && (
          <div className="relative mt-5 pt-4 border-t flex items-center gap-2 text-[12px] text-[var(--text-secondary)]" style={{ borderColor: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}>
            <AlertCircle className="w-3.5 h-3.5 text-[var(--warning)] shrink-0" />
            <span>
              <span className="font-semibold text-[var(--foreground)]">
                1 account needs attention
              </span>{" "}
              — Axis Bank is stale. Reconnect to bring coverage to 100%.
            </span>
            <Link
              href="/accounts"
              className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors shrink-0"
            >
              Fix now
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </motion.div>

      {/* ── Account list ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionHeader
          title="Connected accounts"
          action={
            <Link
              href="/accounts"
              className="text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] flex items-center gap-1 transition-colors"
            >
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          }
        />
        <div className="premium-card overflow-hidden">
          {accountsData.map((acc, i) => {
            const cfg = syncConfig(acc.sync_status);
            const SyncIcon = cfg.Icon;
            const TypeIcon = accountTypeIcon(acc.account_type);
            return (
              <div
                key={acc.account_id}
                className={`p-4 flex items-center gap-3 ${i < accountsData.length - 1 ? "border-b border-[var(--border-subtle)]" : ""}`}
              >
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: cfg.lightColor }}
                >
                  <TypeIcon className="w-[18px] h-[18px]" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[14px] font-semibold truncate">
                      {acc.institution_name}
                    </p>
                    <Badge
                      label={acc.account_type.replace("_", " ")}
                      variant="neutral"
                    />
                  </div>
                  <p className="text-[12px] text-[var(--text-tertiary)]">
                    ····{acc.account_number_last4} · synced {timeAgo(acc.last_synced_at)}
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold shrink-0"
                  style={{ background: cfg.lightColor, color: cfg.color }}
                >
                  {cfg.dot && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: cfg.color, animation: "pulse-dot 2s ease-in-out infinite" }}
                    />
                  )}
                  <SyncIcon className="w-3 h-3" />
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Data quality ──────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionHeader
          title="Data we track"
          action={
            <span className="text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
              {totalRecords.toLocaleString("en-IN")} records
            </span>
          }
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {privacyData.data_inventory.map((item, i) => {
            const Icon = dataIcon(item.category);
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}
                className="premium-card p-4 flex flex-col gap-2"
              >
                <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center">
                  <Icon className="w-4 h-4 text-[var(--accent)]" />
                </div>
                <p className="text-[13px] font-semibold leading-[1.3]">
                  {item.category}
                </p>
                <p className="text-[11px] text-[var(--text-tertiary)] leading-[1.4]">
                  {item.description}
                </p>
                <p className="text-[16px] font-display font-bold tabular-nums mt-auto pt-1">
                  <CountUp
                    value={item.record_count}
                    format={(v) => v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    duration={1200}
                  />
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── Trust section ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <SectionHeader
          title="Your data is encrypted end-to-end"
          action={
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.08em] text-[var(--positive)]">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </span>
          }
        />
        <div
          className="relative overflow-hidden rounded-[var(--radius-xl)] p-6 sm:p-7"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in oklab, var(--accent) 8%, var(--surface)), color-mix(in oklab, var(--gold) 6%, var(--surface)))",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          {/* glow */}
          <div
            className="absolute -top-20 -left-20 w-48 h-48 rounded-full opacity-20 pointer-events-none"
            style={{ background: "var(--gold)", filter: "blur(60px)" }}
          />

          <div className="relative flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[18px] tracking-[-0.01em]">
                  Bank-grade security, by default
                </h3>
                <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-[1.5] max-w-lg">
                  Every byte of your financial data is encrypted in transit and at
                  rest. We never sell your data, and you can delete it anytime.
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {trustBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                    className="premium-card p-3 flex flex-col items-start gap-2"
                  >
                    <div className="w-8 h-8 rounded-[8px] bg-[var(--surface-subtle)] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[var(--accent)]" />
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold leading-[1.2]">{badge.label}</p>
                      <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{badge.sub}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Privacy + retention info */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[var(--text-secondary)] pt-4 border-t" style={{ borderColor: "color-mix(in oklab, var(--foreground) 6%, transparent)" }}>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                Data retained: <span className="font-semibold text-[var(--foreground)]">{privacyData.data_retention_days} days</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
                <span className="font-semibold text-[var(--foreground)]">Zero-knowledge</span> architecture
              </span>
              <Link
                href="/you/privacy"
                className="inline-flex items-center gap-1 text-[var(--accent)] font-medium hover:text-[var(--accent-hover)] transition-colors ml-auto"
              >
                Read privacy policy
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Footer link ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="grid sm:grid-cols-2 gap-3"
      >
        <Link
          href="/you/privacy"
          className="premium-card p-4 flex items-center gap-3 group hover:border-[var(--accent)] transition-colors"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold">Privacy Center</p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Manage consent, retention, and exports
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
        </Link>

        <Link
          href="/accounts"
          className="premium-card p-4 flex items-center gap-3 group hover:border-[var(--accent)] transition-colors"
        >
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5 text-[var(--accent)]" />
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold">Reconnect accounts</p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Refresh tokens or add a new bank
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
        </Link>
      </motion.div>
    </div>
  );
}
