"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BlurText({
  text,
  className,
  delay = 0,
  as: Tag = "span",
  stagger = 0.035,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <Tag className={cn("inline-block", className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.6,
            delay: delay + i * stagger,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {word}
          {i < words.length - 1 && " "}
        </motion.span>
      ))}
    </Tag>
  );
}
