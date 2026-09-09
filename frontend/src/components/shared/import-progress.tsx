"use client";
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/api';
import { useResource } from '@/hooks/use-resource';
import { amount, label, object, rows } from '@/lib/response';
import { ResourceState } from './resource-state';

const load = async () => rows(object(await api.getImportJobs()).jobs);
export function ImportProgress({ revision }: { revision: number }) {
  const state = useResource(load);
  const { userId } = useAuth();
  const owner = useRef(userId);
  owner.current = userId;
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { state.reload(); }, [revision, state.reload]);
  useEffect(() => { setBusy(null); setError(null); }, [userId]);
  const retry = async (id: string) => {
    if (busy || !userId) return;
    const requestOwner = userId;
    setBusy(id); setError(null);
    try { await api.retryImportJob(id); if (owner.current === requestOwner) state.reload(); }
    catch (error) { if (owner.current === requestOwner) setError(error instanceof Error ? error.message : 'Could not retry import.'); }
    finally { if (owner.current === requestOwner) setBusy(null); }
  };
  return <section className="premium-card p-5" aria-labelledby="import-progress-heading">
    <div className="flex items-center justify-between gap-3"><div><h2 id="import-progress-heading" className="font-semibold">Statement processing</h2><p className="text-xs text-(--text-secondary) mt-1">Latest 30 imports. Extraction and ledger normalization are separate steps.</p></div><button onClick={state.reload} disabled={state.loading} className="min-h-11 px-3 text-accent text-sm disabled:opacity-50">Refresh status</button></div>
    {error && <p role="alert" className="text-sm text-(--negative) mt-3">{error}</p>}
    <ResourceState loading={state.loading} error={state.error} retry={state.reload} />
    {state.data?.length === 0 && <p className="text-sm text-(--text-secondary) mt-4">Upload a statement to follow its progress here.</p>}
    <div className="divide-y divide-(--border)">{state.data?.map(job => {
      const id = label(job.job_id); const status = label(job.status);
      const extracted = amount(job.extracted_records); const normalized = amount(job.normalized_records); const rejected = amount(job.rejected_records);
      const pending = extracted !== null && normalized !== null && rejected !== null ? Math.max(0, extracted - normalized - rejected) : null;
      return <article key={id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-medium break-words">{label(job.original_filename, 'Statement import')}</h3><p className="text-xs text-(--text-secondary) mt-2">{status === 'completed' && pending ? 'Extraction complete; normalization pending' : status.replaceAll('_', ' ')}</p><p className="text-xs text-(--text-tertiary) mt-2">Extracted {extracted ?? 'unknown'} / Normalized {normalized ?? 'unknown'} / Rejected {rejected ?? 'unknown'}</p><p className="text-xs text-(--text-tertiary) mt-1">Normalized records may still need review before financial summaries include them.</p></div>{['failed','dead_letter'].includes(status) && <button onClick={() => retry(id)} disabled={busy !== null} className="min-h-11 px-4 rounded-xl border border-(--border) text-sm text-accent disabled:opacity-50">{busy === id ? 'Retrying...' : 'Retry processing'}</button>}</article>;
    })}</div>
  </section>;
}
