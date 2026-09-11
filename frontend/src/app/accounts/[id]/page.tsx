"use client";
import { BalanceCard } from "@/components/shared/balance-card";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { formatPaise, formatDate } from "@/lib/format";
import { FreshnessBadge, EmptyState } from "@/components/shared";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object,label,amount } from "@/lib/response";
import { api, ApiError } from "@/lib/api";

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
  const loader=React.useCallback(async()=>object(await api.getAccountDetail(id)),[id]);
  const state=useResource(loader);
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const acc=object(state.data.account);const balances=object(state.data.balances);
  const money=(value:unknown)=>amount(value)===null?'Unavailable':formatPaise(amount(value)!);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/accounts" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">{label(acc.institution_name)}</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6">
        <BalanceCard institution={label(acc.institution_name)} amountPaise={amount(balances.available_balance_paise)} lastFour={label(acc.account_number_last4,'')} accountType={label(acc.account_type)} tone="midnight" />
        <Link href="/data-coverage" className="inline-flex items-center text-xs text-accent min-h-11 mt-3">Review data coverage</Link>
        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-(--border-subtle)">
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Type</span><p className="text-[15px] font-medium capitalize mt-1">{label(acc.account_type).replaceAll("_", " ")}</p></div>
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Account No.</span><p className="text-[15px] font-medium mt-1">•••• {label(acc.account_number_last4)}</p></div>
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Posted</span><p className="text-[15px] font-medium tabular-nums mt-1">{money(balances.posted_balance_paise)}</p></div>
          <div><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Account status</span><p className="text-[15px] font-medium mt-1">{acc.is_active===true?"Active":"Inactive"}</p></div>
        </div>
        <p className="mt-5 text-xs text-(--text-secondary)">This view reflects imported activity. It does not include an opening balance or guarantee your current bank balance.</p>
        {acc.is_active===true&&<Link href={`/transactions?account=${encodeURIComponent(id)}`} className="inline-flex min-h-11 items-center mt-4 px-4 rounded-xl bg-accent text-accent-foreground text-sm">Import a statement for this account</Link>}
      </motion.div>
    </div>
  );
}
