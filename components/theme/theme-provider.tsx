"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "time" | "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: ResolvedTheme;
  setMode: (m: ThemeMode) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = "rescuenow.themeMode";

function resolveTime(date: Date): ResolvedTheme {
  const h = date.getHours();
  return h >= 20 || h < 7 ? "dark" : "light";
}

function getSystem(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("time");
  const [resolved, setResolved] = useState<ResolvedTheme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ["time", "system", "light", "dark"].includes(saved)) {
        setModeState(saved);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    const compute = () => {
      if (mode === "light") return setResolved("light");
      if (mode === "dark") return setResolved("dark");
      if (mode === "system") return setResolved(getSystem());
      return setResolved(resolveTime(new Date()));
    };
    compute();

    if (mode === "time") {
      const id = setInterval(compute, 60_000);
      return () => clearInterval(id);
    }
    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => compute();
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, [mode]);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (resolved === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = resolved;
  }, [resolved, ready]);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {}
  };

  const toggle = () => setMode(resolved === "dark" ? "light" : "dark");

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, resolved, setMode, toggle }),
    [mode, resolved],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
