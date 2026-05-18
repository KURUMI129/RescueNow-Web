"use client";

import { motion } from "framer-motion";
import {
  Bot,
  CarFront,
  Heart,
  MapPinned,
  ShieldAlert,
  Sparkles,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";

import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { Section, SectionLabel } from "@/components/ui/section";
import { SosInteractive } from "@/components/ui/sos-interactive";
import { TiltedCard } from "@/components/ui/tilted-card";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  anim: string;
};

const FEATURES: Feature[] = [
  {
    icon: CarFront,
    title: "Detección automática de choques",
    desc: "Usa el acelerómetro para detectar impactos > 4G. Si no respondes a tiempo, la alerta se envía sola.",
    color: "#F97316",
    anim: "group-hover:animate-car-vibrate",
  },
  {
    icon: MapPinned,
    title: "Mapa en tiempo real",
    desc: "Estilo radar/sonar de rescate. Centra en tu ubicación, ve técnicos y servicios cercanos al instante.",
    color: "#0EA5E9",
    anim: "group-hover:animate-map-pin-drop",
  },
  {
    icon: Heart,
    title: "Ficha médica S.O.S.",
    desc: "Tipo de sangre, alergias, condiciones y contacto de confianza. Disponible incluso sin conexión.",
    color: "#DC2626",
    anim: "group-hover:animate-heartbeat",
  },
  {
    icon: Bot,
    title: "Asistente con IA",
    desc: "Un chat inteligente te guía paso a paso ante cualquier emergencia. Respuestas rápidas y claras.",
    color: "#8B5CF6",
    anim: "group-hover:animate-bot-nod",
  },
  {
    icon: ShieldAlert,
    title: "Llamada directa al 911",
    desc: "Pantalla de emergencia con marcación automática y reenvío de mensajes a tu contacto predeterminado.",
    color: "#E11D48",
    anim: "group-hover:animate-shield-glow",
  },
  {
    icon: UserRoundCheck,
    title: "Contacto de confianza",
    desc: "Configura un número y se activa automáticamente con tu ubicación cuando suena el SOS. Tu familia se entera primero.",
    color: "#10B981",
    anim: "group-hover:animate-heartbeat",
  },
  {
    icon: Sparkles,
    title: "Modo día y noche",
    desc: "Cambio automático según la hora (8 PM - 7 AM oscuro). Protege tu vista en cualquier viaje nocturno.",
    color: "#F59E0B",
    anim: "group-hover:animate-sparkle-spin",
  },
];

export function Features() {
  return (
    <Section id="features">
      <div className="max-w-3xl">
        <SectionLabel>Funciones principales</SectionLabel>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
          <BlurText text="Todo lo que necesitas para" className="block" />
          <span className="block">
            <GradientText from="#E11D48" via="#8B5CF6" to="#0EA5E9">
              llegar sano y salvo.
            </GradientText>
          </span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg text-light-muted dark:text-dark-muted max-w-2xl"
        >
          Diseñada con el mismo rigor que la aviación: redundancia, claridad y
          velocidad. Cada función está pensada para minimizar tu estrés cuando
          más cuenta.
        </motion.p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="row-span-2 md:col-span-2 md:row-span-2"
        >
          <div className="relative h-full glass rounded-3xl p-2 overflow-hidden">
            <SosInteractive />
          </div>
        </motion.div>

        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
            >
              <TiltedCard className="h-full" intensity={8}>
                <div className="group relative h-full glass rounded-3xl p-6 overflow-hidden flex flex-col">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full blur-3xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                    style={{ backgroundColor: f.color }}
                  />
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center mb-auto transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${f.color}1F`,
                      color: f.color,
                      boxShadow: `0 8px 24px -10px ${f.color}66`,
                    }}
                  >
                    <Icon className={`h-6 w-6 ${f.anim}`} />
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold leading-tight">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </TiltedCard>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
