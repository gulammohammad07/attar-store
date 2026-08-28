"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { m as motion } from "framer-motion";
import { useState } from "react";

type HeroBanner = {
  title: string | null;
  subtitle: string | null;
  description: string | null;
  desktopImageUrl: string;
  tabletImageUrl: string | null;
  mobileImageUrl: string | null;
};

export default function Hero({ banner }: { banner?: HeroBanner }) {
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    banner?.desktopImageUrl ??
    banner?.tabletImageUrl ??
    banner?.mobileImageUrl ??
    "";

  const showImage = fallbackImage && !imgError;

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#faf9f7]">
      {showImage ? (
        <div className="absolute inset-0">
          <picture>
            {banner?.mobileImageUrl && (
              <source srcSet={banner.mobileImageUrl} media="(max-width: 767px)" />
            )}
            {banner?.tabletImageUrl && (
              <source srcSet={banner.tabletImageUrl} media="(max-width: 1023px)" />
            )}
            <Image
              src={fallbackImage}
              alt={banner?.title ?? "Hero banner"}
              fill
              priority
              quality={75}
              className="object-cover"
              sizes="100vw"
              onError={() => setImgError(true)}
            />
          </picture>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf9f7] via-[#f8fcfe] to-[#f0f7fb]" />
      )}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.18),transparent_70%)]" />
        <div className="absolute left-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(142,201,232,0.12),transparent_70%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 text-center lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {banner?.subtitle && (
            <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
              {banner.subtitle}
            </p>
          )}

          {banner?.title && (
            <h1 className="mt-8 font-display text-[3.2rem] font-medium leading-[0.98] tracking-tight text-[#fff] sm:text-7xl lg:text-[7.5rem]">
              {banner.title}
            </h1>
          )}

          {banner?.description && (
            <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-[#5f7788] sm:text-lg">
              {banner.description}
            </p>
          )}

          <div className="mt-12 flex flex-col items-center justify-center gap-5">
            <Link
              href="/shop"
              className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#c9a96e] via-[#e2cc9c] to-[#c9a96e] px-10 py-4.5 text-sm font-semibold tracking-[0.15em] text-[#0a1b26] shadow-[0_0_60px_rgba(201,169,110,0.35)] transition-all duration-700 hover:shadow-[0_0_80px_rgba(201,169,110,0.5)] hover:scale-[1.04]"
            >
              <span className="relative z-10 flex items-center gap-2.5">
                Explore Collection
                <ArrowRight
                  size={16}
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                />
              </span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            </Link>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-[#5f7788] uppercase transition-colors duration-500 hover:text-gold bg-[#fff] px-6 py-3 rounded-full border border-[#5f7788]/20 hover:border-gold/50"
            >
              View All Fragrances
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-[#e0ecf2]">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mt-2 h-2 w-1 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
}
