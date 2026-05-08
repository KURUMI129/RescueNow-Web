"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  resumeAudio,
  sfxGameOver,
  sfxHit,
  sfxPickup,
  sfxRescue,
  startBGM,
  stopBGM,
} from "@/components/game/audio";
import {
  AMBULANCE,
  CAR_STRANDED,
  CONE,
  FUEL,
  MEDKIT,
  POTHOLE,
  SHIELD,
  drawSprite,
} from "@/components/game/sprites";

/* ─── Types ─── */

type EntityKind = "car" | "pothole" | "cone" | "shield" | "fuel" | "medkit";

interface Entity {
  lane: number;
  y: number;
  kind: EntityKind;
  rescued?: boolean;
}

interface Toast {
  text: string;
  color: string;
  y: number;
  ttl: number;
}

/* ─── Constants ─── */

const LANES = 3;
const BASE_SPEED = 3;
const SPEED_INC = 0.15; // extra speed per 500 pts
const SPAWN_INTERVAL = 55; // frames between spawns
const RESCUE_MSGS = [
  "¡SOS Activado!",
  "¡Ficha médica enviada!",
  "¡Vehículo rescatado!",
  "¡Emergencia resuelta!",
  "¡Rex al rescate! 🐾",
];

/* ─── Component ─── */

export function RescueRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen] = useState<"menu" | "play" | "over">("menu");
  const [finalScore, setFinalScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [muted, setMuted] = useState(false);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("rex-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  /* ─── GAME LOOP ─── */
  const gameLoop = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // State
      let lane = 1;
      let score = 0;
      let lives = 3;
      let frame = 0;
      let speed = BASE_SPEED;
      let shieldTimer = 0;
      let invincibleTimer = 0;
      let roadOffset = 0;
      let running = true;
      const entities: Entity[] = [];
      const toasts: Toast[] = [];

      // Responsive sizing
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const parent = canvas.parentElement;
        if (!parent) return;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      resize();
      window.addEventListener("resize", resize);

      const W = () => canvas.width / (Math.min(window.devicePixelRatio || 1, 2));
      const H = () => canvas.height / (Math.min(window.devicePixelRatio || 1, 2));

      // Lane X positions
      const laneX = (l: number) => {
        const w = W();
        const roadW = Math.min(w * 0.75, 360);
        const roadLeft = (w - roadW) / 2;
        const laneW = roadW / LANES;
        return roadLeft + laneW * l + laneW / 2;
      };

      // Sprite scale — larger for better visibility
      const spriteScale = () => Math.max(2.5, Math.min(W() / 90, 4.5));

      // Controls
      const moveLeft = () => { if (lane > 0) lane--; };
      const moveRight = () => { if (lane < LANES - 1) lane++; };

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") moveLeft();
        if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") moveRight();
      };
      window.addEventListener("keydown", onKey);

      // Touch controls
      let touchStartX = 0;
      const onTouchStart = (e: TouchEvent) => {
        touchStartX = e.touches[0].clientX;
      };
      const onTouchEnd = (e: TouchEvent) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 30) {
          if (dx < 0) moveLeft();
          else moveRight();
        } else {
          // Tap on left or right half
          const x = e.changedTouches[0].clientX;
          if (x < W() / 2) moveLeft();
          else moveRight();
        }
      };
      canvas.addEventListener("touchstart", onTouchStart, { passive: true });
      canvas.addEventListener("touchend", onTouchEnd, { passive: true });

      // Spawn
      const spawn = () => {
        const rand = Math.random();
        let kind: EntityKind;
        if (rand < 0.35) kind = "car";
        else if (rand < 0.55) kind = "pothole";
        else if (rand < 0.72) kind = "cone";
        else if (rand < 0.82) kind = "shield";
        else if (rand < 0.92) kind = "fuel";
        else kind = "medkit";

        const l = Math.floor(Math.random() * LANES);
        entities.push({ lane: l, y: -50, kind });
      };

      // Collision check
      const checkCollision = (e: Entity, playerX: number, playerY: number) => {
        const sc = spriteScale();
        const eX = laneX(e.lane);
        const halfW = 6 * sc;
        const halfH = 8 * sc;
        return (
          Math.abs(eX - playerX) < halfW * 1.4 &&
          Math.abs(e.y - playerY) < halfH * 1.2
        );
      };

      // Draw road
      const drawRoad = () => {
        const w = W();
        const h = H();
        const roadW = Math.min(w * 0.75, 360);
        const roadLeft = (w - roadW) / 2;

        // Road surface
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(roadLeft, 0, roadW, h);

        // Side stripes
        ctx.fillStyle = "#E11D48";
        ctx.fillRect(roadLeft - 4, 0, 4, h);
        ctx.fillRect(roadLeft + roadW, 0, 4, h);

        // Lane dividers (dashed)
        ctx.strokeStyle = "#FFD700";
        ctx.lineWidth = 2;
        ctx.setLineDash([20, 15]);
        ctx.lineDashOffset = -roadOffset;
        for (let i = 1; i < LANES; i++) {
          const x = roadLeft + (roadW / LANES) * i;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        ctx.setLineDash([]);

        // Grass/shoulder
        ctx.fillStyle = "#0d1117";
        ctx.fillRect(0, 0, roadLeft - 4, h);
        ctx.fillRect(roadLeft + roadW + 4, 0, w - roadLeft - roadW - 4, h);
      };

      // Draw HUD
      const drawHUD = () => {
        const w = W();
        ctx.font = "bold 20px monospace";

        // Score
        ctx.fillStyle = "#FFD700";
        ctx.textAlign = "left";
        ctx.fillText(`SCORE: ${score}`, 12, 28);

        // Lives
        ctx.fillStyle = "#E11D48";
        ctx.textAlign = "right";
        let livesText = "";
        for (let i = 0; i < lives; i++) livesText += "❤️ ";
        ctx.fillText(livesText.trim(), w - 12, 28);

        // Shield indicator
        if (shieldTimer > 0) {
          ctx.fillStyle = "#0EA5E9";
          ctx.textAlign = "center";
          ctx.fillText(`🛡️ ${Math.ceil(shieldTimer / 60)}s`, w / 2, 28);
        }
      };

      // Main loop
      const tick = () => {
        if (!running) return;
        const w = W();
        const h = H();

        // Clear
        ctx.clearRect(0, 0, w, h);

        // Update speed
        speed = BASE_SPEED + Math.floor(score / 500) * SPEED_INC;
        roadOffset = (roadOffset + speed) % 35;

        // Draw road
        drawRoad();

        // Spawn entities
        if (frame % Math.max(20, SPAWN_INTERVAL - Math.floor(score / 200) * 3) === 0) {
          spawn();
        }

        // Update and draw entities
        const sc = spriteScale();
        const playerX = laneX(lane);
        const playerY = h - 80;

        for (let i = entities.length - 1; i >= 0; i--) {
          const e = entities[i];
          e.y += speed;

          // Remove off-screen
          if (e.y > h + 60) {
            entities.splice(i, 1);
            continue;
          }

          // Draw entity
          const ex = laneX(e.lane);
          switch (e.kind) {
            case "car":
              drawSprite(ctx, CAR_STRANDED, ex - 8 * sc, e.y - 8 * sc, sc);
              break;
            case "pothole":
              drawSprite(ctx, POTHOLE, ex - 6 * sc, e.y - 6 * sc, sc);
              break;
            case "cone":
              drawSprite(ctx, CONE, ex - 6 * sc, e.y - 6 * sc, sc);
              break;
            case "shield":
              drawSprite(ctx, SHIELD, ex - 6 * sc, e.y - 6 * sc, sc);
              // Glow
              ctx.shadowColor = "#0EA5E9";
              ctx.shadowBlur = 12;
              ctx.fillStyle = "transparent";
              ctx.fillRect(ex - 6 * sc, e.y - 6 * sc, 12 * sc, 12 * sc);
              ctx.shadowBlur = 0;
              break;
            case "fuel":
              drawSprite(ctx, FUEL, ex - 6 * sc, e.y - 6 * sc, sc);
              break;
            case "medkit":
              drawSprite(ctx, MEDKIT, ex - 6 * sc, e.y - 6 * sc, sc);
              // Glow
              ctx.shadowColor = "#E11D48";
              ctx.shadowBlur = 10;
              ctx.fillStyle = "transparent";
              ctx.fillRect(ex - 6 * sc, e.y - 6 * sc, 12 * sc, 12 * sc);
              ctx.shadowBlur = 0;
              break;
          }

          // Collision
          if (checkCollision(e, playerX, playerY)) {
            switch (e.kind) {
              case "car":
                score += 100;
                toasts.push({
                  text: RESCUE_MSGS[Math.floor(Math.random() * RESCUE_MSGS.length)],
                  color: "#10B981",
                  y: playerY - 40,
                  ttl: 60,
                });
                if (!muted) sfxRescue();
                break;
              case "pothole":
              case "cone":
                if (shieldTimer > 0) {
                  toasts.push({ text: "¡Escudo!", color: "#0EA5E9", y: playerY - 40, ttl: 40 });
                } else if (invincibleTimer <= 0) {
                  lives--;
                  invincibleTimer = 90; // 1.5s i-frames
                  if (!muted) sfxHit();
                  if (lives <= 0) {
                    running = false;
                    if (!muted) sfxGameOver();
                    stopBGM();
                    setFinalScore(score);
                    if (score > highScore) {
                      setHighScore(score);
                      localStorage.setItem("rex-highscore", String(score));
                    }
                    setScreen("over");
                    cleanup();
                    return;
                  }
                }
                break;
              case "shield":
                shieldTimer = 300; // 5 seconds
                if (!muted) sfxPickup();
                toasts.push({ text: "¡SOS Shield!", color: "#0EA5E9", y: playerY - 40, ttl: 50 });
                break;
              case "fuel":
                score += 50;
                speed += 0.3;
                if (!muted) sfxPickup();
                toasts.push({ text: "+50 ⛽", color: "#10B981", y: playerY - 40, ttl: 40 });
                break;
              case "medkit":
                if (lives < 3) lives++;
                if (!muted) sfxPickup();
                toasts.push({ text: "+1 ❤️", color: "#E11D48", y: playerY - 40, ttl: 50 });
                break;
            }
            entities.splice(i, 1);
          }
        }

        // Draw player (ambulance)
        if (invincibleTimer > 0) {
          invincibleTimer--;
          if (Math.floor(invincibleTimer / 6) % 2 === 0) {
            drawSprite(ctx, AMBULANCE, playerX - 8 * sc, playerY - 8 * sc, sc);
          }
        } else {
          drawSprite(ctx, AMBULANCE, playerX - 8 * sc, playerY - 8 * sc, sc);
        }

        // Shield aura
        if (shieldTimer > 0) {
          shieldTimer--;
          ctx.strokeStyle = `rgba(14, 165, 233, ${0.4 + Math.sin(frame * 0.1) * 0.2})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(playerX, playerY, 20 * sc / 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Toasts
        for (let i = toasts.length - 1; i >= 0; i--) {
          const t = toasts[i];
          t.y -= 1;
          t.ttl--;
          ctx.globalAlpha = Math.min(1, t.ttl / 20);
          ctx.font = "bold 18px monospace";
          ctx.fillStyle = t.color;
          ctx.textAlign = "center";
          // Draw text shadow for readability
          ctx.shadowColor = "rgba(0,0,0,0.7)";
          ctx.shadowBlur = 6;
          ctx.fillText(t.text, w / 2, t.y);
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          if (t.ttl <= 0) toasts.splice(i, 1);
        }

        // HUD
        drawHUD();

        // Scanline effect (subtle)
        for (let sy = 0; sy < h; sy += 3) {
          ctx.fillStyle = "rgba(0,0,0,0.06)";
          ctx.fillRect(0, sy, w, 1);
        }

        frame++;
        requestAnimationFrame(tick);
      };

      const cleanup = () => {
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("resize", resize);
        canvas.removeEventListener("touchstart", onTouchStart);
        canvas.removeEventListener("touchend", onTouchEnd);
      };

      // Start
      if (!muted) startBGM();
      requestAnimationFrame(tick);

      return () => {
        running = false;
        cleanup();
        stopBGM();
      };
    },
    [muted, highScore],
  );

  // Run game loop when playing
  useEffect(() => {
    if (screen !== "play" || !canvasRef.current) return;
    const cleanup = gameLoop(canvasRef.current);
    return cleanup;
  }, [screen, gameLoop]);

  const handleStart = () => {
    resumeAudio();
    setScreen("play");
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        fontFamily: "monospace",
        overflow: "hidden",
      }}
    >
      {/* Back link */}
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 50 }}>
        <Link
          href="/"
          style={{
            color: "#94A3B8",
            textDecoration: "none",
            fontSize: 13,
            fontFamily: "monospace",
            padding: "6px 12px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          ← Volver
        </Link>
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => {
          setMuted((m) => {
            if (!m) stopBGM();
            return !m;
          });
        }}
        style={{
          position: "absolute",
          top: 12,
          right: 12,
          zIndex: 50,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8,
          padding: "6px 12px",
          color: "#94A3B8",
          fontSize: 16,
          cursor: "pointer",
          fontFamily: "monospace",
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* Menu screen */}
      {screen === "menu" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            padding: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, lineHeight: 1 }}>🚑</div>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              margin: 0,
              letterSpacing: 2,
            }}
          >
            REX AL RESCATE
          </h1>
          <p style={{ color: "#FFD700", fontSize: 14, margin: 0, fontWeight: 700 }}>
            MINI JUEGO RETRO 16-BIT
          </p>
          <p
            style={{
              color: "#94A3B8",
              fontSize: 12,
              maxWidth: 300,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Conduce la ambulancia de RescueNow. Rescata vehículos varados y
            esquiva obstáculos en la carretera.
          </p>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              color: "#64748B",
              fontSize: 11,
            }}
          >
            <span>🚗 Toca autos varados = +100 pts</span>
            <span>🛡️ Escudo SOS = invencibilidad 5s</span>
            <span>⛽ Gasolina = +50 pts</span>
            <span>🏥 Kit médico = +1 vida</span>
            <span>🕳️ Baches y 🔶 Conos = -1 vida</span>
          </div>

          <div style={{ color: "#475569", fontSize: 11, marginTop: 4 }}>
            Controles: ← → o swipe / tap en pantalla
          </div>

          {highScore > 0 && (
            <div style={{ color: "#FFD700", fontSize: 13, fontWeight: 700 }}>
              RÉCORD: {highScore}
            </div>
          )}

          <button
            onClick={handleStart}
            style={{
              marginTop: 12,
              background: "linear-gradient(135deg, #E11D48, #B91C3C)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px 48px",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "monospace",
              letterSpacing: 2,
              boxShadow: "0 8px 30px rgba(225,29,72,0.4)",
              transition: "transform 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.transform = "scale(1)")
            }
          >
            ▶ JUGAR
          </button>
        </div>
      )}

      {/* Game canvas */}
      {screen === "play" && (
        <div style={{ flex: 1, position: "relative" }}>
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              touchAction: "none",
            }}
          />
        </div>
      )}

      {/* Game Over screen */}
      {screen === "over" && (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 42 }}>💥</div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#E11D48",
              margin: 0,
              letterSpacing: 2,
            }}
          >
            GAME OVER
          </h2>
          <div style={{ color: "#fff", fontSize: 32, fontWeight: 900 }}>
            {finalScore}
            <span style={{ color: "#94A3B8", fontSize: 14, marginLeft: 6 }}>
              PTS
            </span>
          </div>
          {finalScore >= highScore && finalScore > 0 && (
            <div
              style={{
                color: "#FFD700",
                fontSize: 14,
                fontWeight: 800,
                animation: "pulse 1s infinite",
              }}
            >
              🏆 ¡NUEVO RÉCORD!
            </div>
          )}
          <div style={{ color: "#64748B", fontSize: 12 }}>
            Mejor: {highScore}
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <button
              onClick={handleStart}
              style={{
                background: "linear-gradient(135deg, #E11D48, #B91C3C)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "12px 36px",
                fontSize: 14,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "monospace",
                letterSpacing: 1,
                boxShadow: "0 6px 24px rgba(225,29,72,0.35)",
              }}
            >
              ↻ REINTENTAR
            </button>
            <Link
              href="/"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "#94A3B8",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "monospace",
              }}
            >
              ← INICIO
            </Link>
          </div>

          <p
            style={{
              color: "#475569",
              fontSize: 11,
              marginTop: 16,
              maxWidth: 280,
              lineHeight: 1.5,
            }}
          >
            Descarga RescueNow para tener asistencia real en carretera — no solo
            en el juego 🐾
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
