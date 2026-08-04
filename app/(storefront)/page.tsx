import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import CategoryShowcase from "@/components/landing/CategoryShowcase";
import BestSellers from "@/components/landing/BestSellers";
import BrandStory from "@/components/landing/BrandStory";
import NewArrivals from "@/components/landing/NewArrivals";
import Testimonials from "@/components/landing/Testimonials";
import Newsletter from "@/components/landing/Newsletter";
import {
  getStorefrontBanners,
  getStorefrontCategories,
  getStorefrontProducts,
} from "@/lib/services/storefront-data";

export const dynamic = "force-dynamic";

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
      <CategoryShowcase categories={categories} />
      <BestSellers products={products} />
      <BrandStory banner={storyBanner} />
      <NewArrivals products={products} />
      <Testimonials />
      <Newsletter />
    </>
  );
}
