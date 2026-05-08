"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Mail, MessageCircle, Phone } from "lucide-react";

import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { Section, SectionLabel } from "@/components/ui/section";

const WHATSAPP = "523521889522";
const WHATSAPP_DISPLAY = "+52 352 188 9522";
const EMAIL = "karollevitafollasalazar@gmail.com";

const CHANNELS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: WHATSAPP_DISPLAY,
    desc: "Respuesta rápida. Soporte directo con el equipo.",
    href: `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      "Hola, tengo una duda sobre RescueNow",
    )}`,
    color: "#25D366",
    cta: "Abrir chat",
  },
  {
    icon: Mail,
    label: "Correo de soporte",
    value: EMAIL,
    desc: "Para consultas detalladas, facturación o alianzas.",
    href: `mailto:${EMAIL}?subject=Consulta%20RescueNow`,
    color: "#0EA5E9",
    cta: "Enviar correo",
  },
];

export function Contact() {
  return (
    <Section id="contact">
      <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] glass p-5 sm:p-8 md:p-12 lg:p-16">
        {/* Decorative blobs — smaller on mobile */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[280px] w-[280px] sm:h-[460px] sm:w-[460px] rounded-full blur-[80px] sm:blur-[100px] opacity-25"
          style={{
            background:
              "radial-gradient(closest-side, #E11D48, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 h-[260px] w-[260px] sm:h-[420px] sm:w-[420px] rounded-full blur-[80px] sm:blur-[100px] opacity-25"
          style={{
            background:
              "radial-gradient(closest-side, #0EA5E9, transparent)",
          }}
        />

        <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-8 sm:gap-12 items-center">
          {/* Left column — heading + badges */}
          <div>
            <SectionLabel>Contacto</SectionLabel>
            <h2 className="mt-4 sm:mt-5 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
              <BlurText text="¿Tienes dudas?" className="block" />
              <span className="block">
                <GradientText from="#E11D48" via="#F59E0B" to="#0EA5E9">
                  Estamos para ti.
                </GradientText>
              </span>
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-light-muted dark:text-dark-muted max-w-lg"
            >
              Nuestro equipo responde en horario hábil. Escríbenos por WhatsApp
              o correo y te contactamos lo antes posible.
            </motion.p>

            {/* Badges — stack vertically on mobile */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="glass rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand-medical flex-none" />
                <span className="text-xs sm:text-sm font-semibold">
                  Lun-Vie · 9:00 - 19:00
                </span>
              </div>
              <div className="glass rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-crimson flex-none" />
                <span className="text-xs sm:text-sm font-semibold">
                  Emergencia real: 911
                </span>
              </div>
            </div>
          </div>

          {/* Right column — contact cards */}
          <div className="flex flex-col gap-3 sm:gap-4">
            {CHANNELS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative glass rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 flex items-center gap-3 sm:gap-4 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(300px circle at 100% 0%, ${c.color}26, transparent 70%)`,
                    }}
                  />

                  <div
                    className="h-11 w-11 sm:h-14 sm:w-14 flex-none rounded-xl sm:rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${c.color}1A`,
                      color: c.color,
                      boxShadow: `0 10px 30px -10px ${c.color}66`,
                    }}
                  >
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] font-bold text-light-muted dark:text-dark-muted">
                      {c.label}
                    </p>
                    <p className="mt-0.5 font-display text-sm sm:text-lg md:text-xl font-extrabold truncate">
                      {c.value}
                    </p>
                    <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs md:text-sm text-light-muted dark:text-dark-muted">
                      {c.desc}
                    </p>
                  </div>

                  {/* Arrow — visible from sm up */}
                  <div className="hidden sm:flex h-11 w-11 flex-none rounded-full border border-current/20 items-center justify-center group-hover:bg-brand-crimson group-hover:text-white group-hover:border-transparent transition-all duration-300">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </div>
                </motion.a>
              );
            })}

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center text-[11px] sm:text-xs text-light-muted dark:text-dark-muted mt-1 sm:mt-2"
            >
              En caso de emergencia real, llama directamente al 911 o usa el
              botón SOS en la app.
            </motion.p>
          </div>
        </div>
      </div>
    </Section>
  );
}
