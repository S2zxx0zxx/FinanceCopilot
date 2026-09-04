"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Unlink,
  Check,
  AlertTriangle,
  ShieldCheck,
} from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { type Account } from "@/lib/data";
import { formatPaise, timeAgo } from "@/lib/format";


// ── Helpers ────────────────────────────────────────────────────────────────

type SyncStatus = "LIVE" | "RECENT" | "STALE";

function getSyncStatus(lastSyncedAt: string): SyncStatus {
  const diff = Date.now() - new Date(lastSyncedAt).getTime();
  const hours = diff / 3600000;
  if (hours < 12) return "LIVE";
  if (hours < 36) return "RECENT";
  return "STALE";
}

function getInstitutionInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

function getInstitutionEmoji(account: Account): string {
  const map: Record<string, string> = {
    "HDFC Bank": "🏦",
    "ICICI Bank": "🏛️",
    "Axis Bank": "💳",
    Zerodha: "📈",
  };
  return map[account.institution_name] || "🏦";
}

function getAccountTypeLabel(type: Account["account_type"]): string {
  const labels: Record<Account["account_type"], string> = {
    savings: "Savings Account",
    current: "Current Account",
    credit_card: "Credit Card",
    loan: "Loan Account",
    investment: "Investment Account",
  };
  return labels[type] || type;
}

const SYNC_STATUS_CONFIG: Record<
  SyncStatus,
  { label: string; variant: "positive" | "neutral" | "warning"; dotColor: string }
> = {
  LIVE: { label: "LIVE", variant: "positive", dotColor: "var(--positive)" },
  RECENT: { label: "RECENT", variant: "neutral", dotColor: "var(--text-tertiary)" },
  STALE: { label: "STALE", variant: "warning", dotColor: "var(--warning)" },
};

// ── Page ────────────────────────────────────────────────────────────────────

export default function ConnectionsPage() {
  const { accounts } = useAppData();
  const [accountList, setAccountList] = React.useState<Account[]>(accounts);
  const [disconnecting, setDisconnecting] = React.useState<string | null>(null);
  const [confirmDisconnect, setConfirmDisconnect] = React.useState<string | null>(null);

  const liveCount = accountList.filter(
    (a) => getSyncStatus(a.last_synced_at) === "LIVE"
  ).length;

  const { toast } = useToast();

  const handleSync = async (_accountId: string) => {
    // The per-account sync endpoint isn't available yet — surface a clear toast
    // instead of silently mutating local state and pretending we synced.
    toast({
      title: "Bank sync coming soon",
      description:
        "Automatic re-sync will be available in the next release. For now, disconnect and reconnect to refresh.",
    });
  };

  const handleAddNew = () => {
    toast({
      title: "Bank connection coming soon",
      description:
        "We're rolling out Setu AA integration in the next release. You'll be able to add banks securely here.",
    });
  };

  const handleDisconnect = async (accountId: string) => {
    setDisconnecting(accountId);
    try {
      await api.disconnectConnection(accountId);
      setAccountList((list) =>
        list.map((a) =>
          a.account_id === accountId ? { ...a, is_active: false } : a
        )
      );
      toast({ title: "Disconnected", description: "Account disconnected successfully." });
    } catch {
      toast({ title: "Disconnect failed", description: "Could not disconnect account.", variant: "destructive" });
    } finally {
      setDisconnecting(null);
      setConfirmDisconnect(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <Link
          href="/you"
          aria-label="Back to You"
          className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">
            Connections
          </h1>
          <p className="text-[13px] text-(--text-secondary) mt-0.5">
            Manage your linked bank accounts and institutions
          </p>
        </div>
        <button
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          onClick={handleAddNew}
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </motion.div>

      {/* Summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="premium-card p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-light)] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold">
            {accountList.filter((a) => a.is_active).length} active connections
          </p>
          <p className="text-[12px] text-(--text-tertiary)">
            {liveCount} live · bank-grade encryption · re-auth required every 90
            days
          </p>
        </div>
      </motion.div>

      {/* Mobile Add button */}
      <button
        className="sm:hidden inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-[12px] bg-accent text-accent-foreground text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        onClick={handleAddNew}
      >
        <Plus className="w-4 h-4" />
        Add New Connection
      </button>

      {/* Account list */}
      <div className="flex flex-col gap-3">
        {accountList.map((account, idx) => {
          const syncStatus = getSyncStatus(account.last_synced_at);
          const syncConfig = SYNC_STATUS_CONFIG[syncStatus];
          const isDisconnecting = disconnecting === account.account_id;
          const showConfirm = confirmDisconnect === account.account_id;
          const maskedNumber = `••••${account.account_number_last4}`;
          const balance = account.balances.available_balance_paise;
          const isCreditCard = account.account_type === "credit_card";

          return (
            <motion.article
              key={account.account_id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + idx * 0.06 }}
              className="premium-card p-5 flex flex-col gap-4"
              style={{ opacity: account.is_active ? 1 : 0.55 }}
            >
              {/* Top row */}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[14px] bg-linear-to-br from-[var(--surface-subtle)] to-[var(--surface-active)] flex items-center justify-center text-[22px] shrink-0">
                  {getInstitutionEmoji(account)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-[15px] truncate">
                      {account.institution_name}
                    </h3>
                    {!account.is_active && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary) px-1.5 py-0.5 rounded bg-[var(--surface-subtle)]">
                        Disconnected
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-(--text-secondary) mt-0.5">
                    {getAccountTypeLabel(account.account_type)} · {maskedNumber}
                  </p>
                </div>
                <SyncStatusBadge status={syncStatus} />
              </div>

              {/* Balance */}
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
                    {isCreditCard ? "Outstanding" : "Available balance"}
                  </p>
                  <p
                    className="font-display font-bold text-[22px] tabular-nums tracking-[-0.02em] mt-0.5"
                    style={{
                      color:
                        balance < 0
                          ? "var(--negative)"
                          : "var(--foreground)",
                    }}
                  >
                    {formatPaise(balance)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary)">
                    Last synced
                  </p>
                  <p className="text-[12px] text-(--text-secondary) mt-0.5">
                    {timeAgo(account.last_synced_at)}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1 border-t border-(--border-subtle)">
                <button
                  disabled={!account.is_active}
                  onClick={() => handleSync(account.account_id)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[13px] font-medium text-accent hover:bg-[var(--accent-light)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Sync Now
                </button>
                <div className="flex-1" />
                {showConfirm ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] text-(--text-tertiary)">
                      Sure?
                    </span>
                    <button
                      disabled={isDisconnecting}
                      onClick={() => handleDisconnect(account.account_id)}
                      className="px-2.5 py-2 rounded-[10px] text-[12px] font-semibold text-white bg-[var(--negative)] hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isDisconnecting ? "…" : "Yes, disconnect"}
                    </button>
                    <button
                      onClick={() => setConfirmDisconnect(null)}
                      className="px-2.5 py-2 rounded-[10px] text-[12px] font-medium text-(--text-secondary) hover:bg-(--surface-subtle) transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={!account.is_active || isDisconnecting}
                    onClick={() => setConfirmDisconnect(account.account_id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[13px] font-medium text-(--text-tertiary) hover:text-(--negative) hover:bg-(--negative-light) transition-colors disabled:opacity-40"
                  >
                    <Unlink className="w-3.5 h-3.5" />
                    Disconnect
                  </button>
                )}
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Reconnect reminder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="premium-card p-4 flex items-start gap-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="w-8 h-8 rounded-[10px] bg-[var(--warning-light)] flex items-center justify-center shrink-0">
          <AlertTriangle className="w-4 h-4 text-(--warning)" />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-semibold">Re-authentication reminder</p>
          <p className="text-[12px] text-(--text-tertiary) mt-0.5 leading-normal">
            Banks require re-authentication every 90 days per RBI guidelines.
            We'll notify you before any connection expires.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ── Sync Status Badge ──────────────────────────────────────────────────────

function SyncStatusBadge({ status }: { status: SyncStatus }) {
  const config = SYNC_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
        config.variant === "positive"
          ? "bg-[var(--positive-light)] text-(--positive)"
          : config.variant === "warning"
            ? "bg-[var(--warning-light)] text-(--warning)"
            : "bg-[var(--surface-subtle)] text-(--text-secondary)"
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: config.dotColor,
          animation:
            status === "LIVE"
              ? "pulse-dot 2s ease-in-out infinite"
              : undefined,
        }}
      />
      {config.label}
    </span>
  );
}
