"use client";

import {
  Area,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { forecastComboData } from "@/lib/landing-data";

export function ForecastCombo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={forecastComboData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A86A" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#C9A86A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" hide />
        <YAxis
          hide
          domain={["dataMin - 100000", "dataMax + 100000"]}
        />
        <Tooltip
          formatter={(v: number, name: string) => {
            if (v == null) return ["—", name];
            return [`₹${(v / 100000).toFixed(1)}L`, name];
          }}
        />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
        />
        <Area dataKey="upper" fill="url(#forecastGrad)" stroke="none" animationDuration={1400} />
        <Area dataKey="lower" fill="var(--bg)" stroke="none" animationDuration={1400} />
        <Line
          type="monotone"
          dataKey="actual"
          stroke="#34D399"
          strokeWidth={2.5}
          dot={false}
          connectNulls
          animationDuration={1400}
        />
        <Line
          type="monotone"
          dataKey="projected"
          stroke="#C9A86A"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          connectNulls
          animationDuration={1400}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
