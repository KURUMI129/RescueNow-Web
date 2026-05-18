import type { ReactNode } from "react";

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8">
      <article className="prose-blog text-light-fg dark:text-dark-fg leading-relaxed">
        {children}
      </article>
    </div>
  );
}

export function PostTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.05] mt-2 mb-6">
      {children}
    </h1>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-xl sm:text-2xl font-extrabold mt-10 mb-3 leading-tight">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-display text-lg sm:text-xl font-bold mt-6 mb-2">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="text-base sm:text-lg my-4 text-light-muted dark:text-dark-muted">
      {children}
    </p>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc pl-6 my-4 space-y-2 text-base sm:text-lg text-light-muted dark:text-dark-muted marker:text-brand-crimson">
      {children}
    </ul>
  );
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal pl-6 my-4 space-y-2 text-base sm:text-lg text-light-muted dark:text-dark-muted marker:font-bold marker:text-brand-crimson">
      {children}
    </ol>
  );
}

export function Strong({ children }: { children: ReactNode }) {
  return <strong className="font-bold text-light-fg dark:text-dark-fg">{children}</strong>;
}

export function Quote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-6 border-l-4 border-brand-crimson pl-4 italic text-light-fg dark:text-dark-fg">
      {children}
    </blockquote>
  );
}

export function Callout({
  children,
  kind = "info",
}: {
  children: ReactNode;
  kind?: "info" | "warning" | "success";
}) {
  const colors = {
    info: { bg: "rgba(14,165,233,0.1)", border: "#0EA5E9", emoji: "💡" },
    warning: { bg: "rgba(225,29,72,0.1)", border: "#E11D48", emoji: "⚠️" },
    success: { bg: "rgba(16,185,129,0.1)", border: "#10B981", emoji: "✅" },
  };
  const c = colors[kind];
  return (
    <div
      className="my-6 rounded-2xl p-4 sm:p-5 border-l-4 flex gap-3"
      style={{ background: c.bg, borderColor: c.border }}
    >
      <span className="text-xl flex-none">{c.emoji}</span>
      <div className="text-sm sm:text-base text-light-fg dark:text-dark-fg [&>p]:my-0">
        {children}
      </div>
    </div>
  );
}
