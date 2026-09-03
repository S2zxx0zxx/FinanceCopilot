"use client";

import * as React from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  format?: "currency" | "plain" | "percent" | "text";
  prefix?: string;
  suffix?: string;
  duration?: number;
  decimals?: number;
  className?: string;
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function CountUp({
  value,
  format = "plain",
  prefix = "",
  suffix = "",
  duration = 1800,
  decimals,
  className,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setDisplay(value * easeOutExpo(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const dec =
    decimals ?? (format === "percent" ? 2 : format === "currency" && value < 100 ? 2 : value % 1 !== 0 ? (value < 10 ? 2 : 1) : 0);

  let text: string;
  if (format === "text") {
    text = String(value);
  } else if (format === "currency") {
    // ₹ INR — Indian number system (lakh/crore), never $.
    const v = display;
    if (v >= 1000000000) text = "₹" + (v / 1000000000).toFixed(1) + "B";
    else if (v >= 10000000) text = "₹" + (v / 10000000).toFixed(2) + "Cr";
    else if (v >= 100000) text = "₹" + (v / 100000).toFixed(2) + "L";
    else if (v >= 1000) text = "₹" + Math.round(v).toLocaleString("en-IN");
    else text = "₹" + v.toFixed(dec);
  } else if (format === "percent") {
    text = display.toFixed(dec) + "%";
  } else {
    text = display >= 1000 ? Math.round(display).toLocaleString() : display.toFixed(dec);
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}
