"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Receipt, Trash2, Users } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type Group = { id: string; name: string; kind: string; default_currency: string; icon: string; color: string; notes?: string | null; is_archived: boolean; is_owner: boolean; members?: Member[] };
type Member = { id: string; name: string; linked_user_id?: string | null; email?: string | null; is_self: boolean };
type Balance = { member_id: string; currency: string; amount: string | number; amount_in_default_currency: string | number };
type Settlement = { id: string; from_member_id: string; to_member_id: string; amount: string | number; currency: string; date: string; notes?: string | null };
type Tx = { id: string; description: string; amount: string | number; currency?: string; date: string; type: string };

export default function GroupsPage() {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [selectedId, setSelectedId] = React.useState("");
  const [members, setMembers] = React.useState<Member[]>([]);
  const [balances, setBalances] = React.useState<Balance[]>([]);
  const [settlements, setSettlements] = React.useState<Settlement[]>([]);
  const [transactions, setTransactions] = React.useState<Tx[]>([]);
  const [name, setName] = React.useState("");
  const [kind, setKind] = React.useState("social");
  const [currency, setCurrency] = React.useState("USD");
  const [memberName, setMemberName] = React.useState("");
  const [memberEmail, setMemberEmail] = React.useState("");
  const [fromMember, setFromMember] = React.useState("");
  const [toMember, setToMember] = React.useState("");
  const [settleAmount, setSettleAmount] = React.useState("");
  const [settleDate, setSettleDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const loadGroups = React.useCallback(async () => {
    setError(null);
    try { const rows = await engineApi.get<Group[]>("/api/groups"); setGroups(Array.isArray(rows) ? rows : []); setSelectedId((current) => current && rows.some((group) => group.id === current) ? current : rows[0]?.id || ""); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load shared expense groups."); }
  }, []);
  React.useEffect(() => { void loadGroups(); }, [loadGroups]);

  const loadDetail = React.useCallback(async (id: string) => {
    if (!id) { setMembers([]); setBalances([]); setSettlements([]); setTransactions([]); return; }
    try {
      const [memberRows, balanceRows, settlementRows, transactionRows] = await Promise.all([
        engineApi.get<Member[]>(`/api/groups/${id}/members`),
        engineApi.get<any>(`/api/groups/${id}/balances`),
        engineApi.get<Settlement[]>(`/api/groups/${id}/settlements`),
        engineApi.get<Tx[]>(`/api/groups/${id}/transactions?limit=50`),
      ]);
      setMembers(Array.isArray(memberRows) ? memberRows : []);
      setBalances(Array.isArray(balanceRows?.lines) ? balanceRows.lines : []);
      setSettlements(Array.isArray(settlementRows) ? settlementRows : []);
      setTransactions(Array.isArray(transactionRows) ? transactionRows : []);
      const self = memberRows.find((member) => member.is_self);
      const other = memberRows.find((member) => !member.is_self);
      setFromMember((current) => current || self?.id || ""); setToMember((current) => current || other?.id || "");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load group details."); }
  }, []);
  React.useEffect(() => { void loadDetail(selectedId); }, [selectedId, loadDetail]);
  const selected = groups.find((group) => group.id === selectedId);
  const memberLabel = (id: string) => members.find((member) => member.id === id)?.name || "Member";

  const createGroup = async (event: React.FormEvent) => {
    event.preventDefault(); if (!name.trim()) return; setBusy(true); setError(null);
    try { const created = await engineApi.post<Group>("/api/groups", { name: name.trim(), kind, default_currency: currency.toUpperCase(), icon: "users", color: "#6B7280" }); setName(""); setSelectedId(created.id); setMessage("Shared expense group created."); await loadGroups(); }
    catch (err) { setError(err instanceof Error ? err.message : "Group could not be created."); }
    finally { setBusy(false); }
  };
  const addMember = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selected || !memberName.trim()) return; setBusy(true); setError(null);
    try { await engineApi.post(`/api/groups/${selected.id}/members`, { name: memberName.trim(), email: memberEmail.trim() || null, is_self: false }); setMemberName(""); setMemberEmail(""); setMessage("Member added."); await loadDetail(selected.id); }
    catch (err) { setError(err instanceof Error ? err.message : "Member could not be added."); }
    finally { setBusy(false); }
  };
  const removeMember = async (member: Member) => {
    if (!selected || !window.confirm(`Remove ${member.name} from this group?`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/groups/${selected.id}/members/${member.id}`); setMessage("Member removed."); await loadDetail(selected.id); }
    catch (err) { setError(err instanceof Error ? err.message : "Member could not be removed."); }
    finally { setBusy(false); }
  };
  const createSettlement = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selected || !fromMember || !toMember || Number(settleAmount) <= 0 || fromMember === toMember) return; setBusy(true); setError(null);
    try { await engineApi.post(`/api/groups/${selected.id}/settlements`, { from_member_id: fromMember, to_member_id: toMember, amount: settleAmount, currency: selected.default_currency, date: settleDate, notes: "Settlement recorded in FinCopilot" }); setSettleAmount(""); setMessage("Settlement recorded."); await loadDetail(selected.id); }
    catch (err) { setError(err instanceof Error ? err.message : "Settlement could not be recorded."); }
    finally { setBusy(false); }
  };
  const deleteSettlement = async (settlement: Settlement) => {
    if (!selected || !window.confirm("Delete this settlement record?")) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/groups/${selected.id}/settlements/${settlement.id}`); await loadDetail(selected.id); setMessage("Settlement removed."); }
    catch (err) { setError(err instanceof Error ? err.message : "Settlement could not be removed."); }
    finally { setBusy(false); }
  };
  const deleteGroup = async () => {
    if (!selected || !window.confirm(`Delete “${selected.name}”? Groups with active financial links may need to be archived instead.`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/groups/${selected.id}`); setSelectedId(""); setMessage("Group deleted."); await loadGroups(); }
    catch (err) { setError(err instanceof Error ? err.message : "Group could not be deleted."); }
    finally { setBusy(false); }
  };

  return <div className="max-w-7xl flex flex-col gap-6 pb-12">
    <header className="flex gap-3 items-start"><Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Shared money</p><h1 className="font-display text-3xl font-bold mt-1">Shared expenses</h1><p className="text-sm text-(--text-secondary) mt-2">Create groups, add people, see who owes whom and record settlements without mixing shared balances into personal ownership.</p></div></header>
    {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}{message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive)">{message}</div>}
    <div className="grid xl:grid-cols-[300px_1fr] gap-5">
      <aside className="premium-card p-4 h-fit"><div className="flex items-center gap-2"><Users className="size-5 text-accent" /><h2 className="font-semibold">Groups</h2></div><div className="mt-3 space-y-2">{groups.map((group) => <button key={group.id} onClick={() => setSelectedId(group.id)} className={`w-full text-left rounded-xl border p-3 ${selectedId === group.id ? "border-accent bg-(--surface-subtle)" : "border-(--border)"}`}><p className="font-medium truncate">{group.name}</p><p className="text-xs text-(--text-secondary) mt-1 capitalize">{group.kind.replaceAll("_", " ")} · {group.default_currency}</p></button>)}</div><form onSubmit={createGroup} className="mt-4 pt-4 border-t border-(--border)"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="New group name" className="w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /><div className="grid grid-cols-2 gap-2 mt-2"><select value={kind} onChange={(event) => setKind(event.target.value)} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="social">Social</option><option value="project">Project</option><option value="client">Client</option><option value="cost_center">Cost center</option><option value="other">Other</option></select><input value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase().slice(0,3))} maxLength={3} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2 uppercase" /></div><button disabled={busy || !name.trim() || currency.length !== 3} className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50"><Plus className="size-4" />Create</button></form></aside>
      <main className="space-y-5">{selected ? <>
        <section className="premium-card p-5 sm:p-6"><div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">Group</p><h2 className="font-display text-2xl font-semibold mt-1">{selected.name}</h2><p className="text-xs text-(--text-secondary) mt-1">{selected.default_currency} · {selected.is_owner ? "You manage this group" : "Shared with you"}</p></div>{selected.is_owner && <button disabled={busy} onClick={() => void deleteGroup()} className="grid size-10 place-items-center rounded-xl border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button>}</div><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">{balances.map((balance) => <div key={`${balance.member_id}-${balance.currency}`} className="rounded-xl bg-(--surface-subtle) p-4"><p className="text-xs text-(--text-tertiary)">{memberLabel(balance.member_id)}</p><p className={`text-xl font-semibold mt-1 ${Number(balance.amount_in_default_currency) > 0 ? "text-(--warning)" : Number(balance.amount_in_default_currency) < 0 ? "text-(--positive)" : ""}`}>{Number(balance.amount_in_default_currency).toLocaleString(undefined,{maximumFractionDigits:2})} {selected.default_currency}</p><p className="text-[11px] text-(--text-secondary) mt-1">{Number(balance.amount) > 0 ? "owes group owner" : Number(balance.amount) < 0 ? "is owed by group owner" : "settled"}</p></div>)}</div></section>
        <section className="grid lg:grid-cols-2 gap-5"><div className="premium-card p-5"><h3 className="font-display text-lg font-semibold">Members</h3><div className="mt-3 divide-y divide-(--border)">{members.map((member) => <div key={member.id} className="py-3 flex items-center justify-between gap-3"><div><p className="font-medium text-sm">{member.name}{member.is_self ? " · you" : ""}</p><p className="text-xs text-(--text-secondary)">{member.email || (member.linked_user_id ? "Linked FinCopilot user" : "Unlinked member")}</p></div>{selected.is_owner && !member.is_self && <button disabled={busy} onClick={() => void removeMember(member)} className="grid size-9 place-items-center rounded-lg border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button>}</div>)}</div>{selected.is_owner && <form onSubmit={addMember} className="mt-4 pt-4 border-t border-(--border)"><input value={memberName} onChange={(event) => setMemberName(event.target.value)} placeholder="Member name" className="w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /><input type="email" value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} placeholder="Email (optional)" className="w-full mt-2 min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /><button disabled={busy || !memberName.trim()} className="mt-2 min-h-10 rounded-xl border border-(--border) px-3 text-sm">Add member</button></form>}</div>
        <div className="premium-card p-5"><h3 className="font-display text-lg font-semibold">Record settlement</h3><form onSubmit={createSettlement} className="mt-3 space-y-2"><div className="grid grid-cols-2 gap-2"><select value={fromMember} onChange={(event) => setFromMember(event.target.value)} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">From</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select><select value={toMember} onChange={(event) => setToMember(event.target.value)} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">To</option>{members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></div><div className="grid grid-cols-2 gap-2"><input type="number" min="0.01" step="0.01" value={settleAmount} onChange={(event) => setSettleAmount(event.target.value)} placeholder={`Amount (${selected.default_currency})`} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /><input type="date" value={settleDate} onChange={(event) => setSettleDate(event.target.value)} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></div><button disabled={busy || !fromMember || !toMember || fromMember === toMember || Number(settleAmount) <= 0} className="min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Record settlement</button></form></div></section>
        <section className="premium-card p-5 sm:p-6"><h3 className="font-display text-lg font-semibold">Settlement history</h3><div className="mt-3 divide-y divide-(--border)">{settlements.map((settlement) => <div key={settlement.id} className="py-3 flex items-center justify-between gap-3"><div><p className="font-medium text-sm">{memberLabel(settlement.from_member_id)} → {memberLabel(settlement.to_member_id)}</p><p className="text-xs text-(--text-secondary) mt-1">{Number(settlement.amount).toLocaleString(undefined,{maximumFractionDigits:2})} {settlement.currency} · {new Date(`${settlement.date}T00:00:00`).toLocaleDateString()}</p></div><button disabled={busy} onClick={() => void deleteSettlement(settlement)} className="grid size-9 place-items-center rounded-lg border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button></div>)}{!settlements.length && <p className="text-sm text-(--text-tertiary) py-4">No settlements recorded.</p>}</div></section>
        <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Receipt className="size-5 text-accent" /><h3 className="font-display text-lg font-semibold">Shared transactions</h3></div><div className="mt-3 divide-y divide-(--border)">{transactions.map((transaction) => <div key={transaction.id} className="py-3 flex justify-between gap-4"><div><p className="font-medium text-sm">{transaction.description}</p><p className="text-xs text-(--text-secondary)">{transaction.date} · {transaction.type}</p></div><p className="font-semibold text-sm tabular-nums">{Number(transaction.amount).toLocaleString(undefined,{maximumFractionDigits:2})} {transaction.currency || selected.default_currency}</p></div>)}{!transactions.length && <p className="text-sm text-(--text-tertiary) py-4">No group transactions yet. Add transaction splits from Activity journal to calculate balances.</p>}</div></section>
      </> : <div className="premium-card p-10 text-center text-(--text-secondary)">Create or select a group.</div>}</main>
    </div>
  </div>;
}
