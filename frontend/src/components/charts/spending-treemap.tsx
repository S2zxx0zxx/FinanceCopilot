"use client";

import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import { spendingTreemapData } from "@/lib/landing-data";

interface TreemapItem {
  name: string;
  size: number;
  color: string;
}

function CustomContent(props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  size?: number;
  color?: string;
}) {
  const { x = 0, y = 0, width = 0, height = 0, name, size, color } = props;
  if (width < 4 || height < 4) return null;
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
          >
            {name}
          </text>
          <text
            x={x + 8}
            y={y + 32}
            fill="var(--bg)"
            fontSize={10}
            fontFamily="var(--font-geist-mono)"
            opacity={0.8}
          >
            ₹{size?.toLocaleString("en-IN")}
          </text>
        </>
      )}
    </g>
  );
}

export function SpendingTreemap() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={spendingTreemapData as TreemapItem[]}
        dataKey="size"
        stroke="var(--bg)"
        content={<CustomContent />}
        animationDuration={1400}
      >
        <Tooltip
          formatter={(v: number, _name: string, entry: { payload?: TreemapItem }) => [
            `₹${v.toLocaleString("en-IN")}`,
            entry?.payload?.name ?? "",
          ]}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
