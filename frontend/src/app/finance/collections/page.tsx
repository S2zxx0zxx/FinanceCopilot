"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, FolderKanban, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useToast } from "@/hooks/use-toast";

type Collection = {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: number;
  account_ids: string[];
  account_count: number;
  wallet_ids: string[];
  wallet_count: number;
};

type Account = { id: string; name: string; display_name?: string | null; type?: string; currency?: string; institution_name?: string | null };
type Wallet = { id: string; name: string; source?: string; institution_name?: string | null; asset_count?: number };
type Draft = { name: string; icon: string; color: string; position: string; account_ids: string[]; wallet_ids: string[] };

const blank = (): Draft => ({ name: "", icon: "folder", color: "#6366F1", position: "0", account_ids: [], wallet_ids: [] });

export default function CollectionsPage() {
  const { toast } = useToast();
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [wallets, setWallets] = React.useState<Wallet[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Collection | null>(null);
  const [draft, setDraft] = React.useState<Draft>(blank);
  const [saving, setSaving] = React.useState(false);

  const reload = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [collectionRows, accountRows, walletRows] = await Promise.all([
        engineApi.get<Collection[]>("/collections"),
        engineApi.get<Account[]>("/accounts"),
        engineApi.get<Wallet[]>("/asset-groups"),
      ]);
      setCollections(Array.isArray(collectionRows) ? collectionRows : []);
      setAccounts(Array.isArray(accountRows) ? accountRows : []);
      setWallets(Array.isArray(walletRows) ? walletRows : []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load collections.");
    } finally { setLoading(false); }
  }, []);

  React.useEffect(() => { void reload(); }, [reload]);

  const openEditor = (collection: Collection | null) => {
    setEditing(collection);
    setDraft(collection ? {
      name: collection.name,
      icon: collection.icon,
      color: collection.color,
      position: String(collection.position ?? 0),
      account_ids: collection.account_ids ?? [],
      wallet_ids: collection.wallet_ids ?? [],
    } : blank());
    setOpen(true);
  };

  const toggle = (kind: "account_ids" | "wallet_ids", id: string) => {
    setDraft((current) => ({
      ...current,
      [kind]: current[kind].includes(id) ? current[kind].filter((value) => value !== id) : [...current[kind], id],
    }));
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: draft.name.trim(),
        icon: draft.icon.trim() || "folder",
        color: draft.color || "#6366F1",
        position: Number(draft.position) || 0,
        account_ids: draft.account_ids,
        wallet_ids: draft.wallet_ids,
      };
      if (editing) await engineApi.patch(`/collections/${editing.id}`, payload);
      else await engineApi.post("/collections", payload);
      setOpen(false);
      toast({ title: editing ? "Collection updated" : "Collection created" });
      await reload();
    } catch (cause) {
      toast({ title: "Could not save collection", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const remove = async (collection: Collection) => {
    if (!window.confirm(`Delete ${collection.name}? This removes the collection only, not its accounts or assets.`)) return;
    try {
      await engineApi.delete(`/collections/${collection.id}`);
      toast({ title: "Collection deleted" });
      await reload();
    } catch (cause) {
      toast({ title: "Could not delete collection", description: cause instanceof Error ? cause.message : "Please retry.", variant: "destructive" });
    }
  };

  const totalLinks = collections.reduce((sum, collection) => sum + collection.account_count + collection.wallet_count, 0);

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link href="/finance" className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-(--text-tertiary) hover:text-(--text-primary)"><ArrowLeft className="h-3.5 w-3.5" /> Finance tools</Link>
          <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-(--text-tertiary)">Flexible grouping</p>
          <h1 className="mt-1 font-display text-[28px] font-bold tracking-[-0.02em]">Collections</h1>
          <p className="mt-1 max-w-2xl text-sm text-(--text-secondary)">Build reusable groups that combine cash accounts and investment wallets without changing the underlying records.</p>
        </div>
        <button onClick={() => openEditor(null)} className="min-h-11 rounded-xl bg-accent px-4 text-xs font-semibold text-accent-foreground"><Plus className="mr-2 inline h-4 w-4" />New collection</button>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Collections" value={String(collections.length)} detail="Reusable financial views" />
        <Stat label="Linked records" value={String(totalLinks)} detail="Accounts + investment wallets" />
        <Stat label="Available sources" value={String(accounts.length + wallets.length)} detail={`${accounts.length} accounts · ${wallets.length} wallets`} />
      </div>

      <section className="premium-card overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-(--border) p-4"><div><h2 className="text-sm font-semibold">Your collections</h2><p className="mt-1 text-xs text-(--text-tertiary)">Membership is editable at any time and does not move or duplicate financial data.</p></div><button onClick={() => void reload()} disabled={loading} className="grid h-10 w-10 place-items-center rounded-xl border border-(--border)" aria-label="Refresh"><RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /></button></div>
        {loading ? <div className="p-10 text-center text-sm text-(--text-secondary)">Loading collections…</div> : error ? <div className="p-10 text-center"><p className="text-sm text-(--negative)">{error}</p><button onClick={() => void reload()} className="mt-3 rounded-lg border border-(--border) px-3 py-2 text-xs font-semibold">Retry</button></div> : collections.length === 0 ? <div className="p-10 text-center"><FolderKanban className="mx-auto h-8 w-8 text-(--text-tertiary)" /><h3 className="mt-3 font-semibold">No collections yet</h3><p className="mx-auto mt-2 max-w-md text-sm text-(--text-secondary)">Group personal, business, travel or family accounts and wallets into focused views.</p><button onClick={() => openEditor(null)} className="mt-4 rounded-xl bg-accent px-4 py-2.5 text-xs font-semibold text-accent-foreground">Create collection</button></div> : <div className="grid gap-3 p-4 sm:grid-cols-2">{collections.sort((a,b) => (a.position ?? 0) - (b.position ?? 0)).map((collection) => <article key={collection.id} className="rounded-2xl border border-(--border) bg-(--surface) p-4"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-start gap-3"><span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl text-lg" style={{ backgroundColor: `${collection.color}20`, color: collection.color }}>{collection.icon === "folder" ? "◫" : "◆"}</span><div className="min-w-0"><h3 className="truncate text-sm font-semibold">{collection.name}</h3><p className="mt-1 text-xs text-(--text-tertiary)">{collection.account_count} accounts · {collection.wallet_count} wallets</p></div></div><div className="flex gap-1"><button onClick={() => openEditor(collection)} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-(--surface-subtle)" aria-label={`Edit ${collection.name}`}><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => void remove(collection)} className="grid h-9 w-9 place-items-center rounded-lg text-(--negative) hover:bg-(--negative-light)" aria-label={`Delete ${collection.name}`}><Trash2 className="h-3.5 w-3.5" /></button></div></div><div className="mt-4 flex flex-wrap gap-1.5">{collection.account_ids.slice(0, 4).map((id) => <Chip key={id}>{accountName(accounts, id)}</Chip>)}{collection.wallet_ids.slice(0, 4).map((id) => <Chip key={id}>{walletName(wallets, id)}</Chip>)}{collection.account_count + collection.wallet_count > 8 && <Chip>+{collection.account_count + collection.wallet_count - 8} more</Chip>}{collection.account_count + collection.wallet_count === 0 && <span className="text-xs text-(--text-tertiary)">Empty collection</span>}</div></article>)}</div>}
      </section>

      {open && <div className="fixed inset-0 z-50 grid place-items-center bg-black/55 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget && !saving) setOpen(false); }}><form onSubmit={save} className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--border) bg-(--surface) p-5 shadow-2xl"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">Collection editor</p><h2 className="mt-1 text-xl font-bold">{editing ? "Edit collection" : "New collection"}</h2></div><button type="button" onClick={() => setOpen(false)} disabled={saving} className="grid h-10 w-10 place-items-center rounded-xl border border-(--border)"><X className="h-4 w-4" /></button></div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2"><Field label="Name" className="sm:col-span-2"><input required className="collection-field" value={draft.name} onChange={(e) => setDraft((value) => ({ ...value, name: e.target.value }))} placeholder="Business, Family, Travel…" /></Field><Field label="Icon"><input className="collection-field" value={draft.icon} onChange={(e) => setDraft((value) => ({ ...value, icon: e.target.value }))} /></Field><Field label="Colour"><input type="color" className="collection-field h-11 p-1" value={draft.color} onChange={(e) => setDraft((value) => ({ ...value, color: e.target.value }))} /></Field><Field label="Position"><input type="number" className="collection-field" value={draft.position} onChange={(e) => setDraft((value) => ({ ...value, position: e.target.value }))} /></Field></div>
        <Selector title="Cash & credit accounts" empty="No accounts available" items={accounts.map((account) => ({ id: account.id, title: account.display_name || account.name, subtitle: [account.institution_name, account.type, account.currency].filter(Boolean).join(" · ") }))} selected={draft.account_ids} onToggle={(id) => toggle("account_ids", id)} />
        <Selector title="Investment wallets" empty="No investment wallets available" items={wallets.map((wallet) => ({ id: wallet.id, title: wallet.name, subtitle: [wallet.institution_name, wallet.source, wallet.asset_count != null ? `${wallet.asset_count} assets` : ""].filter(Boolean).join(" · ") }))} selected={draft.wallet_ids} onToggle={(id) => toggle("wallet_ids", id)} />
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} disabled={saving} className="min-h-11 rounded-xl border border-(--border) px-4 text-xs font-semibold">Cancel</button><button type="submit" disabled={saving} className="min-h-11 rounded-xl bg-accent px-5 text-xs font-semibold text-accent-foreground disabled:opacity-50">{saving ? "Saving…" : editing ? "Save collection" : "Create collection"}</button></div>
      </form></div>}
      <style jsx global>{`.collection-field{width:100%;min-height:44px;border:1px solid var(--border);border-radius:12px;padding:0 12px;background:var(--surface);color:var(--text-primary);font-size:13px;outline:none}.collection-field:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}`}</style>
    </div>
  );
}

function accountName(accounts: Account[], id: string) { const account = accounts.find((item) => item.id === id); return account?.display_name || account?.name || "Account"; }
function walletName(wallets: Wallet[], id: string) { return wallets.find((item) => item.id === id)?.name || "Wallet"; }
function Chip({ children }: { children: React.ReactNode }) { return <span className="rounded-full border border-(--border) bg-(--surface-subtle) px-2 py-1 text-[10px] text-(--text-secondary)">{children}</span>; }
function Stat({ label, value, detail }: { label: string; value: string; detail: string }) { return <div className="premium-card p-4"><p className="text-[10px] font-mono uppercase tracking-wider text-(--text-tertiary)">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p><p className="mt-1 text-xs text-(--text-tertiary)">{detail}</p></div>; }
function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`flex flex-col gap-1.5 ${className}`}><span className="text-[11px] font-semibold text-(--text-secondary)">{label}</span>{children}</label>; }
function Selector({ title, empty, items, selected, onToggle }: { title: string; empty: string; items: { id: string; title: string; subtitle: string }[]; selected: string[]; onToggle: (id: string) => void }) { return <section className="mt-5"><div className="mb-2 flex items-center justify-between"><h3 className="text-xs font-semibold">{title}</h3><span className="text-[10px] text-(--text-tertiary)">{selected.length} selected</span></div><div className="max-h-52 overflow-y-auto rounded-xl border border-(--border)">{items.length === 0 ? <p className="p-4 text-xs text-(--text-tertiary)">{empty}</p> : items.map((item) => <label key={item.id} className="flex cursor-pointer items-center gap-3 border-b border-(--border) p-3 last:border-0 hover:bg-(--surface-subtle)"><input type="checkbox" checked={selected.includes(item.id)} onChange={() => onToggle(item.id)} /><span className="min-w-0"><strong className="block truncate text-xs">{item.title}</strong><span className="block truncate text-[10px] text-(--text-tertiary)">{item.subtitle}</span></span></label>)}</div></section>; }
