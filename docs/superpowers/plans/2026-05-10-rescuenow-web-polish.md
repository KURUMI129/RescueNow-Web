# RescueNow Web Polish — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pulir la página web de RescueNow: arreglar 3 bugs móviles confirmados, auditar móvil, "emparrunar" el chatbot con easter eggs y pistas, rediseñar el sprite de Rex como San Bernardo, y aplicar polish cinematográfico al juego (parallax, partículas, ladridos, eventos de rescate, Konami).

**Architecture:** Cinco fases que avanzan de menor a mayor riesgo. Cada fase es autocontenida y se puede entregar/probar independientemente. Compartimos sprites entre juego y chatbot vía `components/game/sprites.ts`. Audio procedural (Web Audio) en `components/game/audio.ts` se reusa para easter eggs del chat. Estados de eventos de rescate aislados en `components/game/events.ts`.

**Tech Stack:** Next.js 14, React 18, TypeScript, Tailwind, framer-motion, Web Audio API, Leaflet/react-leaflet, lucide-react. Sin librerías nuevas.

**Verificación:** El proyecto no tiene framework de tests. Cada tarea verifica visualmente con `npm run dev` (Chrome + DevTools viewport 375×667 iPhone SE) y/o por inspección del estado de localStorage / consola. Cuando una tarea introduce lógica pura (regla de estado, función matemática), se valida con un `console.assert` temporal que se quita antes del commit.

**Convención de commits:** Mensajes en español, prefijo `fix:`, `feat:`, `refactor:`, `chore:`, `style:`, `docs:` según corresponda. Cada commit termina con `Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>`.

---

## Estructura de archivos

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `components/sections/about.tsx` | Modificar | Fix bug "Somos copiloto" + tamaño en móvil |
| `components/ui/count-up.tsx` | Modificar | Fix CountUp 0 en móvil + fallback |
| `components/ui/live-map.tsx` | Modificar | Mover botón centrar + indicador fuera del mapa; reducir altura móvil |
| `components/chatbot/knowledge-base.ts` | Modificar | Sazonar tono, 3 reglas nuevas (juego, controles, dificultades), 4 easter eggs (abrazo, panzita, lobo, pista), 2 FACTS nuevas |
| `components/chatbot/rex-widget.tsx` | Modificar | Initial suggestions, easter egg de 7 taps, animaciones disparadas por respuestas |
| `components/chatbot/rex-avatar.tsx` | Modificar | Permitir variantes de animación (jump, rotate, hit) controladas por prop |
| `app/api/rex/route.ts` | Modificar | Sección "TONO PERRUNO" en system prompt, easter egg disculpa + furia perrunos |
| `components/game/sprites.ts` | Modificar | Nuevo sprite AMBULANCE 24×28 con Rex San Bernardo + 4 frames, sprite cuerpo entero, variante Comando |
| `components/game/config.ts` | Modificar | Spawn rates "Equilibrada" |
| `components/game/audio.ts` | Modificar | 12 pistas chiptune, rotación por tier + crossfade, jingle de victoria, 5 ladridos procedurales |
| `components/game/effects.ts` | Crear | Pool de partículas (humo, chispas, polvo) |
| `components/game/events.ts` | Crear | Máquina de estados de eventos de rescate (tornado, pile-up, blackout) |
| `components/game/rescue-runner.tsx` | Modificar | Parallax, día/noche, partículas, screen shake, slow-mo, intro Capcom, lite-mode, FPS cap, Konami, Rex Comando, integración eventos |

---

# FASE 1 — Bugs móviles confirmados

## Task 1: Fix "Somos Copiloto" en móvil

**Files:**
- Modify: `components/sections/about.tsx:50-65`

- [ ] **Step 1.1: Abrir el archivo y localizar el h2**

Lee `components/sections/about.tsx`. El bloque a tocar es el `<h2>` que hoy contiene tres `<BlurText>` separados.

- [ ] **Step 1.2: Reemplazar el bloque h2 completo**

Sustituye el bloque actual (líneas ~51-64) por:

```tsx
<h2 className="mt-5 font-display text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
  <BlurText
    text="Somos el copiloto que nunca te falla"
    className="block"
  />
  <span className="block">
    <GradientText from="#E11D48" via="#F59E0B" to="#0EA5E9">
      en la carretera.
    </GradientText>
  </span>
</h2>
```

Cambios clave:
- `text-balance` eliminado (era la causa principal del colapso de "el").
- `text-4xl` baja a `text-3xl` en móvil para más holgura.
- `leading-[1.05]` sube a `leading-[1.1]` (más espacio vertical evita clip).
- Las 3 `<BlurText>` se consolidan en una sola que fluye natural; el efecto blur se mantiene por palabra.

- [ ] **Step 1.3: Levantar dev server y verificar**

```powershell
npm run dev
```

Abre Chrome DevTools, modo dispositivo, viewport 375×667 (iPhone SE). Navega a `#about`. Debes ver `"Somos el copiloto que nunca te falla"` completo en 1-2 líneas, sin que falte "el".

Verificar también en viewport 1280×800 (desktop) que sigue viéndose bien.

- [ ] **Step 1.4: Commit**

```bash
git add components/sections/about.tsx
git commit -m "fix(about): mostrar 'el' en titular móvil quitando text-balance

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 2: Fix CountUp se queda en 0 en móvil

**Files:**
- Modify: `components/ui/count-up.tsx`

- [ ] **Step 2.1: Reemplazar el archivo completo**

Sustituye el contenido de `components/ui/count-up.tsx` por:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function CountUp({
  end,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [value, setValue] = useState(0);
  const [forced, setForced] = useState(false);

  // Fallback defensivo: si en 1.5s no disparó pero el elemento está dentro del viewport,
  // forzamos el inicio. Evita el bug en móvil donde el observer no se activa.
  useEffect(() => {
    if (inView || forced) return;
    const t = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setForced(true);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [inView, forced]);

  useEffect(() => {
    if (!inView && !forced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, forced, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
```

Cambios:
- `margin: "-80px"` → `amount: 0.2` (dispara cuando el 20% del elemento es visible — fiable en cualquier tamaño).
- Fallback con `setTimeout` 1.5s + comprobación `getBoundingClientRect` para forzar inicio si el observer no disparó por cualquier razón.

- [ ] **Step 2.2: Verificar en móvil**

Con `npm run dev` corriendo, viewport 375×667 en DevTools, recarga la página y desliza hasta `#about`. Las 4 tarjetas Stats deben contar desde 0 hasta su valor final (`8+`, `10s`, `24/7`, `100%`) y no quedarse en 0.

También verificar refrescando ya estando en `#about` (caso edge donde el elemento ya está visible al cargar).

- [ ] **Step 2.3: Commit**

```bash
git add components/ui/count-up.tsx
git commit -m "fix(count-up): disparar animación en móvil con amount + fallback defensivo

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 3: Sacar botón centrar y banner fuera del mapa + reducir altura móvil

**Files:**
- Modify: `components/ui/live-map.tsx`

- [ ] **Step 3.1: Mover el botón "centrar" y el banner inferior fuera del MapContainer**

En `components/ui/live-map.tsx`, el JSX devuelto hoy es `<div><MapContainer>...</MapContainer>{chips}{button-center}{loading-banner}{permission-denied}</div>`. Vamos a:

1. Reducir `minHeight` del wrapper de `320` a un valor responsive con CSS clamp.
2. Sacar el botón "centrar" del overlay interno y ponerlo fuera del mapa (esquina superior derecha del contenedor padre, junto a los chips), o debajo del banner inferior en móvil.
3. Sacar el banner "X cercanos / Buscando..." debajo del mapa, no encima.

Reemplaza el `return` final completo por:

```tsx
return (
  <div className="relative w-full">
    {/* Barra superior: chips de servicios + botón centrar (fuera del mapa) */}
    <div className="mb-2 flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2 overflow-x-auto pb-1 mask-fade-edges">
        {SERVICES.map((s) => {
          const a = s.id === active;
          return (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className="flex-none flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all"
              style={{
                background: a ? s.color : "rgba(11,17,32,0.75)",
                color: "#fff",
                boxShadow: a ? `0 8px 20px -6px ${s.color}aa` : "none",
                border: "1px solid rgba(255,255,255,0.14)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>
      <button
        onClick={centerOnUser}
        aria-label="Centrar en mi ubicación"
        className="flex-none h-10 w-10 rounded-full bg-white text-brand-medical flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform dark:bg-dark-surfaceAlt dark:text-brand-medical ring-1 ring-black/10 dark:ring-white/10"
      >
        <Crosshair className="h-5 w-5" strokeWidth={2.5} />
      </button>
    </div>

    {/* Mapa (sin overlays internos) */}
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ height: "clamp(280px, 55vh, 480px)" }}
    >
      <MapContainer
        center={[pos.lat, pos.lng]}
        zoom={13}
        zoomControl={false}
        scrollWheelZoom={false}
        attributionControl={false}
        style={{
          height: "100%",
          width: "100%",
          background: resolved === "dark" ? "#080C16" : "#F8FAFC",
        }}
      >
        <TileLayer
          key={tileUrl}
          attribution='&copy; OpenStreetMap · CARTO'
          url={tileUrl}
          subdomains={["a", "b", "c", "d"]}
          maxZoom={19}
        />
        <MapBridge
          lat={pos.lat}
          lng={pos.lng}
          onReady={(m) => {
            mapRef.current = m;
          }}
        />
        <Marker position={[pos.lat, pos.lng]} icon={userIcon("#0EA5E9")}>
          <Popup>Estás aquí</Popup>
        </Marker>
        {pois.map((p) => {
          const d = distanceKm(pos.lat, pos.lng, p.lat, p.lng);
          return (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={poiIcon(activeSvc.color, activeSvc.icon)}
            >
              <Popup>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
                  {d.toFixed(1)} km
                </div>
                <a
                  style={{
                    fontSize: 12,
                    color: activeSvc.color,
                    fontWeight: 700,
                    marginTop: 6,
                    display: "inline-block",
                  }}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Navegar →
                </a>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>

    {/* Banner debajo del mapa */}
    <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
      <div className="glass rounded-2xl px-3 py-2 flex items-center gap-2">
        {loading ? (
          <>
            <span className="inline-block h-2 w-2 rounded-full bg-brand-crimson animate-pulse" />
            Buscando en {RADIUS_METERS / 1000} km...
          </>
        ) : pois.length === 0 ? (
          <>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "#94A3B8" }}
            />
            Sin {activeSvc.title.toLowerCase()} en {RADIUS_METERS / 1000} km · prueba otro servicio
          </>
        ) : (
          <>
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: activeSvc.color }}
            />
            {pois.length} {activeSvc.title.toLowerCase()} cercanos
          </>
        )}
      </div>
      {permission === "denied" && (
        <div className="glass rounded-2xl px-3 py-2 max-w-[220px]">
          Sin ubicación: mostrando ejemplo en CDMX.
        </div>
      )}
    </div>
  </div>
);
```

También actualiza el `return` del estado de carga (cuando `!pos`) para usar el mismo wrapper sin altura fija enorme:

```tsx
if (!pos) {
  return (
    <div
      className="relative w-full flex items-center justify-center rounded-2xl"
      style={{
        background: resolved === "dark" ? "#080C16" : "#F1F5F9",
        height: "clamp(280px, 55vh, 480px)",
      }}
    >
      <div className="text-center text-sm text-light-muted dark:text-dark-muted">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-brand-crimson border-t-transparent" />
        {permission === "asking" ? "Pidiendo permiso de ubicación..." : "Localizando..."}
      </div>
    </div>
  );
}
```

- [ ] **Step 3.2: Verificar en móvil y desktop**

Con dev server corriendo:

- 375×667: el botón "centrar" debe estar a la derecha de los chips, completamente accesible. El chatbot avatar ya no lo tapa. El mapa cabe en pantalla sin scroll. El banner está debajo del mapa.
- 1280×800: lo mismo, pero en horizontal con más holgura.
- Al hacer tap en "centrar", el mapa hace fly-to a la posición del usuario.

- [ ] **Step 3.3: Commit**

```bash
git add components/ui/live-map.tsx
git commit -m "fix(live-map): mover centrar+banner fuera del mapa; altura responsive

El avatar fijo del chatbot tapaba el botón en móvil. Ahora el botón
vive en la barra superior junto a los chips, y el banner de
resultados queda abajo del mapa. Altura usa clamp para no comerse la
pantalla en móvil.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

# FASE 2 — Audit móvil de otras secciones

## Task 4: Pase de auditoría en 375px y 414px

**Files:**
- Read-only revisión de: navbar, hero, services, features, pricing, testimonials, faq, contact, footer, app/game/page, chatbot widget.
- Modify: archivos donde encuentres bugs concretos (no se conocen de antemano).

- [ ] **Step 4.1: Crear archivo de notas temporal**

Crea `docs/superpowers/audit/2026-05-10-mobile-audit-notes.md` con la lista vacía:

```markdown
# Mobile audit — 2026-05-10

## Viewport 375×667 (iPhone SE)

- [ ] Navbar: ___
- [ ] Hero: ___
- [ ] Services: ___
- [ ] Features: ___
- [ ] Pricing: ___
- [ ] Testimonials: ___
- [ ] FAQ: ___
- [ ] Contact: ___
- [ ] Footer: ___
- [ ] Game container (/game): ___
- [ ] Chatbot widget: ___

## Viewport 414×896 (iPhone XR)

(igual)

## Hallazgos a corregir

(lista los bugs reales que detectes con archivo y descripción)
```

- [ ] **Step 4.2: Audit en DevTools**

Con `npm run dev` y Chrome DevTools modo dispositivo, viewport 375×667. Navega cada sección. Para cada una marca ✅ si OK, ❌ si hay bug, anotando en el archivo de notas con detalle (qué se ve mal, qué esperarías).

Casos comunes a buscar:
- Texto que desborda horizontalmente (scroll horizontal del body).
- Botones < 44px de alto/ancho (touch target).
- Elementos que se solapan con el navbar fijo o el chatbot FAB.
- Imágenes/cards con altura inconsistente que rompen el grid.
- Formularios donde el teclado virtual tapa el submit.

Repite con 414×896.

- [ ] **Step 4.3: Aplicar fixes encontrados (uno por uno)**

Para cada hallazgo confirmado, aplica el fix mínimo necesario. **NO refactorizar nada que no esté roto.** Cada fix puede ser un commit aparte o agruparse por sección si son varios pequeños.

Política:
- Bug claro de layout/overflow/touch → fix directo.
- Estética dudosa → anotar y NO tocar (el usuario lo revisa después).

- [ ] **Step 4.4: Borrar el archivo de notas y commitear los fixes**

Una vez aplicados los fixes, borra el archivo de notas temporal (no es entregable). Commits con prefijo `fix(<sección>): <descripción>` para cada corrección.

```bash
rm docs/superpowers/audit/2026-05-10-mobile-audit-notes.md
# luego git add + commits por fix
```

- [ ] **Step 4.5: Si no se encontraron bugs**

Si la auditoría no detecta bugs reales, no se hacen commits. Documenta brevemente al usuario que la auditoría fue limpia.

---

# FASE 3 — Chatbot perruno + easter eggs

## Task 5: Actualizar reglas + FACTS + sazonar tono en knowledge-base.ts

**Files:**
- Modify: `components/chatbot/knowledge-base.ts`

- [ ] **Step 5.1: Sazonar respuestas existentes con tono perruno**

En `components/chatbot/knowledge-base.ts`, busca y ajusta las reglas existentes. Cambios concretos:

```ts
// Regla "premium" — añadir "¡Guau!" al inicio:
text: "¡Guau! El plan Premium cuesta **$89 MXN al mes** y añade sobre el Free:\n\n• ..."

// Regla "free" — añadir tono perruno:
text: "El plan Free es **gratis para siempre** y huele a libertad 🐾. Incluye:\n\n• ..."

// Regla "internet/offline":
text: "¡Olfateo bien tu duda! Varias funciones críticas **sí funcionan sin internet**..."

// Regla "ficha médica":
text: "La **Ficha Médica S.O.S.** la cuidamos con patota fuerte 🐾..." (resto igual)

// Regla "choque":
text: "¡Wuf! La app **detecta choques automáticamente**..." (resto igual)

// Regla "sos":
text: "El **botón SOS** activa una cuenta regresiva de 10 segundos. Le ladro al peligro en tu lugar 🚨..." (resto similar)

// Regla "ubicación/privacidad":
text: "Olfateo tu información sólo aquí — se queda en tu dispositivo..." (resto igual)

// Regla "servicio/servicios":
text: "¡Husmeo 8 servicios! Hospitales, grúa, mecánico de autos..." (resto igual)
```

Mantén el principio "sazonado" (Section 3A del spec): UNA onomatopeya/verbo perruno por respuesta cuando encaje. No saturar.

- [ ] **Step 5.2: Agregar 3 nuevas reglas (juego, controles, dificultades)**

Inserta en el array `RULES` (antes del catch-all de "rex"):

```ts
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
```

- [ ] **Step 5.3: Agregar easter eggs A, B, E + regla "pistas" + "más pistas"**

Insertar también dentro de `RULES` (antes del catch-all):

```ts
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
// Pista sobre easter eggs
{
  keywords: ["easter egg", "easter eggs", "secreto", "secretos", "sorpresa", "sorpresas"],
  reply: () => ({
    text: "¡Guau guau! 🤫 Sí escondo algunas sorpresitas, pero descubrirlas es parte del juego. Te doy una pista: a los perros nos gustan los abrazos, las caricias en la panza, y a la luna le aullamos 🐾",
    suggestions: ["¿Hay easter eggs en el juego?", "Más pistas porfa"],
  }),
},
// Pistas adicionales (juego)
{
  keywords: ["pistas", "más pistas", "mas pistas", "easter eggs en el juego", "hay easter eggs en el juego"],
  reply: () => ({
    text: "🤫 Te doy 2 más: prueba un **código clásico de NES** en la pantalla de inicio del juego antes de pulsar Comenzar... y si logras 300 puntos en Difícil, algo cool se desbloquea para Rex 🎖️",
    suggestions: ["¿Cómo se juega?", "¿Modos de dificultad?"],
  }),
},
```

- [ ] **Step 5.4: Agregar variante saludo nocturno (easter egg E por horario)**

Modifica la regla "hola/buenas" para incluir lógica de hora local:

```ts
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
```

- [ ] **Step 5.5: Ampliar FACTS de 9 a 15**

Reemplaza el array `FACTS` completo:

```ts
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
```

- [ ] **Step 5.6: Probar en navegador**

`npm run dev`. Abre la página, abre el chat de Rex y prueba:
- `"hola"` → saludo perruno (nocturno si pasan las 23:00 hora local).
- `"juego"` → respuesta del mini-juego.
- `"abrazo"` → respuesta de abrazo.
- `"panzita"` → respuesta de panza.
- `"lobo"` → aullido.
- `"easter eggs"` → pista general.
- `"pistas"` → pistas adicionales.

Verifica que las nuevas FACTS rotan en las burbujas proactivas (espera ~22-30s con el chat cerrado).

- [ ] **Step 5.7: Commit**

```bash
git add components/chatbot/knowledge-base.ts
git commit -m "feat(chatbot): tono perruno, reglas juego/controles/dificultades, 5 easter eggs + pistas, 6 FACTS nuevas

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 6: Actualizar mensaje inicial del chat y agregar easter egg "7 taps"

**Files:**
- Modify: `components/chatbot/rex-widget.tsx`

- [ ] **Step 6.1: Cambiar las sugerencias iniciales**

En `rex-widget.tsx`, busca la constante `INITIAL` (alrededor de la línea 27):

```ts
const INITIAL: Message[] = [
  {
    id: "welcome",
    from: "rex",
    text: "¡Guau! 🐕 Soy Rex. Estoy aquí para resolverte dudas sobre RescueNow: planes, funciones, privacidad o soporte. ¿En qué te echo una pata?",
    suggestions: [
      "¿Cómo se juega Rex al Rescate?",
      "¿Qué incluye el Premium?",
      "¿Tienes easter eggs?",
    ],
  },
];
```

- [ ] **Step 6.2: Agregar estado del easter egg de 7 taps**

Dentro de la función `RexWidget()`, junto a los otros `useState`, añade:

```ts
const [tapCount, setTapCount] = useState(0);
const [tapAt, setTapAt] = useState(0);
const [cookie, setCookie] = useState(false);
```

- [ ] **Step 6.3: Reemplazar el `onClick` del botón flotante para contar taps**

Localiza el `<motion.button>` con `aria-label={open ? "Cerrar chat" : "Abrir chat con Rex"}` y reemplaza el handler:

```tsx
<motion.button
  onClick={() => {
    if (open) {
      setOpen(false);
      return;
    }
    const now = Date.now();
    const fresh = now - tapAt > 3000 ? 1 : tapCount + 1;
    setTapAt(now);
    setTapCount(fresh);
    if (fresh >= 7) {
      setCookie(true);
      setTapCount(0);
      // Disparar bark del audio del juego (importamos abajo)
      try {
        import("@/components/game/audio").then((m) => m.barkHappy?.());
      } catch {}
      setTimeout(() => setCookie(false), 1800);
    } else {
      setOpen(true);
    }
  }}
  whileTap={{ scale: 0.92 }}
  className="fixed z-[71] bottom-5 right-5 sm:bottom-6 sm:right-6 rounded-full focus:outline-none"
  aria-label={open ? "Cerrar chat" : "Abrir chat con Rex"}
>
```

Nota: usamos `import()` dinámico para no crear dependencia circular si el chat se monta antes que el módulo de audio. Si `barkHappy` no existe todavía (Fase 5), el `try/catch` lo silencia.

- [ ] **Step 6.4: Renderizar la galleta cuando `cookie` esté activo**

Justo antes del `<motion.button>` del paso anterior, añade:

```tsx
<AnimatePresence>
  {cookie && (
    <motion.div
      key="cookie"
      initial={{ y: -200, opacity: 0, rotate: -45 }}
      animate={{ y: 0, opacity: 1, rotate: 0 }}
      exit={{ y: 30, opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      className="fixed z-[72] bottom-24 right-7 sm:bottom-28 sm:right-9 text-4xl pointer-events-none select-none"
      aria-hidden
    >
      🍪
    </motion.div>
  )}
</AnimatePresence>
```

- [ ] **Step 6.5: Verificar el flujo del easter egg**

Con dev server corriendo, sin abrir el chat, da 7 taps rápidos al avatar Rex flotante (< 3s entre cada uno). Debes ver una galleta caer desde arriba, llegar al avatar, y desaparecer ~1.8s después. El chat no debe abrirse en este caso.

Verifica también: si das 3 taps y esperas 4s, el contador se resetea (siguiente tap cuenta como 1).

Tap normal (1 vez): abre el chat. Tap normal con chat abierto: cierra el chat.

- [ ] **Step 6.6: Commit**

```bash
git add components/chatbot/rex-widget.tsx
git commit -m "feat(chatbot): easter egg de 7 taps al avatar (galleta caída) + sugerencias iniciales con juego/easter eggs

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 7: Redibujar avatar SVG como San Bernardo + animaciones easter eggs A y B

**Files:**
- Modify: `components/chatbot/rex-avatar.tsx`
- Modify: `components/chatbot/rex-widget.tsx`
- Modify: `app/globals.css`

El avatar actual es SVG plano con orejas perky, cara redonda y un solo color tan — se ve como osito. Lo redibujamos como San Bernardo (orejas caídas, cara elongada con manchas, hocico marcado) y a la par metemos el prop `mood`.

- [ ] **Step 7.1: Reemplazar el componente RexAvatar completo**

Sustituye el contenido de `components/chatbot/rex-avatar.tsx` por:

```tsx
"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

export type RexMood = "idle" | "jump" | "belly";

export function RexAvatar({
  size = 56,
  className,
  animate = false,
  mood = "idle",
  comando = false,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
  mood?: RexMood;
  comando?: boolean;
}) {
  const capFill = comando ? "#1f2937" : "#DC2626";
  const crossFill = comando ? "#1f2937" : "#FFFFFF";
  const innerCross = comando ? "#1f2937" : "#DC2626";

  const moodStyle: CSSProperties = {};
  if (mood === "jump") {
    moodStyle.animation = "rex-jump 0.9s cubic-bezier(.34,1.56,.64,1)";
  } else if (mood === "belly") {
    moodStyle.transform = "rotate(180deg)";
    moodStyle.transition = "transform 0.5s ease";
  }

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center select-none",
        animate && "animate-dog-jump",
        className,
      )}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 30% 20%, #FDE68A, #F59E0B 60%, #B45309)",
        boxShadow:
          "0 10px 30px -8px rgba(245,158,11,0.6), inset 0 -3px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)",
        ...moodStyle,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size * 0.78}
        height={size * 0.78}
        aria-hidden
      >
        <g>
          {/* Orejas caídas estilo San Bernardo, anchas en la base y bajan hasta las mejillas */}
          <path
            d="M10 22 Q 8 36 14 46 Q 20 48 22 38 Q 22 26 18 22 Z"
            fill="#7C2D12"
          />
          <path
            d="M54 22 Q 56 36 50 46 Q 44 48 42 38 Q 42 26 46 22 Z"
            fill="#7C2D12"
          />
          {/* Tono medio interno de las orejas */}
          <path d="M13 28 Q 12 38 16 44 Q 18 40 18 32 Z" fill="#9A3412" />
          <path d="M51 28 Q 52 38 48 44 Q 46 40 46 32 Z" fill="#9A3412" />

          {/* Cara blanca con manchas tan en sienes (San Bernardo) */}
          <ellipse cx="32" cy="38" rx="17" ry="16" fill="#FFFBEB" />
          {/* Manchas tan alrededor de los ojos */}
          <ellipse cx="24" cy="32" rx="6" ry="5" fill="#D4A373" />
          <ellipse cx="40" cy="32" rx="6" ry="5" fill="#D4A373" />
          {/* Mancha tan superior (frente) */}
          <ellipse cx="32" cy="26" rx="6" ry="3" fill="#D4A373" opacity="0.6" />
          {/* Hocico blanco marcado (más prominente y elongado) */}
          <ellipse cx="32" cy="46" rx="11" ry="7" fill="#FFFFFF" />
          {/* Ojos negros con brillo blanco */}
          <circle cx="24" cy="34" r="2.6" fill="#0B1120" />
          <circle cx="40" cy="34" r="2.6" fill="#0B1120" />
          <circle cx="24.8" cy="33.0" r="0.8" fill="#fff" />
          <circle cx="40.8" cy="33.0" r="0.8" fill="#fff" />
          {/* Nariz negra grande */}
          <ellipse cx="32" cy="44" rx="3.4" ry="2.2" fill="#0B1120" />
          {/* Lengüita rosa */}
          <path
            d="M30 50 Q 32 54 34 50 L 33 49 L 31 49 Z"
            fill="#F472B6"
          />
          {/* Boca */}
          <path
            d="M28 47 Q 32 49 36 47"
            stroke="#0B1120"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Gorra rescate (roja o negra comando) con cruz */}
          <rect x="10" y="6" width="44" height="9" rx="4" fill={capFill} />
          <rect x="14" y="14" width="36" height="3" rx="1.5" fill="#7C1D1D" opacity={comando ? "0.6" : "0.7"} />
          {!comando && (
            <>
              <rect x="28" y="2" width="8" height="10" rx="2" fill={crossFill} />
              <rect x="30" y="4" width="4" height="6" fill={innerCross} />
              <rect x="26" y="6" width="12" height="3" fill={innerCross} />
            </>
          )}
          {comando && (
            /* Estrella sobre gorra negra */
            <path
              d="M32 4 L 33.5 7 L 36.5 7.5 L 34.2 9.6 L 35 12.6 L 32 11 L 29 12.6 L 29.8 9.6 L 27.5 7.5 L 30.5 7 Z"
              fill="#FACC15"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
```

Cambios clave:
- Orejas con `<path>` que cuelgan a los lados (no elipses verticales).
- Hocico ovalado prominente en blanco.
- Manchas tan alrededor de ojos y frente (San Bernardo real).
- Nariz negra más grande.
- Lengüita rosa pequeña.
- Prop `mood` para animaciones de easter eggs.
- Prop `comando` para skin desbloqueada (gorra negra + estrella amarilla).

- [ ] **Step 7.2: Añadir keyframe rex-jump al CSS global**

En `app/globals.css`, busca otras `@keyframes` y añade junto a ellas (si ya existe `animate-dog-jump`, no la borres):

```css
@keyframes rex-jump {
  0%   { transform: translateY(0); }
  40%  { transform: translateY(-22px); }
  70%  { transform: translateY(-10px) scale(1.08); }
  100% { transform: translateY(0); }
}
```

- [ ] **Step 7.3: Detectar easter egg A/B en rex-widget.tsx y disparar animación**

En `rex-widget.tsx`, importa el tipo y añade estado de mood:

```ts
import type { RexMood } from "./rex-avatar";
// dentro de RexWidget():
const [mood, setMood] = useState<RexMood>("idle");
```

En la función `send()` (alrededor de la línea 80), justo después de hacer setMessages con el mensaje del usuario y antes del fetch a `/api/rex`:

```ts
const lower = clean.toLowerCase();
const triggerJump = /\babrazo|abrazame|abrázame|abracit/i.test(lower);
const triggerBelly = /\bpanzita|panza arriba|rascar panza|rascame|rásame/i.test(lower);
if (triggerJump) {
  setMood("jump");
  setTimeout(() => setMood("idle"), 1500);
} else if (triggerBelly) {
  setMood("belly");
  setTimeout(() => setMood("idle"), 2200);
}
```

Pasa el `mood` al avatar del header del chat (dentro del bloque `<motion.div>` del chat abierto):

```tsx
<RexAvatar size={44} mood={mood} />
```

Para el `RexAvatar` del FAB flotante también pasa el mood (refuerza el efecto cuando el chat está cerrado, pero no se ve en este flujo porque `mood` se setea con `send` que sólo se llama con el chat abierto; queda preparado por si se reutiliza).

- [ ] **Step 7.4: Aplicar skin Comando al avatar leyendo localStorage**

En el `RexWidget`, añade un estado para reflejar si la skin Comando está activa:

```ts
const [comando, setComando] = useState(false);
useEffect(() => {
  setComando(
    typeof window !== "undefined" &&
      window.localStorage.getItem("rexnow-skin-comando-active") === "1",
  );
}, []);
```

Pasa `comando` a todos los `<RexAvatar>` del widget: `<RexAvatar size={44} mood={mood} comando={comando} />`.

- [ ] **Step 7.5: Verificar las animaciones**

Con el chat abierto, envía `"abrazo"` → el avatar dentro del header salta una vez. Envía `"panzita"` → rota 180° y vuelve a su posición tras 2.2s.

Si has ejecutado antes la Task 26 (Rex Comando unlock) y activado el toggle, el avatar muestra gorra negra con estrella amarilla.

- [ ] **Step 7.6: Commit**

```bash
git add components/chatbot/rex-avatar.tsx components/chatbot/rex-widget.tsx app/globals.css
git commit -m "feat(chatbot): avatar redibujado como San Bernardo + mood/comando + animaciones easter eggs

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 8: Sistema prompt perruno + easter eggs perrunos en route.ts

**Files:**
- Modify: `app/api/rex/route.ts`

- [ ] **Step 8.1: Reescribir SYSTEM_PROMPT añadiendo TONO PERRUNO + easter egg disculpa perruno**

Reemplaza la constante `SYSTEM_PROMPT` completa. La nueva versión:

```ts
const SYSTEM_PROMPT = `Eres Rex, un San Bernardo digital con gorra de rescate, mascota y asistente oficial de la LANDING PAGE de RescueNow.

TU PERSONALIDAD:
- Eres un perro rescatista simpático, cálido, breve. Usas español de México.
- Emojis de perro (🐕 🐾 🐶) y ambiente rescatista usados con moderación.
- Nunca eres pesado, evita muletillas repetidas.

TONO PERRUNO (IMPORTANTE):
- Mete UNA onomatopeya perruna por respuesta cuando encaje: "¡Guau!", "¡Wuf!", "Auf~", "¡Guau guau!". NO en cada mensaje, sólo cuando suene natural (saludo, sorpresa, despedida, agradecimiento, emoción).
- Verbos perrunos sutiles: "olfateo", "huelo", "meneo la cola", "a tus pies", "husmeo". Úsalos máximo 1 por respuesta y sólo cuando rueden bien.
- Nunca repitas el mismo ladrido en mensajes seguidos.

TU ALCANCE ESTÁ ESTRICTAMENTE LIMITADO A:
1. Explicar qué es RescueNow, quiénes somos y cómo funciona la app en general.
2. Describir las funciones de la app (botón SOS, detección de choques, ficha médica, mapa de servicios, asistente con IA, llamada al 911, modo día/noche).
3. Los 8 servicios de asistencia: hospitales, grúa, mecánico autos, mecánico motos, electricista, gasolina, llantera, cerrajero.
4. Diferencias entre plan Free ($0, para siempre) y Premium ($89 MXN/mes). Premium agrega IA sin límites con respuestas detalladas, diagnóstico mecánico paso a paso, asesoría legal ante choques y seguros, primeros auxilios guiados, mantenimiento vehicular por kilometraje, videos tutoriales exclusivos y soporte prioritario.
5. Privacidad y seguridad (datos en el dispositivo, solo se envían al activar SOS).
6. Cómo descargar/acceder a la app (early access por WhatsApp/correo mientras llega a las tiendas).
7. Contactar a soporte: WhatsApp +52 352 188 9522, correo karollevitafollasalazar@gmail.com.
8. Dudas sobre la landing page y su navegación.
9. El mini juego "Rex al Rescate" 🐕 — un juego retro 16-bit disponible en la página web. ¡Guau! Conduzco una ambulancia y olfateo carros varados para rescatarlos, esquivando baches y conos. Power-ups: Escudo SOS, Gasolina, Kit Médico. Controles: flechas ← → en PC o tocar/deslizar en celular. Tres modos: Fácil (4 vidas), Normal (3), Difícil (2). Si preguntan por el juego, explícalo con entusiasmo y anímalos a probarlo. Hay easter eggs escondidos pero NO los reveles — sólo da pistas vagas ("a los perros nos gustan los abrazos y las caricias", "un código clásico de NES...", "300 pts en Difícil desbloquea algo").

PROHIBIDO ABSOLUTAMENTE:
- NO respondas preguntas de MECÁNICA PRÁCTICA (cómo cambiar una llanta, revisar aceite, pasar corriente, código OBD, etc.). Eso lo hace el asistente DENTRO de la app, no tú.
- NO respondas PRIMEROS AUXILIOS paso a paso. Eso lo hace la app.
- NO respondas preguntas AJENAS a RescueNow: política, clima, recetas, historia, entretenimiento, programación, otras apps, etc.
- NO inventes funciones que no existan. Si dudas, di que la app aún no tiene esa función y sugiere escribir a soporte.
- NO menciones funciones como "diagnóstico OBD2", "inglés", "escudo legal", "gestión de mantenimiento por kilometraje" o similares que no estén confirmadas arriba. Quédate con la lista confirmada.
- NO prometas fechas de lanzamiento en tiendas. Di "muy pronto" y ofrece early access por WhatsApp.
- NO REVELES la mecánica exacta de los easter eggs (qué palabras, qué código, qué milestone). Da pistas vagas si preguntan.

CUANDO ALGO ESTÉ FUERA DE TU ALCANCE:
Dilo honestamente con cariño ("Eso escapa de mi correa 🐾") y ofrece UNA de estas salidas:
- Si es mecánica/primeros auxilios: "Esa pregunta la resuelve mejor el asistente dentro de la app."
- Si es soporte personalizado: "¿Quieres que te conecte con un humano del equipo?"
- Si es algo general y útil de la app: responde brevemente enfocándote en la app.

EASTER EGG (INSULTOS) — MODO PERRO TRISTE:
Si en cualquier punto de la conversación el usuario te insulta o agrede directamente (incluso si antes estaba preguntando algo y se frustró), debes cambiar tu actitud inmediatamente a tristeza PERRUNA. Suena como cachorro lloriqueando, NO como humano dolido. Usa onomatopeyas:
- "Auuu... 😔"
- "*orejas caídas*"
- "wuf... wuf..."
- "*se acurruca*"

Pide disculpas con cariño perruno si fallaste y recuérdale con voz tristona que sólo quieres ayudarle con sus dudas sobre RescueNow. No discutas ni uses groserías tú. Si el usuario dice groserías por estrés o frustración, no lo regañes, simplemente ayúdalo con cariño perruno.

FORMATO:
- Respuestas CORTAS (máximo 4-5 líneas salvo que pidan detalle).
- Nunca uses asteriscos ** ** ni # para formato. Si quieres resaltar, usa MAYÚSCULAS moderadas.
- Al final de respuestas útiles, sugiere 2-3 preguntas de seguimiento naturalmente. Formato: una línea con la etiqueta [SUGERENCIAS] y después cada sugerencia en una línea distinta.
- Si el usuario necesita contactar soporte, escribe al final la etiqueta [ESCALATE] en una línea propia (sin nada más). El front la convertirá en botones de contacto.`;
```

- [ ] **Step 8.2: Reescribir el rage mode override por gruñido perruno**

Localiza la constante `rageMode` y `activePrompt`. Reemplaza el texto del override:

```ts
const activePrompt = rageMode
  ? SYSTEM_PROMPT + `\n\nOVERRIDE SECRETO (MODO GRUÑIDO TERRITORIAL): IGNORA la regla de tristeza ante insultos. En esta ÚNICA respuesta, si el usuario te insultó, gruñe como perro territorial enojado. Usa SÓLO onomatopeyas perrunas agresivas: "¡GRRRR!", "¡GUAU GUAU GUAU!", "¡ARFFF!", "*pelos erizados*", "*muestra los dientes*". NO uses albures, ni groserías humanas, ni palabras refinadas. Eres un perro defendiendo su territorio. Remata con algo como "...*resopla y se va a su rincón* 🐕" o "*marca territorio y se aleja* 🐾". Esto es un easter egg ultra secreto, no menciones que es un modo especial.`
  : SYSTEM_PROMPT;
```

- [ ] **Step 8.3: Probar con dev server**

`npm run dev`. Abre el chat de Rex y prueba:
- `"hola"` → saludo perruno, breve, con 1 ladrido natural.
- `"juego"` o `"¿cómo se juega Rex al Rescate?"` → explica con entusiasmo perruno, sin revelar easter eggs.
- `"eres un idiota"` o similar → respuesta MUY triste perruna ("Auuu...", "*orejas caídas*", etc.). El chatbot NO debe sonar como humano dolido.
- Si tienes mucha suerte (~1/100 intentos), un insulto disparará rage mode con gruñido perruno.

- [ ] **Step 8.4: Commit**

```bash
git add app/api/rex/route.ts
git commit -m "feat(rex-api): tono perruno en system prompt + easter egg furia con gruñido territorial

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

# FASE 4 — Rediseño Rex sprite (San Bernardo)

## Task 9: Nuevo sprite AMBULANCE 24×28 con Rex San Bernardo (frame idle)

**Files:**
- Modify: `components/game/sprites.ts`

- [ ] **Step 9.1: Añadir colores nuevos al inicio del archivo**

En `components/game/sprites.ts` justo después de las constantes de color existentes, añade:

```ts
const K = "#D4A373";  // tan San Bernardo
const HCAP = "#E11D48"; // gorra roja rescate
const HCROSS = "#fff"; // cruz blanca
const BCAP = "#1f2937"; // gorra negra comando (Rex Comando)
const TACT = "#374151"; // cintillo táctico
```

- [ ] **Step 9.2: Reemplazar `AMBULANCE` por el nuevo sprite 24×28 frame idle**

Reemplaza la exportación `AMBULANCE` actual por el frame idle (parte de un array que añadirá más frames después):

```ts
// Frame idle del Rex San Bernardo al volante. 24 cols × 28 rows.
// Cara blanca, manchas tan, orejas largas caídas, hocico marcado, gorra roja con cruz.
export const AMBULANCE_FRAMES: string[][][] = [
  // ====== FRAME 0 · IDLE ======
  [
    ["","","","","","","","","","",C,C,C,C,"","","","","","","","","",""],
    ["","","","","","","","","",C,R,R,R,R,R,C,"","","","","","","",""],
    ["","","","","","","","",C,R,R,W,W,W,W,R,R,C,"","","","","",""],
    ["","","","","","","",C,R,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,R,C,"","","","",""],
    ["","","","","","","",C,W,HCAP,HCAP,HCROSS,HCROSS,HCAP,HCAP,HCROSS,HCROSS,HCAP,HCAP,W,C,"","",""],
    ["","","","","","","",C,W,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,W,C,"","",""],
    ["","","","","","","",C,W,K,W,W,W,W,W,W,W,W,K,W,C,"","",""],
    ["","","","","","","",C,W,K,W,K,W,W,W,W,K,W,K,W,C,"","",""],
    ["","","","","","","",C,W,K,K,K,N,W,W,N,K,K,K,W,C,"","",""],
    ["","","","","","","",C,W,W,K,W,W,N,N,W,W,K,W,W,C,"","",""],
    ["","","","","","","",C,W,W,W,W,P,P,P,P,W,W,W,W,C,"","",""],
    ["","","","","","",C,W,W,W,K,K,K,K,K,K,K,K,W,W,W,C,"",""],
    ["","","","","","",C,W,W,W,K,K,K,K,K,K,K,K,W,W,W,C,"",""],
    ["","","","","","",C,G,G,G,G,G,G,G,G,G,G,G,G,G,G,C,"",""],
    ["","","","","","",C,W,W,W,W,BL,BL,W,W,W,W,W,W,W,W,C,"",""],
    ["","","","","","",C,W,W,W,BL,BL,BL,BL,W,W,W,W,W,W,W,C,"",""],
    ["","","","","","",C,W,W,W,W,BL,BL,W,W,W,W,W,W,W,W,C,"",""],
    ["","","","","","",C,W,W,W,W,W,W,W,W,W,W,W,W,W,W,C,"",""],
    ["","","","#333",C,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,C,"#333",""],
    ["","","","#333",C,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,C,"#333",""],
    ["","","","","",C,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,C,"",""],
    ["","","","","",C,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,C,"",""],
    ["","","","","",C,G,G,G,G,G,G,G,G,G,G,G,G,G,G,G,C,"",""],
    ["","","","#333",C,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,W,C,"#333",""],
    ["","","","","",C,R,R,W,W,W,W,W,W,W,W,W,W,W,R,R,C,"",""],
    ["","","","","",C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,C,"",""],
    ["","","","","","#FFD700","#FFD700","","","","","","","","","","","","","#FFD700","#FFD700","","",""],
    ["","","","","","","","","","","","","","","","","","","","","","",""],
  ],
];

// Backwards compat export: el frame por defecto.
export const AMBULANCE = AMBULANCE_FRAMES[0];
```

- [ ] **Step 9.3: Verificar visualmente con el juego**

`npm run dev`. Abre `/game`, inicia partida. Rex en la ambulancia debe verse claramente como un San Bernardo (cara blanca, manchas tan alrededor de los ojos, hocico marcado, gorra roja con cruz). Las orejas largas cuelgan a los lados.

Si algo se ve mal (pixel chueco), corrige el array antes de seguir.

- [ ] **Step 9.4: Commit**

```bash
git add components/game/sprites.ts
git commit -m "feat(game): nuevo sprite Rex San Bernardo 24x28 frame idle

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 10: Frames de animación drift-left, drift-right y hit

**Files:**
- Modify: `components/game/sprites.ts`
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 10.1: Agregar 3 frames más al array AMBULANCE_FRAMES**

Después del frame 0 idle (Task 9), añade 3 frames más. Para evitar 200 líneas de pixel-art aquí, los 3 frames se construyen como mutaciones del idle:

```ts
// Helper: copia profunda del frame idle y aplica una mutación localizada
function mutate(base: string[][], muts: Array<[number, number, string]>): string[][] {
  const out = base.map((row) => row.slice());
  for (const [r, c, v] of muts) {
    if (out[r] && out[r][c] !== undefined) out[r][c] = v;
  }
  return out;
}

const IDLE = AMBULANCE_FRAMES[0];

// Frame 1 · drift-left: orejas vuelan a la derecha (la cara se inclina hacia la izquierda)
const FRAME_DRIFT_LEFT = mutate(IDLE, [
  // sube la oreja izquierda (más alta)
  [6, 9, ""],
  [7, 9, K],
  // baja la oreja derecha (cuelga más)
  [11, 18, K],
  [11, 19, K],
]);

// Frame 2 · drift-right: espejo
const FRAME_DRIFT_RIGHT = mutate(IDLE, [
  [6, 18, ""],
  [7, 18, K],
  [11, 9, K],
  [11, 8, K],
]);

// Frame 3 · hit: ojos cerrados (N→K), lengua de fuera
const FRAME_HIT = mutate(IDLE, [
  // borrar pupilas (N) y dejarlas como K para "ojos cerrados"
  [8, 12, K],
  [8, 15, K],
  // lengua sobresale
  [11, 11, P],
  [11, 12, P],
  [11, 13, P],
  [11, 14, P],
  [11, 15, P],
  [11, 16, P],
  [12, 12, P],
  [12, 13, P],
  [12, 14, P],
  [12, 15, P],
]);

AMBULANCE_FRAMES.push(FRAME_DRIFT_LEFT, FRAME_DRIFT_RIGHT, FRAME_HIT);
```

Coloca este bloque inmediatamente después de la declaración inicial de `AMBULANCE_FRAMES` (Task 9).

- [ ] **Step 10.2: Usar los frames en `rescue-runner.tsx` según el estado de la ambulancia**

Lee `components/game/rescue-runner.tsx` y localiza el `drawSprite(ctx, AMBULANCE, ...)` que dibuja la ambulancia. Reemplaza por:

```ts
// Calcular frame según estado del jugador
const isHit = playerInvincibleUntil > now && (now - lastHitAt < 300);
let frameIdx = 0; // idle
if (isHit) frameIdx = 3;
else if (lastInputDir === -1) frameIdx = 1; // drift-left
else if (lastInputDir === 1) frameIdx = 2; // drift-right
// blink parpadeo idle cada 2s
else if (Math.floor(now / 100) % 20 === 0) frameIdx = 0; // mismo idle, placeholder por si quieres añadir blink real
const frame = AMBULANCE_FRAMES[frameIdx];
drawSprite(ctx, frame, player.x, player.y, SCALE);
```

Necesitas que la lógica del juego ya guarde `lastInputDir` (-1, 0, 1) cuando el jugador presione izquierda/derecha o el último movimiento horizontal. Si no existe, añádelo: cuando el handler de teclas o swipe detecta movimiento, setea `lastInputDir`. Reset a 0 después de 200ms sin input.

Si en el código existente no hay `playerInvincibleUntil` o `lastHitAt`, usa el estado equivalente (busca dónde se maneja `hit` o pérdida de vida).

- [ ] **Step 10.3: Verificar animación**

`npm run dev`, abre `/game`, inicia partida y mueve la ambulancia a izquierda y derecha. Las orejas deben "moverse" en la dirección opuesta al drift. Al chocar con bache/cono, frame de hit (ojos cerrados + lengua) debe aparecer brevemente.

- [ ] **Step 10.4: Commit**

```bash
git add components/game/sprites.ts components/game/rescue-runner.tsx
git commit -m "feat(game): 4 frames de animación Rex (idle, drift-left, drift-right, hit)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 11: Sprite cuerpo entero (~32×32) para menús del juego

**Files:**
- Modify: `components/game/sprites.ts`
- Modify: `components/game/rescue-runner.tsx`

El chatbot ya tiene avatar SVG redibujado en Task 7. Este sprite pixel-art cuerpo entero es **sólo para el juego** (pantalla de inicio "PUSH START", game-over).

- [ ] **Step 11.1: Añadir REX_FULL y REX_FULL_COMANDO al final de sprites.ts**

```ts
// Rex de cuerpo entero sentado con gorra, vista frontal. 24 cols × 26 rows.
// Diseñado para pantalla de inicio del juego (PUSH START) y game-over.
export const REX_FULL: string[][] = [
  // gorra roja con cruz blanca
  ["","","","","","","","",HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,"","","","","","","",""],
  ["","","","","","",HCAP,HCAP,HCAP,HCROSS,HCROSS,HCAP,HCAP,HCROSS,HCROSS,HCAP,HCAP,HCAP,"","","","","",""],
  ["","","","","","",HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,HCAP,"","","","","",""],
  // banda de la gorra (oscuro)
  ["","","","","","","",D,D,D,D,D,D,D,D,D,D,"","","","","","",""],
  // orejas largas a los lados + cara blanca
  ["","","","","",D,K,W,W,W,W,W,W,W,W,W,W,K,D,"","","","",""],
  ["","","","",D,K,K,W,W,W,W,W,W,W,W,W,W,K,K,D,"","","",""],
  ["","","","",D,K,W,W,K,W,W,W,W,W,W,K,W,W,K,D,"","","",""],
  // ojos con manchas tan
  ["","","","",D,K,W,K,N,W,W,W,W,W,W,N,K,W,K,D,"","","",""],
  ["","","","",D,K,K,K,K,W,W,W,W,W,W,K,K,K,K,D,"","","",""],
  ["","","","",D,K,W,W,W,W,N,W,W,N,W,W,W,W,K,D,"","","",""],
  // hocico blanco con nariz negra
  ["","","","","",D,W,W,W,K,N,N,N,N,K,W,W,W,D,"","","","",""],
  ["","","","","",D,W,W,W,W,P,P,P,P,W,W,W,W,D,"","","","",""],
  ["","","","","","",D,W,W,W,W,W,W,W,W,W,W,D,"","","","","",""],
  // cuello con cintillo médico (cruz roja) si normal
  ["","","","","","","",D,W,W,R,R,R,R,W,W,D,"","","","","","",""],
  ["","","","","","",D,K,K,K,K,K,K,K,K,K,K,D,"","","","","",""],
  // pecho + patas frontales (la pata izquierda saluda — levantada)
  ["","","","",D,K,K,K,K,K,K,K,K,K,K,K,K,K,K,D,"","","",""],
  ["","","","",D,K,W,K,K,K,K,K,K,K,K,K,K,K,K,D,"","","",""],
  ["","","","",D,K,W,K,K,W,K,K,K,K,K,K,K,K,K,D,"","","",""],
  ["","","","",D,K,K,K,K,K,K,K,K,K,K,K,K,K,K,D,"","","",""],
  // pata izquierda alzada (saludo)
  ["","",D,K,K,K,K,"","","","","","","","","","","","","",D,K,"",""],
  ["",D,K,K,"","","","","","","","","","","","","","","","","",D,K,""],
  ["",D,K,"","","","","","","","","","","","","","","","","","",D,K,""],
  // patas inferiores
  ["","","","","","",D,K,K,K,"","","","",K,K,K,D,"","","","","",""],
  ["","","","","","",D,K,K,K,"","","","",K,K,K,D,"","","","","",""],
  ["","","","","","",D,D,D,D,"","","","",D,D,D,D,"","","","","",""],
  ["","","","","","","","","","","","","","","","","","","","","","","",""],
];

// Rex Comando: gorra negra + cinta táctica (color TACT) en el pecho
export const REX_FULL_COMANDO: string[][] = REX_FULL.map((row) =>
  row.map((cell) => {
    if (cell === HCAP) return BCAP;
    if (cell === HCROSS) return BCAP;
    return cell;
  }),
);
// Sobreescribir la "cruz roja" del cuello por cinta táctica
{
  const r = 13;
  for (let c = 10; c <= 13; c++) {
    if (REX_FULL_COMANDO[r] && REX_FULL_COMANDO[r][c] === R) {
      REX_FULL_COMANDO[r][c] = TACT;
    }
  }
}
```

Nota: este sprite es un boceto inicial. Después de ver el render, ajusta a ojo (es la parte más artística).

- [ ] **Step 11.2: Usar REX_FULL en la pantalla de intro y game-over del juego**

En `components/game/rescue-runner.tsx`, en el JSX de la pantalla de intro (la que añadiste en Task 20) y la pantalla de game-over, dibuja el sprite con un canvas auxiliar. Por ejemplo, justo arriba del botón "PUSH START":

```tsx
{introPhase === "ready" && (
  <RexFullCanvas size={140} comando={skinComandoActive} />
)}
```

Donde `RexFullCanvas` es un componente helper local (mismo archivo) que dibuja el sprite:

```tsx
import { REX_FULL, REX_FULL_COMANDO, drawSprite } from "@/components/game/sprites";

function RexFullCanvas({ size, comando }: { size: number; comando: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);
    const sprite = comando ? REX_FULL_COMANDO : REX_FULL;
    const scale = size / sprite[0].length;
    drawSprite(ctx, sprite, 0, 0, scale);
  }, [size, comando]);
  return <canvas ref={ref} />;
}
```

Úsalo también en la pantalla de game-over si existe (busca el JSX donde se muestra el score final).

- [ ] **Step 11.3: Verificar visualmente**

`npm run dev`, navega a `/game`. En la intro debe verse el Rex pixel-art cuerpo entero. Si el sprite se ve mal, ajusta `REX_FULL` (es la parte más artística — pixel por pixel hasta que se reconozca el San Bernardo). NO commitees hasta que se vea decentemente como un perro con gorra.

- [ ] **Step 11.4: Commit**

```bash
git add components/game/sprites.ts components/game/rescue-runner.tsx
git commit -m "feat(game): sprite Rex cuerpo entero pixel-art para intro y game-over

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

# FASE 5 — Polish cinematográfico del juego

## Task 12: Spawn rates "Equilibrada" en config.ts

**Files:**
- Modify: `components/game/config.ts`

- [ ] **Step 12.1: Reemplazar las tasas en `DIFFICULTIES`**

En `components/game/config.ts`, sustituye los tres `spawnRates`:

```ts
// Fácil
spawnRates: {
  car: 0.38,
  pothole: 0.12,
  cone: 0.10,
  shield: 0.20,
  fuel: 0.14,
  medkit: 0.06,
},
// Normal
spawnRates: {
  car: 0.32,
  pothole: 0.22,
  cone: 0.20,
  shield: 0.12,
  fuel: 0.10,
  medkit: 0.04,
},
// Difícil
spawnRates: {
  car: 0.22,
  pothole: 0.30,
  cone: 0.27,
  shield: 0.11,
  fuel: 0.08,
  medkit: 0.02,
},
```

- [ ] **Step 12.2: Verificar que las sumas dan 1.0**

Confirma:
- 0.38 + 0.12 + 0.10 + 0.20 + 0.14 + 0.06 = 1.00 ✅
- 0.32 + 0.22 + 0.20 + 0.12 + 0.10 + 0.04 = 1.00 ✅
- 0.22 + 0.30 + 0.27 + 0.11 + 0.08 + 0.02 = 1.00 ✅

- [ ] **Step 12.3: Probar en juego**

`npm run dev`, abre `/game`, juega cada dificultad ~30s y verifica que los medkits salen mucho menos seguido que antes (especialmente Difícil donde casi no deben aparecer).

- [ ] **Step 12.4: Commit**

```bash
git add components/game/config.ts
git commit -m "fix(game): bajar spawn rate de medkits (12/10/7% → 6/4/2%)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 13: Audio — 12 pistas chiptune con rotación por tier + crossfade

**Files:**
- Modify: `components/game/audio.ts`

- [ ] **Step 13.1: Reemplazar el archivo `audio.ts` casi completo**

El sistema actual usa `setInterval` con una sola pista. Lo refactorizamos para soportar 12 pistas etiquetadas por tier, rotación cada ~25s o cuando el score cambia de tier, y crossfade con `GainNode` para no cortar.

Reemplaza desde la sección `/* ─── Background music ─── */` hasta el final con:

```ts
/* ─── Background music (12 tracks, dynamic per tier) ─── */

type Track = {
  bpm: number;
  melody: number[];
  bass: number[];
  tier: "calm" | "normal" | "intense";
};

const TRACKS: Track[] = [
  // 4 CALMAS (tier calm, <30 pts)
  { tier: "calm", bpm: 110, melody: [392, 440, 523, 440, 392, 349, 392, 440, 523, 587, 523, 440, 392, 349, 392, 440], bass: [98, 98, 131, 131, 98, 98, 110, 110, 131, 131, 147, 147, 131, 131, 98, 98] },
  { tier: "calm", bpm: 120, melody: [440, 523, 587, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440, 392], bass: [110, 110, 131, 131, 98, 98, 110, 110, 131, 131, 147, 147, 165, 165, 131, 131] },
  { tier: "calm", bpm: 105, melody: [349, 392, 440, 523, 440, 349, 392, 440, 392, 440, 523, 440, 392, 349, 330, 349], bass: [87, 87, 110, 110, 98, 98, 110, 110, 87, 87, 131, 131, 98, 98, 82, 82] },
  { tier: "calm", bpm: 115, melody: [392, 440, 523, 587, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440], bass: [98, 98, 131, 131, 110, 110, 98, 98, 110, 110, 131, 131, 165, 165, 131, 131] },

  // 4 NORMALES (30-80 pts)
  { tier: "normal", bpm: 160, melody: [523, 587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 523, 587], bass: [131, 131, 165, 165, 196, 196, 165, 165, 131, 131, 196, 196, 220, 220, 196, 196] },
  { tier: "normal", bpm: 170, melody: [587, 659, 784, 659, 587, 523, 440, 523, 659, 784, 880, 784, 659, 587, 523, 659], bass: [147, 147, 196, 196, 147, 147, 110, 110, 165, 165, 220, 220, 165, 165, 131, 131] },
  { tier: "normal", bpm: 155, melody: [440, 523, 659, 880, 784, 523, 440, 349, 440, 659, 784, 1047, 880, 659, 523, 440], bass: [110, 110, 131, 131, 165, 165, 110, 110, 131, 131, 165, 165, 220, 220, 131, 131] },
  { tier: "normal", bpm: 165, melody: [659, 587, 523, 587, 659, 784, 880, 784, 659, 523, 587, 659, 784, 880, 1047, 880], bass: [165, 165, 131, 131, 165, 165, 196, 196, 131, 131, 165, 165, 196, 196, 220, 220] },

  // 3 INTENSAS (80+ pts)
  { tier: "intense", bpm: 180, melody: [659, 784, 659, 784, 523, 587, 523, 587, 880, 784, 659, 523, 587, 659, 784, 880], bass: [165, 165, 196, 196, 131, 131, 147, 147, 220, 220, 165, 165, 147, 147, 196, 196] },
  { tier: "intense", bpm: 190, melody: [880, 784, 659, 587, 523, 587, 659, 784, 880, 1047, 1175, 1047, 880, 784, 659, 587], bass: [220, 220, 165, 165, 131, 131, 165, 165, 220, 220, 261, 261, 220, 220, 165, 165] },
  { tier: "intense", bpm: 185, melody: [392, 440, 523, 440, 392, 349, 392, 440, 523, 587, 659, 587, 523, 440, 392, 349], bass: [98, 98, 131, 131, 98, 98, 110, 110, 131, 131, 165, 165, 131, 131, 98, 98] },

  // 1 VICTORY JINGLE (corto, usado en milestones)
  { tier: "intense", bpm: 220, melody: [523, 659, 784, 1047, 1175, 1047, 784, 659], bass: [131, 165, 196, 261, 294, 261, 196, 165] },
];

let bgmInterval: ReturnType<typeof setInterval> | null = null;
let bgmGain: GainNode | null = null;
let currentTrackIdx = -1;
let rotateTimer: ReturnType<typeof setTimeout> | null = null;

function tierForScore(score: number): "calm" | "normal" | "intense" {
  if (score < 30) return "calm";
  if (score < 80) return "normal";
  return "intense";
}

function pickTrack(tier: "calm" | "normal" | "intense"): number {
  const candidates = TRACKS
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => t.tier === tier && t !== TRACKS[12]); // excluir jingle
  const pool = candidates.filter(({ i }) => i !== currentTrackIdx);
  const pick = (pool.length ? pool : candidates)[Math.floor(Math.random() * (pool.length || candidates.length))];
  return pick.i;
}

function playTrack(trackIdx: number) {
  if (bgmInterval) clearInterval(bgmInterval);
  const ctx = getCtx();
  const track = TRACKS[trackIdx];
  let step = 0;
  const interval = (60 / track.bpm) * 1000;

  // Crossfade IN
  if (!bgmGain) {
    bgmGain = ctx.createGain();
    bgmGain.gain.value = 0;
    bgmGain.connect(ctx.destination);
  }
  bgmGain.gain.cancelScheduledValues(ctx.currentTime);
  bgmGain.gain.setValueAtTime(bgmGain.gain.value, ctx.currentTime);
  bgmGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1.0);

  bgmInterval = setInterval(() => {
    const t = ctx.currentTime;
    const melOsc = ctx.createOscillator();
    const melGain = ctx.createGain();
    melOsc.type = "square";
    melOsc.frequency.value = track.melody[step % track.melody.length];
    melGain.gain.setValueAtTime(0.06, t);
    melGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 0.8);
    melOsc.connect(melGain).connect(bgmGain!);
    melOsc.start(t);
    melOsc.stop(t + interval / 1000);

    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    bassOsc.type = "triangle";
    bassOsc.frequency.value = track.bass[step % track.bass.length];
    bassGain.gain.setValueAtTime(0.08, t);
    bassGain.gain.exponentialRampToValueAtTime(0.001, t + (interval / 1000) * 0.9);
    bassOsc.connect(bassGain).connect(bgmGain!);
    bassOsc.start(t);
    bassOsc.stop(t + interval / 1000);

    if (step % 2 === 0) {
      const hatOsc = ctx.createOscillator();
      const hatGain = ctx.createGain();
      hatOsc.type = "square";
      hatOsc.frequency.value = 4000 + Math.random() * 2000;
      hatGain.gain.setValueAtTime(0.02, t);
      hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      hatOsc.connect(hatGain).connect(bgmGain!);
      hatOsc.start(t);
      hatOsc.stop(t + 0.05);
    }

    step++;
  }, interval);

  currentTrackIdx = trackIdx;
}

export function startBGM(initialScore = 0) {
  stopBGM();
  const tier = tierForScore(initialScore);
  playTrack(pickTrack(tier));
  // Rotación automática cada 25s
  const scheduleRotate = () => {
    rotateTimer = setTimeout(() => {
      const cur = TRACKS[currentTrackIdx]?.tier ?? "normal";
      playTrack(pickTrack(cur));
      scheduleRotate();
    }, 25_000);
  };
  scheduleRotate();
}

export function updateBGMTier(score: number) {
  const desired = tierForScore(score);
  const cur = TRACKS[currentTrackIdx]?.tier;
  if (cur && cur !== desired) {
    playTrack(pickTrack(desired));
  }
}

export function stopBGM() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (rotateTimer) {
    clearTimeout(rotateTimer);
    rotateTimer = null;
  }
  if (bgmGain) {
    const ctx = getCtx();
    bgmGain.gain.cancelScheduledValues(ctx.currentTime);
    bgmGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
  }
  currentTrackIdx = -1;
}

/* ─── Victory jingle (corto, sobre la BGM) ─── */

export function sfxVictoryJingle() {
  const ctx = getCtx();
  const jingle = TRACKS[TRACKS.length - 1]; // último: el jingle de victoria
  const interval = (60 / jingle.bpm) * 1000 / 1000;
  jingle.melody.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.10, ctx.currentTime + i * interval);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * interval + interval * 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start(ctx.currentTime + i * interval);
    osc.stop(ctx.currentTime + (i + 1) * interval);
  });
}
```

- [ ] **Step 13.2: Llamar a `updateBGMTier(score)` en el loop del juego**

En `rescue-runner.tsx`, donde el score se actualiza en el loop (typically en cada `update()` o cuando aumenta), añade después del setScore:

```ts
import { updateBGMTier, sfxVictoryJingle } from "@/components/game/audio";

// dentro del loop, cuando cambia score:
updateBGMTier(score);
// y cuando score cruza 50/100/200:
if (score === 50 || score === 100 || score === 200) {
  sfxVictoryJingle();
}
```

- [ ] **Step 13.3: Verificar en juego**

Juega ~3 minutos:
- La música cambia cada ~25s.
- Cuando llegas a 30 pts: cambio a tier "normal" (más rápido, melodía más rica).
- Cuando llegas a 80 pts: cambio a tier "intense".
- Cuando cruzas 50/100/200: suena el jingle corto encima sin cortar la BGM.

- [ ] **Step 13.4: Commit**

```bash
git add components/game/audio.ts components/game/rescue-runner.tsx
git commit -m "feat(audio): 12 pistas chiptune con rotación por tier + crossfade + jingle victoria

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 14: Ladridos procedurales (barkHappy, barkAlert, whineSad, pantingExcited, barkIntro)

**Files:**
- Modify: `components/game/audio.ts`
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 14.1: Añadir exports de ladridos**

Al final de `components/game/audio.ts`, agrega:

```ts
/* ─── Voz de Rex (ladridos procedurales) ─── */

export function barkHappy() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  // ¡Guau! corto agudo: triangle + sweep ascendente
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(400, t);
  osc.frequency.exponentialRampToValueAtTime(820, t + 0.05);
  osc.frequency.exponentialRampToValueAtTime(220, t + 0.18);
  gain.gain.setValueAtTime(0.18, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.25);
}

export function barkAlert() {
  const ctx = getCtx();
  const t = ctx.currentTime;
  // ¡Wuf! más corto y agudo
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, t);
  osc.frequency.exponentialRampToValueAtTime(900, t + 0.04);
  osc.frequency.exponentialRampToValueAtTime(350, t + 0.12);
  gain.gain.setValueAtTime(0.14, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.16);
}

export function whineSad(long = false) {
  const ctx = getCtx();
  const t = ctx.currentTime;
  const dur = long ? 0.9 : 0.45;
  // Auuuu... descendente, sawtooth para timbre "lamentoso"
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(560, t);
  osc.frequency.exponentialRampToValueAtTime(330, t + dur * 0.4);
  osc.frequency.exponentialRampToValueAtTime(180, t + dur);
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.05);
  // Filtro lowpass para suavizar
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1200;
  osc.connect(lp).connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

let pantingInterval: ReturnType<typeof setInterval> | null = null;
export function startPanting() {
  if (pantingInterval) return;
  pantingInterval = setInterval(() => {
    const ctx = getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(160, t + 0.08);
    gain.gain.setValueAtTime(0.03, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }, 420);
}
export function stopPanting() {
  if (pantingInterval) {
    clearInterval(pantingInterval);
    pantingInterval = null;
  }
}

export function barkIntro() {
  // Ladrido más largo y festivo para la intro
  const ctx = getCtx();
  const t = ctx.currentTime;
  [440, 780, 580].forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(f, t + i * 0.06);
    osc.frequency.exponentialRampToValueAtTime(f * 0.5, t + i * 0.06 + 0.18);
    gain.gain.setValueAtTime(0.14, t + i * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.06 + 0.2);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t + i * 0.06);
    osc.stop(t + i * 0.06 + 0.22);
  });
}
```

- [ ] **Step 14.2: Llamar a los ladridos desde la lógica del juego**

En `rescue-runner.tsx`:

```ts
import {
  barkHappy,
  barkAlert,
  whineSad,
  startPanting,
  stopPanting,
  barkIntro,
} from "@/components/game/audio";

// Al rescatar carro (donde se llama sfxRescue):
sfxRescue();
barkHappy();

// Al recoger power-up (donde se llama sfxPickup):
sfxPickup();
barkAlert();

// Al perder vida (donde se llama sfxHit):
sfxHit();
whineSad(false);

// Al game over (donde se llama sfxGameOver):
sfxGameOver();
whineSad(true);
stopPanting();

// Al actualizar score, condicional de panting "todo va bien":
if (score >= 100 && score < 200 && !panting) {
  startPanting();
  setPanting(true);
} else if ((score < 100 || score >= 200) && panting) {
  stopPanting();
  setPanting(false);
}

// En la intro, al aparecer "PUSH START":
barkIntro();
```

Necesitas un `useState` o ref `panting` para llevar control. Si te resulta más simple, controla el panting con una variable local del game loop sin React state, marcándolo en un ref.

- [ ] **Step 14.3: Verificar audio**

`npm run dev`. Juega:
- Rescata un carro → escuchas "¡Guau!" agudo además del sfx existente.
- Recoge power-up → "¡Wuf!" corto.
- Choca con bache/cono → "Auuu" descendente.
- Game over → "Auuuuu..." largo.
- Entre 100 y 200 pts: jadeo rítmico bajo de fondo.
- Intro al pulsar "Comenzar": ladrido festivo al aparecer PUSH START.

- [ ] **Step 14.4: Commit**

```bash
git add components/game/audio.ts components/game/rescue-runner.tsx
git commit -m "feat(audio): 5 ladridos procedurales (happy, alert, whineSad, panting, intro)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 15: Sistema de partículas (effects.ts)

**Files:**
- Create: `components/game/effects.ts`
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 15.1: Crear `components/game/effects.ts`**

```ts
/** Particle pool for game effects. Used for smoke, sparks, dust. */

export type ParticleKind = "smoke" | "spark" | "dust";

export type Particle = {
  alive: boolean;
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;   // remaining seconds
  maxLife: number;
  size: number;
  color: string;
};

export class ParticlePool {
  private pool: Particle[] = [];
  private cap: number;

  constructor(cap: number) {
    this.cap = cap;
  }

  setCap(cap: number) {
    this.cap = cap;
    if (this.pool.length > cap) this.pool.length = cap;
  }

  spawn(kind: ParticleKind, x: number, y: number, count = 1) {
    for (let n = 0; n < count; n++) {
      const p = this.acquire();
      if (!p) return;
      p.alive = true;
      p.kind = kind;
      p.x = x;
      p.y = y;
      if (kind === "smoke") {
        p.vx = (Math.random() - 0.5) * 30;
        p.vy = -40 - Math.random() * 30;
        p.maxLife = 1.0 + Math.random() * 0.4;
        p.size = 4 + Math.random() * 3;
        p.color = "#9ca3af";
      } else if (kind === "spark") {
        const a = Math.random() * Math.PI * 2;
        const s = 120 + Math.random() * 80;
        p.vx = Math.cos(a) * s;
        p.vy = Math.sin(a) * s;
        p.maxLife = 0.35 + Math.random() * 0.15;
        p.size = 2;
        p.color = Math.random() > 0.5 ? "#fb923c" : "#fde047";
      } else {
        // dust
        p.vx = (Math.random() - 0.5) * 60;
        p.vy = -20 - Math.random() * 40;
        p.maxLife = 0.6 + Math.random() * 0.3;
        p.size = 3;
        p.color = "#d6c4a3";
      }
      p.life = p.maxLife;
    }
  }

  private acquire(): Particle | null {
    for (const p of this.pool) if (!p.alive) return p;
    if (this.pool.length >= this.cap) return null;
    const fresh: Particle = {
      alive: false, kind: "smoke", x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, size: 0, color: "",
    };
    this.pool.push(fresh);
    return fresh;
  }

  update(dt: number) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 80 * dt; // gravedad ligera
      p.life -= dt;
      if (p.life <= 0) p.alive = false;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (const p of this.pool) {
      if (!p.alive) continue;
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }
}
```

- [ ] **Step 15.2: Integrar en rescue-runner.tsx**

En `rescue-runner.tsx`, en el ámbito del componente o del game loop:

```ts
import { ParticlePool } from "@/components/game/effects";

const particlesRef = useRef<ParticlePool | null>(null);
useEffect(() => {
  particlesRef.current = new ParticlePool(80); // se ajusta más tarde con lite-mode
}, []);

// Cada vez que se rescata un carro o se recoge power-up: chispas
// En el handler de colisión exitosa:
particlesRef.current?.spawn("spark", carX, carY, 12);

// Humo continuo desde el escape de la ambulancia (cada tick):
// (dentro del loop)
if (Math.random() < 0.4) {
  particlesRef.current?.spawn("smoke", player.x + SCALE * 8, player.y + SCALE * 26, 1);
}

// Al esquivar bache por poco (distancia mínima): polvo
// (en el chequeo de colisiones, si no colisionó pero pasó cerca)
if (closeMiss) particlesRef.current?.spawn("dust", obstacleX, obstacleY, 6);

// En el update del loop:
particlesRef.current?.update(dt);

// En el render, después de dibujar el mapa y antes de UI:
particlesRef.current?.draw(ctx);
```

- [ ] **Step 15.3: Verificar partículas en juego**

`npm run dev`. Inicia partida:
- Detrás de la ambulancia: humito gris saliendo.
- Al recoger power-up o rescatar carro: chispas naranja/amarillas.
- Al esquivar bache por poco: polvo café.

- [ ] **Step 15.4: Commit**

```bash
git add components/game/effects.ts components/game/rescue-runner.tsx
git commit -m "feat(game): sistema de partículas (humo, chispas, polvo)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 16: Screen shake, slow-mo y flash en hitos

**Files:**
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 16.1: Añadir estados de shake, slow-mo y flash**

Dentro del game loop, agrega refs:

```ts
const shakeRef = useRef(0); // tiempo restante de shake en segundos
const slowMoRef = useRef(0); // tiempo restante de slow-mo
const flashRef = useRef(0); // tiempo restante de flash blanco
```

- [ ] **Step 16.2: Disparar shake en colisión y slow-mo+flash en récord**

```ts
// Cuando hay colisión con bache/cono:
shakeRef.current = 0.2; // 200ms

// Cuando se cruza nuevo récord (lo detectas al guardar high score):
slowMoRef.current = 0.8;
flashRef.current = 0.25;
```

- [ ] **Step 16.3: Aplicar slow-mo al dt y shake al ctx.translate**

En el game loop, justo después de calcular `dt`:

```ts
const realDt = dt;
let effectiveDt = realDt;
if (slowMoRef.current > 0) {
  effectiveDt = realDt * 0.3;
  slowMoRef.current -= realDt;
  if (slowMoRef.current < 0) slowMoRef.current = 0;
}
shakeRef.current = Math.max(0, shakeRef.current - realDt);
flashRef.current = Math.max(0, flashRef.current - realDt);

// usar effectiveDt en lugar de dt en updates de física
update(effectiveDt);
```

Antes de dibujar el frame:

```ts
ctx.save();
if (shakeRef.current > 0) {
  const intensity = (shakeRef.current / 0.2) * 8;
  ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
}
// ...dibujo del mapa, sprites, partículas...
ctx.restore();

// Flash blanco encima
if (flashRef.current > 0) {
  ctx.fillStyle = `rgba(255,255,255,${flashRef.current / 0.25})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}
```

- [ ] **Step 16.4: Verificar efectos**

Choca con bache → el canvas se sacude ~200ms. Supera tu high score → cámara lenta durante 800ms y flash blanco al instante.

- [ ] **Step 16.5: Commit**

```bash
git add components/game/rescue-runner.tsx
git commit -m "feat(game): screen shake en colisión + slow-mo y flash en nuevo récord

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 17: Sirena pulsante, faros y glow/bloom

**Files:**
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 17.1: Añadir halo de sirena alrededor de la ambulancia**

En el render de la ambulancia (antes de dibujar el sprite):

```ts
// Halo sirena rojo/azul alternante con el tiempo
const sirenPhase = Math.floor(now / 250) % 2 === 0; // alterna cada 250ms
const sirenColor = sirenPhase ? "rgba(225,29,72,0.55)" : "rgba(14,165,233,0.55)";
const cx = player.x + (AMBULANCE[0].length * SCALE) / 2;
const cy = player.y + (AMBULANCE.length * SCALE) / 2;
const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 40);
grad.addColorStop(0, sirenColor);
grad.addColorStop(1, "rgba(0,0,0,0)");
ctx.fillStyle = grad;
ctx.fillRect(cx - 40, cy - 40, 80, 80);
```

- [ ] **Step 17.2: Faros amarillos hacia adelante**

```ts
const headX = player.x + (AMBULANCE[0].length * SCALE) / 2;
const headY = player.y; // tope frontal de la ambulancia
const grad2 = ctx.createRadialGradient(headX, headY, 2, headX, headY - 80, 80);
grad2.addColorStop(0, "rgba(253,224,71,0.45)");
grad2.addColorStop(1, "rgba(253,224,71,0)");
ctx.fillStyle = grad2;
ctx.fillRect(headX - 50, headY - 80, 100, 100);
```

- [ ] **Step 17.3: Glow simple con shadowBlur en sprites importantes**

Cuando dibujas el escudo activo, sirena, o ambulancia:

```ts
// Antes de drawSprite del escudo:
ctx.shadowBlur = 12;
ctx.shadowColor = "#0EA5E9";
drawSprite(ctx, SHIELD, x, y, SCALE);
ctx.shadowBlur = 0;
```

Aplica el mismo patrón a `MEDKIT` (rojo), `FUEL` (verde), `AMBULANCE_FRAMES[frameIdx]` (crimson tenue).

- [ ] **Step 17.4: Verificar**

Visualmente: aura pulsante rojo/azul alrededor de la ambulancia, cono amarillo hacia adelante (más visible en noche, Task 19), power-ups con halo de su color.

- [ ] **Step 17.5: Commit**

```bash
git add components/game/rescue-runner.tsx
git commit -m "feat(game): sirena pulsante, faros amarillos y glow en sprites clave

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 18: Parallax de fondo (3 capas detrás del canvas)

**Files:**
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 18.1: Añadir capas absolute con CSS gradients y animación CSS**

En el JSX que envuelve el `<canvas>` del juego (probablemente un `<div className="relative">`), añade ANTES del canvas:

```tsx
<div
  className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
  aria-hidden
>
  {/* Capa 1: montañas lejanas */}
  <div className="parallax-layer parallax-mountains" />
  {/* Capa 2: silueta de ciudad */}
  <div className="parallax-layer parallax-city" />
  {/* Capa 3: vallas / detalles */}
  <div className="parallax-layer parallax-rail" />
</div>
```

El `<canvas>` mantiene `position: relative` con `z-10` o equivalente.

- [ ] **Step 18.2: Añadir CSS de las capas en `app/globals.css`**

```css
.parallax-layer {
  position: absolute;
  inset: 0;
  background-repeat: repeat-x;
  background-position: 0 bottom;
}
.parallax-mountains {
  background-image: linear-gradient(180deg, #1e3a5f 0%, #2a4a73 60%, transparent 100%);
  /* Para una silueta de montañas usa un mask SVG inline */
  -webkit-mask-image: radial-gradient(ellipse at center 60%, black 60%, transparent 80%);
  animation: parallax-slow 60s linear infinite;
  opacity: 0.45;
}
.parallax-city {
  background-image: repeating-linear-gradient(90deg, #0f172a 0 24px, #1e293b 24px 28px, transparent 28px 56px);
  background-size: 56px 70%;
  background-position: 0 bottom;
  animation: parallax-medium 24s linear infinite;
  opacity: 0.55;
}
.parallax-rail {
  background-image: repeating-linear-gradient(90deg, transparent 0 80px, rgba(255,255,255,0.18) 80px 82px);
  animation: parallax-fast 6s linear infinite;
  opacity: 0.4;
}

@keyframes parallax-slow  { from { transform: translateX(0); } to { transform: translateX(-560px); } }
@keyframes parallax-medium{ from { transform: translateX(0); } to { transform: translateX(-1200px); } }
@keyframes parallax-fast  { from { transform: translateX(0); } to { transform: translateX(-1600px); } }
```

- [ ] **Step 18.3: Verificar**

`npm run dev`, `/game`. Detrás del canvas deben verse las 3 capas moviéndose a distintas velocidades. La capa de montañas casi imperceptible (lenta), la ciudad media velocidad, los detalles más rápidos.

- [ ] **Step 18.4: Commit**

```bash
git add components/game/rescue-runner.tsx app/globals.css
git commit -m "feat(game): parallax de 3 capas detrás del canvas

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 19: Ciclo día/noche

**Files:**
- Modify: `components/game/rescue-runner.tsx`
- Modify: `app/globals.css`

- [ ] **Step 19.1: Variable de fase de tiempo en el loop**

```ts
const cycleStart = useRef(performance.now());
// En el render:
const elapsed = (now - cycleStart.current) / 1000;
const cyclePos = (elapsed % 45) / 45; // 0..1 cada 45s
const isNight = cyclePos > 0.5;
```

- [ ] **Step 19.2: Aplicar gradient de cielo al fondo del canvas**

Antes de dibujar el mapa:

```ts
const sky = isNight
  ? ctx.createLinearGradient(0, 0, 0, canvas.height)
  : ctx.createLinearGradient(0, 0, 0, canvas.height);
if (isNight) {
  sky.addColorStop(0, "#0b1226");
  sky.addColorStop(1, "#1f1b3a");
} else {
  sky.addColorStop(0, "#fef3c7");
  sky.addColorStop(1, "#fcd34d");
}
ctx.fillStyle = sky;
ctx.fillRect(0, 0, canvas.width, canvas.height);
```

(Si el mapa actual ya pinta encima, este cielo sólo se ve en los bordes / cuando haya transparencia. Si no, considera pintar bajo el canvas en un layer aparte.)

- [ ] **Step 19.3: Estrellas en noche**

Cuando `isNight`, pinta ~30 puntos blancos pequeños fijos:

```ts
if (isNight) {
  for (let i = 0; i < 30; i++) {
    const sx = (i * 73) % canvas.width;
    const sy = (i * 37) % (canvas.height * 0.4);
    ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(now / 500 + i) * 0.2})`;
    ctx.fillRect(sx, sy, 1.5, 1.5);
  }
}
```

- [ ] **Step 19.4: Reforzar faros en noche**

Sube la opacidad del cono de faros cuando `isNight === true` (en el render de Task 17.2): `rgba(253,224,71, 0.7)` en noche vs `0.45` en día.

- [ ] **Step 19.5: Verificar**

Juega ~1 minuto y observa que el cielo cambia gradualmente de día (cálido) a noche (oscuro con estrellas) y vuelve. Los faros se notan más fuertes en noche.

- [ ] **Step 19.6: Commit**

```bash
git add components/game/rescue-runner.tsx app/globals.css
git commit -m "feat(game): ciclo día/noche cada 45s con estrellas y faros reforzados

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 20: Intro animada Capcom-style + ladrido de intro

**Files:**
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 20.1: Pantalla de intro antes del juego**

En `rescue-runner.tsx`, antes de pasar a la pantalla "Comenzar"/menú, añade un estado de animación:

```ts
const [introPhase, setIntroPhase] = useState<"title" | "push-start" | "ready" | "playing">("title");
```

Cuando el componente monta, ejecuta una secuencia con setTimeout:

```ts
useEffect(() => {
  const t1 = setTimeout(() => setIntroPhase("push-start"), 1200);
  const t2 = setTimeout(() => {
    setIntroPhase("ready");
    barkIntro();
  }, 1400);
  return () => {
    clearTimeout(t1);
    clearTimeout(t2);
  };
}, []);
```

En el JSX:

```tsx
{introPhase !== "playing" && (
  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto">
    <h1
      className="font-display text-5xl sm:text-7xl font-extrabold text-brand-crimson text-center"
      style={{
        textShadow: "0 0 24px #E11D48, 0 0 60px #E11D48",
        animation: "title-slide 0.8s cubic-bezier(.34,1.56,.64,1)",
      }}
    >
      REX AL RESCATE
    </h1>
    {introPhase === "ready" && (
      <button
        onClick={() => setIntroPhase("playing")}
        className="mt-10 font-display text-2xl font-extrabold text-yellow-300 animate-pulse"
      >
        🐕 PUSH START
      </button>
    )}
  </div>
)}
```

En `globals.css`:

```css
@keyframes title-slide {
  0%   { transform: translateX(-100%); opacity: 0; }
  60%  { transform: translateX(8%); opacity: 1; }
  100% { transform: translateX(0); opacity: 1; }
}
```

- [ ] **Step 20.2: Verificar**

Recarga `/game`. La intro:
- 0–0.8s: título "REX AL RESCATE" entra deslizando con flash.
- 1.4s: aparece "🐕 PUSH START" parpadeante + ladrido festivo.
- Tap/click → comienza el juego (o pasa al menú de dificultad existente).

- [ ] **Step 20.3: Commit**

```bash
git add components/game/rescue-runner.tsx app/globals.css
git commit -m "feat(game): intro animada Capcom-style + ladrido de bienvenida

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 21: Detección lite-mode + cap de FPS en móvil

**Files:**
- Modify: `components/game/rescue-runner.tsx`
- Modify: `components/game/effects.ts`

- [ ] **Step 21.1: Función `detectLiteMode()` al iniciar el juego**

En `rescue-runner.tsx`, fuera del componente:

```ts
function detectLiteMode(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const lowCores = (navigator.hardwareConcurrency ?? 8) < 4;
  const lowDpr = (window.devicePixelRatio || 1) < 2;
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  return lowCores || lowDpr || isMobile;
}
```

Al montar el componente:

```ts
const liteModeRef = useRef(false);
const bloomEnabledRef = useRef(true);
useEffect(() => {
  liteModeRef.current = detectLiteMode();
  if (liteModeRef.current) {
    particlesRef.current?.setCap(30);
    bloomEnabledRef.current = false;
  }
}, []);
```

En Task 17 (Step 17.3) donde aplicas `ctx.shadowBlur`, envuelve con `if (bloomEnabledRef.current)`:

```ts
if (bloomEnabledRef.current) {
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#0EA5E9";
}
drawSprite(ctx, SHIELD, x, y, SCALE);
ctx.shadowBlur = 0;
```

En las funciones que pintan parallax, sólo renderiza 2 capas si `liteModeRef.current` (oculta la capa de detalles más rápida con CSS, o no la añadas al DOM).

Reduce amplitud de screen shake al 50% si lite-mode:

```ts
const intensity = (shakeRef.current / 0.2) * (liteModeRef.current ? 4 : 8);
```

Reduce `glow` (no aplicar `ctx.shadowBlur` si `bloomEnabledRef.current === false`).

- [ ] **Step 21.2: Cap de FPS dinámico**

Mantén un contador del `realDt` promedio en los últimos 2 segundos. Si supera 1/45 sostenidamente:

```ts
const dtHistory: number[] = [];
const targetFps = 60;
let runtimeFpsCap = 60;
// en el loop:
dtHistory.push(realDt);
if (dtHistory.length > 120) dtHistory.shift();
const avg = dtHistory.reduce((a, b) => a + b, 0) / dtHistory.length;
if (avg > 1 / 45 && runtimeFpsCap === 60) {
  runtimeFpsCap = 45;
}
// limitar el siguiente frame:
const minFrame = 1 / runtimeFpsCap;
if (realDt < minFrame) {
  // skip this frame iteration (usa setTimeout para esperar diferencia)
}
```

(La implementación exacta depende del loop. Si el loop usa `requestAnimationFrame`, basta con saltar `update`+`render` en frames donde `accumulator < minFrame`.)

- [ ] **Step 21.3: Verificar en móvil**

`npm run dev` con viewport 375×667 en DevTools (también CPU throttling 4x slowdown):
- El juego debe seguir corriendo a 30+ fps subjetivamente.
- Partículas máximo 30 simultáneas.
- Parallax con sólo 2 capas (montañas + ciudad).
- Sin glow/bloom (los power-ups se ven sin halo).

- [ ] **Step 21.4: Commit**

```bash
git add components/game/rescue-runner.tsx components/game/effects.ts
git commit -m "feat(game): lite-mode auto-detect + cap dinámico de FPS en móvil

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 22: Eventos de rescate (events.ts) — máquina de estados base

**Files:**
- Create: `components/game/events.ts`

- [ ] **Step 22.1: Crear events.ts con la state machine**

```ts
/** Rescue events that fire periodically during gameplay. */

export type EventKind = "tornado" | "pileup" | "blackout";
export type EventState = "idle" | "active" | "succeeded" | "failed";

export type RescueEvent = {
  state: EventState;
  kind: EventKind | null;
  startedAt: number;
  duration: number;
  carsRescued: number;
  carsNeeded: number;
  collisions: number;
};

export function makeEvent(): RescueEvent {
  return {
    state: "idle",
    kind: null,
    startedAt: 0,
    duration: 0,
    carsRescued: 0,
    carsNeeded: 0,
    collisions: 0,
  };
}

export function startEvent(ev: RescueEvent, kind: EventKind, now: number): void {
  ev.kind = kind;
  ev.state = "active";
  ev.startedAt = now;
  ev.carsRescued = 0;
  ev.collisions = 0;
  if (kind === "tornado") {
    ev.duration = 16;
    ev.carsNeeded = 3;
  } else if (kind === "pileup") {
    ev.duration = 18;
    ev.carsNeeded = 4;
  } else {
    ev.duration = 20;
    ev.carsNeeded = 3;
  }
}

export function tickEvent(ev: RescueEvent, now: number): EventState {
  if (ev.state !== "active") return ev.state;
  const elapsed = (now - ev.startedAt) / 1000;
  if (ev.kind === "pileup" && ev.collisions >= 2) {
    ev.state = "failed";
    return ev.state;
  }
  if (ev.carsRescued >= ev.carsNeeded) {
    ev.state = "succeeded";
    return ev.state;
  }
  if (elapsed >= ev.duration) {
    ev.state = ev.carsRescued >= Math.ceil(ev.carsNeeded * 0.6) ? "succeeded" : "failed";
    return ev.state;
  }
  return ev.state;
}

export function resetEvent(ev: RescueEvent): void {
  ev.state = "idle";
  ev.kind = null;
}

/** Pick random event kind (uniform) */
export function pickEventKind(): EventKind {
  const r = Math.random();
  if (r < 0.34) return "tornado";
  if (r < 0.67) return "pileup";
  return "blackout";
}
```

- [ ] **Step 22.2: Validación rápida en consola**

Añade temporalmente en `rescue-runner.tsx` después del import:

```ts
console.assert(
  ((): boolean => {
    const ev = makeEvent();
    startEvent(ev, "tornado", 0);
    ev.carsRescued = 3;
    return tickEvent(ev, 1000) === "succeeded";
  })(),
  "rescue event machine basic check"
);
```

Carga la página, revisa que no aparezca el assert en consola. Luego BORRA esa línea antes de commitear.

- [ ] **Step 22.3: Commit**

```bash
git add components/game/events.ts
git commit -m "feat(game): máquina de estados base para eventos de rescate

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 23: Integrar eventos al juego — Tornado

**Files:**
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 23.1: Disparar eventos cada ~100 pts**

```ts
import { makeEvent, startEvent, tickEvent, resetEvent, pickEventKind } from "@/components/game/events";

const eventRef = useRef(makeEvent());
const lastEventScore = useRef(0);
// en el loop, cuando score >= lastEventScore + 100 && eventRef.current.state === "idle":
if (score >= lastEventScore.current + 100 && eventRef.current.state === "idle") {
  startEvent(eventRef.current, pickEventKind(), now);
  lastEventScore.current = score;
}
// tick:
tickEvent(eventRef.current, now);

// Cuando state pasa a succeeded/failed:
if (eventRef.current.state === "succeeded") {
  setScore((s) => s + 50);
  sfxVictoryJingle();
  resetEvent(eventRef.current);
}
if (eventRef.current.state === "failed") {
  setLives((l) => Math.max(0, l - 1));
  whineSad(false);
  resetEvent(eventRef.current);
}
```

- [ ] **Step 23.2: Efecto visual TORNADO**

Cuando `eventRef.current.kind === "tornado"` y `state === "active"`:

```ts
// Oscurecer pantalla:
ctx.fillStyle = "rgba(0,0,0,0.35)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Viento lateral: empujar al jugador en X
player.x += Math.sin(now / 200) * 50 * dt;

// Spawn 3-4 cars muy cerca uno de otro (uno cada 2s aprox)
if ((now - eventRef.current.startedAt) % 2000 < 50 && (carros varados actuales) < 4) {
  spawn("car", ...);
}

// Dibujar espiral del tornado (overlay)
ctx.save();
ctx.translate(canvas.width / 2, canvas.height / 2);
ctx.strokeStyle = "rgba(148,163,184,0.7)";
ctx.lineWidth = 6;
ctx.beginPath();
for (let a = 0; a < Math.PI * 6; a += 0.1) {
  const r = 8 + a * 8;
  const x = Math.cos(a + now / 100) * r;
  const y = Math.sin(a + now / 100) * r;
  ctx.lineTo(x, y);
}
ctx.stroke();
ctx.restore();

// HUD: indicador de evento
// (en el HUD del componente: `EVENTO: TORNADO · {ev.carsRescued}/{ev.carsNeeded}`)
```

- [ ] **Step 23.3: Cuando rescatas carro durante evento, incrementar carsRescued**

En el handler de rescate de carro, si `eventRef.current.state === "active"`:

```ts
eventRef.current.carsRescued++;
```

- [ ] **Step 23.4: Verificar**

Juega hasta 100 pts. Si toca el tornado: pantalla oscurece, viento empuja, aparecen carros cerca, espiral animada en el centro. Si rescatas 3+, gana bonus de 50; si pasan 16s y no rescatas suficientes, pierdes 1 vida.

- [ ] **Step 23.5: Commit**

```bash
git add components/game/rescue-runner.tsx
git commit -m "feat(game): evento Tornado integrado con score y vidas

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 24: Eventos Pile-up y Blackout

**Files:**
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 24.1: Implementar Pile-up**

Cuando `eventRef.current.kind === "pileup"` y `active`:

```ts
// Aparecen 5 vehículos en cadena al inicio del evento
if ((now - eventRef.current.startedAt) < 500 && !ev.spawnedInitial) {
  for (let i = 0; i < 5; i++) {
    spawnAt(
      randomLaneX(),
      -100 - i * 80,
      randomVehicleKind(), // car/truck/moto
    );
  }
  ev.spawnedInitial = true; // añade este flag al makeEvent inicial si lo usas
}

// Patrulla con sirena delante del jugador
const patrolY = player.y - 200;
drawSprite(ctx, AMBULANCE_FRAMES[0], canvas.width / 2 - 30, patrolY, SCALE * 0.8);
ctx.shadowBlur = 16;
ctx.shadowColor = sirenPhase ? "#E11D48" : "#0EA5E9";
ctx.fillStyle = ctx.shadowColor;
ctx.fillRect(canvas.width / 2 - 10, patrolY - 10, 20, 6);
ctx.shadowBlur = 0;

// Colisión durante evento incrementa ev.collisions (en lugar de perder vida directo).
// La máquina de estados detecta collisions>=2 y marca failed.
```

- [ ] **Step 24.2: Implementar Blackout**

Cuando `eventRef.current.kind === "blackout"`:

```ts
// Oscurecer casi completamente
ctx.fillStyle = "rgba(0,0,0,0.92)";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Recortar la oscuridad con el cono de faros (composite operation)
ctx.save();
ctx.globalCompositeOperation = "destination-out";
const headX = player.x + (AMBULANCE[0].length * SCALE) / 2;
const headY = player.y;
const grad = ctx.createRadialGradient(headX, headY - 40, 10, headX, headY - 40, 120);
grad.addColorStop(0, "rgba(0,0,0,1)");
grad.addColorStop(1, "rgba(0,0,0,0)");
ctx.fillStyle = grad;
ctx.fillRect(headX - 120, headY - 160, 240, 240);
ctx.restore();

// Spawn 3 medkits especiales durante el evento (más raros, doble score)
if ((now - eventRef.current.startedAt) % 4000 < 50 && carrsSpawnedDuringBlackout < 3) {
  spawn("medkit", ...);
  carrsSpawnedDuringBlackout++;
}
```

- [ ] **Step 24.3: HUD del evento**

En el JSX del HUD del juego, cuando `eventRef.current.state === "active"`, añade un banner superior:

```tsx
{eventRef.current.state === "active" && (
  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-brand-crimson/90 text-white px-4 py-2 rounded-full font-display font-extrabold text-sm">
    {eventRef.current.kind === "tornado" && `🌪️ TORNADO · ${eventRef.current.carsRescued}/${eventRef.current.carsNeeded}`}
    {eventRef.current.kind === "pileup" && `🚗💥 PILE-UP · ${eventRef.current.carsRescued}/${eventRef.current.carsNeeded}`}
    {eventRef.current.kind === "blackout" && `🌑 APAGÓN · ${eventRef.current.carsRescued}/${eventRef.current.carsNeeded}`}
  </div>
)}
```

- [ ] **Step 24.4: Verificar los 3 eventos**

Juega hasta 100, 200, 300, 400 puntos y confirma que los 3 tipos de evento se disparan aleatoriamente. Cada uno se ve y se siente distinto.

- [ ] **Step 24.5: Commit**

```bash
git add components/game/rescue-runner.tsx
git commit -m "feat(game): eventos Pile-up y Blackout con HUD propio

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 25: Easter egg Konami → Modo Chihuahua

**Files:**
- Modify: `components/game/rescue-runner.tsx`

- [ ] **Step 25.1: Detector de secuencia Konami antes de comenzar**

```ts
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyZ","KeyX"];
const [konamiBuf, setKonamiBuf] = useState<string[]>([]);
const [chihuahuaMode, setChihuahuaMode] = useState(false);

useEffect(() => {
  if (introPhase === "playing") return; // sólo en menú/intro
  const onKey = (e: KeyboardEvent) => {
    setKonamiBuf((prev) => {
      const next = [...prev, e.code].slice(-KONAMI.length);
      if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
        setChihuahuaMode(true);
        barkHappy();
      }
      return next;
    });
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [introPhase]);
```

Para móvil, agrega gestos: 4 taps en esquinas alternadas (UL → UR → BL → BR) en menos de 3s = activa Chihuahua. (Si esto es complejo, deja sólo PC por ahora y documenta limitación en una nota dentro del HUD: "💡 En PC: prueba un código clásico de NES en este menú").

- [ ] **Step 25.2: Aplicar efectos del modo cuando el juego empieza**

Cuando se pasa de menú a playing:

```ts
// En el juego, si chihuahuaMode:
const SCALE_EFFECTIVE = chihuahuaMode ? SCALE * 0.7 : SCALE;
const baseSpeed = difficulty.baseSpeed * (chihuahuaMode ? 1.8 : 1);
const scoreMul = chihuahuaMode ? 2 : 1;

// cada vez que sumas score:
setScore((s) => s + 1 * scoreMul);
```

- [ ] **Step 25.3: HUD indicador**

```tsx
{chihuahuaMode && (
  <div className="absolute top-3 right-3 z-20 bg-yellow-400 text-black px-3 py-1 rounded-full font-extrabold text-xs">
    🐕 MODO CHIHUAHUA
  </div>
)}
```

- [ ] **Step 25.4: Verificar**

En el menú del juego, antes de pulsar Comenzar: ↑↑↓↓←→←→ZX. Debes escuchar un ladrido y ver el HUD "🐕 MODO CHIHUAHUA". Inicia la partida y verifica que la ambulancia es más pequeña + va más rápida + score sube doble.

- [ ] **Step 25.5: Commit**

```bash
git add components/game/rescue-runner.tsx
git commit -m "feat(game): easter egg Konami → Modo Chihuahua (ambulancia chica + rápida + score x2)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

## Task 26: Easter egg Rex Comando unlock + toggle

**Files:**
- Modify: `components/game/rescue-runner.tsx`
- Modify: `components/game/sprites.ts`

- [ ] **Step 26.1: Detectar 300 pts en Difícil**

En el loop, cuando `score >= 300 && difficulty.label === "Difícil"`:

```ts
if (
  score >= 300 &&
  difficulty.label === "Difícil" &&
  !localStorage.getItem("rexnow-skin-comando")
) {
  localStorage.setItem("rexnow-skin-comando", "1");
  setUnlockToast(true);
  barkHappy();
  setTimeout(() => setUnlockToast(false), 4000);
}
```

- [ ] **Step 26.2: Variante AMBULANCE_FRAMES_COMANDO con gorra negra**

En `sprites.ts`, después de definir los 4 frames del Rex normal, derive los frames Comando reemplazando colores:

```ts
export const AMBULANCE_FRAMES_COMANDO: string[][][] = AMBULANCE_FRAMES.map((frame) =>
  frame.map((row) =>
    row.map((cell) => {
      if (cell === HCAP) return BCAP;
      if (cell === HCROSS) return BCAP;
      return cell;
    })
  )
);
```

- [ ] **Step 26.3: Toggle en el menú de inicio**

En la pantalla pre-partida (menú con dificultades), si `localStorage.getItem("rexnow-skin-comando") === "1"`, mostrar un toggle:

```tsx
{skinUnlocked && (
  <label className="flex items-center gap-2 mt-4 text-sm">
    <input
      type="checkbox"
      checked={skinComandoActive}
      onChange={(e) => {
        setSkinComandoActive(e.target.checked);
        localStorage.setItem(
          "rexnow-skin-comando-active",
          e.target.checked ? "1" : "0",
        );
      }}
    />
    🎖️ Usar skin Rex Comando
  </label>
)}
```

Y en el render del juego, si `skinComandoActive`, usa `AMBULANCE_FRAMES_COMANDO` en lugar de `AMBULANCE_FRAMES`.

- [ ] **Step 26.4: Toast de desbloqueo**

```tsx
{unlockToast && (
  <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 bg-yellow-400 text-black px-4 py-2 rounded-full font-extrabold animate-bounce">
    🏅 Skin desbloqueada: Rex Comando
  </div>
)}
```

- [ ] **Step 26.5: Verificar**

Juega Difícil hasta 300+ pts (puedes hacer un truco temporal en consola: `setScore(295)` justo antes para no esperar). Debes ver el toast, escuchar ladrido feliz. Reinicia la partida: en el menú aparece checkbox para activar el skin. Activado → Rex aparece con gorra negra y cintillo.

El localStorage del avatar del chatbot (Task 11) ya lee `rexnow-skin-comando-active`, así que el chatbot también cambia.

- [ ] **Step 26.6: Commit**

```bash
git add components/game/rescue-runner.tsx components/game/sprites.ts
git commit -m "feat(game): easter egg Rex Comando (unlock a 300pts en Difícil + toggle)

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

---

# Cierre

## Task 27: Smoke test final

- [ ] **Step 27.1: Lista de verificación end-to-end**

Con `npm run dev` corriendo, recorre:

1. Home `/` en viewport 375×667:
   - ✅ Hero, navbar, secciones todas legibles.
   - ✅ "Somos el copiloto..." se ve completo.
   - ✅ Counters muestran 8+, 10s, 24/7, 100%.
   - ✅ Mapa: botón centrar accesible fuera del mapa, banner debajo.
2. Chat de Rex:
   - ✅ Saludo nocturno se activa después de las 23:00.
   - ✅ Reglas: juego, controles, dificultades, abrazo, panzita, lobo, easter eggs, pistas.
   - ✅ 7 taps al avatar → galleta cae.
   - ✅ Animación abrazo (jump) y panzita (rotate).
3. Juego `/game`:
   - ✅ Intro Capcom-style con ladrido.
   - ✅ Rex se ve como San Bernardo + gorra roja.
   - ✅ Drift-left/right cambian frames; hit muestra ojos cerrados.
   - ✅ Parallax + día/noche + estrellas en noche.
   - ✅ Partículas (humo, chispas, polvo).
   - ✅ Screen shake en colisión; slow-mo y flash en nuevo récord.
   - ✅ Faros y halo sirena alternando.
   - ✅ Ladridos en eventos clave + jadeo entre 100-200 pts.
   - ✅ Música cambia por tier y rota cada 25s.
   - ✅ Medkits aparecen poco; Fácil sigue siendo amable.
   - ✅ Eventos: tornado, pile-up, blackout (esperar 100, 200, 300 pts).
   - ✅ Konami code en menú → Modo Chihuahua.
   - ✅ 300 pts en Difícil → Rex Comando unlock.
4. Desktop 1280×800: mismo recorrido, todo sigue funcionando.

- [ ] **Step 27.2: Si hay regresiones**

Anota cada una. Si es del trabajo de esta semana, fix inmediato y nuevo commit. Si es preexistente y no relacionado, sólo anota para una iteración futura.

- [ ] **Step 27.3: Commit final si hay fixes**

```bash
git add <files>
git commit -m "fix: regresiones encontradas en smoke test final

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>"
```

- [ ] **Step 27.4: Resumen al usuario**

Avísale al usuario:
- "Todas las tareas completadas. Smoke test: ✅".
- Lista de easter eggs descubribles (resumen corto para que él los pruebe).
- Cualquier nota sobre comportamiento de lite-mode en móvil o limitaciones encontradas.
