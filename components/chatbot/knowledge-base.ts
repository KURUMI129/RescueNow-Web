export type RexReply = {
  text: string;
  suggestions?: string[];
  escalate?: boolean;
};

type Rule = {
  keywords: string[];
  reply: (userText: string) => RexReply;
};

const OUT_OF_SCOPE_KEYWORDS = [
  "cambiar llanta",
  "cambiar la llanta",
  "mi carro no enciende",
  "ruido motor",
  "como arreglo",
  "cómo arreglo",
  "primeros auxilios",
  "me duele",
  "mi moto",
  "batería muerta",
  "bateria muerta",
];

export function isOutOfScope(text: string): boolean {
  const t = text.toLowerCase();
  return OUT_OF_SCOPE_KEYWORDS.some((k) => t.includes(k));
}

const RULES: Rule[] = [
  // ── Saludo con variante nocturna ─────────────────────────────────────────
  {
    keywords: ["hola", "buenas", "hi", "hello", "saludos", "qué tal", "que tal"],
    reply: () => {
      const hour = new Date().getHours();
      const nightly = hour >= 23 || hour < 5;
      const intro = nightly
        ? "Aaaa-uuuuuuu... 🌙 Hoy ando trasnochando como buen perro lobo. ¡Guau! "
        : "¡Guau! 🐕 ";
      return {
        text: `${intro}Soy Rex, el asistente de RescueNow. Puedo ayudarte con dudas sobre la app, los planes, funciones o contactar a soporte. ¿En qué te echo una pata?`,
        suggestions: [
          "¿Qué incluye el Premium?",
          "¿Cómo descargo la app?",
          "¿Tienes easter eggs?",
        ],
      };
    },
  },

  // ── Planes ───────────────────────────────────────────────────────────────
  {
    keywords: ["premium", "paga", "pagado", "vip"],
    reply: () => ({
      text: "¡Guau! El plan Premium cuesta **$89 MXN al mes** y añade sobre el Free:\n\n• IA sin límites con respuestas detalladas\n• Diagnóstico mecánico paso a paso\n• Asesoría ante choques y seguros\n• Primeros auxilios guiados\n• Soporte prioritario\n\nPuedes cancelar cuando quieras desde la app. 🐾",
      suggestions: ["¿Qué incluye el Free?", "¿Cómo cancelo?", "Descargar la app"],
    }),
  },
  {
    keywords: ["free", "gratis", "gratuito", "gratuita", "básico", "basico"],
    reply: () => ({
      text: "El plan Free es **gratis para siempre** y huele a libertad 🐾. Incluye:\n\n• Botón SOS con cuenta regresiva\n• Detección automática de choques\n• Mapa en tiempo real con 8 servicios\n• Ficha médica offline\n• Tips básicos y llamada al 911\n\nPerfecto para arrancar sin pagar nada. ¿Quieres más? El Premium te destrampa la IA.",
      suggestions: ["¿Qué agrega el Premium?", "Descargar la app"],
    }),
  },
  {
    keywords: ["precio", "cuesta", "cuánto", "cuanto", "costo"],
    reply: () => ({
      text: "Los planes:\n\n• **Free**: $0, para siempre. Incluye SOS, mapa, ficha médica y servicios cercanos.\n• **Premium**: $89 MXN/mes. Suma IA sin límites, diagnósticos, escudo legal y VIP médico.\n\nCancelas cuando quieras. Sin letras chicas. 🐕",
      suggestions: ["Diferencias Free vs Premium", "¿Cómo pago?"],
    }),
  },

  // ── Funciones ────────────────────────────────────────────────────────────
  {
    keywords: [
      "internet",
      "offline",
      "sin conexión",
      "sin conexion",
      "sin señal",
      "sin senal",
      "sin datos",
    ],
    reply: () => ({
      text: "¡Olfateo bien tu duda! Varias funciones críticas **sí funcionan sin internet**: la ficha médica S.O.S., el botón SOS con llamada al 911 y tus datos básicos. El mapa y la búsqueda de servicios necesitan conexión para actualizarse.",
      suggestions: ["¿Qué es la ficha S.O.S.?", "¿Cómo se activa el SOS?"],
    }),
  },
  {
    keywords: [
      "ficha médica",
      "ficha medica",
      "historial",
      "tipo de sangre",
      "alergias",
    ],
    reply: () => ({
      text: "La **Ficha Médica S.O.S.** la cuidamos con patota fuerte 🐾. Guarda tu tipo de sangre, alergias, condiciones y contacto de confianza. Está disponible incluso sin internet y los paramédicos pueden leerla desde la pantalla bloqueada cuando activas el SOS. Los datos se quedan en tu dispositivo, no los compartimos con nadie. 🏥",
      suggestions: ["¿Qué pasa en un choque?", "¿Es privado?"],
    }),
  },
  {
    keywords: ["choque", "accidente", "impacto", "colisión", "colision", "acelerómetro"],
    reply: () => ({
      text: "¡Wuf! La app **detecta choques automáticamente** usando el acelerómetro. Si registra un impacto mayor a 4G, aparece una pantalla preguntando si estás bien. Si no respondes en 10 segundos, envía tu ubicación y ficha médica al 911 y a tu contacto de confianza. Nada se escapa. 🚨",
      suggestions: ["¿Y si es falsa alarma?", "¿Cómo lo cancelo?"],
    }),
  },
  {
    keywords: [
      "falsa alarma",
      "cancelar",
      "cancela",
      "sos por error",
      "error",
    ],
    reply: () => ({
      text: "Tranquilo, antes de enviar la alerta tienes **10 segundos** con un botón grande para cancelar. Es tiempo suficiente para que no se dispare solo si te caes el teléfono o pasas un tope muy fuerte.",
      suggestions: ["¿Cómo funciona el SOS?"],
    }),
  },
  {
    keywords: ["sos", "botón", "boton", "alerta", "emergencia"],
    reply: () => ({
      text: "El **botón SOS** activa una cuenta regresiva de 10 segundos. Le ladro al peligro en tu lugar 🚨 Si no la cancelas, se envía tu ubicación, ficha médica y llamada directa al 911, además de avisar a tu contacto de confianza. Funciona manual o automático (detección de choques).",
      suggestions: ["¿Qué hace la app con mi ubicación?", "¿Es privado?"],
    }),
  },
  {
    keywords: ["ubicación", "ubicacion", "privacidad", "datos", "privado"],
    reply: () => ({
      text: "Olfateo tu información sólo aquí — se queda en tu dispositivo. **Solo se envía cuando TÚ activas el SOS** o cuando la detección de choques se dispara. Nunca compartimos tu ubicación con terceros ni la usamos para anuncios. 🔒",
      suggestions: ["¿Qué es la ficha S.O.S.?"],
    }),
  },
  {
    keywords: [
      "descargar",
      "descarga",
      "instalar",
      "app store",
      "play store",
      "google play",
      "ios",
      "android",
    ],
    reply: () => ({
      text: "La app está construida con Expo para iOS y Android. Muy pronto estará en las tiendas oficiales. Si quieres **early access**, escríbenos por WhatsApp o correo y te damos la build de prueba. 📲",
      suggestions: ["Contactar soporte", "¿Qué funciones tiene?"],
    }),
  },
  {
    keywords: [
      "servicio",
      "servicios",
      "hospital",
      "grúa",
      "grua",
      "gasolina",
      "llantera",
      "mecánico",
      "mecanico",
      "cerrajero",
      "electricista",
    ],
    reply: () => ({
      text: "¡Husmeo 8 servicios! Hospitales, grúa, mecánico de autos, mecánico de motos, electricista, gasolina, llantera y cerrajero. Los ves en el mapa ordenados por distancia y puedes navegar directo con Google Maps. 🗺️",
      suggestions: ["¿Cómo se ve el mapa?", "¿Funciona sin internet?"],
    }),
  },

  // ── Mini-juego ───────────────────────────────────────────────────────────
  {
    keywords: ["juego", "jugar", "rex al rescate", "ambulancia", "minijuego", "mini juego"],
    reply: () => ({
      text: "¡Guau guau! 🐕‍🦺 Sí tengo un mini-juego en la página: **Rex al Rescate**. Conduzco una ambulancia esquivando baches y rescatando carros varados. Le picas al botón 🐕 en el menú de arriba. ¿Le entras?",
      suggestions: ["¿Cómo se juega?", "¿Tiene dificultades?", "¿Tienes easter eggs?"],
    }),
  },
  {
    keywords: ["cómo se juega", "como se juega", "controles", "como jugar", "cómo jugar"],
    reply: () => ({
      text: "Fácil 🐾:\n\n• **PC**: flechas ← → para moverte.\n• **Móvil**: desliza o toca los lados.\n\nRescata carros varados (suman puntos), esquiva baches y conos, y recoge power-ups: 🛡️ Escudo, ⛽ Gasolina, 🏥 Kit Médico. ¡A correr!",
      suggestions: ["¿Tiene dificultades?", "¿Tienes easter eggs?"],
    }),
  },
  {
    keywords: ["dificultad", "dificultades", "modos", "modo difícil", "modo facil", "modo fácil"],
    reply: () => ({
      text: "Tres modos:\n\n• 🟢 **Fácil**: 4 vidas, ritmo tranquilo, muchos power-ups.\n• 🟡 **Normal**: 3 vidas, equilibrio entre reto y diversión.\n• 🔴 **Difícil**: 2 vidas, casi sin ayuda y rápido. ¿Te animas?",
      suggestions: ["¿Cómo se juega?", "¿Tienes easter eggs?"],
    }),
  },

  // ── Easter eggs ──────────────────────────────────────────────────────────
  // Pistas adicionales (más específico → va antes que "easter egg"/"secreto")
  {
    keywords: ["pistas", "más pistas", "mas pistas", "easter eggs en el juego", "hay easter eggs en el juego"],
    reply: () => ({
      text: "🤫 Te doy 2 más: prueba un **código clásico de NES** en la pantalla de inicio del juego antes de pulsar Comenzar... y si logras 800 puntos en Difícil, algo cool se desbloquea para Rex 🎖️",
      suggestions: ["¿Cómo se juega?", "¿Modos de dificultad?"],
    }),
  },
  // Pista general sobre easter eggs
  {
    keywords: ["easter egg", "easter eggs", "secreto", "secretos", "sorpresa", "sorpresas"],
    reply: () => ({
      text: "¡Guau guau! 🤫 Sí escondo algunas sorpresitas, pero descubrirlas es parte del juego. Te doy una pista: a los perros nos gustan los abrazos, las caricias en la panza, y a la luna le aullamos 🐾",
      suggestions: ["¿Hay easter eggs en el juego?", "Más pistas porfa"],
    }),
  },
  // Easter egg A · abrazo
  {
    keywords: ["abrazo", "abrazame", "abrázame", "abracitos", "abracito"],
    reply: () => ({
      text: "*te abraza con sus patotas* 🐶💛 Aquí estoy, wuf wuf.",
    }),
  },
  // Easter egg B · panzita
  {
    keywords: ["panzita", "rascar panza", "rascame", "rásame", "panza arriba"],
    reply: () => ({
      text: "*se voltea de panza pidiendo caricias* 🐕 Auf~ qué rico...",
    }),
  },
  // Easter egg E · aullar / lobo
  {
    keywords: ["lobo", "aullar", "aullido", "auuu", "auuuu"],
    reply: () => ({
      text: "Aaaaa-uuuuuuuu... 🌙 *mira a la luna*",
    }),
  },

  // ── Identidad y soporte ──────────────────────────────────────────────────
  {
    keywords: ["rex", "tu nombre", "quien eres", "quién eres"],
    reply: () => ({
      text: "Soy **Rex**, un San Bernardo digital con gorra de rescate. 🐕‍🦺 Vivo aquí para resolverte dudas sobre RescueNow. Si me preguntas algo que no sepa, te conecto con soporte humano al instante.",
    }),
  },
  {
    keywords: [
      "contacto",
      "soporte",
      "hablar con alguien",
      "asesor",
      "ayuda humana",
      "whatsapp",
      "correo",
      "email",
    ],
    reply: () => ({
      text: "Puedo ponerte en contacto con soporte directo:",
      escalate: true,
    }),
  },
  {
    keywords: [
      "gracias",
      "thanks",
      "thank you",
      "muchas gracias",
      "te pasaste",
    ],
    reply: () => ({
      text: "¡De nada! 🐾 Si surge otra duda, aquí ando meneando la cola.",
    }),
  },
];

export function answer(userText: string): RexReply {
  const t = userText.toLowerCase().trim();

  if (isOutOfScope(t)) {
    return {
      text: "Esa pregunta es mejor resolverla dentro de la app, donde el asistente con IA puede guiarte paso a paso con tu caso. Yo aquí solo respondo sobre la página y cómo funciona RescueNow en general. 🐕\n\n¿Quieres que te conecte con soporte o te cuento cómo descargar la app?",
      suggestions: ["¿Cómo descargo la app?", "Contactar soporte"],
    };
  }

  for (const rule of RULES) {
    if (rule.keywords.some((k) => t.includes(k))) {
      return rule.reply(userText);
    }
  }

  return {
    text: "No encontré eso en mi base de datos 🐾. Puedo responder preguntas sobre RescueNow, planes, funciones, privacidad o descarga. Si es algo más específico, ¿quieres que te conecte con soporte?",
    suggestions: [
      "¿Qué incluye el Premium?",
      "¿Cómo funciona el SOS?",
      "Contactar soporte",
    ],
  };
}

export const FACTS = [
  "¿Sabías que detecto choques por encima de 4G? 🛡️",
  "¿Sabías que la ficha médica funciona sin internet? 📡",
  "Mi IA Premium contesta sin pausas 🌙",
  "El SOS te da 10s para cancelar falsas alarmas ⏱️",
  "¿Sabías que muestro hospitales por distancia real? 🏥",
  "El Premium te guía en un choque paso a paso 🧑‍⚖️",
  "Tu ubicación solo se comparte cuando tú lo decides 🔒",
  "Los 8 servicios se ven en el mapa estilo radar 🗺️",
  "¿Dudas? Píllame con un clic, te escucho con la oreja parada 👂",
  "¿Ya jugaste Rex al Rescate? 🐕🚑",
  "En el juego escondo easter eggs 🤫",
  "Reto: rescata 10 carros sin chocar 🏆",
  "¿Modo Difícil? Cuidado con mis baches 🕳️",
  "Un código clásico de NES desbloquea algo en el juego... 🎮",
  "¿Has intentado rascarme la panza? 🐾",
];
