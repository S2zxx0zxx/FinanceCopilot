"use client";
import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { object, rows, label } from '@/lib/response';
import { useResource } from '@/hooks/use-resource';
import { ResourceState } from '@/components/shared/resource-state';
async function load(){return rows(object(await api.getConnections()).connections);}
export default function ConnectionsPage(){
  const state=useResource(load);const [busy,setBusy]=useState<string|null>(null);const [error,setError]=useState<string|null>(null);
  const disconnect=async(id:string)=>{setBusy(id);setError(null);try{await api.disconnectConnection(id);state.reload();}catch(error){setError(error instanceof Error?error.message:'Could not disconnect.');}finally{setBusy(null);}};
  return <main className="max-w-3xl mx-auto flex flex-col gap-6 pb-12"><header><h1 className="font-display text-4xl font-semibold">Connected accounts</h1><p className="mt-2 text-(--text-secondary)">Accounts used to organise your imports. Disconnecting stops new imports into that account.</p><Link href="/transactions" className="inline-block mt-4 text-accent">Add an account or import a statement</Link></header>
    {error&&<p role="alert" className="text-red-500">{error}</p>}<ResourceState loading={state.loading} error={state.error} retry={state.reload}/>
    {state.data&&<section className="premium-card p-6">{!state.data.length&&<p>No accounts added yet.</p>}{state.data.map(account=><div key={label(account.account_id)} className="py-4 border-b border-(--border) flex justify-between gap-4"><div><h2 className="font-semibold">{label(account.institution_name)}</h2><p className="text-sm text-(--text-secondary) mt-1">{label(account.account_type).replaceAll('_',' ')} · {account.is_active?'Active':'Disconnected'}</p></div>{account.is_active===true&&<button disabled={busy!==null} onClick={()=>disconnect(label(account.account_id))} className="text-red-500 text-sm disabled:opacity-50">{busy===account.account_id?'Disconnecting…':'Disconnect'}</button>}</div>)}</section>}
  </main>;
}
