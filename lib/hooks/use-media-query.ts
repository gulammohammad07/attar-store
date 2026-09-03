"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query subscription. Returns false on the server and during
 * the first client render, then re-renders once the real value is known —
 * useSyncExternalStore keeps that transition tear-free.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * True only for devices that can actually hover with a precise pointer and
 * whose owner has not asked for reduced motion.
 *
 * Use this to gate cursor-driven effects (3D tilt, glare, parallax). Those
 * effects are invisible on a touchscreen but still cost spring subscriptions
 * and per-frame style writes on the main thread, which is exactly the budget
 * a mid-range phone does not have.
 */
export function useHoverCapable(): boolean {
  const finePointer = useMediaQuery("(pointer: fine)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  return finePointer && !prefersReduced;
}
