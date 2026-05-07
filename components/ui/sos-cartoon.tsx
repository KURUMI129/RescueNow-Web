"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Scene =
  | "driving"
  | "impact"
  | "aftermath"
  | "count3"
  | "count2"
  | "count1"
  | "ambulance"
  | "rescued"
  | "end";

const TIMELINE: { scene: Scene; ms: number }[] = [
  { scene: "driving", ms: 2200 },
  { scene: "impact", ms: 900 },
  { scene: "aftermath", ms: 1600 },
  { scene: "count3", ms: 650 },
  { scene: "count2", ms: 650 },
  { scene: "count1", ms: 650 },
  { scene: "ambulance", ms: 1800 },
  { scene: "rescued", ms: 1600 },
  { scene: "end", ms: 1200 },
];

export function SosCartoon() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % TIMELINE.length);
    }, TIMELINE[idx].ms);
    return () => clearTimeout(t);
  }, [idx]);

  const scene = TIMELINE[idx].scene;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl isolate bg-[#F5E9D1] dark:bg-[#1A1208]">
      <HalftoneBackground scene={scene} />
      <SpeedLines show={scene === "ambulance" || scene === "driving"} />
      <Road />

      <div className="absolute top-3 left-4 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-black px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-crimson animate-ping" />
          SOS · Demo
        </span>
      </div>

      <div className="absolute top-3 right-4 z-10 text-[10px] font-black uppercase tracking-[0.25em] text-black/70 dark:text-white/70">
        cuenta regresiva · 10s
      </div>

      <AnimatePresence mode="popLayout">
        {scene === "driving" && <SceneDriving key="driving" />}
        {scene === "impact" && <SceneImpact key="impact" />}
        {scene === "aftermath" && <SceneAftermath key="aftermath" />}
        {(scene === "count3" || scene === "count2" || scene === "count1") && (
          <SceneCountdown
            key={scene}
            n={scene === "count3" ? 3 : scene === "count2" ? 2 : 1}
          />
        )}
        {scene === "ambulance" && <SceneAmbulance key="ambulance" />}
        {scene === "rescued" && <SceneRescued key="rescued" />}
        {scene === "end" && <SceneEnd key="end" />}
      </AnimatePresence>

      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-1.5 z-[5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0B1120 0 14px, #FFD700 14px 28px)",
        }}
      />
    </div>
  );
}

function SceneDriving() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
    >
      <motion.div
        className="absolute bottom-[18%] left-0"
        initial={{ x: "-40%" }}
        animate={{ x: "25%" }}
        transition={{ duration: 2, ease: "linear" }}
      >
        <CarA />
      </motion.div>

      <motion.div
        className="absolute bottom-[14%] right-0"
        initial={{ x: "40%" }}
        animate={{ x: "-25%" }}
        transition={{ duration: 2, ease: "linear" }}
      >
        <Motorcycle />
      </motion.div>

      <ComicText text="Todo tranquilo..." x="50%" y="18%" color="#0B1120" small />
    </motion.div>
  );
}

function SceneImpact() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
    >
      <motion.div
        animate={{ x: [0, -6, 6, -3, 0], y: [0, -3, 2, -1, 0] }}
        transition={{ duration: 0.3, repeat: 2 }}
        className="absolute inset-0"
      >
        <div
          className="absolute bottom-[18%] left-[36%]"
          style={{ transform: "rotate(-4deg)" }}
        >
          <CarA squashed />
        </div>
        <div
          className="absolute bottom-[8%] left-[52%]"
          style={{ transform: "rotate(30deg)" }}
        >
          <Motorcycle fallen />
        </div>
      </motion.div>

      <ImpactBurst />
      <ComicText text="¡CRASH!" x="46%" y="25%" color="#E11D48" />
    </motion.div>
  );
}

function SceneAftermath() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
    >
      <div
        className="absolute bottom-[18%] left-[34%]"
        style={{ transform: "rotate(-4deg)" }}
      >
        <CarA squashed smoke />
      </div>
      <div
        className="absolute bottom-[8%] left-[54%]"
        style={{ transform: "rotate(30deg)" }}
      >
        <Motorcycle fallen />
      </div>

      <div className="absolute bottom-[18%] left-[58%]">
        <RiderFallen />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 pointer-events-none"
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
            <motion.span
              key={i}
              className="absolute text-xl"
              style={{
                left: "50%",
                top: "50%",
                transform: `rotate(${deg}deg) translate(-50%, -34px)`,
                transformOrigin: "center",
              }}
              animate={{ scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.12,
              }}
            >
              ⭐
            </motion.span>
          ))}
        </motion.div>
      </div>

      <ComicText text="¡Ayuda!" x="55%" y="30%" color="#0B1120" small />
    </motion.div>
  );
}

function SceneCountdown({ n }: { n: number }) {
  return (
    <motion.div
      initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 2.2, opacity: 0, rotate: 15 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative text-center">
        <motion.span
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.55, repeat: Infinity }}
          className="font-display font-black select-none block"
          style={{
            fontSize: "clamp(7rem, 20vw, 13rem)",
            color: "#E11D48",
            WebkitTextStroke: "6px #0B1120",
            textShadow:
              "10px 10px 0 rgba(11,17,32,0.9), 0 0 40px rgba(225,29,72,0.6)",
            lineHeight: 1,
          }}
        >
          {n}
        </motion.span>
        <span
          className="font-display font-black text-xl uppercase tracking-[0.2em]"
          style={{ color: "#0B1120", textShadow: "2px 2px 0 #F5E9D1" }}
        >
          segundos
        </span>
      </div>

      <div className="absolute bottom-6 left-6 scale-75 opacity-80">
        <CarA squashed smoke />
      </div>
      <div className="absolute bottom-4 right-6 scale-75 opacity-80">
        <Motorcycle fallen />
      </div>
    </motion.div>
  );
}

function SceneAmbulance() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
    >
      <div
        className="absolute bottom-[18%] left-[20%]"
        style={{ transform: "rotate(-4deg)" }}
      >
        <CarA squashed smoke />
      </div>
      <div
        className="absolute bottom-[8%] left-[38%]"
        style={{ transform: "rotate(30deg)" }}
      >
        <Motorcycle fallen />
      </div>
      <div className="absolute bottom-[18%] left-[46%]">
        <RiderFallen />
      </div>

      <motion.div
        initial={{ x: "140%" }}
        animate={{ x: ["140%", "60%", "60%"] }}
        transition={{
          duration: 1.6,
          times: [0, 0.7, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute bottom-12 right-0"
      >
        <Ambulance shaking />
      </motion.div>

      <ComicText text="¡NEE-NAW!" x="50%" y="25%" color="#E11D48" />

      <motion.div
        className="absolute bottom-6 right-[52%] h-2"
        initial={{ width: 0 }}
        animate={{ width: 160 }}
        transition={{ duration: 0.6 }}
        style={{
          background: "linear-gradient(90deg, #0B1120 0%, transparent 100%)",
          borderRadius: 2,
        }}
      />
    </motion.div>
  );
}

function SceneRescued() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0"
    >
      <motion.div
        initial={{ x: 0, rotate: 0 }}
        animate={{ x: ["0%", "-180%"], rotate: [0, -2, 2, -2] }}
        transition={{ duration: 1.4, ease: "easeIn", times: [0, 1] }}
        className="absolute bottom-12 right-[8%]"
      >
        <div className="relative">
          <Ambulance shaking />
          <motion.div
            className="absolute -top-12 right-2"
            animate={{ y: [0, -4, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <CharacterOnStretcher />
          </motion.div>
        </div>
      </motion.div>

      <ComicText text="¡A SALVO!" x="50%" y="28%" color="#10B981" />

      <motion.div
        className="absolute bottom-6 right-0 flex gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -40, opacity: [0, 1, 0] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="text-lg"
          >
            💨
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}

function SceneEnd() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="rounded-full px-7 py-3 bg-black text-white"
        style={{
          border: "4px solid #0B1120",
          boxShadow: "8px 8px 0 #E11D48",
        }}
      >
        <span
          className="font-display font-black text-2xl sm:text-4xl italic tracking-wider"
          style={{ fontFamily: "Georgia, serif" }}
        >
          ¡Esto es todo, amigos!
        </span>
      </motion.div>
    </motion.div>
  );
}

function CarA({
  squashed,
  smoke,
}: {
  squashed?: boolean;
  smoke?: boolean;
}) {
  return (
    <div className="relative">
      <svg width="150" height="80" viewBox="0 0 150 80" className="drop-shadow-lg">
        <g stroke="#0B1120" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          <path
            d={
              squashed
                ? "M 14 60 L 14 42 Q 22 36 40 34 L 58 22 L 92 24 L 104 40 L 142 46 L 142 60 Z"
                : "M 10 60 L 10 40 Q 24 30 44 28 L 58 16 L 98 16 L 112 30 L 140 34 L 140 60 Z"
            }
            fill="#0EA5E9"
          />
          {!squashed && (
            <>
              <path d="M 48 20 L 56 20 L 70 32 L 48 32 Z" fill="#7DD3FC" />
              <path d="M 74 20 L 96 20 L 110 32 L 74 32 Z" fill="#7DD3FC" />
            </>
          )}
          {squashed && (
            <>
              <path d="M 55 26 L 60 22 L 70 32 L 52 34 Z" fill="#7DD3FC" />
              <path d="M 76 24 L 92 26 L 100 36 L 72 34 Z" fill="#7DD3FC" />
              <path
                d="M 80 20 L 76 30 M 86 22 L 82 32"
                stroke="#0B1120"
                strokeWidth="2"
                fill="none"
              />
            </>
          )}
          <circle cx="36" cy="62" r="10" fill="#0B1120" />
          <circle cx="36" cy="62" r="4" fill="#F8FAFC" />
          <circle cx="118" cy="62" r="10" fill="#0B1120" />
          <circle cx="118" cy="62" r="4" fill="#F8FAFC" />
          <circle cx="14" cy="42" r="3" fill="#FEF3C7" stroke="#0B1120" strokeWidth="2" />
          <circle cx="138" cy="42" r="3" fill="#E11D48" stroke="#0B1120" strokeWidth="2" />
        </g>
      </svg>
      {smoke && (
        <>
          <motion.span
            className="absolute -top-2 left-[8%] text-2xl"
            animate={{ y: [-4, -30, -40], opacity: [1, 0.6, 0], scale: [0.8, 1.2, 1.5] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            💨
          </motion.span>
          <motion.span
            className="absolute -top-4 left-[14%] text-xl"
            animate={{ y: [-4, -26, -36], opacity: [1, 0.6, 0], scale: [0.7, 1.1, 1.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          >
            💨
          </motion.span>
          <motion.span
            className="absolute top-0 left-[5%] text-sm"
            animate={{ y: [-2, -18, -28], opacity: [1, 0.8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.7 }}
          >
            🔥
          </motion.span>
        </>
      )}
    </div>
  );
}

function Motorcycle({ fallen }: { fallen?: boolean }) {
  return (
    <svg width="110" height="70" viewBox="0 0 110 70" className="drop-shadow">
      <g stroke="#0B1120" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        {!fallen ? (
          <>
            <circle cx="22" cy="48" r="14" fill="#0B1120" />
            <circle cx="22" cy="48" r="6" fill="#F8FAFC" />
            <circle cx="86" cy="48" r="14" fill="#0B1120" />
            <circle cx="86" cy="48" r="6" fill="#F8FAFC" />
            <path
              d="M 22 48 L 48 24 L 76 24 L 86 48"
              fill="none"
              strokeWidth="5"
              stroke="#E11D48"
            />
            <rect x="46" y="22" width="28" height="10" rx="2" fill="#E11D48" />
            <rect x="72" y="16" width="6" height="14" rx="2" fill="#0B1120" />
            <rect x="44" y="16" width="6" height="14" rx="2" fill="#0B1120" />
            <circle cx="62" cy="14" r="9" fill="#F59E0B" />
            <rect x="54" y="2" width="16" height="12" rx="3" fill="#0B1120" />
          </>
        ) : (
          <>
            <circle cx="24" cy="52" r="14" fill="#0B1120" />
            <circle cx="24" cy="52" r="6" fill="#F8FAFC" />
            <circle cx="86" cy="52" r="14" fill="#0B1120" />
            <circle cx="86" cy="52" r="6" fill="#F8FAFC" />
            <path
              d="M 24 52 L 46 48 L 74 48 L 86 52"
              fill="none"
              strokeWidth="5"
              stroke="#E11D48"
            />
            <rect x="46" y="46" width="28" height="8" rx="2" fill="#E11D48" />
            <path
              d="M 58 44 L 62 40 M 58 56 L 62 60"
              strokeWidth="2.5"
              stroke="#0B1120"
              fill="none"
            />
          </>
        )}
      </g>
    </svg>
  );
}

function RiderFallen() {
  return (
    <svg width="110" height="54" viewBox="0 0 110 54" className="drop-shadow">
      <g stroke="#0B1120" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="none">
        <circle cx="20" cy="32" r="13" fill="#F59E0B" />
        <path d="M 20 23 Q 13 23 12 32" stroke="#0B1120" strokeWidth="3.5" fill="#0B1120" />
        <path d="M 14 32 L 20 36 M 18 30 L 24 36" strokeWidth="2.5" />
        <path d="M 26 30 L 32 36 M 30 30 L 36 36" strokeWidth="2.5" />
        <ellipse cx="22" cy="40" rx="2.5" ry="1.8" fill="#0B1120" />
        <rect x="32" y="22" width="38" height="16" rx="4" fill="#E11D48" />
        <line x1="70" y1="28" x2="86" y2="22" />
        <line x1="70" y1="36" x2="86" y2="42" />
        <line x1="40" y1="38" x2="44" y2="50" />
        <line x1="52" y1="38" x2="56" y2="50" />
      </g>
    </svg>
  );
}

function CharacterOnStretcher() {
  return (
    <svg width="110" height="50" viewBox="0 0 110 50" className="drop-shadow">
      <g stroke="#0B1120" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        <rect x="5" y="22" width="100" height="12" rx="3" fill="#F8FAFC" />
        <circle cx="22" cy="18" r="10" fill="#F59E0B" />
        <path d="M 22 10 Q 16 10 15 18" fill="#0B1120" stroke="#0B1120" strokeWidth="2.5" />
        <path d="M 18 16 L 22 18" strokeWidth="2" />
        <path d="M 22 18 L 26 16" strokeWidth="2" />
        <path d="M 18 22 Q 22 24 26 22" fill="none" strokeWidth="2" />
        <rect x="32" y="10" width="60" height="14" rx="4" fill="#E11D48" />
        <path d="M 50 14 L 58 14 M 54 10 L 54 18" stroke="#fff" strokeWidth="2.5" />
        <circle cx="18" cy="40" r="5" fill="#0B1120" />
        <circle cx="92" cy="40" r="5" fill="#0B1120" />
      </g>
    </svg>
  );
}

function Ambulance({ shaking }: { shaking?: boolean }) {
  return (
    <motion.div
      animate={shaking ? { y: [0, -1.5, 0, 1.5, 0] } : {}}
      transition={{ duration: 0.15, repeat: Infinity }}
    >
      <svg width="160" height="90" viewBox="0 0 160 90" className="drop-shadow-xl">
        <g stroke="#0B1120" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
          <motion.g
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            <rect x="44" y="4" width="14" height="10" rx="2" fill="#E11D48" />
            <rect x="62" y="4" width="14" height="10" rx="2" fill="#0EA5E9" />
          </motion.g>
          <rect x="8" y="14" width="100" height="50" rx="6" fill="#F8FAFC" />
          <path d="M 108 14 L 148 28 L 148 64 L 108 64 Z" fill="#F8FAFC" />
          <rect x="115" y="28" width="22" height="18" rx="2" fill="#7DD3FC" />
          <rect x="78" y="24" width="22" height="22" rx="3" fill="#E11D48" />
          <path d="M 82 35 L 96 35 M 89 28 L 89 42" stroke="#fff" strokeWidth="4" />
          <rect x="16" y="24" width="50" height="22" rx="3" fill="#7DD3FC" />
          <circle cx="32" cy="74" r="12" fill="#0B1120" />
          <circle cx="32" cy="74" r="5" fill="#F8FAFC" />
          <circle cx="128" cy="74" r="12" fill="#0B1120" />
          <circle cx="128" cy="74" r="5" fill="#F8FAFC" />
        </g>
      </svg>
    </motion.div>
  );
}

function ImpactBurst() {
  return (
    <motion.svg
      className="absolute left-[42%] top-[35%] z-[4] pointer-events-none"
      width="240"
      height="180"
      viewBox="-60 -60 120 120"
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1, 1.1] }}
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <g stroke="#0B1120" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
        <path
          d="M 0 -54 L 10 -26 L 38 -40 L 24 -12 L 52 -6 L 24 8 L 40 38 L 10 22 L 0 54 L -10 22 L -40 38 L -24 8 L -52 -6 L -24 -12 L -38 -40 L -10 -26 Z"
          fill="#FACC15"
        />
        <path
          d="M 0 -30 L 6 -14 L 22 -22 L 14 -6 L 30 -4 L 14 4 L 22 22 L 6 14 L 0 30 L -6 14 L -22 22 L -14 4 L -30 -4 L -14 -6 L -22 -22 L -6 -14 Z"
          fill="#F8FAFC"
        />
      </g>
    </motion.svg>
  );
}

function ComicText({
  text,
  x,
  y,
  color,
  small,
}: {
  text: string;
  x: string;
  y: string;
  color: string;
  small?: boolean;
}) {
  return (
    <motion.span
      initial={{ scale: 0, rotate: -20, opacity: 0 }}
      animate={{ scale: [0, 1.3, 1], rotate: [-20, 8, -6], opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={`absolute font-display font-black select-none pointer-events-none z-[5] ${
        small ? "text-lg sm:text-2xl" : "text-3xl sm:text-5xl"
      }`}
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        color,
        WebkitTextStroke: small ? "2px #0B1120" : "3px #0B1120",
        textShadow: small ? "3px 3px 0 #0B1120" : "4px 4px 0 #0B1120",
        letterSpacing: "0.05em",
      }}
    >
      {text}
    </motion.span>
  );
}

function Road() {
  return (
    <div
      aria-hidden
      className="absolute bottom-1.5 left-0 right-0 h-16 z-[1]"
      style={{
        background:
          "linear-gradient(180deg, transparent 0%, rgba(11,17,32,0.15) 50%, rgba(11,17,32,0.25) 100%)",
      }}
    >
      <div
        className="absolute top-1/2 left-0 right-0 h-1"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0B1120 0 16px, transparent 16px 32px)",
          opacity: 0.6,
        }}
      />
    </div>
  );
}

function HalftoneBackground({ scene }: { scene: Scene }) {
  const urgent =
    scene === "count3" ||
    scene === "count2" ||
    scene === "count1" ||
    scene === "ambulance" ||
    scene === "impact";
  return (
    <svg
      aria-hidden
      className="absolute inset-0 -z-10"
      viewBox="0 0 200 200"
      preserveAspectRatio="none"
    >
      <defs>
        <radialGradient id="halftone-bg" cx="50%" cy="50%" r="75%">
          <stop offset="0%" stopColor={urgent ? "#FFD7D1" : "#FAF0D2"} />
          <stop offset="100%" stopColor={urgent ? "#FCA5A5" : "#E7D7A8"} />
        </radialGradient>
        <pattern
          id="dots-bg"
          x="0"
          y="0"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1" fill="#0B1120" opacity="0.25" />
        </pattern>
      </defs>
      <rect width="200" height="200" fill="url(#halftone-bg)" />
      <rect width="200" height="200" fill="url(#dots-bg)" />
    </svg>
  );
}

function SpeedLines({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none z-[3]">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.span
          key={i}
          className="absolute h-0.5 bg-black/50"
          style={{
            top: `${15 + i * 12}%`,
            right: 0,
            width: `${30 + i * 10}px`,
          }}
          initial={{ x: 200, opacity: 0 }}
          animate={{ x: -400, opacity: [0, 1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
