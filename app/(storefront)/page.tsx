import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import HomeSections from "@/components/landing/HomeSections";
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
