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
  {
    keywords: ["hola", "buenas", "hi", "hello", "saludos", "qué tal", "que tal"],
    reply: () => ({
      text: "¡Guau! 🐕 Soy Rex, el asistente de RescueNow. Puedo ayudarte con dudas sobre la app, los planes, funciones o contactar a soporte. ¿En qué te echo una pata?",
      suggestions: [
        "¿Qué incluye el Premium?",
        "¿Cómo descargo la app?",
        "¿Funciona sin internet?",
      ],
    }),
  },
  {
    keywords: ["premium", "paga", "pagado", "vip"],
    reply: () => ({
      text: "El plan Premium cuesta **$89 MXN al mes** y añade sobre el Free:\n\n• IA sin límites con respuestas detalladas\n• Diagnóstico mecánico paso a paso\n• Asesoría ante choques y seguros\n• Primeros auxilios guiados\n• Soporte prioritario\n\nPuedes cancelar cuando quieras desde la app. 🐾",
      suggestions: ["¿Qué incluye el Free?", "¿Cómo cancelo?", "Descargar la app"],
    }),
  },
  {
    keywords: ["free", "gratis", "gratuito", "gratuita", "básico", "basico"],
    reply: () => ({
      text: "El plan Free es **gratis para siempre** e incluye:\n\n• Botón SOS con cuenta regresiva\n• Detección automática de choques\n• Mapa en tiempo real con 8 servicios\n• Ficha médica offline\n• Tips básicos y llamada al 911\n\nPerfecto para arrancar sin pagar nada. ¿Quieres más? El Premium te destrampa la IA.",
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
      text: "Varias funciones críticas **sí funcionan sin internet**: la ficha médica S.O.S., el botón SOS con llamada al 911 y tus datos básicos. El mapa y la búsqueda de servicios necesitan conexión para actualizarse.",
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
      text: "La **Ficha Médica S.O.S.** guarda tu tipo de sangre, alergias, condiciones y contacto de confianza. Está disponible incluso sin internet y los paramédicos pueden leerla desde la pantalla bloqueada cuando activas el SOS. Los datos se quedan en tu dispositivo, no los compartimos con nadie. 🏥",
      suggestions: ["¿Qué pasa en un choque?", "¿Es privado?"],
    }),
  },
  {
    keywords: ["choque", "accidente", "impacto", "colisión", "colision", "acelerómetro"],
    reply: () => ({
      text: "La app **detecta choques automáticamente** usando el acelerómetro. Si registra un impacto mayor a 4G, aparece una pantalla preguntando si estás bien. Si no respondes en 10 segundos, envía tu ubicación y ficha médica al 911 y a tu contacto de confianza. Nada se escapa. 🚨",
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
      text: "El **botón SOS** activa una cuenta regresiva de 10 segundos. Si no la cancelas, se envía tu ubicación, ficha médica y llamada directa al 911, además de avisar a tu contacto de confianza. Funciona manual o automático (detección de choques). 🚨",
      suggestions: ["¿Qué hace la app con mi ubicación?", "¿Es privado?"],
    }),
  },
  {
    keywords: ["ubicación", "ubicacion", "privacidad", "datos", "privado"],
    reply: () => ({
      text: "Tu información se queda en tu dispositivo. **Solo se envía cuando TÚ activas el SOS** o cuando la detección de choques se dispara. Nunca compartimos tu ubicación con terceros ni la usamos para anuncios. 🔒",
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
      text: "La app trae **8 servicios** de asistencia: hospitales, grúa, mecánico de autos, mecánico de motos, electricista, gasolina, llantera y cerrajero. Los ves en el mapa ordenados por distancia y puedes navegar directo con Google Maps. 🗺️",
      suggestions: ["¿Cómo se ve el mapa?", "¿Funciona sin internet?"],
    }),
  },
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
  "¿Tienes una duda? Clic en mi icono para preguntarme 🐕",
];
