"use client";

import { cn } from "@/lib/utils";

interface AuroraProps {
  variant?: "emerald" | "gold" | "mixed";
  className?: string;
}

const presets: Record<
  NonNullable<AuroraProps["variant"]>,
  { color: string; size: number; top: string; left: string; opacity: number }[]
> = {
  emerald: [
    { color: "var(--accent)", size: 480, top: "-10%", left: "-5%", opacity: 0.45 },
    { color: "var(--info)", size: 380, top: "50%", left: "60%", opacity: 0.3 },
  ],
  gold: [
    { color: "var(--gold)", size: 420, top: "-5%", left: "55%", opacity: 0.35 },
    { color: "var(--gold-bright)", size: 320, top: "40%", left: "-10%", opacity: 0.25 },
  ],
  mixed: [
    { color: "var(--accent)", size: 480, top: "-10%", left: "-5%", opacity: 0.45 },
    { color: "var(--gold)", size: 420, top: "30%", left: "55%", opacity: 0.35 },
    { color: "var(--info)", size: 300, top: "40%", left: "30%", opacity: 0.2 },
  ],
};

export function Aurora({ variant = "mixed", className }: AuroraProps) {
  const blobs = presets[variant];
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
      {blobs.map((b, i) => (
        <div
          key={i}
          className="aurora-blob"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: b.color,
            opacity: b.opacity,
            animation: `aurora-drift ${18 + i * 4}s ease-in-out ${i * -3}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
