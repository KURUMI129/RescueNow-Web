import type { Metadata } from "next";
import Link from "next/link";

import { POSTS } from "@/content/blog";

export const metadata: Metadata = {
  title: "Blog · RescueNow",
  description:
    "Guías prácticas sobre emergencias viales, ficha médica, y cómo actuar cuando cada minuto cuenta.",
  openGraph: {
    title: "Blog · RescueNow",
    description:
      "Guías prácticas sobre emergencias viales, ficha médica, y cómo actuar cuando cada minuto cuenta.",
    type: "website",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndex() {
  return (
    <main className="mx-auto max-w-6xl px-5 sm:px-8 pt-32 pb-24">
      <div className="mb-12 max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-light-muted dark:text-dark-muted hover:text-brand-crimson transition-colors"
        >
          ← Volver al sitio
        </Link>
        <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Blog RescueNow
        </h1>
        <p className="mt-4 text-base sm:text-lg text-light-muted dark:text-dark-muted">
          Guías prácticas para los momentos en que cada minuto cuenta. Sin
          rodeos, con datos.
        </p>
      </div>

      <ul className="grid gap-5 sm:gap-7 md:grid-cols-2">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group block glass rounded-3xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            >
              <div
                className="aspect-[16/9] flex items-center justify-center text-6xl sm:text-7xl"
                style={{ background: p.heroGradient }}
              >
                {p.heroEmoji}
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider text-light-muted dark:text-dark-muted">
                  <span className="font-bold text-brand-crimson">
                    {p.category}
                  </span>
                  <span>·</span>
                  <span>{formatDate(p.date)}</span>
                  <span>·</span>
                  <span>{p.readMinutes} min</span>
                </div>
                <h2 className="mt-2 font-display text-xl sm:text-2xl font-extrabold leading-tight group-hover:text-brand-crimson transition-colors">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-light-muted dark:text-dark-muted line-clamp-3">
                  {p.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-crimson">
                  Leer artículo →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
