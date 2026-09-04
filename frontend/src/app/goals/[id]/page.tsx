"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { api, ApiError } from "@/lib/api";

import { formatPaise, formatDate } from "@/lib/format";
import { Badge, ProgressRing, EmptyState } from "@/components/shared";
import type { Goal } from "@/lib/data";

export default function GoalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [goal, setGoal] = React.useState<Goal | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getGoalDetail(id)
      .then((res: any) => {
        if (!mounted) return;
        const g: Goal = res?.goal || res?.data || res;
        setGoal(g ?? null);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setError(err instanceof ApiError ? err.message : "Goal not found");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/goals" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Goal</h1>
        </div>
        <div className="premium-card p-6 flex items-center justify-center">
          <span className="w-6 h-6 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (!goal || error) {
    return (
      <div className="flex flex-col gap-6 max-w-4xl">
        <div className="flex items-center gap-3">
          <Link href="/goals" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">Goal</h1>
        </div>
        <EmptyState
          icon={<ArrowLeft className="w-8 h-8" strokeWidth={1.5} />}
          title="Not found"
          description={error || "We couldn't find this goal. It may have been deleted."}
          action={
            <Link href="/goals" className="mt-2 px-4 py-2 rounded-[10px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors">
              Back to goals
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/goals" className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-(--surface-subtle) transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display font-bold text-[24px] tracking-[-0.02em]">{goal.name}</h1>
      </div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="premium-card p-6 flex items-center gap-6">
        <ProgressRing pct={goal.pace.progress_pct} size={100} stroke={8} color="var(--accent)" />
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-(--text-secondary)">Progress</span>
          <p className="font-display font-bold text-[32px] tabular-nums mt-1">{goal.pace.progress_pct}%</p>
          <Badge label={goal.pace.status.replace(/_/g, " ")} variant="positive" />
        </div>
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
