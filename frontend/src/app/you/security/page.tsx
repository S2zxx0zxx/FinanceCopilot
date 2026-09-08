"use client";
import { useState } from 'react';
import { useClerk, useSession, useUser } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { object, rows, label } from '@/lib/response';
import { useResource } from '@/hooks/use-resource';
import { ResourceState } from '@/components/shared/resource-state';
async function load(){return rows(object(await api.getSecuritySessions()).sessions);}
export default function SecurityPage(){
  const state=useResource(load);const {session}=useSession();const {user}=useUser();const {openUserProfile}=useClerk();
  const [busy,setBusy]=useState<string|null>(null);const [error,setError]=useState<string|null>(null);
  const revoke=async(id:string)=>{setBusy(id);setError(null);try{await api.revokeSession(id);state.reload();}catch(error){setError(error instanceof Error?error.message:'Could not revoke session.');}finally{setBusy(null);}};
  return <main className="max-w-3xl mx-auto flex flex-col gap-6 pb-12"><header><h1 className="font-display text-4xl font-semibold">Security</h1><p className="mt-2 text-(--text-secondary)">Manage access to your financial information.</p></header>
    <section className="premium-card p-6"><h2 className="font-semibold">Two-step verification</h2><p className="text-sm mt-2 text-(--text-secondary)">{user ? user.twoFactorEnabled?'Enabled on your account.':'Not enabled on your account.':'Loading account security…'}</p><button onClick={()=>openUserProfile()} className="mt-4 text-accent text-sm">Manage sign-in security</button></section>
    {error&&<p role="alert" className="text-red-500">{error}</p>}<ResourceState loading={state.loading} error={state.error} retry={state.reload}/>
    {state.data&&<section className="premium-card p-6"><h2 className="text-xl font-semibold mb-4">Sessions</h2>{!state.data.length&&<p className="text-sm text-(--text-secondary)">No sessions returned by your sign-in provider.</p>}{state.data.map(item=><div key={label(item.id)} className="py-4 border-t border-(--border) flex justify-between gap-4"><div><p className="font-medium">{label(item.device,'Web session')}{item.id===session?.id?' · This device':''}</p><p className="text-xs mt-1 text-(--text-secondary)">{label(item.status)}</p></div>{item.id!==session?.id&&item.status==='active'&&<button disabled={busy!==null} onClick={()=>revoke(label(item.id))} className="text-red-500 text-sm disabled:opacity-50">{busy===item.id?'Revoking…':'Revoke'}</button>}</div>)}</section>}
  </main>;
}
