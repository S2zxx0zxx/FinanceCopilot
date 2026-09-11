"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cashflowBarData } from "@/lib/landing-data";

export function CashflowBar() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={cashflowBarData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <XAxis dataKey="month" hide />
        <YAxis hide />
        <Tooltip
          cursor={{ fill: "var(--surface-3)", opacity: 0.3 }}
          formatter={(v: number, name: string) => [`₹${v.toLocaleString("en-IN")}`, name === "income" ? "Income" : "Expense"]}
        />
        <Legend
          wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
          iconType="circle"
        />
        <Bar dataKey="income" fill="#34D399" radius={[3, 3, 0, 0]} animationDuration={1200} />
        <Bar dataKey="expense" fill="#F472B6" radius={[3, 3, 0, 0]} animationDuration={1200} animationBegin={200} />
      </BarChart>
    </ResponsiveContainer>
  );
}
