"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { formatPaise } from "@/lib/format";
import { Badge } from "@/components/shared";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object,rows,label,amount } from "@/lib/response";
const loadIncome=async()=>object(await api.getIncome());

export default function IncomePage() {
  const state=useResource(loadIncome);
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const incomeData={period:label(state.data.period),effective_income_paise:amount(object(state.data.income).total_income_paise),sources:rows(state.data.sources).map(row=>({source_name:label(row.source_name),amount_paise:amount(row.amount_paise),record_count:amount(row.record_count),is_recurring:false}))};
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3"><Link href="/money" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link><h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Income streams</h1></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-secondary)">{incomeData.period}</span>
        <p className="font-display font-bold text-[36px] tabular-nums mt-2">{incomeData.effective_income_paise===null?"Unavailable":formatPaise(incomeData.effective_income_paise)}</p>
        <p className="text-sm text-(--text-secondary) mt-2">Posted income from your records. Refunds and transfers are excluded.</p><div className="flex flex-wrap gap-3 mt-5"><Link href="/transactions" className="min-h-11 px-4 rounded-xl bg-accent text-accent-foreground flex items-center text-sm">Explore activity</Link><Link href="/recurring" className="min-h-11 px-4 rounded-xl bg-(--surface-subtle) flex items-center text-sm">Review recurring income</Link></div>
      </motion.div>
      <section className="premium-card overflow-hidden"><h2 className="p-5 font-semibold">Sources this month ? {incomeData.sources.length}</h2>{incomeData.sources.length===0&&<p className="p-5 text-sm text-(--text-secondary)">No eligible income recorded for this period. Import your statement history to begin.</p>}
        {incomeData.sources.map((src, i) => (
          <div key={i} className={`flex items-center justify-between p-4 ${i < incomeData.sources.length - 1 ? "border-b border-(--border-subtle)" : ""}`}>
            <div><p className="text-[14px] font-medium">{src.source_name}</p><p className="text-xs text-(--text-tertiary) mt-1">{src.record_count??"Unknown"} records</p>{src.is_recurring && <Badge label="Recurring" variant="positive" />}</div>
            <span className="text-[15px] font-semibold tabular-nums">{src.amount_paise===null?"Unavailable":formatPaise(src.amount_paise)}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
