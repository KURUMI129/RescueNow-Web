import type { Metadata } from "next";
import { RescueRunner } from "@/components/game/rescue-runner";

export const metadata: Metadata = {
  title: "Rex al Rescate 🎮 | RescueNow",
  description:
    "Juega Rex al Rescate: un mini juego retro donde Rex conduce la ambulancia y salva vehículos varados. ¡Esquiva obstáculos y consigue la mayor puntuación!",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐕</text></svg>",
  },
};

export default function GamePage() {
  return <RescueRunner />;
}
