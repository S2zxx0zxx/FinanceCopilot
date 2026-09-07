"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  PieChart,
  Sparkles,
  Settings,
} from "lucide-react";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { ChatDemo } from "@/components/bits/chat-demo";
import { MiniSparkline } from "@/components/charts/mini-sparkline";
import { NetWorthLine } from "@/components/charts/net-worth-line";
import { AllocationDonut } from "@/components/charts/allocation-donut";
import { CashflowBar } from "@/components/charts/cashflow-bar";
import { dashboardKpis } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Transactions", icon: Receipt },
  { label: "Budgets", icon: Wallet },
  { label: "Investments", icon: PieChart },
  { label: "Copilot", icon: Sparkles },
  { label: "Settings", icon: Settings },
];

export function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [6, 0]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0.4, 1, 1, 0.4]
  );

  return (
    <section className="py-20 md:py-28 relative overflow-hidden" ref={ref}>
      {/* Radial glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, var(--accent-glow), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
        <SectionHeading
          eyebrow="The product"
          title="One screen. Your whole financial life."
          subtitle="No more tab-hopping. This is FinCopilot at a glance."
        />

        <motion.div
          style={{ rotateX, opacity, transformPerspective: 2000 }}
          className="mt-12 relative"
        >
          <GlassCard className="overflow-hidden preserve-3d relative">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)]/60">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] opacity-70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--warning)] opacity-70" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] opacity-70" />
              </div>
              <div className="flex-1 mx-2 h-6 rounded-md bg-[var(--surface-2)] flex items-center px-3 text-[10px] font-mono text-[var(--text-muted)]">
                🔒 app.fincopilot.ai/dashboard
              </div>
            </div>

            {/* Dashboard body */}
            <div className="grid grid-cols-12 min-h-[420px]">
              {/* Sidebar */}
              <aside className="hidden md:flex md:col-span-2 p-3 border-r border-[var(--border)] flex-col gap-1">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="w-5 h-5 rounded-[6px] bg-gradient-to-br from-[var(--accent)] to-[var(--gold)] flex items-center justify-center">
                    <span className="font-display font-bold text-[10px] text-[#0A0F0D]">₵</span>
                  </div>
                  <span className="font-display font-bold text-[10px]">FinCopilot</span>
                </div>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-[8px] text-[12px]",
                        item.active
                          ? "bg-[var(--accent-dim)] text-[var(--accent)] font-medium"
                          : "text-[var(--text-secondary)]"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="truncate">{item.label}</span>
                    </div>
                  );
                })}
              </aside>

              {/* Main */}
              <div className="col-span-12 md:col-span-7 p-4 flex flex-col gap-3">
                {/* KPI tiles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {dashboardKpis.map((kpi) => (
                    <GlassCard key={kpi.label} className="p-3 flex flex-col gap-0.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                        {kpi.label}
                      </span>
                      <span className="text-[14px] font-bold font-mono text-[var(--text)]">
                        {kpi.value}
                      </span>
                      {kpi.delta && (
                        <span
                          className={cn(
                            "text-[10px] font-mono",
                            kpi.positive ? "text-[var(--success)]" : "text-[var(--danger)]"
                          )}
                        >
                          {kpi.delta}
                        </span>
                      )}
                    </GlassCard>
                  ))}
                </div>

                {/* Net worth + allocation */}
                <div className="grid grid-cols-12 gap-3">
                  <GlassCard className="col-span-12 sm:col-span-8 p-3 h-[140px] flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Net worth · 12 months
                    </span>
                    <div className="flex-1 min-h-0">
                      <NetWorthLine />
                    </div>
                  </GlassCard>
                  <GlassCard className="col-span-12 sm:col-span-4 p-3 h-[140px] flex flex-col gap-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Allocation
                    </span>
                    <div className="flex-1 min-h-0">
                      <AllocationDonut />
                    </div>
                  </GlassCard>
                </div>

                {/* Cashflow */}
                <GlassCard className="p-3 h-[140px] flex flex-col gap-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Monthly cash flow
                  </span>
                  <div className="flex-1 min-h-0">
                    <CashflowBar />
                  </div>
                </GlassCard>
              </div>

              {/* Copilot panel */}
              <aside className="hidden md:flex md:col-span-3 p-3 border-l border-[var(--border)]">
                <ChatDemo variant="compact" className="h-[400px] w-full" />
              </aside>
            </div>
          </GlassCard>

          {/* Floating satellite cards */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute -top-3 -right-3"
          >
            <GlassCard
              hover
              className="w-[140px] p-3 border-[var(--gold)]/30"
            >
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Goal
              </span>
              <span className="block text-[14px] font-bold font-mono text-[var(--gold)]">
                ₹10K 🎉
              </span>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.52, ease: [0.16, 1, 0.3, 1] }}
            className="hidden sm:block absolute -bottom-3 -left-3"
          >
            <GlassCard
              hover
              className="w-[160px] p-3 border-[var(--danger)]/30"
            >
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Anomaly
              </span>
              <span className="block text-[13px] font-bold font-mono text-[var(--danger)]">
                Uber ₹48
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                3× your typical
              </span>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.64, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute -bottom-3 -right-3"
          >
            <GlassCard hover className="w-[160px] p-3">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Forecast
              </span>
              <span className="block text-[13px] font-bold font-mono text-[var(--accent)]">
                Safe-to-spend
              </span>
              <div className="h-4 mt-1">
                <MiniSparkline
                  data={[5, 6, 6, 7, 8, 7, 9, 10]}
                  color="var(--accent)"
                  fill
                  height={16}
                />
              </div>
            </GlassCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
