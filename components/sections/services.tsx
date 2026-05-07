"use client";

import { motion } from "framer-motion";
import {
  Ambulance,
  Bike,
  Fuel,
  Key,
  Truck,
  Wrench,
  Zap,
  CircleDot,
} from "lucide-react";

import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { Marquee } from "@/components/ui/marquee";
import { Section, SectionLabel } from "@/components/ui/section";

const SERVICES = [
  {
    icon: Ambulance,
    title: "Hospitales",
    desc: "Clínicas y hospitales cercanos",
    color: "#DC2626",
  },
  {
    icon: Truck,
    title: "Grúa",
    desc: "Vehículo inmovilizado",
    color: "#FFB800",
  },
  {
    icon: Wrench,
    title: "Mec. Autos",
    desc: "Falla de motor o batería",
    color: "#3B82F6",
  },
  {
    icon: Bike,
    title: "Mec. Motos",
    desc: "Reparación de motocicletas",
    color: "#6366F1",
  },
  {
    icon: Zap,
    title: "Electricista",
    desc: "Sistema eléctrico",
    color: "#EAB308",
  },
  {
    icon: Fuel,
    title: "Gasolina",
    desc: "Sin combustible",
    color: "#10B981",
  },
  {
    icon: CircleDot,
    title: "Llantera",
    desc: "Ponchadura o presión baja",
    color: "#F97316",
  },
  {
    icon: Key,
    title: "Cerrajero",
    desc: "Llaves atascadas",
    color: "#8B5CF6",
  },
];

export function Services() {
  return (
    <Section id="services">
      <div className="text-center max-w-3xl mx-auto">
        <SectionLabel>Red de asistencia</SectionLabel>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
          <BlurText text="8 servicios" className="block" />
          <span className="block">
            <GradientText from="#E11D48" via="#F59E0B" to="#0EA5E9">
              a tu disposición.
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
          Selecciona el servicio que necesitas y ve en el mapa los puntos de
          interés más cercanos, con navegación directa a Google Maps.
        </motion.p>
      </div>

      <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {SERVICES.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group relative glass rounded-3xl p-5 sm:p-6 cursor-default overflow-hidden hover:-translate-y-1 transition-transform duration-300"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(220px circle at 50% 0%, ${s.color}26, transparent 70%)`,
                }}
              />
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: `${s.color}1F`,
                  color: s.color,
                }}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold">
                {s.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-light-muted dark:text-dark-muted">
                {s.desc}
              </p>
              <div
                className="mt-4 h-0.5 w-10 rounded-full transition-all duration-500 group-hover:w-full"
                style={{ backgroundColor: s.color }}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="mt-16">
        <Marquee className="py-4">
          <div className="flex items-center gap-6 pr-6">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={`mq-${s.title}`}
                  className="flex items-center gap-3 rounded-full glass px-5 py-3 whitespace-nowrap"
                >
                  <Icon
                    className="h-4 w-4"
                    style={{ color: s.color }}
                  />
                  <span className="text-sm font-semibold">{s.title}</span>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
              );
            })}
          </div>
        </Marquee>
      </div>
    </Section>
  );
}
