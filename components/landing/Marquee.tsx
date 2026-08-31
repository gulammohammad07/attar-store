"use client";

import { m as motion } from "framer-motion";
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
      <motion.div
        className="flex w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
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
      </motion.div>
    </div>
  );
}
