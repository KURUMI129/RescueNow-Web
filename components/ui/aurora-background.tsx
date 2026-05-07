"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <motion.div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-[120px] opacity-40 dark:opacity-50"
        style={{
          background:
            "radial-gradient(closest-side, rgba(225,29,72,0.8), transparent)",
        }}
        animate={{ x: [0, 80, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-20 -right-40 h-[480px] w-[480px] rounded-full blur-[120px] opacity-30 dark:opacity-45"
        style={{
          background:
            "radial-gradient(closest-side, rgba(14,165,233,0.8), transparent)",
        }}
        animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full blur-[120px] opacity-25 dark:opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.75), transparent)",
        }}
        animate={{ y: [0, -40, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
