"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ShieldCheck, Lock, EyeOff, Download, Bell, User, ChevronRight,
  Pencil, CreditCard, IndianRupee, Languages, Sun, Moon,
  HelpCircle, MessageSquare, Info, LogOut, Crown, Calendar, MessageCircle,
  Zap, type LucideIcon,
} from "lucide-react";

import { formatDate, getScoreLabel } from "@/lib/format";
import { useUser, useClerk } from "@clerk/nextjs";
import { Badge, ProgressRing, CountUp } from "@/components/shared";
import { AchievementHub, type AchievementBadgeData, type AchievementMilestoneData, type AchievementState } from "@/components/achievements/achievement-hub";
import { useToast } from "@/hooks/use-toast";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { object, rows, label, amount } from "@/lib/response";
import { api } from "@/lib/api";

const BADGE_TONES = new Set(["amber", "emerald", "azure", "violet", "rose", "cyan"]);
const BADGE_TIERS = new Set(["core", "advanced", "elite"]);

function parseBadge(value: unknown): AchievementBadgeData {
  const item = object(value);
  const tone = label(item.tone, "");
  const tier = label(item.tier, "");
  const progress = amount(item.progress) ?? 0;
  const rawProgress = amount(item.raw_progress) ?? progress;
  const target = Math.max(1, amount(item.target) ?? 1);
  const progressPct = Math.max(0, Math.min(100, amount(item.progress_pct) ?? Math.round((progress / target) * 100)));
  return {
    key: label(item.key, label(item.name)),
    name: label(item.name),
    description: label(item.description),
    progress,
    raw_progress: rawProgress,
    target,
    unit: label(item.unit),
    progress_pct: progressPct,
    remaining: Math.max(0, amount(item.remaining) ?? target - rawProgress),
    earned: item.earned === true,
    earned_at: typeof item.earned_at === "string" ? item.earned_at : null,
    icon_key: label(item.icon_key, "achievement"),
    tier: BADGE_TIERS.has(tier) ? tier as AchievementBadgeData["tier"] : null,
    tone: BADGE_TONES.has(tone) ? tone as AchievementBadgeData["tone"] : null,
  };
}

function parseMilestone(value: unknown): AchievementMilestoneData {
  const item = object(value);
  const progress = amount(item.progress) ?? 0;
  const rawProgress = amount(item.raw_progress) ?? progress;
  const target = Math.max(1, amount(item.target) ?? 1);
  const progressPct = Math.max(0, Math.min(100, amount(item.progress_pct) ?? Math.round((progress / target) * 100)));
  const title = label(item.title, label(item.name));
  return {
    key: label(item.key, label(item.id, title)),
    name: title,
    title,
    description: label(item.description),
    progress,
    raw_progress: rawProgress,
    target,
    unit: label(item.unit),
    progress_pct: progressPct,
    remaining: Math.max(0, amount(item.remaining) ?? target - rawProgress),
    earned: item.earned === true || item.achieved === true,
    earned_at: typeof item.earned_at === "string"
      ? item.earned_at
      : typeof item.achieved_at === "string" ? item.achieved_at : null,
    icon_key: label(item.icon_key, "achievement"),
    sort_order: amount(item.sort_order) ?? 0,
  };
}

async function loadGrowth(): Promise<AchievementState> {
  const data = object(await api.getGamification());
  const badges = rows(data.badges).map(parseBadge);
  const milestones = rows(data.milestones).map(parseMilestone);

  const apiFeatured = rows(data.featured_milestones).map(parseMilestone);
  const featured = apiFeatured.length > 0
    ? apiFeatured
    : milestones
        .filter((milestone) => !milestone.earned)
        .slice()
        .sort((a, b) => b.progress_pct - a.progress_pct || a.sort_order - b.sort_order)
        .slice(0, 3);
  const achieved = milestones
    .filter((milestone) => milestone.earned && milestone.earned_at)
    .slice()
    .sort((a, b) => new Date(b.earned_at!).getTime() - new Date(a.earned_at!).getTime());

  const nextLevel = amount(data.next_level);
  const nextLevelName = label(data.next_level_name, "");

  return {
    level: amount(data.level) ?? 1,
    level_name: label(data.level_name, "Beginner"),
    xp: amount(data.xp) ?? 0,
    xp_progress_pct: Math.max(0, Math.min(100, amount(data.xp_progress_pct) ?? 0)),
    xp_to_next: Math.max(0, amount(data.xp_to_next) ?? 0),
    next_level: typeof nextLevel === "number" && nextLevel > 0 ? nextLevel : null,
    next_level_name: nextLevelName || null,
    tracking_streak_days: amount(data.tracking_streak_days) ?? 0,
    longest_streak_days: amount(data.longest_streak_days) ?? 0,
    badges,
    milestones,
    featured_milestones: featured,
    latest_milestone: achieved[0] || null,
    badge_summary: {
      earned: badges.filter((badge) => badge.earned).length,
      total: badges.length,
    },
    milestone_summary: {
      earned: milestones.filter((milestone) => milestone.earned).length,
      total: milestones.length,
    },
  };
}

// ── Motion variants ───────────────────────────────────────────────────────
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};

// ── Real Sign-Out Button ──────────────────────────────────────────────────
function SignOutButton() {
  const router = useRouter();
  const { signOut } = useClerk();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      if (typeof window !== "undefined") {
        try { window.localStorage.removeItem("clerk_db_jwt"); } catch { /* noop */ }
      }
      await signOut(() => router.push("/sign-in"));
    } catch {
      toast({ title: "Sign out failed", description: "Please try again.", variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[14px] font-medium text-(--negative) hover:bg-(--negative-light) transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}

// ── Settings types ────────────────────────────────────────────────────────
type SettingsRow = {
  label: string;
  desc: string;
  href?: string;
  icon: LucideIcon;
  value?: string;
  toggle?: "theme";
  comingSoon?: boolean;
};

type SettingsGroup = { title: string; items: SettingsRow[] };

// ── Settings groups (6) ───────────────────────────────────────────────────
const SETTING_GROUPS: SettingsGroup[] = [
  {
    title: "Account",
    items: [
      { label: "Profile", desc: "Name, email, phone", icon: User, comingSoon: true },
      { label: "Payment Methods", desc: "Cards, UPI, bank transfers", icon: CreditCard, comingSoon: true },
    ],
  },
  {
    title: "Membership",
    items: [
      { label: "Plan", desc: "Free tier · upgrade for unlimited AI", icon: Crown, comingSoon: true },
      { label: "Billing History", desc: "Invoices and receipts", icon: CreditCard, comingSoon: true },
    ],
  },
  {
    title: "Data & Privacy",
    items: [
      { label: "Connections", desc: "Linked accounts", href: "/you/connections", icon: ShieldCheck },
      { label: "Privacy Center", desc: "Consent, data inventory", href: "/you/privacy", icon: EyeOff },
      { label: "Security", desc: "2FA, sessions, activity", href: "/you/security", icon: Lock },
      { label: "Data & Export", desc: "Export or delete your data", href: "/you/export", icon: Download },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Currency", desc: "Indian Rupee", icon: IndianRupee, value: "₹ INR", comingSoon: true },
      { label: "Theme", desc: "Switch appearance", icon: Sun, toggle: "theme" },
      { label: "Notifications", desc: "Alerts, emails, push", icon: Bell, comingSoon: true },
      { label: "Language", desc: "Display language", icon: Languages, value: "English", comingSoon: true },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", desc: "Guides and FAQs", icon: HelpCircle, comingSoon: true },
      { label: "Contact Support", desc: "Chat with our team", icon: MessageSquare, comingSoon: true },
      { label: "About FinCopilot", desc: "Version, terms, privacy", icon: Info, comingSoon: true },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Calendar Sync", desc: "Bills and SIPs to Google Calendar", icon: Calendar, value: "Off", comingSoon: true },
      { label: "WhatsApp Alerts", desc: "Critical alerts via WhatsApp", icon: MessageCircle, value: "Not connected", comingSoon: true },
      { label: "UPI Autopay", desc: "Auto-pay subscriptions", icon: Zap, value: "Off", comingSoon: true },
    ],
  },
];

// ── Security helpers ─────────────────────────────────────────────────────
function securityColor(score: number): string {
  if (score >= 80) return "var(--positive)";
  if (score >= 50) return "var(--warning)";
  return "var(--negative)";
}

function securityLabel(score: number): string {
  return getScoreLabel(score);
}

// ── Theme switch (spring thumb) ──────────────────────────────────────────
function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative w-[44px] h-[26px] rounded-full transition-colors shrink-0"
      style={{
        background: isDark ? "var(--accent)" : "var(--surface-subtle)",
        boxShadow: "inset 0 0 0 1px var(--border)",
      }}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-[3px] w-[20px] h-[20px] rounded-full bg-white flex items-center justify-center"
        style={{ left: isDark ? "21px" : "3px", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }}
      >
        {mounted && (isDark ? <Moon className="w-3 h-3 text-accent" /> : <Sun className="w-3 h-3 text-(--warning)" />)}
      </motion.span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function YouPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const growth = useResource(loadGrowth);
  const { openUserProfile } = useClerk();
  const router = useRouter();
  const gamification = growth.data;
  if (!gamification) return <ResourceState loading={growth.loading} error={growth.error} retry={growth.reload} />;

  const securityData = { two_factor_enabled: user?.twoFactorEnabled === true };
  const verifiedFactors = Number(user?.primaryEmailAddress?.verification?.status === "verified") + Number(securityData.two_factor_enabled);
  const score = verifiedFactors;
  const scoreColor = securityColor(score * 50);
  const scorePct = score * 50;

  const openSetting = (entry: string) => {
    if (entry === "Profile editing" || entry === "Profile") { openUserProfile(); return; }
    if (["Plan", "Billing History", "Calendar Sync", "WhatsApp Alerts", "UPI Autopay"].includes(entry)) {
      toast({ title: entry, description: "This service is not connected in this app yet. No subscription, sync or payment has been started." });
      return;
    }
    const destinations: Record<string, string> = {
      "Payment Methods": "/you/connections",
      "Help Center": "/help",
      "Contact Support": "/help",
      "About FinCopilot": "/help",
      "Notifications": "/you/preferences",
      "Currency": "/you/preferences",
      "Language": "/you/preferences",
    };
    router.push(destinations[entry] || "/you");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-7 max-w-4xl mx-auto w-full pb-10"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.header variants={item} className="pt-1">
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em] text-foreground">You</h1>
        <p className="text-[14px] text-(--text-secondary) mt-1">Profile, achievements, and settings</p>
      </motion.header>

      {/* ── Profile Hero Card ───────────────────────────────────────── */}
      <motion.section
        variants={item}
        aria-label="Profile"
        className="premium-card relative overflow-hidden p-6"
        style={{
          background: `
            radial-gradient(circle at 0% 0%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 60%),
            radial-gradient(circle at 100% 100%, color-mix(in oklab, var(--gold) 16%, transparent), transparent 65%),
            var(--surface)
          `,
        }}
      >
        <div
          aria-hidden
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-[0.18] blur-2xl pointer-events-none"
          style={{ background: "var(--gold)" }}
        />

        <button
          type="button"
          onClick={() => openSetting("Profile editing")}
          aria-label="Edit profile"
          className="absolute top-4 right-4 w-9 h-9 rounded-[10px] flex items-center justify-center text-(--text-secondary) hover:text-foreground hover:bg-(--surface-subtle) transition-colors z-10"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-5 relative">
          <div className="relative shrink-0">
            <div
              className="absolute -inset-1 rounded-full opacity-60 blur-[6px]"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--gold))" }}
              aria-hidden
            />
            {user?.imageUrl ? (
              <img src={user.imageUrl} alt="Avatar" className="relative w-20 h-20 rounded-full object-cover shadow-md z-10" />
            ) : (
              <div
                className="relative w-20 h-20 rounded-full flex items-center justify-center text-accent-foreground font-display font-bold text-[30px] shrink-0 shadow-md"
                style={{ background: "linear-gradient(135deg, var(--accent), var(--gold))" }}
              >
                {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-[22px] tracking-[-0.01em] text-foreground truncate">
                {user?.fullName || "FinCopilot User"}
              </h2>
              <Badge label={`Level ${gamification.level || 1}`} variant="gold" />
            </div>
            <div className="flex flex-col gap-0.5 mt-1.5 text-[13px] text-(--text-secondary)">
              <span className="flex items-center gap-1.5 truncate">
                <span className="text-(--text-tertiary) font-mono text-[11px] uppercase tracking-wider">email</span>
                <span className="truncate">{user?.primaryEmailAddress?.emailAddress || "—"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-(--text-tertiary) font-mono text-[11px] uppercase tracking-wider">phone</span>
                <span>{user?.primaryPhoneNumber?.phoneNumber || "—"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-(--text-tertiary) font-mono text-[11px] uppercase tracking-wider">member</span>
                <span>Since {user ? formatDate(user.createdAt!.toISOString(), { style: "long" }) : "—"}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Data-driven Achievement Hub ─────────────────────────────── */}
      <motion.div variants={item}>
        <AchievementHub data={gamification} />
      </motion.div>

      {/* ── Sign-in checklist Card ─────────────────────────────────────── */}
      <motion.section variants={item} aria-label="Security">
        <Link href="/you/security" className="premium-card p-5 flex items-center gap-4 group block hover:border-[var(--border-strong)]">
          <div className="relative shrink-0">
            <ProgressRing pct={scorePct} size={64} stroke={6} color={scoreColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CountUp
                value={score}
                className="font-display font-bold text-[20px] leading-none tabular-nums text-foreground"
              />
              <span className="font-mono text-[8px] uppercase tracking-wider text-(--text-tertiary) mt-0.5">/ 2</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-[15px] text-foreground">Sign-in checklist</h3>
              <span
                className="text-[11px] font-mono uppercase tracking-wider font-semibold"
                style={{ color: scoreColor }}
              >
                {`${verifiedFactors} of 2 enabled`}
              </span>
            </div>
            <p className="text-[12px] text-(--text-tertiary) mt-1">
              {securityData.two_factor_enabled ? "2FA enabled · manage active sessions" : "Enable 2FA to improve"}
            </p>
            {securityData.two_factor_enabled && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[var(--positive-light)] text-(--positive)">
                <ShieldCheck className="w-3 h-3" />
                2FA on
              </span>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-(--text-tertiary) shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.section>

      {/* ── Settings Groups ─────────────────────────────────────────── */}
      {SETTING_GROUPS.map((group) => (
        <motion.section key={group.title} variants={item} aria-label={group.title}>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-(--text-tertiary) mb-2.5 px-1">
            {group.title}
          </h2>
          <div className="premium-card overflow-hidden">
            {group.items.map((row, i) => {
              const Icon = row.icon;
              const isLast = i === group.items.length - 1;
              const inner = (
                <>
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: "var(--surface-subtle)" }}
                  >
                    <Icon className="w-4 h-4 text-(--text-secondary)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-foreground">{row.label}</p>
                    <p className="text-[12px] text-(--text-tertiary) mt-0.5 leading-snug">{row.desc}</p>
                  </div>
                  {row.value && !row.toggle && (
                    <span className="text-[12px] font-medium text-(--text-secondary) tabular-nums shrink-0">
                      {row.value}
                    </span>
                  )}
                  {row.toggle === "theme" ? (
                    <ThemeSwitch />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-(--text-tertiary) shrink-0" />
                  )}
                </>
              );

              const cls = `flex items-center gap-3 p-4 transition-colors hover:bg-(--surface-subtle)/60 ${
                isLast ? "" : "border-b border-(--border-subtle)"
              }`;

              if (row.href) {
                return (
                  <Link key={row.label} href={row.href} className={cls}>
                    {inner}
                  </Link>
                );
              }
              if (row.toggle === "theme") {
                return (
                  <div key={row.label} className={cls}>
                    {inner}
                  </div>
                );
              }
              return (
                <button key={row.label} type="button" onClick={() => openSetting(row.label)} className={`${cls} text-left w-full`}>
                  {inner}
                </button>
              );
            })}
          </div>
        </motion.section>
      ))}

      {/* ── Danger Zone ─────────────────────────────────────────────── */}
      <motion.section variants={item} aria-label="Danger zone" className="flex flex-col items-center gap-3 pt-2">
        <SignOutButton />
        <p className="font-mono text-[10px] uppercase tracking-wider text-(--text-tertiary)">
          FinCopilot · v{process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"}
        </p>
      </motion.section>
    </motion.div>
  );
}
