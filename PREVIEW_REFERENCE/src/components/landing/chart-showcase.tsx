"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { chartShowcaseItems } from "@/lib/landing-data";
import { SectionHeading } from "@/components/bits/section-heading";
import { GlassCard } from "@/components/bits/glass-card";
import { SpendingArea } from "@/components/charts/spending-area";
import { NetWorthLine } from "@/components/charts/net-worth-line";
import { CashflowBar } from "@/components/charts/cashflow-bar";
import { AllocationDonut } from "@/components/charts/allocation-donut";
import { SpendingTreemap } from "@/components/charts/spending-treemap";
import { ForecastCombo } from "@/components/charts/forecast-combo";
import { cn } from "@/lib/utils";

function ChartFor({ chart }: { chart: string }) {
  switch (chart) {
    case "area": return <SpendingArea />;
    case "line": return <NetWorthLine />;
    case "bar": return <CashflowBar />;
    case "donut": return <AllocationDonut />;
    case "treemap": return <SpendingTreemap />;
    case "combo": return <ForecastCombo />;
    default: return null;
  }
}

export function ChartShowcase() {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <SectionHeading
          eyebrow="Data, beautifully rendered"
          title="Every number tells a story."
          subtitle="Six interactive views of your money — animated, 3D, and real-time."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {chartShowcaseItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ rotateX: 0, rotateY: 0 }}
              style={{ perspective: 1200 }}
            >
              <GlassCard
                hover
                className={cn("p-5 h-[260px] flex flex-col gap-2 group")}
                style={{ transform: "rotateX(4deg) rotateY(-2deg)", transition: "transform 0.5s var(--ease-out-expo)" }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-[15px] text-[var(--text)]">{item.title}</h3>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">{item.subtitle}</span>
                </div>
                <div className="flex-1 min-h-0 group-hover:[transform:rotateX(0deg)_rotateY(0deg)] transition-transform duration-500">
                  <ChartFor chart={item.chart} />
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
