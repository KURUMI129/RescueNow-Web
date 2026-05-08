"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ShinyButton } from "@/components/ui/shiny-button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#about", label: "Nosotros" },
  { href: "#features", label: "Funciones" },
  { href: "#services", label: "Servicios" },
  { href: "#pricing", label: "Planes" },
  { href: "#faq", label: "Preguntas" },
  { href: "#contact", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-2.5" : "py-5",
        )}
      >
        <div className="mx-auto max-w-7xl px-4">
          <div
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 sm:px-5 h-14 transition-all duration-500",
              scrolled ? "glass shadow-lg" : "bg-transparent",
            )}
          >
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-lg shadow-brand-crimson/30 group-hover:shadow-brand-crimson/50 transition-shadow ring-1 ring-black/10 dark:ring-white/10">
                <Image
                  src="/icon.png"
                  alt="RescueNow"
                  fill
                  sizes="36px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-[17px] font-extrabold tracking-tight">
                  RescueNow
                </span>
                <span className="text-[10px] font-semibold text-light-muted dark:text-dark-muted tracking-[0.18em] uppercase">
                  Asistencia 24/7
                </span>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="relative rounded-full px-4 py-2 text-sm font-medium text-light-muted dark:text-dark-muted hover:text-brand-crimson dark:hover:text-white transition-colors"
                >
                  {n.label}
                </Link>
              ))}
              <Link
                href="/game"
                className="relative rounded-full px-4 py-2 text-sm font-medium text-brand-gold hover:text-brand-crimson transition-colors"
              >
                🐕 Rex al Rescate
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="hidden sm:block">
                <ShinyButton href="#pricing" size="md">
                  Ver planes
                </ShinyButton>
              </div>
              <button
                aria-label="Abrir menú"
                onClick={() => setOpen(true)}
                className="lg:hidden glass h-10 w-10 rounded-full flex items-center justify-center"
              >
                <Menu className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-light-surface dark:bg-dark-surface p-6 flex flex-col"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 rounded-xl overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
                    <Image
                      src="/icon.png"
                      alt="RescueNow"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </div>
                  <span className="font-display text-lg font-extrabold">
                    RescueNow
                  </span>
                </div>
                <button
                  aria-label="Cerrar menú"
                  onClick={() => setOpen(false)}
                  className="h-10 w-10 rounded-full glass flex items-center justify-center"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-10 flex flex-col gap-1">
                {NAV.map((n, i) => (
                  <motion.div
                    key={n.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-semibold hover:bg-brand-crimson/10 hover:text-brand-crimson transition-colors"
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + NAV.length * 0.05 }}
                >
                  <Link
                    href="/game"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-base font-semibold text-brand-gold hover:bg-brand-gold/10 transition-colors"
                  >
                    🐕 Rex al Rescate
                  </Link>
                </motion.div>
              </nav>

              <div className="mt-auto">
                <ShinyButton href="#pricing" className="w-full" size="lg">
                  Ver planes
                </ShinyButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
