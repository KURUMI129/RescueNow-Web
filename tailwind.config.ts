import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: "#E11D48",
          crimsonDark: "#BE123C",
          medical: "#0EA5E9",
          medicalDark: "#0284C7",
          amber: "#F59E0B",
          gold: "#FFD700",
          goldDark: "#D4AF37",
          success: "#10B981",
          danger: "#EF4444",
        },
        dark: {
          bg: "#080C16",
          surface: "#0B1120",
          surfaceAlt: "#111827",
          border: "rgba(255,255,255,0.08)",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        light: {
          bg: "#F8FAFC",
          surface: "#FFFFFF",
          surfaceAlt: "#F1F5F9",
          border: "rgba(15,23,42,0.08)",
          text: "#0F172A",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      animation: {
        "aurora": "aurora 15s linear infinite",
        "shine": "shine 3s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "spin-slow": "spin 20s linear infinite",
        "heartbeat": "heartbeat 1.1s ease-in-out infinite",
        "siren-shake": "siren-shake 0.5s ease-in-out infinite",
        "car-vibrate": "car-vibrate 0.4s ease-in-out infinite",
        "map-pin-drop": "map-pin-drop 1.2s ease-in-out infinite",
        "bot-nod": "bot-nod 1.4s ease-in-out infinite",
        "shield-glow": "shield-glow 1.6s ease-in-out infinite",
        "flag-wave": "flag-wave 1.6s ease-in-out infinite",
        "sparkle-spin": "sparkle-spin 2s linear infinite",
        "wiggle": "wiggle 0.6s ease-in-out infinite",
        "bounce-sm": "bounce-sm 1.4s ease-in-out infinite",
        "comic-bubble-in": "comic-bubble-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        "dog-jump": "dog-jump 2.6s ease-in-out infinite",
        "ambulance-drive": "ambulance-drive 2s ease-in forwards",
        "character-wobble": "character-wobble 0.6s ease-in-out infinite",
        "sweat-drop": "sweat-drop 1.4s ease-in infinite",
        "countdown-pop": "countdown-pop 1s ease-out forwards",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shine: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "14%": { transform: "scale(1.2)" },
          "28%": { transform: "scale(1)" },
          "42%": { transform: "scale(1.2)" },
          "70%": { transform: "scale(1)" },
        },
        "siren-shake": {
          "0%, 100%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(8deg)" },
        },
        "car-vibrate": {
          "0%, 100%": { transform: "translate(0,0)" },
          "20%": { transform: "translate(-1.5px,1px)" },
          "40%": { transform: "translate(1.5px,-1px)" },
          "60%": { transform: "translate(-1.5px,1px)" },
          "80%": { transform: "translate(1.5px,-1px)" },
        },
        "map-pin-drop": {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(0px)" },
        },
        "bot-nod": {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        "shield-glow": {
          "0%, 100%": { filter: "drop-shadow(0 0 0 rgba(225,29,72,0.0))" },
          "50%": { filter: "drop-shadow(0 0 8px rgba(225,29,72,0.8))" },
        },
        "flag-wave": {
          "0%, 100%": { transform: "rotate(-8deg)" },
          "50%": { transform: "rotate(8deg)" },
        },
        "sparkle-spin": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(4deg)" },
        },
        "bounce-sm": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "comic-bubble-in": {
          "0%": { opacity: "0", transform: "translateY(20px) scale(0.6) rotate(-6deg)" },
          "60%": { opacity: "1", transform: "translateY(-4px) scale(1.08) rotate(1deg)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1) rotate(0deg)" },
        },
        "dog-jump": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "25%": { transform: "translateY(-8px) rotate(-3deg)" },
          "50%": { transform: "translateY(0) rotate(0deg)" },
          "75%": { transform: "translateY(-4px) rotate(3deg)" },
        },
        "ambulance-drive": {
          "0%": { transform: "translateX(120%)" },
          "55%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-160%)" },
        },
        "character-wobble": {
          "0%, 100%": { transform: "rotate(-3deg) translateY(0)" },
          "50%": { transform: "rotate(3deg) translateY(-2px)" },
        },
        "sweat-drop": {
          "0%": { opacity: "0", transform: "translate(0,-4px) scale(0.6)" },
          "30%": { opacity: "1", transform: "translate(0,0) scale(1)" },
          "100%": { opacity: "0", transform: "translate(0,18px) scale(0.6)" },
        },
        "countdown-pop": {
          "0%": { transform: "scale(0.2)", opacity: "0" },
          "30%": { transform: "scale(1.4)", opacity: "1" },
          "70%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.6)", opacity: "0" },
        },
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
