"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import SectionHeading from "@/components/landing/SectionHeading";

export default function CategoryShowcase({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  return (
    <section className="bg-[#F7F3EC] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Collection"
          title="Shop by Category"
          description="Our olfactory families, each a world of its own. Find the note that speaks to you."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6 lg:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={`/shop?category=${category.slug}`}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-[#efe8dc]">
                  {category.imageUrl ? (
                    <Image
                      src={category.imageUrl}
                      alt={category.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 16vw"
                      className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-display text-5xl font-medium text-[#1c1712]/20 transition-colors duration-500 group-hover:text-gold/40">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 text-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-[10px] font-medium tracking-[0.2em] text-white uppercase">
                      Explore
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <h3 className="font-display text-xl font-medium text-[#1c1712] transition-colors group-hover:text-gold">
                    {category.name}
                  </h3>
                  {category.tagline && (
                    <p className="mt-0.5 text-[11px] tracking-wide text-[#1c1712]/40">
                      {category.tagline}
                    </p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
