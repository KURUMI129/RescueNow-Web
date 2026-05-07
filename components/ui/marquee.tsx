"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = true,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden mask-fade-edges",
        className,
      )}
    >
      <div
        className={cn(
          "flex shrink-0 gap-6 animate-marquee",
          reverse && "[animation-direction:reverse]",
          pauseOnHover && "group-hover:[animation-play-state:paused]",
        )}
      >
        {children}
        <div className="flex shrink-0 gap-6" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
