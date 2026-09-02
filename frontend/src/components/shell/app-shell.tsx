"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Home, Wallet, Layers, Sparkles, User, Plus, MessageCircle,
  Search, Target, Moon, Sun, ShieldCheck, Bell, Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { unreadNotificationsCount, notifications as notifData, gamification } from "@/lib/data";
import { timeAgo } from "@/lib/format";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home, exactMatch: true },
  { href: "/money", label: "Money", icon: Wallet },
  { href: "/plan", label: "Plan", icon: Layers },
  { href: "/ai", label: "AI", icon: Sparkles },
  { href: "/you", label: "You", icon: User },
];

const FAB_ACTIONS = [
  { label: "Ask AI", icon: MessageCircle, href: "/ai/chat" },
  { label: "Transactions", icon: Search, href: "/transactions" },
  { label: "Goals", icon: Target, href: "/goals" },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle theme"
      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors">
      {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

function NotificationBell() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} aria-label="Notifications"
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors relative">
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[var(--negative)] text-white text-[9px] font-bold flex items-center justify-center">
            {unreadNotificationsCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-[16px] shadow-[var(--shadow-xl)] z-50 animate-fade-in">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="text-[14px] font-semibold">Notifications</h3>
            <span className="text-[11px] text-[var(--text-tertiary)]">{unreadNotificationsCount} unread</span>
          </div>
          {notifData.map((n) => (
            <Link key={n.id} href={n.action_href || "#"} onClick={() => setOpen(false)}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-subtle)] transition-colors border-b border-[var(--border-subtle)] last:border-0 ${!n.read ? "bg-[var(--accent-light)]/30" : ""}`}>
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center shrink-0"
                style={{ background: n.severity === "warning" ? "var(--warning-light)" : n.severity === "positive" ? "var(--positive-light)" : "var(--surface-subtle)" }}>
                {n.type === "milestone" ? <Flame className="w-4 h-4 text-[var(--warning)]" /> : <Bell className="w-4 h-4" style={{ color: n.severity === "warning" ? "var(--warning)" : n.severity === "positive" ? "var(--positive)" : "var(--text-tertiary)" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate">{n.title}</p>
                <p className="text-[12px] text-[var(--text-secondary)] truncate">{n.description}</p>
                <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">{timeAgo(n.timestamp)}</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [fabOpen, setFabOpen] = React.useState(false);
  const fabRef = React.useRef<HTMLDivElement>(null);
  const fabHidden = ["/onboarding", "/ai/chat", "/ai/afford", "/ai/leaks", "/ai/what-if", "/ai/explain-month", "/ai/goal-accelerator", "/login"].some(p => pathname.startsWith(p));

  React.useEffect(() => {
    const h = (e: MouseEvent) => { if (fabRef.current && !fabRef.current.contains(e.target as Node)) setFabOpen(false); };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] fixed inset-y-0 left-0 z-30">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-white font-display font-bold text-[15px]">F</div>
          <span className="font-display font-bold text-[16px] tracking-[-0.01em]">FinCopilot</span>
        </div>
        <nav className="flex-1 flex flex-col gap-1 p-3" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon; const active = item.exactMatch ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={cn("flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-medium transition-all", active ? "bg-[var(--accent-light)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)]")}
                aria-current={active ? "page" : undefined}>
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} /><span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Streak indicator */}
        <div className="px-3 mb-2">
          <div className="bg-gradient-to-br from-[var(--accent-light)] to-[var(--gold-light)] rounded-[12px] p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center"><Flame className="w-4 h-4 text-white" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold">{gamification.tracking_streak_days} day streak 🔥</p>
              <p className="text-[10px] text-[var(--text-tertiary)]">Level {gamification.level}: {gamification.level_name}</p>
            </div>
          </div>
        </div>
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]"><ShieldCheck className="w-3.5 h-3.5 text-[var(--positive)]" /><span>Secured</span></div>
            <div className="flex items-center gap-1"><NotificationBell /><ThemeToggle /></div>
          </div>
        </div>
      </aside>
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-5xl w-full mx-auto">{children}</main>
      </div>
      {/* Mobile header with notification */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-[var(--surface)] border-b border-[var(--border)] h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-white font-display font-bold text-[13px]">F</div>
          <span className="font-display font-bold text-[15px]">FinCopilot</span>
        </div>
        <div className="flex items-center gap-1"><NotificationBell /><ThemeToggle /></div>
      </div>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] px-2 pb-[env(safe-area-inset-bottom)]" aria-label="Mobile">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon; const active = item.exactMatch ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}
                className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors", active ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]")}
                aria-current={active ? "page" : undefined} aria-label={item.label}>
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      {/* Mobile spacer for fixed header */}
      <div className="md:hidden h-14" />
      {!fabHidden && (
        <div ref={fabRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
          {fabOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-fade-in">
              {FAB_ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href} onClick={() => setFabOpen(false)}
                    className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-[12px] pl-3 pr-4 py-2.5 shadow-[var(--shadow-lg)] hover:border-[var(--accent)] transition-colors min-w-[160px]"
                    style={{ animationDelay: `${i * 40}ms` }}>
                    <Icon className="w-4 h-4 text-[var(--accent)]" /><span className="text-[13px] font-medium">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
          <button onClick={() => setFabOpen(!fabOpen)} aria-label="Quick actions"
            className={cn("w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-[var(--shadow-lg),var(--shadow-glow)] hover:bg-[var(--accent-hover)] transition-all hover:scale-105", fabOpen && "rotate-45")}>
            <Plus className="w-6 h-6" strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  );
}
