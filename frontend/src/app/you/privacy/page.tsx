"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  ShieldCheck,
  Database,
  Trash2,
  Check,
  ChevronDown,
} from "lucide-react";
import { privacyData } from "@/lib/data";
import { formatDate, timeAgo } from "@/lib/format";

// ── Toggle ─────────────────────────────────────────────────────────────────

function ConsentToggle({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (next: boolean) => void;
}) {
  const [on, setOn] = React.useState(enabled);
  const handle = () => {
    const next = !on;
    setOn(next);
    onChange(next);
  };
  return (
    <div className="flex items-center gap-3 p-4 border-b border-[var(--border-subtle)] last:border-b-0">
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold">{label}</p>
        <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5 leading-[1.5]">
          {description}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={handle}
        className="relative w-11 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        style={{
          background: on ? "var(--accent)" : "var(--surface-active)",
        }}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
          style={{
            transform: on ? "translateX(20px)" : "translateX(0)",
          }}
        />
      </button>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  const [retention, setRetention] = React.useState(
    privacyData.data_retention_days
  );
  const [retentionOpen, setRetentionOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);

  const [consents, setConsents] = React.useState({
    marketing: privacyData.marketing_consent,
    analytics: privacyData.analytics_consent,
    aiSharing: privacyData.ai_sharing_consent,
  });

  const retentionOptions = [
    { value: 30, label: "30 days" },
    { value: 90, label: "90 days" },
    { value: 180, label: "180 days" },
    { value: 365, label: "365 days" },
  ];

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      setDeleting(false);
      setDeleted(true);
    }, 1800);
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
          <div className="w-14 h-14 rounded-full bg-[var(--positive-light)] flex items-center justify-center">
            <Check className="w-7 h-7 text-[var(--positive)]" />
          </div>
          <h2 className="font-display font-semibold text-[18px]">
            Data deletion requested
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] max-w-sm leading-[1.6]">
            Your account data has been queued for permanent deletion. This
            usually completes within 30 days. You'll receive an email
            confirmation at <strong>{`arjun.sharma@fincopilot.in`}</strong>.
          </p>
          <Link
            href="/you"
            className="mt-2 px-4 py-2 rounded-[10px] bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
          >
            Back to Settings
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-10">
      <Header />

      {/* Hero encryption card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="premium-card-glow p-6 flex items-start gap-4"
      >
        <div className="w-12 h-12 rounded-[14px] bg-[var(--accent)] flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-display font-semibold text-[17px]">
            Your data is encrypted end-to-end
          </h2>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1 leading-[1.6]">
            All bank connections use 256-bit TLS encryption. We never store your
            credentials — tokens are kept in an HSM-backed vault. You're in
            control.
          </p>
        </div>
      </motion.div>

      {/* Data inventory */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <SectionLabel icon={<Database className="w-3.5 h-3.5" />}>
          Data Inventory
        </SectionLabel>
        <div className="premium-card overflow-hidden">
          {privacyData.data_inventory.map((item, i) => (
            <div
              key={item.category}
              className={`flex items-center gap-4 p-4 ${
                i < privacyData.data_inventory.length - 1
                  ? "border-b border-[var(--border-subtle)]"
                  : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold">{item.category}</p>
                <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
                  {item.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-[18px] tabular-nums tracking-[-0.02em]">
                  {item.record_count.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
                  records
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Consent toggles */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionLabel icon={<ShieldCheck className="w-3.5 h-3.5" />}>
          Consent Controls
        </SectionLabel>
        <div className="premium-card overflow-hidden">
          <ConsentToggle
            label="Marketing communications"
            description="Product updates, tips, and promotional offers via email."
            enabled={consents.marketing}
            onChange={(v) => setConsents((c) => ({ ...c, marketing: v }))}
          />
          <ConsentToggle
            label="Anonymous analytics"
            description="Help us improve FinCopilot with anonymous usage data."
            enabled={consents.analytics}
            onChange={(v) => setConsents((c) => ({ ...c, analytics: v }))}
          />
          <ConsentToggle
            label="AI processing"
            description="Allow our AI to analyze your transactions to generate insights."
            enabled={consents.aiSharing}
            onChange={(v) => setConsents((c) => ({ ...c, aiSharing: v }))}
          />
        </div>
      </motion.section>

      {/* Data retention */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <SectionLabel>Data Retention</SectionLabel>
        <div className="premium-card p-4">
          <p className="text-[14px] font-semibold">Keep my data for</p>
          <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5 mb-3 leading-[1.5]">
            We'll automatically delete transactions and insights older than
            this period.
          </p>
          <div className="relative">
            <button
              onClick={() => setRetentionOpen((o) => !o)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface-subtle)] text-[13px] font-medium hover:border-[var(--border-strong)] transition-colors"
              aria-haspopup="listbox"
              aria-expanded={retentionOpen}
            >
              <span>
                {retentionOptions.find((o) => o.value === retention)?.label}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[var(--text-tertiary)] transition-transform ${retentionOpen ? "rotate-180" : ""}`}
              />
            </button>
            {retentionOpen && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 mt-1 w-full premium-card overflow-hidden p-1"
              >
                {retentionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setRetention(opt.value);
                      setRetentionOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-[8px] text-[13px] flex items-center justify-between hover:bg-[var(--surface-subtle)] transition-colors ${
                      opt.value === retention
                        ? "text-[var(--accent)] font-semibold"
                        : ""
                    }`}
                  >
                    {opt.label}
                    {opt.value === retention && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Consent history */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <SectionLabel>Consent History</SectionLabel>
        <div className="premium-card p-4">
          <ol className="flex flex-col gap-0">
            {privacyData.consent_history.map((entry, i) => {
              const isLast = i === privacyData.consent_history.length - 1;
              const Icon =
                entry.type === "grant" ? (
                  <div className="w-7 h-7 rounded-full bg-[var(--positive-light)] flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-[var(--positive)]" />
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-light)] flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
                  </div>
                );
              return (
                <li key={entry.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    {Icon}
                    {!isLast && (
                      <div className="flex-1 w-px bg-[var(--border-subtle)] my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-5">
                    <p className="text-[13px] font-medium leading-[1.5]">
                      {entry.action}
                    </p>
                    <p className="text-[11px] font-mono text-[var(--text-tertiary)] mt-0.5">
                      {formatDate(entry.timestamp, { style: "long" })} ·{" "}
                      {timeAgo(entry.timestamp)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </motion.section>

      {/* Danger zone */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
      >
        <SectionLabel>Danger Zone</SectionLabel>
        <div
          className="rounded-[var(--radius-lg)] p-5 flex flex-col gap-3"
          style={{
            background: "var(--negative-light)",
            border: "1px solid color-mix(in oklab, var(--negative) 30%, transparent)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--negative)] flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[var(--negative)]">
                Delete all my data
              </p>
              <p className="text-[12px] text-[var(--text-secondary)] mt-0.5 leading-[1.5]">
                Permanently delete all transactions, accounts, goals, and AI
                insights. This action cannot be undone.
              </p>
            </div>
          </div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="self-start px-4 py-2 rounded-[10px] text-[13px] font-semibold text-[var(--negative)] border border-[var(--negative)] hover:bg-[var(--negative)] hover:text-white transition-colors"
            >
              Request data deletion
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-start gap-2 p-3 rounded-[10px] bg-white/60 dark:bg-black/20">
                <p className="text-[12px] text-[var(--text-secondary)] leading-[1.5]">
                  <strong>Type DELETE</strong> to confirm. Your connected bank
                  accounts will be unlinked and all data wiped within 30 days.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Type DELETE"
                  className="flex-1 px-3 py-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[13px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--negative)]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-2 rounded-[10px] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={deleting}
                    onClick={handleDelete}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white bg-[var(--negative)] hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {deleting ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Deleting…
                      </>
                    ) : (
                      "Delete forever"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>
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
        className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[var(--surface-subtle)] transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </Link>
      <div className="flex-1">
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">
          Privacy
        </h1>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
          Control your data, consents, and retention
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
    <h2 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)] mb-3 px-1 flex items-center gap-1.5">
      {icon}
      {children}
    </h2>
  );
}
