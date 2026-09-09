"use client";
import { useAuth } from "@clerk/nextjs";
import { useResource } from "@/hooks/use-resource";
import { object, label, amount } from "@/lib/response";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { formatPaise, formatDate, categoryIcon } from "@/lib/format";
import { Badge, EmptyState } from "@/components/shared";
import type { Transaction } from "@/lib/data";
import { api, ApiError } from "@/lib/api";

export default function TransactionDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);
  const loader=React.useCallback(async()=>object(await api.getTransactionDetail(id)),[id]);
  const state=useResource(loader);
  const loading=state.loading; const error=state.error;
  const tx=state.data ? { ...state.data, merchant_name:label(state.data.merchant_normalized,label(state.data.merchant_raw)), category:label(state.data.transaction_type), amount_paise:amount(state.data.amount_paise), direction:label(state.data.direction), pending:state.data.posting_status==='pending', observed_at:label(state.data.observed_at,''), date:label(state.data.observed_at,''), source:state.data.is_manual===true?'manual':state.data.source_record_id?'imported record':'Not recorded', notes:label(state.data.notes,'') } : null;

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/transactions" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Transaction</h1>
        </div>
        <div className="premium-card p-6 flex items-center justify-center">
          <span className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!tx || error) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/transactions" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Transaction</h1>
        </div>
        <EmptyState
          icon={<ArrowLeft className="w-8 h-8" strokeWidth={1.5} />}
          title="Not found"
          description={error || "We couldn't find this transaction."}
          action={
            <Link href="/transactions" className="mt-2 px-4 py-2 rounded-[10px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-(--accent-hover) transition-colors">
              Back to transactions
            </Link>
          }
        />
      </div>
    );
  }

  const isIncome = tx.direction === "credit";

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/transactions" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Transaction</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-(--surface-subtle) flex items-center justify-center text-[32px]">{categoryIcon(tx.category)}</div>
        <p className="text-[18px] font-semibold">{tx.merchant_name}</p>
        <p className={`font-display font-bold text-[36px] tabular-nums ${isIncome ? "text-(--positive)" : ""}`}>{isIncome ? "+" : ""}{tx.amount_paise===null?'Unavailable':formatPaise(tx.amount_paise)}</p>
        <div className="flex flex-wrap items-center justify-center gap-2"><Badge label={tx.category} variant="neutral" />{tx.pending && <Badge label="Pending" variant="warning" />}</div>
      </motion.div>
      <div className="premium-card p-5 flex flex-col gap-3 break-words">
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Date</span><span className="text-[13px] font-medium">{formatDate(tx.date || tx.observed_at, { style: "long" })}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Category</span><span className="text-[13px] font-medium capitalize">{tx.category}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Direction</span><span className="text-[13px] font-medium capitalize">{tx.direction}</span></div>
        <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Source</span><span className="text-[13px] font-medium capitalize">{(tx.source || "manual").replace("_", " ")}</span></div>
        {tx.notes && <div className="flex justify-between"><span className="text-[13px] text-(--text-tertiary)">Notes</span><span className="text-[13px] font-medium text-(--warning)">{tx.notes}</span></div>}
      </div>
      {state.data&&<TransactionCorrection key={id} transaction={state.data} id={id} onSaved={state.reload}/>}
    </div>
  );
}

function TransactionCorrection({transaction,id,onSaved}:{transaction:Record<string,unknown>;id:string;onSaved:()=>void}) {
 const {userId}=useAuth(); const owner=React.useRef(userId);owner.current=userId;
 const [merchant,setMerchant]=React.useState(label(transaction.merchant_normalized,label(transaction.merchant_raw,'')));
 const [type,setType]=React.useState(label(transaction.transaction_type,'unknown'));
 const [reviewed,setReviewed]=React.useState(false); const [saving,setSaving]=React.useState(false);
 const [error,setError]=React.useState<string|null>(null);
 const types=['expense','income','transfer_out','transfer_in','refund','reversal','card_settlement','emi','interest','fee','cash_withdrawal','unknown'];
 const submit=async(event:React.FormEvent)=>{event.preventDefault();if(saving||!userId)return;const requestOwner=userId;setSaving(true);setError(null);try{await api.updateTransaction(id,{merchant_normalized:merchant,transaction_type:type,...(reviewed?{reviewed:true}:{})});if(owner.current===requestOwner)onSaved();}catch(error){if(owner.current===requestOwner)setError(error instanceof Error?error.message:'Could not save correction.');}finally{if(owner.current===requestOwner)setSaving(false);}};
 return <form onSubmit={submit} className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">Review this record</h2><p className="text-sm text-(--text-secondary) mt-2">Correct the merchant or transaction type. The original imported source remains preserved.</p><div className="grid sm:grid-cols-2 gap-4 mt-5"><label className="text-sm">Merchant<input required maxLength={200} value={merchant} onChange={event=>setMerchant(event.target.value)} className="w-full mt-2 min-h-11 px-3 rounded-xl bg-(--surface) border border-(--border)"/></label><label className="text-sm">Transaction type<select value={type} onChange={event=>setType(event.target.value)} className="w-full mt-2 min-h-11 px-3 rounded-xl bg-(--surface) border border-(--border)">{types.map(value=><option key={value} value={value}>{value.replaceAll('_',' ')}</option>)}</select></label></div>
 {transaction.needs_review===true&&<div className="mt-5 rounded-xl bg-(--surface-subtle) p-4"><p className="text-sm font-medium">This record needs review</p>{Array.isArray(transaction.review_reason)&&<ul className="text-xs text-(--text-secondary) mt-2 list-disc pl-4">{transaction.review_reason.map((reason,index)=><li key={index}>{String(reason).replaceAll('_',' ')}</li>)}</ul>}<label className="flex items-start gap-3 mt-4 text-sm"><input type="checkbox" checked={reviewed} onChange={event=>setReviewed(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-(--accent)"/><span>I checked the amount, date, direction and type against my statement. Include this reviewed record in eligible financial summaries.</span></label></div>}
 {error&&<p role="alert" className="text-sm text-(--negative) mt-4">{error}</p>}<button disabled={saving||!merchant.trim()} className="min-h-11 px-5 rounded-xl bg-accent text-accent-foreground text-sm font-medium mt-5 disabled:opacity-50">{saving?'Saving...':reviewed?'Save and complete review':'Save correction'}</button></form>;
}
