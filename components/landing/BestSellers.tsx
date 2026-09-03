"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/landing/SectionHeading";
import { useHoverCapable } from "@/lib/hooks/use-media-query";

const CARD_GAP = 24;

export default function BestSellers({ products }: { products: Product[] }) {
  const bestSellers = products.filter(
    (p) => p.badge === "Bestseller" || p.rating >= 4.8,
  );
  const items = bestSellers.length > 0 ? bestSellers : products.slice(0, 8);
  const hoverCapable = useHoverCapable();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stoppedRef = useRef(false);

  // Touch devices: gently glide the strip until the user touches it, then
  // stop for good and hand control over to native swipe scrolling.
  useEffect(() => {
    if (hoverCapable) return;
    const el = scrollerRef.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    stoppedRef.current = false;
    let direction: 1 | -1 = 1;
    let timer = 0;

    const stop = () => {
      stoppedRef.current = true;
      window.clearInterval(timer);
    };

    const advance = () => {
      if (stoppedRef.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const first = el.firstElementChild as HTMLElement | null;
      const slide = (first?.offsetWidth ?? 300) + CARD_GAP;
      const next = el.scrollLeft + direction * slide;
      if (next >= max) {
        direction = -1;
        el.scrollTo({ left: max, behavior: "smooth" });
      } else if (next <= 0) {
        direction = 1;
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: direction * slide, behavior: "smooth" });
      }
    };

    timer = window.setInterval(advance, 2600);
    el.addEventListener("pointerdown", stop, { once: true });
    return () => {
      window.clearInterval(timer);
      el.removeEventListener("pointerdown", stop);
    };
  }, [hoverCapable, items.length]);

  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <section className="relative overflow-hidden bg-[#f8fcfe] py-24 sm:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(201,169,110,0.1),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Most Loved"
          title="Best Sellers"
          description="The fragrances our clients return for, again and again."
        />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#f8fcfe] to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#f8fcfe] to-transparent sm:w-32" />

        {hoverCapable ? (
          // Desktop: seamless auto-marquee that pauses while hovered
          <div className="group overflow-hidden px-6 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] sm:px-0">
            <div
              className="flex w-max gap-6 px-6 animate-marquee gpu group-hover:[animation-play-state:paused]"
              style={{ animationDuration: "10s" }}
            >
              {doubled.map((product, i) => (
                <div
                  key={`${product.id}-${i}`}
                  className="w-[300px] shrink-0 sm:w-[320px]"
                >
                  <ProductCard product={product} loading="eager" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Touch: swipeable snap strip; auto-glides until first touch
          <div
            ref={scrollerRef}
            role="region"
            aria-label="Best sellers"
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-0"
          >
            {items.map((product) => (
              <div
                key={product.id}
                className="w-[300px] shrink-0 snap-start sm:w-[320px]"
              >
                <ProductCard product={product} loading="eager" />
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-10 text-center text-[11px] tracking-[0.3em] text-[#5f7788]/25 uppercase">
        {hoverCapable ? "Hover to pause" : "Swipe to explore"}
      </p>
    </section>
  );
}
