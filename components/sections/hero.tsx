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

const LiveMap = dynamic(() => import("@/components/ui/live-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-dark-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-crimson border-t-transparent" />
    </div>
  ),
});

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40 md:pb-24 noise">
      <AuroraBackground />
      <div className="absolute inset-0 -z-10 grid-bg mask-fade-bottom opacity-70" />
      <StarsField className="absolute inset-0 -z-10" />
      <MagnetDots className="absolute inset-0 -z-10 opacity-80" />

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
