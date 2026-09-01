"use client";

import * as React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { spendingAreaData } from "@/lib/landing-data";

export const SpendingArea = React.memo(function SpendingArea() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={spendingAreaData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34D399" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#34D399" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" hide />
        <Tooltip
          cursor={{ stroke: "#34D399", strokeWidth: 1 }}
          formatter={(v: number) => [`$${v}`, "Spend"]}
          labelFormatter={(l) => `Day ${l}`}
        />
        <Area
          type="monotone"
          dataKey="spend"
          stroke="#34D399"
          strokeWidth={2}
          fill="url(#spendGrad)"
          isAnimationActive
          animationDuration={1400}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
});
