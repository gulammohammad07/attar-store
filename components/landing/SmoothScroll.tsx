"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const isPopstateRef = useRef(false);
  const isFirstPathRef = useRef(true);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    // Lenis virtual scroll is only beneficial on precise pointers (desktop).
    // Coarse pointers (touch/mobile) keep buttery native scrolling.
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      autoRaf: true,
    });
    lenisRef.current = lenis;

    // Track back/forward navigations so we adopt the router-restored scroll
    // position instead of forcing the top.
    const onPopstate = () => {
      isPopstateRef.current = true;
    };
    window.addEventListener("popstate", onPopstate);

    return () => {
      window.removeEventListener("popstate", onPopstate);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Skip the very first mount — the browser already owns the initial position.
    if (isFirstPathRef.current) {
      isFirstPathRef.current = false;
      return;
    }

    const lenis = lenisRef.current;
    if (!lenis) return;

    if (isPopstateRef.current) {
      // Back/forward: let Next restore its scroll position first, then make
      // Lenis adopt it so the RAF loop stops dragging the page back.
      isPopstateRef.current = false;
      requestAnimationFrame(() => {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      });
    } else {
      // Push navigation (Link/router.push): Lenis's internal target still
      // holds the previous page's scroll offset, which fights Next's reset
      // and leaves the new page stranded mid-scroll. Jump to the top and
      // re-own the position instantly.
      lenis.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);

  return null;
}
