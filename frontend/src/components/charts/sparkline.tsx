"use client";

import * as React from "react";

export function Sparkline({
  data,
  color = "var(--accent)",
  fill = true,
  height = 32,
}: {
  data: number[];
  color?: string;
  fill?: boolean;
  height?: number;
}) {
  const w = 100;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y];
  });
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
  const areaD = `${d} L${w},${h} L0,${h} Z`;
  const gradId = React.useId();

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#${gradId})`} />
        </>
      )}
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function MiniBarChart({
  data,
  height = 60,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-[3px] transition-all hover:opacity-80"
            style={{
              height: `${(d.value / max) * (height - 20)}px`,
              background: d.color || "var(--accent)",
              animation: `slide-up 0.5s var(--ease-out-expo) ${i * 50}ms both`,
            }}
          />
          <span className="text-[9px] font-mono text-(--text-tertiary) truncate w-full text-center">
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
