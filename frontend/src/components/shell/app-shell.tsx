"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Wallet, Layers, Sparkles, User, Plus, MessageCircle,
  Search, Target, Moon, Sun, ShieldCheck, Bell, Flame,
  TrendingUp, TrendingDown, ArrowUpRight, Settings, HelpCircle, Menu, Receipt, CalendarDays, SlidersHorizontal, Compass, Download, Cable, EyeOff, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppData } from "@/hooks/use-app-data";
import { timeAgo } from "@/lib/format";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { object, rows } from "@/lib/response";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
const loadShellGrowth=async()=>object(await api.getGamification());
const loadShellNotifications=async()=>rows(await api.getNotifications());

type NavItem={href:string;label:string;icon:React.ComponentType<{className?:string;strokeWidth?:number}>;exactMatch?:boolean;description:string};
const NAV_SECTIONS:{label:string;items:NavItem[]}[]=[
 {label:"Your money",items:[
  {href:"/",label:"Dashboard",icon:Home,exactMatch:true,description:"Dashboard and your daily financial picture"},
  {href:"/money",label:"Money overview",icon:Wallet,description:"All account balances in one place"},
  {href:"/accounts",label:"Account vault",icon:Layers,description:"Your banks, cards and cash accounts"},
  {href:"/transactions",label:"Activity journal",icon:ArrowUpRight,description:"Search transactions and import statements"},
  {href:"/spending-story",label:"Spending lens",icon:TrendingDown,description:"Understand where your money goes"},
  {href:"/income",label:"Income streams",icon:TrendingUp,description:"Sources, trends and recorded income"},
  {href:"/cashflow",label:"Cashflow pulse",icon:Activity,description:"Money arriving and leaving"}]},
 {label:"Build ahead",items:[
  {href:"/plan",label:"Your game plan",icon:Compass,description:"Bring your financial plans together"},
  {href:"/budgets",label:"Spending guardrails",icon:SlidersHorizontal,description:"Set and manage category budgets"},
  {href:"/goals",label:"Dream milestones",icon:Target,description:"Create goals and record progress"},
  {href:"/recurring",label:"Bills & rhythms",icon:CalendarDays,description:"Recurring payments and subscriptions"},
  {href:"/liabilities",label:"Debt roadmap",icon:Receipt,description:"Understand outstanding obligations"},
  {href:"/forecast",label:"Future outlook",icon:TrendingUp,description:"Explore estimates and scenarios"},
  {href:"/financial-health",label:"Financial fitness",icon:Activity,description:"Understand your financial indicators"}]},
 {label:"Copilot studio",items:[
  {href:"/ai",label:"Copilot workspace",icon:Sparkles,exactMatch:true,description:"Insights and questions worth exploring"},
  {href:"/ai/chat",label:"Ask your copilot",icon:MessageCircle,description:"Ask questions about your money"},
  {href:"/ai/afford",label:"Purchase check",icon:Wallet,description:"Explore a planned purchase"},
  {href:"/ai/leaks",label:"Savings detective",icon:Search,description:"Review potential savings opportunities"},
  {href:"/search",label:"Find anything",icon:Search,description:"Search across your financial records"}]},
 {label:"Your space",items:[
  {href:"/you",label:"Personal hub",icon:User,exactMatch:true,description:"Profile, progress and account settings"},
  {href:"/you/connections",label:"Connection center",icon:Cable,description:"Manage connected accounts"},
  {href:"/you/privacy",label:"Privacy choices",icon:EyeOff,description:"Consent and data inventory"},
  {href:"/you/security",label:"Security center",icon:ShieldCheck,description:"Sessions and sign-in protection"},
  {href:"/you/export",label:"Your data library",icon:Download,description:"Export your financial records"},
  {href:"/data-coverage",label:"Data confidence",icon:Layers,description:"Understand gaps in account coverage"},
  {href:"/help",label:"Help & guidance",icon:HelpCircle,description:"Guides, answers and support"}]},
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
  const notifications = useResource(loadShellNotifications);
  const arr = notifications.data || [];
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

const loadShellPreferences = async () => object(object(await api.getPreferences()).preferences);

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  // Auth routes: render children directly, no shell chrome
  const isAuthRoute = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up") || pathname.startsWith("/onboarding");
  if (isAuthRoute) {
    return <>{children}</>;
  }

  return <AppShellInner>{children}</AppShellInner>;
}

function AppShellInner({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const preferences = useResource(loadShellPreferences);
  React.useEffect(() => {
    document.documentElement.dataset.density = preferences.data?.density === 'compact' ? 'compact' : 'comfortable';
  }, [preferences.data]);
  const growth=useResource(loadShellGrowth);
  const gamification=growth.data;
  const [toolsOpen,setToolsOpen]=React.useState(false);
  const [toolQuery,setToolQuery]=React.useState('');
  React.useEffect(()=>{const handle=(event:KeyboardEvent)=>{if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setToolsOpen(value=>!value);}};document.addEventListener('keydown',handle);return()=>document.removeEventListener('keydown',handle);},[]);
  const activeHref=NAV_SECTIONS.flatMap(group=>group.items).filter(item=>item.exactMatch?pathname===item.href:pathname===item.href||pathname.startsWith(item.href+'/')).sort((a,b)=>b.href.length-a.href.length)[0]?.href;
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
    <div className="min-h-screen flex bg-background">
      {/* ── Desktop Sidebar (floating card design) ── */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 fixed inset-y-3 left-3 z-30 rounded-[24px] bg-[var(--surface)] border border-[var(--border)] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
        {/* Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-[#0A0F0D] font-display font-bold text-[15px]">F</div>
          <span className="font-display font-bold text-[17px] tracking-[-0.02em] text-[var(--text)]">FinCopilot</span>
        </div>

        <button onClick={()=>setToolsOpen(true)} className="mx-4 mt-4 mb-1 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)] flex items-center gap-2 px-3 min-h-11 text-sm text-[var(--text-secondary)]"><Search className="w-4 h-4"/><span className="flex-1 text-left">Jump to a tool</span><kbd className="text-[10px] border border-[var(--border)] rounded px-1">Ctrl K</kbd></button>
        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-0.5 p-3 overflow-y-auto" aria-label="Primary">
          {NAV_SECTIONS.map((section, si) => (
            <React.Fragment key={section.label}>
              {si > 0 && <div className="h-3" />}
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
              <p className="text-[12px] font-semibold text-[var(--text)]">{String(gamification?.tracking_streak_days ?? "\u2014")} day streak 🔥</p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">Level {String(gamification?.level ?? "\u2014")}: {String(gamification?.level_name ?? "Loading progress")}</p>
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
          {[NAV_SECTIONS[0].items[0],NAV_SECTIONS[0].items[1],NAV_SECTIONS[1].items[0],NAV_SECTIONS[2].items[0]].map((item) => {
            const Icon = item.icon;
            const active = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn("flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors", active ? "text-[var(--accent)]" : "text-[var(--text-muted)]")}
                aria-current={active ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="text-[10px] font-medium">{{"/":"Dashboard","/money":"Money","/plan":"Plan","/ai":"Copilot"}[item.href]??item.label}</span>
              </Link>
            );
          })}
          <button onClick={()=>setToolsOpen(true)} className="flex flex-col items-center justify-center gap-1 flex-1 h-full text-[var(--text-muted)]" aria-label="All tools"><Menu className="w-5 h-5"/><span className="text-[10px]">All tools</span></button>
        </div>
      </nav>

      <Dialog open={toolsOpen} onOpenChange={setToolsOpen}><DialogContent className="max-w-2xl max-h-[85dvh] p-0 gap-0 overflow-hidden rounded-2xl"><div className="p-5 border-b border-[var(--border)]"><DialogTitle>Your financial toolkit</DialogTitle><DialogDescription>Find a workspace, start a task, or explore every tool.</DialogDescription><input autoFocus value={toolQuery} onChange={event=>setToolQuery(event.target.value)} placeholder="Search tools, budgets, accounts..." aria-label="Search tools" className="mt-4 w-full p-3 rounded-xl border border-[var(--border)] bg-[var(--surface-subtle)]"/></div><div className="overflow-y-auto p-3">{NAV_SECTIONS.map(group=>{const items=group.items.filter(item=>(item.label+' '+item.description).toLowerCase().includes(toolQuery.toLowerCase()));return items.length?<section key={group.label}><h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] px-3 py-3">{group.label}</h3><div className="grid sm:grid-cols-2 gap-1">{items.map(item=><Link key={item.href} href={item.href} onClick={()=>{setToolsOpen(false);setToolQuery('');}} className="flex items-center gap-3 p-3 min-h-14 rounded-xl hover:bg-[var(--surface-subtle)]"><item.icon className="h-5 w-5 text-[var(--accent)]"/><div><p className="font-medium text-sm">{item.label}</p><p className="text-xs text-[var(--text-muted)] mt-1">{item.description}</p></div></Link>)}</div></section>:null;})}</div></DialogContent></Dialog>

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