"use client";

import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  href?: string;
  external?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  onClick?: () => void;
};

export const ShinyButton = forwardRef<HTMLButtonElement, Props>(function ShinyButton(
  { children, href, external, className, variant = "primary", size = "md", onClick },
  ref,
) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300 whitespace-nowrap";

  const sizes = {
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  } as const;

  const variants = {
    primary:
      "bg-brand-crimson text-white shadow-[0_10px_40px_-10px_rgba(225,29,72,0.6)] hover:shadow-[0_20px_60px_-10px_rgba(225,29,72,0.75)] hover:-translate-y-0.5",
    secondary:
      "glass text-inherit hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-inherit hover:bg-black/5 dark:hover:bg-white/5",
  } as const;

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
    </>
  );

  const classes = cn(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer noopener" : undefined}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button ref={ref} onClick={onClick} className={classes}>
      {content}
    </button>
  );
});
