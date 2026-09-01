"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { forecastComboData } from "@/lib/landing-data";

export const ForecastCombo = React.memo(function ForecastCombo() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={forecastComboData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
        <defs>
          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A86A" stopOpacity={0.25} />
            <stop offset="100%" stopColor="#C9A86A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          domain={["dataMin - 1000", "dataMax + 1000"]}
        />
        <Tooltip formatter={(v: number) => (v ? [`$${v.toLocaleString()}`, ""] : ["—", ""])} />
        <Legend
          verticalAlign="top"
          height={20}
          wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
        />
        <Area
          type="monotone"
          dataKey="upper"
          name="Forecast upper"
          stroke="none"
          fill="url(#forecastGrad)"
          isAnimationActive
          animationDuration={1400}
        />
        <Area
          type="monotone"
          dataKey="lower"
          name="Forecast lower"
          stroke="none"
          fill="var(--bg)"
          isAnimationActive
          animationDuration={1400}
        />
        <Line
          type="monotone"
          dataKey="actual"
          name="Actual"
          stroke="#34D399"
          strokeWidth={2.5}
          dot={false}
          connectNulls
          isAnimationActive
          animationDuration={1400}
        />
        <Line
          type="monotone"
          dataKey="projected"
          name="Projected"
          stroke="#C9A86A"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
          connectNulls
          isAnimationActive
          animationDuration={1400}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
});
