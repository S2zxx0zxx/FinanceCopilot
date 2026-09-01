"use client";

import * as React from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { spendingTreemapData } from "@/lib/landing-data";

interface TreemapItem {
  name: string;
  size: number;
  color: string;
}

function CustomTreemapContent(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  color?: string;
  root?: unknown;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, size, color, root } = props;
  if (root || width < 4 || height < 4) return null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={4}
        fill={color}
        fillOpacity={0.85}
        stroke="var(--bg)"
        strokeWidth={2}
      />
      {width > 40 && height > 24 && (
        <>
          <text
            x={x + 8}
            y={y + 18}
            fill="var(--bg)"
            fontSize={11}
            fontWeight={600}
            fontFamily="var(--font-geist-mono)"
          >
            {name}
          </text>
          <text
            x={x + 8}
            y={y + 32}
            fill="var(--bg)"
            fontSize={10}
            opacity={0.75}
            fontFamily="var(--font-geist-mono)"
          >
            ${size}
          </text>
        </>
      )}
    </g>
  );
}

export const SpendingTreemap = React.memo(function SpendingTreemap() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={spendingTreemapData as TreemapItem[]}
        dataKey="size"
        stroke="var(--bg)"
        content={<CustomTreemapContent />}
        isAnimationActive
        animationDuration={1400}
      >
        <Tooltip formatter={(v: number) => [`$${v}`, "Spend"]} />
      </Treemap>
    </ResponsiveContainer>
  );
});
