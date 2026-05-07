"use client";

import { motion } from "framer-motion";
import { Crown, Quote, Star } from "lucide-react";

import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { Marquee } from "@/components/ui/marquee";
import { Section, SectionLabel } from "@/components/ui/section";

type T = {
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
  plan: "free" | "premium";
};

const ROW_A: T[] = [
  {
    name: "Luis Ramírez",
    role: "Ing. mecatrónico · León",
    avatar: "LR",
    text: "Me quedé sin gasolina en carretera a las 2 AM. En 3 minutos tenía la estación más cercana y ruta directa. No volvería a manejar sin RescueNow.",
    rating: 5,
    plan: "free",
  },
  {
    name: "Mariana Solís",
    role: "Madre de familia · Guadalajara",
    avatar: "MS",
    text: "La ficha médica offline me dio la paz que necesitaba después de que mi mamá tuvo un accidente. Los paramédicos la leyeron sin internet. Vale oro.",
    rating: 5,
    plan: "premium",
  },
  {
    name: "Carlos Delgado",
    role: "Conductor Uber · CDMX",
    avatar: "CD",
    text: "El Premium se paga solo. La IA me dictó paso a paso qué hacer cuando el motor empezó a sobrecalentar. Evité una refundición de miles de pesos.",
    rating: 5,
    plan: "premium",
  },
  {
    name: "Ana Paula Trejo",
    role: "Contadora · Querétaro",
    avatar: "AT",
    text: "Probé el botón SOS por accidente y se activó la cuenta regresiva. Lo cancelé sin problema. Me gustó que no se dispare solo, hay 10s reales.",
    rating: 5,
    plan: "free",
  },
  {
    name: "Jorge Peña",
    role: "Motoviajero · Puebla",
    avatar: "JP",
    text: "La detección de choques funcionó cuando me caí en una curva. No estaba grave, pero me sorprendió que la app enviara mi ubicación sola.",
    rating: 5,
    plan: "premium",
  },
];

const ROW_B: T[] = [
  {
    name: "Sofía Huerta",
    role: "Estudiante · Monterrey",
    avatar: "SH",
    text: "El plan gratuito ya trae lo básico: SOS, mapa, servicios. Pero lo mejor es lo rápido que carga. Mis papás me exigieron instalarla.",
    rating: 5,
    plan: "free",
  },
  {
    name: "Roberto Chávez",
    role: "Taxista · Tijuana",
    avatar: "RC",
    text: "Con la asesoría Premium después de un choque laminero me llevé la calma: la IA me explicó qué decirle al ajustador paso a paso. Cero drama.",
    rating: 5,
    plan: "premium",
  },
  {
    name: "Valeria Ortiz",
    role: "Veterinaria · Mérida",
    avatar: "VO",
    text: "La llantera más cercana apareció en el mapa con distancia y hora. Me fui con navegación directa. Literal me sentí como en película.",
    rating: 5,
    plan: "free",
  },
  {
    name: "Diego Mendoza",
    role: "Arquitecto · San Luis Potosí",
    avatar: "DM",
    text: "Migrar al Premium por 89 pesos al mes fue obvio. Los diagnósticos y el escudo legal cubren lo que una grúa cobra en una llamada.",
    rating: 5,
    plan: "premium",
  },
  {
    name: "Pamela Vázquez",
    role: "Diseñadora · Toluca",
    avatar: "PV",
    text: "La interfaz es preciosa y el modo nocturno no te encandila. Se siente premium desde el primer segundo.",
    rating: 5,
    plan: "free",
  },
];

export function Testimonials() {
  return (
    <Section id="testimonials">
      <div className="text-center max-w-3xl mx-auto">
        <SectionLabel>Testimonios</SectionLabel>
        <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
          <BlurText text="Ya salvamos" className="block" />
          <span className="block">
            <GradientText from="#E11D48" via="#F59E0B" to="#0EA5E9">
              muchos viajes.
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
          Miles de conductores ya confían en RescueNow. Esto es lo que dicen
          después de probarla.
        </motion.p>
      </div>

      <div className="mt-14 space-y-5 overflow-hidden">
        <Marquee>
          <div className="flex gap-5 pr-5">
            {ROW_A.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </Marquee>
        <Marquee reverse>
          <div className="flex gap-5 pr-5">
            {ROW_B.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </Marquee>
      </div>
    </Section>
  );
}

function TestimonialCard({ t }: { t: T }) {
  return (
    <div className="relative w-[340px] sm:w-[380px] flex-none glass rounded-3xl p-6 hover:-translate-y-1 transition-transform duration-300">
      <Quote className="absolute top-5 right-5 h-6 w-6 text-brand-crimson/20" />

      <div className="flex items-center gap-3">
        <div
          className="h-11 w-11 rounded-full flex items-center justify-center font-display text-sm font-extrabold text-white"
          style={{
            background:
              t.plan === "premium"
                ? "linear-gradient(135deg,#FFD700,#D4AF37)"
                : "linear-gradient(135deg,#E11D48,#0EA5E9)",
            color: t.plan === "premium" ? "#1A1A1A" : "#fff",
          }}
        >
          {t.avatar}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold truncate">{t.name}</span>
            {t.plan === "premium" && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-gold/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-brand-gold">
                <Crown className="h-2.5 w-2.5" />
                Premium
              </span>
            )}
          </div>
          <div className="text-[11px] text-light-muted dark:text-dark-muted truncate">
            {t.role}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-brand-gold text-brand-gold"
          />
        ))}
      </div>

      <p className="mt-3 text-sm leading-relaxed">{t.text}</p>
    </div>
  );
}
