"use client";

import { ChangeEvent, FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  Link2,
  Paperclip,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings2,
  Trash2,
  Unlink,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type InvoiceLine = { description: string; quantity: number; unit?: string | null; unit_price: number; tax_rate?: number | null; total?: number };
type Allocation = { id: string; transaction_id?: string | null; amount: number; method: string };
type Invoice = {
  id: string;
  payee_id?: string | null;
  payee?: { id: string; name: string } | null;
  direction: "receivable" | "payable";
  origin: string;
  number?: number | null;
  series?: string | null;
  external_number?: string | null;
  status: string;
  state: string;
  issue_date: string;
  due_date: string;
  currency: string;
  subtotal: number;
  discount: number;
  tax_total: number;
  total: number;
  amount_paid: number;
  balance: number;
  days_overdue: number;
  notes?: string | null;
  internal_notes?: string | null;
  share_token?: string | null;
  lines: InvoiceLine[];
  allocations: Allocation[];
};
type Summary = { outstanding: number; overdue_amount: number; overdue_count: number; received_this_month: number; buckets: Record<string, number> };
type Payee = { id: string; name: string };
type Attachment = { id: string; filename: string; content_type: string; size: number; kind: string; is_primary: boolean; created_at: string };
type InvoiceSettings = {
  preset: "tracking" | "document";
  document_required: boolean;
  initial_state: "draft" | "open";
  tax_fields: "hidden" | "optional" | "required";
  default_payment_terms_days: number;
  number_prefix?: string | null;
  series?: string | null;
  issuer_display_name?: string | null;
  footer_note?: string | null;
  payment_details?: string | null;
  accent_color?: string | null;
};
type Issuer = { legal_name?: string | null; address?: string | null; tax_jurisdiction?: string | null; tax_ids: { kind: string; value: string }[] };

type Draft = {
  payee_id: string;
  direction: "receivable" | "payable";
  issue_date: string;
  due_date: string;
  currency: string;
  notes: string;
  internal_notes: string;
  as_draft: boolean;
  lines: InvoiceLine[];
};

const today = () => new Date().toISOString().slice(0, 10);
const blankLine = (): InvoiceLine => ({ description: "", quantity: 1, unit: "", unit_price: 0, tax_rate: 0 });
const blankDraft = (): Draft => ({ payee_id: "", direction: "receivable", issue_date: today(), due_date: "", currency: "INR", notes: "", internal_notes: "", as_draft: true, lines: [blankLine()] });
const asList = <T,>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];
const money = (value: number | null | undefined, code = "INR") => {
  const number = Number(value ?? 0);
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency: code, maximumFractionDigits: 2 }).format(number); }
  catch { return `${code} ${number.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`; }
};

export default function InvoiceWorkspacePage() {
  const [direction, setDirection] = useState<"receivable" | "payable">("receivable");
  const invoicesLoader = useCallback(async () => asList<Invoice>(await engineApi.get(`/invoices?direction=${direction}&limit=500`)), [direction]);
  const summaryLoader = useCallback(async () => await engineApi.get<Summary>(`/invoices/summary?direction=${direction}`), [direction]);
  const payeesLoader = useCallback(async () => asList<Payee>(await engineApi.get("/payees")), []);
  const settingsLoader = useCallback(async () => await engineApi.get<InvoiceSettings>("/invoices/settings"), []);
  const issuerLoader = useCallback(async () => await engineApi.get<Issuer>("/invoices/issuer"), []);
  const invoices = useResource(invoicesLoader);
  const summary = useResource(summaryLoader);
  const payees = useResource(payeesLoader);
  const settings = useResource(settingsLoader);
  const issuer = useResource(issuerLoader);

  const [draft, setDraft] = useState<Draft>(blankDraft());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentKind, setAttachmentKind] = useState("other");
  const [allocationTx, setAllocationTx] = useState("");
  const [allocationAmount, setAllocationAmount] = useState("");
  const [sharePath, setSharePath] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsDraft, setSettingsDraft] = useState<Partial<InvoiceSettings>>({});
  const [issuerDraft, setIssuerDraft] = useState({ legal_name: "", address: "", tax_kind: "", tax_value: "" });
  const [query, setQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filtered = useMemo(() => (invoices.data ?? []).filter((invoice) => {
    const matchesState = stateFilter === "all" || invoice.state === stateFilter;
    const needle = query.trim().toLowerCase();
    const haystack = `${invoice.payee?.name ?? ""} ${invoice.number ?? ""} ${invoice.external_number ?? ""} ${invoice.notes ?? ""}`.toLowerCase();
    return matchesState && (!needle || haystack.includes(needle));
  }), [invoices.data, query, stateFilter]);

  const reload = () => { invoices.reload(); summary.reload(); };
  const mutate = async <T,>(key: string, action: () => Promise<T>, success?: string): Promise<T | null> => {
    setBusy(key); setError(null); setMessage(null);
    try { const result = await action(); if (success) setMessage(success); reload(); return result; }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Invoice operation failed."); return null; }
    finally { setBusy(null); }
  };

  const startCreate = () => { setEditingId(null); setDraft(blankDraft()); setEditorOpen(true); };
  const startEdit = (invoice: Invoice) => {
    setEditingId(invoice.id);
    setDraft({
      payee_id: invoice.payee_id ?? "",
      direction: invoice.direction,
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      currency: invoice.currency,
      notes: invoice.notes ?? "",
      internal_notes: invoice.internal_notes ?? "",
      as_draft: invoice.state === "draft",
      lines: invoice.lines.length ? invoice.lines.map((line) => ({ ...line })) : [blankLine()],
    });
    setEditorOpen(true);
  };

  const updateLine = (index: number, patch: Partial<InvoiceLine>) => setDraft((current) => ({ ...current, lines: current.lines.map((line, i) => i === index ? { ...line, ...patch } : line) }));
  const submitInvoice = async (event: FormEvent) => {
    event.preventDefault();
    const payload = {
      payee_id: draft.payee_id || null,
      direction: editingId ? undefined : draft.direction,
      issue_date: draft.issue_date || null,
      due_date: draft.due_date || null,
      currency: draft.currency,
      notes: draft.notes || null,
      internal_notes: draft.internal_notes || null,
      ...(editingId ? {} : { as_draft: draft.as_draft }),
      lines: draft.lines.filter((line) => line.description.trim()).map((line) => ({ description: line.description.trim(), quantity: Number(line.quantity), unit: line.unit || null, unit_price: Number(line.unit_price), tax_rate: Number(line.tax_rate || 0) })),
    };
    const result = await mutate("save", () => editingId ? engineApi.patch<Invoice>(`/invoices/${editingId}`, payload) : engineApi.post<Invoice>("/invoices", payload), editingId ? "Invoice updated." : "Invoice created.");
    if (result) { setEditorOpen(false); setEditingId(null); setSelected(result); }
  };

  const action = async (invoice: Invoice, verb: "issue" | "void" | "uncollectible" | "reopen") => {
    const result = await mutate(`${verb}-${invoice.id}`, () => engineApi.post<Invoice>(`/invoices/${invoice.id}/${verb}`, {}), `Invoice ${verb === "uncollectible" ? "written off" : `${verb}d`}.`);
    if (result) setSelected(result);
  };
  const deleteInvoice = async (invoice: Invoice) => {
    if (!window.confirm("Delete this invoice permanently?")) return;
    const result = await mutate(`delete-${invoice.id}`, () => engineApi.delete(`/invoices/${invoice.id}`), "Invoice deleted.");
    if (result) setSelected(null);
  };
  const downloadPdf = async (invoice: Invoice) => {
    setBusy(`pdf-${invoice.id}`); setError(null);
    try {
      const blob = await engineApi.blob(`/invoices/${invoice.id}/pdf`);
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `invoice-${invoice.number ?? invoice.id}.pdf`; a.click(); URL.revokeObjectURL(url);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "PDF download failed."); }
    finally { setBusy(null); }
  };
  const createShare = async (invoice: Invoice) => {
    const result = await mutate(`share-${invoice.id}`, () => engineApi.post<{ path: string }>(`/invoices/${invoice.id}/share`, {}), "Public invoice link created.");
    if (result) setSharePath(result.path);
  };
  const revokeShare = async (invoice: Invoice) => {
    const result = await mutate(`unshare-${invoice.id}`, () => engineApi.delete(`/invoices/${invoice.id}/share`), "Public invoice link revoked.");
    if (result) setSharePath(null);
  };

  const openDetail = async (invoice: Invoice) => {
    setSelected(invoice); setSharePath(invoice.share_token ? `/i/${invoice.share_token}` : null);
    setBusy(`detail-${invoice.id}`); setError(null);
    try { setAttachments(asList<Attachment>(await engineApi.get(`/invoices/${invoice.id}/attachments`))); }
    catch { setAttachments([]); }
    finally { setBusy(null); }
  };
  const uploadAttachment = async (event: FormEvent) => {
    event.preventDefault(); if (!selected || !attachmentFile) return;
    const data = new FormData(); data.append("file", attachmentFile); data.append("kind", attachmentKind);
    const result = await mutate("attachment", () => engineApi.form<Attachment>(`/invoices/${selected.id}/attachments`, data), "Attachment uploaded.");
    if (result) { setAttachments((current) => [result, ...current]); setAttachmentFile(null); }
  };
  const removeAttachment = async (attachment: Attachment) => {
    if (!selected || !window.confirm(`Delete ${attachment.filename}?`)) return;
    const result = await mutate(`attachment-delete-${attachment.id}`, () => engineApi.delete(`/invoices/${selected.id}/attachments/${attachment.id}`), "Attachment deleted.");
    if (result) setAttachments((current) => current.filter((item) => item.id !== attachment.id));
  };
  const allocate = async (event: FormEvent) => {
    event.preventDefault(); if (!selected || !allocationTx.trim()) return;
    const result = await mutate("allocate", () => engineApi.post<Invoice>(`/invoices/${selected.id}/allocations`, { transaction_id: allocationTx.trim(), amount: allocationAmount ? Number(allocationAmount) : undefined }), "Payment allocation added.");
    if (result) { setSelected(result); setAllocationTx(""); setAllocationAmount(""); }
  };
  const removeAllocation = async (allocation: Allocation) => {
    if (!selected) return;
    const result = await mutate(`allocation-${allocation.id}`, () => engineApi.delete<Invoice>(`/invoices/${selected.id}/allocations/${allocation.id}`), "Payment allocation removed.");
    if (result) setSelected(result);
  };

  const saveSettings = async (event: FormEvent) => {
    event.preventDefault();
    const result = await mutate("settings", () => engineApi.patch<InvoiceSettings>("/invoices/settings", settingsDraft), "Invoice settings saved.");
    if (result) { settings.reload(); setSettingsDraft(result); }
  };
  const saveIssuer = async (event: FormEvent) => {
    event.preventDefault();
    const tax_ids = issuerDraft.tax_kind.trim() && issuerDraft.tax_value.trim() ? [{ kind: issuerDraft.tax_kind.trim(), value: issuerDraft.tax_value.trim() }] : [];
    const result = await mutate("issuer", () => engineApi.patch<Issuer>("/invoices/issuer", { legal_name: issuerDraft.legal_name || null, address: issuerDraft.address || null, tax_ids }), "Issuer profile saved.");
    if (result) issuer.reload();
  };

  return <div className="flex flex-col gap-6 max-w-7xl pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent"><ArrowLeft className="w-3.5 h-3.5"/>Finance operations</Link><p className="text-xs uppercase tracking-[.18em] text-accent mt-5">Receivables & payables</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Invoices</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Create documents, track payment state, reconcile money, attach source files, generate PDFs and share client-safe invoice links.</p></div><div className="flex flex-wrap gap-2"><button onClick={()=>{setSettingsOpen((value)=>!value);if(settings.data)setSettingsDraft(settings.data);if(issuer.data)setIssuerDraft({legal_name:issuer.data.legal_name??"",address:issuer.data.address??"",tax_kind:issuer.data.tax_ids[0]?.kind??"",tax_value:issuer.data.tax_ids[0]?.value??""});}} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><Settings2 className="w-4 h-4"/>Settings</button><button onClick={startCreate} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2"><Plus className="w-4 h-4"/>New invoice</button></div></header>

    <div className="flex gap-2 border-b border-(--border)">{(["receivable","payable"] as const).map((value)=><button key={value} onClick={()=>setDirection(value)} className={`px-4 py-3 text-sm border-b-2 capitalize ${direction===value?"border-accent text-accent":"border-transparent text-(--text-secondary)"}`}>{value}</button>)}</div>
    <ResourceState loading={summary.loading} error={summary.error} retry={summary.reload}/>
    {summary.data&&<section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3"><Metric label="Outstanding" value={money(summary.data.outstanding)}/><Metric label="Overdue" value={money(summary.data.overdue_amount)}/><Metric label="Overdue invoices" value={String(summary.data.overdue_count)}/><Metric label="Received this month" value={money(summary.data.received_this_month)}/></section>}
    {message&&<p className="text-sm text-emerald-400 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">{message}</p>}{error&&<p className="text-sm text-red-400 rounded-xl border border-red-400/25 bg-red-400/5 p-3">{error}</p>}

    {settingsOpen&&<section className="grid xl:grid-cols-2 gap-4"><form onSubmit={saveSettings} className="premium-card p-5"><h2 className="font-display font-semibold text-xl">Invoice settings</h2><div className="grid sm:grid-cols-2 gap-3 mt-4"><select value={String(settingsDraft.preset??settings.data?.preset??"tracking")} onChange={(e)=>setSettingsDraft((c)=>({...c,preset:e.target.value as InvoiceSettings["preset"]}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="tracking">Tracking</option><option value="document">Document</option></select><select value={String(settingsDraft.initial_state??settings.data?.initial_state??"draft")} onChange={(e)=>setSettingsDraft((c)=>({...c,initial_state:e.target.value as InvoiceSettings["initial_state"]}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="draft">Start as draft</option><option value="open">Open immediately</option></select><input type="number" min="0" max="365" value={String(settingsDraft.default_payment_terms_days??settings.data?.default_payment_terms_days??30)} onChange={(e)=>setSettingsDraft((c)=>({...c,default_payment_terms_days:Number(e.target.value)}))} placeholder="Payment terms days" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input value={String(settingsDraft.number_prefix??settings.data?.number_prefix??"")} onChange={(e)=>setSettingsDraft((c)=>({...c,number_prefix:e.target.value}))} placeholder="Number prefix" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input value={String(settingsDraft.series??settings.data?.series??"")} onChange={(e)=>setSettingsDraft((c)=>({...c,series:e.target.value}))} placeholder="Series" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input value={String(settingsDraft.accent_color??settings.data?.accent_color??"")} onChange={(e)=>setSettingsDraft((c)=>({...c,accent_color:e.target.value}))} placeholder="#10b981" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><textarea value={String(settingsDraft.footer_note??settings.data?.footer_note??"")} onChange={(e)=>setSettingsDraft((c)=>({...c,footer_note:e.target.value}))} placeholder="Footer note" className="sm:col-span-2 p-3 rounded-xl border border-(--border) bg-(--surface)"/><textarea value={String(settingsDraft.payment_details??settings.data?.payment_details??"")} onChange={(e)=>setSettingsDraft((c)=>({...c,payment_details:e.target.value}))} placeholder="Payment details / UPI / bank details" className="sm:col-span-2 p-3 rounded-xl border border-(--border) bg-(--surface)"/></div><button disabled={busy==="settings"} className="mt-4 min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/>Save settings</button></form><form onSubmit={saveIssuer} className="premium-card p-5"><h2 className="font-display font-semibold text-xl">Issuer identity</h2><div className="grid gap-3 mt-4"><input value={issuerDraft.legal_name} onChange={(e)=>setIssuerDraft((c)=>({...c,legal_name:e.target.value}))} placeholder="Legal / business name" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><textarea value={issuerDraft.address} onChange={(e)=>setIssuerDraft((c)=>({...c,address:e.target.value}))} placeholder="Address" className="p-3 rounded-xl border border-(--border) bg-(--surface)"/><div className="grid grid-cols-2 gap-2"><input value={issuerDraft.tax_kind} onChange={(e)=>setIssuerDraft((c)=>({...c,tax_kind:e.target.value}))} placeholder="Tax ID type" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input value={issuerDraft.tax_value} onChange={(e)=>setIssuerDraft((c)=>({...c,tax_value:e.target.value}))} placeholder="Tax ID" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/></div></div><button disabled={busy==="issuer"} className="mt-4 min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/>Save issuer</button></form></section>}

    {editorOpen&&<form onSubmit={submitInvoice} className="premium-card p-5 sm:p-6 border border-accent/25"><div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-accent">{editingId?"Edit invoice":"New invoice"}</p><h2 className="font-display font-semibold text-xl mt-1">Invoice editor</h2></div><button type="button" onClick={()=>setEditorOpen(false)} className="size-10 grid place-items-center rounded-xl border border-(--border)"><X className="w-4 h-4"/></button></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-5"><select value={draft.payee_id} onChange={(e)=>setDraft((c)=>({...c,payee_id:e.target.value}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="">No payee</option>{(payees.data??[]).map((p)=><option key={p.id} value={p.id}>{p.name}</option>)}</select>{!editingId&&<select value={draft.direction} onChange={(e)=>setDraft((c)=>({...c,direction:e.target.value as Draft["direction"]}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="receivable">Receivable</option><option value="payable">Payable</option></select>}<input type="date" value={draft.issue_date} onChange={(e)=>setDraft((c)=>({...c,issue_date:e.target.value}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input type="date" value={draft.due_date} onChange={(e)=>setDraft((c)=>({...c,due_date:e.target.value}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input maxLength={3} value={draft.currency} onChange={(e)=>setDraft((c)=>({...c,currency:e.target.value.toUpperCase()}))} placeholder="INR" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/></div><div className="mt-5"><div className="flex justify-between gap-3"><h3 className="font-semibold">Line items</h3><button type="button" onClick={()=>setDraft((c)=>({...c,lines:[...c.lines,blankLine()]}))} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">+ Line</button></div><div className="grid gap-2 mt-3">{draft.lines.map((line,index)=><div key={index} className="grid xl:grid-cols-[1fr_7rem_7rem_9rem_7rem_2.5rem] gap-2"><input required value={line.description} onChange={(e)=>updateLine(index,{description:e.target.value})} placeholder="Description" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input type="number" min="0" step="any" value={line.quantity} onChange={(e)=>updateLine(index,{quantity:Number(e.target.value)})} placeholder="Qty" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input value={line.unit??""} onChange={(e)=>updateLine(index,{unit:e.target.value})} placeholder="Unit" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input type="number" step="any" value={line.unit_price} onChange={(e)=>updateLine(index,{unit_price:Number(e.target.value)})} placeholder="Unit price" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input type="number" min="0" max="100" step="any" value={line.tax_rate??0} onChange={(e)=>updateLine(index,{tax_rate:Number(e.target.value)})} placeholder="Tax %" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><button type="button" onClick={()=>setDraft((c)=>({...c,lines:c.lines.filter((_,i)=>i!==index)}))} disabled={draft.lines.length===1} className="size-11 rounded-xl border border-red-400/20 text-red-400 grid place-items-center disabled:opacity-30"><Trash2 className="w-4 h-4"/></button></div>)}</div></div><div className="grid sm:grid-cols-2 gap-3 mt-5"><textarea value={draft.notes} onChange={(e)=>setDraft((c)=>({...c,notes:e.target.value}))} placeholder="Notes visible on document" className="p-3 rounded-xl border border-(--border) bg-(--surface)"/><textarea value={draft.internal_notes} onChange={(e)=>setDraft((c)=>({...c,internal_notes:e.target.value}))} placeholder="Internal notes" className="p-3 rounded-xl border border-(--border) bg-(--surface)"/></div>{!editingId&&<label className="flex items-center gap-2 mt-4 text-sm"><input type="checkbox" checked={draft.as_draft} onChange={(e)=>setDraft((c)=>({...c,as_draft:e.target.checked}))}/>Keep as draft</label>}<button disabled={busy==="save"} className="mt-5 min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/>{busy==="save"?"Saving…":"Save invoice"}</button></form>}

    <div className="flex flex-wrap gap-2"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search invoices" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface) min-w-64"/><select value={stateFilter} onChange={(e)=>setStateFilter(e.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="all">All states</option>{["draft","open","partial","paid","overdue","void","uncollectible"].map((s)=><option key={s} value={s}>{s}</option>)}</select><button onClick={reload} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><RefreshCw className="w-4 h-4"/>Refresh</button></div>
    <ResourceState loading={invoices.loading} error={invoices.error} retry={invoices.reload}/>
    {invoices.data&&<section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map((invoice)=><article key={invoice.id} className="premium-card p-5"><div className="flex justify-between gap-3"><div><p className="text-xs uppercase tracking-[.12em] text-accent">{invoice.state}</p><h2 className="font-display font-semibold text-lg mt-2">{invoice.payee?.name??"Unassigned payee"}</h2><p className="text-xs text-(--text-secondary) mt-1">{invoice.series?`${invoice.series}-`:""}{invoice.number??invoice.external_number??"Draft"} · Due {invoice.due_date}</p></div><FileText className="w-5 h-5 text-accent"/></div><dl className="grid grid-cols-2 gap-3 mt-5 text-xs"><div><dt className="text-(--text-tertiary)">Total</dt><dd className="font-semibold mt-1">{money(invoice.total,invoice.currency)}</dd></div><div><dt className="text-(--text-tertiary)">Balance</dt><dd className="font-semibold mt-1">{money(invoice.balance,invoice.currency)}</dd></div><div><dt className="text-(--text-tertiary)">Paid</dt><dd className="mt-1">{money(invoice.amount_paid,invoice.currency)}</dd></div><div><dt className="text-(--text-tertiary)">Overdue</dt><dd className="mt-1">{invoice.days_overdue>0?`${invoice.days_overdue} days`:"No"}</dd></div></dl><div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-(--border)"><button onClick={()=>openDetail(invoice)} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">Open</button><button onClick={()=>startEdit(invoice)} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">Edit</button>{invoice.state==="draft"&&<button onClick={()=>action(invoice,"issue")} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1"><Send className="w-3.5 h-3.5"/>Issue</button>}<button onClick={()=>downloadPdf(invoice)} className="size-9 rounded-lg border border-(--border) grid place-items-center"><Download className="w-3.5 h-3.5"/></button></div></article>)}{filtered.length===0&&<div className="premium-card p-10 text-center md:col-span-2 xl:col-span-3"><FileText className="w-8 h-8 text-accent mx-auto"/><h2 className="font-semibold mt-4">No invoices found</h2></div>}</section>}

    {selected&&<section className="premium-card p-5 sm:p-6 border border-accent/25"><div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-accent">Invoice detail</p><h2 className="font-display font-semibold text-2xl mt-1">{selected.payee?.name??"Invoice"} · {money(selected.total,selected.currency)}</h2><p className="text-sm text-(--text-secondary) mt-1">State: {selected.state} · Balance {money(selected.balance,selected.currency)}</p></div><button onClick={()=>setSelected(null)} className="size-10 rounded-xl border border-(--border) grid place-items-center"><X className="w-4 h-4"/></button></div><div className="flex flex-wrap gap-2 mt-5"><button onClick={()=>downloadPdf(selected)} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2"><Download className="w-4 h-4"/>PDF</button>{!sharePath?<button onClick={()=>createShare(selected)} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2"><Link2 className="w-4 h-4"/>Create share link</button>:<><a href={sharePath} target="_blank" rel="noreferrer" className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2">Open public link</a><button onClick={()=>revokeShare(selected)} className="min-h-10 px-3 rounded-xl border border-(--border) flex items-center gap-2"><Unlink className="w-4 h-4"/>Revoke</button></>}{selected.state!=="void"&&selected.state!=="paid"&&<button onClick={()=>action(selected,"void")} className="min-h-10 px-3 rounded-xl border border-(--border)">Void</button>}{["open","partial","overdue"].includes(selected.state)&&<button onClick={()=>action(selected,"uncollectible")} className="min-h-10 px-3 rounded-xl border border-(--border)">Write off</button>}{["void","uncollectible"].includes(selected.state)&&<button onClick={()=>action(selected,"reopen")} className="min-h-10 px-3 rounded-xl border border-(--border)">Reopen</button>}<button onClick={()=>deleteInvoice(selected)} className="min-h-10 px-3 rounded-xl border border-red-400/20 text-red-400">Delete</button></div><div className="grid xl:grid-cols-2 gap-5 mt-6"><div><h3 className="font-semibold">Payment allocations</h3><form onSubmit={allocate} className="grid sm:grid-cols-[1fr_10rem_auto] gap-2 mt-3"><input required value={allocationTx} onChange={(e)=>setAllocationTx(e.target.value)} placeholder="Transaction UUID" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><input type="number" step="any" min="0" value={allocationAmount} onChange={(e)=>setAllocationAmount(e.target.value)} placeholder="Amount" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><button className="min-h-11 px-3 rounded-xl bg-accent text-white">Allocate</button></form><div className="grid gap-2 mt-3">{selected.allocations.map((allocation)=><div key={allocation.id} className="flex justify-between gap-3 rounded-xl border border-(--border) p-3 text-sm"><div><p>{money(allocation.amount,selected.currency)}</p><p className="text-xs text-(--text-tertiary)">{allocation.transaction_id??allocation.method}</p></div><button onClick={()=>removeAllocation(allocation)} className="size-9 grid place-items-center rounded-lg border border-red-400/20 text-red-400"><Trash2 className="w-3.5 h-3.5"/></button></div>)}</div></div><div><h3 className="font-semibold">Attachments</h3><form onSubmit={uploadAttachment} className="grid gap-2 mt-3"><input type="file" required onChange={(e:ChangeEvent<HTMLInputElement>)=>setAttachmentFile(e.target.files?.[0]??null)} className="text-sm"/><select value={attachmentKind} onChange={(e)=>setAttachmentKind(e.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)">{["bill","fiscal","receipt","contract","other"].map((kind)=><option key={kind} value={kind}>{kind}</option>)}</select><button disabled={!attachmentFile||busy==="attachment"} className="min-h-11 px-3 rounded-xl border border-(--border) flex items-center justify-center gap-2 disabled:opacity-50"><Paperclip className="w-4 h-4"/>Upload file</button></form><div className="grid gap-2 mt-3">{attachments.map((attachment)=><div key={attachment.id} className="flex justify-between gap-3 rounded-xl border border-(--border) p-3 text-sm"><div className="min-w-0"><p className="truncate">{attachment.filename}</p><p className="text-xs text-(--text-tertiary)">{attachment.kind}{attachment.is_primary?" · primary":""}</p></div><button onClick={()=>removeAttachment(attachment)} className="size-9 grid place-items-center rounded-lg border border-red-400/20 text-red-400"><Trash2 className="w-3.5 h-3.5"/></button></div>)}</div></div></div></section>}
  </div>;
}

function Metric({label,value}:{label:string;value:string}) { return <div className="premium-card p-5"><p className="font-display text-2xl font-semibold">{value}</p><p className="text-xs text-(--text-secondary) mt-2">{label}</p></div>; }
