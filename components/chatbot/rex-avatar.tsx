"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

export type RexMood = "idle" | "jump" | "belly";

export function RexAvatar({
  size = 56,
  className,
  animate = false,
  mood = "idle",
  comando = false,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
  mood?: RexMood;
  comando?: boolean;
}) {
  const capFill = comando ? "#1f2937" : "#DC2626";
  const crossFill = comando ? "#1f2937" : "#FFFFFF";
  const innerCross = comando ? "#1f2937" : "#DC2626";

  const moodStyle: CSSProperties = {};
  if (mood === "jump") {
    moodStyle.animation = "rex-jump 0.9s cubic-bezier(.34,1.56,.64,1)";
  } else if (mood === "belly") {
    moodStyle.transform = "rotate(180deg)";
    moodStyle.transition = "transform 0.5s ease";
  }

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center select-none",
        animate && "animate-dog-jump",
        className,
      )}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 30% 20%, #FDE68A, #F59E0B 60%, #B45309)",
        boxShadow:
          "0 10px 30px -8px rgba(245,158,11,0.6), inset 0 -3px 8px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.4)",
        ...moodStyle,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size * 0.78}
        height={size * 0.78}
        aria-hidden
      >
        <g>
          {/* Orejas caídas estilo San Bernardo */}
          <path
            d="M10 22 Q 8 36 14 46 Q 20 48 22 38 Q 22 26 18 22 Z"
            fill="#7C2D12"
          />
          <path
            d="M54 22 Q 56 36 50 46 Q 44 48 42 38 Q 42 26 46 22 Z"
            fill="#7C2D12"
          />
          {/* Tono medio interno de las orejas */}
          <path d="M13 28 Q 12 38 16 44 Q 18 40 18 32 Z" fill="#9A3412" />
          <path d="M51 28 Q 52 38 48 44 Q 46 40 46 32 Z" fill="#9A3412" />

          {/* Cara blanca con manchas tan */}
          <ellipse cx="32" cy="38" rx="17" ry="16" fill="#FFFBEB" />
          <ellipse cx="24" cy="32" rx="6" ry="5" fill="#D4A373" />
          <ellipse cx="40" cy="32" rx="6" ry="5" fill="#D4A373" />
          <ellipse cx="32" cy="26" rx="6" ry="3" fill="#D4A373" opacity="0.6" />
          {/* Hocico blanco */}
          <ellipse cx="32" cy="46" rx="11" ry="7" fill="#FFFFFF" />
          {/* Ojos con brillo */}
          <circle cx="24" cy="34" r="2.6" fill="#0B1120" />
          <circle cx="40" cy="34" r="2.6" fill="#0B1120" />
          <circle cx="24.8" cy="33.0" r="0.8" fill="#fff" />
          <circle cx="40.8" cy="33.0" r="0.8" fill="#fff" />
          {/* Nariz */}
          <ellipse cx="32" cy="44" rx="3.4" ry="2.2" fill="#0B1120" />
          {/* Lengüita */}
          <path
            d="M30 50 Q 32 54 34 50 L 33 49 L 31 49 Z"
            fill="#F472B6"
          />
          {/* Boca */}
          <path
            d="M28 47 Q 32 49 36 47"
            stroke="#0B1120"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Gorra */}
          <rect x="10" y="6" width="44" height="9" rx="4" fill={capFill} />
          <rect x="14" y="14" width="36" height="3" rx="1.5" fill="#7C1D1D" opacity={comando ? "0.6" : "0.7"} />
          {!comando && (
            <>
              <rect x="28" y="2" width="8" height="10" rx="2" fill={crossFill} />
              <rect x="30" y="4" width="4" height="6" fill={innerCross} />
              <rect x="26" y="6" width="12" height="3" fill={innerCross} />
            </>
          )}
          {comando && (
            <path
              d="M32 4 L 33.5 7 L 36.5 7.5 L 34.2 9.6 L 35 12.6 L 32 11 L 29 12.6 L 29.8 9.6 L 27.5 7.5 L 30.5 7 Z"
              fill="#FACC15"
            />
          )}
        </g>
      </svg>
    </div>
  );
}
