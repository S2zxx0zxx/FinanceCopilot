"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "items-start text-left",
        className
      )}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2
        className="font-display font-semibold text-[clamp(1.875rem,3.5vw,3rem)] leading-[1.1] tracking-[-0.02em] text-[var(--text)]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-[15px] sm:text-[16px] text-[var(--text-secondary)] leading-[1.65] max-w-xl">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
