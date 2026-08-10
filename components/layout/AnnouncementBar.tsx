"use client";

import { m as motion } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Complimentary shipping on orders above ₹1,500",
  "Hand-poured attars • Small batch craft",
  "Use code OUD10 for 10% off your first order",
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-charcoal text-[#efe8dc]">
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
