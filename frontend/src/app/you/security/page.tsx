"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Shield,
  Smartphone,
  Monitor,
  LogIn,
  KeyRound,
  Activity,
  ChevronRight,
  X,
} from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ProgressRing } from "@/components/shared";

import { timeAgo, formatDate } from "@/lib/format";

// ── Helpers ────────────────────────────────────────────────────────────────

function getScoreColor(score: number): string {
  if (score >= 80) return "var(--positive)";
  if (score >= 50) return "var(--warning)";
  return "var(--negative)";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 50) return "Fair";
  return "Needs attention";
}

function getScoreLightBg(score: number): string {
  if (score >= 80) return "var(--positive-light)";
  if (score >= 50) return "var(--warning-light)";
  return "var(--negative-light)";
}

const ACTIVITY_ICON: Record<string, React.ReactNode> = {
  login: <LogIn className="w-4 h-4" />,
  password_change: <KeyRound className="w-4 h-4" />,
};

const DEVICE_ICON: Record<string, React.ReactNode> = {
  iPhone: <Smartphone className="w-4 h-4" />,
  MacBook: <Monitor className="w-4 h-4" />,
};

function getDeviceIcon(device: string): React.ReactNode {
  if (device.toLowerCase().includes("iphone")) return DEVICE_ICON.iPhone;
  if (device.toLowerCase().includes("macbook")) return DEVICE_ICON.MacBook;
  return <Smartphone className="w-4 h-4" />;
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function SecurityPage() {
  const { securityData } = useAppData();
  const [twoFA, setTwoFA] = React.useState(securityData.two_factor_enabled);
  const [sessions, setSessions] = React.useState(securityData.active_sessions);
  const [revoking, setRevoking] = React.useState<string | null>(null);
  const { toast } = useToast();

  const score = securityData.security_score;
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const scoreBg = getScoreLightBg(score);

  const handleRevoke = async (id: string) => {
    setRevoking(id);
    try {
      await api.revokeSession(id);
      setSessions((s) => s.filter((sess) => sess.id !== id));
      toast({ title: "Session revoked", description: "The session has been signed out." });
    } catch {
      toast({ title: "Revoke failed", description: "Could not revoke session.", variant: "destructive" });
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-10">
      {/* Header */}
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
            Security
          </h1>
          <p className="text-[13px] text-(--text-secondary) mt-0.5">
            Protect your account and review activity
          </p>
        </div>
      </motion.div>

      {/* Security score hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="premium-card p-6 flex items-center gap-5"
      >
        <div className="relative shrink-0">
          <ProgressRing
            pct={score}
            size={88}
            stroke={8}
            color={scoreColor}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-display font-bold text-[26px] tabular-nums tracking-[-0.02em]"
              style={{ color: scoreColor }}
            >
              {score}
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-(--text-tertiary)">
              / 100
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-semibold text-[17px]">
              Security score
            </h2>
            <span
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold"
              style={{ background: scoreBg, color: scoreColor }}
            >
              {scoreLabel}
            </span>
          </div>
          <p className="text-[12px] text-(--text-secondary) mt-1.5 leading-normal">
            {score >= 80
              ? "Your account is well-protected. Keep it up."
              : score >= 50
                ? "Decent, but a few improvements would boost your security."
                : "Your account has weak spots. We recommend acting now."}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <ScoreChip label="2FA enabled" ok={twoFA} />
            <ScoreChip label="Strong password" ok />
            <ScoreChip label="Trusted devices" ok={sessions.length <= 2} />
          </div>
        </div>
      </motion.div>

      {/* 2FA */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        <SectionLabel icon={<Lock className="w-3.5 h-3.5" />}>
          Two-Factor Authentication
        </SectionLabel>
        <div className="premium-card p-5 flex items-center gap-4">
          <div
            className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0"
            style={{
              background: twoFA
                ? "var(--positive-light)"
                : "var(--warning-light)",
            }}
          >
            <Shield
              className="w-5 h-5"
              style={{ color: twoFA ? "var(--positive)" : "var(--warning)" }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold">
              {twoFA ? "Authenticator app" : "2FA not enabled"}
            </p>
            <p className="text-[12px] text-(--text-tertiary) mt-0.5">
              {twoFA
                ? "Verified via Google Authenticator · last verified 2h ago"
                : "Protect your account with a second verification step"}
            </p>
          </div>
          <button
            onClick={() => setTwoFA((v) => !v)}
            role="switch"
            aria-checked={twoFA}
            aria-label="Toggle 2FA"
            className="relative w-11 h-6 rounded-full transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            style={{ background: twoFA ? "var(--accent)" : "var(--surface-active)" }}
          >
            <motion.span
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
              style={{ transform: twoFA ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
        </div>
        <div className="mt-2 flex justify-end">
          <button className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-accent hover:bg-[var(--accent-light)] rounded-[8px] transition-colors">
            Manage
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.section>

      {/* Active sessions */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SectionLabel icon={<Smartphone className="w-3.5 h-3.5" />}>
          Active Sessions
        </SectionLabel>
        <div className="premium-card overflow-hidden">
          {sessions.length === 0 && (
            <div className="p-6 text-center">
              <p className="text-[13px] text-(--text-tertiary)">
                No active sessions.
              </p>
            </div>
          )}
          {sessions.map((sess, i) => {
            const isRevoking = revoking === sess.id;
            return (
              <div
                key={sess.id}
                className={`flex items-center gap-3 p-4 ${
                  i < sessions.length - 1
                    ? "border-b border-(--border-subtle)"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0 text-(--text-secondary)">
                  {getDeviceIcon(sess.device)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[14px] font-semibold truncate">
                      {sess.device}
                    </p>
                    {sess.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[var(--accent-light)] text-accent">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-(--text-tertiary) mt-0.5">
                    {sess.location} · active {timeAgo(sess.last_active)}
                  </p>
                </div>
                {sess.current ? (
                  <span className="text-[12px] font-medium text-(--text-tertiary) px-2">
                    This device
                  </span>
                ) : (
                  <button
                    disabled={isRevoking}
                    onClick={() => handleRevoke(sess.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-[12px] font-medium text-(--text-tertiary) hover:text-(--negative) hover:bg-(--negative-light) transition-colors disabled:opacity-50"
                  >
                    {isRevoking ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-current/30 border-t-current animate-spin" />
                        Revoking…
                      </>
                    ) : (
                      <>
                        <X className="w-3.5 h-3.5" />
                        Revoke
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Recent activity */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <SectionLabel icon={<Activity className="w-3.5 h-3.5" />}>
          Recent Activity
        </SectionLabel>
        <div className="premium-card p-5">
          <ol className="flex flex-col gap-0">
            {securityData.recent_activity.map((entry, i) => {
              const isLast = i === securityData.recent_activity.length - 1;
              return (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[var(--surface-subtle)] flex items-center justify-center text-(--text-secondary)">
                      {ACTIVITY_ICON[entry.type] || <Activity className="w-4 h-4" />}
                    </div>
                    {!isLast && (
                      <div className="flex-1 w-px bg-[var(--border-subtle)] my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-5">
                    <p className="text-[13px] font-medium leading-normal">
                      {entry.description}
                    </p>
                    <p className="text-[11px] font-mono text-(--text-tertiary) mt-0.5">
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

      {/* Change password */}
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <button className="premium-card w-full p-5 flex items-center gap-3 hover:border-[var(--border-strong)] transition-colors text-left">
          <div className="w-10 h-10 rounded-[12px] bg-[var(--accent-light)] flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold">Change Password</p>
            <p className="text-[12px] text-(--text-tertiary) mt-0.5">
              Last updated {timeAgo(securityData.recent_activity.find((a) => a.type === "password_change")?.timestamp || "")}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-(--text-tertiary) shrink-0" />
        </button>
      </motion.section>
    </div>
  );
}

function ScoreChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold ${
        ok
          ? "bg-[var(--positive-light)] text-(--positive)"
          : "bg-[var(--warning-light)] text-(--warning)"
      }`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: ok ? "var(--positive)" : "var(--warning)" }}
      />
      {label}
    </span>
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
