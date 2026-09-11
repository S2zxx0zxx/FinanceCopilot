"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  LineChart,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type Asset = {
  id: string;
  name: string;
  type: string;
  currency: string;
  valuation_method: string;
  units?: number | null;
  ticker?: string | null;
  current_value?: number | null;
  current_value_primary?: number | null;
  gain_loss?: number | null;
  gain_loss_primary?: number | null;
  last_price?: number | null;
  last_price_at?: string | null;
  average_price?: number | null;
  total_invested?: number | null;
  realized_gain?: number | null;
  transaction_count?: number;
  is_archived?: boolean;
};

type AssetTransaction = {
  id: string;
  asset_id: string;
  kind: "buy" | "sell" | string;
  quantity: number;
  price: number;
  fee: number;
  date: string;
  source: string;
  notes?: string | null;
  asset_name?: string | null;
  ticker?: string | null;
  currency?: string | null;
};

type TrendPoint = {
  date: string;
  value: number;
};

type MarketMatch = {
  symbol: string;
  name?: string | null;
  exchange?: string | null;
  quote_type?: string | null;
};

type MarketQuote = MarketMatch & {
  currency: string;
  price: number;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function normalizeTrend(value: unknown): TrendPoint[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const record = row as Record<string, unknown>;
    const date = record.date ?? record.day ?? record.month;
    const amount = record.value ?? record.total ?? record.amount ?? record.balance;
    if (typeof date !== "string") return [];
    const numberValue = Number(amount);
    if (!Number.isFinite(numberValue)) return [];
    return [{ date, value: numberValue }];
  });
}

function currency(amount: number | null | undefined, code = "INR") {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: code,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${code} ${amount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
  }
}

const today = () => new Date().toISOString().slice(0, 10);

export default function AssetsWorkspacePage() {
  const assetsLoader = useCallback(async () => asArray<Asset>(await engineApi.get("/assets")), []);
  const txLoader = useCallback(
    async () => asArray<AssetTransaction>(await engineApi.get("/assets/transactions?limit=500")),
    [],
  );
  const trendLoader = useCallback(async () => normalizeTrend(await engineApi.get("/assets/portfolio-trend")), []);

  const assets = useResource(assetsLoader);
  const transactions = useResource(txLoader);
  const trend = useResource(trendLoader);

  const [activeTab, setActiveTab] = useState<"holdings" | "transactions">("holdings");
  const [marketQuery, setMarketQuery] = useState("");
  const [matches, setMatches] = useState<MarketMatch[]>([]);
  const [quote, setQuote] = useState<MarketQuote | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [txKind, setTxKind] = useState<"buy" | "sell">("buy");
  const [txQuantity, setTxQuantity] = useState("");
  const [txPrice, setTxPrice] = useState("");
  const [txFee, setTxFee] = useState("0");
  const [txDate, setTxDate] = useState(today());
  const [txNotes, setTxNotes] = useState("");
  const [buyTicker, setBuyTicker] = useState("");
  const [buyName, setBuyName] = useState("");
  const [buyQuantity, setBuyQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [buyFee, setBuyFee] = useState("0");
  const [buyDate, setBuyDate] = useState(today());
  const [manualName, setManualName] = useState("");
  const [manualType, setManualType] = useState("other");
  const [manualCurrency, setManualCurrency] = useState("INR");
  const [manualValue, setManualValue] = useState("");
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const liveAssets = assets.data ?? [];
  const activeAssets = useMemo(() => liveAssets.filter((asset) => !asset.is_archived), [liveAssets]);
  const totals = useMemo(() => {
    let value = 0;
    let gain = 0;
    let invested = 0;
    for (const asset of activeAssets) {
      value += asset.current_value_primary ?? asset.current_value ?? 0;
      gain += asset.gain_loss_primary ?? asset.gain_loss ?? 0;
      invested += asset.total_invested ?? 0;
    }
    return { value, gain, invested };
  }, [activeAssets]);

  const reloadAll = () => {
    assets.reload();
    transactions.reload();
    trend.reload();
  };

  const mutate = async (key: string, action: () => Promise<unknown>) => {
    setBusy(key);
    setMutationError(null);
    try {
      await action();
      reloadAll();
      return true;
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to update assets.");
      return false;
    } finally {
      setBusy(null);
    }
  };

  const searchMarket = async (event: FormEvent) => {
    event.preventDefault();
    const query = marketQuery.trim();
    if (!query) return;
    setSearching(true);
    setMutationError(null);
    setQuote(null);
    try {
      setMatches(asArray<MarketMatch>(await engineApi.get(`/assets/market/search?q=${encodeURIComponent(query)}&limit=15`)));
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Market search failed.");
    } finally {
      setSearching(false);
    }
  };

  const chooseMarketMatch = async (match: MarketMatch) => {
    setMarketQuery(match.symbol);
    setBuyTicker(match.symbol);
    setBuyName(match.name ?? match.symbol);
    setMatches([]);
    setSearching(true);
    try {
      const result = (await engineApi.get(`/assets/market/quote?symbol=${encodeURIComponent(match.symbol)}`)) as MarketQuote;
      setQuote(result);
      setBuyPrice(String(result.price));
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Live quote unavailable.");
    } finally {
      setSearching(false);
    }
  };

  const createManualAsset = async (event: FormEvent) => {
    event.preventDefault();
    const value = Number(manualValue);
    const ok = await mutate("manual-create", () =>
      engineApi.post("/assets", {
        name: manualName.trim(),
        type: manualType,
        currency: manualCurrency.trim().toUpperCase(),
        valuation_method: "manual",
        current_value: Number.isFinite(value) ? value : 0,
      }),
    );
    if (ok) {
      setManualName("");
      setManualValue("");
    }
  };

  const recordTickerBuy = async (event: FormEvent) => {
    event.preventDefault();
    const ok = await mutate("ticker-buy", () =>
      engineApi.post("/assets/buy", {
        ticker: buyTicker.trim().toUpperCase(),
        name: buyName.trim() || undefined,
        quantity: Number(buyQuantity),
        price: Number(buyPrice),
        fee: Number(buyFee || 0),
        date: buyDate,
      }),
    );
    if (ok) {
      setBuyTicker("");
      setBuyName("");
      setBuyQuantity("");
      setBuyPrice("");
      setBuyFee("0");
      setQuote(null);
      setMarketQuery("");
    }
  };

  const recordTransaction = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedAssetId) return;
    const ok = await mutate("ledger", () =>
      engineApi.post(`/assets/${selectedAssetId}/transactions`, {
        kind: txKind,
        quantity: Number(txQuantity),
        price: Number(txPrice),
        fee: Number(txFee || 0),
        date: txDate,
        notes: txNotes.trim() || undefined,
      }),
    );
    if (ok) {
      setTxQuantity("");
      setTxPrice("");
      setTxFee("0");
      setTxNotes("");
    }
  };

  const refreshPrice = async (asset: Asset) => {
    await mutate(`refresh-${asset.id}`, () => engineApi.post(`/assets/${asset.id}/refresh-price`, {}));
  };

  const removeAsset = async (asset: Asset) => {
    if (!window.confirm(`Delete ${asset.name}? This removes the holding from this workspace.`)) return;
    await mutate(`delete-${asset.id}`, () => engineApi.delete(`/assets/${asset.id}`));
  };

  const deleteTransaction = async (tx: AssetTransaction) => {
    if (!window.confirm("Delete this asset transaction? Holdings will be recalculated.")) return;
    await mutate(`tx-delete-${tx.id}`, () => engineApi.delete(`/assets/transactions/${tx.id}`));
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent">
            <ArrowLeft className="w-3.5 h-3.5" />Finance operations
          </Link>
          <p className="text-xs uppercase tracking-[.18em] text-accent mt-5">Net worth engine</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Assets & investments</h1>
          <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">
            FinCopilot now uses the full holdings ledger: manual assets, live market quotes, buy/sell transactions, portfolio history and price refreshes.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/finance/asset-groups" className="min-h-11 px-4 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-2">
            <WalletCards className="w-4 h-4" />Asset groups
          </Link>
          <button onClick={reloadAll} className="min-h-11 px-4 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />Refresh
          </button>
        </div>
      </header>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="premium-card p-5"><BriefcaseBusiness className="w-5 h-5 text-accent"/><p className="font-display text-2xl font-semibold mt-3">{activeAssets.length}</p><p className="text-xs text-(--text-secondary) mt-1">Active holdings</p></div>
        <div className="premium-card p-5"><LineChart className="w-5 h-5 text-accent"/><p className="font-display text-2xl font-semibold mt-3">{currency(totals.value)}</p><p className="text-xs text-(--text-secondary) mt-1">Portfolio value</p></div>
        <div className="premium-card p-5"><ArrowUpRight className="w-5 h-5 text-accent"/><p className="font-display text-2xl font-semibold mt-3">{currency(totals.gain)}</p><p className="text-xs text-(--text-secondary) mt-1">Unrealised gain/loss</p></div>
        <div className="premium-card p-5"><WalletCards className="w-5 h-5 text-accent"/><p className="font-display text-2xl font-semibold mt-3">{currency(totals.invested)}</p><p className="text-xs text-(--text-secondary) mt-1">Ledger cost basis</p></div>
      </section>

      {trend.data && trend.data.length > 1 && (
        <section className="premium-card p-5 sm:p-6">
          <div className="mb-5"><h2 className="font-display font-semibold text-xl">Portfolio trend</h2><p className="text-xs text-(--text-secondary) mt-1">Historical portfolio value from the finance engine.</p></div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend.data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15}/>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24}/>
                <YAxis tick={{ fontSize: 11 }} width={70}/>
                <Tooltip formatter={(value) => currency(Number(value))}/>
                <Area type="monotone" dataKey="value" stroke="currentColor" fill="currentColor" fillOpacity={0.08}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {mutationError && <p className="text-sm text-red-400 rounded-xl border border-red-400/25 bg-red-400/5 p-3">{mutationError}</p>}

      <section className="grid xl:grid-cols-3 gap-4">
        <form onSubmit={searchMarket} className="premium-card p-5 xl:col-span-2">
          <h2 className="font-display font-semibold text-lg">Market lookup</h2>
          <p className="text-xs text-(--text-secondary) mt-1">Search a ticker/company, preview the live quote, then record the first buy.</p>
          <div className="flex gap-2 mt-4">
            <div className="relative flex-1"><Search className="absolute left-3 top-3.5 w-4 h-4 text-(--text-tertiary)"/><input value={marketQuery} onChange={(event)=>setMarketQuery(event.target.value)} placeholder="RELIANCE.NS, AAPL, BTC-USD…" className="w-full min-h-11 pl-10 pr-3 rounded-xl border border-(--border) bg-(--surface)"/></div>
            <button disabled={searching} className="min-h-11 px-4 rounded-xl bg-accent text-white disabled:opacity-50">{searching ? "Searching…" : "Search"}</button>
          </div>
          {matches.length > 0 && <div className="mt-3 grid gap-2 max-h-64 overflow-auto">{matches.map((match)=><button type="button" key={`${match.symbol}-${match.exchange ?? ""}`} onClick={()=>chooseMarketMatch(match)} className="text-left p-3 rounded-xl border border-(--border) hover:border-accent/50"><div className="flex justify-between gap-3"><span className="font-medium">{match.symbol}</span><span className="text-xs text-(--text-tertiary)">{match.exchange ?? match.quote_type ?? "Market"}</span></div><p className="text-xs text-(--text-secondary) mt-1">{match.name ?? "Market instrument"}</p></button>)}</div>}
          {quote && <div className="mt-4 rounded-xl border border-accent/25 bg-accent/5 p-4 flex flex-wrap justify-between gap-3"><div><p className="font-semibold">{quote.symbol} · {quote.name ?? "Live quote"}</p><p className="text-xs text-(--text-secondary)">{quote.exchange ?? quote.quote_type ?? "Market"}</p></div><p className="font-display text-xl font-semibold">{currency(quote.price, quote.currency)}</p></div>}
        </form>

        <form onSubmit={createManualAsset} className="premium-card p-5">
          <h2 className="font-display font-semibold text-lg">Add manual asset</h2>
          <div className="grid gap-3 mt-4">
            <input required value={manualName} onChange={(event)=>setManualName(event.target.value)} placeholder="Asset name" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <div className="grid grid-cols-2 gap-2"><select value={manualType} onChange={(event)=>setManualType(event.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="real_estate">Real estate</option><option value="vehicle">Vehicle</option><option value="valuable">Valuable</option><option value="investment">Investment</option><option value="other">Other</option></select><input required value={manualCurrency} onChange={(event)=>setManualCurrency(event.target.value)} placeholder="INR" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/></div>
            <input required type="number" step="any" value={manualValue} onChange={(event)=>setManualValue(event.target.value)} placeholder="Current value" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <button disabled={busy === "manual-create"} className="min-h-11 rounded-xl bg-accent text-white flex items-center justify-center gap-2 disabled:opacity-50"><Plus className="w-4 h-4"/>{busy === "manual-create" ? "Adding…" : "Add asset"}</button>
          </div>
        </form>
      </section>

      <section className="grid xl:grid-cols-2 gap-4">
        <form onSubmit={recordTickerBuy} className="premium-card p-5">
          <h2 className="font-display font-semibold text-lg">Record market holding</h2>
          <p className="text-xs text-(--text-secondary) mt-1">Find-or-create a ticker holding and write the opening buy to its ledger.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <input required value={buyTicker} onChange={(event)=>setBuyTicker(event.target.value)} placeholder="Ticker" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input value={buyName} onChange={(event)=>setBuyName(event.target.value)} placeholder="Display name" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input required type="number" min="0" step="any" value={buyQuantity} onChange={(event)=>setBuyQuantity(event.target.value)} placeholder="Quantity" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input required type="number" min="0" step="any" value={buyPrice} onChange={(event)=>setBuyPrice(event.target.value)} placeholder="Price per unit" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input type="number" min="0" step="any" value={buyFee} onChange={(event)=>setBuyFee(event.target.value)} placeholder="Fee" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input required type="date" value={buyDate} onChange={(event)=>setBuyDate(event.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
          </div>
          <button disabled={busy === "ticker-buy"} className="mt-3 min-h-11 px-4 rounded-xl bg-accent text-white disabled:opacity-50">{busy === "ticker-buy" ? "Recording…" : "Record buy"}</button>
        </form>

        <form onSubmit={recordTransaction} className="premium-card p-5">
          <h2 className="font-display font-semibold text-lg">Add ledger transaction</h2>
          <p className="text-xs text-(--text-secondary) mt-1">Record additional buys or sells; the engine recalculates units, average cost and realised gain.</p>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <select required value={selectedAssetId} onChange={(event)=>setSelectedAssetId(event.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="">Choose holding</option>{activeAssets.map((asset)=><option key={asset.id} value={asset.id}>{asset.ticker ? `${asset.ticker} · ` : ""}{asset.name}</option>)}</select>
            <select value={txKind} onChange={(event)=>setTxKind(event.target.value as "buy" | "sell")} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="buy">Buy</option><option value="sell">Sell</option></select>
            <input required type="number" min="0" step="any" value={txQuantity} onChange={(event)=>setTxQuantity(event.target.value)} placeholder="Quantity" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input required type="number" min="0" step="any" value={txPrice} onChange={(event)=>setTxPrice(event.target.value)} placeholder="Price per unit" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input type="number" min="0" step="any" value={txFee} onChange={(event)=>setTxFee(event.target.value)} placeholder="Fee" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input required type="date" value={txDate} onChange={(event)=>setTxDate(event.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
            <input value={txNotes} onChange={(event)=>setTxNotes(event.target.value)} placeholder="Notes (optional)" className="sm:col-span-2 min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/>
          </div>
          <button disabled={busy === "ledger" || !selectedAssetId} className="mt-3 min-h-11 px-4 rounded-xl bg-accent text-white disabled:opacity-50">{busy === "ledger" ? "Saving…" : `Record ${txKind}`}</button>
        </form>
      </section>

      <div className="flex gap-2 border-b border-(--border)">
        <button onClick={()=>setActiveTab("holdings")} className={`px-4 py-3 text-sm border-b-2 ${activeTab === "holdings" ? "border-accent text-accent" : "border-transparent text-(--text-secondary)"}`}>Holdings</button>
        <button onClick={()=>setActiveTab("transactions")} className={`px-4 py-3 text-sm border-b-2 ${activeTab === "transactions" ? "border-accent text-accent" : "border-transparent text-(--text-secondary)"}`}>Transactions ({transactions.data?.length ?? 0})</button>
      </div>

      <ResourceState loading={assets.loading || transactions.loading} error={assets.error ?? transactions.error} retry={reloadAll}/>

      {activeTab === "holdings" && assets.data && (
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeAssets.map((asset)=><article key={asset.id} className="premium-card p-5"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-xs uppercase tracking-[.12em] text-accent">{asset.ticker ?? asset.type}</p><h2 className="font-display font-semibold text-lg mt-1 truncate">{asset.name}</h2><p className="text-xs text-(--text-secondary) mt-1">{asset.valuation_method.replaceAll("_", " ")} · {asset.currency}</p></div><span className={`size-9 rounded-xl grid place-items-center ${asset.gain_loss && asset.gain_loss < 0 ? "bg-red-400/10 text-red-400" : "bg-accent/10 text-accent"}`}>{asset.gain_loss && asset.gain_loss < 0 ? <ArrowDownRight className="w-4 h-4"/> : <ArrowUpRight className="w-4 h-4"/>}</span></div><dl className="grid grid-cols-2 gap-3 mt-5 text-xs"><div><dt className="text-(--text-tertiary)">Value</dt><dd className="font-semibold mt-1">{currency(asset.current_value, asset.currency)}</dd></div><div><dt className="text-(--text-tertiary)">Gain/loss</dt><dd className="font-semibold mt-1">{currency(asset.gain_loss, asset.currency)}</dd></div><div><dt className="text-(--text-tertiary)">Units</dt><dd className="mt-1">{asset.units ?? "—"}</dd></div><div><dt className="text-(--text-tertiary)">Avg. price</dt><dd className="mt-1">{currency(asset.average_price, asset.currency)}</dd></div><div><dt className="text-(--text-tertiary)">Invested</dt><dd className="mt-1">{currency(asset.total_invested, asset.currency)}</dd></div><div><dt className="text-(--text-tertiary)">Realised</dt><dd className="mt-1">{currency(asset.realized_gain, asset.currency)}</dd></div></dl><div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-(--border)">{asset.valuation_method === "market_price" && <button onClick={()=>refreshPrice(asset)} disabled={busy === `refresh-${asset.id}`} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1.5 disabled:opacity-50"><RefreshCw className={`w-3.5 h-3.5 ${busy === `refresh-${asset.id}` ? "animate-spin" : ""}`}/>Refresh price</button>}<button onClick={()=>{setSelectedAssetId(asset.id);setActiveTab("transactions");}} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">Add trade</button><button onClick={()=>removeAsset(asset)} disabled={busy === `delete-${asset.id}`} className="min-h-9 px-3 rounded-lg border border-red-400/25 text-red-400 text-xs flex items-center gap-1.5 disabled:opacity-50"><Trash2 className="w-3.5 h-3.5"/>Delete</button></div></article>)}
          {activeAssets.length === 0 && <div className="premium-card p-10 text-center md:col-span-2 xl:col-span-3"><BriefcaseBusiness className="w-8 h-8 text-accent mx-auto"/><h2 className="font-semibold mt-4">No holdings yet</h2><p className="text-sm text-(--text-secondary) mt-2">Add a manual asset or search the market to record your first investment.</p></div>}
        </section>
      )}

      {activeTab === "transactions" && transactions.data && (
        <section className="premium-card overflow-hidden">
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-(--surface-subtle) text-(--text-secondary)"><tr><th className="text-left p-4">Date</th><th className="text-left p-4">Holding</th><th className="text-left p-4">Type</th><th className="text-right p-4">Quantity</th><th className="text-right p-4">Price</th><th className="text-right p-4">Fee</th><th className="p-4"/></tr></thead><tbody>{transactions.data.map((tx)=><tr key={tx.id} className="border-t border-(--border)"><td className="p-4 whitespace-nowrap">{tx.date}</td><td className="p-4"><p className="font-medium">{tx.ticker ?? tx.asset_name ?? "Holding"}</p><p className="text-xs text-(--text-tertiary)">{tx.asset_name}</p></td><td className="p-4"><span className={`px-2 py-1 rounded-lg text-xs ${tx.kind === "sell" ? "bg-red-400/10 text-red-400" : "bg-emerald-400/10 text-emerald-400"}`}>{tx.kind}</span></td><td className="p-4 text-right">{tx.quantity}</td><td className="p-4 text-right">{currency(tx.price, tx.currency ?? "INR")}</td><td className="p-4 text-right">{currency(tx.fee, tx.currency ?? "INR")}</td><td className="p-4 text-right"><button onClick={()=>deleteTransaction(tx)} disabled={busy === `tx-delete-${tx.id}`} className="size-9 rounded-lg border border-red-400/20 text-red-400 inline-grid place-items-center disabled:opacity-50" aria-label="Delete transaction"><Trash2 className="w-3.5 h-3.5"/></button></td></tr>)}</tbody></table></div>
          {transactions.data.length === 0 && <div className="p-10 text-center text-sm text-(--text-secondary)">No investment ledger transactions yet.</div>}
        </section>
      )}
    </div>
  );
}
