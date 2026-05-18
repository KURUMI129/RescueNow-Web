import type { ComponentType } from "react";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readMinutes: number;
  heroEmoji: string;
  heroGradient: string;
  Content: ComponentType;
};
