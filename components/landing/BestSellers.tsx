import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/landing/SectionHeading";

export default function BestSellers({ products }: { products: Product[] }) {
  const bestSellers = products.filter(
    (p) => p.badge === "Bestseller" || p.rating >= 4.8,
  );
  const items = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <section className="relative overflow-hidden bg-[#F7F3EC] py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Most Loved"
          title="Best Sellers"
          description="The fragrances our clients return for, again and again."
        />
      </div>

      <div className="relative">
        <div className="group pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F7F3EC] to-transparent sm:w-32" />
        <div className="group pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F7F3EC] to-transparent sm:w-32" />

        <div className="overflow-hidden px-6 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] sm:px-0">
          <div
            className="group flex w-max gap-6 px-6 animate-marquee gpu group-hover:[animation-play-state:paused]"
            style={{ animationDuration: "80s" }}
          >
            {doubled.map((product, i) => (
              <div
                key={`${product.id}-${i}`}
                className="w-[300px] shrink-0 sm:w-[320px]"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-10 text-center text-[11px] tracking-[0.3em] text-[#1c1712]/35 uppercase">
        Hover to pause · Drag nothing — simply gaze
      </p>
    </section>
  );
}
