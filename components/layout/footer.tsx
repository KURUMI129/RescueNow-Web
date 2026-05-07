"use client";

import { Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const WHATSAPP = "523521889522";
const EMAIL = "karollevitafollasalazar@gmail.com";

const LINKS = [
  {
    title: "Producto",
    items: [
      { label: "Nosotros", href: "#about" },
      { label: "Funciones", href: "#features" },
      { label: "Servicios", href: "#services" },
      { label: "Planes", href: "#pricing" },
    ],
  },
  {
    title: "Soporte",
    items: [
      {
        label: "WhatsApp",
        href: `https://wa.me/${WHATSAPP}`,
        external: true,
      },
      { label: "Correo", href: `mailto:${EMAIL}`, external: true },
      { label: "Contacto", href: "#contact" },
    ],
  },
  {
    title: "Legal",
    items: [
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-light-border dark:border-dark-border mt-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-14">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-lg shadow-brand-crimson/30 ring-1 ring-black/10 dark:ring-white/10">
                <Image
                  src="/icon.png"
                  alt="RescueNow"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-display text-lg font-extrabold">
                  RescueNow
                </div>
                <div className="text-[10px] font-semibold tracking-[0.18em] uppercase text-light-muted dark:text-dark-muted">
                  Asistencia 24/7
                </div>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm text-light-muted dark:text-dark-muted leading-relaxed">
              La app de emergencias y asistencia vial con IA. Cada segundo
              cuenta, y nosotros estamos para recuperarlos.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="WhatsApp"
                className="glass h-10 w-10 rounded-full flex items-center justify-center hover:-translate-y-0.5 hover:text-[#25D366] transition-all"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href={`mailto:${EMAIL}`}
                aria-label="Correo"
                className="glass h-10 w-10 rounded-full flex items-center justify-center hover:-translate-y-0.5 hover:text-brand-medical transition-all"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs uppercase tracking-[0.18em] font-bold text-light-muted dark:text-dark-muted">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <Link
                      href={it.href}
                      target={
                        "external" in it && it.external ? "_blank" : undefined
                      }
                      rel={
                        "external" in it && it.external
                          ? "noreferrer noopener"
                          : undefined
                      }
                      className="text-sm font-medium hover:text-brand-crimson transition-colors"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-light-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-light-muted dark:text-dark-muted">
            © {new Date().getFullYear()} RescueNow. Todos los derechos reservados.
          </p>
          <p className="text-xs text-light-muted dark:text-dark-muted flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-success animate-pulse" />
            Sistemas operativos
          </p>
        </div>
      </div>
    </footer>
  );
}
