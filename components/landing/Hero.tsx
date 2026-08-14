"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type HeroBanner = {
  title: string | null;
  subtitle: string | null;
  imageUrl: string;
};

export default function Hero({ banner }: { banner?: HeroBanner }) {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#E3F2F9]">
      {banner?.imageUrl ? (
        <div className="absolute inset-0">
          <Image
            src={banner.imageUrl}
            alt={banner.title ?? "Hero banner"}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[#174A63]/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#EDF7FB] via-[#E3F2F9] to-[#D3E7F1]" />
      )}

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-28 text-center lg:py-32">
        {banner?.subtitle && (
          <p className="text-[11px] font-semibold tracking-[0.4em] text-gold uppercase">
            {banner.subtitle}
          </p>
        )}

        <h1 className="mt-6 font-display text-[2.75rem] font-medium leading-[1.02] text-white sm:text-7xl lg:text-8xl">
          {banner?.title ? (
            banner.title
          ) : (
            <>
              Rare Attars,
              <br />
              <span className="italic">Crafted by Hand</span>
            </>
          )}
        </h1>

        <div className="mt-10 flex flex-col items-center justify-center gap-4">
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
        </div>
      </div>
    </section>
  );
}
