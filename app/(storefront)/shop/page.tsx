import type { Metadata } from "next";
import {
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";
import type { Product } from "@/lib/data/products";
import PlpHero from "@/components/plp/PlpHero";
import CategoryNav, {
  type CategoryNavItem,
} from "@/components/plp/CategoryNav";
import LuxuryProductGrid, {
  type SortOption,
} from "@/components/plp/LuxuryProductGrid";
import PromoBanner from "@/components/plp/PromoBanner";
import TrendingNow from "@/components/plp/TrendingNow";
import CommunityGallery from "@/components/plp/CommunityGallery";
import NewsletterLuxury from "@/components/plp/NewsletterLuxury";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop — Luxury Attar Collection",
  description:
    "Discover hand-poured luxury attars, ouds and perfumes. Pure, luxury, timeless.",
};

const VALID_SORTS: SortOption[] = ["popularity", "price-asc", "price-desc", "newest"];

function firstProductImage(products: Product[]): string {
  return products[0]?.image ?? "";
}

function productForCategory(products: Product[], categoryName: string): Product | undefined {
  return products.find(
    (p) => p.category.toLowerCase() === categoryName.toLowerCase(),
  );
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
  ]);

  const categoryParam =
    typeof sp.category === "string" ? sp.category.toLowerCase() : null;
  const sortParam = typeof sp.sort === "string" ? sp.sort : "popularity";
  const initialSort: SortOption = VALID_SORTS.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "popularity";

  // ---- Category navigation -------------------------------------------------
  const categoryByName = new Map(
    categories.map((c) => [c.name.toLowerCase(), c]),
  );
  const orderedCategories = categories;

  const navItems: CategoryNavItem[] = [
    {
      id: "all",
      label: "All Attars",
      href: "/shop",
      image: firstProductImage(products),
    },
    ...orderedCategories.map((category) => {
      const rep = productForCategory(products, category.name);
      return {
        id: category.slug,
        label:
          category.name.toLowerCase() === "arabic attar"
            ? "Arabic Collection"
            : category.name,
        href: `/shop?category=${category.slug}`,
        image: rep?.image ?? firstProductImage(products),
      };
    }),
    {
      id: "luxury",
      label: "Luxury Collection",
      href: "/shop",
      image: products.find((p) => p.featured)?.image ?? firstProductImage(products),
    },
    {
      id: "new",
      label: "New Arrivals",
      href: "/shop?sort=newest",
      image:
        products.find((p) => p.badge === "New Arrival")?.image ??
        firstProductImage(products),
    },
  ].filter((item) => item.image);

  // ---- Category filtering ----------------------------------------------------
  const activeCategory = categoryParam ? categoryByName.get(categoryParam) : null;
  const filteredProducts = activeCategory
    ? products.filter(
        (p) =>
          p.category.toLowerCase() === activeCategory.name.toLowerCase(),
      )
    : products;

  const trending = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  const promo = [...products]
    .sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false))
    .slice(0, 2);

  const isNewArrivals = !activeCategory && initialSort === "newest";
  const sectionEyebrow = activeCategory ? "Curated" : isNewArrivals ? "Just Poured" : "The Collection";
  const sectionTitle = activeCategory
    ? activeCategory.name === "Arabic Attar"
      ? "Arabic Collection"
      : activeCategory.name
    : isNewArrivals
      ? "New Arrivals"
      : "Signature Attars";

  return (
    <>
      <PlpHero />
      <CategoryNav items={navItems} activeSlug={activeCategory?.slug ?? null} />
      <LuxuryProductGrid
        key={categoryParam ?? "all"}
        products={filteredProducts}
        initialSort={initialSort}
        sectionEyebrow={sectionEyebrow}
        sectionTitle={sectionTitle}
      />
      <PromoBanner products={promo} />
      <TrendingNow products={trending} />
      <CommunityGallery products={products} />
      <NewsletterLuxury />
    </>
  );
}
