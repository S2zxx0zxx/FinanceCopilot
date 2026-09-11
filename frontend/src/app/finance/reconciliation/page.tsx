"use client";

import { useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, GitCompareArrows, RefreshCw, ShieldCheck } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type ReconciliationRule = { id: string; name?: string | null; enabled: boolean; outcome?: string; trigger?: string; origin?: string; customised?: boolean; position?: number };
type ReconciliationNode = { node: string; active: boolean; rules: ReconciliationRule[] };

const loadRules = async () => engineApi.get<ReconciliationNode[]>("/reconciliation/rules");

export default function ReconciliationPage() {
  const loader = useCallback(loadRules, []);
  const state = useResource(loader);
  return <div className="flex flex-col gap-6 max-w-5xl pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent"><ArrowLeft className="w-3.5 h-3.5"/>Finance operations</Link><p className="text-xs uppercase tracking-[.18em] text-accent mt-5">Matching engine</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Reconciliation</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-2xl">Inspect the ordered policy the engine uses to match money movement with invoices and recurring workflows.</p></div><button onClick={state.reload} disabled={state.loading} className="min-h-11 px-4 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-2"><RefreshCw className={`w-4 h-4 ${state.loading?"animate-spin":""}`}/>Refresh</button></header>
    <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>
    {state.error?.toLowerCase().includes("not found") && <div className="premium-card p-5 text-sm text-(--text-secondary)"><ShieldCheck className="w-5 h-5 text-accent mb-3"/>Reconciliation is module-gated by the backend. Enable invoicing or recurring workflows for this workspace to expose its matching policy.</div>}
    {state.data?.map((node)=><section key={node.node} className="premium-card p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-[10px] uppercase tracking-[.16em] text-accent">{node.active?"Active policy":"Inactive policy"}</p><h2 className="font-display font-semibold text-xl mt-1 capitalize">{node.node.replaceAll("_"," ")}</h2></div><GitCompareArrows className="w-5 h-5 text-accent"/></div><div className="mt-5 space-y-3">{node.rules.map((rule,index)=><div key={rule.id} className="rounded-2xl border border-(--border) bg-(--surface-subtle) p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{index+1}. {rule.name || "Matching rule"}</p><p className="text-xs text-(--text-secondary) mt-1">{rule.trigger?.replaceAll("_"," ") || "money event"} → {rule.outcome?.replaceAll("_"," ") || "suggest"}</p></div><span className={`text-[10px] px-2 py-1 rounded-full ${rule.enabled?"bg-emerald-500/10 text-emerald-500":"bg-(--surface) text-(--text-tertiary)"}`}>{rule.enabled?"Enabled":"Disabled"}</span></div><p className="text-[11px] text-(--text-tertiary) mt-3">{rule.customised?"Workspace customised":"Engine default"} · {rule.origin || "default"}</p></div>)}{node.rules.length===0&&<p className="text-sm text-(--text-secondary)">No rules in this policy.</p>}</div></section>)}
  </div>;
}
