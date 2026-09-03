import { formatPrice } from "@/lib/utils";
import { DEFAULT_FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";

function buildItems(freeShippingThreshold: number) {
  return [
    "Hand-Poured Attars",
    "Small Batch Craft",
    "Long-Lasting Sillage",
    "Certified Authentic",
    `Free Shipping Over ${formatPrice(freeShippingThreshold)}`,
    "Est. 2025",
  ];
}

export default function Marquee({
  freeShippingThreshold = DEFAULT_FREE_SHIPPING_THRESHOLD,
}: {
  freeShippingThreshold?: number;
}) {
  const items = buildItems(freeShippingThreshold);
  const row = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-gold/20 bg-[#DCEFF7] py-4">
      {/* CSS animation (compositor-friendly) instead of a JS-driven
          framer-motion loop — this strip sits just below the fold, so a
          main-thread transform loop here used to add long tasks right in
          the load window. */}
      <div
        className="flex w-max animate-marquee gpu"
        style={{ animationDuration: "30s" }}
      >
        {row.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-6 pr-12 text-[11px] font-semibold tracking-[0.3em] text-[#174A63]/60 uppercase"
          >
            {item}
            <span className="text-gold">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}
