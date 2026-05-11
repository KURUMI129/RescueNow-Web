/** Difficulty presets for Rex al Rescate */

export type Difficulty = "easy" | "normal" | "hard";

/** Spawn probability for each entity type (must sum to 1.0) */
export interface SpawnRates {
  car: number;
  pothole: number;
  cone: number;
  shield: number;
  fuel: number;
  medkit: number;
}

export interface DifficultyConfig {
  label: string;
  emoji: string;
  lives: number;
  baseSpeed: number;
  speedInc: number;
  /** Frames between spawns (higher = less frequent). At 60fps: 120 = every 2s */
  spawnInterval: number;
  /** Minimum spawn interval even at high scores */
  minSpawnInterval: number;
  /** How many points before spawn interval decreases by 1 frame */
  spawnAccelEvery: number;
  /** Entity spawn distribution */
  spawnRates: SpawnRates;
  description: string;
}

export const DIFFICULTIES: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: "Fácil",
    emoji: "🟢",
    lives: 4,
    baseSpeed: 2.2,
    speedInc: 0.08,
    spawnInterval: 130,    // ~2.2 seconds between spawns
    minSpawnInterval: 70,  // never faster than ~1.2s
    spawnAccelEvery: 800,  // slow acceleration
    spawnRates: {
      car: 0.38,      // rescatable — the fun part
      pothole: 0.12,  // few obstacles
      cone: 0.10,
      shield: 0.20,   // generous power-ups
      fuel: 0.14,
      medkit: 0.06,
    },
    description: "Más vidas, más power-ups y pocos obstáculos. Ideal para niños.",
  },
  normal: {
    label: "Normal",
    emoji: "🟡",
    lives: 3,
    baseSpeed: 3,
    speedInc: 0.12,
    spawnInterval: 90,     // ~1.5 seconds between spawns
    minSpawnInterval: 45,  // gets to ~0.75s at high scores
    spawnAccelEvery: 500,
    spawnRates: {
      car: 0.32,
      pothole: 0.22,
      cone: 0.20,
      shield: 0.12,
      fuel: 0.10,
      medkit: 0.04,
    },
    description: "Equilibrio entre reto y diversión. El modo estándar.",
  },
  hard: {
    label: "Difícil",
    emoji: "🔴",
    lives: 2,
    baseSpeed: 3.8,
    speedInc: 0.18,
    spawnInterval: 65,     // ~1.1 seconds between spawns
    minSpawnInterval: 30,  // gets chaotic fast
    spawnAccelEvery: 300,
    spawnRates: {
      car: 0.22,
      pothole: 0.30,  // lots of obstacles
      cone: 0.27,
      shield: 0.11,   // rare power-ups
      fuel: 0.08,
      medkit: 0.02,
    },
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
