"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatPaise } from "@/lib/format";

type GoalType = "emergency_fund" | "vacation" | "debt_payoff" | "save_home" | "retirement" | "custom";

const GOAL_TYPES: { id: GoalType; name: string }[] = [
  { id: "emergency_fund", name: "Emergency Fund" },
  { id: "vacation", name: "Vacation" },
  { id: "debt_payoff", name: "Debt Payoff" },
  { id: "save_home", name: "Save for Home" },
  { id: "retirement", name: "Retirement" },
  { id: "custom", name: "Custom Goal" },
];

export function NewGoalDialog({
  open,
  onOpenChange,
  onCreated,
  triggerClassName,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreated?: () => void;
  triggerClassName?: string;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [name, setName] = React.useState("");
  const [goalType, setGoalType] = React.useState<GoalType>("emergency_fund");
  const [targetPaise, setTargetPaise] = React.useState<number>(1500000);
  const [monthlyPaise, setMonthlyPaise] = React.useState<number>(15000);
  const [targetDate, setTargetDate] = React.useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().slice(0, 10);
  });
  const [submitting, setSubmitting] = React.useState(false);
  const { toast } = useToast();

  const reset = () => {
    setName("");
    setGoalType("emergency_fund");
    setTargetPaise(1500000);
    setMonthlyPaise(15000);
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    setTargetDate(d.toISOString().slice(0, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || targetPaise <= 0) {
      toast({
        title: "Missing fields",
        description: "Please enter a goal name and target amount.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      await api.createGoal({
        name: name.trim(),
        goal_type: goalType,
        target_amount_paise: targetPaise,
        current_amount_paise: 0,
        monthly_contribution_paise: monthlyPaise,
        target_date: new Date(targetDate).toISOString(),
      });
      toast({
        title: "Goal created",
        description: `"${name.trim()}" has been added to your goals.`,
      });
      reset();
      setOpen(false);
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Could not create goal. Try again.";
      toast({ title: "Create failed", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ||
          "flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-accent text-accent-foreground text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-colors"
        }
      >
        <Plus className="w-4 h-4" /> New Goal
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Create new goal"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative premium-card w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-[20px] tracking-[-0.02em]">
                  New Goal
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-[10px] flex items-center justify-center text-(--text-tertiary) hover:text-foreground hover:bg-(--surface-subtle) transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-(--text-secondary)">Goal name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Diwali vacation fund"
                    autoFocus
                    className="px-3.5 py-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-(--text-secondary)">Type</span>
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value as GoalType)}
                    className="px-3.5 py-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors"
                  >
                    {GOAL_TYPES.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-(--text-secondary)">Target amount (₹)</span>
                  <input
                    type="number"
                    min={1}
                    step={100}
                    value={targetPaise / 100}
                    onChange={(e) => setTargetPaise(Math.max(0, Number(e.target.value) * 100))}
                    className="px-3.5 py-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors"
                  />
                  <span className="text-[11px] text-(--text-tertiary)">{formatPaise(targetPaise)}</span>
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-(--text-secondary)">Monthly contribution (₹)</span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={monthlyPaise / 100}
                    onChange={(e) => setMonthlyPaise(Math.max(0, Number(e.target.value) * 100))}
                    className="px-3.5 py-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[12px] font-medium text-(--text-secondary)">Target date</span>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="px-3.5 py-2.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] text-[14px] focus:border-[var(--accent)] outline-none transition-colors"
                  />
                </label>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 rounded-[12px] text-[14px] font-medium text-(--text-secondary) hover:bg-(--surface-subtle) hover:text-foreground transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[12px] bg-accent text-accent-foreground text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Goal
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
