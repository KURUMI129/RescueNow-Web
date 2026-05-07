# RescueNow - Landing Page

Landing page oficial de **RescueNow**, la app de emergencias y asistencia vial con IA.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm start
```

## Estructura

```
app/
  layout.tsx           Layout raiz + fonts + theme provider
  page.tsx             Landing page (ensamble de secciones)
  globals.css          Tokens CSS + utilities

components/
  ui/                  Primitivos reutilizables (animaciones, efectos)
  sections/            Secciones de la landing (hero, about, pricing, etc.)
  theme/               Theme provider + toggle
```
