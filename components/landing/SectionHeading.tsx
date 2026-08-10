"use client";

import { m as motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "mb-14",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <p className="text-[11px] font-semibold tracking-[0.3em] text-gold uppercase">
        {eyebrow}
      </p>

      <h2
        className={cn(
          "mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl",
          dark ? "text-[#f0ebe2]" : "text-[#1c1712]",
        )}
      >
        {title}
      </h2>

      {description && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-xl text-sm leading-relaxed",
            align === "center" && "mx-auto text-center",
            dark ? "text-[#f0ebe2]/60" : "text-[#1c1712]/55",
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
