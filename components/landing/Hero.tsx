"use client";

import Link from "next/link";
import {
  m as motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroVisual from "@/components/landing/HeroVisual";

type HeroBanner = {
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
};

function useMediaQuery(query: string): boolean {
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

export default function Hero({ banner }: { banner?: HeroBanner }) {
  const ref = useRef<HTMLElement>(null);
  const finePointer = useMediaQuery("(pointer: fine)");
  const prefersReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const motionOk = finePointer && !prefersReduced;

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
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#E3F2F9]"
    >
      {/* Desert sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EDF7FB] via-[#E3F2F9] to-[#D3E7F1]" />

      {/* Sun glow */}
      <div className="absolute left-1/2 top-[-18%] h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(224,199,149,0.5),rgba(224,199,149,0.12)_55%,transparent_72%)]" />
      <div className="absolute left-1/2 top-[-30%] h-[46vmin] w-[46vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.7),transparent_68%)]" />

      {/* Golden rays */}
      <motion.div
        style={{ opacity: raysOpacity }}
        className="pointer-events-none absolute inset-0"
        aria-hidden
      >
        <div className="rays absolute -right-[25%] top-1/2 h-[160%] w-[90%] -translate-y-1/2 opacity-60 motion-reduce:animate-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_28%_38%,rgba(220,201,160,0.16),transparent_58%)]" />
        <div className="absolute -left-40 top-1/3 h-[460px] w-[460px] bg-[radial-gradient(circle,rgba(201,169,110,0.12),transparent_70%)]" />
      </motion.div>

      {/* Desert dunes */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[radial-gradient(ellipse_120%_100%_at_50%_100%,rgba(220,201,160,0.45),rgba(220,201,160,0)_62%)]" />
      <div className="absolute inset-x-[-10%] bottom-[-14%] h-[42%] rounded-[100%] bg-[#DCCDA6]/70 blur-xl" />
      <div className="absolute inset-x-[-6%] bottom-[-20%] h-[38%] rounded-[100%] bg-[#C9A96E]/60 blur-2xl" />

      {/* Depth + readability overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#E3F2F9]/45 via-transparent to-transparent lg:from-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#E3F2F9] to-transparent" />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-20 mx-auto grid w-full max-w-7xl items-center gap-10 px-6 pt-28 pb-32 lg:grid-cols-2 lg:pt-24 lg:pb-24"
      >
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="inline-flex items-center gap-3"
          >
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-gold sm:block" />
            <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
              {banner?.subtitle ?? "The Art of Oriental Fragrance"}
            </p>
          </motion.div>

          <h1
            className="mt-6 font-display text-[2.75rem] font-medium leading-[1.02] text-[#174A63] sm:text-7xl lg:text-8xl"
          >
            Rare Attars,
            <br />
            <span className="gold-gradient-text animate-shine italic motion-reduce:animate-none">
              Crafted by Hand
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#174A63]/55 lg:mx-0"
          >
            Small-batch ouds and attars aged in the traditional way. Each blend
            is hand-poured, sun-rested and bottled to be worn like a memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-[0_0_40px_rgba(201,169,110,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_60px_rgba(201,169,110,0.55)]"
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
              className="rounded-full border border-[#174A63]/25 px-8 py-4 text-sm font-semibold tracking-wide text-[#174A63] backdrop-blur-sm transition-colors hover:border-gold hover:text-gold"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
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
                <p className="font-display text-3xl font-semibold text-[#174A63] sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] tracking-[0.2em] text-[#174A63]/45 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right column — CSS bottle + floating labels */}
        <div className="relative hidden h-full min-h-[420px] lg:block">
          <motion.div
            style={{
              y: sceneY,
              rotateX: motionOk ? rotateX : 0,
              rotateY: motionOk ? rotateY : 0,
              transformStyle: "preserve-3d",
            }}
            className="h-full"
          >
            <HeroVisual motionOk={motionOk} />
          </motion.div>

          <motion.span
            animate={motionOk ? { y: [0, -14, 0], opacity: [0.5, 1, 0.5] } : { y: 0, opacity: 1 }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute right-[6%] top-[16%] flex items-center gap-2 rounded-full border border-gold/40 bg-white/75 px-5 py-2 text-[10px] font-medium tracking-[0.22em] text-[#174A63]/75 uppercase shadow-lg backdrop-blur-md"
          >
            <Sparkles size={12} className="text-gold" /> Pure Oud
          </motion.span>

          <motion.span
            animate={motionOk ? { y: [0, -16, 0], opacity: [0.5, 1, 0.5] } : { y: 0, opacity: 1 }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute bottom-[22%] right-[0%] flex items-center gap-2 rounded-full border border-gold/40 bg-white/75 px-5 py-2 text-[10px] font-medium tracking-[0.22em] text-[#174A63]/75 uppercase shadow-lg backdrop-blur-md"
          >
            <Sparkles size={12} className="text-gold" /> Hand-Poured
          </motion.span>

          <motion.span
            animate={motionOk ? { y: [0, -12, 0], opacity: [0.5, 1, 0.5] } : { y: 0, opacity: 1 }}
            transition={{ duration: 5.5, repeat: Infinity, delay: 3 }}
            className="absolute right-[30%] top-[58%] flex items-center gap-2 rounded-full border border-gold/40 bg-white/75 px-5 py-2 text-[10px] font-medium tracking-[0.22em] text-[#174A63]/75 uppercase shadow-lg backdrop-blur-md"
          >
            <Sparkles size={12} className="text-gold" /> Sun-Rested
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
          className="flex h-10 w-6 items-start justify-center rounded-full border border-gold/50 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
