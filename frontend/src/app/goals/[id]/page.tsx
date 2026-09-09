"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { formatPaise, formatDate } from "@/lib/format";
import { Badge, ProgressRing, EmptyState } from "@/components/shared";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object,rows,label,amount } from "@/lib/response";
import { api, ApiError } from "@/lib/api";

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const loader=React.useCallback(async()=>object(await api.getGoalDetail(id)),[id]);
  const state=useResource(loader);
  const currentId=React.useRef(id);currentId.current=id;
  const [contribution,setContribution]=React.useState('');
  const [saving,setSaving]=React.useState(false);const [saveError,setSaveError]=React.useState<string|null>(null);
  const attempt=React.useRef<{value:number;key:string}|null>(null);
  React.useEffect(()=>{attempt.current=null;setContribution('');setSaveError(null);setSaving(false);},[id]);
  const save=async(event:React.FormEvent)=>{event.preventDefault();if(saving)return;
    const value=Math.round(Number(contribution)*100);
    if(!/^\d+(\.\d{1,2})?$/.test(contribution)||!Number.isSafeInteger(value)||value<=0){setSaveError('Enter a positive rupee amount with at most two decimals.');return;}
    if(attempt.current&&attempt.current.value!==value){setSaveError('Retry the original amount first so an uncertain request is not recorded twice.');return;}
    if(!attempt.current)attempt.current={value,key:crypto.randomUUID()};
    setSaving(true);setSaveError(null);
    try{await api.addGoalContribution(id,value,attempt.current.key);if(currentId.current!==id)return;attempt.current=null;setContribution('');state.reload();}catch(error){if(currentId.current!==id)return;setSaveError(error instanceof Error?error.message:'Contribution could not be recorded. Retry the same amount.');}finally{if(currentId.current===id)setSaving(false);}
  };
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const goal=state.data;const pace=object(goal.pace);const current=amount(goal.current_amount_paise);const target=amount(goal.target_amount_paise);
  const progress=current!==null&&target&&target>0?Math.min(100,Math.max(0,Math.round(current/target*100))):null;
  const money=(value:unknown)=>amount(value)===null?'Unavailable':formatPaise(amount(value)!);

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/goals" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">{label(goal.name)}</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 flex flex-wrap items-center gap-6">
        <ProgressRing pct={progress??0} size={100} stroke={8} color="var(--accent)" />
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-secondary)">Progress</span>
          <p className="font-display font-bold text-[32px] tabular-nums mt-1">{progress===null?"Unavailable":`${progress}%`}</p>
          <Badge label={label(pace.status).replaceAll("_", " ")} variant="neutral" />
        </div>
      </motion.div>
      <div className="grid grid-cols-2 gap-4">
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Current</span><p className="text-[20px] font-display font-semibold tabular-nums mt-1">{money(goal.current_amount_paise)}</p></div>
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Target</span><p className="text-[20px] font-display font-semibold tabular-nums mt-1">{money(goal.target_amount_paise)}</p></div>
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Monthly</span><p className="text-[20px] font-display font-semibold tabular-nums mt-1">{money(goal.monthly_contribution_paise)}</p></div>
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Target Date</span><p className="text-[20px] font-display font-semibold mt-1">{goal.target_date?formatDate(label(goal.target_date)):"No date set"}</p></div>
      </div>
      <section className="premium-card p-5 sm:p-6"><h2 className="font-semibold text-lg">Record money you have saved</h2><p className="text-sm text-(--text-secondary) mt-2">This records a manual contribution towards your goal. It does not transfer money between accounts.</p><form onSubmit={save} className="flex flex-col sm:flex-row gap-3 mt-5"><label className="flex-1 text-sm">Amount in rupees<input required inputMode="decimal" value={contribution} disabled={saving} onChange={e=>setContribution(e.target.value)} className="block w-full mt-2 min-h-11 px-3 border border-(--border) rounded-xl bg-(--surface)" placeholder="0.00"/></label><button disabled={saving||['completed','abandoned'].includes(label(goal.status))} className="self-end min-h-11 px-4 rounded-xl bg-accent text-accent-foreground disabled:opacity-40">{saving?'Recording...':'Record contribution'}</button></form>{saveError&&<p role="alert" className="text-sm text-red-500 mt-3">{saveError}</p>}</section>
      <section className="premium-card p-5 sm:p-6"><h2 className="font-semibold text-lg">Contribution history</h2><div className="divide-y divide-(--border) mt-3">{rows(goal.contributions).map(row=><div key={label(row.contribution_id)} className="flex flex-wrap justify-between gap-3 py-4"><div><p className="text-sm font-medium">{money(row.amount_paise)}</p><p className="text-xs text-(--text-secondary) mt-1">{label(row.source_type)} ? {label(row.status)}</p></div><time className="text-xs text-(--text-secondary)">{formatDate(label(row.contribution_date))}</time></div>)}{rows(goal.contributions).length===0&&<p className="text-sm text-(--text-secondary) py-5">No contributions recorded yet.</p>}</div></section>
    </div>
  );
}
