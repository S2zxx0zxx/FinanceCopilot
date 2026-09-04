"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";

import { formatPaise, formatDate } from "@/lib/format";
import { FreshnessBadge, EmptyState } from "@/components/shared";
import type { Account } from "@/lib/data";

function isRecentlySynced(lastSyncedAt: string): boolean {
  try {
    const diff = Date.now() - new Date(lastSyncedAt).getTime();
    return diff < 24 * 3600 * 1000;
  } catch {
    return false;
  }
}

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [acc, setAcc] = React.useState<Account | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getAccountDetail(id)
      .then((res: any) => {
        if (!mounted) return;
        const a: Account = res?.account || res?.data || res;
        setAcc(a ?? null);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setError(err instanceof ApiError ? err.message : "Account not found");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/accounts" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Account</h1>
        </div>
        <div className="premium-card p-6 flex items-center justify-center">
          <span className="w-6 h-6 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!acc || error) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/accounts" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Account</h1>
        </div>
        <EmptyState
          icon={<ArrowLeft className="w-8 h-8" strokeWidth={1.5} />}
          title="Not found"
          description={error || "We couldn't find this account."}
          action={
            <Link href="/accounts" className="mt-2 px-4 py-2 rounded-[10px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors">
              Back to accounts
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/accounts" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">{acc.institution_name}</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6">
        <div className="flex items-center justify-between mb-4"><span className="text-[11px] font-mono uppercase tracking-widest text-(--text-secondary)">Available Balance</span><FreshnessBadge status={isRecentlySynced(acc.last_synced_at) ? "live" : "recent"} /></div>
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
