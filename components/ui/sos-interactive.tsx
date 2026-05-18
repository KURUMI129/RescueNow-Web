"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase =
  | "idle"
  | "detected"
  | "countdown"
  | "cancelled"
  | "calling-911"
  | "sending-medical"
  | "notifying-contact"
  | "complete";

const COUNTDOWN_FROM = 10;

export function SosInteractive() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(COUNTDOWN_FROM);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const triggeredCancelRef = useRef(false);

  const clearTimers = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
  };

  const reset = useCallback(() => {
    clearTimers();
    setCount(COUNTDOWN_FROM);
    setPhase("idle");
    triggeredCancelRef.current = false;
  }, []);

  // Auto-advance after terminal states
  useEffect(() => {
    if (phase === "cancelled" || phase === "complete") {
      timerRef.current = setTimeout(reset, 3200);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase, reset]);

  // Sending sequence
  useEffect(() => {
    if (phase === "calling-911") {
      timerRef.current = setTimeout(() => setPhase("sending-medical"), 1400);
    } else if (phase === "sending-medical") {
      timerRef.current = setTimeout(() => setPhase("notifying-contact"), 1400);
    } else if (phase === "notifying-contact") {
      timerRef.current = setTimeout(() => setPhase("complete"), 1400);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase]);

  // Detection flash then countdown
  useEffect(() => {
    if (phase === "detected") {
      timerRef.current = setTimeout(() => {
        setPhase("countdown");
      }, 900);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [phase]);

  // Countdown tick
  useEffect(() => {
    if (phase !== "countdown") return;
    setCount(COUNTDOWN_FROM);
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          // Move to sending sequence
          setTimeout(() => setPhase("calling-911"), 60);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const triggerCrash = () => {
    if (phase !== "idle") return;
    setPhase("detected");
  };

  const cancelSOS = () => {
    if (phase !== "countdown" || triggeredCancelRef.current) return;
    triggeredCancelRef.current = true;
    clearTimers();
    setPhase("cancelled");
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#0F172A] to-[#1E1B4B] flex items-center justify-center p-3 sm:p-4">
      {/* Background subtle dots */}
      <BgDots />

      {/* Phone frame — escala a la altura del contenedor manteniendo aspect ratio */}
      <div className="relative z-10 h-full max-h-[520px] aspect-[9/19] rounded-[32px] bg-black p-1.5 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6),inset_0_0_0_2px_rgba(255,255,255,0.08)]">
        {/* Phone notch */}
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30 h-4 w-16 rounded-b-2xl bg-black" />
        {/* Phone screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[26px]" style={{ background: screenBg(phase) }}>
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-2 text-[10px] font-bold text-white/90">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span>📶</span>
              <span>🔋</span>
            </span>
          </div>

          {/* Scene */}
          <AnimatePresence mode="wait">
            {phase === "idle" && <SceneIdle key="idle" onTrigger={triggerCrash} />}
            {phase === "detected" && <SceneDetected key="detected" />}
            {phase === "countdown" && (
              <SceneCountdown key="countdown" count={count} onCancel={cancelSOS} />
            )}
            {phase === "cancelled" && <SceneCancelled key="cancelled" />}
            {phase === "calling-911" && <SceneSending key="911" step={1} />}
            {phase === "sending-medical" && <SceneSending key="med" step={2} />}
            {phase === "notifying-contact" && <SceneSending key="ctc" step={3} />}
            {phase === "complete" && <SceneComplete key="done" />}
          </AnimatePresence>
        </div>
      </div>

      {/* Badge bottom-left */}
      <div className="pointer-events-none absolute top-3 left-3 z-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-crimson/95 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          Demo Interactiva
        </span>
      </div>
    </div>
  );
}

function screenBg(phase: Phase): string {
  if (phase === "countdown") return "linear-gradient(180deg, #7F1D1D 0%, #E11D48 100%)";
  if (phase === "detected") return "linear-gradient(180deg, #4C1D95 0%, #7C2D12 100%)";
  if (phase === "cancelled") return "linear-gradient(180deg, #064E3B 0%, #047857 100%)";
  if (phase === "calling-911" || phase === "sending-medical" || phase === "notifying-contact")
    return "linear-gradient(180deg, #0C1E3A 0%, #1E1B4B 100%)";
  if (phase === "complete") return "linear-gradient(180deg, #064E3B 0%, #047857 100%)";
  return "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)";
}

/* ── SCENES ───────────────────────────────────────── */

function SceneIdle({ onTrigger }: { onTrigger: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
    >
      <div className="mb-3 text-4xl">🚗💨</div>
      <p className="text-white/85 text-xs font-bold leading-snug">
        Simula una emergencia
      </p>
      <p className="mt-1 text-white/55 text-[10px] leading-snug max-w-[160px]">
        Toca para activar la detección automática de choques
      </p>
      <motion.button
        onClick={onTrigger}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.04 }}
        className="mt-5 rounded-full bg-brand-crimson px-5 py-2 text-xs font-extrabold text-white shadow-lg shadow-brand-crimson/40"
      >
        💥 Simular choque
      </motion.button>
      <p className="absolute bottom-2 left-0 right-0 text-center text-[8px] text-white/40 px-3">
        Detectamos impactos &gt; 4G con el acelerómetro
      </p>
    </motion.div>
  );
}

function SceneDetected() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.4, repeat: 1 }}
        className="text-5xl mb-2"
      >
        💥
      </motion.div>
      <p className="text-white text-sm font-black uppercase tracking-wider">
        Impacto detectado
      </p>
      <p className="mt-1 text-white/80 text-[11px] font-bold">4.2 G · Confirmado</p>
      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-white/70">
        <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 animate-pulse" />
        Iniciando protocolo SOS
      </div>
    </motion.div>
  );
}

function SceneCountdown({ count, onCancel }: { count: number; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-between p-4"
    >
      <div className="mt-5 text-center">
        <p className="text-white/90 text-[10px] font-bold uppercase tracking-widest">
          Llamando al 911 en
        </p>
        <p className="mt-1 text-white/60 text-[9px]">Cancela si fue falsa alarma</p>
      </div>

      <motion.span
        key={count}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.4, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
        className="font-display font-black text-white select-none leading-none"
        style={{
          fontSize: "clamp(4rem, 10vw, 5.5rem)",
          textShadow: "0 0 24px rgba(255,255,255,0.4)",
        }}
      >
        {count}
      </motion.span>

      <motion.button
        onClick={onCancel}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.03 }}
        className="mb-4 rounded-full bg-white px-5 py-2.5 text-xs font-black text-brand-crimson shadow-2xl"
        style={{ boxShadow: "0 0 32px rgba(255,255,255,0.45)" }}
      >
        CANCELAR SOS
      </motion.button>
    </motion.div>
  );
}

function SceneCancelled() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
        className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-2xl"
      >
        ✓
      </motion.div>
      <p className="mt-3 text-white text-sm font-black uppercase tracking-wider">
        Falsa alarma
      </p>
      <p className="mt-1 text-white/80 text-[11px]">SOS cancelado a tiempo</p>
      <p className="mt-3 text-white/50 text-[9px]">Reiniciando demo...</p>
    </motion.div>
  );
}

function SceneSending({ step }: { step: 1 | 2 | 3 }) {
  const items = [
    { emoji: "📞", title: "Llamando al 911", subtitle: "Ubicación enviada", color: "#E11D48" },
    { emoji: "🏥", title: "Ficha médica S.O.S.", subtitle: "Tipo de sangre, alergias", color: "#0EA5E9" },
    { emoji: "👨‍👩‍👧", title: "Contacto de confianza", subtitle: "Notificado por WhatsApp", color: "#F59E0B" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center px-3 gap-2"
    >
      {items.map((it, i) => {
        const idx = i + 1;
        const isDone = idx < step;
        const isActive = idx === step;
        const isPending = idx > step;
        return (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: isPending ? 0.3 : 1,
              x: 0,
            }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 w-full rounded-xl bg-white/10 backdrop-blur-sm px-2.5 py-2 border border-white/10"
          >
            <div
              className="flex-none h-8 w-8 rounded-full flex items-center justify-center text-sm"
              style={{ background: isDone ? "#10B981" : isActive ? it.color : "#475569" }}
            >
              {isDone ? "✓" : it.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[10px] font-black uppercase tracking-wider truncate">
                {it.title}
              </p>
              <p className="text-white/70 text-[9px] truncate">{it.subtitle}</p>
            </div>
            {isActive && (
              <div className="flex gap-0.5">
                {[0, 1, 2].map((d) => (
                  <motion.span
                    key={d}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.2 }}
                    className="h-1 w-1 rounded-full bg-white"
                  />
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function SceneComplete() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="h-16 w-16 rounded-full bg-white flex items-center justify-center text-3xl"
      >
        🚑
      </motion.div>
      <p className="mt-3 text-white text-sm font-black uppercase tracking-wider">
        Ayuda en camino
      </p>
      <p className="mt-1 text-white/85 text-[11px]">911 confirmó el llamado</p>
      <p className="mt-2 text-white/60 text-[9px] max-w-[180px]">
        Mantén la calma. Los servicios de emergencia ya tienen tu ubicación.
      </p>
    </motion.div>
  );
}

function BgDots() {
  return (
    <svg aria-hidden className="absolute inset-0 z-0 opacity-20" preserveAspectRatio="none">
      <defs>
        <pattern id="sos-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#fff" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#sos-dots)" />
    </svg>
  );
}
