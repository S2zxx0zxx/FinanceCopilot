"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Trash2, UserPlus, Users } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type AdminUser = { id: string; email: string; is_active: boolean; is_superuser: boolean; is_verified: boolean; preferences?: Record<string, any> | null };
const SETTINGS = [
  { key: "registration_enabled", label: "New registrations", options: [["true", "Allowed"], ["false", "Disabled"]] },
  { key: "credit_card_accounting_mode", label: "Credit-card accounting", options: [["cash", "Cash basis"], ["accrual", "Accrual basis"]] },
  { key: "use_provider_categories", label: "Provider categories", options: [["true", "Use when available"], ["false", "Use FinCopilot rules only"]] },
  { key: "number_format", label: "Number format", options: [["auto", "Automatic"], ["comma_dot", "1,234.56"], ["dot_comma", "1.234,56"], ["space_comma", "1 234,56"]] },
  { key: "date_format", label: "Date format", options: [["auto", "Automatic"], ["dmy", "DD/MM/YYYY"], ["mdy", "MM/DD/YYYY"], ["ymd", "YYYY-MM-DD"]] },
] as const;

export default function AdminCenterPage() {
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [total, setTotal] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [settings, setSettings] = React.useState<Record<string, string>>({});
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [superuser, setSuperuser] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [forbidden, setForbidden] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const load = React.useCallback(async (search = "") => {
    setError(null);
    try {
      const result = await engineApi.get<any>(`/api/admin/users?page=1&limit=100${search ? `&search=${encodeURIComponent(search)}` : ""}`);
      setUsers(Array.isArray(result?.items) ? result.items : []); setTotal(Number(result?.total || 0)); setForbidden(false);
      const pairs = await Promise.all(SETTINGS.map(async (item) => {
        try { const setting = await engineApi.get<any>(`/api/admin/settings/${item.key}`); return [item.key, String(setting.value)] as const; }
        catch { return [item.key, ""] as const; }
      }));
      setSettings(Object.fromEntries(pairs));
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403 || /403|forbidden/i.test(String(err?.message || ""))) setForbidden(true);
      else setError(err instanceof Error ? err.message : "Admin Center could not load.");
    }
  }, []);
  React.useEffect(() => { void load(); }, [load]);

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault(); if (!email || password.length < 8) return; setBusy(true); setError(null);
    try { await engineApi.post("/api/admin/users", { email, password, is_superuser: superuser }); setEmail(""); setPassword(""); setSuperuser(false); setMessage("User created."); await load(query); }
    catch (err) { setError(err instanceof Error ? err.message : "User could not be created."); }
    finally { setBusy(false); }
  };
  const patchUser = async (user: AdminUser, patch: Record<string, unknown>) => {
    setBusy(true); setError(null);
    try { const updated = await engineApi.patch<AdminUser>(`/api/admin/users/${user.id}`, patch); setUsers((current) => current.map((item) => item.id === updated.id ? updated : item)); setMessage("User updated."); }
    catch (err) { setError(err instanceof Error ? err.message : "User could not be updated."); }
    finally { setBusy(false); }
  };
  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.email}? This is an administrative account deletion.`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/admin/users/${user.id}`); setMessage("User deleted."); await load(query); }
    catch (err) { setError(err instanceof Error ? err.message : "User could not be deleted."); }
    finally { setBusy(false); }
  };
  const updateSetting = async (key: string, value: string) => {
    setBusy(true); setError(null);
    try { const updated = await engineApi.patch<any>(`/api/admin/settings/${key}`, { value }); setSettings((current) => ({ ...current, [key]: updated.value })); setMessage("Application setting saved."); }
    catch (err) { setError(err instanceof Error ? err.message : "Application setting could not be saved."); }
    finally { setBusy(false); }
  };

  if (forbidden) return <div className="max-w-3xl"><header className="flex gap-3 items-start"><Link href="/finance" className="grid size-10 place-items-center rounded-xl border border-(--border)"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">System administration</p><h1 className="font-display text-3xl font-bold mt-1">Admin center</h1></div></header><div className="premium-card p-8 mt-6 text-center"><ShieldAlert className="size-10 mx-auto text-(--warning)" /><h2 className="font-display text-xl font-semibold mt-4">Administrator access required</h2><p className="text-sm text-(--text-secondary) mt-2">This area is intentionally visible only to FinCopilot superusers. Your financial workspace remains available normally.</p></div></div>;

  return <div className="max-w-6xl flex flex-col gap-6 pb-12">
    <header className="flex gap-3 items-start"><Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Back"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">System administration</p><h1 className="font-display text-3xl font-bold mt-1">Admin center</h1><p className="text-sm text-(--text-secondary) mt-2">Manage users and safe, allow-listed FinCopilot application defaults. Secrets and infrastructure credentials are never exposed here.</p></div></header>
    {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}{message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive)">{message}</div>}

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Users className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Users</h2><span className="text-xs text-(--text-tertiary)">{total} total</span></div><div className="flex gap-2 mt-4"><input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void load(query); }} placeholder="Search email" className="flex-1 min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><button onClick={() => void load(query)} className="min-h-11 rounded-xl border border-(--border) px-4 text-sm">Search</button></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead className="text-left text-xs uppercase tracking-wider text-(--text-tertiary)"><tr><th className="p-3">User</th><th className="p-3">Verified</th><th className="p-3">Active</th><th className="p-3">Admin</th><th className="p-3 text-right">Action</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-(--border)"><td className="p-3 font-medium">{user.email}</td><td className="p-3">{user.is_verified ? "Yes" : "No"}</td><td className="p-3"><input type="checkbox" checked={user.is_active} onChange={(event) => void patchUser(user, { is_active: event.target.checked })} className="size-4 accent-(--accent)" /></td><td className="p-3"><input type="checkbox" checked={user.is_superuser} onChange={(event) => void patchUser(user, { is_superuser: event.target.checked })} className="size-4 accent-(--accent)" /></td><td className="p-3 text-right"><button disabled={busy} onClick={() => void deleteUser(user)} className="grid size-9 ml-auto place-items-center rounded-lg border border-(--border) text-(--negative)" aria-label={`Delete ${user.email}`}><Trash2 className="size-4" /></button></td></tr>)}</tbody></table></div>
      <form onSubmit={createUser} className="mt-5 pt-5 border-t border-(--border)"><div className="flex items-center gap-2"><UserPlus className="size-4 text-accent" /><h3 className="font-semibold text-sm">Create local user</h3></div><div className="grid sm:grid-cols-2 gap-3 mt-3"><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><input type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Temporary password (8+ characters)" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /></div><label className="flex items-center gap-2 text-sm mt-3"><input type="checkbox" checked={superuser} onChange={(event) => setSuperuser(event.target.checked)} className="size-4 accent-(--accent)" />Grant administrator access</label><button disabled={busy || !email || password.length < 8} className="mt-3 min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Create user</button></form>
    </section>

    <section className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">Application defaults</h2><p className="text-sm text-(--text-secondary) mt-2">These settings affect all users on this FinCopilot deployment.</p><div className="grid sm:grid-cols-2 gap-4 mt-5">{SETTINGS.map((setting) => <label key={setting.key} className="text-sm">{setting.label}<select disabled={busy} value={settings[setting.key] || ""} onChange={(event) => void updateSetting(setting.key, event.target.value)} className="mt-2 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="" disabled>Not set</option>{setting.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>)}</div></section>
  </div>;
}
