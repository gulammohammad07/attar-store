import type { Metadata } from "next";
import {
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import { getActiveOccasions } from "@/lib/actions/occasion.actions";
import type { ActiveOccasion } from "@/lib/actions/occasion.actions";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import type { Product } from "@/lib/data/products";

import LuxuryProductGrid, {
  type SortOption,
} from "@/components/plp/LuxuryProductGrid";
import TrendingNow from "@/components/plp/TrendingNow";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Discover our collection of premium attars and perfumes.",
};

const VALID_SORTS: SortOption[] = ["popularity", "price-asc", "price-desc", "newest"];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const [products, categories, occasions] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
    getActiveOccasions(),
  ]) as [Product[], StorefrontCategory[], ActiveOccasion[]];

  const categoryParam =
    typeof sp.category === "string" ? sp.category.toLowerCase() : null;
  const occasionParam =
    typeof sp.occasion === "string" ? sp.occasion.toLowerCase() : null;
  const typeParam = typeof sp.type === "string" ? sp.type.toLowerCase() : null;
  const sortParam = typeof sp.sort === "string" ? sp.sort : "popularity";
  const initialSort: SortOption = VALID_SORTS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "popularity";

  const categoryByName = new Map(
    categories.map((c) => [c.name.toLowerCase(), c]),
  );

  const activeCategory = categoryParam ? categoryByName.get(categoryParam) : null;
  const activeOccasion = occasions.find(
    (o) => o.name.toLowerCase().replace(/\s+/g, "-") === occasionParam,
  );

  let filteredProducts = products;
  if (activeCategory) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category.toLowerCase() === activeCategory.name.toLowerCase(),
    );
  }
  if (activeOccasion) {
    filteredProducts = filteredProducts.filter((p) =>
      p.occasions.some(
        (o) => o.toLowerCase() === activeOccasion.name.toLowerCase(),
      ),
    );
  }
  if (typeParam === "attar" || typeParam === "perfume") {
    filteredProducts = filteredProducts.filter((p) =>
      p.productType.toLowerCase() === typeParam,
    );
  }

  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const isNewArrivals = !activeCategory && !activeOccasion && initialSort === "newest";
  const sectionEyebrow = activeCategory
    ? "Curated"
    : activeOccasion
      ? "Perfect For"
      : typeParam
        ? typeParam === "attar"
          ? "Attar Collection"
          : "Perfume Collection"
        : isNewArrivals
          ? "Just Poured"
          : "The Collection";
  const sectionTitle = activeCategory
    ? activeCategory.name
    : activeOccasion
      ? activeOccasion.name
      : typeParam
        ? typeParam === "attar"
          ? "Attar"
          : "Perfumes"
        : isNewArrivals
          ? "New Arrivals"
          : "Signature Attars";

  return (
    <>
      <section className="scroll-mt-24 bg-[#f8fcfe] pb-6 pt-10 sm:pb-8 sm:pt-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/shop"
              className={`rounded-full border px-4 py-2 transition-colors ${
                !typeParam
                  ? "border-[#0f2838] bg-[#0f2838] text-white"
                  : "border-gold/30 bg-white/70 text-[#0f2838]/70 hover:border-gold"
              }`}
            >
              All
            </Link>
            <Link
              href="/shop?type=attar"
              className={`rounded-full border px-4 py-2 transition-colors ${
                typeParam === "attar"
                  ? "border-[#0f2838] bg-[#0f2838] text-white"
                  : "border-gold/30 bg-white/70 text-[#0f2838]/70 hover:border-gold"
              }`}
            >
              Attar
            </Link>
            <Link
              href="/shop?type=perfume"
              className={`rounded-full border px-4 py-2 transition-colors ${
                typeParam === "perfume"
                  ? "border-[#0f2838] bg-[#0f2838] text-white"
                  : "border-gold/30 bg-white/70 text-[#0f2838]/70 hover:border-gold"
              }`}
            >
              Perfumes
            </Link>
          </div>
        </div>
      </section>

      <LuxuryProductGrid
        key={categoryParam ?? "all"}
        products={filteredProducts}
        initialSort={initialSort}
        sectionEyebrow={sectionEyebrow}
        sectionTitle={sectionTitle}
      />
      <TrendingNow products={trending} />
    </>
  );
}