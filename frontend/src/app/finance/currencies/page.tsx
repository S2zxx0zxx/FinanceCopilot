"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRightLeft, CheckCircle2, RefreshCw, Search, ServerCog } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type Currency = { code: string; symbol: string; name: string; flag: string };
type FxStatus = { last_sync_date: string | null; total_rates: number; fx_sync_mode: string };
type FxRefresh = { synced: boolean; rates_count: number; date: string };

export default function CurrencyWorkspacePage() {
  const currencies = useResource(useCallback(async () => {
    const rows = await engineApi.get<Currency[]>("/currencies");
    return Array.isArray(rows) ? rows : [];
  }, []));
  const fxStatus = useResource(useCallback(() => engineApi.get<FxStatus>("/fx-rates/status"), []));
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return currencies.data ?? [];
    return (currencies.data ?? []).filter((item) => `${item.code} ${item.name} ${item.symbol}`.toLowerCase().includes(needle));
  }, [currencies.data, query]);

  const refreshRates = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const result = await engineApi.post<FxRefresh>("/fx-rates/refresh", {});
      setMessage(`FX sync complete: ${result.rates_count.toLocaleString()} rates stored for ${result.date}.`);
      fxStatus.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "FX rates could not be refreshed.");
    } finally {
      setBusy(false);
    }
  };

  const loading = currencies.loading || fxStatus.loading;
  const loadError = currencies.error || fxStatus.error;

  return (
    <div className="max-w-7xl flex flex-col gap-6 pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent">
            <ArrowLeft className="size-3.5" />Finance operations
          </Link>
          <p className="text-xs uppercase tracking-[.18em] text-accent mt-5">Multi-currency engine</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Currencies & FX rates</h1>
          <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">
            Inspect every currency enabled on this FinCopilot instance and monitor the exchange-rate store used to normalize balances, assets and reports.
          </p>
        </div>
        <button onClick={refreshRates} disabled={busy} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2 disabled:opacity-50">
          <RefreshCw className={`size-4 ${busy ? "animate-spin" : ""}`} />{busy ? "Syncing…" : "Refresh FX rates"}
        </button>
      </header>

      <ResourceState loading={loading} error={loadError} retry={() => { currencies.reload(); fxStatus.reload(); }} />
      {message && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-500">{message}</p>}
      {error && <p className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">{error}</p>}

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="premium-card p-5">
          <ArrowRightLeft className="size-5 text-accent" />
          <p className="font-display text-3xl font-semibold mt-3">{currencies.data?.length ?? 0}</p>
          <p className="text-xs text-(--text-secondary) mt-1">Supported currencies</p>
        </div>
        <div className="premium-card p-5">
          <CheckCircle2 className="size-5 text-accent" />
          <p className="font-display text-3xl font-semibold mt-3">{fxStatus.data?.total_rates?.toLocaleString() ?? "—"}</p>
          <p className="text-xs text-(--text-secondary) mt-1">Stored FX rates</p>
        </div>
        <div className="premium-card p-5">
          <RefreshCw className="size-5 text-accent" />
          <p className="font-display text-lg font-semibold mt-3">{fxStatus.data?.last_sync_date ?? "Never"}</p>
          <p className="text-xs text-(--text-secondary) mt-1">Last successful sync</p>
        </div>
        <div className="premium-card p-5">
          <ServerCog className="size-5 text-accent" />
          <p className="font-display text-lg font-semibold mt-3 capitalize">{fxStatus.data?.fx_sync_mode?.replaceAll("_", " ") ?? "—"}</p>
          <p className="text-xs text-(--text-secondary) mt-1">Sync mode</p>
        </div>
      </section>

      <section className="premium-card p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-semibold text-xl">Supported currency catalogue</h2>
            <p className="text-xs text-(--text-secondary) mt-1">The exact currencies the backend will accept for accounts, transactions, assets and invoices.</p>
          </div>
          <label className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-3.5 size-4 text-(--text-tertiary)" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search INR, Euro, ¥…" className="w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) pl-10 pr-3" />
          </label>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-5">
          {filtered.map((item) => (
            <article key={item.code} className="rounded-xl border border-(--border) bg-(--surface) p-4 flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-(--surface-subtle) text-xl shrink-0">{item.flag || item.symbol}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2"><p className="font-semibold">{item.code}</p><span className="text-sm text-(--text-tertiary)">{item.symbol}</span></div>
                <p className="text-xs text-(--text-secondary) truncate mt-1">{item.name}</p>
              </div>
            </article>
          ))}
        </div>
        {!loading && filtered.length === 0 && <p className="text-sm text-(--text-secondary) py-10 text-center">No supported currency matches this search.</p>}
      </section>

      <section className="premium-card p-5 sm:p-6">
        <h2 className="font-display font-semibold text-xl">How conversion works</h2>
        <div className="grid md:grid-cols-3 gap-3 mt-4 text-sm">
          <div className="rounded-xl bg-(--surface-subtle) p-4"><p className="font-medium">Native amounts stay native</p><p className="text-xs text-(--text-secondary) mt-2">FinCopilot keeps the original transaction or asset currency instead of rewriting historical values.</p></div>
          <div className="rounded-xl bg-(--surface-subtle) p-4"><p className="font-medium">Reports normalize values</p><p className="text-xs text-(--text-secondary) mt-2">Stored FX rates let the finance engine present one coherent net-worth and reporting currency.</p></div>
          <div className="rounded-xl bg-(--surface-subtle) p-4"><p className="font-medium">Rates are refreshable</p><p className="text-xs text-(--text-secondary) mt-2">Use the sync action above whenever you need the backend to fetch the latest configured rate set.</p></div>
        </div>
      </section>
    </div>
  );
}
