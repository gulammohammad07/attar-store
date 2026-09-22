"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { m as motion } from "framer-motion";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";

export default function BestSellers({ products }: { products: Product[] }) {
  const bestSellers = products.filter(
    (p) => p.badge === "Bestseller" || p.rating >= 4.8,
  );
  const items = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = (first?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#faf7f0] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 sm:mb-12"
        >
          <p className="text-[11px] font-bold tracking-[0.35em] text-[#b4532a]/70 uppercase">
            Most Loved
          </p>
          <div className="mt-4 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl font-medium tracking-tight text-[#1a1a1a] sm:text-5xl lg:text-[3.5rem]">
                Best Sellers
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#8a857c]">
                The products our clients return for, again and again.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4 sm:gap-6">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] text-[#1a1a1a] uppercase transition-colors hover:text-[#b4532a]"
              >
                View All
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <button
                type="button"
                onClick={() => scroll(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#8a857c] shadow-[0_4px_16px_-4px_rgba(26,26,26,0.15)] transition-all duration-300 hover:bg-[#1a1a1a] hover:text-white active:scale-95"
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#1a1a1a] shadow-[0_4px_16px_-4px_rgba(26,26,26,0.15)] transition-all duration-300 hover:bg-[#1a1a1a] hover:text-white active:scale-95"
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>

        <div
          ref={trackRef}
          role="region"
          aria-label="Best sellers"
          className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 scroll-pl-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:gap-6 sm:px-6 sm:scroll-pl-6"
        >
          {items.map((product) => (
            <div
              key={product.id}
              className="w-[280px] shrink-0 snap-start sm:w-[320px]"
            >
              <ProductCard product={product} loading="eager" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}