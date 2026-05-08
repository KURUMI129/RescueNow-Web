/** Difficulty presets for Rex al Rescate */

export type Difficulty = "easy" | "normal" | "hard";

export interface DifficultyConfig {
  label: string;
  emoji: string;
  lives: number;
  baseSpeed: number;
  speedInc: number;
  /** Probability of spawning a power-up (shield/fuel/medkit) vs obstacle */
  powerUpRate: number;
  spawnInterval: number;
  description: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Fácil",
    emoji: "🟢",
    lives: 4,
    baseSpeed: 2.5,
    speedInc: 0.1,
    powerUpRate: 0.30,
    spawnInterval: 60,
    description: "Más vidas, más power-ups y velocidad baja. Ideal para niños.",
  },
  normal: {
    label: "Normal",
    emoji: "🟡",
    lives: 3,
    baseSpeed: 3.2,
    speedInc: 0.15,
    powerUpRate: 0.15,
    spawnInterval: 50,
    description: "Equilibrio entre reto y diversión. El modo estándar.",
  },
  hard: {
    label: "Difícil",
    emoji: "🔴",
    lives: 2,
    baseSpeed: 4,
    speedInc: 0.22,
    powerUpRate: 0.08,
    spawnInterval: 40,
    description: "Menos vidas, casi sin ayuda y velocidad alta. ¿Te atreves?",
  },
};

export const INTRO_LINES = [
  "📡 Alerta de emergencia recibida...",
  "🚗 Hay vehículos varados en la carretera.",
  "🐕 Rex, ¡te necesitamos!",
  "🚑 Conduce la ambulancia y rescátalos.",
  "⚠️ Esquiva baches y conos.",
  "🛡️ Recoge power-ups para sobrevivir.",
  "¡Buena suerte, Rex! 🐾",
];
