"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useClerk, useUser } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { ArrowUpRight, ShieldCheck, Cable, Download, Lock, LogOut, UserRound } from 'lucide-react';

export default function YouPage() {
  const { user,isLoaded }=useUser();
  const { openUserProfile,signOut }=useClerk();
  const { theme,setTheme }=useTheme();
  const [error,setError]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);
  const exit=async()=>{setBusy(true);setError(null);try{await signOut({redirectUrl:'/sign-in'});}catch{setError('Sign out failed. Please try again.');setBusy(false);}};
  return <main className="max-w-3xl mx-auto flex flex-col gap-6 pb-12">
    <header><p className="text-xs uppercase tracking-[.2em] text-accent">Your account, your choices</p><h1 className="font-display text-4xl font-semibold mt-3">You</h1></header>
    <section className="premium-card p-7 bg-linear-to-br from-accent/10 to-transparent"><div className="flex items-center gap-4"><div className="rounded-full bg-accent/15 p-4"><UserRound className="h-8 w-8 text-accent" /></div><div className="min-w-0"><h2 className="text-2xl font-semibold truncate">{isLoaded ? user?.fullName || 'Your profile' : 'Loading profile…'}</h2><p className="text-sm text-(--text-secondary) mt-1 truncate">{user?.primaryEmailAddress?.emailAddress}</p></div></div><button disabled={!user} onClick={()=>openUserProfile()} className="mt-6 px-4 py-2 rounded-xl bg-accent text-accent-foreground font-medium text-sm disabled:opacity-50">Manage profile & sign-in</button></section>
    <section className="grid sm:grid-cols-2 gap-4">{[
      {href:'/you/connections',title:'Connected accounts',description:'Review your sources and disconnect accounts.',icon:Cable},
      {href:'/you/security',title:'Sessions & security',description:'Review active sessions and manage access.',icon:ShieldCheck},
      {href:'/you/privacy',title:'Privacy choices',description:'Review your data and processing consent.',icon:Lock},
      {href:'/you/export',title:'Export your data',description:'Request a copy of your financial records.',icon:Download},
    ].map(item=><Link key={item.href} href={item.href} className="premium-card p-5 hover:border-accent transition-colors"><div className="flex justify-between"><item.icon className="h-5 w-5 text-accent" /><ArrowUpRight className="h-4 w-4" /></div><h2 className="mt-4 font-semibold">{item.title}</h2><p className="mt-2 text-sm text-(--text-secondary)">{item.description}</p></Link>)}</section>
    <section className="premium-card p-6"><h2 className="font-semibold">Appearance</h2><p className="text-sm text-(--text-secondary) mt-1">Choose how FinCopilot looks on this device.</p><div className="flex gap-2 mt-4">{['system','light','dark'].map(value=><button key={value} aria-pressed={theme===value} onClick={()=>setTheme(value)} className={`px-4 py-2 rounded-xl text-sm capitalize border ${theme===value?'border-accent text-accent':'border-(--border)'}`}>{value}</button>)}</div></section>
    {error && <p role="alert" className="text-red-500">{error}</p>}
    <button disabled={busy} onClick={exit} className="self-start flex gap-2 items-center text-red-500 text-sm py-3 disabled:opacity-50"><LogOut className="h-4 w-4" />{busy?'Signing out…':'Sign out'}</button>
  </main>;
}
