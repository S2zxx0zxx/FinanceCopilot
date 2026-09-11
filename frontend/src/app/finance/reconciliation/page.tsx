"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Download,
  GitCompareArrows,
  History,
  Plus,
  RefreshCw,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type Rule = {
  id: string;
  node: string;
  name?: string | null;
  origin: string;
  customised: boolean;
  enabled: boolean;
  outcome: string;
  trigger: string;
  when: Record<string, unknown>;
  position: number;
};
type NodePolicy = { node: string; active: boolean; rules: Rule[]; discarded?: Array<{ id: string; node: string }> };
type Suggestion = {
  id: string;
  node: string;
  strategy_id: string;
  expectation_kind: string;
  expectation_id: string;
  expectation_label?: string | null;
  amount: string | number;
  scores: Record<string, unknown>;
  status: string;
  created_at: string;
  transaction?: { id: string; description?: string | null; amount: string | number; currency?: string | null; date: string; type: string } | null;
  covers?: Array<{ expectation_kind: string; expectation_id: string; label?: string | null; amount: string | number }>;
};
type HistoryEvent = {
  id: string;
  at: string;
  action: string;
  expectation_kind: string;
  expectation_id: string;
  expectation_label?: string | null;
  amount: string | number;
  currency?: string | null;
  strategy_id?: string | null;
  user_id?: string | null;
  transaction_id?: string | null;
  transaction_description?: string | null;
};

export default function ReconciliationPage() {
  const importRef = React.useRef<HTMLInputElement>(null);
  const [policies, setPolicies] = React.useState<NodePolicy[]>([]);
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [history, setHistory] = React.useState<HistoryEvent[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [newNode, setNewNode] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newOutcome, setNewOutcome] = React.useState("suggest");
  const [newTrigger, setNewTrigger] = React.useState("money_arrives");
  const [newWhen, setNewWhen] = React.useState("{}");

  const load = React.useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [ruleResult, suggestionResult, historyResult] = await Promise.all([
        engineApi.get<NodePolicy[]>("/api/reconciliation/rules"),
        engineApi.get<Suggestion[]>("/api/reconciliation/suggestions"),
        engineApi.get<HistoryEvent[]>("/api/reconciliation/history?limit=50"),
      ]);
      const nextPolicies = Array.isArray(ruleResult) ? ruleResult : [];
      setPolicies(nextPolicies);
      setSuggestions(Array.isArray(suggestionResult) ? suggestionResult : []);
      setHistory(Array.isArray(historyResult) ? historyResult : []);
      setNewNode((current) => current || nextPolicies[0]?.node || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reconciliation could not be loaded for this workspace.");
    } finally { setLoading(false); }
  }, []);
  React.useEffect(() => { void load(); }, [load]);

  const patchRule = async (rule: Rule, patch: Record<string, unknown>) => {
    setBusy(true); setError(null); setMessage(null);
    try {
      await engineApi.patch(`/api/reconciliation/rules/${encodeURIComponent(rule.node)}/${encodeURIComponent(rule.id)}`, patch);
      setMessage("Matching rule updated."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Rule could not be updated."); }
    finally { setBusy(false); }
  };

  const resetRule = async (rule: Rule) => {
    setBusy(true); setError(null);
    try { await engineApi.post(`/api/reconciliation/rules/${encodeURIComponent(rule.node)}/${encodeURIComponent(rule.id)}/reset`); setMessage("Rule restored to the current FinCopilot default."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Rule could not be reset."); }
    finally { setBusy(false); }
  };

  const moveRule = async (policy: NodePolicy, index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= policy.rules.length) return;
    const order = policy.rules.map((rule) => rule.id);
    [order[index], order[target]] = [order[target], order[index]];
    setBusy(true); setError(null);
    try { await engineApi.put(`/api/reconciliation/rules/${encodeURIComponent(policy.node)}/order`, { order }); setMessage("Rule priority updated."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Rule order could not be updated."); }
    finally { setBusy(false); }
  };

  const createRule = async (event: React.FormEvent) => {
    event.preventDefault(); if (!newNode || !newName.trim()) return;
    let when: Record<string, unknown>;
    try { when = JSON.parse(newWhen); } catch { setError("Rule conditions must be valid JSON."); return; }
    setBusy(true); setError(null);
    try {
      await engineApi.post("/api/reconciliation/rules", { node: newNode, name: newName.trim(), outcome: newOutcome, trigger: newTrigger, when, enabled: true });
      setNewName(""); setNewWhen("{}"); setMessage("Custom matching rule created."); await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Custom rule could not be created."); }
    finally { setBusy(false); }
  };

  const answerSuggestion = async (suggestion: Suggestion, answer: "accept" | "decline") => {
    setBusy(true); setError(null); setMessage(null);
    try {
      await engineApi.post(`/api/reconciliation/suggestions/${suggestion.id}/${answer}`);
      setMessage(answer === "accept" ? "Match accepted and applied." : "Suggestion declined. This same pair will not be offered again.");
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Suggestion could not be answered."); }
    finally { setBusy(false); }
  };

  const exportRules = async () => {
    setBusy(true); setError(null);
    try {
      const data = await engineApi.get<Record<string, unknown>>("/api/reconciliation/rules/export");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
      anchor.href = url; anchor.download = "fincopilot-reconciliation-rules.json"; anchor.click(); URL.revokeObjectURL(url);
    } catch (err) { setError(err instanceof Error ? err.message : "Matching rules could not be exported."); }
    finally { setBusy(false); }
  };

  const importRules = async (file: File | null) => {
    if (!file) return;
    setBusy(true); setError(null); setMessage(null);
    try {
      const payload = JSON.parse(await file.text());
      let overwrite = false;
      try {
        const result = await engineApi.post<any>("/api/reconciliation/rules/import", { payload, overwrite: false });
        setMessage(`Imported ${result.imported} rule(s); ${result.skipped} skipped.`);
      } catch (err: any) {
        if (err?.status !== 409 && !String(err?.message || "").toLowerCase().includes("existing")) throw err;
        overwrite = window.confirm("This workspace already has custom matching policy. Replace it with this imported policy?");
        if (!overwrite) return;
        const result = await engineApi.post<any>("/api/reconciliation/rules/import", { payload, overwrite: true });
        setMessage(`Imported ${result.imported} rule(s); ${result.skipped} skipped.`);
      }
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : "Matching-rules file could not be imported."); }
    finally { setBusy(false); if (importRef.current) importRef.current.value = ""; }
  };

  return <div className="max-w-7xl flex flex-col gap-6 pb-12">
    <header className="flex flex-wrap items-start justify-between gap-4"><div className="flex gap-3 items-start"><Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Back"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Matching & settlement</p><h1 className="font-display font-bold text-3xl mt-1">Reconciliation</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Review uncertain matches, decide what should settle an invoice or recurring bill, and tune the ordered rules FinCopilot uses for future matches.</p></div></div><div className="flex flex-wrap gap-2"><input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void importRules(event.target.files?.[0] || null)} /><button disabled={busy} onClick={() => importRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm"><Upload className="size-4" />Import policy</button><button disabled={busy} onClick={() => void exportRules()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm"><Download className="size-4" />Export policy</button><button disabled={loading} onClick={() => void load()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm"><RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />Refresh</button></div></header>
    {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}{message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive)">{message}</div>}

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><GitCompareArrows className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Needs your decision</h2><span className="text-xs text-(--text-tertiary)">{suggestions.length} open</span></div><div className="mt-4 space-y-3">{suggestions.map((suggestion) => <article key={suggestion.id} className="rounded-2xl border border-(--border) p-4"><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"><div className="min-w-0"><p className="font-semibold">{suggestion.expectation_label || suggestion.expectation_kind.replaceAll("_", " ")}</p><p className="text-sm text-(--text-secondary) mt-1">{suggestion.transaction?.description || "Money movement"} · {suggestion.transaction?.date || new Date(suggestion.created_at).toLocaleDateString()}</p><p className="text-lg font-semibold mt-2">{Number(suggestion.amount).toLocaleString(undefined,{maximumFractionDigits:2})} {suggestion.transaction?.currency || ""}</p>{suggestion.covers && suggestion.covers.length > 1 && <p className="text-xs text-(--text-secondary) mt-2">Covers {suggestion.covers.map((item) => item.label || item.expectation_kind).join(" + ")}</p>}<details className="mt-3"><summary className="cursor-pointer text-xs text-accent">Why FinCopilot suggested this</summary><pre className="mt-2 overflow-auto rounded-xl bg-(--surface-subtle) p-3 text-[11px]">{JSON.stringify(suggestion.scores, null, 2)}</pre></details></div><div className="flex gap-2"><button disabled={busy} onClick={() => void answerSuggestion(suggestion, "accept")} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground"><Check className="size-4" />Accept</button><button disabled={busy} onClick={() => void answerSuggestion(suggestion, "decline")} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-4 text-sm"><X className="size-4" />Decline</button></div></div></article>)}{!loading && suggestions.length === 0 && <p className="py-6 text-center text-sm text-(--text-tertiary)">Nothing needs a matching decision right now.</p>}</div></section>

    <section className="space-y-4"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">Matching policy</p><h2 className="font-display text-2xl font-semibold mt-1">Rules and priority</h2><p className="text-sm text-(--text-secondary) mt-1">The first matching rule wins. Link rules settle automatically; suggest rules ask you first.</p></div>{policies.map((policy) => <div key={policy.node} className="premium-card p-5 sm:p-6"><div className="flex justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-accent">{policy.active ? "Active" : "Inactive"}</p><h3 className="font-display text-xl font-semibold mt-1 capitalize">{policy.node.replaceAll("_", " ")}</h3></div></div><div className="mt-4 space-y-3">{policy.rules.map((rule, index) => <div key={rule.id} className="rounded-2xl border border-(--border) p-4"><div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{index + 1}. {rule.name || rule.id}</p><span className="text-[10px] uppercase tracking-wider text-(--text-tertiary)">{rule.origin}{rule.customised ? " · customised" : ""}</span></div><div className="grid sm:grid-cols-3 gap-2 mt-3"><label className="text-xs">Status<select disabled={busy} value={rule.enabled ? "on" : "off"} onChange={(event) => void patchRule(rule, { enabled: event.target.value === "on" })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="on">Enabled</option><option value="off">Disabled</option></select></label><label className="text-xs">When it runs<select disabled={busy} value={rule.trigger} onChange={(event) => void patchRule(rule, { trigger: event.target.value })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="money_arrives">Money arrives</option><option value="invoice_issued">Invoice issued</option><option value="both">Both moments</option></select></label><label className="text-xs">If it matches<select disabled={busy} value={rule.outcome} onChange={(event) => void patchRule(rule, { outcome: event.target.value })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="suggest">Ask me</option><option value="link">Link automatically</option></select></label></div><details className="mt-3"><summary className="cursor-pointer text-xs text-accent">Conditions</summary><pre className="mt-2 overflow-auto rounded-xl bg-(--surface-subtle) p-3 text-[11px]">{JSON.stringify(rule.when, null, 2)}</pre></details></div><div className="flex gap-1"><button disabled={busy || index === 0} onClick={() => void moveRule(policy, index, -1)} className="grid size-9 place-items-center rounded-lg border border-(--border)" aria-label="Move rule up"><ArrowUp className="size-4" /></button><button disabled={busy || index === policy.rules.length - 1} onClick={() => void moveRule(policy, index, 1)} className="grid size-9 place-items-center rounded-lg border border-(--border)" aria-label="Move rule down"><ArrowDown className="size-4" /></button>{rule.customised && <button disabled={busy} onClick={() => void resetRule(rule)} className="grid size-9 place-items-center rounded-lg border border-(--border)" aria-label="Reset rule"><RotateCcw className="size-4" /></button>}</div></div></div>)}{policy.rules.length === 0 && <p className="text-sm text-(--text-tertiary)">No rules in this matching policy.</p>}</div></div>)}</section>

    {policies.length > 0 && <section className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold flex items-center gap-2"><Plus className="size-5 text-accent" />Custom matching rule</h2><p className="text-sm text-(--text-secondary) mt-2">Advanced conditions use the same portable JSON policy format as exported rules.</p><form onSubmit={createRule} className="mt-4 grid sm:grid-cols-2 gap-3"><label className="text-xs">Policy<select value={newNode} onChange={(event) => setNewNode(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2">{policies.map((policy) => <option key={policy.node} value={policy.node}>{policy.node.replaceAll("_", " ")}</option>)}</select></label><label className="text-xs">Rule name<input required value={newName} onChange={(event) => setNewName(event.target.value)} maxLength={120} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Trigger<select value={newTrigger} onChange={(event) => setNewTrigger(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="money_arrives">Money arrives</option><option value="invoice_issued">Invoice issued</option><option value="both">Both moments</option></select></label><label className="text-xs">Outcome<select value={newOutcome} onChange={(event) => setNewOutcome(event.target.value)} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="suggest">Ask me</option><option value="link">Link automatically</option></select></label><label className="sm:col-span-2 text-xs">Conditions JSON<textarea value={newWhen} onChange={(event) => setNewWhen(event.target.value)} rows={5} className="mt-1 w-full rounded-xl border border-(--border) bg-(--surface) p-3 font-mono text-xs" /></label><button disabled={busy || !newName.trim()} className="sm:col-span-2 justify-self-start min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Create rule</button></form></section>}

    <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><History className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Matching history</h2></div><div className="mt-4 divide-y divide-(--border)">{history.map((event) => <div key={event.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"><div><p className="font-medium text-sm capitalize">{event.action.replaceAll("_", " ")} · {event.expectation_label || event.expectation_kind.replaceAll("_", " ")}</p><p className="text-xs text-(--text-secondary) mt-1">{event.transaction_description || "No transaction description"}{event.strategy_id ? ` · rule ${event.strategy_id}` : ""}{event.user_id ? " · confirmed by a user" : " · automatic"}</p></div><div className="sm:text-right"><p className="text-sm font-semibold">{Number(event.amount).toLocaleString(undefined,{maximumFractionDigits:2})} {event.currency || ""}</p><p className="text-xs text-(--text-tertiary)">{new Date(event.at).toLocaleString()}</p></div></div>)}{!history.length && <p className="py-6 text-center text-sm text-(--text-tertiary)">No reconciliation history yet.</p>}</div></section>
  </div>;
}
