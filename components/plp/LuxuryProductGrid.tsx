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
    <section id="collection" className="scroll-mt-20 bg-[#E3F2F9] pb-24 pt-4">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.34em] text-gold uppercase">
              {sectionEyebrow}
            </p>
            <h2 className="mt-3 font-display text-5xl font-medium text-[#174A63] sm:text-6xl">
              {sectionTitle}
            </h2>
            <p className="mt-4 text-sm text-[#174A63]/45">
              {sorted.length}{" "}
              {sorted.length === 1 ? "rare blend" : "rare blends"} · hand-poured
              &amp; ready to wear
            </p>
          </motion.div>

          {/* Minimal sort */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              aria-label="Sort products"
              className="cursor-pointer appearance-none rounded-full border border-[#174A63]/15 bg-white/60 py-3 pl-5 pr-11 text-xs font-medium tracking-[0.12em] text-[#174A63]/70 uppercase backdrop-blur-sm transition-colors focus:border-gold focus:outline-none"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                <option key={key} value={key}>
                  {SORT_LABELS[key]}
                </option>
              ))}
            </select>
            <ArrowDown
              size={14}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gold"
            />
          </motion.div>
        </div>

        {/* Grid — 3 columns on desktop */}
        {sorted.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <LuxuryProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="py-28 text-center">
            <p className="font-display text-4xl font-medium text-[#174A63]">
              Nothing here yet
            </p>
            <p className="mt-3 text-sm text-[#174A63]/50">
              New blends are poured every season.
            </p>
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div className="mt-16 flex justify-center">
            <motion.button
              type="button"
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-3 rounded-full border border-gold/50 bg-white/50 px-10 py-4 text-xs font-semibold tracking-[0.22em] text-[#174A63]/75 uppercase backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold hover:text-white hover:shadow-[0_14px_40px_-12px_rgba(201,169,110,0.7)]"
            >
              Load More
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-gold/40 transition-colors group-hover:border-white/40">
                <ArrowDown
                  size={12}
                  className="transition-transform group-hover:translate-y-0.5"
                />
              </span>
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
}
