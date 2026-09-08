"use client";
import { useState } from 'react';
import { api } from '@/lib/api';
import { amount, label, object, rows } from '@/lib/response';
import { formatPaise } from '@/lib/format';
import { useResource } from '@/hooks/use-resource';
import { ResourceState } from '@/components/shared/resource-state';

async function loadBudgets(){return rows(object(await api.getBudgets()).budgets);}
export default function BudgetsPage(){
  const state=useResource(loadBudgets);
  const [category,setCategory]=useState(''); const [limit,setLimit]=useState('');
  const [busy,setBusy]=useState(false);const [error,setError]=useState<string|null>(null);
  const save=async(event:React.FormEvent)=>{event.preventDefault();setError(null);
    if(!/^\d+(\.\d{1,2})?$/.test(limit)||Number(limit)<=0){setError('Enter a positive amount with up to two decimal places.');return;}
    setBusy(true);try{await api.createBudget({category:category.trim(),budgeted_paise:Math.round(Number(limit)*100),period:'monthly'});setCategory('');setLimit('');state.reload();}catch(error){setError(error instanceof Error?error.message:'Could not save budget.');}finally{setBusy(false);}};
  return <main className="max-w-3xl mx-auto flex flex-col gap-6 pb-12"><header><h1 className="font-display text-4xl font-semibold">Budgets</h1><p className="text-(--text-secondary) mt-2">Set monthly limits and compare them with recorded spending.</p></header>
    <form onSubmit={save} className="premium-card p-6 flex flex-col gap-4"><h2 className="font-semibold">Create or update a category limit</h2><label className="text-sm">Category<input required maxLength={80} value={category} onChange={e=>setCategory(e.target.value)} className="block w-full rounded-xl border border-(--border) bg-(--surface) p-3 mt-2" placeholder="e.g. groceries" /></label><label className="text-sm">Monthly limit in rupees<input required inputMode="decimal" value={limit} onChange={e=>setLimit(e.target.value)} className="block w-full rounded-xl border border-(--border) bg-(--surface) p-3 mt-2" placeholder="0.00" /></label>{error&&<p role="alert" className="text-red-500 text-sm">{error}</p>}<button disabled={busy} className="self-start bg-accent text-accent-foreground px-5 py-2.5 rounded-xl disabled:opacity-50">{busy?'Saving…':'Save budget'}</button></form>
    <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>
    {state.data&&<section className="premium-card p-6">{!state.data.length?<p>No budgets saved yet.</p>:state.data.map(budget=><div key={label(budget.budget_id)} className="py-4 border-b border-(--border) flex justify-between gap-4"><div><h2 className="font-medium capitalize">{label(budget.category)}</h2><p className="text-sm text-(--text-secondary) mt-1">{label(budget.status).replaceAll('_',' ')}</p></div><p className="tabular-nums text-sm">{amount(budget.spent_paise)===null?'Unavailable':formatPaise(amount(budget.spent_paise)!)} / {amount(budget.budgeted_paise)===null?'Unavailable':formatPaise(amount(budget.budgeted_paise)!)}</p></div>)}</section>}
  </main>;
}
