"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { InstagramIcon } from "@/components/layout/SocialIcons";
import { instagramPosts } from "@/lib/data/products";
import SectionHeading from "@/components/landing/SectionHeading";

export default function InstagramGallery() {
  return (
    <section className="bg-[#F7F3EC] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="@mdperfumes"
          title="Follow the Ritual"
          description="Behind-the-scenes, atelier moments and fragrance inspiration."
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.label}
              href="#"
              aria-label={`Instagram: ${post.label}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="group relative block aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={post.image}
                alt={post.label}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-contain bg-[#efe8dc] p-4 transition-transform duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex flex-col items-center gap-1 text-white">
                  <InstagramIcon size={22} />
                  <span className="text-[10px] tracking-[0.2em] uppercase">
                    {post.label}
                  </span>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
