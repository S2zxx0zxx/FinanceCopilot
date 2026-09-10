"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Settings2,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { formatPaise } from "@/lib/format";
import styles from "./dashboard-premium.module.css";

export type DashboardProfile = {
  display_name?: unknown;
  email?: unknown;
  created_at?: unknown;
  avatar_mode?: unknown;
  preset_avatar_url?: unknown;
  preset_avatar_label?: unknown;
};

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function memberSince(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric" }).format(date);
}

export function DashboardProfileMenu({ user }: Readonly<{ user: DashboardProfile }>) {
  const email = text(user.email, "Signed-in account");
  const displayName = text(user.display_name, email.includes("@") ? email.split("@")[0] : "Your profile");
  const joined = memberSince(user.created_at);
  const presetLabel = text(user.preset_avatar_label, "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className={styles.profileTrigger} aria-label={`Open profile menu for ${displayName}`}>
          <ProfileAvatar
            avatarMode={user.avatar_mode}
            presetAvatarUrl={user.preset_avatar_url}
            displayName={displayName}
            size={40}
            className="pointer-events-none"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className={styles.profileMenu}>
        <div className={styles.profileHero}>
          <div className="relative z-10 flex items-center gap-3">
            <div className={styles.profileAvatar}>
              <ProfileAvatar
                avatarMode={user.avatar_mode}
                presetAvatarUrl={user.preset_avatar_url}
                displayName={displayName}
                size={46}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-semibold text-(--text)">{displayName}</p>
              <p className="truncate text-[12px] text-(--text-secondary) mt-0.5">{email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-(--border) bg-(--surface-subtle) px-2 py-1 text-[10px] text-(--text-secondary)">
                  <ShieldCheck className="h-3 w-3" /> {user.avatar_mode === "preset" && presetLabel ? presetLabel : "FinCopilot account"}
                </span>
                {joined && <span className="text-[10px] text-(--text-tertiary)">Member since {joined}</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="py-2">
          <DropdownMenuItem asChild className={styles.profileMenuItem}>
            <Link href="/you" className="flex items-center gap-3">
              <span className={styles.profileItemIcon}><UserRound className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium">Personal hub</span><span className="block text-[11px] text-(--text-secondary)">Profile, progress and account settings</span></span>
              <ArrowUpRight className="h-4 w-4 text-(--text-tertiary)" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={styles.profileMenuItem}>
            <Link href="/you/security" className="flex items-center gap-3">
              <span className={styles.profileItemIcon}><LockKeyhole className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium">Security center</span><span className="block text-[11px] text-(--text-secondary)">Review sessions and protection</span></span>
              <ArrowUpRight className="h-4 w-4 text-(--text-tertiary)" />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className={styles.profileMenuItem}>
            <Link href="/you/privacy" className="flex items-center gap-3">
              <span className={styles.profileItemIcon}><Settings2 className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium">Privacy choices</span><span className="block text-[11px] text-(--text-secondary)">Consent and data controls</span></span>
              <ArrowUpRight className="h-4 w-4 text-(--text-tertiary)" />
            </Link>
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator className="m-0" />
        <div className="px-4 py-3 text-[10px] leading-relaxed text-(--text-tertiary)">Profile details come from your signed-in FinCopilot account.</div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type QuickActionTone = "import" | "budget" | "goal" | "copilot";

const toneClass: Record<QuickActionTone, string> = {
  import: styles.actionImport,
  budget: styles.actionBudget,
  goal: styles.actionGoal,
  copilot: styles.actionCopilot,
};

export function DashboardQuickAction({
  href,
  title,
  description,
  icon: Icon,
  tone,
}: Readonly<{
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: QuickActionTone;
}>) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.18 }} className="min-w-0">
      <Link href={href} className={`${styles.actionCard} ${toneClass[tone]}`}>
        <div className="flex w-full items-start gap-3">
          <div className={styles.actionIcon}><Icon className="h-[18px] w-[18px]" /></div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-[14px] font-semibold text-(--text)">{title}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-(--text-secondary)">{description}</p>
          </div>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-(--text-tertiary)" aria-hidden="true" />
        </div>
      </Link>
    </motion.div>
  );
}

export function DashboardMoneyCard({
  amountPaise,
  activeAccounts,
}: Readonly<{
  amountPaise: number | null;
  activeAccounts: number | null;
}>) {
  const [hidden, setHidden] = React.useState(false);
  const accountLabel = activeAccounts === null
    ? "Account count unavailable"
    : activeAccounts === 1
      ? "1 active account"
      : `${activeAccounts} active accounts`;

  return (
    <div className={styles.moneyStage}>
      <article className={styles.moneyCard} aria-label="FinCopilot recorded money snapshot">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className={styles.moneyMonogram}>F</div>
            <div className="min-w-0">
              <p className="text-[9px] font-mono uppercase tracking-[.22em] text-white/60">FinCopilot</p>
              <h2 className="mt-1 truncate font-display text-[17px] font-semibold tracking-[-.02em] text-white">Money snapshot</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setHidden(value => !value)}
            aria-label={hidden ? "Show recorded amount" : "Hide recorded amount"}
            aria-pressed={hidden}
            className={styles.moneyPrivacyButton}
          >
            {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative z-10 mt-[clamp(16px,4vw,28px)]">
          <p className="text-[11px] font-medium text-white/70">Recorded net activity</p>
          <p className={`${styles.moneyAmount} mt-2 font-display font-semibold text-white`} aria-live="polite">
            {hidden ? "••••••" : amountPaise === null ? "Unavailable" : formatPaise(amountPaise)}
          </p>
          <p className="mt-2 text-[9px] font-medium leading-relaxed text-white/60">Imported records · opening balances excluded</p>
        </div>

        <div className="absolute inset-x-[clamp(18px,3vw,25px)] bottom-[clamp(16px,3vw,23px)] z-10 flex items-end justify-between gap-3">
          <span className={styles.moneyChip}><ShieldCheck className="h-3 w-3 shrink-0" />{accountLabel}</span>
          <Link href="/money" aria-label="Open Money overview" className={styles.moneyLink}><ArrowUpRight className="h-5 w-5" /></Link>
        </div>
      </article>
    </div>
  );
}

function MetricAmount({ value }: Readonly<{ value: number | null }>) {
  return <span className="font-display text-[30px] font-bold tracking-[-.035em] tabular-nums">{value === null ? "Unavailable" : formatPaise(value)}</span>;
}

export function SafeToSpendCard({
  value,
  horizonDays,
  planningDataStatus,
}: Readonly<{
  value: number | null;
  horizonDays: number | null;
  planningDataStatus: string;
}>) {
  const evidenceLabel = planningDataStatus === "complete"
    ? "Planning inputs ready"
    : planningDataStatus === "partial"
      ? "Some planning inputs limited"
      : planningDataStatus === "incomplete"
        ? "Planning inputs incomplete"
        : "Review forecast";

  return (
    <section className={`${styles.metricCard} ${styles.safeCard}`} aria-label="Safe to Spend">
      <div className="relative z-10 flex h-full min-h-[108px] flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[.15em] text-white/60">Safe to Spend</p>
            <div className="mt-3"><MetricAmount value={value} /></div>
          </div>
          <div className={styles.metricIcon}><Sparkles className="h-4 w-4 text-[#e8cf96]" /></div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {horizonDays !== null && <span className={styles.metricMeta}>{horizonDays}-day horizon</span>}
            <span className={styles.metricMeta}>{evidenceLabel}</span>
          </div>
          <Link href="/forecast" aria-label="Review forecast" className={styles.metricArrow}><ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}

export function IncomeMetricCard({
  value,
  sourceCount,
}: Readonly<{
  value: number | null;
  sourceCount: number;
}>) {
  return (
    <section className={`${styles.metricCard} ${styles.incomeCard}`} aria-label="Income this month">
      <div className="relative z-10 flex h-full min-h-[108px] flex-col justify-between gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[.15em] text-white/60">Income (mo)</p>
            <div className="mt-3"><MetricAmount value={value} /></div>
          </div>
          <div className={styles.metricIcon}><TrendingUp className="h-4 w-4 text-[#86efac]" /></div>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <span className={styles.metricMeta}>Posted income</span>
            <span className={styles.metricMeta}>{sourceCount} {sourceCount === 1 ? "source" : "sources"}</span>
          </div>
          <Link href="/income" aria-label="Open Income streams" className={styles.metricArrow}><ArrowUpRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
