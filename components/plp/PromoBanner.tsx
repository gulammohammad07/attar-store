"use client";

import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/data/products";

export default function PromoBanner({ products }: { products: Product[] }) {
  const [first, second] = products;

  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#DCEFF7] py-24 sm:py-32">
      {/* Decorative oversized numerals */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-4 font-display text-[16rem] leading-none font-semibold text-[#174A63]/[0.04] sm:text-[24rem]"
      >
        02
      </span>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* Copy — editorial magazine */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <p className="text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
              The Edit · No. 04
            </p>
          </div>

          <h2 className="mt-6 font-display text-5xl font-medium leading-[0.98] text-[#174A63] sm:text-7xl">
            The{" "}
            <span className="gold-gradient-text animate-shine italic motion-reduce:animate-none">
              Oud
            </span>{" "}
            Edit
          </h2>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-[#174A63]/60">
            Aged in darkness, poured at dawn. Our most coveted resins —
            distilled to their purest essence and bottled for those who wear
            rarity with ease.
          </p>

          <Link
            href="/shop"
            className="group mt-10 inline-flex items-center gap-3 border-b border-[#174A63]/30 pb-2 text-xs font-semibold tracking-[0.22em] text-[#174A63] uppercase transition-colors hover:border-gold hover:text-gold"
          >
            Discover the Edit
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </Link>
        </motion.div>

        {/* Editorial collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mx-auto h-[420px] w-full max-w-md sm:h-[500px]"
        >
          {/* Back plate */}
          <div className="absolute left-[6%] top-[6%] h-[82%] w-[62%] -rotate-6 overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-[0_40px_90px_-30px_rgba(23,74,99,0.35)] backdrop-blur-sm">
            {second && (
              <div className="relative h-full w-full">
                <Image
                  src={second.image}
                  alt={second.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 400px"
                  className="object-contain p-10"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/70 to-transparent p-5 pt-14">
                  <p className="font-display text-lg font-semibold text-[#174A63]">
                    {second.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Front plate */}
          <div className="absolute right-0 top-[16%] h-[78%] w-[58%] rotate-6 overflow-hidden rounded-[2rem] border border-gold/30 bg-[#F4FAFD] shadow-[0_50px_100px_-35px_rgba(201,169,110,0.55)]">
            {first && (
              <div className="relative h-full w-full">
                <Image
                  src={first.image}
                  alt={first.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 380px"
                  className="object-contain p-10"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#F4FAFD] to-transparent p-5 pt-14">
                  <p className="font-display text-lg font-semibold text-[#174A63]">
                    {first.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Floating badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 top-[58%] rounded-2xl border border-gold/30 bg-white/80 px-6 py-4 shadow-xl backdrop-blur-md"
          >
            <p className="font-display text-3xl font-semibold text-gold">
              12
            </p>
            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.2em] text-[#174A63]/60 uppercase">
              Bottles Per Batch
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
