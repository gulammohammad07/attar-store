"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { useCart } from "@/lib/store/cart-context";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export default function TrendingNow({ products }: { products: Product[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  if (products.length === 0) return null;

  const scroll = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return (
    <section className="bg-[#f3ecdf] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
              Most Coveted
            </p>
            <h2 className="mt-3 font-display text-5xl font-medium text-[#1c1712] sm:text-6xl">
              Trending Now
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1c1712]/20 text-[#1c1712] transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1c1712]/20 text-[#1c1712] transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <div
          ref={trackRef}
          className="-mx-6 flex snap-x snap-mandatory gap-7 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="group w-[300px] shrink-0 snap-start sm:w-[340px]"
            >
              <Link href={`/product/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-gradient-to-b from-[#faf6ec] to-[#ecdfc6] shadow-[0_14px_36px_-18px_rgba(28,23,18,0.3)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_34px_60px_-24px_rgba(176,141,87,0.55)]">
                  {/* Ranking */}
                  <span className="absolute left-5 top-4 z-10 font-display text-5xl font-semibold text-[#1c1712]/10">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 300px, 340px"
                    className="object-contain p-7 transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Add button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                      toast.success(`${product.name} added to bag`);
                    }}
                    aria-label={`Add ${product.name} to bag`}
                    className="absolute bottom-5 right-5 z-10 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-[#1c1712] text-[#f0ebe2] opacity-0 shadow-lg transition-all duration-400 hover:bg-gold group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <Plus size={18} />
                  </button>

                  {/* Minimal glass info bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1c1712]/85 via-[#1c1712]/40 to-transparent p-5 pt-16 backdrop-blur-[2px]">
                    <p className="font-display text-xl font-semibold text-[#f0ebe2]">
                      {product.name}
                    </p>
                    <p className="mt-0.5 text-sm text-[#e3c795]">
                      {formatPrice(product.salePrice ?? product.price)}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
