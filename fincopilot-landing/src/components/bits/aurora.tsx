"use client";

import { cn } from "@/lib/utils";

interface AuroraProps {
  variant?: "emerald" | "gold" | "mixed";
  className?: string;
}

export function Aurora({ variant = "mixed", className }: AuroraProps) {
  const blobs =
    variant === "emerald"
      ? [
          { color: "var(--accent)", top: "-10%", left: "-5%", size: "480px", opacity: 0.45 },
          { color: "var(--info)", bottom: "-15%", right: "10%", size: "380px", opacity: 0.3 },
        ]
      : variant === "gold"
        ? [
            { color: "var(--gold)", top: "5%", right: "-5%", size: "420px", opacity: 0.35 },
            { color: "var(--gold-bright)", bottom: "10%", left: "10%", size: "320px", opacity: 0.25 },
          ]
        : [
            { color: "var(--accent)", top: "-10%", left: "-5%", size: "480px", opacity: 0.45 },
            { color: "var(--gold)", bottom: "-15%", right: "-5%", size: "420px", opacity: 0.35 },
            { color: "var(--info)", top: "30%", left: "40%", size: "300px", opacity: 0.2 },
          ];

  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="aurora-blob"
          style={{
            background: b.color,
            width: b.size,
            height: b.size,
            opacity: b.opacity,
            ...(b.top ? { top: b.top } : {}),
            ...(b.bottom ? { bottom: b.bottom } : {}),
            ...(b.left ? { left: b.left } : {}),
            ...(b.right ? { right: b.right } : {}),
            animation: `aurora-drift ${18 + i * 4}s ease-in-out ${i * -3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
