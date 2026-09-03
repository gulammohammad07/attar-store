"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/landing/SectionHeading";

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
    <section className="relative overflow-hidden bg-[#f8fcfe] py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(201,169,110,0.1),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Most Loved"
          title="Best Sellers"
          description="The fragrances our clients return for, again and again."
        />
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scroll(-1)}
          className="absolute top-1/2 left-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#174A63]/15 bg-white/90 text-[#174A63] shadow-[0_8px_24px_-8px_rgba(15,40,56,0.3)] backdrop-blur transition-all hover:bg-[#174A63] hover:text-white sm:left-4 sm:h-12 sm:w-12"
          aria-label="Scroll left"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          className="absolute top-1/2 right-2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#174A63]/15 bg-white/90 text-[#174A63] shadow-[0_8px_24px_-8px_rgba(15,40,56,0.3)] backdrop-blur transition-all hover:bg-[#174A63] hover:text-white sm:right-4 sm:h-12 sm:w-12"
          aria-label="Scroll right"
        >
          <ChevronRight size={18} />
        </button>

        <div
          ref={trackRef}
          role="region"
          aria-label="Best sellers"
          className="-mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((product) => (
            <div
              key={product.id}
              className="w-[300px] shrink-0 snap-start sm:w-[320px]"
            >
              <ProductCard product={product} loading="eager" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}