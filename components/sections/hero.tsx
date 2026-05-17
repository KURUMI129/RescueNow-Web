"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Siren } from "lucide-react";
import dynamic from "next/dynamic";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { MagnetDots } from "@/components/ui/magnet-dots";
import { ShinyButton } from "@/components/ui/shiny-button";
import { StarsField } from "@/components/ui/stars-field";
import { useIsMobile } from "@/lib/use-is-mobile";

const LiveMap = dynamic(() => import("@/components/ui/live-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-dark-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-crimson border-t-transparent" />
    </div>
  ),
});

export function Hero() {
  const isMobile = useIsMobile();

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24 noise">
      <AuroraBackground />
      <div className="absolute inset-0 -z-10 grid-bg mask-fade-bottom opacity-70" />
      {/* Skip heavy canvas animations on mobile — they cause significant jank */}
      {!isMobile && <StarsField className="absolute inset-0 -z-10" />}
      {!isMobile && <MagnetDots className="absolute inset-0 -z-10 opacity-80" />}

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-crimson/20 bg-brand-crimson/5 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-crimson"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-crimson opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-crimson" />
            </span>
            Emergencias en tiempo real
          </motion.div>

          <h1 className="mt-8 font-display text-[2.6rem] sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.02] text-balance">
            <BlurText text="Tu vida en ruta," className="block" />
            <BlurText text="a un botón" delay={0.25} className="block" />
            <span className="block mt-2">
              <GradientText
                from="#E11D48"
                via="#F59E0B"
                to="#0EA5E9"
                className="font-extrabold"
              >
                de distancia.
              </GradientText>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto mt-8 max-w-2xl text-base sm:text-lg text-light-muted dark:text-dark-muted text-balance"
          >
            RescueNow es la app de emergencias y asistencia vial que detecta
            accidentes automáticamente, localiza técnicos cercanos y comparte
            tu ficha médica en segundos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <ShinyButton href="#pricing" size="lg">
              Comenzar ahora
              <ArrowRight className="h-4 w-4" />
            </ShinyButton>
            <ShinyButton href="#features" variant="secondary" size="lg">
              Conoce las funciones
            </ShinyButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <StoreBadge store="ios" />
            <StoreBadge store="android" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="mx-auto mt-14 grid grid-cols-3 gap-4 max-w-md"
          >
            {[
              { icon: Siren, label: "SOS", value: "10s" },
              { icon: MapPin, label: "Satélites", value: "GPS" },
              { icon: Siren, label: "Servicios", value: "8+" },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="glass rounded-2xl p-3 flex flex-col items-center gap-1"
                >
                  <Icon className="h-4 w-4 text-brand-crimson" />
                  <span className="font-display text-xl font-extrabold">
                    {s.value}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-light-muted dark:text-dark-muted">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="absolute -inset-8 -z-10 rounded-[36px] bg-gradient-to-br from-brand-crimson/30 via-brand-medical/20 to-transparent blur-3xl" />
          <div className="glass rounded-[28px] p-1.5 shadow-2xl">
            <div className="relative rounded-[22px] overflow-hidden aspect-[16/10] sm:aspect-[16/9]">
              <LiveMap />
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-light-muted dark:text-dark-muted">
            Acepta el permiso de ubicación para ver los servicios reales en tu
            zona.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function StoreBadge({ store }: { store: "ios" | "android" }) {
  const isIos = store === "ios";
  return (
    <a
      href="#contact"
      className="group relative flex items-center gap-3 rounded-2xl bg-black/90 dark:bg-white/95 px-5 py-2.5 ring-1 ring-white/15 dark:ring-black/10 hover:scale-[1.03] active:scale-95 transition-transform"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-7 w-7 text-white dark:text-black fill-current"
        aria-hidden
      >
        {isIos ? (
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
        ) : (
          <path d="M3 20.5V3.5c0-.85.46-1.61 1.18-2L13.34 12 4.18 22.5C3.46 22.11 3 21.35 3 20.5ZM13.81 12.5l2.13 2.13L6 20.5l7.81-8Zm5.39 1.27c-.62.36-1.42.83-2.24 1.3-.45-.45-.83-.83-1.16-1.16l3.4-3.4c.32.32.7.7 1.16 1.16-.82.47-1.62.93-2.24 1.3l-.92-.6.92.6c1.41-.81 2.16-1.25 2.16-1.25Zm-3.4-4.27L6 3.5l9.94 5.62-2.13 2.12-2.4-2.4Z" />
        )}
      </svg>
      <div className="flex flex-col items-start text-left">
        <span className="text-[9px] font-semibold text-white/75 dark:text-black/70 uppercase tracking-wider">
          Próximamente en
        </span>
        <span className="text-white dark:text-black font-display text-base font-extrabold leading-tight">
          {isIos ? "App Store" : "Google Play"}
        </span>
      </div>
      <span className="absolute -top-1 -right-1 rounded-full bg-brand-crimson px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest text-white shadow-md">
        Soon
      </span>
    </a>
  );
}
