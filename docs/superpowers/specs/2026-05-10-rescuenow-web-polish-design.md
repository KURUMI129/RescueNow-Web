# RescueNow Web — Pulido cinematográfico y corrección de bugs

**Fecha:** 2026-05-10
**Alcance:** Página web (Next.js). La app móvil queda fuera para una iteración posterior.

## Resumen

Cinco frentes simultáneos, todos en la web:

1. **Polish cinematográfico del juego** "Rex al Rescate" (`components/game/`).
2. **Rediseño del sprite de Rex** para que parezca un San Bernardo rescatista y no Freddy Fazbear.
3. **Personalidad perruna del chatbot** (reglas, IA y burbujas proactivas).
4. **Tres bugs móviles confirmados**: texto "Somos el copiloto" se come "el", CountUp se queda en 0, botón de centrar mapa tapado por el chatbot.
5. **Audit móvil** estructurado en 375px y 414px sobre el resto de secciones.

---

## Sección 1 · Polish cinematográfico del juego

### Núcleo (sobre el canvas existente, no se reescribe el motor)

- **Glow/bloom** en sprites importantes (ambulancia, escudo, sirena): segundo pase con `ctx.shadowBlur` y opacidad reducida.
- **Screen shake** en colisiones con baches/conos: translación aleatoria del canvas durante 200ms, decaimiento lineal.
- **Slow-mo + flash blanco** al cruzar nuevo récord: `dt` × 0.3 durante 800ms.
- **Sirena pulsante**: halo rojo/azul alterno alrededor de la ambulancia, sincronizado con el beep.
- **Faros de Rex**: cono amarillo tenue hacia adelante.

### Capas detrás del canvas

- **Parallax** de 3 capas (montañas lejanas / silueta de ciudad / vallas) moviéndose a 0.2x, 0.5x y 1x. Implementado con `transform` CSS sobre divs absolutos detrás del `<canvas>`.
- **Ciclo día/noche** cada ~45s. Gradient del cielo cambia, estrellas aparecen en noche, faros se notan más oscuro.

### Partículas (nuevo módulo `components/game/effects.ts`)

- Pool de partículas reusables (humo gris desde escape, chispas naranja en colisión, polvo café al esquivar bache por poco). Cap configurable según gama del dispositivo.

### Audio dinámico (`components/game/audio.ts`)

- **12 pistas chiptune** (hoy hay 5): 4 calmas, 4 normales, 3 intensas, 1 jingle de victoria. Todas procedurales, cero archivos.
- **Rotación dinámica** durante la partida: la pista activa cambia cada ~25s o cuando el score cruza tier (calma <30, normal 30–80, intensa 80+). Cross-fade de 1s.
- **Jingle de victoria** corto al cruzar 50/100/200 pts. Se reproduce encima de la BGM, no la corta.
- **Wave/sfx existentes** (`sfxPickup`, `sfxRescue`, `sfxHit`, `sfxGameOver`) se mantienen.

### Intro animada estilo Capcom

- Al pulsar "Comenzar", el título "REX AL RESCATE" entra deslizando con flash blanco; luego un "🐕 PUSH START" parpadea. ~2s totales.

### Adaptación a móvil / dispositivos modestos

- **Auto-detección lite-mode** al inicio:
  - Condición: `navigator.hardwareConcurrency < 4` **o** `devicePixelRatio < 2` **o** `matchMedia("(max-width: 640px)")` **o** termal throttling detectado.
  - En lite: parallax a 2 capas, cap de partículas a 30 (vs 80 desktop), screen-shake con amplitud al 50%, bloom desactivado (sólo `shadowBlur` bajo).
- **Cap de FPS a 45** en móvil si detectamos caída sostenida del `dt` real vs target durante >2s.
- **Sprite virtual**: el render se sigue haciendo en unidades virtuales, así que aumentar el sprite no consume área de juego.
- **Controles táctiles** no cambian. La zona de tap se mantiene.

### Balance de spawn rates (`components/game/config.ts`)

Reducción drástica de la frecuencia del medkit, con redistribución a rescates y power-ups útiles. Mantiene Fácil amable pero sin regalar curación.

|          | Fácil | Normal | Difícil |
|----------|-------|--------|---------|
| car      | 38%   | 32%    | 22%     |
| shield   | 20%   | 12%    | 11%     |
| fuel     | 14%   | 10%    | 8%      |
| pothole  | 12%   | 22%    | 30%     |
| cone     | 10%   | 20%    | 27%     |
| medkit   | 6%    | 4%     | 2%      |

Antes: medkit 12 / 10 / 7 %.

### Stretch goals (NO en este alcance)

- Boss fight (tornado o camión gigante) cada 100 pts.
- Shaders WebGL avanzados (refracción real).

---

## Sección 2 · Rediseño del sprite de Rex

### Composición

- Se mantiene la vista top-down con Rex visible a través del parabrisas.
- El sprite de la ambulancia crece de **18×22** a **24×28** píxeles para dar más espacio a la cara de Rex.

### Estilo Rex (San Bernardo rescatista)

- **Cara blanca** con manchas tan/café en hocico y alrededor de los ojos (estilo San Bernardo real).
- **Orejas largas que cuelgan** a los lados (no triángulos arriba).
- **Hocico marcado** con nariz negra grande, boca con lengüita rosa.
- **Gorra roja** con cruz blanca encima de la cabeza.
- **4 frames de animación**: idle (parpadeo cada 2s), drift-izquierda (orejas vuelan a la derecha), drift-derecha (al revés), hit (ojos cerrados + lengua de fuera).

### Sprite alterno cuerpo entero (~32×32)

- Para pantalla de inicio y game-over: Rex sentado con gorra, pata levantada saludando.
- Reusable en el chatbot: `RexAvatar` lo usa al tamaño actual (64px en burbuja, 30-44px en chat).

### Lo que NO cambia

- La paleta de colores base.
- Sprites de otros vehículos (carro varado, camioneta, moto) y power-ups.
- El medkit cambia solo en spawn-rate, no en sprite.

---

## Sección 3 · Personalidad perruna del chatbot

### 3A · Reglas fijas (`components/chatbot/knowledge-base.ts`)

- Sazonado: una onomatopeya/verbo perruno por respuesta cuando encaje (saludo, sorpresa, despedida, agradecimiento). Verbos: "olfateo", "huelo", "meneo la cola", "a tus pies", "husmeo".
- **Nueva regla "juego"** con keywords `["juego", "jugar", "rex al rescate", "ambulancia", "minijuego"]`:
  > "¡Guau guau! 🐕‍🦺 Sí tengo un mini-juego en la página: **Rex al Rescate**. Conduzco una ambulancia esquivando baches y rescatando carros varados. Le picas al botón 🐕 en el menú de arriba. ¿Le entras?"

  Sugerencias: `["¿Cómo se juega?", "¿Tiene dificultades?", "Easter eggs"]`.

- **Nueva regla "cómo se juega / controles"**: explica flechas en PC y tap/swipe en móvil, modos Fácil/Normal/Difícil, power-ups Escudo/Gasolina/Kit.
- **Nueva regla "dificultades"**: resumen breve de los 3 modos.

### 3B · IA system prompt (`app/api/rex/route.ts`)

- **Nueva sección "TONO PERRUNO"** que pide:
  - 1 ladrido/onomatopeya cuando encaje (NO en cada mensaje).
  - Verbos perrunos sutiles ("olfateo", "huelo", "a tus pies").
  - Evitar muletilla repetitiva.
- **Punto 9 (juego)** ampliado con frases ejemplo perrunas: "¡Guau! Tengo un mini-juego donde olfateo carros varados...".
- **Easter egg disculpa** reescrito: tono perro lloriqueando — `"Auuu... 😔"`, `"*orejas caídas*"`, `"wuf... wuf..."`. Sin frases pomposas humanas.
- **Easter egg furia** (1% rage mode, `Math.random() < 0.01`): override actual de albures mexicanos se reemplaza por **gruñido territorial perruno**:
  - `"¡GRRRR! ¡GUAU GUAU GUAU! 🔥"`.
  - Ladrar agresivo, marcar territorio, no usar albures ni groserías humanas.
  - Remate: `"...*resopla y se va a su rincón* 🐕"`.
  - Frecuencia se queda en 1%.

### 3C · Burbujas proactivas FACTS (`components/chatbot/knowledge-base.ts`)

- Hoy son 9, suben a **13** mezclando 4 sobre el juego:
  - `"¿Ya jugaste Rex al Rescate? 🐕🚑"`
  - `"En el juego escondo easter eggs 🤫"`
  - `"Reto: rescata 10 carros sin chocar 🏆"`
  - `"¿Modo Difícil? Cuidado con mis baches 🕳️"`
- Se suaviza redacción de las existentes para acordar con el nuevo tono perruno (ej. "¿Tienes una duda? Clic en mi icono..." → "¿Dudas? Píllame con un clic, te escucho con la oreja parada 👂").

### Fuera de alcance

- Voz/TTS para Rex.
- Easter eggs adicionales (sólo "emparrunamos" los 2 existentes).

---

## Sección 4 · Bugs móviles confirmados

### Bug 1 · "Somos Copiloto..." en lugar de "Somos el copiloto..."

**Archivo:** `components/sections/about.tsx` líneas 50–65.

**Causa:** El `<h2>` usa `text-balance` + `tracking-tight`. La copia se renderiza en tres `<BlurText>` separados, cada palabra envuelta en `motion.span` con `inline-block`. En móvil con `text-4xl`, el algoritmo de balance colapsa la palabra muy corta "el" o la desborda fuera del flujo visible.

**Fix:**
- Quitar `text-balance` del `<h2>`.
- Reemplazar las 3 líneas separadas (`<BlurText text="Somos" />`, `<BlurText text="el copiloto que nunca" />`, etc.) por **una sola `<BlurText>`** con todo el texto natural; el efecto se mantiene por palabra.
- Bajar a `text-3xl` en mobile (`text-3xl sm:text-5xl md:text-6xl`) para evitar overflow.

### Bug 2 · CountUp se queda en 0 en móvil

**Archivo:** `components/ui/count-up.tsx`.

**Causa:** `useInView(ref, { once: true, margin: "-80px" })` excluye 80px de cada borde del viewport. En móvil, las tarjetas Stats están al final de la sección "Quiénes somos" y nunca cruzan la zona detectada antes de que el usuario haga scroll rápido. El observer nunca dispara → `inView` queda `false` → `value` se queda en 0.

**Fix:**
- Cambiar `margin: "-80px"` por `amount: 0.2` (dispara cuando el 20% del elemento es visible — fiable en cualquier tamaño).
- Fallback defensivo: si después de 1.5s `inView` sigue `false` pero `ref.current.getBoundingClientRect().top < window.innerHeight`, forzar inicio de la animación.

### Bug 3 · Botón de centrar mapa no visible en móvil

**Archivo:** `components/ui/live-map.tsx` líneas 246–252.

**Causa:** El botón "centrar" está `absolute bottom-14 right-3` dentro del contenedor del mapa, pero el avatar flotante del chatbot (`fixed z-[71] bottom-5 right-5`) se superpone porque está en el stacking context del viewport. En desktop hay espacio horizontal de sobra; en móvil chocan.

**Fix:**
- **Mover el botón "centrar" FUERA del `<MapContainer>`**: queda en una franja arriba del mapa, junto a los chips de servicios (o debajo del mapa, ver paso de implementación para decidir lo que se ve mejor).
- Mover también el indicador "X resultados cercanos" fuera, así el mapa queda limpio para gesto táctil.
- **Reducir altura del mapa en móvil** (hoy `minHeight: 320`) a un valor proporcional al viewport (ej. `60vh` con cap `420px`) para que se vea más completo sin scroll.

---

## Sección 5 · Audit móvil de otras secciones

Pase de revisión estructurado en Chrome DevTools con viewports 375×667 (iPhone SE) y 414×896 (iPhone XR).

### Checklist

- **Navbar** (`components/layout/navbar.tsx`): menú hamburguesa abre/cierra, sin overflow horizontal, botón "🐕 Rex al Rescate" no cortado.
- **Hero** (`components/sections/hero.tsx`): título no se parte mal, CTAs caben sin scroll horizontal, `<sos-cartoon>` escala correctamente.
- **Servicios** (`components/sections/services.tsx`): grid de 8 servicios en 2 columnas sin descuadre.
- **Features** (`components/sections/features.tsx`): cards con altura consistente.
- **Pricing** (`components/sections/pricing.tsx`): toggle Free/Premium ≥44px touch target, lista no desborda.
- **Testimonials** (`components/sections/testimonials.tsx`): carousel/marquee se pausa al tap, no auto-scroll infinito.
- **FAQ** (`components/sections/faq.tsx`): accordions tappables, no tan altos que tapen el siguiente.
- **Contact** (`components/sections/contact.tsx`): formulario con `inputmode` correcto, teclado virtual no tapa submit.
- **Footer** (`components/layout/footer.tsx`): 1 columna, links tappables.
- **Game container** (`app/game/page.tsx`): canvas escala, controles táctiles no hacen scroll de la página.
- **Chatbot widget** (`components/chatbot/rex-widget.tsx`): chat dentro de viewport menos navbar, burbuja proactiva no se solapa con FAB, form de soporte scrollable.

### Política

- Bug claro → se arregla.
- Estética dudosa → se anota y se enseña antes de tocar.
- No se refactoriza nada que no esté roto.
- No se cambia copy ni se agregan features.

---

## Arquitectura y orden de implementación

Las cinco secciones son mayormente independientes, pero hay un orden razonable:

1. **Sección 4 (bugs móviles confirmados)** — arreglos quirúrgicos y de bajo riesgo. Lanza primero.
2. **Sección 5 (audit móvil)** — corre justo después; el audit puede revelar más fixes pequeños.
3. **Sección 3 (chatbot perruno)** — edits a archivos de texto, sin efectos colaterales en otras secciones. Se puede paralelizar con 4 y 5.
4. **Sección 2 (rediseño Rex sprite)** — autocontenido en `components/game/sprites.ts`. Visualmente independiente del polish.
5. **Sección 1 (polish cinematográfico)** — el más invasivo en `rescue-runner.tsx` y crea `effects.ts`. Va al final porque depende del nuevo sprite y se beneficia de saber qué quedó arreglado en móvil.

## Criterios de éxito

- En PC: el juego se siente cinematográfico, Rex se reconoce como San Bernardo a primera vista, el chatbot mete "Guau" sin saturar y los easter eggs son perrunos.
- En móvil (375px y 414px): "Somos el copiloto..." se ve completo, el contador llega a 8+, el botón de centrar mapa es accesible sin tapar nada, el juego corre fluido sin sobrecalentar.
- Sin regresiones en el flujo principal (SOS, mapa, planes, contacto).

## Fuera de alcance

- Cualquier cambio a la app móvil (Expo / iOS / Android).
- Refactor de la base CSS o paleta de marca.
- Boss fights en el juego.
- Sistema de logros/leaderboard.
- TTS o voz para Rex.
- Nuevos easter eggs además de los dos existentes.
