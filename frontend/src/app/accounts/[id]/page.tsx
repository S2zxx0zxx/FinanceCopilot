"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CreditCard, RefreshCw, Save, WalletCards } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type Account = {
  id: string;
  name: string;
  display_name?: string | null;
  type: string;
  balance: string | number;
  currency: string;
  institution_name?: string | null;
  institution_logo_url?: string | null;
  masked_number?: string | null;
  current_balance: number;
  previous_balance?: number | null;
  balance_primary?: number | null;
  credit_limit?: number | null;
  available_credit?: number | null;
  statement_close_day?: number | null;
  payment_due_day?: number | null;
  next_close_date?: string | null;
  next_due_date?: string | null;
  minimum_payment?: number | null;
  card_brand?: string | null;
  card_level?: string | null;
  is_closed: boolean;
};
type Summary = {
  current_balance: number;
  opening_balance: number;
  monthly_income: number;
  monthly_expenses: number;
  projected_income: number;
  projected_expenses: number;
  current_balance_primary?: number | null;
};
type Point = { date: string; balance: number; balance_primary?: number | null };
type Bill = { id: string; due_date: string; total_amount: number; currency: string; minimum_payment?: number | null };
type Tx = { id: string; description: string; amount: number | string; date: string; type: string; status: string; currency: string };

const money = (value: number | string | null | undefined, currency: string) => {
  const amount = Number(value ?? 0);
  try { return new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 2 }).format(amount); }
  catch { return `${amount.toFixed(2)} ${currency}`; }
};

export default function AccountDetailPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const { id } = React.use(params);
  const [account, setAccount] = React.useState<Account | null>(null);
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [history, setHistory] = React.useState<Point[]>([]);
  const [bills, setBills] = React.useState<Bill[]>([]);
  const [transactions, setTransactions] = React.useState<Tx[]>([]);
  const [displayName, setDisplayName] = React.useState("");
  const [creditLimit, setCreditLimit] = React.useState("");
  const [statementCloseDay, setStatementCloseDay] = React.useState("");
  const [paymentDueDay, setPaymentDueDay] = React.useState("");
  const [minimumPayment, setMinimumPayment] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [accountResult, summaryResult, historyResult, billsResult, txResult] = await Promise.all([
        engineApi.get<Account>(`/api/accounts/${id}`),
        engineApi.get<Summary>(`/api/accounts/${id}/summary`),
        engineApi.get<Point[]>(`/api/accounts/${id}/balance-history`),
        engineApi.get<Bill[]>(`/api/accounts/${id}/bills?limit=24`),
        engineApi.get<any>(`/api/transactions?account_id=${encodeURIComponent(id)}&page=1&limit=20`),
      ]);
      setAccount(accountResult); setSummary(summaryResult);
      setHistory(Array.isArray(historyResult) ? historyResult : []);
      setBills(Array.isArray(billsResult) ? billsResult : []);
      setTransactions(Array.isArray(txResult?.items) ? txResult.items : []);
      setDisplayName(accountResult.display_name || accountResult.name || "");
      setCreditLimit(accountResult.credit_limit == null ? "" : String(accountResult.credit_limit));
      setStatementCloseDay(accountResult.statement_close_day == null ? "" : String(accountResult.statement_close_day));
      setPaymentDueDay(accountResult.payment_due_day == null ? "" : String(accountResult.payment_due_day));
      setMinimumPayment(accountResult.minimum_payment == null ? "" : String(accountResult.minimum_payment));
    } catch (err) { setError(err instanceof Error ? err.message : "Account could not be loaded."); }
    finally { setLoading(false); }
  }, [id]);
  React.useEffect(() => { void load(); }, [load]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (!account) return; setBusy(true); setError(null); setMessage(null);
    try {
      const updated = await engineApi.patch<Account>(`/api/accounts/${id}`, {
        display_name: displayName.trim() || null,
        ...(account.type === "credit_card" ? {
          credit_limit: creditLimit ? Number(creditLimit) : null,
          statement_close_day: statementCloseDay ? Number(statementCloseDay) : null,
          payment_due_day: paymentDueDay ? Number(paymentDueDay) : null,
          minimum_payment: minimumPayment ? Number(minimumPayment) : null,
        } : {}),
      });
      setAccount(updated); setMessage("Account settings saved."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Account settings could not be saved."); }
    finally { setBusy(false); }
  };

  const toggleClosed = async () => {
    if (!account) return;
    const verb = account.is_closed ? "reopen" : "close";
    if (!window.confirm(`${account.is_closed ? "Reopen" : "Close"} this account? Existing transactions remain stored.`)) return;
    setBusy(true); setError(null);
    try { await engineApi.post(`/api/accounts/${id}/${verb}`); setMessage(account.is_closed ? "Account reopened." : "Account closed."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : `Account could not be ${verb}ed.`); }
    finally { setBusy(false); }
  };

  if (loading) return <div className="min-h-[45vh] grid place-items-center"><RefreshCw className="size-7 animate-spin text-accent" /></div>;
  if (!account || error) return <div className="max-w-4xl"><Link href="/accounts" className="inline-flex items-center gap-2 text-sm text-accent"><ArrowLeft className="size-4" />Accounts</Link><div className="premium-card p-8 mt-5"><p role="alert" className="text-(--negative)">{error || "Account not found."}</p><button onClick={() => void load()} className="mt-4 min-h-10 rounded-xl border border-(--border) px-4">Retry</button></div></div>;

  const title = account.display_name || account.name || account.institution_name || "Account";
  const high = history.reduce((max, point) => Math.max(max, Number(point.balance)), Number.NEGATIVE_INFINITY);
  const low = history.reduce((min, point) => Math.min(min, Number(point.balance)), Number.POSITIVE_INFINITY);

  return <div className="max-w-6xl flex flex-col gap-6 pb-12">
    <header className="flex flex-wrap justify-between gap-4"><div className="flex gap-3 items-start"><Link href="/accounts" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Back"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Account vault</p><h1 className="font-display text-3xl font-bold mt-1">{title}</h1><p className="text-sm text-(--text-secondary) mt-2">{account.institution_name || "Manual account"} · {account.type.replaceAll("_", " ")}{account.masked_number ? ` · •••• ${account.masked_number}` : ""}</p></div></div><button disabled={busy} onClick={() => void load()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm"><RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />Refresh</button></header>
    {message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive)">{message}</div>}

    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="premium-card p-5"><p className="text-xs text-(--text-tertiary)">Current balance</p><p className="font-display text-2xl font-semibold mt-2">{money(summary?.current_balance ?? account.current_balance, account.currency)}</p>{account.balance_primary != null && account.currency !== "INR" && <p className="text-xs text-(--text-secondary) mt-1">Primary: {account.balance_primary.toLocaleString(undefined,{maximumFractionDigits:2})}</p>}</div>
      <div className="premium-card p-5"><p className="text-xs text-(--text-tertiary)">This month in</p><p className="font-display text-2xl font-semibold text-(--positive) mt-2">{money(summary?.monthly_income, account.currency)}</p><p className="text-xs text-(--text-secondary) mt-1">Projected {money(summary?.projected_income, account.currency)}</p></div>
      <div className="premium-card p-5"><p className="text-xs text-(--text-tertiary)">This month out</p><p className="font-display text-2xl font-semibold mt-2">{money(summary?.monthly_expenses, account.currency)}</p><p className="text-xs text-(--text-secondary) mt-1">Projected {money(summary?.projected_expenses, account.currency)}</p></div>
      <div className="premium-card p-5"><p className="text-xs text-(--text-tertiary)">{account.type === "credit_card" ? "Available credit" : "Opening balance"}</p><p className="font-display text-2xl font-semibold mt-2">{money(account.type === "credit_card" ? account.available_credit : summary?.opening_balance, account.currency)}</p>{account.credit_limit != null && <p className="text-xs text-(--text-secondary) mt-1">Limit {money(account.credit_limit, account.currency)}</p>}</div>
    </section>

    <section className="grid lg:grid-cols-[1.25fr_.75fr] gap-5">
      <div className="premium-card p-5 sm:p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">Balance history</p><h2 className="font-display text-xl font-semibold mt-1">How this balance moved</h2></div><WalletCards className="size-5 text-accent" /></div>{history.length ? <><div className="mt-5 flex items-end gap-1 h-36">{history.slice(-40).map((point) => { const range = Math.max(1, high - low); const height = 15 + ((Number(point.balance) - low) / range) * 85; return <div key={point.date} title={`${point.date}: ${money(point.balance, account.currency)}`} className="flex-1 rounded-t bg-accent/65 min-w-[3px]" style={{ height: `${height}%` }} />; })}</div><div className="flex justify-between text-xs text-(--text-tertiary) mt-2"><span>{history.at(-40)?.date}</span><span>{history.at(-1)?.date}</span></div></> : <p className="py-12 text-center text-sm text-(--text-tertiary)">No balance history yet.</p>}</div>
      <form onSubmit={save} className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">Account settings</h2><label className="block text-xs mt-4">Display name<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label>{account.type === "credit_card" && <div className="grid grid-cols-2 gap-3 mt-3"><label className="text-xs">Credit limit<input type="number" step="0.01" value={creditLimit} onChange={(event) => setCreditLimit(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Minimum payment<input type="number" step="0.01" value={minimumPayment} onChange={(event) => setMinimumPayment(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Statement closes day<input type="number" min="1" max="31" value={statementCloseDay} onChange={(event) => setStatementCloseDay(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Payment due day<input type="number" min="1" max="31" value={paymentDueDay} onChange={(event) => setPaymentDueDay(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label></div>}<button disabled={busy} className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50"><Save className="size-4" />Save settings</button><button type="button" disabled={busy} onClick={() => void toggleClosed()} className="mt-2 ml-2 min-h-10 rounded-xl border border-(--border) px-4 text-sm">{account.is_closed ? "Reopen account" : "Close account"}</button></form>
    </section>

    {account.type === "credit_card" && <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><CreditCard className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Credit-card bills</h2></div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">{bills.map((bill) => <Link key={bill.id} href={`/transactions?account=${id}&bill=${bill.id}`} className="rounded-xl border border-(--border) p-4 hover:border-accent"><p className="text-xs text-(--text-tertiary)">Due {new Date(`${bill.due_date}T00:00:00`).toLocaleDateString()}</p><p className="font-semibold text-lg mt-1">{money(bill.total_amount, bill.currency)}</p>{bill.minimum_payment != null && <p className="text-xs text-(--text-secondary) mt-1">Minimum {money(bill.minimum_payment, bill.currency)}</p>}</Link>)}{!bills.length && <p className="text-sm text-(--text-tertiary) sm:col-span-2">No provider-synced credit-card bills yet. FinCopilot can still use your statement close and due-day settings for account planning.</p>}</div>{(account.next_close_date || account.next_due_date) && <div className="mt-4 flex flex-wrap gap-4 text-xs text-(--text-secondary)"><span className="inline-flex items-center gap-1"><CalendarDays className="size-3" />Next close {account.next_close_date || "—"}</span><span>Next due {account.next_due_date || "—"}</span></div>}</section>}

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="font-display text-xl font-semibold">Recent activity</h2><Link href={`/transactions?account=${encodeURIComponent(id)}`} className="text-sm text-accent">Open full activity journal</Link></div><div className="mt-3 divide-y divide-(--border)">{transactions.map((tx) => <Link key={tx.id} href={`/transactions/${tx.id}`} className="py-3 flex items-center justify-between gap-4"><div className="min-w-0"><p className="font-medium text-sm truncate">{tx.description}</p><p className="text-xs text-(--text-secondary) mt-1">{tx.date} · {tx.status}</p></div><p className="text-sm font-semibold tabular-nums">{money(tx.amount, tx.currency || account.currency)}</p></Link>)}{!transactions.length && <p className="py-6 text-center text-sm text-(--text-tertiary)">No transactions in this account yet.</p>}</div></section>
  </div>;
}
