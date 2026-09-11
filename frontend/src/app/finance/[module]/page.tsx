"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Database, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { ENGINE_MODULES, isEngineModuleKey } from "@/lib/engine-modules";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

function toRows(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object" && !Array.isArray(item));
  }
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  for (const key of ["data", "items", "results", "connections", "workspaces", "currencies", "groups", "invoices", "categories", "payees", "assets", "rules", "logs"]) {
    if (Array.isArray(obj[key])) return toRows(obj[key]);
  }
  return [obj];
}

function textValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
  if (typeof value === "string") {
    const date = /^\d{4}-\d{2}-\d{2}T/.test(value) ? new Date(value) : null;
    return date && !Number.isNaN(date.valueOf()) ? date.toLocaleString("en-IN") : value;
  }
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  return "Available";
}

function pick(record: Record<string, unknown>, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

const hiddenKeys = new Set(["id", "workspace_id", "user_id", "created_by", "updated_by"]);

export default function FinanceEngineModulePage() {
  const params = useParams<{ module: string }>();
  const rawModule = Array.isArray(params?.module) ? params.module[0] : params?.module;
  const moduleKey = rawModule && isEngineModuleKey(rawModule) ? rawModule : null;
  const config = moduleKey ? ENGINE_MODULES[moduleKey] : null;
  const loader = useCallback(async () => {
    if (!config) return [] as Record<string, unknown>[];
    return toRows(await engineApi.get(config.endpoint));
  }, [config]);
  const state = useResource(loader);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const list = state.data ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((record) => JSON.stringify(record).toLowerCase().includes(needle));
  }, [state.data, query]);

  if (!config) {
    return <div className="max-w-3xl premium-card p-8"><h1 className="text-2xl font-display font-bold">Finance module not found</h1><p className="mt-2 text-sm text-(--text-secondary)">This FinCopilot module is not registered.</p><Link href="/finance" className="inline-flex mt-5 text-accent">Back to Finance operations</Link></div>;
  }

  return <div className="flex flex-col gap-6 max-w-6xl pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent"><ArrowLeft className="w-3.5 h-3.5"/>Finance operations</Link>
        <p className="text-xs uppercase tracking-[.18em] text-accent mt-5">{config.eyebrow}</p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">{config.title}</h1>
        <p className="text-sm text-(--text-secondary) mt-2 max-w-2xl">{config.description}</p>
      </div>
      <button onClick={state.reload} disabled={state.loading} className="min-h-11 px-4 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-2 disabled:opacity-50"><RefreshCw className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`}/>Refresh</button>
    </header>

    <section className="grid sm:grid-cols-3 gap-3">
      <div className="premium-card p-5"><Database className="w-5 h-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{state.data?.length ?? 0}</p><p className="text-xs text-(--text-secondary) mt-1">Live engine records</p></div>
      <div className="premium-card p-5"><ShieldCheck className="w-5 h-5 text-accent"/><p className="font-display text-lg font-semibold mt-3">Workspace scoped</p><p className="text-xs text-(--text-secondary) mt-1">Authorisation is enforced by the FastAPI engine</p></div>
      <div className="premium-card p-5"><RefreshCw className="w-5 h-5 text-accent"/><p className="font-display text-lg font-semibold mt-3">Live data</p><p className="text-xs text-(--text-secondary) mt-1">No demo or duplicated frontend store</p></div>
    </section>

    <label className="relative max-w-xl"><Search className="absolute left-3 top-3.5 w-4 h-4 text-(--text-tertiary)"/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder={`Search ${config.title.toLowerCase()}`} className="w-full min-h-11 pl-10 pr-3 rounded-xl bg-(--surface) border border-(--border)"/></label>
    <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>

    {state.data && filtered.length === 0 && <div className="premium-card p-10 text-center"><Database className="w-8 h-8 mx-auto text-accent"/><h2 className="font-semibold mt-4">{query ? "No matching records" : config.emptyTitle}</h2><p className="text-sm text-(--text-secondary) mt-2">{query ? "Try another search." : config.emptyDescription}</p></div>}

    {filtered.length > 0 && <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map((record, index) => {
      const title = pick(record, config.titleKeys, `${config.title.replace(/s$/, "")} ${index + 1}`);
      const subtitle = pick(record, config.subtitleKeys, "Finance engine record");
      const fields = Object.entries(record).filter(([key, value]) => !hiddenKeys.has(key) && !config.titleKeys.includes(key) && value !== null && value !== undefined && typeof value !== "object").slice(0, 6);
      return <article key={String(record.id ?? `${moduleKey}-${index}`)} className="premium-card p-5 min-w-0">
        <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="font-display font-semibold text-lg truncate">{title}</h2><p className="text-xs text-(--text-secondary) mt-1 truncate">{subtitle}</p></div><span className="w-2.5 h-2.5 mt-2 rounded-full bg-accent shrink-0"/></div>
        <dl className="mt-5 space-y-2">{fields.map(([key, value]) => <div key={key} className="flex items-start justify-between gap-4 text-xs"><dt className="text-(--text-tertiary) capitalize">{key.replaceAll("_", " ")}</dt><dd className="text-right text-(--text-secondary) max-w-[60%] break-words">{textValue(value)}</dd></div>)}</dl>
      </article>;
    })}</section>}
  </div>;
}
