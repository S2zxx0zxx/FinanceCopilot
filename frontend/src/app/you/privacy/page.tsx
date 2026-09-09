"use client";
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, Database, ShieldCheck, History, Clock, Download, Trash2, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { object, rows, label, amount } from '@/lib/response';
import { formatDate } from '@/lib/format';
import { useResource } from '@/hooks/use-resource';
import { ResourceState } from '@/components/shared/resource-state';

async function load() {
  const data = object(await api.getPrivacyInventory());
  return { policies: rows(data.inventory), consents: rows(data.consentOptions), footprint: rows(data.data_inventory), history: rows(data.consent_history ?? []) };
}

export default function PrivacyPage() {
  const state = useResource(load);
  const { userId } = useAuth();
  const owner = useRef(userId);
  owner.current = userId;
  const reducedMotion = useReducedMotion();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  useEffect(() => { setBusy(null); setError(null); setFeedback(null); }, [userId]);
  const update = async (id: string, granted: boolean) => {
    if (busy || !userId) return;
    const requestOwner = userId;
    setBusy(id); setError(null); setFeedback(null);
    try {
      await api.updatePrivacyConsent({ id, granted });
      if (owner.current !== requestOwner) return;
      setFeedback('Your consent choice has been recorded.'); state.reload();
    } catch (error) {
      if (owner.current === requestOwner) setError(error instanceof Error ? error.message : 'Could not save privacy choice.');
    } finally { if (owner.current === requestOwner) setBusy(null); }
  };
  const data = state.data;
  const grantedCount = data?.policies.filter(policy => data.consents.some(consent => consent.policy_id === policy.id && consent.granted === true)).length ?? 0;
  return <main className="max-w-4xl mx-auto flex flex-col gap-7 pb-12">
    <header className="flex items-start gap-3">
      <Link href="/you" aria-label="Back to your space" className="h-11 w-11 shrink-0 rounded-xl flex items-center justify-center hover:bg-(--surface-subtle)"><ArrowLeft className="w-5 h-5" /></Link>
      <div><p className="text-xs uppercase tracking-[.18em] text-accent">Your space</p><h1 className="font-display text-3xl sm:text-4xl font-bold mt-2">Privacy, on your terms</h1><p className="mt-3 text-sm text-(--text-secondary)">See what is stored, review your choices and keep control of your records.</p></div>
    </header>
    <motion.section initial={reducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="premium-card-glow p-5 sm:p-7 flex items-start gap-4">
      <div className="p-3 rounded-2xl bg-accent text-accent-foreground"><ShieldCheck className="w-6 h-6" /></div>
      <div><h2 className="text-lg font-semibold">Clarity before consent</h2><p className="text-sm text-(--text-secondary) mt-2 leading-relaxed">These controls record your choices for the policies below. Revoking permission changes future eligible processing; it does not erase existing records. Manage deletion separately in Data & Account.</p></div>
    </motion.section>
    {error && <p role="alert" className="premium-card p-4 text-(--negative)">{error}</p>}
    {feedback && <p role="status" className="flex items-center gap-2 text-sm text-(--positive)"><Check className="w-4 h-4" />{feedback}</p>}
    <ResourceState loading={state.loading} error={state.error} retry={state.reload} />
    {data && <>
      <section aria-labelledby="inventory-heading"><SectionTitle id="inventory-heading" icon={<Database className="w-4 h-4" />}>Your data inventory</SectionTitle>
        <div className="grid sm:grid-cols-2 gap-3">{data.footprint.map(row => <div key={label(row.category)} className="premium-card p-5"><p className="text-sm font-medium">{label(row.category)}</p><p className="font-display text-3xl font-bold mt-4 tabular-nums">{amount(row.record_count)?.toLocaleString('en-IN') ?? 'Unavailable'}</p><p className="text-xs text-(--text-secondary) mt-2">Stored records</p><p className="text-xs text-(--text-tertiary) mt-3">{label(row.description)}</p></div>)}</div>
      </section>
      <section aria-labelledby="consent-heading"><SectionTitle id="consent-heading" icon={<ShieldCheck className="w-4 h-4" />}>Consent controls</SectionTitle>
        <div className="premium-card overflow-hidden"><div className="p-5 bg-(--surface-subtle) flex items-center justify-between gap-3"><p className="text-sm font-medium">Your recorded permissions</p><span className="text-xs tabular-nums text-(--text-secondary)">{grantedCount} of {data.policies.length} granted</span></div>
          <div className="divide-y divide-(--border)">{data.policies.map(policy => {
            const id = label(policy.id);
            const granted = data.consents.some(consent => consent.policy_id === id && consent.granted === true);
            return <div key={id} className="p-5 flex items-start justify-between gap-4"><div className="min-w-0"><h3 className="font-semibold text-sm">{label(policy.title)}</h3><p className="text-sm text-(--text-secondary) mt-2">{label(policy.description)}</p><p className="text-xs text-(--text-tertiary) mt-3">Policy version {label(policy.version)} &middot; {granted ? 'Granted' : 'Not granted'}</p></div><button role="switch" aria-checked={granted} aria-label={label(policy.title)} disabled={busy !== null} onClick={() => update(id, !granted)} className={`shrink-0 h-11 w-16 rounded-full p-1.5 transition-colors disabled:opacity-50 ${granted ? 'bg-accent' : 'bg-(--surface-subtle) border border-(--border)'}`}><span className={`block h-8 w-8 rounded-full bg-white shadow transition-transform ${granted ? 'translate-x-5' : ''}`} /></button></div>;
          })}</div>
        </div>
      </section>
      <section aria-labelledby="retention-heading"><SectionTitle id="retention-heading" icon={<Clock className="w-4 h-4" />}>Data retention</SectionTitle><div className="premium-card p-5"><h3 className="font-semibold text-sm">Understand what stays</h3><p className="text-sm text-(--text-secondary) mt-2 leading-relaxed">Automatic deletion after a chosen number of days is not currently available. A saved preference alone does not erase data. Use the account controls to request an export or deletion and review the actual request status.</p><Link href="/you/export" className="inline-flex items-center gap-2 min-h-11 mt-3 text-sm text-accent font-medium">Open data controls<ArrowUpRight className="w-4 h-4" /></Link></div></section>
      <section aria-labelledby="history-heading"><SectionTitle id="history-heading" icon={<History className="w-4 h-4" />}>Consent history</SectionTitle><div className="premium-card p-5"><p className="text-xs text-(--text-tertiary) mb-4">Latest 50 recorded choices, newest first.</p>{data.history.length === 0 ? <p className="text-sm text-(--text-secondary)">No consent records yet.</p> : <ol className="divide-y divide-(--border)">{data.history.map(entry => <li key={label(entry.consent_id)} className="py-4 flex items-start gap-3"><span className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${entry.consented === true ? 'bg-accent' : 'bg-(--text-tertiary)'}`} /><div className="min-w-0"><p className="text-sm font-medium">{label(data.policies.find(policy => policy.id === entry.consent_type)?.title, label(entry.consent_type))}</p><p className="text-xs text-(--text-secondary) mt-2">{entry.consented === true ? 'Permission recorded' : 'Permission declined'} &middot; {label(entry.status)} &middot; Version {label(entry.version)}</p><p className="text-xs text-(--text-tertiary) mt-2">{typeof entry.granted_at === 'string' ? formatDate(entry.granted_at, { style: 'long' }) : 'Date unavailable'}</p>{typeof entry.revoked_at === 'string' && <p className="text-xs text-(--text-secondary) mt-1">Revoked {formatDate(entry.revoked_at, { style: 'long' })}</p>}</div></li>)}</ol>}</div></section>
      <section className="grid sm:grid-cols-2 gap-3"><Link href="/you/export" className="premium-card p-5 group"><Download className="w-5 h-5 text-accent" /><h2 className="font-semibold mt-3">Take your records with you</h2><p className="text-sm text-(--text-secondary) mt-2">Request an export and check whether a file is ready.</p><span className="inline-flex items-center gap-2 min-h-11 mt-2 text-sm text-accent">Data & Account<ArrowUpRight className="w-4 h-4" /></span></Link><Link href="/you/export" className="premium-card p-5"><Trash2 className="w-5 h-5 text-(--negative)" /><h2 className="font-semibold mt-3">Account deletion</h2><p className="text-sm text-(--text-secondary) mt-2">Review the deletion request and confirmation controls.</p><span className="inline-flex items-center gap-2 min-h-11 mt-2 text-sm text-(--negative)">Review account controls<ArrowUpRight className="w-4 h-4" /></span></Link></section>
    </>}
  </main>;
}
function SectionTitle({ id, icon, children }: { id: string; icon: ReactNode; children: ReactNode }) {
  return <h2 id={id} className="flex items-center gap-2 text-xs font-mono uppercase tracking-[.1em] text-(--text-secondary) mb-3">{icon}{children}</h2>;
}
