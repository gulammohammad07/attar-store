import Link from "next/link";
import { products } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/landing/SectionHeading";

export default function NewArrivals() {
  const arrivals = products.filter(
    (p) => p.badge === "New Arrival" || p.id >= "p09",
  );

  return (
    <section className="bg-[#efe8dc] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Fresh From the Atelier"
          title="New Arrivals"
          description="The latest blends to leave our workshop — bottled and ready."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {arrivals.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/shop?sort=newest"
            className="inline-block rounded-full border border-[#1c1712] px-8 py-3.5 text-sm font-semibold text-[#1c1712] transition-all hover:bg-[#1c1712] hover:text-white"
          >
            View All Attars
          </Link>
        </div>
      </div>
    </section>
  );
}
