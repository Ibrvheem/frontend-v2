"use client";

import { createContext, useContext, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Strong ease-out — matches --ease-out-strong in globals.css. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const STAGGER_MS = 60;
/** Items mounting within this window of the container count as the first batch. */
const INITIAL_BATCH_MS = 400;

type StaggerContextValue = {
  mountedAt: number;
  nextOrder: () => number;
};

const StaggerContext = createContext<StaggerContextValue | null>(null);

/**
 * Staggered entrance for grids and lists: 60ms per item, fade + 12px rise.
 *
 * Each item animates itself on mount rather than inheriting variants from
 * the container — parent-driven variants leave late-mounted children
 * (pagination, polling) stuck invisible once the parent's sequence has
 * finished. Items in the first batch stagger by mount order; anything
 * arriving later just fades in immediately.
 */
export function StaggerReveal({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul";
}) {
  const [value] = useState<StaggerContextValue>(() => {
    let order = 0;
    return { mountedAt: performance.now(), nextOrder: () => order++ };
  });
  const Component = as === "ul" ? motion.ul : motion.div;
  return (
    <StaggerContext.Provider value={value}>
      <Component className={className}>{children}</Component>
    </StaggerContext.Provider>
  );
}

export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduceMotion = useReducedMotion();
  const ctx = useContext(StaggerContext);
  // Lazy initialiser, not a ref: the order is claimed once on mount and React's
  // purity rules forbid reading a ref or calling performance.now() during render.
  const [delay] = useState(() => {
    const initialBatch =
      ctx !== null && performance.now() - ctx.mountedAt < INITIAL_BATCH_MS;
    return initialBatch && ctx ? (ctx.nextOrder() * STAGGER_MS) / 1000 : 0;
  });

  const Component = as === "li" ? motion.li : motion.div;
  return (
    <Component
      className={className}
      initial={{
        opacity: 0,
        transform: reduceMotion ? "none" : "translateY(12px)",
      }}
      animate={{ opacity: 1, transform: "translateY(0px)" }}
      transition={{ duration: 0.3, ease: EASE_OUT, delay }}
    >
      {children}
    </Component>
  );
}
