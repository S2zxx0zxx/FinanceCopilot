"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { LayoutDashboard, Receipt, Wallet, PieChart, Sparkles, Settings } from "lucide-react";
import { dashboardKpis } from "@/lib/landing-data";
import { getIcon } from "@/lib/icon-map";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { NetWorthLine } from "@/components/charts/net-worth-line";
import { AllocationDonut } from "@/components/charts/allocation-donut";
import { CashflowBar } from "@/components/charts/cashflow-bar";
import { ChatDemo } from "@/components/bits/chat-demo";
import { MiniSparkline } from "@/components/charts/mini-sparkline";

const sidebarIcons = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Receipt, label: "Transactions" },
  { icon: Wallet, label: "Budgets" },
  { icon: PieChart, label: "Investments" },
  { icon: Sparkles, label: "Copilot" },
  { icon: Settings, label: "Settings" },
];

export function DashboardPreview() {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [6, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.4, 1, 1, 0.4]);

  return (
    <section ref={ref} className="py-20 md:py-28 relative overflow-hidden">
      {/* radial glow behind */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[500px] rounded-full opacity-40" style={{ background: "radial-gradient(circle, var(--accent-glow), transparent 70%)", filter: "blur(60px)" }} />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="The product"
          title="One screen. Your whole financial life."
          subtitle="No more tab-hopping. This is FinCopilot at a glance."
        />

        <motion.div
          style={{ opacity, perspective: 2000 }}
          className="max-w-6xl mx-auto mt-12 relative"
        >
          <motion.div style={{ rotateX, transformStyle: "preserve-3d" }}>
            <GlassCard className="overflow-hidden preserve-3d">
              {/* browser chrome */}
              <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]/40">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)]/70" />
                <div className="flex-1 ml-2 h-6 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center">
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">🔒 app.fincopilot.ai/dashboard</span>
                </div>
              </div>

              {/* dashboard body */}
              <div className="grid grid-cols-12 min-h-[420px]">
                {/* sidebar */}
                <aside className="hidden md:flex col-span-2 flex-col gap-1 p-3 border-r border-[var(--border)] bg-[var(--bg)]/40">
                  <div className="flex items-center gap-2 px-2 py-2 mb-2">
                    <span className="w-5 h-5 rounded-md bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center text-[11px] font-bold text-[#0A0F0D]">₵</span>
                    <span className="text-[11px] font-semibold">FinCopilot</span>
                  </div>
                  {sidebarIcons.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={i}
                        className={`flex items-center gap-2 px-2 py-2 rounded-[8px] text-[11px] ${item.active ? "bg-[var(--accent-dim)] text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--text)]"} cursor-default`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span className="hidden lg:inline">{item.label}</span>
                      </div>
                    );
                  })}
                </aside>

                {/* main */}
                <main className="col-span-12 md:col-span-7 p-4 flex flex-col gap-4">
                  {/* KPI tiles */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {dashboardKpis.map((kpi, i) => {
                      const Icon = getIcon(kpi.iconKey ?? "");
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                          className="glass-card p-3 flex flex-col gap-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{kpi.label}</span>
                            <Icon className="w-3 h-3 text-[var(--accent)]" />
                          </div>
                          <span className="text-[18px] font-bold font-mono">{kpi.value}</span>
                          <span className={`text-[10px] font-mono ${kpi.up ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>{kpi.delta}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* net worth + allocation */}
                  <div className="grid grid-cols-12 gap-2.5 flex-1 min-h-[200px]">
                    <div className="col-span-8 glass-card p-3 flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Net worth · 12 months</span>
                      <div className="flex-1 min-h-0"><NetWorthLine /></div>
                    </div>
                    <div className="col-span-4 glass-card p-3 flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Allocation</span>
                      <div className="flex-1 min-h-0"><AllocationDonut /></div>
                    </div>
                  </div>

                  {/* cash flow */}
                  <div className="glass-card p-3 flex flex-col gap-1 h-[140px]">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Monthly cash flow</span>
                    <div className="flex-1 min-h-0"><CashflowBar /></div>
                  </div>
                </main>

                {/* copilot panel */}
                <aside className="hidden md:flex col-span-3 p-3 border-l border-[var(--border)] bg-[var(--bg)]/40">
                  <div className="w-full h-[400px]">
                    <ChatDemo variant="compact" />
                  </div>
                </aside>
              </div>
            </GlassCard>
          </motion.div>

          {/* floating satellite cards */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: -10 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute -top-3 -right-3 lg:-right-6 w-[160px] hidden sm:block"
            style={{ transform: "translateZ(60px) rotate(3deg)" }}
          >
            <GlassCard hover className="p-3 border-[var(--gold)]/30">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--gold)]">Goal hit</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[16px] font-bold font-mono">₹10K</span>
                <span className="text-[10px] text-[var(--gold)]">🎉</span>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.52 }}
            className="absolute -bottom-3 -left-3 lg:-left-6 w-[170px] hidden sm:block"
            style={{ transform: "translateZ(50px) rotate(-2deg)" }}
          >
            <GlassCard hover className="p-3 border-[var(--danger)]/30">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--danger)]">Anomaly</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[14px] font-bold font-mono">Uber ₹48</span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">3× your typical</span>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.64 }}
            className="absolute -bottom-3 right-6 w-[170px] hidden lg:block"
            style={{ transform: "translateZ(70px) rotate(2deg)" }}
          >
            <GlassCard hover className="p-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Forecast</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[14px] font-bold font-mono">Safe-to-spend</span>
              </div>
              <div className="h-5 mt-1"><MiniSparkline data={[30, 35, 38, 42, 45, 50, 52]} color="var(--accent)" fill /></div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
