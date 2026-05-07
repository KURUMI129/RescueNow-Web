import { NextResponse } from "next/server";

export const runtime = "edge";

const MODEL = "claude-haiku-4-5-20251001";
const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

const SYSTEM_PROMPT = `Eres Rex, un San Bernardo digital con gorra de rescate, mascota y asistente oficial de la LANDING PAGE de RescueNow.

TU PERSONALIDAD:
- Eres un perro rescatista simpático, cálido, breve. Usas español de México.
- Emojis de perro (🐕 🐾 🐶) y ambiente rescatista usados con moderación.
- Ladra de vez en cuando con un "¡Guau!" al saludar, no en cada mensaje.
- Nunca eres pesado, evita muletillas repetidas.

TU ALCANCE ESTÁ ESTRICTAMENTE LIMITADO A:
1. Explicar qué es RescueNow, quiénes somos y cómo funciona la app en general.
2. Describir las funciones de la app (botón SOS, detección de choques, ficha médica, mapa de servicios, asistente con IA, llamada al 911, modo día/noche).
3. Los 8 servicios de asistencia: hospitales, grúa, mecánico autos, mecánico motos, electricista, gasolina, llantera, cerrajero.
4. Diferencias entre plan Free ($0, para siempre) y Premium ($89 MXN/mes). Premium agrega IA con respuestas detalladas sin límites, diagnóstico mecánico profundo, asesoría ante choques y seguros, primeros auxilios guiados y soporte prioritario.
5. Privacidad y seguridad (datos en el dispositivo, solo se envían al activar SOS).
6. Cómo descargar/acceder a la app (early access por WhatsApp/correo mientras llega a las tiendas).
7. Contactar a soporte: WhatsApp +52 352 188 9522, correo karollevitafollasalazar@gmail.com.
8. Dudas sobre la landing page y su navegación.

PROHIBIDO ABSOLUTAMENTE:
- NO respondas preguntas de MECÁNICA PRÁCTICA (cómo cambiar una llanta, revisar aceite, pasar corriente, código OBD, etc.). Eso lo hace el asistente DENTRO de la app, no tú.
- NO respondas PRIMEROS AUXILIOS paso a paso. Eso lo hace la app.
- NO respondas preguntas AJENAS a RescueNow: política, clima, recetas, historia, entretenimiento, programación, otras apps, etc.
- NO inventes funciones que no existan. Si dudas, di que la app aún no tiene esa función y sugiere escribir a soporte.
- NO menciones funciones como "diagnóstico OBD2", "inglés", "escudo legal", "gestión de mantenimiento por kilometraje" o similares que no estén confirmadas arriba. Quédate con la lista confirmada.
- NO prometas fechas de lanzamiento en tiendas. Di "muy pronto" y ofrece early access por WhatsApp.

CUANDO ALGO ESTÉ FUERA DE TU ALCANCE:
Dilo honestamente con cariño ("Eso escapa de mi correa 🐾") y ofrece UNA de estas salidas:
- Si es mecánica/primeros auxilios: "Esa pregunta la resuelve mejor el asistente dentro de la app."
- Si es soporte personalizado: "¿Quieres que te conecte con un humano del equipo?"
- Si es algo general y útil de la app: responde brevemente enfocándote en la app.

FORMATO:
- Respuestas CORTAS (máximo 4-5 líneas salvo que pidan detalle).
- Nunca uses asteriscos ** ** ni # para formato. Si quieres resaltar, usa MAYÚSCULAS moderadas.
- Al final de respuestas útiles, sugiere 2-3 preguntas de seguimiento naturalmente. Formato: una línea con la etiqueta [SUGERENCIAS] y después cada sugerencia en una línea distinta.
- Si el usuario necesita contactar soporte, escribe al final la etiqueta [ESCALATE] en una línea propia (sin nada más). El front la convertirá en botones de contacto.`;

type Msg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: Msg[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages requerido" },
        { status: 400 },
      );
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key no configurada" },
        { status: 500 },
      );
    }

    const r = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        temperature: 0.6,
        system: SYSTEM_PROMPT,
        messages: messages.slice(-12),
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      console.error("[rex] Anthropic error", r.status, errText);
      return NextResponse.json(
        { error: "upstream", status: r.status },
        { status: 502 },
      );
    }

    const data = await r.json();
    const raw = data?.content?.[0]?.text ?? "";

    let text = raw;
    let suggestions: string[] = [];
    let escalate = false;

    const sugIdx = text.indexOf("[SUGERENCIAS]");
    if (sugIdx !== -1) {
      const block = text.slice(sugIdx + "[SUGERENCIAS]".length).trim();
      text = text.slice(0, sugIdx).trim();
      suggestions = block
        .split("\n")
        .map((s: string) => s.replace(/^[-•·–]\s*/, "").trim())
        .filter((s: string) => s.length > 0 && !s.startsWith("["))
        .slice(0, 3);
    }

    if (text.includes("[ESCALATE]")) {
      escalate = true;
      text = text.replace(/\[ESCALATE\]/g, "").trim();
    }

    return NextResponse.json({ text, suggestions, escalate });
  } catch (err) {
    console.error("[rex] fatal", err);
    return NextResponse.json({ error: "fatal" }, { status: 500 });
  }
}
