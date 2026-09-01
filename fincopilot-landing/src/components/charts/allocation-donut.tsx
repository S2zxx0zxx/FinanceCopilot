"use client";

import * as React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { allocationDonutData } from "@/lib/landing-data";

export const AllocationDonut = React.memo(function AllocationDonut() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={allocationDonutData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="58%"
          outerRadius="85%"
          paddingAngle={2}
          isAnimationActive
          animationDuration={1400}
          animationEasing="ease-out"
          stroke="none"
        >
          {allocationDonutData.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => [`${v}%`, ""]} />
        <Legend
          verticalAlign="bottom"
          height={24}
          wrapperStyle={{ fontSize: 10, fontFamily: "var(--font-geist-mono)" }}
          iconType="circle"
        />
      </PieChart>
    </ResponsiveContainer>
  );
});
