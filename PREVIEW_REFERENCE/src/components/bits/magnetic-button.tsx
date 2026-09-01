"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export const MagneticButton = React.forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, variant = "primary", strength = 0.3, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 350, damping: 25 });
    const springY = useSpring(y, { stiffness: 350, damping: 25 });

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      x.set(offsetX * strength);
      y.set(offsetY * strength);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const base =
      "relative inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors duration-200 cursor-pointer select-none px-4 py-2 text-[13px]";
    const variants = {
      primary:
        "bg-[var(--accent)] text-[#0A0F0D] hover:bg-[var(--accent-bright)] shadow-[0_4px_24px_-4px_var(--accent-glow),0_0_0_1px_rgba(52,211,153,0.2)] hover:shadow-[0_8px_32px_-4px_var(--accent-glow),0_0_40px_var(--accent-glow)]",
      ghost:
        "border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:border-[var(--accent)]",
    };

    return (
      <motion.button
        ref={ref}
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(base, variants[variant], className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);
MagneticButton.displayName = "MagneticButton";
