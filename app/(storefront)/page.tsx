import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import CategoryShowcase from "@/components/landing/CategoryShowcase";
import BestSellers from "@/components/landing/BestSellers";
import BrandStory from "@/components/landing/BrandStory";
import NewArrivals from "@/components/landing/NewArrivals";
import Testimonials from "@/components/landing/Testimonials";
import Newsletter from "@/components/landing/Newsletter";
import InstagramGallery from "@/components/landing/InstagramGallery";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <CategoryShowcase />
      <BestSellers />
      <BrandStory />
      <NewArrivals />
      <Testimonials />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
