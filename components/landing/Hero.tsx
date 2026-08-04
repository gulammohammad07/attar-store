"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import LuxuryParticles from "@/components/landing/LuxuryParticles";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 120, damping: 20 });
  const rotateY = useSpring(mx, { stiffness: 120, damping: 20 });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    mx.set(x * 14);
    my.set(-y * 14);
  };

  return (
    <section
      ref={ref}
      onMouseMove={handleMove}
      className="relative flex min-h-[92vh] items-center overflow-hidden bg-charcoal"
    >
      {/* Ambient glow */}
      <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-gold/20 blur-[140px]" />
      <div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#8a6b3d]/20 blur-[120px]" />

      <LuxuryParticles />

      {/* Content */}
      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-0"
      >
        {/* Copy */}
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase"
          >
            The Art of Oriental Fragrance
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 font-display text-6xl font-medium leading-[1.05] text-[#f0ebe2] sm:text-7xl lg:text-8xl"
          >
            Rare Attars,
            <br />
            <span className="gold-gradient-text italic">Crafted by Hand</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-[#f0ebe2]/60 lg:mx-0"
          >
            Small-batch ouds and attars aged in the traditional way. Each
            blend is hand-poured, sun-rested and bottled to be worn like a
            memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center"
          >
            <Link
              href="/shop"
              className="group relative overflow-hidden rounded-full bg-gold px-8 py-4 text-sm font-semibold tracking-wide text-white transition-transform hover:scale-105"
            >
              <span className="relative z-10">Explore Collection</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/#story"
              className="rounded-full border border-[#f0ebe2]/25 px-8 py-4 text-sm font-semibold tracking-wide text-[#f0ebe2] transition-colors hover:border-gold hover:text-gold"
            >
              Our Story
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-12 hidden items-center justify-center gap-10 lg:flex lg:justify-start"
          >
            {[
              { value: "10K+", label: "Happy Clients" },
              { value: "50+", label: "Rare Blends" },
              { value: "4.9★", label: "Avg. Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl font-semibold text-[#f0ebe2]">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] tracking-[0.18em] text-[#f0ebe2]/40 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Bottle */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <motion.div
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative"
          >
            {/* Halo */}
            <div className="absolute inset-0 scale-75 rounded-full bg-gold/15 blur-3xl" />

            <motion.div
              style={{ y: imageY }}
              className="relative mx-auto aspect-square max-h-[540px] w-full"
            >
              <Image
                src="/images/hero/hero-attar.png"
                alt="Signature Attar bottle"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
              />
            </motion.div>

            {/* Floating accents */}
            <motion.span
              animate={{ y: [0, -12, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute left-4 top-8 rounded-full border border-gold/40 px-4 py-1.5 text-[10px] tracking-[0.2em] text-gold uppercase backdrop-blur"
            >
              Pure Oud
            </motion.span>

            <motion.span
              animate={{ y: [0, -14, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
              className="absolute bottom-16 right-2 rounded-full border border-gold/40 px-4 py-1.5 text-[10px] tracking-[0.2em] text-gold uppercase backdrop-blur"
            >
              Hand-Poured
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="flex h-10 w-6 items-start justify-center rounded-full border border-[#f0ebe2]/30 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}
