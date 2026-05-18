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
      text: "¡Guau! El plan Premium cuesta **$89 MXN al mes** y añade sobre el Free:\n\n• Modo Viaje con seguimiento en tiempo real 🗺️\n• Check-in Diario con racha gamificada ✅\n• Check-in de Seguridad con recordatorios cada 1-12 hrs 🛡️\n• Sonidos S.O.S. personalizados (Alarma, Sirena, Silencioso) 🔔\n• IA sin límites con respuestas detalladas y diagnóstico mecánico paso a paso\n• Asesoría ante choques y seguros + primeros auxilios guiados\n• Historial completo + estadísticas y soporte prioritario\n\nPuedes cancelar cuando quieras desde la app. 🐾",
      suggestions: ["¿Qué incluye el Free?", "¿Cómo cancelo?", "Descargar la app"],
    }),
  },
  {
    keywords: ["free", "gratis", "gratuito", "gratuita", "básico", "basico"],
    reply: () => ({
      text: "El plan Free es **gratis para siempre** y huele a libertad 🐾. Incluye:\n\n• Botón SOS con cuenta regresiva\n• Detección automática de choques\n• Mapa en tiempo real con 8 servicios\n• Ficha médica offline\n• Sonido S.O.S. predeterminado + vibración\n• Últimas 5 emergencias en el historial\n• Tips básicos y llamada al 911\n\nPerfecto para arrancar sin pagar nada. El Premium suma Modo Viaje, Check-ins, sonidos personalizados e IA sin límites.",
      suggestions: ["¿Qué agrega el Premium?", "Descargar la app"],
    }),
  },
  {
    keywords: ["precio", "cuesta", "cuánto", "cuanto", "costo"],
    reply: () => ({
      text: "Los planes:\n\n• **Free**: $0, para siempre. SOS, mapa, ficha médica, servicios cercanos y sonido S.O.S. predeterminado.\n• **Premium**: $89 MXN/mes. Suma Modo Viaje, Check-in Diario, Check-in de Seguridad, sonidos personalizados, IA sin límites, diagnósticos, escudo legal y VIP médico.\n\nCancelas cuando quieras. Sin letras chicas. 🐕",
      suggestions: ["Diferencias Free vs Premium", "¿Cómo pago?"],
    }),
  },

  // ── Funciones Premium específicas ────────────────────────────────────────
  {
    keywords: ["modo viaje", "viaje seguro", "compartir viaje", "trayecto seguro"],
    reply: () => ({
      text: "El **Modo Viaje** 🗺️ es exclusivo Premium. Eliges duración (1, 2, 4 u 8 hrs) y destino opcional. Al iniciar, tu contacto recibe un mensaje con tu ubicación de partida y un timer corre en vivo. Cuando llegas, otro mensaje confirma que estás bien. Ideal para viajes solos o trayectos largos.",
      suggestions: ["¿Qué incluye el Premium?", "¿Y el Check-in?"],
    }),
  },
  {
    keywords: ["check-in diario", "checkin diario", "racha", "check-in racha"],
    reply: () => ({
      text: "**Check-in Diario con racha** ✅ es Premium. Activas un switch, eliges hora (8am, 9am, 12pm u 8pm) y cada día recibes una notificación. Tocas ESTOY BIEN y se envía un mensaje automático a tu contacto con tu racha (días consecutivos). Pensado para personas que viven solas o adultos mayores.",
      suggestions: ["¿Qué es el Check-in de Seguridad?", "¿Qué incluye Premium?"],
    }),
  },
  {
    keywords: ["check-in de seguridad", "checkin seguridad", "recordatorio seguridad", "intervalo seguridad"],
    reply: () => ({
      text: "El **Check-in de Seguridad** 🛡️ es otra función Premium. A diferencia del diario (que es 1 vez al día con racha), este programa recordatorios cada 1, 2, 4, 8 o 12 horas para que confirmes que estás bien. También permite check-in manual con un toque. Útil si quieres confirmar varias veces al día.",
      suggestions: ["¿Y el Check-in Diario?", "¿Qué incluye Premium?"],
    }),
  },
  {
    keywords: ["sonido sos", "sonidos sos", "alarma sos", "sirena", "cambiar sonido", "sonido alerta"],
    reply: () => ({
      text: "El plan **Free** trae el sonido S.O.S. PREDETERMINADO y la vibración. Con **Premium** desbloqueas tres sonidos más: 🔔 ALARMA, 🚨 SIRENA y 🔇 SILENCIOSO. Útiles si quieres más volumen, llamar la atención o, al contrario, una alerta discreta.",
      suggestions: ["¿Qué incluye Premium?", "¿Cómo funciona el SOS?"],
    }),
  },
  {
    keywords: ["historial", "historial emergencias", "incidentes", "mis emergencias"],
    reply: () => ({
      text: "El **Historial de Emergencias** registra cada SOS y choque detectado con fecha, ubicación y si el mensaje se envió.\n\n• **Free**: ves las últimas 5 emergencias.\n• **Premium**: historial completo + estadísticas (Total, Manuales, Automáticos, Últimos 7 días) y además el Historial de Ubicaciones detallado.",
      suggestions: ["¿Qué incluye Premium?", "¿Cómo descargo la app?"],
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

  // ── Contenido de la web (blog, demo, galería, PWA) ────────────────────────
  {
    keywords: ["blog", "artículo", "articulo", "artículos", "articulos", "posts"],
    reply: () => ({
      text: "¡Guau! 🐕📝 Sí tenemos blog. Está en **/blog** y hoy hay 5 artículos:\n\n• 5 cosas que debes hacer si tienes un accidente vial\n• Cómo crear tu ficha médica de emergencia\n• La regla de oro del rescate: la hora dorada\n• Sin batería, sin señal: cómo sobrevivir varado\n• Qué hacer si un familiar está en un accidente y no contesta\n\nGuías prácticas sin rodeos. Te las recomiendo aunque no instales la app.",
      suggestions: ["¿Cómo descargo la app?", "¿Qué incluye Premium?"],
    }),
  },
  {
    keywords: ["demo", "probar sos", "probar el sos", "demo interactiva", "simular choque", "simular sos"],
    reply: () => ({
      text: "Olfateo que quieres probar 🐾. En la sección **Funciones** de esta misma página tenemos una **demo interactiva del SOS**: tocas 'Simular choque' y vives todo el flujo (impacto detectado → countdown de 10s → cancelar o dejar correr → llamada al 911 + ficha médica + contacto de confianza). Sin descargar nada.",
      suggestions: ["¿Cómo funciona el SOS real?", "¿Cómo descargo la app?"],
    }),
  },
  {
    keywords: ["screenshots", "capturas", "como se ve", "cómo se ve", "como se ve la app", "pantallas", "fotos de la app", "vista previa"],
    reply: () => ({
      text: "¡Husmeo bien tu pregunta! 🐕 Más abajo en la página hay una sección **'Conoce la app'** con 6 pantallas reales: Home, SOS countdown, Ficha Médica S.O.S., 8 Servicios, Chatbot Rex Premium y Modo Viaje. Sin maquillaje, son screenshots tal cual.",
      suggestions: ["¿Cómo descargo la app?", "¿Qué incluye Premium?"],
    }),
  },
  {
    keywords: ["instalar web", "pwa", "guardar en pantalla", "agregar a inicio", "app web"],
    reply: () => ({
      text: "Puedes instalar esta misma página como app 🐾. En Chrome/Edge móvil aparece el banner 'Instalar app' o en el menú '⋮ → Añadir a pantalla de inicio'. Queda como ícono, abre en pantalla completa y tiene acceso directo al mini-juego desde un toque largo. No reemplaza la app móvil real, pero sirve mientras llega a las tiendas.",
      suggestions: ["¿Cómo descargo la app real?", "¿Y qué hace la app?"],
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
      text: "Tres modos:\n\n• 🟢 **Fácil**: 4 vidas, muchos power-ups. La velocidad sube DESPACIO con el tiempo.\n• 🟡 **Normal**: 3 vidas, balance. La velocidad sube a ritmo MEDIO.\n• 🔴 **Difícil**: 2 vidas, casi sin ayuda. La velocidad se DISPARA rápido.\n\nDato curioso: en cualquier modo, mientras más aguantes, más rápido va la ambulancia. Ningún modo se queda fácil para siempre 🐾",
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
  "Hay 5 artículos en /blog para leer sin instalar nada 📝",
  "¿Quieres probar el SOS? Hay una demo interactiva aquí mismo 🚨",
  "¿Curioso/a? La sección 'Conoce la app' muestra capturas reales 📱",
];
