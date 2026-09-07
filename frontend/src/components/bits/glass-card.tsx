import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ hover, className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass-card", hover && "glass-card-hover", className)} {...props}>
      {children}
    </div>
  );
}
