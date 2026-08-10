"use client";

import Link from "next/link";
import Image from "next/image";
import { m as motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type CategoryNavItem = {
  id: string;
  label: string;
  href: string;
  image: string;
};

export default function CategoryNav({
  items,
  activeSlug,
}: {
  items: CategoryNavItem[];
  activeSlug?: string | null;
}) {
  if (items.length === 0) return null;

  return (
    <section className="relative bg-[#E3F2F9] py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold tracking-[0.34em] text-gold uppercase"
        >
          Curated for the Connoisseur
        </motion.p>

        <div className="mt-9 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="mx-auto flex w-max items-start justify-center gap-7 sm:gap-9">
            {items.map((item, i) => {
              const active = item.id === activeSlug;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group flex flex-col items-center"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "relative block h-24 w-24 overflow-hidden rounded-full border shadow-[0_10px_30px_-12px_rgba(23,74,99,0.25)] transition-all duration-500 sm:h-28 sm:w-28",
                      "group-hover:-translate-y-2 group-hover:border-gold group-hover:shadow-[0_22px_45px_-16px_rgba(201,169,110,0.55)]",
                      active
                        ? "border-gold ring-2 ring-gold/40"
                        : "border-white/70",
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F4FAFD] to-[#D9EAF3]" />
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      sizes="112px"
                      className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {active && (
                      <div className="absolute inset-0 rounded-full border border-gold/50" />
                    )}
                  </Link>

                  <span
                    className={cn(
                      "mt-4 text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors duration-300",
                      active
                        ? "text-gold"
                        : "text-[#174A63]/55 group-hover:text-[#174A63]",
                    )}
                  >
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
