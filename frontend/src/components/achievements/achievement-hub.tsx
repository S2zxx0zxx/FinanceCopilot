"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Flag,
  Flame,
  Layers3,
  Link2,
  ListChecks,
  Lock,
  Sparkles,
  Target,
  Trophy,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { CountUp, ProgressRing } from "@/components/shared";
import { cn } from "@/lib/utils";

export type AchievementBadgeData = {
  key: string;
  name: string;
  description: string;
  progress: number;
  raw_progress: number;
  target: number;
  unit: string;
  progress_pct: number;
  remaining: number;
  earned: boolean;
  earned_at: string | null;
  icon_key: string;
  tier: "core" | "advanced" | "elite" | null;
  tone: "amber" | "emerald" | "azure" | "violet" | "rose" | "cyan" | null;
};

export type AchievementMilestoneData = {
  key: string;
  name: string;
  title: string;
  description: string;
  progress: number;
  raw_progress: number;
  target: number;
  unit: string;
  progress_pct: number;
  remaining: number;
  earned: boolean;
  earned_at: string | null;
  icon_key: string;
  sort_order: number;
};

export type AchievementState = {
  level: number;
  level_name: string;
  xp: number;
  xp_progress_pct: number;
  xp_to_next: number;
  next_level: number | null;
  next_level_name: string | null;
  tracking_streak_days: number;
  longest_streak_days: number;
  badges: AchievementBadgeData[];
  milestones: AchievementMilestoneData[];
  featured_milestones: AchievementMilestoneData[];
  latest_milestone: AchievementMilestoneData | null;
  badge_summary: { earned: number; total: number };
  milestone_summary: { earned: number; total: number };
};

type ToneName = NonNullable<AchievementBadgeData["tone"]>;

type Tone = {
  primary: string;
  secondary: string;
  glow: string;
  soft: string;
};

const TONES: Record<ToneName, Tone> = {
  amber: {
    primary: "#f7b733",
    secondary: "#ffdf7d",
    glow: "rgba(247, 183, 51, .38)",
    soft: "rgba(247, 183, 51, .10)",
  },
  emerald: {
    primary: "#32d583",
    secondary: "#8bf0bd",
    glow: "rgba(50, 213, 131, .34)",
    soft: "rgba(50, 213, 131, .09)",
  },
  azure: {
    primary: "#45a8ff",
    secondary: "#9ed4ff",
    glow: "rgba(69, 168, 255, .34)",
    soft: "rgba(69, 168, 255, .09)",
  },
  violet: {
    primary: "#9a72ff",
    secondary: "#c6b3ff",
    glow: "rgba(154, 114, 255, .36)",
    soft: "rgba(154, 114, 255, .10)",
  },
  rose: {
    primary: "#ff627d",
    secondary: "#ffafbd",
    glow: "rgba(255, 98, 125, .34)",
    soft: "rgba(255, 98, 125, .09)",
  },
  cyan: {
    primary: "#3ddbd9",
    secondary: "#a1f3f1",
    glow: "rgba(61, 219, 217, .32)",
    soft: "rgba(61, 219, 217, .09)",
  },
};

const TIER_LABEL: Record<string, string> = {
  core: "Core",
  advanced: "Advanced",
  elite: "Elite",
};

function BadgeGlyph({ iconKey }: { iconKey: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (iconKey) {
    case "money-map":
      return (
        <g {...common}>
          <circle cx="22" cy="23" r="4.25" />
          <circle cx="43" cy="20" r="4.25" />
          <circle cx="35" cy="42" r="4.25" />
          <path d="M25.8 21.8 38.8 20.5M24.8 26.5 32.7 38.7M40.8 24 36.7 37.7" />
          <path d="M18.5 42.5c5.5-7 11.4-10.5 18-11" opacity=".55" />
        </g>
      );
    case "budget-shield":
      return (
        <g {...common}>
          <path d="M32 14 45 19v10.5c0 8.7-5.1 15.4-13 19.8-7.9-4.4-13-11.1-13-19.8V19l13-5Z" />
          <path d="M25 27h14M25 33h10M25 39h7" />
          <circle cx="39.5" cy="38.5" r="3.5" />
        </g>
      );
    case "streak-flame":
      return (
        <g {...common}>
          <path d="M34.2 13.5c2 8.1-4.7 10.2-1.8 16.3 1.7 3.6 5.1 3.2 6.1.2 4.6 4.1 7.1 8.2 7.1 13.2 0 8.2-6.6 14.3-14.7 14.3S17.8 51 17.8 42.9c0-6.1 3.6-10.7 9.8-15.9-.6 5 1.4 7.7 4.3 8.6-1.5-7.5 4-11.1 2.3-22.1Z" />
          <path d="M31.8 39.2c4.7 2.4 5.4 5.1 3.6 8.5" opacity=".65" />
        </g>
      );
    case "ai-orbit":
      return (
        <g {...common}>
          <circle cx="32" cy="32" r="5.5" />
          <ellipse cx="32" cy="32" rx="18" ry="8.5" transform="rotate(28 32 32)" />
          <ellipse cx="32" cy="32" rx="18" ry="8.5" transform="rotate(-28 32 32)" />
          <circle cx="47.3" cy="41.2" r="2.1" fill="currentColor" stroke="none" />
          <circle cx="16.8" cy="22.8" r="2.1" fill="currentColor" stroke="none" />
        </g>
      );
    case "goal-flag":
      return (
        <g {...common}>
          <circle cx="29" cy="34" r="14" />
          <circle cx="29" cy="34" r="7" />
          <circle cx="29" cy="34" r="1.8" fill="currentColor" stroke="none" />
          <path d="M41 17v30M41 18h11l-3.2 5 3.2 5H41" />
        </g>
      );
    case "smart-saver":
      return (
        <g {...common}>
          <circle cx="30" cy="35" r="13.5" />
          <path d="M30 28v14M25.5 31.4c1.4-3.1 9.1-3.2 9.1.5 0 4.4-9.2 2-9.2 6.3 0 3.5 7.2 4 9.7.8" />
          <path d="M36.5 19.4c4.5-5.6 9.9-5.2 12.4-4.7-.5 5.9-4.4 10.4-11.5 9.7" />
          <path d="M37.3 24.3c3.2-3 6.2-5.2 10.5-7.2" opacity=".65" />
        </g>
      );
    default:
      return (
        <g {...common}>
          <circle cx="32" cy="32" r="14" />
          <path d="m32 23 2.8 5.8 6.4.9-4.6 4.5 1.1 6.4-5.7-3-5.7 3 1.1-6.4-4.6-4.5 6.4-.9L32 23Z" />
        </g>
      );
  }
}

function BadgeMedallion({
  badge,
  size = 72,
}: {
  badge: AchievementBadgeData;
  size?: number;
}) {
  const reactId = React.useId();
  const id = reactId.replace(/:/g, "");
  const tone = TONES[badge.tone || "amber"];
  const earned = badge.earned;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        role="img"
        aria-label={`${badge.name}${earned ? ", unlocked" : ", locked"}`}
        className={cn(
          "block overflow-visible transition-[filter,transform] duration-300",
          earned ? "drop-shadow-[0_8px_20px_rgba(0,0,0,.28)]" : "opacity-[0.62] saturate-[0.55]"
        )}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`outer-${id}`} x1="8" y1="7" x2="55" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor={tone.secondary} />
            <stop offset=".52" stopColor={tone.primary} />
            <stop offset="1" stopColor={tone.primary} stopOpacity=".62" />
          </linearGradient>
          <linearGradient id={`inner-${id}`} x1="16" y1="13" x2="48" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor={earned ? "#1c2530" : "#1b2027"} />
            <stop offset="1" stopColor={earned ? "#0a0f15" : "#101419"} />
          </linearGradient>
          <radialGradient id={`shine-${id}`} cx="0" cy="0" r="1" gradientTransform="translate(23 18) rotate(45) scale(36)">
            <stop stopColor="#fff" stopOpacity={earned ? ".32" : ".08"} />
            <stop offset=".55" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id={`glow-${id}`} x="-45%" y="-45%" width="190%" height="190%">
            <feGaussianBlur stdDeviation="2.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {earned && (
          <path
            d="M32 2.8 56.8 17v30L32 61.2 7.2 47V17L32 2.8Z"
            fill={tone.primary}
            opacity=".15"
            filter={`url(#glow-${id})`}
          />
        )}
        <path d="M32 4.5 55 17.7v28.6L32 59.5 9 46.3V17.7L32 4.5Z" fill={`url(#outer-${id})`} />
        <path d="M32 8.4 51.6 19.7v24.6L32 55.6 12.4 44.3V19.7L32 8.4Z" fill={`url(#inner-${id})`} />
        <path d="M32 10.5 49.7 20.7v22.6L32 53.5 14.3 43.3V20.7L32 10.5Z" fill="none" stroke={tone.secondary} strokeOpacity={earned ? ".34" : ".12"} />
        <path d="M32 8.4 51.6 19.7v24.6L32 55.6 12.4 44.3V19.7L32 8.4Z" fill={`url(#shine-${id})`} />
        <g style={{ color: earned ? tone.secondary : "#6d7784" }}>
          <BadgeGlyph iconKey={badge.icon_key} />
        </g>
        {earned && <circle cx="49.5" cy="15.5" r="2.1" fill="#fff" opacity=".78" />}
      </svg>

      {!earned && (
        <span
          className="absolute -right-0.5 -top-0.5 w-[22px] h-[22px] rounded-full grid place-items-center border border-(--border) bg-[var(--surface)] shadow-md"
          aria-hidden
        >
          <Lock className="w-3 h-3 text-(--text-tertiary)" />
        </span>
      )}
    </div>
  );
}

const MILESTONE_ICONS: Record<string, LucideIcon> = {
  link: Link2,
  ledger: ListChecks,
  stack: Layers3,
  spark: Sparkles,
  flame: Flame,
  budget: WalletCards,
  target: Target,
  halfway: CircleDot,
  flag: Flag,
  orbit: Bot,
};

function compactNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: value % 1 === 0 ? 0 : 1 }).format(value);
}

function progressText(item: Pick<AchievementMilestoneData, "progress" | "target" | "unit">) {
  return `${compactNumber(item.progress)} / ${compactNumber(item.target)} ${item.unit}`;
}

function unlockDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function MilestoneCard({
  milestone,
  featured = false,
}: {
  milestone: AchievementMilestoneData;
  featured?: boolean;
}) {
  const Icon = MILESTONE_ICONS[milestone.icon_key] || Trophy;
  const completed = milestone.earned;
  const status = completed ? "Completed" : milestone.progress_pct > 0 ? "In progress" : "Not started";

  return (
    <motion.article
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22 }}
      className={cn(
        "relative overflow-hidden rounded-[16px] border p-4 min-h-[150px]",
        "bg-[var(--surface-subtle)]/55 border-(--border-subtle)",
        featured && !completed && "border-[color-mix(in_oklab,var(--gold)_34%,var(--border-subtle))]"
      )}
      style={featured && !completed ? {
        background: "radial-gradient(circle at 0% 0%, color-mix(in oklab, var(--gold) 11%, transparent), transparent 58%), color-mix(in oklab, var(--surface-subtle) 68%, transparent)",
      } : undefined}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 w-[54px] h-[54px]">
          <ProgressRing
            pct={completed ? 100 : milestone.progress_pct}
            size={54}
            stroke={5}
            color={completed ? "var(--positive)" : featured ? "var(--gold)" : "var(--accent)"}
          />
          <div className="absolute inset-0 grid place-items-center">
            {completed ? <Check className="w-4 h-4 text-(--positive)" /> : <Icon className="w-4 h-4 text-foreground" />}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-foreground leading-tight truncate">{milestone.title}</p>
              <p className="mt-1 text-[11px] leading-[1.45] text-(--text-tertiary) line-clamp-2">{milestone.description}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.08em]",
                completed
                  ? "bg-[var(--positive-light)] text-(--positive)"
                  : featured
                    ? "bg-[color-mix(in_oklab,var(--gold)_12%,transparent)] text-[var(--gold)]"
                    : "bg-[var(--surface)] text-(--text-tertiary)"
              )}
            >
              {featured && !completed ? "Next unlock" : status}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-3 text-[10px] font-mono">
          <span className="text-(--text-secondary) tabular-nums">{progressText(milestone)}</span>
          <span className={completed ? "text-(--positive)" : "text-(--text-tertiary)"}>
            {completed
              ? unlockDate(milestone.earned_at) || "Unlocked"
              : `${compactNumber(milestone.remaining)} to go`}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completed ? 100 : milestone.progress_pct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{
              background: completed
                ? "var(--positive)"
                : featured
                  ? "linear-gradient(90deg, var(--gold), color-mix(in oklab, var(--gold) 55%, var(--accent)))"
                  : "var(--accent)",
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}

export function AchievementHub({ data }: { data: AchievementState }) {
  const [selectedBadgeKey, setSelectedBadgeKey] = React.useState<string | null>(
    data.badges.find((badge) => badge.earned)?.key || data.badges[0]?.key || null
  );
  const [expanded, setExpanded] = React.useState(false);

  const selectedBadge = data.badges.find((badge) => badge.key === selectedBadgeKey) || data.badges[0] || null;
  const featured = data.featured_milestones.length > 0
    ? data.featured_milestones.slice(0, 3)
    : data.milestones.slice(0, 3);

  return (
    <section aria-label="Achievements" className="premium-card relative overflow-hidden p-5 sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-10 h-48 w-48 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--gold)" }}
      />

      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-[10px] border border-[color-mix(in_oklab,var(--gold)_24%,transparent)] bg-[color-mix(in_oklab,var(--gold)_9%,transparent)]">
            <Award className="h-4 w-4 text-[var(--gold)]" />
          </div>
          <div>
            <h3 className="font-display text-[15px] font-semibold tracking-[-0.01em] text-foreground">Achievements</h3>
            <p className="mt-0.5 text-[10.5px] text-(--text-tertiary)">Real progress from your FinCopilot activity</p>
          </div>
        </div>
        <span className="rounded-full border border-[color-mix(in_oklab,var(--gold)_25%,var(--border-subtle))] bg-[color-mix(in_oklab,var(--gold)_8%,transparent)] px-2.5 py-1 font-mono text-[10px] font-semibold text-[var(--gold)]">
          {data.badge_summary.earned}/{data.badge_summary.total} badges
        </span>
      </div>

      <div className="relative mt-5 grid grid-cols-2 gap-3">
        <div className="flex items-center gap-4 rounded-[16px] border border-(--border-subtle) bg-[var(--surface-subtle)]/55 p-3.5">
          <div className="relative shrink-0">
            <ProgressRing pct={data.xp_progress_pct} size={70} stroke={6} color="var(--gold)" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-[18px] font-bold leading-none tabular-nums text-foreground">{data.level}</span>
              <span className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-(--text-tertiary)">level</span>
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-[13px] font-semibold text-foreground">{data.level_name}</p>
            <p className="mt-1 text-[10.5px] text-(--text-tertiary)">
              <CountUp value={data.xp} format={(value) => Math.round(value).toLocaleString("en-IN")} /> XP
            </p>
            <p className="mt-1 font-mono text-[9px] text-(--text-tertiary)">
              {data.next_level ? `${data.xp_to_next.toLocaleString("en-IN")} to L${data.next_level}` : "Max level reached"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-[16px] border border-(--border-subtle) bg-[var(--surface-subtle)]/55 p-3.5">
          <div className="grid h-[70px] w-[70px] shrink-0 place-items-center rounded-full border border-[color-mix(in_oklab,var(--warning)_22%,transparent)] bg-[color-mix(in_oklab,var(--warning)_9%,transparent)]">
            <Flame className="h-7 w-7 text-(--warning)" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[22px] font-bold leading-none tabular-nums text-foreground">
              <CountUp value={data.tracking_streak_days} />
              <span className="ml-1 text-[11px] font-medium text-(--text-tertiary)">days</span>
            </p>
            <p className="mt-1.5 text-[10.5px] text-(--text-tertiary)">Tracking streak</p>
            <p className="mt-1 font-mono text-[9px] text-(--text-tertiary)">best {data.longest_streak_days}d</p>
          </div>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mb-1.5 flex items-center justify-between gap-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-(--text-tertiary)">
            {data.next_level_name ? `Road to ${data.next_level_name}` : "Level mastery"}
          </span>
          <span className="font-mono text-[9px] tabular-nums text-(--text-tertiary)">{data.xp_progress_pct}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-subtle)]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${data.xp_progress_pct}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--gold))" }}
          />
        </div>
      </div>

      <div className="my-5 h-px bg-[var(--border-subtle)]" />

      <div className="flex items-end justify-between gap-3">
        <div>
          <h4 className="font-display text-[13px] font-semibold text-foreground">Badge Vault</h4>
          <p className="mt-0.5 text-[10.5px] text-(--text-tertiary)">Prestige unlocks earned from verified progress</p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-(--text-tertiary)">
          {data.badge_summary.earned} of {data.badge_summary.total} unlocked
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-2.5">
        {data.badges.map((badge, index) => {
          const selected = badge.key === selectedBadge?.key;
          const tone = TONES[badge.tone || "amber"];
          return (
            <motion.button
              key={badge.key}
              type="button"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * index, duration: 0.35 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBadgeKey(badge.key)}
              aria-pressed={selected}
              className={cn(
                "group relative flex min-w-0 flex-col items-center rounded-[16px] border px-1.5 pb-2.5 pt-2.5 text-center transition-[border-color,background,box-shadow]",
                selected
                  ? "border-[var(--border-strong)] bg-[var(--surface-subtle)]"
                  : "border-transparent hover:border-(--border-subtle) hover:bg-[var(--surface-subtle)]/45"
              )}
              style={selected && badge.earned ? { boxShadow: `0 10px 28px -18px ${tone.glow}` } : undefined}
            >
              <BadgeMedallion badge={badge} size={64} />
              <span className={cn("mt-1.5 w-full truncate text-[9.5px] font-semibold leading-tight", badge.earned ? "text-foreground" : "text-(--text-secondary)")}>{badge.name}</span>
              <span className="mt-1 font-mono text-[7.5px] uppercase tracking-[0.08em] text-(--text-tertiary)">
                {badge.earned ? "Unlocked" : `${badge.progress_pct}%`}
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedBadge && (
          <motion.div
            key={selectedBadge.key}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="mt-3 overflow-hidden rounded-[16px] border border-(--border-subtle) bg-[var(--surface-subtle)]/45 p-3.5"
            style={{
              background: `linear-gradient(120deg, ${TONES[selectedBadge.tone || "amber"].soft}, transparent 44%), color-mix(in oklab, var(--surface-subtle) 58%, transparent)`,
            }}
          >
            <div className="flex items-center gap-3">
              <BadgeMedallion badge={selectedBadge} size={54} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-display text-[13px] font-semibold text-foreground">{selectedBadge.name}</p>
                  <span className="rounded-full bg-[var(--surface)] px-2 py-0.5 font-mono text-[7.5px] uppercase tracking-[0.09em] text-(--text-tertiary)">
                    {TIER_LABEL[selectedBadge.tier || "core"] || "Core"}
                  </span>
                </div>
                <p className="mt-1 text-[10.5px] leading-[1.45] text-(--text-tertiary)">{selectedBadge.description}</p>
              </div>
              <div className="hidden min-w-[112px] text-right sm:block">
                <p className={cn("font-mono text-[9px] uppercase tracking-[0.08em]", selectedBadge.earned ? "text-(--positive)" : "text-(--text-tertiary)")}>{selectedBadge.earned ? "Unlocked" : "Progress"}</p>
                <p className="mt-1 text-[11px] font-semibold tabular-nums text-foreground">
                  {compactNumber(selectedBadge.progress)} / {compactNumber(selectedBadge.target)} {selectedBadge.unit}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2.5">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${selectedBadge.progress_pct}%` }}
                  className="h-full rounded-full"
                  style={{ background: TONES[selectedBadge.tone || "amber"].primary }}
                />
              </div>
              <span className="shrink-0 font-mono text-[9px] text-(--text-tertiary)">
                {selectedBadge.earned
                  ? unlockDate(selectedBadge.earned_at) || "earned"
                  : `${compactNumber(selectedBadge.remaining)} ${selectedBadge.unit} to unlock`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="my-5 h-px bg-[var(--border-subtle)]" />

      <div className="flex items-end justify-between gap-3">
        <div>
          <h4 className="font-display text-[13px] font-semibold text-foreground">Milestone Trail</h4>
          <p className="mt-0.5 text-[10.5px] text-(--text-tertiary)">Closest real milestones are surfaced first</p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-(--text-tertiary)">
          {data.milestone_summary.earned} of {data.milestone_summary.total} complete
        </span>
      </div>

      {featured.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {featured.map((milestone, index) => (
            <MilestoneCard key={milestone.key} milestone={milestone} featured={index === 0} />
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-[16px] border border-dashed border-(--border) px-4 py-7 text-center">
          <Trophy className="mx-auto h-5 w-5 text-(--text-tertiary)" />
          <p className="mt-2 text-[11px] text-(--text-tertiary)">No active milestone definitions are available.</p>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="inline-flex items-center gap-1 rounded-[10px] px-2.5 py-2 text-[11px] font-semibold text-accent transition-colors hover:bg-[var(--accent-light)]"
          aria-expanded={expanded}
        >
          {expanded ? "Hide achievement trail" : "View all achievements"}
          <motion.span animate={{ rotate: expanded ? 90 : 0 }}>
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 border-t border-(--border-subtle) pt-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[var(--gold)]" />
                <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-(--text-tertiary)">Complete milestone map</p>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {data.milestones
                  .slice()
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((milestone) => (
                    <MilestoneCard key={`all-${milestone.key}`} milestone={milestone} />
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
