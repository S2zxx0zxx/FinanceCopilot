"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Wallet, Layers, Sparkles, User, Plus, MessageCircle,
  Search, Target, Moon, Sun, ShieldCheck, Bell, Flame,
  TrendingUp, TrendingDown, ArrowUpRight, Settings, HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/hooks/use-app-data";
import { timeAgo } from "@/lib/format";
import { gamification as fallbackGame, notifications as fallbackNotifs } from "@/lib/data";

const NAV_SECTIONS = [
  {
    label: "MAIN",
    items: [
      { href: "/", label: "Dashboard", icon: Home, exactMatch: true },
      { href: "/money", label: "Accounts", icon: Wallet },
      { href: "/transactions", label: "Transactions", icon: ArrowUpRight },
      { href: "/spending-story", label: "Spending", icon: TrendingUp },
      { href: "/plan", label: "Budgets", icon: Layers },
      { href: "/goals", label: "Goals", icon: Target },
      { href: "/recurring", label: "Bills", icon: Bell },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      { href: "/you", label: "Settings", icon: Settings },
      { href: "/ai", label: "AI Copilot", icon: Sparkles },
      { href: "/help", label: "Help & Support", icon: HelpCircle },
    ],
  },
];

const FAB_ACTIONS = [
  { label: "Ask AI", icon: MessageCircle, href: "/ai/chat" },
  { label: "Transactions", icon: Search, href: "/transactions" },
  { label: "Goals", icon: Target, href: "/goals" },
];

function useIsMounted(): boolean {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] transition-all duration-200 hover:scale-105"
    >
      {mounted && theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
    </button>
  );
}

function NotificationBell() {
  const { notifications: rawNotifs } = useAppData();
  const notifData = rawNotifs || fallbackNotifs;
  const arr = Array.isArray(notifData) ? notifData : (notifData?.notifications || []);
  const unreadNotificationsCount = arr.filter((n: any) => !(n.read ?? n.is_read)).length;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Notifications"
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] transition-all duration-200 hover:scale-105 relative"
      >
        <Bell className="w-[18px] h-[18px]" />
        <AnimatePresence>
          {unreadNotificationsCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[var(--danger)] text-white text-[9px] font-bold flex items-center justify-center"
            >
              {unreadNotificationsCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-[20px] shadow-[var(--shadow-xl)] z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--surface)]">
              <h3 className="text-[14px] font-semibold">Notifications</h3>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">{unreadNotificationsCount} unread</span>
            </div>
            {arr.map((n: any, i: number) => {
              const notifBg = n.severity === "warning"
                ? "var(--warning-light, rgba(217,119,6,0.12))"
                : n.severity === "positive"
                  ? "var(--positive-light, rgba(5,150,105,0.12))"
                  : "var(--surface-subtle)";
              const bellColor = n.severity === "warning"
                ? "var(--warning, #D97706)"
                : n.severity === "positive"
                  ? "var(--positive, #059669)"
                  : "var(--text-muted)";
              return (
                <Link
                  key={n.id || i}
                  href={n.action_href || "#"}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-subtle)] transition-colors border-b border-[var(--border)] last:border-0"
                >
                  <div
                    className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                    style={{ background: notifBg }}
                  >
                    {n.type === "milestone"
                      ? <Flame className="w-4 h-4 text-[var(--warning,#D97706)]" />
                      : <Bell className="w-4 h-4" style={{ color: bellColor }} />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate">{n.title}</p>
                    <p className="text-[12px] text-[var(--text-secondary)] truncate">{n.description}</p>
                    <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">{timeAgo(n.timestamp)}</p>
                  </div>
                  {!(n.read ?? n.is_read) && <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 mt-1.5 animate-pulse" />}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const { gamification: rawGamification } = useAppData();
  const gamification = rawGamification || fallbackGame;
  const [fabOpen, setFabOpen] = React.useState(false);
  const fabRef = React.useRef<HTMLDivElement>(null);
  const fabHidden = ["/onboarding", "/ai/chat", "/ai/afford", "/ai/leaks"].some(p => pathname.startsWith(p));

  React.useEffect(() => {
    const h = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setFabOpen(false);
      }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <div className="min-h-screen flex bg-[var(--bg)]">
      {/* ── Desktop Sidebar (floating card design) ── */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 fixed inset-y-3 left-3 z-30 rounded-[24px] bg-[var(--surface)] border border-[var(--border)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-[#0A0F0D] font-display font-bold text-[15px]">F</div>
          <span className="font-display font-bold text-[17px] tracking-[-0.02em] text-[var(--text)]">FinCopilot</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto" aria-label="Primary">
          {NAV_SECTIONS.map((section, si) => (
            <React.Fragment key={section.label}>
              {si > 0 && <div className="h-3" />}
              <p className="text-[10px] font-mono uppercase tracking-[0.08em] text-[var(--text-muted)] px-3 pb-1 pt-2 font-semibold">{section.label}</p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.exactMatch ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-medium transition-all duration-200 group relative overflow-hidden",
                      active
                        ? "bg-[var(--surface-subtle)] text-[var(--text)] font-semibold"
                        : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)]",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {active && (
                      <motion.span
                        layoutId="sidebar-active-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--gold)]"
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                    <Icon className={cn("w-[18px] h-[18px] shrink-0 transition-colors", active && "text-[var(--accent)]")} strokeWidth={active ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        {/* Streak card */}
        <div className="px-3 pb-2">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-[var(--accent-dim)] to-[var(--gold-light)] rounded-[14px] p-3 flex items-center gap-3 border border-[var(--border)]"
          >
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4 text-[#0A0F0D]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[var(--text)]">{gamification.tracking_streak_days} day streak 🔥</p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Level {gamification.level}: {gamification.level_name}</p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
              <span>Secured</span>
            </div>
            <div className="flex items-center gap-1">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-[272px] flex flex-col min-h-screen">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-6 pb-24 md:pb-8 max-w-5xl w-full mx-auto">{children}</main>
      </div>

      {/* ── Mobile header ── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-[var(--surface)] border-b border-[var(--border)] h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-[#0A0F0D] font-display font-bold text-[13px]">F</div>
          <span className="font-display font-bold text-[15px] text-[var(--text)]">FinCopilot</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] px-2 pb-[env(safe-area-inset-bottom)]" aria-label="Mobile">
        <div className="flex items-center justify-around h-16">
          {NAV_SECTIONS[0].items.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = item.exactMatch ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors", active ? "text-[var(--accent)]" : "text-[var(--text-muted)]")}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── FAB ── */}
      {!fabHidden && (
        <div ref={fabRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
          <AnimatePresence>
            {fabOpen && (
              <div className="absolute bottom-16 right-0 flex flex-col gap-2">
                {FAB_ACTIONS.map((action, i) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.href}
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}
                    >
                      <Link
                        href={action.href}
                        onClick={() => setFabOpen(false)}
                        className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] pl-3 pr-4 py-2.5 shadow-[var(--shadow-lg)] hover:border-[var(--accent)] transition-colors min-w-[160px]"
                      >
                        <Icon className="w-4 h-4 text-[var(--accent)]" />
                        <span className="text-[13px] font-medium text-[var(--text)]">{action.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
          <motion.button
            onClick={() => setFabOpen(!fabOpen)}
            aria-label="Quick actions"
            whileTap={{ scale: 0.9 }}
            className={cn(
              "w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] text-[#0A0F0D] flex items-center justify-center shadow-[0_8px_32px_-4px_var(--accent-glow),0_0_0_1px_rgba(52,211,153,0.2)] hover:shadow-[0_12px_40px_-4px_var(--accent-glow),0_0_40px_var(--accent-glow)] transition-shadow",
              fabOpen && "rotate-45"
            )}
          >
            <Plus className="w-6 h-6" strokeWidth={2.5} />
          </motion.button>
        </div>
      )}
    </div>
  );
}
