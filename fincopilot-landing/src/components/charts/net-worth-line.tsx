"use client";

import * as React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";
import { netWorthLineData } from "@/lib/landing-data";

export const NetWorthLine = React.memo(function NetWorthLine() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={netWorthLineData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="nwGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C9A86A" />
            <stop offset="100%" stopColor="#EFE2C8" />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v: number) => [`$${v.toLocaleString()}`, "Net worth"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#nwGrad)"
          strokeWidth={2.5}
          dot={false}
          isAnimationActive
          animationDuration={1400}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
});
