"use client";

import { motion } from "framer-motion";

/** Subtle entrance: fade + 8px rise, 250ms ease-out. */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
