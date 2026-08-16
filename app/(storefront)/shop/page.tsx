import type { Metadata } from "next";
import {
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import { getActiveOccasions } from "@/lib/actions/occasion.actions";

import LuxuryProductGrid, {
  type SortOption,
} from "@/components/plp/LuxuryProductGrid";
import TrendingNow from "@/components/plp/TrendingNow";

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
  ]);

  const categoryParam =
    typeof sp.category === "string" ? sp.category.toLowerCase() : null;
  const occasionParam =
    typeof sp.occasion === "string" ? sp.occasion.toLowerCase() : null;
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

  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);

  const isNewArrivals = !activeCategory && !activeOccasion && initialSort === "newest";
  const sectionEyebrow = activeCategory
    ? "Curated"
    : activeOccasion
      ? "Perfect For"
      : isNewArrivals
        ? "Just Poured"
        : "The Collection";
  const sectionTitle = activeCategory
    ? activeCategory.name
    : activeOccasion
      ? activeOccasion.name
      : isNewArrivals
        ? "New Arrivals"
        : "Signature Attars";

  return (
    <>
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