import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative mx-auto max-w-7xl px-5 sm:px-8 py-16 md:py-20 scroll-mt-24",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-brand-crimson/20 bg-brand-crimson/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-brand-crimson">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson animate-pulse-slow" />
      {children}
    </span>
  );
}
