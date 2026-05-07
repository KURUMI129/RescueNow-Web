"use client";

import { Clock, Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useTheme, type ThemeMode } from "./theme-provider";

const OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
  { value: "time", label: "Automático (hora)", icon: Clock },
  { value: "system", label: "Sistema", icon: Monitor },
  { value: "light", label: "Claro", icon: Sun },
  { value: "dark", label: "Oscuro", icon: Moon },
];

export function ThemeToggle() {
  const { mode, resolved, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const ActiveIcon = resolved === "dark" ? Moon : Sun;

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Cambiar tema"
        onClick={() => setOpen((o) => !o)}
        className="glass relative h-10 w-10 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={resolved}
            initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.3 }}
            className="absolute"
          >
            <ActiveIcon className="h-[18px] w-[18px]" />
          </motion.span>
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="glass absolute right-0 mt-2 w-52 rounded-2xl p-1.5 shadow-2xl z-50"
          >
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const active = mode === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setMode(opt.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-crimson/10 text-brand-crimson"
                      : "hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{opt.label}</span>
                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-crimson" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
