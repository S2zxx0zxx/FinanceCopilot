"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Home, Wallet, Layers, Sparkles, User, Plus, MessageCircle,
  Search, Target, Moon, Sun, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

function useIsOnline() {
  const [online, setOnline] = React.useState(true);
  React.useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)] transition-colors"
    >
      {mounted && theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const online = useIsOnline();
  const [fabOpen, setFabOpen] = React.useState(false);
  const fabRef = React.useRef<HTMLDivElement>(null);

  // Pages where FAB is hidden (full-screen experiences)
  const fabHidden = ["/onboarding", "/ai/chat", "/ai/afford", "/ai/leaks", "/ai/what-if", "/ai/explain-month", "/ai/goal-accelerator", "/login"].some(p => pathname.startsWith(p));

  // Close FAB on outside click
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setFabOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-white font-display font-bold text-[15px]">
            F
          </div>
          <span className="font-display font-bold text-[16px] tracking-[-0.01em]">
            FinCopilot
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 p-3" aria-label="Primary">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.exactMatch
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-medium transition-all",
                  active
                    ? "bg-[var(--accent-light)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-subtle)]"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2 text-[12px] text-[var(--text-tertiary)]">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--positive)]" />
              <span>Secured</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Offline banner */}
        {!online && (
          <div className="bg-[var(--warning-light)] text-[var(--warning)] text-[13px] px-5 py-2 text-center font-medium animate-fade-in">
            You're offline. Showing last available data.
          </div>
        )}

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-8 max-w-5xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] px-2 pb-[env(safe-area-inset-bottom)]" aria-label="Mobile">
        <div className="flex items-center justify-around h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = item.exactMatch
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                  active ? "text-[var(--accent)]" : "text-[var(--text-tertiary)]"
                )}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* FAB */}
      {!fabHidden && (
        <div ref={fabRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
          {/* FAB Menu */}
          {fabOpen && (
            <div className="absolute bottom-16 right-0 flex flex-col gap-2 animate-fade-in">
              {FAB_ACTIONS.map((action, i) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    onClick={() => setFabOpen(false)}
                    className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-[12px] pl-3 pr-4 py-2.5 shadow-[var(--shadow-lg)] hover:border-[var(--accent)] transition-colors min-w-[160px]"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <Icon className="w-4 h-4 text-[var(--accent)]" />
                    <span className="text-[13px] font-medium">{action.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* FAB Trigger */}
          <button
            onClick={() => setFabOpen(!fabOpen)}
            aria-label="Quick actions"
            className={cn(
              "w-14 h-14 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shadow-[var(--shadow-lg),var(--shadow-glow)] hover:bg-[var(--accent-hover)] transition-all hover:scale-105",
              fabOpen && "rotate-45"
            )}
          >
            <Plus className="w-6 h-6" strokeWidth={2.2} />
          </button>
        </div>
      )}
    </div>
  );
}
