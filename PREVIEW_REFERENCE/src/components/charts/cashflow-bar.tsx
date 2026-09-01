"use client";

import * as React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, Legend } from "recharts";
import { cashflowBarData } from "@/lib/landing-data";

export const CashflowBar = React.memo(function CashflowBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={cashflowBarData} margin={{ top: 4, right: 4, left: 4, bottom: 4 }} barGap={2}>
        <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, ""]} />
        <Legend
          verticalAlign="top"
          height={20}
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-geist-mono)" }}
        />
        <Bar
          dataKey="income"
          name="Income"
          fill="#34D399"
          radius={[3, 3, 0, 0]}
          isAnimationActive
          animationDuration={1400}
        />
        <Bar
          dataKey="expense"
          name="Expense"
          fill="#F472B6"
          radius={[3, 3, 0, 0]}
          isAnimationActive
          animationDuration={1400}
          animationBegin={200}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});
