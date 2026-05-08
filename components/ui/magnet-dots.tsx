"use client";

import { useEffect, useRef } from "react";

export function MagnetDots({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    // Cap DPR to 1 — dots are too small to benefit from retina
    const dpr = 1;

    const size = () => {
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.clientWidth * dpr;
      canvas.height = p.clientHeight * dpr;
      canvas.style.width = p.clientWidth + "px";
      canvas.style.height = p.clientHeight + "px";
    };

    size();
    window.addEventListener("resize", size);

    const isDark = () =>
      document.documentElement.classList.contains("dark");

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const gap = 38 * dpr;
      const r = 1.1 * dpr;
      const reach = 100 * dpr;

      const mx = mouse.current.x * dpr;
      const my = mouse.current.y * dpr;

      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const dx = x - mx;
          const dy = y - my;
          const d = Math.sqrt(dx * dx + dy * dy);
          const pull = Math.max(0, 1 - d / reach);
          const ox = -dx * pull * 0.25;
          const oy = -dy * pull * 0.25;
          const alpha = isDark()
            ? 0.18 + pull * 0.5
            : 0.1 + pull * 0.45;
          ctx.beginPath();
          ctx.fillStyle = isDark()
            ? `rgba(248,250,252,${alpha})`
            : `rgba(15,23,42,${alpha})`;
          ctx.arc(x + ox, y + oy, r + pull * r * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className={className}
      aria-hidden
    />
  );
}
