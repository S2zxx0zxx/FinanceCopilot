"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, FileInput, Loader2, RotateCcw, UploadCloud, XCircle } from "lucide-react";
import { engineApi } from "@/lib/engine-api";

const FIELD_OPTIONS = [
  { key: "date", label: "Date" },
  { key: "description", label: "Description / merchant" },
  { key: "amount", label: "Amount" },
  { key: "type", label: "Debit / credit type" },
  { key: "currency", label: "Currency" },
  { key: "external_id", label: "External ID" },
  { key: "payee_raw", label: "Payee" },
  { key: "notes", label: "Notes" },
] as const;

type ImportTx = Record<string, any> & { excluded?: boolean };
type Preview = {
  transactions: ImportTx[];
  detected_format: string;
  csv_columns: string[];
  parse_error?: string | null;
  failed_rows: Array<{ line_number: number; description: string; raw_value: string; error_reason: string }>;
};
type Account = { id: string; name?: string; institution_name?: string; type?: string; currency?: string };
type ImportLog = Record<string, any>;

function list(value: any): any[] {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.items)) return value.items;
  if (Array.isArray(value?.accounts)) return value.accounts;
  if (Array.isArray(value?.import_logs)) return value.import_logs;
  if (Array.isArray(value?.logs)) return value.logs;
  return [];
}

function accountName(account: Account) {
  return account.name || account.institution_name || `Account ${account.id.slice(0, 8)}`;
}

export default function ImportCenterPage() {
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [logs, setLogs] = React.useState<ImportLog[]>([]);
  const [accountId, setAccountId] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<Preview | null>(null);
  const [mapping, setMapping] = React.useState<Record<string, string>>({});
  const [dateFormat, setDateFormat] = React.useState("");
  const [flipAmount, setFlipAmount] = React.useState(false);
  const [detectDuplicates, setDetectDuplicates] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [historyBusy, setHistoryBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const loadBasics = React.useCallback(async () => {
    setError(null);
    try {
      const [accountData, logData] = await Promise.all([
        engineApi.get<any>("/api/accounts"),
        engineApi.get<any>("/api/import-logs"),
      ]);
      const accountRows = list(accountData) as Account[];
      setAccounts(accountRows);
      setAccountId((current) => current || accountRows[0]?.id || "");
      setLogs(list(logData));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load import workspace.");
    }
  }, []);

  React.useEffect(() => { void loadBasics(); }, [loadBasics]);

  const runPreview = async (overrideMapping?: Record<string, string>) => {
    if (!file) return;
    setBusy(true); setError(null); setSuccess(null);
    try {
      const form = new FormData();
      form.append("file", file);
      if (dateFormat) form.append("date_format", dateFormat);
      form.append("flip_amount", String(flipAmount));
      const nextMapping = overrideMapping ?? mapping;
      const cleanMapping = Object.fromEntries(Object.entries(nextMapping).filter(([, column]) => column));
      if (Object.keys(cleanMapping).length) form.append("column_mapping", JSON.stringify(cleanMapping));
      const result = await engineApi.form<Preview>("/api/transactions/import/preview", form);
      setPreview({
        transactions: Array.isArray(result.transactions) ? result.transactions : [],
        detected_format: result.detected_format || "unknown",
        csv_columns: Array.isArray(result.csv_columns) ? result.csv_columns : [],
        parse_error: result.parse_error,
        failed_rows: Array.isArray(result.failed_rows) ? result.failed_rows : [],
      });
      if (result.csv_columns?.length && !Object.keys(mapping).length) {
        const suggested: Record<string, string> = {};
        for (const field of FIELD_OPTIONS) {
          const found = result.csv_columns.find((column) => column.toLowerCase().replace(/[^a-z]/g, "").includes(field.key.replace(/_/g, "")));
          if (found) suggested[field.key] = found;
        }
        setMapping(suggested);
      }
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "This file could not be previewed.");
    } finally { setBusy(false); }
  };

  const chooseFile = (next: File | null) => {
    setFile(next); setPreview(null); setMapping({}); setError(null); setSuccess(null);
  };

  const toggleTransaction = (index: number) => {
    setPreview((current) => current ? {
      ...current,
      transactions: current.transactions.map((transaction, txIndex) => txIndex === index ? { ...transaction, excluded: !transaction.excluded } : transaction),
    } : current);
  };

  const importNow = async () => {
    if (!preview || !accountId || !file) return;
    setBusy(true); setError(null); setSuccess(null);
    try {
      const result = await engineApi.post<any>("/api/transactions/import", {
        account_id: accountId,
        transactions: preview.transactions,
        filename: file.name,
        detected_format: preview.detected_format,
        detect_duplicates: detectDuplicates,
      });
      setSuccess(`Imported ${Number(result.imported || 0)} transaction${Number(result.imported || 0) === 1 ? "" : "s"}. ${Number(result.skipped || 0)} duplicate${Number(result.skipped || 0) === 1 ? "" : "s"} skipped.`);
      setFile(null); setPreview(null); setMapping({});
      if (fileRef.current) fileRef.current.value = "";
      await loadBasics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import could not be completed.");
    } finally { setBusy(false); }
  };

  const undoImport = async (id: string) => {
    if (!window.confirm("Undo this import? Transactions you manually changed are preserved.")) return;
    setHistoryBusy(true); setError(null);
    try {
      const result = await engineApi.delete<any>(`/api/import-logs/${id}`);
      setSuccess(`Import undone. ${Number(result?.undone ?? result?.deleted ?? 0)} transaction(s) removed${Number(result?.preserved ?? 0) ? `; ${result.preserved} manually changed record(s) preserved` : ""}.`);
      await loadBasics();
    } catch (err) { setError(err instanceof Error ? err.message : "Import could not be undone."); }
    finally { setHistoryBusy(false); }
  };

  const included = preview?.transactions.filter((transaction) => !transaction.excluded).length ?? 0;

  return (
    <div className="max-w-6xl flex flex-col gap-6 pb-12">
      <header className="flex items-start gap-3">
        <Link href="/finance" className="mt-1 grid size-10 place-items-center rounded-xl border border-(--border) hover:bg-(--surface-subtle)" aria-label="Back to money workspace"><ArrowLeft className="size-4" /></Link>
        <div><p className="text-xs uppercase tracking-[.18em] text-accent">Bring your data</p><h1 className="font-display text-3xl font-bold mt-1">Import center</h1><p className="text-sm text-(--text-secondary) mt-2 max-w-3xl">Preview before anything is saved. Import CSV, OFX/QFX, QIF or CAMT files, correct CSV columns when needed, exclude rows, detect duplicates and undo a previous import safely.</p></div>
      </header>

      {error && <div role="alert" className="rounded-2xl border border-(--negative) bg-(--surface) p-4 text-sm text-(--negative)">{error}</div>}
      {success && <div className="rounded-2xl border border-(--positive) bg-(--surface) p-4 text-sm text-(--positive) flex gap-2"><CheckCircle2 className="size-4 mt-0.5" />{success}</div>}

      <section className="premium-card p-5 sm:p-6">
        <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
          <div>
            <label className="text-sm font-medium">Destination account</label>
            <select value={accountId} onChange={(event) => setAccountId(event.target.value)} className="mt-2 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3">
              <option value="">Choose an account</option>
              {accounts.map((account) => <option key={account.id} value={account.id}>{accountName(account)}{account.currency ? ` · ${account.currency}` : ""}</option>)}
            </select>
            {!accounts.length && <p className="text-xs text-(--text-secondary) mt-2">Create an account first, then return here to import its statement.</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Statement file</label>
            <input ref={fileRef} type="file" accept=".csv,.ofx,.qfx,.qif,.xml,.camt,text/csv,application/xml" onChange={(event) => chooseFile(event.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
            <p className="text-xs text-(--text-secondary) mt-2">Accepted: CSV, OFX/QFX, QIF and CAMT/XML.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-(--border)">
          <label className="text-sm">Date format (optional)<select value={dateFormat} onChange={(event) => setDateFormat(event.target.value)} className="mt-2 w-full min-h-11 rounded-xl border border-(--border) bg-(--surface) px-3"><option value="">Auto detect</option><option value="%Y-%m-%d">YYYY-MM-DD</option><option value="%d/%m/%Y">DD/MM/YYYY</option><option value="%m/%d/%Y">MM/DD/YYYY</option><option value="%d-%m-%Y">DD-MM-YYYY</option></select></label>
          <label className="flex items-center gap-3 text-sm min-h-11 sm:mt-7"><input type="checkbox" checked={flipAmount} onChange={(event) => setFlipAmount(event.target.checked)} className="size-5 accent-(--accent)" />Flip amount signs</label>
          <label className="flex items-center gap-3 text-sm min-h-11 sm:mt-7"><input type="checkbox" checked={detectDuplicates} onChange={(event) => setDetectDuplicates(event.target.checked)} className="size-5 accent-(--accent)" />Skip likely duplicates</label>
        </div>

        <button disabled={!file || !accountId || busy} onClick={() => void runPreview()} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground disabled:opacity-50">{busy ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}Preview import</button>
      </section>

      {preview && (
        <section className="premium-card p-5 sm:p-6">
          <div className="flex flex-wrap justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">Detected format</p><h2 className="font-display text-xl font-semibold mt-1 uppercase">{preview.detected_format}</h2></div><div className="text-right"><p className="text-sm font-medium">{included} included · {preview.transactions.length - included} excluded</p><p className="text-xs text-(--text-secondary)">{preview.failed_rows.length} row issue(s)</p></div></div>

          {preview.detected_format === "csv" && (preview.parse_error || preview.csv_columns.length > 0) && (
            <div className="mt-5 rounded-2xl bg-(--surface-subtle) p-4">
              <h3 className="font-semibold">CSV column mapping</h3>
              {preview.parse_error && <p className="text-sm text-(--warning) mt-2">{preview.parse_error}</p>}
              <p className="text-xs text-(--text-secondary) mt-1">Map FinCopilot fields to the columns in your file, then refresh the preview.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                {FIELD_OPTIONS.map((field) => <label key={field.key} className="text-xs">{field.label}<select value={mapping[field.key] || ""} onChange={(event) => setMapping((current) => ({ ...current, [field.key]: event.target.value }))} className="mt-1 w-full min-h-10 rounded-lg border border-(--border) bg-(--surface) px-2"><option value="">Not mapped</option>{preview.csv_columns.map((column) => <option key={column} value={column}>{column}</option>)}</select></label>)}
              </div>
              <button disabled={busy} onClick={() => void runPreview(mapping)} className="mt-4 min-h-10 rounded-xl border border-(--border) px-4 text-sm hover:bg-(--surface)">Refresh mapped preview</button>
            </div>
          )}

          {preview.transactions.length > 0 && <div className="mt-5 overflow-x-auto rounded-2xl border border-(--border)"><table className="w-full min-w-[760px] text-sm"><thead className="bg-(--surface-subtle) text-left text-xs uppercase tracking-wider text-(--text-tertiary)"><tr><th className="p-3">Use</th><th className="p-3">Date</th><th className="p-3">Description</th><th className="p-3 text-right">Amount</th><th className="p-3">Currency</th><th className="p-3">Suggested category</th></tr></thead><tbody>{preview.transactions.map((transaction, index) => <tr key={`${transaction.date}-${transaction.description}-${index}`} className="border-t border-(--border)"><td className="p-3"><input aria-label={`Include row ${index + 1}`} type="checkbox" checked={!transaction.excluded} onChange={() => toggleTransaction(index)} className="size-5 accent-(--accent)" /></td><td className="p-3 whitespace-nowrap">{String(transaction.date || "—")}</td><td className="p-3 max-w-[340px] truncate">{String(transaction.description || transaction.payee_raw || "—")}</td><td className="p-3 text-right tabular-nums">{String(transaction.amount ?? "—")}</td><td className="p-3">{String(transaction.currency || "—")}</td><td className="p-3">{String(transaction.suggested_category_name || transaction.category_name || "Uncategorized")}</td></tr>)}</tbody></table></div>}

          {preview.failed_rows.length > 0 && <div className="mt-5"><h3 className="font-semibold flex items-center gap-2"><XCircle className="size-4 text-(--negative)" />Rows that need attention</h3><div className="mt-3 space-y-2">{preview.failed_rows.map((row, index) => <div key={`${row.line_number}-${index}`} className="rounded-xl bg-(--surface-subtle) p-3 text-sm"><p className="font-medium">Line {row.line_number}: {row.description || "Could not import"}</p><p className="text-xs text-(--negative) mt-1">{row.error_reason}</p>{row.raw_value && <p className="text-xs text-(--text-tertiary) mt-1 break-all">{row.raw_value}</p>}</div>)}</div></div>}

          <button disabled={busy || included === 0 || !accountId} onClick={() => void importNow()} className="mt-6 min-h-11 rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground disabled:opacity-50">{busy ? "Importing…" : `Import ${included} transaction${included === 1 ? "" : "s"}`}</button>
        </section>
      )}

      <section className="premium-card p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-widest text-(--text-tertiary)">History</p><h2 className="font-display text-xl font-semibold mt-1">Previous imports</h2></div><button onClick={() => void loadBasics()} className="min-h-10 rounded-xl border border-(--border) px-3 text-sm">Refresh</button></div>
        {!logs.length ? <div className="py-10 text-center"><FileInput className="size-8 mx-auto text-(--text-tertiary)" /><p className="text-sm text-(--text-secondary) mt-3">No imported statement history yet.</p></div> : <div className="mt-4 divide-y divide-(--border)">{logs.map((log) => { const id = String(log.id || log.import_log_id || ""); return <div key={id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><p className="font-medium text-sm">{String(log.filename || log.source || "Imported statement")}</p><p className="text-xs text-(--text-secondary) mt-1">{String(log.detected_format || log.format || "file").toUpperCase()} · {String(log.imported_count ?? log.transaction_count ?? log.count ?? "—")} transaction(s){log.created_at ? ` · ${new Date(String(log.created_at)).toLocaleString()}` : ""}</p></div>{id && <button disabled={historyBusy} onClick={() => void undoImport(id)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-(--border) px-3 text-sm text-(--negative) disabled:opacity-50"><RotateCcw className="size-4" />Undo import</button>}</div>; })}</div>}
      </section>
    </div>
  );
}
