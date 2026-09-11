"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { allocationDonutData } from "@/lib/landing-data";

export function AllocationDonut() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={allocationDonutData}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="none"
          animationDuration={1400}
        >
          {allocationDonutData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number, name: string) => [`${v}%`, name]} />
        <Legend
          iconType="circle"
          wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
