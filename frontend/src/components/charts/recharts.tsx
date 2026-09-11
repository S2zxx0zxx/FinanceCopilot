"use client";

import * as React from "react";
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, Area, ComposedChart,
  XAxis, YAxis, Tooltip, CartesianGrid, Cell, PieChart, Pie, Legend,
} from "recharts";
import { formatPaise } from "@/lib/format";

// ── Cashflow Bar Chart (income vs expense, 12 months) ──────────────────────────

export function CashflowBarChart({ data }: { data: { month: string; income: number; expense: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} barGap={2} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} width={45} />
        <Tooltip
          cursor={{ fill: "var(--surface-subtle)" }}
          contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow-lg)" }}
          formatter={(v: number) => `₹${v.toLocaleString("en-IN")}`}
        />
        <Bar dataKey="income" name="Income" fill="var(--chart-1)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={1200} />
        <Bar dataKey="expense" name="Expense" fill="var(--chart-5)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={1200} animationBegin={200} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Net Worth Line Chart (12 months) ───────────────────────────────────────────

export function NetWorthLineChart({ data }: { data: { month: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="nwGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--chart-2)" />
            <stop offset="100%" stopColor="var(--chart-1)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} width={50} />
        <Tooltip
          contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow-lg)" }}
          formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Net Worth"]}
        />
        <Line type="monotone" dataKey="value" stroke="url(#nwGrad)" strokeWidth={2.5} dot={false} isAnimationActive animationDuration={1400} animationEasing="ease-out" />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Forecast Combo Chart (actual + projected with bands) ──────────────────────

export function ForecastComboChart({ data }: { data: { month: string; actual: number | null; projected: number | null; upper: number | null; lower: number | null }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="forecastBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fontSize: 10, fill: "var(--text-tertiary)" }} axisLine={false} tickLine={false} width={50} />
        <Tooltip
          contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow-lg)" }}
          formatter={(v: number) => v ? `₹${v.toLocaleString("en-IN")}` : "—"}
        />
        <Area type="monotone" dataKey="upper" stroke="none" fill="url(#forecastBand)" isAnimationActive animationDuration={1200} />
        <Area type="monotone" dataKey="lower" stroke="none" fill="var(--background)" isAnimationActive animationDuration={1200} />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} connectNulls isAnimationActive animationDuration={1200} />
        <Line type="monotone" dataKey="projected" name="Projected" stroke="var(--chart-2)" strokeWidth={2} strokeDasharray="5 5" dot={false} connectNulls isAnimationActive animationDuration={1200} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// ── Spending Donut Chart (by category) ────────────────────────────────────────

export function SpendingDonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" paddingAngle={2} stroke="none" isAnimationActive animationDuration={1200}>
          {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
        </Pie>
        <Tooltip
          contentStyle={{ background: "var(--surface)", border: "1px solid var(--border-strong)", borderRadius: 12, fontSize: 12, boxShadow: "var(--shadow-lg)" }}
          formatter={(v: number) => `₹${(v / 100).toLocaleString("en-IN")}`}
        />
        <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-mono)" }} iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
}
