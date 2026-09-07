"use client";

import { forwardRef, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  strength?: number;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ variant = "primary", strength = 0.3, className, children, onMouseMove, onMouseLeave, ...props }, ref) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 350, damping: 25 });
    const springY = useSpring(y, { stiffness: 350, damping: 25 });
    const innerRef = useRef<HTMLButtonElement>(null);

    return (
      <motion.button
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }}
        style={{ x: springX, y: springY }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-colors duration-200 cursor-pointer select-none px-4 py-2 text-[13px]",
          variant === "primary"
            ? "bg-[var(--accent)] text-[#0A0F0D] hover:bg-[var(--accent-bright)] shadow-[0_4px_24px_-4px_var(--accent-glow),0_0_0_1px_rgba(52,211,153,0.2)] hover:shadow-[0_8px_32px_-4px_var(--accent-glow),0_0_40px_var(--accent-glow)]"
            : "border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)] hover:border-[var(--accent)]",
          className
        )}
        onMouseMove={(e) => {
          const el = innerRef.current;
          if (el) {
            const rect = el.getBoundingClientRect();
            x.set((e.clientX - rect.left - rect.width / 2) * strength);
            y.set((e.clientY - rect.top - rect.height / 2) * strength);
          }
          onMouseMove?.(e);
        }}
        onMouseLeave={(e) => {
          x.set(0);
          y.set(0);
          onMouseLeave?.(e);
        }}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
MagneticButton.displayName = "MagneticButton";
