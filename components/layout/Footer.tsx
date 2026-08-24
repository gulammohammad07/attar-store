"use client";

import Link from "next/link";
import { ShieldCheck, Truck, BadgeCheck } from "lucide-react";
import {
  InstagramIcon,
  FacebookIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/layout/SocialIcons";
import { m as motion } from "framer-motion";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Attars", href: "/shop" },
      { label: "Men", href: "/shop?category=men" },
      { label: "Women", href: "/shop?category=women" },
      { label: "Unisex", href: "/shop?category=unisex" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/#story" },
      { label: "Craftsmanship", href: "/#craft" },
      { label: "Journal", href: "/#journal" },
      { label: "Sustainability", href: "/#story" },
      { label: "Careers", href: "/#story" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/account" },
      { label: "Shipping & Delivery", href: "/account" },
      { label: "Returns & Exchanges", href: "/account" },
      { label: "Track Order", href: "/account" },
      { label: "FAQs", href: "/account" },
    ],
  },
];

const trustBadges = [
  { icon: Truck, label: "Free Shipping", sub: "On orders over ₹1,500" },
  { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit encrypted" },
  { icon: BadgeCheck, label: "Authentic", sub: "100% genuine attars" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0f2838]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute -right-40 top-1/4 h-[500px] w-[500px] bg-[radial-gradient(circle,rgba(201,169,110,0.08),transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative border-b border-white/[0.06]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 sm:grid-cols-3">
          {trustBadges.map((badge) => (
            <div key={badge.label} className="flex items-center gap-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-white/10 text-gold">
                <badge.icon size={22} />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#f8fcfe]">
                  {badge.label}
                </p>
                <p className="text-xs text-[#dceff7]/40">
                  {badge.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-14 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <p className="font-display text-3xl font-semibold tracking-[0.2em] text-[#f8fcfe]">
              DANISH<span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent"> PERFUMES</span>
            </p>
            <p className="mt-6 max-w-sm text-[15px] leading-[1.8] text-[#dceff7]/50">
              A curated house of rare ouds, attars and oriental fragrances.
              Every blend is hand-poured in small batches and aged with
              patience — because true luxury cannot be rushed.
            </p>

            <div className="mt-9 flex gap-3">
              {[
                { icon: InstagramIcon, label: "Instagram" },
                { icon: FacebookIcon, label: "Facebook" },
                { icon: XIcon, label: "X (Twitter)" },
                { icon: YoutubeIcon, label: "YouTube" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  aria-label={social.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-[#dceff7]/60 transition-all duration-500 hover:border-gold hover:bg-gradient-to-r hover:from-gold hover:to-gold-light hover:text-[#0a1b26] hover:shadow-[0_0_25px_rgba(201,169,110,0.3)]"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>

          {columns.map((column) => (
            <motion.div
              key={column.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <h4 className="mb-6 text-[11px] font-semibold tracking-[0.24em] text-gold uppercase">
                {column.title}
              </h4>
              <ul className="space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      prefetch={link.href === "/account" ? false : undefined}
                      className="text-[13px] text-[#dceff7]/60 transition-colors duration-300 hover:text-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-[11px] text-[#dceff7]/30 sm:flex-row">
          <p>© {new Date().getFullYear()} Danish Perfumes. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="transition-colors duration-300 hover:text-gold">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors duration-300 hover:text-gold">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
