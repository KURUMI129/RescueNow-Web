import type { BlogPost } from "@/lib/blog";

import { post as accidenteVial } from "./que-hacer-accidente-vial-mexico";
import { post as fichaMedica } from "./ficha-medica-emergencia";
import { post as horaDorada } from "./hora-dorada-rescate";
import { post as sinBateria } from "./sin-bateria-varado-carretera";
import { post as familiarNoContesta } from "./familiar-no-contesta-accidente";

export const POSTS: BlogPost[] = [
  accidenteVial,
  fichaMedica,
  horaDorada,
  sinBateria,
  familiarNoContesta,
].sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPostBySlug(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}
