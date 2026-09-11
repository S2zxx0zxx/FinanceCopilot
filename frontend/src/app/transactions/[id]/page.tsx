"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Link2,
  Paperclip,
  RefreshCw,
  Save,
  Split,
  Trash2,
  Unlink,
  UploadCloud,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type Tx = Record<string, any> & {
  id: string;
  description: string;
  amount: number | string;
  date: string;
  type: string;
  currency: string;
  status: string;
  account_id?: string | null;
  category_id?: string | null;
  payee_id?: string | null;
  notes?: string | null;
  transfer_pair_id?: string | null;
  recurring_transaction_id?: string | null;
  attachment_count?: number;
  installment_number?: number | null;
  total_installments?: number | null;
  installment_total_amount?: number | null;
  installment_purchase_date?: string | null;
  installment_series_id?: string | null;
  is_ignored?: boolean;
  exclude_from_pnl?: boolean;
  splits?: Array<Record<string, any>>;
  invoice_links?: Array<Record<string, any>>;
};
type Attachment = { id: string; filename: string; content_type: string; size_bytes: number; created_at: string };
type Candidate = Tx;
type Named = Record<string, any>;

type GroupMember = { id: string; name: string; is_self?: boolean };

function list(value: any, ...keys: string[]): any[] {
  if (Array.isArray(value)) return value;
  for (const key of keys) if (Array.isArray(value?.[key])) return value[key];
  return [];
}
function nameOf(item: Named, fallback = "Item") { return String(item.name || item.display_name || item.institution_name || item.email || fallback); }
function money(value: unknown, currency: string) {
  const amount = Number(value || 0);
  try { return new Intl.NumberFormat(undefined,{style:"currency",currency,maximumFractionDigits:2}).format(amount); }
  catch { return `${amount.toFixed(2)} ${currency}`; }
}

export default function TransactionDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const [tx, setTx] = React.useState<Tx | null>(null);
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [pair, setPair] = React.useState<Tx | null>(null);
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [accounts, setAccounts] = React.useState<Named[]>([]);
  const [categories, setCategories] = React.useState<Named[]>([]);
  const [payees, setPayees] = React.useState<Named[]>([]);
  const [groups, setGroups] = React.useState<Named[]>([]);
  const [groupId, setGroupId] = React.useState("");
  const [groupMembers, setGroupMembers] = React.useState<GroupMember[]>([]);
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [date, setDate] = React.useState("");
  const [status, setStatus] = React.useState("posted");
  const [categoryId, setCategoryId] = React.useState("");
  const [payeeId, setPayeeId] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [applyTo, setApplyTo] = React.useState("this");
  const [busy, setBusy] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [txResult, attachmentResult, pairResult, candidateResult, accountResult, categoryResult, payeeResult, groupResult] = await Promise.all([
        engineApi.get<Tx>(`/api/transactions/${id}`),
        engineApi.get<Attachment[]>(`/api/transactions/${id}/attachments`),
        engineApi.get<Tx | null>(`/api/transactions/${id}/transfer-pair`),
        engineApi.get<Candidate[]>(`/api/transactions/${id}/transfer-candidates?limit=10&window_days=30`),
        engineApi.get<any>("/api/accounts?include_closed=false"),
        engineApi.get<any>("/api/categories"),
        engineApi.get<any>("/api/payees?limit=500"),
        engineApi.get<any>("/api/groups"),
      ]);
      setTx(txResult); setAttachments(Array.isArray(attachmentResult) ? attachmentResult : []); setPair(pairResult || null); setCandidates(Array.isArray(candidateResult) ? candidateResult : []);
      setAccounts(list(accountResult,"accounts","items")); setCategories(list(categoryResult,"categories","items")); setPayees(list(payeeResult,"payees","items")); setGroups(list(groupResult,"groups","items"));
      setDescription(txResult.description || ""); setAmount(String(txResult.amount ?? "")); setDate(txResult.date || ""); setStatus(txResult.status || "posted"); setCategoryId(txResult.category_id || ""); setPayeeId(txResult.payee_id || ""); setNotes(txResult.notes || "");
    } catch (err) { setError(err instanceof Error ? err.message : "Transaction could not be loaded."); }
    finally { setLoading(false); }
  }, [id]);
  React.useEffect(() => { void load(); }, [load]);

  React.useEffect(() => {
    if (!groupId) { setGroupMembers([]); return; }
    let active = true;
    engineApi.get<GroupMember[]>(`/api/groups/${groupId}/members`).then((rows) => active && setGroupMembers(Array.isArray(rows) ? rows : [])).catch((err) => active && setError(err instanceof Error ? err.message : "Could not load group members."));
    return () => { active = false; };
  }, [groupId]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!tx) return; setBusy(true); setError(null); setMessage(null);
    try {
      await engineApi.patch(`/api/transactions/${id}`, {
        description: description.trim(), amount: Number(amount), date, status,
        category_id: categoryId || null, payee_id: payeeId || null, notes: notes.trim() || null,
        apply_to: tx.installment_series_id ? applyTo : "this",
      });
      setMessage("Transaction updated."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Transaction could not be updated."); }
    finally { setBusy(false); }
  };

  const toggleIgnore = async () => {
    setBusy(true); setError(null);
    try { await engineApi.patch(`/api/transactions/${id}/ignore`); setMessage(tx?.is_ignored ? "Transaction included again." : "Transaction ignored in financial totals."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Ignore setting could not be changed."); }
    finally { setBusy(false); }
  };
  const togglePnl = async () => {
    if (!tx) return; setBusy(true); setError(null);
    try { await engineApi.patch(`/api/transactions/${id}`, { exclude_from_pnl: !tx.exclude_from_pnl, apply_to: "this" }); setMessage(tx.exclude_from_pnl ? "Transaction included in P&L again." : "Transaction excluded from P&L."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "P&L setting could not be changed."); }
    finally { setBusy(false); }
  };
  const unlinkRecurring = async () => {
    setBusy(true); setError(null);
    try { await engineApi.patch(`/api/transactions/${id}/unlink-recurring`); setMessage("Recurring-bill link removed."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Recurring link could not be removed."); }
    finally { setBusy(false); }
  };

  const linkTransfer = async (candidate: Candidate) => {
    if (!tx) return; setBusy(true); setError(null);
    try { await engineApi.post("/api/transactions/link-transfer", { transaction_ids: [tx.id, candidate.id] }); setMessage("Transfer counterpart linked."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Transactions could not be linked as a transfer."); }
    finally { setBusy(false); }
  };
  const createCounterpart = async (accountId: string) => {
    if (!accountId) return; setBusy(true); setError(null);
    try { await engineApi.post(`/api/transactions/${id}/create-counterpart`, { to_account_id: accountId }); setMessage("Counterpart transaction created and linked."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Transfer counterpart could not be created."); }
    finally { setBusy(false); }
  };

  const applyEqualSplit = async () => {
    if (!tx || !groupId || !groupMembers.length) return; setBusy(true); setError(null);
    try {
      await engineApi.patch(`/api/transactions/${id}`, { splits: { share_type: "equal", splits: groupMembers.map((member) => ({ group_member_id: member.id })) }, apply_to: "this" });
      setMessage("Transaction split equally across the selected group."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Group split could not be saved."); }
    finally { setBusy(false); }
  };
  const clearSplits = async () => {
    setBusy(true); setError(null);
    try { await engineApi.patch(`/api/transactions/${id}`, { splits: { share_type: "equal", splits: [] }, apply_to: "this" }); setMessage("Transaction splits cleared."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Splits could not be cleared."); }
    finally { setBusy(false); }
  };

  const uploadAttachment = async (file: File | null) => {
    if (!file) return; setBusy(true); setError(null);
    try { const form = new FormData(); form.append("file", file); await engineApi.form(`/api/transactions/${id}/attachments`, form); setMessage("Attachment uploaded."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Attachment could not be uploaded."); }
    finally { setBusy(false); if (uploadRef.current) uploadRef.current.value = ""; }
  };
  const downloadAttachment = async (attachment: Attachment) => {
    setBusy(true); setError(null);
    try { const blob = await engineApi.blob(`/api/transactions/${id}/attachments/${attachment.id}`); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = attachment.filename; anchor.click(); URL.revokeObjectURL(url); }
    catch (err) { setError(err instanceof Error ? err.message : "Attachment could not be downloaded."); }
    finally { setBusy(false); }
  };
  const deleteAttachment = async (attachment: Attachment) => {
    if (!window.confirm(`Delete ${attachment.filename}?`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/transactions/${id}/attachments/${attachment.id}`); setMessage("Attachment removed."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Attachment could not be removed."); }
    finally { setBusy(false); }
  };
  const deleteTransaction = async () => {
    if (!tx || !window.confirm(`Delete this transaction${tx.installment_series_id && applyTo !== "this" ? ` and scope “${applyTo}” of its installment series` : ""}?`)) return;
    setBusy(true); setError(null);
    try { await engineApi.delete(`/api/transactions/${id}?apply_to=${encodeURIComponent(tx.installment_series_id ? applyTo : "this")}`); window.location.assign("/transactions"); }
    catch (err) { setError(err instanceof Error ? err.message : "Transaction could not be deleted."); setBusy(false); }
  };

  if (loading) return <div className="min-h-[45vh] grid place-items-center"><RefreshCw className="size-7 animate-spin text-accent" /></div>;
  if (!tx || error) return <div className="max-w-4xl"><Link href="/transactions" className="inline-flex items-center gap-2 text-accent"><ArrowLeft className="size-4" />Activity journal</Link><div className="premium-card p-8 mt-5"><p role="alert" className="text-(--negative)">{error || "Transaction not found."}</p><button onClick={() => void load()} className="mt-4 min-h-10 rounded-xl border border-(--border) px-4">Retry</button></div></div>;

  return <div className="max-w-6xl flex flex-col gap-6 pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3"><Link href="/transactions" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Activity journal</p><h1 className="font-display text-3xl font-bold mt-1">{tx.description}</h1><p className="text-sm text-(--text-secondary) mt-2">{tx.date} · {tx.status} · {tx.source || "record"}</p></div></div><p className="font-display text-3xl font-semibold tabular-nums">{money(tx.amount,tx.currency)}</p></header>
    {message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive)">{message}</div>}

    <section className="grid lg:grid-cols-[1fr_.85fr] gap-5">
      <form onSubmit={save} className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">Transaction details</h2><div className="grid sm:grid-cols-2 gap-3 mt-4"><label className="text-xs sm:col-span-2">Description<input required value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Amount<input required type="number" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Status<select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="posted">Posted</option><option value="pending">Pending</option></select></label><label className="text-xs">Category<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">Uncategorised</option>{categories.map((item) => <option key={String(item.id)} value={String(item.id)}>{nameOf(item)}</option>)}</select></label><label className="text-xs sm:col-span-2">Payee<select value={payeeId} onChange={(event) => setPayeeId(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">No linked payee</option>{payees.map((item) => <option key={String(item.id)} value={String(item.id)}>{nameOf(item)}</option>)}</select></label><label className="text-xs sm:col-span-2">Notes<textarea rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} className="mt-1 w-full rounded-xl border border-(--border) bg-(--surface) p-3" /></label>{tx.installment_series_id && <label className="text-xs sm:col-span-2">Apply edits to<select value={applyTo} onChange={(event) => setApplyTo(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="this">This installment only</option><option value="future">This and future installments</option><option value="all">Entire installment series</option></select></label>}</div><button disabled={busy || !description.trim()} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50"><Save className="size-4" />Save changes</button></form>

      <section className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">Financial treatment</h2><div className="space-y-3 mt-4"><button disabled={busy} onClick={() => void toggleIgnore()} className="w-full min-h-11 text-left rounded-xl border border-(--border) px-4 text-sm"><span className="font-medium">{tx.is_ignored ? "Include transaction" : "Ignore transaction"}</span><span className="block text-xs text-(--text-secondary) mt-1">{tx.is_ignored ? "Let it participate in eligible summaries again." : "Keep the record but remove it from normal financial totals."}</span></button><button disabled={busy} onClick={() => void togglePnl()} className="w-full min-h-11 text-left rounded-xl border border-(--border) px-4 text-sm"><span className="font-medium">{tx.exclude_from_pnl ? "Include in income/expense" : "Exclude from income/expense"}</span><span className="block text-xs text-(--text-secondary) mt-1">Useful for investments, reimbursements and bookkeeping movements.</span></button>{tx.recurring_transaction_id && <button disabled={busy} onClick={() => void unlinkRecurring()} className="w-full min-h-11 text-left rounded-xl border border-(--border) px-4 text-sm"><span className="font-medium flex items-center gap-2"><Unlink className="size-4" />Unlink recurring bill</span></button>}</div>{tx.installment_number && <div className="mt-4 rounded-xl bg-(--surface-subtle) p-4"><p className="text-xs text-(--text-tertiary)">Installment series</p><p className="font-semibold mt-1">{tx.installment_number} of {tx.total_installments}</p><p className="text-xs text-(--text-secondary) mt-1">Purchase {tx.installment_purchase_date || "—"} · total {money(tx.installment_total_amount,tx.currency)}</p></div>}{tx.invoice_links?.length ? <div className="mt-4"><p className="text-xs text-(--text-tertiary)">Settles invoice(s)</p>{tx.invoice_links.map((link,index) => <Link key={`${link.invoice_id}-${index}`} href="/finance/invoices" className="block text-sm text-accent mt-1">{link.external_number || link.number || "Invoice"} · {money(link.amount,tx.currency)}</Link>)}</div> : null}</section>
    </section>

    <section className="grid lg:grid-cols-2 gap-5"><div className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Link2 className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Transfer pairing</h2></div>{pair ? <div className="mt-4 rounded-xl bg-(--surface-subtle) p-4"><p className="font-medium text-sm">Linked counterpart</p><Link href={`/transactions/${pair.id}`} className="text-accent text-sm mt-1 inline-block">{pair.description} · {money(pair.amount,pair.currency)}</Link></div> : <><p className="text-sm text-(--text-secondary) mt-2">Link an existing opposite transaction or create a counterpart in another account.</p><div className="mt-4 space-y-2">{candidates.slice(0,5).map((candidate) => <div key={candidate.id} className="rounded-xl border border-(--border) p-3 flex items-center justify-between gap-3"><div><p className="font-medium text-sm">{candidate.description}</p><p className="text-xs text-(--text-secondary)">{candidate.date} · {money(candidate.amount,candidate.currency)}</p></div><button disabled={busy} onClick={() => void linkTransfer(candidate)} className="min-h-9 rounded-lg border border-(--border) px-3 text-xs">Link</button></div>)}</div><label className="block text-xs mt-4">Or create counterpart in<select defaultValue="" onChange={(event) => { const value=event.target.value; if(value) void createCounterpart(value); event.target.value=""; }} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">Choose destination account…</option>{accounts.filter((account) => String(account.id) !== tx.account_id).map((account) => <option key={String(account.id)} value={String(account.id)}>{nameOf(account)}</option>)}</select></label></>}</div>

      <div className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Split className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Shared expense split</h2></div><p className="text-sm text-(--text-secondary) mt-2">Assign this transaction equally across members of a shared-expense group. More advanced percentages can be managed through the group workflow/API.</p><label className="block text-xs mt-4">Group<select value={groupId} onChange={(event) => setGroupId(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">Choose group</option>{groups.map((group) => <option key={String(group.id)} value={String(group.id)}>{nameOf(group)}</option>)}</select></label>{groupMembers.length > 0 && <p className="text-xs text-(--text-secondary) mt-2">Will split between: {groupMembers.map((member) => member.name).join(", ")}</p>}<div className="flex gap-2 mt-4"><button disabled={busy || !groupId || groupMembers.length === 0} onClick={() => void applyEqualSplit()} className="min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Split equally</button>{(tx.splits?.length || 0) > 0 && <button disabled={busy} onClick={() => void clearSplits()} className="min-h-10 rounded-xl border border-(--border) px-4 text-sm">Clear splits</button>}</div>{tx.splits?.length ? <div className="mt-4 text-xs text-(--text-secondary)">{tx.splits.length} saved split(s) · {tx.splits[0]?.share_type || "shared"}</div> : null}</div></section>

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Paperclip className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Attachments</h2></div><><input ref={uploadRef} type="file" className="hidden" onChange={(event) => void uploadAttachment(event.target.files?.[0] || null)} /><button disabled={busy} onClick={() => uploadRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm"><UploadCloud className="size-4" />Attach file</button></></div><div className="mt-4 divide-y divide-(--border)">{attachments.map((attachment) => <div key={attachment.id} className="py-3 flex items-center justify-between gap-3"><div className="min-w-0"><p className="font-medium text-sm truncate">{attachment.filename}</p><p className="text-xs text-(--text-secondary)">{attachment.content_type} · {Math.max(1,Math.round(attachment.size_bytes/1024))} KB</p></div><div className="flex gap-2"><button disabled={busy} onClick={() => void downloadAttachment(attachment)} className="grid size-9 place-items-center rounded-lg border border-(--border)" aria-label="Download"><Download className="size-4" /></button><button disabled={busy} onClick={() => void deleteAttachment(attachment)} className="grid size-9 place-items-center rounded-lg border border-(--border) text-(--negative)" aria-label="Delete"><Trash2 className="size-4" /></button></div></div>)}{!attachments.length && <p className="py-6 text-center text-sm text-(--text-tertiary)">No attachments on this transaction.</p>}</div></section>

    <section className="premium-card p-5 sm:p-6 border-(--negative)/40"><h2 className="font-display text-lg font-semibold">Delete transaction</h2><p className="text-sm text-(--text-secondary) mt-2">Imported source records remain separate from this edit history. Installment transactions can be deleted for this row, future rows or the entire series.</p>{tx.installment_series_id && <select value={applyTo} onChange={(event) => setApplyTo(event.target.value)} className="mt-3 min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="this">This installment only</option><option value="future">This and future installments</option><option value="all">Entire series</option></select>}<button disabled={busy} onClick={() => void deleteTransaction()} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--negative) px-4 text-sm text-(--negative)"><Trash2 className="size-4" />Delete</button></section>
  </div>;
}
