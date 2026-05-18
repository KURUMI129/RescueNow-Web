import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { POSTS, getPostBySlug } from "@/content/blog";
import { Prose, PostTitle } from "@/components/blog/prose";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Params;
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} · RescueNow`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPost({ params }: { params: Params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "RescueNow",
      logo: { "@type": "ImageObject", url: "https://rescuenow.me/icon.png" },
    },
    mainEntityOfPage: `https://rescuenow.me/blog/${post.slug}`,
  };

  const Content = post.Content;
  const others = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="mx-auto max-w-3xl px-5 sm:px-8 mb-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-light-muted dark:text-dark-muted hover:text-brand-crimson transition-colors"
        >
          ← Blog
        </Link>
        <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-wider text-light-muted dark:text-dark-muted">
          <span className="font-bold text-brand-crimson">{post.category}</span>
          <span>·</span>
          <span>{formatDate(post.date)}</span>
          <span>·</span>
          <span>{post.readMinutes} min de lectura</span>
        </div>
        <PostTitle>{post.title}</PostTitle>
        <p className="text-lg sm:text-xl text-light-muted dark:text-dark-muted leading-relaxed">
          {post.excerpt}
        </p>
      </div>

      <div
        className="mx-auto max-w-3xl px-5 sm:px-8 aspect-[16/8] rounded-3xl flex items-center justify-center text-8xl sm:text-9xl mb-12"
        style={{ background: post.heroGradient }}
      >
        {post.heroEmoji}
      </div>

      <Prose>
        <Content />
      </Prose>

      {/* CTA block */}
      <div className="mx-auto max-w-2xl px-5 sm:px-8 mt-16">
        <div className="rounded-3xl glass p-6 sm:p-8 text-center">
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold">
            ¿Te sirvió esta guía?
          </h3>
          <p className="mt-3 text-light-muted dark:text-dark-muted text-sm sm:text-base">
            RescueNow lleva esto al automático: detección de choques, ficha
            médica accesible y mapa de servicios en tiempo real.
          </p>
          <Link
            href="/#features"
            className="mt-5 inline-block rounded-full bg-brand-crimson px-7 py-3 text-sm font-extrabold text-white hover:scale-105 active:scale-95 transition-transform"
          >
            Ver cómo funciona la app →
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {others.length > 0 && (
        <div className="mx-auto max-w-3xl px-5 sm:px-8 mt-16">
          <h3 className="font-display text-2xl font-extrabold mb-6">
            Sigue leyendo
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2">
            {others.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="group block glass rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                >
                  <div
                    className="aspect-[16/9] flex items-center justify-center text-5xl"
                    style={{ background: p.heroGradient }}
                  >
                    {p.heroEmoji}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-brand-crimson">
                      {p.category}
                    </p>
                    <p className="mt-1 font-display text-base font-extrabold leading-tight group-hover:text-brand-crimson transition-colors">
                      {p.title}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
