"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function GradientText({
  children,
  className,
  from = "#E11D48",
  via = "#F59E0B",
  to = "#0EA5E9",
  animate = true,
}: {
  children: ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
  animate?: boolean;
}) {
  return (
    <span
      className={cn("bg-clip-text text-transparent inline-block", className)}
      style={{
        backgroundImage: `linear-gradient(90deg, ${from}, ${via}, ${to}, ${from})`,
        backgroundSize: animate ? "300% auto" : "100% auto",
        animation: animate ? "shine 6s linear infinite" : undefined,
      }}
    >
      {children}
    </span>
  );
}
