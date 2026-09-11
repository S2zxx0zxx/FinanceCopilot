"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileInput, Landmark, PenLine, PiggyBank, ShieldCheck, Sparkles, Target } from "lucide-react";
import { engineApi } from "@/lib/engine-api";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type GoalPreset = { id: string; name: string; description: string; target: number; months: number };
type DataSource = { id: "bank" | "import" | "manual"; name: string; description: string; href: string; Icon: typeof Landmark };

const GOALS: GoalPreset[] = [
  { id: "emergency", name: "Emergency fund", description: "Build a liquid safety buffer for unexpected costs.", target: 150000, months: 6 },
  { id: "vacation", name: "Vacation", description: "Save for a trip without disturbing your monthly cash flow.", target: 200000, months: 8 },
  { id: "debt", name: "Debt payoff", description: "Create a visible target while you reduce expensive debt.", target: 100000, months: 6 },
  { id: "home", name: "Home fund", description: "Build a down-payment target over a longer horizon.", target: 2000000, months: 36 },
  { id: "wealth", name: "Long-term wealth", description: "Track a long-range milestone alongside your investments.", target: 5000000, months: 120 },
];
const SOURCES: DataSource[] = [
  { id: "bank", name: "Connect a bank", description: "Use a configured open-finance provider and sync accounts automatically.", href: "/finance/connections", Icon: Landmark },
  { id: "import", name: "Import finance files", description: "Import the engine-supported CSV, OFX, QIF or CAMT formats with preview and history.", href: "/finance/imports", Icon: FileInput },
  { id: "manual", name: "Start manually", description: "Create accounts and transactions yourself; connect or import later whenever you want.", href: "/accounts", Icon: PenLine },
];
const STEPS = ["Welcome", "Privacy", "Goal", "Data"];

function addMonths(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

export default function OnboardingPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [consented, setConsented] = useState(false);
  const [goalId, setGoalId] = useState("emergency");
  const preset = useMemo(() => GOALS.find((item) => item.id === goalId) ?? GOALS[0], [goalId]);
  const [target, setTarget] = useState(String(GOALS[0].target));
  const [months, setMonths] = useState(String(GOALS[0].months));
  const [source, setSource] = useState<DataSource["id"]>("bank");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [firstName, setFirstName] = useState("there");

  const chooseGoal = (id: string) => {
    const item = GOALS.find((goal) => goal.id === id);
    if (!item) return;
    setGoalId(id); setTarget(String(item.target)); setMonths(String(item.months));
  };

  const canNext = step === 0 || (step === 1 && consented) || (step === 2 && Number(target) > 0 && Number(months) > 0) || step === 3;
  const selectedSource = SOURCES.find((item) => item.id === source) ?? SOURCES[0];

  const finish = async () => {
    const targetAmount = Number(target); const timeline = Number(months);
    if (!Number.isFinite(targetAmount) || targetAmount <= 0 || !Number.isFinite(timeline) || timeline <= 0) return;
    setSaving(true);
    try {
      try {
        await engineApi.post("/goals", {
          name: preset.name,
          target_amount: targetAmount,
          current_amount: 0,
          currency: "INR",
          target_date: addMonths(timeline),
          tracking_type: "manual",
          icon: "target",
          color: "#6366F1",
        });
      } catch (error) {
        toast({ title: "Goal not saved", description: error instanceof Error ? error.message : "You can add it later from Dream milestones.", variant: "destructive" });
      }
      try {
        await api.completeOnboarding({ consented, goal_type: goalId, data_source: source });
      } catch (error) {
        const description = error instanceof ApiError ? error.message : "Your finance workspace is ready; onboarding status can be retried later.";
        toast({ title: "Onboarding status sync issue", description });
      }
      try {
        const me = await api.getMe() as Record<string, unknown>;
        const nested = (me.user && typeof me.user === "object" ? me.user : me) as Record<string, unknown>;
        const display = String(nested.display_name || nested.displayName || "").trim();
        if (display) setFirstName(display.split(" ")[0]);
      } catch {}
      setDone(true);
    } finally { setSaving(false); }
  };

  if (done) return <div className="min-h-[70vh] grid place-items-center"><section className="premium-card p-7 sm:p-10 max-w-2xl w-full text-center"><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500"><Check className="size-8" /></span><p className="text-xs uppercase tracking-[.18em] text-accent mt-6">Workspace ready</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">You’re set, {firstName}.</h1><p className="text-sm text-(--text-secondary) mt-3 max-w-xl mx-auto">Your first goal uses the native finance engine. Continue with the data path you selected, or open the dashboard and explore FinCopilot first.</p><div className="flex flex-col sm:flex-row justify-center gap-3 mt-7"><Link href={selectedSource.href} className="min-h-11 px-5 rounded-xl bg-accent text-white grid place-items-center">{selectedSource.name}</Link><Link href="/" className="min-h-11 px-5 rounded-xl border border-(--border) grid place-items-center">Go to dashboard</Link></div></section></div>;

  return <div className="max-w-3xl mx-auto pb-12">
    <div className="flex items-center justify-between gap-4 mb-7"><div className="flex items-center gap-2">{STEPS.map((label, index)=><button key={label} onClick={()=>setStep(index)} aria-label={`Step ${index+1}: ${label}`} className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${index<=step?"bg-accent":"bg-(--surface-active)"}`} /><span className={`hidden sm:inline text-[10px] uppercase tracking-wider ${index===step?"text-(--text-primary)":"text-(--text-tertiary)"}`}>{label}</span>{index<STEPS.length-1&&<span className="hidden sm:block w-5 h-px bg-(--border)"/>}</button>)}</div><Link href="/" className="text-xs text-(--text-secondary) hover:text-accent">Skip for now</Link></div>

    {step===0&&<section className="premium-card p-7 sm:p-10 text-center"><span className="mx-auto grid size-16 place-items-center rounded-3xl bg-accent text-white font-display text-2xl font-bold">F</span><p className="text-xs uppercase tracking-[.18em] text-accent mt-6">FinCopilot</p><h1 className="font-display font-bold text-3xl sm:text-4xl mt-2">One finance workspace, not disconnected demos.</h1><p className="text-sm text-(--text-secondary) mt-4 max-w-xl mx-auto">Accounts, transactions, investments, budgets, goals, rules, reports, reconciliation, imports, invoices, bank sync and AI agents all work from the same underlying finance engine.</p><div className="grid sm:grid-cols-3 gap-3 mt-7">{[{Icon:Sparkles,title:"Connected insights",text:"Reports and agents read the same ledger."},{Icon:ShieldCheck,title:"Workspace aware",text:"Security and roles follow your active workspace."},{Icon:PiggyBank,title:"Plan forward",text:"Budgets, goals and recurring money stay linked."}].map(({Icon,title,text})=><div key={title} className="rounded-xl bg-(--surface-subtle) p-4 text-left"><Icon className="size-5 text-accent"/><p className="font-medium mt-3">{title}</p><p className="text-xs text-(--text-secondary) mt-1">{text}</p></div>)}</div></section>}

    {step===1&&<section className="premium-card p-7 sm:p-10"><span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent"><ShieldCheck className="size-6" /></span><h1 className="font-display font-bold text-3xl mt-5">Your data, your control</h1><p className="text-sm text-(--text-secondary) mt-3">FinCopilot needs finance data to calculate balances, cash flow and insights. You choose whether that data comes from a bank connection, supported file import or manual entry.</p><div className="space-y-3 mt-6">{["You can disconnect providers and manage imported data from your workspace.","Advanced security controls live in Security center; workspace roles control shared access.","AI features should only receive finance context when the corresponding agent/provider is enabled."].map((text)=><div key={text} className="flex gap-3 rounded-xl bg-(--surface-subtle) p-4"><Check className="size-4 text-emerald-500 mt-0.5 shrink-0"/><p className="text-sm">{text}</p></div>)}</div><label className="flex gap-3 mt-6 rounded-xl border border-(--border) p-4"><input type="checkbox" checked={consented} onChange={(event)=>setConsented(event.target.checked)} className="mt-0.5"/><span><span className="font-medium text-sm">I understand and want to continue.</span><span className="block text-xs text-(--text-secondary) mt-1">You can review privacy choices later from Your space.</span></span></label></section>}

    {step===2&&<section className="premium-card p-7 sm:p-10"><span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent"><Target className="size-6" /></span><h1 className="font-display font-bold text-3xl mt-5">Create your first milestone</h1><p className="text-sm text-(--text-secondary) mt-2">This creates a real native goal, not a demo record.</p><div className="grid sm:grid-cols-2 gap-3 mt-6">{GOALS.map((item)=><button key={item.id} onClick={()=>chooseGoal(item.id)} className={`text-left rounded-xl border p-4 transition ${goalId===item.id?"border-accent bg-accent/5":"border-(--border) hover:bg-(--surface-subtle)"}`}><p className="font-medium">{item.name}</p><p className="text-xs text-(--text-secondary) mt-1">{item.description}</p></button>)}</div><div className="grid sm:grid-cols-2 gap-3 mt-5"><label className="text-sm">Target amount (INR)<input type="number" min="1" step="1" value={target} onChange={(event)=>setTarget(event.target.value)} className="block w-full min-h-11 mt-2 rounded-xl border border-(--border) bg-(--surface) px-3" /></label><label className="text-sm">Timeline (months)<input type="number" min="1" max="600" value={months} onChange={(event)=>setMonths(event.target.value)} className="block w-full min-h-11 mt-2 rounded-xl border border-(--border) bg-(--surface) px-3" /></label></div></section>}

    {step===3&&<section className="premium-card p-7 sm:p-10"><span className="grid size-12 place-items-center rounded-2xl bg-accent/10 text-accent"><Landmark className="size-6" /></span><h1 className="font-display font-bold text-3xl mt-5">How do you want to add money data?</h1><p className="text-sm text-(--text-secondary) mt-2">Choose a real engine-supported path. You can use all three later.</p><div className="space-y-3 mt-6">{SOURCES.map(({id,name,description,Icon})=><button key={id} onClick={()=>setSource(id)} className={`w-full text-left rounded-xl border p-4 flex gap-4 ${source===id?"border-accent bg-accent/5":"border-(--border) hover:bg-(--surface-subtle)"}`}><span className="grid size-10 place-items-center rounded-xl bg-(--surface-subtle) shrink-0"><Icon className="size-5 text-accent"/></span><span><span className="font-medium">{name}</span><span className="block text-xs text-(--text-secondary) mt-1">{description}</span></span></button>)}</div></section>}

    <div className="flex items-center justify-between gap-3 mt-6"><button disabled={step===0||saving} onClick={()=>setStep((value)=>Math.max(0,value-1))} className="min-h-11 px-4 rounded-xl border border-(--border) disabled:opacity-30 flex items-center gap-2"><ArrowLeft className="size-4"/>Back</button>{step<3?<button disabled={!canNext} onClick={()=>setStep((value)=>Math.min(3,value+1))} className="min-h-11 px-5 rounded-xl bg-accent text-white disabled:opacity-40 flex items-center gap-2">Continue<ArrowRight className="size-4"/></button>:<button disabled={saving||!canNext} onClick={()=>void finish()} className="min-h-11 px-5 rounded-xl bg-accent text-white disabled:opacity-40 flex items-center gap-2">{saving?"Setting up…":"Finish setup"}<Check className="size-4"/></button>}</div>
  </div>;
}
