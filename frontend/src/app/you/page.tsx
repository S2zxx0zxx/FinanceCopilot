"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  ShieldCheck, Lock, EyeOff, Download, Bell, User, ChevronRight,
  Flame, Pencil, CreditCard, Globe, IndianRupee, Languages, Sun, Moon,
  HelpCircle, MessageSquare, Info, LogOut, Crown, Calendar, MessageCircle,
  Zap, Award, Sparkles, Check, TrendingUp, type LucideIcon,
} from "lucide-react";
import {
  currentUser, securityData, gamification, privacyData, accounts,
} from "@/lib/data";
import { formatDate, formatPct } from "@/lib/format";
import { Badge, ProgressRing, CountUp } from "@/components/shared";
import { useToast } from "@/hooks/use-toast";

// ── Motion variants ───────────────────────────────────────────────────────
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
const itemQuick: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

// ── Settings types ────────────────────────────────────────────────────────
type SettingsRow = {
  label: string;
  desc: string;
  href?: string;
  icon: LucideIcon;
  value?: string;
  toggle?: "theme";
};

type SettingsGroup = { title: string; items: SettingsRow[] };

const activeAccounts = accounts.filter((a) => a.is_active).length;

// ── Settings groups (6) ───────────────────────────────────────────────────
const SETTING_GROUPS: SettingsGroup[] = [
  {
    title: "Account",
    items: [
      { label: "Profile", desc: "Name, email, phone", href: "/you", icon: User },
      { label: "Payment Methods", desc: "Cards, UPI, bank transfers", href: "/you", icon: CreditCard },
    ],
  },
  {
    title: "Membership",
    items: [
      { label: "Plan", desc: "Free tier · upgrade for unlimited AI", href: "/you", icon: Crown, value: "Free" },
      { label: "Billing History", desc: "Invoices and receipts", href: "/you", icon: CreditCard },
    ],
  },
  {
    title: "Data & Privacy",
    items: [
      { label: "Connections", desc: `${activeAccounts} accounts linked`, href: "/you/connections", icon: ShieldCheck },
      { label: "Privacy Center", desc: "Consent, data inventory", href: "/you/privacy", icon: EyeOff },
      { label: "Security", desc: "2FA, sessions, activity", href: "/you/security", icon: Lock },
      { label: "Data & Export", desc: "Export or delete your data", href: "/you/export", icon: Download },
    ],
  },
  {
    title: "Preferences",
    items: [
      { label: "Currency", desc: "Indian Rupee", href: "/you", icon: IndianRupee, value: "₹ INR" },
      { label: "Theme", desc: "Switch appearance", icon: Sun, toggle: "theme" },
      { label: "Notifications", desc: "Alerts, emails, push", href: "/you", icon: Bell },
      { label: "Language", desc: "Display language", href: "/you", icon: Languages, value: "English" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", desc: "Guides and FAQs", href: "/you", icon: HelpCircle },
      { label: "Contact Support", desc: "Chat with our team", href: "/you", icon: MessageSquare },
      { label: "About FinCopilot", desc: "Version, terms, privacy", href: "/you", icon: Info },
    ],
  },
  {
    title: "Integrations",
    items: [
      { label: "Calendar Sync", desc: "Bills and SIPs to Google Calendar", href: "/you", icon: Calendar, value: "Off" },
      { label: "WhatsApp Alerts", desc: "Critical alerts via WhatsApp", href: "/you", icon: MessageCircle, value: "On" },
      { label: "UPI Autopay", desc: "Auto-pay subscriptions", href: "/you", icon: Zap, value: "Off" },
    ],
  },
];

// ── Security helpers ─────────────────────────────────────────────────────
function securityColor(score: number): string {
  if (score >= 80) return "var(--positive)";
  if (score >= 50) return "var(--warning)";
  return "var(--negative)";
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
        {mounted && (isDark ? <Moon className="w-3 h-3 text-[var(--accent)]" /> : <Sun className="w-3 h-3 text-[var(--warning)]" />)}
      </motion.span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function YouPage() {
  const { toast } = useToast();
  const score = securityData.security_score;
  const scoreColor = securityColor(score);
  const scorePct = Math.min(score, 100);

  const xpPct = Math.round((gamification.xp / gamification.xp_to_next_level) * 100);
  const xpRemaining = gamification.xp_to_next_level - gamification.xp;

  // Latest achieved milestone (most recent date among achieved)
  const achievedMilestones = gamification.milestones.filter((m) => m.achieved);
  const latestAchieved = achievedMilestones
    .slice()
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())[0];
  // Next unachieved with progress
  const nextMilestone = gamification.milestones.find((m) => !m.achieved);

  const comingSoon = (label: string) =>
    toast({ title: "Coming soon", description: `${label} is on the v80 roadmap.` });

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-7 max-w-2xl mx-auto w-full pb-10"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <motion.header variants={item} className="pt-1">
        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em] text-[var(--foreground)]">
          You
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Profile, achievements, and settings
        </p>
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
        {/* Subtle gold corner accent */}
        <div
          aria-hidden
          className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-[0.18] blur-2xl pointer-events-none"
          style={{ background: "var(--gold)" }}
        />

        {/* Edit button */}
        <button
          type="button"
          onClick={() => comingSoon("Profile editing")}
          aria-label="Edit profile"
          className="absolute top-4 right-4 w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors z-10"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-5 relative">
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div
              className="absolute -inset-1 rounded-full opacity-60 blur-[6px]"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--gold))" }}
              aria-hidden
            />
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center text-white font-display font-bold text-[30px] shrink-0 shadow-md"
              style={{ background: "linear-gradient(135deg, var(--accent), var(--gold))" }}
            >
              {currentUser.displayName?.charAt(0) || "U"}
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-bold text-[22px] tracking-[-0.01em] text-[var(--foreground)] truncate">
                {currentUser.displayName}
              </h2>
              <Badge label="Level 4" variant="gold" />
            </div>
            <div className="flex flex-col gap-0.5 mt-1.5 text-[13px] text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5 truncate">
                <span className="text-[var(--text-tertiary)] font-mono text-[11px] uppercase tracking-wider">email</span>
                <span className="truncate">{currentUser.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[var(--text-tertiary)] font-mono text-[11px] uppercase tracking-wider">phone</span>
                <span>{currentUser.phone || "—"}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-[var(--text-tertiary)] font-mono text-[11px] uppercase tracking-wider">member</span>
                <span>Since {formatDate(currentUser.createdAt, { style: "long" })}</span>
              </span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── Gamification Hub ────────────────────────────────────────── */}
      <motion.section variants={item} aria-label="Achievements" className="premium-card p-5 sm:p-6">
        {/* Header strip */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[var(--gold)]" />
            <h3 className="font-display font-semibold text-[15px] tracking-[-0.01em] text-[var(--foreground)]">
              Achievements
            </h3>
          </div>
          <Badge label={`${gamification.badges.filter((b) => b.earned).length}/${gamification.badges.length} badges`} variant="gold" />
        </div>

        {/* Level ring + streak row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Level ring */}
          <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)]/60">
            <div className="relative shrink-0">
              <ProgressRing pct={xpPct} size={72} stroke={7} color="var(--gold)" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-[18px] leading-none tabular-nums text-[var(--foreground)]">
                  {gamification.level}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--text-tertiary)] mt-0.5">level</span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-[13px] text-[var(--foreground)] truncate">{gamification.level_name}</p>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 tabular-nums">
                <CountUp value={gamification.xp} format={(v) => Math.round(v).toLocaleString("en-IN")} /> / {gamification.xp_to_next_level.toLocaleString("en-IN")} XP
              </p>
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-4 p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)]/60">
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0"
              style={{ background: "color-mix(in oklab, var(--warning) 14%, transparent)" }}
            >
              <Flame className="w-8 h-8 text-[var(--warning)]" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-[22px] leading-none tabular-nums text-[var(--foreground)]">
                <CountUp value={gamification.tracking_streak_days} /><span className="text-[12px] font-medium text-[var(--text-tertiary)] ml-1">days</span>
              </p>
              <p className="text-[11px] text-[var(--text-tertiary)] mt-1.5">Tracking streak · best {gamification.longest_streak_days}d</p>
            </div>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">XP to level {gamification.level + 1}</span>
            <span className="text-[11px] font-medium text-[var(--text-secondary)] tabular-nums">
              {xpRemaining.toLocaleString("en-IN")} XP to go
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPct}%` }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, var(--accent), var(--gold))" }}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-subtle)] my-5" />

        {/* Badges */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Badges</h4>
          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{gamification.badges.filter((b) => b.earned).length} of {gamification.badges.length} earned</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {gamification.badges.map((b, i) => (
            <motion.div
              key={b.id}
              variants={itemQuick}
              custom={i}
              title={b.name}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-[22px] transition-transform hover:scale-105 ${b.earned ? "" : "opacity-40 grayscale"}`}
                style={{
                  background: b.earned ? "color-mix(in oklab, var(--gold) 14%, var(--surface))" : "var(--surface-subtle)",
                  boxShadow: b.earned ? "inset 0 0 0 1px color-mix(in oklab, var(--gold) 25%, transparent)" : "inset 0 0 0 1px var(--border-subtle)",
                }}
              >
                {b.earned ? b.icon : <Lock className="w-4 h-4 text-[var(--text-tertiary)]" />}
              </div>
              <span className={`text-[9.5px] font-medium leading-tight text-center w-full truncate ${b.earned ? "text-[var(--text-secondary)]" : "text-[var(--text-tertiary)]"}`}>
                {b.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-[var(--border-subtle)] my-5" />

        {/* Milestones preview */}
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text-tertiary)]">Milestones</h4>
          <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{achievedMilestones.length} of {gamification.milestones.length} complete</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Latest achieved */}
          {latestAchieved && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--positive-light)]/40 border border-[var(--border-subtle)]">
              <div className="flex items-start gap-2.5">
                <div
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{ background: "color-mix(in oklab, var(--positive) 16%, transparent)" }}
                >
                  <Check className="w-4 h-4 text-[var(--positive)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">{latestAchieved.title}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 leading-snug line-clamp-2">{latestAchieved.description}</p>
                  <p className="text-[10px] font-mono text-[var(--positive)] mt-1.5">
                    ✓ {formatDate(latestAchieved.date, { style: "long" })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next unachieved */}
          {nextMilestone && (
            <div className="p-3 rounded-[var(--radius-md)] bg-[var(--surface-subtle)]/60 border border-[var(--border-subtle)]">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 bg-[var(--surface-subtle)]">
                  <span className="text-[16px]">{nextMilestone.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--foreground)] truncate">{nextMilestone.title}</p>
                  <p className="text-[11px] text-[var(--text-tertiary)] mt-0.5 leading-snug line-clamp-2">{nextMilestone.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, Math.round(((nextMilestone.progress || 0) / (nextMilestone.target || 1)) * 100))}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                        className="h-full rounded-full"
                        style={{ background: "var(--accent)" }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-tertiary)] tabular-nums shrink-0">
                      {nextMilestone.progress}/{nextMilestone.target}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View all */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => comingSoon("Full achievements page")}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            View all achievements
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.section>

      {/* ── Security Score Card ─────────────────────────────────────── */}
      <motion.section variants={item} aria-label="Security">
        <Link href="/you/security" className="premium-card p-5 flex items-center gap-4 group block hover:border-[var(--border-strong)]">
          <div className="relative shrink-0">
            <ProgressRing pct={scorePct} size={64} stroke={6} color={scoreColor} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CountUp
                value={score}
                className="font-display font-bold text-[20px] leading-none tabular-nums text-[var(--foreground)]"
              />
              <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--text-tertiary)] mt-0.5">/ 100</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display font-semibold text-[15px] text-[var(--foreground)]">Security Score</h3>
              <span
                className="text-[11px] font-mono uppercase tracking-wider font-semibold"
                style={{ color: scoreColor }}
              >
                Strong
              </span>
            </div>
            <p className="text-[12px] text-[var(--text-tertiary)] mt-1">
              {securityData.two_factor_enabled ? "2FA enabled · 2 active sessions" : "Enable 2FA to improve"}
            </p>
            {securityData.two_factor_enabled && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold bg-[var(--positive-light)] text-[var(--positive)]">
                <ShieldCheck className="w-3 h-3" />
                2FA on
              </span>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)] shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </motion.section>

      {/* ── Settings Groups ─────────────────────────────────────────── */}
      {SETTING_GROUPS.map((group) => (
        <motion.section key={group.title} variants={item} aria-label={group.title}>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-tertiary)] mb-2.5 px-1">
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
                    <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-medium text-[var(--foreground)]">{row.label}</p>
                    <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5 leading-snug">{row.desc}</p>
                  </div>
                  {row.value && !row.toggle && (
                    <span className="text-[12px] font-medium text-[var(--text-secondary)] tabular-nums shrink-0">
                      {row.value}
                    </span>
                  )}
                  {row.toggle === "theme" ? (
                    <ThemeSwitch />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] shrink-0" />
                  )}
                </>
              );

              const cls = `flex items-center gap-3 p-4 transition-colors hover:bg-[var(--surface-subtle)]/60 ${
                isLast ? "" : "border-b border-[var(--border-subtle)]"
              }`;

              if (row.href) {
                return (
                  <Link key={row.label} href={row.href} className={cls}>
                    {inner}
                  </Link>
                );
              }
              // For theme toggle rows, don't wrap in button (ThemeSwitch has its own button)
              if (row.toggle === "theme") {
                return (
                  <div key={row.label} className={cls}>
                    {inner}
                  </div>
                );
              }
              return (
                <button key={row.label} type="button" onClick={() => comingSoon(row.label)} className={`${cls} text-left w-full`}>
                  {inner}
                </button>
              );
            })}
          </div>
        </motion.section>
      ))}

      {/* ── Danger Zone ─────────────────────────────────────────────── */}
      <motion.section variants={item} aria-label="Danger zone" className="flex flex-col items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => toast({ title: "Signed out", description: "You've been signed out (mock)." })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] text-[14px] font-medium text-[var(--negative)] hover:bg-[var(--negative-light)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">
          FinCopilot · App version v78.0
        </p>
      </motion.section>
    </motion.div>
  );
}
