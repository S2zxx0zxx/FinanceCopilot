"use client";

import { FormEvent, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Database,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import {
  ENGINE_MODULES,
  EngineFieldConfig,
  isEngineModuleKey,
} from "@/lib/engine-modules";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";

type FormValue = string | boolean;
type FormValues = Record<string, FormValue>;

function toRows(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object" && !Array.isArray(item),
    );
  }
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  for (const key of [
    "data",
    "items",
    "results",
    "connections",
    "workspaces",
    "currencies",
    "groups",
    "invoices",
    "categories",
    "payees",
    "assets",
    "rules",
    "logs",
  ]) {
    if (Array.isArray(obj[key])) return toRows(obj[key]);
  }
  return [obj];
}

function textValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);
  }
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

function emptyForm(fields: EngineFieldConfig[], editing: boolean): FormValues {
  return Object.fromEntries(
    fields
      .filter((field) => (editing ? !field.createOnly : !field.editOnly))
      .map((field) => [field.key, field.defaultValue ?? (field.type === "checkbox" ? false : "")]),
  );
}

function editForm(fields: EngineFieldConfig[], record: Record<string, unknown>): FormValues {
  const values = emptyForm(fields, true);
  for (const field of fields) {
    if (field.createOnly) continue;
    const value = record[field.key];
    if (field.type === "checkbox") {
      values[field.key] = Boolean(value);
    } else if (value !== null && value !== undefined) {
      values[field.key] = String(value);
    }
  }
  return values;
}

function payloadFrom(fields: EngineFieldConfig[], values: FormValues, editing: boolean) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    if (editing && field.createOnly) continue;
    if (!editing && field.editOnly) continue;
    const value = values[field.key];
    if (field.type === "checkbox") {
      payload[field.key] = Boolean(value);
      continue;
    }
    const normalized = typeof value === "string" ? value.trim() : value;
    if (normalized === "" || normalized === undefined) continue;
    if (field.type === "number") {
      const numberValue = Number(normalized);
      if (Number.isFinite(numberValue)) payload[field.key] = numberValue;
      continue;
    }
    payload[field.key] = normalized;
  }
  return payload;
}

function FinanceField({
  field,
  value,
  onChange,
}: {
  field: EngineFieldConfig;
  value: FormValue;
  onChange: (value: FormValue) => void;
}) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-(--accent)"
        />
        <span className="text-sm">{field.label}</span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label className="grid gap-1.5">
        <span className="text-xs text-(--text-secondary)">{field.label}</span>
        <select
          value={String(value ?? "")}
          required={field.required}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"
        >
          {field.options?.map((option) => (
            <option key={`${field.key}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="text-xs text-(--text-secondary)">{field.label}</span>
        <textarea
          value={String(value ?? "")}
          required={field.required}
          placeholder={field.placeholder}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
          className="px-3 py-2.5 rounded-xl border border-(--border) bg-(--surface) resize-y"
        />
      </label>
    );
  }

  return (
    <label className="grid gap-1.5">
      <span className="text-xs text-(--text-secondary)">{field.label}</span>
      <input
        type={field.type === "number" || field.type === "date" ? field.type : "text"}
        step={field.type === "number" ? "any" : undefined}
        value={String(value ?? "")}
        required={field.required}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"
      />
    </label>
  );
}

const hiddenKeys = new Set([
  "id",
  "workspace_id",
  "user_id",
  "created_by",
  "updated_by",
]);

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
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record<string, unknown> | null>(null);
  const [formValues, setFormValues] = useState<FormValues>({});
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const list = state.data ?? [];
    const needle = query.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((record) => JSON.stringify(record).toLowerCase().includes(needle));
  }, [state.data, query]);

  const visibleFields = useMemo(() => {
    if (!config?.crud) return [];
    return config.crud.fields.filter((field) =>
      editingRecord ? !field.createOnly : !field.editOnly,
    );
  }, [config, editingRecord]);

  const closeForm = () => {
    setFormOpen(false);
    setEditingRecord(null);
    setFormValues({});
    setMutationError(null);
  };

  const startCreate = () => {
    if (!config?.crud) return;
    setEditingRecord(null);
    setFormValues(emptyForm(config.crud.fields, false));
    setMutationError(null);
    setFormOpen(true);
  };

  const startEdit = (record: Record<string, unknown>) => {
    if (!config?.crud) return;
    setEditingRecord(record);
    setFormValues(editForm(config.crud.fields, record));
    setMutationError(null);
    setFormOpen(true);
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config?.crud) return;
    const editing = Boolean(editingRecord);
    const id = editingRecord?.id;
    if (editing && (typeof id !== "string" && typeof id !== "number")) {
      setMutationError("This record cannot be edited because its identifier is missing.");
      return;
    }
    setSaving(true);
    setMutationError(null);
    try {
      const payload = payloadFrom(config.crud.fields, formValues, editing);
      if (editing) {
        await engineApi.patch(`${config.endpoint}/${String(id)}`, payload);
      } else {
        await engineApi.post(config.endpoint, payload);
      }
      closeForm();
      state.reload();
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to save this record.");
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (record: Record<string, unknown>) => {
    if (!config?.crud?.delete) return;
    const id = record.id;
    if (typeof id !== "string" && typeof id !== "number") return;
    const title = pick(record, config.titleKeys, "this record");
    if (!window.confirm(`Delete ${title}? This action cannot be undone.`)) return;
    setDeletingId(String(id));
    setMutationError(null);
    try {
      await engineApi.delete(`${config.endpoint}/${String(id)}`);
      state.reload();
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : "Unable to delete this record.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!config) {
    return (
      <div className="max-w-3xl premium-card p-8">
        <h1 className="text-2xl font-display font-bold">Finance module not found</h1>
        <p className="mt-2 text-sm text-(--text-secondary)">This FinCopilot module is not registered.</p>
        <Link href="/finance" className="inline-flex mt-5 text-accent">
          Back to Finance operations
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl pb-12">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/finance"
            className="inline-flex items-center gap-2 text-xs text-(--text-secondary) hover:text-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />Finance operations
          </Link>
          <p className="text-xs uppercase tracking-[.18em] text-accent mt-5">{config.eyebrow}</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">{config.title}</h1>
          <p className="text-sm text-(--text-secondary) mt-2 max-w-2xl">{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.crud?.create && (
            <button
              onClick={startCreate}
              className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />Add new
            </button>
          )}
          <button
            onClick={state.reload}
            disabled={state.loading}
            className="min-h-11 px-4 rounded-xl border border-(--border) bg-(--surface) flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${state.loading ? "animate-spin" : ""}`} />Refresh
          </button>
        </div>
      </header>

      <section className="grid sm:grid-cols-3 gap-3">
        <div className="premium-card p-5">
          <Database className="w-5 h-5 text-accent" />
          <p className="font-display text-3xl font-semibold mt-3">{state.data?.length ?? 0}</p>
          <p className="text-xs text-(--text-secondary) mt-1">Live engine records</p>
        </div>
        <div className="premium-card p-5">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <p className="font-display text-lg font-semibold mt-3">Workspace scoped</p>
          <p className="text-xs text-(--text-secondary) mt-1">Authorisation is enforced by the FastAPI engine</p>
        </div>
        <div className="premium-card p-5">
          <RefreshCw className="w-5 h-5 text-accent" />
          <p className="font-display text-lg font-semibold mt-3">Live data</p>
          <p className="text-xs text-(--text-secondary) mt-1">No demo or duplicated frontend store</p>
        </div>
      </section>

      {formOpen && config.crud && (
        <section className="premium-card p-5 sm:p-6 border border-accent/30">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[.18em] text-accent">
                {editingRecord ? "Edit record" : "New record"}
              </p>
              <h2 className="font-display text-xl font-semibold mt-1">
                {editingRecord ? `Update ${config.title.replace(/s$/, "")}` : `Add ${config.title.replace(/s$/, "")}`}
              </h2>
            </div>
            <button
              type="button"
              onClick={closeForm}
              className="size-10 grid place-items-center rounded-xl border border-(--border)"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={submitForm} className="grid sm:grid-cols-2 gap-4">
            {visibleFields.map((field) => (
              <FinanceField
                key={field.key}
                field={field}
                value={formValues[field.key] ?? (field.type === "checkbox" ? false : "")}
                onChange={(value) =>
                  setFormValues((current) => ({ ...current, [field.key]: value }))
                }
              />
            ))}
            {mutationError && (
              <p className="sm:col-span-2 text-sm text-red-400 rounded-xl border border-red-400/25 bg-red-400/5 p-3">
                {mutationError}
              </p>
            )}
            <div className="sm:col-span-2 flex flex-wrap justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeForm}
                className="min-h-11 px-4 rounded-xl border border-(--border)"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 px-4 rounded-xl bg-accent text-white flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </section>
      )}

      {!formOpen && mutationError && (
        <p className="text-sm text-red-400 rounded-xl border border-red-400/25 bg-red-400/5 p-3">
          {mutationError}
        </p>
      )}

      <label className="relative max-w-xl">
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-(--text-tertiary)" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}`}
          className="w-full min-h-11 pl-10 pr-3 rounded-xl bg-(--surface) border border-(--border)"
        />
      </label>
      <ResourceState loading={state.loading} error={state.error} retry={state.reload} />

      {state.data && filtered.length === 0 && (
        <div className="premium-card p-10 text-center">
          <Database className="w-8 h-8 mx-auto text-accent" />
          <h2 className="font-semibold mt-4">{query ? "No matching records" : config.emptyTitle}</h2>
          <p className="text-sm text-(--text-secondary) mt-2">
            {query ? "Try another search." : config.emptyDescription}
          </p>
          {!query && config.crud?.create && (
            <button
              onClick={startCreate}
              className="inline-flex items-center gap-2 mt-5 min-h-10 px-4 rounded-xl bg-accent text-white"
            >
              <Plus className="w-4 h-4" />Add first record
            </button>
          )}
        </div>
      )}

      {filtered.length > 0 && (
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((record, index) => {
            const title = pick(record, config.titleKeys, `${config.title.replace(/s$/, "")} ${index + 1}`);
            const subtitle = pick(record, config.subtitleKeys, "Finance engine record");
            const fields = Object.entries(record)
              .filter(
                ([key, value]) =>
                  !hiddenKeys.has(key) &&
                  !config.titleKeys.includes(key) &&
                  value !== null &&
                  value !== undefined &&
                  typeof value !== "object",
              )
              .slice(0, 6);
            const recordId = record.id;
            const canMutate = typeof recordId === "string" || typeof recordId === "number";
            return (
              <article key={String(record.id ?? `${moduleKey}-${index}`)} className="premium-card p-5 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display font-semibold text-lg truncate">{title}</h2>
                    <p className="text-xs text-(--text-secondary) mt-1 truncate">{subtitle}</p>
                  </div>
                  <span className="w-2.5 h-2.5 mt-2 rounded-full bg-accent shrink-0" />
                </div>
                <dl className="mt-5 space-y-2">
                  {fields.map(([key, value]) => (
                    <div key={key} className="flex items-start justify-between gap-4 text-xs">
                      <dt className="text-(--text-tertiary) capitalize">{key.replaceAll("_", " ")}</dt>
                      <dd className="text-right text-(--text-secondary) max-w-[60%] break-words">{textValue(value)}</dd>
                    </div>
                  ))}
                </dl>
                {config.crud && canMutate && (config.crud.edit || config.crud.delete) && (
                  <div className="flex gap-2 mt-5 pt-4 border-t border-(--border)">
                    {config.crud.edit && (
                      <button
                        onClick={() => startEdit(record)}
                        className="min-h-9 px-3 rounded-lg border border-(--border) text-xs flex items-center gap-1.5"
                      >
                        <Pencil className="w-3.5 h-3.5" />Edit
                      </button>
                    )}
                    {config.crud.delete && (
                      <button
                        onClick={() => deleteRecord(record)}
                        disabled={deletingId === String(recordId)}
                        className="min-h-9 px-3 rounded-lg border border-red-400/25 text-red-400 text-xs flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {deletingId === String(recordId) ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
