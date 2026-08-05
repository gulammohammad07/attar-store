"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const isCoarse = window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: isCoarse,
      touchMultiplier: 1.1,
      wheelMultiplier: 1,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
