"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Bot,
  Cable,
  CalendarDays,
  Compass,
  Download,
  EyeOff,
  FileInput,
  Flame,
  GitCompareArrows,
  HelpCircle,
  Home,
  Layers,
  Menu,
  MessageCircle,
  Moon,
  Plus,
  Receipt,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/format";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { object, rows } from "@/lib/response";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

const loadShellGrowth = async () => object(await api.getGamification());
const loadShellNotifications = async () => rows(await api.getNotifications());
const loadShellPreferences = async () => object(object(await api.getPreferences()).preferences);

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  exactMatch?: boolean;
  description: string;
};

type NavSection = { label: string; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Your money",
    items: [
      { href: "/", label: "Dashboard", icon: Home, exactMatch: true, description: "Your daily financial picture" },
      { href: "/money", label: "Money overview", icon: Wallet, description: "Balances across all accounts" },
      { href: "/accounts", label: "Account vault", icon: Layers, description: "Banks, cards, cash and account details" },
      { href: "/transactions", label: "Activity journal", icon: ArrowUpRight, description: "Search, review and correct transactions" },
      { href: "/spending-story", label: "Spending lens", icon: TrendingDown, description: "Understand where your money goes" },
      { href: "/income", label: "Income streams", icon: TrendingUp, description: "Sources, trends and recorded income" },
      { href: "/cashflow", label: "Cashflow pulse", icon: Activity, description: "Money arriving and leaving" },
    ],
  },
  {
    label: "Build ahead",
    items: [
      { href: "/plan", label: "Your game plan", icon: Compass, description: "Bring your financial plans together" },
      { href: "/budgets", label: "Spending guardrails", icon: SlidersHorizontal, description: "Set and manage category budgets" },
      { href: "/goals", label: "Dream milestones", icon: Target, description: "Create goals and record progress" },
      { href: "/recurring", label: "Bills & rhythms", icon: CalendarDays, description: "Recurring payments and subscriptions" },
      { href: "/liabilities", label: "Debt roadmap", icon: Receipt, description: "Understand outstanding obligations" },
      { href: "/forecast", label: "Future outlook", icon: TrendingUp, description: "Explore estimates and scenarios" },
      { href: "/financial-health", label: "Financial fitness", icon: Activity, description: "Understand your financial indicators" },
    ],
  },
  {
    label: "Advanced money",
    items: [
      { href: "/finance", label: "Money workspace", icon: Settings, exactMatch: true, description: "Investments, invoices, automation and shared finance" },
      { href: "/finance/assets", label: "Investments & assets", icon: TrendingUp, description: "Holdings, valuations and portfolio activity" },
      { href: "/finance/invoices", label: "Invoices", icon: Receipt, description: "Receivables, payables, PDFs and sharing" },
      { href: "/finance/imports", label: "Import center", icon: FileInput, description: "Bring in CSV, OFX, QIF and CAMT data" },
      { href: "/finance/reports", label: "Reports & net worth", icon: BarChart3, description: "Net worth, income, expenses and trends" },
      { href: "/finance/reconciliation", label: "Reconciliation", icon: GitCompareArrows, description: "Match records and resolve financial differences" },
      { href: "/finance/rules", label: "Automation", icon: SlidersHorizontal, description: "Automate classification and money housekeeping" },
    ],
  },
  {
    label: "Copilot studio",
    items: [
      { href: "/ai", label: "Copilot workspace", icon: Sparkles, exactMatch: true, description: "Insights and questions worth exploring" },
      { href: "/ai/chat", label: "Ask your copilot", icon: MessageCircle, description: "Ask questions about your money" },
      { href: "/ai/agents", label: "Agent studio", icon: Bot, description: "Configure financial agents, models, tools and knowledge" },
      { href: "/ai/afford", label: "Purchase check", icon: Wallet, description: "Explore a planned purchase" },
      { href: "/ai/leaks", label: "Savings detective", icon: Search, description: "Review potential savings opportunities" },
      { href: "/search", label: "Find anything", icon: Search, description: "Search across your financial records" },
    ],
  },
  {
    label: "Your space",
    items: [
      { href: "/you", label: "Personal hub", icon: User, exactMatch: true, description: "Profile, progress and account settings" },
      { href: "/you/connections", label: "Connection center", icon: Cable, description: "Manage India AA and connected accounts" },
      { href: "/finance/connections", label: "Bank sync", icon: Cable, description: "Manage supported open-banking providers" },
      { href: "/finance/workspaces", label: "Shared workspaces", icon: Users, description: "Members, roles and collaborative finance" },
      { href: "/finance/security", label: "Advanced security", icon: ShieldCheck, description: "Passkeys, TOTP and additional sign-in controls" },
      { href: "/you/privacy", label: "Privacy choices", icon: EyeOff, description: "Consent and data inventory" },
      { href: "/you/security", label: "Security center", icon: ShieldCheck, description: "Sessions and Clerk sign-in protection" },
      { href: "/you/export", label: "Your data library", icon: Download, description: "Export your financial records" },
      { href: "/data-coverage", label: "Data confidence", icon: Layers, description: "Understand gaps in account coverage" },
      { href: "/help", label: "Help & guidance", icon: HelpCircle, description: "Guides, answers and support" },
    ],
  },
];

const FAB_ACTIONS = [
  { label: "Ask AI", icon: MessageCircle, href: "/ai/chat" },
  { label: "Import data", icon: FileInput, href: "/finance/imports" },
  { label: "Transactions", icon: Search, href: "/transactions" },
  { label: "Goals", icon: Target, href: "/goals" },
];

function useIsMounted(): boolean {
  return React.useSyncExternalStore(() => () => {}, () => true, () => false);
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
  const notifications = useResource(loadShellNotifications);
  const arr = notifications.data || [];
  const unreadCount = arr.filter((notification: any) => !(notification.read ?? notification.is_read)).length;
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)] transition-all duration-200 hover:scale-105 relative"
      >
        <Bell className="w-[18px] h-[18px]" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[var(--negative)] text-white text-[9px] font-bold flex items-center justify-center"
            >
              {unreadCount}
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
            className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto bg-[var(--surface)] border border-[var(--border)] rounded-[20px] shadow-[var(--shadow-xl)] z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between sticky top-0 bg-[var(--surface)]">
              <h3 className="text-[14px] font-semibold">Notifications</h3>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">{unreadCount} unread</span>
            </div>
            {arr.length === 0 && <p className="p-5 text-sm text-[var(--text-secondary)]">You are all caught up.</p>}
            {arr.map((notification: any, index: number) => (
              <Link
                key={notification.id || index}
                href={notification.action_href || "#"}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-4 py-3 hover:bg-[var(--surface-subtle)] transition-colors border-b border-[var(--border)] last:border-0"
              >
                <div className="w-8 h-8 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
                  {notification.type === "milestone" ? <Flame className="w-4 h-4 text-[var(--warning)]" /> : <Bell className="w-4 h-4 text-[var(--text-muted)]" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate">{notification.title}</p>
                  <p className="text-[12px] text-[var(--text-secondary)] truncate">{notification.description}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-mono">{timeAgo(notification.timestamp)}</p>
                </div>
                {!(notification.read ?? notification.is_read) && <span className="w-2 h-2 rounded-full bg-[var(--accent)] shrink-0 mt-1.5" />}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const publicOrAuth = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/onboarding") || pathname.startsWith("/i/");
  if (publicOrAuth) return <>{children}</>;
  return <AppShellInner>{children}</AppShellInner>;
}

function AppShellInner({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const preferences = useResource(loadShellPreferences);
  const growth = useResource(loadShellGrowth);
  const gamification = growth.data;
  const [toolsOpen, setToolsOpen] = React.useState(false);
  const [toolQuery, setToolQuery] = React.useState("");
  const [fabOpen, setFabOpen] = React.useState(false);
  const fabRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.documentElement.dataset.density = preferences.data?.density === "compact" ? "compact" : "comfortable";
  }, [preferences.data]);

  React.useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setToolsOpen((value) => !value);
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  React.useEffect(() => {
    const close = (event: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(event.target as Node)) setFabOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const allItems = NAV_SECTIONS.flatMap((group) => group.items);
  const activeHref = allItems
    .filter((item) => (item.exactMatch ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;
  const fabHidden = ["/onboarding", "/ai/chat", "/ai/afford", "/ai/leaks"].some((path) => pathname.startsWith(path));

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="hidden md:flex flex-col w-[272px] shrink-0 fixed inset-y-3 left-3 z-30 rounded-[24px] bg-[var(--surface)] border border-[var(--border)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-[#0A0F0D] font-display font-bold text-[15px]">F</div>
          <span className="font-display font-bold text-[17px] tracking-[-0.02em] text-[var(--text)]">FinCopilot</span>
        </div>

        <button onClick={() => setToolsOpen(true)} className="mx-4 mt-4 mb-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] flex items-center gap-2 px-3 min-h-11 text-sm text-[var(--text-secondary)]">
          <Search className="w-4 h-4" /><span className="flex-1 text-left">Jump to a tool</span><kbd className="text-[10px] border border-[var(--border)] rounded px-1">Ctrl K</kbd>
        </button>

        <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto" aria-label="Primary">
          {NAV_SECTIONS.map((section, sectionIndex) => (
            <React.Fragment key={section.label}>
              {sectionIndex > 0 && <div className="h-3" />}
              <p className="text-[10px] font-mono uppercase tracking-[0.08em] text-[var(--text-muted)] px-3 pb-1 pt-2 font-semibold">{section.label}</p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = item.href === activeHref;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 min-h-11 rounded-[12px] text-[14px] font-medium transition-all duration-200 group relative overflow-hidden",
                      active ? "bg-[var(--surface-subtle)] text-[var(--text)] font-semibold" : "text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-subtle)]",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {active && <motion.span layoutId="sidebar-active-indicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--gold)]" />}
                    <Icon className={cn("w-[18px] h-[18px] shrink-0", active && "text-[var(--accent)]")} strokeWidth={active ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </React.Fragment>
          ))}
        </nav>

        <div className="px-3 pb-2">
          <div className="bg-gradient-to-br from-[var(--accent-light)] to-[var(--gold-light)] rounded-[14px] p-3 flex items-center gap-3 border border-[var(--border)]">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shrink-0"><Flame className="w-4 h-4 text-[#0A0F0D]" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[var(--text)]">{String(gamification?.tracking_streak_days ?? "—")} day streak 🔥</p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Level {String(gamification?.level ?? "—")}: {String(gamification?.level_name ?? "Loading progress")}</p>
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-[var(--border)]">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] font-medium"><ShieldCheck className="w-3.5 h-3.5 text-[var(--positive)]" /><span>Secured</span></div>
            <div className="flex items-center gap-1"><NotificationBell /><ThemeToggle /></div>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-[284px] flex flex-col min-h-screen">
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pt-20 md:pt-6 pb-24 md:pb-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>

      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-[var(--surface)] border-b border-[var(--border)] h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-[8px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-[#0A0F0D] font-display font-bold text-[13px]">F</div><span className="font-display font-bold text-[15px] text-[var(--text)]">FinCopilot</span></div>
        <div className="flex items-center gap-1"><NotificationBell /><ThemeToggle /></div>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-[var(--surface)] border-t border-[var(--border)] px-2 pb-[env(safe-area-inset-bottom)]" aria-label="Mobile">
        <div className="flex items-center justify-around h-16">
          {[NAV_SECTIONS[0].items[0], NAV_SECTIONS[0].items[1], NAV_SECTIONS[1].items[0], NAV_SECTIONS[2].items[0]].map((item) => {
            const Icon = item.icon;
            const active = item.href === activeHref;
            const shortLabel: Record<string, string> = { "/": "Home", "/money": "Money", "/plan": "Plan", "/finance": "Tools" };
            return <Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors", active ? "text-[var(--accent)]" : "text-[var(--text-muted)]")} aria-current={active ? "page" : undefined}><Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} /><span className="text-[10px] font-medium">{shortLabel[item.href] ?? item.label}</span></Link>;
          })}
          <button onClick={() => setToolsOpen(true)} className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[var(--text-muted)]" aria-label="All tools"><Menu className="w-5 h-5" /><span className="text-[10px]">All</span></button>
        </div>
      </nav>

      <Dialog open={toolsOpen} onOpenChange={setToolsOpen}>
        <DialogContent className="max-w-2xl max-h-[85dvh] p-0 gap-0 overflow-hidden rounded-2xl">
          <div className="p-5 border-b border-[var(--border)]">
            <DialogTitle>Your financial toolkit</DialogTitle>
            <DialogDescription>Find a workspace, start a task, or explore every FinCopilot tool.</DialogDescription>
            <input autoFocus value={toolQuery} onChange={(event) => setToolQuery(event.target.value)} placeholder="Search investments, imports, budgets, accounts..." aria-label="Search tools" className="mt-4 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]" />
          </div>
          <div className="overflow-y-auto p-3">
            {NAV_SECTIONS.map((group) => {
              const items = group.items.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(toolQuery.toLowerCase()));
              if (!items.length) return null;
              return <section key={group.label}><h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-3 py-3">{group.label}</h3><div className="grid sm:grid-cols-2 gap-1">{items.map((item) => <Link key={item.href} href={item.href} onClick={() => { setToolsOpen(false); setToolQuery(""); }} className="flex items-center gap-3 p-3 min-h-14 rounded-xl hover:bg-[var(--surface-subtle)]"><item.icon className="h-5 w-5 text-[var(--accent)]" /><div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-[var(--text-muted)] mt-1">{item.description}</p></div></Link>)}</div></section>;
            })}
          </div>
        </DialogContent>
      </Dialog>

      {!fabHidden && (
        <div ref={fabRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
          <AnimatePresence>
            {fabOpen && <div className="absolute bottom-16 right-0 flex flex-col gap-2">{FAB_ACTIONS.map((action, index) => { const Icon = action.icon; return <motion.div key={action.href} initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.9 }} transition={{ duration: 0.2, delay: index * 0.04 }}><Link href={action.href} onClick={() => setFabOpen(false)} className="flex items-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-[14px] pl-3 pr-4 py-2.5 shadow-[var(--shadow-lg)] hover:border-[var(--accent)] transition-colors min-w-[170px]"><Icon className="w-4 h-4 text-[var(--accent)]" /><span className="text-[13px] font-medium text-[var(--text)]">{action.label}</span></Link></motion.div>; })}</div>}
          </AnimatePresence>
          <motion.button onClick={() => setFabOpen((value) => !value)} aria-label="Quick actions" whileTap={{ scale: 0.9 }} className={cn("w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] text-[#0A0F0D] flex items-center justify-center shadow-[var(--shadow-lg)] transition-transform", fabOpen && "rotate-45")}><Plus className="w-6 h-6" strokeWidth={2.5} /></motion.button>
        </div>
      )}
    </div>
  );
}
