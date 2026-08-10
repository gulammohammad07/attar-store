"use client";

import dynamic from "next/dynamic";
import type { Product } from "@/lib/data/products";
import type {
  StorefrontBanner,
  StorefrontCategory,
} from "@/lib/services/storefront-data";
import LazyMount from "@/components/landing/LazyMount";
import SectionSkeleton from "@/components/landing/SectionSkeleton";

const CategoryShowcase = dynamic(
  () => import("@/components/landing/CategoryShowcase"),
  { ssr: false },
);

const BestSellers = dynamic(
  () => import("@/components/landing/BestSellers"),
  { ssr: false },
);

const LuxuryCollections = dynamic(
  () => import("@/components/landing/LuxuryCollections"),
  { ssr: false },
);

const WhyChoose = dynamic(() => import("@/components/landing/WhyChoose"), {
  ssr: false,
});

const Testimonials = dynamic(
  () => import("@/components/landing/Testimonials"),
  { ssr: false },
);

const BrandStory = dynamic(() => import("@/components/landing/BrandStory"), {
  ssr: false,
});

const Newsletter = dynamic(() => import("@/components/landing/Newsletter"), {
  ssr: false,
});

type HomeSectionsProps = {
  products: Product[];
  categories: StorefrontCategory[];
  storyBanner?: StorefrontBanner;
};

export default function HomeSections({
  products,
  categories,
  storyBanner,
}: HomeSectionsProps) {
  return (
    <>
      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="The Collection"
            title="Shop by Category"
            description="Our olfactory families, each a world of its own. Find the note that speaks to you."
            className="bg-[#F8FCFE]"
            style={{ minHeight: 680 }}
          />
        }
      >
        <CategoryShowcase categories={categories} />
      </LazyMount>

      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Most Loved"
            title="Best Sellers"
            description="The fragrances our clients return for, again and again."
            className="bg-[#F8FCFE]"
            style={{ minHeight: 820 }}
          />
        }
      >
        <BestSellers products={products} />
      </LazyMount>

      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Curated Worlds"
            title="Luxury Collections"
            className="bg-[#E3F2F9]"
            style={{ minHeight: "100vh" }}
          />
        }
      >
        <LuxuryCollections categories={categories} />
      </LazyMount>

      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="The MD Difference"
            title="Why Choose Danish Perfumes"
            description="More than fragrance — a promise of purity, patience and obsession with detail."
            className="bg-[#F8FCFE]"
            style={{ minHeight: 1100 }}
          />
        }
      >
        <WhyChoose />
      </LazyMount>

      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Word of Mouth"
            title="Loved by Connoisseurs"
            description="Real reviews from clients who made Danish Perfumes their signature."
            className="bg-[#DCEFF7]"
            style={{ minHeight: 660 }}
          />
        }
      >
        <Testimonials />
      </LazyMount>

      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Our Story"
            title="Perfume, the way it was meant to be"
            className="bg-[#F8FCFE]"
            style={{ minHeight: 1240 }}
          />
        }
      >
        <BrandStory banner={storyBanner} />
      </LazyMount>

      <LazyMount
        fallback={
          <SectionSkeleton
            eyebrow="Inner Circle"
            title="Join the Inner Circle"
            description="Early access to limited drops, private sales and fragrance notes from the atelier."
            className="bg-[#E3F2F9]"
            style={{ minHeight: 640 }}
          />
        }
      >
        <Newsletter />
      </LazyMount>
    </>
  );
}
