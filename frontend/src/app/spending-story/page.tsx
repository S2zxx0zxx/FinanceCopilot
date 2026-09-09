"use client";
import * as React from "react";
import { motion } from "framer-motion";

import { formatPaise } from "@/lib/format";
import { MiniBarChart } from "@/components/charts/sparkline";
import { SectionHeader } from "@/components/shared";
import Link from "next/link";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object, rows, amount, label } from "@/lib/response";
const loadSpending=async()=>object(await api.getSpendingStory());

export default function SpendingStoryPage() {
  const state=useResource(loadSpending);
  const [search,setSearch]=React.useState('');
  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const spending=object(state.data.spending);
  const categories=rows(state.data.categories).map(row=>({category:label(row.category),amount_paise:amount(row.amount_paise),record_count:amount(row.record_count)}));
  const filtered=categories.filter(row=>row.category.toLowerCase().includes(search.toLowerCase()));
  const spendingStory={period:label(state.data.period),total_spent_paise:amount(spending.effective_spending_paise),categories};
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div><h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Spending lens</h1><p className="text-[14px] text-(--text-secondary) mt-1">{spendingStory.period}</p></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6">
        <p className="font-display font-bold text-[36px] tabular-nums">{spendingStory.total_spent_paise===null?"Unavailable":formatPaise(spendingStory.total_spent_paise)}</p>
        <p className="text-sm text-(--text-secondary) mt-2">Recorded expenses after refunds and reversals. Transfers are excluded.</p>
        <div className="grid sm:grid-cols-2 gap-3 mt-5">{[{title:'Before offsets',value:spending.gross_spending_paise},{title:'Refunds and reversals',value:spending.offsets_paise}].map(item=><div key={item.title} className="rounded-xl bg-(--surface-subtle) p-4"><p className="text-xs text-(--text-secondary)">{item.title}</p><p className="font-semibold text-lg mt-2">{amount(item.value)===null?'Unavailable':formatPaise(amount(item.value)!)}</p></div>)}</div>
        <Link href="/budgets" className="inline-flex items-center min-h-11 mt-4 text-sm text-accent">Turn this view into spending guardrails</Link>
      </motion.div>
      <section><SectionHeader title="Category comparison (INR)" /><div className="premium-card p-5"><MiniBarChart data={spendingStory.categories.filter(c=>(c.amount_paise??0)>0).slice(0,10).map(c => ({ label: c.category, value: (c.amount_paise??0) / 100, color: "var(--accent)" }))} height={120} /></div></section>
      <section className="premium-card p-5"><div className="flex flex-col sm:flex-row gap-3 justify-between"><h2 className="font-semibold text-lg">Every category, in detail</h2><input aria-label="Search spending categories" placeholder="Find a category" value={search} onChange={e=>setSearch(e.target.value)} className="min-h-11 rounded-xl bg-(--surface-subtle) border border-(--border) px-3"/></div><div className="mt-4 divide-y divide-(--border)">{filtered.map(category=><div key={category.category} className="flex items-center justify-between gap-4 py-4"><div><h3 className="text-sm font-medium">{category.category}</h3><p className="text-xs text-(--text-tertiary) mt-1">{category.record_count??'Unavailable'} records</p></div><p className="font-mono text-sm">{category.amount_paise===null?'Unavailable':formatPaise(category.amount_paise)}</p></div>)}{filtered.length===0&&<p className="py-8 text-sm text-(--text-secondary)">{categories.length?'No category matches your search.':'No eligible spending records yet. Import a statement to build this view.'}</p>}</div></section>
    </div>
  );
}
