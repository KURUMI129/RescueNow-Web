"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { resumeAudio, sfxGameOver, sfxHit, sfxPickup, sfxRescue, startBGM, stopBGM, updateBGMTier, sfxVictoryJingle, barkHappy, barkAlert, whineSad, startPanting, stopPanting, barkIntro } from "@/components/game/audio";
import { DIFFICULTIES, INTRO_LINES, type Difficulty } from "@/components/game/config";
import { ParticlePool } from "@/components/game/effects";
import { makeEvent, startEvent, tickEvent, resetEvent, pickEventKind, type RescueEvent } from "@/components/game/events";
import { AMBULANCE, AMBULANCE_FRAMES, AMBULANCE_FRAMES_COMANDO, CAR_STRANDED, TRUCK_STRANDED, MOTO_STRANDED, CONE, FUEL, MEDKIT, POTHOLE, SHIELD, REX_FULL, REX_FULL_COMANDO, drawSprite } from "@/components/game/sprites";

/* ── Types ── */
type EntityKind = "car" | "pothole" | "cone" | "shield" | "fuel" | "medkit";
type CarVariant = 0 | 1 | 2; // sedan, truck, moto
interface Entity { lane: number; y: number; kind: EntityKind; carVariant?: CarVariant }
interface Toast { text: string; color: string; y: number; ttl: number }
interface Particle { x: number; y: number; vx: number; vy: number; color: string; life: number }
type Screen = "menu" | "intro" | "play" | "paused" | "over";

const LANES = 3;
const RESCUE_MSGS = ["¡SOS Activado!", "¡Ficha médica enviada!", "¡Vehículo rescatado!", "¡Emergencia resuelta!", "¡Rex al rescate! 🐾"];

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","KeyZ","KeyX"];

function detectLiteMode(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  const lowCores = (navigator.hardwareConcurrency ?? 8) < 4;
  const lowDpr = (window.devicePixelRatio || 1) < 2;
  const isMobile = window.matchMedia("(max-width: 640px)").matches;
  return lowCores || lowDpr || isMobile;
}

/* ── Rex full-body pixel-art canvas helper ── */
function RexFullCanvas({ size, comando }: { size: number; comando: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.imageSmoothingEnabled = false;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);
    const sprite = comando ? REX_FULL_COMANDO : REX_FULL;
    const scale = size / sprite[0].length;
    drawSprite(ctx, sprite, 0, 0, scale);
  }, [size, comando]);
  return <canvas ref={ref} />;
}

/* ── Component ── */
export function RescueRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<Screen>("menu");
  const [introPhase, setIntroPhase] = useState<"title" | "push-start" | "ready" | "playing">("title");
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [introIdx, setIntroIdx] = useState(0);

  // Use refs for values that the game loop reads but shouldn't restart it
  const mutedRef = useRef(false);
  const [mutedUI, setMutedUI] = useState(false);
  const pausedRef = useRef(false);
  const [pausedUI, setPausedUI] = useState(false);

  // Animation frame refs: direction (-1 left, 0 none, 1 right) and last hit timestamp
  const lastInputDirRef = useRef<number>(0);
  const lastHitAtRef = useRef<number>(0);
  const prevScoreRef = useRef<number>(0);

  // Visual effect refs
  const shakeRef = useRef(0);   // time remaining for screen shake (seconds)
  const slowMoRef = useRef(0);  // time remaining for slow-mo (seconds)
  const flashRef = useRef(0);   // time remaining for white flash (seconds)
  const cycleStartRef = useRef<number>(performance.now());

  const eventRef = useRef<RescueEvent>(makeEvent());
  const lastEventScoreRef = useRef<number>(0);
  const [eventTick, setEventTick] = useState(0);

  const particlesRef = useRef<ParticlePool | null>(null);
  useEffect(() => {
    particlesRef.current = new ParticlePool(80);
  }, []);

  const liteModeRef = useRef(false);
  const bloomEnabledRef = useRef(true);
  const [liteMode, setLiteMode] = useState(false);
  const dtHistoryRef = useRef<number[]>([]);
  const runtimeFpsCapRef = useRef(60);
  useEffect(() => {
    liteModeRef.current = detectLiteMode();
    setLiteMode(liteModeRef.current);
    if (liteModeRef.current) {
      particlesRef.current?.setCap(30);
      bloomEnabledRef.current = false;
    }
  }, []);

  const [unlockToast, setUnlockToast] = useState(false);

  const [skinComandoActive, setSkinComandoActive] = useState(false);
  useEffect(() => {
    setSkinComandoActive(
      typeof window !== "undefined" &&
        window.localStorage.getItem("rexnow-skin-comando-active") === "1",
    );
  }, []);

  const [skinUnlocked, setSkinUnlocked] = useState(false);
  useEffect(() => {
    setSkinUnlocked(
      typeof window !== "undefined" &&
        window.localStorage.getItem("rexnow-skin-comando") === "1",
    );
  }, []);

  const [_konamiBuf, setKonamiBuf] = useState<string[]>([]);
  const [chihuahuaMode, setChihuahuaMode] = useState(false);
  const chihuahuaRef = useRef(false);
  useEffect(() => {
    chihuahuaRef.current = chihuahuaMode;
  }, [chihuahuaMode]);

  const skinComandoRef = useRef(false);
  useEffect(() => {
    skinComandoRef.current = skinComandoActive;
  }, [skinComandoActive]);

  useEffect(() => {
    if (screen !== "menu") return;
    const onKey = (e: KeyboardEvent) => {
      setKonamiBuf((prev) => {
        const next = [...prev, e.code].slice(-KONAMI.length);
        if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
          setChihuahuaMode(true);
          try { barkHappy(); } catch {}
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen]);

  /* ── Capcom-style intro sequence ── */
  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase("push-start"), 1200);
    const t2 = setTimeout(() => {
      setIntroPhase("ready");
      barkIntro();
    }, 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const hsKey = (d: Difficulty) => `rex-hs-${d}`;

  useEffect(() => {
    const s = localStorage.getItem(hsKey(difficulty));
    if (s) setHighScore(parseInt(s, 10));
  }, [difficulty]);

  /* ── Toggle mute (ref-based, no re-render of game loop) ── */
  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMutedUI(next);
    if (next) stopBGM();
    else if (screen === "play") startBGM();
  };

  /* ── Toggle pause ── */
  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPausedUI(pausedRef.current);
    if (pausedRef.current) stopBGM();
    else if (!mutedRef.current) startBGM();
  };

  /* ── Intro cinematic ── */
  useEffect(() => {
    if (screen !== "intro") return;
    setIntroIdx(0);
    const iv = setInterval(() => {
      setIntroIdx((prev) => {
        if (prev >= INTRO_LINES.length - 1) {
          clearInterval(iv);
          setTimeout(() => setScreen("play"), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(iv);
  }, [screen]);

  /* ── GAME LOOP ── */
  const gameLoop = useCallback((canvas: HTMLCanvasElement, diff: Difficulty) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cfg = DIFFICULTIES[diff];

    prevScoreRef.current = 0;
    let lane = 1, score = 0, lives = cfg.lives, frame = 0;
    let speed = cfg.baseSpeed * (chihuahuaRef.current ? 1.8 : 1), shieldTimer = 0, invincibleTimer = 0, roadOffset = 0;
    // Track when this run started so the speed can ramp with real elapsed
    // play time, not just with score. Resets every time the loop starts
    // (new run = ramp begins fresh).
    const runStart = performance.now();

    const addScore = (pts: number) => {
      const prev = score;
      score += pts * (chihuahuaRef.current ? 2 : 1);
      if (!mutedRef.current) {
        updateBGMTier(score);
        if ((prev < 50 && score >= 50) || (prev < 100 && score >= 100) || (prev < 200 && score >= 200)) {
          sfxVictoryJingle();
        }
      }
      // Slow-mo + flash on milestones 100 / 200 / 300
      if ((prev < 100 && score >= 100) || (prev < 200 && score >= 200) || (prev < 300 && score >= 300)) {
        slowMoRef.current = 0.8;
        flashRef.current = 0.25;
      }
      // Easter egg F: 800 pts en Difícil desbloquea Rex Comando
      if (
        diff === "hard" &&
        score >= 800 &&
        typeof window !== "undefined" &&
        !window.localStorage.getItem("rexnow-skin-comando")
      ) {
        window.localStorage.setItem("rexnow-skin-comando", "1");
        setUnlockToast(true);
        if (!mutedRef.current) {
          try { barkHappy(); } catch {}
        }
        setTimeout(() => setUnlockToast(false), 4000);
      }
      // Panting: between 100 and 200 pts
      if (score >= 100 && score < 200) {
        startPanting();
      } else {
        stopPanting();
      }
      prevScoreRef.current = score;
    };
    let running = true;
    let lastTime = performance.now();
    const entities: Entity[] = [];
    const toasts: Toast[] = [];
    const particles: Particle[] = [];

    const CAR_SPRITES = [CAR_STRANDED, TRUCK_STRANDED, MOTO_STRANDED];

    const spawnParticles = (x: number, y: number, color: string, count: number) => {
      for (let i = 0; i < count; i++) {
        particles.push({
          x, y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          color,
          life: 25 + Math.floor(Math.random() * 15),
        });
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.clientWidth * dpr;
      canvas.height = p.clientHeight * dpr;
      canvas.style.width = p.clientWidth + "px";
      canvas.style.height = p.clientHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const W = () => canvas.width / Math.min(window.devicePixelRatio || 1, 2);
    const H = () => canvas.height / Math.min(window.devicePixelRatio || 1, 2);
    const laneX = (l: number) => {
      const w = W(), roadW = Math.min(w * 0.75, 360);
      return (w - roadW) / 2 + (roadW / LANES) * l + roadW / LANES / 2;
    };
    const sc = () => Math.max(2.5, Math.min(W() / 90, 4.5));

    let inputResetTimer: ReturnType<typeof setTimeout> | null = null;
    const setInputDir = (dir: -1 | 1) => {
      lastInputDirRef.current = dir;
      if (inputResetTimer) clearTimeout(inputResetTimer);
      inputResetTimer = setTimeout(() => { lastInputDirRef.current = 0; }, 200);
    };
    const moveLeft = () => { if (lane > 0) { lane--; setInputDir(-1); } };
    const moveRight = () => { if (lane < LANES - 1) { lane++; setInputDir(1); } };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        // Handled by React state
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft();
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") moveRight();
    };
    window.addEventListener("keydown", onKey);

    let touchX = 0;
    const onTS = (e: TouchEvent) => { touchX = e.touches[0].clientX; };
    const onTE = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 30) { dx < 0 ? moveLeft() : moveRight(); }
      else { e.changedTouches[0].clientX < W() / 2 ? moveLeft() : moveRight(); }
    };
    canvas.addEventListener("touchstart", onTS, { passive: true });
    canvas.addEventListener("touchend", onTE, { passive: true });

    const spawn = () => {
      const r = Math.random();
      const rates = cfg.spawnRates;
      let kind: EntityKind;
      if (r < rates.car) kind = "car";
      else if (r < rates.car + rates.pothole) kind = "pothole";
      else if (r < rates.car + rates.pothole + rates.cone) kind = "cone";
      else if (r < rates.car + rates.pothole + rates.cone + rates.shield) kind = "shield";
      else if (r < rates.car + rates.pothole + rates.cone + rates.shield + rates.fuel) kind = "fuel";
      else kind = "medkit";
      const carVariant = (Math.floor(Math.random() * 3)) as CarVariant;
      entities.push({ lane: Math.floor(Math.random() * LANES), y: -50, kind, carVariant });
    };

    const hit = (e: Entity, px: number, py: number) => {
      const s = sc();
      return Math.abs(laneX(e.lane) - px) < 6 * s * 1.4 && Math.abs(e.y - py) < 8 * s * 1.2;
    };

    const drawRoad = () => {
      const w = W(), h = H(), roadW = Math.min(w * 0.75, 360), rl = (w - roadW) / 2;
      ctx.fillStyle = "#1a1a2e"; ctx.fillRect(rl, 0, roadW, h);
      ctx.fillStyle = "#E11D48"; ctx.fillRect(rl - 4, 0, 4, h); ctx.fillRect(rl + roadW, 0, 4, h);
      ctx.strokeStyle = "#FFD700"; ctx.lineWidth = 2; ctx.setLineDash([20, 15]); ctx.lineDashOffset = -roadOffset;
      for (let i = 1; i < LANES; i++) { const x = rl + (roadW / LANES) * i; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      ctx.setLineDash([]);
      ctx.fillStyle = "#0d1117"; ctx.fillRect(0, 0, rl - 4, h); ctx.fillRect(rl + roadW + 4, 0, w - rl - roadW - 4, h);
    };

    const drawHUD = () => {
      const w = W();
      ctx.font = "bold 20px monospace";
      // Score — pushed down to avoid overlap with buttons
      ctx.fillStyle = "#FFD700"; ctx.textAlign = "center";
      ctx.fillText(`SCORE: ${score}`, w / 2, 28);
      // Shield — centered below score
      if (shieldTimer > 0) { ctx.fillStyle = "#0EA5E9"; ctx.textAlign = "center"; ctx.fillText(`🛡️ ${Math.ceil(shieldTimer / 60)}s`, w / 2, 52); }
      // Lives — right side, below buttons
      ctx.fillStyle = "#E11D48"; ctx.textAlign = "right";
      let lt = ""; for (let i = 0; i < lives; i++) lt += "❤️ ";
      ctx.fillText(lt.trim(), w - 12, 52);
    };

    const tick = (timestamp: number) => {
      if (!running) return;
      if (pausedRef.current) { requestAnimationFrame(tick); return; }
      const realDt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      // Dynamic FPS cap: track dt history and lower cap to 45 if sustained slowness
      const history = dtHistoryRef.current;
      history.push(realDt);
      if (history.length > 120) history.shift();
      if (history.length >= 60) {
        const avg = history.reduce((a, b) => a + b, 0) / history.length;
        if (avg > 1 / 45 && runtimeFpsCapRef.current === 60) {
          runtimeFpsCapRef.current = 45;
        }
      }

      // Slow-mo effect: scale dt down, decrement using real time
      let effectiveDt = realDt;
      if (slowMoRef.current > 0) {
        effectiveDt = realDt * 0.3;
        slowMoRef.current = Math.max(0, slowMoRef.current - realDt);
      }
      // Decay shake and flash using real time
      shakeRef.current = Math.max(0, shakeRef.current - realDt);
      flashRef.current = Math.max(0, flashRef.current - realDt);

      const dt = effectiveDt;
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);
      // Total speed = base + score-based step + time-based ramp, all multiplied
      // by chihuahua bonus, then capped so it never becomes literally unplayable.
      const elapsedSec = (performance.now() - runStart) / 1000;
      const scoreBonus = Math.floor(score / 500) * cfg.speedInc;
      const timeBonus = elapsedSec * cfg.timeSpeedRamp;
      const chihuahuaMult = chihuahuaRef.current ? 1.8 : 1;
      speed = Math.min(
        cfg.maxSpeed * chihuahuaMult,
        (cfg.baseSpeed + scoreBonus + timeBonus) * chihuahuaMult,
      );
      roadOffset = (roadOffset + speed) % 35;

      // ── Event system ──
      // Fire event when score crosses next multiple of ~100 and currently idle
      if (score >= lastEventScoreRef.current + 100 && eventRef.current.state === "idle") {
        startEvent(eventRef.current, pickEventKind(), performance.now());
        lastEventScoreRef.current = score;
      }
      // Tick event state machine every frame
      tickEvent(eventRef.current, performance.now());
      // Resolve event outcomes
      if (eventRef.current.state === "succeeded") {
        addScore(50);
        toasts.push({ text: "¡Evento superado! +50", color: "#FFD700", y: h / 2, ttl: 80 });
        resetEvent(eventRef.current);
        setEventTick((n) => n + 1);
      }
      if (eventRef.current.state === "failed") {
        // Decrement a life directly, same logic as pothole/cone hit
        if (invincibleTimer <= 0) {
          lives--;
          invincibleTimer = 90;
          lastHitAtRef.current = Date.now();
          spawnParticles(laneX(lane), H() - 80, "#E11D48", 12);
          shakeRef.current = 0.2;
          if (!mutedRef.current) {
            sfxHit();
            whineSad(false);
          }
          if (lives <= 0) {
            running = false;
            if (!mutedRef.current) { sfxGameOver(); whineSad(true); stopPanting(); }
            stopBGM(); setFinalScore(score);
            if (score > highScore) { setHighScore(score); localStorage.setItem(hsKey(diff), String(score)); }
            setScreen("over"); cleanup(); return;
          }
        }
        resetEvent(eventRef.current);
        setEventTick((n) => n + 1);
      }
      // HUD refresh pulse every ~200 ms while event active
      if (eventRef.current.state === "active" && frame % 12 === 0) {
        setEventTick((n) => n + 1);
      }

      // Day/night cycle: 45s period
      const cycleElapsed = (performance.now() - cycleStartRef.current) / 1000;
      const cyclePos = (cycleElapsed % 45) / 45; // 0..1 every 45s
      const isNight = cyclePos > 0.5;

      // Sky gradient (drawn before road)
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      if (isNight) {
        sky.addColorStop(0, "#0b1226");
        sky.addColorStop(1, "#1f1b3a");
      } else {
        sky.addColorStop(0, "#fef3c7");
        sky.addColorStop(1, "#fcd34d");
      }
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Begin shake transform — wraps all world drawing
      ctx.save();
      if (shakeRef.current > 0) {
        const intensity = (shakeRef.current / 0.2) * (liteModeRef.current ? 4 : 8);
        ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
      }

      // Stars (night only, before road)
      if (isNight) {
        const nowMs = performance.now();
        for (let i = 0; i < 30; i++) {
          const sx = (i * 73) % w;
          const sy = (i * 37) % (h * 0.4);
          ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.sin(nowMs / 500 + i) * 0.2})`;
          ctx.fillRect(sx, sy, 1.5, 1.5);
        }
      }

      drawRoad();

      const currentSpawnInterval = Math.max(cfg.minSpawnInterval, cfg.spawnInterval - Math.floor(score / cfg.spawnAccelEvery));
      if (frame % currentSpawnInterval === 0) spawn();

      const s = sc(), px = laneX(lane), py = h - 80;

      // Continuous exhaust smoke from ambulance rear
      if (Math.random() < 0.4) {
        particlesRef.current?.spawn("smoke", px - 2 * s, py + 8 * s, 1);
      }

      for (let i = entities.length - 1; i >= 0; i--) {
        const e = entities[i];
        e.y += speed;
        if (e.y > h + 60) { entities.splice(i, 1); continue; }
        const ex = laneX(e.lane);
        switch (e.kind) {
          case "car": {
            const sprite = CAR_SPRITES[e.carVariant ?? 0];
            const isSmall = e.carVariant === 2; // moto is smaller
            const off = isSmall ? 7 : 9;
            drawSprite(ctx, sprite, ex - off * s, e.y - off * s, s);
            // Blinking hazard lights
            if (Math.floor(frame / 15) % 2 === 0) {
              ctx.fillStyle = "#FF4500";
              ctx.globalAlpha = 0.9;
              ctx.fillRect(ex - off * s + 2 * s, e.y - off * s, 2 * s, 2 * s);
              ctx.fillRect(ex + (off - 4) * s, e.y - off * s, 2 * s, 2 * s);
              ctx.globalAlpha = 1;
            }
            break;
          }
          case "pothole": drawSprite(ctx, POTHOLE, ex - 7 * s, e.y - 7 * s, s); break;
          case "cone": drawSprite(ctx, CONE, ex - 7 * s, e.y - 7 * s, s); break;
          case "shield":
            if (bloomEnabledRef.current) { ctx.shadowColor = "#0EA5E9"; ctx.shadowBlur = 12; }
            drawSprite(ctx, SHIELD, ex - 7 * s, e.y - 7 * s, s);
            ctx.shadowBlur = 0; break;
          case "fuel":
            if (bloomEnabledRef.current) { ctx.shadowColor = "#10B981"; ctx.shadowBlur = 12; }
            drawSprite(ctx, FUEL, ex - 7 * s, e.y - 7 * s, s);
            ctx.shadowBlur = 0; break;
          case "medkit":
            if (bloomEnabledRef.current) { ctx.shadowColor = "#E11D48"; ctx.shadowBlur = 12; }
            drawSprite(ctx, MEDKIT, ex - 7 * s, e.y - 7 * s, s);
            ctx.shadowBlur = 0; break;
        }

        if (hit(e, px, py)) {
          switch (e.kind) {
            case "car":
              addScore(60);
              if (eventRef.current.state === "active") {
                eventRef.current.carsRescued++;
                setEventTick((n) => n + 1);
              }
              particlesRef.current?.spawn("spark", ex, e.y, 12);
              toasts.push({ text: RESCUE_MSGS[Math.floor(Math.random() * RESCUE_MSGS.length)], color: "#10B981", y: py - 40, ttl: 60 });
              if (!mutedRef.current) {
                sfxRescue();
                barkHappy();
              }
              break;
            case "pothole": case "cone":
              if (shieldTimer > 0) { toasts.push({ text: "¡Escudo!", color: "#0EA5E9", y: py - 40, ttl: 40 }); }
              else if (invincibleTimer <= 0) {
                lives--; invincibleTimer = 90;
                lastHitAtRef.current = Date.now();
                spawnParticles(px, py, "#E11D48", 12);
                shakeRef.current = 0.2;
                if (!mutedRef.current) {
                  sfxHit();
                  whineSad(false);
                }
                if (lives <= 0) {
                  running = false;
                  spawnParticles(px, py, "#FFD700", 20);
                  if (!mutedRef.current) {
                    sfxGameOver();
                    whineSad(true);
                    stopPanting();
                  }
                  stopBGM(); setFinalScore(score);
                  if (score > highScore) { setHighScore(score); localStorage.setItem(hsKey(diff), String(score)); }
                  setScreen("over"); cleanup(); return;
                }
              } break;
            case "shield": shieldTimer = 300; particlesRef.current?.spawn("spark", ex, e.y, 12); if (!mutedRef.current) {
              sfxPickup();
              barkAlert();
            }
            toasts.push({ text: "¡SOS Shield!", color: "#0EA5E9", y: py - 40, ttl: 50 }); break;
            case "fuel": addScore(25); particlesRef.current?.spawn("spark", ex, e.y, 12); if (!mutedRef.current) {
              sfxPickup();
              barkAlert();
            }
            toasts.push({ text: "+25 ⛽", color: "#10B981", y: py - 40, ttl: 40 }); break;
            case "medkit": if (lives < cfg.lives) lives++; particlesRef.current?.spawn("spark", ex, e.y, 12); if (!mutedRef.current) {
              sfxPickup();
              barkAlert();
            }
            toasts.push({ text: "+1 ❤️", color: "#E11D48", y: py - 40, ttl: 50 }); break;
          }
          entities.splice(i, 1);
        }
      }

      // Player — select animation frame based on input direction and hit state
      const nowMs = Date.now();
      const isHit = nowMs - (lastHitAtRef.current ?? 0) < 300;
      let frameIdx = 0; // idle
      if (isHit) frameIdx = 3;
      else if (lastInputDirRef.current === -1) frameIdx = 1;
      else if (lastInputDirRef.current === 1) frameIdx = 2;
      const framesPool = skinComandoRef.current ? AMBULANCE_FRAMES_COMANDO : AMBULANCE_FRAMES;
      const ambulanceFrame = framesPool[frameIdx] ?? framesPool[0] ?? AMBULANCE;

      // Step 17.1: Pulsating siren halo around the ambulance
      const sirenPhase = Math.floor(performance.now() / 250) % 2 === 0;
      const sirenColor = sirenPhase ? "rgba(225,29,72,0.55)" : "rgba(14,165,233,0.55)";
      const ambulanceW = AMBULANCE_FRAMES[0][0].length * s;
      const ambulanceH = AMBULANCE_FRAMES[0].length * s;
      const cx = (px - 9 * s) + ambulanceW / 2;
      const cy = (py - 10 * s) + ambulanceH / 2;
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 40);
      grad.addColorStop(0, sirenColor);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 40, cy - 40, 80, 80);

      // Step 17.2: Yellow headlights toward the front (brighter at night)
      const headX = cx;
      const headY = py - 10 * s; // top edge of ambulance
      const headlightAlpha = isNight ? 0.7 : 0.45;
      const grad2 = ctx.createRadialGradient(headX, headY, 2, headX, headY - 80, 80);
      grad2.addColorStop(0, `rgba(253,224,71,${headlightAlpha})`);
      grad2.addColorStop(1, "rgba(253,224,71,0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(headX - 50, headY - 80, 100, 100);

      const ambulanceScale = s * (chihuahuaRef.current ? 0.7 : 1);
      if (invincibleTimer > 0) { invincibleTimer--; if (Math.floor(invincibleTimer / 6) % 2 === 0) drawSprite(ctx, ambulanceFrame, px - 9 * ambulanceScale, py - 10 * ambulanceScale, ambulanceScale); }
      else drawSprite(ctx, ambulanceFrame, px - 9 * ambulanceScale, py - 10 * ambulanceScale, ambulanceScale);

      if (shieldTimer > 0) {
        shieldTimer--;
        ctx.strokeStyle = `rgba(14,165,233,${0.4 + Math.sin(frame * 0.1) * 0.2})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(px, py, 22 * s / 2, 0, Math.PI * 2); ctx.stroke();
      }

      for (let i = toasts.length - 1; i >= 0; i--) {
        const t = toasts[i]; t.y -= 1; t.ttl--;
        ctx.globalAlpha = Math.min(1, t.ttl / 20);
        ctx.font = "bold 18px monospace"; ctx.fillStyle = t.color; ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.7)"; ctx.shadowBlur = 6;
        ctx.fillText(t.text, w / 2, t.y); ctx.shadowBlur = 0; ctx.globalAlpha = 1;
        if (t.ttl <= 0) toasts.splice(i, 1);
      }

      // Particles (legacy hit/game-over effects)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
        ctx.globalAlpha = Math.max(0, p.life / 30);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.globalAlpha = 1;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // ParticlePool effects (smoke, sparks, dust) — drawn before HUD
      particlesRef.current?.update(dt);
      particlesRef.current?.draw(ctx);
      // TODO: close-miss dust en una iteración futura

      // End shake transform — restore before flash so flash is stable
      ctx.restore();

      // Tornado event overlay (over world, under HUD)
      if (eventRef.current.kind === "tornado" && eventRef.current.state === "active") {
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(0, 0, w, h);
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.strokeStyle = "rgba(148,163,184,0.7)";
        ctx.lineWidth = 6;
        ctx.beginPath();
        const tNow = performance.now();
        for (let a = 0; a < Math.PI * 6; a += 0.1) {
          const r = 8 + a * 8;
          const tx = Math.cos(a + tNow / 100) * r;
          const ty = Math.sin(a + tNow / 100) * r;
          if (a === 0) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Pile-up event overlay (luces de patrulla pulsantes encima)
      if (eventRef.current.kind === "pileup" && eventRef.current.state === "active") {
        const tNow = performance.now();
        const sirenOn = Math.floor(tNow / 250) % 2 === 0;
        // Patrulla con luces alternantes en la parte superior
        const patrolY = 40;
        ctx.fillStyle = sirenOn ? "#E11D48" : "#0EA5E9";
        ctx.fillRect(w / 2 - 30, patrolY, 20, 8);
        ctx.fillRect(w / 2 + 10, patrolY, 20, 8);
        // Glow ambiente del patrullaje
        const pileupGrad = ctx.createRadialGradient(w / 2, patrolY + 4, 4, w / 2, patrolY + 4, 200);
        pileupGrad.addColorStop(0, sirenOn ? "rgba(225,29,72,0.4)" : "rgba(14,165,233,0.4)");
        pileupGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = pileupGrad;
        ctx.fillRect(0, 0, w, 200);
      }

      // Blackout event: oscurece la pantalla pero la ambulancia queda iluminada
      if (eventRef.current.kind === "blackout" && eventRef.current.state === "active") {
        const playerCx = laneX(lane);
        const playerCy = H() - 80;
        ctx.save();
        // Capa oscura
        ctx.fillStyle = "rgba(0,0,0,0.62)";
        ctx.fillRect(0, 0, w, h);
        // Cono de faros: ovalado, centrado sobre la ambulancia y extendido hacia adelante
        ctx.globalCompositeOperation = "destination-out";
        // Scale el contexto para hacer la elipse: alta verticalmente, normal horizontalmente
        ctx.translate(playerCx, playerCy - 30);
        ctx.scale(1, 1.6);
        const radius = Math.max(150, h * 0.32);
        const blackoutGrad = ctx.createRadialGradient(0, 0, 70, 0, 0, radius);
        blackoutGrad.addColorStop(0, "rgba(0,0,0,1)");
        blackoutGrad.addColorStop(0.5, "rgba(0,0,0,0.85)");
        blackoutGrad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = blackoutGrad;
        ctx.fillRect(-w, -h, w * 2, h * 2);
        ctx.restore();
        // Brillo amarillo cálido centrado en la ambulancia para que su sprite se distinga
        const haloGrad = ctx.createRadialGradient(playerCx, playerCy, 20, playerCx, playerCy, 110);
        haloGrad.addColorStop(0, "rgba(253,224,71,0.32)");
        haloGrad.addColorStop(0.5, "rgba(253,224,71,0.12)");
        haloGrad.addColorStop(1, "rgba(253,224,71,0)");
        ctx.fillStyle = haloGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // White flash overlay (not shaken, drawn over world but under HUD)
      if (flashRef.current > 0) {
        ctx.fillStyle = `rgba(255,255,255,${flashRef.current / 0.25})`;
        ctx.fillRect(0, 0, w, h);
      }

      drawHUD();
      for (let sy = 0; sy < h; sy += 3) { ctx.fillStyle = "rgba(0,0,0,0.06)"; ctx.fillRect(0, sy, w, 1); }
      frame++;
      requestAnimationFrame(tick);
    };

    const cleanup = () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("touchstart", onTS);
      canvas.removeEventListener("touchend", onTE);
      if (inputResetTimer) clearTimeout(inputResetTimer);
    };

    if (!mutedRef.current) startBGM();
    requestAnimationFrame(tick);
    return () => { running = false; cleanup(); stopBGM(); };
  }, [highScore]);

  useEffect(() => {
    if (screen !== "play" || !canvasRef.current) return;
    pausedRef.current = false; setPausedUI(false);
    return gameLoop(canvasRef.current, difficulty);
  }, [screen, gameLoop, difficulty]);

  // Keyboard pause handler
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.key === "p" || e.key === "P") && screen === "play") togglePause();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const handleStart = () => { resumeAudio(); setScreen("intro"); };

  const btnStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8, padding: "6px 12px", color: "#94A3B8", fontSize: 14,
    cursor: "pointer", fontFamily: "monospace",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0d1117", display: "flex", flexDirection: "column", fontFamily: "monospace", overflow: "hidden" }}>

      {/* Capcom-style intro overlay */}
      {introPhase !== "playing" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)" }}>
          <h1
            style={{
              fontSize: 56,
              fontWeight: 900,
              color: "#E11D48",
              margin: 0,
              letterSpacing: 4,
              textShadow: "0 0 24px #E11D48, 0 0 60px #E11D48",
              animation: "title-slide 0.8s cubic-bezier(.34,1.56,.64,1)",
              fontFamily: "monospace",
              textAlign: "center",
              padding: "0 16px",
            }}
          >
            REX AL RESCATE
          </h1>
          {introPhase === "ready" && (
            <button
              onClick={() => setIntroPhase("playing")}
              className="animate-pulse"
              style={{
                marginTop: 40,
                fontSize: 22,
                fontWeight: 900,
                color: "#FDE047",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: 2,
              }}
            >
              🐕 PUSH START
            </button>
          )}
        </div>
      )}

      {/* Top bar — always visible */}
      <div style={{ position: "absolute", top: 10, left: 10, right: 10, zIndex: 50, display: "flex", justifyContent: "space-between", pointerEvents: "none" }}>
        <Link href="/" style={{ ...btnStyle, pointerEvents: "auto", textDecoration: "none", fontSize: 13 }}>← Volver</Link>
        <div style={{ display: "flex", gap: 6, pointerEvents: "auto" }}>
          {screen === "play" && (
            <button onClick={togglePause} style={btnStyle}>{pausedUI ? "▶" : "⏸"}</button>
          )}
          <button onClick={toggleMute} style={btnStyle}>{mutedUI ? "🔇" : "🔊"}</button>
        </div>
      </div>

      {/* ── MENU ── */}
      {screen === "menu" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center", overflowY: "auto" }}>
          <RexFullCanvas size={140} comando={skinComandoActive} />
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: 2 }}>REX AL RESCATE</h1>
          <p style={{ color: "#FFD700", fontSize: 13, margin: 0, fontWeight: 700 }}>MINI JUEGO RETRO 16-BIT</p>
          <p style={{ color: "#94A3B8", fontSize: 12, maxWidth: 300, lineHeight: 1.6, margin: 0 }}>
            Conduce la ambulancia de RescueNow. Rescata vehículos varados y esquiva obstáculos en la carretera.
          </p>

          {/* Difficulty selector */}
          <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6, width: "100%", maxWidth: 320 }}>
            <p style={{ color: "#64748B", fontSize: 11, margin: 0, textTransform: "uppercase", letterSpacing: 2 }}>Dificultad</p>
            {(["easy", "normal", "hard"] as Difficulty[]).map((d) => {
              const c = DIFFICULTIES[d];
              const active = difficulty === d;
              return (
                <button key={d} onClick={() => setDifficulty(d)} style={{
                  background: active ? "rgba(225,29,72,0.15)" : "rgba(255,255,255,0.03)",
                  border: active ? "1px solid #E11D48" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, padding: "10px 14px", cursor: "pointer",
                  textAlign: "left", fontFamily: "monospace", transition: "all 0.2s",
                }}>
                  <span style={{ color: active ? "#fff" : "#94A3B8", fontWeight: 700, fontSize: 14 }}>
                    {c.emoji} {c.label}
                  </span>
                  <span style={{ display: "block", color: "#64748B", fontSize: 11, marginTop: 2 }}>{c.description}</span>
                  <span style={{ display: "block", color: "#475569", fontSize: 10, marginTop: 2 }}>
                    ❤️ {c.lives} vidas · ⚡ Velocidad {d === "easy" ? "baja" : d === "normal" ? "media" : "alta"} · 🛡️ Power-ups {d === "easy" ? "frecuentes" : d === "normal" ? "moderados" : "escasos"}
                  </span>
                </button>
              );
            })}
          </div>

          {skinUnlocked && screen === "menu" && (
            <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#FACC15", fontSize: 13, fontWeight: 700, marginTop: 8, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={skinComandoActive}
                onChange={(e) => {
                  setSkinComandoActive(e.target.checked);
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                      "rexnow-skin-comando-active",
                      e.target.checked ? "1" : "0",
                    );
                  }
                }}
              />
              🎖️ Usar skin Rex Comando
            </label>
          )}

          {/* Power-up & obstacle guide */}
          <div style={{
            marginTop: 6, width: "100%", maxWidth: 320,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10, padding: "10px 14px", textAlign: "left",
          }}>
            <p style={{ color: "#94A3B8", fontSize: 11, margin: "0 0 6px", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Guía de objetos</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
              <span style={{ color: "#FFD700" }}>🚗 Vehículo varado — Tócalo para rescatarlo (+60 pts)</span>
              <span style={{ color: "#E11D48" }}>🕳️ Bache — ¡Esquívalo o pierdes una vida!</span>
              <span style={{ color: "#FF6B00" }}>🔶 Cono — ¡Esquívalo o pierdes una vida!</span>
              <span style={{ color: "#0EA5E9" }}>🛡️ Escudo SOS — Invencibilidad por 5 segundos</span>
              <span style={{ color: "#10B981" }}>⛽ Gasolina — Bonus de +25 puntos extra</span>
              <span style={{ color: "#E11D48" }}>🏥 Kit médico — Recupera una vida perdida</span>
            </div>
          </div>

          <div style={{ color: "#475569", fontSize: 10, marginTop: 4 }}>Controles: ← → / A D / swipe · P = pausa</div>
          {chihuahuaMode && (
            <div style={{ color: "#FACC15", fontSize: 12, fontWeight: 700, marginTop: 4 }}>
              🐕 MODO CHIHUAHUA ACTIVO
            </div>
          )}
          {highScore > 0 && <div style={{ color: "#FFD700", fontSize: 13, fontWeight: 700 }}>RÉCORD: {highScore}</div>}

          <button onClick={handleStart} style={{
            marginTop: 8, background: "linear-gradient(135deg, #E11D48, #B91C3C)", color: "#fff",
            border: "none", borderRadius: 12, padding: "14px 48px", fontSize: 16, fontWeight: 800,
            cursor: "pointer", fontFamily: "monospace", letterSpacing: 2,
            boxShadow: "0 8px 30px rgba(225,29,72,0.4)", transition: "transform 0.15s",
          }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.transform = "scale(1.05)")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.transform = "scale(1)")}
          >▶ JUGAR</button>
        </div>
      )}

      {/* ── INTRO CINEMATIC ── */}
      {screen === "intro" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, textAlign: "center" }}>
          <div style={{ width: "100%", maxWidth: 360, minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
            {INTRO_LINES.slice(0, introIdx + 1).map((line, i) => (
              <p key={i} style={{
                color: i === introIdx ? "#fff" : "#64748B",
                fontSize: i === introIdx ? 18 : 14,
                fontWeight: i === introIdx ? 800 : 400,
                margin: 0, transition: "all 0.4s ease",
                textShadow: i === introIdx ? "0 0 20px rgba(225,29,72,0.5)" : "none",
              }}>{line}</p>
            ))}
          </div>
          <div style={{ height: 4, width: 200, borderRadius: 2, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg, #E11D48, #FFD700)",
              width: `${((introIdx + 1) / INTRO_LINES.length) * 100}%`,
              transition: "width 0.5s ease",
            }} />
          </div>
        </div>
      )}

      {/* ── GAME CANVAS ── */}
      {(screen === "play" || screen === "paused") && (
        <div style={{ flex: 1, position: "relative" }}>
          {unlockToast && (
            <div
              className="animate-pulse"
              style={{
                position: "absolute",
                top: 100,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 70,
                background: "#FACC15",
                color: "#000",
                padding: "10px 20px",
                borderRadius: 12,
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: 1,
                boxShadow: "0 8px 24px rgba(250,204,21,0.7)",
              }}
            >
              🏅 Skin desbloqueada: Rex Comando
            </div>
          )}
              {/* Chihuahua mode HUD indicator */}
          {chihuahuaMode && (
            <div style={{
              position: "absolute",
              top: 60,
              right: 12,
              zIndex: 60,
              background: "#FACC15",
              color: "#000",
              padding: "4px 10px",
              borderRadius: 999,
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: 1,
              pointerEvents: "none",
            }}>
              🐕 MODO CHIHUAHUA
            </div>
          )}

          {/* Event HUD banner */}
          {eventRef.current.state === "active" && eventRef.current.kind === "tornado" && (
            <div
              key={`event-${eventTick}`}
              style={{
                position: "absolute",
                top: 60,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 60,
                background: "rgba(225,29,72,0.92)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 999,
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 1,
                pointerEvents: "none",
                boxShadow: "0 4px 16px rgba(225,29,72,0.5)",
              }}
            >
              🌪️ TORNADO · {eventRef.current.carsRescued}/{eventRef.current.carsNeeded}
            </div>
          )}
          {eventRef.current.state === "active" && eventRef.current.kind === "pileup" && (
            <div
              key={`event-pileup-${eventTick}`}
              style={{
                position: "absolute",
                top: 60,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 60,
                background: "rgba(14,165,233,0.92)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 999,
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 1,
                pointerEvents: "none",
                boxShadow: "0 4px 16px rgba(14,165,233,0.5)",
              }}
            >
              🚗💥 PILE-UP · {eventRef.current.carsRescued}/{eventRef.current.carsNeeded}
            </div>
          )}
          {eventRef.current.state === "active" && eventRef.current.kind === "blackout" && (
            <div
              key={`event-blackout-${eventTick}`}
              style={{
                position: "absolute",
                top: 60,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 60,
                background: "rgba(30,41,59,0.92)",
                color: "#fff",
                padding: "8px 16px",
                borderRadius: 999,
                fontFamily: "monospace",
                fontWeight: 900,
                fontSize: 13,
                letterSpacing: 1,
                pointerEvents: "none",
                boxShadow: "0 4px 16px rgba(30,41,59,0.7)",
              }}
            >
              🌑 APAGÓN · {eventRef.current.carsRescued}/{eventRef.current.carsNeeded}
            </div>
          )}
          <div
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden
          >
            <div className="parallax-layer parallax-mountains" />
            <div className="parallax-layer parallax-city" />
            {!liteMode && <div className="parallax-layer parallax-rail" />}
          </div>
          <canvas ref={canvasRef} className="relative z-10" style={{ display: "block", width: "100%", height: "100%", touchAction: "none" }} />
          {/* Pause overlay */}
          {pausedUI && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, zIndex: 40,
            }}>
              <div style={{ fontSize: 36 }}>⏸</div>
              <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, margin: 0, letterSpacing: 2 }}>PAUSA</h2>
              <p style={{ color: "#94A3B8", fontSize: 12, margin: 0 }}>Presiona P, Esc o el botón ⏸ para continuar</p>
              <button onClick={togglePause} style={{
                marginTop: 8, background: "linear-gradient(135deg, #E11D48, #B91C3C)", color: "#fff",
                border: "none", borderRadius: 10, padding: "12px 36px", fontSize: 14, fontWeight: 800,
                cursor: "pointer", fontFamily: "monospace",
              }}>▶ CONTINUAR</button>
            </div>
          )}
        </div>
      )}

      {/* ── GAME OVER ── */}
      {screen === "over" && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 24, textAlign: "center" }}>
          <RexFullCanvas size={80} comando={skinComandoActive} />
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#E11D48", margin: 0, letterSpacing: 2 }}>GAME OVER</h2>
          <div style={{ color: "#fff", fontSize: 32, fontWeight: 900 }}>{finalScore}<span style={{ color: "#94A3B8", fontSize: 14, marginLeft: 6 }}>PTS</span></div>
          {finalScore >= highScore && finalScore > 0 && (
            <div style={{ color: "#FFD700", fontSize: 14, fontWeight: 800, animation: "pulse 1s infinite" }}>🏆 ¡NUEVO RÉCORD!</div>
          )}
          <div style={{ color: "#64748B", fontSize: 12 }}>Mejor: {highScore} · {DIFFICULTIES[difficulty].emoji} {DIFFICULTIES[difficulty].label}</div>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
            <button onClick={handleStart} style={{
              background: "linear-gradient(135deg, #E11D48, #B91C3C)", color: "#fff",
              border: "none", borderRadius: 12, padding: "12px 36px", fontSize: 14, fontWeight: 800,
              cursor: "pointer", fontFamily: "monospace", boxShadow: "0 6px 24px rgba(225,29,72,0.35)",
            }}>↻ REINTENTAR</button>
            <button onClick={() => setScreen("menu")} style={{
              background: "rgba(255,255,255,0.06)", color: "#94A3B8",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
              padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "monospace",
            }}>⚙ MENÚ</button>
          </div>
          <p style={{ color: "#475569", fontSize: 11, marginTop: 12, maxWidth: 280, lineHeight: 1.5 }}>
            Descarga RescueNow para tener asistencia real en carretera 🐾
          </p>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
    </div>
  );
}
