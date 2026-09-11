"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckSquare,
  Download,
  Filter,
  Paperclip,
  Plus,
  RefreshCw,
  Search,
  Tags,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type Category = { id: string; name: string; color?: string | null; icon?: string | null };
type Account = { id: string; name: string; display_name?: string | null; type: string; currency: string; institution_name?: string | null };
type Payee = { id: string; name: string };
type Transaction = {
  id: string; account_id?: string | null; description: string; amount: number | string; amount_primary?: number | null;
  date: string; type: string; currency: string; category_id?: string | null; category?: Category | null; payee?: string | null;
  payee_id?: string | null; payee_name?: string | null; notes?: string | null; status: string; source: string;
  transfer_pair_id?: string | null; attachment_count: number; splits: unknown[]; installment_number?: number | null;
  total_installments?: number | null; recurring_transaction_id?: string | null; is_shared: boolean; viewer_share?: number | string | null;
  group_id?: string | null; parent_owner_name?: string | null; is_ignored: boolean; exclude_from_pnl: boolean; fx_fallback: boolean;
  invoice_links?: { invoice_id: string; amount: number | string; number?: number | null; external_number?: string | null }[];
};
type Summary = { income: number; expense: number; net: number; excluded: number; currency: string };
type Page = { items: Transaction[]; total: number; page: number; limit: number; summary?: Summary | null };
type Draft = { account_id: string; description: string; amount: string; date: string; type: string; category_id: string; payee_id: string; notes: string; status: string };

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") { const row = value as Record<string, unknown>; for (const key of ["items", "data", "accounts", "categories", "payees"]) if (Array.isArray(row[key])) return row[key] as T[]; }
  return [];
}
const emptyDraft = (): Draft => ({ account_id: "", description: "", amount: "", date: new Date().toISOString().slice(0, 10), type: "debit", category_id: "", payee_id: "", notes: "", status: "posted" });
function money(value: number | string | null | undefined, currency: string) {
  const amount = Number(value ?? 0) || 0;
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount); }
  catch { return `${currency} ${amount.toLocaleString("en-IN")}`; }
}
function accountName(account?: Account) { return account?.display_name || account?.name || account?.institution_name || "Account"; }

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [uncategorized, setUncategorized] = useState(false);
  const [excludeIgnored, setExcludeIgnored] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState("");
  const [bulkTags, setBulkTags] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const accounts = useResource(useCallback(async () => asArray<Account>(await engineApi.get("/accounts")), []));
  const categories = useResource(useCallback(async () => asArray<Category>(await engineApi.get("/categories")), []));
  const payees = useResource(useCallback(async () => asArray<Payee>(await engineApi.get("/payees")), []));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const requested = new URLSearchParams(window.location.search).get("account");
    if (requested) setAccountId(requested);
  }, []);

  const loader = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: "50", sort_by: sortBy, sort_dir: sortDir });
    if (q.trim()) params.set("q", q.trim());
    if (accountId) params.set("account_id", accountId);
    if (categoryId) params.set("category_id", categoryId);
    if (type) params.set("type", type);
    if (status) params.set("status", status);
    if (fromDate) params.set("from", fromDate);
    if (toDate) params.set("to", toDate);
    if (uncategorized) params.set("uncategorized", "true");
    if (excludeIgnored) params.set("exclude_ignored", "true");
    return engineApi.get<Page>(`/transactions?${params.toString()}`);
  }, [accountId, categoryId, excludeIgnored, fromDate, page, q, sortBy, sortDir, status, toDate, type, uncategorized]);
  const state = useResource(loader);

  useEffect(() => { setSelected([]); }, [state.data?.page, accountId, categoryId, q, type, status, fromDate, toDate, uncategorized, excludeIgnored]);

  const accountMap = useMemo(() => new Map((accounts.data ?? []).map((item) => [item.id, item])), [accounts.data]);
  const rows = state.data?.items ?? [];
  const totalPages = Math.max(1, Math.ceil((state.data?.total ?? 0) / (state.data?.limit ?? 50)));
  const allSelected = rows.length > 0 && rows.every((row) => selected.includes(row.id));

  const resetFilters = () => { setQ(""); setAccountId(""); setCategoryId(""); setType(""); setStatus(""); setFromDate(""); setToDate(""); setUncategorized(false); setExcludeIgnored(false); setPage(1); };
  const toggleAll = () => setSelected(allSelected ? selected.filter((id) => !rows.some((row) => row.id === id)) : Array.from(new Set([...selected, ...rows.map((row) => row.id)])));
  const toggleOne = (id: string) => setSelected((current) => current.includes(id) ? current.filter((value) => value !== id) : [...current, id]);

  const openCreate = () => {
    const first = accounts.data?.[0];
    setDraft({ ...emptyDraft(), account_id: accountId || first?.id || "" });
    setMutationError(null); setEditorOpen(true);
  };

  const create = async (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(draft.amount);
    if (!draft.account_id || !draft.description.trim() || !Number.isFinite(amount) || amount <= 0) { setMutationError("Choose an account and enter a description plus positive amount."); return; }
    const account = accountMap.get(draft.account_id);
    setBusy("create"); setMutationError(null); setNotice(null);
    try {
      await engineApi.post("/transactions", { account_id: draft.account_id, description: draft.description.trim(), amount, date: draft.date, type: draft.type, currency: account?.currency || "INR", category_id: draft.category_id || null, payee_id: draft.payee_id || null, notes: draft.notes.trim() || null, status: draft.status });
      setEditorOpen(false); setNotice("Transaction created."); state.reload();
    } catch (caught) { setMutationError(caught instanceof Error ? caught.message : "Transaction could not be created."); }
    finally { setBusy(null); }
  };

  const bulkCategorize = async () => {
    if (!selected.length) return;
    setBusy("categorize"); setMutationError(null);
    try { await engineApi.patch("/transactions/bulk-categorize", { transaction_ids: selected, category_id: bulkCategory || null }); setNotice(`${selected.length} transaction(s) updated.`); setSelected([]); state.reload(); }
    catch (caught) { setMutationError(caught instanceof Error ? caught.message : "Bulk category update failed."); }
    finally { setBusy(null); }
  };
  const addTags = async () => {
    const tags = bulkTags.split(",").map((item) => item.trim()).filter(Boolean);
    if (!selected.length || !tags.length) return;
    setBusy("tags"); setMutationError(null);
    try { await engineApi.patch("/transactions/bulk-add-tags", { transaction_ids: selected, tags }); setNotice(`Tags added to ${selected.length} transaction(s).`); setBulkTags(""); setSelected([]); state.reload(); }
    catch (caught) { setMutationError(caught instanceof Error ? caught.message : "Tags could not be added."); }
    finally { setBusy(null); }
  };
  const bulkDelete = async () => {
    if (!selected.length || !window.confirm(`Delete ${selected.length} selected transaction(s)?`)) return;
    setBusy("delete"); setMutationError(null);
    try { await engineApi.post("/transactions/bulk-delete", { transaction_ids: selected }); setNotice(`${selected.length} transaction(s) deleted.`); setSelected([]); state.reload(); }
    catch (caught) { setMutationError(caught instanceof Error ? caught.message : "Transactions could not be deleted."); }
    finally { setBusy(null); }
  };
  const exportCsv = async () => {
    setBusy("export"); setMutationError(null);
    try {
      const params = new URLSearchParams();
      if (selected.length) selected.forEach((id) => params.append("transaction_ids", id));
      else { if (accountId) params.set("account_id", accountId); if (categoryId) params.set("category_id", categoryId); if (q.trim()) params.set("q", q.trim()); if (fromDate) params.set("from", fromDate); if (toDate) params.set("to", toDate); if (type) params.set("type", type); if (status) params.set("status", status); if (uncategorized) params.set("uncategorized", "true"); if (excludeIgnored) params.set("exclude_ignored", "true"); }
      const blob = await engineApi.blob(`/transactions/export?${params.toString()}`);
      const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click(); URL.revokeObjectURL(url);
    } catch (caught) { setMutationError(caught instanceof Error ? caught.message : "Export failed."); }
    finally { setBusy(null); }
  };

  const summary = state.data?.summary;
  return <div className="flex flex-col gap-6 max-w-7xl pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-accent">Native money ledger</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Activity journal</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Search, filter, classify and bulk-manage the same transaction ledger used by reports, rules, reconciliation, recurring detection, invoices and shared expenses.</p></div><div className="flex flex-wrap gap-2"><Link href="/finance/imports" className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><UploadCloud className="size-4" />Import files</Link><button onClick={() => void exportCsv()} disabled={busy === "export"} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><Download className="size-4" />Export</button><button onClick={openCreate} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2"><Plus className="size-4" />New transaction</button></div></header>

    {notice && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-500">{notice}</p>}
    {mutationError && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">{mutationError}</p>}

    {editorOpen && <form onSubmit={create} className="premium-card p-5 sm:p-6"><div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-accent">Manual entry</p><h2 className="font-display text-xl font-semibold mt-1">Create transaction</h2></div><button type="button" onClick={() => setEditorOpen(false)} className="grid size-10 place-items-center rounded-xl border border-(--border)"><X className="size-4" /></button></div><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mt-5"><label className="text-sm xl:col-span-2">Description<input required value={draft.description} onChange={(e)=>setDraft((d)=>({...d,description:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Account<select required value={draft.account_id} onChange={(e)=>setDraft((d)=>({...d,account_id:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="">Choose account</option>{(accounts.data??[]).map((item)=><option key={item.id} value={item.id}>{accountName(item)} · {item.currency}</option>)}</select></label><label className="text-sm">Date<input required type="date" value={draft.date} onChange={(e)=>setDraft((d)=>({...d,date:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Amount<input required type="number" min="0.01" step="0.01" value={draft.amount} onChange={(e)=>setDraft((d)=>({...d,amount:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Direction<select value={draft.type} onChange={(e)=>setDraft((d)=>({...d,type:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="debit">Money out</option><option value="credit">Money in</option></select></label><label className="text-sm">Category<select value={draft.category_id} onChange={(e)=>setDraft((d)=>({...d,category_id:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="">Uncategorized</option>{(categories.data??[]).map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-sm">Payee<select value={draft.payee_id} onChange={(e)=>setDraft((d)=>({...d,payee_id:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="">No payee</option>{(payees.data??[]).map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-sm">Status<select value={draft.status} onChange={(e)=>setDraft((d)=>({...d,status:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="posted">Posted</option><option value="pending">Pending</option></select></label><label className="text-sm xl:col-span-3">Notes<input value={draft.notes} onChange={(e)=>setDraft((d)=>({...d,notes:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label></div><button disabled={busy === "create"} className="mt-5 min-h-11 px-5 rounded-xl bg-accent text-white disabled:opacity-50">{busy === "create" ? "Creating…" : "Create transaction"}</button></form>}

    {summary && <section className="grid grid-cols-2 xl:grid-cols-4 gap-3"><div className="premium-card p-5"><ArrowDownLeft className="size-5 text-emerald-500"/><p className="font-display text-2xl font-semibold mt-3">{money(summary.income, summary.currency)}</p><p className="text-xs text-(--text-secondary) mt-1">Income in result set</p></div><div className="premium-card p-5"><ArrowUpRight className="size-5 text-rose-500"/><p className="font-display text-2xl font-semibold mt-3">{money(summary.expense, summary.currency)}</p><p className="text-xs text-(--text-secondary) mt-1">Expenses</p></div><div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Net</p><p className={`font-display text-2xl font-semibold mt-3 ${summary.net >= 0 ? "text-emerald-500" : "text-rose-500"}`}>{money(summary.net, summary.currency)}</p></div><div className="premium-card p-5"><p className="text-xs text-(--text-secondary)">Excluded from P&L</p><p className="font-display text-2xl font-semibold mt-3">{money(summary.excluded, summary.currency)}</p></div></section>}

    <section className="premium-card p-4 space-y-3"><div className="flex flex-col sm:flex-row gap-3"><label className="relative flex-1"><Search className="absolute left-3 top-3.5 size-4 text-(--text-tertiary)"/><input value={q} onChange={(e)=>{setQ(e.target.value);setPage(1);}} placeholder="Search descriptions, payees and transaction text…" className="w-full min-h-11 pl-10 pr-3 rounded-xl border border-(--border) bg-(--surface)" /></label><button onClick={()=>setFiltersOpen((value)=>!value)} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><Filter className="size-4" />Filters</button><button onClick={state.reload} className="grid size-11 place-items-center rounded-xl border border-(--border)" aria-label="Refresh"><RefreshCw className="size-4" /></button></div>{filtersOpen && <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-(--border)"><label className="text-xs">Account<select value={accountId} onChange={(e)=>{setAccountId(e.target.value);setPage(1);}} className="block w-full min-h-10 mt-1 px-2 rounded-lg border border-(--border) bg-(--surface)"><option value="">All accounts</option>{(accounts.data??[]).map((item)=><option key={item.id} value={item.id}>{accountName(item)}</option>)}</select></label><label className="text-xs">Category<select disabled={uncategorized} value={categoryId} onChange={(e)=>{setCategoryId(e.target.value);setPage(1);}} className="block w-full min-h-10 mt-1 px-2 rounded-lg border border-(--border) bg-(--surface) disabled:opacity-40"><option value="">All categories</option>{(categories.data??[]).map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label className="text-xs">Direction<select value={type} onChange={(e)=>{setType(e.target.value);setPage(1);}} className="block w-full min-h-10 mt-1 px-2 rounded-lg border border-(--border) bg-(--surface)"><option value="">In & out</option><option value="debit">Money out</option><option value="credit">Money in</option></select></label><label className="text-xs">Status<select value={status} onChange={(e)=>{setStatus(e.target.value);setPage(1);}} className="block w-full min-h-10 mt-1 px-2 rounded-lg border border-(--border) bg-(--surface)"><option value="">Any status</option><option value="posted">Posted</option><option value="pending">Pending</option></select></label><label className="text-xs">From<input type="date" value={fromDate} onChange={(e)=>{setFromDate(e.target.value);setPage(1);}} className="block w-full min-h-10 mt-1 px-2 rounded-lg border border-(--border) bg-(--surface)" /></label><label className="text-xs">To<input type="date" value={toDate} onChange={(e)=>{setToDate(e.target.value);setPage(1);}} className="block w-full min-h-10 mt-1 px-2 rounded-lg border border-(--border) bg-(--surface)" /></label><label className="text-xs">Sort<select value={`${sortBy}:${sortDir}`} onChange={(e)=>{const [by,dir]=e.target.value.split(":");setSortBy(by);setSortDir(dir);setPage(1);}} className="block w-full min-h-10 mt-1 px-2 rounded-lg border border-(--border) bg-(--surface)"><option value="date:desc">Newest</option><option value="date:asc">Oldest</option><option value="amount:desc">Amount high → low</option><option value="amount:asc">Amount low → high</option><option value="description:asc">Description A → Z</option></select></label><div className="flex flex-col gap-2 justify-end"><label className="text-xs flex items-center gap-2"><input type="checkbox" checked={uncategorized} onChange={(e)=>{setUncategorized(e.target.checked);if(e.target.checked)setCategoryId("");setPage(1);}} />Uncategorized only</label><label className="text-xs flex items-center gap-2"><input type="checkbox" checked={excludeIgnored} onChange={(e)=>{setExcludeIgnored(e.target.checked);setPage(1);}} />Hide ignored</label></div><button onClick={resetFilters} className="text-xs text-accent text-left hover:underline">Clear all filters</button></div>}</section>

    {selected.length > 0 && <section className="premium-card p-4 border-accent/30"><div className="flex flex-wrap items-center gap-3"><span className="text-sm font-medium flex items-center gap-2"><CheckSquare className="size-4 text-accent" />{selected.length} selected</span><select value={bulkCategory} onChange={(e)=>setBulkCategory(e.target.value)} className="min-h-10 px-3 rounded-lg border border-(--border) bg-(--surface)"><option value="">Set uncategorized</option>{(categories.data??[]).map((item)=><option key={item.id} value={item.id}>{item.name}</option>)}</select><button disabled={busy === "categorize"} onClick={()=>void bulkCategorize()} className="min-h-10 px-3 rounded-lg border border-(--border) text-sm">Apply category</button><div className="flex min-w-56 flex-1 max-w-md"><input value={bulkTags} onChange={(e)=>setBulkTags(e.target.value)} placeholder="tags, comma separated" className="min-w-0 flex-1 min-h-10 px-3 rounded-l-lg border border-(--border) bg-(--surface)"/><button disabled={!bulkTags.trim() || busy === "tags"} onClick={()=>void addTags()} className="min-h-10 px-3 rounded-r-lg border-y border-r border-(--border) text-sm flex items-center gap-1"><Tags className="size-3.5"/>Add</button></div><button disabled={busy === "delete"} onClick={()=>void bulkDelete()} className="min-h-10 px-3 rounded-lg border border-red-500/20 text-red-500 text-sm flex items-center gap-2 ml-auto"><Trash2 className="size-4"/>Delete</button></div></section>}

    <ResourceState loading={state.loading || accounts.loading || categories.loading} error={state.error || accounts.error || categories.error} retry={() => { state.reload(); accounts.reload(); categories.reload(); }} />

    {state.data && <section className="premium-card overflow-hidden"><div className="p-4 border-b border-(--border) flex items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={allSelected} onChange={toggleAll} />Select this page</label><p className="text-xs text-(--text-secondary)">{state.data.total.toLocaleString()} matching transactions</p></div><div className="divide-y divide-(--border)">{rows.length === 0 && <div className="p-10 text-center"><Search className="size-7 text-accent mx-auto"/><p className="font-medium mt-3">No transactions match these filters.</p></div>}{rows.map((tx)=>{const account=tx.account_id?accountMap.get(tx.account_id):undefined;const sharedAmount=tx.is_shared&&tx.viewer_share!=null?tx.viewer_share:tx.amount;const isCredit=tx.type==="credit";return <div key={tx.id} className="flex items-center gap-3 p-4 hover:bg-(--surface-subtle)"><input type="checkbox" checked={selected.includes(tx.id)} onChange={()=>toggleOne(tx.id)} aria-label={`Select ${tx.description}`} /><Link href={`/transactions/${tx.id}`} className="flex-1 min-w-0 flex items-center gap-3"><span className={`grid size-10 place-items-center rounded-xl shrink-0 ${isCredit?"bg-emerald-500/10 text-emerald-500":"bg-(--surface-subtle) text-(--text-secondary)"}`}>{isCredit?<ArrowDownLeft className="size-4"/>:<ArrowUpRight className="size-4"/>}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2 min-w-0"><p className="text-sm font-medium truncate">{tx.payee_name || tx.payee || tx.description}</p>{tx.status === "pending" && <span className="text-[9px] uppercase border border-amber-500/20 text-amber-500 rounded px-1.5 py-0.5">pending</span>}{tx.transfer_pair_id && <span className="text-[9px] uppercase border border-accent/20 text-accent rounded px-1.5 py-0.5">transfer</span>}{tx.is_shared && <span className="text-[9px] uppercase border border-accent/20 text-accent rounded px-1.5 py-0.5">shared</span>}{tx.is_ignored && <span className="text-[9px] uppercase border border-(--border) text-(--text-tertiary) rounded px-1.5 py-0.5">ignored</span>}</div><p className="text-xs text-(--text-tertiary) mt-1 truncate">{tx.date} · {accountName(account)} · {tx.category?.name || "Uncategorized"}{tx.parent_owner_name?` · paid by ${tx.parent_owner_name}`:""}</p><div className="flex flex-wrap gap-2 mt-1">{tx.attachment_count>0&&<span className="text-[10px] text-(--text-secondary) flex items-center gap-1"><Paperclip className="size-3"/>{tx.attachment_count}</span>}{tx.splits?.length>0&&<span className="text-[10px] text-(--text-secondary)">{tx.splits.length} splits</span>}{tx.installment_number&&<span className="text-[10px] text-(--text-secondary)">Installment {tx.installment_number}/{tx.total_installments}</span>}{tx.invoice_links?.length? <span className="text-[10px] text-accent">Invoice linked</span>:null}{tx.fx_fallback&&<span className="text-[10px] text-amber-500">FX rate needs review</span>}</div></div><div className="text-right shrink-0"><p className={`text-sm font-semibold tabular-nums ${isCredit?"text-emerald-500":""}`}>{isCredit?"+":"−"}{money(sharedAmount,tx.currency)}</p>{tx.amount_primary!=null&&<p className="text-[10px] text-(--text-tertiary) mt-1">Primary {Number(tx.amount_primary).toLocaleString("en-IN",{maximumFractionDigits:2})}</p>}</div></Link></div>;})}</div></section>}

    {state.data && <nav aria-label="Transaction pages" className="flex items-center justify-between gap-3"><button disabled={page<=1} onClick={()=>setPage((value)=>Math.max(1,value-1))} className="min-h-11 px-4 rounded-xl border border-(--border) disabled:opacity-40">Previous</button><p className="text-xs text-(--text-secondary)">Page {page} of {totalPages}</p><button disabled={page>=totalPages} onClick={()=>setPage((value)=>value+1)} className="min-h-11 px-4 rounded-xl border border-(--border) disabled:opacity-40">Next</button></nav>}
  </div>;
}
