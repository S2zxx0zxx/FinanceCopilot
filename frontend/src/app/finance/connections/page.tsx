"use client";

import * as React from "react";
import Script from "next/script";
import Link from "next/link";
import { ArrowLeft, Cable, CheckCircle2, ExternalLink, Loader2, RefreshCw, Settings2, Trash2 } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

declare global {
  interface Window {
    PluggyConnect?: new (options: Record<string, unknown>) => { init: () => Promise<void> | void };
  }
}

type Provider = { name: string; display_name: string; description: string; flow_type: "widget" | "oauth" | "token"; requires_institution_select: boolean; supports_asset_sync: boolean; configured: boolean };
type Institution = { name: string; display_name: string; country: string; logo?: string | null; psu_types?: string[]; max_consent_days?: number | null };
type Connection = { id: string; provider: string; institution_name: string; display_name?: string | null; logo_url?: string | null; settings?: Record<string, any> | null; status: string; last_sync_at?: string | null; created_at: string; institutions?: Array<{ name: string; logo_url?: string | null }> };

const array = (value: any, key?: string) => Array.isArray(value) ? value : key && Array.isArray(value?.[key]) ? value[key] : [];

export default function ConnectionsPage() {
  const [providers, setProviders] = React.useState<Provider[]>([]);
  const [connections, setConnections] = React.useState<Connection[]>([]);
  const [selectedProvider, setSelectedProvider] = React.useState<string>("");
  const [simpleFinToken, setSimpleFinToken] = React.useState("");
  const [syncAssets, setSyncAssets] = React.useState(true);
  const [country, setCountry] = React.useState("");
  const [countries, setCountries] = React.useState<string[]>([]);
  const [institutions, setInstitutions] = React.useState<Institution[]>([]);
  const [institutionName, setInstitutionName] = React.useState("");
  const [psuType, setPsuType] = React.useState("personal");
  const [busy, setBusy] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [pluggyReady, setPluggyReady] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      const [providerResult, connectionResult] = await Promise.all([
        engineApi.get<any>("/api/connections/providers"),
        engineApi.get<any>("/api/connections"),
      ]);
      const providerRows = array(providerResult, "providers") as Provider[];
      setProviders(providerRows);
      setConnections(array(connectionResult) as Connection[]);
      setSelectedProvider((current) => current || providerRows.find((provider) => provider.configured)?.name || providerRows[0]?.name || "");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load bank connections."); }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  const provider = providers.find((item) => item.name === selectedProvider);

  React.useEffect(() => {
    if (provider?.flow_type !== "oauth") { setCountries([]); setInstitutions([]); setCountry(""); setInstitutionName(""); return; }
    let active = true;
    engineApi.get<any>(`/api/connections/${provider.name}/institutions`).then((result) => {
      if (!active) return;
      const rows = array(result, "institutions") as Institution[];
      const countryRows = Array.isArray(result?.countries) ? result.countries : Array.from(new Set(rows.map((item) => item.country).filter(Boolean)));
      setCountries(countryRows);
      const firstCountry = countryRows[0] || "";
      setCountry(firstCountry);
      setInstitutions(rows.filter((item) => !firstCountry || item.country === firstCountry));
    }).catch((err) => active && setError(err instanceof Error ? err.message : "Could not load supported banks."));
    return () => { active = false; };
  }, [provider?.name, provider?.flow_type]);

  const changeCountry = async (nextCountry: string) => {
    setCountry(nextCountry); setInstitutionName(""); setError(null);
    if (!provider) return;
    try {
      const result = await engineApi.get<any>(`/api/connections/${provider.name}/institutions?country=${encodeURIComponent(nextCountry)}`);
      setInstitutions(array(result, "institutions") as Institution[]);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not load banks for this country."); }
  };

  const connectPluggy = async (reconnect?: Connection) => {
    if (!pluggyReady || !window.PluggyConnect) { setError("The secure bank connector is still loading. Please try again."); return; }
    setBusy(reconnect?.id || "pluggy"); setError(null); setMessage(null);
    try {
      const tokenResult = reconnect
        ? await engineApi.post<any>(`/api/connections/${reconnect.id}/reconnect-token`)
        : await engineApi.post<any>("/api/connections/connect-token", { provider: "pluggy" });
      const connect = new window.PluggyConnect({
        connectToken: tokenResult.access_token,
        includeSandbox: false,
        onSuccess: async (data: any) => {
          try {
            if (reconnect) await engineApi.post(`/api/connections/${reconnect.id}/sync`);
            else await engineApi.post("/api/connections/oauth/callback", { code: data?.item?.id, provider: "pluggy", sync_assets: syncAssets });
            setMessage(reconnect ? "Bank connection refreshed." : "Bank connected successfully.");
            await load();
          } catch (err) { setError(err instanceof Error ? err.message : "The bank connected, but FinCopilot could not finish setup."); }
          finally { setBusy(null); }
        },
        onError: (widgetError: any) => { setError(widgetError?.message || "The bank connector reported an error."); setBusy(null); },
        onClose: () => setBusy(null),
      });
      await connect.init();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not start Pluggy."); setBusy(null); }
  };

  const connectOAuth = async () => {
    if (!provider || !institutionName || !country) return;
    setBusy(provider.name); setError(null);
    try {
      const selected = institutions.find((item) => item.name === institutionName);
      const result = await engineApi.post<any>("/api/connections/oauth/url", {
        provider: provider.name,
        flow_params: {
          country,
          institution_name: institutionName,
          psu_type: psuType,
          valid_until_days: selected?.max_consent_days || 90,
        },
      });
      sessionStorage.setItem("fincopilot.bank-provider", provider.name);
      window.location.assign(result.url);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not start bank authorisation."); setBusy(null); }
  };

  const connectSimpleFin = async () => {
    if (!simpleFinToken.trim()) return;
    setBusy("simplefin"); setError(null); setMessage(null);
    try {
      await engineApi.post("/api/connections/oauth/callback", { code: simpleFinToken.trim(), provider: "simplefin", sync_assets: syncAssets });
      setSimpleFinToken(""); setMessage("SimpleFIN connection added successfully."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "SimpleFIN setup failed."); }
    finally { setBusy(null); }
  };

  const sync = async (connection: Connection) => {
    setBusy(connection.id); setError(null); setMessage(null);
    try { const result = await engineApi.post<any>(`/api/connections/${connection.id}/sync`); setMessage(`Synced ${connection.display_name || connection.institution_name}.${result?.merged_count ? ` ${result.merged_count} record(s) merged.` : ""}`); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Sync failed."); }
    finally { setBusy(null); }
  };

  const reauthorize = async (connection: Connection) => {
    if (connection.provider === "pluggy") { await connectPluggy(connection); return; }
    setBusy(connection.id); setError(null);
    try {
      const result = await engineApi.post<any>(`/api/connections/${connection.id}/oauth/reauth-url`);
      sessionStorage.setItem("fincopilot.bank-provider", connection.provider);
      window.location.assign(result.url);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not start reconnection."); setBusy(null); }
  };

  const remove = async (connection: Connection) => {
    if (!window.confirm(`Disconnect ${connection.display_name || connection.institution_name}? Imported records are retained unless the server says otherwise.`)) return;
    setBusy(connection.id); setError(null);
    try { await engineApi.delete(`/api/connections/${connection.id}`); setMessage("Connection removed."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Connection could not be removed."); }
    finally { setBusy(null); }
  };

  const updateSettings = async (connection: Connection, patch: Record<string, unknown>) => {
    setBusy(connection.id); setError(null);
    try { await engineApi.patch(`/api/connections/${connection.id}/settings`, patch); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Connection settings could not be saved."); }
    finally { setBusy(null); }
  };

  return (
    <div className="max-w-6xl flex flex-col gap-6 pb-12">
      <Script src="https://cdn.pluggy.ai/pluggy-connect/latest/pluggy-connect.js" strategy="afterInteractive" onLoad={() => setPluggyReady(true)} />
      <header className="flex gap-3 items-start"><Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Back"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Connected money</p><h1 className="font-display text-3xl font-bold mt-1">Bank sync</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Connect supported institutions securely, control what is synced, refresh data and repair expired bank authorisations.</p></div></header>
      {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}
      {message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive) flex gap-2"><CheckCircle2 className="size-4" />{message}</div>}

      <section className="premium-card p-5 sm:p-6">
        <h2 className="font-display text-xl font-semibold">Add a bank connection</h2>
        <p className="text-sm text-(--text-secondary) mt-1">Only providers configured by your FinCopilot deployment can be started.</p>
        <div className="grid sm:grid-cols-3 gap-3 mt-5">{providers.map((item) => <button key={item.name} onClick={() => setSelectedProvider(item.name)} className={`text-left rounded-2xl border p-4 transition ${selectedProvider === item.name ? "border-accent bg-(--surface-subtle)" : "border-(--border)"}`}><div className="flex items-center justify-between gap-2"><p className="font-semibold">{item.display_name}</p><span className={`text-[10px] uppercase tracking-wider ${item.configured ? "text-(--positive)" : "text-(--text-tertiary)"}`}>{item.configured ? "Ready" : "Not configured"}</span></div><p className="text-xs text-(--text-secondary) mt-2">{item.description}</p></button>)}</div>

        {provider && <div className="mt-5 border-t border-(--border) pt-5">
          {!provider.configured ? <p className="text-sm text-(--warning)">This provider needs server credentials before users can connect it. Check your FinCopilot deployment settings.</p> : provider.flow_type === "widget" ? <div><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={syncAssets} onChange={(event) => setSyncAssets(event.target.checked)} className="size-5 accent-(--accent)" />Also sync supported investments and holdings</label><button disabled={busy !== null || !pluggyReady} onClick={() => void connectPluggy()} className="mt-4 min-h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground disabled:opacity-50">{busy === "pluggy" ? "Opening…" : pluggyReady ? `Connect with ${provider.display_name}` : "Loading secure connector…"}</button></div> : provider.flow_type === "token" ? <div className="max-w-2xl"><label className="text-sm font-medium">SimpleFIN setup token<textarea value={simpleFinToken} onChange={(event) => setSimpleFinToken(event.target.value)} rows={3} placeholder="Paste the single-use setup token from SimpleFIN Bridge" className="mt-2 w-full rounded-xl border border-(--border) bg-(--surface) p-3 font-mono text-xs" /></label><label className="mt-3 flex items-center gap-3 text-sm"><input type="checkbox" checked={syncAssets} onChange={(event) => setSyncAssets(event.target.checked)} className="size-5 accent-(--accent)" />Sync supported holdings</label><button disabled={busy !== null || !simpleFinToken.trim()} onClick={() => void connectSimpleFin()} className="mt-4 min-h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground disabled:opacity-50">Connect SimpleFIN</button></div> : <div className="grid sm:grid-cols-3 gap-3 max-w-4xl"><label className="text-sm">Country<select value={country} onChange={(event) => void changeCountry(event.target.value)} className="mt-2 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="">Choose country</option>{countries.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className="text-sm sm:col-span-2">Bank<select value={institutionName} onChange={(event) => setInstitutionName(event.target.value)} className="mt-2 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="">Choose institution</option>{institutions.map((item) => <option key={`${item.country}-${item.name}`} value={item.name}>{item.display_name}</option>)}</select></label><label className="text-sm">Customer type<select value={psuType} onChange={(event) => setPsuType(event.target.value)} className="mt-2 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="personal">Personal</option><option value="business">Business</option></select></label><div className="sm:col-span-2 flex items-end"><button disabled={busy !== null || !country || !institutionName} onClick={() => void connectOAuth()} className="min-h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground disabled:opacity-50">Authorise with bank <ExternalLink className="inline size-4 ml-1" /></button></div></div>}
        </div>}
      </section>

      <section className="premium-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">Connected institutions</p><h2 className="font-display text-xl font-semibold mt-1">Your bank links</h2></div><button onClick={() => void load()} className="min-h-10 rounded-xl border border-(--border) px-3 text-sm">Refresh</button></div>
        {!connections.length ? <div className="py-12 text-center"><Cable className="size-9 mx-auto text-(--text-tertiary)" /><p className="text-sm text-(--text-secondary) mt-3">No open-banking connections yet.</p></div> : <div className="mt-4 space-y-3">{connections.map((connection) => <article key={connection.id} className="rounded-2xl border border-(--border) p-4 sm:p-5"><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"><div className="flex gap-3 min-w-0">{connection.logo_url ? <img src={connection.logo_url} alt="" className="size-11 rounded-xl object-contain bg-white p-1" /> : <div className="size-11 rounded-xl bg-(--surface-subtle) grid place-items-center"><Cable className="size-5" /></div>}<div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold truncate">{connection.display_name || connection.institution_name}</h3><span className={`text-[10px] uppercase tracking-wider ${connection.status === "active" ? "text-(--positive)" : "text-(--warning)"}`}>{connection.status}</span></div><p className="text-xs text-(--text-secondary) mt-1">{connection.provider.replaceAll("_", " ")}{connection.last_sync_at ? ` · synced ${new Date(connection.last_sync_at).toLocaleString()}` : " · not synced yet"}</p>{connection.institutions && connection.institutions.length > 1 && <p className="text-xs text-(--text-tertiary) mt-1">{connection.institutions.map((item) => item.name).join(" · ")}</p>}</div></div><div className="flex flex-wrap gap-2"><button disabled={busy !== null} onClick={() => void sync(connection)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm"><RefreshCw className={`size-4 ${busy === connection.id ? "animate-spin" : ""}`} />Sync</button>{connection.status !== "active" && <button disabled={busy !== null} onClick={() => void reauthorize(connection)} className="min-h-10 rounded-xl border border-(--border) px-3 text-sm">Reconnect</button>}<button disabled={busy !== null} onClick={() => void remove(connection)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm text-(--negative)"><Trash2 className="size-4" />Disconnect</button></div></div><div className="grid sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-(--border)"><label className="text-xs">Display name<input defaultValue={connection.display_name || ""} onBlur={(event) => { if (event.target.value !== (connection.display_name || "")) void updateSettings(connection, { display_name: event.target.value || null }); }} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2" /></label><label className="flex items-center gap-2 text-xs sm:mt-6"><input type="checkbox" checked={Boolean(connection.settings?.import_pending)} onChange={(event) => void updateSettings(connection, { import_pending: event.target.checked })} className="size-4 accent-(--accent)" />Include pending transactions</label><label className="flex items-center gap-2 text-xs sm:mt-6"><input type="checkbox" checked={Boolean(connection.settings?.sync_assets)} onChange={(event) => void updateSettings(connection, { sync_assets: event.target.checked })} className="size-4 accent-(--accent)" />Sync holdings</label></div></article>)}</div>}
      </section>
    </div>
  );
}
