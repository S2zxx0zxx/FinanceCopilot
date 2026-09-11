"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArchiveRestore,
  Cable,
  CreditCard,
  Landmark,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type Account = {
  id: string; name: string; display_name?: string | null; type: string; balance: number | string; current_balance: number;
  currency: string; connection_id?: string | null; masked_number?: string | null; institution_name?: string | null;
  institution_logo_url?: string | null; balance_primary?: number | null; credit_limit?: number | null; available_credit?: number | null;
  next_close_date?: string | null; next_due_date?: string | null; minimum_payment?: number | null; card_brand?: string | null;
  card_level?: string | null; is_closed: boolean; closed_at?: string | null;
};
type Connection = { id: string; provider: string; institution_name: string; display_name?: string | null; status: string; last_sync_at?: string | null };
type Currency = { code: string; symbol: string; name: string; flag: string };
type Draft = {
  name: string; type: string; balance: string; balance_date: string; currency: string; credit_limit: string;
  statement_close_day: string; payment_due_day: string; minimum_payment: string; card_brand: string; card_level: string;
};

const ACCOUNT_TYPES = ["checking", "savings", "credit_card", "investment", "wallet"];
const emptyDraft = (): Draft => ({ name: "", type: "checking", balance: "0", balance_date: new Date().toISOString().slice(0, 10), currency: "INR", credit_limit: "", statement_close_day: "", payment_due_day: "", minimum_payment: "", card_brand: "", card_level: "" });
function money(value: number | string | null | undefined, currency: string) {
  const amount = Number(value ?? 0) || 0;
  try { return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount); }
  catch { return `${currency} ${amount.toLocaleString("en-IN")}`; }
}
function daysUntil(value?: string | null) {
  if (!value) return null;
  const due = new Date(`${value}T00:00:00`).getTime();
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((due - today.getTime()) / 86_400_000);
}
function displayName(account: Account) { return account.display_name || account.name || account.institution_name || "Account"; }

export default function AccountsPage() {
  const [includeClosed, setIncludeClosed] = useState(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft());
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const accounts = useResource(useCallback(async () => {
    const rows = await engineApi.get<Account[]>(`/accounts?include_closed=${includeClosed}`);
    return Array.isArray(rows) ? rows : [];
  }, [includeClosed]));
  const connections = useResource(useCallback(async () => {
    const rows = await engineApi.get<Connection[]>("/connections");
    return Array.isArray(rows) ? rows : [];
  }, []));
  const currencies = useResource(useCallback(async () => {
    const rows = await engineApi.get<Currency[]>("/currencies");
    return Array.isArray(rows) ? rows : [];
  }, []));

  const connectionMap = useMemo(() => new Map((connections.data ?? []).map((item) => [item.id, item])), [connections.data]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (accounts.data ?? []).filter((account) => {
      const matchesType = type === "all" || account.type === type;
      const haystack = `${displayName(account)} ${account.institution_name || ""} ${account.masked_number || ""} ${account.currency}`.toLowerCase();
      return matchesType && (!needle || haystack.includes(needle));
    });
  }, [accounts.data, query, type]);
  const manual = filtered.filter((item) => !item.connection_id);
  const connected = filtered.filter((item) => item.connection_id);
  const stats = useMemo(() => {
    const all = accounts.data ?? [];
    return {
      total: all.length,
      open: all.filter((item) => !item.is_closed).length,
      cards: all.filter((item) => item.type === "credit_card" && !item.is_closed).length,
      connected: all.filter((item) => Boolean(item.connection_id)).length,
    };
  }, [accounts.data]);

  const refresh = () => { accounts.reload(); connections.reload(); };
  const openCreate = () => { setDraft(emptyDraft()); setMutationError(null); setEditorOpen(true); };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    const balance = Number(draft.balance);
    if (!draft.name.trim() || !Number.isFinite(balance)) { setMutationError("Enter an account name and valid balance."); return; }
    setBusy("create"); setMutationError(null); setNotice(null);
    const optionalNumber = (value: string) => value === "" ? undefined : Number(value);
    try {
      await engineApi.post("/accounts", {
        name: draft.name.trim(), type: draft.type, balance, balance_date: draft.balance_date || null, currency: draft.currency,
        credit_limit: draft.type === "credit_card" ? optionalNumber(draft.credit_limit) : undefined,
        statement_close_day: draft.type === "credit_card" ? optionalNumber(draft.statement_close_day) : undefined,
        payment_due_day: draft.type === "credit_card" ? optionalNumber(draft.payment_due_day) : undefined,
        minimum_payment: draft.type === "credit_card" ? optionalNumber(draft.minimum_payment) : undefined,
        card_brand: draft.type === "credit_card" ? draft.card_brand.trim() || undefined : undefined,
        card_level: draft.type === "credit_card" ? draft.card_level.trim() || undefined : undefined,
      });
      setNotice("Manual account created."); setEditorOpen(false); accounts.reload();
    } catch (caught) { setMutationError(caught instanceof Error ? caught.message : "Account could not be created."); }
    finally { setBusy(null); }
  };

  const lifecycle = async (account: Account, action: "close" | "reopen" | "delete") => {
    if (action === "delete" && !window.confirm(`Delete “${displayName(account)}” permanently?`)) return;
    setBusy(`${action}-${account.id}`); setMutationError(null); setNotice(null);
    try {
      if (action === "delete") await engineApi.delete(`/accounts/${account.id}`);
      else await engineApi.post(`/accounts/${account.id}/${action}`, {});
      setNotice(action === "close" ? "Account closed." : action === "reopen" ? "Account reopened." : "Account deleted.");
      accounts.reload();
    } catch (caught) { setMutationError(caught instanceof Error ? caught.message : `Account could not be ${action}d.`); }
    finally { setBusy(null); }
  };

  const card = (account: Account) => {
    const connection = account.connection_id ? connectionMap.get(account.connection_id) : null;
    const due = daysUntil(account.next_due_date);
    return <article key={account.id} className="premium-card p-5 group min-w-0">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/accounts/${account.id}`} className="flex items-center gap-3 min-w-0 flex-1">
          <span className="grid size-11 place-items-center rounded-2xl bg-(--surface-subtle) shrink-0">{account.type === "credit_card" ? <CreditCard className="size-5 text-accent" /> : <Landmark className="size-5 text-accent" />}</span>
          <div className="min-w-0"><h3 className="font-display font-semibold truncate">{displayName(account)}</h3><p className="text-xs text-(--text-secondary) mt-1 truncate">{account.institution_name || (connection ? connection.display_name || connection.institution_name : "Manual account")}{account.masked_number ? ` · •••• ${account.masked_number}` : ""}</p></div>
        </Link>
        <details className="relative"><summary className="list-none grid size-9 place-items-center rounded-lg border border-(--border) cursor-pointer"><MoreHorizontal className="size-4" /></summary><div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-(--border) bg-(--surface) shadow-xl p-1">{account.is_closed ? <button disabled={busy !== null} onClick={() => void lifecycle(account, "reopen")} className="w-full min-h-9 px-3 rounded-lg text-left text-xs hover:bg-(--surface-subtle) flex items-center gap-2"><ArchiveRestore className="size-3.5" />Reopen</button> : <button disabled={busy !== null} onClick={() => void lifecycle(account, "close")} className="w-full min-h-9 px-3 rounded-lg text-left text-xs hover:bg-(--surface-subtle)">Close account</button>}<button disabled={busy !== null} onClick={() => void lifecycle(account, "delete")} className="w-full min-h-9 px-3 rounded-lg text-left text-xs text-red-500 hover:bg-red-500/5 flex items-center gap-2"><Trash2 className="size-3.5" />Delete</button></div></details>
      </div>
      <Link href={`/accounts/${account.id}`} className="block mt-5">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs text-(--text-secondary)">{account.is_closed ? "Closed balance" : "Current balance"}</p><p className={`font-display text-2xl font-semibold mt-1 ${account.type === "credit_card" && account.current_balance > 0 ? "text-rose-500" : ""}`}>{money(account.current_balance, account.currency)}</p>{account.balance_primary != null && <p className="text-[11px] text-(--text-tertiary) mt-1">Primary value {money(account.balance_primary, "INR")}</p>}</div><span className={`text-[10px] uppercase tracking-wider rounded-full border px-2 py-1 ${account.is_closed ? "border-(--border) text-(--text-tertiary)" : connection?.status && connection.status !== "active" ? "border-amber-500/20 text-amber-500" : "border-emerald-500/20 text-emerald-500"}`}>{account.is_closed ? "closed" : connection ? connection.status : "manual"}</span></div>
        {account.type === "credit_card" && <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-(--border)"><div><p className="text-[11px] text-(--text-secondary)">Available credit</p><p className="text-sm font-medium mt-1">{account.available_credit == null ? "—" : money(account.available_credit, account.currency)}</p></div><div><p className="text-[11px] text-(--text-secondary)">Next due</p><p className={`text-sm font-medium mt-1 ${due !== null && due <= 3 ? "text-amber-500" : ""}`}>{account.next_due_date || "—"}{due !== null ? ` · ${due < 0 ? "overdue" : due === 0 ? "today" : `${due}d`}` : ""}</p></div></div>}
      </Link>
    </article>;
  };

  return <div className="flex flex-col gap-6 max-w-7xl pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-accent">Your money, organised</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Account vault</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Manual accounts and synced bank accounts now share the native finance ledger, currency model, credit-card metadata and lifecycle controls.</p></div><div className="flex flex-wrap gap-2"><Link href="/finance/connections" className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><Cable className="size-4" />Connect bank</Link><button onClick={openCreate} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2"><Plus className="size-4" />Manual account</button></div></header>

    {notice && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-500">{notice}</p>}
    {mutationError && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">{mutationError}</p>}

    {editorOpen && <form onSubmit={save} className="premium-card p-5 sm:p-6"><div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-wider text-accent">Manual account</p><h2 className="font-display text-xl font-semibold mt-1">Create a finance-ledger account</h2></div><button type="button" onClick={() => setEditorOpen(false)} className="grid size-10 place-items-center rounded-xl border border-(--border)"><X className="size-4" /></button></div><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mt-5"><label className="text-sm xl:col-span-2">Name<input required value={draft.name} onChange={(e)=>setDraft((d)=>({...d,name:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" placeholder="Primary checking" /></label><label className="text-sm">Type<select value={draft.type} onChange={(e)=>setDraft((d)=>({...d,type:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)">{ACCOUNT_TYPES.map((value)=><option key={value} value={value}>{value.replaceAll("_"," ")}</option>)}</select></label><label className="text-sm">Currency<select value={draft.currency} onChange={(e)=>setDraft((d)=>({...d,currency:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)">{(currencies.data?.length ? currencies.data : [{code:"INR",symbol:"₹",name:"Indian Rupee",flag:"🇮🇳"}]).map((item)=><option key={item.code} value={item.code}>{item.flag} {item.code}</option>)}</select></label><label className="text-sm">Opening balance<input required type="number" step="0.01" value={draft.balance} onChange={(e)=>setDraft((d)=>({...d,balance:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Balance date<input type="date" value={draft.balance_date} onChange={(e)=>setDraft((d)=>({...d,balance_date:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label>{draft.type === "credit_card" && <><label className="text-sm">Credit limit<input type="number" min="0" step="0.01" value={draft.credit_limit} onChange={(e)=>setDraft((d)=>({...d,credit_limit:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Minimum payment<input type="number" min="0" step="0.01" value={draft.minimum_payment} onChange={(e)=>setDraft((d)=>({...d,minimum_payment:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Statement close day<input type="number" min="1" max="31" value={draft.statement_close_day} onChange={(e)=>setDraft((d)=>({...d,statement_close_day:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Payment due day<input type="number" min="1" max="31" value={draft.payment_due_day} onChange={(e)=>setDraft((d)=>({...d,payment_due_day:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" /></label><label className="text-sm">Card brand<input value={draft.card_brand} onChange={(e)=>setDraft((d)=>({...d,card_brand:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" placeholder="Visa" /></label><label className="text-sm">Card level<input value={draft.card_level} onChange={(e)=>setDraft((d)=>({...d,card_level:e.target.value}))} className="block w-full min-h-11 mt-2 px-3 rounded-xl border border-(--border) bg-(--surface)" placeholder="Platinum" /></label></>}</div><button disabled={busy === "create"} className="mt-5 min-h-11 px-5 rounded-xl bg-accent text-white disabled:opacity-50">{busy === "create" ? "Creating…" : "Create account"}</button></form>}

    <ResourceState loading={accounts.loading || connections.loading} error={accounts.error || connections.error} retry={refresh} />
    {accounts.data && <><section className="grid grid-cols-2 xl:grid-cols-4 gap-3"><div className="premium-card p-5"><WalletCards className="size-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{stats.total}</p><p className="text-xs text-(--text-secondary) mt-1">Visible accounts</p></div><div className="premium-card p-5"><Landmark className="size-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{stats.open}</p><p className="text-xs text-(--text-secondary) mt-1">Open</p></div><div className="premium-card p-5"><CreditCard className="size-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{stats.cards}</p><p className="text-xs text-(--text-secondary) mt-1">Active cards</p></div><div className="premium-card p-5"><Cable className="size-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{stats.connected}</p><p className="text-xs text-(--text-secondary) mt-1">Bank-synced</p></div></section>

    <section className="premium-card p-4 flex flex-wrap gap-3"><label className="relative flex-1 min-w-60"><Search className="absolute left-3 top-3.5 size-4 text-(--text-tertiary)"/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search accounts, institutions or last digits…" className="w-full min-h-11 pl-10 pr-3 rounded-xl border border-(--border) bg-(--surface)" /></label><select value={type} onChange={(e)=>setType(e.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="all">All account types</option>{ACCOUNT_TYPES.map((value)=><option key={value} value={value}>{value.replaceAll("_"," ")}</option>)}</select><label className="min-h-11 px-3 rounded-xl border border-(--border) flex items-center gap-2 text-sm"><input type="checkbox" checked={includeClosed} onChange={(e)=>setIncludeClosed(e.target.checked)} />Show closed</label><button onClick={refresh} className="grid size-11 place-items-center rounded-xl border border-(--border)" aria-label="Refresh accounts"><RefreshCw className="size-4" /></button></section>

    <section><div className="flex items-center justify-between gap-3 mb-3"><div><p className="text-xs uppercase tracking-[.16em] text-(--text-tertiary)">Manual</p><h2 className="font-display font-semibold text-xl mt-1">Accounts you control</h2></div><span className="text-xs text-(--text-secondary)">{manual.length}</span></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{manual.map(card)}{manual.length === 0 && <div className="premium-card p-8 md:col-span-2 xl:col-span-3 text-center"><Landmark className="size-7 text-accent mx-auto"/><p className="font-medium mt-3">No manual accounts match this view.</p></div>}</div></section>

    <section><div className="flex items-center justify-between gap-3 mb-3"><div><p className="text-xs uppercase tracking-[.16em] text-(--text-tertiary)">Connected</p><h2 className="font-display font-semibold text-xl mt-1">Synced bank accounts</h2></div><Link href="/finance/connections" className="text-xs text-accent hover:underline">Manage connections</Link></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{connected.map(card)}{connected.length === 0 && <Link href="/finance/connections" className="premium-card p-8 md:col-span-2 xl:col-span-3 text-center group"><Cable className="size-7 text-accent mx-auto"/><p className="font-medium mt-3">No connected accounts in this view.</p><p className="text-sm text-(--text-secondary) mt-2 group-hover:text-accent">Open Bank sync to connect a provider.</p></Link>}</div></section></>}
  </div>;
}
