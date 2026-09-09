"use client";
import { useState } from 'react';
import { api } from '@/lib/api';
import { object, rows, label, amount } from '@/lib/response';
import { useResource } from '@/hooks/use-resource';
import { ResourceState } from '@/components/shared/resource-state';
async function load(){const data=object(await api.getPrivacyInventory());return {policies:rows(data.inventory),consents:rows(data.consentOptions),footprint:rows(data.data_inventory)};}
export default function PrivacyPage(){
  const state=useResource(load);const [busy,setBusy]=useState<string|null>(null);const [error,setError]=useState<string|null>(null);
  const update=async(id:string,granted:boolean)=>{setBusy(id);setError(null);try{await api.updatePrivacyConsent({id,granted});state.reload();}catch(error){setError(error instanceof Error?error.message:'Could not save privacy choice.');}finally{setBusy(null);}};
  return <main className="max-w-3xl mx-auto flex flex-col gap-6 pb-12"><header><h1 className="font-display text-4xl font-semibold">Privacy choices</h1><p className="mt-2 text-(--text-secondary)">Review and change your recorded processing consent.</p></header>
    {error&&<p role="alert" className="text-red-500">{error}</p>}<ResourceState loading={state.loading} error={state.error} retry={state.reload}/>
    {state.data&&<><section className="premium-card p-6">{state.data.policies.map(policy=>{const granted=state.data?.consents.find(consent=>consent.policy_id===policy.id)?.granted===true;return <div key={label(policy.id)} className="py-4 border-b border-(--border) flex justify-between gap-5"><div><h2 className="font-semibold">{label(policy.title)}</h2><p className="text-sm text-(--text-secondary) mt-2">{label(policy.description)}</p><p className="text-xs mt-2">Version {label(policy.version)}</p></div><button aria-pressed={granted} disabled={busy!==null} onClick={()=>update(label(policy.id),!granted)} className="text-sm text-accent disabled:opacity-50">{busy===policy.id?'Saving…':granted?'Granted · revoke':'Not granted · allow'}</button></div>;})}</section><section className="premium-card p-6"><h2 className="text-xl font-semibold mb-4">Data inventory</h2>{state.data.footprint.map(row=><div key={label(row.category)} className="flex justify-between py-3"><span>{label(row.category)}</span><span className="tabular-nums">{amount(row.record_count)??'Unavailable'}</span></div>)}</section></>}
  </main>;
}
