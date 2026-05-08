import type { Metadata } from "next";
import { RescueRunner } from "@/components/game/rescue-runner";

export const metadata: Metadata = {
  title: "Rex al Rescate 🎮 | RescueNow",
  description:
    "Juega Rex al Rescate: un mini juego retro donde Rex conduce la ambulancia y salva vehículos varados. ¡Esquiva obstáculos y consigue la mayor puntuación!",
};

export default function GamePage() {
  return <RescueRunner />;
}
