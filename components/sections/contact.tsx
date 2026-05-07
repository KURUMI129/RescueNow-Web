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
      <div className="relative overflow-hidden rounded-[32px] glass p-8 sm:p-12 md:p-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 h-[460px] w-[460px] rounded-full blur-[100px] opacity-25"
          style={{
            background:
              "radial-gradient(closest-side, #E11D48, transparent)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full blur-[100px] opacity-25"
          style={{
            background:
              "radial-gradient(closest-side, #0EA5E9, transparent)",
          }}
        />

        <div className="relative grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center">
          <div>
            <SectionLabel>Contacto</SectionLabel>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
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
              className="mt-6 text-base sm:text-lg text-light-muted dark:text-dark-muted max-w-lg"
            >
              Nuestro equipo responde en horario hábil. Escríbenos por WhatsApp
              o correo y te contactamos lo antes posible.
            </motion.p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                <Clock className="h-4 w-4 text-brand-medical" />
                <span className="text-sm font-semibold">
                  Lun-Vie · 9:00 - 19:00
                </span>
              </div>
              <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-crimson" />
                <span className="text-sm font-semibold">
                  Emergencia real: 911
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
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
                  className="group relative glass rounded-3xl p-5 sm:p-6 flex items-center gap-4 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: `radial-gradient(300px circle at 100% 0%, ${c.color}26, transparent 70%)`,
                    }}
                  />

                  <div
                    className="h-14 w-14 flex-none rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${c.color}1A`,
                      color: c.color,
                      boxShadow: `0 10px 30px -10px ${c.color}66`,
                    }}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] uppercase tracking-[0.18em] font-bold text-light-muted dark:text-dark-muted">
                      {c.label}
                    </p>
                    <p className="mt-0.5 font-display text-lg sm:text-xl font-extrabold truncate">
                      {c.value}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm text-light-muted dark:text-dark-muted">
                      {c.desc}
                    </p>
                  </div>

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
              className="text-center text-xs text-light-muted dark:text-dark-muted mt-2"
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
