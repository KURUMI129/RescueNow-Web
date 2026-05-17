"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { BlurText } from "@/components/ui/blur-text";
import { GradientText } from "@/components/ui/gradient-text";
import { Section, SectionLabel } from "@/components/ui/section";

const FAQS = [
  {
    q: "¿Qué hace RescueNow exactamente?",
    a: "Es una app de emergencias y asistencia vial. Incluye un botón SOS con cuenta regresiva, detección automática de choques por acelerómetro, ficha médica S.O.S. offline, mapa en tiempo real con 8 servicios (hospitales, grúa, mecánicos, gasolina, llantera, cerrajero, electricista), asistente con IA y llamada directa al 911.",
  },
  {
    q: "¿Cuánto cuesta el plan Premium y qué diferencia tiene con el Free?",
    a: "El plan Premium cuesta $89 MXN al mes. El Free ya incluye botón SOS, detección de choques, mapa con servicios, ficha médica offline y asistente IA con respuestas breves. El Premium abre la IA sin límites con respuestas detalladas, diagnóstico mecánico paso a paso, asesoría ante choques y seguros, primeros auxilios guiados y soporte prioritario. Puedes cancelar cuando quieras.",
  },
  {
    q: "¿Funciona sin internet?",
    a: "Varias funciones críticas sí: la ficha médica S.O.S., el botón SOS con marcación al 911 y los datos básicos de tu perfil. El mapa y los servicios cercanos requieren conexión para actualizarse.",
  },
  {
    q: "¿Cómo detecta los choques?",
    a: "Con el acelerómetro del teléfono. Cuando detecta un impacto mayor a 4G, muestra una pantalla de emergencia preguntando si estás bien. Si no respondes en 10 segundos, envía automáticamente tu ubicación y ficha médica al 911 y al contacto de confianza.",
  },
  {
    q: "¿Comparten mi ubicación o datos médicos con alguien?",
    a: "No. Tus datos se guardan en tu dispositivo y solo se envían cuando tú activas el SOS o cuando la detección de choques se dispara. Tú eliges el contacto de confianza y controlas qué información se comparte.",
  },
  {
    q: "¿En qué dispositivos está disponible?",
    a: "La app está construida con Expo y corre en iOS y Android. Pronto estará disponible en la App Store y Google Play. Por ahora puedes solicitar early access por WhatsApp o correo.",
  },
  {
    q: "¿Qué pasa si activo el SOS por error?",
    a: "Tienes 10 segundos para cancelar antes de que se envíe la alerta. En la pantalla de cuenta regresiva, un botón grande te permite detenerla inmediatamente sin consecuencias.",
  },
  {
    q: "¿Cómo cancelo mi suscripción Premium?",
    a: "Desde la misma app, en la pantalla Premium. No hay contratos ni cargos ocultos. Mantienes los beneficios hasta el fin del ciclo pagado y luego vuelves automáticamente al plan Free.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <Section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 items-start">
        <div className="lg:sticky lg:top-28">
          <SectionLabel>Preguntas frecuentes</SectionLabel>
          <h2 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance">
            <BlurText text="Las dudas" className="block" />
            <span className="block">
              <GradientText from="#E11D48" via="#F59E0B" to="#0EA5E9">
                más comunes.
              </GradientText>
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-base text-light-muted dark:text-dark-muted max-w-md"
          >
            ¿No encuentras tu respuesta? Habla con Rex, nuestro asistente, o
            escríbenos directo por WhatsApp.
          </motion.p>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left"
                >
                  <span className="font-display text-base sm:text-lg font-bold">
                    {f.q}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-none h-8 w-8 rounded-full bg-brand-crimson/10 text-brand-crimson flex items-center justify-center"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
