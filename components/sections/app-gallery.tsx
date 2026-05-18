"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { Section, SectionLabel } from "@/components/ui/section";

type Screen = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  badge?: string;
  badgeColor?: string;
};

const SCREENS: Screen[] = [
  {
    src: "/screenshots/home.jpeg",
    alt: "Pantalla principal de RescueNow con mapa, botón SOS y Rex",
    title: "Tu carretera, en tiempo real",
    caption:
      "Mapa oscuro estilo radar, botón SOS siempre visible y Rex listo para asistir.",
    badge: "Home",
    badgeColor: "#0EA5E9",
  },
  {
    src: "/screenshots/sos.jpeg",
    alt: "Pantalla de SOS activado con cuenta regresiva",
    title: "10 segundos para cancelar",
    caption:
      "Cuando detectamos un impacto, te preguntamos antes de alertar. Si no respondes, enviamos ayuda automáticamente.",
    badge: "SOS",
    badgeColor: "#E11D48",
  },
  {
    src: "/screenshots/ficha-medica.jpeg",
    alt: "Ficha médica con tipo de sangre, alergias y contacto",
    title: "Ficha médica accesible",
    caption:
      "Tipo de sangre, alergias y contacto de confianza listos para paramédicos, incluso si estás inconsciente.",
    badge: "Salud",
    badgeColor: "#E11D48",
  },
  {
    src: "/screenshots/servicios.jpeg",
    alt: "Lista de servicios cercanos con hospitales, grúa, mecánicos",
    title: "8 servicios cercanos",
    caption:
      "Hospitales, grúa, mecánicos, electricista, gasolina, llantera y cerrajero — todos ordenados por distancia real.",
    badge: "Servicios",
    badgeColor: "#F59E0B",
  },
  {
    src: "/screenshots/chatbot.jpeg",
    alt: "Chat con Rex Premium asistente de emergencia",
    title: "Rex Premium · tu asistente IA",
    caption:
      "Diagnóstico mecánico, asesoría legal, primeros auxilios y tips de mantenimiento. Sin límites en Premium.",
    badge: "IA",
    badgeColor: "#8B5CF6",
  },
  {
    src: "/screenshots/travel-mode.jpeg",
    alt: "Modo viaje con compartir ubicación a contacto de confianza",
    title: "Modo Viaje seguro",
    caption:
      "Comparte tu ruta con quien tú elijas. Si excedes el tiempo, te avisamos para que confirmes que estás bien.",
    badge: "Viaje",
    badgeColor: "#10B981",
  },
];

export function AppGallery() {
  return (
    <Section id="gallery">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <SectionLabel>Conoce la app</SectionLabel>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05]">
          <BlurText text="Esto es lo que vives" className="block" />
          <span className="block">
            <GradientText from="#E11D48" via="#F59E0B" to="#0EA5E9">
              dentro de RescueNow.
            </GradientText>
          </span>
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 text-base sm:text-lg text-light-muted dark:text-dark-muted max-w-2xl mx-auto"
        >
          Estas son pantallas reales de la app. Sin maquillaje, sin mockups
          inventados.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {SCREENS.map((s, i) => (
          <motion.div
            key={s.src}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            className="flex flex-col items-center"
          >
            <PhoneFrame>
              <Image
                src={s.src}
                alt={s.alt}
                width={720}
                height={1560}
                className="h-full w-full object-cover"
                sizes="(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 30vw"
              />
              {s.badge && (
                <span
                  className="absolute top-3 left-3 z-10 rounded-full px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-white shadow-md"
                  style={{ background: s.badgeColor }}
                >
                  {s.badge}
                </span>
              )}
            </PhoneFrame>
            <h3 className="mt-5 font-display text-lg sm:text-xl font-extrabold text-center">
              {s.title}
            </h3>
            <p className="mt-1.5 text-sm text-light-muted dark:text-dark-muted text-center max-w-xs">
              {s.caption}
            </p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative w-full max-w-[260px] aspect-[9/19.5] rounded-[36px] bg-black p-[6px]"
      style={{
        boxShadow:
          "0 30px 60px -20px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 0 8px rgba(15,23,42,0.6)",
      }}
    >
      {/* Notch */}
      <div className="absolute top-[6px] left-1/2 -translate-x-1/2 z-20 h-5 w-20 rounded-b-2xl bg-black" />
      {/* Screen */}
      <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-[#0B1120]">
        {children}
      </div>
      {/* Side button hint */}
      <div className="absolute -right-[2px] top-24 h-12 w-[2px] rounded-l bg-black/40" />
      <div className="absolute -left-[2px] top-20 h-8 w-[2px] rounded-r bg-black/40" />
      <div className="absolute -left-[2px] top-32 h-12 w-[2px] rounded-r bg-black/40" />
    </div>
  );
}
