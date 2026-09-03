"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  FileText,
  FileJson,
  FileSpreadsheet,
  ShieldCheck,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { formatDate } from "@/lib/format";

// ── Types ──────────────────────────────────────────────────────────────────

type ExportFormat = "csv" | "json" | "pdf";

interface ExportHistoryEntry {
  id: string;
  date: string;
  format: ExportFormat;
  size: string;
  status: "ready" | "processing";
}

const MOCK_HISTORY: ExportHistoryEntry[] = [
  {
    id: "exp_001",
    date: "2026-08-28T09:30:00Z",
    format: "csv",
    size: "1.2 MB",
    status: "ready",
  },
  {
    id: "exp_002",
    date: "2026-07-15T14:22:00Z",
    format: "pdf",
    size: "842 KB",
    status: "ready",
  },
];

const FORMAT_CONFIG: Record<
  ExportFormat,
  { label: string; desc: string; icon: React.ReactNode }
> = {
  csv: {
    label: "CSV",
    desc: "Spreadsheet-friendly",
    icon: <FileSpreadsheet className="w-4 h-4" />,
  },
  json: {
    label: "JSON",
    desc: "Structured / developer",
    icon: <FileJson className="w-4 h-4" />,
  },
  pdf: {
    label: "PDF",
    desc: "Printable report",
    icon: <FileText className="w-4 h-4" />,
  },
};

// ── Page ────────────────────────────────────────────────────────────────────

export default function ExportPage() {
  const [format, setFormat] = React.useState<ExportFormat>("csv");
  const [history, setHistory] = React.useState<ExportHistoryEntry[]>(MOCK_HISTORY);
  const [exporting, setExporting] = React.useState(false);
  const [exported, setExported] = React.useState<string | null>(null);

  const [confirmChecked, setConfirmChecked] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [deleting, setDeleting] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);

  const canDelete = confirmChecked && confirmText === "DELETE";

  const handleExport = () => {
    setExporting(true);
    setExported(null);
    setTimeout(() => {
      const newEntry: ExportHistoryEntry = {
        id: `exp_${Date.now()}`,
        date: new Date().toISOString(),
        format,
        size:
          format === "pdf" ? "820 KB" : format === "json" ? "1.6 MB" : "1.4 MB",
        status: "ready",
      };
      setHistory((h) => [newEntry, ...h]);
      setExporting(false);
      setExported(`FinCopilot-export-${new Date().toISOString().slice(0, 10)}.${format}`);
    }, 1600);
  };

  const handleDeleteAccount = () => {
    if (!canDelete || deleting) return;
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleted(true);
    }, 2200);
  };

  if (deleted) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl pb-10">
        <Header />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="premium-card p-8 flex flex-col items-center text-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-(--negative-light) flex items-center justify-center">
            <Trash2 className="w-7 h-7 text-(--negative)" />
          </div>
          <h2 className="font-display font-semibold text-[18px]">
            Account deletion in progress
          </h2>
          <p className="text-[13px] text-(--text-secondary) max-w-sm leading-[1.6]">
            Your account has been scheduled for permanent deletion. All linked
            bank accounts have been disconnected. You'll be signed out shortly
            and receive a final email confirmation.
          </p>
          <Link
            href="/"
            className="mt-2 px-4 py-2 rounded-[10px] bg-accent text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            Go home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-10">
      <Header />

      {/* Privacy reassurance banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="premium-card-glow p-4 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-[12px] bg-accent flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <p className="text-[13px] font-medium leading-normal">
          Your data is yours.{" "}
          <span className="text-(--text-secondary)">
            Export anytime, delete anytime.
          </span>
        </p>
      </motion.div>

      {/* Export section */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SectionLabel icon={<Download className="w-3.5 h-3.5" />}>
          Export your data
        </SectionLabel>
        <div className="premium-card p-5 flex flex-col gap-4">
          <div>
            <p className="text-[13px] text-(--text-secondary) leading-normal">
              Download a complete archive of your transactions, accounts, goals,
              budgets, and AI insights. Ready in under a minute.
            </p>
          </div>

          {/* Format options */}
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary) mb-2">
              Choose format
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(FORMAT_CONFIG) as ExportFormat[]).map((fmt) => {
                const cfg = FORMAT_CONFIG[fmt];
                const selected = format === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`relative p-3 rounded-[12px] border text-left transition-all ${
                      selected
                        ? "border-[var(--accent)] bg-[var(--accent-light)]"
                        : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-(--surface-subtle)"
                    }`}
                    aria-pressed={selected}
                  >
                    <div
                      className={`w-7 h-7 rounded-[8px] flex items-center justify-center mb-2 ${
                        selected
                          ? "bg-accent text-white"
                          : "bg-[var(--surface-subtle)] text-(--text-secondary)"
                      }`}
                    >
                      {cfg.icon}
                    </div>
                    <p className="text-[13px] font-semibold">{cfg.label}</p>
                    <p className="text-[11px] text-(--text-tertiary) mt-0.5">
                      {cfg.desc}
                    </p>
                    {selected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export button */}
          <button
            disabled={exporting}
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-accent text-white text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
          >
            {exporting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Preparing archive…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Now
              </>
            )}
          </button>

          {exported && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 p-3 rounded-[10px] bg-[var(--positive-light)] text-(--positive) text-[12px] font-medium"
            >
              <Check className="w-4 h-4 shrink-0" />
              <span className="flex-1">
                Export ready: <strong>{exported}</strong>
              </span>
              <button className="inline-flex items-center gap-1 px-2 py-1 rounded-[8px] bg-[var(--positive)] text-white text-[11px] font-semibold hover:opacity-90">
                <Download className="w-3 h-3" />
                Save
              </button>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Export history */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <SectionLabel>Export History</SectionLabel>
        <div className="premium-card overflow-hidden">
          {history.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-[13px] text-(--text-tertiary)">
                No exports yet.
              </p>
            </div>
          )}
          {history.map((entry, i) => {
            const cfg = FORMAT_CONFIG[entry.format];
            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-4 ${
                  i < history.length - 1
                    ? "border-b border-(--border-subtle)"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center text-(--text-secondary) shrink-0">
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold">
                    FinCopilot-export.{entry.format.toUpperCase()}
                  </p>
                  <p className="text-[12px] text-(--text-tertiary) mt-0.5">
                    {formatDate(entry.date, { style: "long" })} · {entry.size}
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium text-accent hover:bg-[var(--accent-light)] transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Danger zone */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionLabel icon={<AlertTriangle className="w-3.5 h-3.5" />}>
          Danger Zone
        </SectionLabel>
        <div
          className="rounded-[var(--radius-lg)] p-5 flex flex-col gap-4"
          style={{
            background: "var(--negative-light)",
            border: "1.5px solid color-mix(in oklab, var(--negative) 35%, transparent)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[var(--negative)] flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-semibold text-[15px] text-(--negative)">
                Delete your account
              </h3>
              <p className="text-[12px] text-(--text-secondary) mt-1 leading-normal">
                This will permanently erase all your data, disconnect all bank
                accounts, cancel your subscription, and remove your AI history.
                <strong> This action cannot be undone.</strong>
              </p>
            </div>
          </div>

          {/* Consequences */}
          <ul className="flex flex-col gap-1.5 pl-1">
            {[
              "All 4 connected bank accounts will be unlinked",
              "1,247 transactions, 3 goals, and 6 budgets will be wiped",
              "AI insights and chat history will be deleted",
              "You'll be signed out immediately on all devices",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[12px] text-(--text-secondary)"
              >
                <span className="text-(--negative) mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>

          {/* Confirmation checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              role="checkbox"
              aria-checked={confirmChecked}
              onClick={() => setConfirmChecked((c) => !c)}
              className="mt-0.5 w-5 h-5 rounded-[6px] border-2 flex items-center justify-center shrink-0 transition-colors"
              style={{
                background: confirmChecked ? "var(--negative)" : "transparent",
                borderColor: confirmChecked
                  ? "var(--negative)"
                  : "color-mix(in oklab, var(--negative) 50%, transparent)",
              }}
            >
              {confirmChecked && <Check className="w-3.5 h-3.5 text-white" />}
            </button>
            <span className="text-[12px] text-(--text-secondary) leading-normal">
              I understand this action is permanent and cannot be reversed.
            </span>
          </label>

          {/* Type DELETE confirm */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-[0.08em] text-(--text-tertiary) mb-1.5">
              Type DELETE to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3 py-2.5 rounded-[10px] border bg-[var(--surface)] text-[14px] font-mono tracking-wider focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--negative)]"
              style={{
                borderColor:
                  confirmText === "DELETE"
                    ? "var(--negative)"
                    : "color-mix(in oklab, var(--negative) 35%, transparent)",
              }}
            />
          </div>

          {/* Delete button */}
          <button
            disabled={!canDelete || deleting}
            onClick={handleDeleteAccount}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] text-[14px] font-semibold text-white transition-all disabled:cursor-not-allowed"
            style={{
              background: canDelete ? "var(--negative)" : "color-mix(in oklab, var(--negative) 35%, transparent)",
              color: canDelete ? "#fff" : "color-mix(in oklab, var(--negative) 50%, white)",
            }}
          >
            {deleting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Deleting account…
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Delete Account
              </>
            )}
          </button>
        </div>
      </motion.section>

      {/* Footer reassurance */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-[12px] text-(--text-tertiary) mt-2"
      >
        Need help?{" "}
        <Link
          href="/you"
          className="text-accent font-medium hover:underline"
        >
          Contact support
        </Link>{" "}
        — we'll respond within 24 hours.
      </motion.p>
    </div>
  );
}

function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center gap-3"
    >
      <Link
        href="/you"
        aria-label="Back to You"
        className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div className="flex-1">
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">
          Data & Account
        </h1>
        <p className="text-[13px] text-(--text-secondary) mt-0.5">
          Export your data or permanently delete your account
        </p>
      </div>
    </motion.div>
  );
}

function SectionLabel({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-tertiary) mb-3 px-1 flex items-center gap-1.5">
      {icon}
      {children}
    </h2>
  );
}
