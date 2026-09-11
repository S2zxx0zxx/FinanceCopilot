"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Archive, Check, Plus, RefreshCw, Trash2, Users } from "lucide-react";
import { engineApi, getActiveWorkspaceId, setActiveWorkspaceId } from "@/lib/engine-api";

type Workspace = { id: string; name: string; kind: string; default_currency: string; locale?: string | null; tax_jurisdiction?: string | null; icon?: string | null; color?: string | null; role?: string | null; enabled_modules?: string[] };
type Member = { id: string; user_id: string; email: string; display_name?: string | null; role: string; joined_at: string };

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = React.useState<Workspace[]>([]);
  const [selectedId, setSelectedId] = React.useState("");
  const [members, setMembers] = React.useState<Member[]>([]);
  const [stats, setStats] = React.useState<Record<string, any>>({});
  const [name, setName] = React.useState("");
  const [kind, setKind] = React.useState("personal");
  const [currency, setCurrency] = React.useState("USD");
  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState("editor");
  const [invitePassword, setInvitePassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const result = await engineApi.get<Workspace[]>("/api/workspaces");
      const rows = Array.isArray(result) ? result : [];
      setWorkspaces(rows);
      const active = getActiveWorkspaceId();
      setSelectedId((current) => current && rows.some((ws) => ws.id === current) ? current : active && rows.some((ws) => ws.id === active) ? active : rows[0]?.id || "");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load workspaces."); }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  React.useEffect(() => {
    if (!selectedId) { setMembers([]); setStats({}); return; }
    let active = true;
    Promise.all([
      engineApi.get<Member[]>(`/api/workspaces/${selectedId}/members`),
      engineApi.get<Record<string, any>>(`/api/workspaces/${selectedId}/stats`),
    ]).then(([memberRows, statRows]) => { if (active) { setMembers(Array.isArray(memberRows) ? memberRows : []); setStats(statRows || {}); } }).catch((err) => active && setError(err instanceof Error ? err.message : "Could not load workspace details."));
    return () => { active = false; };
  }, [selectedId]);

  const selected = workspaces.find((workspace) => workspace.id === selectedId);
  const canManage = selected?.role === "owner" || selected?.role === "manager";

  const createWorkspace = async (event: React.FormEvent) => {
    event.preventDefault(); if (!name.trim()) return;
    setBusy(true); setError(null); setMessage(null);
    try {
      const created = await engineApi.post<Workspace>("/api/workspaces", { name: name.trim(), kind, default_currency: currency.toUpperCase(), self_membership: true });
      setName(""); setSelectedId(created.id); setActiveWorkspaceId(created.id); setMessage("Workspace created and selected."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Workspace could not be created."); }
    finally { setBusy(false); }
  };

  const switchWorkspace = (id: string) => {
    setSelectedId(id); setActiveWorkspaceId(id); setMessage("Active workspace changed. New requests now use this workspace.");
  };

  const saveWorkspace = async (patch: Record<string, unknown>) => {
    if (!selected) return;
    setBusy(true); setError(null);
    try { await engineApi.patch(`/api/workspaces/${selected.id}`, patch); setMessage("Workspace settings saved."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Workspace settings could not be saved."); }
    finally { setBusy(false); }
  };

  const invite = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selected || !inviteEmail.trim()) return;
    setBusy(true); setError(null);
    try {
      const payload: Record<string, unknown> = { email: inviteEmail.trim(), role: inviteRole };
      if (invitePassword) payload.password = invitePassword;
      await engineApi.post(`/api/workspaces/${selected.id}/members`, payload);
      setInviteEmail(""); setInvitePassword(""); setMessage("Member added.");
      const rows = await engineApi.get<Member[]>(`/api/workspaces/${selected.id}/members`); setMembers(rows);
    } catch (err) { setError(err instanceof Error ? err.message : "Member could not be added."); }
    finally { setBusy(false); }
  };

  const changeRole = async (member: Member, role: string) => {
    if (!selected) return; setBusy(true); setError(null);
    try { const updated = await engineApi.patch<Member>(`/api/workspaces/${selected.id}/members/${member.user_id}`, { role }); setMembers((current) => current.map((item) => item.user_id === member.user_id ? updated : item)); setMessage("Member role updated."); }
    catch (err) { setError(err instanceof Error ? err.message : "Role could not be updated."); }
    finally { setBusy(false); }
  };

  const removeMember = async (member: Member) => {
    if (!selected || !window.confirm(`Remove ${member.display_name || member.email} from this workspace?`)) return;
    setBusy(true); setError(null);
    try { await engineApi.delete(`/api/workspaces/${selected.id}/members/${member.user_id}`); setMembers((current) => current.filter((item) => item.user_id !== member.user_id)); setMessage("Member removed."); }
    catch (err) { setError(err instanceof Error ? err.message : "Member could not be removed."); }
    finally { setBusy(false); }
  };

  const archiveWorkspace = async () => {
    if (!selected || !window.confirm(`Archive “${selected.name}”? Financial data remains stored but this workspace will leave the active list.`)) return;
    setBusy(true); setError(null);
    try { await engineApi.post(`/api/workspaces/${selected.id}/archive`); if (getActiveWorkspaceId() === selected.id) setActiveWorkspaceId(null); setSelectedId(""); setMessage("Workspace archived."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Workspace could not be archived."); }
    finally { setBusy(false); }
  };

  return <div className="max-w-6xl flex flex-col gap-6 pb-12">
    <header className="flex gap-3 items-start"><Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Back"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Collaborative money</p><h1 className="font-display text-3xl font-bold mt-1">Shared workspaces</h1><p className="text-sm text-(--text-secondary) mt-2">Separate personal or business finances, switch context, manage members and control workspace settings without mixing records.</p></div></header>
    {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}
    {message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive)">{message}</div>}

    <section className="grid lg:grid-cols-[320px_1fr] gap-5">
      <div className="premium-card p-4 h-fit"><div className="flex items-center justify-between"><h2 className="font-semibold">Your workspaces</h2><button onClick={() => void load()} aria-label="Refresh workspaces" className="grid size-9 place-items-center rounded-lg border border-(--border)"><RefreshCw className="size-4" /></button></div><div className="mt-3 space-y-2">{workspaces.map((workspace) => { const active = getActiveWorkspaceId() === workspace.id; return <button key={workspace.id} onClick={() => switchWorkspace(workspace.id)} className={`w-full text-left rounded-xl border p-3 ${selectedId === workspace.id ? "border-accent bg-(--surface-subtle)" : "border-(--border)"}`}><div className="flex items-center justify-between gap-2"><p className="font-medium truncate">{workspace.icon ? `${workspace.icon} ` : ""}{workspace.name}</p>{active && <Check className="size-4 text-(--positive)" />}</div><p className="text-xs text-(--text-secondary) mt-1 capitalize">{workspace.kind} · {workspace.default_currency} · {workspace.role || "member"}</p></button>; })}</div>
      <form onSubmit={createWorkspace} className="mt-5 pt-5 border-t border-(--border)"><h3 className="text-sm font-semibold">Create workspace</h3><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Workspace name" maxLength={100} className="mt-3 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><div className="grid grid-cols-2 gap-2 mt-2"><select value={kind} onChange={(event) => setKind(event.target.value)} className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-2"><option value="personal">Personal</option><option value="business">Business</option></select><input value={currency} onChange={(event) => setCurrency(event.target.value.toUpperCase().slice(0, 3))} maxLength={3} aria-label="Currency" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3 uppercase" /></div><button disabled={busy || !name.trim() || currency.length !== 3} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50"><Plus className="size-4" />Create</button></form></div>

      <div className="space-y-5">{selected ? <>
        <section className="premium-card p-5 sm:p-6"><div className="flex flex-wrap justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">Selected workspace</p><h2 className="font-display text-2xl font-semibold mt-1">{selected.name}</h2><p className="text-xs text-(--text-secondary) mt-1 capitalize">{selected.kind} · your role: {selected.role}</p></div>{canManage && <button disabled={busy} onClick={() => void archiveWorkspace()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm text-(--negative)"><Archive className="size-4" />Archive</button>}</div><div className="grid sm:grid-cols-3 gap-3 mt-5">{Object.entries(stats).slice(0, 6).map(([key, value]) => <div key={key} className="rounded-xl bg-(--surface-subtle) p-3"><p className="text-xs text-(--text-tertiary) capitalize">{key.replaceAll("_", " ")}</p><p className="text-xl font-semibold mt-1">{String(value)}</p></div>)}</div>{canManage && <div className="grid sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-(--border)"><label className="text-xs">Name<input defaultValue={selected.name} onBlur={(event) => { const value = event.target.value.trim(); if (value && value !== selected.name) void saveWorkspace({ name: value }); }} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2" /></label><label className="text-xs">Default currency<input defaultValue={selected.default_currency} maxLength={3} onBlur={(event) => { const value = event.target.value.toUpperCase(); if (value.length === 3 && value !== selected.default_currency) void saveWorkspace({ default_currency: value }); }} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2 uppercase" /></label><label className="text-xs">Tax jurisdiction<input defaultValue={selected.tax_jurisdiction || ""} onBlur={(event) => { if (event.target.value !== (selected.tax_jurisdiction || "")) void saveWorkspace({ tax_jurisdiction: event.target.value || null }); }} placeholder="e.g. IN, BR, DE" className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2 uppercase" /></label></div>}</section>

        <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Users className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Members</h2></div><div className="mt-4 divide-y divide-(--border)">{members.map((member) => <div key={member.user_id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="font-medium text-sm">{member.display_name || member.email}</p>{member.display_name && <p className="text-xs text-(--text-secondary)">{member.email}</p>}</div><div className="flex items-center gap-2">{canManage ? <select disabled={busy} value={member.role} onChange={(event) => void changeRole(member, event.target.value)} className="min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2 text-sm"><option value="owner">Owner</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select> : <span className="text-xs capitalize text-(--text-secondary)">{member.role}</span>}{canManage && <button disabled={busy} onClick={() => void removeMember(member)} aria-label={`Remove ${member.email}`} className="grid size-10 place-items-center rounded-lg border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button>}</div></div>)}</div>{canManage && <form onSubmit={invite} className="mt-5 pt-5 border-t border-(--border)"><h3 className="font-semibold text-sm">Add member</h3><div className="grid sm:grid-cols-[1fr_140px] gap-2 mt-3"><input type="email" required value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="person@example.com" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><select value={inviteRole} onChange={(event) => setInviteRole(event.target.value)} className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-2"><option value="editor">Editor</option><option value="viewer">Viewer</option><option value="owner">Owner</option></select></div><input type="password" value={invitePassword} onChange={(event) => setInvitePassword(event.target.value)} placeholder="Optional temporary password for a brand-new local user" className="mt-2 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><p className="text-xs text-(--text-secondary) mt-2">Existing users only need their email. A password is used only when your deployment allows local accounts and the person does not exist yet.</p><button disabled={busy || !inviteEmail.trim()} className="mt-3 min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Add member</button></form>}</section>
        </> : <div className="premium-card p-10 text-center text-(--text-secondary)">Create or select a workspace to manage it.</div>}</div>
    </section>
  </div>;
}
