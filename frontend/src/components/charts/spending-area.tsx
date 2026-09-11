"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { spendingAreaData } from "@/lib/landing-data";

export function SpendingArea() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={spendingAreaData} margin={{ top: 5, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <Tooltip
          cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
          formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Spent"]}
        />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#34D399"
          strokeWidth={2}
          fill="url(#spendGrad)"
          animationDuration={1400}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
