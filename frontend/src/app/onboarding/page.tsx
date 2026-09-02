"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Shield, Lock, Eye, EyeOff,
  ShieldCheck, Plane, CreditCard, Home as HomeIcon, PiggyBank,
  Sparkles, FileSpreadsheet, FileText, Sheet, Landmark, PenLine,
  Target, CheckCircle2,
} from "lucide-react";
import { formatPaise } from "@/lib/format";

const GOAL_TYPES = [
  {
    id: "emergency_fund",
    name: "Emergency Fund",
    description: "Build a safety net for unexpected events",
    icon: ShieldCheck,
    suggestedTargetPaise: 1500000,
    suggestedMonths: 6,
  },
  {
    id: "vacation",
    name: "Vacation",
    description: "Save for your next trip abroad or weekend escape",
    icon: Plane,
    suggestedTargetPaise: 4000000,
    suggestedMonths: 6,
  },
  {
    id: "debt_payoff",
    name: "Debt Payoff",
    description: "Clear credit cards and loans faster",
    icon: CreditCard,
    suggestedTargetPaise: 1000000,
    suggestedMonths: 6,
  },
  {
    id: "save_home",
    name: "Save for Home",
    description: "Save for a down payment on a home",
    icon: HomeIcon,
    suggestedTargetPaise: 20000000,
    suggestedMonths: 36,
  },
  {
    id: "retirement",
    name: "Retirement",
    description: "Build long-term wealth for your future",
    icon: PiggyBank,
    suggestedTargetPaise: 50000000,
    suggestedMonths: 240,
  },
  {
    id: "custom",
    name: "Custom Goal",
    description: "Set any personal financial target",
    icon: Sparkles,
    suggestedTargetPaise: 1000000,
    suggestedMonths: 12,
  },
] as const;

const IMPORT_METHODS = [
  {
    id: "csv",
    name: "CSV Import",
    description: "Upload a bank statement CSV file",
    icon: FileSpreadsheet,
  },
  {
    id: "pdf",
    name: "PDF Statement",
    description: "We'll parse your bank PDFs automatically",
    icon: FileText,
  },
  {
    id: "excel",
    name: "Excel Import",
    description: "Upload .xlsx or .xls spreadsheet",
    icon: Sheet,
  },
  {
    id: "bank",
    name: "Bank Connection",
    description: "Connect via secure bank API (recommended)",
    icon: Landmark,
    badge: "Recommended" as string | undefined,
  },
  {
    id: "manual",
    name: "Manual Entry",
    description: "Add transactions by hand, one at a time",
    icon: PenLine,
  },
];

const STEP_LABELS = ["Welcome", "Privacy", "Goal", "Connect"];

export default function OnboardingPage() {
  const [step, setStep] = React.useState(0);
  const [direction, setDirection] = React.useState(1);

  // Step 2 state
  const [consented, setConsented] = React.useState(false);

  // Step 3 state
  const [selectedGoal, setSelectedGoal] = React.useState<string | null>(null);
  const [targetPaise, setTargetPaise] = React.useState<number>(1500000);
  const [timelineMonths, setTimelineMonths] = React.useState<number>(6);

  // Step 4 state
  const [selectedImport, setSelectedImport] = React.useState<string | null>(null);
  const [connecting, setConnecting] = React.useState(false);
  const [connected, setConnected] = React.useState(false);

  const goTo = (newStep: number) => {
    setDirection(newStep > step ? 1 : -1);
    setStep(newStep);
  };
  const next = () => goTo(Math.min(3, step + 1));
  const back = () => goTo(Math.max(0, step - 1));

  const selectGoal = (goalId: string) => {
    const goal = GOAL_TYPES.find((g) => g.id === goalId);
    if (goal) {
      setSelectedGoal(goalId);
      setTargetPaise(goal.suggestedTargetPaise);
      setTimelineMonths(goal.suggestedMonths);
    }
  };

  const handleConnect = () => {
    if (!selectedImport) return;
    setConnecting(true);
    // Simulate connection
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 1600);
  };

  const canProceedStep1 = true;
  const canProceedStep2 = consented;
  const canProceedStep3 = selectedGoal !== null && targetPaise > 0 && timelineMonths > 0;
  const canProceedStep4 = selectedImport !== null;

  const canProceed = [canProceedStep1, canProceedStep2, canProceedStep3, canProceedStep4][step];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] flex flex-col">
      {/* ── Progress dots + skip ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          {STEP_LABELS.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <button
                key={label}
                onClick={() => goTo(i)}
                aria-label={`Step ${i + 1}: ${label}`}
                className="flex items-center gap-2 group"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: isActive
                      ? "var(--accent)"
                      : isDone
                        ? "var(--accent)"
                        : "var(--surface-active)",
                    transform: isActive ? "scale(1.4)" : "scale(1)",
                    boxShadow: isActive ? "0 0 0 4px var(--accent-glow)" : "none",
                  }}
                />
                <span
                  className={`hidden sm:inline text-[11px] font-mono uppercase tracking-[0.08em] transition-colors ${
                    isActive ? "text-[var(--foreground)]" : "text-[var(--text-tertiary)]"
                  }`}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <span className="hidden sm:inline w-6 h-px bg-[var(--border)] mx-1" />
                )}
              </button>
            );
          })}
        </div>
        {step < 3 && (
          <Link
            href="/"
            className="text-[12px] font-medium text-[var(--text-tertiary)] hover:text-[var(--foreground)] transition-colors"
          >
            Skip for now
          </Link>
        )}
      </motion.div>

      {/* ── Step content ─────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ── STEP 1: Welcome ───────────────────────── */}
              {step === 0 && (
                <div className="flex flex-col items-center text-center gap-6 py-8">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                    className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shadow-[var(--shadow-glow)]"
                  >
                    <span className="font-display font-bold text-white text-[36px]">F</span>
                  </motion.div>
                  <div className="flex flex-col gap-3 max-w-md">
                    <motion.h1
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="font-display font-bold text-[30px] sm:text-[34px] tracking-[-0.02em]"
                    >
                      Welcome to FinCopilot
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-[15px] text-[var(--text-secondary)] leading-[1.6]"
                    >
                      Your AI co-pilot for money. Track spending, plan goals,
                      forecast cash flow, and chat with your finances — all in one
                      calm, beautiful place.
                    </motion.p>
                  </div>

                  {/* Value props */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-3 gap-3 w-full max-w-md"
                  >
                    {[
                      { icon: Sparkles, label: "AI Insights", color: "var(--accent)" },
                      { icon: Shield, label: "Bank-grade", color: "var(--gold)" },
                      { icon: PiggyBank, label: "Goal Planner", color: "var(--positive)" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.label}
                          className="premium-card p-3 flex flex-col items-center gap-2 text-center"
                        >
                          <div
                            className="w-9 h-9 rounded-[10px] flex items-center justify-center"
                            style={{
                              background: `color-mix(in oklab, ${item.color} 12%, transparent)`,
                            }}
                          >
                            <Icon className="w-4 h-4" style={{ color: item.color }} />
                          </div>
                          <span className="text-[11px] font-medium">{item.label}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>
              )}

              {/* ── STEP 2: Trust & Privacy ───────────────── */}
              {step === 1 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 rounded-[18px] bg-[var(--accent-light)] flex items-center justify-center">
                      <ShieldCheck className="w-7 h-7 text-[var(--accent)]" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h1 className="font-display font-bold text-[26px] tracking-[-0.02em]">
                        Your data, your control
                      </h1>
                      <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6] max-w-md">
                        We believe trust is earned. Here's exactly how we handle
                        your financial data.
                      </p>
                    </div>
                  </div>

                  {/* Privacy promises */}
                  <div className="grid gap-3">
                    {[
                      {
                        icon: Lock,
                        title: "End-to-end encryption",
                        description:
                          "Your bank credentials and transactions are encrypted with AES-256. Even our team can't see them.",
                      },
                      {
                        icon: Eye,
                        title: "We never sell your data",
                        description:
                          "No third-party data brokers, no ad networks. Your financial life is yours alone.",
                      },
                      {
                        icon: EyeOff,
                        title: "Delete anytime",
                        description:
                          "Export or permanently erase all your data in one tap. No questions asked.",
                      },
                    ].map((item, i) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                          className="premium-card p-4 flex items-start gap-3"
                        >
                          <div className="w-9 h-9 rounded-[10px] bg-[var(--surface-subtle)] flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-[var(--accent)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold">{item.title}</p>
                            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-[1.5]">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Consent checkbox */}
                  <motion.label
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="premium-card p-4 flex items-start gap-3 cursor-pointer hover:border-[var(--accent)] transition-colors"
                    style={{
                      borderColor: consented ? "var(--accent)" : undefined,
                      background: consented ? "var(--accent-light)" : undefined,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setConsented(!consented)}
                      aria-pressed={consented}
                      aria-label="I agree to the privacy policy"
                      className="w-5 h-5 rounded-[6px] border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                      style={{
                        background: consented ? "var(--accent)" : "transparent",
                        borderColor: consented ? "var(--accent)" : "var(--border-strong)",
                      }}
                    >
                      {consented && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                    </button>
                    <div className="flex-1">
                      <p className="text-[13px] font-medium leading-[1.5]">
                        I agree to FinCopilot's{" "}
                        <Link
                          href="/you/privacy"
                          className="text-[var(--accent)] hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Privacy Policy
                        </Link>{" "}
                        and consent to secure processing of my financial data.
                      </p>
                      <p className="text-[11px] text-[var(--text-tertiary)] mt-1">
                        You can withdraw consent at any time in Settings.
                      </p>
                    </div>
                  </motion.label>
                </div>
              )}

              {/* ── STEP 3: Goal Setup ─────────────────────── */}
              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-[18px] bg-[var(--accent-light)] flex items-center justify-center">
                      <Target className="w-7 h-7 text-[var(--accent)]" />
                    </div>
                    <div>
                      <h1 className="font-display font-bold text-[26px] tracking-[-0.02em]">
                        What are you saving for?
                      </h1>
                      <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-md">
                        Pick a goal to start tracking. You can add more later.
                      </p>
                    </div>
                  </div>

                  {/* Goal grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {GOAL_TYPES.map((goal, i) => {
                      const Icon = goal.icon;
                      const selected = selectedGoal === goal.id;
                      return (
                        <motion.button
                          key={goal.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.05 }}
                          onClick={() => selectGoal(goal.id)}
                          aria-pressed={selected}
                          className="premium-card p-3.5 flex flex-col items-start gap-2 text-left hover:border-[var(--accent)] transition-all relative"
                          style={{
                            borderColor: selected ? "var(--accent)" : undefined,
                            background: selected ? "var(--accent-light)" : undefined,
                          }}
                        >
                          {selected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-white" strokeWidth={3} />
                            </motion.div>
                          )}
                          <div
                            className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                            style={{
                              background: selected
                                ? "var(--accent)"
                                : "var(--surface-subtle)",
                            }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{
                                color: selected ? "white" : "var(--text-secondary)",
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-semibold">{goal.name}</span>
                            <span className="text-[11px] text-[var(--text-tertiary)] leading-[1.4] mt-0.5">
                              {goal.description}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Target amount + timeline */}
                  <AnimatePresence>
                    {selectedGoal && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="premium-card p-4 flex flex-col gap-4">
                          {/* Target amount */}
                          <div>
                            <label className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                              Target amount
                            </label>
                            <div className="flex items-baseline gap-1 mt-2 mb-2">
                              <span className="text-[24px] font-display font-bold">₹</span>
                              <input
                                type="number"
                                value={Math.round(targetPaise / 100)}
                                onChange={(e) =>
                                  setTargetPaise((Number(e.target.value) || 0) * 100)
                                }
                                className="flex-1 bg-transparent border-0 outline-none text-[24px] font-display font-bold tabular-nums"
                                min={1}
                                aria-label="Target amount in rupees"
                              />
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {[50000, 100000, 500000, 1000000, 2000000].map((amt) => (
                                <button
                                  key={amt}
                                  onClick={() => setTargetPaise(amt * 100)}
                                  className="px-2.5 py-1 rounded-[8px] bg-[var(--surface-subtle)] text-[11px] font-medium text-[var(--text-secondary)] hover:bg-[var(--accent-light)] hover:text-[var(--accent)] transition-colors"
                                >
                                  ₹{amt.toLocaleString("en-IN")}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div>
                            <label className="text-[11px] font-mono uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                              Timeline:{" "}
                              <span className="text-[var(--foreground)] font-semibold">
                                {timelineMonths} {timelineMonths === 1 ? "month" : "months"}
                              </span>
                            </label>
                            <input
                              type="range"
                              min={1}
                              max={120}
                              step={1}
                              value={timelineMonths}
                              onChange={(e) => setTimelineMonths(Number(e.target.value))}
                              className="w-full mt-3 accent-[var(--accent)] cursor-pointer"
                              aria-label="Timeline in months"
                            />
                            <div className="flex justify-between mt-1 text-[10px] font-mono text-[var(--text-tertiary)]">
                              <span>1 mo</span>
                              <span>5 yr</span>
                              <span>10 yr</span>
                            </div>
                          </div>

                          {/* Monthly commitment */}
                          {timelineMonths > 0 && targetPaise > 0 && (
                            <div className="bg-[var(--surface-subtle)] rounded-[12px] p-3 flex items-center justify-between">
                              <div>
                                <p className="text-[11px] text-[var(--text-tertiary)]">
                                  Monthly contribution needed
                                </p>
                                <p className="text-[18px] font-display font-bold tabular-nums mt-0.5">
                                  {formatPaise(Math.ceil(targetPaise / timelineMonths))}{" "}
                                  <span className="text-[12px] text-[var(--text-tertiary)] font-normal">
                                    /mo
                                  </span>
                                </p>
                              </div>
                              <PiggyBank className="w-7 h-7 text-[var(--accent)]" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── STEP 4: Data Connection ────────────────── */}
              {step === 3 && (
                <div className="flex flex-col gap-6">
                  {!connected ? (
                    <>
                      <div className="flex flex-col items-center text-center gap-3">
                        <div className="w-14 h-14 rounded-[18px] bg-[var(--accent-light)] flex items-center justify-center">
                          <Landmark className="w-7 h-7 text-[var(--accent)]" />
                        </div>
                        <div>
                          <h1 className="font-display font-bold text-[26px] tracking-[-0.02em]">
                            Connect your data
                          </h1>
                          <p className="text-[14px] text-[var(--text-secondary)] mt-1 max-w-md">
                            Choose how you'd like to import your transactions. We'll
                            handle the rest.
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-3">
                        {IMPORT_METHODS.map((method, i) => {
                          const Icon = method.icon;
                          const selected = selectedImport === method.id;
                          return (
                            <motion.button
                              key={method.id}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: i * 0.05 }}
                              onClick={() => setSelectedImport(method.id)}
                              aria-pressed={selected}
                              disabled={connecting}
                              className="premium-card p-3.5 flex items-center gap-3 text-left hover:border-[var(--accent)] transition-all relative disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{
                                borderColor: selected ? "var(--accent)" : undefined,
                                background: selected ? "var(--accent-light)" : undefined,
                              }}
                            >
                              <div
                                className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
                                style={{
                                  background: selected
                                    ? "var(--accent)"
                                    : "var(--surface-subtle)",
                                }}
                              >
                                <Icon
                                  className="w-4 h-4"
                                  style={{
                                    color: selected ? "white" : "var(--text-secondary)",
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[14px] font-semibold">
                                    {method.name}
                                  </span>
                                  {method.badge && (
                                    <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--gold-light)] text-[var(--gold)] font-semibold">
                                      {method.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5 truncate">
                                  {method.description}
                                </p>
                              </div>
                              <div
                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                                style={{
                                  borderColor: selected ? "var(--accent)" : "var(--border-strong)",
                                  background: selected ? "var(--accent)" : "transparent",
                                }}
                              >
                                {selected && (
                                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    // Success state
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="flex flex-col items-center text-center gap-5 py-8"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center shadow-[var(--shadow-glow)]"
                      >
                        <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
                      </motion.div>
                      <div className="flex flex-col gap-2 max-w-md">
                        <h1 className="font-display font-bold text-[28px] tracking-[-0.02em]">
                          You're all set, Arjun
                        </h1>
                        <p className="text-[14px] text-[var(--text-secondary)] leading-[1.6]">
                          {selectedImport === "bank"
                            ? "Your bank is securely connected. We're syncing your transactions now — this usually takes 30 seconds."
                            : selectedImport === "manual"
                              ? "Your account is ready. Start adding transactions any time from the + menu."
                              : "We're parsing your file now. You'll see your transactions appear within a minute."}
                        </p>
                      </div>

                      {/* Recap */}
                      <div className="premium-card p-4 w-full max-w-sm flex flex-col gap-3">
                        {[
                          { label: "Privacy consent", value: "Granted" },
                          {
                            label: "Primary goal",
                            value:
                              GOAL_TYPES.find((g) => g.id === selectedGoal)?.name ?? "—",
                          },
                          {
                            label: "Target",
                            value:
                              selectedGoal
                                ? `${formatPaise(targetPaise)} in ${timelineMonths} mo`
                                : "—",
                          },
                          {
                            label: "Data source",
                            value:
                              IMPORT_METHODS.find((m) => m.id === selectedImport)?.name ??
                              "—",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="flex items-center justify-between"
                          >
                            <span className="text-[12px] text-[var(--text-tertiary)]">
                              {item.label}
                            </span>
                            <span className="text-[12px] font-semibold">{item.value}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-[12px] bg-[var(--accent)] text-white text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors shadow-[var(--shadow-glow)]"
                      >
                        Go to Home
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer navigation ──────────────────────────── */}
      {!(step === 3 && connected) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between gap-3 pt-4 border-t border-[var(--border)] mt-6"
        >
          <button
            onClick={back}
            disabled={step === 0}
            aria-label="Back"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--foreground)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <span className="text-[11px] font-mono text-[var(--text-tertiary)]">
            {step + 1} / {STEP_LABELS.length}
          </span>

          {step < 3 ? (
            <button
              onClick={next}
              disabled={!canProceed}
              aria-label="Continue"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]"
            >
              {step === 0 ? "Get Started" : step === 1 ? "I Agree" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={!canProceed || connecting}
              aria-label="Connect"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[12px] bg-[var(--accent)] text-white text-[13px] font-semibold hover:bg-[var(--accent-hover)] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow)]"
            >
              {connecting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Connecting…
                </>
              ) : (
                <>
                  Connect
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
