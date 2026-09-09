"use client";
import * as React from "react";
import { motion } from "framer-motion";

import { formatPaise, formatDate } from "@/lib/format";
import Link from "next/link";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object,rows,label,amount } from "@/lib/response";
const loadLiabilities=async()=>object(await api.getLiabilities());

export default function LiabilitiesPage() {
  const state=useResource(loadLiabilities);
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const liabilities={total_paise:amount(state.data.total_paise),accounts:rows(state.data.liabilities).map(row=>({id:label(row.account_id),institution:label(row.account_name),type:label(row.account_type),balance_paise:amount(row.balance_paise)}))};
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div><h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Debt roadmap</h1><p className="text-[14px] text-(--text-secondary) mt-1">What you owe and upcoming payments</p></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 border-[var(--negative)]/20">
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-secondary)">Recorded net debt activity</span>
        <p className="font-display font-bold text-[36px] tabular-nums text-(--negative) mt-2">{liabilities.total_paise===null?"Unavailable":formatPaise(liabilities.total_paise)}</p>
        <p className="text-sm text-(--text-secondary) mt-2">Net posted debits on your loan and credit-card accounts. This excludes opening balances and is not a lender payoff amount.</p><Link href="/accounts" className="text-sm text-accent inline-flex min-h-11 items-center mt-4">Manage debt accounts</Link>
      </motion.div>
      {liabilities.accounts.length===0&&<div className="premium-card p-8"><h2 className="font-semibold">No loan or card accounts added</h2><p className="text-sm text-(--text-secondary) mt-2">Add an account and import its statements to track recorded activity here.</p></div>}
      {liabilities.accounts.map((acc, i) => (
        <div key={i} className="premium-card p-5">
          <div className="flex items-center justify-between mb-3"><div><h3 className="text-[15px] font-semibold">{acc.institution}</h3><p className="text-[12px] text-(--text-tertiary) capitalize">{acc.type}</p></div><span className="text-[18px] font-display font-semibold tabular-nums text-(--negative)">{acc.balance_paise===null?"Unavailable":formatPaise(acc.balance_paise)}</span></div>
          <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-(--border-subtle)">
            <div><span className="text-[10px] font-mono uppercase text-(--text-tertiary)">Min Due</span><p className="text-[14px] font-medium tabular-nums mt-1">Not recorded</p></div>
            <div><span className="text-[10px] font-mono uppercase text-(--text-tertiary)">Due Date</span><p className="text-[14px] font-medium mt-1">Not recorded</p></div>
            <div><span className="text-[10px] font-mono uppercase text-(--text-tertiary)">Utilization</span><p className="text-[14px] font-medium tabular-nums mt-1">Not recorded</p></div>
          </div><Link href={`/accounts/${acc.id}`} className="inline-flex min-h-11 items-center text-sm text-accent mt-3">Review account activity</Link>
        </div>
      ))}
    </div>
  );
}
