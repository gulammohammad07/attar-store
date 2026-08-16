"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, m as motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import type { Product } from "@/lib/data/products";
import LuxuryProductCard from "@/components/plp/LuxuryProductCard";

export type SortOption = "popularity" | "price-asc" | "price-desc" | "newest";

const SORT_LABELS: Record<SortOption, string> = {
  popularity: "Most Loved",
  "price-asc": "Price · Low to High",
  "price-desc": "Price · High to Low",
  newest: "Newest First",
};

const PAGE_SIZE = 6;

export default function LuxuryProductGrid({
  products,
  initialSort = "popularity",
  sectionTitle = "Signature Attars",
  sectionEyebrow = "The Collection",
}: {
  products: Product[];
  initialSort?: SortOption;
  sectionTitle?: string;
  sectionEyebrow?: string;
}) {
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const sorted = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
        break;
      case "price-desc":
        list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
        break;
      case "newest":
        list.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [products, sort]);

  const visibleProducts = sorted.slice(0, visible);
  const hasMore = visible < sorted.length;

  const handleSort = (next: SortOption) => {
    setSort(next);
    setVisible(PAGE_SIZE);
  };

  return (
    <section className="scroll-mt-24 bg-[#f8fcfe] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
              {sectionEyebrow}
            </p>
            <h2 className="mt-4 font-display text-5xl font-medium tracking-tight text-[#0f2838] sm:text-6xl lg:text-7xl">
              {sectionTitle}
            </h2>
            <p className="mt-5 text-sm text-[#5f7788]/60">
              {sorted.length}{" "}
              {sorted.length === 1 ? "rare blend" : "rare blends"} · hand-poured
              &amp; ready to wear
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              aria-label="Sort products"
              className="cursor-pointer appearance-none rounded-full border border-gold/20 bg-white/80 py-3.5 pl-6 pr-12 text-xs font-medium tracking-[0.12em] text-[#0f2838]/70 uppercase backdrop-blur-xl transition-all duration-500 focus:border-gold/60 focus:outline-none hover:border-gold/40"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key} className="bg-white text-[#0f2838]">
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
            <ArrowDown
              size={14}
              className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gold"
            />
          </motion.div>
        </div>

        {sorted.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <LuxuryProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-28 text-center">
            <p className="font-display text-4xl font-medium text-[#0f2838]">
              Nothing here yet
            </p>
            <p className="mt-4 text-sm text-[#5f7788]/50">
              New blends are poured every season.
            </p>
          </div>
        )}

        {hasMore && (
          <div className="mt-20 flex justify-center">
            <motion.button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3.5 rounded-full border border-gold/40 bg-white/70 px-11 py-4.5 text-xs font-semibold tracking-[0.24em] text-[#0f2838]/70 uppercase backdrop-blur-xl transition-all duration-700 hover:border-gold hover:bg-gold hover:text-[#0a1b26] hover:shadow-[0_20px_50px_-15px_rgba(201,169,110,0.5)]"
            >
              Load More
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 transition-colors duration-500 group-hover:border-[#0a1b26]/30">
                <ArrowDown
                  size={12}
                  className="transition-transform duration-500 group-hover:translate-y-0.5"
                />
              </span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
