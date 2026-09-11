"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  FileUp,
  Play,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  Trash2,
  WandSparkles,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type RuleCondition = { field: string; op: string; value: string };
type RuleGroup = { op: "and" | "or"; conditions: RuleCondition[] };
type RuleNode = RuleCondition | RuleGroup;
type RuleAction = { op: string; value: string };

type Rule = {
  id: string;
  name: string;
  conditions_op: "and" | "or" | string;
  conditions: RuleNode[];
  actions: RuleAction[];
  priority: number;
  is_active: boolean;
};

type RuleDraft = {
  name: string;
  conditions_op: "and" | "or";
  conditions: RuleNode[];
  actions: RuleAction[];
  priority: number;
  is_active: boolean;
  apply_to_existing: boolean;
  overwrite_existing_categories: boolean;
};

type PreviewRow = {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: string;
  current_category_name?: string | null;
  new_category_name?: string | null;
  will_change: boolean;
};

type Preview = {
  matched: number;
  will_change: number;
  will_apply: boolean;
  sample: PreviewRow[];
};

type RulePack = {
  code: string;
  name: string;
  flag: string;
  rule_count: number;
  installed: boolean;
};

const conditionFields = ["description", "payee", "notes", "amount", "type", "account_id", "payee_id", "date"];
const textOperators = ["contains", "not_contains", "equals", "not_equals", "starts_with", "ends_with", "regex"];
const numericOperators = ["equals", "not_equals", "gt", "gte", "lt", "lte"];
const actionOperators = ["set_category", "set_payee", "set_description", "append_notes", "ignore"];

function isGroup(node: RuleNode): node is RuleGroup {
  return "conditions" in node;
}

function blankCondition(): RuleCondition {
  return { field: "description", op: "contains", value: "" };
}

function blankDraft(): RuleDraft {
  return {
    name: "",
    conditions_op: "and",
    conditions: [blankCondition()],
    actions: [{ op: "set_category", value: "" }],
    priority: 0,
    is_active: true,
    apply_to_existing: true,
    overwrite_existing_categories: false,
  };
}

function normalizeNodes(value: unknown): RuleNode[] {
  if (!Array.isArray(value)) return [blankCondition()];
  const nodes: RuleNode[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    if (Array.isArray(record.conditions)) {
      const children: RuleCondition[] = [];
      for (const child of record.conditions) {
        if (!child || typeof child !== "object") continue;
        const c = child as Record<string, unknown>;
        children.push({ field: String(c.field ?? "description"), op: String(c.op ?? "contains"), value: String(c.value ?? "") });
      }
      nodes.push({ op: record.op === "and" ? "and" : "or", conditions: children.length ? children : [blankCondition()] });
    } else {
      nodes.push({ field: String(record.field ?? "description"), op: String(record.op ?? "contains"), value: String(record.value ?? "") });
    }
  }
  return nodes.length ? nodes : [blankCondition()];
}

function normalizeActions(value: unknown): RuleAction[] {
  if (!Array.isArray(value)) return [{ op: "set_category", value: "" }];
  const actions = value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const record = item as Record<string, unknown>;
    return [{ op: String(record.op ?? "set_category"), value: String(record.value ?? "") }];
  });
  return actions.length ? actions : [{ op: "set_category", value: "" }];
}

function ruleToDraft(rule: Rule): RuleDraft {
  return {
    name: rule.name,
    conditions_op: rule.conditions_op === "or" ? "or" : "and",
    conditions: normalizeNodes(rule.conditions),
    actions: normalizeActions(rule.actions),
    priority: rule.priority,
    is_active: rule.is_active,
    apply_to_existing: true,
    overwrite_existing_categories: false,
  };
}

export default function RulesStudioPage() {
  const rulesLoader = useCallback(async () => (await engineApi.get("/rules")) as Rule[], []);
  const packsLoader = useCallback(async () => (await engineApi.get("/rules/packs")) as RulePack[], []);
  const rules = useResource(rulesLoader);
  const packs = useResource(packsLoader);

  const [draft, setDraft] = useState<RuleDraft>(blankDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [importText, setImportText] = useState("");
  const [importOpen, setImportOpen] = useState(false);
  const [overwriteImport, setOverwriteImport] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeCount = useMemo(() => (rules.data ?? []).filter((rule) => rule.is_active).length, [rules.data]);

  const resetEditor = () => {
    setDraft(blankDraft());
    setEditingId(null);
    setPreview(null);
    setEditorOpen(false);
  };

  const runMutation = async (key: string, action: () => Promise<unknown>, success: string) => {
    setBusy(key);
    setError(null);
    setMessage(null);
    try {
      const result = await action();
      setMessage(success);
      rules.reload();
      packs.reload();
      return result;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The automation engine could not complete this action.");
      return null;
    } finally {
      setBusy(null);
    }
  };

  const updateLeaf = (nodeIndex: number, childIndex: number | null, patch: Partial<RuleCondition>) => {
    setDraft((current) => ({
      ...current,
      conditions: current.conditions.map((node, index) => {
        if (index !== nodeIndex) return node;
        if (childIndex === null && !isGroup(node)) return { ...node, ...patch };
        if (childIndex !== null && isGroup(node)) {
          return { ...node, conditions: node.conditions.map((child, i) => (i === childIndex ? { ...child, ...patch } : child)) };
        }
        return node;
      }),
    }));
    setPreview(null);
  };

  const removeNode = (nodeIndex: number) => {
    setDraft((current) => ({ ...current, conditions: current.conditions.filter((_, index) => index !== nodeIndex) }));
    setPreview(null);
  };

  const removeGroupChild = (nodeIndex: number, childIndex: number) => {
    setDraft((current) => ({
      ...current,
      conditions: current.conditions.map((node, index) => {
        if (index !== nodeIndex || !isGroup(node)) return node;
        const next = node.conditions.filter((_, i) => i !== childIndex);
        return { ...node, conditions: next.length ? next : [blankCondition()] };
      }),
    }));
    setPreview(null);
  };

  const previewRule = async () => {
    setBusy("preview");
    setError(null);
    try {
      const result = (await engineApi.post("/rules/preview", {
        conditions_op: draft.conditions_op,
        conditions: draft.conditions,
        actions: draft.actions,
        is_active: draft.is_active,
        apply_to_existing: draft.apply_to_existing,
        overwrite_existing_categories: draft.overwrite_existing_categories,
        limit: 20,
        offset: 0,
      })) as Preview;
      setPreview(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Rule preview failed.");
    } finally {
      setBusy(null);
    }
  };

  const saveRule = async (event: FormEvent) => {
    event.preventDefault();
    const endpoint = editingId ? `/rules/${editingId}` : "/rules";
    const action = editingId ? () => engineApi.patch(endpoint, draft) : () => engineApi.post(endpoint, draft);
    const result = await runMutation("save", action, editingId ? "Automation rule updated." : "Automation rule created.");
    if (result) resetEditor();
  };

  const toggleRule = async (rule: Rule) => {
    await runMutation(`toggle-${rule.id}`, () => engineApi.patch(`/rules/${rule.id}`, { is_active: !rule.is_active }), rule.is_active ? "Rule paused." : "Rule activated.");
  };

  const deleteRule = async (rule: Rule) => {
    if (!window.confirm(`Delete automation rule “${rule.name}”?`)) return;
    await runMutation(`delete-${rule.id}`, () => engineApi.delete(`/rules/${rule.id}`), "Automation rule deleted.");
  };

  const applyAll = async () => {
    const result = await runMutation("apply-all", () => engineApi.post("/rules/apply-all", {}), "All active rules re-applied to the transaction ledger.");
    if (result && typeof result === "object" && "applied" in result) setMessage(`Rules applied to ${String((result as { applied: unknown }).applied)} transaction(s).`);
  };

  const installPack = async (pack: RulePack) => {
    await runMutation(`pack-${pack.code}`, () => engineApi.post(`/rules/packs/${encodeURIComponent(pack.code)}/install?create_missing_categories=true`, {}), `${pack.name} automation pack installed.`);
  };

  const exportRules = async () => {
    setBusy("export");
    setError(null);
    try {
      const payload = await engineApi.get("/rules/export");
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "fincopilot-categorization-rules.json";
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to export rules.");
    } finally {
      setBusy(null);
    }
  };

  const importRules = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const parsed = JSON.parse(importText) as unknown;
      const result = await runMutation("import", () => engineApi.post("/rules/import", { payload: parsed, overwrite: overwriteImport }), "Rules imported.");
      if (result) {
        setImportOpen(false);
        setImportText("");
      }
    } catch {
      setError("Import file is not valid JSON.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/finance" className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent"><ArrowLeft className="w-3.5 h-3.5"/>Finance operations</Link>
          <p className="text-xs uppercase tracking-[.18em] text-accent mt-5">Money automation</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">Automation studio</h1>
          <p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Build nested transaction matching rules, preview their impact, apply them to history and move rule sets between FinCopilot workspaces.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={()=>setImportOpen((value)=>!value)} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2"><FileUp className="w-4 h-4"/>Import</button>
          <button onClick={exportRules} disabled={busy === "export"} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2 disabled:opacity-50"><Download className="w-4 h-4"/>Export</button>
          <button onClick={()=>{setDraft(blankDraft());setEditingId(null);setPreview(null);setEditorOpen(true);}} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2"><Plus className="w-4 h-4"/>New rule</button>
        </div>
      </header>

      <section className="grid sm:grid-cols-3 gap-3">
        <div className="premium-card p-5"><Settings2 className="w-5 h-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{rules.data?.length ?? 0}</p><p className="text-xs text-(--text-secondary) mt-1">Rules</p></div>
        <div className="premium-card p-5"><Play className="w-5 h-5 text-accent"/><p className="font-display text-3xl font-semibold mt-3">{activeCount}</p><p className="text-xs text-(--text-secondary) mt-1">Active automations</p></div>
        <button onClick={applyAll} disabled={busy === "apply-all"} className="premium-card p-5 text-left disabled:opacity-50"><WandSparkles className="w-5 h-5 text-accent"/><p className="font-display text-lg font-semibold mt-3">Apply all now</p><p className="text-xs text-(--text-secondary) mt-1">Re-run active rules across existing transactions.</p></button>
      </section>

      {message && <p className="text-sm text-emerald-400 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-3">{message}</p>}
      {error && <p className="text-sm text-red-400 rounded-xl border border-red-400/25 bg-red-400/5 p-3">{error}</p>}

      {importOpen && <form onSubmit={importRules} className="premium-card p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display font-semibold text-xl">Import rule bundle</h2><p className="text-xs text-(--text-secondary) mt-1">Paste a FinCopilot rule export JSON bundle.</p></div><button type="button" onClick={()=>setImportOpen(false)} className="size-10 rounded-xl border border-(--border) grid place-items-center"><X className="w-4 h-4"/></button></div><textarea required value={importText} onChange={(event)=>setImportText(event.target.value)} rows={10} className="w-full mt-4 p-3 font-mono text-xs rounded-xl border border-(--border) bg-(--surface)" placeholder='{"format":"fincopilot-categorization-rules", ...}'/><label className="flex items-center gap-2 text-sm mt-3"><input type="checkbox" checked={overwriteImport} onChange={(event)=>setOverwriteImport(event.target.checked)}/>Overwrite rules with matching names</label><button disabled={busy === "import"} className="mt-4 min-h-11 px-4 rounded-xl bg-accent text-white disabled:opacity-50">{busy === "import" ? "Importing…" : "Import rules"}</button></form>}

      {editorOpen && <form onSubmit={saveRule} className="premium-card p-5 sm:p-6 border border-accent/25">
        <div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[.18em] text-accent">{editingId ? "Edit automation" : "New automation"}</p><h2 className="font-display font-semibold text-xl mt-1">Rule builder</h2></div><button type="button" onClick={resetEditor} className="size-10 rounded-xl border border-(--border) grid place-items-center"><X className="w-4 h-4"/></button></div>
        <div className="grid sm:grid-cols-[1fr_10rem_10rem] gap-3 mt-5"><input required value={draft.name} onChange={(event)=>setDraft((current)=>({...current,name:event.target.value}))} placeholder="Rule name" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><select value={draft.conditions_op} onChange={(event)=>setDraft((current)=>({...current,conditions_op:event.target.value as "and"|"or"}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="and">Match ALL</option><option value="or">Match ANY</option></select><input type="number" value={draft.priority} onChange={(event)=>setDraft((current)=>({...current,priority:Number(event.target.value)}))} placeholder="Priority" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/></div>

        <div className="mt-6"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-semibold">Conditions</h3><p className="text-xs text-(--text-secondary)">Nested groups support mixed AND / OR logic.</p></div><div className="flex gap-2"><button type="button" onClick={()=>setDraft((current)=>({...current,conditions:[...current.conditions,blankCondition()]}))} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">+ Condition</button><button type="button" onClick={()=>setDraft((current)=>({...current,conditions:[...current.conditions,{op:"or",conditions:[blankCondition(),blankCondition()]}]}))} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">+ AND/OR group</button></div></div>
          <div className="grid gap-3 mt-4">{draft.conditions.map((node,nodeIndex)=> isGroup(node) ? <div key={`group-${nodeIndex}`} className="rounded-xl border border-(--border) p-3 bg-(--surface-subtle)"><div className="flex justify-between gap-2"><select value={node.op} onChange={(event)=>setDraft((current)=>({...current,conditions:current.conditions.map((candidate,index)=>index===nodeIndex&&isGroup(candidate)?{...candidate,op:event.target.value as "and"|"or"}:candidate)}))} className="min-h-9 px-3 rounded-lg border border-(--border) bg-(--surface)"><option value="and">Group: ALL</option><option value="or">Group: ANY</option></select><div className="flex gap-2"><button type="button" onClick={()=>setDraft((current)=>({...current,conditions:current.conditions.map((candidate,index)=>index===nodeIndex&&isGroup(candidate)?{...candidate,conditions:[...candidate.conditions,blankCondition()]}:candidate)}))} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">+ Inside</button><button type="button" onClick={()=>removeNode(nodeIndex)} className="size-9 rounded-lg border border-red-400/20 text-red-400 grid place-items-center"><Trash2 className="w-3.5 h-3.5"/></button></div></div><div className="grid gap-2 mt-3">{node.conditions.map((condition,childIndex)=><ConditionEditor key={`${nodeIndex}-${childIndex}`} condition={condition} onChange={(patch)=>updateLeaf(nodeIndex,childIndex,patch)} onRemove={()=>removeGroupChild(nodeIndex,childIndex)}/>)}</div></div> : <ConditionEditor key={`condition-${nodeIndex}`} condition={node} onChange={(patch)=>updateLeaf(nodeIndex,null,patch)} onRemove={()=>removeNode(nodeIndex)}/>)}</div>
        </div>

        <div className="mt-6"><div className="flex items-center justify-between gap-2"><div><h3 className="font-semibold">Actions</h3><p className="text-xs text-(--text-secondary)">Executed in order when a transaction matches.</p></div><button type="button" onClick={()=>setDraft((current)=>({...current,actions:[...current.actions,{op:"set_category",value:""}]}))} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">+ Action</button></div><div className="grid gap-2 mt-4">{draft.actions.map((action,index)=><div key={`action-${index}`} className="grid sm:grid-cols-[14rem_1fr_2.5rem] gap-2"><select value={action.op} onChange={(event)=>setDraft((current)=>({...current,actions:current.actions.map((candidate,i)=>i===index?{...candidate,op:event.target.value}:candidate)}))} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)">{actionOperators.map((operator)=><option key={operator} value={operator}>{operator.replaceAll("_"," ")}</option>)}</select><input value={action.value} onChange={(event)=>setDraft((current)=>({...current,actions:current.actions.map((candidate,i)=>i===index?{...candidate,value:event.target.value}:candidate)}))} disabled={action.op === "ignore"} placeholder={action.op === "set_category" ? "Category UUID" : action.op === "set_payee" ? "Payee UUID" : "Value"} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface) disabled:opacity-50"/><button type="button" onClick={()=>setDraft((current)=>({...current,actions:current.actions.filter((_,i)=>i!==index)}))} className="size-11 rounded-xl border border-red-400/20 text-red-400 grid place-items-center"><Trash2 className="w-4 h-4"/></button></div>)}</div></div>

        <div className="grid sm:grid-cols-3 gap-3 mt-6"><Toggle label="Active" checked={draft.is_active} onChange={(value)=>setDraft((current)=>({...current,is_active:value}))}/><Toggle label="Apply to existing" checked={draft.apply_to_existing} onChange={(value)=>setDraft((current)=>({...current,apply_to_existing:value}))}/><Toggle label="Overwrite existing categories" checked={draft.overwrite_existing_categories} onChange={(value)=>setDraft((current)=>({...current,overwrite_existing_categories:value}))}/></div>
        <div className="flex flex-wrap justify-end gap-2 mt-6"><button type="button" onClick={previewRule} disabled={busy === "preview"} className="min-h-11 px-4 rounded-xl border border-(--border) flex items-center gap-2 disabled:opacity-50"><Eye className="w-4 h-4"/>{busy === "preview" ? "Previewing…" : "Preview impact"}</button><button type="submit" disabled={busy === "save"} className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4"/>{busy === "save" ? "Saving…" : "Save rule"}</button></div>
        {preview && <div className="mt-5 rounded-xl border border-(--border) overflow-hidden"><div className="p-4 bg-(--surface-subtle) flex flex-wrap gap-4 text-sm"><strong>{preview.matched} matches</strong><span>{preview.will_change} will change</span><span>{preview.will_apply ? "Will apply on save" : "Preview only with current flags"}</span></div><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-t border-(--border)"><th className="p-3 text-left">Date</th><th className="p-3 text-left">Transaction</th><th className="p-3 text-right">Amount</th><th className="p-3 text-left">Category change</th></tr></thead><tbody>{preview.sample.map((row)=><tr key={row.id} className="border-t border-(--border)"><td className="p-3">{row.date}</td><td className="p-3">{row.description}</td><td className="p-3 text-right">{row.currency} {row.amount.toLocaleString("en-IN")}</td><td className="p-3">{row.current_category_name ?? "None"} → {row.new_category_name ?? (row.will_change ? "Changed" : "No change")}</td></tr>)}</tbody></table></div></div>}
      </form>}

      <ResourceState loading={rules.loading} error={rules.error} retry={rules.reload}/>
      {rules.data && <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{rules.data.map((rule)=><article key={rule.id} className="premium-card p-5"><div className="flex items-start justify-between gap-3"><div><span className={`inline-flex px-2 py-1 rounded-lg text-[10px] uppercase tracking-[.12em] ${rule.is_active ? "bg-emerald-400/10 text-emerald-400" : "bg-(--surface-subtle) text-(--text-tertiary)"}`}>{rule.is_active ? "Active" : "Paused"}</span><h2 className="font-display font-semibold text-lg mt-3">{rule.name}</h2><p className="text-xs text-(--text-secondary) mt-1">Match {rule.conditions_op.toUpperCase()} · Priority {rule.priority}</p></div><WandSparkles className="w-5 h-5 text-accent"/></div><div className="mt-4 text-xs text-(--text-secondary)"><p>{rule.conditions.length} condition node(s)</p><p className="mt-1">{rule.actions.length} action(s)</p></div><div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-(--border)"><button onClick={()=>{setEditingId(rule.id);setDraft(ruleToDraft(rule));setPreview(null);setEditorOpen(true);window.scrollTo({top:0,behavior:"smooth"});}} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs">Edit</button><button onClick={()=>toggleRule(rule)} disabled={busy === `toggle-${rule.id}`} className="min-h-9 px-3 rounded-lg border border-(--border) text-xs disabled:opacity-50">{rule.is_active ? "Pause" : "Activate"}</button><button onClick={()=>deleteRule(rule)} disabled={busy === `delete-${rule.id}`} className="min-h-9 px-3 rounded-lg border border-red-400/20 text-red-400 text-xs disabled:opacity-50">Delete</button></div></article>)}{rules.data.length === 0 && <div className="premium-card p-10 text-center md:col-span-2 xl:col-span-3"><WandSparkles className="w-8 h-8 text-accent mx-auto"/><h2 className="font-semibold mt-4">No rules yet</h2><p className="text-sm text-(--text-secondary) mt-2">Build a rule or install a supported rule pack.</p></div>}</section>}

      <section><div className="mb-3"><h2 className="font-display font-semibold text-xl">Rule packs</h2><p className="text-sm text-(--text-secondary) mt-1">Engine-provided starter automations. Missing categories can be created automatically.</p></div><ResourceState loading={packs.loading} error={packs.error} retry={packs.reload}/>{packs.data && <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">{packs.data.map((pack)=><div key={pack.code} className="premium-card p-5 flex items-center justify-between gap-4"><div><p className="text-xl">{pack.flag}</p><h3 className="font-semibold mt-2">{pack.name}</h3><p className="text-xs text-(--text-secondary) mt-1">{pack.rule_count} rule(s)</p></div><button onClick={()=>installPack(pack)} disabled={pack.installed || busy === `pack-${pack.code}`} className="min-h-10 px-3 rounded-xl border border-(--border) text-xs disabled:opacity-50">{pack.installed ? "Installed" : busy === `pack-${pack.code}` ? "Installing…" : "Install"}</button></div>)}</div>}</section>
    </div>
  );
}

function ConditionEditor({ condition, onChange, onRemove }: { condition: RuleCondition; onChange: (patch: Partial<RuleCondition>) => void; onRemove: () => void }) {
  const operators = condition.field === "amount" ? numericOperators : textOperators;
  return <div className="grid sm:grid-cols-[11rem_11rem_1fr_2.5rem] gap-2"><select value={condition.field} onChange={(event)=>onChange({field:event.target.value,op:event.target.value === "amount" ? "equals" : "contains"})} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)">{conditionFields.map((field)=><option key={field} value={field}>{field.replaceAll("_"," ")}</option>)}</select><select value={condition.op} onChange={(event)=>onChange({op:event.target.value})} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)">{operators.map((operator)=><option key={operator} value={operator}>{operator.replaceAll("_"," ")}</option>)}</select><input required value={condition.value} onChange={(event)=>onChange({value:event.target.value})} placeholder="Match value" className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><button type="button" onClick={onRemove} className="size-11 rounded-xl border border-red-400/20 text-red-400 grid place-items-center"><Trash2 className="w-4 h-4"/></button></div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-3"><input type="checkbox" checked={checked} onChange={(event)=>onChange(event.target.checked)} className="size-4 accent-(--accent)"/><span className="text-sm">{label}</span></label>;
}
