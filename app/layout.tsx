import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";

import { ThemeProvider } from "@/components/theme/theme-provider";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rescuenow.me"),
  title: "RescueNow · Emergencias y asistencia vial con IA",
  description:
    "App mexicana de emergencias y asistencia vial. Detección automática de choques, ficha médica S.O.S., mapa en tiempo real y asistente con IA.",
  applicationName: "RescueNow",
  keywords: [
    "RescueNow",
    "emergencias",
    "asistencia vial",
    "SOS",
    "ficha médica",
    "IA",
    "grúa",
    "hospitales",
    "mecánico",
    "México",
  ],
  openGraph: {
    title: "RescueNow · Emergencias y asistencia vial con IA",
    description:
      "Detección automática de choques, ficha médica S.O.S., mapa en tiempo real y asistente con IA.",
    type: "website",
    locale: "es_MX",
    url: "https://rescuenow.me",
    siteName: "RescueNow",
  },
  twitter: {
    card: "summary_large_image",
    title: "RescueNow · El copiloto que nunca te falla",
    description:
      "App mexicana de emergencias y asistencia vial. SOS automático, ficha médica, mapa de servicios y un asistente con IA.",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#080C16" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeInit = `(function(){try{var m=localStorage.getItem('rescuenow.themeMode')||'time';var h=new Date().getHours();var dark=false;if(m==='dark')dark=true;else if(m==='light')dark=false;else if(m==='system')dark=window.matchMedia('(prefers-color-scheme: dark)').matches;else dark=(h>=20||h<7);if(dark)document.documentElement.classList.add('dark');document.documentElement.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
