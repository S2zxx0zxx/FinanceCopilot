"use client";

import { tickerItems } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

interface TickerProps {
  className?: string;
}

export function Ticker({ className }: TickerProps) {
  const items = [...tickerItems, ...tickerItems];
  return (
    <div
      className={cn(
        "relative overflow-hidden py-2 border-y border-[var(--border)] bg-[var(--surface)]/50",
        className
      )}
    >
      <div
        className="flex gap-8 whitespace-nowrap will-change-transform"
        style={{ animation: "marquee 40s linear infinite" }}
      >
        {items.map((it, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px] font-mono">
            <span className="text-[var(--text-secondary)]">{it.symbol}</span>
            <span
              className={it.change >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}
            >
              {it.change >= 0 ? "+" : ""}
              {it.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
