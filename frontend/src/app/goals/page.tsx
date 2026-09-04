"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";
import { useToast } from "@/hooks/use-toast";
import { formatPaise, formatDate } from "@/lib/format";
import { Badge } from "@/components/shared";

export default function GoalsPage() {
  const { goals } = useAppData();
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">Goals</h1><p className="text-[14px] text-(--text-secondary) mt-1">{goals.length} active goals</p></div>
        <Link href="/goals/new" className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-accent text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"><Plus className="w-4 h-4" /> New Goal</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {goals.map((goal, i) => (
          <motion.div key={goal.goal_id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <Link href={`/goals/${goal.goal_id}`} className="premium-card p-5 block group">
              <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><h3 className="text-[16px] font-semibold">{goal.name}</h3><Badge label={goal.goal_type.replace(/_/g, " ")} variant="neutral" /></div><span className="text-[18px] font-display font-bold tabular-nums">{goal.pace.progress_pct}%</span></div>
              <div className="h-2.5 rounded-full bg-[var(--surface-subtle)] overflow-hidden mb-3"><motion.div initial={{ width: 0 }} animate={{ width: `${goal.pace.progress_pct}%` }} transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }} className="h-full rounded-full bg-accent" /></div>
              <div className="flex items-center justify-between text-[13px]"><span className="font-semibold tabular-nums">{formatPaise(goal.current_amount_paise)}</span><span className="text-(--text-tertiary)">of {formatPaise(goal.target_amount_paise)}</span></div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-(--border-subtle) text-[12px] text-(--text-tertiary)"><span>Target: {formatDate(goal.target_date)}</span><span>{goal.pace.remaining_days} days left</span></div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
