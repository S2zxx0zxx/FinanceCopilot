"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppData } from "@/hooks/use-app-data";

import { formatPaise, formatDate } from "@/lib/format";
import { Badge, ProgressRing } from "@/components/shared";

export default function GoalDetailPage({ params }: { params: { id: string } }) {
  const { goals } = useAppData();
  const goal = goals.find(g => g.goal_id === params.id) || goals[0];
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3"><Link href="/goals" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors"><ArrowLeft className="w-5 h-5" /></Link><h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">{goal.name}</h1></div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 flex items-center gap-6">
        <ProgressRing pct={goal.pace.progress_pct} size={100} stroke={8} color="var(--accent)" />
        <div><span className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-secondary)">Progress</span><p className="font-display font-bold text-[32px] tabular-nums mt-1">{goal.pace.progress_pct}%</p><Badge label={goal.pace.status.replace(/_/g, " ")} variant="positive" /></div>
      </motion.div>
      <div className="grid grid-cols-2 gap-4">
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Current</span><p className="text-[20px] font-display font-semibold tabular-nums mt-1">{formatPaise(goal.current_amount_paise)}</p></div>
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Target</span><p className="text-[20px] font-display font-semibold tabular-nums mt-1">{formatPaise(goal.target_amount_paise)}</p></div>
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Monthly</span><p className="text-[20px] font-display font-semibold tabular-nums mt-1">{formatPaise(goal.monthly_contribution_paise)}</p></div>
        <div className="premium-card p-4"><span className="text-[11px] font-mono uppercase tracking-wider text-(--text-tertiary)">Target Date</span><p className="text-[20px] font-display font-semibold mt-1">{formatDate(goal.target_date)}</p></div>
      </div>
    </div>
  );
}
