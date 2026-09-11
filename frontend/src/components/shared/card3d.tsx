"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  rotateMax?: number;
}

export function Card3D({ children, className = "", gradient, rotateMax = 8 }: Card3DProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-50, 50], [rotateMax, -rotateMax]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-50, 50], [-rotateMax, rotateMax]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = e.clientX - rect.left - rect.width / 2;
    const py = e.clientY - rect.top - rect.height / 2;
    x.set((px / rect.width) * 100);
    y.set((py / rect.height) * 100);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
      className={className}
    >
      {gradient && (
        <div
          className="absolute inset-0 rounded-[var(--radius-xl)] pointer-events-none"
          style={{ background: gradient, opacity: 0.05 }}
        />
      )}
      {children}
    </motion.div>
  );
}

// EMV Chip SVG
export function CardChip() {
  return (
    <svg width="40" height="30" viewBox="0 0 40 30" fill="none" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.2))" }}>
      <rect x="2" y="2" width="36" height="26" rx="4" fill="url(#chipGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <rect x="6" y="6" width="28" height="4" rx="1" fill="rgba(0,0,0,0.15)" />
      <rect x="6" y="13" width="28" height="4" rx="1" fill="rgba(0,0,0,0.15)" />
      <rect x="6" y="20" width="28" height="4" rx="1" fill="rgba(0,0,0,0.15)" />
      <line x1="20" y1="6" x2="20" y2="24" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5" />
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8E8E8" />
          <stop offset="50%" stopColor="#C0C0C0" />
          <stop offset="100%" stopColor="#A0A0A0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// Contactless icon
export function ContactlessIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M6 6c-1 1-1.5 2.5-1.5 4S5 13 6 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M9 4c-2 2-3 3.5-3 6s1 4 3 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M12 2c-3 3-4 5-4 8s1 5 4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
