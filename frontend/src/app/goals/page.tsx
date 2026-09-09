"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatPaise, formatDate } from "@/lib/format";
import { Badge } from "@/components/shared";
import { NewGoalDialog } from "@/components/shared/new-goal-dialog";
import { api } from "@/lib/api";
import { useResource } from "@/hooks/use-resource";
import { ResourceState } from "@/components/shared/resource-state";
import { rows,object,amount,label } from "@/lib/response";
const loadGoals=async()=>rows(object(await api.getGoals()).goals).map(row=>{
 const target=amount(row.target_amount_paise);const current=amount(row.current_amount_paise);
 return {...row,name:label(row.name),goal_type:label(row.goal_type),pace:{...object(row.pace),progress_pct:target&&current!==null?Math.round(Math.min(100,Math.max(0,current/target*100))):null}};
});


export default function GoalsPage() {
  const state=useResource(loadGoals);
  const [query,setQuery]=React.useState('');
  const [status,setStatus]=React.useState('all');
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false);

  if(!state.data)return <ResourceState loading={state.loading} error={state.error} retry={state.reload}/>;
  const goals:Record<string,any>[]=state.data;
  const filtered=goals.filter(goal=>goal.name.toLowerCase().includes(query.toLowerCase())&&(status==='all'||goal.status===status));
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Dream milestones</h1><p className="text-[14px] text-(--text-secondary) mt-1">{goals.length} goals to explore</p></div>
        <NewGoalDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onCreated={async () => {
            toast({ title: "Goal created", description: "Refreshing your goals…" });
            state.reload();
          }}
        />
      </div>
      <section className="premium-card p-5 sm:p-6"><h2 className="font-display text-xl font-semibold">Make room for what matters</h2><p className="text-sm text-(--text-secondary) mt-2">Create a target, record contributions and follow your progress without mixing plans with money already saved.</p><div className="flex flex-col sm:flex-row gap-3 mt-5"><input aria-label="Search goals" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a milestone" className="flex-1 min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"/><select aria-label="Filter goal status" value={status} onChange={e=>setStatus(e.target.value)} className="min-h-11 px-3 rounded-xl border border-(--border) bg-(--surface)"><option value="all">All goals</option>{Array.from(new Set(goals.map(goal=>label(goal.status)))).map(value=><option key={value} value={value}>{value}</option>)}</select></div></section>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.length === 0 && (
          <div className="premium-card p-8 col-span-full flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[var(--accent-light)] flex items-center justify-center">
              <Plus className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-[16px]">No goals yet</h3>
            <p className="text-[13px] text-(--text-secondary) max-w-sm">
              Create your first savings goal — an emergency fund, a vacation, debt payoff, and more.
            </p>
            <button
              onClick={() => setDialogOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
            >
              <Plus className="w-4 h-4" /> Create Goal
            </button>
          </div>
        )}
        {goals.length>0&&filtered.length===0&&<p className="premium-card p-6 col-span-full text-sm text-(--text-secondary)">No goals match these filters.</p>}
        {filtered.map((goal: any, i: number) => (
          <motion.div key={goal.goal_id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <Link href={`/goals/${goal.goal_id}`} className="premium-card p-5 block group">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><h3 className="text-[16px] font-semibold">{goal.name}</h3><Badge label={goal.goal_type.replace(/_/g, " ")} variant="neutral" /></div><span className="text-[18px] font-display font-bold tabular-nums">{goal.pace.progress_pct===null?"Unavailable":`${goal.pace.progress_pct}%`}</span></div>
              <div className="h-2.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden mb-3"><motion.div initial={{ width: 0 }} animate={{ width: `${goal.pace.progress_pct===null?"Unavailable":`${goal.pace.progress_pct}%`}` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} className="h-full rounded-full bg-accent" /></div>
              <div className="flex items-center justify-between text-[13px]"><span className="font-semibold tabular-nums">{amount(goal.current_amount_paise)===null?"Unavailable":formatPaise(amount(goal.current_amount_paise)!)}</span><span className="text-(--text-tertiary)">of {amount(goal.target_amount_paise)===null?"Unavailable":formatPaise(amount(goal.target_amount_paise)!)}</span></div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-(--border-subtle) text-[12px] text-(--text-tertiary)"><span>Target: {goal.target_date?formatDate(goal.target_date):"No date set"}</span><span>{goal.pace.remaining_days===null||goal.pace.remaining_days===undefined?"Flexible timeline":`${goal.pace.remaining_days} days left`}</span></div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
