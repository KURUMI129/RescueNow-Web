"use client";

import { motion } from "framer-motion";
import { Bot, Heart, Radar, Users } from "lucide-react";

import { BlurText } from "@/components/ui/blur-text";
import { CountUp } from "@/components/ui/count-up";
import { GradientText } from "@/components/ui/gradient-text";
import { Section, SectionLabel } from "@/components/ui/section";

const STATS = [
  { value: 8, suffix: "+", label: "Servicios de asistencia" },
  { value: 10, suffix: "s", label: "Cuenta regresiva SOS" },
  { value: 24, suffix: "/7", label: "Soporte IA disponible" },
  { value: 100, suffix: "%", label: "Funciona sin internet" },
];

const PILLARS = [
  {
    icon: Radar,
    title: "Tecnología geoespacial",
    text: "Mapas en tiempo real con modo oscuro tipo radar/sonar, diseñados para rescate bajo cualquier condición.",
    color: "#0EA5E9",
  },
  {
    icon: Bot,
    title: "Inteligencia artificial",
    text: "Rex, nuestro asistente rescatista, te acompaña y te guía paso a paso ante cualquier emergencia.",
    color: "#8B5CF6",
  },
  {
    icon: Heart,
    title: "Ficha médica offline",
    text: "Tu tipo de sangre, alergias y contacto de confianza siempre listos incluso sin señal. Diseñada para paramédicos.",
    color: "#E11D48",
  },
  {
    icon: Users,
    title: "Hecho en México",
    text: "Un equipo mexicano enfocado en tecnología que salva vidas y da tranquilidad a las familias en carretera.",
    color: "#F59E0B",
  },
];

export function About() {
  return (
    <Section id="about">
      <div className="grid lg:grid-cols-[1.1fr_1fr] gap-16 items-start">
        <div>
          <SectionLabel>Quiénes somos</SectionLabel>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
            <BlurText text="Somos" className="block" />
            <BlurText
              text="el copiloto que nunca"
              className="block"
              delay={0.15}
            />
            <span className="block">
              te falla{" "}
              <GradientText from="#E11D48" via="#F59E0B" to="#0EA5E9">
                en la carretera.
              </GradientText>
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-base sm:text-lg text-light-muted dark:text-dark-muted max-w-xl"
          >
            RescueNow nació con una convicción simple: cada segundo cuenta.
            Unimos detección automática de accidentes, asistencia médica,
            mecánica, legal y vial en una sola app que entiende el contexto y
            responde por ti cuando tú no puedes.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-4 text-base sm:text-lg text-light-muted dark:text-dark-muted max-w-xl"
          >
            Nuestra misión es que nadie vuelva a quedar varado, herido o
            desinformado en el peor momento. Con inteligencia artificial,
            geolocalización y una red de asistencia en expansión, RescueNow
            convierte el pánico en un plan claro.
          </motion.p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-4"
              >
                <div className="font-display text-3xl font-extrabold">
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-light-muted dark:text-dark-muted">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(240px circle at 50% 0%, ${p.color}26, transparent 70%)`,
                  }}
                />
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: `${p.color}1A`,
                    color: p.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {p.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
