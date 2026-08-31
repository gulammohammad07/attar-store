"use client";

import { m as motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPublicStoreSettings } from "@/lib/actions/settings.actions";
import { DEFAULT_FREE_SHIPPING_THRESHOLD } from "@/lib/constants/shipping";
import { formatPrice } from "@/lib/utils";

function buildMessages(freeShippingThreshold: number) {
  return [
    `Complimentary shipping on orders above ${formatPrice(freeShippingThreshold)}`,
    "Hand-poured attars • Small batch craft",
    "Use code OUD10 for 10% off your first order",
    "Long-lasting sillage • Est. 2025",
  ];
}

export default function AnnouncementBar() {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(
    DEFAULT_FREE_SHIPPING_THRESHOLD,
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getPublicStoreSettings().then((settings) => {
      setFreeShippingThreshold(settings.freeShippingThreshold);
    });
  }, []);

  const messages = buildMessages(freeShippingThreshold);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="bg-charcoal text-[#E3F2F9]">
      <div className="relative h-9 overflow-hidden">
        <AnimatedMessage message={messages[index]} />
      </div>
    </div>
  );
}

function AnimatedMessage({ message }: { message: string }) {
  return (
    <motion.p
      key={message}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -16, opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex h-9 items-center justify-center text-[11px] font-medium tracking-[0.2em] uppercase"
    >
      {message}
    </motion.p>
  );
}
