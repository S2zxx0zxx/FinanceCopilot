"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  CalendarRange,
  Layers3,
  RefreshCw,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type Breakdown = { key: string; label: string; value: number; color: string };
type CompositionItem = Breakdown & { group: string };
type Point = {
  date: string;
  value: number;
  breakdowns: Record<string, number>;
  change?: number | null;
  composition?: CompositionItem[];
};
type CategoryTrendItem = {
  key: string;
  label: string;
  color: string;
  total: number;
  group: string;
  series: Point[];
};
type Report = {
  summary: {
    primary_value: number;
    change_amount: number;
    change_percent: number | null;
    breakdowns: Breakdown[];
  };
  trend: Point[];
  meta: {
    type: string;
    currency: string;
    interval: string;
    series_keys: string[];
    forecast_start_date?: string | null;
    baseline_active?: boolean;
    baseline_lookback_days?: number | null;
  };
  composition: CompositionItem[];
  category_trend: CategoryTrendItem[];
};
type Account = { id: string; name: string };
type AssetGroup = { id: string; name: string };
type TabKey = "net_worth" | "income_expenses" | "cash_flow" | "money_map";
type Interval = "daily" | "weekly" | "monthly" | "yearly";
type RangeOption = { key: string; label: string; months: number; period?: "ytd"; days?: number };

const HISTORICAL_RANGES: RangeOption[] = [
  { key: "6m", label: "6 months", months: 6 },
  { key: "ytd", label: "YTD", months: 12, period: "ytd" },
  { key: "1y", label: "1 year", months: 12 },
  { key: "2y", label: "2 years", months: 24 },
];
const CASH_FLOW_RANGES: RangeOption[] = [
  { key: "3m", label: "3 months", months: 3 },
  { key: "6m", label: "6 months", months: 6 },
  { key: "12m", label: "12 months", months: 12 },
];
const MONEY_MAP_RANGES: RangeOption[] = [
  { key: "30d", label: "30 days", months: 1, days: 30 },
  { key: "3m", label: "3 months", months: 3 },
  { key: "6m", label: "6 months", months: 6 },
  { key: "ytd", label: "YTD", months: 12, period: "ytd" },
  { key: "1y", label: "1 year", months: 12 },
];
const INTERVALS: { value: Interval; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];
const FALLBACK_COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#0ea5e9", "#8b5cf6", "#f97316", "#14b8a6"];

function asArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["items", "data", "accounts", "groups"]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

function money(value: number | null | undefined, currency: string) {
  const amount = Number(value ?? 0);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency || "INR"} ${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(amount)}`;
  }
}

function compactMoney(value: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  } catch {
    return String(Math.round(value));
  }
}

function rangesFor(tab: TabKey) {
  if (tab === "cash_flow") return CASH_FLOW_RANGES;
  if (tab === "money_map") return MONEY_MAP_RANGES;
  return HISTORICAL_RANGES;
}

function endpointFor(tab: TabKey) {
  if (tab === "net_worth") return "/reports/net-worth";
  if (tab === "cash_flow") return "/reports/cash-flow";
  return "/reports/income-expenses";
}

function reportTitle(tab: TabKey) {
  if (tab === "net_worth") return "Net worth";
  if (tab === "income_expenses") return "Income vs expenses";
  if (tab === "cash_flow") return "Cash flow forecast";
  return "Money map";
}

function filterButton(active: boolean) {
  return `min-h-9 px-3 rounded-lg border text-xs transition ${active ? "border-accent bg-accent/10 text-accent" : "border-(--border) bg-(--surface) text-(--text-secondary) hover:text-(--text-primary)"}`;
}

function ScopePicker({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: { id: string; name: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[.14em] text-(--text-tertiary) mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button key={item.id} type="button" onClick={() => onToggle(item.id)} className={filterButton(selected.includes(item.id))}>
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function FinanceReportsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("net_worth");
  const [rangeKey, setRangeKey] = useState("1y");
  const [interval, setInterval] = useState<Interval>("monthly");
  const [cashFlowBaseline, setCashFlowBaseline] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [selectedAssetGroups, setSelectedAssetGroups] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [categoryMode, setCategoryMode] = useState<"expenses" | "income">("expenses");

  const accounts = useResource(useCallback(async () => asArray<Account>(await engineApi.get("/accounts")), []));
  const assetGroups = useResource(useCallback(async () => asArray<AssetGroup>(await engineApi.get("/asset-groups")), []));

  const range = useMemo(() => {
    const options = rangesFor(activeTab);
    return options.find((item) => item.key === rangeKey) ?? options[0];
  }, [activeTab, rangeKey]);

  const reportLoader = useCallback(async () => {
    const params = new URLSearchParams();
    params.set("months", String(range.months));
    params.set("interval", activeTab === "cash_flow" && interval === "yearly" ? "monthly" : interval);
    if (range.period) params.set("period", range.period);
    if (range.days && activeTab !== "cash_flow") params.set("days", String(range.days));
    if (activeTab === "cash_flow") params.set("baseline", String(cashFlowBaseline));
    selectedAccounts.forEach((id) => params.append("account_ids", id));
    if (activeTab === "net_worth") selectedAssetGroups.forEach((id) => params.append("asset_group_ids", id));
    return engineApi.get<Report>(`${endpointFor(activeTab)}?${params.toString()}`);
  }, [activeTab, cashFlowBaseline, interval, range.days, range.months, range.period, selectedAccounts, selectedAssetGroups]);

  const state = useResource(reportLoader);
  const data = state.data;
  const currency = data?.meta.currency || "INR";
  const chartData = useMemo(
    () =>
      (data?.trend ?? []).map((point) => ({
        date: point.date,
        value: point.value,
        change: point.change ?? null,
        ...point.breakdowns,
      })),
    [data],
  );

  const selectedPoint = useMemo(
    () => (selectedDate ? data?.trend.find((point) => point.date === selectedDate) ?? null : null),
    [data, selectedDate],
  );

  const composition = useMemo(() => {
    const rows = selectedPoint?.composition?.length ? selectedPoint.composition : data?.composition ?? [];
    return rows.filter((item) => item.value > 0).sort((a, b) => b.value - a.value);
  }, [data, selectedPoint]);

  const categoryTrends = useMemo(() => {
    const expected = categoryMode === "expenses" ? "expense" : "income";
    const all = data?.category_trend ?? [];
    const matched = all.filter((item) => item.group.toLowerCase().includes(expected));
    return (matched.length ? matched : all).slice(0, 12);
  }, [categoryMode, data]);

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSelectedDate(null);
    const nextRanges = rangesFor(tab);
    if (!nextRanges.some((item) => item.key === rangeKey)) setRangeKey(tab === "cash_flow" ? "6m" : tab === "money_map" ? "3m" : "1y");
    if (tab === "cash_flow" && interval === "yearly") setInterval("monthly");
  };

  const selectRange = (key: string) => {
    setRangeKey(key);
    setSelectedDate(null);
    if (key === "ytd" && interval === "yearly") setInterval("monthly");
  };

  const toggle = (id: string, values: string[], setter: (next: string[]) => void) => {
    setter(values.includes(id) ? values.filter((value) => value !== id) : [...values, id]);
  };

  const breakdownColor = (key: string, index: number) =>
    data?.summary.breakdowns.find((item) => item.key === key)?.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];

  const tabs: { key: TabKey; label: string; Icon: typeof TrendingUp }[] = [
    { key: "net_worth", label: "Net worth", Icon: TrendingUp },
    { key: "income_expenses", label: "Income & expenses", Icon: BarChart3 },
    { key: "cash_flow", label: "Cash flow", Icon: WalletCards },
    { key: "money_map", label: "Money map", Icon: Layers3 },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-7xl pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent">
            <ArrowLeft className="w-3.5 h-3.5" />Finance operations
          </Link>
          <p className="text-xs uppercase tracking-[.18em] text-accent mt-5">Analytics engine</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Reports & money map</h1>
          <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">
            Explore net worth, income and expenses, forward cash flow and category composition with the same finance-engine controls as the underlying Securo reporting model.
          </p>
        </div>
        <button onClick={state.reload} disabled={state.loading} className="min-h-11 px-4 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-2 disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`} />Refresh
        </button>
      </header>

      <section className="premium-card p-2 overflow-x-auto">
        <div className="flex min-w-max gap-1">
          {tabs.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => switchTab(key)} className={`min-h-11 px-4 rounded-xl flex items-center gap-2 text-sm transition ${activeTab === key ? "bg-accent text-white" : "text-(--text-secondary) hover:bg-(--surface-subtle) hover:text-(--text-primary)"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      </section>

      <section className="premium-card p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2"><CalendarRange className="w-4 h-4 text-accent"/><h2 className="font-display font-semibold">Report controls</h2></div>
        <div className="flex flex-wrap gap-2">
          {rangesFor(activeTab).map((item) => <button key={item.key} onClick={() => selectRange(item.key)} className={filterButton(rangeKey === item.key)}>{item.label}</button>)}
          <span className="w-px bg-(--border) mx-1" />
          {INTERVALS.filter((item) => activeTab !== "cash_flow" || item.value !== "yearly").map((item) => (
            <button key={item.value} disabled={rangeKey === "ytd" && item.value === "yearly"} onClick={() => setInterval(item.value)} className={`${filterButton(interval === item.value)} disabled:opacity-35`}>{item.label}</button>
          ))}
        </div>
        <ScopePicker title="Accounts" items={accounts.data ?? []} selected={selectedAccounts} onToggle={(id) => toggle(id, selectedAccounts, setSelectedAccounts)} />
        {activeTab === "net_worth" && <ScopePicker title="Asset groups" items={assetGroups.data ?? []} selected={selectedAssetGroups} onToggle={(id) => toggle(id, selectedAssetGroups, setSelectedAssetGroups)} />}
        {activeTab === "cash_flow" && (
          <label className="inline-flex items-center gap-2 text-sm text-(--text-secondary)">
            <input type="checkbox" checked={cashFlowBaseline} onChange={(event) => setCashFlowBaseline(event.target.checked)} />
            Include historical baseline in the forecast
          </label>
        )}
        {(selectedAccounts.length > 0 || selectedAssetGroups.length > 0) && <button onClick={() => { setSelectedAccounts([]); setSelectedAssetGroups([]); }} className="text-xs text-accent hover:underline">Clear scope filters</button>}
      </section>

      <ResourceState loading={state.loading} error={state.error} retry={state.reload} />

      {data && (
        <>
          <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="premium-card p-5 sm:col-span-2">
              <p className="text-xs text-(--text-secondary)">{reportTitle(activeTab)}</p>
              <p className="font-display font-bold text-3xl sm:text-4xl mt-2">{money(data.summary.primary_value, currency)}</p>
              <p className={`text-xs mt-2 ${data.summary.change_amount >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {data.summary.change_amount >= 0 ? "+" : ""}{money(data.summary.change_amount, currency)}
                {data.summary.change_percent !== null ? ` · ${data.summary.change_percent.toFixed(1)}%` : ""}
              </p>
            </div>
            {data.summary.breakdowns.slice(0, 2).map((item) => (
              <div className="premium-card p-5" key={item.key}>
                <span className="inline-block size-2.5 rounded-full" style={{ backgroundColor: item.color || "currentColor" }} />
                <p className="font-display font-semibold text-2xl mt-3">{money(item.value, currency)}</p>
                <p className="text-xs text-(--text-secondary) mt-1">{item.label}</p>
              </div>
            ))}
          </section>

          {activeTab !== "money_map" && (
            <section className="premium-card p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                <div><h2 className="font-display font-semibold text-xl">{reportTitle(activeTab)} trend</h2><p className="text-xs text-(--text-secondary) mt-1">{range.label} · {data.meta.interval}</p></div>
                {data.meta.forecast_start_date && <span className="text-xs px-3 py-1.5 rounded-full border border-(--border)">Forecast starts {data.meta.forecast_start_date}</span>}
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  {activeTab === "income_expenses" ? (
                    <BarChart data={chartData} onClick={(event) => { const label = event?.activeLabel; if (typeof label === "string") setSelectedDate(label); }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.14}/><XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24}/><YAxis tick={{ fontSize: 11 }} width={72} tickFormatter={(value) => compactMoney(Number(value), currency)}/><Tooltip formatter={(value) => money(Number(value), currency)}/>
                      {data.meta.series_keys.map((key, index) => <Bar key={key} dataKey={key} fill={breakdownColor(key, index)} radius={[4,4,0,0]}/>) }
                    </BarChart>
                  ) : activeTab === "cash_flow" ? (
                    <LineChart data={chartData} onClick={(event) => { const label = event?.activeLabel; if (typeof label === "string") setSelectedDate(label); }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.14}/><XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24}/><YAxis tick={{ fontSize: 11 }} width={72} tickFormatter={(value) => compactMoney(Number(value), currency)}/><Tooltip formatter={(value) => money(Number(value), currency)}/>
                      <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2.5} dot={false}/>
                      {data.meta.series_keys.slice(0, 3).map((key, index) => <Line key={key} type="monotone" dataKey={key} stroke={breakdownColor(key, index)} strokeWidth={1.5} strokeDasharray={data.meta.forecast_start_date ? "5 4" : undefined} dot={false}/>) }
                    </LineChart>
                  ) : (
                    <AreaChart data={chartData} onClick={(event) => { const label = event?.activeLabel; if (typeof label === "string") setSelectedDate(label); }}>
                      <defs><linearGradient id="netWorthFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.32}/><stop offset="95%" stopColor="#6366f1" stopOpacity={0.02}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.14}/><XAxis dataKey="date" tick={{ fontSize: 11 }} minTickGap={24}/><YAxis tick={{ fontSize: 11 }} width={72} tickFormatter={(value) => compactMoney(Number(value), currency)}/><Tooltip formatter={(value) => money(Number(value), currency)}/><Area type="monotone" dataKey="value" stroke="#6366f1" fill="url(#netWorthFill)" strokeWidth={2.5}/>
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
              <p className="text-[11px] text-(--text-tertiary) mt-3">Select a chart point to inspect its composition below.</p>
            </section>
          )}

          {(activeTab === "money_map" || composition.length > 0) && (
            <section className="grid xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)] gap-4">
              <div className="premium-card p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3"><div><h2 className="font-display font-semibold text-xl">Money composition</h2><p className="text-xs text-(--text-secondary) mt-1">{selectedDate ? `Snapshot for ${selectedDate}` : `Aggregated ${range.label.toLowerCase()} composition`}</p></div>{selectedDate && <button onClick={() => setSelectedDate(null)} className="text-xs text-accent hover:underline">Use total period</button>}</div>
                {composition.length ? <div className="h-72 mt-4"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={composition.slice(0,12)} dataKey="value" nameKey="label" innerRadius="52%" outerRadius="82%" paddingAngle={1}>{composition.slice(0,12).map((item,index)=><Cell key={item.key} fill={item.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}/>)}</Pie><Tooltip formatter={(value)=>money(Number(value),currency)}/></PieChart></ResponsiveContainer></div> : <p className="text-sm text-(--text-secondary) mt-6">No composition data in this range.</p>}
              </div>
              <div className="premium-card p-5 sm:p-6">
                <h3 className="font-display font-semibold text-lg">Where the money sits</h3>
                <div className="space-y-3 mt-4">{composition.slice(0,12).map((item,index)=><div key={`${item.group}-${item.key}`}><div className="flex justify-between gap-3 text-sm"><span className="flex items-center gap-2 min-w-0"><span className="size-2 rounded-full shrink-0" style={{backgroundColor:item.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}}/><span className="truncate">{item.label}</span></span><span className="font-medium shrink-0">{money(item.value,currency)}</span></div><p className="text-[10px] uppercase tracking-wider text-(--text-tertiary) ml-4 mt-1">{item.group}</p></div>)}</div>
              </div>
            </section>
          )}

          {data.category_trend.length > 0 && activeTab !== "net_worth" && activeTab !== "cash_flow" && (
            <section className="premium-card p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display font-semibold text-xl">Category trends</h2><p className="text-xs text-(--text-secondary) mt-1">See which categories are driving the period.</p></div><div className="flex gap-2"><button onClick={()=>setCategoryMode("expenses")} className={filterButton(categoryMode === "expenses")}>Expenses</button><button onClick={()=>setCategoryMode("income")} className={filterButton(categoryMode === "income")}>Income</button></div></div>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-5">{categoryTrends.map((item)=><article key={`${item.group}-${item.key}`} className="rounded-xl border border-(--border) bg-(--surface) p-4"><div className="flex justify-between gap-3"><div className="min-w-0"><p className="font-medium truncate">{item.label}</p><p className="text-[10px] uppercase tracking-wider text-(--text-tertiary) mt-1">{item.group}</p></div><p className="text-sm font-semibold">{money(item.total,currency)}</p></div><div className="h-16 mt-3"><ResponsiveContainer width="100%" height="100%"><LineChart data={item.series}><Line type="monotone" dataKey="value" stroke={item.color || "#6366f1"} strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div></article>)}</div>
            </section>
          )}

          <section className="premium-card p-5 sm:p-6">
            <h2 className="font-display font-semibold text-xl">Period ledger</h2>
            <p className="text-xs text-(--text-secondary) mt-1">Every report point returned by the finance engine.</p>
            <div className="mt-4 overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-(--text-tertiary) border-b border-(--border)"><th className="py-3 font-medium">Period</th><th className="py-3 font-medium text-right">Value</th><th className="py-3 font-medium text-right">Change</th></tr></thead><tbody>{data.trend.map((point)=><tr key={point.date} onClick={()=>setSelectedDate(point.date)} className={`border-b border-(--border) last:border-0 cursor-pointer hover:bg-(--surface-subtle) ${selectedDate === point.date ? "bg-accent/5" : ""}`}><td className="py-3">{point.date}</td><td className="py-3 text-right font-medium">{money(point.value,currency)}</td><td className={`py-3 text-right ${(point.change ?? 0) >= 0 ? "text-emerald-500" : "text-red-500"}`}>{point.change == null ? "—" : money(point.change,currency)}</td></tr>)}</tbody></table></div>
          </section>
        </>
      )}
    </div>
  );
}
