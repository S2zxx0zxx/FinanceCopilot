import * as React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: React.ReactNode;
}

export function GlassCard({ hover = false, className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card",
        hover && "glass-card-hover",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
