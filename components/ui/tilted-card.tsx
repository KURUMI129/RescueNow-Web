"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TiltedCard({
  children,
  className,
  intensity = 10,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sx = useSpring(rx, { stiffness: 240, damping: 18 });
  const sy = useSpring(ry, { stiffness: 240, damping: 18 });
  const transform = useMotionTemplate`perspective(1000px) rotateX(${sx}deg) rotateY(${sy}deg)`;

  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const spot = useMotionTemplate`radial-gradient(320px circle at ${mx}% ${my}%, rgba(225,29,72,0.18), transparent 60%)`;

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    ry.set((x - 0.5) * intensity * 2);
    rx.set(-(y - 0.5) * intensity * 2);
    mx.set(x * 100);
    my.set(y * 100);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: spot }}
      />
    </motion.div>
  );
}
