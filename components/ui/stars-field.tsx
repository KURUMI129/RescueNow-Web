"use client";

import { useEffect, useRef } from "react";

export function StarsField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Cap DPR to 1 — sub-pixel dots don't benefit from retina
    const dpr = 1;
    let raf = 0;
    let stars: { x: number; y: number; r: number; a: number; t: number }[] = [];

    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.clientWidth * dpr;
      canvas.height = p.clientHeight * dpr;
      canvas.style.width = p.clientWidth + "px";
      canvas.style.height = p.clientHeight + "px";
      const count = Math.floor((canvas.width * canvas.height) / 18000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 * dpr + 0.4 * dpr,
        a: Math.random() * Math.PI * 2,
        t: 0.5 + Math.random() * 1.5,
      }));
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const isDark =
        document.documentElement.classList.contains("dark");
      if (!isDark) {
        raf = requestAnimationFrame(tick);
        return;
      }
      for (const s of stars) {
        s.a += 0.02 * s.t;
        const alpha = 0.35 + Math.sin(s.a) * 0.35;
        ctx.beginPath();
        ctx.fillStyle = `rgba(248,250,252,${alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden />;
}
