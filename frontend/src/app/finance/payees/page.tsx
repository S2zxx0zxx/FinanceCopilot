"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Heart, Merge, Search, Trash2, UserRound } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type TaxId = { kind: string; value: string };
type Payee = { id: string; name: string; type?: "person" | "company" | null; source: string; is_favorite: boolean; notes?: string | null; email?: string | null; phone?: string | null; address?: string | null; website?: string | null; tax_ids: TaxId[]; created_at: string; transaction_count: number };
type Summary = { payee: Payee; total_spent: string | number; total_received: string | number; transaction_count: number; most_common_category?: { name?: string } | null; last_transaction_date?: string | null };

const TAX_KINDS = ["gstin","pan","vat","ein","cnpj","cpf","pt_nif","es_nif","partita_iva","siret","other"];

export default function PayeesPage() {
  const [payees, setPayees] = React.useState<Payee[]>([]);
  const [selectedId, setSelectedId] = React.useState("");
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [query, setQuery] = React.useState("");
  const [type, setType] = React.useState("");
  const [favoritesOnly, setFavoritesOnly] = React.useState(false);
  const [name, setName] = React.useState("");
  const [legalType, setLegalType] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [taxIds, setTaxIds] = React.useState<TaxId[]>([]);
  const [newTaxKind, setNewTaxKind] = React.useState("gstin");
  const [newTaxValue, setNewTaxValue] = React.useState("");
  const [mergeSource, setMergeSource] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setError(null);
    const params = new URLSearchParams(); if (query.trim()) params.set("q", query.trim()); if (type) params.set("type", type); if (favoritesOnly) params.set("is_favorite", "true");
    try {
      const rows = await engineApi.get<Payee[]>(`/api/payees${params.size ? `?${params}` : ""}`);
      const next = Array.isArray(rows) ? rows : []; setPayees(next);
      setSelectedId((current) => current && next.some((item) => item.id === current) ? current : next[0]?.id || "");
    } catch (err) { setError(err instanceof Error ? err.message : "Payees could not be loaded."); }
  }, [query, type, favoritesOnly]);
  React.useEffect(() => { const timeout = window.setTimeout(() => void load(), 180); return () => window.clearTimeout(timeout); }, [load]);

  React.useEffect(() => {
    if (!selectedId) { setSummary(null); return; }
    let active = true;
    Promise.all([engineApi.get<Payee>(`/api/payees/${selectedId}`), engineApi.get<Summary>(`/api/payees/${selectedId}/summary`)]).then(([payee, payeeSummary]) => {
      if (!active) return; setSummary(payeeSummary); setName(payee.name); setLegalType(payee.type || ""); setEmail(payee.email || ""); setPhone(payee.phone || ""); setWebsite(payee.website || ""); setAddress(payee.address || ""); setNotes(payee.notes || ""); setTaxIds(payee.tax_ids || []);
    }).catch((err) => active && setError(err instanceof Error ? err.message : "Payee details could not be loaded."));
    return () => { active = false; };
  }, [selectedId]);

  const selected = payees.find((payee) => payee.id === selectedId);
  const create = async () => {
    const value = window.prompt("Name for the new payee"); if (!value?.trim()) return;
    setBusy(true); setError(null);
    try { const created = await engineApi.post<Payee>("/api/payees", { name: value.trim(), type: null, tax_ids: [] }); setMessage("Payee created."); await load(); setSelectedId(created.id); }
    catch (err) { setError(err instanceof Error ? err.message : "Payee could not be created."); }
    finally { setBusy(false); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selected) return; setBusy(true); setError(null);
    try { await engineApi.patch(`/api/payees/${selected.id}`, { name: name.trim(), type: legalType || null, email: email.trim() || null, phone: phone.trim() || null, website: website.trim() || null, address: address.trim() || null, notes: notes.trim() || null, tax_ids: taxIds.filter((item) => item.value.trim()) }); setMessage("Payee details saved."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Payee could not be updated."); }
    finally { setBusy(false); }
  };
  const toggleFavorite = async (payee: Payee) => {
    const optimistic = !payee.is_favorite; setPayees((current) => current.map((item) => item.id === payee.id ? { ...item, is_favorite: optimistic } : item));
    try { await engineApi.patch(`/api/payees/${payee.id}`, { is_favorite: optimistic }); }
    catch (err) { setPayees((current) => current.map((item) => item.id === payee.id ? { ...item, is_favorite: !optimistic } : item)); setError(err instanceof Error ? err.message : "Favorite could not be changed."); }
  };
  const remove = async () => {
    if (!selected || !window.confirm(`Delete “${selected.name}”? Payees referenced by invoices must be merged instead.`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/payees/${selected.id}`); setMessage("Payee deleted."); setSelectedId(""); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Payee could not be deleted. If it has invoices, merge it into another payee instead."); }
    finally { setBusy(false); }
  };
  const merge = async () => {
    if (!selected || !mergeSource || mergeSource === selected.id || !window.confirm(`Merge the selected duplicate into “${selected.name}”? Its transactions and invoice references will be reassigned.`)) return; setBusy(true); setError(null);
    try { const result = await engineApi.post<any>("/api/payees/merge", { target_id: selected.id, source_ids: [mergeSource] }); setMessage(`Merged 1 payee and reassigned ${Number(result.transactions_reassigned || 0)} transaction(s).`); setMergeSource(""); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Payees could not be merged."); }
    finally { setBusy(false); }
  };
  const addTaxId = () => {
    if (!newTaxValue.trim()) return; setTaxIds((current) => [...current.filter((item) => item.kind !== newTaxKind), { kind: newTaxKind, value: newTaxValue.trim() }]); setNewTaxValue("");
  };

  return <div className="max-w-7xl flex flex-col gap-6 pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Counterparties</p><h1 className="font-display text-3xl font-bold mt-1">Payees</h1><p className="text-sm text-(--text-secondary) mt-2">Keep synced merchants, people, companies, contact information and tax documents organised for transactions and invoices.</p></div></div><button disabled={busy} onClick={() => void create()} className="min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground">New payee</button></header>
    {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}{message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive)">{message}</div>}
    <section className="grid xl:grid-cols-[360px_1fr] gap-5">
      <aside className="premium-card p-4 h-[75vh] flex flex-col"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-(--text-tertiary)" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search payees" className="w-full min-h-11 pl-9 pr-3 rounded-xl border border-(--border) bg-(--surface)" /></div><div className="grid grid-cols-2 gap-2 mt-2"><select value={type} onChange={(event) => setType(event.target.value)} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">All types</option><option value="person">People</option><option value="company">Companies</option></select><label className="flex items-center gap-2 text-xs px-2"><input type="checkbox" checked={favoritesOnly} onChange={(event) => setFavoritesOnly(event.target.checked)} className="size-4 accent-(--accent)" />Favorites only</label></div><div className="mt-3 space-y-1 overflow-y-auto pr-1">{payees.map((payee) => <div key={payee.id} className={`rounded-xl border ${selectedId === payee.id ? "border-accent bg-(--surface-subtle)" : "border-transparent"}`}><button onClick={() => setSelectedId(payee.id)} className="w-full text-left p-3 flex gap-3"><div className="size-9 rounded-lg bg-(--surface-subtle) grid place-items-center shrink-0">{payee.type === "company" ? <Building2 className="size-4" /> : <UserRound className="size-4" />}</div><div className="min-w-0 flex-1"><p className="font-medium text-sm truncate">{payee.name}</p><p className="text-xs text-(--text-secondary) mt-1">{payee.source} · {payee.transaction_count} transaction(s)</p></div><span onClick={(event) => { event.stopPropagation(); void toggleFavorite(payee); }} className="p-1 cursor-pointer" role="button" aria-label="Toggle favorite"><Heart className={`size-4 ${payee.is_favorite ? "fill-current text-(--warning)" : "text-(--text-tertiary)"}`} /></span></button></div>)}{!payees.length && <p className="py-8 text-center text-sm text-(--text-tertiary)">No payees match these filters.</p>}</div></aside>

      <main>{selected && summary ? <form onSubmit={save} className="space-y-5"><section className="premium-card p-5 sm:p-6"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">{selected.source} payee</p><h2 className="font-display text-2xl font-semibold mt-1">{selected.name}</h2></div><button type="button" disabled={busy} onClick={() => void remove()} className="grid size-10 place-items-center rounded-xl border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button></div><div className="grid sm:grid-cols-3 gap-3 mt-5"><div className="rounded-xl bg-(--surface-subtle) p-3"><p className="text-xs text-(--text-tertiary)">Spent</p><p className="font-semibold text-lg mt-1">{Number(summary.total_spent).toLocaleString(undefined,{maximumFractionDigits:2})}</p></div><div className="rounded-xl bg-(--surface-subtle) p-3"><p className="text-xs text-(--text-tertiary)">Received</p><p className="font-semibold text-lg mt-1">{Number(summary.total_received).toLocaleString(undefined,{maximumFractionDigits:2})}</p></div><div className="rounded-xl bg-(--surface-subtle) p-3"><p className="text-xs text-(--text-tertiary)">Transactions</p><p className="font-semibold text-lg mt-1">{summary.transaction_count}</p><p className="text-[11px] text-(--text-secondary) mt-1">{summary.most_common_category?.name || "No common category"}</p></div></div></section>
      <section className="premium-card p-5 sm:p-6"><h3 className="font-display text-xl font-semibold">Details</h3><div className="grid sm:grid-cols-2 gap-3 mt-4"><label className="text-xs sm:col-span-2">Name<input required value={name} onChange={(event) => setName(event.target.value)} maxLength={255} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Legal nature<select value={legalType} onChange={(event) => setLegalType(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">Unknown</option><option value="person">Person</option><option value="company">Company</option></select></label><label className="text-xs">Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Phone<input value={phone} onChange={(event) => setPhone(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Website<input value={website} onChange={(event) => setWebsite(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs sm:col-span-2">Address<textarea rows={2} value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 w-full rounded-xl border border-(--border) bg-(--surface) p-3" /></label><label className="text-xs sm:col-span-2">Notes<textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={1000} className="mt-1 w-full rounded-xl border border-(--border) bg-(--surface) p-3" /></label></div>
      <div className="mt-5 pt-5 border-t border-(--border)"><h4 className="font-semibold text-sm">Tax & fiscal IDs</h4><div className="mt-2 flex flex-wrap gap-2">{taxIds.map((taxId) => <span key={taxId.kind} className="inline-flex items-center gap-2 rounded-full bg-(--surface-subtle) px-3 py-1.5 text-xs"><b className="uppercase">{taxId.kind.replaceAll("_"," ")}</b>{taxId.value}<button type="button" onClick={() => setTaxIds((current) => current.filter((item) => item !== taxId))} aria-label={`Remove ${taxId.kind}`}><XIcon /></button></span>)}</div><div className="grid sm:grid-cols-[160px_1fr_auto] gap-2 mt-3"><select value={newTaxKind} onChange={(event) => setNewTaxKind(event.target.value)} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2">{TAX_KINDS.map((kind) => <option key={kind} value={kind}>{kind.replaceAll("_"," ").toUpperCase()}</option>)}</select><input value={newTaxValue} onChange={(event) => setNewTaxValue(event.target.value)} placeholder="Document value" className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /><button type="button" onClick={addTaxId} disabled={!newTaxValue.trim()} className="min-h-10 rounded-lg border border-(--border) px-3 text-sm disabled:opacity-50">Add</button></div></div>
      <button disabled={busy || !name.trim()} className="mt-5 min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Save payee</button></section>
      <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Merge className="size-5 text-accent" /><h3 className="font-display text-xl font-semibold">Merge duplicate</h3></div><p className="text-sm text-(--text-secondary) mt-2">Choose a duplicate to merge into {selected.name}. Transaction and invoice references are reassigned before the duplicate is removed.</p><div className="flex gap-2 mt-4"><select value={mergeSource} onChange={(event) => setMergeSource(event.target.value)} className="flex-1 min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">Choose duplicate…</option>{payees.filter((payee) => payee.id !== selected.id).map((payee) => <option key={payee.id} value={payee.id}>{payee.name}</option>)}</select><button type="button" disabled={busy || !mergeSource} onClick={() => void merge()} className="min-h-10 rounded-xl border border-(--border) px-4 text-sm disabled:opacity-50">Merge</button></div></section></form> : <div className="premium-card p-10 text-center text-(--text-secondary)">Select a payee to see details.</div>}</main>
    </section>
  </div>;
}

function XIcon() { return <span aria-hidden="true" className="text-(--text-tertiary)">×</span>; }
