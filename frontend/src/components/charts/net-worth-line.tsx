"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { netWorthLineData } from "@/lib/landing-data";

export function NetWorthLine() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={netWorthLineData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
        <defs>
          <linearGradient id="nwGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#C9A86A" />
            <stop offset="100%" stopColor="#EFE2C8" />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" hide />
        <YAxis hide domain={["dataMin - 50000", "dataMax + 50000"]} />
        <Tooltip
          formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Net worth"]}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="url(#nwGrad)"
          strokeWidth={2.5}
          dot={false}
          animationDuration={1400}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
