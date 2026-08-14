"use client";

import Link from "next/link";
import Image from "next/image";
import { memo, useRef } from "react";
import {
  m as motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { StorefrontCategory } from "@/lib/services/storefront-data";
import SectionHeading from "@/components/landing/SectionHeading";

export default function CategoryShowcase({
  categories,
}: {
  categories: StorefrontCategory[];
}) {
  return (
    <section className="relative overflow-hidden bg-[#F8FCFE] py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(201,169,110,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Collection"
          title="Shop by Category"
          description="Our olfactory families, each a world of its own. Find the note that speaks to you."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <TiltCard
              key={category.slug}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const TiltCard = memo(function TiltCard({
  category,
  index,
}: {
  category: StorefrontCategory;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(my, { stiffness: 120, damping: 14 });
  const rotateY = useSpring(mx, { stiffness: 120, damping: 14 });
  const glareX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(my, [0.5, -0.5], ["0%", "100%"]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(224,199,149,0.28), transparent 55%)`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 18);
    my.set(-y * 18);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12 }}
    >
      <Link href={`/shop?category=${category.slug}`} className="group block">
        <motion.div
          ref={ref}
          onMouseMove={handleMove}
          onMouseLeave={reset}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
          className="relative overflow-hidden rounded-[2rem] border border-gold/20 bg-white/70 shadow-[0_20px_50px_-20px_rgba(23,74,99,0.35)] transition-all duration-500 group-hover:border-gold/60 group-hover:shadow-[0_30px_70px_-25px_rgba(201,169,110,0.35)]"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#F4FAFD] via-[#E3F2F9] to-[#D9EAF3]">
            {category.imageUrl ? (
              <Image
                src={category.imageUrl}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-contain p-10 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-1"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-8xl font-medium text-gold/25 transition-colors duration-500 group-hover:text-gold/50">
                  {category.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#F8FCFE]/95 via-[#F8FCFE]/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

            <motion.div
              style={{ background: glare }}
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />

            <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-white/80 text-gold opacity-0 shadow-lg backdrop-blur transition-all duration-500 group-hover:opacity-100">
              <ArrowUpRight size={18} />
            </div>

            <div
              className="absolute inset-x-0 bottom-0 p-6"
              style={{ transform: "translateZ(30px)" }}
            >
              <h3 className="font-display text-2xl font-medium text-[#174A63]">
                {category.name}
              </h3>
              {category.tagline && (
                <p className="mt-1 text-xs tracking-wide text-[#174A63]/60">
                  {category.tagline}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
});
