"use client";

import { cn } from "@/lib/utils";

export function RexAvatar({
  size = 56,
  className,
  animate = false,
}: {
  size?: number;
  className?: string;
  animate?: boolean;
}) {
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
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={size * 0.72}
        height={size * 0.72}
        aria-hidden
      >
        <g>
          <ellipse cx="18" cy="22" rx="8" ry="11" fill="#7C2D12" />
          <ellipse cx="46" cy="22" rx="8" ry="11" fill="#7C2D12" />
          <ellipse cx="32" cy="36" rx="18" ry="17" fill="#FED7AA" />
          <ellipse cx="32" cy="42" rx="12" ry="9" fill="#FFFBEB" />
          <circle cx="26" cy="34" r="2.4" fill="#0B1120" />
          <circle cx="38" cy="34" r="2.4" fill="#0B1120" />
          <circle cx="26.8" cy="33.2" r="0.8" fill="#fff" />
          <circle cx="38.8" cy="33.2" r="0.8" fill="#fff" />
          <ellipse cx="32" cy="40" rx="2.6" ry="1.8" fill="#0B1120" />
          <path
            d="M32 42 Q 28 46 26 44 M32 42 Q 36 46 38 44"
            stroke="#0B1120"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <rect x="10" y="8" width="44" height="8" rx="4" fill="#DC2626" />
          <rect x="28" y="4" width="8" height="8" rx="2" fill="#FFFFFF" />
          <rect x="30" y="6" width="4" height="4" fill="#DC2626" />
        </g>
      </svg>
    </div>
  );
}
