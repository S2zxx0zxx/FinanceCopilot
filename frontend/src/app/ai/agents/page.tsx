"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Brain, CheckCircle2, KeyRound, Loader2, Plus, PlugZap, Trash2, UploadCloud, Wrench } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

type Agent = { id: string; name: string; description?: string | null; system_prompt: string; icon: string; color: string; connection_id?: string | null; provider?: string | null; model?: string | null; temperature: number; max_history_messages: number; top_n: number; similarity_threshold: number; auto_context: boolean; is_archived: boolean; is_default: boolean; conversation_count: number; knowledge_count: number };
type LlmConnection = { id: string; name: string; kind: string; base_url?: string | null; default_model?: string | null; is_default: boolean; has_api_key: boolean };
type Tool = { server: string; name: string; description?: string | null; enabled: boolean; is_proposal?: boolean };
type Knowledge = { id: string; title: string; source: string; mime: string; size_bytes: number; status: string; error?: string | null; chunk_count: number; pinned: boolean; created_at?: string | null };

type Info = { enabled: boolean; providers: any[]; mcp_external_ttl_days: number; external_mcp_url?: string; extra_mcp_servers_configured?: boolean };

export default function AgentStudioPage() {
  const uploadRef = React.useRef<HTMLInputElement>(null);
  const [info, setInfo] = React.useState<Info | null>(null);
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [connections, setConnections] = React.useState<LlmConnection[]>([]);
  const [selectedId, setSelectedId] = React.useState("");
  const [tools, setTools] = React.useState<Tool[]>([]);
  const [knowledge, setKnowledge] = React.useState<Knowledge[]>([]);
  const [newName, setNewName] = React.useState("Money copilot");
  const [connName, setConnName] = React.useState("");
  const [connKind, setConnKind] = React.useState("openai");
  const [connBaseUrl, setConnBaseUrl] = React.useState("");
  const [connKey, setConnKey] = React.useState("");
  const [connModel, setConnModel] = React.useState("");
  const [mcpToken, setMcpToken] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);
  const [featureUnavailable, setFeatureUnavailable] = React.useState(false);

  const load = React.useCallback(async () => {
    setError(null);
    try {
      const [infoResult, agentResult, connectionResult] = await Promise.all([
        engineApi.get<Info>("/api/agents/info"),
        engineApi.get<Agent[]>("/api/agents"),
        engineApi.get<LlmConnection[]>("/api/agents/connections"),
      ]);
      setInfo(infoResult); setFeatureUnavailable(false);
      setAgents(Array.isArray(agentResult) ? agentResult : []);
      setConnections(Array.isArray(connectionResult) ? connectionResult : []);
      setSelectedId((current) => current && agentResult.some((agent) => agent.id === current) ? current : agentResult.find((agent) => agent.is_default)?.id || agentResult[0]?.id || "");
    } catch (err: any) {
      if (err?.status === 404 || String(err?.message || "").includes("404")) setFeatureUnavailable(true);
      else setError(err instanceof Error ? err.message : "Agent Studio could not load.");
    }
  }, []);
  React.useEffect(() => { void load(); }, [load]);

  React.useEffect(() => {
    if (!selectedId) { setTools([]); setKnowledge([]); return; }
    let active = true;
    Promise.allSettled([
      engineApi.get<any>(`/api/agents/${selectedId}/tools`),
      engineApi.get<any>(`/api/agents/${selectedId}/knowledge`),
    ]).then((results) => {
      if (!active) return;
      if (results[0].status === "fulfilled") setTools(Array.isArray(results[0].value?.tools) ? results[0].value.tools : []);
      if (results[1].status === "fulfilled") setKnowledge(Array.isArray(results[1].value?.items) ? results[1].value.items : []);
    });
    return () => { active = false; };
  }, [selectedId]);

  const selected = agents.find((agent) => agent.id === selectedId);

  const createAgent = async (event: React.FormEvent) => {
    event.preventDefault(); if (!newName.trim()) return; setBusy(true); setError(null); setMessage(null);
    try { const created = await engineApi.post<Agent>("/api/agents", { name: newName.trim(), description: "FinCopilot financial agent", system_prompt: "Help the user understand and manage their finances accurately. Use tools when useful, explain uncertainty, and never invent financial records.", icon: "bot", color: "#7c3aed", temperature: 0.4, max_history_messages: 20, top_n: 6, similarity_threshold: 0.25, auto_context: true, is_default: agents.length === 0 }); setAgents((current) => [...current, created]); setSelectedId(created.id); setNewName(""); setMessage("Agent created."); }
    catch (err) { setError(err instanceof Error ? err.message : "Agent could not be created."); }
    finally { setBusy(false); }
  };
  const updateAgent = async (patch: Record<string, unknown>) => {
    if (!selected) return; setBusy(true); setError(null);
    try { const updated = await engineApi.patch<Agent>(`/api/agents/${selected.id}`, patch); setAgents((current) => current.map((agent) => agent.id === updated.id ? updated : agent)); setMessage("Agent settings saved."); }
    catch (err) { setError(err instanceof Error ? err.message : "Agent settings could not be saved."); }
    finally { setBusy(false); }
  };
  const deleteAgent = async () => {
    if (!selected || !window.confirm(`Archive or delete “${selected.name}”?`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/agents/${selected.id}`); setMessage("Agent removed."); setSelectedId(""); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Agent could not be removed."); }
    finally { setBusy(false); }
  };
  const saveTools = async (nextTools: Tool[]) => {
    if (!selected) return; setTools(nextTools); setBusy(true); setError(null);
    try { await engineApi.put(`/api/agents/${selected.id}/tools`, nextTools.map((tool) => ({ server: tool.server, tool_name: tool.name, enabled: tool.enabled }))); setMessage("Agent tool access updated."); }
    catch (err) { setError(err instanceof Error ? err.message : "Tool permissions could not be saved."); }
    finally { setBusy(false); }
  };

  const createConnection = async (event: React.FormEvent) => {
    event.preventDefault(); if (!connName.trim()) return; setBusy(true); setError(null);
    try { await engineApi.post("/api/agents/connections", { name: connName.trim(), kind: connKind, base_url: connBaseUrl.trim() || null, api_key: connKey || null, default_model: connModel.trim() || null, extra: {}, is_default: connections.length === 0 }); setConnName(""); setConnBaseUrl(""); setConnKey(""); setConnModel(""); setMessage("Model connection added."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Model connection could not be added."); }
    finally { setBusy(false); }
  };
  const testConnection = async (connection: LlmConnection) => {
    setBusy(true); setError(null);
    try { const result = await engineApi.post<any>(`/api/agents/connections/${connection.id}/test`); setMessage(result.ok ? `${connection.name}: ${result.detail || "connection works"}` : `${connection.name}: ${result.detail || "test failed"}`); }
    catch (err) { setError(err instanceof Error ? err.message : "Connection test failed."); }
    finally { setBusy(false); }
  };
  const removeConnection = async (connection: LlmConnection) => {
    if (!window.confirm(`Delete model connection “${connection.name}”?`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/agents/connections/${connection.id}`); setMessage("Model connection removed."); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Connection could not be removed."); }
    finally { setBusy(false); }
  };

  const uploadKnowledge = async (file: File | null) => {
    if (!selected || !file) return; setBusy(true); setError(null);
    try { const form = new FormData(); form.append("file", file); form.append("pinned", "false"); await engineApi.form(`/api/agents/${selected.id}/knowledge`, form); setMessage("Knowledge file uploaded and queued for indexing."); const result = await engineApi.get<any>(`/api/agents/${selected.id}/knowledge`); setKnowledge(Array.isArray(result?.items) ? result.items : []); }
    catch (err) { setError(err instanceof Error ? err.message : "Knowledge file could not be uploaded."); }
    finally { setBusy(false); if (uploadRef.current) uploadRef.current.value = ""; }
  };
  const pinKnowledge = async (doc: Knowledge) => {
    if (!selected) return; setBusy(true); setError(null);
    try { const updated = await engineApi.patch<Knowledge>(`/api/agents/${selected.id}/knowledge/${doc.id}/pin?pinned=${String(!doc.pinned)}`); setKnowledge((current) => current.map((item) => item.id === doc.id ? updated : item)); }
    catch (err) { setError(err instanceof Error ? err.message : "Knowledge pin could not be changed."); }
    finally { setBusy(false); }
  };
  const deleteKnowledge = async (doc: Knowledge) => {
    if (!selected || !window.confirm(`Remove “${doc.title}” from this agent's knowledge?`)) return; setBusy(true); setError(null);
    try { await engineApi.delete(`/api/agents/${selected.id}/knowledge/${doc.id}`); setKnowledge((current) => current.filter((item) => item.id !== doc.id)); }
    catch (err) { setError(err instanceof Error ? err.message : "Knowledge file could not be removed."); }
    finally { setBusy(false); }
  };
  const mintMcpToken = async () => {
    setBusy(true); setError(null); setMcpToken(null);
    try { const result = await engineApi.post<any>("/api/agents/mcp-tokens"); setMcpToken(result.token); setMessage(`External MCP token created for ${result.workspace_name}. It expires in ${result.expires_in_days} day(s).`); }
    catch (err) { setError(err instanceof Error ? err.message : "External MCP token could not be created."); }
    finally { setBusy(false); }
  };

  if (featureUnavailable) return <div className="max-w-4xl"><header className="flex gap-3"><Link href="/ai" className="grid size-10 place-items-center rounded-xl border border-(--border)"><ArrowLeft className="size-4" /></Link><div><h1 className="font-display text-3xl font-bold">Agent studio</h1><p className="text-sm text-(--text-secondary) mt-2">Agent Studio is installed but disabled on this deployment. Enable <code>AGENTS_ENABLED=true</code> and the agents service profile to use model connections, MCP tools and knowledge/RAG.</p></div></header></div>;

  return <div className="max-w-7xl flex flex-col gap-6 pb-12">
    <header className="flex gap-3 items-start"><Link href="/ai" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border)" aria-label="Back"><ArrowLeft className="size-4" /></Link><div><p className="text-xs uppercase tracking-[.18em] text-accent">Copilot studio</p><h1 className="font-display text-3xl font-bold mt-1">Agent studio</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Build specialised financial copilots, choose their model connection, control MCP tools and give each agent its own private knowledge base.</p></div></header>
    {error && <div role="alert" className="rounded-2xl border border-(--negative) p-4 text-sm text-(--negative)">{error}</div>}
    {message && <div className="rounded-2xl border border-(--positive) p-4 text-sm text-(--positive) flex gap-2"><CheckCircle2 className="size-4" />{message}</div>}

    <div className="grid xl:grid-cols-[280px_1fr] gap-5">
      <aside className="premium-card p-4 h-fit"><div className="flex items-center gap-2"><Bot className="size-5 text-accent" /><h2 className="font-semibold">Agents</h2></div><div className="mt-3 space-y-2">{agents.map((agent) => <button key={agent.id} onClick={() => setSelectedId(agent.id)} className={`w-full text-left rounded-xl border p-3 ${selectedId === agent.id ? "border-accent bg-(--surface-subtle)" : "border-(--border)"}`}><div className="flex justify-between gap-2"><p className="font-medium truncate">{agent.name}</p>{agent.is_default && <span className="text-[10px] text-accent">DEFAULT</span>}</div><p className="text-xs text-(--text-secondary) mt-1">{agent.conversation_count} chats · {agent.knowledge_count} docs</p></button>)}</div><form onSubmit={createAgent} className="mt-4 pt-4 border-t border-(--border)"><input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Agent name" maxLength={120} className="w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /><button disabled={busy || !newName.trim()} className="mt-2 inline-flex min-h-10 items-center gap-2 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50"><Plus className="size-4" />New agent</button></form></aside>

      <main className="space-y-5">{selected ? <>
        <section className="premium-card p-5 sm:p-6"><div className="flex justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">Agent profile</p><h2 className="font-display text-2xl font-semibold mt-1">{selected.name}</h2></div><button disabled={busy} onClick={() => void deleteAgent()} className="grid size-10 place-items-center rounded-xl border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button></div><div className="grid sm:grid-cols-2 gap-4 mt-5"><label className="text-xs">Name<input defaultValue={selected.name} onBlur={(event) => { if (event.target.value.trim() && event.target.value !== selected.name) void updateAgent({ name: event.target.value.trim() }); }} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Model connection<select value={selected.connection_id || ""} onChange={(event) => void updateAgent({ connection_id: event.target.value || null })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">Deployment default</option>{connections.map((connection) => <option key={connection.id} value={connection.id}>{connection.name}{connection.default_model ? ` · ${connection.default_model}` : ""}</option>)}</select></label><label className="text-xs">Model override<input defaultValue={selected.model || ""} onBlur={(event) => { if (event.target.value !== (selected.model || "")) void updateAgent({ model: event.target.value || null }); }} placeholder="Use connection default" className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Temperature<input type="number" min="0" max="2" step="0.1" defaultValue={selected.temperature} onBlur={(event) => void updateAgent({ temperature: Number(event.target.value) })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label></div><label className="block text-xs mt-4">System instructions<textarea defaultValue={selected.system_prompt} onBlur={(event) => { if (event.target.value !== selected.system_prompt) void updateAgent({ system_prompt: event.target.value }); }} rows={6} className="mt-1 w-full rounded-xl border border-(--border) bg-(--surface) p-3 text-sm" /></label><div className="grid sm:grid-cols-3 gap-3 mt-4"><label className="text-xs">History messages<input type="number" min="1" max="200" defaultValue={selected.max_history_messages} onBlur={(event) => void updateAgent({ max_history_messages: Number(event.target.value) })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Knowledge results<input type="number" min="0" max="50" defaultValue={selected.top_n} onBlur={(event) => void updateAgent({ top_n: Number(event.target.value) })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label><label className="text-xs">Similarity threshold<input type="number" min="0" max="1" step="0.05" defaultValue={selected.similarity_threshold} onBlur={(event) => void updateAgent({ similarity_threshold: Number(event.target.value) })} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-3" /></label></div><div className="flex flex-wrap gap-5 mt-4"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.auto_context} onChange={(event) => void updateAgent({ auto_context: event.target.checked })} className="size-4 accent-(--accent)" />Automatic financial context</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected.is_default} onChange={(event) => void updateAgent({ is_default: event.target.checked })} className="size-4 accent-(--accent)" />Default agent</label></div></section>

        <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><Wrench className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">MCP tools</h2></div><p className="text-sm text-(--text-secondary) mt-2">Choose exactly which financial tools this agent may use. Proposal tools can prepare changes for review rather than silently changing records.</p><div className="grid sm:grid-cols-2 gap-2 mt-4">{tools.map((tool, index) => <label key={`${tool.server}-${tool.name}`} className="rounded-xl border border-(--border) p-3 flex gap-3"><input type="checkbox" checked={tool.enabled} onChange={(event) => { const next = tools.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: event.target.checked } : item); void saveTools(next); }} className="mt-0.5 size-4 accent-(--accent)" /><span><span className="font-medium text-sm">{tool.name}</span><span className="block text-[10px] uppercase tracking-wider text-(--text-tertiary) mt-1">{tool.server}{tool.is_proposal ? " · proposal" : ""}</span>{tool.description && <span className="block text-xs text-(--text-secondary) mt-1">{tool.description}</span>}</span></label>)}{!tools.length && <p className="text-sm text-(--text-tertiary)">No MCP tools discovered. Start the MCP service or configure an extra MCP server.</p>}</div></section>

        <section className="premium-card p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Brain className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Knowledge base</h2></div><><input ref={uploadRef} type="file" className="hidden" onChange={(event) => void uploadKnowledge(event.target.files?.[0] || null)} /><button disabled={busy} onClick={() => uploadRef.current?.click()} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm"><UploadCloud className="size-4" />Upload</button></></div><div className="mt-4 space-y-2">{knowledge.map((doc) => <div key={doc.id} className="rounded-xl border border-(--border) p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div className="min-w-0"><p className="font-medium text-sm truncate">{doc.title}</p><p className="text-xs text-(--text-secondary) mt-1">{doc.status} · {doc.chunk_count} chunks · {Math.max(1, Math.round(doc.size_bytes / 1024))} KB{doc.pinned ? " · pinned" : ""}</p>{doc.error && <p className="text-xs text-(--negative) mt-1">{doc.error}</p>}</div><div className="flex gap-2"><button disabled={busy} onClick={() => void pinKnowledge(doc)} className="min-h-9 rounded-lg border border-(--border) px-3 text-xs">{doc.pinned ? "Unpin" : "Pin"}</button><button disabled={busy} onClick={() => void deleteKnowledge(doc)} className="grid size-9 place-items-center rounded-lg border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button></div></div>)}{!knowledge.length && <p className="text-sm text-(--text-tertiary)">No private knowledge files for this agent yet.</p>}</div></section>
      </> : <div className="premium-card p-10 text-center"><Bot className="size-10 mx-auto text-(--text-tertiary)" /><p className="text-sm text-(--text-secondary) mt-3">Create an agent to configure its model, tools and knowledge.</p></div>}

      <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><PlugZap className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">Model connections</h2></div><div className="mt-4 space-y-2">{connections.map((connection) => <div key={connection.id} className="rounded-xl border border-(--border) p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="font-medium text-sm">{connection.name}{connection.is_default ? " · default" : ""}</p><p className="text-xs text-(--text-secondary) mt-1">{connection.kind}{connection.default_model ? ` · ${connection.default_model}` : ""}{connection.has_api_key ? " · key saved" : ""}</p></div><div className="flex gap-2"><button disabled={busy} onClick={() => void testConnection(connection)} className="min-h-9 rounded-lg border border-(--border) px-3 text-xs">Test</button><button disabled={busy} onClick={() => void removeConnection(connection)} className="grid size-9 place-items-center rounded-lg border border-(--border) text-(--negative)"><Trash2 className="size-4" /></button></div></div>)}</div><form onSubmit={createConnection} className="mt-5 pt-5 border-t border-(--border)"><div className="grid sm:grid-cols-2 gap-3"><input required value={connName} onChange={(event) => setConnName(event.target.value)} placeholder="Connection name" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><select value={connKind} onChange={(event) => setConnKind(event.target.value)} className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="openai">OpenAI</option><option value="anthropic">Anthropic</option><option value="ollama">Ollama</option><option value="openai_compatible">OpenAI-compatible</option></select><input value={connModel} onChange={(event) => setConnModel(event.target.value)} placeholder="Default model" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><input value={connBaseUrl} onChange={(event) => setConnBaseUrl(event.target.value)} placeholder="Base URL (optional)" className="min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /><input type="password" value={connKey} onChange={(event) => setConnKey(event.target.value)} placeholder="API key (never returned after save)" className="sm:col-span-2 min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3" /></div><button disabled={busy || !connName.trim()} className="mt-3 min-h-10 rounded-xl bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-50">Add model connection</button></form></section>

      <section className="premium-card p-5 sm:p-6"><div className="flex items-center gap-2"><KeyRound className="size-5 text-accent" /><h2 className="font-display text-xl font-semibold">External MCP access</h2></div><p className="text-sm text-(--text-secondary) mt-2">Create a workspace-scoped token for an external MCP client. Treat it like a password: it can use the tools allowed by your MCP server and is shown only when created.</p><button disabled={busy} onClick={() => void mintMcpToken()} className="mt-4 min-h-10 rounded-xl border border-(--border) px-4 text-sm">Create MCP token</button>{mcpToken && <div className="mt-4"><p className="text-xs font-medium">Copy now — FinCopilot will not store this token in the browser.</p><textarea readOnly value={mcpToken} rows={5} className="mt-2 w-full rounded-xl border border-(--border) bg-(--surface-subtle) p-3 font-mono text-xs" /><p className="text-xs text-(--text-secondary) mt-2">Server: {info?.external_mcp_url || "Use this deployment's configured MCP URL"}</p></div>}</section>
      </main>
    </div>
  </div>;
}
