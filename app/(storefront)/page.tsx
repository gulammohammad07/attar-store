import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import dynamic from "next/dynamic";

const HomeSections = dynamic(() => import("@/components/landing/HomeSections"), {
  loading: () => (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="h-8 w-48 animate-pulse rounded bg-[#174A63]/10" />
      <div className="mt-6 h-4 w-72 animate-pulse rounded bg-[#174A63]/10" />
    </div>
  ),
});

import {
  getStorefrontBanners,
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";

export const revalidate = 60;

export default async function Home() {
  const [products, categories, banners] = await Promise.all([
    getStorefrontProducts(),
    getStorefrontCategories(),
    getStorefrontBanners(),
  ]);

  const heroBanner = banners.find((b) => b.section === "hero");
  const storyBanner = banners.find((b) => b.section === "story");

  return (
    <>
      <Hero banner={heroBanner} />
      <Marquee />
      <HomeSections
        products={products}
        categories={categories}
        storyBanner={storyBanner}
      />
    </>
  );
}
