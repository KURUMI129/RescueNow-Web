"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export function CountUp({
  end,
  duration = 1.6,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const [value, setValue] = useState(0);
  const [forced, setForced] = useState(false);

  // Fallback defensivo: si en 1.5s no disparó pero el elemento está dentro del viewport,
  // forzamos el inicio. Evita el bug en móvil donde el observer no se activa.
  useEffect(() => {
    if (inView || forced) return;
    const t = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setForced(true);
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [inView, forced]);

  useEffect(() => {
    if (!inView && !forced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(end * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, forced, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
