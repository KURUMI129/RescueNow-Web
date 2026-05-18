"use client";

import { motion } from "framer-motion";
import { Check, Crown, Sparkles, X } from "lucide-react";

import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { Section, SectionLabel } from "@/components/ui/section";
import { ShinyButton } from "@/components/ui/shiny-button";

const FREE = [
  { ok: true, text: "Botón SOS y llamada al 911" },
  { ok: true, text: "Detección automática de choques" },
  { ok: true, text: "Mapa en tiempo real y 8 servicios" },
  { ok: true, text: "Ficha médica offline" },
  { ok: true, text: "Asistente IA con respuestas breves" },
  { ok: true, text: "Sonido S.O.S. predeterminado + vibración" },
  { ok: true, text: "Últimas 5 emergencias en el historial" },
  { ok: true, text: "Check-in de Seguridad con recordatorios 1-12 hrs" },
  { ok: true, text: "Primeros auxilios básicos (RCP, Heimlich, hemorragia, quemadura, desmayo)" },
  { ok: false, text: "Modo Viaje con seguimiento en tiempo real" },
  { ok: false, text: "Check-in Diario con racha y mensaje automático al contacto" },
  { ok: false, text: "Sonidos S.O.S. personalizados (Alarma, Sirena, Silencioso)" },
  { ok: false, text: "IA sin límites con respuestas detalladas" },
  { ok: false, text: "Diagnóstico mecánico profundo + videos" },
  { ok: false, text: "Primeros auxilios avanzados (DEA, lesión cervical, pediátrico, embarazo)" },
  { ok: false, text: "Asesoría post-choque y seguros" },
  { ok: false, text: "Historial completo + estadísticas" },
  { ok: false, text: "Historial de Ubicaciones detallado" },
];

const PREMIUM = [
  "Todo lo del plan gratuito",
  "Modo Viaje con seguimiento y avisos automáticos",
  "Check-in Diario con racha y mensaje automático al contacto",
  "Sonidos S.O.S. personalizados (Alarma, Sirena, Silencioso)",
  "IA sin límites con respuestas detalladas",
  "Diagnóstico mecánico paso a paso + videos tutoriales",
  "Asesoría legal ante choques, seguros y tránsito",
  "Primeros auxilios avanzados guiados (DEA, lesión cervical, pediátrico, embarazo)",
  "Historial completo de emergencias + estadísticas",
  "Historial de Ubicaciones detallado",
  "Soporte prioritario",
];

export function Pricing() {
  return (
    <Section id="pricing">
      <div className="text-center max-w-3xl mx-auto">
        <SectionLabel>Planes y precios</SectionLabel>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
          <BlurText text="Gratis para empezar." className="block" />
          <span className="block">
            <GradientText from="#FFD700" via="#FDB931" to="#B8860B">
              Premium para dominar.
            </GradientText>
          </span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg text-light-muted dark:text-dark-muted"
        >
          Elige el plan que se adapta a ti. Cambia o cancela cuando quieras,
          sin contratos ocultos.
        </motion.p>
      </div>

      <div className="mt-16 grid md:grid-cols-2 gap-5 lg:gap-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative glass rounded-3xl p-8 flex flex-col"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-light-muted dark:text-dark-muted">
                Free
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold">
                Esencial
              </h3>
            </div>
            <div className="h-11 w-11 rounded-xl bg-brand-medical/15 text-brand-medical flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="font-display text-5xl font-extrabold">$0</span>
            <span className="text-light-muted dark:text-dark-muted">
              / para siempre
            </span>
          </div>
          <p className="mt-2 text-sm text-light-muted dark:text-dark-muted">
            La base completa para emergencias.
          </p>

          <ul className="mt-8 space-y-3 flex-1">
            {FREE.map((it) => (
              <li key={it.text} className="flex items-start gap-3 text-sm">
                {it.ok ? (
                  <Check className="h-5 w-5 flex-none text-brand-success mt-0.5" />
                ) : (
                  <X className="h-5 w-5 flex-none text-light-muted/60 dark:text-dark-muted/60 mt-0.5" />
                )}
                <span
                  className={
                    it.ok
                      ? ""
                      : "text-light-muted/70 dark:text-dark-muted/70 line-through decoration-1 underline-offset-2"
                  }
                >
                  {it.text}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <ShinyButton
              href="#contact"
              variant="secondary"
              className="w-full"
              size="lg"
            >
              Empezar gratis
            </ShinyButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative rounded-3xl p-[1.5px] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #FFD700 0%, #FDB931 45%, #B8860B 100%)",
          }}
        >
          <div
            aria-hidden
            className="absolute -inset-20 opacity-60 blur-3xl -z-10"
            style={{
              background:
                "radial-gradient(closest-side, rgba(255,215,0,0.45), transparent)",
            }}
          />
          <div className="relative rounded-[calc(1.5rem-2px)] p-8 flex flex-col h-full bg-light-surface dark:bg-[#0D1117] overflow-hidden">
            <div
              aria-hidden
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,215,0,0.08) 0%, transparent 60%)",
              }}
            />

            <div className="absolute top-6 right-6">
              <div className="rounded-full bg-gradient-to-r from-brand-gold to-brand-goldDark px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Recomendado
              </div>
            </div>

            <div className="relative pr-28">
              <p className="text-xs uppercase tracking-[0.18em] font-bold text-brand-gold">
                Premium
              </p>
              <h3 className="mt-1 font-display text-2xl font-extrabold">
                Protección total
              </h3>
            </div>

            <div className="relative mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl font-extrabold">
                $89
              </span>
              <span className="text-light-muted dark:text-dark-muted">
                MXN / mes
              </span>
            </div>
            <p className="relative mt-2 text-sm text-light-muted dark:text-dark-muted">
              Tu asistente VIP con IA en línea 24/7.
            </p>

            <ul className="relative mt-8 space-y-3 flex-1">
              {PREMIUM.map((text) => (
                <li key={text} className="flex items-start gap-3 text-sm">
                  <span className="h-5 w-5 flex-none rounded-full bg-gradient-to-br from-brand-gold to-brand-goldDark flex items-center justify-center mt-0.5">
                    <Check className="h-3 w-3 text-black" strokeWidth={3} />
                  </span>
                  <span className="font-medium">{text}</span>
                </li>
              ))}
            </ul>

            <div className="relative mt-8">
              <a
                href="#contact"
                className="group relative block w-full overflow-hidden rounded-full px-8 py-4 text-center text-sm font-bold text-black transition-transform hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, #FFD700 0%, #FDB931 45%, #D4AF37 100%)",
                  boxShadow:
                    "0 20px 50px -10px rgba(255,215,0,0.5), inset 0 1px 0 rgba(255,255,255,0.45)",
                }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Crown className="h-4 w-4" />
                  Desbloquear Premium
                </span>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="mt-10 text-center text-xs text-light-muted dark:text-dark-muted">
        Cancela en cualquier momento desde la app · Sin contratos ocultos · Pago
        seguro
      </p>
    </Section>
  );
}
