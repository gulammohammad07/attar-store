"use client";

import { m as motion } from "framer-motion";

const items = [
  "Hand-Poured Attars",
  "Small Batch Craft",
  "Rare Oud",
  "Certified Authentic",
  "Free Shipping Over ₹1,500",
  "Est. 2018",
];

export default function Marquee() {
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
