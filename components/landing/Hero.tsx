"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

const AttarBottleScene = dynamic(
  () => import("@/components/three/AttarBottleScene"),
  { ssr: false, loading: () => null },
);

type HeroBanner = {
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
};

export default function Hero({ banner }: { banner?: HeroBanner }) {
  const ref = useRef<HTMLElement>(null);
  const [motionOk] = useState(() => {
    if (typeof window === "undefined") return false;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return fine && !reduced;
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(mx, { stiffness: 120, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const raysOpacity = useTransform(scrollYProgress, [0, 0.5], [0.8, 0]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!motionOk) return;
    const { innerWidth, innerHeight } = window;
    mx.set((e.clientX / innerWidth - 0.5) * 14);
    my.set(-(e.clientY / innerHeight - 0.5) * 14);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#0a0908]"
    >
      {/* Golden rays */}
      <motion.div
        style={{ opacity: raysOpacity }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="rays absolute -right-[25%] top-1/2 h-[160%] w-[90%] -translate-y-1/2 motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_38%,rgba(198,161,91,0.14),transparent_58%)]" />
        <div className="absolute -left-40 top-1/3 h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(198,161,91,0.14),transparent_70%)]" />
      </motion.div>

      {/* 3D Scene */}
      <motion.div style={{ y: sceneY }} className="absolute inset-0">
        <AttarBottleScene />
      </motion.div>

      {/* Depth + readability overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0a0908] via-[#0a0908]/55 to-transparent lg:via-[#0a0908]/15" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#0a0908] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0a0908] to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pt-28 pb-32 lg:grid-cols-2 lg:pt-24 lg:pb-24"
      >
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="inline-flex items-center gap-3"
          >
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-gold sm:block" />
            <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
              {banner?.subtitle ?? "The Art of Oriental Fragrance"}
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 font-display text-6xl font-medium leading-[1.02] text-[#f0ebe2] sm:text-7xl lg:text-8xl"
          >
            Rare Attars,
            <br />
            <span className="gold-gradient-text animate-shine italic motion-reduce:animate-none">
              Crafted by Hand
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#f0ebe2]/60 lg:mx-0"
          >
            Small-batch ouds and attars aged in the traditional way. Each blend
            is hand-poured, sun-rested and bottled to be worn like a memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_0_40px_rgba(198,161,91,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(198,161,91,0.55)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Collection
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/#story"
              className="rounded-full border border-[#f0ebe2]/25 px-8 py-4 text-sm font-semibold tracking-wide text-[#f0ebe2] backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-14 flex items-center justify-center gap-10 sm:gap-14 lg:justify-start"
          >
            {[
              { value: "10K+", label: "Happy Clients" },
              { value: "50+", label: "Rare Blends" },
              { value: "4.9★", label: "Avg. Rating" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="relative"
              >
                {i > 0 && (
                  <span className="absolute -left-5 -top-2 h-12 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent sm:-left-7" />
                )}
                <p className="font-display text-3xl font-semibold text-[#f0ebe2] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] tracking-[0.2em] text-[#f0ebe2]/40 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column — floating labels over the bottle */}
        <div className="relative hidden h-full min-h-[420px] lg:block">
          <motion.span
            animate={motionOk ? { y: [0, -14, 0], opacity: [0.5, 1, 0.5] } : { y: 0, opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            style={{ rotateX, rotateY }}
            className="absolute right-[6%] top-[16%] flex items-center gap-2 rounded-full border border-gold/40 bg-[#0a0908]/80 px-5 py-2 text-[10px] tracking-[0.22em] text-gold uppercase"
          >
            <Sparkles size={12} /> Pure Oud
          </motion.span>

          <motion.span
            animate={motionOk ? { y: [0, -16, 0], opacity: [0.5, 1, 0.5] } : { y: 0, opacity: 1 }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            style={{ rotateX, rotateY }}
            className="absolute bottom-[22%] right-[0%] flex items-center gap-2 rounded-full border border-gold/40 bg-[#0a0908]/80 px-5 py-2 text-[10px] tracking-[0.22em] text-gold uppercase"
          >
            <Sparkles size={12} /> Hand-Poured
          </motion.span>

          <motion.span
            animate={motionOk ? { y: [0, -12, 0], opacity: [0.5, 1, 0.5] } : { y: 0, opacity: 1 }}
            transition={{ duration: 5.5, repeat: Infinity, delay: 3 }}
            style={{ rotateX, rotateY }}
            className="absolute right-[30%] top-[58%] flex items-center gap-2 rounded-full border border-gold/40 bg-[#0a0908]/80 px-5 py-2 text-[10px] tracking-[0.22em] text-gold uppercase"
          >
            <Sparkles size={12} /> Sun-Rested
          </motion.span>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 z-20 -translate-x-1/2"
      >
        <motion.div
          animate={motionOk ? { y: [0, 8, 0] } : { y: 0 }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-[#f0ebe2]/25 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
