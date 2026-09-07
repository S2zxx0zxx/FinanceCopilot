"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Clock, TrendingDown, IndianRupee, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { CountUp } from "@/components/bits/count-up";
import { savingsCalculatorPresets as P } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

function Slider({
  label,
  icon: Icon,
  value,
  min,
  max,
  step = 500,
  format,
  onChange,
}: {
  label: string;
  icon: typeof Clock;
  value: number;
  min: number;
  max: number;
  step?: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)]">
          <Icon className="w-3.5 h-3.5 text-[var(--accent)]" />
          {label}
        </label>
        <span className="text-[14px] font-mono font-bold text-[var(--text)] tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--surface-3)] outline-none
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)]
          [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:shadow-[0_0_12px_var(--accent-glow)]
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#0A0F0D]
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#0A0F0D]
          [&::-moz-range-thumb]:cursor-grab"
        style={{
          background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${pct}%, var(--surface-3) ${pct}%, var(--surface-3) 100%)`,
        }}
      />
    </div>
  );
}

export function SavingsCalculator() {
  const [leakRate, setLeakRate] = useState(P.leakRateDefault);
  const [hoursSaved, setHoursSaved] = useState(P.hoursSavedDefault);
  const [feesAvoided, setFeesAvoided] = useState(P.feesAvoidedDefault);

  const { monthly, yearly, breakdown } = useMemo(() => {
    const leakSavings = leakRate; // ₹/mo recovered from finding leaks
    const timeValue = hoursSaved * P.hourlyValue; // ₹/mo value of time saved
    const feeSavings = feesAvoided / 12; // ₹/mo from avoiding fees
    const monthlyTotal = leakSavings + timeValue + feeSavings;
    const yearlyTotal = monthlyTotal * 12;
    return {
      monthly: monthlyTotal,
      yearly: yearlyTotal,
      breakdown: [
        { label: "Money leaks found", value: leakSavings, icon: TrendingDown, color: "var(--accent)" },
        { label: "Time saved", value: timeValue, icon: Clock, color: "var(--info)" },
        { label: "Fees avoided", value: feeSavings, icon: IndianRupee, color: "var(--gold)" },
      ],
    };
  }, [leakRate, hoursSaved, feesAvoided]);

  return (
    <section id="calculator" className="py-20 md:py-28 scroll-mt-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-30 pointer-events-none"
          style={{ background: "radial-gradient(circle, var(--gold-glow), transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="ROI calculator"
          title="See how much FinCopilot saves you."
          subtitle="Move the sliders to match your situation. Numbers update in real-time."
        />

        <div className="grid lg:grid-cols-2 gap-6 mt-12">
          {/* Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard className="p-6 sm:p-7 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-[10px] bg-[var(--accent-dim)] flex items-center justify-center">
                  <Calculator className="w-4.5 h-4.5 text-[var(--accent)]" />
                </div>
                <h3 className="font-display font-semibold text-[16px]">Your situation</h3>
              </div>

              <Slider
                label="Monthly spending you can't account for"
                icon={TrendingDown}
                value={leakRate}
                min={P.leakRateMin}
                max={P.leakRateMax}
                format={(v) => `₹${v.toLocaleString("en-IN")}/mo`}
                onChange={setLeakRate}
              />
              <Slider
                label="Hours/month spent managing finances"
                icon={Clock}
                value={hoursSaved}
                min={P.hoursSavedMin}
                max={P.hoursSavedMax}
                step={1}
                format={(v) => `${v} hrs/mo`}
                onChange={setHoursSaved}
              />
              <Slider
                label="Annual fees you've paid (overdraft, late)"
                icon={IndianRupee}
                value={feesAvoided}
                min={P.feesAvoidedMin}
                max={P.feesAvoidedMax}
                step={300}
                format={(v) => `₹${v.toLocaleString("en-IN")}/yr`}
                onChange={setFeesAvoided}
              />

              <div className="text-[11px] text-[var(--text-muted)] leading-[1.5] pt-2 border-t border-[var(--border)]">
                Estimates based on industry averages. FinCopilot finds unused subscriptions,
                flags overcharges, and forecasts to prevent overdrafts.
              </div>
            </GlassCard>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <GlassCard
              className="p-6 sm:p-7 h-full flex flex-col gap-5 relative overflow-hidden"
            >
              {/* Glow border for Pro feel */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle at top right, var(--accent-glow), transparent 60%)" }}
              />

              <div className="flex items-center justify-between relative">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--gold)]" />
                  <h3 className="font-display font-semibold text-[16px]">Your potential savings</h3>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--gold)]/15 text-[var(--gold)] font-semibold">
                  Estimated
                </span>
              </div>

              {/* Big yearly number */}
              <div className="flex flex-col gap-1 relative">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                  Per year
                </span>
                <div className="flex items-baseline gap-2">
                  <CountUp
                    value={yearly}
                    format="currency"
                    duration={800}
                    className="font-display font-bold text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-gradient-accent"
                  />
                </div>
                <span className="text-[13px] text-[var(--text-secondary)]">
                  <CountUp value={monthly} format="currency" duration={800} /> per month
                </span>
              </div>

              {/* Breakdown */}
              <div className="flex flex-col gap-3 relative">
                {breakdown.map((item) => {
                  const pct = monthly > 0 ? (item.value / monthly) * 100 : 0;
                  return (
                    <div key={item.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <item.icon className="w-3 h-3" style={{ color: item.color }} />
                          {item.label}
                        </span>
                        <span className="font-mono font-bold text-[var(--text)] tabular-nums">
                          ₹{Math.round(item.value).toLocaleString("en-IN")}/mo
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full"
                          style={{ background: item.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="mt-auto pt-4 border-t border-[var(--border)] relative">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Pro plan pays for itself in
                  </span>
                  <span className="font-mono font-bold text-[var(--accent)] text-[14px]">
                    {monthly > 499 ? "< 2 days" : monthly > 0 ? `${Math.max(1, Math.ceil(499 / monthly))} days` : "—"}
                  </span>
                </div>
                <a
                  href="#top"
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full text-[13px] font-semibold bg-[var(--accent)] text-[#0A0F0D] hover:bg-[var(--accent-bright)] transition-colors shadow-[0_0_24px_-4px_var(--accent-glow)]"
                >
                  Start saving free →
                </a>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
